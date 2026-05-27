/**
 * Delta Force - 移动端 Discord 角色挂件
 * 自包含模块（样式 + DOM + 跳转），无外部依赖。
 */
(function () {
    'use strict';

    if (window.__dfMobileDiscordWidgetMounted) return;
    window.__dfMobileDiscordWidgetMounted = true;

    var DISCORD_URL = 'https://discord.com/channels/1128946232207888414/1496789089729380463';

    var STYLE_ID = 'df-mobile-discord-style';
    if (!document.getElementById(STYLE_ID)) {
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.df-m-discord{position:fixed;right:max(14px,calc((100vw - 414px)/2 + 14px));bottom:calc(80px + env(safe-area-inset-bottom,0px));z-index:880;display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none;}',
            '.df-m-discord-tip{pointer-events:auto;background:rgba(6,18,20,.94);border:1px solid #5865f2;color:#fff;font-size:11px;line-height:1.35;padding:5px 9px;letter-spacing:.3px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.4);position:relative;}',
            '.df-m-discord-tip::after{content:"";position:absolute;right:14px;bottom:-5px;width:8px;height:8px;background:rgba(6,18,20,.94);border-right:1px solid #5865f2;border-bottom:1px solid #5865f2;transform:rotate(45deg);}',
            '.df-m-discord-btn{pointer-events:auto;width:62px;height:74px;background:linear-gradient(160deg,rgba(88,101,242,.24),rgba(6,18,20,.95));border:1px solid #5865f2;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.45);animation:dfMDiscordFloat 3.6s ease-in-out infinite;padding:0;}',
            '.df-m-discord-btn::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(88,101,242,.28),transparent 55%);}',
            '.df-m-discord-figure{font-size:34px;line-height:1;filter:drop-shadow(0 0 8px rgba(88,101,242,.55));}',
            '.df-m-discord-badge{position:absolute;top:4px;left:4px;background:#5865f2;color:#fff;font-family:Orbitron,monospace;font-size:8px;font-weight:700;letter-spacing:.4px;padding:1px 4px;line-height:1.4;}',
            '.df-m-discord-label{position:absolute;bottom:3px;left:0;right:0;text-align:center;font-family:Orbitron,monospace;font-size:7px;letter-spacing:.8px;color:#cdd3ff;}',
            '@keyframes dfMDiscordFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function buildWidget() {
        if (document.querySelector('.df-m-discord')) return;

        var wrap = document.createElement('div');
        wrap.className = 'df-m-discord';
        wrap.innerHTML =
            '<div class="df-m-discord-tip" id="df-m-discord-tip">加入 Discord 社群</div>' +
            '<button class="df-m-discord-btn" id="df-m-discord-btn" type="button" aria-label="打开 Discord 社群">' +
                '<span class="df-m-discord-badge">DF</span>' +
                '<span class="df-m-discord-figure" aria-hidden="true">🪖</span>' +
                '<span class="df-m-discord-label">DISCORD</span>' +
            '</button>';
        document.body.appendChild(wrap);

        var tipEl = wrap.querySelector('#df-m-discord-tip');
        var tipHidden = false;
        function hideTip() {
            if (tipHidden || !tipEl) return;
            tipHidden = true;
            tipEl.style.transition = 'opacity .3s';
            tipEl.style.opacity = '0';
            setTimeout(function () {
                if (tipEl && tipEl.parentNode) tipEl.parentNode.removeChild(tipEl);
            }, 350);
        }
        setTimeout(hideTip, 7000);

        var btn = wrap.querySelector('#df-m-discord-btn');
        btn.addEventListener('click', function () {
            hideTip();
            window.open(DISCORD_URL, '_blank', 'noopener,noreferrer');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();
