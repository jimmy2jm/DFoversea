/**
 * Delta Force Home - Lo-Fi Prototype Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initReportTabs();
    initCopyButtons();
    initGunSelector();
    initMatchItems();
    initCollectionItems();
    initGunModeTabs(); // 新增：改枪推荐页模式切换
});

/**
 * Navigation - 多页面跳转模式
 */
function initNavigation() {
    // 导航链接现在是直接跳转到对应HTML文件
    // 不需要额外的JS处理
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // 登出操作
        });
    }
}

/**
 * Report Tabs - 烽火日报 / 战场日报
 */
function initReportTabs() {
    const tabs = document.querySelectorAll('.report-tabs .tab-btn');
    const fenguoContent = document.getElementById('fenguo-content');
    const zhanchangContent = document.getElementById('zhanchang-content');
    
    // Home 页改枪推荐区域切换
    const gunBuildsFenguo = document.getElementById('gun-builds-fenguo');
    const gunBuildsZhanchang = document.getElementById('gun-builds-zhanchang');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update tab styles
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.dataset.tab;
            
            // Switch content
            if (tabType === 'fenguo') {
                fenguoContent.classList.remove('hidden');
                zhanchangContent.classList.add('hidden');
                
                // 切换改枪推荐区域
                if (gunBuildsFenguo) gunBuildsFenguo.style.display = 'block';
                if (gunBuildsZhanchang) gunBuildsZhanchang.style.display = 'none';
            } else {
                fenguoContent.classList.add('hidden');
                zhanchangContent.classList.remove('hidden');
                
                // 切换改枪推荐区域
                if (gunBuildsFenguo) gunBuildsFenguo.style.display = 'none';
                if (gunBuildsZhanchang) {
                    gunBuildsZhanchang.style.display = 'block';
                    // 初始化战场模式的雷达图（首次显示时）
                    initHomeZhanchangGunSelector();
                }
            }
        });
    });
}

/**
 * Copy Buttons
 */
function initCopyButtons() {
    // Individual code copy (inline items)
    const codeItems = document.querySelectorAll('.code-inline-item');
    codeItems.forEach(item => {
        item.addEventListener('click', () => {
            const mapName = item.querySelector('.code-map').textContent;
            const code = item.querySelector('.code-value').textContent;
            
            copyToClipboard(`${code}`);
            showToast(`已复制: ${mapName} ${code}`);
            
            // Visual feedback
            item.style.background = 'var(--accent-cyan)';
            item.querySelectorAll('span').forEach(s => s.style.color = 'var(--bg-dark)');
            
            setTimeout(() => {
                item.style.background = '';
                item.querySelectorAll('span').forEach(s => s.style.color = '');
            }, 300);
        });
    });
    
    // 密码房指引按钮
    const passwordGuideBtn = document.getElementById('password-guide-btn');
    const passwordGuideModal = document.getElementById('password-guide-modal');
    const passwordGuideOverlay = document.getElementById('password-guide-overlay');
    const passwordGuideClose = document.getElementById('password-guide-close');
    
    if (passwordGuideBtn && passwordGuideModal) {
        passwordGuideBtn.addEventListener('click', () => {
            passwordGuideModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        
        const closeModal = () => {
            passwordGuideModal.classList.remove('show');
            document.body.style.overflow = '';
        };
        
        if (passwordGuideOverlay) {
            passwordGuideOverlay.addEventListener('click', closeModal);
        }
        
        if (passwordGuideClose) {
            passwordGuideClose.addEventListener('click', closeModal);
        }
        
        // ESC 键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && passwordGuideModal.classList.contains('show')) {
                closeModal();
            }
        });
        
        // Tab 切换功能
        const tabBtns = passwordGuideModal.querySelectorAll('.guide-tab-btn');
        const tabContents = passwordGuideModal.querySelectorAll('.guide-tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // 移除所有 active 状态
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // 激活当前 tab
                btn.classList.add('active');
                const targetContent = document.getElementById(`tab-${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
        
        // 轮播切换功能
        const carouselIds = ['daba', 'xigu', 'bakeshi', 'hangtian', 'jianyu'];
        
        carouselIds.forEach(carouselId => {
            const container = document.getElementById(`carousel-${carouselId}`);
            if (!container) return;
            
            const slides = container.querySelectorAll('.carousel-slide');
            const indicators = document.querySelector(`.carousel-indicators[data-carousel="${carouselId}"]`);
            const prevBtn = document.querySelector(`.carousel-prev[data-carousel="${carouselId}"]`);
            const nextBtn = document.querySelector(`.carousel-next[data-carousel="${carouselId}"]`);
            
            let currentIndex = 0;
            
            const updateCarousel = (index) => {
                // 边界检查
                if (index < 0) index = slides.length - 1;
                if (index >= slides.length) index = 0;
                currentIndex = index;
                
                // 更新slides
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === currentIndex);
                });
                
                // 更新指示器
                if (indicators) {
                    indicators.querySelectorAll('.indicator').forEach((ind, i) => {
                        ind.classList.toggle('active', i === currentIndex);
                    });
                }
            };
            
            // 上一张按钮
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    updateCarousel(currentIndex - 1);
                });
            }
            
            // 下一张按钮
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    updateCarousel(currentIndex + 1);
                });
            }
            
            // 指示器点击
            if (indicators) {
                indicators.querySelectorAll('.indicator').forEach(ind => {
                    ind.addEventListener('click', () => {
                        const index = parseInt(ind.getAttribute('data-index'));
                        updateCarousel(index);
                    });
                });
            }
        });
    }
    
    // Copy all codes (保留原有功能，但按钮已被替换)
    const copyAllBtn = document.querySelector('.copy-all-btn');
    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => {
            const codes = [];
            document.querySelectorAll('.code-inline-item').forEach(item => {
                const mapName = item.querySelector('.code-map').textContent;
                const code = item.querySelector('.code-value').textContent;
                codes.push(`${mapName}: ${code}`);
            });
            
            copyToClipboard(codes.join(' | '));
            showToast('已复制全部密码');
            
            // Visual feedback
            copyAllBtn.textContent = '已复制 ✓';
            setTimeout(() => {
                copyAllBtn.textContent = '一键复制';
            }, 1500);
        });
    }
    
    // Build code copy buttons
    const buildCopyBtns = document.querySelectorAll('.build-card .copy-code-btn');
    buildCopyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const buildCard = btn.closest('.build-card');
            const buildType = buildCard.querySelector('.build-type').textContent;
            
            btn.textContent = '复制中...';
            btn.style.background = 'var(--accent-cyan)';
            btn.style.color = 'var(--bg-dark)';
            
            setTimeout(() => {
                btn.textContent = '已复制 ✓';
                showToast(`已复制改枪码: ${buildType}`);
                
                setTimeout(() => {
                    btn.textContent = '复制改枪码';
                    btn.style.background = '';
                    btn.style.color = '';
                }, 1500);
            }, 300);
        });
    });
}

/**
 * Gun Selector - 枪械选择切换
 */
function initGunSelector() {
    // 烽火地带枪械数据 - 维度：后坐力、操控速度、射程优势、持枪稳定性、射速
    const gunBuildsDataFH = {
        mp5: {
            budget: { 
                price: '85,000',
                priceShort: '85K',
                stats: { recoil: 72, handling: 60, range: 45, stability: 55, fireRate: 30 }
            },
            premium: { 
                price: '156,800',
                priceShort: '157K',
                stats: { recoil: 85, handling: 75, range: 55, stability: 70, fireRate: 35 }
            }
        },
        ak74: {
            budget: { 
                price: '92,000',
                priceShort: '92K',
                stats: { recoil: 55, handling: 50, range: 65, stability: 45, fireRate: 60 }
            },
            premium: { 
                price: '198,500',
                priceShort: '199K',
                stats: { recoil: 70, handling: 65, range: 75, stability: 60, fireRate: 65 }
            }
        },
        m4a1: {
            budget: { 
                price: '78,000',
                priceShort: '78K',
                stats: { recoil: 68, handling: 58, range: 60, stability: 52, fireRate: 55 }
            },
            premium: { 
                price: '185,000',
                priceShort: '185K',
                stats: { recoil: 80, handling: 72, range: 70, stability: 68, fireRate: 60 }
            }
        },
        scar: {
            budget: { 
                price: '105,000',
                priceShort: '105K',
                stats: { recoil: 50, handling: 45, range: 75, stability: 40, fireRate: 45 }
            },
            premium: { 
                price: '225,000',
                priceShort: '225K',
                stats: { recoil: 65, handling: 58, range: 85, stability: 55, fireRate: 50 }
            }
        },
        vss: {
            budget: { 
                price: '65,000',
                priceShort: '65K',
                stats: { recoil: 78, handling: 70, range: 55, stability: 65, fireRate: 40 }
            },
            premium: { 
                price: '142,000',
                priceShort: '142K',
                stats: { recoil: 88, handling: 82, range: 65, stability: 78, fireRate: 45 }
            }
        }
    };
    
    // 全面战场枪械数据（单方案）- 维度：后坐力、操控速度、射程优势、持枪稳定性、射速
    const gunBuildsDataZC = {
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
    
    // 存储到全局供模式切换使用
    window.gunBuildsDataFH = gunBuildsDataFH;
    window.gunBuildsDataZC = gunBuildsDataZC;
    
    // 初始化 Home 页枪械选择器
    initHomeGunSelector();
    
    // 初始化烽火地带内容（gun-builds.html）
    initFenghuoGunSelector();
    
    // 初始化全面战场内容（gun-builds.html）
    initZhanchangGunSelector();
}

/**
 * Home 页烽火枪械选择器初始化
 */
function initHomeGunSelector() {
    const gunTabs = document.querySelectorAll('#gun-selector-fh .gun-tab');
    const buildsContent = document.getElementById('gun-builds-content-fh-home');
    
    if (!gunTabs.length || !buildsContent) return;
    
    const data = window.gunBuildsDataFH;
    
    // 初始绘制第一把枪的雷达图
    const firstGun = gunTabs[0]?.dataset.gun;
    if (firstGun && data[firstGun]) {
        drawRadarChart('radar-budget-home', data[firstGun].budget.stats, '#4ade80');
        drawRadarChart('radar-premium-home', data[firstGun].premium.stats, '#a78bfa');
    }
    
    // 绑定枪械切换
    gunTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            gunTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const gunType = tab.dataset.gun;
            const gunData = data[gunType];
            
            if (gunData && buildsContent) {
                const budgetCard = buildsContent.querySelector('.build-card.budget');
                const premiumCard = buildsContent.querySelector('.build-card.premium');
                
                if (budgetCard) {
                    budgetCard.querySelector('.build-type').innerHTML = `💰 ${gunData.budget.priceShort} 性价比改法`;
                    drawRadarChart('radar-budget-home', gunData.budget.stats, '#4ade80');
                }
                
                if (premiumCard) {
                    premiumCard.querySelector('.build-type').innerHTML = `💎 ${gunData.premium.priceShort} 满改方案`;
                    drawRadarChart('radar-premium-home', gunData.premium.stats, '#a78bfa');
                }
            }
        });
    });
    
    // 绑定 Home 页烽火复制按钮
    initFloatCopyButtonsInContainer(buildsContent);
}

/**
 * Home 页战场枪械选择器初始化
 */
let homeZhanchangInitialized = false;
function initHomeZhanchangGunSelector() {
    if (homeZhanchangInitialized) return;
    
    const gunTabs = document.querySelectorAll('#gun-selector-zc .gun-tab');
    const buildsContent = document.getElementById('gun-builds-content-zc-home');
    
    if (!gunTabs.length || !buildsContent) return;
    
    const data = window.gunBuildsDataZC;
    
    // 初始绘制第一把枪的雷达图
    const firstGun = gunTabs[0]?.dataset.gun;
    if (firstGun && data[firstGun]) {
        drawRadarChart('radar-single-home', data[firstGun].stats, '#f39c12');
        updateHomeZhanchangTags(buildsContent, data[firstGun].tags);
    }
    
    // 绑定枪械切换
    gunTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            gunTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const gunType = tab.dataset.gun;
            const gunData = data[gunType];
            
            if (gunData && buildsContent) {
                drawRadarChart('radar-single-home', gunData.stats, '#f39c12');
                updateHomeZhanchangTags(buildsContent, gunData.tags);
            }
        });
    });
    
    // 绑定 Home 页战场复制按钮
    initFloatCopyButtonsInContainer(buildsContent);
    
    homeZhanchangInitialized = true;
}

/**
 * 更新 Home 页战场模式的标签
 */
function updateHomeZhanchangTags(container, tags) {
    const tagsContainer = container.querySelector('.build-tags');
    if (tagsContainer && tags) {
        tagsContainer.innerHTML = tags.map(tag => `<span class="build-tag">${tag}</span>`).join('');
    }
}

/**
 * 烽火地带枪械选择器初始化
 */
function initFenghuoGunSelector() {
    const gunTabs = document.querySelectorAll('#fenghuo-content .gun-tab');
    const buildsContent = document.getElementById('gun-builds-content-fh');
    
    if (!gunTabs.length || !buildsContent) return;
    
    const data = window.gunBuildsDataFH;
    
    // 初始绘制第一把枪的雷达图
    const firstGun = gunTabs[0]?.dataset.gun;
    if (firstGun && data[firstGun]) {
        drawRadarChart('radar-budget-fh', data[firstGun].budget.stats, '#4ade80');
        drawRadarChart('radar-premium-fh', data[firstGun].premium.stats, '#a78bfa');
    }
    
    // 绑定枪械切换
    gunTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            gunTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const gunType = tab.dataset.gun;
            const gunName = tab.querySelector('.gun-tab-name').textContent;
            const gunData = data[gunType];
            
            if (gunData && buildsContent) {
                const budgetCard = buildsContent.querySelector('.build-card.budget');
                const premiumCard = buildsContent.querySelector('.build-card.premium');
                
                if (budgetCard) {
                    budgetCard.querySelector('.build-type').innerHTML = `💰 ${gunData.budget.priceShort} 性价比改法`;
                    drawRadarChart('radar-budget-fh', gunData.budget.stats, '#4ade80');
                }
                
                if (premiumCard) {
                    premiumCard.querySelector('.build-type').innerHTML = `💎 ${gunData.premium.priceShort} 满改方案`;
                    drawRadarChart('radar-premium-fh', gunData.premium.stats, '#a78bfa');
                }
            }
        });
    });
    
    // 绑定烽火复制按钮
    initFloatCopyButtonsInContainer(document.getElementById('fenghuo-content'));
}

/**
 * 全面战场枪械选择器初始化
 */
function initZhanchangGunSelector() {
    const gunTabs = document.querySelectorAll('#zhanchang-content .gun-tab');
    const buildsContent = document.getElementById('gun-builds-content-zc');
    
    if (!gunTabs.length || !buildsContent) return;
    
    const data = window.gunBuildsDataZC;
    
    // 初始绘制第一把枪的雷达图
    const firstGun = gunTabs[0]?.dataset.gun;
    if (firstGun && data[firstGun]) {
        drawRadarChart('radar-single-zc', data[firstGun].stats, '#f39c12');
        updateZhanchangTags(buildsContent, data[firstGun].tags);
    }
    
    // 绑定枪械切换
    gunTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            gunTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const gunType = tab.dataset.gun;
            const gunName = tab.querySelector('.gun-tab-name').textContent;
            const gunData = data[gunType];
            
            if (gunData && buildsContent) {
                drawRadarChart('radar-single-zc', gunData.stats, '#f39c12');
                updateZhanchangTags(buildsContent, gunData.tags);
            }
        });
    });
    
    // 绑定战场复制按钮
    initFloatCopyButtonsInContainer(document.getElementById('zhanchang-content'));
}

/**
 * 更新战场模式的标签
 */
function updateZhanchangTags(container, tags) {
    const tagsContainer = container.querySelector('.build-tags');
    if (tagsContainer && tags) {
        tagsContainer.innerHTML = tags.map(tag => `<span class="build-tag">${tag}</span>`).join('');
    }
}

/**
 * 在指定容器内初始化复制按钮
 */
function initFloatCopyButtonsInContainer(container) {
    if (!container) return;
    
    const floatBtns = container.querySelectorAll('.copy-code-btn-float');
    floatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const buildCard = btn.closest('.build-card');
            let buildType = '改枪方案';
            if (buildCard.classList.contains('budget')) {
                buildType = '性价比改法';
            } else if (buildCard.classList.contains('premium')) {
                buildType = '满改方案';
            } else if (buildCard.classList.contains('single')) {
                buildType = '推荐方案';
            }
            
            btn.textContent = '已复制';
            btn.style.background = 'var(--accent-cyan)';
            btn.style.color = 'var(--bg-dark)';
            
            showToast(`已复制改枪码: ${buildType}`);
            
            setTimeout(() => {
                btn.textContent = '复制';
                btn.style.background = '';
                btn.style.color = '';
            }, 1500);
        });
    });
    
    // 查看详情按钮
    const detailBtns = container.querySelectorAll('.view-detail-btn');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const buildCard = btn.closest('.build-card');
            let buildType = '改枪方案';
            if (buildCard.classList.contains('budget')) {
                buildType = '性价比改法';
            } else if (buildCard.classList.contains('premium')) {
                buildType = '满改方案';
            } else if (buildCard.classList.contains('single')) {
                buildType = '推荐方案';
            }
        });
    });
}

/**
 * 改枪推荐页 - 烽火/战场模式切换
 */
function initGunModeTabs() {
    const modeTabs = document.querySelectorAll('.gun-mode-tab');
    const fenghuoContent = document.getElementById('fenghuo-content');
    const zhanchangContent = document.getElementById('zhanchang-content');
    
    if (!modeTabs.length) return;
    
    // 初始化枪械列表
    initGunListData();
    
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 切换选中状态
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const mode = tab.dataset.mode;
            
            if (mode === 'fenghuo') {
                if (fenghuoContent) fenghuoContent.style.display = 'block';
                if (zhanchangContent) zhanchangContent.style.display = 'none';
                
                // 重新初始化烽火内容
                setTimeout(() => {
                    const firstTab = fenghuoContent?.querySelector('.gun-tab.active');
                    if (firstTab) firstTab.click();
                    // 重新渲染枪械列表
                    renderGunList('fh');
                }, 100);
            } else {
                if (fenghuoContent) fenghuoContent.style.display = 'none';
                if (zhanchangContent) zhanchangContent.style.display = 'block';
                
                // 重新初始化战场内容
                setTimeout(() => {
                    const firstTab = zhanchangContent?.querySelector('.gun-tab.active');
                    if (firstTab) firstTab.click();
                    // 重新渲染枪械列表
                    renderGunList('zc');
                }, 100);
            }
        });
    });
}

/**
 * 枪械列表数据初始化
 */
function initGunListData() {
    // 烽火地带枪械数据（含价格）
    window.gunListDataFH = {
        ar: [
            { id: 'akm', name: 'AKM', price: 125000, icon: '🔫', tags: ['高伤害', '中远距离'] },
            { id: 'tenglong', name: '腾龙', price: 98000, icon: '🔫', tags: ['均衡', '新手友好'] },
            { id: 'ak74', name: 'AK-74M', price: 115000, icon: '🔫', tags: ['高射速', '稳定'] },
            { id: 'm4a1', name: 'M4A1', price: 105000, icon: '🔫', tags: ['全能', '通用'] },
            { id: 'scar', name: 'SCAR-H', price: 145000, icon: '🔫', tags: ['高伤害', '远距离'] },
            { id: 'hk416', name: 'HK416', price: 135000, icon: '🔫', tags: ['精准', '中远距离'] }
        ],
        smg: [
            { id: 'yeniu', name: '野牛', price: 68000, icon: '🔫', tags: ['大弹匣', '近距离'] },
            { id: 'uzi', name: 'UZI', price: 45000, icon: '🔫', tags: ['高射速', '便携'] },
            { id: 'mp5', name: 'MP5', price: 72000, icon: '🔫', tags: ['精准', '中近距离'] },
            { id: 'vector', name: 'Vector', price: 88000, icon: '🔫', tags: ['超高射速', '近战'] },
            { id: 'mp7', name: 'MP7', price: 78000, icon: '🔫', tags: ['穿甲', '均衡'] }
        ],
        sr: [
            { id: 'svd', name: 'SVD', price: 165000, icon: '🎯', tags: ['半自动', '远距离'] },
            { id: 'm24', name: 'M24', price: 185000, icon: '🎯', tags: ['高精度', '栓动'] },
            { id: 'awm', name: 'AWM', price: 250000, icon: '🎯', tags: ['一击必杀', '远距离'] },
            { id: 'vss', name: 'VSS', price: 95000, icon: '🎯', tags: ['消音', '中距离'] },
            { id: 'mosin', name: '莫辛纳甘', price: 120000, icon: '🎯', tags: ['经典', '高伤害'] }
        ],
        lmg: [
            { id: 'pkm', name: 'PKM', price: 175000, icon: '💥', tags: ['大弹容', '火力压制'] },
            { id: 'm249', name: 'M249', price: 195000, icon: '💥', tags: ['持续火力', '中距离'] },
            { id: 'rpk', name: 'RPK', price: 145000, icon: '💥', tags: ['机动性', '通用'] }
        ],
        sg: [
            { id: 's12k', name: 'S12K', price: 55000, icon: '💨', tags: ['半自动', '近战'] },
            { id: 'm870', name: 'M870', price: 42000, icon: '💨', tags: ['高伤害', '泵动'] },
            { id: 'spas12', name: 'SPAS-12', price: 65000, icon: '💨', tags: ['可靠', '近距离'] }
        ],
        pistol: [
            { id: 'glock', name: 'Glock 18', price: 25000, icon: '🔫', tags: ['连发', '备用'] },
            { id: 'deagle', name: '沙漠之鹰', price: 48000, icon: '🔫', tags: ['高伤害', '精准'] },
            { id: 'm1911', name: 'M1911', price: 28000, icon: '🔫', tags: ['经典', '可靠'] }
        ]
    };
    
    // 全面战场枪械数据（无价格）
    window.gunListDataZC = {
        ar: [
            { id: 'm4a1', name: 'M4A1', icon: '🔫', tags: ['均衡', '新手友好', '通用'] },
            { id: 'ak74', name: 'AK-74M', icon: '🔫', tags: ['高伤害', '中距离'] },
            { id: 'hk416', name: 'HK416', icon: '🔫', tags: ['精准', '稳定'] },
            { id: 'aug', name: 'AUG', icon: '🔫', tags: ['自带瞄具', '远距离'] },
            { id: 'famas', name: 'FAMAS', icon: '🔫', tags: ['三连发', '特殊'] },
            { id: 'acr', name: 'ACR', icon: '🔫', tags: ['低后坐', '精准'] }
        ],
        smg: [
            { id: 'mp5', name: 'MP5', icon: '🔫', tags: ['精准', '中近距离'] },
            { id: 'p90', name: 'P90', icon: '🔫', tags: ['大弹匣', '穿甲'] },
            { id: 'mp7', name: 'MP7', icon: '🔫', tags: ['高射速', '近战'] },
            { id: 'ump45', name: 'UMP45', icon: '🔫', tags: ['高伤害', '稳定'] }
        ],
        sr: [
            { id: 'svd', name: 'SVD', icon: '🎯', tags: ['半自动', '中远距离'] },
            { id: 'm24', name: 'M24', icon: '🎯', tags: ['栓动', '高精度'] },
            { id: 'kar98', name: 'Kar98k', icon: '🎯', tags: ['经典', '一击必杀'] },
            { id: 'sks', name: 'SKS', icon: '🎯', tags: ['射手步枪', '中距离'] }
        ],
        lmg: [
            { id: 'm249', name: 'M249', icon: '💥', tags: ['火力压制', '大弹容'] },
            { id: 'mg42', name: 'MG42', icon: '💥', tags: ['超高射速', '固定点'] },
            { id: 'rpd', name: 'RPD', icon: '💥', tags: ['机动', '均衡'] }
        ],
        sg: [
            { id: 'r870', name: 'R870', icon: '💨', tags: ['高伤害', '近战'] },
            { id: 'aa12', name: 'AA-12', icon: '💨', tags: ['全自动', '近距离'] }
        ],
        pistol: [
            { id: 'm1911', name: 'M1911', icon: '🔫', tags: ['经典', '备用'] },
            { id: 'usp', name: 'USP', icon: '🔫', tags: ['精准', '消音'] }
        ]
    };
    
    // 烽火模式枪械的改装方案数据 - 多方案列表
    window.gunSchemesFH = {
        // 突击步枪
        akm: [
            { name: '究极满改100w方案', tags: [{ text: '满改', type: 'premium' }], code: 'AKM-PRE-001' },
            { name: '性价比压枪方案', tags: [{ text: '性价比', type: 'budget' }, { text: '新手推荐', type: 'newbie' }], code: 'AKM-BUD-001' },
            { name: '远距离狙击方案', tags: [{ text: '远距离', type: 'default' }], code: 'AKM-SNP-001' }
        ],
        tenglong: [
            { name: '满配全能方案', tags: [{ text: '满改', type: 'premium' }], code: 'TL-PRE-001' },
            { name: '新手入门方案', tags: [{ text: '性价比', type: 'budget' }, { text: '新手推荐', type: 'newbie' }], code: 'TL-BUD-001' }
        ],
        ak74: [
            { name: '高射速压枪方案', tags: [{ text: '满改', type: 'premium' }], code: 'AK74-PRE-001' },
            { name: '稳定中距离方案', tags: [{ text: '性价比', type: 'budget' }], code: 'AK74-BUD-001' }
        ],
        m4a1: [
            { name: '全能满改方案', tags: [{ text: '满改', type: 'premium' }, { text: '新手推荐', type: 'newbie' }], code: 'M4-PRE-001' },
            { name: '入门通用方案', tags: [{ text: '性价比', type: 'budget' }], code: 'M4-BUD-001' }
        ],
        scar: [
            { name: '顶配远距离方案', tags: [{ text: '满改', type: 'premium' }], code: 'SCAR-PRE-001' },
            { name: '高伤害中距离方案', tags: [{ text: '性价比', type: 'budget' }], code: 'SCAR-BUD-001' }
        ],
        hk416: [
            { name: '高精准满改方案', tags: [{ text: '满改', type: 'premium' }], code: 'HK-PRE-001' },
            { name: '精准中距离方案', tags: [{ text: '性价比', type: 'budget' }], code: 'HK-BUD-001' }
        ],
        // 冲锋枪
        yeniu: [
            { name: '满弹匣高机动方案', tags: [{ text: '满改', type: 'premium' }], code: 'YN-PRE-001' },
            { name: '大弹匣近战方案', tags: [{ text: '性价比', type: 'budget' }, { text: '新手推荐', type: 'newbie' }], code: 'YN-BUD-001' }
        ],
        uzi: [
            { name: '高射速近距离方案', tags: [{ text: '满改', type: 'premium' }], code: 'UZI-PRE-001' },
            { name: '便携入门方案', tags: [{ text: '性价比', type: 'budget' }], code: 'UZI-BUD-001' }
        ],
        mp5: [
            { name: '全能稳定方案', tags: [{ text: '满改', type: 'premium' }], code: 'MP5-PRE-001' },
            { name: '精准中近距离方案', tags: [{ text: '性价比', type: 'budget' }, { text: '新手推荐', type: 'newbie' }], code: 'MP5-BUD-001' }
        ],
        vector: [
            { name: '极速满配方案', tags: [{ text: '满改', type: 'premium' }], code: 'VEC-PRE-001' },
            { name: '超高射速近战方案', tags: [{ text: '性价比', type: 'budget' }], code: 'VEC-BUD-001' }
        ],
        mp7: [
            { name: '高穿透中近距离方案', tags: [{ text: '满改', type: 'premium' }], code: 'MP7-PRE-001' },
            { name: '穿甲均衡方案', tags: [{ text: '性价比', type: 'budget' }], code: 'MP7-BUD-001' }
        ],
        // 狙击步枪
        svd: [
            { name: '高精准远距离方案', tags: [{ text: '满改', type: 'premium' }], code: 'SVD-PRE-001' },
            { name: '半自动中远距离方案', tags: [{ text: '性价比', type: 'budget' }], code: 'SVD-BUD-001' }
        ],
        m24: [
            { name: '一击必杀远距离方案', tags: [{ text: '满改', type: 'premium' }], code: 'M24-PRE-001' },
            { name: '栓动高伤害方案', tags: [{ text: '性价比', type: 'budget' }], code: 'M24-BUD-001' }
        ],
        awm: [
            { name: '狙神顶配方案', tags: [{ text: '满改', type: 'premium' }], code: 'AWM-PRE-001' },
            { name: '高伤害远距离方案', tags: [{ text: '性价比', type: 'budget' }], code: 'AWM-BUD-001' }
        ],
        vss: [
            { name: '静音中远距离方案', tags: [{ text: '满改', type: 'premium' }], code: 'VSS-PRE-001' },
            { name: '消音潜行方案', tags: [{ text: '性价比', type: 'budget' }, { text: '新手推荐', type: 'newbie' }], code: 'VSS-BUD-001' }
        ],
        mosin: [
            { name: '栓动王远距离方案', tags: [{ text: '满改', type: 'premium' }], code: 'MOS-PRE-001' },
            { name: '经典高伤害方案', tags: [{ text: '性价比', type: 'budget' }], code: 'MOS-BUD-001' }
        ],
        // 轻机枪
        pkm: [
            { name: '持续火力满配方案', tags: [{ text: '满改', type: 'premium' }], code: 'PKM-PRE-001' },
            { name: '火力压制大弹容方案', tags: [{ text: '性价比', type: 'budget' }], code: 'PKM-BUD-001' }
        ],
        m249: [
            { name: '火力全开顶配方案', tags: [{ text: '满改', type: 'premium' }], code: 'M249-PRE-001' },
            { name: '中距离通用方案', tags: [{ text: '性价比', type: 'budget' }], code: 'M249-BUD-001' }
        ],
        rpk: [
            { name: '突击型高机动方案', tags: [{ text: '满改', type: 'premium' }], code: 'RPK-PRE-001' },
            { name: '机动均衡方案', tags: [{ text: '性价比', type: 'budget' }, { text: '新手推荐', type: 'newbie' }], code: 'RPK-BUD-001' }
        ],
        // 霰弹枪
        s12k: [
            { name: '速射满配方案', tags: [{ text: '满改', type: 'premium' }], code: 'S12-PRE-001' },
            { name: '半自动近战方案', tags: [{ text: '性价比', type: 'budget' }], code: 'S12-BUD-001' }
        ],
        m870: [
            { name: '一发入魂近战王方案', tags: [{ text: '满改', type: 'premium' }], code: 'M870-PRE-001' },
            { name: '高伤害入门方案', tags: [{ text: '性价比', type: 'budget' }, { text: '新手推荐', type: 'newbie' }], code: 'M870-BUD-001' }
        ],
        spas12: [
            { name: '近战专精满配方案', tags: [{ text: '满改', type: 'premium' }], code: 'SPAS-PRE-001' },
            { name: '可靠通用方案', tags: [{ text: '性价比', type: 'budget' }], code: 'SPAS-BUD-001' }
        ],
        // 手枪
        glock: [
            { name: '高射速自卫方案', tags: [{ text: '满改', type: 'premium' }], code: 'GLK-PRE-001' },
            { name: '连发备用方案', tags: [{ text: '性价比', type: 'budget' }], code: 'GLK-BUD-001' }
        ],
        deagle: [
            { name: '一发入魂精准方案', tags: [{ text: '满改', type: 'premium' }], code: 'DEA-PRE-001' },
            { name: '高伤害帅气方案', tags: [{ text: '性价比', type: 'budget' }], code: 'DEA-BUD-001' }
        ],
        m1911: [
            { name: '传奇满配方案', tags: [{ text: '满改', type: 'premium' }], code: 'M19-PRE-001' },
            { name: '经典可靠方案', tags: [{ text: '性价比', type: 'budget' }], code: 'M19-BUD-001' }
        ]
    };
    
    // 全面战场枪械的改装方案数据 - 多方案列表
    window.gunSchemesZC = {
        // 突击步枪
        m4a1: [
            { name: '均衡新手友好方案', tags: [{ text: '新手推荐', type: 'newbie' }, { text: 'PVP优化', type: 'default' }], code: 'M4-ZC-001' }
        ],
        ak74: [
            { name: '高伤害中距离方案', tags: [{ text: '压枪要求高', type: 'default' }], code: 'AK74-ZC-001' }
        ],
        hk416: [
            { name: '精准稳定全能方案', tags: [{ text: '新手推荐', type: 'newbie' }], code: 'HK-ZC-001' }
        ],
        aug: [
            { name: '远距离高精准方案', tags: [{ text: '自带瞄具', type: 'default' }], code: 'AUG-ZC-001' }
        ],
        famas: [
            { name: '三连发爆发方案', tags: [{ text: '特殊玩法', type: 'default' }], code: 'FAM-ZC-001' }
        ],
        acr: [
            { name: '低后坐精准方案', tags: [{ text: '新手推荐', type: 'newbie' }], code: 'ACR-ZC-001' }
        ],
        // 冲锋枪
        mp5: [
            { name: '精准中近距离方案', tags: [{ text: '新手推荐', type: 'newbie' }], code: 'MP5-ZC-001' }
        ],
        p90: [
            { name: '大弹匣穿甲方案', tags: [{ text: '持续火力', type: 'default' }], code: 'P90-ZC-001' }
        ],
        mp7: [
            { name: '高射速近战方案', tags: [{ text: '机动', type: 'default' }], code: 'MP7-ZC-001' }
        ],
        ump45: [
            { name: '高伤害稳定方案', tags: [{ text: '新手推荐', type: 'newbie' }], code: 'UMP-ZC-001' }
        ],
        // 狙击步枪
        svd: [
            { name: '半自动中远距离方案', tags: [{ text: '连续输出', type: 'default' }], code: 'SVD-ZC-001' }
        ],
        m24: [
            { name: '栓动高精度方案', tags: [{ text: '一击必杀', type: 'default' }], code: 'M24-ZC-001' }
        ],
        kar98: [
            { name: '经典高伤害方案', tags: [{ text: '远距离', type: 'default' }], code: 'K98-ZC-001' }
        ],
        sks: [
            { name: '射手步枪中距离方案', tags: [{ text: '高射速', type: 'default' }], code: 'SKS-ZC-001' }
        ],
        // 轻机枪
        m249: [
            { name: '火力压制大弹容方案', tags: [{ text: '固定点', type: 'default' }], code: 'M249-ZC-001' }
        ],
        mg42: [
            { name: '超高射速固定点方案', tags: [{ text: '恐怖火力', type: 'default' }], code: 'MG42-ZC-001' }
        ],
        rpd: [
            { name: '机动均衡突击方案', tags: [{ text: '新手推荐', type: 'newbie' }], code: 'RPD-ZC-001' }
        ],
        // 霰弹枪
        r870: [
            { name: '高伤害近战方案', tags: [{ text: '一发入魂', type: 'default' }], code: 'R870-ZC-001' }
        ],
        aa12: [
            { name: '全自动近距离方案', tags: [{ text: '恐怖', type: 'default' }], code: 'AA12-ZC-001' }
        ],
        // 手枪
        m1911: [
            { name: '经典备用方案', tags: [{ text: '可靠', type: 'default' }], code: 'M19-ZC-001' }
        ],
        usp: [
            { name: '精准消音方案', tags: [{ text: '特工', type: 'default' }], code: 'USP-ZC-001' }
        ]
    };
    
    // 初始化筛选器事件
    initGunListFilters();
    
    // 渲染初始列表
    renderGunList('fh');
}

/**
 * 初始化枪械列表筛选器
 */
function initGunListFilters() {
    // 烽火地带筛选器
    const typeFilterFH = document.getElementById('gun-type-filter-fh');
    const priceFilterFH = document.getElementById('gun-price-filter-fh');
    
    if (typeFilterFH) {
        typeFilterFH.addEventListener('change', () => renderGunList('fh'));
    }
    if (priceFilterFH) {
        priceFilterFH.addEventListener('change', () => renderGunList('fh'));
    }
    
    // 全面战场筛选器
    const typeFilterZC = document.getElementById('gun-type-filter-zc');
    if (typeFilterZC) {
        typeFilterZC.addEventListener('change', () => renderGunList('zc'));
    }
}

/**
 * 渲染枪械列表
 */
function renderGunList(mode) {
    if (mode === 'fh') {
        renderGunListFH();
    } else {
        renderGunListZC();
    }
}

/**
 * 渲染烽火地带枪械列表
 */
function renderGunListFH() {
    const container = document.getElementById('gun-horizontal-list-fh');
    if (!container) return;
    
    const typeFilter = document.getElementById('gun-type-filter-fh')?.value || 'all';
    const priceFilter = document.getElementById('gun-price-filter-fh')?.value || 'all';
    
    // 获取筛选后的枪械
    let guns = [];
    const data = window.gunListDataFH;
    
    if (typeFilter === 'all') {
        // 全部类型，合并所有
        Object.keys(data).forEach(type => {
            guns = guns.concat(data[type].map(g => ({ ...g, type })));
        });
    } else {
        guns = (data[typeFilter] || []).map(g => ({ ...g, type: typeFilter }));
    }
    
    // 价格筛选
    if (priceFilter !== 'all') {
        guns = guns.filter(gun => {
            const price = gun.price;
            if (priceFilter === '0-50000') return price < 50000;
            if (priceFilter === '50000-100000') return price >= 50000 && price < 100000;
            if (priceFilter === '100000-200000') return price >= 100000 && price < 200000;
            if (priceFilter === '200000+') return price >= 200000;
            return true;
        });
    }
    
    // 渲染枪械卡片
    if (guns.length === 0) {
        container.innerHTML = '<div class="gun-list-empty">暂无符合条件的枪械</div>';
        document.getElementById('gun-build-schemes-fh').style.display = 'none';
        return;
    }
    
    container.innerHTML = guns.map((gun, index) => `
        <div class="gun-list-card ${index === 0 ? 'active' : ''}" data-gun-id="${gun.id}" data-mode="fh">
            <div class="gun-card-image">${gun.icon}</div>
            <div class="gun-card-name">${gun.name}</div>
            <div class="gun-card-price">${gun.price.toLocaleString()}</div>
            <div class="gun-card-type">${getTypeName(gun.type)}</div>
        </div>
    `).join('');
    
    // 绑定点击事件
    container.querySelectorAll('.gun-list-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.gun-list-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            updateGunScheme(card.dataset.gunId, 'fh');
        });
    });
    
    // 显示第一把枪的方案
    document.getElementById('gun-build-schemes-fh').style.display = 'flex';
    updateGunScheme(guns[0].id, 'fh');
}

/**
 * 渲染全面战场枪械列表
 */
function renderGunListZC() {
    const container = document.getElementById('gun-horizontal-list-zc');
    if (!container) return;
    
    const typeFilter = document.getElementById('gun-type-filter-zc')?.value || 'all';
    
    // 获取筛选后的枪械
    let guns = [];
    const data = window.gunListDataZC;
    
    if (typeFilter === 'all') {
        Object.keys(data).forEach(type => {
            guns = guns.concat(data[type].map(g => ({ ...g, type })));
        });
    } else {
        guns = (data[typeFilter] || []).map(g => ({ ...g, type: typeFilter }));
    }
    
    if (guns.length === 0) {
        container.innerHTML = '<div class="gun-list-empty">暂无符合条件的枪械</div>';
        document.getElementById('gun-build-schemes-zc').style.display = 'none';
        return;
    }
    
    container.innerHTML = guns.map((gun, index) => `
        <div class="gun-list-card ${index === 0 ? 'active' : ''}" data-gun-id="${gun.id}" data-mode="zc">
            <div class="gun-card-image">${gun.icon}</div>
            <div class="gun-card-name">${gun.name}</div>
            <div class="gun-card-type">${getTypeName(gun.type)}</div>
        </div>
    `).join('');
    
    // 绑定点击事件
    container.querySelectorAll('.gun-list-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.gun-list-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            updateGunScheme(card.dataset.gunId, 'zc');
        });
    });
    
    // 显示第一把枪的方案
    document.getElementById('gun-build-schemes-zc').style.display = 'flex';
    updateGunScheme(guns[0].id, 'zc');
}

/**
 * 更新枪械改装方案显示 - 纵向列表
 */
function updateGunScheme(gunId, mode) {
    if (mode === 'fh') {
        const schemes = window.gunSchemesFH[gunId];
        if (!schemes || !schemes.length) return;
        
        const container = document.getElementById('gun-build-schemes-fh');
        if (!container) return;
        
        // 动态生成方案列表 - 新布局
        container.innerHTML = schemes.map((scheme, index) => `
            <div class="scheme-row" data-code="${scheme.code}">
                <div class="scheme-row-header-wrap">
                    <div class="scheme-row-header">
                        <span class="scheme-row-title">${scheme.name}</span>
                        <div class="scheme-row-tags">
                            ${scheme.tags.map(tag => `<span class="scheme-row-tag tag-${tag.type}">${tag.text}</span>`).join('')}
                        </div>
                    </div>
                    <button class="copy-scheme-btn" data-code="${scheme.code}">复制改枪码</button>
                </div>
                <div class="scheme-row-body">
                    <div class="scheme-gun-image">枪械图片</div>
                    <div class="scheme-radar-wrapper">
                        ${generateRadarSVG(index)}
                    </div>
                    <div class="scheme-attachments-area">
                        <div class="scheme-attachments-title">配件方案</div>
                        <div class="scheme-attachments-grid">
                            ${generateAttachmentSlots()}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 绑定复制按钮
        bindSchemeCopyButtons('fh');
    } else {
        const schemes = window.gunSchemesZC[gunId];
        if (!schemes || !schemes.length) return;
        
        const container = document.getElementById('gun-build-schemes-zc');
        if (!container) return;
        
        // 动态生成方案列表 - 新布局
        container.innerHTML = schemes.map((scheme, index) => `
            <div class="scheme-row" data-code="${scheme.code}">
                <div class="scheme-row-header-wrap">
                    <div class="scheme-row-header">
                        <span class="scheme-row-title">${scheme.name}</span>
                        <div class="scheme-row-tags">
                            ${scheme.tags.map(tag => `<span class="scheme-row-tag tag-${tag.type}">${tag.text}</span>`).join('')}
                        </div>
                    </div>
                    <button class="copy-scheme-btn" data-code="${scheme.code}">复制改枪码</button>
                </div>
                <div class="scheme-row-body">
                    <div class="scheme-gun-image">枪械图片</div>
                    <div class="scheme-radar-wrapper">
                        ${generateRadarSVG(index)}
                    </div>
                    <div class="scheme-attachments-area">
                        <div class="scheme-attachments-title">配件方案</div>
                        <div class="scheme-attachments-grid">
                            ${generateAttachmentSlots()}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 绑定复制按钮
        bindSchemeCopyButtons('zc');
    }
}

/**
 * 绑定方案复制按钮
 */
function bindSchemeCopyButtons(mode) {
    const containerId = mode === 'fh' ? 'gun-build-schemes-fh' : 'gun-build-schemes-zc';
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.querySelectorAll('.copy-scheme-btn').forEach(btn => {
        // 移除旧事件
        btn.replaceWith(btn.cloneNode(true));
    });
    
    container.querySelectorAll('.copy-scheme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code || '改枪码';
            copyToClipboard(code);
            btn.textContent = '已复制';
            btn.style.background = 'var(--accent-cyan)';
            showToast(`已复制改枪码: ${code}`);
            
            setTimeout(() => {
                btn.textContent = '复制改枪码';
                btn.style.background = '';
            }, 1500);
        });
    });
}

/**
 * 生成模拟五维雷达图 SVG
 */
function generateRadarSVG(seedIndex) {
    const cx = 70, cy = 60, r = 45;
    const labels = ['后坐力控制', '操控速度', '射程优势', '持枪稳定性', '射速'];
    const angles = [-90, -18, 54, 126, 198].map(a => a * Math.PI / 180);
    
    // 模拟不同方案的属性值（0-1）
    const mockValues = [
        [0.85, 0.7, 0.9, 0.6, 0.8],  // 方案1
        [0.6, 0.8, 0.7, 0.85, 0.65], // 方案2
        [0.75, 0.65, 0.8, 0.7, 0.9], // 方案3
    ];
    const values = mockValues[seedIndex % mockValues.length];
    
    // 生成背景网格
    let gridLines = '';
    for (let i = 1; i <= 4; i++) {
        const scale = i / 4;
        const points = angles.map(angle => {
            const x = cx + Math.cos(angle) * r * scale;
            const y = cy + Math.sin(angle) * r * scale;
            return `${x},${y}`;
        }).join(' ');
        gridLines += `<polygon points="${points}" fill="none" stroke="#3a3a3a" stroke-width="1"/>`;
    }
    
    // 生成轴线
    let axisLines = angles.map(angle => {
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#3a3a3a" stroke-width="1"/>`;
    }).join('');
    
    // 生成数据多边形
    const dataPoints = values.map((val, i) => {
        const x = cx + Math.cos(angles[i]) * r * val;
        const y = cy + Math.sin(angles[i]) * r * val;
        return `${x},${y}`;
    }).join(' ');
    
    // 生成标签
    const labelTexts = labels.map((label, i) => {
        const labelR = r + 18;
        const x = cx + Math.cos(angles[i]) * labelR;
        const y = cy + Math.sin(angles[i]) * labelR;
        return `<text x="${x}" y="${y}" fill="#888" font-size="9" text-anchor="middle" dominant-baseline="middle">${label}</text>`;
    }).join('');
    
    return `
        <svg class="scheme-radar-svg" viewBox="0 0 140 120">
            ${gridLines}
            ${axisLines}
            <polygon points="${dataPoints}" fill="rgba(0, 255, 204, 0.2)" stroke="#00ffcc" stroke-width="2"/>
            ${values.map((val, i) => {
                const x = cx + Math.cos(angles[i]) * r * val;
                const y = cy + Math.sin(angles[i]) * r * val;
                return `<circle cx="${x}" cy="${y}" r="3" fill="#00ffcc"/>`;
            }).join('')}
            ${labelTexts}
        </svg>
    `;
}

/**
 * 生成配件占位区域
 */
function generateAttachmentSlots() {
    const attachments = [
        { icon: '◎', name: '枪口' },
        { icon: '◉', name: '瞄具' },
        { icon: '⬡', name: '握把' },
        { icon: '▭', name: '弹匣' },
        { icon: '⊏', name: '枪托' },
        { icon: '⊐', name: '护木' },
        { icon: '✦', name: '激光' },
        { icon: '⊕', name: '战术' }
    ];
    
    return attachments.map(att => `
        <div class="scheme-attachment-slot" title="${att.name}">
            <span class="slot-icon">${att.icon}</span>
            <span class="slot-name">${att.name}</span>
        </div>
    `).join('');
}

/**
 * 获取枪械类型中文名
 */
function getTypeName(type) {
    const typeNames = {
        ar: '突击步枪',
        smg: '冲锋枪',
        sr: '狙击步枪',
        lmg: '轻机枪',
        sg: '霰弹枪',
        pistol: '手枪'
    };
    return typeNames[type] || type;
}

/**
 * 绘制五维雷达图
 */
function drawRadarChart(canvasId, stats, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const size = 130;
    canvas.width = size;
    canvas.height = size;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 45;
    
    // 五个维度的值 (0-100)：后坐力、操控速度、射程优势、持枪稳定性、射速
    const values = [
        stats.recoil / 100,
        stats.handling / 100,
        stats.range / 100,
        stats.stability / 100,
        stats.fireRate / 100
    ];
    
    // 清空画布
    ctx.clearRect(0, 0, size, size);
    
    // 绘制背景网格 (3层)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 0.5;
    
    for (let layer = 1; layer <= 3; layer++) {
        const layerRadius = radius * (layer / 3);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
            const x = centerX + Math.cos(angle) * layerRadius;
            const y = centerY + Math.sin(angle) * layerRadius;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // 绘制轴线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        ctx.stroke();
    }
    
    // 绘制数据多边形
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
        const value = values[i];
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    
    // 填充
    ctx.fillStyle = color + '40'; // 带透明度
    ctx.fill();
    
    // 描边
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // 绘制顶点
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
        const value = values[i];
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

/**
 * Match Items
 */
function initMatchItems() {
    const matchItems = document.querySelectorAll('.match-item');
    
    matchItems.forEach(item => {
        item.addEventListener('click', () => {
            // 对局详情点击
        });
    });
    
    // Show more button
    const showMoreBtn = document.querySelector('.show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            // 加载更多
        });
    }
}

/**
 * Collection Items
 */
function initCollectionItems() {
    const collectionItems = document.querySelectorAll('.collection-item');
    
    collectionItems.forEach(item => {
        item.addEventListener('click', () => {
            // 查看藏品
        });
    });
}

/**
 * Item Cards (High Value Items)
 */
document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => {
        // 查看物品
    });
});

/**
 * View Links
 */
document.querySelectorAll('.view-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // 查看全部
    });
});

/**
 * Copy to Clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

/**
 * Toast Notification
 */
function showToast(message, duration = 2000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(42, 42, 42, 0.95);
        border: 1px solid var(--accent-cyan);
        color: #fff;
        padding: 0.875rem 1.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 10000;
        animation: toastIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastIn {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes toastOut {
                from { opacity: 1; transform: translateX(-50%) translateY(0); }
                to { opacity: 0; transform: translateX(-50%) translateY(20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after duration
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

console.log('Delta Force Home initialized');

// ============================================
// 制造推荐 - 主Tab切换（制造详情/制造推荐）
// ============================================
document.querySelectorAll('.craft-main-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.craft-main-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const mainTab = this.dataset.mainTab;
        const detailContent = document.getElementById('craft-detail-content-desktop');
        const recommendContent = document.getElementById('craft-recommend-content-desktop');
        
        if (mainTab === 'detail') {
            detailContent.classList.remove('hidden');
            recommendContent.classList.add('hidden');
        } else {
            detailContent.classList.add('hidden');
            recommendContent.classList.remove('hidden');
            // 切换到推荐页时刷新数据和图表
            setTimeout(() => {
                updateCraftItems(currentCraftTab);
                drawCraftPriceChart(currentCraftTab, selectedCraftItemIndex);
            }, 50);
        }
    });
});

// ============================================
// 制造推荐 - 数据定义
// ============================================
const craftData = {
    tech: [
        { name: 'OLIGHT Baldr Pro R多功能手电', profit: 18578, change: 12.6, positive: true },
        { name: '灵眼3/7测距狙击瞄准镜', profit: 8083, change: 7.0, positive: true },
        { name: 'DBAL-X2紫色激光镭指', profit: 7487, change: -1.9, positive: false }
    ],
    work: [
        { name: 'PMAG D-60 5.56弹鼓', profit: 15230, change: 8.3, positive: true },
        { name: 'Zenit PT-1折叠枪托', profit: 9120, change: 5.2, positive: true },
        { name: 'Magpul AFG-2前握把', profit: 6540, change: -2.5, positive: false }
    ],
    med: [
        { name: '军用急救包', profit: 12450, change: 15.8, positive: true },
        { name: '肾上腺素注射器', profit: 7890, change: 3.2, positive: true },
        { name: '高级止痛药', profit: 5670, change: -4.1, positive: false }
    ],
    armor: [
        { name: '6级防弹插板', profit: 22340, change: 18.5, positive: true },
        { name: 'Ops-Core头盔', profit: 11200, change: 6.7, positive: true },
        { name: 'THORAX防弹背心', profit: 8950, change: -0.8, positive: false }
    ]
};

// 当前选中的物品索引
let selectedCraftItemIndex = 0;
let currentCraftTab = 'tech';

// ============================================
// 制造推荐 - Tab 切换
// ============================================
document.querySelectorAll('#craft-recommend-content-desktop .craft-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('#craft-recommend-content-desktop .craft-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        currentCraftTab = this.dataset.craft;
        selectedCraftItemIndex = 0;
        updateCraftItems(currentCraftTab);
        drawCraftPriceChart(currentCraftTab, selectedCraftItemIndex);
    });
});

// ============================================
// 制造推荐 - 更新物品卡片
// ============================================
function updateCraftItems(tabType) {
    const items = craftData[tabType];
    const container = document.querySelector('#craft-recommend-content-desktop .craft-items');
    if (!container || !items) return;
    
    container.innerHTML = items.map((item, index) => `
        <div class="craft-item-card ${index === selectedCraftItemIndex ? 'selected' : ''}" data-index="${index}">
            <div class="craft-item-image"></div>
            <div class="craft-item-name">${item.name}</div>
            <div class="craft-item-stats">
                <span class="craft-stat-label">每小时收益</span>
                <span class="craft-stat-value">${item.profit.toLocaleString()}</span>
            </div>
            <div class="craft-item-change ${item.positive ? 'positive' : 'negative'}">
                <span class="change-label">涨幅</span>
                <span class="change-value">${item.positive ? '+' : ''}${item.change}%${item.positive ? '↑' : '↓'}</span>
            </div>
        </div>
    `).join('');
    
    // 绑定点击事件
    container.querySelectorAll('.craft-item-card').forEach(card => {
        card.addEventListener('click', function() {
            container.querySelectorAll('.craft-item-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedCraftItemIndex = parseInt(this.dataset.index);
            drawCraftPriceChart(currentCraftTab, selectedCraftItemIndex);
        });
    });
}

// ============================================
// 制造推荐 - 生成随机价格数据
// ============================================
function generatePriceData(tabType, itemIndex) {
    const items = craftData[tabType];
    const item = items[itemIndex];
    const isPositive = item.positive;
    
    // 基础价格范围根据收益计算
    const basePrice = Math.round(item.profit / 1000 * 2);
    const times = ['10:00', '14:00', '18:00', '22:00', '02:00', '06:00', '11:00'];
    
    let data = [];
    let currentValue = basePrice + (Math.random() - 0.5) * 2;
    
    if (isPositive) {
        // 上涨趋势：先平稳后上涨
        for (let i = 0; i < times.length; i++) {
            if (i < 4) {
                currentValue += (Math.random() - 0.3) * 0.5;
            } else {
                currentValue += Math.random() * 1.5 + 0.5;
            }
            data.push({ time: times[i], value: Math.max(1, currentValue) });
        }
    } else {
        // 下跌趋势：先平稳后下跌
        for (let i = 0; i < times.length; i++) {
            if (i < 3) {
                currentValue += (Math.random() - 0.5) * 0.3;
            } else {
                currentValue -= Math.random() * 0.8 + 0.2;
            }
            data.push({ time: times[i], value: Math.max(1, currentValue) });
        }
    }
    
    return data;
}

// ============================================
// 制造推荐 - 价格走势图
// ============================================
function drawCraftPriceChart(tabType = 'tech', itemIndex = 0) {
    const canvas = document.getElementById('craft-price-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    // 设置 canvas 实际大小
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 50, bottom: 25, left: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 生成数据
    const data = generatePriceData(tabType, itemIndex);
    
    // 计算数据范围
    const values = data.map(d => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;
    const minValue = Math.floor(dataMin - range * 0.2);
    const maxValue = Math.ceil(dataMax + range * 0.2);
    const valueRange = maxValue - minValue;
    
    // 清空画布
    ctx.clearRect(0, 0, width * 2, height * 2);
    
    // 绘制网格线（水平）
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    const gridCount = 6;
    for (let i = 0; i <= gridCount; i++) {
        const val = minValue + (valueRange / gridCount) * i;
        const y = padding.top + chartHeight - ((val - minValue) / valueRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Y轴标签
        ctx.fillStyle = '#666';
        ctx.font = '9px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(1) + '万', padding.left - 5, y + 3);
    }
    
    // 绘制成本基准线（绿色）
    const costValue = data[0].value;
    const costY = padding.top + chartHeight - ((costValue - minValue) / valueRange) * chartHeight;
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, costY);
    ctx.lineTo(width - padding.right, costY);
    ctx.stroke();
    ctx.setLineDash([]);
    
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
            ctx.font = '9px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('最低售价' + point.value.toFixed(1) + '万', x, y + 15);
        }
        
        // 标注最高点
        if (index === maxIndex) {
            ctx.fillStyle = '#00ffcc';
            ctx.font = '9px Inter';
            ctx.textAlign = 'left';
            ctx.fillText('最高售价' + point.value.toFixed(1) + '万', x + 5, y - 8);
        }
    });
    
    // X轴时间标签
    ctx.fillStyle = '#666';
    ctx.font = '9px Inter';
    ctx.textAlign = 'center';
    data.forEach((point, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        ctx.fillText(point.time, x, height - 8);
    });
}

// 页面加载后绘制图表
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        updateCraftItems('tech');
        drawCraftPriceChart('tech', 0);
        // 初始化交易物价模块
        initMarketPrice();
    }, 100);
});

// 窗口大小变化时重绘
window.addEventListener('resize', function() {
    drawCraftPriceChart(currentCraftTab, selectedCraftItemIndex);
    drawMarketMiniChart();
});

// ============================================
// 交易物价模块
// ============================================
let currentMarketCategory = 'all';
let currentMarketRank = 'rise';
let selectedMarketItemIndex = 0;

function initMarketPrice() {
    // 初始化列表
    updateMarketList();
    drawMarketMiniChart();
    
    // 分类下拉菜单
    const categorySelect = document.getElementById('market-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            currentMarketCategory = this.value;
            selectedMarketItemIndex = 0;
            updateMarketList();
            drawMarketMiniChart();
        });
    }
    
    // 涨跌榜Tab
    document.querySelectorAll('.rank-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentMarketRank = this.dataset.rank;
            selectedMarketItemIndex = 0;
            updateMarketList();
            drawMarketMiniChart();
        });
    });
}

function updateMarketList() {
    const container = document.getElementById('market-list');
    if (!container || typeof marketPriceData === 'undefined') return;
    
    const key = `${currentMarketCategory}_${currentMarketRank}`;
    const items = marketPriceData[key] || [];
    
    container.innerHTML = items.map((item, index) => `
        <div class="market-item ${index === selectedMarketItemIndex ? 'selected' : ''}" data-index="${index}">
            <span class="market-item-rarity" style="background-color: ${rarityColors[item.rarity] || '#9ca3af'}"></span>
            <span class="market-item-name">${item.name}</span>
            <span class="market-item-price">${item.price.toLocaleString()}</span>
            <span class="market-item-change ${item.positive ? 'positive' : 'negative'}">${item.positive ? '+' : ''}${item.change}%${item.positive ? '↑' : '↓'}</span>
        </div>
    `).join('');
    
    // 绑定点击事件
    container.querySelectorAll('.market-item').forEach(itemEl => {
        itemEl.addEventListener('click', function() {
            container.querySelectorAll('.market-item').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            selectedMarketItemIndex = parseInt(this.dataset.index);
            drawMarketMiniChart();
        });
    });
}

function drawMarketMiniChart() {
    const canvas = document.getElementById('market-price-chart');
    if (!canvas || typeof marketPriceData === 'undefined') return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 10, right: 10, bottom: 15, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // 获取当前选中物品
    const key = `${currentMarketCategory}_${currentMarketRank}`;
    const items = marketPriceData[key] || [];
    const item = items[selectedMarketItemIndex];
    
    if (!item) return;
    
    // 生成迷你图数据
    const data = generateMarketChartData(item);
    
    const values = data.map(d => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin || 1;
    const minValue = dataMin - range * 0.1;
    const maxValue = dataMax + range * 0.1;
    const valueRange = maxValue - minValue;
    
    ctx.clearRect(0, 0, width * 2, height * 2);
    
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
    ctx.fillStyle = item.positive ? 'rgba(74, 222, 128, 0.15)' : 'rgba(239, 68, 68, 0.15)';
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
    ctx.strokeStyle = item.positive ? '#4ade80' : '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // 绘制当前价格标注
    const lastPoint = data[data.length - 1];
    const lastX = padding.left + chartWidth;
    const lastY = padding.top + chartHeight - ((lastPoint.value - minValue) / valueRange) * chartHeight;
    
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = item.positive ? '#4ade80' : '#ef4444';
    ctx.fill();
    
    // 时间标签
    ctx.fillStyle = '#666';
    ctx.font = '8px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('24h前', padding.left, height - 3);
    ctx.fillText('现在', width - padding.right, height - 3);
}

function generateMarketChartData(item) {
    const points = 12;
    const data = [];
    const basePrice = item.price;
    const changePercent = Math.abs(item.change);
    const isPositive = item.positive;
    
    for (let i = 0; i < points; i++) {
        let value;
        if (isPositive) {
            // 上涨趋势
            const progress = i / (points - 1);
            const noise = (Math.random() - 0.5) * changePercent * 0.3;
            value = basePrice * (1 - changePercent / 100 + progress * changePercent / 100 + noise / 100);
        } else {
            // 下跌趋势
            const progress = i / (points - 1);
            const noise = (Math.random() - 0.5) * changePercent * 0.3;
            value = basePrice * (1 + changePercent / 100 - progress * changePercent / 100 + noise / 100);
        }
        data.push({ value: Math.max(1, value) });
    }
    
    return data;
}
