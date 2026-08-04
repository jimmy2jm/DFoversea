import { access, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const LIMITS = Object.freeze({
  content: 2000,
  embeds: 10,
  embedText: 6000,
  title: 256,
  description: 4096,
  fields: 25,
  fieldName: 256,
  fieldValue: 1024,
  footer: 2048,
  author: 256,
  threadName: 100,
  tags: 5,
  files: 10,
  defaultFileBytes: 10 * 1024 * 1024,
});

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (['dry-run', 'confirm-send', 'help'].includes(key)) {
      args[key] = true;
      continue;
    }
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for --${key}`);
    args[key] = value;
    i += 1;
  }
  return args;
}

export async function readJson(filePath, label = 'JSON') {
  if (!filePath) throw new Error(`Missing ${label} path`);
  let text;
  try {
    text = await readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Cannot read ${label} at ${filePath}: ${error.message}`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid ${label} at ${filePath}: ${error.message}`);
  }
}

export async function loadInputs(args) {
  const inputPath = path.resolve(args.input || '');
  const configArg = args.config || process.env.DISCORD_PUBLISHER_CONFIG || path.join(SKILL_ROOT, '.private', 'discord-publisher.config.json');
  const configPath = path.resolve(configArg);
  const [post, config] = await Promise.all([
    readJson(inputPath, 'post specification'),
    readJson(configPath, 'publisher configuration'),
  ]);
  return { post, config, inputPath, configPath };
}

function addIssue(list, code, message, location = '') {
  list.push({ code, message, ...(location ? { location } : {}) });
}

function stringLength(value) {
  return typeof value === 'string' ? value.length : 0;
}

function checkString(errors, warnings, value, max, location, required = false) {
  if (required && (typeof value !== 'string' || value.length === 0)) {
    addIssue(errors, 'required', 'Value must be a non-empty string.', location);
    return 0;
  }
  if (value == null) return 0;
  if (typeof value !== 'string') {
    addIssue(errors, 'type', 'Value must be a string.', location);
    return 0;
  }
  if (value.length > max) addIssue(errors, 'limit', `Length ${value.length} exceeds ${max}.`, location);
  else if (value.length > max * 0.9) addIssue(warnings, 'near-limit', `Length ${value.length} is near the ${max} limit.`, location);
  return value.length;
}

export function extractThreadId(value) {
  if (!value) return '';
  const raw = String(value).trim();
  const match = /discord(?:app)?\.com\/channels\/\d+\/(\d+)/i.exec(raw);
  return match ? match[1] : raw;
}

export function resolveChannel(post, config) {
  const alias = post.channel;
  if (typeof alias !== 'string' || !alias.trim()) throw new Error('post.channel must be a non-empty channel alias');
  const channels = config && config.channels;
  if (!channels || typeof channels !== 'object' || Array.isArray(channels)) {
    throw new Error('configuration.channels must be an object');
  }
  const channel = channels[alias];
  if (!channel || typeof channel !== 'object') throw new Error(`Unknown channel alias: ${alias}`);
  if (!channel.webhookEnv || typeof channel.webhookEnv !== 'string') {
    throw new Error(`Channel ${alias} must define webhookEnv`);
  }
  return { alias, channel };
}

export function resolveTags(post, channel, errors) {
  const requested = post.thread?.tags || channel.defaultTags || [];
  if (!Array.isArray(requested)) {
    addIssue(errors, 'type', 'Tags must be an array of aliases or Discord tag IDs.', 'thread.tags');
    return [];
  }
  const tagMap = channel.tagMap || {};
  const resolved = [];
  for (const tag of requested) {
    const raw = String(tag).trim();
    const id = /^\d{15,22}$/.test(raw) ? raw : tagMap[raw];
    if (!id || !/^\d{15,22}$/.test(String(id))) {
      addIssue(errors, 'unknown-tag', `Unknown tag alias or invalid tag ID: ${raw}`, 'thread.tags');
      continue;
    }
    if (!resolved.includes(String(id))) resolved.push(String(id));
  }
  return resolved;
}

function validateTagPolicy(post, channel, resolvedTags, threadName, threadId, errors) {
  const policy = channel.tagPolicy;
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) return;
  const requested = Array.isArray(post.thread?.tags) ? post.thread.tags : channel.defaultTags || [];
  const tagMap = channel.tagMap || {};
  const aliasesById = new Map(Object.entries(tagMap).map(([alias, id]) => [String(id), alias]));
  const aliases = requested.map((tag) => {
    const raw = String(tag).trim();
    return /^\d{15,22}$/.test(raw) ? aliasesById.get(raw) || raw : raw;
  });
  const exactCount = Number(policy.exactCount || 0);
  if (!threadName || threadId) {
    addIssue(errors, 'tagged-forum-post-required', 'Weapon publications must create a new forum post so required tags can be applied.', 'thread');
  }
  if (exactCount > 0 && resolvedTags.length !== exactCount) {
    addIssue(errors, 'tag-count', `Exactly ${exactCount} Discord forum tags are required.`, 'thread.tags');
  }
  const groups = policy.groups;
  if (!groups || typeof groups !== 'object' || Array.isArray(groups)) {
    addIssue(errors, 'tag-policy', 'Configured tagPolicy.groups must be an object.', 'thread.tags');
    return;
  }
  for (const [groupName, allowed] of Object.entries(groups)) {
    if (!Array.isArray(allowed) || !allowed.length) {
      addIssue(errors, 'tag-policy', `Configured tag group ${groupName} must list aliases.`, 'thread.tags');
      continue;
    }
    const matches = aliases.filter((alias) => allowed.includes(alias));
    if (matches.length !== 1) {
      addIssue(errors, 'tag-group', `Exactly one ${groupName} Discord tag is required.`, 'thread.tags');
    }
  }
}

export async function validatePost(post, config, inputPath) {
  const errors = [];
  const warnings = [];
  let alias = '';
  let channel = {};

  if (!post || typeof post !== 'object' || Array.isArray(post)) {
    addIssue(errors, 'type', 'Post specification must be a JSON object.', '$');
    return { valid: false, errors, warnings, normalized: null, summary: null };
  }

  const record = post.record;
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    addIssue(errors, 'record-required', 'record must be an object so every publishable post can be logged.', 'record');
  } else {
    const sourceType = typeof record.sourceType === 'string' ? record.sourceType.trim() : '';
    if (!['hq-banner', 'hq', 'user-provided'].includes(sourceType)) {
      addIssue(errors, 'record-source', 'record.sourceType must be hq-banner, hq, or user-provided.', 'record.sourceType');
    }
    checkString(errors, warnings, record.buildCode, 512, 'record.buildCode', true);
    checkString(errors, warnings, record.weaponName, 256, 'record.weaponName', true);
    checkString(errors, warnings, record.buildName, 256, 'record.buildName', true);
    if (sourceType === 'hq-banner') {
      if (typeof record.schemeId !== 'string' || !/^[a-f0-9]{32}$/i.test(record.schemeId.trim())) {
        addIssue(errors, 'record-scheme', 'HQ Banner posts require a 32-character record.schemeId.', 'record.schemeId');
      }
    }
  }

  try {
    ({ alias, channel } = resolveChannel(post, config));
  } catch (error) {
    addIssue(errors, 'channel', error.message, 'channel');
  }
  if (channel.guildId && !/^\d{15,22}$/.test(String(channel.guildId))) {
    addIssue(errors, 'format', 'Configured guildId must be a Discord snowflake.', `channels.${alias}.guildId`);
  }

  const message = post.message;
  if (!message || typeof message !== 'object' || Array.isArray(message)) {
    addIssue(errors, 'type', 'message must be an object.', 'message');
  }

  let embedText = 0;
  if (message && typeof message === 'object') {
    checkString(errors, warnings, message.content, LIMITS.content, 'message.content');
    const embeds = message.embeds || [];
    if (!Array.isArray(embeds)) addIssue(errors, 'type', 'embeds must be an array.', 'message.embeds');
    else {
      if (embeds.length > LIMITS.embeds) addIssue(errors, 'limit', `Embed count ${embeds.length} exceeds ${LIMITS.embeds}.`, 'message.embeds');
      embeds.forEach((embed, i) => {
        const base = `message.embeds[${i}]`;
        if (!embed || typeof embed !== 'object' || Array.isArray(embed)) {
          addIssue(errors, 'type', 'Embed must be an object.', base);
          return;
        }
        embedText += checkString(errors, warnings, embed.title, LIMITS.title, `${base}.title`);
        embedText += checkString(errors, warnings, embed.description, LIMITS.description, `${base}.description`);
        if (embed.footer) embedText += checkString(errors, warnings, embed.footer.text, LIMITS.footer, `${base}.footer.text`);
        if (embed.author) embedText += checkString(errors, warnings, embed.author.name, LIMITS.author, `${base}.author.name`);
        const fields = embed.fields || [];
        if (!Array.isArray(fields)) addIssue(errors, 'type', 'fields must be an array.', `${base}.fields`);
        else {
          if (fields.length > LIMITS.fields) addIssue(errors, 'limit', `Field count ${fields.length} exceeds ${LIMITS.fields}.`, `${base}.fields`);
          fields.forEach((field, j) => {
            embedText += checkString(errors, warnings, field?.name, LIMITS.fieldName, `${base}.fields[${j}].name`, true);
            embedText += checkString(errors, warnings, field?.value, LIMITS.fieldValue, `${base}.fields[${j}].value`, true);
          });
        }
      });
    }
  }
  if (embedText > LIMITS.embedText) addIssue(errors, 'limit', `Combined embed text ${embedText} exceeds ${LIMITS.embedText}.`, 'message.embeds');

  const thread = post.thread || {};
  if (post.thread != null && (typeof thread !== 'object' || Array.isArray(thread))) {
    addIssue(errors, 'type', 'thread must be an object.', 'thread');
  }
  const threadName = typeof thread.name === 'string' ? thread.name.trim() : '';
  const threadId = extractThreadId(thread.id || channel.defaultThreadId || '');
  if (threadName) checkString(errors, warnings, threadName, LIMITS.threadName, 'thread.name');
  if (threadId && !/^\d{15,22}$/.test(threadId)) addIssue(errors, 'format', 'Thread ID must be a Discord snowflake or message/thread URL.', 'thread.id');
  if (threadName && threadId) addIssue(errors, 'conflict', 'thread.name and thread.id are mutually exclusive.', 'thread');

  const resolvedTags = resolveTags(post, channel, errors);
  validateTagPolicy(post, channel, resolvedTags, threadName, threadId, errors);
  if (resolvedTags.length > LIMITS.tags) addIssue(errors, 'limit', `Tag count ${resolvedTags.length} exceeds ${LIMITS.tags}.`, 'thread.tags');
  if (threadId && resolvedTags.length) addIssue(warnings, 'ignored-tags', 'Discord ignores applied tags when replying to an existing thread.', 'thread.tags');
  if (!threadName && !threadId && resolvedTags.length) addIssue(errors, 'tags-without-thread', 'Tags require a new forum thread name.', 'thread.tags');

  const files = post.files || [];
  if (!Array.isArray(files)) addIssue(errors, 'type', 'files must be an array.', 'files');
  const normalizedFiles = [];
  if (Array.isArray(files)) {
    if (files.length > LIMITS.files) addIssue(errors, 'limit', `File count ${files.length} exceeds ${LIMITS.files}.`, 'files');
    const names = new Set();
    const maxBytes = Number(config?.maxFileBytes) > 0 ? Number(config.maxFileBytes) : LIMITS.defaultFileBytes;
    for (let i = 0; i < files.length; i += 1) {
      const item = files[i];
      const location = `files[${i}]`;
      if (!item || typeof item !== 'object' || !item.path) {
        addIssue(errors, 'required', 'Each file requires a path.', location);
        continue;
      }
      const filePath = path.resolve(path.dirname(inputPath), String(item.path));
      const name = String(item.name || path.basename(filePath));
      if (names.has(name)) addIssue(errors, 'duplicate-file', `Duplicate attachment name: ${name}`, `${location}.name`);
      names.add(name);
      try {
        await access(filePath);
        const info = await stat(filePath);
        if (!info.isFile()) addIssue(errors, 'file', 'Attachment path is not a file.', `${location}.path`);
        if (info.size > maxBytes) addIssue(errors, 'file-size', `Attachment ${name} is ${info.size} bytes; configured limit is ${maxBytes}.`, `${location}.path`);
        normalizedFiles.push({ path: filePath, name, size: info.size });
      } catch (error) {
        addIssue(errors, 'file', `Cannot access attachment: ${error.message}`, `${location}.path`);
      }
    }
  }

  const serializedMessage = message && typeof message === 'object' ? JSON.stringify(message) : '';
  for (const match of serializedMessage.matchAll(/attachment:\/\/([^"\\]+)/g)) {
    if (!normalizedFiles.some((file) => file.name === match[1])) {
      addIssue(errors, 'missing-attachment', `Message references an attachment that is not listed: ${match[1]}`, 'message');
    }
  }

  const hasContent = Boolean(message?.content || message?.embeds?.length || normalizedFiles.length);
  if (!hasContent) addIssue(errors, 'empty', 'A message needs content, at least one embed, or an attachment.', 'message');

  const allowMentions = post.options?.allowMentions === true;
  if (!allowMentions && message?.allowed_mentions && JSON.stringify(message.allowed_mentions) !== JSON.stringify({ parse: [] })) {
    addIssue(warnings, 'mentions-disabled', 'allowed_mentions will be replaced with an empty parse list unless options.allowMentions is true.', 'message.allowed_mentions');
  }
  if (allowMentions) addIssue(warnings, 'mentions-enabled', 'Real Discord mentions are enabled for this post.', 'options.allowMentions');

  const normalizedMessage = message && typeof message === 'object' ? structuredClone(message) : {};
  if (!allowMentions) normalizedMessage.allowed_mentions = { parse: [] };
  if (post.options?.silent === true) normalizedMessage.flags = (Number(normalizedMessage.flags) || 0) | 4096;

  const normalized = {
    channel: alias,
    record: record && typeof record === 'object' && !Array.isArray(record) ? {
      sourceType: typeof record.sourceType === 'string' ? record.sourceType.trim() : '',
      schemeId: typeof record.schemeId === 'string' ? record.schemeId.trim() : '',
      buildCode: typeof record.buildCode === 'string' ? record.buildCode.trim() : '',
      weaponName: typeof record.weaponName === 'string' ? record.weaponName.trim() : '',
      buildName: typeof record.buildName === 'string' ? record.buildName.trim() : '',
    } : null,
    thread: { name: threadName, id: threadId, tags: resolvedTags },
    message: normalizedMessage,
    files: normalizedFiles,
    options: { silent: post.options?.silent === true, allowMentions },
  };
  const summary = {
    channel: alias,
    webhookEnv: channel.webhookEnv || null,
    guildId: channel.guildId || null,
    mode: threadName ? 'create-forum-post' : threadId ? 'reply-to-thread' : 'send-message',
    threadName: threadName || null,
    threadId: threadId || null,
    tags: resolvedTags,
    embeds: Array.isArray(message?.embeds) ? message.embeds.length : 0,
    attachments: normalizedFiles.map(({ name, size }) => ({ name, size })),
    silent: post.options?.silent === true,
    mentionsEnabled: allowMentions,
    record: record && typeof record === 'object' && !Array.isArray(record) ? {
      sourceType: record.sourceType || null,
      schemeId: record.schemeId || null,
      buildCode: record.buildCode || null,
      weaponName: record.weaponName || null,
      buildName: record.buildName || null,
    } : null,
  };
  return { valid: errors.length === 0, errors, warnings, normalized, summary };
}

export function validateWebhookUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('Webhook environment variable does not contain a valid URL');
  }
  const allowedHosts = new Set(['discord.com', 'discordapp.com', 'canary.discord.com', 'ptb.discord.com']);
  if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname)) {
    throw new Error('Webhook URL must use HTTPS on an official Discord host');
  }
  if (!/^\/api(?:\/v\d+)?\/webhooks\/\d+\/[^/]+\/?$/.test(url.pathname)) {
    throw new Error('Webhook URL path is not a Discord incoming webhook');
  }
  url.search = '';
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}

export function publicValidationResult(result) {
  return {
    valid: result.valid,
    errors: result.errors,
    warnings: result.warnings,
    summary: result.summary,
  };
}

export async function writeReceipt(receiptPath, receipt) {
  if (!receiptPath) return;
  await writeFile(path.resolve(receiptPath), `${JSON.stringify(receipt, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
}

export function helpText(command) {
  if (command === 'validate') {
    return 'Usage: node scripts/validate.mjs --input <post.json> --config <config.json>';
  }
  return [
    'Usage: node scripts/publish.mjs --input <post.json> --config <config.json> [--confirm-send] [--receipt <receipt.json>]',
    'Without --confirm-send the command performs a dry run and makes no network request.',
  ].join('\n');
}
