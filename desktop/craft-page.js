/**
 * 交易制造页面 - 交互逻辑
 */

// ============================================
// 制造推荐模块 - 数据
// ============================================
const craftPageData = {
    tech: [
        { name: 'OLIGHT Baldr Pro R多功能手电', profit: 18578, change: 12.6, positive: true },
        { name: '灵眼3/7测距狙击瞄准镜', profit: 8083, change: 7.0, positive: true },
        { name: 'DBAL-X2紫色激光镭指', profit: 7487, change: -1.9, positive: false },
        { name: 'EOTech全息瞄准镜', profit: 6230, change: 4.2, positive: true }
    ],
    work: [
        { name: 'PMAG D-60 5.56弹鼓', profit: 15230, change: 8.3, positive: true },
        { name: 'Zenit PT-1折叠枪托', profit: 9120, change: 5.2, positive: true },
        { name: 'Magpul AFG-2前握把', profit: 6540, change: -2.5, positive: false },
        { name: 'Harris旋转式脚架', profit: 5890, change: 3.1, positive: true }
    ],
    med: [
        { name: '军用急救包', profit: 12450, change: 15.8, positive: true },
        { name: '肾上腺素注射器', profit: 7890, change: 3.2, positive: true },
        { name: '高级止痛药', profit: 5670, change: -4.1, positive: false },
        { name: '手术刀套装', profit: 4320, change: 2.8, positive: true }
    ],
    armor: [
        { name: '6级防弹插板', profit: 22340, change: 18.5, positive: true },
        { name: 'Ops-Core头盔', profit: 11200, change: 6.7, positive: true },
        { name: 'THORAX防弹背心', profit: 8950, change: -0.8, positive: false },
        { name: '战术背包大容量版', profit: 7650, change: 5.3, positive: true }
    ]
};

// 物品详细数据（用于hover tooltip）
const craftDetailData = {
    tech: [
        {
            sellPrice: 548850, craftCost: 238267, fee: 54885, deposit: 16465, totalTime: '08:00:00',
            totalProfit: 239233, hourlyProfit: 29904,
            materials: [
                { name: '高级燃料', icon: '🛢️', unitPrice: 92072, totalPrice: 184144 },
                { name: '高精数显卡尺', icon: '📐', unitPrice: 16267, totalPrice: 16267 },
                { name: '精密电路板', icon: '🔌', unitPrice: 14858, totalPrice: 14858 },
                { name: '红外发射模块', icon: '📡', unitPrice: 11574, totalPrice: 23148 }
            ],
            priceHistory: [3.31, 3.40, 3.49, 3.59, 3.86, 3.68, 3.77, 3.86, 3.68, 3.77, 3.86, 3.95]
        },
        {
            sellPrice: 385000, craftCost: 198000, fee: 38500, deposit: 11550, totalTime: '06:30:00',
            totalProfit: 136950, hourlyProfit: 21069,
            materials: [
                { name: '光学镜片', icon: '🔭', unitPrice: 85000, totalPrice: 85000 },
                { name: '精密齿轮组', icon: '⚙️', unitPrice: 56500, totalPrice: 56500 },
                { name: '铝合金外壳', icon: '🔩', unitPrice: 56500, totalPrice: 56500 }
            ],
            priceHistory: [3.60, 3.55, 3.65, 3.70, 3.75, 3.80, 3.72, 3.78, 3.85, 3.82, 3.88, 3.85]
        },
        {
            sellPrice: 320000, craftCost: 175000, fee: 32000, deposit: 9600, totalTime: '05:45:00',
            totalProfit: 103400, hourlyProfit: 17983,
            materials: [
                { name: '激光二极管', icon: '💡', unitPrice: 72000, totalPrice: 72000 },
                { name: '电池模组', icon: '🔋', unitPrice: 45000, totalPrice: 45000 },
                { name: '瞄具支架', icon: '🔧', unitPrice: 58000, totalPrice: 58000 }
            ],
            priceHistory: [3.25, 3.30, 3.28, 3.22, 3.18, 3.15, 3.20, 3.22, 3.18, 3.14, 3.20, 3.20]
        },
        {
            sellPrice: 290000, craftCost: 162000, fee: 29000, deposit: 8700, totalTime: '05:00:00',
            totalProfit: 90300, hourlyProfit: 18060,
            materials: [
                { name: '全息投影模块', icon: '🔮', unitPrice: 68000, totalPrice: 68000 },
                { name: '防震外壳', icon: '🛡️', unitPrice: 52000, totalPrice: 52000 },
                { name: '蓄电池', icon: '🔋', unitPrice: 42000, totalPrice: 42000 }
            ],
            priceHistory: [2.80, 2.85, 2.82, 2.88, 2.90, 2.95, 2.92, 2.98, 2.85, 2.90, 2.92, 2.90]
        }
    ],
    work: [
        {
            sellPrice: 480000, craftCost: 225000, fee: 48000, deposit: 14400, totalTime: '07:30:00',
            totalProfit: 192600, hourlyProfit: 25680,
            materials: [
                { name: '弹簧钢', icon: '🔩', unitPrice: 75000, totalPrice: 75000 },
                { name: '聚合物塑料', icon: '📦', unitPrice: 50000, totalPrice: 100000 },
                { name: '供弹机构', icon: '⚙️', unitPrice: 50000, totalPrice: 50000 }
            ],
            priceHistory: [4.50, 4.55, 4.60, 4.65, 4.58, 4.70, 4.75, 4.80, 4.72, 4.78, 4.82, 4.80]
        },
        {
            sellPrice: 365000, craftCost: 195000, fee: 36500, deposit: 10950, totalTime: '06:00:00',
            totalProfit: 122550, hourlyProfit: 20425,
            materials: [
                { name: '钛合金管材', icon: '🔩', unitPrice: 85000, totalPrice: 85000 },
                { name: '折叠铰链', icon: '⚙️', unitPrice: 55000, totalPrice: 55000 },
                { name: '缓冲垫', icon: '📦', unitPrice: 55000, totalPrice: 55000 }
            ],
            priceHistory: [3.40, 3.45, 3.50, 3.48, 3.55, 3.60, 3.58, 3.62, 3.55, 3.60, 3.65, 3.65]
        },
        {
            sellPrice: 280000, craftCost: 155000, fee: 28000, deposit: 8400, totalTime: '05:15:00',
            totalProfit: 88600, hourlyProfit: 16876,
            materials: [
                { name: '工程塑料', icon: '📦', unitPrice: 55000, totalPrice: 55000 },
                { name: '防滑橡胶', icon: '🧱', unitPrice: 48000, totalPrice: 48000 },
                { name: '紧固螺栓', icon: '🔩', unitPrice: 52000, totalPrice: 52000 }
            ],
            priceHistory: [2.90, 2.85, 2.88, 2.82, 2.78, 2.75, 2.80, 2.78, 2.72, 2.75, 2.80, 2.80]
        },
        {
            sellPrice: 260000, craftCost: 142000, fee: 26000, deposit: 7800, totalTime: '04:30:00',
            totalProfit: 84200, hourlyProfit: 18711,
            materials: [
                { name: '碳钢杆', icon: '🔩', unitPrice: 58000, totalPrice: 58000 },
                { name: '旋转轴承', icon: '⚙️', unitPrice: 42000, totalPrice: 42000 },
                { name: '橡胶脚垫', icon: '🧱', unitPrice: 42000, totalPrice: 42000 }
            ],
            priceHistory: [2.45, 2.50, 2.48, 2.52, 2.55, 2.58, 2.54, 2.56, 2.60, 2.58, 2.62, 2.60]
        }
    ],
    med: [
        {
            sellPrice: 420000, craftCost: 210000, fee: 42000, deposit: 12600, totalTime: '06:45:00',
            totalProfit: 155400, hourlyProfit: 23022,
            materials: [
                { name: '无菌纱布', icon: '🩹', unitPrice: 65000, totalPrice: 65000 },
                { name: '止血粉', icon: '💊', unitPrice: 72000, totalPrice: 72000 },
                { name: '急救工具包', icon: '🧰', unitPrice: 73000, totalPrice: 73000 }
            ],
            priceHistory: [3.90, 3.95, 4.00, 4.10, 4.15, 4.20, 4.18, 4.25, 4.30, 4.22, 4.28, 4.20]
        },
        {
            sellPrice: 310000, craftCost: 168000, fee: 31000, deposit: 9300, totalTime: '05:00:00',
            totalProfit: 101700, hourlyProfit: 20340,
            materials: [
                { name: '肾上腺素原液', icon: '💉', unitPrice: 88000, totalPrice: 88000 },
                { name: '注射器组件', icon: '🔧', unitPrice: 42000, totalPrice: 42000 },
                { name: '防腐剂', icon: '🧪', unitPrice: 38000, totalPrice: 38000 }
            ],
            priceHistory: [2.95, 3.00, 2.98, 3.02, 3.05, 3.10, 3.08, 3.12, 3.05, 3.08, 3.10, 3.10]
        },
        {
            sellPrice: 240000, craftCost: 135000, fee: 24000, deposit: 7200, totalTime: '04:15:00',
            totalProfit: 73800, hourlyProfit: 17365,
            materials: [
                { name: '药用原料', icon: '💊', unitPrice: 55000, totalPrice: 55000 },
                { name: '胶囊外壳', icon: '📦', unitPrice: 40000, totalPrice: 40000 },
                { name: '缓释涂层', icon: '🧪', unitPrice: 40000, totalPrice: 40000 }
            ],
            priceHistory: [2.50, 2.48, 2.45, 2.42, 2.38, 2.35, 2.40, 2.38, 2.35, 2.32, 2.40, 2.40]
        },
        {
            sellPrice: 195000, craftCost: 112000, fee: 19500, deposit: 5850, totalTime: '03:30:00',
            totalProfit: 57650, hourlyProfit: 16471,
            materials: [
                { name: '医用不锈钢', icon: '🔩', unitPrice: 48000, totalPrice: 48000 },
                { name: '手柄组件', icon: '🔧', unitPrice: 32000, totalPrice: 32000 },
                { name: '消毒包装', icon: '📦', unitPrice: 32000, totalPrice: 32000 }
            ],
            priceHistory: [1.85, 1.88, 1.90, 1.92, 1.95, 1.93, 1.96, 1.98, 1.95, 1.92, 1.95, 1.95]
        }
    ],
    armor: [
        {
            sellPrice: 680000, craftCost: 310000, fee: 68000, deposit: 20400, totalTime: '09:30:00',
            totalProfit: 281600, hourlyProfit: 29642,
            materials: [
                { name: '碳化硅陶瓷板', icon: '🧱', unitPrice: 120000, totalPrice: 120000 },
                { name: '超高分子纤维', icon: '🧵', unitPrice: 95000, totalPrice: 95000 },
                { name: '钛合金背板', icon: '🔩', unitPrice: 95000, totalPrice: 95000 }
            ],
            priceHistory: [6.20, 6.30, 6.40, 6.50, 6.60, 6.80, 6.70, 6.85, 6.90, 6.75, 6.80, 6.80]
        },
        {
            sellPrice: 450000, craftCost: 235000, fee: 45000, deposit: 13500, totalTime: '07:00:00',
            totalProfit: 156500, hourlyProfit: 22357,
            materials: [
                { name: 'UHMWPE纤维', icon: '🧵', unitPrice: 98000, totalPrice: 98000 },
                { name: '头盔外壳', icon: '🛡️', unitPrice: 72000, totalPrice: 72000 },
                { name: '减震内衬', icon: '📦', unitPrice: 65000, totalPrice: 65000 }
            ],
            priceHistory: [4.20, 4.25, 4.30, 4.35, 4.40, 4.45, 4.42, 4.48, 4.50, 4.45, 4.50, 4.50]
        },
        {
            sellPrice: 380000, craftCost: 205000, fee: 38000, deposit: 11400, totalTime: '06:30:00',
            totalProfit: 125600, hourlyProfit: 19323,
            materials: [
                { name: '凯夫拉纤维', icon: '🧵', unitPrice: 85000, totalPrice: 85000 },
                { name: '防弹陶瓷插板', icon: '🧱', unitPrice: 68000, totalPrice: 68000 },
                { name: '尼龙面料', icon: '📦', unitPrice: 52000, totalPrice: 52000 }
            ],
            priceHistory: [3.85, 3.82, 3.80, 3.78, 3.82, 3.80, 3.78, 3.75, 3.80, 3.82, 3.80, 3.80]
        },
        {
            sellPrice: 340000, craftCost: 185000, fee: 34000, deposit: 10200, totalTime: '06:00:00',
            totalProfit: 110800, hourlyProfit: 18467,
            materials: [
                { name: '防水尼龙', icon: '📦', unitPrice: 65000, totalPrice: 65000 },
                { name: 'MOLLE织带', icon: '🧵', unitPrice: 58000, totalPrice: 58000 },
                { name: '金属拉链组', icon: '🔩', unitPrice: 62000, totalPrice: 62000 }
            ],
            priceHistory: [3.20, 3.25, 3.28, 3.30, 3.35, 3.38, 3.40, 3.42, 3.38, 3.40, 3.40, 3.40]
        }
    ]
};

// 当前状态
let craftPageState = {
    currentTab: 'tech',
    selectedItemIndex: 0
};

let marketPageState = {
    category: 'all',
    sortField: null,
    sortOrder: null,
    searchQuery: '',
    allItems: []
};

// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initCraftModule();
    initMarketModule();
    updateDateDisplay();
});

// 更新日期显示
function updateDateDisplay() {
    const dateEl = document.getElementById('craft-date');
    const updateTimeEl = document.getElementById('chart-update-time');
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (dateEl) dateEl.textContent = dateStr;
    if (updateTimeEl) updateTimeEl.textContent = `更新于 ${dateStr} ${timeStr}`;
}

// ============================================
// 制造推荐模块
// ============================================
function initCraftModule() {
    // 绑定Tab切换
    document.querySelectorAll('.craft-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.craft-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            craftPageState.currentTab = this.dataset.craft;
            craftPageState.selectedItemIndex = 0;
            renderCraftItems();
            drawCraftPageChart();
        });
    });
    
    // 初始渲染
    renderCraftItems();
    drawCraftPageChart();
}

// 渲染制造物品列表
function renderCraftItems() {
    const container = document.getElementById('craft-items-row');
    if (!container) return;
    
    const items = craftPageData[craftPageState.currentTab] || [];
    
    container.innerHTML = items.map((item, index) => `
        <div class="craft-item-card-lg ${index === craftPageState.selectedItemIndex ? 'selected' : ''}" data-index="${index}">
            <div class="craft-item-image-lg"></div>
            <div class="craft-item-info-wrap">
                <div class="craft-item-name-lg">${item.name}</div>
                <div class="craft-item-stats-lg">
                    <span class="craft-stat-label-lg">每小时收益</span>
                    <span class="craft-stat-value-lg">${item.profit.toLocaleString()}</span>
                </div>
                <div class="craft-item-change-lg">
                    <span class="craft-change-label-lg">涨幅</span>
                    <span class="craft-change-value-lg ${item.positive ? 'positive' : 'negative'}">
                        ${item.positive ? '+' : ''}${item.change}%${item.positive ? '↑' : '↓'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // 绑定点击事件
    container.querySelectorAll('.craft-item-card-lg').forEach(card => {
        card.addEventListener('click', function() {
            container.querySelectorAll('.craft-item-card-lg').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            craftPageState.selectedItemIndex = parseInt(this.dataset.index);
            drawCraftPageChart();
        });
        
        // Hover 显示详情浮窗
        card.addEventListener('mouseenter', function(e) {
            const index = parseInt(this.dataset.index);
            showCraftTooltip(this, index);
        });
        card.addEventListener('mouseleave', function() {
            hideCraftTooltip();
        });
    });
}

// ============================================
// 物品详情悬浮窗（Tooltip）
// ============================================
let tooltipChartDrawn = false;

function showCraftTooltip(cardEl, index) {
    const tooltip = document.getElementById('craft-tooltip');
    if (!tooltip) return;
    
    const tab = craftPageState.currentTab;
    const item = craftPageData[tab][index];
    const detail = craftDetailData[tab] && craftDetailData[tab][index];
    if (!item || !detail) return;
    
    // 生成tooltip内容
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <span class="tooltip-title">提示</span>
        </div>
        <div class="tooltip-body">
            <div class="tooltip-org-label">ORGANIZATION</div>
            <div class="tooltip-item-section">
                <div class="tooltip-item-image"></div>
                <div class="tooltip-item-info">
                    <div class="tooltip-profit-formula">
                        <div class="tooltip-profit-row">
                            <span class="tooltip-row-label">出售总价</span>
                            <span class="tooltip-row-value"><span class="tooltip-coin">💰</span>${detail.sellPrice.toLocaleString()}</span>
                        </div>
                        <div class="tooltip-profit-row">
                            <span class="tooltip-row-label">制造成本</span>
                            <span class="tooltip-row-value"><span class="tooltip-coin">💰</span>${detail.craftCost.toLocaleString()}</span>
                        </div>
                        <div class="tooltip-profit-row">
                            <span class="tooltip-row-label">手续费</span>
                            <span class="tooltip-row-value"><span class="tooltip-coin">💰</span>${detail.fee.toLocaleString()}</span>
                        </div>
                        <div class="tooltip-profit-row">
                            <span class="tooltip-row-label">保证金</span>
                            <span class="tooltip-row-value"><span class="tooltip-coin">💰</span>${detail.deposit.toLocaleString()}</span>
                        </div>
                        <div class="tooltip-profit-row">
                            <span class="tooltip-row-label">总耗时</span>
                            <span class="tooltip-row-value"><span class="tooltip-coin">🕐</span>${detail.totalTime}</span>
                        </div>
                        <div class="tooltip-profit-row total">
                            <span class="tooltip-row-label">总收益</span>
                            <span class="tooltip-row-value positive"><span class="tooltip-coin">💰</span>${detail.totalProfit.toLocaleString()} ▲</span>
                        </div>
                        <div class="tooltip-profit-row hourly">
                            <span class="tooltip-row-label">每小时收益</span>
                            <span class="tooltip-row-value"><span class="tooltip-coin">💰</span>${detail.hourlyProfit.toLocaleString()} ▲</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tooltip-item-name">${item.name}</div>
            
            <div class="tooltip-chart-section">
                <div class="tooltip-chart-header">
                    <span class="tooltip-chart-title">◆ 总售价</span>
                    <span class="tooltip-chart-time">更新于 ${getTooltipDateStr()}</span>
                </div>
                <div class="tooltip-chart-container">
                    <canvas id="tooltip-price-chart"></canvas>
                </div>
            </div>
            
            <div class="tooltip-materials-section">
                <div class="tooltip-materials-title">材料</div>
                <div class="tooltip-material-list">
                    ${detail.materials.map(m => `
                        <div class="tooltip-material-item">
                            <div class="tooltip-material-icon">${m.icon}</div>
                            <div class="tooltip-material-info">
                                <div class="tooltip-material-name">${m.name}</div>
                                <div class="tooltip-material-prices">
                                    <span>单价：<span class="tooltip-coin">💰</span>${m.unitPrice.toLocaleString()}</span>
                                    <span>总价：<span class="tooltip-coin">💰</span>${m.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // 定位tooltip
    positionTooltip(cardEl, tooltip);
    tooltip.classList.add('active');
    
    // 绘制图表
    setTimeout(() => {
        drawTooltipChart(detail.priceHistory);
    }, 50);
}

function hideCraftTooltip() {
    const tooltip = document.getElementById('craft-tooltip');
    if (tooltip) tooltip.classList.remove('active');
}

function positionTooltip(cardEl, tooltip) {
    const cardRect = cardEl.getBoundingClientRect();
    const tooltipWidth = 380;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 默认显示在卡片右侧
    let left = cardRect.right + 12;
    let top = cardRect.top;
    
    // 如果右侧空间不足，显示在左侧
    if (left + tooltipWidth > viewportWidth - 20) {
        left = cardRect.left - tooltipWidth - 12;
    }
    
    // 如果左侧也不够，居中在卡片上方
    if (left < 20) {
        left = Math.max(20, cardRect.left + cardRect.width / 2 - tooltipWidth / 2);
    }
    
    // 确保不超出底部
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.maxHeight = (viewportHeight - top - 20) + 'px';
}

function getTooltipDateStr() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:00`;
}

function drawTooltipChart(priceHistory) {
    const canvas = document.getElementById('tooltip-price-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 15, bottom: 25, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const data = priceHistory || [];
    if (data.length < 2) return;
    
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 0.1;
    const minY = minVal - range * 0.2;
    const maxY = maxVal + range * 0.2;
    const yRange = maxY - minY;
    
    const isRising = data[data.length - 1] >= data[0];
    const lineColor = isRising ? '#00d4aa' : '#ef4444';
    const fillColor = isRising ? 'rgba(0, 212, 170, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    
    ctx.clearRect(0, 0, width * 2, height * 2);
    
    // 网格线
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 0.5;
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
        const val = minY + (yRange / gridCount) * i;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        ctx.fillStyle = '#8a9bb0';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(2) + 'K', padding.left - 4, y + 3);
    }
    
    // 填充区域
    ctx.beginPath();
    data.forEach((val, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // 曲线
    ctx.beginPath();
    data.forEach((val, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 找最高/最低点
    let minIdx = 0, maxIdx = 0;
    data.forEach((v, i) => {
        if (v < data[minIdx]) minIdx = i;
        if (v > data[maxIdx]) maxIdx = i;
    });
    
    // 数据点
    data.forEach((val, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((val - minY) / yRange) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
        
        // 最高点标注
        if (i === maxIdx) {
            ctx.fillStyle = '#00d4aa';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('最高售价' + val.toFixed(2) + 'K', x, y - 8);
        }
        // 最低点标注
        if (i === minIdx) {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('最低售价' + val.toFixed(2) + 'K', x, y + 14);
        }
    });
    
    // X轴时间标签
    const times = ['18:00', '23:00', '04:00', '09:00', '14:00', '18:00'];
    ctx.fillStyle = '#8a9bb0';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    times.forEach((t, i) => {
        const x = padding.left + (i / (times.length - 1)) * chartWidth;
        ctx.fillText(t, x, height - 6);
    });
}

// 绘制价格走势图
function drawCraftPageChart() {
    const canvas = document.getElementById('craft-page-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 25, right: 60, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 获取当前选中物品
    const items = craftPageData[craftPageState.currentTab] || [];
    const item = items[craftPageState.selectedItemIndex];
    if (!item) return;
    
    // 生成数据
    const data = generateCraftChartData(item);
    
    // 计算数据范围
    const values = data.map(d => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin || 1;
    const minValue = Math.floor(dataMin - range * 0.2);
    const maxValue = Math.ceil(dataMax + range * 0.2);
    const valueRange = maxValue - minValue;
    
    // 清空画布
    ctx.clearRect(0, 0, width * 2, height * 2);
    
    // 绘制网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
        const val = minValue + (valueRange / gridCount) * i;
        const y = padding.top + chartHeight - ((val - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Y轴标签
        ctx.fillStyle = '#666';
        ctx.font = '10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(1) + '万', padding.left - 8, y + 3);
    }
    
    // 绘制成本基准线
    const costValue = data[0].value;
    const costY = padding.top + chartHeight - ((costValue - minValue) / valueRange) * chartHeight;
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, costY);
    ctx.lineTo(width - padding.right, costY);
    ctx.stroke();
    ctx.setLineDash([]);
    
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
    ctx.fillStyle = 'rgba(0, 255, 204, 0.1)';
    ctx.fill();
    
    // 绘制价格曲线
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
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
    ctx.stroke();
    
    // 找出最高点和最低点
    let minIndex = 0, maxIndex = 0;
    values.forEach((v, i) => {
        if (v < values[minIndex]) minIndex = i;
        if (v > values[maxIndex]) maxIndex = i;
    });
    
    // 绘制数据点
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffcc';
        ctx.fill();
        
        // 标注最低点
        if (index === minIndex) {
            ctx.fillStyle = '#00ffcc';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('最低 ' + point.value.toFixed(1) + '万', x, y + 18);
        }
        
        // 标注最高点
        if (index === maxIndex) {
            ctx.fillStyle = '#00ffcc';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('最高 ' + point.value.toFixed(1) + '万', x, y - 10);
        }
    });
    
    // X轴时间标签
    ctx.fillStyle = '#666';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        ctx.fillText(point.time, x, height - 8);
    });
}

// 生成图表数据
function generateCraftChartData(item) {
    const basePrice = Math.round(item.profit / 1000 * 2);
    const isPositive = item.positive;
    const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    
    let data = [];
    let currentValue = basePrice + (Math.random() - 0.5) * 2;
    
    if (isPositive) {
        for (let i = 0; i < times.length; i++) {
            if (i < 4) {
                currentValue += (Math.random() - 0.3) * 0.5;
            } else {
                currentValue += Math.random() * 1.2 + 0.3;
            }
            data.push({ time: times[i], value: Math.max(1, currentValue) });
        }
    } else {
        for (let i = 0; i < times.length; i++) {
            if (i < 3) {
                currentValue += (Math.random() - 0.5) * 0.3;
            } else {
                currentValue -= Math.random() * 0.6 + 0.2;
            }
            data.push({ time: times[i], value: Math.max(1, currentValue) });
        }
    }
    
    return data;
}

// ============================================
// 交易物价模块
// ============================================
function initMarketModule() {
    // 搜索框
    const searchInput = document.getElementById('market-search-input');
    const searchClear = document.getElementById('market-search-clear');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            marketPageState.searchQuery = this.value;
            if (searchClear) {
                searchClear.classList.toggle('visible', this.value.length > 0);
            }
            renderMarketList();
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            marketPageState.searchQuery = '';
            this.classList.remove('visible');
            renderMarketList();
        });
    }
    
    // 分类选择
    const categorySelect = document.getElementById('market-page-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            marketPageState.category = this.value;
            loadMarketData();
        });
    }
    
    // 排序按钮
    const sortPrice = document.getElementById('sort-price-desktop');
    const sortChange = document.getElementById('sort-change-desktop');
    
    if (sortPrice) {
        sortPrice.addEventListener('click', function() {
            handleMarketSort('price', this);
        });
    }
    
    if (sortChange) {
        sortChange.addEventListener('click', function() {
            handleMarketSort('change', this);
        });
    }
    
    // 加载数据
    loadMarketData();
}

// 加载物价数据
function loadMarketData() {
    if (typeof marketPriceDataFull === 'undefined') {
        console.warn('物价数据未加载');
        return;
    }
    
    // 使用全量数据（内页展示全量列表）
    const items = marketPriceDataFull[marketPageState.category] || [];
    
    marketPageState.allItems = [...items];
    
    // 重置排序状态
    marketPageState.sortField = null;
    marketPageState.sortOrder = null;
    document.querySelectorAll('.market-list-header .sortable').forEach(el => {
        el.classList.remove('sort-asc', 'sort-desc', 'active');
    });
    
    renderMarketList();
}

// 渲染物价列表
function renderMarketList() {
    const container = document.getElementById('market-items-list');
    if (!container) return;
    
    let items = [...marketPageState.allItems];
    
    // 搜索过滤
    if (marketPageState.searchQuery) {
        const query = marketPageState.searchQuery.toLowerCase();
        items = items.filter(item => item.name.toLowerCase().includes(query));
    }
    
    // 排序
    if (marketPageState.sortField && marketPageState.sortOrder) {
        items.sort((a, b) => {
            let valA, valB;
            if (marketPageState.sortField === 'price') {
                valA = a.price;
                valB = b.price;
            } else if (marketPageState.sortField === 'change') {
                valA = Math.abs(a.change);
                valB = Math.abs(b.change);
            }
            
            if (marketPageState.sortOrder === 'asc') {
                return valA - valB;
            } else {
                return valB - valA;
            }
        });
    }
    
    // 空状态
    if (items.length === 0) {
        container.innerHTML = `
            <div class="market-empty-state">
                <div class="market-empty-icon">📦</div>
                <div class="market-empty-text">暂无匹配的物品</div>
            </div>
        `;
        return;
    }
    
    // 渲染列表
    container.innerHTML = items.map((item, index) => `
        <div class="market-item-row" data-index="${index}">
            <div class="market-item-rarity" style="background-color: ${getRarityColor(item.rarity)}"></div>
            <div class="market-item-info">
                <div class="market-item-name">${item.name}</div>
                <div class="market-item-category">${getCategoryName(marketPageState.category)}</div>
            </div>
            <div class="market-item-price">${item.price.toLocaleString()}</div>
            <div class="market-item-change ${item.positive ? 'positive' : 'negative'}">
                ${item.positive ? '+' : ''}${item.change}%${item.positive ? '↑' : '↓'}
            </div>
        </div>
    `).join('');
}

// 处理排序
function handleMarketSort(field, element) {
    const allSortables = document.querySelectorAll('.market-list-header .sortable');
    
    if (marketPageState.sortField === field) {
        if (marketPageState.sortOrder === 'desc') {
            marketPageState.sortOrder = 'asc';
            element.classList.remove('sort-desc');
            element.classList.add('sort-asc');
        } else if (marketPageState.sortOrder === 'asc') {
            // 取消排序
            marketPageState.sortField = null;
            marketPageState.sortOrder = null;
            element.classList.remove('sort-asc', 'sort-desc', 'active');
        }
    } else {
        allSortables.forEach(el => {
            el.classList.remove('sort-asc', 'sort-desc', 'active');
        });
        marketPageState.sortField = field;
        marketPageState.sortOrder = 'desc';
        element.classList.add('sort-desc', 'active');
    }
    
    renderMarketList();
}

// 获取稀有度颜色
function getRarityColor(rarity) {
    const colors = {
        red: '#ff4757',
        purple: '#a855f7',
        blue: '#3b82f6',
        green: '#22c55e',
        white: '#9ca3af'
    };
    return colors[rarity] || '#9ca3af';
}

// 获取分类名称
function getCategoryName(category) {
    const names = {
        all: '全部分类',
        guns: '枪械',
        armor: '装备',
        parts: '配件',
        collect: '收集品',
        medical: '医疗品',
        ammo: '弹药'
    };
    return names[category] || '全部分类';
}

// 窗口大小变化时重绘图表
window.addEventListener('resize', function() {
    drawCraftPageChart();
});

console.log('交易制造页面初始化完成');
