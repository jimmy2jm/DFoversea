/**
 * Delta Force - 移动端外部浏览器打开提示挂件
 * 仅用于原型示意：提示端内用户使用系统浏览器访问，不实现实际跳转功能。
 */
(function () {
    'use strict';

    if (window.__dfMobileBrowserWidgetMounted) return;
    window.__dfMobileBrowserWidgetMounted = true;

    var STYLE_ID = 'df-mobile-browser-style';
    if (!document.getElementById(STYLE_ID)) {
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.df-m-browser{position:fixed;right:max(14px,calc((100vw - 414px)/2 + 14px));bottom:calc(80px + env(safe-area-inset-bottom,0px));z-index:880;display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none;transition:opacity .35s ease,transform .35s ease;}',
            '.df-m-browser.is-hidden{opacity:0;transform:translateY(8px);pointer-events:none;}',
            '.df-m-browser-tip{pointer-events:auto;background:rgba(6,18,20,.94);border:1px solid #00d4aa;color:#fff;font-size:11px;line-height:1.35;padding:5px 9px;letter-spacing:.3px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.4);position:relative;}',
            '.df-m-browser-tip::after{content:"";position:absolute;right:14px;bottom:-5px;width:8px;height:8px;background:rgba(6,18,20,.94);border-right:1px solid #00d4aa;border-bottom:1px solid #00d4aa;transform:rotate(45deg);}',
            '.df-m-browser-btn{pointer-events:auto;width:62px;height:74px;background:linear-gradient(160deg,rgba(0,212,170,.24),rgba(6,18,20,.95));border:1px solid #00d4aa;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.45);animation:dfMBrowserFloat 3.6s ease-in-out infinite;padding:0;}',
            '.df-m-browser-btn::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(36,244,178,.28),transparent 55%);}',
            '.df-m-browser-figure{font-size:32px;line-height:1;filter:drop-shadow(0 0 8px rgba(0,212,170,.55));}',
            '.df-m-browser-badge{position:absolute;top:4px;left:4px;background:#00d4aa;color:#031816;font-family:Orbitron,monospace;font-size:8px;font-weight:700;letter-spacing:.4px;padding:1px 4px;line-height:1.4;}',
            '.df-m-browser-label{position:absolute;bottom:3px;left:0;right:0;text-align:center;font-family:Orbitron,monospace;font-size:7px;letter-spacing:.8px;color:#24f4b2;}',
            '@keyframes dfMBrowserFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function buildWidget() {
        if (document.querySelector('.df-m-browser')) return;

        var wrap = document.createElement('div');
        wrap.className = 'df-m-browser';
        wrap.innerHTML =
            '<div class="df-m-browser-tip" id="df-m-browser-tip">Open in browser</div>' +
            '<button class="df-m-browser-btn" id="df-m-browser-btn" type="button" aria-label="Open in browser" title="Open in browser">' +
                '<span class="df-m-browser-badge">WEB</span>' +
                '<span class="df-m-browser-figure" aria-hidden="true">🌐</span>' +
                '<span class="df-m-browser-label">BROWSER</span>' +
            '</button>';
        document.body.appendChild(wrap);

        function hideWidget() {
            if (!wrap || wrap.classList.contains('is-hidden')) return;
            wrap.classList.add('is-hidden');
            setTimeout(function () {
                wrap.style.display = 'none';
            }, 360);
        }

        setTimeout(hideWidget, 5000);

        var btn = wrap.querySelector('#df-m-browser-btn');
        btn.addEventListener('click', function () {
            hideWidget();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();
