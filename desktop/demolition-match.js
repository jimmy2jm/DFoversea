/**
 * ============================================
 * 爆破模式 - 单局详情
 * ============================================
 * 通过 ?matchId=... 加载 shared/demolition-mock.js 中的对局明细。
 * 非法或缺失 matchId 时显示可返回的错误状态。
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const contentEl = document.getElementById('dm-content');
        const errorEl = document.getElementById('dm-error');
        const DM = window.DemolitionMock;

        function showError() {
            if (contentEl) contentEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'flex';
        }

        if (!DM || !contentEl || !errorEl) {
            showError();
            return;
        }

        const matchId = new URLSearchParams(window.location.search).get('matchId');
        const match = matchId ? DM.getMatchById(matchId) : null;
        if (!match) {
            showError();
            return;
        }

        renderOverview(match, DM);
        renderScoreboard(match, DM);
        renderFooter(match, DM);

        contentEl.style.display = 'block';
        errorEl.style.display = 'none';
        document.title = 'Delta Force - 爆破对局 ' + match.mapName + ' ' + match.score.self + ':' + match.score.enemy;
    });

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
    }

    /* ============================================
       比赛概览
       ============================================ */
    function renderOverview(match, DM) {
        const root = document.getElementById('dm-overview');
        const self = DM.getSelfParticipant(match);
        const isVictory = match.result === 'victory';

        const header = el('div', 'dm-panel-header');
        header.appendChild(el('span', 'dm-panel-title', '比赛概览'));
        header.appendChild(el('span', 'dm-panel-extra', match.matchId));
        root.appendChild(header);

        const body = el('div', 'dm-overview-body');

        // 左侧：结果与大比分
        const resultBox = el('div', 'dm-overview-result');
        resultBox.appendChild(el('span', 'dm-result-tag ' + (isVictory ? 'victory' : 'fail'), isVictory ? '胜利' : '失败'));
        const scoreLine = el('div', 'dm-score-line');
        scoreLine.appendChild(el('span', 'dm-score-num ' + (isVictory ? 'victory' : 'fail'), String(match.score.self)));
        scoreLine.appendChild(el('span', 'dm-score-sep', ':'));
        scoreLine.appendChild(el('span', 'dm-score-num enemy', String(match.score.enemy)));
        resultBox.appendChild(scoreLine);
        resultBox.appendChild(el('span', 'dm-score-hint', '我方比分 : 敌方比分'));
        body.appendChild(resultBox);

        // 右侧：元信息
        const meta = el('div', 'dm-overview-meta');
        const metaItems = [
            ['地图', match.mapName],
            ['队列', match.queueLabel],
            ['时间', match.startedAtLabel],
            ['时长', DM.fmt.duration(match.durationSeconds)],
            ['回合数', String(match.totalRounds)],
            ['开局阵营', match.selfStartSide === 'attack' ? '先进攻' : '先防守'],
            ['使用干员', self.operator],
            ['段位分变化', match.rankScoreChange === null ? '--（匹配赛）' : (match.rankScoreChange > 0 ? '+' : '') + match.rankScoreChange]
        ];
        metaItems.forEach(([k, v]) => {
            const item = el('div', 'dm-meta-item');
            item.appendChild(el('span', 'dm-meta-k', k));
            item.appendChild(el('span', 'dm-meta-v', v));
            meta.appendChild(item);
        });
        body.appendChild(meta);

        root.appendChild(body);
    }

    /* ============================================
       双方计分板（点击行展开个人详情）
       ============================================ */
    function renderScoreboard(match, DM) {
        const root = document.getElementById('dm-scoreboard');

        const header = el('div', 'dm-panel-header');
        header.appendChild(el('span', 'dm-panel-title', '双方计分板'));
        header.appendChild(el('span', 'dm-panel-extra', '点击玩家行展开详细数据'));
        root.appendChild(header);

        root.appendChild(buildTeamBlock(match, DM, 'self', '我方队伍'));
        root.appendChild(buildTeamBlock(match, DM, 'enemy', '敌方队伍'));

        // 事件委托：行展开 / 收起
        root.addEventListener('click', (e) => {
            const row = e.target.closest('.dm-player-row');
            if (!row) return;
            const detail = row.nextElementSibling;
            if (!detail || !detail.classList.contains('dm-player-detail')) return;
            const isOpen = row.classList.toggle('open');
            detail.style.display = isOpen ? 'table-row' : 'none';
        });
    }

    function buildTeamBlock(match, DM, teamKey, label) {
        const block = el('div', 'dm-team-block' + (teamKey === 'enemy' ? ' enemy' : ''));

        const teamScore = teamKey === 'self' ? match.score.self : match.score.enemy;
        const teamWon = (teamKey === 'self') === (match.result === 'victory');
        const teamHeader = el('div', 'dm-team-header');
        teamHeader.appendChild(el('span', 'dm-team-name', label));
        const teamRight = el('span', 'dm-team-right');
        teamRight.appendChild(el('span', 'dm-team-result ' + (teamWon ? 'victory' : 'fail'), teamWon ? '胜' : '负'));
        teamRight.appendChild(el('span', 'dm-team-score', String(teamScore)));
        teamHeader.appendChild(teamRight);
        block.appendChild(teamHeader);

        const table = el('table', 'dm-score-table');
        const thead = el('thead');
        const headRow = el('tr');
        ['玩家', '干员', '评分', 'K/D/A', 'ACS', 'ADR', '首杀', '下包/拆包'].forEach(t => {
            headRow.appendChild(el('th', '', t));
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = el('tbody');
        const players = match.teams[teamKey].slice().sort((a, b) => b.combatScore - a.combatScore);
        players.forEach(p => {
            tbody.appendChild(buildPlayerRow(p));
            tbody.appendChild(buildPlayerDetailRow(p));
        });
        table.appendChild(tbody);
        block.appendChild(table);

        return block;
    }

    function buildPlayerRow(p) {
        const row = el('tr', 'dm-player-row' + (p.isSelf ? ' self' : ''));

        const nameCell = el('td', 'dm-cell-player');
        nameCell.appendChild(el('span', 'dm-player-name', p.name));
        if (p.isSelf) nameCell.appendChild(el('span', 'dm-self-tag', '我'));
        if (p.mvp) nameCell.appendChild(el('span', 'dm-mvp-tag', 'MVP'));
        row.appendChild(nameCell);

        row.appendChild(el('td', '', p.operator));
        row.appendChild(el('td', 'dm-num', String(p.combatScore)));
        row.appendChild(el('td', 'dm-num', p.kills + '/' + p.deaths + '/' + p.assists));
        row.appendChild(el('td', 'dm-num', String(p.acs)));
        row.appendChild(el('td', 'dm-num', String(p.adr)));
        row.appendChild(el('td', 'dm-num', String(p.firstKills)));
        row.appendChild(el('td', 'dm-num', p.plants + '/' + p.defuses));
        return row;
    }

    function buildPlayerDetailRow(p) {
        const row = el('tr', 'dm-player-detail');
        row.style.display = 'none';
        const cell = el('td');
        cell.colSpan = 8;

        const grid = el('div', 'dm-detail-grid');

        // 命中分布
        const totalHits = p.headHits + p.bodyHits + p.legHits;
        const hitBox = el('div', 'dm-detail-box');
        hitBox.appendChild(el('span', 'dm-detail-title', '命中分布'));
        hitBox.appendChild(buildHitBar('头部', p.headHits, totalHits, 'head'));
        hitBox.appendChild(buildHitBar('身体', p.bodyHits, totalHits, 'body'));
        hitBox.appendChild(buildHitBar('腿部', p.legHits, totalHits, 'leg'));
        grid.appendChild(hitBox);

        // 关键数据
        const keyBox = el('div', 'dm-detail-box');
        keyBox.appendChild(el('span', 'dm-detail-title', '关键数据'));
        const headshotRate = totalHits > 0 ? ((p.headHits / totalHits) * 100).toFixed(1) + '%' : '--';
        [
            ['爆头率', headshotRate],
            ['首杀 / 首死', p.firstKills + ' / ' + p.firstDeaths],
            ['残局', p.clutchWins + ' 胜 / ' + p.clutchAttempts + ' 次'],
            ['评级', p.grade]
        ].forEach(([k, v]) => keyBox.appendChild(buildKvLine(k, v)));
        grid.appendChild(keyBox);

        // 多杀
        const multiBox = el('div', 'dm-detail-box');
        multiBox.appendChild(el('span', 'dm-detail-title', '多杀'));
        [
            ['双杀', p.multiKill[2]],
            ['三杀', p.multiKill[3]],
            ['四杀', p.multiKill[4]],
            ['五杀', p.multiKill[5]]
        ].forEach(([k, v]) => multiBox.appendChild(buildKvLine(k, String(v))));
        grid.appendChild(multiBox);

        // 经济
        const ecoBox = el('div', 'dm-detail-box');
        ecoBox.appendChild(el('span', 'dm-detail-title', '经济'));
        [
            ['总获得', fmtEconomy(p.economy.earned)],
            ['总花费', fmtEconomy(p.economy.spent)],
            ['每回合伤害', String(p.adr)],
            ['总伤害', fmtEconomy(p.damage)]
        ].forEach(([k, v]) => ecoBox.appendChild(buildKvLine(k, v)));
        grid.appendChild(ecoBox);

        cell.appendChild(grid);
        row.appendChild(cell);
        return row;
    }

    function buildHitBar(label, value, total, part) {
        const pct = total > 0 ? Math.round((value / total) * 100) : 0;
        const wrap = el('div', 'dm-hit-line');
        wrap.appendChild(el('span', 'dm-hit-label', label));
        const barWrap = el('span', 'dm-hit-bar');
        const bar = el('span', 'dm-hit-bar-fill ' + part);
        bar.style.width = pct + '%';
        barWrap.appendChild(bar);
        wrap.appendChild(barWrap);
        wrap.appendChild(el('span', 'dm-hit-value', pct + '%'));
        return wrap;
    }

    function buildKvLine(k, v) {
        const line = el('div', 'dm-kv-line');
        line.appendChild(el('span', 'dm-kv-k', k));
        line.appendChild(el('span', 'dm-kv-v', v));
        return line;
    }

    function fmtEconomy(n) {
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /* ============================================
       数据说明
       ============================================ */
    function renderFooter(match, DM) {
        const root = document.getElementById('dm-footer');
        root.textContent =
            '规则版本 ' + match.rulesetVersion +
            ' · 赛季 ' + match.seasonId +
            ' · 更新于 2026-08-13 08:00 · 当前为演示数据，非线上真实战绩';
        void DM;
    }
})();
