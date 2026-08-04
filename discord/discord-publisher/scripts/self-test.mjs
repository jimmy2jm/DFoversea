#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePost, validateWebhookUrl } from './lib.mjs';

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

console.log(JSON.stringify({
  passed: 6,
  cases: ['valid', 'thread-conflict', 'content-limit', 'mention-safety', 'attachment', 'webhook-domain'],
}, null, 2));

