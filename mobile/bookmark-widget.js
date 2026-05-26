/**
 * Delta Force - 移动端角色挂件 & 添加到主屏幕
 * 自包含模块（样式 + DOM + 逻辑），无外部依赖。
 * 支持：
 *   - Chrome / Android（beforeinstallprompt 事件 -> PWA 安装）
 *   - iOS Safari（无 API，弹出图文引导）
 *   - 其他浏览器：通用引导弹窗
 */
(function () {
    'use strict';

    if (window.__dfMobileBookmarkMounted) return;
    window.__dfMobileBookmarkMounted = true;

    // ---------- 捕获 PWA 安装事件 ----------
    var deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredInstallPrompt = e;
    });

    // ---------- 设备检测 ----------
    var ua = navigator.userAgent || '';
    var isIOS = /iPhone|iPad|iPod/i.test(ua) && !window.MSStream;
    var isAndroid = /Android/i.test(ua);
    var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                       window.navigator.standalone === true;

    if (isStandalone) return; // 已添加到主屏，不再显示挂件

    // ---------- 注入样式 ----------
    var STYLE_ID = 'df-mobile-bookmark-style';
    if (!document.getElementById(STYLE_ID)) {
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.df-m-mascot{position:fixed;right:14px;bottom:calc(80px + env(safe-area-inset-bottom, 0px));z-index:880;display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none;}',
            '.df-m-tip{pointer-events:auto;background:rgba(6,18,20,0.94);border:1px solid #00d4aa;color:#fff;font-size:11px;line-height:1.35;padding:5px 9px;letter-spacing:.3px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.4);position:relative;}',
            '.df-m-tip::after{content:"";position:absolute;right:14px;bottom:-5px;width:8px;height:8px;background:rgba(6,18,20,0.94);border-right:1px solid #00d4aa;border-bottom:1px solid #00d4aa;transform:rotate(45deg);}',
            '.df-m-btn{pointer-events:auto;width:62px;height:74px;background:linear-gradient(160deg,rgba(0,212,170,.2),rgba(6,18,20,.95));border:1px solid #00d4aa;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.45);animation:dfMFloat 3.6s ease-in-out infinite;padding:0;}',
            '.df-m-btn::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(36,244,178,.22),transparent 55%);}',
            '.df-m-figure{font-size:34px;line-height:1;filter:drop-shadow(0 0 8px rgba(0,212,170,.55));}',
            '.df-m-badge{position:absolute;top:4px;left:4px;background:linear-gradient(135deg,#ffd700,#ffaa00);color:#1a1a1a;font-family:Orbitron,monospace;font-size:8px;font-weight:700;letter-spacing:.4px;padding:1px 4px;line-height:1.4;}',
            '.df-m-label{position:absolute;bottom:3px;left:0;right:0;text-align:center;font-family:Orbitron,monospace;font-size:7px;letter-spacing:1px;color:#00d4aa;}',
            '@keyframes dfMFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
            /* sheet 弹窗 */
            '.df-m-sheet-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:1200;display:none;align-items:flex-end;justify-content:center;}',
            '.df-m-sheet-overlay.active{display:flex;}',
            '.df-m-sheet{width:100%;max-width:520px;background:#0a1a1c;border-top:1px solid #00d4aa;color:#fff;padding-bottom:env(safe-area-inset-bottom,0px);animation:dfMSheetIn .28s ease-out both;}',
            '@keyframes dfMSheetIn{from{transform:translateY(100%)}to{transform:translateY(0)}}',
            '.df-m-sheet-header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(0,212,170,.25);}',
            '.df-m-sheet-title{font-size:14px;font-weight:700;letter-spacing:1px;color:#fff;}',
            '.df-m-sheet-close{cursor:pointer;color:rgba(255,255,255,.6);font-size:18px;padding:2px 8px;}',
            '.df-m-sheet-body{padding:16px 18px 8px;font-size:13px;line-height:1.65;color:rgba(255,255,255,.85);}',
            '.df-m-step{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;}',
            '.df-m-step-num{flex-shrink:0;width:22px;height:22px;background:#00d4aa;color:#031816;font-family:Orbitron,monospace;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;}',
            '.df-m-step-text{flex:1;}',
            '.df-m-icon-inline{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;background:rgba(0,212,170,.12);border:1px solid rgba(0,212,170,.4);margin:0 3px;vertical-align:middle;font-size:14px;color:#24f4b2;}',
            '.df-m-sheet-actions{display:flex;justify-content:flex-end;gap:10px;padding:6px 18px 16px;}',
            '.df-m-btn-primary{background:#00d4aa;color:#031816;border:0;padding:9px 20px;font-weight:700;letter-spacing:1.5px;cursor:pointer;font-family:Orbitron,monospace;font-size:12px;}',
            '.df-m-btn-primary:hover{background:#24f4b2;}',
            '.df-m-btn-ghost{background:transparent;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.2);padding:9px 18px;font-size:12px;letter-spacing:1px;cursor:pointer;}'
        ].join('\n');
        document.head.appendChild(style);
    }

    // ---------- DOM ----------
    function buildWidget() {
        if (document.querySelector('.df-m-mascot')) return;

        var wrap = document.createElement('div');
        wrap.className = 'df-m-mascot';
        wrap.innerHTML =
            '<div class="df-m-tip" id="df-m-tip">添加到桌面，一键打开 ⭐</div>' +
            '<button class="df-m-btn" id="df-m-btn" type="button" aria-label="添加到桌面">' +
                '<span class="df-m-badge">DF</span>' +
                '<span class="df-m-figure" aria-hidden="true">🪖</span>' +
                '<span class="df-m-label">ADD</span>' +
            '</button>';
        document.body.appendChild(wrap);

        var overlay = document.createElement('div');
        overlay.className = 'df-m-sheet-overlay';
        overlay.id = 'df-m-sheet-overlay';
        document.body.appendChild(overlay);

        // 自动隐藏气泡
        var tipEl = wrap.querySelector('#df-m-tip');
        var tipHidden = false;
        function hideTip() {
            if (tipHidden || !tipEl) return;
            tipHidden = true;
            tipEl.style.transition = 'opacity .3s';
            tipEl.style.opacity = '0';
            setTimeout(function () { if (tipEl && tipEl.parentNode) tipEl.parentNode.removeChild(tipEl); }, 350);
        }
        setTimeout(hideTip, 7000);

        function closeSheet() { overlay.classList.remove('active'); }
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeSheet();
        });

        function renderSheet(html) {
            overlay.innerHTML = '<div class="df-m-sheet">' + html + '</div>';
            // 重新绑定关闭
            var c = overlay.querySelector('.df-m-sheet-close');
            if (c) c.addEventListener('click', closeSheet);
            var ghost = overlay.querySelector('[data-action="cancel"]');
            if (ghost) ghost.addEventListener('click', closeSheet);
            var ok = overlay.querySelector('[data-action="ok"]');
            if (ok) ok.addEventListener('click', closeSheet);
            var inst = overlay.querySelector('[data-action="install"]');
            if (inst) inst.addEventListener('click', triggerInstall);
        }

        function triggerInstall() {
            if (!deferredInstallPrompt) {
                showFallback();
                return;
            }
            deferredInstallPrompt.prompt();
            deferredInstallPrompt.userChoice.then(function () {
                deferredInstallPrompt = null;
                closeSheet();
            });
        }

        function showInstallable() {
            renderSheet(
                '<div class="df-m-sheet-header">' +
                    '<span class="df-m-sheet-title">⭐ 添加到主屏幕</span>' +
                    '<span class="df-m-sheet-close">✕</span>' +
                '</div>' +
                '<div class="df-m-sheet-body">' +
                    '将 Delta Force 工具站添加到桌面，下次一键直达，无需打开浏览器。' +
                '</div>' +
                '<div class="df-m-sheet-actions">' +
                    '<button class="df-m-btn-ghost" data-action="cancel" type="button">稍后</button>' +
                    '<button class="df-m-btn-primary" data-action="install" type="button">立即添加</button>' +
                '</div>'
            );
            overlay.classList.add('active');
        }

        function showIOSGuide() {
            renderSheet(
                '<div class="df-m-sheet-header">' +
                    '<span class="df-m-sheet-title">⭐ 添加到主屏幕</span>' +
                    '<span class="df-m-sheet-close">✕</span>' +
                '</div>' +
                '<div class="df-m-sheet-body">' +
                    '<div class="df-m-step">' +
                        '<span class="df-m-step-num">1</span>' +
                        '<span class="df-m-step-text">点击 Safari 底部的 <span class="df-m-icon-inline">⬆︎</span> 分享按钮</span>' +
                    '</div>' +
                    '<div class="df-m-step">' +
                        '<span class="df-m-step-num">2</span>' +
                        '<span class="df-m-step-text">在菜单中向下滑动，选择 <strong>「添加到主屏幕」</strong>（Add to Home Screen）</span>' +
                    '</div>' +
                    '<div class="df-m-step">' +
                        '<span class="df-m-step-num">3</span>' +
                        '<span class="df-m-step-text">点击右上角 <strong>「添加」</strong>，桌面即可看到 DF 图标</span>' +
                    '</div>' +
                '</div>' +
                '<div class="df-m-sheet-actions">' +
                    '<button class="df-m-btn-primary" data-action="ok" type="button">知道了</button>' +
                '</div>'
            );
            overlay.classList.add('active');
        }

        function showFallback() {
            // Android Chrome 没拿到 beforeinstallprompt：提示菜单路径
            renderSheet(
                '<div class="df-m-sheet-header">' +
                    '<span class="df-m-sheet-title">⭐ 添加到主屏幕</span>' +
                    '<span class="df-m-sheet-close">✕</span>' +
                '</div>' +
                '<div class="df-m-sheet-body">' +
                    '<div class="df-m-step">' +
                        '<span class="df-m-step-num">1</span>' +
                        '<span class="df-m-step-text">点击浏览器右上角 <span class="df-m-icon-inline">⋮</span> 菜单按钮</span>' +
                    '</div>' +
                    '<div class="df-m-step">' +
                        '<span class="df-m-step-num">2</span>' +
                        '<span class="df-m-step-text">选择 <strong>「添加到主屏幕」</strong> 或 <strong>「Add to Home screen」</strong></span>' +
                    '</div>' +
                    '<div class="df-m-step">' +
                        '<span class="df-m-step-num">3</span>' +
                        '<span class="df-m-step-text">确认后，桌面即可一键打开本站</span>' +
                    '</div>' +
                '</div>' +
                '<div class="df-m-sheet-actions">' +
                    '<button class="df-m-btn-primary" data-action="ok" type="button">知道了</button>' +
                '</div>'
            );
            overlay.classList.add('active');
        }

        // 点击挂件
        var btn = wrap.querySelector('#df-m-btn');
        btn.addEventListener('click', function () {
            hideTip();
            if (deferredInstallPrompt) {
                showInstallable();
            } else if (isIOS) {
                showIOSGuide();
            } else {
                showFallback();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();
