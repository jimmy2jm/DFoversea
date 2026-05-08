/**
 * 改枪方案详情 Mock 数据 (PC + 移动端共用)
 * - 提供改枪码、配件清单、每个配件的属性加成/减益
 * - 数据基于 DF Build 真实方案 + 合理 mock 数值
 * - 入口：window.getGunSchemeDetail(schemeKey, fallback)
 */
(function () {
    'use strict';

    // 属性维度（对应真实游戏里的改枪维度）
    // positive: 绿色条, negative: 红色条
    const EFFECT_DIMS = {
        recoil: '后坐力控制',
        handling: '操控速度',
        range: '射程优势',
        stability: '持枪稳定性',
        fireRate: '射速',
        hipfire: '腰际射击精度',
        reload: '换弹时间',
        aimSpeed: '据枪稳定性',
        damage: '伤害衰减',
        mobility: '移动速度'
    };

    function eff(dim, value) {
        return {
            dim,
            label: EFFECT_DIMS[dim] || dim,
            value,
            positive: value > 0
        };
    }

    // 配件图标：按部位
    const SLOT_ICON = {
        muzzle: '◎',
        barrel: '▬',
        optic: '◉',
        grip: '⬡',
        magazine: '▭',
        stock: '⊏',
        handguard: '⊐',
        laser: '✦',
        tactical: '⊕',
        ammo: '◈',
        underbarrel: '◆'
    };

    function att(slot, name, subtitle, price, effects) {
        return {
            slot,
            slotName: slotName(slot),
            name,
            subtitle: subtitle || '',
            price: price || 0,
            icon: SLOT_ICON[slot] || '◯',
            effects: effects || []
        };
    }

    function slotName(slot) {
        const m = {
            muzzle: '枪口',
            barrel: '枪管',
            optic: '瞄具',
            grip: '握把',
            magazine: '弹匣',
            stock: '枪托',
            handguard: '护木',
            laser: '激光',
            tactical: '战术',
            ammo: '弹药',
            underbarrel: '下挂'
        };
        return m[slot] || slot;
    }

    // ──────────────────────────────────────────
    // 方案详情库
    // key: `${gunId}-${cost}` 或 `${gunId}-${cost}-${mode}`
    // author 字段可选，缺省时视为无作者，UI 完全不渲染作者区
    // ──────────────────────────────────────────
    const schemeDetails = {
        // AK-12 性价比（真实参考：150k 零后坐力）
        'ak12-budget': {
            code: 'AK12-OPS-BUDGET-4T7KQ9',
            summary: '150K 成本实现近乎零后坐力，弹药消耗低，身体击杀效率高',
            author: { name: 'Tactical_K', avatar: '' },
            attachments: [
                att('muzzle', '腾龙消音器', '延伸射程 +14m', 23400, [eff('recoil', 12), eff('range', 8), eff('handling', -6)]),
                att('optic', '战术 PK-A 红点', '3x 放大倍率', 18600, [eff('aimSpeed', 10), eff('handling', -4)]),
                att('grip', '轻型垂直握把', '', 12500, [eff('recoil', 7), eff('stability', 5), eff('handling', -3)]),
                att('magazine', 'G3 30 发弹匣', '30 发容量', 16634, [eff('reload', 8), eff('handling', -8)]),
                att('stock', 'BCM 轻量化枪托', '', 15200, [eff('handling', 9), eff('stability', -4)]),
                att('handguard', 'Geissele MK8 护木', '', 21300, [eff('stability', 11), eff('recoil', 6), eff('handling', -5)]),
                att('laser', 'L1 红外激光', '', 8400, [eff('hipfire', 15), eff('aimSpeed', 4)]),
                att('ammo', '7.62×39 增压弹', '首发伤害 +12%', 9800, [eff('damage', 12), eff('recoil', -5)])
            ]
        },
        // AK-12 满改
        'ak12-highend': {
            code: 'AK12-OPS-FULL-9LWN2P',
            summary: '380K 通用满改，增压弹保证首发优势，全距离可用',
            author: { name: 'MetaHunter', avatar: '' },
            attachments: [
                att('muzzle', 'ZenitCo DTK-1 制退器', '', 34800, [eff('recoil', 16), eff('stability', 8), eff('handling', -8)]),
                att('optic', 'HAMR IV 4x 光学镜', '4x 可切换倍率', 42600, [eff('range', 14), eff('aimSpeed', -6)]),
                att('grip', 'Magpul RVG 垂直握把', '', 18700, [eff('stability', 10), eff('recoil', 6)]),
                att('magazine', 'PMAG 40 发弹匣', '40 发超长弹匣', 28900, [eff('reload', 14), eff('handling', -12), eff('mobility', -4)]),
                att('stock', 'SAI 战术枪托', '', 26400, [eff('recoil', 9), eff('stability', 7), eff('handling', -5)]),
                att('handguard', 'Geissele SMR MK15 护木', '', 45200, [eff('stability', 14), eff('recoil', 10), eff('handling', -6)]),
                att('laser', 'PEQ-15 激光指示器', '战术照明 +腰射', 22100, [eff('hipfire', 18), eff('aimSpeed', 6)]),
                att('ammo', '7.62×39 M62 增压弹', '爆头加成 +18%', 16200, [eff('damage', 18), eff('range', 6), eff('recoil', -8)])
            ]
        },

        // AKM
        'akm-budget': {
            code: 'AKM-OPS-BUDGET-6TQ3VK',
            summary: '同级最佳性价比，配件与弹药便宜，近中距压枪友好',
            attachments: [
                att('muzzle', 'AK74 制退器', '', 14800, [eff('recoil', 10), eff('handling', -5)]),
                att('optic', 'PK-AS 红点', '', 11400, [eff('aimSpeed', 8)]),
                att('grip', 'RK-3 前握把', '', 9600, [eff('stability', 7), eff('recoil', 4)]),
                att('magazine', 'AKM 30 发钢弹匣', '', 4800, [eff('reload', 6), eff('mobility', -2)]),
                att('stock', 'Bulgarian 折叠枪托', '', 12200, [eff('handling', 11), eff('stability', -6)]),
                att('handguard', 'B-10M 战术护木', '', 13600, [eff('stability', 9), eff('handling', -4)]),
                att('laser', 'DLP-3R 激光', '', 6800, [eff('hipfire', 13), eff('aimSpeed', 3)]),
                att('ammo', '7.62×39 标准弹', '', 3200, [eff('damage', 6)])
            ]
        },

        // AS Val
        'asval-highend': {
            code: 'ASVAL-OPS-META-KX82GR',
            summary: '游戏内理论最高伤害输出，TTK 0.21 秒',
            attachments: [
                att('barrel', 'AS Val 一体消音管', '集成消音 · 静步增强', 32400, [eff('stability', 12), eff('range', 8), eff('recoil', 10)]),
                att('optic', 'Kobra EKP-8-18 红点', '', 18900, [eff('aimSpeed', 10)]),
                att('grip', 'RK-6 战术握把', '', 14600, [eff('stability', 8), eff('recoil', 5)]),
                att('magazine', 'SP-6 30 发弹匣', '', 22100, [eff('reload', 10), eff('handling', -6)]),
                att('stock', 'AS Val 骨架枪托', '', 17800, [eff('handling', 12), eff('stability', -5)]),
                att('laser', 'PEQ-15 激光', '', 21400, [eff('hipfire', 20), eff('aimSpeed', 8)]),
                att('ammo', '9×39 SP-6 穿甲弹', '穿透 +35%', 12400, [eff('damage', 20), eff('recoil', -6)])
            ]
        },

        // AUG
        'aug-budget': {
            code: 'AUG-OPS-BUDGET-3LXW9B',
            summary: '性价比最高的 5.56 步枪，中远距通用',
            attachments: [
                att('muzzle', 'AUG 消音器', '', 18200, [eff('recoil', 9), eff('range', 6), eff('handling', -4)]),
                att('optic', 'AUG 1.5x 集成镜', '', 0, [eff('aimSpeed', 6)]),
                att('grip', '折叠前握把', '', 8400, [eff('stability', 5), eff('recoil', 3)]),
                att('magazine', 'AUG 30 发弹匣', '', 6200, [eff('reload', 5)]),
                att('handguard', 'Bullpup 战术护木', '', 12800, [eff('stability', 8), eff('handling', -4)]),
                att('laser', 'M3X 激光', '', 8900, [eff('hipfire', 12), eff('aimSpeed', 4)]),
                att('ammo', '5.56 NATO 普通弹', '', 2400, [eff('damage', 4)])
            ]
        },

        // CI-19
        'ci19-highend': {
            code: 'CI19-OPS-META-8P4HNY',
            summary: '本赛季 Meta，腾龙消音器延伸射程至 54m',
            author: { name: 'DeltaPro_Lin', avatar: '' },
            attachments: [
                att('muzzle', '腾龙一体消音管', '有效射程 +14m', 36200, [eff('range', 16), eff('recoil', 10), eff('handling', -8)]),
                att('optic', 'ELCAN SpecterDR 4x', '可切换倍率', 42800, [eff('range', 12), eff('aimSpeed', -5)]),
                att('grip', 'SureFire 垂直握把', '', 19400, [eff('stability', 10), eff('recoil', 6)]),
                att('magazine', 'CI-19 30 发快拔弹匣', '', 18700, [eff('reload', 12), eff('handling', -6)]),
                att('stock', 'Magpul PRS GEN3 枪托', '', 28900, [eff('stability', 12), eff('handling', -8)]),
                att('handguard', 'Geissele MK16 SMR 13.5"', '', 38400, [eff('stability', 14), eff('recoil', 8)]),
                att('laser', 'PEQ-15 激光', '', 21400, [eff('hipfire', 16), eff('aimSpeed', 6)]),
                att('ammo', '6.8×51 Hybrid 增压弹', '', 16800, [eff('damage', 22), eff('range', 8), eff('recoil', -10)])
            ]
        },

        // M4A1
        'm4a1-budget': {
            code: 'M4A1-OPS-BUDGET-2KNXQ7',
            summary: '几乎无水平后坐力，新手友好，85K 通用配置',
            author: { name: 'Operator_Rex', avatar: '' },
            attachments: [
                att('muzzle', 'AAC Ranger 消音器', '', 19400, [eff('recoil', 11), eff('range', 6), eff('handling', -5)]),
                att('optic', 'Aimpoint M5 红点', '', 16800, [eff('aimSpeed', 10)]),
                att('grip', 'Magpul RVG 垂直握把', '', 11200, [eff('stability', 7), eff('recoil', 5)]),
                att('magazine', 'M4 30 发弹匣', '', 5600, [eff('reload', 6)]),
                att('stock', 'Magpul CTR 枪托', '', 12400, [eff('handling', 9), eff('stability', 4)]),
                att('handguard', 'Daniel Defense MK18 护木', '', 16200, [eff('stability', 9), eff('recoil', 5), eff('handling', -3)]),
                att('laser', 'L1 激光', '', 7200, [eff('hipfire', 13), eff('aimSpeed', 5)]),
                att('ammo', '5.56 NATO M855', '穿甲弹', 4200, [eff('damage', 8), eff('range', 4)])
            ]
        },
        'm4a1-highend': {
            code: 'M4A1-OPS-FULL-8XV2MK',
            summary: '157K 满改，长距离高精准，全距离稳定',
            author: { name: 'GhostTeam', avatar: '' },
            attachments: [
                att('muzzle', 'SureFire SOCOM 消音器', '', 32600, [eff('recoil', 14), eff('range', 10), eff('stability', 6), eff('handling', -8)]),
                att('optic', 'Trijicon ACOG 4x', '4x 固定倍率', 38400, [eff('range', 14), eff('aimSpeed', -8)]),
                att('grip', 'BCM Gunfighter 握把', '', 14800, [eff('stability', 9), eff('recoil', 5)]),
                att('magazine', 'PMAG 40 发弹匣', '40 发', 24600, [eff('reload', 12), eff('handling', -10), eff('mobility', -4)]),
                att('stock', 'LUTH-AR MBA-3 枪托', '', 22400, [eff('stability', 11), eff('handling', -5)]),
                att('handguard', 'Geissele MK8 13.5"', '', 36800, [eff('stability', 13), eff('recoil', 9)]),
                att('laser', 'PEQ-15 激光指示器', '', 22100, [eff('hipfire', 16), eff('aimSpeed', 6)]),
                att('ammo', '5.56 Mk262 Mod1', '高精度弹', 14200, [eff('damage', 14), eff('range', 8), eff('recoil', -6)])
            ]
        },

        // M7
        'm7-highend': {
            code: 'M7-OPS-META-7NHQ3V',
            summary: '65m 四枪爆头（4BTK）王牌',
            attachments: [
                att('muzzle', 'XM7 制退器', '', 28400, [eff('recoil', 14), eff('stability', 8), eff('handling', -6)]),
                att('optic', 'Vortex XM157 智能瞄具', '弹道补偿', 58200, [eff('range', 18), eff('aimSpeed', -10)]),
                att('grip', 'M-LOK 垂直握把', '', 18400, [eff('stability', 10), eff('recoil', 6)]),
                att('magazine', 'M7 25 发弹匣', '', 22600, [eff('reload', 10), eff('handling', -8)]),
                att('stock', 'SIG MCX Spear 枪托', '', 26800, [eff('stability', 12), eff('handling', -5)]),
                att('laser', 'DBAL-A2 激光', '', 24800, [eff('hipfire', 14), eff('aimSpeed', 4)]),
                att('ammo', '6.8×51 SIG Fury', '极高穿甲', 17600, [eff('damage', 24), eff('range', 10), eff('recoil', -8)])
            ]
        },

        // MP5
        'mp5-budget': {
            code: 'MP5-OPS-BUDGET-5HP3NQ',
            summary: '经典腰射构建，一体式消音管性价比极高',
            author: { name: 'CQB_Master', avatar: '' },
            attachments: [
                att('barrel', 'MP5 一体消音管', '', 21400, [eff('stability', 10), eff('recoil', 8), eff('range', 5), eff('handling', -4)]),
                att('optic', 'HK 标准机械瞄具', '', 0, [eff('aimSpeed', 4)]),
                att('grip', 'MP5 垂直握把', '', 8600, [eff('stability', 6), eff('recoil', 4)]),
                att('magazine', 'MP5 30 发弹匣', '', 3800, [eff('reload', 5)]),
                att('stock', 'MP5 伸缩枪托', '', 11200, [eff('handling', 12), eff('stability', -4)]),
                att('laser', 'DLP-2 激光', '', 6400, [eff('hipfire', 18), eff('aimSpeed', 6)]),
                att('ammo', '9×19 Parabellum', '', 2800, [eff('damage', 5)])
            ]
        },
        'mp5-highend': {
            code: 'MP5-OPS-FULL-9VWM2P',
            summary: 'CQB 腰射之王，高腰射精度，近战无敌',
            attachments: [
                att('muzzle', 'B&T Rotex 消音器', '', 24800, [eff('recoil', 11), eff('stability', 8), eff('handling', -3)]),
                att('optic', 'EOTech XPS3 全息', '', 28400, [eff('aimSpeed', 12), eff('hipfire', 6)]),
                att('grip', 'MP5 HK 垂直握把', '', 11600, [eff('stability', 8), eff('recoil', 5)]),
                att('magazine', 'MP5 40 发弹匣', '', 14800, [eff('reload', 10), eff('handling', -8)]),
                att('stock', 'Magpul SL 枪托', '', 18200, [eff('handling', 10), eff('stability', 4)]),
                att('laser', 'Streamlight TLR-8 激光', '', 14200, [eff('hipfire', 22), eff('aimSpeed', 8)]),
                att('ammo', '9mm +P 增压弹', '', 6400, [eff('damage', 10), eff('recoil', -4)])
            ]
        },

        // Vector
        'vector-highend': {
            code: 'VECTOR-OPS-DPS-3M7QXL',
            summary: '游戏内最高 DPS，打腿流派 0.32 秒击杀',
            author: { name: 'DPS_King', avatar: '' },
            attachments: [
                att('muzzle', 'SilencerCo Octane 消音器', '', 24600, [eff('recoil', 10), eff('stability', 7)]),
                att('optic', 'Holosun 510C 全息', '', 22800, [eff('aimSpeed', 14)]),
                att('grip', 'Magpul AFG 前握把', '', 10400, [eff('stability', 7), eff('recoil', 4)]),
                att('magazine', 'Glock 33 发延长弹匣', '', 18400, [eff('reload', 12), eff('handling', -8)]),
                att('stock', 'KRISS Vector 折叠枪托', '', 16800, [eff('handling', 14), eff('stability', -4)]),
                att('laser', 'Inforce WML 激光', '', 14200, [eff('hipfire', 20), eff('aimSpeed', 8)]),
                att('ammo', '.45 ACP +P', '高初速', 8400, [eff('damage', 12), eff('recoil', -5)])
            ]
        },

        // PKM
        'pkm-highend': {
            code: 'PKM-OPS-SUPPRESS-4NV8QM',
            summary: '顶级伤害输出，75 发基础弹匣，压制流首选',
            attachments: [
                att('muzzle', 'PKM 消音器', '', 26400, [eff('recoil', 12), eff('range', 8), eff('handling', -6)]),
                att('optic', '1P78 3.5x 瞄具', '', 18200, [eff('range', 10), eff('aimSpeed', -4)]),
                att('grip', 'RK-2 战术握把', '', 12600, [eff('stability', 8), eff('recoil', 5)]),
                att('magazine', 'PKM 100 发弹鼓', '100 发', 36800, [eff('reload', 8), eff('handling', -14), eff('mobility', -6)]),
                att('stock', 'PKM 木质枪托', '', 8400, [eff('stability', 6)]),
                att('handguard', 'PKM 战术护木', '', 14600, [eff('stability', 10), eff('recoil', 6), eff('handling', -4)]),
                att('laser', 'DBAL-PL 激光', '', 18400, [eff('hipfire', 12), eff('aimSpeed', 4)]),
                att('ammo', '7.62×54R 强化弹', '', 11200, [eff('damage', 18), eff('range', 8), eff('recoil', -6)])
            ]
        }
    };

    // ──────────────────────────────────────────
    // 通用 mock 生成（无匹配 key 时回退）
    // ──────────────────────────────────────────
    function buildFallbackDetail(meta) {
        const cost = meta.cost || 'balanced';
        const base = {
            budget: {
                summaryTpl: '85K 成本通用配置，适合过渡期快速提升稳定性',
                multiplier: 1.0
            },
            balanced: {
                summaryTpl: '120K 均衡配置，各距离均有不俗表现',
                multiplier: 1.3
            },
            highend: {
                summaryTpl: '157K 满改方案，长距精准输出',
                multiplier: 1.6
            }
        }[cost] || { summaryTpl: '通用推荐配置', multiplier: 1.2 };

        const m = base.multiplier;
        const code = meta.code || `${(meta.gunId || 'GUN').toUpperCase()}-${cost.toUpperCase()}-MOCK`;

        return {
            code,
            summary: base.summaryTpl,
            attachments: [
                att('muzzle', '战术消音器', '', Math.round(18000 * m), [eff('recoil', Math.round(10 * m)), eff('range', Math.round(6 * m)), eff('handling', -4)]),
                att('optic', '全息瞄准镜', '', Math.round(16000 * m), [eff('aimSpeed', Math.round(10 * m)), eff('handling', -3)]),
                att('grip', '垂直握把', '', Math.round(10000 * m), [eff('stability', Math.round(7 * m)), eff('recoil', Math.round(5 * m))]),
                att('magazine', '标准 30 发弹匣', '', Math.round(6000 * m), [eff('reload', Math.round(6 * m)), eff('handling', -4)]),
                att('stock', '战术枪托', '', Math.round(12000 * m), [eff('handling', Math.round(9 * m)), eff('stability', -3)]),
                att('handguard', '战术护木', '', Math.round(14000 * m), [eff('stability', Math.round(8 * m)), eff('recoil', Math.round(4 * m)), eff('handling', -3)]),
                att('laser', '红外激光', '', Math.round(8000 * m), [eff('hipfire', Math.round(14 * m)), eff('aimSpeed', Math.round(4 * m))]),
                att('ammo', '增压弹', '', Math.round(6000 * m), [eff('damage', Math.round(10 * m)), eff('recoil', -4)])
            ]
        };
    }

    // 缺省作者：当某个方案未提供 author 时统一展示 DF 官方
    const DEFAULT_AUTHOR = {
        name: 'DF 官方',
        avatar: '',
        official: true
    };

    /**
     * 对外入口
     * @param {Object} meta  {gunId, gunName, cost, code, name, tags, price}
     * @returns {Object}     {code, summary, attachments, totalPrice, author}
     */
    function getGunSchemeDetail(meta) {
        meta = meta || {};
        const gunId = (meta.gunId || '').toLowerCase();
        const cost = meta.cost || 'balanced';
        const key = `${gunId}-${cost}`;
        const matched = schemeDetails[key];
        const raw = matched || buildFallbackDetail(meta);

        const attachments = (raw.attachments || []).map(a => ({ ...a }));
        const totalPrice = attachments.reduce((sum, a) => sum + (a.price || 0), 0);

        return {
            code: raw.code || meta.code || 'MOCK-CODE',
            summary: raw.summary || '',
            attachments,
            totalPrice,
            author: raw.author || { ...DEFAULT_AUTHOR }
        };
    }

    /**
     * 仅取作者信息（供卡片粒度使用，无需完整 detail）
     * @param {Object} meta {gunId, cost}
     * @returns {Object} {name, avatar, official?} 永不返回 null，无匹配时回退到 DF 官方
     */
    function getGunSchemeAuthor(meta) {
        meta = meta || {};
        const gunId = (meta.gunId || '').toLowerCase();
        const cost = meta.cost || 'balanced';
        const key = `${gunId}-${cost}`;
        const matched = schemeDetails[key];
        if (matched && matched.author) return matched.author;
        return { ...DEFAULT_AUTHOR };
    }

    // ──────────────────────────────────────────
    // 方案点赞 / 复制次数
    // - 基线：自定义方案 800~3500、官方方案 100~500
    // - 本地增量：保存在 localStorage，渲染时叠加
    // - 点赞：未登录也允许（写入本地）
    // ──────────────────────────────────────────
    const STATS_LOCAL_KEY = 'df-scheme-stats-v1';
    const LIKE_LOCAL_KEY = 'df-scheme-likes-v1';

    function readLocalStats() {
        try { return JSON.parse(localStorage.getItem(STATS_LOCAL_KEY) || '{}'); } catch (e) { return {}; }
    }
    function writeLocalStats(obj) {
        try { localStorage.setItem(STATS_LOCAL_KEY, JSON.stringify(obj)); } catch (e) {}
    }
    function readLocalLikes() {
        try { return JSON.parse(localStorage.getItem(LIKE_LOCAL_KEY) || '{}'); } catch (e) { return {}; }
    }
    function writeLocalLikes(obj) {
        try { localStorage.setItem(LIKE_LOCAL_KEY, JSON.stringify(obj)); } catch (e) {}
    }

    // 简单稳定的字符串 hash → 用于给 mock 基线生成"看起来真实"的伪随机数
    function strHash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        return Math.abs(h);
    }

    // 基线：被 mock 的方案给较高数值，未 mock（DF 官方兜底）给较低数值
    function getStatsBaseline(meta) {
        const gunId = (meta.gunId || '').toLowerCase();
        const cost = meta.cost || 'balanced';
        const key = `${gunId}-${cost}`;
        const matched = !!schemeDetails[key];
        const seed = strHash(key);
        if (matched) {
            return {
                likes: 800 + (seed % 2700),       // 800 ~ 3500
                copies: 5000 + (seed * 7 % 15000) // 5000 ~ 20000
            };
        }
        return {
            likes: 100 + (seed % 400),     // 100 ~ 500
            copies: 800 + (seed * 7 % 2200) // 800 ~ 3000
        };
    }

    /**
     * 取方案 stats（基线 + 本地增量）
     * @returns {{likes:number, copies:number, likedByMe:boolean}}
     */
    function getGunSchemeStats(meta) {
        meta = meta || {};
        const key = `${(meta.gunId || '').toLowerCase()}-${meta.cost || 'balanced'}`;
        const baseline = getStatsBaseline(meta);
        const local = readLocalStats()[key] || { likes: 0, copies: 0 };
        const likedByMe = !!readLocalLikes()[key];
        return {
            likes: baseline.likes + (local.likes || 0),
            copies: baseline.copies + (local.copies || 0),
            likedByMe
        };
    }

    /**
     * 切换点赞状态（本地）。返回切换后的 stats 快照
     */
    function toggleGunSchemeLike(meta) {
        const key = `${(meta.gunId || '').toLowerCase()}-${meta.cost || 'balanced'}`;
        const likes = readLocalLikes();
        const stats = readLocalStats();
        const cur = stats[key] || { likes: 0, copies: 0 };
        if (likes[key]) {
            delete likes[key];
            cur.likes = (cur.likes || 0) - 1;
        } else {
            likes[key] = 1;
            cur.likes = (cur.likes || 0) + 1;
        }
        stats[key] = cur;
        writeLocalLikes(likes);
        writeLocalStats(stats);
        return getGunSchemeStats(meta);
    }

    /**
     * 复制次数 +1（本地）。返回最新 stats 快照
     */
    function incrementGunSchemeCopy(meta) {
        const key = `${(meta.gunId || '').toLowerCase()}-${meta.cost || 'balanced'}`;
        const stats = readLocalStats();
        const cur = stats[key] || { likes: 0, copies: 0 };
        cur.copies = (cur.copies || 0) + 1;
        stats[key] = cur;
        writeLocalStats(stats);
        return getGunSchemeStats(meta);
    }

    /**
     * 数字简化格式化：1284 → "1.2K"，10800 → "10.8K"，1500000 → "1.5M"
     */
    function formatStatNumber(n) {
        if (typeof n !== 'number' || isNaN(n)) return '0';
        if (n < 1000) return String(n);
        if (n < 1000000) {
            const v = n / 1000;
            return (v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')) + 'K';
        }
        const v = n / 1000000;
        return (v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')) + 'M';
    }

    window.getGunSchemeDetail = getGunSchemeDetail;
    window.getGunSchemeAuthor = getGunSchemeAuthor;
    window.getGunSchemeStats = getGunSchemeStats;
    window.toggleGunSchemeLike = toggleGunSchemeLike;
    window.incrementGunSchemeCopy = incrementGunSchemeCopy;
    window.formatStatNumber = formatStatNumber;
})();
