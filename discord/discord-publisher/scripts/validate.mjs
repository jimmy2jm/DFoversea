#!/usr/bin/env node
import { helpText, loadInputs, parseArgs, publicValidationResult, validatePost } from './lib.mjs';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(helpText('validate'));
    return;
  }
  if (!args.input) throw new Error('Missing required --input');
  const { post, config, inputPath } = await loadInputs(args);
  const result = await validatePost(post, config, inputPath);
  console.log(JSON.stringify(publicValidationResult(result), null, 2));
  if (!result.valid) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ valid: false, error: error.message }, null, 2));
  process.exitCode = 1;
});

