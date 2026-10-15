import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.dirname(new URL(import.meta.url).pathname);
const templatePath = '/Users/jimmmywang/Documents/DFoversea/discord/batch-publish-20260804-five/prepare-batch.mjs';
const generatedPath = path.join(root, 'renderer.generated.mjs');
const selectedIds = [
  'ae7419446f5b5a0f9e5c2585c480cbe2',
  'a7f1bd9938f1311d6499103f6c283038',
  '12f5616124cef6d595ccad4bd7183060',
];

let source = await readFile(templatePath, 'utf8');
source = source.replace(
  /const selectedIds = \[[\s\S]*?\];/,
  `const selectedIds = ${JSON.stringify(selectedIds, null, 2)};`,
);
source = source.replace(
  "if (new Set(selected.map((build) => build.weaponName)).size !== 5) throw new Error('Confirmed batch contains a duplicate weapon name');",
  "if (new Set(selected.map((build) => build.weaponName)).size !== 3) throw new Error('Confirmed trio contains a duplicate weapon name');",
);
source = source.replace('intervalSeconds: 600', 'intervalSeconds: 0');
await writeFile(generatedPath, source, 'utf8');
await import(`${pathToFileURL(generatedPath).href}?v=${Date.now()}`);
