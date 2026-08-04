#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePost, validateWebhookUrl } from './lib.mjs';
import { ACTIVE_CHANNEL, BANNER_SOURCES, parseBannerScript } from './records-lib.mjs';
import { deriveDiscordTagAliases } from './tag-rules.mjs';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = {
  channels: {
    test: {
      webhookEnv: 'DISCORD_WEBHOOK_TEST',
      tagMap: { guide: '000000000000000001' },
    },
  },
};
const base = {
  channel: 'test',
  record: {
    sourceType: 'user-provided',
    schemeId: '',
    buildCode: 'EXAMPLE-CODE',
    weaponName: 'Example Rifle',
    buildName: 'Example Build',
  },
  thread: { name: 'Example', tags: ['guide'] },
  message: { content: 'hello' },
  files: [],
  options: {},
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const valid = await validatePost(base, config, path.join(skillRoot, 'test-post.json'));
assert(valid.valid, `Valid case failed: ${JSON.stringify(valid.errors)}`);

const conflict = await validatePost(
  { ...base, thread: { name: 'Example', id: '123456789012345678' } },
  config,
  path.join(skillRoot, 'test-post.json'),
);
assert(conflict.errors.some((issue) => issue.code === 'conflict'), 'Thread conflict was not detected');

const overLimit = await validatePost(
  { ...base, message: { content: 'x'.repeat(2001) } },
  config,
  path.join(skillRoot, 'test-post.json'),
);
assert(overLimit.errors.some((issue) => issue.code === 'limit'), 'Content limit was not detected');

const mentions = await validatePost(
  { ...base, message: { content: '@everyone', allowed_mentions: { parse: ['everyone'] } } },
  config,
  path.join(skillRoot, 'test-post.json'),
);
assert(mentions.normalized.message.allowed_mentions.parse.length === 0, 'Mentions were not disabled');

const missingRecord = await validatePost(
  { ...base, record: undefined },
  config,
  path.join(skillRoot, 'test-post.json'),
);
assert(missingRecord.errors.some((issue) => issue.code === 'record-required'), 'Missing record metadata was not detected');

const attachment = await validatePost(
  {
    ...base,
    message: { content: '', embeds: [{ image: { url: 'attachment://post.example.json' } }] },
    files: [{ path: './assets/post.example.json' }],
  },
  config,
  path.join(skillRoot, 'test-post.json'),
);
assert(attachment.valid && attachment.normalized.files.length === 1, `Attachment case failed: ${JSON.stringify(attachment.errors)}`);

for (const unsafe of [
  'http://discord.com/api/webhooks/1/x',
  'https://evil.test/api/webhooks/123/token',
  'https://discord.com/channels/1/2',
]) {
  let rejected = false;
  try {
    validateWebhookUrl(unsafe);
  } catch {
    rejected = true;
  }
  assert(rejected, `Unsafe webhook URL was accepted: ${unsafe}`);
}

const banner = parseBannerScript('var gun_codes_op_sol=[{"gun_id":"1"}];', 'gun_codes_op_sol');
assert(banner.length === 1 && banner[0].gun_id === '1', 'Banner source parsing failed');

assert(
  ACTIVE_CHANNEL === 'LI' && BANNER_SOURCES.length === 2 && BANNER_SOURCES.every((source) => source.channel === 'LI' && !source.key.startsWith('ga-')),
  'Banner refresh scope must contain only the two LI sources',
);

const taggedConfig = {
  channels: {
    test: {
      webhookEnv: 'DISCORD_WEBHOOK_TEST',
      tagMap: {
        operations: '000000000000000001',
        warfare: '000000000000000002',
        global: '000000000000000003',
        garena: '000000000000000004',
        ar: '000000000000000005',
        smg: '000000000000000006',
      },
      tagPolicy: {
        exactCount: 3,
        groups: {
          mode: ['operations', 'warfare'],
          productChannel: ['global', 'garena'],
          weaponType: ['ar', 'smg'],
        },
      },
    },
  },
};
const tagged = await validatePost(
  { ...base, thread: { name: 'Example', tags: ['operations', 'global', 'ar'] } },
  taggedConfig,
  path.join(skillRoot, 'test-post.json'),
);
assert(tagged.valid && tagged.normalized.thread.tags.length === 3, `Three-tag policy failed: ${JSON.stringify(tagged.errors)}`);

const missingTagGroup = await validatePost(
  { ...base, thread: { name: 'Example', tags: ['operations', 'global'] } },
  taggedConfig,
  path.join(skillRoot, 'test-post.json'),
);
assert(missingTagGroup.errors.some((issue) => issue.code === 'tag-count'), 'Missing third Discord tag was not detected');

const derivedTags = deriveDiscordTagAliases({ mode: 'WARFARE', channel: 'LI', weaponClass: 'GENERAL MACHINE GUN' });
assert(
  derivedTags.status === 'complete' && derivedTags.aliases.join(',') === 'warfare,global,lmg',
  'Banner metadata did not derive the expected Discord tags',
);

console.log(JSON.stringify({
  passed: 12,
  cases: ['valid', 'thread-conflict', 'content-limit', 'mention-safety', 'record-required', 'attachment', 'webhook-domain', 'banner-parser', 'li-only-scope', 'three-tag-policy', 'missing-tag-group', 'tag-derivation'],
}, null, 2));
