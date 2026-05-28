/**
 * Delta Force - 外部浏览器打开提示挂件
 * 仅用于原型示意：提示端内用户使用系统浏览器访问，不实现实际跳转功能。
 */
(function () {
    'use strict';

    if (window.__dfBrowserWidgetMounted) return;
    window.__dfBrowserWidgetMounted = true;

    var STYLE_ID = 'df-browser-widget-style';
    if (!document.getElementById(STYLE_ID)) {
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.df-browser-widget{position:fixed;right:24px;bottom:96px;z-index:980;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none;transition:opacity .35s ease,transform .35s ease;}',
            '.df-browser-widget.is-hidden{opacity:0;transform:translateY(8px);pointer-events:none;}',
            '.df-browser-tip{pointer-events:auto;background:rgba(6,18,20,.92);border:1px solid #00d4aa;color:#fff;font-size:12px;line-height:1.4;padding:6px 10px;letter-spacing:.5px;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.35);position:relative;animation:dfBrowserTipIn .35s ease-out both;}',
            '.df-browser-tip::after{content:"";position:absolute;right:18px;bottom:-6px;width:10px;height:10px;background:rgba(6,18,20,.92);border-right:1px solid #00d4aa;border-bottom:1px solid #00d4aa;transform:rotate(45deg);}',
            '.df-browser-btn{pointer-events:auto;width:84px;height:96px;background:linear-gradient(160deg,rgba(0,212,170,.2),rgba(6,18,20,.95));border:1px solid #00d4aa;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease;box-shadow:0 6px 20px rgba(0,0,0,.45);animation:dfBrowserFloat 3.6s ease-in-out infinite;}',
            '.df-browser-btn:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.55),0 0 0 4px rgba(0,212,170,.16);}',
            '.df-browser-btn::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(36,244,178,.26),transparent 55%);pointer-events:none;}',
            '.df-browser-figure{font-size:44px;line-height:1;filter:drop-shadow(0 0 10px rgba(0,212,170,.55));}',
            '.df-browser-badge{position:absolute;top:6px;left:6px;background:#00d4aa;color:#031816;font-family:Orbitron,monospace;font-size:9px;font-weight:700;letter-spacing:.5px;padding:1px 5px;line-height:1.4;}',
            '.df-browser-label{position:absolute;bottom:4px;left:0;right:0;text-align:center;font-family:Orbitron,monospace;font-size:9px;letter-spacing:1.2px;color:#24f4b2;}',
            '@keyframes dfBrowserFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
            '@keyframes dfBrowserTipIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function buildWidget() {
        if (document.querySelector('.df-browser-widget')) return;

        var wrap = document.createElement('div');
        wrap.className = 'df-browser-widget';
        wrap.innerHTML =
            '<div class="df-browser-tip" id="df-browser-tip">Click to open in browser</div>' +
            '<button class="df-browser-btn" id="df-browser-btn" type="button" aria-label="Open in browser" title="Open in browser">' +
                '<span class="df-browser-badge">WEB</span>' +
                '<span class="df-browser-figure" aria-hidden="true">🌐</span>' +
                '<span class="df-browser-label">BROWSER</span>' +
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

        var btn = wrap.querySelector('#df-browser-btn');
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
