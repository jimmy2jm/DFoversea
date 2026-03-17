/**
 * i18n 国际化模块 - 移动端（精简版）
 * 纯粹依赖 JSON 文件，需通过 HTTP 服务器访问
 * 本地测试：npx serve 或 python -m http.server 8080
 */

const I18n = {
    // 当前语言
    currentLang: 'zh-CN',
    
    // 支持的语言列表（目前只启用中德两种）
    languages: [
        { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
        { code: 'de', name: 'Deutsch', nativeName: 'Deutsch' }
    ],
    
    // 语言包缓存
    translations: {},
    
    /**
     * 初始化 i18n
     */
    async init() {
        // 从 localStorage 读取用户上次选择的语言
        const savedLang = localStorage.getItem('df-language');
        if (savedLang && this.languages.some(l => l.code === savedLang)) {
            this.currentLang = savedLang;
        }
        
        // 加载当前语言包
        await this.loadLanguage(this.currentLang);
        
        // 创建语言选择器 UI
        this.createLanguageSelector();
        
        // 应用翻译
        this.applyTranslations();
    },
    
    /**
     * 加载语言包（通过 fetch）
     */
    async loadLanguage(langCode) {
        if (this.translations[langCode]) {
            return this.translations[langCode];
        }
        
        try {
            const response = await fetch(`locales/${langCode}.json`);
            if (response.ok) {
                this.translations[langCode] = await response.json();
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn(`[i18n] Failed to load ${langCode}.json:`, error.message);
            // 如果不是中文且加载失败，回退到中文
            if (langCode !== 'zh-CN') {
                return this.loadLanguage('zh-CN');
            }
        }
        
        return this.translations[langCode];
    },
    
    /**
     * 切换语言
     */
    async switchLanguage(langCode) {
        this.currentLang = langCode;
        localStorage.setItem('df-language', langCode);
        
        await this.loadLanguage(langCode);
        this.applyTranslations();
        this.updateSelectorDisplay();
    },
    
    /**
     * 获取翻译文本
     * @param {string} key - 翻译键，支持点号分隔，如 'nav.home'
     * @param {object} params - 替换参数，如 { num: 1 }
     */
    t(key, params = {}) {
        const translation = this.translations[this.currentLang];
        if (!translation) return key;
        
        // 按点号分割键，逐层获取值
        const keys = key.split('.');
        let value = translation;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // 未找到，返回原始 key
            }
        }
        
        // 替换参数 {{param}}
        if (typeof value === 'string') {
            return value.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
                return params[paramName] !== undefined ? params[paramName] : match;
            });
        }
        
        return value;
    },
    
    /**
     * 应用翻译到页面
     * 只处理带 data-i18n 属性的元素
     */
    applyTranslations() {
        // 处理带 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            
            // 检查是翻译 placeholder 还是文本内容
            if (el.hasAttribute('data-i18n-attr')) {
                const attr = el.getAttribute('data-i18n-attr');
                el.setAttribute(attr, text);
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
        
        // 更新页面标题
        const titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) {
            document.title = this.t(titleEl.getAttribute('data-i18n'));
        }
    },
    
    /**
     * 创建语言选择器 UI - 移动端样式
     */
    createLanguageSelector() {
        // 检查是否已存在
        const existingSelector = document.querySelector('.lang-selector');
        if (existingSelector) {
            // 如果已存在，只绑定事件并更新显示
            this.bindSelectorEvents(existingSelector);
            this.updateSelectorDisplay();
            return;
        }
        
        const header = document.querySelector('.header');
        if (!header) return;
        
        // 确保 header 是相对定位
        header.style.position = 'relative';
        
        // 创建语言选择器容器
        const selector = document.createElement('div');
        selector.className = 'lang-selector';
        
        // 当前语言显示
        const currentLangInfo = this.languages.find(l => l.code === this.currentLang) || this.languages[0];
        
        selector.innerHTML = `
            <button class="lang-selector-btn" title="切换语言">
                <svg class="lang-globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
                </svg>
            </button>
            <div class="lang-dropdown">
                ${this.languages.map(lang => `
                    <div class="lang-option ${lang.code === this.currentLang ? 'active' : ''}" data-lang="${lang.code}">
                        <span class="lang-option-name">${lang.nativeName}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // 添加到 header
        header.appendChild(selector);
        
        // 绑定事件
        this.bindSelectorEvents(selector);
    },
    
    /**
     * 绑定语言选择器事件
     */
    bindSelectorEvents(selector) {
        const btn = selector.querySelector('.lang-selector-btn');
        const options = selector.querySelectorAll('.lang-option');
        
        // 点击按钮显示/隐藏下拉菜单
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            selector.classList.toggle('open');
        });
        
        // 点击选项切换语言
        options.forEach(option => {
            option.addEventListener('click', () => {
                const langCode = option.getAttribute('data-lang');
                this.switchLanguage(langCode);
                selector.classList.remove('open');
                
                // 更新选中状态
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // 点击外部关闭下拉菜单
        document.addEventListener('click', () => {
            selector.classList.remove('open');
        });
    },
    
    /**
     * 更新选择器显示
     */
    updateSelectorDisplay() {
        // 地球图标无需更新内容，仅更新下拉选项的 active 状态
        const options = document.querySelectorAll('.lang-option');
        options.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === this.currentLang);
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});

// 导出供外部使用
window.I18n = I18n;
