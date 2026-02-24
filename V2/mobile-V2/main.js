/* ============================================
   密码指引弹窗
   ============================================ */
const passwordModal = document.getElementById('password-modal-overlay');
const passwordModalClose = document.getElementById('password-modal-close');

// 点击密码区域打开弹窗
document.querySelectorAll('.password-code-box').forEach(box => {
    box.addEventListener('click', function() {
        const mapName = this.parentElement.querySelector('.password-map').textContent;
        const code = this.querySelector('.password-code').textContent;
        openPasswordModal(mapName, code);
    });
});

// 打开弹窗
function openPasswordModal(mapName, code) {
    const content = document.getElementById('password-modal-content');
    // 可以根据 mapName 和 code 动态填充内容
    content.innerHTML = `
        <div style="text-align: center; color: var(--text-secondary); padding-top: 100px;">
            <p>当前地图：${mapName}</p>
            <p>密码：${code}</p>
            <p style="margin-top: 20px;">（指引内容待填充）</p>
        </div>
    `;
    passwordModal.classList.add('active');
}

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

// 制造推荐数据 - 用于空闲状态弹窗
const craftRecommendData = {
    '技术中心': {
        itemName: 'OLIGHT Baldr Pro R手电',
        itemIcon: '🔦',
        totalProfit: 18578,
        hourlyProfit: 1857,
        craftTime: '10h'
    },
    '工作台': {
        itemName: 'PMAG D-60弹鼓',
        itemIcon: '🎯',
        totalProfit: 15230,
        hourlyProfit: 1523,
        craftTime: '10h'
    },
    '制药台': {
        itemName: '军用急救包',
        itemIcon: '💊',
        totalProfit: 12450,
        hourlyProfit: 1245,
        craftTime: '10h'
    },
    '防具台': {
        itemName: '6级防弹插板',
        itemIcon: '🛡️',
        totalProfit: 22340,
        hourlyProfit: 2234,
        craftTime: '10h'
    }
};

// 制作中物品数据 - 用于忙碌状态弹窗
const craftWorkingData = {
    'DAR突击手胸挂': {
        itemIcon: '🎽',
        sellPrice: 125000,
        craftCost: 78500,
        fee: 6250,      // 手续费 5%
        deposit: 12500, // 保证金 10%
        totalTime: '08:45:00',
        remainTime: '02:22:45',
        totalProfit: 27750,
        hourlyProfit: 3171,
        materials: [
            { name: '凯夫拉纤维', icon: '📦', price: 32000, count: 2 },
            { name: '钛合金板', icon: '🔩', price: 18500, count: 1 },
            { name: '尼龙织带', icon: '🧵', price: 8500, count: 3 },
            { name: '防弹陶瓷片', icon: '🧱', price: 19500, count: 1 }
        ],
        priceHistory: [112, 115, 118, 120, 122, 125, 123] // 近7天价格（K）
    }
};

// 打开制造弹窗
function openCraftModal(stationName, status, itemName, time) {
    craftModalTitle.textContent = stationName;
    
    let contentHtml = '';
    
    if (status === 'working') {
        // 制作中状态 - 显示物品详情、收益公式、价格波动图、材料列表
        const workingItem = craftWorkingData[itemName] || {
            itemIcon: '📦',
            sellPrice: 100000,
            craftCost: 65000,
            fee: 5000,
            deposit: 10000,
            totalTime: '08:00:00',
            remainTime: time,
            totalProfit: 20000,
            hourlyProfit: 2500,
            materials: [
                { name: '基础材料A', icon: '📦', price: 20000, count: 2 },
                { name: '基础材料B', icon: '🔩', price: 25000, count: 1 }
            ],
            priceHistory: [95, 98, 100, 102, 100, 98, 100]
        };
        
        contentHtml = `
            <div class="craft-modal-working">
                <!-- 物品图片和收益公式 -->
                <div class="working-item-section">
                    <div class="working-item-image">${workingItem.itemIcon}</div>
                    <div class="working-item-info">
                        <div class="working-item-name">${itemName}</div>
                        <div class="profit-formula">
                            <div class="profit-row">
                                <span class="profit-row-label">出售总价</span>
                                <span class="profit-row-value"><span class="coin-icon">💰</span>${workingItem.sellPrice.toLocaleString()}</span>
                            </div>
                            <div class="profit-row">
                                <span class="profit-row-label">制造成本</span>
                                <span class="profit-row-value"><span class="coin-icon">💰</span>-${workingItem.craftCost.toLocaleString()}</span>
                            </div>
                            <div class="profit-row">
                                <span class="profit-row-label">手续费(5%)</span>
                                <span class="profit-row-value"><span class="coin-icon">💰</span>-${workingItem.fee.toLocaleString()}</span>
                            </div>
                            <div class="profit-row">
                                <span class="profit-row-label">保证金(10%)</span>
                                <span class="profit-row-value"><span class="coin-icon">💰</span>-${workingItem.deposit.toLocaleString()}</span>
                            </div>
                            <div class="profit-row">
                                <span class="profit-row-label">总耗时</span>
                                <span class="profit-row-value">${workingItem.totalTime}</span>
                            </div>
                            <div class="profit-row total">
                                <span class="profit-row-label">总收益</span>
                                <span class="profit-row-value"><span class="coin-icon">💰</span>+${workingItem.totalProfit.toLocaleString()}</span>
                            </div>
                            <div class="profit-row hourly">
                                <span class="profit-row-label">每小时收益</span>
                                <span class="profit-row-value">${workingItem.hourlyProfit.toLocaleString()}/h</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 售价波动图 -->
                <div class="price-chart-section">
                    <div class="section-title">
                        <span class="section-title-text">📈 售价波动</span>
                        <span class="section-title-time">近7天</span>
                    </div>
                    <div class="price-chart-container">
                        <canvas id="craft-price-chart-modal"></canvas>
                    </div>
                </div>
                
                <!-- 制造所需材料 -->
                <div class="materials-section">
                    <div class="materials-title">制造所需材料</div>
                    <div class="material-list">
                        ${workingItem.materials.map(m => `
                            <div class="material-item">
                                <div class="material-image">${m.icon}</div>
                                <div class="material-name">${m.name} ×${m.count}</div>
                                <div class="material-price">
                                    <div class="material-price-row">
                                        <span class="material-price-label">单价</span>
                                        <span class="material-price-value"><span class="coin-icon">💰</span>${m.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // 先设置HTML，再绘制图表
        craftModalContent.innerHTML = contentHtml;
        // 为弹窗添加忙碌状态class
        const craftModalBox = craftModal.querySelector('.craft-modal');
        craftModalBox.classList.add('modal-working');
        craftModal.classList.add('active');
        
        // 延迟绘制价格波动图
        setTimeout(() => {
            drawCraftPriceChartModal(workingItem.priceHistory);
        }, 100);
        
        return; // 提前返回，避免重复设置
        
    } else {
        // 空闲状态 - 显示推荐物品、收益信息、打开游戏按钮
        const recommend = craftRecommendData[stationName] || {
            itemName: '推荐物品',
            itemIcon: '📦',
            totalProfit: 10000,
            hourlyProfit: 1000,
            craftTime: '10h'
        };
        
        contentHtml = `
            <div class="craft-modal-idle">
                <!-- 提示信息 -->
                <div class="idle-tip">
                    <span class="idle-tip-icon">💡</span>
                    <span class="idle-tip-text">特勤处-${stationName}闲置中，可以打开游戏制造商品以获取收益</span>
                </div>
                
                <!-- 推荐物品标题 -->
                <div class="recommend-title">📌 推荐制造物品</div>
                
                <!-- 推荐物品卡片 -->
                <div class="recommend-item">
                    <div class="recommend-item-image">${recommend.itemIcon}</div>
                    <div class="recommend-item-info">
                        <div class="recommend-item-name">${recommend.itemName}</div>
                        <div class="recommend-stats">
                            <div class="recommend-stat">
                                <span class="recommend-stat-label">总收益</span>
                                <span class="recommend-stat-value">💰 ${recommend.totalProfit.toLocaleString()}</span>
                            </div>
                            <div class="recommend-stat">
                                <span class="recommend-stat-label">每小时收益</span>
                                <span class="recommend-stat-value highlight">${recommend.hourlyProfit.toLocaleString()}/h</span>
                            </div>
                            <div class="recommend-stat">
                                <span class="recommend-stat-label">制作时间</span>
                                <span class="recommend-stat-value">${recommend.craftTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 打开游戏按钮 -->
                <button class="open-game-btn" onclick="window.open('deltaforcegame://', '_blank')">
                    🎮 打开游戏
                </button>
            </div>
        `;
    }
    
    craftModalContent.innerHTML = contentHtml;
    // 空闲状态时移除忙碌状态class
    const craftModalBox = craftModal.querySelector('.craft-modal');
    craftModalBox.classList.remove('modal-working');
    craftModal.classList.add('active');
}

// 绘制制造弹窗内的价格波动图
function drawCraftPriceChartModal(priceHistory) {
    const canvas = document.getElementById('craft-price-chart-modal');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // 设置canvas尺寸
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 12, right: 10, bottom: 20, left: 32 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 数据处理
    const data = priceHistory || [100, 102, 98, 105, 103, 108, 110];
    const labels = ['1日', '2日', '3日', '4日', '5日', '6日', '7日'];
    
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 10;
    const minY = minVal - range * 0.15;
    const maxY = maxVal + range * 0.15;
    const yRange = maxY - minY;
    
    // 判断趋势
    const isRising = data[data.length - 1] > data[0];
    const lineColor = isRising ? '#00d4aa' : '#ef4444';
    const fillColor = isRising ? 'rgba(0, 212, 170, 0.15)' : 'rgba(239, 68, 68, 0.15)';
    
    ctx.clearRect(0, 0, width * 2, height * 2);
    
    // 绘制网格线
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
        const val = minY + (yRange / 4) * i;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Y轴标签
        ctx.fillStyle = '#8a9bb0';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(0) + 'K', padding.left - 4, y + 3);
    }
    
    // 绘制填充区域
    ctx.beginPath();
    data.forEach((val, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // 绘制曲线
    ctx.beginPath();
    data.forEach((val, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制数据点
    data.forEach((val, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
    });
    
    // X轴标签
    ctx.fillStyle = '#8a9bb0';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    [0, 3, 6].forEach(index => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        ctx.fillText(labels[index], x, height - 5);
    });
}

// 关闭制造弹窗
function closeCraftModal() {
    craftModal.classList.remove('active');
}

// 点击关闭按钮
if (craftModalClose) {
    craftModalClose.addEventListener('click', closeCraftModal);
}

// 点击遮罩层关闭
if (craftModal) {
    craftModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeCraftModal();
        }
    });
}

// 日报Tab切换功能
document.querySelectorAll('.report-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 切换内容显示
        const reportType = this.dataset.report;
        document.getElementById('report-fh').classList.remove('active');
        document.getElementById('report-zc').classList.remove('active');
        
        // 获取改枪推荐区域
        const gunBuildsFenguo = document.getElementById('gun-builds-fenguo-mobile');
        const gunBuildsZhanchang = document.getElementById('gun-builds-zhanchang-mobile');
        
        if (reportType === 'fh') {
            document.getElementById('report-fh').classList.add('active');
            // 切换改枪推荐区域
            if (gunBuildsFenguo) gunBuildsFenguo.style.display = 'block';
            if (gunBuildsZhanchang) gunBuildsZhanchang.style.display = 'none';
        } else {
            document.getElementById('report-zc').classList.add('active');
            // 切换改枪推荐区域
            if (gunBuildsFenguo) gunBuildsFenguo.style.display = 'none';
            if (gunBuildsZhanchang) {
                gunBuildsZhanchang.style.display = 'block';
                // 首次显示时初始化战场模式雷达图
                initZhanchangGunSelectorMobile();
            }
        }
    });
});

// 枪械选择器切换 - 烽火地带
document.querySelectorAll('#gun-selector-fh-mobile .gun-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('#gun-selector-fh-mobile .gun-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        // 重绘雷达图（可以根据不同枪械显示不同数据）
        drawRadarCharts();
    });
});

// 五维雷达图绘制 - 烽火地带数据
// 维度：后坐力、操控速度、射程优势、持枪稳定性、射速
const gunStatsData = {
    mp5: {
        budget: { recoil: 72, handling: 60, range: 45, stability: 55, fireRate: 30 },
        premium: { recoil: 85, handling: 75, range: 55, stability: 70, fireRate: 35 }
    },
    ak74: {
        budget: { recoil: 55, handling: 50, range: 65, stability: 45, fireRate: 60 },
        premium: { recoil: 70, handling: 65, range: 75, stability: 60, fireRate: 65 }
    },
    m4a1: {
        budget: { recoil: 68, handling: 58, range: 60, stability: 52, fireRate: 55 },
        premium: { recoil: 80, handling: 72, range: 70, stability: 68, fireRate: 60 }
    },
    scar: {
        budget: { recoil: 50, handling: 45, range: 75, stability: 40, fireRate: 45 },
        premium: { recoil: 65, handling: 58, range: 85, stability: 55, fireRate: 50 }
    },
    vss: {
        budget: { recoil: 78, handling: 70, range: 55, stability: 65, fireRate: 40 },
        premium: { recoil: 88, handling: 82, range: 65, stability: 78, fireRate: 45 }
    }
};

function drawRadarChart(canvasId, stats, color, fillColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    // 设置canvas尺寸
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    const labels = ['后坐力控制', '操控速度', '射程优势', '持枪稳定性', '射速'];
    const values = [stats.recoil, stats.handling, stats.range, stats.stability, stats.fireRate];
    const numSides = 5;
    const angleStep = (Math.PI * 2) / numSides;
    const startAngle = -Math.PI / 2; // 从顶部开始
    
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景网格（多层五边形）
    for (let level = 1; level <= 4; level++) {
        const levelRadius = (radius / 4) * level;
        ctx.beginPath();
        for (let i = 0; i <= numSides; i++) {
            const angle = startAngle + angleStep * i;
            const x = centerX + Math.cos(angle) * levelRadius;
            const y = centerY + Math.sin(angle) * levelRadius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(42, 58, 74, 0.6)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
    
    // 绘制轴线
    for (let i = 0; i < numSides; i++) {
        const angle = startAngle + angleStep * i;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.strokeStyle = 'rgba(42, 58, 74, 0.6)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    }
    
    // 绘制数据多边形（填充）
    ctx.beginPath();
    for (let i = 0; i <= numSides; i++) {
        const index = i % numSides;
        const angle = startAngle + angleStep * index;
        const value = values[index] / 100;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制数据点
    for (let i = 0; i < numSides; i++) {
        const angle = startAngle + angleStep * i;
        const value = values[i] / 100;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // 绘制标签
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#8a9bb0';
    
    for (let i = 0; i < numSides; i++) {
        const angle = startAngle + angleStep * i;
        const labelRadius = radius + 12;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        ctx.fillText(labels[i], x, y);
    }
}

function drawRadarCharts() {
    const activeGun = document.querySelector('#gun-selector-fh-mobile .gun-tab.active');
    const gunType = activeGun ? activeGun.dataset.gun : 'mp5';
    const gunData = gunStatsData[gunType] || gunStatsData.mp5;
    
    // 绘制性价比方案雷达图（绿色）
    drawRadarChart('radar-budget', gunData.budget, '#4ade80', 'rgba(74, 222, 128, 0.2)');
    
    // 绘制满改方案雷达图（紫色）
    drawRadarChart('radar-premium', gunData.premium, '#a78bfa', 'rgba(167, 139, 250, 0.2)');
}

// 全面战场枪械数据（单方案）- 维度：后坐力、操控速度、射程优势、持枪稳定性、射速
const gunStatsDataZC = {
    m4a1: {
        stats: { recoil: 75, handling: 68, range: 65, stability: 62, fireRate: 58 },
        tags: ['中远距离', '高稳定', 'PVP优化']
    },
    ak74: {
        stats: { recoil: 58, handling: 52, range: 70, stability: 48, fireRate: 62 },
        tags: ['中距离', '高伤害', '压枪要求高']
    },
    hk416: {
        stats: { recoil: 72, handling: 65, range: 68, stability: 58, fireRate: 55 },
        tags: ['全能型', '均衡', '新手友好']
    },
    aug: {
        stats: { recoil: 80, handling: 60, range: 78, stability: 72, fireRate: 48 },
        tags: ['远距离', '高精准', '自带瞄具']
    },
    svd: {
        stats: { recoil: 65, handling: 45, range: 92, stability: 55, fireRate: 25 },
        tags: ['狙击', '一击必杀', '远距离']
    }
};

// 战场模式枪械选择器是否已初始化
let zhanchangGunSelectorInitialized = false;

// 初始化战场模式枪械选择器
function initZhanchangGunSelectorMobile() {
    if (zhanchangGunSelectorInitialized) return;
    
    const gunTabs = document.querySelectorAll('#gun-selector-zc-mobile .gun-tab');
    if (!gunTabs.length) return;
    
    // 初始绘制第一把枪的雷达图
    const firstGun = gunTabs[0]?.dataset.gun;
    if (firstGun && gunStatsDataZC[firstGun]) {
        drawRadarChart('radar-single', gunStatsDataZC[firstGun].stats, '#f39c12', 'rgba(243, 156, 18, 0.2)');
        updateZhanchangTagsMobile(gunStatsDataZC[firstGun].tags);
    }
    
    // 绑定枪械切换事件
    gunTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            gunTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const gunType = this.dataset.gun;
            const gunData = gunStatsDataZC[gunType];
            
            if (gunData) {
                drawRadarChart('radar-single', gunData.stats, '#f39c12', 'rgba(243, 156, 18, 0.2)');
                updateZhanchangTagsMobile(gunData.tags);
            }
        });
    });
    
    zhanchangGunSelectorInitialized = true;
}

// 更新战场模式的标签
function updateZhanchangTagsMobile(tags) {
    const tagsContainer = document.getElementById('build-tags-zc-mobile');
    if (tagsContainer && tags) {
        tagsContainer.innerHTML = tags.map(tag => `<span class="build-tag">${tag}</span>`).join('');
    }
}

// 初始化雷达图
drawRadarCharts();

// 窗口大小变化时重绘
window.addEventListener('resize', drawRadarCharts);

// 复制按钮
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.textContent = '已复制 ✓';
        this.style.background = 'var(--accent-cyan)';
        this.style.color = '#000';
        setTimeout(() => {
            this.textContent = '复制';
            this.style.background = '';
            this.style.color = '';
        }, 1500);
    });
});

document.querySelectorAll('.news-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

/* 底部导航切换 */
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // 切换页面内容
        const pageName = this.dataset.page;
        showPage(pageName);
    });
});

// 页面切换函数
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // 显示对应页面
    if (pageName === '首页') {
        document.getElementById('page-home').style.display = 'block';
    } else if (pageName === '工具') {
        document.getElementById('page-tools').style.display = 'block';
        // 页面显示后初始化制造推荐（因为隐藏时canvas尺寸为0）
        setTimeout(() => {
            updateCraftItemsMobile(currentCraftTypeMobile);
            initMarketPriceMobile();
        }, 50);
    } else if (pageName === 'Wiki') {
        document.getElementById('page-guides').style.display = 'block';
    } else if (pageName === '我的') {
        document.getElementById('page-profile').style.display = 'block';
    }
}

// 制造 - 主Tab切换 (制造详情/制造推荐) - 支持首页和工具页
document.querySelectorAll('.craft-main-tab-mobile').forEach(tab => {
    tab.addEventListener('click', function() {
        const isHome = this.dataset.for === 'home';
        const parentTabs = isHome ? 
            document.querySelectorAll('.craft-main-tab-mobile[data-for="home"]') : 
            document.querySelectorAll('.craft-main-tab-mobile:not([data-for="home"])');
        
        parentTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const mainTab = this.dataset.mainTab;
        const detailContent = document.getElementById(isHome ? 'craft-detail-content-home' : 'craft-detail-content');
        const recommendContent = document.getElementById(isHome ? 'craft-recommend-content-home' : 'craft-recommend-content');
        
        if (mainTab === 'detail') {
            detailContent.classList.add('active');
            recommendContent.classList.remove('active');
        } else {
            detailContent.classList.remove('active');
            recommendContent.classList.add('active');
            // 工具页切换到推荐时刷新数据
            if (!isHome) {
                setTimeout(() => {
                    updateCraftItemsMobile(currentCraftTypeMobile);
                }, 50);
            }
        }
    });
});

// 制造推荐 - Tab切换 - 仅工具页需要
document.querySelectorAll('.craft-tab-mobile:not([data-for="home"])').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.craft-tab-mobile:not([data-for="home"])').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const craftType = this.dataset.craft;
        updateCraftItemsMobile(craftType);
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
        { value: '55.1M', label: '带出总价值' },
        { value: '37.6%', label: '撤离率' },
        { value: '333', label: '击败干员' },
        { value: '535.0K', label: '赚损比' }
    ],
    records: [
        { avatar: '🎖️', status: 'fail', statusText: '撤离失败', operator: '威龙', mode: '烽火地带', map: '零号大坝-机密', time: '02-01 10:52', profit: '68,304', kills: '4' },
        { avatar: '⚔️', status: 'fail', statusText: '撤离失败', operator: '骇爪', mode: '烽火地带', map: '零号大坝-机密', time: '02-01 10:45', profit: '95,960', kills: '7' },
        { avatar: '🛡️', status: 'fail', statusText: '撤离失败', operator: '威龙', mode: '烽火地带', map: '航天基地-机密', time: '02-01 10:30', profit: '0', kills: '2' }
    ]
};

// 全面战场数据
const zhancahngData = {
    stats: [
        { value: '28', label: '胜场数' },
        { value: '45.2%', label: '胜率' },
        { value: '12162', label: '场均得分' },
        { value: '2.8', label: '分均击杀' }
    ],
    records: [
        { avatar: '⚔️', status: 'fail', statusText: '失败', operator: '威龙', mode: '全面战场', map: '余震-攻防', time: '02-01 10:55', score: '12607', kills: '39' },
        { avatar: '🏆', status: 'success', statusText: '胜利', operator: '骇爪', mode: '全面战场', map: '余震-攻防', time: '02-01 09:30', score: '15320', kills: '45' },
        { avatar: '⚔️', status: 'fail', statusText: '失败', operator: '威龙', mode: '全面战场', map: '余震-攻防', time: '02-01 08:15', score: '8650', kills: '22' }
    ]
};

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
                <div class="profile-stat-label">${stat.label}</div>
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
                            <span class="battle-status-tag ${record.status}">${record.statusText}</span>
                            <span class="battle-operator-name">${record.operator}</span>
                        </div>
                        <div class="battle-record-map">${record.mode} | ${record.map}</div>
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
                            <span class="battle-status-tag ${record.status}">${record.statusText}</span>
                            <span class="battle-operator-name">${record.operator}</span>
                        </div>
                        <div class="battle-record-map">${record.mode} | ${record.map}</div>
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
                <div class="profile-stat-label">带出总价值</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">37.6%</div>
                <div class="profile-stat-label">撤离率</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">333</div>
                <div class="profile-stat-label">击败干员</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">535.0K</div>
                <div class="profile-stat-label">赚损比</div>
            </div>
        `;
    } else if (tabName === 'collection') {
        statsTitle.textContent = '大红藏馆总览';
        statsTitle.style.display = 'block';
        statsLink.style.display = 'none';
        statsGrid.innerHTML = `
            <div class="profile-stat-item">
                <div class="profile-stat-value">12</div>
                <div class="profile-stat-label">大红总数</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">20</div>
                <div class="profile-stat-label">大红数量</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">8.5M</div>
                <div class="profile-stat-label">大红累计价值</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">0</div>
                <div class="profile-stat-label">本周收集数量</div>
            </div>
        `;
    } else if (tabName === 'asset') {
        statsTitle.textContent = '游戏资产总览';
        statsTitle.style.display = 'block';
        statsLink.style.display = 'inline-block';
        statsGrid.innerHTML = `
            <div class="profile-stat-item">
                <div class="profile-stat-value">910</div>
                <div class="profile-stat-label">三角币</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">72.1M</div>
                <div class="profile-stat-label">总资产</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">23.2M</div>
                <div class="profile-stat-label">哈夫币</div>
            </div>
            <div class="profile-stat-item">
                <div class="profile-stat-value">1</div>
                <div class="profile-stat-label">典藏枪械外观</div>
            </div>
        `;
    }
}

// 战绩页子Tab切换
document.querySelectorAll('.battle-sub-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.battle-sub-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// 藏品分类Tab切换
document.querySelectorAll('.collection-category-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.collection-category-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

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

// 页面加载完成后绑定事件
document.addEventListener('DOMContentLoaded', function() {
    bindMarketDetailEvents();
});
