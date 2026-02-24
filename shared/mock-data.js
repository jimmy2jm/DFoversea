// ============================================
// 模拟数据文件
// ============================================

// 交易物价数据 - 全量列表（每个分类包含涨跌物品混合）
const marketPriceDataFull = {
    // 枪械分类
    guns: [
        { name: 'SCAR-H', price: 85000, change: 6.8, positive: true, rarity: 'red' },
        { name: 'M4A1', price: 42000, change: 4.5, positive: true, rarity: 'purple' },
        { name: 'VSS', price: 38000, change: 3.2, positive: true, rarity: 'purple' },
        { name: 'MP5', price: 18000, change: 2.1, positive: true, rarity: 'blue' },
        { name: 'Glock 17', price: 5500, change: 1.5, positive: true, rarity: 'green' },
        { name: 'AK-74M', price: 28000, change: -3.2, positive: false, rarity: 'purple' },
        { name: 'SKS', price: 22000, change: -2.5, positive: false, rarity: 'blue' },
        { name: 'PP-19', price: 12000, change: -1.8, positive: false, rarity: 'blue' },
        { name: 'P226', price: 4800, change: -1.2, positive: false, rarity: 'green' },
        { name: 'Mosin', price: 35000, change: -0.9, positive: false, rarity: 'purple' },
        { name: 'HK416', price: 72000, change: 5.1, positive: true, rarity: 'red' },
        { name: 'SR-25', price: 95000, change: 8.2, positive: true, rarity: 'red' },
        { name: 'UMP-45', price: 15000, change: -2.3, positive: false, rarity: 'blue' },
        { name: 'KRISS Vector', price: 48000, change: 3.7, positive: true, rarity: 'purple' },
        { name: 'M1911', price: 3800, change: -0.6, positive: false, rarity: 'green' }
    ],
    // 装备分类
    armor: [
        { name: '6级防弹插板', price: 68000, change: 12.5, positive: true, rarity: 'red' },
        { name: 'Ops-Core头盔', price: 45000, change: 7.3, positive: true, rarity: 'purple' },
        { name: 'THORAX背心', price: 52000, change: 5.8, positive: true, rarity: 'purple' },
        { name: '战术背包', price: 18000, change: 3.2, positive: true, rarity: 'blue' },
        { name: '3级头盔', price: 12000, change: 2.1, positive: true, rarity: 'blue' },
        { name: '3级防弹插板', price: 15600, change: -2.8, positive: false, rarity: 'blue' },
        { name: '2级头盔', price: 5500, change: -2.1, positive: false, rarity: 'green' },
        { name: '轻型背包', price: 3200, change: -1.5, positive: false, rarity: 'green' },
        { name: '战术腰带', price: 8900, change: -1.2, positive: false, rarity: 'blue' },
        { name: '护目镜', price: 1800, change: -0.8, positive: false, rarity: 'white' },
        { name: 'DAR突击手胸挂', price: 38000, change: 4.5, positive: true, rarity: 'purple' },
        { name: '5级防弹插板', price: 42000, change: -1.9, positive: false, rarity: 'purple' },
        { name: 'FAST头盔', price: 55000, change: 6.2, positive: true, rarity: 'red' },
        { name: '大容量战术背包', price: 28000, change: 3.8, positive: true, rarity: 'blue' },
        { name: '夜视仪', price: 125000, change: -3.5, positive: false, rarity: 'red' }
    ],
    // 配件分类
    parts: [
        { name: 'PMAG D-60弹鼓', price: 12300, change: 5.2, positive: true, rarity: 'purple' },
        { name: '消音器', price: 8500, change: 4.1, positive: true, rarity: 'blue' },
        { name: '4倍镜', price: 15000, change: 3.8, positive: true, rarity: 'purple' },
        { name: '激光指示器', price: 6200, change: 2.9, positive: true, rarity: 'blue' },
        { name: '垂直握把', price: 3500, change: 1.8, positive: true, rarity: 'green' },
        { name: '红点瞄准镜', price: 3200, change: -1.9, positive: false, rarity: 'green' },
        { name: '枪托', price: 2800, change: -1.5, positive: false, rarity: 'green' },
        { name: '弹匣', price: 1500, change: -1.2, positive: false, rarity: 'white' },
        { name: '手电筒', price: 2200, change: -0.9, positive: false, rarity: 'green' },
        { name: '护木', price: 4500, change: -0.6, positive: false, rarity: 'blue' },
        { name: 'OLIGHT手电', price: 18500, change: 8.3, positive: true, rarity: 'purple' },
        { name: 'DBAL激光镭指', price: 22000, change: 6.5, positive: true, rarity: 'purple' },
        { name: '8倍狙击镜', price: 35000, change: -2.2, positive: false, rarity: 'purple' },
        { name: 'Zenit枪托', price: 9800, change: 2.4, positive: true, rarity: 'blue' },
        { name: '斜握把', price: 2100, change: -0.4, positive: false, rarity: 'green' }
    ],
    // 收集品分类
    collect: [
        { name: '动力电池组', price: 52000, change: 15.2, positive: true, rarity: 'red' },
        { name: '金块', price: 38500, change: 8.7, positive: true, rarity: 'red' },
        { name: '加密U盘', price: 45000, change: 3.9, positive: true, rarity: 'red' },
        { name: '铱星电话', price: 42000, change: 3.5, positive: true, rarity: 'red' },
        { name: '稀有芯片', price: 28000, change: 2.8, positive: true, rarity: 'purple' },
        { name: '螺丝刀', price: 1200, change: -3.5, positive: false, rarity: 'white' },
        { name: '电子元件', price: 2800, change: -2.2, positive: false, rarity: 'green' },
        { name: '工具箱', price: 5500, change: -1.8, positive: false, rarity: 'blue' },
        { name: '电路板', price: 3800, change: -1.4, positive: false, rarity: 'green' },
        { name: '润滑油', price: 950, change: -0.9, positive: false, rarity: 'white' },
        { name: '黄金瞪羚', price: 180000, change: 12.8, positive: true, rarity: 'red' },
        { name: '克劳迪乌斯半身像', price: 165000, change: 9.5, positive: true, rarity: 'red' },
        { name: '棘龙爪化石', price: 142000, change: -4.2, positive: false, rarity: 'red' },
        { name: '奥莉薇娅香槟', price: 88000, change: 5.6, positive: true, rarity: 'red' },
        { name: '内存条', price: 8500, change: -1.1, positive: false, rarity: 'blue' },
        { name: '亮闪闪的海盗金币', price: 125000, change: 7.3, positive: true, rarity: 'red' },
        { name: '呼吸机', price: 95000, change: -2.8, positive: false, rarity: 'red' }
    ],
    // 医疗品分类
    medical: [
        { name: '军用急救包', price: 8900, change: 4.8, positive: true, rarity: 'blue' },
        { name: '肾上腺素', price: 12000, change: 3.5, positive: true, rarity: 'purple' },
        { name: '手术刀套装', price: 15000, change: 2.9, positive: true, rarity: 'purple' },
        { name: '高级止血带', price: 4500, change: 2.2, positive: true, rarity: 'blue' },
        { name: '生理盐水', price: 1800, change: 1.5, positive: true, rarity: 'green' },
        { name: '普通绷带', price: 850, change: -5.3, positive: false, rarity: 'white' },
        { name: '止痛药', price: 2100, change: -4.1, positive: false, rarity: 'green' },
        { name: '碘酒', price: 650, change: -2.8, positive: false, rarity: 'white' },
        { name: '纱布', price: 450, change: -1.9, positive: false, rarity: 'white' },
        { name: '创可贴', price: 280, change: -1.2, positive: false, rarity: 'white' },
        { name: '吗啡注射器', price: 18000, change: 6.2, positive: true, rarity: 'purple' },
        { name: '血浆袋', price: 25000, change: -3.5, positive: false, rarity: 'purple' },
        { name: '医疗箱', price: 32000, change: 4.1, positive: true, rarity: 'purple' },
        { name: '抗生素', price: 3200, change: -0.7, positive: false, rarity: 'green' },
        { name: '营养粥罐头', price: 1500, change: 0.8, positive: true, rarity: 'green' }
    ],
    // 弹药分类
    ammo: [
        { name: '7.62x51mm AP', price: 850, change: 6.2, positive: true, rarity: 'purple' },
        { name: '5.56x45mm M995', price: 620, change: 4.5, positive: true, rarity: 'blue' },
        { name: '9x19mm AP', price: 280, change: 3.1, positive: true, rarity: 'blue' },
        { name: '12号霰弹', price: 150, change: 2.2, positive: true, rarity: 'green' },
        { name: '5.45x39mm BP', price: 380, change: 1.8, positive: true, rarity: 'blue' },
        { name: '9x19mm FMJ', price: 85, change: -3.2, positive: false, rarity: 'white' },
        { name: '5.56x45mm FMJ', price: 120, change: -2.5, positive: false, rarity: 'white' },
        { name: '7.62x39mm PS', price: 95, change: -1.8, positive: false, rarity: 'white' },
        { name: '.45 ACP', price: 110, change: -1.2, positive: false, rarity: 'green' },
        { name: '12号鹿弹', price: 80, change: -0.8, positive: false, rarity: 'white' },
        { name: '.338 Lapua Magnum', price: 1200, change: 7.5, positive: true, rarity: 'purple' },
        { name: '7.62x54mmR', price: 320, change: -1.5, positive: false, rarity: 'green' },
        { name: '9x39mm SP-6', price: 580, change: 2.8, positive: true, rarity: 'blue' },
        { name: '5.7x28mm SS190', price: 450, change: -0.5, positive: false, rarity: 'blue' },
        { name: '300 AAC Blackout', price: 680, change: 3.3, positive: true, rarity: 'blue' }
    ]
};

// 生成全部分类数据（汇总所有筛选项）- 用于内页全量列表
marketPriceDataFull.all = [
    ...marketPriceDataFull.guns,
    ...marketPriceDataFull.armor,
    ...marketPriceDataFull.parts,
    ...marketPriceDataFull.collect,
    ...marketPriceDataFull.medical,
    ...marketPriceDataFull.ammo
];

// 交易物价数据 - 涨跌榜分离（用于首页/工具页展示）
const marketPriceData = {};

// 生成涨跌榜分离数据
function generateRankData(items, category) {
    const riseItems = items.filter(item => item.positive).sort((a, b) => b.change - a.change).slice(0, 5);
    const fallItems = items.filter(item => !item.positive).sort((a, b) => a.change - b.change).slice(0, 5);
    
    marketPriceData[`${category}_rise`] = riseItems;
    marketPriceData[`${category}_fall`] = fallItems;
}

// 为每个分类生成涨跌榜
generateRankData(marketPriceDataFull.guns, 'guns');
generateRankData(marketPriceDataFull.armor, 'armor');
generateRankData(marketPriceDataFull.parts, 'parts');
generateRankData(marketPriceDataFull.collect, 'collect');
generateRankData(marketPriceDataFull.medical, 'medical');
generateRankData(marketPriceDataFull.ammo, 'ammo');

// 全部分类的涨跌榜
const allRise = marketPriceDataFull.all.filter(item => item.positive).sort((a, b) => b.change - a.change).slice(0, 5);
const allFall = marketPriceDataFull.all.filter(item => !item.positive).sort((a, b) => a.change - b.change).slice(0, 5);
marketPriceData['all_rise'] = allRise;
marketPriceData['all_fall'] = allFall;

// 分类配置
const marketCategories = [
    { id: 'all', name: '全部分类' },
    { id: 'guns', name: '枪械' },
    { id: 'armor', name: '装备' },
    { id: 'parts', name: '配件' },
    { id: 'collect', name: '收集品' },
    { id: 'medical', name: '医疗品' },
    { id: 'ammo', name: '弹药' }
];

// 稀有度颜色映射
const rarityColors = {
    red: '#ff4757',
    purple: '#a855f7',
    blue: '#3b82f6',
    green: '#22c55e',
    white: '#9ca3af'
};

// 获取市场数据的辅助函数 - 用于首页/工具页（带涨跌榜）
function getMarketData(category, rank) {
    const key = `${category}_${rank}`;
    return marketPriceData[key] || [];
}

// 获取全量市场数据 - 用于内页
function getMarketDataFull(category) {
    return marketPriceDataFull[category] || marketPriceDataFull['all'];
}
