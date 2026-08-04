import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const publisher = '/Users/jimmmywang/.codex/skills/discord-publisher/scripts/publish.mjs';
const intervalMs = 180_000;
const jobs = [
  '02-ar-57-ff8e6ebc',
  '03-kc-17-64bf58a7',
  '04-kc-17-a4f906f5',
  '05-m7-6b153a25',
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const statusPath = path.join(root, 'batch-status.json');
const firstReceipt = JSON.parse(await readFile(path.join(root, '01-ar-57-8432decd', 'receipt.json'), 'utf8'));
const completed = [{ index: 1, ...firstReceipt }];

async function saveStatus(state, extra = {}) {
  await writeFile(statusPath, `${JSON.stringify({
    destinationAlias: 'delta-force-official',
    intervalSeconds: 180,
    state,
    completed,
    updatedAt: new Date().toISOString(),
    ...extra,
  }, null, 2)}\n`, 'utf8');
}

async function runPublisher(postPath, receiptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [publisher, '--input', postPath, '--confirm-send', '--receipt', receiptPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; process.stdout.write(chunk); });
    child.stderr.on('data', (chunk) => { stderr += chunk; process.stderr.write(chunk); });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`Publisher exited ${code}: ${stderr || stdout}`));
    });
  });
}

let lastPublishedAt = firstReceipt.publishedAt;
await saveStatus('waiting');
for (let jobIndex = 0; jobIndex < jobs.length; jobIndex += 1) {
  const index = jobIndex + 2;
  const dir = path.join(root, jobs[jobIndex]);
  const postPath = path.join(dir, 'post.json');
  const receiptPath = path.join(dir, 'receipt.json');
  const dueAtMs = Date.parse(lastPublishedAt) + intervalMs;
  const dueAt = new Date(dueAtMs).toISOString();
  console.log(JSON.stringify({ event: 'scheduled', index, dueAt }));
  await saveStatus('waiting', { nextIndex: index, nextDueAt: dueAt });
  await wait(Math.max(0, dueAtMs - Date.now()));
  console.log(JSON.stringify({ event: 'publishing', index, startedAt: new Date().toISOString() }));
  try {
    await runPublisher(postPath, receiptPath);
    const receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
    completed.push({ index, ...receipt });
    lastPublishedAt = receipt.publishedAt;
    await saveStatus(index === 5 ? 'complete' : 'waiting');
    console.log(JSON.stringify({ event: 'published', index, messageId: receipt.messageId, threadId: receipt.threadId, publishedAt: receipt.publishedAt }));
  } catch (error) {
    await saveStatus('failed', { failedIndex: index, error: error.message });
    console.error(JSON.stringify({ event: 'failed', index, error: error.message }));
    process.exitCode = 1;
    break;
  }
}
