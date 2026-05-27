/**
 * Delta Force - Discord 角色挂件
 * 自包含模块（样式 + DOM + 跳转），无外部依赖。
 */
(function () {
    'use strict';

    if (window.__dfDiscordWidgetMounted) return;
    window.__dfDiscordWidgetMounted = true;

    var DISCORD_URL = 'https://discord.com/channels/1128946232207888414/1496789089729380463';

    var STYLE_ID = 'df-discord-widget-style';
    if (!document.getElementById(STYLE_ID)) {
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.df-discord-widget{position:fixed;right:24px;bottom:96px;z-index:980;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none;}',
            '.df-discord-tip{pointer-events:auto;background:rgba(6,18,20,.92);border:1px solid #5865f2;color:#fff;font-size:12px;line-height:1.4;padding:6px 10px;letter-spacing:.5px;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.35);position:relative;animation:dfDiscordTipIn .35s ease-out both;}',
            '.df-discord-tip::after{content:"";position:absolute;right:18px;bottom:-6px;width:10px;height:10px;background:rgba(6,18,20,.92);border-right:1px solid #5865f2;border-bottom:1px solid #5865f2;transform:rotate(45deg);}',
            '.df-discord-btn{pointer-events:auto;width:84px;height:96px;background:linear-gradient(160deg,rgba(88,101,242,.22),rgba(6,18,20,.95));border:1px solid #5865f2;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease;box-shadow:0 6px 20px rgba(0,0,0,.45);animation:dfDiscordFloat 3.6s ease-in-out infinite;}',
            '.df-discord-btn:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.55),0 0 0 4px rgba(88,101,242,.18);}',
            '.df-discord-btn::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(88,101,242,.28),transparent 55%);pointer-events:none;}',
            '.df-discord-figure{font-size:48px;line-height:1;filter:drop-shadow(0 0 10px rgba(88,101,242,.55));}',
            '.df-discord-badge{position:absolute;top:6px;left:6px;background:#5865f2;color:#fff;font-family:Orbitron,monospace;font-size:9px;font-weight:700;letter-spacing:.5px;padding:1px 5px;line-height:1.4;}',
            '.df-discord-label{position:absolute;bottom:4px;left:0;right:0;text-align:center;font-family:Orbitron,monospace;font-size:9px;letter-spacing:1.4px;color:#cdd3ff;}',
            '@keyframes dfDiscordFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
            '@keyframes dfDiscordTipIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function buildWidget() {
        if (document.querySelector('.df-discord-widget')) return;

        var wrap = document.createElement('div');
        wrap.className = 'df-discord-widget';
        wrap.innerHTML =
            '<div class="df-discord-tip" id="df-discord-tip">加入 Discord 社群，获取最新情报</div>' +
            '<button class="df-discord-btn" id="df-discord-btn" type="button" aria-label="打开 Discord 社群">' +
                '<span class="df-discord-badge">DF</span>' +
                '<span class="df-discord-figure" aria-hidden="true">🪖</span>' +
                '<span class="df-discord-label">DISCORD</span>' +
            '</button>';
        document.body.appendChild(wrap);

        var tipEl = wrap.querySelector('#df-discord-tip');
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
        setTimeout(hideTip, 8000);

        var btn = wrap.querySelector('#df-discord-btn');
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
