/* ============================================
   密码指引弹窗
   ============================================ */
const passwordModal = document.getElementById('password-modal-overlay');
const passwordModalClose = document.getElementById('password-modal-close');

// 密码数据
const passwordGuideData = {
    daba: {
        name: '🏔️ 零号大坝',
        code: '0740',
        steps: [
            '从主出生点出发，向东北方向前进约200米，找到一座废弃的仓库建筑。',
            '进入仓库后，向左侧走廊前进，注意墙上的管道标识。',
            '在走廊尽头找到配电室，密码门位于房间东侧。',
            '输入今日密码后，进入密码房获取高价值物品。',
            '撤离时注意周围敌人，建议从南侧安全通道离开。'
        ]
    },
    xigu: {
        name: '🌲 长弓溪谷',
        code: '0968',
        steps: [
            '从西部山脚出发，沿着河流向上游前进。',
            '在瀑布附近找到隐藏的洞穴入口。',
            '穿过洞穴，在出口处可以看到密码房建筑。',
            '密码门位于建筑二楼，需要从外部楼梯上去。',
            '完成后从东侧林地撤离，避开主要交战区域。'
        ]
    },
    bakeshi: {
        name: '🏜️ 巴克什',
        code: '0610',
        steps: [
            '从市场区域出发，向北穿过主街道。',
            '在清真寺附近找到地下通道入口。',
            '沿着通道前进，注意躲避巡逻敌人。',
            '密码房位于通道尽头的储藏室内。',
            '撤离推荐从西侧小巷返回，避开狙击位。'
        ]
    },
    hangtian: {
        name: '🚀 航天基地',
        code: '0710',
        steps: [
            '从发射台区域向东前进，找到控制中心建筑。',
            '从建筑北侧入口进入，注意电子门禁。',
            '乘坐电梯到达B2层，密码房在实验室区域。',
            '输入密码后，快速搜刮并标记撤离点。',
            '建议从地下停车场撤离，有载具可以使用。'
        ]
    },
    jianyu: {
        name: '⛓️ 潮汐监狱',
        code: '0654',
        steps: [
            '从监狱大门进入，向右转进入A区牢房。',
            '穿过牢房区域，找到通往地下的楼梯。',
            '地下室尽头有一个上锁的铁门，需要密码。',
            '密码房内有大量医疗物资和收集品。',
            '撤离时注意监控室方向可能有敌人埋伏。'
        ]
    }
};

let currentPasswordMap = 'daba';
let currentCarouselIndex = 0;

// 点击密码区域打开弹窗
document.querySelectorAll('.password-code-box').forEach(box => {
    box.addEventListener('click', function() {
        const mapName = this.parentElement.querySelector('.password-map').textContent;
        const code = this.querySelector('.password-code').textContent;
        
        // 根据地图名称找到对应的map key
        const mapKeyMap = {
            '零号大坝': 'daba',
            '长弓溪谷': 'xigu',
            '巴克什': 'bakeshi',
            '航天基地': 'hangtian',
            '潮汐监狱': 'jianyu'
        };
        
        const mapKey = mapKeyMap[mapName] || 'daba';
        openPasswordModal(mapKey);
    });
});

// 打开弹窗
function openPasswordModal(mapKey) {
    currentPasswordMap = mapKey;
    currentCarouselIndex = 0;
    
    // 更新Tab激活状态
    document.querySelectorAll('.password-guide-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.map === mapKey) {
            tab.classList.add('active');
        }
    });
    
    // 更新内容
    updatePasswordGuideContent();
    
    passwordModal.classList.add('active');
}

// 更新密码指引内容
function updatePasswordGuideContent() {
    const data = passwordGuideData[currentPasswordMap];
    if (!data) return;
    
    // 更新地图名称和密码
    document.getElementById('guide-map-name').textContent = data.name;
    document.getElementById('guide-map-code').textContent = data.code;
    
    // 更新轮播
    updateCarousel();
    
    // 更新步骤文字
    updateStepText();
}

// 更新轮播显示
function updateCarousel() {
    const slides = document.querySelectorAll('#carousel-container .carousel-slide');
    const indicators = document.querySelectorAll('#carousel-indicators .indicator');
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentCarouselIndex) {
            slide.classList.add('active');
        }
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentCarouselIndex) {
            indicator.classList.add('active');
        }
    });
}

// 更新步骤文字
function updateStepText() {
    const data = passwordGuideData[currentPasswordMap];
    if (!data) return;
    
    document.getElementById('guide-step-num').textContent = currentCarouselIndex + 1;
    document.getElementById('guide-step-content').textContent = data.steps[currentCarouselIndex] || '';
}

// 轮播上一步
document.getElementById('carousel-prev')?.addEventListener('click', function() {
    if (currentCarouselIndex > 0) {
        currentCarouselIndex--;
        updateCarousel();
        updateStepText();
    }
});

// 轮播下一步
document.getElementById('carousel-next')?.addEventListener('click', function() {
    const data = passwordGuideData[currentPasswordMap];
    if (data && currentCarouselIndex < data.steps.length - 1) {
        currentCarouselIndex++;
        updateCarousel();
        updateStepText();
    }
});

// 点击指示器跳转
document.querySelectorAll('#carousel-indicators .indicator').forEach(indicator => {
    indicator.addEventListener('click', function() {
        currentCarouselIndex = parseInt(this.dataset.index);
        updateCarousel();
        updateStepText();
    });
});

// Tab切换
document.querySelectorAll('.password-guide-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.password-guide-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        currentPasswordMap = this.dataset.map;
        currentCarouselIndex = 0;
        updatePasswordGuideContent();
    });
});

// 关闭弹窗
function closePasswordModal() {
    passwordModal.classList.remove('active');
}

// 点击关闭按钮
if (passwordModalClose) {
    passwordModalClose.addEventListener('click', closePasswordModal);
}

// 点击遮罩层关闭
if (passwordModal) {
    passwordModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closePasswordModal();
        }
    });
}

/* ============================================
   制造部门弹窗
   ============================================ */
const craftModal = document.getElementById('craft-modal-overlay');
const craftModalClose = document.getElementById('craft-modal-close');
const craftModalTitle = document.getElementById('craft-modal-title');
const craftModalContent = document.getElementById('craft-modal-content');

// 点击制造部门卡片打开弹窗
document.querySelectorAll('.craft-station-card[data-station]').forEach(card => {
    card.addEventListener('click', function() {
        const stationName = this.dataset.station;
        const status = this.dataset.status; // 'idle' 或 'working'
        const itemName = this.dataset.item || '';
        const time = this.dataset.time || '';
        openCraftModal(stationName, status, itemName, time);
    });
});

// 制造推荐数据
const craftDataMobile = {
    tech: [
        { name: 'OLIGHT Baldr Pro R手电', profit: 18578, change: 12.6, positive: true },
        { name: '灵眼3/7测距瞄准镜', profit: 8083, change: 7.0, positive: true },
        { name: 'DBAL-X2激光镭指', profit: 7487, change: -1.9, positive: false }
    ],
    work: [
        { name: 'PMAG D-60弹鼓', profit: 15230, change: 8.3, positive: true },
        { name: 'Zenit PT-1枪托', profit: 9120, change: 5.2, positive: true },
        { name: 'Magpul前握把', profit: 6540, change: -2.5, positive: false }
    ],
    med: [
        { name: '军用急救包', profit: 12450, change: 15.8, positive: true },
        { name: '肾上腺素注射器', profit: 7890, change: 3.2, positive: true },
        { name: '高级止痛药', profit: 5670, change: -4.1, positive: false }
    ],
    armor: [
        { name: '6级防弹插板', profit: 22340, change: 18.5, positive: true },
        { name: 'Ops-Core头盔', profit: 11200, change: 6.7, positive: true },
        { name: 'THORAX背心', profit: 8950, change: -0.8, positive: false }
    ]
};

let selectedCraftIndexMobile = 0;
let currentCraftTypeMobile = 'tech';

function updateCraftItemsMobile(craftType) {
    currentCraftTypeMobile = craftType;
    selectedCraftIndexMobile = 0;
    const items = craftDataMobile[craftType];
    const container = document.getElementById('craft-items-mobile');
    if (!container || !items) return;
    
    container.innerHTML = items.map((item, index) => `
        <div class="craft-item-mobile ${index === selectedCraftIndexMobile ? 'selected' : ''}" data-index="${index}">
            <div class="craft-item-image-mobile"></div>
            <div class="craft-item-name-mobile">${item.name}</div>
            <div class="craft-item-stats-mobile">
                <div class="craft-stat-row">
                    <span class="craft-stat-label">每小时收益</span>
                    <span class="craft-stat-value">${item.profit.toLocaleString()}</span>
                </div>
                <div class="craft-item-change-mobile ${item.positive ? 'positive' : 'negative'}">
                    ${item.positive ? '+' : ''}${item.change}%${item.positive ? '↑' : '↓'}
                </div>
            </div>
        </div>
    `).join('');
    
    // 绑定点击事件
    container.querySelectorAll('.craft-item-mobile').forEach(itemEl => {
        itemEl.addEventListener('click', function() {
            container.querySelectorAll('.craft-item-mobile').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            selectedCraftIndexMobile = parseInt(this.dataset.index);
            drawCraftChartMobile();
        });
    });
    
    drawCraftChartMobile();
}

function drawCraftChartMobile() {
    const canvas = document.getElementById('craft-chart-mobile');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 15, right: 10, bottom: 20, left: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const items = craftDataMobile[currentCraftTypeMobile];
    const item = items[selectedCraftIndexMobile];
    const isPositive = item.positive;
    
    // 生成数据
    const times = ['10:00', '14:00', '18:00', '22:00', '02:00', '06:00', '11:00'];
    const basePrice = Math.round(item.profit / 1000 * 2);
    let data = [];
    let currentValue = basePrice + (Math.random() - 0.5) * 2;
    
    if (isPositive) {
        for (let i = 0; i < times.length; i++) {
            if (i < 4) {
                currentValue += (Math.random() - 0.3) * 0.5;
            } else {
                currentValue += Math.random() * 1.5 + 0.5;
            }
            data.push({ time: times[i], value: Math.max(1, currentValue) });
        }
    } else {
        for (let i = 0; i < times.length; i++) {
            if (i < 3) {
                currentValue += (Math.random() - 0.5) * 0.3;
            } else {
                currentValue -= Math.random() * 0.8 + 0.2;
            }
            data.push({ time: times[i], value: Math.max(1, currentValue) });
        }
    }
    
    const values = data.map(d => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin || 1;
    const minValue = dataMin - range * 0.2;
    const maxValue = dataMax + range * 0.2;
    const valueRange = maxValue - minValue;
    
    ctx.clearRect(0, 0, width * 2, height * 2);
    
    // 绘制网格线
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
        const val = minValue + (valueRange / 4) * i;
        const y = padding.top + chartHeight - ((val - minValue) / valueRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        ctx.fillStyle = '#8a9bb0';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(1) + '万', padding.left - 4, y + 3);
    }
    
    // 绘制填充区域
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = isPositive ? 'rgba(0, 212, 170, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    ctx.fill();
    
    // 绘制曲线
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = isPositive ? '#00d4aa' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制数据点
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = isPositive ? '#00d4aa' : '#ef4444';
        ctx.fill();
    });
    
    // X轴时间标签
    ctx.fillStyle = '#8a9bb0';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    [0, 3, 6].forEach(index => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        ctx.fillText(data[index].time, x, height - 5);
    });
}

// 初始化制造推荐
if (document.getElementById('craft-items-mobile')) {
    updateCraftItemsMobile('tech');
}

/* ============================================
   地图工具 - 交互逻辑
   ============================================ */
// 地图数据
const mapDataMobile = {
    fenghuodiqu: [
        { id: 'chaoxi', name: '潮汐监狱', icon: '🏚️' },
        { id: 'bakeshi', name: '巴克什', icon: '🗼' },
        { id: 'hangtian', name: '航天基地', icon: '🚀' },
        { id: 'linghao', name: '零号大坝', icon: '🌊' }
    ],
    quanmianzhanchang: [
        { id: 'duicheng', name: '对称城镇', icon: '🏘️' },
        { id: 'gongchang', name: '工厂区', icon: '🏭' },
        { id: 'jichang', name: '机场', icon: '✈️' },
        { id: 'shamo', name: '沙漠小镇', icon: '🏜️' }
    ]
};

let currentMapMode = 'fenghuodiqu';
let currentMapId = 'chaoxi';

// 地图模式Tab切换
document.querySelectorAll('.map-mode-tab-mobile').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.map-mode-tab-mobile').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        currentMapMode = this.dataset.mapMode;
        updateMapSelector(currentMapMode);
    });
});

// 更新地图选择器
function updateMapSelector(mode) {
    const maps = mapDataMobile[mode];
    const container = document.getElementById('map-selector-mobile');
    if (!container || !maps) return;
    
    container.innerHTML = maps.map((map, index) => `
        <div class="map-selector-item ${index === 0 ? 'active' : ''}" data-map="${map.id}">
            <div class="map-thumb">
                <div class="map-thumb-placeholder">${map.icon}</div>
            </div>
            <div class="map-selector-name">${map.name}</div>
        </div>
    `).join('');
    
    // 默认选中第一个
    currentMapId = maps[0].id;
    updateMapPreview(maps[0].name);
    
    // 绑定点击事件
    bindMapSelectorEvents();
}

// 绑定地图选择器点击事件
function bindMapSelectorEvents() {
    document.querySelectorAll('.map-selector-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.map-selector-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            currentMapId = this.dataset.map;
            const mapName = this.querySelector('.map-selector-name').textContent;
            updateMapPreview(mapName);
        });
    });
}

// 更新地图预览
function updateMapPreview(mapName) {
    const previewName = document.getElementById('map-preview-name');
    if (previewName) {
        previewName.textContent = mapName;
    }
}

// 初始化地图选择器事件
bindMapSelectorEvents();

/* ============================================
   Wiki页面 - 攻略Tab切换
   ============================================ */
document.querySelectorAll('.guide-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.guide-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

/* ============================================
   我的页面 - 交互逻辑
   ============================================ */
// 当前战绩模式
let currentBattleMode = 'fenghuodiDai';

// 烽火地带数据
const fenghuoData = {
    stats: [
        { value: '55.1M', labelKey: 'stats.totalValue' },
        { value: '37.6%', labelKey: 'stats.extractionRate' },
        { value: '333', labelKey: 'stats.defeatedOperator' },
        { value: '535.0K', labelKey: 'stats.profitLossRatio' }
    ],
    records: [
        { avatar: '🎖️', status: 'fail', statusKey: 'match.extractionFailed', operatorKey: 'operators.weilong', modeKey: 'gameMode.fenghuo', mapKey: 'maps.dam', subMapKey: 'maps.secret', time: '02-01 10:52', profit: '68,304', kills: '4' },
        { avatar: '⚔️', status: 'fail', statusKey: 'match.extractionFailed', operatorKey: 'operators.haizhua', modeKey: 'gameMode.fenghuo', mapKey: 'maps.dam', subMapKey: 'maps.secret', time: '02-01 10:45', profit: '95,960', kills: '7' },
        { avatar: '🛡️', status: 'fail', statusKey: 'match.extractionFailed', operatorKey: 'operators.weilong', modeKey: 'gameMode.fenghuo', mapKey: 'maps.space', subMapKey: 'maps.secret', time: '02-01 10:30', profit: '0', kills: '2' }
    ]
};

// 全面战场数据
const zhancahngData = {
    stats: [
        { value: '28', labelKey: 'stats.winCount' },
        { value: '45.2%', labelKey: 'stats.winRate' },
        { value: '12162', labelKey: 'stats.avgScore' },
        { value: '2.8', labelKey: 'stats.killsPerMin' }
    ],
    records: [
        { avatar: '⚔️', status: 'fail', statusKey: 'match.defeat', operatorKey: 'operators.weilong', modeKey: 'gameMode.zhanchang', mapKey: 'maps.aftershock', time: '02-01 10:55', score: '12607', kills: '39' },
        { avatar: '🏆', status: 'success', statusKey: 'match.victory', operatorKey: 'operators.haizhua', modeKey: 'gameMode.zhanchang', mapKey: 'maps.aftershock', time: '02-01 09:30', score: '15320', kills: '45' },
        { avatar: '⚔️', status: 'fail', statusKey: 'match.defeat', operatorKey: 'operators.weilong', modeKey: 'gameMode.zhanchang', mapKey: 'maps.aftershock', time: '02-01 08:15', score: '8650', kills: '22' }
    ]
};

// 获取翻译文本（封装）
function t(key) {
    return window.I18n ? window.I18n.t(key) : key;
}

// 更新战绩数据显示
function updateBattleModeData(mode) {
    currentBattleMode = mode;
    const data = mode === 'fenghuodiDai' ? fenghuoData : zhancahngData;
    const statsGrid = document.getElementById('stats-grid');
    const recordList = document.querySelector('.battle-record-list');
    
    // 更新统计数据
    if (statsGrid) {
        statsGrid.innerHTML = data.stats.map(stat => `
            <div class="profile-stat-item">
                <div class="profile-stat-value">${stat.value}</div>
                <div class="profile-stat-label">${t(stat.labelKey)}</div>
            </div>
        `).join('');
    }
    
    // 更新对局记录
    if (recordList) {
        if (mode === 'fenghuodiDai') {
            recordList.innerHTML = data.records.map(record => `
                <div class="battle-record-item">
                    <div class="battle-record-avatar">${record.avatar}</div>
                    <div class="battle-record-info">
                        <div class="battle-record-status">
                            <span class="battle-status-tag ${record.status}">${t(record.statusKey)}</span>
                            <span class="battle-operator-name">${t(record.operatorKey)}</span>
                        </div>
                        <div class="battle-record-map">${t(record.modeKey)} | ${t(record.mapKey)}-${t(record.subMapKey)}</div>
                        <div class="battle-record-time">${record.time}</div>
                    </div>
                    <div class="battle-record-result">
                        <div class="battle-result-profit">💰 ${record.profit}</div>
                        <div class="battle-result-kills">💀 ${record.kills}</div>
                    </div>
                    <span class="battle-record-arrow">›</span>
                </div>
            `).join('');
        } else {
            recordList.innerHTML = data.records.map(record => `
                <div class="battle-record-item">
                    <div class="battle-record-avatar">${record.avatar}</div>
                    <div class="battle-record-info">
                        <div class="battle-record-status">
                            <span class="battle-status-tag ${record.status}">${t(record.statusKey)}</span>
                            <span class="battle-operator-name">${t(record.operatorKey)}</span>
                        </div>
                        <div class="battle-record-map">${t(record.modeKey)} | ${t(record.mapKey)}</div>
                        <div class="battle-record-time">${record.time}</div>
                    </div>
                    <div class="battle-record-result">
                        <div class="battle-result-score">🏅 ${record.score}</div>
                        <div class="battle-result-kills">💀 ${record.kills}</div>
                    </div>
                    <span class="battle-record-arrow">›</span>
                </div>
            `).join('');
        }
    }
}

// 模式切换 (烽火地带/全面战场)
document.querySelectorAll('.profile-mode-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.profile-mode-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const mode = this.dataset.mode;
        updateBattleModeData(mode);
    });
});

// 首页日报 Tab 切换（烽火日报 / 战场日报 / 爆破日报）
// 改枪推荐区随日报 Tab 联动（烽火/战场/爆破 三态）
document.querySelectorAll('.report-tabs .report-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        document.querySelectorAll('.report-tabs .report-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const mode = this.dataset.report || 'fh';

        // 日报内容区显隐
        const fhContent = document.getElementById('report-fh');
        const zcContent = document.getElementById('report-zc');
        const bpContent = document.getElementById('report-bp');
        if (fhContent) fhContent.classList.toggle('active', mode === 'fh');
        if (zcContent) zcContent.classList.toggle('active', mode === 'zc');
        if (bpContent) bpContent.classList.toggle('active', mode === 'bp');

        // 改枪推荐区联动（与日报模式同源）
        const fhBuilds = document.getElementById('gun-builds-fenghuo-mobile');
        const zcBuilds = document.getElementById('gun-builds-zhanchang-mobile');
        const bpBuilds = document.getElementById('gun-builds-baopo-mobile');
        if (fhBuilds) fhBuilds.style.display = mode === 'fh' ? '' : 'none';
        if (zcBuilds) zcBuilds.style.display = mode === 'zc' ? '' : 'none';
        if (bpBuilds) bpBuilds.style.display = mode === 'bp' ? '' : 'none';

        // 首次进入爆破 tab 时渲染精选流派卡
        if (mode === 'bp') {
            const homePacks = document.getElementById('bp-home-packs');
            if (homePacks && !homePacks.childElementCount) {
                renderMobileBpPackList(homePacks, 2);
            }
        }
    });
});

// 内容Tab切换 (战绩生涯/大红藏馆/资产)
document.querySelectorAll('.profile-content-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // 切换Tab样式
        document.querySelectorAll('.profile-content-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 切换内容显示
        const tabName = this.dataset.tab;
        document.querySelectorAll('.profile-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById('tab-' + tabName).style.display = 'block';
        
        // 更新统计卡片
        updateProfileStats(tabName);
    });
});

// 更新统计卡片内容
function updateProfileStats(tabName) {
    const statsTitle = document.getElementById('stats-title');
    const statsLink = document.getElementById('stats-link');
    const statsGrid = document.getElementById('stats-grid');
    const modeTabs = document.getElementById('profile-mode-tabs');
    
    // 仅战绩页显示模式Tab
    if (modeTabs) {
        modeTabs.style.display = tabName === 'battle' ? 'flex' : 'none';
    }
    
    if (tabName === 'battle') {
        statsTitle.style.display = 'none';
        statsLink.style.display = 'none';
        statsGrid.innerHTML = `
            <div class="profile-stat-item">
                <div class="profile-stat-value">55.1M</div>
                <div class="profile-stat-label">${t('stats.totalValue')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">37.6%</div>
                <div class="profile-stat-label">${t('stats.extractionRate')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">333</div>
                <div class="profile-stat-label">${t('stats.defeatedOperator')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">535.0K</div>
                <div class="profile-stat-label">${t('stats.profitLossRatio')}</div>
            </div>
        `;
    } else if (tabName === 'collection') {
        statsTitle.textContent = t('collection.overview');
        statsTitle.style.display = 'block';
        statsLink.style.display = 'none';
        statsGrid.innerHTML = `
            <div class="profile-stat-item">
                <div class="profile-stat-value">12</div>
                <div class="profile-stat-label">${t('collection.totalTypes')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">20</div>
                <div class="profile-stat-label">${t('collection.totalCount')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">8.5M</div>
                <div class="profile-stat-label">${t('collection.totalValue')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">0</div>
                <div class="profile-stat-label">${t('collection.weeklyCount')}</div>
            </div>
        `;
    } else if (tabName === 'asset') {
        statsTitle.textContent = t('asset.overview');
        statsTitle.style.display = 'block';
        statsLink.style.display = 'inline-block';
        statsGrid.innerHTML = `
            <div class="profile-stat-item">
                <div class="profile-stat-value">910</div>
                <div class="profile-stat-label">${t('asset.triangleCoins')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">72.1M</div>
                <div class="profile-stat-label">${t('asset.totalAssets')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">23.2M</div>
                <div class="profile-stat-label">${t('asset.havCoins')}</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">1</div>
                <div class="profile-stat-label">${t('asset.gunSkins')}</div>
            </div>
        `;
    }
}

// 战绩页子Tab切换：最近对局 / 作战数据
document.querySelectorAll('.battle-sub-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.battle-sub-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const subTab = this.dataset.battleSub || 'recent';
        const filterRow = document.querySelector('#tab-battle .battle-filter-row');
        const recentPanel = document.getElementById('battle-recent-panel') || document.querySelector('#tab-battle .battle-record-list');
        const operationalPanel = document.getElementById('battle-operational-panel');
        const showRecent = subTab === 'recent';

        if (filterRow) filterRow.style.display = showRecent ? 'flex' : 'none';
        if (recentPanel) recentPanel.style.display = showRecent ? 'flex' : 'none';
        if (operationalPanel) operationalPanel.style.display = showRecent ? 'none' : 'block';
    });
});

// 作战数据 - 地图卡片点击切换详情
function initMobileCombatMapCards() {
    const cards = document.querySelectorAll('.mobile-map-card');
    if (!cards.length) return;

    const nameEl = document.getElementById('mobile-map-detail-name');
    const matchesEl = document.getElementById('mobile-map-detail-matches');
    const profitEl = document.getElementById('mobile-map-detail-profit');
    const extractEl = document.getElementById('mobile-map-detail-extract');
    const lossEl = document.getElementById('mobile-map-detail-loss');
    const ratioEl = document.getElementById('mobile-map-detail-ratio');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            if (nameEl) nameEl.textContent = this.dataset.name || '';
            if (matchesEl) matchesEl.textContent = this.dataset.matches || '';
            if (profitEl) {
                profitEl.textContent = this.dataset.profit || '';
                profitEl.classList.remove('positive', 'negative');
                if (this.dataset.profitClass === 'positive' || this.dataset.profitClass === 'negative') {
                    profitEl.classList.add(this.dataset.profitClass);
                }
            }
            if (extractEl) extractEl.textContent = this.dataset.extract || '';
            if (lossEl) lossEl.textContent = this.dataset.loss || '';
            if (ratioEl) ratioEl.textContent = this.dataset.ratio || '';
        });
    });
}

initMobileCombatMapCards();

// 作战数据 - 干员 / 枪械榜单排序：选中的指标在右侧主视觉展示
function initMobileCombatRankSorters() {
    const operatorSort = document.querySelector('.mobile-operator-sort');
    const operatorList = document.querySelector('.mobile-operator-rank-list');
    const weaponSort = document.querySelector('.mobile-weapon-sort');
    const weaponList = document.querySelector('.mobile-weapon-rank-list');

    function setPrimary(card, value, label, className) {
        const primary = card.querySelector('.mobile-rank-primary');
        if (!primary) return;
        primary.classList.remove('positive', 'negative');
        if (className) primary.classList.add(className);
        primary.innerHTML = `<span>${value}</span><small>${label}</small>`;
    }

    function updateRankNumbers(cards) {
        cards.forEach((card, index) => {
            const rank = card.querySelector('.mobile-rank-no');
            if (rank) rank.textContent = `#${index + 1}`;
        });
    }

    function sortCards(list, cards, getter) {
        cards.sort((a, b) => getter(b) - getter(a));
        cards.forEach(card => list.appendChild(card));
        updateRankNumbers(cards);
    }

    function combatLabel(key, zhText, deText) {
        const translated = t(key);
        if (translated && translated !== key) return translated;
        const lang = (window.I18n && window.I18n.currentLang) || localStorage.getItem('df-language') || 'zh-CN';
        return lang === 'de' ? deText : zhText;
    }

    function updateOperatorList(metric) {
        if (!operatorList) return;
        const cards = Array.from(operatorList.querySelectorAll('.mobile-rank-card'));
        const labels = {
            matches: combatLabel('operational.matches', '对局', 'Matches'),
            profit: combatLabel('operational.netProfit', '净收益', 'Netto'),
            extraction: combatLabel('operational.extractionRate', '撤离率', 'Extraktion'),
            profitLoss: combatLabel('operational.profitLossRatio', '赚损比', 'G/V'),
            loss: combatLabel('operational.lossRatio', '战损比', 'V/B')
        };

        const getterMap = {
            matches: card => Number(card.dataset.matches || 0),
            profit: card => Number(card.dataset.profitNum || 0),
            extraction: card => Number(card.dataset.extractionNum || 0),
            profitLoss: card => Number(card.dataset.profitLossNum || 0)
        };
        sortCards(operatorList, cards, getterMap[metric] || getterMap.matches);

        cards.forEach(card => {
            const metas = card.querySelectorAll('.mobile-rank-meta');
            const profitClass = (card.dataset.profit || '').startsWith('-') ? 'negative' : 'positive';
            if (metric === 'matches') {
                setPrimary(card, card.dataset.matches, labels.matches);
                if (metas[0]) metas[0].innerHTML = `${card.dataset.profit} ${labels.profit} · ${card.dataset.extraction} ${labels.extraction}`;
                if (metas[1]) metas[1].innerHTML = `${labels.loss} ${card.dataset.loss} · ${labels.profitLoss} ${card.dataset.profitLoss}`;
            } else if (metric === 'profit') {
                setPrimary(card, card.dataset.profit, labels.profit, profitClass);
                if (metas[0]) metas[0].innerHTML = `${card.dataset.matches} ${labels.matches} · ${card.dataset.extraction} ${labels.extraction}`;
                if (metas[1]) metas[1].innerHTML = `${labels.loss} ${card.dataset.loss} · ${labels.profitLoss} ${card.dataset.profitLoss}`;
            } else if (metric === 'extraction') {
                setPrimary(card, card.dataset.extraction, labels.extraction);
                if (metas[0]) metas[0].innerHTML = `${card.dataset.matches} ${labels.matches} · ${card.dataset.profit} ${labels.profit}`;
                if (metas[1]) metas[1].innerHTML = `${labels.loss} ${card.dataset.loss} · ${labels.profitLoss} ${card.dataset.profitLoss}`;
            } else {
                setPrimary(card, card.dataset.profitLoss, labels.profitLoss);
                if (metas[0]) metas[0].innerHTML = `${card.dataset.matches} ${labels.matches} · ${card.dataset.extraction} ${labels.extraction}`;
                if (metas[1]) metas[1].innerHTML = `${card.dataset.profit} ${labels.profit} · ${labels.loss} ${card.dataset.loss}`;
            }
        });
    }

    function updateWeaponList(metric) {
        if (!weaponList) return;
        const cards = Array.from(weaponList.querySelectorAll('.mobile-rank-card'));
        const labels = {
            kills: combatLabel('operational.kills', '击杀', 'Kills'),
            rounds: combatLabel('operational.rounds', '场次', 'Runden'),
            extraction: combatLabel('operational.extractionRate', '撤离率', 'Extraktion')
        };

        const getterMap = {
            kills: card => Number(card.dataset.killsNum || 0),
            matches: card => Number(card.dataset.matches || 0),
            extraction: card => Number(card.dataset.extractionNum || 0)
        };
        sortCards(weaponList, cards, getterMap[metric] || getterMap.kills);

        cards.forEach(card => {
            const meta = card.querySelector('.mobile-rank-meta');
            if (metric === 'matches') {
                setPrimary(card, card.dataset.matches, labels.rounds);
                if (meta) meta.innerHTML = `${card.dataset.kills} ${labels.kills} · ${card.dataset.extraction} ${labels.extraction}`;
            } else if (metric === 'extraction') {
                setPrimary(card, card.dataset.extraction, labels.extraction);
                if (meta) meta.innerHTML = `${card.dataset.matches} ${labels.rounds} · ${card.dataset.kills} ${labels.kills}`;
            } else {
                setPrimary(card, card.dataset.kills, labels.kills);
                if (meta) meta.innerHTML = `${card.dataset.matches} ${labels.rounds} · ${card.dataset.extraction} ${labels.extraction}`;
            }
        });
    }

    if (operatorSort) {
        operatorSort.addEventListener('change', () => updateOperatorList(operatorSort.value));
        updateOperatorList(operatorSort.value || 'matches');
    }

    if (weaponSort) {
        weaponSort.addEventListener('change', () => updateWeaponList(weaponSort.value));
        updateWeaponList(weaponSort.value || 'kills');
    }
}

initMobileCombatRankSorters();

// 藏品分类Tab切换
document.querySelectorAll('.collection-category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.collection-category-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

function initMobileCardCollectionPrototype() {
    const entry = document.getElementById('card-collection-entry-mobile');
    const page = document.getElementById('mobile-card-collection-page');
    const detail = document.getElementById('mobile-card-detail-overlay');
    if (!entry || !page || !detail) return;

    const closePage = () => {
        page.classList.remove('active');
        detail.classList.remove('active');
        document.body.style.overflow = '';
    };
    const applyFilter = () => {
        const filter = page.querySelector('[data-mobile-card-filter].active')?.dataset.mobileCardFilter || 'all';
        const category = page.querySelector('[data-mobile-card-category].active')?.dataset.mobileCardCategory || 'all';
        page.querySelectorAll('.mobile-card-group').forEach(group => {
            let visibleCount = 0;
            group.querySelectorAll('.mobile-prototype-card').forEach(card => {
                const visible = (filter === 'all' || card.dataset.mobileCardState === filter) && (category === 'all' || card.dataset.mobileCardCategory === category);
                card.hidden = !visible;
                if (visible) visibleCount += 1;
            });
            group.hidden = visibleCount === 0;
        });
    };
    entry.addEventListener('click', () => {
        page.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    page.querySelector('.mobile-card-collection-back')?.addEventListener('click', closePage);
    page.querySelectorAll('[data-mobile-card-filter]').forEach(tab => {
        tab.addEventListener('click', () => {
            page.querySelectorAll('[data-mobile-card-filter]').forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            applyFilter();
        });
    });
    page.querySelectorAll('[data-mobile-card-category]').forEach(tab => {
        tab.addEventListener('click', () => {
            page.querySelectorAll('[data-mobile-card-category]').forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            applyFilter();
        });
    });
    page.querySelectorAll('.mobile-prototype-card').forEach(card => {
        card.addEventListener('click', () => {
            detail.querySelector('#mobile-card-detail-art').textContent = card.querySelector('span').textContent;
            detail.querySelector('#mobile-card-detail-name').textContent = card.dataset.mobileCardName;
            detail.querySelector('#mobile-card-detail-state').textContent = card.dataset.mobileCardState === 'owned' ? '已拥有' : '尚未解锁';
            detail.querySelector('#mobile-card-detail-color').textContent = card.dataset.mobileCardColor;
            detail.querySelector('#mobile-card-detail-tier').textContent = card.dataset.mobileCardTier;
            detail.querySelector('#mobile-card-detail-tier').className = `card-detail-tier tier-${card.dataset.mobileCardTier}`;
            detail.querySelector('#mobile-card-detail-quantity').textContent = card.dataset.mobileCardQuantity;
            detail.classList.add('active');
        });
    });
    const poster = document.getElementById('mobile-card-share-poster');
    const renderPosterProgress = () => {
        const ownedCards = page.querySelectorAll('.mobile-prototype-card[data-mobile-card-state="owned"]');
        const totalCards = page.querySelectorAll('.mobile-prototype-card').length;
        const ownedQty = Array.from(ownedCards).reduce((sum, el) => sum + Number(el.dataset.mobileCardQuantity || 0), 0);
        poster.querySelector('#mobile-card-poster-progress').textContent = `${ownedCards.length}/${totalCards}`;
        poster.querySelector('#mobile-card-poster-ratio').textContent = `${Math.round(ownedCards.length / totalCards * 100)}%`;
        const stats = poster.querySelectorAll('.mobile-card-share-poster-stats span b');
        if (stats.length >= 4) {
            stats[0].textContent = ownedCards.length;
            stats[1].textContent = totalCards - ownedCards.length;
            stats[2].textContent = '0';
            stats[3].textContent = ownedQty;
        }
        const suitMap = new Map();
        page.querySelectorAll('.mobile-card-group').forEach(group => {
            const groupKey = group.dataset.mobileCardGroup;
            const groupName = group.querySelector('header strong').textContent;
            const total = group.querySelectorAll('.mobile-prototype-card').length;
            const owned = group.querySelectorAll('.mobile-prototype-card[data-mobile-card-state="owned"]').length;
            suitMap.set(groupKey, { name: groupName, total, owned });
        });
        const suitsList = poster.querySelector('#mobile-card-share-poster-suits');
        suitsList.innerHTML = '';
        const suitMeta = [
            { key: 'box', mark: '▥' },
            { key: 'joker', mark: '★' },
            { key: 'spades', mark: '♠' },
            { key: 'hearts', mark: '♥' },
            { key: 'clubs', mark: '♣' },
            { key: 'diamonds', mark: '♦' }
        ];
        suitMeta.forEach(meta => {
            const data = suitMap.get(meta.key);
            if (!data) return;
            const ratio = data.total ? Math.round(data.owned / data.total * 100) : 0;
            const li = document.createElement('li');
            li.innerHTML = `<span class="mobile-card-share-poster-suit-mark">${meta.mark}</span><span class="mobile-card-share-poster-suit-name">${data.name}</span><span class="mobile-card-share-poster-suit-bar"><span style="width:${ratio}%"></span></span><span class="mobile-card-share-poster-suit-count">${data.owned}/${data.total}</span>`;
            suitsList.appendChild(li);
        });
        const highCards = Array.from(ownedCards)
            .filter(el => Number(el.dataset.mobileCardTier) >= 4)
            .sort((a, b) => Number(b.dataset.mobileCardTier) - Number(a.dataset.mobileCardTier) || Number(b.dataset.mobileCardQuantity || 0) - Number(a.dataset.mobileCardQuantity || 0));
        const highList = poster.querySelector('#mobile-card-share-poster-high-cards');
        highList.innerHTML = '';
        highCards.forEach(el => {
            const li = document.createElement('li');
            li.className = `mobile-card-share-poster-high-card tier-${el.dataset.mobileCardTier}`;
            li.innerHTML = `<span>${el.querySelector('span').textContent}</span><b>${el.dataset.mobileCardName}</b><small>${el.dataset.mobileCardColor} · ×${el.dataset.mobileCardQuantity}</small>`;
            highList.appendChild(li);
        });
        poster.querySelector('#mobile-card-share-poster-high-count').textContent = highCards.length;
    };
    const openPoster = () => {
        renderPosterProgress();
        poster.classList.add('active');
    };
    page.querySelector('[data-mobile-card-share="progress"]')?.addEventListener('click', openPoster);
    poster?.querySelector('.mobile-card-share-poster-close')?.addEventListener('click', () => poster.classList.remove('active'));
    poster?.addEventListener('click', event => { if (event.target === poster) poster.classList.remove('active'); });
    detail.querySelector('.mobile-card-detail-close')?.addEventListener('click', () => detail.classList.remove('active'));
    detail.addEventListener('click', event => {
        if (event.target === detail) detail.classList.remove('active');
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && page.classList.contains('active')) closePage();
    });
}

initMobileCardCollectionPrototype();

// 资产皮肤Tab切换
document.querySelectorAll('.asset-skin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.asset-skin-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// 资产筛选Tab切换
document.querySelectorAll('.asset-filter-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.asset-filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

/* ============================================
   物价模块逻辑 (复刻网页端)
   ============================================ */
let currentMarketCategoryMobile = 'all';
let currentMarketRankMobile = 'rise';
let selectedMarketItemIndexMobile = 0;

function initMarketPriceMobile() {
    // 检查数据是否可用
    if (typeof marketPriceData === 'undefined' || typeof rarityColors === 'undefined') {
        console.warn('交易物价数据未加载');
        return;
    }
    
    updateMarketListMobile();
    drawMarketMiniChartMobile();
    
    // 分类下拉菜单
    const categorySelect = document.getElementById('market-category-mobile');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            currentMarketCategoryMobile = this.value;
            selectedMarketItemIndexMobile = 0;
            updateMarketListMobile();
            drawMarketMiniChartMobile();
        });
    }
    
    // 涨跌榜Tab
    document.querySelectorAll('.market-rank-tab-mobile').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.market-rank-tab-mobile').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentMarketRankMobile = this.dataset.rank;
            selectedMarketItemIndexMobile = 0;
            updateMarketListMobile();
            drawMarketMiniChartMobile();
        });
    });
}

function updateMarketListMobile() {
    const container = document.getElementById('market-list-mobile');
    if (!container || typeof marketPriceData === 'undefined') return;
    
    const key = `${currentMarketCategoryMobile}_${currentMarketRankMobile}`;
    const items = marketPriceData[key] || [];
    
    container.innerHTML = items.map((item, index) => `
        <div class="market-item-mobile" data-index="${index}">
            <span class="market-item-rarity-mobile" style="background-color: ${rarityColors[item.rarity] || '#9ca3af'}"></span>
            <span class="market-item-name-mobile">${item.name}</span>
            <span class="market-item-price-mobile">${item.price.toLocaleString()}</span>
            <span class="market-item-change-mobile ${item.positive ? 'positive' : 'negative'}">
                ${item.positive ? '+' : ''}${item.change}%${item.positive ? '↑' : '↓'}
            </span>
        </div>
    `).join('');
    
    // 绑定点击事件
    container.querySelectorAll('.market-item-mobile').forEach(itemEl => {
        itemEl.addEventListener('click', function() {
            selectedMarketItemIndexMobile = parseInt(this.dataset.index);
            drawMarketMiniChartMobile();
        });
    });
}

function drawMarketMiniChartMobile() {
    const canvas = document.getElementById('market-price-chart-mobile');
    if (!canvas || typeof marketPriceData === 'undefined') return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 15, right: 10, bottom: 20, left: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 获取选中物品
    const key = `${currentMarketCategoryMobile}_${currentMarketRankMobile}`;
    const items = marketPriceData[key] || [];
    const item = items[selectedMarketItemIndexMobile];
    
    if (!item) return;
    
    // 模拟数据生成 (复刻逻辑)
    const isPositive = item.positive;
    const times = ['1日', '2日', '3日', '4日', '5日', '6日', '7日'];
    const basePrice = item.price / 1000; // 转换为K单位
    let data = [];
    let currentVal = basePrice * 0.85;
    
    for(let i = 0; i < 7; i++) {
        if(isPositive) {
            currentVal += (basePrice * 0.03) * (Math.random() + 0.5);
        } else {
            currentVal -= (basePrice * 0.02) * (Math.random() + 0.3);
        }
        data.push({ time: times[i], value: Math.max(1, currentVal) });
    }
    
    const values = data.map(d => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin || 1;
    const minValue = dataMin - range * 0.15;
    const maxValue = dataMax + range * 0.15;
    const valueRange = maxValue - minValue;
    
    ctx.clearRect(0, 0, width * 2, height * 2);
    
    // 绘制网格线和Y轴标签
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
        const val = minValue + (valueRange / 4) * i;
        const y = padding.top + chartHeight - ((val - minValue) / valueRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Y轴数值标签
        ctx.fillStyle = '#8a9bb0';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(1) + 'K', padding.left - 4, y + 3);
    }
    
    // 绘制填充区域
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = isPositive ? 'rgba(0, 212, 170, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    ctx.fill();
    
    // 绘制曲线
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = isPositive ? '#00d4aa' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制数据点
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = isPositive ? '#00d4aa' : '#ef4444';
        ctx.fill();
    });
    
    // X轴时间标签
    ctx.fillStyle = '#8a9bb0';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    [0, 3, 6].forEach(index => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        ctx.fillText(data[index].time, x, height - 5);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果当前在工具页，初始化交易物价
    const toolsPage = document.getElementById('page-tools');
    if (toolsPage && toolsPage.style.display !== 'none' && window.getComputedStyle(toolsPage).display !== 'none') {
        initMarketPriceMobile();
    }
});

/* ============================================
   物价详情子页面 - 交互逻辑
   ============================================ */
// 物价详情页状态
let marketDetailState = {
    category: 'all',
    sortField: null,      // 'price' | 'change' | null
    sortOrder: null,      // 'asc' | 'desc' | null
    searchQuery: '',
    allItems: []          // 所有物品数据
};

// 打开物价详情页
function openMarketDetailPage() {
    const page = document.getElementById('page-market-detail');
    if (page) {
        page.classList.add('active');
        document.body.style.overflow = 'hidden';
        initMarketDetailPage();
    }
}

// 关闭物价详情页
function closeMarketDetailPage() {
    const page = document.getElementById('page-market-detail');
    if (page) {
        page.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 打开资产周历页
function openAssetCalendarPage() {
    const page = document.getElementById('page-asset-calendar');
    if (page) {
        page.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 关闭资产周历页
function closeAssetCalendarPage() {
    const page = document.getElementById('page-asset-calendar');
    if (page) {
        page.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 初始化资产周历入口
function bindAssetCalendarEvents() {
    document.querySelectorAll('.asset-calendar-entry-mobile').forEach(btn => {
        btn.addEventListener('click', openAssetCalendarPage);
    });
    const backBtn = document.getElementById('asset-calendar-back');
    if (backBtn) backBtn.addEventListener('click', closeAssetCalendarPage);
}

// 初始化物价详情页
function initMarketDetailPage() {
    // 重置状态
    marketDetailState.sortField = null;
    marketDetailState.sortOrder = null;
    marketDetailState.searchQuery = '';
    
    // 清空搜索框
    const searchInput = document.getElementById('market-search-input');
    const searchClear = document.getElementById('market-search-clear');
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.classList.remove('visible');
    
    // 重置排序箭头
    document.querySelectorAll('.market-detail-list-header .sortable').forEach(el => {
        el.classList.remove('sort-asc', 'sort-desc', 'active');
    });
    
    // 加载数据
    loadMarketDetailData();
}

// 加载物价详情数据
function loadMarketDetailData() {
    if (typeof marketPriceDataFull === 'undefined') {
        console.warn('物价数据未加载');
        return;
    }
    
    // 使用全量数据
    const items = marketPriceDataFull[marketDetailState.category] || [];
    
    marketDetailState.allItems = [...items];
    
    // 重置排序状态
    marketDetailState.sortField = null;
    marketDetailState.sortOrder = null;
    document.querySelectorAll('.market-detail-list-header .sortable').forEach(el => {
        el.classList.remove('sort-asc', 'sort-desc', 'active');
    });
    
    renderMarketDetailList();
}

// 渲染物价列表
function renderMarketDetailList() {
    const container = document.getElementById('market-detail-list');
    if (!container) return;
    
    let items = [...marketDetailState.allItems];
    
    // 搜索过滤
    if (marketDetailState.searchQuery) {
        const query = marketDetailState.searchQuery.toLowerCase();
        items = items.filter(item => item.name.toLowerCase().includes(query));
    }
    
    // 排序
    if (marketDetailState.sortField && marketDetailState.sortOrder) {
        items.sort((a, b) => {
            let valA, valB;
            if (marketDetailState.sortField === 'price') {
                valA = a.price;
                valB = b.price;
            } else if (marketDetailState.sortField === 'change') {
                valA = Math.abs(a.change);
                valB = Math.abs(b.change);
            }
            
            if (marketDetailState.sortOrder === 'asc') {
                return valA - valB;
            } else {
                return valB - valA;
            }
        });
    }
    
    // 空状态
    if (items.length === 0) {
        container.innerHTML = `
            <div class="market-detail-empty">
                <div class="market-detail-empty-icon">📦</div>
                <div class="market-detail-empty-text">暂无匹配的物品</div>
            </div>
        `;
        return;
    }
    
    // 渲染列表
    container.innerHTML = items.map((item, index) => `
        <div class="market-detail-item" data-index="${index}">
            <div class="market-detail-item-rarity" style="background-color: ${rarityColors[item.rarity] || '#9ca3af'}"></div>
            <div class="market-detail-item-info">
                <div class="market-detail-item-name">${item.name}</div>
            </div>
            <div class="market-detail-item-price">${item.price.toLocaleString()}</div>
            <div class="market-detail-item-change ${item.positive ? 'positive' : 'negative'}">
                ${item.positive ? '+' : ''}${item.change}%${item.positive ? '↑' : '↓'}
            </div>
        </div>
    `).join('');
}

// 绑定物价详情页事件
function bindMarketDetailEvents() {
    // 返回按钮
    const backBtn = document.getElementById('market-detail-back');
    if (backBtn) {
        backBtn.addEventListener('click', closeMarketDetailPage);
    }
    
    // 搜索框输入
    const searchInput = document.getElementById('market-search-input');
    const searchClear = document.getElementById('market-search-clear');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            marketDetailState.searchQuery = this.value;
            if (searchClear) {
                searchClear.classList.toggle('visible', this.value.length > 0);
            }
            renderMarketDetailList();
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            marketDetailState.searchQuery = '';
            this.classList.remove('visible');
            renderMarketDetailList();
        });
    }
    
    // 分类选择
    const categorySelect = document.getElementById('market-detail-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            marketDetailState.category = this.value;
            loadMarketDetailData();
        });
    }
    
    // 排序按钮
    const sortPrice = document.getElementById('sort-price');
    const sortChange = document.getElementById('sort-change');
    
    if (sortPrice) {
        sortPrice.addEventListener('click', function() {
            handleSort('price', this);
        });
    }
    
    if (sortChange) {
        sortChange.addEventListener('click', function() {
            handleSort('change', this);
        });
    }
    
    // "更多"按钮点击打开详情页
    const marketMore = document.querySelector('.market-more-mobile');
    if (marketMore) {
        marketMore.addEventListener('click', openMarketDetailPage);
    }
}

// 处理排序
function handleSort(field, element) {
    const allSortables = document.querySelectorAll('.market-detail-list-header .sortable');
    
    // 如果点击的是当前排序字段，切换排序方向
    if (marketDetailState.sortField === field) {
        if (marketDetailState.sortOrder === 'desc') {
            marketDetailState.sortOrder = 'asc';
            element.classList.remove('sort-desc');
            element.classList.add('sort-asc');
        } else if (marketDetailState.sortOrder === 'asc') {
            // 取消排序
            marketDetailState.sortField = null;
            marketDetailState.sortOrder = null;
            element.classList.remove('sort-asc', 'sort-desc', 'active');
        }
    } else {
        // 点击新字段，设置为降序
        allSortables.forEach(el => {
            el.classList.remove('sort-asc', 'sort-desc', 'active');
        });
        marketDetailState.sortField = field;
        marketDetailState.sortOrder = 'desc';
        element.classList.add('sort-desc', 'active');
    }
    
    renderMarketDetailList();
}

/* ============================================
   改枪推荐子页面 - 交互逻辑
   ============================================ */
const gunDetailGunList = {
    fh: [
        { id: 'mp5', name: 'MP5' },
        { id: 'ak74', name: 'AK-74M' },
        { id: 'm4a1', name: 'M4A1' },
        { id: 'scar', name: 'SCAR-H' },
        { id: 'vss', name: 'VSS' }
    ],
    zc: [
        { id: 'm4a1', name: 'M4A1' },
        { id: 'ak74', name: 'AK-74M' },
        { id: 'hk416', name: 'HK416' },
        { id: 'aug', name: 'AUG' },
        { id: 'svd', name: 'SVD' }
    ]
};

const gunDetailDefaultAttachments = [
    { name: '瞄准镜', icon: '🔭' },
    { name: '枪口', icon: '🔫' },
    { name: '握把', icon: '✊' },
    { name: '枪托', icon: '📐' },
    { name: '弹匣', icon: '🎯' },
    { name: '战术', icon: '⚙️' }
];

let currentGunDetailMode = 'fh';
let currentGunDetailId = 'mp5';
/* ============================================
   工具页 · 改枪全量方案
   - 烽火/战场 Tab：mode
   - 三档筛选：枪械类型 / 枪械名称 / 价格（仅烽火）
   - 列表单列，每张卡：标题 / 标签 / 价格 / 复制按钮 / 枪图 / 作者 / stats
   - 点击整卡 → 打开方案详情子页（看配件清单）
   ============================================ */
const MOBILE_TYPE_NAMES = {
    ar: '突击步枪', smg: '冲锋枪', sr: '狙击步枪',
    lmg: '轻机枪', sg: '霰弹枪', pistol: '手枪'
};

// 枪械元数据（mode → 枪 id → {name, type, price?}）
const MOBILE_GUNS_FH = [
    { id: 'akm', name: 'AKM', type: 'ar', price: 125000 },
    { id: 'tenglong', name: '腾龙', type: 'ar', price: 98000 },
    { id: 'ak74', name: 'AK-74M', type: 'ar', price: 115000 },
    { id: 'm4a1', name: 'M4A1', type: 'ar', price: 105000 },
    { id: 'scar', name: 'SCAR-H', type: 'ar', price: 145000 },
    { id: 'hk416', name: 'HK416', type: 'ar', price: 135000 },
    { id: 'mp5', name: 'MP5', type: 'smg', price: 72000 },
    { id: 'vector', name: 'Vector', type: 'smg', price: 88000 },
    { id: 'mp7', name: 'MP7', type: 'smg', price: 78000 },
    { id: 'awm', name: 'AWM', type: 'sr', price: 285000 },
    { id: 'svd', name: 'SVD', type: 'sr', price: 165000 },
    { id: 'vss', name: 'VSS', type: 'sr', price: 92000 },
    { id: 'pkm', name: 'PKM', type: 'lmg', price: 158000 },
    { id: 's12k', name: 'S12K', type: 'sg', price: 65000 },
    { id: 'g18', name: 'Glock-18', type: 'pistol', price: 22000 }
];

const MOBILE_GUNS_ZC = [
    { id: 'm4a1', name: 'M4A1', type: 'ar' },
    { id: 'ak74', name: 'AK-74M', type: 'ar' },
    { id: 'hk416', name: 'HK416', type: 'ar' },
    { id: 'aug', name: 'AUG', type: 'ar' },
    { id: 'scar', name: 'SCAR-H', type: 'ar' },
    { id: 'mp5', name: 'MP5', type: 'smg' },
    { id: 'vector', name: 'Vector', type: 'smg' },
    { id: 'awm', name: 'AWM', type: 'sr' },
    { id: 'svd', name: 'SVD', type: 'sr' },
    { id: 'vss', name: 'VSS', type: 'sr' }
];

const MOBILE_FH_SCHEMES_BY_GUN = {
    // 烽火每把枪 2 套：性价比 / 满改
    _default: [
        { cost: 'budget', costIcon: '💰', priceText: '85K', totalPrice: 85000, name: '性价比方案', tags: ['新手友好', '中近距离'] },
        { cost: 'highend', costIcon: '💎', priceText: '157K', totalPrice: 157000, name: '满改方案', tags: ['长距离', '高精准'] }
    ]
};

const MOBILE_ZC_SCHEMES_BY_GUN = {
    _default: [
        { cost: 'balanced', costIcon: '🎯', priceText: '', totalPrice: 110000, name: '推荐改装方案', tags: ['PVP优化', '高稳定'] }
    ]
};

let mobileSchemeCurrentMode = 'fh';

function getMobileSchemesForGun(mode, gun) {
    const map = mode === 'fh' ? MOBILE_FH_SCHEMES_BY_GUN : MOBILE_ZC_SCHEMES_BY_GUN;
    return (map[gun.id] || map._default).map(s => ({
        ...s,
        gunId: gun.id,
        gunName: gun.name,
        gunType: gun.type,
        gunPrice: gun.price
    }));
}

function getMobileFlatSchemes(mode) {
    const guns = mode === 'fh' ? MOBILE_GUNS_FH : MOBILE_GUNS_ZC;
    const out = [];
    guns.forEach(g => getMobileSchemesForGun(mode, g).forEach(s => out.push(s)));
    return out;
}

function getMobileSchemeFilters() {
    const root = document.getElementById('gun-scheme-filters-mobile');
    if (!root) return { type: 'all', name: 'all', price: 'all' };
    return {
        type: root.querySelector('[data-filter="type"]')?.value || 'all',
        name: root.querySelector('[data-filter="name"]')?.value || 'all',
        price: root.querySelector('[data-filter="price"]')?.value || 'all'
    };
}

function matchMobilePriceBucket(price, bucket) {
    if (!price && bucket !== 'all') return false;
    switch (bucket) {
        case 'lt80': return price < 80000;
        case '80to120': return price >= 80000 && price < 120000;
        case '120to160': return price >= 120000 && price < 160000;
        case 'gt160': return price >= 160000;
        case 'all':
        default: return true;
    }
}

/**
 * 根据当前类型筛选填充「枪械名称」下拉项
 */
function populateMobileSchemeNameOptions() {
    const root = document.getElementById('gun-scheme-filters-mobile');
    if (!root) return;
    const select = root.querySelector('[data-filter="name"]');
    if (!select) return;
    const guns = mobileSchemeCurrentMode === 'fh' ? MOBILE_GUNS_FH : MOBILE_GUNS_ZC;
    const typeFilter = root.querySelector('[data-filter="type"]')?.value || 'all';
    const list = typeFilter === 'all' ? guns : guns.filter(g => g.type === typeFilter);
    const prev = select.value;
    select.innerHTML = ['<option value="all">全部枪械</option>']
        .concat(list.map(g => `<option value="${g.id}">${g.name}</option>`)).join('');
    if (prev && [...select.options].some(o => o.value === prev)) select.value = prev;
    else select.value = 'all';
}

function renderMobileGunSchemeList() {
    const list = document.getElementById('gun-scheme-list-mobile');
    if (!list) return;
    const filters = getMobileSchemeFilters();
    const rows = getMobileFlatSchemes(mobileSchemeCurrentMode).filter(s => {
        if (filters.type !== 'all' && s.gunType !== filters.type) return false;
        if (filters.name !== 'all' && s.gunId !== filters.name) return false;
        if (mobileSchemeCurrentMode === 'fh' && filters.price !== 'all'
            && !matchMobilePriceBucket(s.gunPrice, filters.price)) return false;
        return true;
    });
    if (!rows.length) {
        list.innerHTML = '<div class="gun-scheme-list-empty">暂无符合条件的方案</div>';
        return;
    }
    list.innerHTML = rows.map(s => renderMobileSchemeListCard(s)).join('');
    bindMobileSchemeListInteractions(list);
}

/* ============================================
   移动端方案 作者 / 统计 / 登录态
   - 与桌面端共用 shared/gun-detail-mock.js 的 stats 体系（localStorage）
   - 补齐工具页「改枪全量方案」渲染链路此前缺失的依赖函数
   ============================================ */
const MOBILE_SCHEME_STAT_ICONS = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    heartFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
};

function isMobileUserLoggedIn() {
    try {
        const data = JSON.parse(localStorage.getItem('df_login') || '{}');
        return !!data.loggedIn;
    } catch (e) {
        return false;
    }
}

function renderMobileSchemeAuthor(author, opts = {}) {
    if (!author || !author.name) return '';
    const compactCls = opts.compact ? ' scheme-author--compact' : '';
    const officialCls = author.official ? ' scheme-author--official' : '';
    const initial = (author.name.replace(/^DF[\s·]*/i, '')[0] || author.name[0] || '?').toUpperCase();
    const avatarText = author.official ? 'DF' : initial;
    const avatar = author.avatar
        ? `<img class="scheme-author-avatar" src="${author.avatar}" alt="${author.name}" />`
        : `<span class="scheme-author-avatar scheme-author-avatar--text">${avatarText}</span>`;
    return `
        <div class="scheme-author${compactCls}${officialCls}">
            ${avatar}
            <span class="scheme-author-name">${author.name}</span>
        </div>
    `;
}

function renderMobileSchemeStats(meta, opts = {}) {
    if (!meta || !meta.gunId) return '';
    if (typeof window.getGunSchemeStats !== 'function') return '';
    const stats = window.getGunSchemeStats(meta);
    const variantCls = opts.footer
        ? ' scheme-stats--footer'
        : (opts.compact ? ' scheme-stats--compact' : '');
    const likedCls = stats.likedByMe ? ' is-liked' : '';
    const heartIcon = stats.likedByMe ? MOBILE_SCHEME_STAT_ICONS.heartFilled : MOBILE_SCHEME_STAT_ICONS.heart;
    const fmt = window.formatStatNumber || (n => String(n));
    return `
        <div class="scheme-stats${variantCls}" data-scheme-gun="${(meta.gunId || '').toLowerCase()}" data-scheme-cost="${meta.cost || 'balanced'}">
            <button class="scheme-stat scheme-stat-like${likedCls}" type="button" aria-pressed="${stats.likedByMe}" aria-label="点赞">
                <span class="scheme-stat-icon">${heartIcon}</span>
                <span class="scheme-stat-value">${fmt(stats.likes)}</span>
            </button>
            <span class="scheme-stat scheme-stat-copy" aria-label="复制次数">
                <span class="scheme-stat-icon">${MOBILE_SCHEME_STAT_ICONS.copy}</span>
                <span class="scheme-stat-value">${fmt(stats.copies)}</span>
            </span>
        </div>
    `;
}

/** 刷新页面上指定方案 key 的所有 stats UI（卡片 / 详情页保持同步） */
function refreshMobileSchemeStatsUI(meta) {
    if (!meta || !meta.gunId || typeof window.getGunSchemeStats !== 'function') return;
    const stats = window.getGunSchemeStats(meta);
    const fmt = window.formatStatNumber || (n => String(n));
    const sel = `.scheme-stats[data-scheme-gun="${(meta.gunId || '').toLowerCase()}"][data-scheme-cost="${meta.cost || 'balanced'}"]`;
    document.querySelectorAll(sel).forEach(el => {
        const likeBtn = el.querySelector('.scheme-stat-like');
        const copyEl = el.querySelector('.scheme-stat-copy .scheme-stat-value');
        if (likeBtn) {
            likeBtn.classList.toggle('is-liked', stats.likedByMe);
            likeBtn.setAttribute('aria-pressed', String(stats.likedByMe));
            const iconWrap = likeBtn.querySelector('.scheme-stat-icon');
            if (iconWrap) iconWrap.innerHTML = stats.likedByMe ? MOBILE_SCHEME_STAT_ICONS.heartFilled : MOBILE_SCHEME_STAT_ICONS.heart;
            const valEl = likeBtn.querySelector('.scheme-stat-value');
            if (valEl) valEl.textContent = fmt(stats.likes);
        }
        if (copyEl) copyEl.textContent = fmt(stats.copies);
    });
}

/** 点赞按钮全局 click 委托（工具页列表 + 详情页多处共用） */
function ensureMobileSchemeStatsClickDelegate() {
    if (document.body.dataset.mobileSchemeStatsBound === '1') return;
    document.body.dataset.mobileSchemeStatsBound = '1';
    document.body.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.scheme-stat-like');
        if (!likeBtn) return;
        const wrap = likeBtn.closest('.scheme-stats');
        if (!wrap) return;
        e.preventDefault();
        e.stopPropagation();
        const meta = {
            gunId: wrap.dataset.schemeGun,
            cost: wrap.dataset.schemeCost
        };
        if (typeof window.toggleGunSchemeLike === 'function') {
            window.toggleGunSchemeLike(meta);
            refreshMobileSchemeStatsUI(meta);
        }
    });
}

function setMobileGunCopyButtonAuthState(btn, loggedIn) {
    const labelEl = btn.querySelector('.gun-scheme-detail-copy-label');
    const readText = () => (labelEl ? labelEl.textContent : btn.textContent).trim();
    const writeText = (val) => {
        if (labelEl) labelEl.textContent = val;
        else btn.textContent = val;
    };
    if (!btn.dataset.defaultCopyText && readText() !== '登录以复制') {
        btn.dataset.defaultCopyText = readText() || '复制';
    }
    if (loggedIn) {
        btn.disabled = false;
        writeText(btn.dataset.defaultCopyText || '复制');
    } else {
        btn.disabled = true;
        writeText('登录以复制');
        btn.style.background = '';
        btn.style.color = '';
    }
}

function updateMobileGunCopyButtonsAuthState(root = document) {
    const loggedIn = isMobileUserLoggedIn();
    root.querySelectorAll('.scheme-list-card-copy-btn, .gun-detail-copy-btn, .bpp-copy-pack-btn, .bpp-gun-copy-btn').forEach(btn => {
        setMobileGunCopyButtonAuthState(btn, loggedIn);
    });
}

function bumpMobileSchemeCopyCount(meta) {
    if (!meta || !meta.gunId) return;
    if (typeof window.incrementGunSchemeCopy !== 'function') return;
    window.incrementGunSchemeCopy(meta);
    refreshMobileSchemeStatsUI(meta);
}

function renderMobileSchemeListCard(scheme) {
    const meta = { gunId: scheme.gunId, cost: scheme.cost };
    const author = (typeof window.getGunSchemeAuthor === 'function')
        ? window.getGunSchemeAuthor(meta) : null;
    const authorHtml = renderMobileSchemeAuthor(author, { compact: true });
    const statsHtml = renderMobileSchemeStats(meta);
    // 枪图左下角浮层：方案总价（完整数字）
    const totalPriceOverlay = scheme.totalPrice
        ? `<span class="scheme-list-card-gun-price"><span class="value-icon">💎</span><span class="value-num">${scheme.totalPrice.toLocaleString('en-US')}</span></span>`
        : '';
    return `
        <div class="scheme-list-card-mobile is-clickable"
             data-gun-id="${scheme.gunId}" data-cost="${scheme.cost}" data-name="${scheme.name}">
            <!-- 顶部：标题 + 副标题 + 标签（右上角箭头暗示可点） -->
            <div class="scheme-list-card-header">
                <div class="scheme-list-card-title-row">
                    <span class="scheme-list-card-title">${scheme.name}</span>
                    <span class="scheme-list-card-arrow" aria-hidden="true">›</span>
                </div>
                <div class="scheme-list-card-sub">${scheme.gunName} · ${MOBILE_TYPE_NAMES[scheme.gunType] || ''}</div>
                <div class="scheme-list-card-tags">
                    ${scheme.tags.map(t => `<span class="scheme-list-card-tag">${t}</span>`).join('')}
                </div>
            </div>
            <!-- 复制按钮（全宽） -->
            <button class="scheme-list-card-copy-btn" type="button">复制</button>
            <!-- 中间：枪图（左下角附完整数字方案总价） -->
            <div class="scheme-list-card-gun-image">
                ${totalPriceOverlay}
            </div>
            ${authorHtml}
            ${statsHtml}
        </div>
    `;
}

function bindMobileSchemeListInteractions(list) {
    ensureMobileSchemeStatsClickDelegate();
    updateMobileGunCopyButtonsAuthState(list);

    // 复制按钮
    list.querySelectorAll('.scheme-list-card-copy-btn').forEach(btn => {
        if (btn.dataset.bound === '1') return;
        btn.dataset.bound = '1';
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!isMobileUserLoggedIn()) return;
            const card = btn.closest('.scheme-list-card-mobile');
            if (card) bumpMobileSchemeCopyCount({ gunId: card.dataset.gunId, cost: card.dataset.cost });
            this.textContent = '已复制 ✓';
            this.style.background = 'var(--accent-cyan)';
            this.style.color = '#000';
            setTimeout(() => {
                this.textContent = this.dataset.defaultCopyText || '复制';
                this.style.background = '';
                this.style.color = '';
            }, 1500);
        });
    });

    // 整卡点击 → 详情子页
    if (list.dataset.cardClickBound === '1') return;
    list.dataset.cardClickBound = '1';
    list.addEventListener('click', function(e) {
        if (e.target.closest('.scheme-list-card-copy-btn, .scheme-stat, .scheme-stat-like, .scheme-author, button, a')) return;
        const card = e.target.closest('.scheme-list-card-mobile');
        if (!card) return;
        const tags = [...card.querySelectorAll('.scheme-list-card-tag')].map(t => t.textContent.trim());
        const gunNameSub = card.querySelector('.scheme-list-card-sub')?.textContent || '';
        const gunName = gunNameSub.split('·')[0].trim();
        const buildName = card.dataset.name || '改枪方案';
        openGunSchemeDetailPage({
            gunId: card.dataset.gunId,
            gunName,
            cost: card.dataset.cost || 'balanced',
            buildName: `${gunName} · ${buildName}`,
            priceLabel: '',
            tags,
            mode: mobileSchemeCurrentMode
        });
    });
}

function bindMobileGunSchemeModule() {
    // 首页"改枪推荐"右上角"查看全部" → 切到工具 Tab
    const moreBtn = document.getElementById('gun-build-more-mobile');
    if (moreBtn && moreBtn.dataset.bound !== '1') {
        moreBtn.dataset.bound = '1';
        moreBtn.addEventListener('click', function() {
            // 触发底部导航的"工具" Tab 点击（统一走 nav-item click 路径）
            const toolsNav = document.querySelector('.nav-item[data-page="工具"]');
            if (toolsNav) {
                toolsNav.click();
                // 滚动到改枪全量方案模块
                setTimeout(() => {
                    const card = document.querySelector('.gun-scheme-card-mobile');
                    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    }

    const card = document.querySelector('.gun-scheme-card-mobile');
    if (!card) return;

    // 烽火/战场/爆破 Tab
    card.querySelectorAll('.gun-scheme-mode-tab-mobile').forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            card.querySelectorAll('.gun-scheme-mode-tab-mobile').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mobileSchemeCurrentMode = this.dataset.mode || 'fh';

            // 爆破模式：隐藏筛选器与常规列表，显示流派卡列表
            const isBp = mobileSchemeCurrentMode === 'bp';
            const filtersEl = card.querySelector('.gun-scheme-filters-mobile');
            const listEl = document.getElementById('gun-scheme-list-mobile');
            const bpListEl = document.getElementById('gun-scheme-bp-list-mobile');
            if (isBp) {
                if (filtersEl) filtersEl.style.display = 'none';
                if (listEl) listEl.style.display = 'none';
                if (bpListEl) bpListEl.style.display = '';
                renderMobileBpPackList(bpListEl);
            } else {
                if (filtersEl) filtersEl.style.display = '';
                if (listEl) listEl.style.display = '';
                if (bpListEl) bpListEl.style.display = 'none';
                // 战场不展示价格筛选
                const priceSel = card.querySelector('[data-filter="price"]');
                if (priceSel) priceSel.style.display = mobileSchemeCurrentMode === 'fh' ? '' : 'none';
                // 类型 / 名称重置并重渲染
                const typeSel = card.querySelector('[data-filter="type"]');
                if (typeSel) typeSel.value = 'all';
                populateMobileSchemeNameOptions();
                if (priceSel) priceSel.value = 'all';
                renderMobileGunSchemeList();
            }
        });
    });

    // 筛选器
    card.querySelectorAll('.gun-scheme-filter-select').forEach(sel => {
        sel.addEventListener('change', function() {
            if (this.dataset.filter === 'type') {
                populateMobileSchemeNameOptions();
            }
            renderMobileGunSchemeList();
        });
    });

    // 首屏渲染
    populateMobileSchemeNameOptions();
    renderMobileGunSchemeList();
}



// 页面加载完成后绑定事件（每个绑定独立 try/catch，避免一个失败阻塞其余）
document.addEventListener('DOMContentLoaded', function() {
    const safeRun = (name, fn) => {
        try { fn(); } catch (e) { console.error('[init failed]', name, e); }
    };
    safeRun('bindMarketDetailEvents', bindMarketDetailEvents);
    safeRun('bindAssetCalendarEvents', bindAssetCalendarEvents);
    safeRun('bindMobileBottomNav', bindMobileBottomNav);
    safeRun('bindMobileGunSchemeModule', bindMobileGunSchemeModule);
    safeRun('bindMobileBpModule', bindMobileBpModule);
    safeRun('bindGunSchemeDetailEvents', bindGunSchemeDetailEvents);
    safeRun('bindHomeBuildCardDetailEvents', bindHomeBuildCardDetailEvents);
    safeRun('initLoginSystem', initLoginSystem);
    safeRun('initMobileChangelogModal', initMobileChangelogModal);
    safeRun('initMobileRedDetailModal', initMobileRedDetailModal);
});

function bindMobileBottomNav() {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        if (item.dataset.bound === '1') return;
        item.dataset.bound = '1';
        item.addEventListener('click', function() {
            document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            showMobilePage(this.dataset.page || '首页');
        });
    });
}

function showMobilePage(pageName) {
    const pageMap = {
        '首页': 'page-home',
        '工具': 'page-tools',
        'Wiki': 'page-guides',
        '我的': 'page-profile'
    };
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    const targetPage = document.getElementById(pageMap[pageName] || 'page-home');
    if (targetPage) targetPage.style.display = 'block';

    if (pageName === '工具') {
        setTimeout(() => {
            if (typeof updateCraftItemsMobile === 'function') updateCraftItemsMobile(currentCraftTypeMobile);
            if (typeof initMarketPriceMobile === 'function') initMarketPriceMobile();
        }, 50);
    }
}

function initMobileChangelogModal() {
    const trigger = document.getElementById('mobile-changelog-entry-btn');
    const overlay = document.getElementById('mobile-changelog-modal-overlay');
    const closeBtn = document.getElementById('mobile-changelog-modal-close');
    if (!trigger || !overlay) return;

    const openModal = () => overlay.classList.add('active');
    const closeModal = () => overlay.classList.remove('active');

    trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal();
    });
}

function initMobileRedDetailModal() {
    const overlay = document.getElementById('mobile-red-detail-overlay');
    const closeBtn = document.getElementById('mobile-red-detail-close');
    const grid = document.querySelector('#tab-collection .collection-grid');
    if (!overlay || !grid) return;

    const detailData = {
        '动力电池组': { icon: '▣', date: '2026-02-10', location: '航天基地-机密' },
        '克劳迪乌斯半身像': { icon: '◈', date: '2026-02-08', location: '巴克什-机密' },
        '呼吸机': { icon: '⬡', date: '2026-02-12', location: '零号大坝-机密' },
        '黄金瞪羚': { icon: '◇', date: '2026-02-06', location: '长弓溪谷-常规' },
        '棘龙爪化石': { icon: '△', date: '2026-02-03', location: '潮汐监狱-机密' },
        '奥莉薇娅香槟': { icon: '⬢', date: '2026-01-30', location: '零号大坝-常规' }
    };

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function openModal(name) {
        const data = detailData[name] || { icon: '▣', date: '2026-02-10', location: '航天基地-机密' };
        setText('mobile-red-detail-title', name);
        setText('mobile-red-detail-art', data.icon);
        setText('mobile-red-detail-date', data.date);
        setText('mobile-red-detail-location', data.location);
        setText('mobile-red-record-time', data.date);
        setText('mobile-red-record-location', data.location);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    grid.addEventListener('click', (event) => {
        const item = event.target.closest('.collection-item');
        if (!item) return;
        const name = item.dataset.redName || item.querySelector('.collection-item-tag')?.textContent?.trim();
        if (name) openModal(name);
    });

    grid.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const item = event.target.closest('.collection-item');
        if (!item) return;
        event.preventDefault();
        const name = item.dataset.redName || item.querySelector('.collection-item-tag')?.textContent?.trim();
        if (name) openModal(name);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal();
    });
}

/* ============================================
   改枪方案详情子页面
   ============================================ */
function openGunSchemeDetailPage(meta) {
    meta = meta || {};
    const page = document.getElementById('page-gun-scheme-detail');
    const body = document.getElementById('gun-scheme-detail-body');
    const footer = document.getElementById('gun-scheme-detail-footer');
    if (!page || !body || typeof window.getGunSchemeDetail !== 'function') return;

    const detail = window.getGunSchemeDetail({
        gunId: meta.gunId,
        gunName: meta.gunName,
        cost: meta.cost,
        code: meta.code,
        name: meta.buildName
    });

    body.innerHTML = renderGunSchemeDetailBodyHTML(meta, detail);
    if (footer) {
        footer.innerHTML = renderGunSchemeDetailFooterHTML(meta, detail);
        bindGunSchemeDetailFooter(footer, detail, meta);
    }
    ensureMobileSchemeStatsClickDelegate();

    page.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGunSchemeDetailPage() {
    const page = document.getElementById('page-gun-scheme-detail');
    if (!page) return;
    page.classList.remove('active');
    document.body.style.overflow = '';
}

function bindGunSchemeDetailEvents() {
    const backBtn = document.getElementById('gun-scheme-detail-back');
    if (backBtn) backBtn.addEventListener('click', closeGunSchemeDetailPage);
}

function renderGunSchemeDetailBodyHTML(meta, detail) {
    const tags = (meta.tags || []).filter(Boolean);
    const totalLabel = detail.totalPrice ? `💎 ${detail.totalPrice.toLocaleString()}` : '';
    const authorHtml = renderMobileSchemeAuthor(detail.author);

    return `
        <section class="gun-scheme-detail-overview">
            <div class="gun-scheme-detail-title-row">
                <span class="gun-scheme-detail-title">${meta.buildName || '改枪方案详情'}</span>
            </div>
            ${totalLabel ? `<div class="gun-scheme-detail-price-row">
                <span class="gun-scheme-detail-price">${totalLabel}</span>
            </div>` : ''}
            ${tags.length ? `<div class="gun-scheme-detail-tags">
                ${tags.map(tag => `<span class="gun-scheme-detail-tag">${tag}</span>`).join('')}
            </div>` : ''}
            <!-- 全宽枪图 -->
            <div class="gun-scheme-detail-gun-image" aria-hidden="true"></div>
            ${authorHtml}
        </section>

        <section class="gun-scheme-detail-section">
            <h3 class="gun-scheme-detail-section-title">配件清单</h3>
            <div class="gun-scheme-attachment-list">
                ${detail.attachments.map(att => renderMobileAttachmentRow(att)).join('')}
            </div>
        </section>
    `;
}

function renderGunSchemeDetailFooterHTML(meta, detail) {
    const statsHtml = renderMobileSchemeStats({ gunId: meta?.gunId, cost: meta?.cost }, { footer: true });
    const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    return `
        <div class="gun-scheme-detail-footer-stats">${statsHtml}</div>
        <button class="gun-scheme-detail-copy-btn gun-detail-copy-btn" type="button" data-code="${detail.code}">
            <span class="gun-scheme-detail-copy-icon" aria-hidden="true">${copyIcon}</span>
            <span class="gun-scheme-detail-copy-label">复制改枪码</span>
        </button>
    `;
}

function renderMobileAttachmentRow(att) {
    const effectsHtml = (att.effects || []).map(effect => {
        const cls = effect.positive ? 'effect-positive' : 'effect-negative';
        const sign = effect.value > 0 ? '+' : '';
        return `
            <div class="attachment-effect ${cls}">
                <span class="effect-label">${effect.label}</span>
                <span class="effect-value">${sign}${effect.value}</span>
            </div>
        `;
    }).join('');

    const priceLabel = att.price ? `💎 ${att.price.toLocaleString()}` : '';
    const subtitle = att.subtitle ? `<span class="attachment-subtitle">${att.subtitle}</span>` : '';

    return `
        <div class="attachment-row">
            <div class="attachment-row-icon">${att.icon}</div>
            <div class="attachment-row-main">
                <div class="attachment-row-header">
                    <div class="attachment-row-title">
                        <span class="attachment-slot-name">${att.slotName}</span>
                        <span class="attachment-name">${att.name}</span>
                    </div>
                    ${priceLabel ? `<span class="attachment-price">${priceLabel}</span>` : ''}
                </div>
                ${subtitle ? `<div class="attachment-row-sub">${subtitle}</div>` : ''}
                ${effectsHtml ? `<div class="attachment-effects">${effectsHtml}</div>` : ''}
            </div>
        </div>
    `;
}

function bindGunSchemeDetailFooter(footerEl, detail, meta) {
    updateMobileGunCopyButtonsAuthState(footerEl);
    const copyBtn = footerEl.querySelector('.gun-scheme-detail-copy-btn');
    if (!copyBtn) return;
    const labelEl = copyBtn.querySelector('.gun-scheme-detail-copy-label');
    const defaultLabel = labelEl?.textContent || '复制改枪码';
    copyBtn.addEventListener('click', function() {
        if (!isMobileUserLoggedIn()) return;
        if (meta && meta.gunId) bumpMobileSchemeCopyCount({ gunId: meta.gunId, cost: meta.cost });
        if (labelEl) labelEl.textContent = '已复制 ✓';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            if (labelEl) labelEl.textContent = defaultLabel;
            copyBtn.classList.remove('copied');
        }, 1500);
    });
}

function bindHomeBuildCardDetailEvents() {
    if (document.body.dataset.viewDetailMobileBound === '1') return;
    document.body.dataset.viewDetailMobileBound = '1';
    document.body.addEventListener('click', function(e) {
        // 排除卡片内的交互元素
        if (e.target.closest('.copy-btn, .scheme-stat, .scheme-stat-like, .scheme-author, button, a')) return;
        const card = e.target.closest('.build-card.is-clickable');
        if (!card) return;
        // 只处理首页方案卡：必须在 build-cards-container 内
        if (!card.closest('[id*="gun-builds-content"]')) return;
        e.stopPropagation();
        const cost = card.dataset.gunCost
            || (card.classList.contains('budget') ? 'budget'
                : card.classList.contains('premium') ? 'highend'
                : 'balanced');
        const fallbackName = card.classList.contains('budget') ? '性价比改法'
            : card.classList.contains('premium') ? '满改方案'
            : '推荐方案';
        const tags = [...card.querySelectorAll('.build-tag')]
            .map(t => (t.textContent || '').trim())
            .filter(Boolean)
            .filter(t => !/^gunBuilds\./i.test(t));

        // 取当前选中的枪
        const container = card.closest('[id*="gun-builds-content"]');
        const isZc = (container?.id || '').includes('zc');
        const mode = isZc ? 'zc' : 'fh';
        const selectorId = isZc ? 'gun-selector-zc-mobile' : 'gun-selector-fh-mobile';
        let activeGun = document.querySelector(`#${selectorId} .gun-tab.active`);
        if (!activeGun) {
            activeGun = document.querySelector('.gun-selector .gun-tab.active');
        }
        const gunId = activeGun?.dataset?.gun || 'm4a1';
        const gunName = activeGun?.querySelector('.gun-tab-name')?.textContent?.trim() || gunId.toUpperCase();

        openGunSchemeDetailPage({
            gunId,
            gunName,
            cost,
            buildName: `${gunName} · ${fallbackName}`,
            priceLabel: '',
            tags,
            mode
        });
    });
}

/* ============================================
   登录系统
   ============================================ */
// 登录状态
let isLoggedIn = false;

// 初始化登录系统
function initLoginSystem() {
    const loginAvatarBtn = document.getElementById('login-avatar-btn');
    const loginModal = document.getElementById('login-modal-overlay');
    const loginModalClose = document.getElementById('login-modal-close');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const logoutModal = document.getElementById('logout-modal-overlay');
    const logoutCancelBtn = document.getElementById('logout-cancel-btn');
    const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
    
    // 社交登录按钮
    const socialBtns = document.querySelectorAll('.social-btn');
    
    // 登录方式选择弹窗
    const loginMethodOverlay = document.getElementById('login-method-overlay');
    const loginMethodClose = document.getElementById('login-method-close');
    const loginMethodLI = document.getElementById('login-method-li');
    const loginMethodGarena = document.getElementById('login-method-garena');

    // 点击登录头像按钮
    if (loginAvatarBtn) {
        loginAvatarBtn.addEventListener('click', function() {
            if (isLoggedIn) {
                openLogoutModal();
            } else {
                // 先打开方式选择弹窗
                if (loginMethodOverlay) loginMethodOverlay.classList.add('active');
            }
        });
    }

    // 关闭登录方式选择弹窗
    if (loginMethodClose) {
        loginMethodClose.addEventListener('click', function() {
            if (loginMethodOverlay) loginMethodOverlay.classList.remove('active');
        });
    }
    if (loginMethodOverlay) {
        loginMethodOverlay.addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
    }

    // 选择 Level Infinite → 关闭方式弹窗，打开原登录弹窗
    if (loginMethodLI) {
        loginMethodLI.addEventListener('click', function() {
            if (loginMethodOverlay) loginMethodOverlay.classList.remove('active');
            openLoginModal();
        });
    }

    // 选择 Garena → 直接完成登录
    if (loginMethodGarena) {
        loginMethodGarena.addEventListener('click', function() {
            if (loginMethodOverlay) loginMethodOverlay.classList.remove('active');
            performLogin('garena');
        });
    }
    
    // 关闭登录弹窗
    if (loginModalClose) {
        loginModalClose.addEventListener('click', closeLoginModal);
    }
    
    // 点击遮罩关闭登录弹窗
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLoginModal();
            }
        });
    }
    
    // 登录/注册按钮 - 邮箱登录
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', function() {
            performLogin('email');
        });
    }
    
    // 社交登录按钮 - 传入来源
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const source = this.id.replace('social-', ''); // 'google', 'facebook', etc.
            performLogin(source);
        });
    });
    
    // 密码登录链接
    const passwordLoginLink = document.querySelector('.password-login-link');
    if (passwordLoginLink) {
        passwordLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            performLogin('email');
        });
    }
    
    // 获取验证码按钮
    const getCodeBtn = document.querySelector('.get-code-btn');
    if (getCodeBtn) {
        getCodeBtn.addEventListener('click', function() {
            performLogin('email');
        });
    }
    
    // 退出登录取消按钮
    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', closeLogoutModal);
    }
    
    // 退出登录确认按钮
    if (logoutConfirmBtn) {
        logoutConfirmBtn.addEventListener('click', function() {
            performLogout();
        });
    }
    
    // 点击遮罩关闭退出确认弹窗
    if (logoutModal) {
        logoutModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLogoutModal();
            }
        });
    }
    
    // 点击已登录区域切换下拉菜单
    const userLoggedArea = document.getElementById('mobile-user-logged');
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    if (userLoggedArea && dropdownMenu) {
        userLoggedArea.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isLoggedIn) {
                dropdownMenu.classList.toggle('active');
            }
        });

        // 点击页面其他区域关闭下拉菜单
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('active');
        });

        // 防止点击菜单本身关闭
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 下拉菜单 - 意见反馈
    const dropdownFeedback = document.getElementById('dropdown-feedback');
    if (dropdownFeedback) {
        dropdownFeedback.addEventListener('click', function() {
            dropdownMenu.classList.remove('active');
            var overlay = document.getElementById('feedback-modal-overlay');
            if (overlay) overlay.classList.add('active');
        });
    }

    // 下拉菜单 - 退出登录
    const dropdownLogout = document.getElementById('dropdown-logout');
    if (dropdownLogout) {
        dropdownLogout.addEventListener('click', function() {
            dropdownMenu.classList.remove('active');
            openLogoutModal();
        });
    }
    
    // 页面加载时检查登录状态
    checkMobileLoginState();
}

// 打开登录弹窗
function openLoginModal() {
    const loginModal = document.getElementById('login-modal-overlay');
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

// 关闭登录弹窗
function closeLoginModal() {
    const loginModal = document.getElementById('login-modal-overlay');
    if (loginModal) {
        loginModal.classList.remove('active');
    }
}

// 打开退出登录确认弹窗
function openLogoutModal() {
    const logoutModal = document.getElementById('logout-modal-overlay');
    if (logoutModal) {
        logoutModal.classList.add('active');
    }
}

// 关闭退出登录确认弹窗
function closeLogoutModal() {
    const logoutModal = document.getElementById('logout-modal-overlay');
    if (logoutModal) {
        logoutModal.classList.remove('active');
    }
}

// 执行登录
function performLogin(source) {
    // 获取邮箱输入
    const emailInput = document.querySelector('.login-modal .login-input[type="email"]');
    let email = emailInput ? emailInput.value.trim() : '';
    if (!email) email = 'user@example.com';
    
    // 判断是否Google登录（有头像）
    const isGoogle = (source === 'google');
    const hasAvatar = isGoogle;
    const avatarUrl = isGoogle ? 'https://lh3.googleusercontent.com/a/default-user=s96-c' : '';
    
    // Facebook 登录必定无游戏账号（方便测试），其他渠道正常登录
    const hasGameAccount = (source === 'facebook') ? false : true;
    
    if (!hasGameAccount) {
        // 关闭登录弹窗，弹出引导（传入登录信息供游客模式使用）
        closeLoginModal();
        showMobileNoAccountModal(email, hasAvatar, avatarUrl);
        return;
    }
    
    isLoggedIn = true;
    
    // 保存到 localStorage
    const loginData = { email, hasAvatar, avatarUrl, loggedIn: true };
    localStorage.setItem('df_login', JSON.stringify(loginData));
    
    // 更新UI
    updateLoginUI(loginData);
    
    // 关闭登录弹窗
    closeLoginModal();
}

function showMobileNoAccountModal(email, hasAvatar, avatarUrl) {
    const overlay = document.getElementById('mobile-no-account-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    
    // 游客模式登录：保存登录状态并更新UI
    function guestLogin() {
        overlay.classList.remove('active');
        isLoggedIn = true;
        const loginData = { email, hasAvatar, avatarUrl, loggedIn: true };
        localStorage.setItem('df_login', JSON.stringify(loginData));
        updateLoginUI(loginData);
    }
    
    // 点击遮罩 → 游客模式登录
    overlay.onclick = function(e) {
        if (e.target === overlay) guestLogin();
    };
    
    // 切换账号
    const switchBtn = document.getElementById('mobile-no-account-switch');
    if (switchBtn) {
        switchBtn.onclick = function(e) {
            e.preventDefault();
            overlay.classList.remove('active');
            localStorage.removeItem('df_login');
            isLoggedIn = false;
            updateLoginUI(null);
            const methodOverlay = document.getElementById('login-method-overlay');
            if (methodOverlay) methodOverlay.classList.add('active');
        };
    }
    
    // 游客模式按钮
    const guestBtn = document.getElementById('mobile-no-account-guest');
    if (guestBtn) {
        guestBtn.onclick = function(e) {
            e.preventDefault();
            guestLogin();
        };
    }
}

// 更新登录UI
function updateLoginUI(data) {
    const loginAvatarBtn = document.getElementById('login-avatar-btn');
    const userLogged = document.getElementById('mobile-user-logged');
    const userAvatar = document.getElementById('mobile-user-avatar');
    const userEmail = document.getElementById('mobile-user-email');
    
    if (data && data.loggedIn) {
        // 隐藏默认登录按钮，显示已登录信息
        if (loginAvatarBtn) loginAvatarBtn.style.display = 'none';
        if (userLogged) userLogged.style.display = 'flex';
        updateMobileGunCopyButtonsAuthState();
        
        // 设置邮箱
        if (userEmail) userEmail.textContent = data.email || '';
        
        // 设置头像
        if (data.hasAvatar && data.avatarUrl) {
            if (userAvatar) {
                userAvatar.src = data.avatarUrl;
                userAvatar.style.display = 'block';
            }
        } else {
            if (userAvatar) userAvatar.style.display = 'none';
        }
    } else {
        // 显示默认登录按钮，隐藏已登录信息
        if (loginAvatarBtn) {
            loginAvatarBtn.style.display = 'flex';
            loginAvatarBtn.classList.remove('logged-in');
        }
        if (userLogged) userLogged.style.display = 'none';
        updateMobileGunCopyButtonsAuthState();
    }
}

// 检查登录状态（页面加载时调用）
function checkMobileLoginState() {
    try {
        const stored = localStorage.getItem('df_login');
        if (stored) {
            const data = JSON.parse(stored);
            if (data && data.loggedIn) {
                isLoggedIn = true;
                updateLoginUI(data);
                return;
            }
        }
    } catch (e) {
        console.warn('读取登录状态失败', e);
    }
    isLoggedIn = false;
    updateLoginUI(null);
}

// 执行退出登录
function performLogout() {
    isLoggedIn = false;
    
    // 清除 localStorage
    localStorage.removeItem('df_login');
    
    // 更新UI
    updateLoginUI(null);
    
    // 关闭下拉菜单
    var dm = document.getElementById('user-dropdown-menu');
    if (dm) dm.classList.remove('active');
    
    // 关闭退出确认弹窗
    closeLogoutModal();
}

/* ============================================
   分享功能
   ============================================ */
// 初始化分享功能
document.addEventListener('DOMContentLoaded', function() {
    initShareFeature();
});

function initShareFeature() {
    const shareBtn = document.getElementById('share-daily-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            showShareOptions();
        });
    }
}

// 显示分享选项
function showShareOptions() {
    // 先根据当前日报 Tab 更新海报内容
    updatePosterByMode();
    showCustomShareModal();
}

// 根据当前日报模式更新海报内容
function updatePosterByMode() {
    const activeTab = document.querySelector('.report-tab.active');
    const mode = activeTab ? activeTab.getAttribute('data-report') : 'fh';
    
    const posterModeLabel = document.getElementById('poster-mode-label');
    const posterReportTitle = document.getElementById('poster-report-title');
    const posterFhData = document.getElementById('poster-fh-data');
    const posterZcData = document.getElementById('poster-zc-data');
    const posterKeywordTag = document.getElementById('poster-keyword-tag');
    const posterKeywordDesc = document.getElementById('poster-keyword-desc');

    // 使用 I18n.t() 获取翻译文本（如果 I18n 可用）
    const t = (key, fallback) => {
        if (window.I18n && typeof I18n.t === 'function') {
            const val = I18n.t(key);
            return val !== key ? val : fallback;
        }
        return fallback;
    };
    
    if (mode === 'fh') {
        // 烽火地带
        if (posterModeLabel) posterModeLabel.textContent = t('gameMode.fenghuo', '烽火地带');
        if (posterReportTitle) posterReportTitle.textContent = t('gameMode.fenghuoDaily', '烽火日报');
        if (posterFhData) posterFhData.style.display = '';
        if (posterZcData) posterZcData.style.display = 'none';
        if (posterKeywordTag) posterKeywordTag.textContent = '大红扫荡者';
        if (posterKeywordDesc) posterKeywordDesc.textContent = '昨日带出5件以上红色品质物品';
    } else if (mode === 'bp') {
        // 爆破模式：海报暂无对应数据区，仅更新标签与关键词（数据区隐藏）
        if (posterModeLabel) posterModeLabel.textContent = '爆破模式';
        if (posterReportTitle) posterReportTitle.textContent = '爆破日报';
        if (posterFhData) posterFhData.style.display = 'none';
        if (posterZcData) posterZcData.style.display = 'none';
        if (posterKeywordTag) posterKeywordTag.textContent = '包点艺术家';
        if (posterKeywordDesc) posterKeywordDesc.textContent = '单日完成 3 次成功下包';
    } else {
        // 全面战场
        if (posterModeLabel) posterModeLabel.textContent = t('gameMode.zhanchang', '全面战场');
        if (posterReportTitle) posterReportTitle.textContent = t('gameMode.zhanchangDaily', '战场日报');
        if (posterFhData) posterFhData.style.display = 'none';
        if (posterZcData) posterZcData.style.display = '';
        if (posterKeywordTag) posterKeywordTag.textContent = '战场霸主';
        if (posterKeywordDesc) posterKeywordDesc.textContent = '单场最高得分超过30,000分';
    }

    // 重新应用 i18n 翻译（确保带 data-i18n 属性的元素被正确翻译）
    if (window.I18n && typeof I18n.applyTranslations === 'function') {
        I18n.applyTranslations();
    }
}

// 显示自定义分享弹窗
function showCustomShareModal() {
    const shareModal = document.getElementById('share-modal-overlay');
    if (shareModal) {
        shareModal.classList.add('active');
    }
}

// 关闭分享弹窗
function closeShareModal() {
    const shareModal = document.getElementById('share-modal-overlay');
    if (shareModal) {
        shareModal.classList.remove('active');
    }
}

// 复制链接
function copyShareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        // 显示复制成功提示
        const copyBtn = document.querySelector('.share-option-copy .platform-name');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        }
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

/* ============================================
   意见反馈功能
   ============================================ */
(function() {
    let feedbackImages = []; // 存储已上传的图片 base64

    document.addEventListener('DOMContentLoaded', function() {
        initFeedbackSystem();
    });

    function initFeedbackSystem() {
        const closeBtn = document.getElementById('feedback-modal-close');
        const overlay = document.getElementById('feedback-modal-overlay');
        const submitBtn = document.getElementById('feedback-submit-btn');
        const textarea = document.getElementById('feedback-textarea');
        const charCount = document.getElementById('feedback-char-count');
        const imageAddBtn = document.getElementById('feedback-image-add');
        const imageInput = document.getElementById('feedback-image-input');
        // 关闭反馈弹窗
        if (closeBtn) {
            closeBtn.addEventListener('click', closeFeedbackModal);
        }

        // 点击遮罩关闭
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeFeedbackModal();
                }
            });
        }

        // 字数统计
        if (textarea && charCount) {
            textarea.addEventListener('input', function() {
                charCount.textContent = this.value.length;
            });
        }

        // 图片上传按钮
        if (imageAddBtn && imageInput) {
            imageAddBtn.addEventListener('click', function() {
                if (feedbackImages.length >= 3) return;
                imageInput.click();
            });

            imageInput.addEventListener('change', function() {
                handleFeedbackImageUpload(this.files);
                this.value = ''; // 重置以允许再次选择同文件
            });
        }

        // textarea 粘贴图片支持
        if (textarea) {
            textarea.addEventListener('paste', function(e) {
                var items = e.clipboardData && e.clipboardData.items;
                if (!items) return;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        e.preventDefault();
                        if (feedbackImages.length >= 3) return;
                        var file = items[i].getAsFile();
                        if (!file || file.size > 5 * 1024 * 1024) return;
                        var reader = new FileReader();
                        reader.onload = function(ev) {
                            feedbackImages.push(ev.target.result);
                            renderFeedbackImages();
                        };
                        reader.readAsDataURL(file);
                        break;
                    }
                }
            });
        }

        // 提交反馈
        if (submitBtn) {
            submitBtn.addEventListener('click', submitFeedback);
        }
    }

    function openFeedbackModal() {
        const overlay = document.getElementById('feedback-modal-overlay');
        if (overlay) overlay.classList.add('active');
    }

    function closeFeedbackModal() {
        const overlay = document.getElementById('feedback-modal-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    function handleFeedbackImageUpload(files) {
        if (!files || files.length === 0) return;

        var remaining = 3 - feedbackImages.length;
        var toProcess = Math.min(files.length, remaining);

        for (var i = 0; i < toProcess; i++) {
            (function(file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('图片大小不能超过5MB');
                    return;
                }
                if (!file.type.startsWith('image/')) return;

                var reader = new FileReader();
                reader.onload = function(e) {
                    feedbackImages.push(e.target.result);
                    renderFeedbackImages();
                };
                reader.readAsDataURL(file);
            })(files[i]);
        }
    }

    function renderFeedbackImages() {
        var grid = document.getElementById('feedback-image-grid');
        var addBtn = document.getElementById('feedback-image-add');
        if (!grid || !addBtn) return;

        // 清除已有预览（保留添加按钮）
        var previews = grid.querySelectorAll('.feedback-image-preview');
        previews.forEach(function(p) { p.remove(); });

        // 重新渲染
        feedbackImages.forEach(function(src, idx) {
            var div = document.createElement('div');
            div.className = 'feedback-image-preview';
            div.innerHTML = '<img src="' + src + '" alt="">' +
                '<button class="feedback-image-remove" data-idx="' + idx + '">✕</button>';
            grid.insertBefore(div, addBtn);
        });

        // 隐藏/显示添加按钮
        addBtn.style.display = feedbackImages.length >= 3 ? 'none' : 'flex';

        // 绑定删除事件
        grid.querySelectorAll('.feedback-image-remove').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var idx = parseInt(this.dataset.idx);
                feedbackImages.splice(idx, 1);
                renderFeedbackImages();
            });
        });
    }

    function submitFeedback() {
        var textarea = document.getElementById('feedback-textarea');
        var content = textarea ? textarea.value.trim() : '';

        if (!content) {
            alert('请输入反馈内容');
            return;
        }

        var selectedType = document.querySelector('input[name="feedback-type"]:checked');
        var feedbackType = selectedType ? selectedType.value : 'tool';
        var feedbackData = {
            type: feedbackType,
            content: content,
            images: feedbackImages,
            timestamp: new Date().toISOString()
        };

        console.log('反馈数据:', feedbackData);

        // 模拟提交成功
        alert('感谢您的反馈！');

        // 重置表单
        if (textarea) textarea.value = '';
        var charCount = document.getElementById('feedback-char-count');
        if (charCount) charCount.textContent = '0';
        feedbackImages = [];
        renderFeedbackImages();

        closeFeedbackModal();
    }
})();

/* ============================================
   爆破模式 · 背包码流派（移动端）
   - 一级：流派卡列表（工具页全量 / 首页精选 2 张）
   - 二级：流派详情子页（16 把枪，4 级别分组，单列）
   - 统计/登录门槛与桌面共用 shared/gun-detail-mock.js 体系
   ============================================ */
const BP_M_TIER_ORDER = ['pistol', 'standard', 'elite', 'special'];
const BP_M_TIER_NAMES = { pistol: '手枪', standard: '标准', elite: '精锐', special: '特种' };
const BP_M_TIER_COST = { pistol: 'budget', standard: 'balanced', elite: 'highend', special: 'highend' };
const BP_M_POINTS_ICON_SVG = '<svg class="bpp-points-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.2" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.6 L10.8 8 L8 11.4 L5.2 8 Z" fill="currentColor"/></svg>';
const BP_M_PLATFORM_ICON_SVG = '<svg class="bpp-platform-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.4 2 1.9 3.6 4 3.9v3c-1.6 0-3-.5-4.1-1.3v6.6c0 3.5-2.6 6-6 6-3.3 0-5.8-2.4-5.8-5.6 0-3.3 2.7-5.7 6.1-5.5.3 0 .7 0 1 .1v3.1c-.3-.1-.6-.2-1-.2-1.7 0-3 1.2-3 2.9 0 1.6 1.2 2.8 2.8 2.8 1.8 0 3-1.4 3-3.5V3h3z"/></svg>';

function getMobileBpPacks() {
    return (window.demolitionBackpacks || []);
}

// 与桌面一致的统计 key（跨端共用 localStorage 口径）
function bpMPackStatMeta(pack) {
    return { gunId: 'bpack-' + pack.id, cost: 'balanced' };
}

function bpMGunSlug(name) {
    const baseName = name.split('-')[0];
    const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return slug || baseName;
}

function bpMGunStatMeta(slot) {
    return { gunId: 'bp-' + bpMGunSlug(slot.name), cost: BP_M_TIER_COST[slot.tier] || 'balanced' };
}

function copyMobileBpCode(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () { fallbackCopyMobileBp(text); });
    } else {
        fallbackCopyMobileBp(text);
    }
}

function fallbackCopyMobileBp(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(textarea);
}

// 按钮反馈：已复制 → 1.5s 恢复
function flashMobileBpCopyBtn(btn) {
    if (!btn) return;
    const labelEl = btn.querySelector('.bpp-btn-label');
    const original = btn.dataset.defaultCopyText || (labelEl ? labelEl.textContent : btn.textContent) || '复制';
    if (labelEl) labelEl.textContent = '已复制 ✓';
    else btn.textContent = '已复制 ✓';
    btn.classList.add('copied');
    setTimeout(() => {
        if (labelEl) labelEl.textContent = original;
        else btn.textContent = original;
        btn.classList.remove('copied');
    }, 1500);
}

/* ---- 流派卡（一级，工具页与首页共用） ---- */
function renderMobileBpAuthorHtml(author) {
    if (!author || !author.name) return '';
    const initial = (author.name[0] || '?').toUpperCase();
    return `
        <span class="bpp-author">
            ${BP_M_PLATFORM_ICON_SVG}
            <span class="bpp-author-avatar">${initial}</span>
            <span class="bpp-author-name">${author.name}</span>
        </span>`;
}

function renderMobileBpPackCard(pack) {
    return `
        <div class="bpp-card" data-pack-id="${pack.id}">
            <div class="bpp-card-head">
                ${renderMobileBpAuthorHtml(pack.author)}
                ${renderMobileSchemeStats(bpMPackStatMeta(pack), { compact: true })}
            </div>
            <div class="bpp-card-name">${pack.name}</div>
            <div class="bpp-card-intro">${pack.intro || ''}</div>
            <div class="bpp-card-btns">
                <button class="bpp-copy-pack-btn" type="button" data-pack-id="${pack.id}"><span class="bpp-btn-label">复制背包码</span></button>
                <button class="bpp-view-detail-btn" type="button" data-pack-id="${pack.id}">查看 16 把枪</button>
            </div>
        </div>`;
}

function renderMobileBpPackList(container, limit) {
    if (!container) return;
    const packs = getMobileBpPacks();
    if (!packs.length) {
        container.innerHTML = '<div class="gun-scheme-list-empty">暂无爆破流派</div>';
        return;
    }
    const list = limit ? packs.slice(0, limit) : packs;
    container.innerHTML = list.map(renderMobileBpPackCard).join('');
    updateMobileGunCopyButtonsAuthState(container);
}

/* ---- 流派详情子页（二级） ---- */
let bpMActivePackId = null;

function openMobileBpPackDetail(packId) {
    const packs = getMobileBpPacks();
    const pack = packs.find(p => p.id === packId);
    const page = document.getElementById('page-bp-pack-detail');
    const body = document.getElementById('bp-pack-detail-body');
    if (!pack || !page || !body) return;
    bpMActivePackId = packId;

    const titleEl = document.getElementById('bp-pack-detail-title');
    if (titleEl) titleEl.textContent = pack.name + ' · 16 把枪';

    body.innerHTML = `
        <div class="bppd-lead">
            <div class="bppd-lead-head">
                ${renderMobileBpAuthorHtml(pack.author)}
                ${renderMobileSchemeStats(bpMPackStatMeta(pack), { compact: true })}
            </div>
            <div class="bppd-lead-name">${pack.name}</div>
            <div class="bppd-lead-intro">${pack.intro || ''}</div>
        </div>
        ${BP_M_TIER_ORDER.map(tier => `
            <div class="bppd-group">
                <div class="bppd-group-title"><span class="bpp-tier-marker bpp-tier-${tier}"></span>${BP_M_TIER_NAMES[tier]}</div>
                ${pack.slots.filter(s => s.tier === tier).map(slot => renderMobileBpGunRow(slot)).join('')}
            </div>`).join('')}
        <div class="bppd-tip">积分为爆破模式局内货币；标配手枪无改枪码，其余枪械可复制改枪码。</div>
    `;

    const copyAllBtn = document.getElementById('bp-pack-copy-all');
    if (copyAllBtn) {
        copyAllBtn.dataset.packId = pack.id;
        copyAllBtn.dataset.defaultCopyText = '复制背包码';
    }
    updateMobileGunCopyButtonsAuthState(page);

    page.classList.add('active');
    body.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}

function closeMobileBpPackDetail() {
    const page = document.getElementById('page-bp-pack-detail');
    if (!page) return;
    page.classList.remove('active');
    document.body.style.overflow = '';
}

function renderMobileBpGunRow(slot) {
    const hasCode = !!slot.buildCode;
    return `
        <div class="bppd-gun ${hasCode ? 'is-clickable' : 'is-static'}" data-tier="${slot.tier}">
            <div class="bppd-gun-img" aria-hidden="true"></div>
            <div class="bppd-gun-info">
                <div class="bppd-gun-name" title="${slot.name}">${slot.name}</div>
                <div class="bppd-gun-meta">
                    <span class="bppd-gun-points">${BP_M_POINTS_ICON_SVG}${slot.points}</span>
                    ${hasCode ? renderMobileSchemeStats(bpMGunStatMeta(slot), { compact: true }) : '<span class="bppd-stock">标配</span>'}
                </div>
            </div>
            ${hasCode ? `<button class="bpp-gun-copy-btn" type="button" data-build-code="${slot.buildCode}"><span class="bpp-btn-label">复制</span></button>` : ''}
        </div>`;
}

/* ---- 单枪详情（复用现有配件详情子页） ---- */
function openMobileBpGunDetail(slot) {
    const meta = bpMGunStatMeta(slot);
    openGunSchemeDetailPage({
        gunId: meta.gunId,
        gunName: slot.name.split('-')[0],
        cost: meta.cost,
        buildName: slot.name,
        code: slot.buildCode,
        tags: ['爆破模式', BP_M_TIER_NAMES[slot.tier]],
        mode: 'bp'
    });
}

/* ---- 模块绑定 ---- */
function bindMobileBpModule() {
    ensureMobileSchemeStatsClickDelegate();

    // 一级卡 + 二级枪卡交互（事件委托，工具页 / 首页 / 详情子页共用）
    document.addEventListener('click', function (e) {
        // 复制背包码（一级卡按钮）
        const copyPackBtn = e.target.closest('.bpp-copy-pack-btn');
        if (copyPackBtn) {
            e.stopPropagation();
            if (!isMobileUserLoggedIn()) return;
            const pack = getMobileBpPacks().find(p => p.id === copyPackBtn.dataset.packId);
            if (!pack) return;
            copyMobileBpCode(pack.code);
            bumpMobileSchemeCopyCount(bpMPackStatMeta(pack));
            flashMobileBpCopyBtn(copyPackBtn);
            return;
        }
        // 查看 16 把枪 / 点一级卡其余区域 → 流派详情子页
        const viewBtn = e.target.closest('.bpp-view-detail-btn');
        const card = e.target.closest('.bpp-card');
        if (viewBtn || (card && !e.target.closest('.scheme-stat, .scheme-stat-like, button'))) {
            const packId = (viewBtn || card).dataset.packId;
            if (packId) openMobileBpPackDetail(packId);
            return;
        }
        // 单枪复制
        const gunCopyBtn = e.target.closest('.bpp-gun-copy-btn');
        if (gunCopyBtn) {
            e.stopPropagation();
            if (!isMobileUserLoggedIn()) return;
            copyMobileBpCode(gunCopyBtn.dataset.buildCode);
            const gunRow = gunCopyBtn.closest('.bppd-gun');
            const pack = getMobileBpPacks().find(p => p.id === bpMActivePackId);
            const slot = pack && gunRow ? pack.slots.find(s => s.name === gunRow.querySelector('.bppd-gun-name').textContent) : null;
            if (slot) bumpMobileSchemeCopyCount(bpMGunStatMeta(slot));
            flashMobileBpCopyBtn(gunCopyBtn);
            return;
        }
        // 单枪卡其余区域 → 配件详情子页
        const gunRow = e.target.closest('.bppd-gun.is-clickable');
        if (gunRow && !e.target.closest('.bpp-gun-copy-btn, .scheme-stat, .scheme-stat-like, button')) {
            const pack = getMobileBpPacks().find(p => p.id === bpMActivePackId);
            const slot = pack ? pack.slots.find(s => s.name === gunRow.querySelector('.bppd-gun-name').textContent) : null;
            if (slot) openMobileBpGunDetail(slot);
        }
    });

    // 详情子页：返回 / 底部复制背包码
    const backBtn = document.getElementById('bp-pack-detail-back');
    if (backBtn) backBtn.addEventListener('click', closeMobileBpPackDetail);
    const copyAllBtn = document.getElementById('bp-pack-copy-all');
    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', function () {
            if (!isMobileUserLoggedIn()) return;
            const pack = getMobileBpPacks().find(p => p.id === bpMActivePackId);
            if (!pack) return;
            copyMobileBpCode(pack.code);
            bumpMobileSchemeCopyCount(bpMPackStatMeta(pack));
            flashMobileBpCopyBtn(copyAllBtn);
        });
    }

    // 首页「查看全部爆破流派」→ 工具页 + 爆破 tab + 滚动定位
    // （首页改枪推荐区由日报 Tab 联动驱动，见 report-tab handler）
    const homeMore = document.getElementById('bp-home-more');
    if (homeMore) {
        homeMore.addEventListener('click', function () {
            const toolsNav = document.querySelector('.nav-item[data-page="工具"]');
            if (toolsNav) toolsNav.click();
            setTimeout(() => {
                const bpTab = document.querySelector('.gun-scheme-card-mobile .gun-scheme-mode-tab-mobile[data-mode="bp"]');
                if (bpTab) bpTab.click();
                const schemeCard = document.querySelector('.gun-scheme-card-mobile');
                if (schemeCard) schemeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    }
}
