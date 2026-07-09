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
    initDailyPosterModal(); // 日报分享弹窗
    initChangelogModal(); // 更新日志弹窗
});

/**
 * 更新日志弹窗
 */
function initChangelogModal() {
    const trigger = document.getElementById('changelog-entry-btn');
    const overlay = document.getElementById('changelog-modal-overlay');
    const closeBtn = document.getElementById('changelog-modal-close');
    if (!trigger || !overlay) return;

    const openModal = () => overlay.classList.add('active');
    const closeModal = () => overlay.classList.remove('active');

    trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal();
    });
}

/**
 * Navigation - 多页面跳转模式
 */
function initNavigation() {
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // 登出操作
        });
    }
    
    // 初始化桌面端登录系统
    initDesktopLoginSystem();
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
    // Individual code copy (password grid items)
    const codeItems = document.querySelectorAll('.pw-item');
    codeItems.forEach(item => {
        item.addEventListener('click', () => {
            const mapName = item.querySelector('.pw-map').textContent;
            const code = item.querySelector('.pw-code').textContent;
            
            copyToClipboard(`${code}`);
            showToast(`已复制: ${mapName} ${code}`);
            
            // Visual feedback
            item.style.background = 'rgba(36, 244, 178, 0.16)';
            
            setTimeout(() => {
                item.style.background = '';
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
            refreshSchemeAuthorsInContainer(buildsContent, gunType);
        });
    });
    
    // 绑定 Home 页烽火复制按钮
    initFloatCopyButtonsInContainer(buildsContent);
    refreshSchemeAuthorsInContainer(buildsContent, document.querySelector('#gun-builds-fenghuo .gun-tab.active')?.dataset?.gun || 'mp5');
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
            refreshSchemeAuthorsInContainer(buildsContent, gunType);
        });
    });
    
    // 绑定 Home 页战场复制按钮
    initFloatCopyButtonsInContainer(buildsContent);
    refreshSchemeAuthorsInContainer(buildsContent, document.querySelector('#gun-builds-zhanchang .gun-tab.active')?.dataset?.gun || 'm4a1');
    
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
            refreshSchemeAuthorsInContainer(buildsContent, gunType);
        });
    });
    
    // 绑定烽火复制按钮
    initFloatCopyButtonsInContainer(document.getElementById('fenghuo-content'));
    refreshSchemeAuthorsInContainer(buildsContent, document.querySelector('#fenghuo-content .gun-tab.active')?.dataset?.gun || 'mp5');
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
            refreshSchemeAuthorsInContainer(buildsContent, gunType);
        });
    });
    
    // 绑定战场复制按钮
    initFloatCopyButtonsInContainer(document.getElementById('zhanchang-content'));
    refreshSchemeAuthorsInContainer(buildsContent, document.querySelector('#zhanchang-content .gun-tab.active')?.dataset?.gun || 'm4a1');
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
    updateGunCopyButtonsAuthState(container);
    floatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isUserLoggedIn()) return;
            const buildCard = btn.closest('.build-card');
            let buildType = '改枪方案';
            let costKey = 'balanced';
            if (buildCard.classList.contains('budget')) {
                buildType = '性价比改法';
                costKey = 'budget';
            } else if (buildCard.classList.contains('premium')) {
                buildType = '满改方案';
                costKey = 'highend';
            } else if (buildCard.classList.contains('single')) {
                buildType = '推荐方案';
                costKey = 'balanced';
            }
            
            const modeContent = btn.closest('.gun-mode-content');
            const mode = modeContent?.id === 'zhanchang-content' ? 'ZC' : 'FH';
            const activeGunTab = modeContent?.querySelector('.gun-tab.active');
            const activeGun = activeGunTab?.querySelector('.gun-tab-name')?.textContent || 'RECOMMEND';
            const gunId = activeGunTab?.dataset?.gun || activeGun.toLowerCase();
            const baseCode = `${mode}-${activeGun}-${buildType}`.replace(/\s+/g, '-').toUpperCase();
            
            btn.textContent = '已复制';
            btn.style.background = 'var(--accent-cyan)';
            btn.style.color = 'var(--bg-dark)';
            
            copyGunBuildCode(baseCode, buildType);
            // 复制次数自增并同步刷新所有展示
            bumpSchemeCopyCount({ gunId, cost: costKey });
            
            setTimeout(() => {
                btn.textContent = btn.dataset.defaultCopyText || '复制';
                btn.style.background = '';
                btn.style.color = '';
            }, 1500);
        });
    });
    
    // 整张 build-card 可点击打开详情（事件委托，兼容 JS 后挂的卡片）
    if (!container.dataset.viewDetailBound) {
        container.dataset.viewDetailBound = '1';
        container.addEventListener('click', (e) => {
            // 排除卡片内的交互元素
            if (e.target.closest('.copy-code-btn-float, .scheme-stat, .scheme-stat-like, .scheme-author, button, a')) return;
            const buildCard = e.target.closest('.build-card');
            if (!buildCard || !container.contains(buildCard)) return;
            let costKey = 'balanced';
            let buildType = '改枪方案';
            if (buildCard.classList.contains('budget')) {
                costKey = 'budget';
                buildType = '性价比改法';
            } else if (buildCard.classList.contains('premium')) {
                costKey = 'highend';
                buildType = '满改方案';
            } else if (buildCard.classList.contains('single')) {
                costKey = 'balanced';
                buildType = '推荐方案';
            }

            const modeContent = buildCard.closest('.gun-mode-content') || document;
            const mode = modeContent.id === 'zhanchang-content' ? 'ZC' : 'FH';
            const activeGunTab = modeContent.querySelector
                ? modeContent.querySelector('.gun-tab.active')
                : container.querySelector('.gun-tab.active');
            const gunName = activeGunTab?.querySelector('.gun-tab-name')?.textContent?.trim() || '枪械';
            const gunId = activeGunTab?.dataset?.gun || gunName.toLowerCase();
            const tags = [...buildCard.querySelectorAll('.build-tag')].map(t => t.textContent.trim());
            const priceText = buildCard.querySelector('.build-type')?.textContent || '';

            openGunSchemeDetailModal({
                gunId,
                gunName,
                cost: costKey,
                buildName: `${gunName} · ${buildType}`,
                priceLabel: priceText.trim(),
                tags,
                mode
            });
        });
    }
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
    
    // 初始化 Tier 榜模拟数据
    initGunTierData();
    
    // 初始化筛选器事件
    initGunListFilters();
    
    // 渲染初始列表
    renderGunList('fh');
}

/**
 * 初始化枪械列表筛选器
 * - 烽火：类型、名称、价格
 * - 战场：类型、名称
 * - 类型变化时联动刷新「枪械名称」下拉的可选项
 */
function initGunListFilters() {
    ['fh', 'zc'].forEach(mode => {
        const filters = mode === 'fh' ? ['type', 'name', 'price'] : ['type', 'name'];
        // 首次填充名称下拉
        populateSchemeNameOptions(mode);
        filters.forEach(filter => {
            const el = document.getElementById(`scheme-${filter}-filter-${mode}`);
            if (!el) return;
            el.addEventListener('change', () => {
                if (filter === 'type') {
                    populateSchemeNameOptions(mode);
                }
                renderGunList(mode);
            });
        });
    });
}

/**
 * 根据当前类型筛选，填充「枪械名称」下拉项
 */
function populateSchemeNameOptions(mode) {
    const select = document.getElementById(`scheme-name-filter-${mode}`);
    if (!select) return;
    const data = mode === 'fh' ? window.gunListDataFH : window.gunListDataZC;
    if (!data) return;
    const typeFilter = document.getElementById(`scheme-type-filter-${mode}`)?.value || 'all';
    const guns = (typeFilter === 'all')
        ? Object.values(data).flat()
        : (data[typeFilter] || []);
    const prevValue = select.value;
    const options = ['<option value="all">全部枪械</option>']
        .concat(guns.map(g => `<option value="${g.id}">${g.name}</option>`));
    select.innerHTML = options.join('');
    // 如果之前选中的枪不在新选项中则重置
    if (prevValue && [...select.options].some(o => o.value === prevValue)) {
        select.value = prevValue;
    } else {
        select.value = 'all';
    }
}

/**
 * 渲染枪械列表 + 改枪方案
 */
function renderGunList(mode) {
    renderGunSchemeList(mode);
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
 * 初始化枪械 Tier 榜模拟数据
 */
function initGunTierData() {
    const tierMapFH = {
        T0: ['ak74', 'm4a1', 'scar', 'mp7'],
        T1: ['mp5', 'hk416', 'vector', 'svd', 'awm'],
        T2: ['akm', 'tenglong', 'yeniu', 'm24', 'pkm', 'rpk'],
        T3: ['uzi', 'm249', 'mosin', 's12k', 'm870', 'spas12', 'glock', 'deagle', 'm1911']
    };
    const tierMapZC = {
        T0: ['m4a1', 'ak74', 'hk416'],
        T1: ['mp7', 'svd', 'aug', 'acr'],
        T2: ['mp5', 'p90', 'm249', 'm24', 'sks', 'ump45'],
        T3: ['famas', 'kar98', 'mg42', 'rpd', 'r870', 'aa12', 'm1911', 'usp']
    };

    window.gunTierDataFH = buildTierGroups(window.gunListDataFH, window.gunSchemesFH, tierMapFH, 'fh');
    window.gunTierDataZC = buildTierGroups(window.gunListDataZC, window.gunSchemesZC, tierMapZC, 'zc');
}

function buildTierGroups(gunData, schemeData, tierMap, mode) {
    const gunsById = flattenGunData(gunData);
    return ['T0', 'T1', 'T2', 'T3'].map(tier => ({
        tier,
        guns: (tierMap[tier] || [])
            .map(id => gunsById[id])
            .filter(Boolean)
            .map(gun => ({
                ...gun,
                tier,
                builds: createTierBuilds(gun, schemeData[gun.id] || [], mode)
            }))
    }));
}

function flattenGunData(gunData) {
    const gunsById = {};
    Object.keys(gunData || {}).forEach(type => {
        (gunData[type] || []).forEach(gun => {
            gunsById[gun.id] = { ...gun, type };
        });
    });
    return gunsById;
}

function createTierBuilds(gun, sourceSchemes, mode) {
    const baseDistance = inferGunDistance(gun);
    const secondaryDistance = baseDistance === 'close' ? 'hipfire' : baseDistance === 'long' ? 'mid' : 'close';
    const premiumDistance = baseDistance === 'close' ? 'mid' : 'long';
    const budgetSource = sourceSchemes.find(scheme => (scheme.tags || []).some(tag => tag.type === 'budget')) || sourceSchemes[1] || sourceSchemes[0];
    const premiumSource = sourceSchemes.find(scheme => (scheme.tags || []).some(tag => tag.type === 'premium')) || sourceSchemes[0];

    return [
        createTierBuild(gun, budgetSource, mode, 'budget', baseDistance, `${gun.name} 性价比改法`, 85000),
        createTierBuild(gun, null, mode, 'balanced', secondaryDistance, `${gun.name} 均衡方案`, 120000),
        createTierBuild(gun, premiumSource, mode, 'highend', premiumDistance, `${gun.name} 满改方案`, 157000)
    ];
}

function createTierBuild(gun, sourceScheme, mode, cost, distance, fallbackName, price) {
    const readableCost = getCostLabel(cost);
    const readableDistance = getDistanceLabel(distance);
    const sourceTags = (sourceScheme?.tags || []).map(tag => tag.text).filter(Boolean);
    const gunTags = gun.tags || [];
    const tags = [...new Set([readableCost, readableDistance, ...sourceTags, ...gunTags].filter(Boolean))].slice(0, 4);
    return {
        id: `${gun.id}-${cost}-${mode}`,
        gunId: gun.id,
        gunName: gun.name,
        name: sourceScheme?.name || fallbackName,
        code: sourceScheme?.code || `${gun.id.toUpperCase()}-${mode.toUpperCase()}-${cost.toUpperCase()}`,
        cost,
        distance,
        price,
        tags
    };
}

function inferGunDistance(gun) {
    const text = `${gun.name} ${(gun.tags || []).join('')}`;
    if (/腰射|满腰|hip/i.test(text)) return 'hipfire';
    if (/近|便携|高射速|霰弹/i.test(text)) return 'close';
    if (/远|狙|精准|自带瞄具/i.test(text)) return 'long';
    return 'mid';
}

function getCostLabel(cost) {
    const labels = {
        budget: 'Budget',
        balanced: 'Balanced',
        highend: 'High-end'
    };
    return labels[cost] || cost;
}

function getDistanceLabel(distance) {
    const labels = {
        close: '近距离',
        mid: '中距离',
        long: '远距离',
        hipfire: '满腰射'
    };
    return labels[distance] || distance;
}

function getTierData(mode) {
    return mode === 'fh' ? window.gunTierDataFH : window.gunTierDataZC;
}

/**
 * 取扁平化的枪械列表（含 builds），不再按 Tier 分组
 */
function getFlatGunsWithBuilds(mode) {
    const groups = getTierData(mode) || [];
    const out = [];
    groups.forEach(g => (g.guns || []).forEach(gun => out.push(gun)));
    return out;
}

function getSchemeFilters(mode) {
    return {
        type: document.getElementById(`scheme-type-filter-${mode}`)?.value || 'all',
        name: document.getElementById(`scheme-name-filter-${mode}`)?.value || 'all',
        price: document.getElementById(`scheme-price-filter-${mode}`)?.value || 'all'
    };
}

function matchPriceBucket(price, bucket) {
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
 * 取按"方案粒度"扁平化的列表（每条 = 一把枪 + 一个方案）
 * 满足筛选后再返回
 */
function getFilteredSchemeRows(mode) {
    const filters = getSchemeFilters(mode);
    const rows = [];
    getFlatGunsWithBuilds(mode).forEach(gun => {
        if (filters.type !== 'all' && gun.type !== filters.type) return;
        if (filters.name !== 'all' && gun.id !== filters.name) return;
        if (mode === 'fh' && filters.price !== 'all' && !matchPriceBucket(gun.price, filters.price)) return;
        (gun.builds || []).forEach((build, index) => {
            rows.push({ gun, build, index });
        });
    });
    return rows;
}

/**
 * 渲染枪械方案列表（按方案粒度，不再聚合）
 */
function renderGunSchemeList(mode) {
    const container = document.getElementById(mode === 'fh' ? 'gun-scheme-list-fh' : 'gun-scheme-list-zc');
    if (!container) return;

    const rows = getFilteredSchemeRows(mode);
    if (!rows.length) {
        container.innerHTML = '<div class="gun-list-empty scheme-empty">暂无符合条件的枪械方案</div>';
        return;
    }

    container.innerHTML = rows.map(({ gun, build, index }) => renderSchemeBuildCard(gun, build, index, mode)).join('');

    bindSchemeListInteractions(container);
}

function renderSchemeBuildCard(gun, build, _index, mode) {
    const author = (typeof window.getGunSchemeAuthor === 'function')
        ? window.getGunSchemeAuthor({ gunId: build.gunId, cost: build.cost })
        : null;
    const authorHtml = renderSchemeAuthor(author, { compact: true });
    const statsHtml = renderSchemeStats({ gunId: build.gunId, cost: build.cost }, { compact: true });

    // 标签去重：剔除已由"方案总价"表达的成本档
    const filteredTags = (build.tags || []).filter(t => !/^(Budget|Balanced|High-end)$/i.test(t));

    // 标题栏价格：六位数字（模拟），不使用 K 简写
    const priceNum = build.price || Math.floor(80000 + Math.random() * 120000);
    const priceText = String(priceNum).padStart(6, '0');
    const costClass = build.cost === 'budget' ? 'budget-type'
        : build.cost === 'highend' ? 'premium-type'
        : 'single-type';

    // 六维属性条数据（与雷达图 mockValues 一致）
    const seedMap = { budget: 0, balanced: 1, highend: 2 };
    const seedIndex = seedMap[build.cost] ?? 1;
    const radarLabels = ['基础伤害', '优势射程', '后坐力控制', '操控速度', '武器稳定性', '腰射精度'];
    const radarIcons = ['💥', '📏', '📉', '⚡', '🛡️', '🎯'];
    const mockValues = [
        [0.78, 0.65, 0.85, 0.7, 0.6, 0.72],
        [0.6, 0.55, 0.7, 0.82, 0.78, 0.6],
        [0.82, 0.88, 0.7, 0.62, 0.7, 0.55]
    ];
    const statValues = mockValues[seedIndex % mockValues.length];

    const statsBarsHtml = radarLabels.map((label, i) => {
        const pct = Math.round(statValues[i] * 100);
        return `<div class="scheme-stat-bar">
            <span class="scheme-stat-icon">${radarIcons[i]}</span>
            <span class="scheme-stat-label">${label}</span>
            <span class="scheme-stat-track"><i style="width:${pct}%"></i></span>
            <span class="scheme-stat-num">${pct}</span>
        </div>`;
    }).join('');

    // 枪图左下角：裸枪价（仅烽火）
    const gunPriceOverlayHtml = (mode === 'fh' && gun.price)
        ? `<span class="build-gun-price" title="裸枪价">
                <svg class="build-gun-price-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 3.5"/><path d="M12 16.5h.01"/></svg>
                <span class="build-gun-price-value">${gun.price.toLocaleString('en-US')}</span>
           </span>`
        : '';

    // 分享码
    const codeHtml = build.code ? `<span class="scheme-code-tag" title="分享码">${build.code}</span>` : '';

    return `
        <div class="build-card scheme-list-card scheme-list-card-v2 is-clickable"
             data-code="${build.code}" data-gun-id="${build.gunId || gun.id}" data-cost="${build.cost || ''}" data-name="${build.name}" data-mode="${mode}">
            <!-- 标题栏：左枪名+价格+标签，右复制按钮 -->
            <div class="scheme-card-header">
                <div class="scheme-card-header-left">
                    <span class="scheme-card-gun-name">${gun.name}</span>
                    <span class="scheme-card-price ${costClass}">${priceText}</span>
                    ${filteredTags.length ? `<span class="scheme-card-tags">${filteredTags.map(tag => `<span class="build-tag">${tag}</span>`).join('')}</span>` : ''}
                </div>
                <button class="copy-code-btn-float" type="button" data-code="${build.code}" data-name="${build.name}">复制</button>
            </div>
            <!-- 主内容：左枪图，右六条属性条 -->
            <div class="scheme-card-body">
                <div class="scheme-card-left">
                    <div class="build-gun-image">
                        ${gunPriceOverlayHtml}
                    </div>
                    <div class="scheme-card-code-row">
                        ${codeHtml}
                    </div>
                </div>
                <div class="scheme-card-stats">
                    ${statsBarsHtml}
                </div>
            </div>
            <!-- 底部：作者 + 点赞/复制数（同行，右侧） -->
            <div class="scheme-card-footer">
                ${authorHtml}
                ${statsHtml}
            </div>
        </div>
    `;
}

function formatBuildPrice(price) {
    if (price >= 10000) return `${Math.round(price / 1000)}K`;
    return String(price);
}

function bindSchemeListInteractions(container) {
    ensureSchemeStatsClickDelegate();

    updateGunCopyButtonsAuthState(container);

    // 卡片内右上角浮动复制按钮
    container.querySelectorAll('.copy-code-btn-float').forEach(btn => {
        btn.addEventListener('click', event => {
            event.stopPropagation();
            if (!isUserLoggedIn()) return;
            const card = btn.closest('.scheme-list-card');
            const code = btn.dataset.code || '改枪码';
            const name = btn.dataset.name || '改枪方案';
            copyGunBuildCode(code, name);
            if (card) {
                bumpSchemeCopyCount({ gunId: card.dataset.gunId, cost: card.dataset.cost });
            }
            btn.textContent = '已复制';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = btn.dataset.defaultCopyText || '复制';
                btn.classList.remove('copied');
            }, 1500);
        });
    });

    // 整张方案卡片可点击 → 打开详情弹窗
    container.querySelectorAll('.scheme-list-card').forEach(card => {
        card.addEventListener('click', event => {
            if (event.target.closest('.copy-code-btn-float, .scheme-stat, .scheme-stat-like, .scheme-author, button, a')) return;
            const mode = card.dataset.mode || 'fh';
            const tags = [...card.querySelectorAll('.build-tag')].map(t => t.textContent.trim());
            openGunSchemeDetailModal({
                gunId: card.dataset.gunId || '',
                gunName: (card.querySelector('.build-card-gun-sub')?.textContent?.split('·')[0] || '').trim(),
                cost: card.dataset.cost || 'balanced',
                buildName: card.dataset.name || '改枪方案',
                priceLabel: card.querySelector('.build-type')?.textContent?.trim() || '',
                tags,
                mode: mode.toUpperCase()
            });
        });
    });
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
    
    updateGunCopyButtonsAuthState(container);
    
    container.querySelectorAll('.copy-scheme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isUserLoggedIn()) return;
            const code = btn.dataset.code || '改枪码';
            copyGunBuildCode(code, code);
            btn.textContent = '已复制';
            btn.style.background = 'var(--accent-cyan)';
            
            setTimeout(() => {
                btn.textContent = btn.dataset.defaultCopyText || '复制改枪码';
                btn.style.background = '';
            }, 1500);
        });
    });
}

function isUserLoggedIn() {
    try {
        const data = JSON.parse(localStorage.getItem('df_login') || '{}');
        return !!data.loggedIn;
    } catch (e) {
        return false;
    }
}

function setGunCopyButtonAuthState(btn, loggedIn) {
    // 富结构按钮（含 icon + label 子元素）只改 label，不破坏 DOM
    const labelEl = btn.querySelector('.gun-detail-modal-copy-label');
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
        btn.classList.remove('gun-copy-login-required');
        writeText(btn.dataset.defaultCopyText || '复制');
    } else {
        btn.disabled = true;
        btn.classList.add('gun-copy-login-required');
        writeText('登录以复制');
        btn.style.background = '';
        btn.style.color = '';
    }
}

function updateGunCopyButtonsAuthState(root = document) {
    const loggedIn = isUserLoggedIn();
    root.querySelectorAll('.copy-code-btn-float, .tier-copy-btn, .copy-scheme-btn').forEach(btn => {
        setGunCopyButtonAuthState(btn, loggedIn);
    });
}

function copyGunBuildCode(baseCode) {
    copyToClipboard(baseCode || 'DF-BUILD-CODE');
    showGunCodeToast();
}

function showGunCodeToast() {
    const existingToast = document.querySelector('.gun-code-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast gun-code-toast';
    toast.innerHTML = '<span class="gun-code-toast-title">已复制成功</span>';

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
}

/**
 * 打开改枪方案详情弹窗
 * @param {Object} meta {gunId, gunName, cost, buildName, priceLabel, tags, mode}
 */
function openGunSchemeDetailModal(meta) {
    meta = meta || {};
    const overlay = document.getElementById('gun-detail-modal-overlay');
    if (!overlay || typeof window.getGunSchemeDetail !== 'function') return;

    const detail = window.getGunSchemeDetail({
        gunId: meta.gunId,
        gunName: meta.gunName,
        cost: meta.cost,
        code: meta.code,
        name: meta.buildName
    });

    const titleEl = document.getElementById('gun-detail-modal-title');
    const tagsEl = document.getElementById('gun-detail-modal-tags');
    const bodyEl = document.getElementById('gun-detail-modal-body');

    // 标题：优先使用方案名称；若空则回退到枪名
    if (titleEl) titleEl.textContent = meta.buildName || meta.gunName || '改枪方案详情';

    if (tagsEl) {
        // 价格单起一行（放在标签之上，不再与标签混排）
        const valueLabel = detail.totalPrice
            ? `<div class="gun-detail-modal-price-row"><span class="gun-detail-modal-value">💎 ${detail.totalPrice.toLocaleString()}</span></div>`
            : '';
        const tagPills = (meta.tags || [])
            .filter(Boolean)
            .map(tag => `<span class="gun-detail-modal-tag">${tag}</span>`)
            .join('');
        const tagsRow = tagPills ? `<div class="gun-detail-modal-tag-row">${tagPills}</div>` : '';
        tagsEl.innerHTML = `${valueLabel}${tagsRow}`;
    }

    if (bodyEl) {
        bodyEl.innerHTML = renderGunSchemeDetailBody(meta, detail);
        bindGunSchemeDetailBody(bodyEl, detail);
    }

    const footerEl = document.getElementById('gun-detail-modal-footer');
    if (footerEl) {
        footerEl.innerHTML = renderGunSchemeDetailFooter(detail, meta);
        bindGunSchemeDetailFooter(footerEl, detail, meta);
    }

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function renderGunSchemeDetailBody(meta, detail) {
    const summary = detail.summary ? `<p class="gun-detail-modal-summary">${detail.summary}</p>` : '';
    const authorHtml = renderSchemeAuthor(detail.author);
    // 雷达图复用现有生成器；用方案 cost 作为种子保证不同方案差异化
    const seedMap = { budget: 0, balanced: 1, highend: 2 };
    const radarSvg = generateRadarSVG(seedMap[meta.cost] ?? 1);

    return `
        <section class="gun-detail-modal-overview">
            <div class="gun-detail-modal-hero">
                <div class="gun-detail-modal-hero-image">🔫</div>
                <div class="gun-detail-modal-hero-radar">
                    <div class="gun-detail-modal-radar-wrap">${radarSvg}</div>
                </div>
            </div>
            ${(summary || authorHtml) ? `
                <div class="gun-detail-modal-meta-row">
                    ${summary}
                    ${authorHtml}
                </div>
            ` : ''}
        </section>

        <section class="gun-detail-modal-section">
            <h3 class="gun-detail-modal-section-title">配件清单</h3>
            <div class="gun-attachment-list gun-attachment-grid">
                ${detail.attachments.map(att => renderAttachmentRow(att)).join('')}
            </div>
        </section>
    `;
}

function renderGunSchemeDetailFooter(detail, meta) {
    const statsHtml = renderSchemeStats({ gunId: meta?.gunId, cost: meta?.cost }, { footer: true });
    return `
        <div class="gun-detail-modal-footer-stats">
            ${statsHtml}
        </div>
        <button class="gun-detail-modal-copy-btn copy-scheme-btn" type="button" data-code="${detail.code}">
            <span class="gun-detail-modal-copy-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </span>
            <span class="gun-detail-modal-copy-label">复制改枪码</span>
        </button>
    `;
}

function bindGunSchemeDetailFooter(footerEl, detail, meta) {
    updateGunCopyButtonsAuthState(footerEl);
    const copyBtn = footerEl.querySelector('.gun-detail-modal-copy-btn');
    if (!copyBtn) return;
    const labelEl = copyBtn.querySelector('.gun-detail-modal-copy-label');
    const defaultLabel = labelEl?.textContent || '复制改枪码';
    copyBtn.addEventListener('click', () => {
        if (!isUserLoggedIn()) return;
        const code = copyBtn.dataset.code || detail.code;
        copyGunBuildCode(code);
        // 复制次数 +1，刷新所有展示
        if (meta && meta.gunId) {
            bumpSchemeCopyCount({ gunId: meta.gunId, cost: meta.cost });
        }
        if (labelEl) labelEl.textContent = '已复制';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            if (labelEl) labelEl.textContent = defaultLabel;
            copyBtn.classList.remove('copied');
        }, 1500);
    });
}

function renderAttachmentRow(att) {
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

function bindGunSchemeDetailBody(bodyEl, detail) {
    updateGunCopyButtonsAuthState(bodyEl);
    ensureSchemeStatsClickDelegate();
    const copyBtn = bodyEl.querySelector('.gun-detail-modal-copy-btn');
    if (!copyBtn) return;
    copyBtn.addEventListener('click', () => {
        if (!isUserLoggedIn()) return;
        const code = copyBtn.dataset.code || detail.code;
        copyGunBuildCode(code);
        copyBtn.textContent = '已复制';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = copyBtn.dataset.defaultCopyText || '复制改枪码';
            copyBtn.classList.remove('copied');
        }, 1500);
    });
}

function closeGunSchemeDetailModal() {
    const overlay = document.getElementById('gun-detail-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function initGunSchemeDetailModal() {
    const overlay = document.getElementById('gun-detail-modal-overlay');
    if (!overlay) return;
    const closeBtn = document.getElementById('gun-detail-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGunSchemeDetailModal);
    }
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeGunSchemeDetailModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeGunSchemeDetailModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', initGunSchemeDetailModal);

/**
 * 生成模拟五维雷达图 SVG
 */
function generateRadarSVG(seedIndex) {
    const cx = 70, cy = 60, r = 42;
    // 顶部顺时针：基础伤害 / 优势射程 / 后坐力控制 / 操控速度 / 武器稳定性 / 腰射精度
    const labels = ['基础伤害', '优势射程', '后坐力控制', '操控速度', '武器稳定性', '腰射精度'];
    const numSides = 6;
    const startAngle = -Math.PI / 2;
    const angleStep = (Math.PI * 2) / numSides;
    const angles = Array.from({ length: numSides }, (_, i) => startAngle + angleStep * i);
    
    // 模拟不同方案的属性值（0-1） - 6 维
    const mockValues = [
        [0.78, 0.65, 0.85, 0.7, 0.6, 0.72],  // 方案1
        [0.6, 0.55, 0.7, 0.82, 0.78, 0.6],   // 方案2
        [0.82, 0.88, 0.7, 0.62, 0.7, 0.55]   // 方案3
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
    
    // 生成标签（依据角度自适应 anchor，避免左右标签覆盖图形）
    const labelTexts = labels.map((label, i) => {
        const labelR = r + 16;
        const x = cx + Math.cos(angles[i]) * labelR;
        const y = cy + Math.sin(angles[i]) * labelR;
        const cosA = Math.cos(angles[i]);
        const anchor = cosA > 0.2 ? 'start' : cosA < -0.2 ? 'end' : 'middle';
        return `<text x="${x}" y="${y}" fill="#888" font-size="8" text-anchor="${anchor}" dominant-baseline="middle">${label}</text>`;
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
 * 渲染方案作者区（HTML）
 * @param {Object|null} author  {name, avatar?, official?}
 * @param {Object} opts {compact?: boolean}
 * @returns {string}  作者为空时返回空字符串，调用方按需判空
 */
/**
 * SVG 图标库（点赞 / 复制次数）
 */
const SCHEME_STAT_ICONS = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    heartFilled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
};

/**
 * 渲染方案 stats（点赞 + 复制次数）
 * @param {Object} meta {gunId, cost}
 * @param {Object} opts {compact?: boolean}
 * @returns {string} HTML
 */
function renderSchemeStats(meta, opts = {}) {
    if (!meta || !meta.gunId) return '';
    if (typeof window.getGunSchemeStats !== 'function') return '';
    const stats = window.getGunSchemeStats(meta);
    const variantCls = opts.footer
        ? ' scheme-stats--footer'
        : (opts.compact ? ' scheme-stats--compact' : '');
    const likedCls = stats.likedByMe ? ' is-liked' : '';
    const heartIcon = stats.likedByMe ? SCHEME_STAT_ICONS.heartFilled : SCHEME_STAT_ICONS.heart;
    const fmt = window.formatStatNumber || (n => String(n));
    const gunIdAttr = (meta.gunId || '').toLowerCase();
    const costAttr = meta.cost || 'balanced';
    return `
        <div class="scheme-stats${variantCls}" data-scheme-gun="${gunIdAttr}" data-scheme-cost="${costAttr}">
            <button class="scheme-stat scheme-stat-like${likedCls}" type="button" aria-pressed="${stats.likedByMe}" aria-label="点赞">
                <span class="scheme-stat-icon">${heartIcon}</span>
                <span class="scheme-stat-value">${fmt(stats.likes)}</span>
            </button>
            <span class="scheme-stat scheme-stat-copy" aria-label="复制次数">
                <span class="scheme-stat-icon">${SCHEME_STAT_ICONS.copy}</span>
                <span class="scheme-stat-value">${fmt(stats.copies)}</span>
            </span>
        </div>
    `;
}

/**
 * 刷新页面上指定方案 key 的所有 stats UI（保持多处展示同步）
 */
function refreshSchemeStatsUI(meta) {
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
            if (iconWrap) iconWrap.innerHTML = stats.likedByMe ? SCHEME_STAT_ICONS.heartFilled : SCHEME_STAT_ICONS.heart;
            const valEl = likeBtn.querySelector('.scheme-stat-value');
            if (valEl) valEl.textContent = fmt(stats.likes);
        }
        if (copyEl) copyEl.textContent = fmt(stats.copies);
    });
}

/**
 * 在页面 body 上委托一次点赞按钮 click（多处共用同一委托）
 */
function ensureSchemeStatsClickDelegate() {
    if (document.body.dataset.schemeStatsBound === '1') return;
    document.body.dataset.schemeStatsBound = '1';
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
            refreshSchemeStatsUI(meta);
        }
    });
}

/**
 * 给某个方案 meta 触发复制次数 +1，并刷新所有展示
 */
function bumpSchemeCopyCount(meta) {
    if (!meta || !meta.gunId) return;
    if (typeof window.incrementGunSchemeCopy !== 'function') return;
    window.incrementGunSchemeCopy(meta);
    refreshSchemeStatsUI(meta);
}

function renderSchemeAuthor(author, opts = {}) {
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

/**
 * 在指定 build-card 元素上挂载作者区与查看详情按钮
 * - 作者区永远显示（无玩家投稿时为 DF 官方）
 * - 查看详情按钮位于作者区下方
 * @param {HTMLElement} card  build-card 元素
 * @param {Object} meta {gunId, cost}
 */
function mountSchemeAuthorOnCard(card, meta) {
    if (!card || typeof window.getGunSchemeAuthor !== 'function') return;
    // 先移除旧节点，避免切换枪械后重复（含历史遗留 .build-footer）
    card.querySelectorAll(':scope > .scheme-author, :scope > .scheme-stats, :scope > .build-footer').forEach(el => el.remove());

    const author = window.getGunSchemeAuthor(meta);
    const authorHtml = renderSchemeAuthor(author);
    let authorEl = null;
    if (authorHtml) {
        const tpl = document.createElement('div');
        tpl.innerHTML = authorHtml.trim();
        authorEl = tpl.firstElementChild;
        card.appendChild(authorEl);
    }

    // 点赞 + 复制次数：紧随作者名称右侧（嵌入作者行内）
    const statsHtml = renderSchemeStats(meta);
    if (statsHtml) {
        const tpl2 = document.createElement('div');
        tpl2.innerHTML = statsHtml.trim();
        const statsEl = tpl2.firstElementChild;
        if (authorEl) {
            authorEl.appendChild(statsEl);
        } else {
            card.appendChild(statsEl);
        }
    }

    // 整卡可点击：游标 + 提示
    card.classList.add('is-clickable');

    ensureSchemeStatsClickDelegate();
}

/**
 * 刷新某个 builds-content 容器内所有 build-card 的作者区
 * @param {HTMLElement|null} container
 * @param {string} gunId
 */
function refreshSchemeAuthorsInContainer(container, gunId) {
    if (!container || !gunId) return;
    const id = gunId.toLowerCase();
    const map = [
        { sel: '.build-card.budget', cost: 'budget' },
        { sel: '.build-card.premium', cost: 'highend' },
        { sel: '.build-card.single', cost: 'balanced' }
    ];
    map.forEach(item => {
        const card = container.querySelector(item.sel);
        if (card) mountSchemeAuthorOnCard(card, { gunId: id, cost: item.cost });
    });
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
    
    // 六维（顶部顺时针）：基础伤害 / 优势射程 / 后坐力控制 / 操控速度 / 武器稳定性 / 腰射精度
    // 旧字段缺失时按已有维度做合理 mock，保持原型一致
    const fallback = (v) => (typeof v === 'number' ? v : 0);
    const damage = fallback(stats.damage ?? Math.round((fallback(stats.range) + fallback(stats.recoil)) / 2));
    const hipfire = fallback(stats.hipfire ?? Math.round((fallback(stats.handling) + (100 - fallback(stats.range))) / 2));
    const values = [
        damage / 100,
        fallback(stats.range) / 100,
        fallback(stats.recoil) / 100,
        fallback(stats.handling) / 100,
        fallback(stats.stability) / 100,
        hipfire / 100
    ];
    const numSides = 6;
    const startAngle = -Math.PI / 2; // 顶部
    const angleStep = (Math.PI * 2) / numSides;
    
    // 清空画布
    ctx.clearRect(0, 0, size, size);
    
    // 绘制背景网格 (3层)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 0.5;
    
    for (let layer = 1; layer <= 3; layer++) {
        const layerRadius = radius * (layer / 3);
        ctx.beginPath();
        for (let i = 0; i < numSides; i++) {
            const angle = startAngle + angleStep * i;
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
    for (let i = 0; i < numSides; i++) {
        const angle = startAngle + angleStep * i;
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
    for (let i = 0; i < numSides; i++) {
        const angle = startAngle + angleStep * i;
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
    for (let i = 0; i < numSides; i++) {
        const angle = startAngle + angleStep * i;
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
        border-radius: 0;
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
            // 切换到推荐页时刷新部门产物列表
            setTimeout(() => {
                renderCraftRecommendDashboard();
            }, 50);
        }
    });
});

// ============================================
// 制造推荐 - 数据定义
// ============================================
const craftData = {
    tech: [
        { id: 'qcc171', name: 'QCQ171冲锋枪', icon: 'SMG', totalProfit: 43274, hourlyProfit: 901, change: 0.0, positive: true },
        { id: 'svd', name: 'SVD狙击步枪', icon: 'DMR', totalProfit: 38918, hourlyProfit: 2432, change: -1.5, positive: false },
        { id: 'aug', name: 'AUG突击步枪', icon: 'AR', totalProfit: 35773, hourlyProfit: 1490, change: -0.7, positive: false },
        { id: 'sr3m', name: 'SR-3M紧凑突击步枪', icon: 'AR', totalProfit: 34158, hourlyProfit: 711, change: -4.1, positive: false },
        { id: 'sks', name: 'SKS射手步枪', icon: 'DMR', totalProfit: 32794, hourlyProfit: 1024, change: -0.5, positive: false },
        { id: 'akm', name: 'AKM突击步枪', icon: 'AR', totalProfit: 20808, hourlyProfit: 867, change: -8.0, positive: false },
        { id: 'psg1', name: 'PSG-1射手步枪', icon: 'DMR', totalProfit: 19007, hourlyProfit: 1187, change: -0.9, positive: false }
    ],
    work: [
        { id: 'pmag', name: 'PMAG D-60弹鼓', icon: 'MAG', totalProfit: 38240, hourlyProfit: 1912, change: 6.8, positive: true },
        { id: 'zenit', name: 'Zenit PT-1枪托', icon: 'STK', totalProfit: 31920, hourlyProfit: 1596, change: 2.4, positive: true },
        { id: 'rk3', name: 'RK-3后握把', icon: 'GRP', totalProfit: 24560, hourlyProfit: 982, change: -1.2, positive: false },
        { id: 'rail', name: '战术导轨组', icon: 'MOD', totalProfit: 19880, hourlyProfit: 828, change: 0.8, positive: true }
    ],
    med: [
        { id: 'medkit', name: '军用急救包', icon: 'MED', totalProfit: 26840, hourlyProfit: 1342, change: 8.5, positive: true },
        { id: 'adrenaline', name: '肾上腺素注射器', icon: 'MED', totalProfit: 21690, hourlyProfit: 1446, change: 4.2, positive: true },
        { id: 'painkiller', name: '高级止痛药', icon: 'PILL', totalProfit: 17520, hourlyProfit: 876, change: -2.1, positive: false },
        { id: 'suture', name: '野战手术包', icon: 'KIT', totalProfit: 14360, hourlyProfit: 718, change: 1.1, positive: true }
    ],
    armor: [
        { id: 'plate6', name: '6级防弹插板', icon: 'ARM', totalProfit: 46320, hourlyProfit: 2316, change: 9.4, positive: true },
        { id: 'opscore', name: 'Ops-Core头盔', icon: 'HEL', totalProfit: 33800, hourlyProfit: 1690, change: 3.7, positive: true },
        { id: 'thorax', name: 'THORAX背心', icon: 'VST', totalProfit: 28760, hourlyProfit: 1198, change: -0.8, positive: false },
        { id: 'rig', name: 'DAR突击手胸挂', icon: 'RIG', totalProfit: 22420, hourlyProfit: 934, change: 2.6, positive: true }
    ]
};

let currentCraftTab = 'tech';
let currentCraftSort = 'totalProfit';
const selectedCraftIds = new Set();

function formatCraftNumber(value) {
    return Number(value || 0).toLocaleString();
}

function getAllCraftItems() {
    return Object.values(craftData).flat();
}

function getSortedCraftItems(tabType = currentCraftTab) {
    const items = craftData[tabType] || [];
    return [...items].sort((a, b) => {
        if (currentCraftSort === 'change') return b.change - a.change;
        if (currentCraftSort === 'hourlyProfit') return b.hourlyProfit - a.hourlyProfit;
        return b.totalProfit - a.totalProfit;
    });
}

function renderCraftProductList() {
    const container = document.getElementById('craft-product-list-desktop');
    if (!container) return;
    const items = getSortedCraftItems();
    container.innerHTML = items.map(item => {
        const checked = selectedCraftIds.has(item.id);
        return `
            <div class="craft-product-row-desktop">
                <div class="craft-product-name-cell"><span class="craft-product-image-desktop">${item.icon}</span><span>${item.name}</span></div>
                <div>🪙 ${formatCraftNumber(item.totalProfit)}</div>
                <div>🪙 ${formatCraftNumber(item.hourlyProfit)}</div>
                <div class="craft-product-change-desktop ${item.positive ? 'positive' : 'negative'}">${item.change > 0 ? '+' : ''}${item.change.toFixed(1)}% ${item.positive ? '↑' : '↓'}</div>
                <button class="craft-product-toggle-desktop ${checked ? 'active' : ''}" type="button" data-id="${item.id}" aria-label="自选"></button>
            </div>`;
    }).join('');
    container.querySelectorAll('.craft-product-toggle-desktop').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (selectedCraftIds.has(id)) selectedCraftIds.delete(id);
            else selectedCraftIds.add(id);
            renderCraftProductList();
            renderCraftSelectedDesktop();
        });
    });
}

function renderCraftSelectedDesktop() {
    const container = document.getElementById('craft-selected-desktop-list');
    if (!container) return;
    const selectedItems = getAllCraftItems().filter(item => selectedCraftIds.has(item.id));
    const items = selectedItems.length ? selectedItems : [craftData.tech[0], craftData.work[0], craftData.med[0], craftData.armor[0]];
    container.innerHTML = items.map(item => `
        <div class="best-recommend-item selected-craft-item-desktop">
            <div class="recommend-station-header"><span class="recommend-station-icon">${item.icon}</span><span class="recommend-station-name">自选产物</span></div>
            <div class="recommend-item-preview gray"></div>
            <div class="recommend-item-name">${item.name}</div>
            <div class="recommend-item-profit"><span class="profit-icon">💰</span><span class="profit-value">${formatCraftNumber(item.hourlyProfit)}/h</span></div>
        </div>`).join('');
}

function renderCraftRecommendDashboard() {
    renderCraftProductList();
    renderCraftSelectedDesktop();
}

function bindCraftRecommendDashboardEvents() {
    document.querySelectorAll('#craft-dept-tabs-desktop .craft-dept-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#craft-dept-tabs-desktop .craft-dept-tab').forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            currentCraftTab = tab.dataset.craft || 'tech';
            renderCraftRecommendDashboard();
        });
    });
    const sortSelect = document.getElementById('craft-sort-select-desktop');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentCraftSort = sortSelect.value || 'totalProfit';
            renderCraftProductList();
        });
    }
    renderCraftRecommendDashboard();
}

bindCraftRecommendDashboardEvents();

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

// ============================================
// 特勤处制造 - 忙碌工作台 Hover 浮窗
// ============================================
const stationWorkingData = {
    armor: {
        itemName: 'DAR突击手胸挂',
        itemIcon: '🎽',
        stationIcon: '🛡️',
        stationName: '防具台',
        sellPrice: 125000,
        craftCost: 78500,
        fee: 6250,
        deposit: 12500,
        totalTime: '08:45:00',
        totalProfit: 27750,
        hourlyProfit: 3171,
        materials: [
            { name: '凯夫拉纤维', icon: '📦', unitPrice: 32000, totalPrice: 64000, count: 2 },
            { name: '钛合金板', icon: '🔩', unitPrice: 18500, totalPrice: 18500, count: 1 },
            { name: '尼龙织带', icon: '🧵', unitPrice: 8500, totalPrice: 25500, count: 3 },
            { name: '防弹陶瓷片', icon: '🧱', unitPrice: 19500, totalPrice: 19500, count: 1 }
        ]
    }
};

function initStationTooltip() {
    document.querySelectorAll('.craft-station-item.working').forEach(station => {
        station.addEventListener('mouseenter', function() {
            const stationType = this.dataset.station;
            showStationTooltip(this, stationType);
        });
        station.addEventListener('mouseleave', function() {
            hideStationTooltip();
        });
    });
}

function showStationTooltip(el, stationType) {
    const tooltip = document.getElementById('craft-station-tooltip');
    if (!tooltip) return;
    const data = stationWorkingData[stationType];
    if (!data) return;

    tooltip.innerHTML = `
        <div class="station-tooltip-header">
            <span class="station-tooltip-icon">${data.stationIcon}</span>
            <span class="station-tooltip-title">${data.stationName} - 制造中</span>
        </div>
        <div class="station-tooltip-body">
            <div class="station-tooltip-item-section">
                <div class="station-tooltip-item-image">${data.itemIcon}</div>
                <div class="station-tooltip-item-info">
                    <div class="station-tooltip-profit-formula">
                        <div class="station-tooltip-profit-row">
                            <span class="station-tooltip-row-label">出售总价</span>
                            <span class="station-tooltip-row-value"><span class="station-tooltip-coin">💰</span>${data.sellPrice.toLocaleString()}</span>
                        </div>
                        <div class="station-tooltip-profit-row">
                            <span class="station-tooltip-row-label">制造成本</span>
                            <span class="station-tooltip-row-value"><span class="station-tooltip-coin">💰</span>${data.craftCost.toLocaleString()}</span>
                        </div>
                        <div class="station-tooltip-profit-row">
                            <span class="station-tooltip-row-label">手续费</span>
                            <span class="station-tooltip-row-value"><span class="station-tooltip-coin">💰</span>${data.fee.toLocaleString()}</span>
                        </div>
                        <div class="station-tooltip-profit-row">
                            <span class="station-tooltip-row-label">保证金</span>
                            <span class="station-tooltip-row-value"><span class="station-tooltip-coin">💰</span>${data.deposit.toLocaleString()}</span>
                        </div>
                        <div class="station-tooltip-profit-row">
                            <span class="station-tooltip-row-label">总耗时</span>
                            <span class="station-tooltip-row-value">🕐 ${data.totalTime}</span>
                        </div>
                        <div class="station-tooltip-profit-row total">
                            <span class="station-tooltip-row-label">总收益</span>
                            <span class="station-tooltip-row-value"><span class="station-tooltip-coin">💰</span>+${data.totalProfit.toLocaleString()}</span>
                        </div>
                        <div class="station-tooltip-profit-row hourly">
                            <span class="station-tooltip-row-label">每小时收益</span>
                            <span class="station-tooltip-row-value"><span class="station-tooltip-coin">💰</span>${data.hourlyProfit.toLocaleString()}/h</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="station-tooltip-item-name">${data.itemName}</div>

            <div class="station-tooltip-materials-section">
                <div class="station-tooltip-materials-title">制造所需材料</div>
                <div class="station-tooltip-material-list">
                    ${data.materials.map(m => `
                        <div class="station-tooltip-material-item">
                            <div class="station-tooltip-material-icon">${m.icon}</div>
                            <div class="station-tooltip-material-info">
                                <div class="station-tooltip-material-name">${m.name} ×${m.count}</div>
                                <div class="station-tooltip-material-prices">
                                    <span>单价：<span class="station-tooltip-coin">💰</span>${m.unitPrice.toLocaleString()}</span>
                                    <span>总价：<span class="station-tooltip-coin">💰</span>${m.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    positionStationTooltip(el, tooltip);
    tooltip.classList.add('active');

}

function hideStationTooltip() {
    const tooltip = document.getElementById('craft-station-tooltip');
    if (tooltip) tooltip.classList.remove('active');
}

function positionStationTooltip(el, tooltip) {
    const rect = el.getBoundingClientRect();
    const tw = 360;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 20;

    // 水平定位
    let left = rect.right + 12;
    if (left + tw > vw - margin) {
        left = rect.left - tw - 12;
    }
    if (left < margin) {
        left = Math.max(margin, rect.left + rect.width / 2 - tw / 2);
    }

    // 先临时显示以测量实际高度
    tooltip.style.left = left + 'px';
    tooltip.style.top = '0px';
    tooltip.style.maxHeight = (vh - margin * 2) + 'px';
    tooltip.style.visibility = 'hidden';
    tooltip.classList.add('active');
    const th = tooltip.offsetHeight;
    tooltip.classList.remove('active');
    tooltip.style.visibility = '';

    // 垂直定位：优先顶部对齐，空间不足则底部对齐
    let top = rect.top;
    const spaceBelow = vh - rect.top - margin;
    const spaceAbove = rect.bottom - margin;

    if (th <= spaceBelow) {
        // 向下空间足够，顶部对齐
        top = rect.top;
    } else if (th <= spaceAbove) {
        // 向上空间足够，底部对齐
        top = rect.bottom - th;
    } else {
        // 两边都不够，取空间大的一侧并限制高度
        if (spaceBelow >= spaceAbove) {
            top = rect.top;
        } else {
            top = margin;
        }
    }

    // 确保不超出视口
    if (top < margin) top = margin;
    const maxH = vh - top - margin;

    tooltip.style.top = top + 'px';
    tooltip.style.maxHeight = maxH + 'px';
}

// 页面加载后绘制图表
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        updateCraftItems('tech');
        drawCraftPriceChart('tech', 0);
        // 初始化交易物价模块
        initMarketPrice();
        // 初始化特勤处工作台hover浮窗
        initStationTooltip();
    }, 100);
});

// 窗口大小变化时重绘
window.addEventListener('resize', function() {
    drawCraftPriceChart(currentCraftTab, 0);
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

/* ============================================
   出红记录弹窗
   ============================================ */

// 记录数据
const recordData = [
    { name: '呼吸机', icon: '🐱', value: 439468, time: '2025-10-16', location: '零号大坝-常规' },
    { name: '棘龙爪化石', icon: '🦴', value: 341618, time: '2025-12-16', location: '零号大坝-常规' },
    { name: '赛伊德的怀表', icon: '⌚', value: 211760, time: '2025-12-16', location: '零号大坝-机密' },
    { name: '动力电池组', icon: '🔋', value: 3242918, time: '2025-12-18', location: '零号大坝-机密' },
    { name: '万足金条', icon: '🥇', value: 326040, time: '2025-12-21', location: '零号大坝-机密' },
    { name: '名贵机械表', icon: '⌚', value: 207181, time: '2025-12-21', location: '零号大坝-机密' },
    { name: '量子芯片', icon: '💎', value: 512300, time: '2025-12-25', location: '长弓溪谷-机密' },
    { name: '钛合金框架', icon: '🔩', value: 189500, time: '2026-01-05', location: '巴克什-常规' }
];

let currentFilters = {
    name: '',
    location: '',
    valueSort: 'none',
    timeSort: 'none'
};

// 初始化出红记录弹窗
function initRecordModal() {
    const recordModalOverlay = document.getElementById('record-modal-overlay');
    const recordModalClose = document.getElementById('record-modal-close');
    const recordBtn = document.querySelector('.collection-action-btn');
    
    // 点击"出红记录"按钮打开弹窗
    if (recordBtn) {
        recordBtn.addEventListener('click', () => {
            recordModalOverlay.classList.add('active');
            renderRecordList();
        });
    }
    
    // 关闭弹窗
    if (recordModalClose) {
        recordModalClose.addEventListener('click', () => {
            recordModalOverlay.classList.remove('active');
        });
    }
    
    // 点击遮罩层关闭
    if (recordModalOverlay) {
        recordModalOverlay.addEventListener('click', (e) => {
            if (e.target === recordModalOverlay) {
                recordModalOverlay.classList.remove('active');
            }
        });
    }
    
    // 初始化筛选器
    initRecordFilters();
}

// 初始化筛选器
function initRecordFilters() {
    // 藏品名称下拉
    const nameDropdown = document.getElementById('filter-name-dropdown');
    const nameBtn = document.getElementById('filter-name-btn');
    const nameMenu = document.getElementById('filter-name-menu');
    
    if (nameBtn) {
        nameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nameDropdown.classList.toggle('open');
            // 关闭其他下拉
            document.getElementById('filter-location-dropdown')?.classList.remove('open');
        });
    }
    
    if (nameMenu) {
        nameMenu.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                currentFilters.name = value;
                
                // 更新选中状态
                nameMenu.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // 更新按钮文字
                nameBtn.querySelector('.filter-label').textContent = value || '藏品名称';
                nameBtn.classList.toggle('active', !!value);
                
                nameDropdown.classList.remove('open');
                renderRecordList();
            });
        });
    }
    
    // 解锁地点下拉
    const locationDropdown = document.getElementById('filter-location-dropdown');
    const locationBtn = document.getElementById('filter-location-btn');
    const locationMenu = document.getElementById('filter-location-menu');
    
    if (locationBtn) {
        locationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            locationDropdown.classList.toggle('open');
            // 关闭其他下拉
            document.getElementById('filter-name-dropdown')?.classList.remove('open');
        });
    }
    
    if (locationMenu) {
        locationMenu.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                currentFilters.location = value;
                
                // 更新选中状态
                locationMenu.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // 更新按钮文字
                locationBtn.querySelector('.filter-label').textContent = value || '解锁地点';
                locationBtn.classList.toggle('active', !!value);
                
                locationDropdown.classList.remove('open');
                renderRecordList();
            });
        });
    }
    
    // 价值排序
    const valueBtn = document.getElementById('filter-value-btn');
    if (valueBtn) {
        valueBtn.addEventListener('click', () => {
            const currentSort = currentFilters.valueSort;
            if (currentSort === 'none') {
                currentFilters.valueSort = 'desc';
            } else if (currentSort === 'desc') {
                currentFilters.valueSort = 'asc';
            } else {
                currentFilters.valueSort = 'none';
            }
            // 重置时间排序
            currentFilters.timeSort = 'none';
            updateSortButtons();
            renderRecordList();
        });
    }
    
    // 解锁时间排序
    const timeBtn = document.getElementById('filter-time-btn');
    if (timeBtn) {
        timeBtn.addEventListener('click', () => {
            const currentSort = currentFilters.timeSort;
            if (currentSort === 'none') {
                currentFilters.timeSort = 'desc';
            } else if (currentSort === 'desc') {
                currentFilters.timeSort = 'asc';
            } else {
                currentFilters.timeSort = 'none';
            }
            // 重置价值排序
            currentFilters.valueSort = 'none';
            updateSortButtons();
            renderRecordList();
        });
    }
    
    // 点击其他地方关闭下拉
    document.addEventListener('click', () => {
        document.getElementById('filter-name-dropdown')?.classList.remove('open');
        document.getElementById('filter-location-dropdown')?.classList.remove('open');
    });
}

// 更新排序按钮状态
function updateSortButtons() {
    const valueBtn = document.getElementById('filter-value-btn');
    const timeBtn = document.getElementById('filter-time-btn');
    
    if (valueBtn) {
        valueBtn.dataset.sort = currentFilters.valueSort;
        const icon = valueBtn.querySelector('.sort-icon');
        if (currentFilters.valueSort === 'asc') {
            icon.textContent = '↑';
            valueBtn.classList.add('active');
        } else if (currentFilters.valueSort === 'desc') {
            icon.textContent = '↓';
            valueBtn.classList.add('active');
        } else {
            icon.textContent = '⇅';
            valueBtn.classList.remove('active');
        }
    }
    
    if (timeBtn) {
        timeBtn.dataset.sort = currentFilters.timeSort;
        const icon = timeBtn.querySelector('.sort-icon');
        if (currentFilters.timeSort === 'asc') {
            icon.textContent = '↑';
            timeBtn.classList.add('active');
        } else if (currentFilters.timeSort === 'desc') {
            icon.textContent = '↓';
            timeBtn.classList.add('active');
        } else {
            icon.textContent = '⇅';
            timeBtn.classList.remove('active');
        }
    }
}

// 渲染记录列表
function renderRecordList() {
    const recordList = document.getElementById('record-list');
    if (!recordList) return;
    
    // 筛选数据
    let filteredData = recordData.filter(item => {
        if (currentFilters.name && item.name !== currentFilters.name) return false;
        if (currentFilters.location && item.location !== currentFilters.location) return false;
        return true;
    });
    
    // 排序数据
    if (currentFilters.valueSort !== 'none') {
        filteredData.sort((a, b) => {
            return currentFilters.valueSort === 'asc' ? a.value - b.value : b.value - a.value;
        });
    } else if (currentFilters.timeSort !== 'none') {
        filteredData.sort((a, b) => {
            const timeA = new Date(a.time).getTime();
            const timeB = new Date(b.time).getTime();
            return currentFilters.timeSort === 'asc' ? timeA - timeB : timeB - timeA;
        });
    }
    
    // 渲染HTML
    recordList.innerHTML = filteredData.map(item => `
        <div class="record-item">
            <div class="record-item-image">
                <div class="record-image-placeholder">${item.icon}</div>
            </div>
            <div class="record-item-name">${item.name}</div>
            <div class="record-item-value">
                <span class="value-icon">💰</span>
                <span class="value-num">${item.value.toLocaleString()}</span>
            </div>
            <div class="record-item-time">${item.time}</div>
            <div class="record-item-location">${item.location}</div>
        </div>
    `).join('');
    
    // 如果没有数据
    if (filteredData.length === 0) {
        recordList.innerHTML = '<div class="record-empty">暂无符合条件的记录</div>';
    }
}

// 在DOMContentLoaded中初始化
document.addEventListener('DOMContentLoaded', () => {
    initRecordModal();
    initPosterModal();
    initRedDetailModal();
    initAssetCalendarModal();
});

// 初始化资产周历弹窗
function initAssetCalendarModal() {
    const overlay = document.getElementById('asset-calendar-modal-overlay');
    const closeBtn = document.getElementById('asset-calendar-modal-close');
    const entryBtns = document.querySelectorAll('.asset-calendar-entry-pc');
    if (!overlay || !entryBtns.length) return;

    const openModal = () => overlay.classList.add('active');
    const closeModal = () => overlay.classList.remove('active');

    entryBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal();
    });
}

// 初始化已解锁大红详情弹窗
function initRedDetailModal() {
    const overlay = document.getElementById('red-detail-modal-overlay');
    const closeBtn = document.getElementById('red-detail-close');
    const collectionGrid = document.querySelector('.collection-grid-mini');
    if (!overlay || !collectionGrid) return;

    const redDetailData = {
        '炫彩拉小宅': { icon: '🐱', date: '2026-02-14', location: '零号大坝-常规' },
        '复苏呼吸机': { icon: '🫁', date: '2026-02-12', location: '零号大坝-机密' },
        '动力电池组': { icon: '🔋', date: '2026-02-10', location: '航天基地-机密' },
        '金块': { icon: '🪙', date: '2026-02-09', location: '巴克什-常规' },
        '加密U盘': { icon: '💾', date: '2026-02-08', location: '长弓溪谷-机密' },
        '铱星电话': { icon: '📱', date: '2026-02-07', location: '航天基地-常规' }
    };

    function openModal(name) {
        const data = redDetailData[name] || { icon: '▣', date: '2026-02-14', location: '零号大坝-常规' };
        document.getElementById('red-detail-title').textContent = name;
        document.getElementById('red-detail-item-art').textContent = data.icon;
        document.getElementById('red-detail-date').textContent = data.date;
        document.getElementById('red-detail-location').textContent = data.location;
        document.getElementById('red-detail-record-time').textContent = data.date;
        document.getElementById('red-detail-record-location').textContent = data.location;
        overlay.classList.add('active');
    }

    function closeModal() {
        overlay.classList.remove('active');
    }

    collectionGrid.addEventListener('click', (event) => {
        const item = event.target.closest('.collection-item-mini');
        if (!item) return;
        const name = item.querySelector('.collection-name-mini')?.textContent?.trim();
        if (name) openModal(name);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeModal();
    });
}

/* ============================================
   生成海报弹窗
   ============================================ */

// 初始化海报弹窗
function initPosterModal() {
    const posterModalOverlay = document.getElementById('poster-modal-overlay');
    const posterModalClose = document.getElementById('poster-modal-close');
    
    // 获取"生成海报"按钮（第二个按钮）
    const posterBtn = document.querySelectorAll('.collection-action-btn')[1];
    
    // 点击"生成海报"按钮打开弹窗
    if (posterBtn) {
        posterBtn.addEventListener('click', () => {
            posterModalOverlay.classList.add('active');
        });
    }
    
    // 关闭弹窗
    if (posterModalClose) {
        posterModalClose.addEventListener('click', () => {
            posterModalOverlay.classList.remove('active');
        });
    }
    
    // 点击遮罩层关闭
    if (posterModalOverlay) {
        posterModalOverlay.addEventListener('click', (e) => {
            if (e.target === posterModalOverlay) {
                posterModalOverlay.classList.remove('active');
            }
        });
    }
    
    // 初始化分享按钮
    initPosterShareButtons();
}

// 初始化海报分享按钮
function initPosterShareButtons() {
    // 保存图片
    const saveBtn = document.getElementById('poster-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            showToast('海报保存功能开发中...');
            // 实际项目中可以使用 html2canvas 等库来实现截图保存
        });
    }
    
    // 分享到 X (Twitter)
    const xBtn = document.getElementById('poster-x-btn');
    if (xBtn) {
        xBtn.addEventListener('click', () => {
            const text = encodeURIComponent('我在 Delta Force 的大红藏馆收集了 67 种大红！🏆 #DeltaForce #Gaming');
            const url = encodeURIComponent(window.location.href);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
        });
    }
    
    // 分享到 Facebook
    const facebookBtn = document.getElementById('poster-facebook-btn');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        });
    }
    
    // 分享到 Reddit
    const redditBtn = document.getElementById('poster-reddit-btn');
    if (redditBtn) {
        redditBtn.addEventListener('click', () => {
            const title = encodeURIComponent('My Delta Force Collection Progress - 67 Legendary Items!');
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank', 'width=600,height=600');
        });
    }
}

/* ============================================
   日报分享海报弹窗
   ============================================ */
// 初始化日报分享弹窗
function initDailyPosterModal() {
    const dailyPosterModalOverlay = document.getElementById('daily-poster-modal-overlay');
    const dailyPosterModalClose = document.getElementById('daily-poster-modal-close');
    const dailyShareBtn = document.getElementById('daily-share-btn');
    
    // 点击分享按钮打开弹窗
    if (dailyShareBtn) {
        dailyShareBtn.addEventListener('click', () => {
            if (dailyPosterModalOverlay) {
                // 根据当前tab更新模式名称和内容
                const activeTab = document.querySelector('.report-tabs .tab-btn.active');
                const posterModeLabel = document.getElementById('poster-mode-label');
                const posterFenguoData = document.getElementById('poster-fenguo-data');
                const posterZhanchangData = document.getElementById('poster-zhanchang-data');
                if (activeTab) {
                    const tabType = activeTab.dataset.tab;
                    if (posterModeLabel) {
                        posterModeLabel.textContent = tabType === 'fenguo' ? '烽火地带' : '全面战场';
                    }
                    if (posterFenguoData && posterZhanchangData) {
                        if (tabType === 'fenguo') {
                            posterFenguoData.style.display = '';
                            posterZhanchangData.style.display = 'none';
                        } else {
                            posterFenguoData.style.display = 'none';
                            posterZhanchangData.style.display = '';
                        }
                    }
                }
                dailyPosterModalOverlay.classList.add('active');
            }
        });
    }
    
    // 关闭按钮
    if (dailyPosterModalClose) {
        dailyPosterModalClose.addEventListener('click', () => {
            if (dailyPosterModalOverlay) {
                dailyPosterModalOverlay.classList.remove('active');
            }
        });
    }
    
    // 点击遮罩关闭
    if (dailyPosterModalOverlay) {
        dailyPosterModalOverlay.addEventListener('click', (e) => {
            if (e.target === dailyPosterModalOverlay) {
                dailyPosterModalOverlay.classList.remove('active');
            }
        });
    }
    
    // 初始化分享按钮
    initDailyPosterShareButtons();
}

// 初始化日报海报分享按钮
function initDailyPosterShareButtons() {
    // 保存图片按钮
    const saveBtn = document.getElementById('daily-poster-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            showToast('海报保存功能开发中...');
        });
    }
    
    // 分享到 X
    const xBtn = document.getElementById('daily-poster-x-btn');
    if (xBtn) {
        xBtn.addEventListener('click', () => {
            const text = encodeURIComponent('Check out my Delta Force daily report! 🎮');
            const url = encodeURIComponent(window.location.href);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
        });
    }
    
    // 分享到 Discord（占位）
    const discordBtn = document.getElementById('daily-poster-discord-btn');
    if (discordBtn) {
        discordBtn.addEventListener('click', () => {
            showToast('Discord 分享功能开发中...');
        });
    }
    
    // 分享到 Facebook
    const facebookBtn = document.getElementById('daily-poster-facebook-btn');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
        });
    }
    
    // 分享到 Reddit
    const redditBtn = document.getElementById('daily-poster-reddit-btn');
    if (redditBtn) {
        redditBtn.addEventListener('click', () => {
            const title = encodeURIComponent('My Delta Force Daily Report - Amazing stats!');
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank', 'width=600,height=600');
        });
    }
}

// 显示 Toast 提示
function showToast(message) {
    // 检查是否已有 toast
    let toast = document.querySelector('.toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

/* ============================================
   桌面端登录系统
   ============================================ */
function initDesktopLoginSystem() {
    const loginBtn = document.getElementById('desktop-login-btn');
    const overlay = document.getElementById('desktop-login-overlay');
    const closeBtn = document.getElementById('desktop-login-close');
    const submitBtn = document.getElementById('desktop-submit-btn');
    const socialBtns = document.querySelectorAll('.desktop-login-body .social-btn');
    const passwordLink = document.querySelector('.desktop-password-link');
    const getCodeBtn = document.querySelector('.desktop-get-code-btn');
    
    // 检查 localStorage 登录状态
    checkDesktopLoginState();
    
    // 用户下拉菜单
    const userInfo = document.getElementById('desktop-user-info');
    const userDropdown = document.getElementById('desktop-user-dropdown');
    const dropdownFeedback = document.getElementById('desktop-dropdown-feedback');
    const dropdownLogout = document.getElementById('desktop-dropdown-logout');
    
    if (userInfo && userDropdown) {
        userInfo.addEventListener('click', (e) => {
            // 防止点击下拉菜单内部时冒泡关闭
            if (e.target.closest('.desktop-user-dropdown')) return;
            userInfo.classList.toggle('dropdown-open');
            userDropdown.classList.toggle('active');
        });
        
        // 点击页面其他区域关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!userInfo.contains(e.target)) {
                userInfo.classList.remove('dropdown-open');
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // 下拉菜单 - 意见反馈
    if (dropdownFeedback) {
        dropdownFeedback.addEventListener('click', () => {
            if (userInfo) userInfo.classList.remove('dropdown-open');
            if (userDropdown) userDropdown.classList.remove('active');
            const feedbackOverlay = document.getElementById('desktop-feedback-overlay');
            if (feedbackOverlay) feedbackOverlay.classList.add('active');
        });
    }
    
    // 下拉菜单 - 退出登录
    if (dropdownLogout) {
        dropdownLogout.addEventListener('click', () => {
            if (userInfo) userInfo.classList.remove('dropdown-open');
            if (userDropdown) userDropdown.classList.remove('active');
            desktopPerformLogout();
        });
    }
    
    // 登录方式选择弹窗
    const loginMethodOverlay = document.getElementById('desktop-login-method-overlay');
    const loginMethodClose = document.getElementById('desktop-login-method-close');
    const loginMethodLI = document.getElementById('desktop-login-method-li');
    const loginMethodGarena = document.getElementById('desktop-login-method-garena');

    // 打开登录弹窗 → 先打开方式选择弹窗
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginMethodOverlay) {
                loginMethodOverlay.classList.add('active');
            }
        });
    }

    // 关闭方式选择弹窗
    if (loginMethodClose) {
        loginMethodClose.addEventListener('click', () => {
            if (loginMethodOverlay) loginMethodOverlay.classList.remove('active');
        });
    }
    if (loginMethodOverlay) {
        loginMethodOverlay.addEventListener('click', (e) => {
            if (e.target === loginMethodOverlay) loginMethodOverlay.classList.remove('active');
        });
    }

    // 选择 Level Infinite → 关闭方式弹窗，打开原登录弹窗
    if (loginMethodLI) {
        loginMethodLI.addEventListener('click', () => {
            if (loginMethodOverlay) loginMethodOverlay.classList.remove('active');
            if (overlay) overlay.classList.add('active');
        });
    }

    // 选择 Garena → 直接完成登录
    if (loginMethodGarena) {
        loginMethodGarena.addEventListener('click', () => {
            if (loginMethodOverlay) loginMethodOverlay.classList.remove('active');
            desktopPerformLogin('player@garena.com', null, false);
        });
    }
    
    // 关闭登录弹窗
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    // 点击遮罩关闭
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    }
    
    // 邮箱+验证码登录（无头像）
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('desktop-email-input');
            const email = emailInput ? emailInput.value.trim() : '';
            desktopPerformLogin(email || 'user@example.com', null, false, 'email');
        });
    }
    
    // 获取验证码 - 同上
    if (getCodeBtn) {
        getCodeBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('desktop-email-input');
            const email = emailInput ? emailInput.value.trim() : '';
            desktopPerformLogin(email || 'user@example.com', null, false, 'email');
        });
    }
    
    // 密码登录 - 无头像
    if (passwordLink) {
        passwordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('desktop-email-input');
            const email = emailInput ? emailInput.value.trim() : '';
            desktopPerformLogin(email || 'user@example.com', null, false, 'email');
        });
    }
    
    // 社交登录
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.dataset.provider;
            if (provider === 'google') {
                // Google 登录 - 模拟有头像
                desktopPerformLogin('player@gmail.com', 'https://lh3.googleusercontent.com/a/default-user=s96-c', true, provider);
            } else {
                // 其他渠道 - 无头像
                const emails = {
                    facebook: 'player@facebook.com',
                    twitter: 'player@x.com',
                    line: 'player@line.me',
                    discord: 'player@discord.com'
                };
                desktopPerformLogin(emails[provider] || 'user@example.com', null, false, provider);
            }
        });
    });
}

function desktopPerformLogin(email, avatarUrl, hasAvatar, provider) {
    // Facebook 登录必定无游戏账号（方便测试），其他渠道正常登录
    const hasGameAccount = (provider === 'facebook') ? false : true;
    
    if (!hasGameAccount) {
        // 无游戏账号 → 弹出引导弹窗
        const overlay = document.getElementById('desktop-login-overlay');
        if (overlay) overlay.classList.remove('active');
        showDesktopNoAccountModal(email, avatarUrl, hasAvatar);
        return;
    }
    
    localStorage.setItem('df_login', JSON.stringify({
        email: email,
        avatar: avatarUrl,
        hasAvatar: hasAvatar,
        loggedIn: true
    }));
    updateDesktopLoginUI(email, avatarUrl, hasAvatar);
    updateGunCopyButtonsAuthState();
    
    // 关闭弹窗
    const overlay = document.getElementById('desktop-login-overlay');
    if (overlay) overlay.classList.remove('active');
}

function showDesktopNoAccountModal(email, avatarUrl, hasAvatar) {
    const overlay = document.getElementById('desktop-no-account-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    
    // 游客模式登录：保存登录状态并更新UI
    function guestLogin() {
        overlay.classList.remove('active');
        localStorage.setItem('df_login', JSON.stringify({
            email: email,
            avatar: avatarUrl,
            hasAvatar: hasAvatar,
            loggedIn: true
        }));
        updateDesktopLoginUI(email, avatarUrl, hasAvatar);
        updateGunCopyButtonsAuthState();
    }
    
    // 关闭按钮 → 游客模式登录
    const closeBtn = document.getElementById('desktop-no-account-close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            guestLogin();
        };
    }
    
    // 点击遮罩 → 游客模式登录
    overlay.onclick = function(e) {
        if (e.target === overlay) guestLogin();
    };
    
    // 切换账号
    const switchBtn = document.getElementById('desktop-no-account-switch');
    if (switchBtn) {
        switchBtn.onclick = function(e) {
            e.preventDefault();
            overlay.classList.remove('active');
            localStorage.removeItem('df_login');
            const methodOverlay = document.getElementById('desktop-login-method-overlay');
            if (methodOverlay) methodOverlay.classList.add('active');
        };
    }
    
    // 游客模式按钮
    const guestBtn = document.getElementById('desktop-no-account-guest');
    if (guestBtn) {
        guestBtn.onclick = function(e) {
            e.preventDefault();
            guestLogin();
        };
    }
}

function desktopPerformLogout() {
    localStorage.removeItem('df_login');
    const loginBtn = document.getElementById('desktop-login-btn');
    const userInfo = document.getElementById('desktop-user-info');
    if (loginBtn) loginBtn.style.display = '';
    if (userInfo) userInfo.style.display = 'none';
    updateGunCopyButtonsAuthState();
}

function checkDesktopLoginState() {
    const data = localStorage.getItem('df_login');
    if (data) {
        try {
            const info = JSON.parse(data);
            if (info.loggedIn) {
                updateDesktopLoginUI(info.email, info.avatar, info.hasAvatar);
            }
        } catch(e) {}
    }
}

function updateDesktopLoginUI(email, avatarUrl, hasAvatar) {
    const loginBtn = document.getElementById('desktop-login-btn');
    const userInfo = document.getElementById('desktop-user-info');
    const avatarImg = document.getElementById('desktop-user-avatar');
    const emailSpan = document.getElementById('desktop-user-email');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    
    if (avatarImg) {
        if (hasAvatar && avatarUrl) {
            avatarImg.src = avatarUrl;
            avatarImg.style.display = '';
        } else {
            avatarImg.style.display = 'none';
        }
    }
    
    if (emailSpan) {
        emailSpan.textContent = email || '';
    }
}

/* ============================================
   桌面端用户反馈系统
   ============================================ */
let desktopFeedbackImages = [];

document.addEventListener('DOMContentLoaded', function() {
    initDesktopFeedback();
});

function initDesktopFeedback() {
    const overlay = document.getElementById('desktop-feedback-overlay');
    const closeBtn = document.getElementById('desktop-feedback-close');
    const submitBtn = document.getElementById('desktop-feedback-submit');
    const imageInput = document.getElementById('desktop-feedback-image-input');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            Array.from(e.target.files).forEach(file => {
                if (desktopFeedbackImages.length >= 3) return;
                if (file.size > 5 * 1024 * 1024) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    desktopFeedbackImages.push(ev.target.result);
                    renderDesktopFeedbackImages();
                };
                reader.readAsDataURL(file);
            });
            imageInput.value = '';
        });
    }
    
    // textarea 粘贴图片支持
    const textarea = document.getElementById('desktop-feedback-textarea');
    if (textarea) {
        textarea.addEventListener('paste', (e) => {
            const items = e.clipboardData && e.clipboardData.items;
            if (!items) return;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    if (desktopFeedbackImages.length >= 3) return;
                    const file = items[i].getAsFile();
                    if (!file || file.size > 5 * 1024 * 1024) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        desktopFeedbackImages.push(ev.target.result);
                        renderDesktopFeedbackImages();
                    };
                    reader.readAsDataURL(file);
                    break;
                }
            }
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const txtArea = document.getElementById('desktop-feedback-textarea');
            const content = txtArea ? txtArea.value.trim() : '';
            if (!content) { alert('Please enter your feedback'); return; }
            
            const selectedType = document.querySelector('input[name="desktop-feedback-type"]:checked');
            const feedbackType = selectedType ? selectedType.value : 'tool';
            console.log('Desktop feedback submitted:', { type: feedbackType, content, images: desktopFeedbackImages.length });
            
            if (txtArea) txtArea.value = '';
            desktopFeedbackImages = [];
            renderDesktopFeedbackImages();
            
            if (overlay) overlay.classList.remove('active');
            showToast('Thank you for your feedback!');
        });
    }
}

function renderDesktopFeedbackImages() {
    const grid = document.getElementById('desktop-feedback-images-grid');
    const uploadLabel = document.getElementById('desktop-feedback-upload-label');
    if (!grid) return;
    
    grid.innerHTML = desktopFeedbackImages.map((src, idx) => 
        `<div class="feedback-image-preview">
            <img src="${src}" alt="feedback image">
            <button class="feedback-image-remove" data-idx="${idx}">&times;</button>
        </div>`
    ).join('');
    
    grid.querySelectorAll('.feedback-image-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            desktopFeedbackImages.splice(parseInt(btn.dataset.idx), 1);
            renderDesktopFeedbackImages();
        });
    });
    
    if (uploadLabel) {
        uploadLabel.style.display = desktopFeedbackImages.length >= 3 ? 'none' : '';
    }
}
