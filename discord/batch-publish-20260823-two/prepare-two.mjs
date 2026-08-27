import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.dirname(new URL(import.meta.url).pathname);
const templatePath = '/Users/jimmmywang/Documents/DFoversea/discord/batch-publish-20260804-five/prepare-batch.mjs';
const generatedPath = path.join(root, 'renderer.generated.mjs');
const selectedIds = [
  '4518761a511b93101f3e7d1d6fe8894d',
  '5c62d27c6b6b52af15486f7ee7d818e2',
];

let source = await readFile(templatePath, 'utf8');
source = source.replace(
  /const selectedIds = \[[\s\S]*?\];/,
  `const selectedIds = ${JSON.stringify(selectedIds, null, 2)};`,
);
source = source.replace(
  "if (new Set(selected.map((build) => build.weaponName)).size !== 5) throw new Error('Confirmed batch contains a duplicate weapon name');",
  "if (new Set(selected.map((build) => build.weaponName)).size !== 2) throw new Error('Confirmed pair contains a duplicate weapon name');",
);
source = source.replace('intervalSeconds: 600', 'intervalSeconds: 0');
await writeFile(generatedPath, source, 'utf8');
await import(`${pathToFileURL(generatedPath).href}?v=${Date.now()}`);
