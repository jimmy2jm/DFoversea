import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { deriveDiscordTagAliases } from './tag-rules.mjs';

export const HQ_URL = 'https://www.playdeltaforce.com/events/hq/';
const DETAIL_ENDPOINT = 'https://sg-act.playerinfinite.com/api/proxy_direct/logicial/DfTools/GetGunCodeSchemeDetail';
export const ACTIVE_CHANNEL = 'LI';

export const BANNER_SOURCES = Object.freeze([
  {
    key: 'li-operations',
    variable: 'gun_codes_op_sol',
    url: 'https://www.playdeltaforce.com/gun-codes/op_sol_en.js',
    channel: 'LI',
    mode: 'OPERATIONS',
    apiMode: 'sol',
  },
  {
    key: 'li-warfare',
    variable: 'gun_codes_op_mp',
    url: 'https://www.playdeltaforce.com/gun-codes/op_mp_en.js',
    channel: 'LI',
    mode: 'WARFARE',
    apiMode: 'mp',
  },
]);

const CLASS_SUFFIXES = [
  'General Machine Gun',
  'Light Machine Gun',
  'Submachine Gun',
  'Marksman Rifle',
  'Sniper Rifle',
  'Battle Rifle',
  'Assault Rifle',
  'Machine Gun',
  'Shotgun',
  'Pistol',
];

function nowIso() {
  return new Date().toISOString();
}

function compactString(value) {
  return value == null ? '' : String(value).trim();
}

function numberOrNull(value) {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseWeaponIdentity(officialName, fallbackCategory = '') {
  const full = compactString(officialName);
  const suffix = CLASS_SUFFIXES.find((candidate) => full.endsWith(` ${candidate}`));
  if (!suffix) {
    return {
      weaponName: full,
      weaponClass: compactString(fallbackCategory).toUpperCase(),
      weaponClassSource: fallbackCategory ? 'detail-category' : 'unavailable',
    };
  }
  return {
    weaponName: full.slice(0, -(suffix.length + 1)),
    weaponClass: suffix.toUpperCase(),
    weaponClassSource: 'official-name-suffix',
  };
}

function normalizeAuthor(scheme, detail) {
  const author = detail?.author || detail?.authors?.[0] || scheme?.author || scheme?.authors?.[0] || {};
  return {
    name: compactString(author.name),
    avatarUrl: compactString(author.avatar_url || author.avatarUrl),
  };
}

function normalizeTags(scheme, detail) {
  const tags = Array.isArray(detail?.tags) ? detail.tags : Array.isArray(scheme?.tags) ? scheme.tags : [];
  return tags.map((tag) => ({
    id: tag?.id == null ? null : Number(tag.id),
    name: compactString(tag?.name),
    color: compactString(tag?.color),
    sortOrder: numberOrNull(tag?.sort_order),
  }));
}

function normalizeStats(scheme, detail) {
  const stats = detail?.radar_chart_data || {};
  return {
    handlingSpeed: numberOrNull(stats.final_handling_speed ?? scheme?.final_handling_speed),
    stability: numberOrNull(stats.final_stability ?? scheme?.final_stability),
    effectiveRange: numberOrNull(stats.final_range ?? scheme?.final_range),
    baseDamage: numberOrNull(stats.final_base_damage ?? scheme?.final_base_damage),
    hipFireAccuracy: numberOrNull(stats.final_hip_fire ?? scheme?.final_hip_fire),
    recoilControl: numberOrNull(stats.final_recoil_control ?? scheme?.final_recoil_control),
  };
}

function normalizeBaseStats(gun, detail) {
  const stats = detail?.radar_chart_data || {};
  return {
    handlingSpeed: numberOrNull(stats.gun_handling_speed ?? gun?.gun_handling_speed),
    stability: numberOrNull(stats.gun_stability ?? gun?.gun_stability),
    effectiveRange: numberOrNull(stats.gun_range ?? gun?.gun_range),
    baseDamage: numberOrNull(stats.gun_base_damage ?? gun?.gun_base_damage),
    hipFireAccuracy: numberOrNull(stats.gun_hip_fire ?? gun?.gun_hip_fire),
    recoilControl: numberOrNull(stats.gun_recoil_control ?? gun?.gun_recoil_control),
  };
}

function stableFingerprint(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseBannerScript(text, variable) {
  const prefix = new RegExp(`^\\s*var\\s+${escapeRegExp(variable)}\\s*=\\s*`);
  if (!prefix.test(text)) throw new Error(`Banner source does not assign ${variable}`);
  const jsonText = text.replace(prefix, '').replace(/;\s*$/, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Banner source ${variable} is not valid JSON: ${error.message}`);
  }
  if (!Array.isArray(parsed)) throw new Error(`Banner source ${variable} must contain an array`);
  return parsed;
}

async function fetchText(url) {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'text/javascript,*/*;q=0.8' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

async function fetchDetail(item) {
  const response = await fetch(DETAIL_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: 'https://www.playdeltaforce.com',
      Referer: 'https://www.playdeltaforce.com/events/hq/en/',
    },
    body: JSON.stringify({
      scheme_id: item.scheme.scheme_id,
      mode: item.source.apiMode,
      channel: item.source.channel,
      lang: 'en',
      lang_type: 'en',
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  if (payload?.code !== 0 || !payload?.data) {
    throw new Error(`API code ${payload?.code ?? 'unknown'}: ${payload?.msg || 'missing data'}`);
  }
  return payload.data;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw new Error(`Cannot read record database at ${filePath}: ${error.message}`);
  }
}

async function readJsonlIfExists(filePath) {
  try {
    const text = await readFile(filePath, 'utf8');
    return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw new Error(`Cannot read JSONL record at ${filePath}: ${error.message}`);
  }
}

async function writeAtomic(filePath, text) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, text, 'utf8');
  await rename(tempPath, filePath);
}

export function resolveRecordsDir(config = {}, cwd = process.cwd()) {
  const configured = config.recordsDir || process.env.DISCORD_PUBLISHER_RECORDS_DIR;
  return path.resolve(configured || path.join(cwd, 'records', 'delta-force-publisher'));
}

export function recordPaths(recordsDir) {
  const root = path.resolve(recordsDir);
  return {
    root,
    database: path.join(root, 'banner-builds.json'),
    table: path.join(root, 'banner-builds.md'),
    activityLog: path.join(root, 'activity-log.jsonl'),
    publishLog: path.join(root, 'publish-log.jsonl'),
  };
}

export async function recordOperation(recordsDir, entry) {
  const paths = recordPaths(recordsDir);
  await mkdir(paths.root, { recursive: true });
  const record = {
    eventId: randomUUID(),
    timestamp: nowIso(),
    operation: compactString(entry.operation) || 'unspecified',
    status: compactString(entry.status) || 'success',
    ...(entry.source ? { source: compactString(entry.source) } : {}),
    ...(entry.schemeId ? { schemeId: compactString(entry.schemeId) } : {}),
    ...(entry.buildCode ? { buildCode: compactString(entry.buildCode) } : {}),
    ...(entry.channel ? { channel: compactString(entry.channel) } : {}),
    ...(entry.note ? { note: compactString(entry.note).slice(0, 1000) } : {}),
    ...(entry.details && typeof entry.details === 'object' ? { details: entry.details } : {}),
  };
  await appendFile(paths.activityLog, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
  return record;
}

export async function readBannerDatabase(recordsDir) {
  return readJsonIfExists(recordPaths(recordsDir).database);
}

function buildMarkdown(database) {
  const rows = database.builds || [];
  const lines = [
    '# Delta Force HQ Homepage Banner Records',
    '',
    `Last refreshed: ${database.refreshedAt}`,
    '',
    `Active channel scope: ${database.scope?.activeChannel || ACTIVE_CHANNEL} (TIMI Global). GA records are historical only.`,
    '',
    `Current banner sets: ${database.summary.currentBannerSets} · slots: ${database.summary.currentBannerSlots} · builds: ${database.summary.currentBannerBuilds} · detail errors: ${database.summary.detailErrors} · tag mapping errors: ${database.summary.tagMappingErrors || 0}`,
    '',
    '| Active | Set | Slot | Mode | Channel | Weapon | Build | Discord tags | Price | Author | Page tags | Stats (H/S/R/D/HF/RC) | Build code | Scheme ID | Published |',
    '|---|---|---:|---|---|---|---|---|---:|---|---|---|---|---|---:|',
  ];
  const cell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  for (const build of rows) {
    const stats = build.stats || {};
    const statText = [
      stats.handlingSpeed,
      stats.stability,
      stats.effectiveRange,
      stats.baseDamage,
      stats.hipFireAccuracy,
      stats.recoilControl,
    ].map((value) => value ?? '?').join('/');
    const imageLabel = build.weaponImageUrl ? `[${cell(build.buildName)}](${build.weaponImageUrl})` : cell(build.buildName);
    lines.push(`| ${build.active ? 'yes' : 'no'} | ${cell(build.sourceSet)} | ${build.slotIndex} | ${cell(build.mode)} | ${cell(build.channel)} | ${cell(build.officialWeaponName)} | ${imageLabel} | ${cell((build.discordTagAliases || []).join(', '))} | ${cell(build.price ?? build.priceStatus)} | ${cell(build.author?.name)} | ${cell((build.tags || []).map((tag) => tag.name).join(', '))} | ${statText} | ${cell(build.buildCode)} | ${cell(build.schemeId)} | ${build.publishCount || 0} |`);
  }
  lines.push('', 'Canonical JSON: `banner-builds.json`', '');
  return `${lines.join('\n')}\n`;
}

async function writeDatabase(recordsDir, database) {
  const paths = recordPaths(recordsDir);
  await Promise.all([
    writeAtomic(paths.database, `${JSON.stringify(database, null, 2)}\n`),
    writeAtomic(paths.table, buildMarkdown(database)),
  ]);
  return paths;
}

function normalizeBuild(item, detailResult, refreshedAt) {
  const { source, gun, scheme } = item;
  const detail = detailResult.ok ? detailResult.data : null;
  const officialWeaponName = compactString(detail?.gun_name || gun.gun_name);
  const identity = parseWeaponIdentity(officialWeaponName, detail?.gun_category);
  const priceRaw = detail && Object.prototype.hasOwnProperty.call(detail, 'price')
    ? compactString(detail.price)
    : null;
  const price = priceRaw && priceRaw !== '-1' ? priceRaw : null;
  const discordTagMapping = deriveDiscordTagAliases({
    mode: source.mode,
    channel: source.channel,
    weaponClass: identity.weaponClass,
  });
  const core = {
    active: true,
    sourceSet: source.key,
    sourceUrl: source.url,
    slotIndex: numberOrNull(gun.slot_index),
    channel: source.channel,
    mode: source.mode,
    apiMode: source.apiMode,
    bannerRecordId: scheme.id == null ? null : Number(scheme.id),
    schemeId: compactString(scheme.scheme_id),
    gunId: compactString(detail?.gun_id || gun.gun_id),
    officialWeaponName,
    ...identity,
    gunCategory: compactString(detail?.gun_category),
    buildName: compactString(detail?.name || scheme.name),
    description: compactString(detail?.description || scheme.description),
    price,
    priceRaw,
    priceStatus: price ? 'available' : priceRaw === '-1' ? 'not-applicable' : 'missing',
    author: normalizeAuthor(scheme, detail),
    tags: normalizeTags(scheme, detail),
    discordTagAliases: discordTagMapping.aliases,
    discordTagMappingStatus: discordTagMapping.status,
    discordTagMissingGroups: discordTagMapping.missingGroups,
    stats: normalizeStats(scheme, detail),
    baseStats: normalizeBaseStats(gun, detail),
    buildCode: compactString(scheme.gun_code || detail?.gun_code),
    detailBuildCode: compactString(detail?.gun_code),
    weaponImageUrl: compactString(detail?.image_url || scheme.image_url),
    baseWeaponImageUrl: compactString(gun.gun_image_url),
    canonicalHqUrl: HQ_URL,
    detailStatus: detailResult.ok ? 'complete' : 'error',
    detailError: detailResult.ok ? null : detailResult.error,
  };
  return {
    ...core,
    dataFingerprint: stableFingerprint(core),
    sourceFetchedAt: refreshedAt,
  };
}

export async function refreshBannerRecords({ recordsDir, operation = 'refresh-banner-records' } = {}) {
  if (!recordsDir) throw new Error('Missing recordsDir');
  const refreshedAt = nowIso();
  const sourceResults = await Promise.all(BANNER_SOURCES.map(async (source) => {
    try {
      const text = await fetchText(source.url);
      return { source, ok: true, guns: parseBannerScript(text, source.variable) };
    } catch (error) {
      return { source, ok: false, error: error.message, guns: [] };
    }
  }));

  const items = sourceResults.flatMap((result) => result.guns.flatMap((gun) =>
    (Array.isArray(gun.schemes) ? gun.schemes : []).map((scheme) => ({ source: result.source, gun, scheme }))));
  const detailResults = await mapWithConcurrency(items, 6, async (item) => {
    try {
      return { ok: true, data: await fetchDetail(item) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });
  const currentBuilds = items.map((item, index) => normalizeBuild(item, detailResults[index], refreshedAt));
  const currentIds = new Set(currentBuilds.map((build) => build.schemeId));
  const paths = recordPaths(recordsDir);
  const previous = await readJsonIfExists(paths.database);
  const previousBuilds = new Map((previous?.builds || []).map((build) => [build.schemeId, build]));
  const addedSchemeIds = [];
  const changedSchemeIds = [];

  const mergedCurrent = currentBuilds.map((build) => {
    const prior = previousBuilds.get(build.schemeId);
    if (!prior) addedSchemeIds.push(build.schemeId);
    else if (prior.dataFingerprint !== build.dataFingerprint) changedSchemeIds.push(build.schemeId);
    return {
      ...build,
      firstSeenAt: prior?.firstSeenAt || refreshedAt,
      lastSeenAt: refreshedAt,
      lastRefreshedAt: refreshedAt,
      publishCount: Number(prior?.publishCount || 0),
      lastPublishedAt: prior?.lastPublishedAt || null,
      lastMessageId: prior?.lastMessageId || null,
      lastThreadId: prior?.lastThreadId || null,
    };
  });
  const inactive = [...previousBuilds.values()]
    .filter((build) => !currentIds.has(build.schemeId))
    .map((build) => ({ ...build, active: false, lastRefreshedAt: refreshedAt }));
  const removedSchemeIds = (previous?.builds || [])
    .filter((build) => build.active && !currentIds.has(build.schemeId))
    .map((build) => build.schemeId);
  const sourceErrors = sourceResults.filter((result) => !result.ok);
  const detailErrors = mergedCurrent.filter((build) => build.detailStatus !== 'complete');
  const tagMappingErrors = mergedCurrent.filter((build) => build.discordTagMappingStatus !== 'complete');
  const sets = sourceResults.map((result) => ({
    key: result.source.key,
    channel: result.source.channel,
    mode: result.source.mode,
    sourceUrl: result.source.url,
    status: result.ok ? 'complete' : 'error',
    error: result.ok ? null : result.error,
    slots: result.guns.map((gun) => ({
      slotIndex: numberOrNull(gun.slot_index),
      gunId: compactString(gun.gun_id),
      gunName: compactString(gun.gun_name),
      schemeIds: (gun.schemes || []).map((scheme) => compactString(scheme.scheme_id)),
    })),
  }));
  const database = {
    schemaVersion: 1,
    sourcePage: HQ_URL,
    refreshedAt,
    scope: {
      activeChannel: ACTIVE_CHANNEL,
      productChannel: 'TIMI Global',
      excludedChannels: ['GA'],
    },
    summary: {
      currentBannerSets: sets.length,
      currentBannerSlots: sets.reduce((sum, set) => sum + set.slots.length, 0),
      currentBannerBuilds: mergedCurrent.length,
      historicalBuilds: inactive.length,
      sourceErrors: sourceErrors.length,
      detailErrors: detailErrors.length,
      tagMappingErrors: tagMappingErrors.length,
    },
    changes: { addedSchemeIds, changedSchemeIds, removedSchemeIds },
    currentBanner: { sets },
    builds: [...mergedCurrent, ...inactive].sort((a, b) => Number(b.active) - Number(a.active)
      || a.sourceSet.localeCompare(b.sourceSet)
      || Number(a.slotIndex) - Number(b.slotIndex)
      || a.schemeId.localeCompare(b.schemeId)),
  };
  await writeDatabase(recordsDir, database);
  const valid = sourceErrors.length === 0 && detailErrors.length === 0 && tagMappingErrors.length === 0;
  await recordOperation(recordsDir, {
    operation,
    status: valid ? 'success' : 'partial',
    source: 'delta-force-hq-homepage-banner',
    details: {
      ...database.summary,
      added: addedSchemeIds.length,
      changed: changedSchemeIds.length,
      removed: removedSchemeIds.length,
    },
  });
  return { valid, database, paths, sourceErrors, detailErrors };
}

export function findBannerBuild(database, record) {
  if (!database || !Array.isArray(database.builds)) return null;
  if (record?.schemeId) {
    const match = database.builds.find((build) => build.schemeId === record.schemeId);
    if (match) return match;
  }
  if (record?.buildCode) return database.builds.find((build) => build.buildCode === record.buildCode) || null;
  return null;
}

export function assertBannerRecordCurrent(database, record) {
  const build = findBannerBuild(database, record);
  if (!build) throw new Error(`Record scheme/build is not present in the Banner database: ${record?.schemeId || record?.buildCode || 'unknown'}`);
  if (!build.active) throw new Error(`Banner build is no longer active: ${build.schemeId}`);
  if (record?.buildCode && build.buildCode !== record.buildCode) {
    throw new Error(`Post build code does not match refreshed Banner record for ${build.schemeId}`);
  }
  return build;
}

export async function recordPublication(recordsDir, {
  post,
  summary,
  receipt,
  inputPath,
  operation = 'publish',
}) {
  const paths = recordPaths(recordsDir);
  await mkdir(paths.root, { recursive: true });
  const priorPublications = await readJsonlIfExists(paths.publishLog);
  const duplicate = receipt.messageId
    ? priorPublications.find((entry) => entry.messageId === receipt.messageId)
    : null;
  if (duplicate) {
    await recordOperation(recordsDir, {
      operation,
      status: 'duplicate',
      schemeId: post.record?.schemeId,
      buildCode: post.record?.buildCode,
      channel: summary.channel,
      note: `Publication already recorded for message ${receipt.messageId}`,
    });
    return { ...duplicate, duplicate: true };
  }
  const identity = post.record || {};
  const publication = {
    eventId: randomUUID(),
    timestamp: nowIso(),
    sourceType: compactString(identity.sourceType),
    schemeId: compactString(identity.schemeId) || null,
    buildCode: compactString(identity.buildCode),
    weaponName: compactString(identity.weaponName),
    buildName: compactString(identity.buildName),
    destinationAlias: summary.channel,
    mode: summary.mode,
    threadName: summary.threadName,
    threadId: receipt.threadId,
    messageId: receipt.messageId,
    guildId: receipt.guildId,
    messageUrl: receipt.messageUrl,
    publishedAt: receipt.publishedAt,
    inputPath: path.resolve(inputPath),
  };
  await appendFile(paths.publishLog, `${JSON.stringify(publication)}\n`, { encoding: 'utf8', mode: 0o600 });
  const database = await readJsonIfExists(paths.database);
  if (database) {
    const match = findBannerBuild(database, identity);
    if (match) {
      match.publishCount = Number(match.publishCount || 0) + 1;
      match.lastPublishedAt = receipt.publishedAt;
      match.lastMessageId = receipt.messageId;
      match.lastThreadId = receipt.threadId;
      await writeDatabase(recordsDir, database);
    }
  }
  await recordOperation(recordsDir, {
    operation,
    status: 'success',
    source: compactString(identity.sourceType),
    schemeId: compactString(identity.schemeId),
    buildCode: compactString(identity.buildCode),
    channel: summary.channel,
    details: {
      messageId: receipt.messageId,
      threadId: receipt.threadId,
      messageUrl: receipt.messageUrl,
    },
  });
  return publication;
}
