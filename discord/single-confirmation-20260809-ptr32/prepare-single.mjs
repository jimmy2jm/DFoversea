import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('/Users/jimmmywang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.dirname(new URL(import.meta.url).pathname);
const recordsPath = '/Users/jimmmywang/Documents/DFoversea/discord/records/delta-force-publisher/banner-builds.json';
const qrPath = '/Users/jimmmywang/.codex/skills/discord-publisher/design/delta-force-hq-qr.png';
const database = JSON.parse(await readFile(recordsPath, 'utf8'));
const selectedIds = [
  '0f33169d27a68aeb99afe98148455962',
];
const selected = selectedIds.map((schemeId) => database.builds.find((build) => build.schemeId === schemeId));
if (selected.some((build) => !build || !build.active || Number(build.publishCount || 0) !== 0)) {
  throw new Error('A confirmed build is missing, inactive, or already published');
}
if (selected.length !== 1) throw new Error('Single confirmation preparation requires exactly one build');

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const statEntries = (build) => [
  ['HANDLING SPEED', build.stats.handlingSpeed],
  ['STABILITY', build.stats.stability],
  ['EFFECTIVE RANGE', build.stats.effectiveRange],
  ['BASE DAMAGE', build.stats.baseDamage],
  ['HIP-FIRE ACCURACY', build.stats.hipFireAccuracy],
  ['RECOIL CONTROL', build.stats.recoilControl],
];
const tagType = (label) => {
  if (/agile|rush|close|range/i.test(label)) return 'mobility';
  if (/stable|stability|recoil|bracing|suppressive|control/i.test(label)) return 'control';
  return 'status';
};
const tagSymbol = { mobility: '↗', control: '▣', status: '◆' };

function htmlFor(build, weaponPath) {
  const visualTags = build.tags.slice(0, 3).map((tag) => ({ label: tag.name, type: tagType(tag.name) }));
  const stats = statEntries(build);
  const titleSize = build.buildName.length > 42 ? 54 : build.buildName.length > 23 ? 70 : 92;
  const hasPrice = build.priceStatus === 'available' && build.price;
  const priceMarkup = hasPrice ? `<div class="price"><small>PRICE</small><strong>${escapeHtml(build.price)}</strong></div>` : '';
  const tagClass = hasPrice ? 'tags' : 'tags no-price';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}html,body{margin:0;width:2400px;height:1350px;overflow:hidden;background:#02090b;font-family:Inter,Arial,sans-serif}.card{position:relative;width:2400px;height:1350px;overflow:hidden;color:#eef8f6;background:radial-gradient(circle at 82% 40%,rgba(36,244,178,.13),transparent 31%),radial-gradient(circle at 15% 85%,rgba(16,93,104,.28),transparent 36%),linear-gradient(112deg,#07191d 0%,#061317 52%,#031014 100%)}.card:before{content:"";position:absolute;inset:0;opacity:.22;background-image:linear-gradient(rgba(75,176,164,.16) 2px,transparent 2px),linear-gradient(90deg,rgba(75,176,164,.16) 2px,transparent 2px);background-size:84px 84px;mask-image:linear-gradient(90deg,transparent,#000 35%,#000 100%)}.card:after{content:"";position:absolute;inset:28px;border:2px solid rgba(110,224,198,.16)}.accent{position:absolute;top:0;left:0;width:620px;height:10px;background:linear-gradient(90deg,#24f4b2,transparent)}header{position:absolute;z-index:3;top:68px;left:84px;right:84px;display:flex;align-items:center;justify-content:space-between}.type strong{display:block;color:#d8ece8;font-size:28px;letter-spacing:5px}.type small{display:block;margin-top:10px;color:#5f8c87;font-size:20px;letter-spacing:4px}.mode{border:2px solid rgba(36,244,178,.45);padding:16px 26px;color:#92c6bd;background:rgba(7,27,30,.72);font-size:22px;letter-spacing:3.6px}.content{position:absolute;z-index:2;inset:164px 84px 60px;display:grid;grid-template-columns:46% 54%;gap:52px}.info{padding-top:16px}.eyebrow{color:#7eb0aa;font-size:36px;font-weight:750;letter-spacing:3.6px}h1{margin:10px 0 12px;font-size:${titleSize}px;line-height:1.02;letter-spacing:-2px}.author{color:#24f4b2;font-size:28px;font-weight:750;letter-spacing:3px}.price{display:inline-flex;flex-direction:column;min-width:396px;margin:36px 0 26px;padding:18px 28px 20px;background:#24f4b2;color:#062019}.price small{font-size:20px;font-weight:850;letter-spacing:4px}.price strong{margin-top:2px;font-size:64px;line-height:1}.tags{display:flex;align-items:center;gap:16px;margin-bottom:40px;white-space:nowrap}.tags.no-price{margin-top:62px}.tag{padding:16px 18px;border:2px solid;font-size:22px;font-weight:750;letter-spacing:.7px}.mobility{color:#9bd1ff;border-color:rgba(85,168,255,.58);background:rgba(43,102,156,.24)}.control{color:#8df6d4;border-color:rgba(36,244,178,.52);background:rgba(24,115,90,.24)}.status{color:#f8d78d;border-color:rgba(243,201,105,.56);background:rgba(135,96,26,.25)}.stats{display:grid;gap:20px}.head{display:flex;align-items:baseline;justify-content:space-between;gap:20px}.name{color:#a8c7c3;font-size:30px}.value{font-family:ui-monospace,monospace;font-size:38px;font-weight:850}.track{height:14px;margin-top:10px;background:rgba(166,197,193,.15)}.raw-note{height:14px;margin-top:10px;color:#6c9590;font-size:14px;letter-spacing:2px}.fill{height:100%;background:linear-gradient(90deg,#168a72,#24f4b2);box-shadow:0 0 24px rgba(36,244,178,.32)}.visual{position:relative;display:flex;align-items:center;justify-content:center;min-width:0}.visual:before{content:"";position:absolute;inset:136px 0 96px;border:2px solid rgba(105,192,179,.19);background:linear-gradient(145deg,rgba(14,41,44,.65),rgba(4,16,19,.1));clip-path:polygon(4% 0,100% 0,100% 83%,92% 100%,0 100%,0 10%)}.weapon{position:relative;z-index:2;width:100%;height:70%;object-fit:contain;filter:drop-shadow(0 40px 44px rgba(0,0,0,.7));transform:translate(-8px,-68px)}.qr{position:absolute;z-index:4;right:28px;bottom:30px;display:flex;align-items:center;gap:26px;width:740px;padding:20px;border:2px solid rgba(112,198,185,.28);background:rgba(3,17,20,.92)}.qr img{width:224px;height:224px;background:#fff}.qr strong{display:block;font-size:28px;letter-spacing:1.4px;white-space:nowrap}.qr span{display:block;margin-top:14px;color:#24f4b2;font-size:20px;letter-spacing:.5px;white-space:nowrap}.source{position:absolute;z-index:4;left:84px;bottom:50px;color:#436b67;font-size:20px;letter-spacing:2px}
  </style></head><body><article class="card"><div class="accent"></div><header><div class="type"><strong>WEAPON BUILD</strong><small>COMMUNITY LOADOUT</small></div><div class="mode">${escapeHtml(build.mode)}</div></header><main class="content"><section class="info"><div class="eyebrow">${escapeHtml(build.officialWeaponName.toUpperCase())}</div><h1>${escapeHtml(build.buildName)}</h1><div class="author">BY ${escapeHtml(build.author.name.toUpperCase())}</div>${priceMarkup}<div class="${tagClass}">${visualTags.map((tag) => `<div class="tag ${tag.type}">${tagSymbol[tag.type]} ${escapeHtml(tag.label.toUpperCase())}</div>`).join('')}</div><div class="stats">${stats.map(([label,value]) => `<div><div class="head"><span class="name">${label}</span><span class="value">${value}</span></div>${Number(value) > 100 ? '<div class="raw-note">RAW VALUE · NO PERCENT BAR</div>' : `<div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,Number(value)))}%"></div></div>`}</div>`).join('')}</div></section><section class="visual"><img class="weapon" src="${pathToFileURL(weaponPath).href}" alt="${escapeHtml(build.weaponName)} build"><div class="qr"><img src="${pathToFileURL(qrPath).href}" alt="Delta Force HQ QR code"><div><strong>OPEN DELTA FORCE HQ</strong><span>playdeltaforce.com/events/hq/</span></div></div></section></main><div class="source">PUBLIC BUILD · DATA FROM DELTA FORCE HQ</div></article></body></html>`;
}

const browser = await chromium.launch({ headless: true });
const outputs = [];
try {
  for (let index = 0; index < selected.length; index += 1) {
    const build = selected[index];
    const dirName = `${String(index + 1).padStart(2, '0')}-${slug(build.weaponName)}-${build.schemeId.slice(0, 8)}`;
    const dir = path.join(root, dirName);
    await mkdir(dir, { recursive: true });
    const response = await fetch(build.weaponImageUrl, { headers: { Accept: 'image/webp,image/*' } });
    if (!response.ok) throw new Error(`Weapon image HTTP ${response.status} for ${build.schemeId}`);
    const weaponPath = path.join(dir, 'weapon.webp');
    await writeFile(weaponPath, Buffer.from(await response.arrayBuffer()));
    const htmlPath = path.join(dir, 'gun-card.html');
    const imagePath = path.join(dir, 'gun-card.png');
    await writeFile(htmlPath, htmlFor(build, weaponPath), 'utf8');
    const page = await browser.newPage({ viewport: { width: 2400, height: 1350 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map((image) => image.complete ? Promise.resolve() : new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; })));
    });
    await page.screenshot({ path: imagePath, type: 'png' });
    await page.close();
    const visualTags = build.tags.slice(0, 3).map((tag) => ({ label: tag.name, type: tagType(tag.name) }));
    const chipText = visualTags.map((tag) => `\`${tagSymbol[tag.type]} ${tag.label}\``).join(' ');
    const priceLine = build.priceStatus === 'available' && build.price ? `**PRICE · ${build.price}**\n` : '';
    const description = `**${build.officialWeaponName.toUpperCase()}**\n${priceLine}${chipText}\n\n**BUILD CODE**\n\`\`\`\n${build.buildCode}\n\`\`\`\n\n**DELTA FORCE HQ**\nLooking for more loadouts? Explore more weapon builds and community recommendations on Delta Force HQ.\n[OPEN DELTA FORCE HQ](${build.canonicalHqUrl})`;
    const stats = statEntries(build);
    const post = {
      channel: 'delta-force-official',
      record: {
        sourceType: 'hq-banner',
        schemeId: build.schemeId,
        buildCode: build.buildCode,
        weaponName: build.officialWeaponName,
        buildName: build.buildName,
      },
      thread: {
        name: build.priceStatus === 'available' && build.price
          ? `[${build.weaponName} · ${build.price}] ${build.buildName}`
          : `[${build.weaponName} · WARFARE] ${build.buildName}`,
        id: '',
        tags: build.discordTagAliases,
      },
      message: {
        content: '',
        embeds: [{
          author: { name: build.mode },
          title: build.buildName,
          url: build.canonicalHqUrl,
          description,
          color: 2421938,
          image: {
            url: 'attachment://gun-card.png',
            description: `${build.weaponName} build: ${stats.map(([label,value]) => `${label.toLowerCase()} ${value}`).join(', ')}.`,
          },
          footer: { text: `Build by ${build.author.name}` },
        }],
      },
      files: [{ path: imagePath, name: 'gun-card.png' }],
      options: { silent: true, allowMentions: false },
    };
    const postPath = path.join(dir, 'post.json');
    const receiptPath = path.join(dir, 'receipt.json');
    await writeFile(postPath, `${JSON.stringify(post, null, 2)}\n`, 'utf8');
    outputs.push({ index: index + 1, dir, postPath, receiptPath, imagePath, schemeId: build.schemeId, title: post.thread.name, tags: post.thread.tags });
  }
} finally {
  await browser.close();
}
await writeFile(path.join(root, 'batch-manifest.json'), `${JSON.stringify({ preparedAt: new Date().toISOString(), refreshedAt: database.refreshedAt, destinationAlias: 'delta-force-official', intervalSeconds: 600, outputs }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ prepared: outputs.length, outputs }, null, 2));
