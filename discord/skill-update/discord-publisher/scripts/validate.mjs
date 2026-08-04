#!/usr/bin/env node
import { helpText, loadInputs, parseArgs, publicValidationResult, resolveChannel, validatePost } from './lib.mjs';
import { assertBannerRecordCurrent, readBannerDatabase, recordOperation, resolveRecordsDir } from './records-lib.mjs';
import { assertBannerPostTags } from './tag-rules.mjs';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(helpText('validate'));
    return;
  }
  if (!args.input) throw new Error('Missing required --input');
  const { post, config, inputPath } = await loadInputs(args);
  const recordsDir = resolveRecordsDir(config);
  const result = await validatePost(post, config, inputPath);
  if (result.valid && post.record?.sourceType === 'hq-banner') {
    try {
      const database = await readBannerDatabase(recordsDir);
      const build = assertBannerRecordCurrent(database, post.record);
      const { channel } = resolveChannel(post, config);
      assertBannerPostTags(build, result.normalized, channel);
    } catch (error) {
      result.errors.push({ code: 'banner-tags', message: error.message, location: 'thread.tags' });
      result.valid = false;
    }
  }
  await recordOperation(recordsDir, {
    operation: 'validate',
    status: result.valid ? 'success' : 'failed',
    source: post.record?.sourceType,
    schemeId: post.record?.schemeId,
    buildCode: post.record?.buildCode,
    channel: post.channel,
    details: { errors: result.errors.length, warnings: result.warnings.length },
  });
  console.log(JSON.stringify(publicValidationResult(result), null, 2));
  if (!result.valid) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ valid: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
