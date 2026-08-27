export const DISCORD_TAG_ALIASES = Object.freeze({
  mode: Object.freeze({
    OPERATIONS: 'operations',
    WARFARE: 'warfare',
  }),
  productChannel: Object.freeze({
    LI: 'global',
    GA: 'garena',
  }),
  weaponClass: Object.freeze({
    PISTOL: 'pistols',
    'SUBMACHINE GUN': 'smg',
    'ASSAULT RIFLE': 'ar',
    'BATTLE RIFLE': 'br',
    SHOTGUN: 'shotguns',
    'GENERAL MACHINE GUN': 'lmg',
    'LIGHT MACHINE GUN': 'lmg',
    'MACHINE GUN': 'lmg',
    'MARKSMAN RIFLE': 'mr',
    'SNIPER RIFLE': 'sr',
  }),
});

export const DISCORD_TAG_POLICY = Object.freeze({
  exactCount: 3,
  groups: Object.freeze({
    mode: Object.freeze(['operations', 'warfare']),
    productChannel: Object.freeze(['garena', 'global']),
    weaponType: Object.freeze(['pistols', 'smg', 'ar', 'br', 'shotguns', 'lmg', 'mr', 'sr']),
  }),
});

export function deriveDiscordTagAliases({ mode, channel, weaponClass }) {
  const aliases = [
    DISCORD_TAG_ALIASES.mode[String(mode || '').toUpperCase()],
    DISCORD_TAG_ALIASES.productChannel[String(channel || '').toUpperCase()],
    DISCORD_TAG_ALIASES.weaponClass[String(weaponClass || '').toUpperCase()],
  ];
  const missingGroups = ['mode', 'productChannel', 'weaponType'].filter((_, index) => !aliases[index]);
  return {
    aliases: aliases.filter(Boolean),
    status: missingGroups.length ? 'incomplete' : 'complete',
    missingGroups,
  };
}

export function expectedDiscordTagIds(build, channelConfig) {
  const aliases = Array.isArray(build?.discordTagAliases) ? build.discordTagAliases : [];
  if (build?.discordTagMappingStatus !== 'complete' || aliases.length !== 3) {
    throw new Error(`Banner build ${build?.schemeId || 'unknown'} does not have a complete three-tag mapping`);
  }
  const tagMap = channelConfig?.tagMap || {};
  return aliases.map((alias) => {
    const id = String(tagMap[alias] || '');
    if (!/^\d{15,22}$/.test(id)) throw new Error(`Configured Discord tag alias is missing or invalid: ${alias}`);
    return id;
  });
}

export function assertBannerPostTags(build, normalizedPost, channelConfig) {
  if (!normalizedPost?.thread?.name || normalizedPost.thread.id) {
    throw new Error('Weapon publications must create a new forum post so all three Discord tags can be applied');
  }
  const expected = expectedDiscordTagIds(build, channelConfig).sort();
  const actual = [...new Set(normalizedPost.thread.tags || [])].sort();
  if (actual.length !== expected.length || actual.some((id, index) => id !== expected[index])) {
    throw new Error(`Discord tags do not match Banner metadata; expected aliases: ${build.discordTagAliases.join(', ')}`);
  }
  return expected;
}
