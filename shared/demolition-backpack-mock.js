/**
 * 爆破模式 - 背包码（出装预设）Mock 数据
 *
 * 口径见《爆破交互参考/爆破模式理解与网页端规划基线.md》第 10 节：
 * - 1 套背包 = 16 把枪（手枪 / 标准 / 精锐 / 特种 × 各 4 把，恒为 4×4，无空位）
 * - points 为局内积分价格，区间约 100-10000
 * - buildCode 为单枪改枪码占位串；标配手枪（stock: true）无改枪码，buildCode 为 null
 * - code 为背包码占位串；两类码的正式编码格式待正式开发时定义
 */
(function () {
    'use strict';

    var TIERS = ['pistol', 'standard', 'elite', 'special'];

    // 枪械池：按级别分组。stock: true 表示官方标配（无改枪码）
    var GUN_POOL = {
        pistol: [
            { name: 'G17-标配', points: 140, stock: true },
            { name: '93R-三连发', points: 400 },
            { name: 'G18-开镜', points: 540 },
            { name: '沙漠之鹰-开镜爆头', points: 800 },
            { name: 'M1911-迅捷拔枪', points: 320 },
            { name: 'P226-均衡改', points: 460 }
        ],
        standard: [
            { name: '725双管霰弹枪-高爆发秒人', points: 1300 },
            { name: 'MP5-性价比', points: 1400 },
            { name: 'QBZ95-1-优质战士', points: 1740 },
            { name: '杠杆式步枪-高伤犀牛', points: 1800 },
            { name: 'UZI-贴身扫射', points: 1150 },
            { name: 'M870-破门重锤', points: 1250 },
            { name: 'AKS-74U-短突改', points: 1680 }
        ],
        elite: [
            { name: 'QJB201-步枪改', points: 2580 },
            { name: 'MK4-三连发', points: 2740 },
            { name: 'M700-高弹速', points: 2800 },
            { name: '腾龙突击步枪-高速导气', points: 2800 },
            { name: 'Vector-腰射之王', points: 2460 },
            { name: 'SCAR-H-重管远程改', points: 2960 }
        ],
        special: [
            { name: 'K416-三高改枪', points: 3500 },
            { name: 'AS Val-碎甲达人', points: 3660 },
            { name: 'M7-提丰', points: 4880 },
            { name: 'AWM-露娜秒', points: 5480 },
            { name: 'M4A1-满改突击', points: 3980 },
            { name: 'PKM-火力封锁', points: 5200 }
        ]
    };

    // 背包定义：picks 为各级别在 GUN_POOL 中的下标（每级恰好 4 把）
    // author 为主播信息（platform 预留平台标识，原型期统一 douyin）；intro 为一句话介绍
    var PACKS = [
        { id: 'daoju-yazhi', name: '道具压制流', author: { name: '老K', avatar: '', platform: 'douyin' }, intro: '道具开路，枪线收尾，节奏由你掌控。', picks: { pistol: [0, 1, 2, 3], standard: [0, 1, 2, 3], elite: [0, 1, 2, 3], special: [0, 1, 2, 3] } },
        { id: 'zhongyuan-jiqiang', name: '中远架枪流', author: { name: '夜枭', avatar: '', platform: 'douyin' }, intro: '把每一道过点，都变成对手的鬼门关。', picks: { pistol: [0, 2, 3, 5], standard: [2, 3, 6, 1], elite: [2, 5, 1, 3], special: [3, 1, 4, 2] } },
        { id: 'yaoshe-chongfeng', name: '腰射冲锋流', author: { name: '阿茶', avatar: '', platform: 'douyin' }, intro: '不开镜，不减速，冲进点里就是输出。', picks: { pistol: [0, 4, 2, 1], standard: [4, 1, 5, 6], elite: [4, 1, 0, 3], special: [2, 0, 5, 4] } },
        { id: 'yangshi-qingtu', name: '杨氏清图流', author: { name: '老杨', avatar: '', platform: 'douyin' }, intro: '一张图一套枪，按部就班清干净。', picks: { pistol: [0, 3, 1, 5], standard: [1, 2, 0, 6], elite: [3, 0, 2, 5], special: [4, 3, 1, 0] } },
        { id: 'juji-zhuanjing', name: '狙击专精流', author: { name: '白鲨', avatar: '', platform: 'douyin' }, intro: '一枪定音，狙击手的全套出装答案。', picks: { pistol: [0, 3, 5, 2], standard: [3, 2, 6, 0], elite: [2, 5, 3, 1], special: [3, 2, 1, 5] } },
        { id: 'jinzhan-tupo', name: '近战突破流', author: { name: '陌刀', avatar: '', platform: 'douyin' }, intro: '霰弹与冲锋枪的近身艺术。', picks: { pistol: [0, 4, 1, 2], standard: [0, 4, 5, 1], elite: [4, 0, 1, 3], special: [0, 5, 2, 4] } },
        { id: 'jingji-yunying', name: '经济运营流', author: { name: '一诺', avatar: '', platform: 'douyin' }, intro: '每一分都花在刀刃上，滚起经济雪球。', picks: { pistol: [0, 4, 5, 1], standard: [4, 5, 0, 1], elite: [0, 1, 4, 2], special: [0, 4, 1, 2] } },
        { id: 'quanneng-junheng', name: '全能均衡流', author: { name: '青野', avatar: '', platform: 'douyin' }, intro: '没有短板的出装曲线，适配任何局势。', picks: { pistol: [0, 5, 1, 2], standard: [1, 2, 5, 6], elite: [1, 3, 0, 5], special: [4, 0, 2, 1] } },
        { id: 'zhonghuoli-zhiyuan', name: '重火力支援流', author: { name: '老猫', avatar: '', platform: 'douyin' }, intro: '机枪架住，火力覆盖，队友只管推进。', picks: { pistol: [0, 2, 3, 1], standard: [2, 3, 0, 6], elite: [0, 3, 5, 2], special: [5, 2, 3, 0] } },
        { id: 'wuming-shentou', name: '无名渗透流', author: { name: '安澜', avatar: '', platform: 'douyin' }, intro: '爆破场上钢枪是道，无名潜袭亦为道。不拼枪法，专弈人心，此乃无名渗透流！', picks: { pistol: [0, 5, 4, 1], standard: [1, 6, 2, 4], elite: [1, 4, 2, 0], special: [1, 0, 4, 3] } },
        { id: 'sugong-youji', name: '速攻游击流', author: { name: '北岛', avatar: '', platform: 'douyin' }, intro: '打完就跑，节奏至上，让对手永远慢半拍。', picks: { pistol: [0, 1, 4, 2], standard: [4, 6, 1, 0], elite: [4, 3, 1, 0], special: [2, 4, 0, 5] } },
        { id: 'canju-dashi', name: '残局大师流', author: { name: '孤舟', avatar: '', platform: 'douyin' }, intro: '1vN 不是绝境，是你的主场。', picks: { pistol: [0, 3, 2, 5], standard: [2, 1, 3, 5], elite: [2, 3, 5, 1], special: [3, 5, 4, 2] } }
    ];

    function hashCode(str) {
        var h = 0;
        for (var i = 0; i < str.length; i++) {
            h = (h * 31 + str.charCodeAt(i)) >>> 0;
        }
        var s = h.toString(36).toUpperCase();
        while (s.length < 5) s = '0' + s;
        return s.slice(0, 5);
    }

    var TIER_CODE = { pistol: 'P', standard: 'S', elite: 'E', special: 'X' };

    function makeBuildCode(packId, tier, slotIdx, gunName) {
        return 'DFBP-' + packId.toUpperCase().replace(/-/g, '') + '-' + TIER_CODE[tier] + (slotIdx + 1) + '-' + hashCode(gunName + packId);
    }

    function buildSlots(pack) {
        var slots = [];
        TIERS.forEach(function (tier) {
            pack.picks[tier].forEach(function (gunIdx, slotIdx) {
                var gun = GUN_POOL[tier][gunIdx];
                slots.push({
                    tier: tier,
                    name: gun.name,
                    points: gun.points,
                    buildCode: gun.stock ? null : makeBuildCode(pack.id, tier, slotIdx, gun.name)
                });
            });
        });
        return slots;
    }

    window.demolitionBackpacks = PACKS.map(function (p) {
        return {
            id: p.id,
            name: p.name,
            author: p.author,
            intro: p.intro,
            code: 'DFBP-' + p.id.toUpperCase().replace(/-/g, '') + '-16GUN-' + hashCode(p.name),
            slots: buildSlots(p)
        };
    });
})();
