/**
 * ============================================
 * 爆破模式 - 个人战绩列表
 * ============================================
 * 数据来自 shared/demolition-mock.js。
 * 列表结构复用页面既有 .date-group 日聚合格式；
 * 战绩项使用 .baopo-record-item 与普通链接，
 * 不会被页面既有 .match-record-item 弹窗事件委托拦截。
 */
(function () {
    'use strict';

    const PAGE_SIZE = 5;
    const RECENT_LIMIT = 5;

    document.addEventListener('DOMContentLoaded', () => {
        initBaopoTabs();

        const root = document.getElementById('baopo-mode-content');
        if (!root || !window.DemolitionMock) return;

        const DM = window.DemolitionMock;
        const listEl = document.getElementById('baopo-records-list');
        const countEl = document.getElementById('baopo-records-count');
        const emptyEl = document.getElementById('baopo-records-empty');
        const loadMoreBtn = document.getElementById('baopo-load-more');
        const clearFilterBtn = document.getElementById('baopo-clear-filter');
        const mapFilter = document.getElementById('baopo-map-filter');
        const resultFilter = document.getElementById('baopo-result-filter');
        const recentListEl = document.getElementById('baopo-recent-list');
        const viewAllLink = document.getElementById('baopo-view-all-link');

        const state = {
            map: 'all',
            result: 'all',
            shown: PAGE_SIZE
        };

        // 从 URL 恢复筛选状态（?mode=baopo&map=..&result=..）
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('map')) state.map = urlParams.get('map');
        if (urlParams.get('result')) state.result = urlParams.get('result');

        // 地图筛选项由数据字典生成，避免多处维护
        DM.maps.forEach(map => {
            const option = document.createElement('option');
            option.value = map.id;
            option.textContent = map.name;
            mapFilter.appendChild(option);
        });
        mapFilter.value = state.map;
        resultFilter.value = state.result;

        function syncUrl() {
            const params = new URLSearchParams(window.location.search);
            params.set('mode', 'baopo');
            params.set('map', state.map);
            params.set('result', state.result);
            const query = params.toString();
            window.history.replaceState(null, '', window.location.pathname + '?' + query);
        }

        function el(tag, className, text) {
            const node = document.createElement(tag);
            if (className) node.className = className;
            if (text !== undefined && text !== null) node.textContent = text;
            return node;
        }

        /* ---------- 日聚合 ---------- */
        function groupByDate(items) {
            const grouped = new Map();
            items.forEach(match => {
                if (!grouped.has(match.date)) grouped.set(match.date, []);
                grouped.get(match.date).push(match);
            });
            return Array.from(grouped.entries()).map(([date, matches]) => {
                const agg = { date, matches, wins: 0, losses: 0 };
                matches.forEach(match => {
                    if (match.result === 'victory') agg.wins += 1;
                    else agg.losses += 1;
                });
                return agg;
            });
        }

        function createDateGroupHead(agg) {
            const head = el('div', 'date-group-head');
            head.appendChild(el('span', 'date-group-label', agg.date.slice(5)));

            head.appendChild(el('span', 'date-group-count', agg.matches.length + ' 场'));

            const wl = el('span', 'date-group-wl');
            wl.appendChild(el('span', 'w', agg.wins + 'W'));
            wl.appendChild(el('span', 'sep', '/'));
            wl.appendChild(el('span', 'l', agg.losses + 'L'));
            head.appendChild(wl);

            return head;
        }

        /* ---------- 战绩行 ---------- */
        function createRecordItem(match) {
            const self = DM.getSelfParticipant(match);
            const item = document.createElement('a');
            item.className = 'baopo-record-item';
            item.href = 'demolition-match.html?matchId=' + encodeURIComponent(match.matchId);

            // 结果
            item.appendChild(el('span', 'bri-status ' + (match.result === 'victory' ? 'victory' : 'fail'),
                match.result === 'victory' ? '胜利' : '失败'));

            // 地图 / 队列 / 时间
            const main = el('span', 'bri-main');
            main.appendChild(el('span', 'bri-map', match.mapName + ' · ' + match.queueLabel));
            main.appendChild(el('span', 'bri-time', DM.fmt.dateLabel(match.date) + ' ' + match.time));
            item.appendChild(main);

            // 比分
            item.appendChild(el('span', 'bri-score ' + (match.result === 'victory' ? 'victory' : 'fail'),
                match.score.self + ':' + match.score.enemy));

            // 干员（含 MVP 标记）
            const operator = el('span', 'bri-operator', self.operator);
            if (self.mvp) operator.appendChild(el('i', 'bri-mvp-tag', 'MVP'));
            item.appendChild(operator);

            // K/D/A、ACS、下包/拆包
            item.appendChild(createStatCell(self.kills + '/' + self.deaths + '/' + self.assists, 'K/D/A'));
            item.appendChild(createStatCell(String(self.acs), 'ACS'));
            item.appendChild(createStatCell(self.plants + '/' + self.defuses, '下包/拆包'));

            // 段位分变化
            const rank = el('span', 'bri-rank');
            if (match.rankScoreChange === null) {
                rank.textContent = '--';
                rank.classList.add('neutral');
            } else {
                const positive = match.rankScoreChange > 0;
                rank.textContent = (positive ? '+' : '') + match.rankScoreChange;
                rank.classList.add(positive ? 'positive' : 'negative');
            }
            item.appendChild(rank);

            item.appendChild(el('span', 'bri-arrow', '›'));
            return item;
        }

        function createStatCell(value, label) {
            const cell = el('span', 'bri-stat');
            cell.appendChild(el('b', '', value));
            cell.appendChild(el('i', '', label));
            return cell;
        }

        /* ---------- 渲染 ---------- */
        function renderGroupedList(targetEl, items) {
            targetEl.innerHTML = '';
            const fragment = document.createDocumentFragment();
            groupByDate(items).forEach(agg => {
                const group = el('div', 'date-group');
                group.appendChild(createDateGroupHead(agg));
                agg.matches.forEach(match => group.appendChild(createRecordItem(match)));
                fragment.appendChild(group);
            });
            targetEl.appendChild(fragment);
        }

        // 总览页赛季综合数据（由共享数据层聚合）
        function renderSeasonSummary() {
            const s = DM.getSeasonSummary();
            const setText = (id, text) => {
                const node = document.getElementById(id);
                if (node) node.textContent = text;
            };
            setText('baopo-summary-meta', '总计 ' + s.matchCount + ' 场对局');
            setText('baopo-sum-winrate', DM.fmt.percent(s.winRate));
            setText('baopo-sum-mvp', String(s.mvpCount));
            setText('baopo-sum-mvp-likes', String(s.mvpLikes));
            setText('baopo-sum-avgscore', String(s.avgScore));
            setText('baopo-sum-kd', s.kd.toFixed(2));
            setText('baopo-sum-kills', String(s.kills));
            setText('baopo-sum-hitrate', DM.fmt.percent(s.hitRate));
            setText('baopo-sum-hs', DM.fmt.percent(s.headshotRate));
            setText('baopo-sum-plants', String(s.plants));
            setText('baopo-sum-defuses', String(s.defuses));
            setText('baopo-sum-guard', String(s.plantGuardKills));
            setText('baopo-sum-deny', String(s.plantDenyKills));
        }

        // 总览页最近对局（与战绩页共用同一渲染，内容不受筛选影响）
        function renderRecent() {
            if (!recentListEl) return;
            const recent = DM.queryMatches({ mapId: 'all', result: 'all', offset: 0, limit: RECENT_LIMIT }).items;
            renderGroupedList(recentListEl, recent);
        }

        function render() {
            const query = DM.queryMatches({
                mapId: state.map,
                result: state.result,
                offset: 0,
                limit: state.shown
            });

            renderGroupedList(listEl, query.items);

            countEl.textContent = '共 ' + query.total + ' 场';

            const isEmpty = query.total === 0;
            emptyEl.style.display = isEmpty ? 'flex' : 'none';
            loadMoreBtn.style.display = !isEmpty && query.hasMore ? 'block' : 'none';
        }

        mapFilter.addEventListener('change', () => {
            state.map = mapFilter.value;
            state.shown = PAGE_SIZE;
            syncUrl();
            render();
        });

        resultFilter.addEventListener('change', () => {
            state.result = resultFilter.value;
            state.shown = PAGE_SIZE;
            syncUrl();
            render();
        });

        loadMoreBtn.addEventListener('click', () => {
            state.shown += PAGE_SIZE;
            render();
        });

        clearFilterBtn.addEventListener('click', () => {
            state.map = 'all';
            state.result = 'all';
            state.shown = PAGE_SIZE;
            mapFilter.value = 'all';
            resultFilter.value = 'all';
            syncUrl();
            render();
        });

        // 总览页「查看更多」→ 切换到战绩页签
        if (viewAllLink) {
            viewAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                const matchesTab = document.querySelector('.baopo-tab[data-tab="baopo-matches"]');
                if (matchesTab) matchesTab.click();
            });
        }

        renderSeasonSummary();
        renderRecent();
        render();
    });

    /* 爆破模式页签切换（与 zc-tab 模式一致，互不干扰） */
    function initBaopoTabs() {
        const tabs = document.querySelectorAll('.profile-tab.baopo-tab');
        const contents = document.querySelectorAll('.tab-content.baopo-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                contents.forEach(content => {
                    content.classList.toggle('active', content.id === 'tab-' + targetTab);
                });
            });
        });
    }
})();
