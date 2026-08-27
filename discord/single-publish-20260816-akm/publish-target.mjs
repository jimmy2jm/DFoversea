#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  helpText,
  loadInputs,
  parseArgs,
  publicValidationResult,
  resolveChannel,
  validatePost,
  validateWebhookUrl,
  writeReceipt,
} from './lib.mjs';
import {
  assertBannerRecordCurrent,
  readBannerDatabase,
  recordOperation,
  recordPublication,
  refreshBannerRecords,
  resolveRecordsDir,
} from './records-lib.mjs';
import { assertBannerPostTags } from './tag-rules.mjs';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
  process.loadEnvFile(path.join(skillRoot, '.private', 'webhook.env'));
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
  process.loadEnvFile('/Users/jimmmywang/.codex/skills/discord-publisher/.private/webhook.env');
}

const MAX_ATTEMPTS = 4;
const failureContext = {
  recordsDir: null,
  operation: 'publish',
  post: null,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTarget(base, normalized) {
  const url = new URL(base);
  url.searchParams.set('wait', 'true');
  if (normalized.thread.id) url.searchParams.set('thread_id', normalized.thread.id);
  return url.toString();
}

function buildPayload(normalized) {
  const payload = structuredClone(normalized.message);
  if (normalized.thread.name) payload.thread_name = normalized.thread.name;
  if (normalized.thread.name && normalized.thread.tags.length) payload.applied_tags = normalized.thread.tags;
  if (normalized.files.length) {
    payload.attachments = normalized.files.map((file, index) => ({ id: index, filename: file.name }));
  }
  return payload;
}

async function buildRequest(normalized, payload) {
  if (!normalized.files.length) {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };
  }
  const form = new FormData();
  form.append('payload_json', JSON.stringify(payload));
  for (let i = 0; i < normalized.files.length; i += 1) {
    const file = normalized.files[i];
    const bytes = await readFile(file.path);
    form.append(`files[${i}]`, new Blob([bytes]), file.name);
  }
  return { method: 'POST', body: form };
}

async function sendWithRetry(target, normalized, payload) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(target, await buildRequest(normalized, payload));
    const text = await response.text();
    if (response.status === 429 && attempt < MAX_ATTEMPTS) {
      let retrySeconds = 1;
      try {
        const parsed = JSON.parse(text);
        if (Number.isFinite(Number(parsed.retry_after))) retrySeconds = Number(parsed.retry_after);
      } catch {
        // Use the conservative fallback.
      }
      await sleep(Math.max(250, retrySeconds * 1000 + 250));
      continue;
    }
    if (!response.ok) {
      const safeBody = text.slice(0, 2000);
      throw new Error(`Discord returned HTTP ${response.status}: ${safeBody}`);
    }
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Discord returned a successful response without a JSON message object');
    }
  }
  throw new Error('Discord rate limit retry budget exhausted');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(helpText('publish'));
    return;
  }
  if (!args.input) throw new Error('Missing required --input');
  if (args['dry-run'] && args['confirm-send']) throw new Error('--dry-run and --confirm-send cannot be combined');

  const { post, config, inputPath } = await loadInputs(args);
  const recordsDir = resolveRecordsDir(config);
  failureContext.recordsDir = recordsDir;
  failureContext.post = post;
  failureContext.operation = args['confirm-send'] ? 'publish' : 'dry-run';
  const validation = await validatePost(post, config, inputPath);
  if (validation.valid && post.record?.sourceType === 'hq-banner') {
    try {
      const database = await readBannerDatabase(recordsDir);
      const build = assertBannerRecordCurrent(database, post.record);
      const { channel } = resolveChannel(post, config);
      assertBannerPostTags(build, validation.normalized, channel);
    } catch (error) {
      validation.errors.push({ code: 'banner-tags', message: error.message, location: 'thread.tags' });
      validation.valid = false;
    }
  }
  if (!validation.valid) {
    await recordOperation(recordsDir, {
      operation: failureContext.operation,
      status: 'failed',
      source: post.record?.sourceType,
      schemeId: post.record?.schemeId,
      buildCode: post.record?.buildCode,
      channel: post.channel,
      details: { phase: 'validation', errors: validation.errors.length, warnings: validation.warnings.length },
    });
    console.log(JSON.stringify({ dryRun: !args['confirm-send'], ...publicValidationResult(validation) }, null, 2));
    process.exitCode = 1;
    return;
  }

  if (!args['confirm-send']) {
    await recordOperation(recordsDir, {
      operation: 'dry-run',
      status: 'success',
      source: post.record?.sourceType,
      schemeId: post.record?.schemeId,
      buildCode: post.record?.buildCode,
      channel: post.channel,
      details: { warnings: validation.warnings.length },
    });
    console.log(JSON.stringify({ dryRun: true, ...publicValidationResult(validation) }, null, 2));
    return;
  }

  const refresh = await refreshBannerRecords({ recordsDir, operation: 'pre-publish-refresh' });
  if (!refresh.valid) {
    const target = post.record?.sourceType === 'hq-banner'
      ? assertBannerRecordCurrent(refresh.database, post.record)
      : null;
    const targetReady = target?.detailStatus === 'complete'
      && target?.discordTagMappingStatus === 'complete';
    const mayIgnoreUnrelated = Boolean(args['allow-unrelated-record-errors'])
      && refresh.sourceErrors.length === 0
      && targetReady;
    if (!mayIgnoreUnrelated) {
      throw new Error(`Banner record refresh is incomplete: ${refresh.sourceErrors.length} source errors, ${refresh.detailErrors.length} detail errors`);
    }
    await recordOperation(recordsDir, {
      operation: 'pre-publish-target-scope',
      status: 'success',
      source: post.record?.sourceType,
      schemeId: post.record?.schemeId,
      buildCode: post.record?.buildCode,
      channel: post.channel,
      note: `Explicitly ignored ${refresh.database.summary.detailErrors} unrelated detail error(s) and ${refresh.database.summary.tagMappingErrors} unrelated tag mapping error(s); selected target is complete and fully mapped.`,
    });
  }
  const { channel } = resolveChannel(post, config);
  if (post.record?.sourceType === 'hq-banner') {
    const build = assertBannerRecordCurrent(refresh.database, post.record);
    assertBannerPostTags(build, validation.normalized, channel);
  }
  const secret = process.env[channel.webhookEnv];
  if (!secret) throw new Error(`Missing webhook environment variable: ${channel.webhookEnv}`);
  const webhookUrl = validateWebhookUrl(secret);
  const payload = buildPayload(validation.normalized);
  const message = await sendWithRetry(buildTarget(webhookUrl, validation.normalized), validation.normalized, payload);

  const receipt = {
    success: true,
    channel: validation.summary.channel,
    mode: validation.summary.mode,
    messageId: message.id || null,
    threadId: message.channel_id || validation.normalized.thread.id || null,
    guildId: message.guild_id || channel.guildId || null,
    messageUrl: message.id && message.channel_id && (message.guild_id || channel.guildId)
      ? `https://discord.com/channels/${message.guild_id || channel.guildId}/${message.channel_id}/${message.id}`
      : null,
    publishedAt: new Date().toISOString(),
  };
  await writeReceipt(args.receipt, receipt);
  await recordPublication(recordsDir, {
    post,
    summary: validation.summary,
    receipt,
    inputPath,
  });
  console.log(JSON.stringify(receipt, null, 2));
}

main().catch(async (error) => {
  if (failureContext.recordsDir) {
    try {
      await recordOperation(failureContext.recordsDir, {
        operation: failureContext.operation,
        status: 'failed',
        source: failureContext.post?.record?.sourceType,
        schemeId: failureContext.post?.record?.schemeId,
        buildCode: failureContext.post?.record?.buildCode,
        channel: failureContext.post?.channel,
        note: error.message,
      });
    } catch {
      // Preserve the original failure when record writing also fails.
    }
  }
  console.error(JSON.stringify({ success: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
