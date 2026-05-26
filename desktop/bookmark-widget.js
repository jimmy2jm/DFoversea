/**
 * Delta Force - 角色挂件 & 添加书签
 * 自包含模块（样式 + DOM + 逻辑），无外部依赖。
 */
(function () {
    'use strict';

    if (window.__dfBookmarkWidgetMounted) return;
    window.__dfBookmarkWidgetMounted = true;

    // ---------- 注入样式 ----------
    var STYLE_ID = 'df-bookmark-widget-style';
    if (!document.getElementById(STYLE_ID)) {
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.df-mascot-widget{position:fixed;right:24px;bottom:96px;z-index:980;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none;}',
            '.df-mascot-tip{pointer-events:auto;background:rgba(6,18,20,0.92);border:1px solid #00d4aa;color:#fff;font-size:12px;line-height:1.4;padding:6px 10px;letter-spacing:.5px;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.35);position:relative;animation:dfMascotTipIn .35s ease-out both;}',
            '.df-mascot-tip::after{content:"";position:absolute;right:18px;bottom:-6px;width:10px;height:10px;background:rgba(6,18,20,0.92);border-right:1px solid #00d4aa;border-bottom:1px solid #00d4aa;transform:rotate(45deg);}',
            '.df-mascot-btn{pointer-events:auto;width:84px;height:96px;background:linear-gradient(160deg,rgba(0,212,170,.18),rgba(6,18,20,.95));border:1px solid #00d4aa;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;transition:transform .25s ease, box-shadow .25s ease;box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 0 rgba(0,212,170,.6);animation:dfMascotFloat 3.6s ease-in-out infinite;}',
            '.df-mascot-btn:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.55),0 0 0 4px rgba(0,212,170,.18);}',
            '.df-mascot-btn::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(36,244,178,.22),transparent 55%);pointer-events:none;}',
            '.df-mascot-figure{font-size:48px;line-height:1;filter:drop-shadow(0 0 10px rgba(0,212,170,.55));}',
            '.df-mascot-badge{position:absolute;top:6px;left:6px;background:linear-gradient(135deg,#ffd700,#ffaa00);color:#1a1a1a;font-family:Orbitron,monospace;font-size:9px;font-weight:700;letter-spacing:.5px;padding:1px 5px;line-height:1.4;}',
            '.df-mascot-label{position:absolute;bottom:4px;left:0;right:0;text-align:center;font-family:Orbitron,monospace;font-size:9px;letter-spacing:1.5px;color:#00d4aa;}',
            '@keyframes dfMascotFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
            '@keyframes dfMascotTipIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
            /* 弹窗 */
            '.df-bookmark-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:1100;display:none;align-items:center;justify-content:center;}',
            '.df-bookmark-overlay.active{display:flex;}',
            '.df-bookmark-modal{width:92%;max-width:420px;background:#0a1a1c;border:1px solid #00d4aa;color:#fff;animation:dfMascotTipIn .3s ease-out both;}',
            '.df-bookmark-header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(0,212,170,.25);}',
            '.df-bookmark-title{font-size:15px;font-weight:600;letter-spacing:1px;}',
            '.df-bookmark-close{cursor:pointer;color:rgba(255,255,255,.6);font-size:18px;padding:2px 8px;}',
            '.df-bookmark-close:hover{color:#fff;}',
            '.df-bookmark-body{padding:20px 22px;font-size:13.5px;line-height:1.7;color:rgba(255,255,255,.85);}',
            '.df-bookmark-keys{display:flex;align-items:center;justify-content:center;gap:10px;margin:16px 0 6px;font-family:Orbitron,monospace;}',
            '.df-bookmark-key{display:inline-flex;align-items:center;justify-content:center;min-width:46px;height:38px;padding:0 12px;background:rgba(0,212,170,.08);border:1px solid #00d4aa;color:#24f4b2;font-weight:700;font-size:14px;letter-spacing:1px;box-shadow:inset 0 -2px 0 rgba(0,212,170,.35);}',
            '.df-bookmark-plus{color:rgba(255,255,255,.55);}',
            '.df-bookmark-hint{text-align:center;color:rgba(255,255,255,.55);font-size:12px;margin-top:8px;letter-spacing:.5px;}',
            '.df-bookmark-actions{display:flex;justify-content:flex-end;padding:12px 18px 16px;}',
            '.df-bookmark-confirm{background:#00d4aa;color:#031816;border:0;padding:8px 18px;font-weight:700;letter-spacing:1.5px;cursor:pointer;font-family:Orbitron,monospace;font-size:12px;}',
            '.df-bookmark-confirm:hover{background:#24f4b2;}'
        ].join('\n');
        document.head.appendChild(style);
    }

    // ---------- DOM ----------
    function buildWidget() {
        if (document.querySelector('.df-mascot-widget')) return;

        var wrap = document.createElement('div');
        wrap.className = 'df-mascot-widget';
        wrap.innerHTML =
            '<div class="df-mascot-tip" id="df-mascot-tip">点我收藏本站，快速回访 ⭐</div>' +
            '<button class="df-mascot-btn" id="df-mascot-btn" type="button" aria-label="添加书签">' +
                '<span class="df-mascot-badge">DF</span>' +
                '<span class="df-mascot-figure" aria-hidden="true">🪖</span>' +
                '<span class="df-mascot-label">BOOKMARK</span>' +
            '</button>';
        document.body.appendChild(wrap);

        var overlay = document.createElement('div');
        overlay.className = 'df-bookmark-overlay';
        overlay.id = 'df-bookmark-overlay';
        var isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');
        var modKey = isMac ? '⌘ Cmd' : 'Ctrl';
        overlay.innerHTML =
            '<div class="df-bookmark-modal" role="dialog" aria-modal="true">' +
                '<div class="df-bookmark-header">' +
                    '<span class="df-bookmark-title">⭐ 收藏 Delta Force 工具站</span>' +
                    '<span class="df-bookmark-close" id="df-bookmark-close">✕</span>' +
                '</div>' +
                '<div class="df-bookmark-body">' +
                    '当前浏览器不支持一键收藏。请使用快捷键将本站加入书签：' +
                    '<div class="df-bookmark-keys">' +
                        '<span class="df-bookmark-key">' + modKey + '</span>' +
                        '<span class="df-bookmark-plus">+</span>' +
                        '<span class="df-bookmark-key">D</span>' +
                    '</div>' +
                    '<div class="df-bookmark-hint">在弹出的对话框中点击「完成 / Done」即可收藏</div>' +
                '</div>' +
                '<div class="df-bookmark-actions">' +
                    '<button class="df-bookmark-confirm" id="df-bookmark-ok" type="button">知道了</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);

        // 隐藏气泡
        var tipEl = wrap.querySelector('#df-mascot-tip');
        var tipHidden = false;
        function hideTip() {
            if (tipHidden || !tipEl) return;
            tipHidden = true;
            tipEl.style.transition = 'opacity .3s';
            tipEl.style.opacity = '0';
            setTimeout(function () { if (tipEl && tipEl.parentNode) tipEl.parentNode.removeChild(tipEl); }, 350);
        }
        // 8 秒后自动隐藏
        setTimeout(hideTip, 8000);

        // 关闭弹窗
        function closeOverlay() { overlay.classList.remove('active'); }
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeOverlay();
        });
        var closeBtn = overlay.querySelector('#df-bookmark-close');
        var okBtn = overlay.querySelector('#df-bookmark-ok');
        if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
        if (okBtn) okBtn.addEventListener('click', closeOverlay);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) closeOverlay();
        });

        // 点击挂件 -> 尝试浏览器原生收藏 -> 失败时弹窗引导
        var btn = wrap.querySelector('#df-mascot-btn');
        btn.addEventListener('click', function () {
            hideTip();
            var triggered = false;

            // IE / 老版 Edge：window.external.AddFavorite
            try {
                if (window.external && typeof window.external.AddFavorite === 'function') {
                    window.external.AddFavorite(window.location.href, document.title);
                    triggered = true;
                }
            } catch (e) {}

            // Firefox 旧版：sidebar.addPanel
            if (!triggered) {
                try {
                    if (window.sidebar && typeof window.sidebar.addPanel === 'function') {
                        window.sidebar.addPanel(document.title, window.location.href, '');
                        triggered = true;
                    }
                } catch (e) {}
            }

            if (!triggered) {
                overlay.classList.add('active');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();
