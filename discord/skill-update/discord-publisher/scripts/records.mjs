#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, readJson } from './lib.mjs';
import {
  readBannerDatabase,
  recordOperation,
  refreshBannerRecords,
  resolveRecordsDir,
} from './records-lib.mjs';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadConfig(args) {
  const configPath = path.resolve(args.config || process.env.DISCORD_PUBLISHER_CONFIG
    || path.join(skillRoot, '.private', 'discord-publisher.config.json'));
  try {
    return await readJson(configPath, 'publisher configuration');
  } catch (error) {
    if (args['records-dir']) return {};
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log([
      'Usage: node scripts/records.mjs --action <refresh|log|status> [options]',
      '  --records-dir <path>   Override config.recordsDir',
      '  --operation <name>     Operation name for refresh/log',
      '  --status <value>       Status for log (default: success)',
      '  --scheme-id <id>       Optional scheme ID for log',
      '  --build-code <code>    Optional build code for log',
      '  --note <text>          Optional short note for log',
    ].join('\n'));
    return;
  }
  const config = await loadConfig(args);
  const recordsDir = path.resolve(args['records-dir'] || resolveRecordsDir(config));
  const action = args.action || 'status';
  if (action === 'refresh') {
    const result = await refreshBannerRecords({
      recordsDir,
      operation: args.operation || 'refresh-banner-records',
    });
    console.log(JSON.stringify({
      valid: result.valid,
      recordsDir,
      summary: result.database.summary,
      changes: result.database.changes,
      files: { database: result.paths.database, table: result.paths.table },
    }, null, 2));
    if (!result.valid) process.exitCode = 1;
    return;
  }
  if (action === 'log') {
    const entry = await recordOperation(recordsDir, {
      operation: args.operation || 'manual-operation',
      status: args.status || 'success',
      schemeId: args['scheme-id'],
      buildCode: args['build-code'],
      note: args.note,
    });
    console.log(JSON.stringify({ recorded: true, recordsDir, entry }, null, 2));
    return;
  }
  if (action === 'status') {
    const database = await readBannerDatabase(recordsDir);
    console.log(JSON.stringify({
      recordsDir,
      exists: Boolean(database),
      refreshedAt: database?.refreshedAt || null,
      summary: database?.summary || null,
      changes: database?.changes || null,
    }, null, 2));
    return;
  }
  throw new Error(`Unknown --action: ${action}`);
}

main().catch((error) => {
  console.error(JSON.stringify({ success: false, error: error.message }, null, 2));
  process.exitCode = 1;
});
