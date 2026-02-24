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
