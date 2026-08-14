/**
 * ============================================
 * 爆破模式共享 Mock 数据层
 * ============================================
 * 同一份明细数据同时驱动：首页爆破日报、个人爆破战绩列表、单局详情页。
 * - 规则相关字段保留 rulesetVersion，UI 不写死率先获胜分数、换边和加时规则。
 * - 数据由确定性种子生成，比分、回合胜负、下包/拆包、首杀等指标由构造保证自洽。
 * - 后续接入真实 API 时，仅需替换本文件的查询方法实现。
 */
(function (global) {
    'use strict';

    /* ============================================
       确定性随机数（保证每次加载数据一致）
       ============================================ */
    function mulberry32(seed) {
        let a = seed >>> 0;
        return function () {
            a |= 0;
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function randint(rng, min, max) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }

    function shuffle(rng, arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    /* ============================================
       规则版本 / 字典
       ============================================ */
    const RULESET = {
        rulesetVersion: 'dm-bt-0.9.3',
        teamSize: 5,
        roundsToWin: 6,
        maxRounds: 11,
        sideSwitchAfterRound: 5,
        roundDurationSeconds: 100,
        plantDurationSeconds: 4,
        detonationDurationSeconds: 45,
        defuseDurationSeconds: 7
    };

    const SEASON_ID = 'S8';
    const DAILY_DATE = '2026-08-12';
    const CURRENT_PLAYER = { playerId: 'p-self', name: 'DeltaOperator' };

    const MAPS = [
        { id: 'lanshuiwu', name: '蓝水屋电站' },
        { id: 'hangtianzhuanzhan', name: '航天中转站' }
    ];
    const MAP_BY_ID = MAPS.reduce(function (acc, m) { acc[m.id] = m; return acc; }, {});

    const QUEUE_LABELS = { ranked: '排位赛', casual: '匹配赛' };
    const END_REASON_LABELS = {
        elimination: '全员淘汰',
        detonation: '炸弹引爆',
        defuse: '炸弹拆除',
        timeout: '进攻超时'
    };

    const OPERATOR_POOL = ['威龙', '红狼', '露娜', '骇爪', '牧羊人', '暗刃', '蜂医', '乌鲁鲁'];
    const TEAMMATE_NAMES = ['夜枭', '孤狼', '寒霜', '铁壁', '疾风', '惊蛰', '白夜', '玄甲'];
    const ENEMY_NAMES = ['雷霆', '幽灵', '毒刺', '猎鹰', '赤瞳', '碎星', '沉舟', '追猎', '断罪', '凌空'];

    /* ============================================
       对局编排（日期 / 地图 / 比分显式指定，明细由种子生成）
       ============================================ */
    const MATCH_SPECS = [
        // —— 日报日期 2026-08-12：3胜1负 ——
        { id: 'bp-20260812-04', date: '2026-08-12', time: '23:36', mapId: 'hangtianzhuanzhan', queue: 'ranked', selfScore: 6, enemyScore: 3, selfOperator: '威龙', selfSkill: 2.1, seed: 2026081204 },
        { id: 'bp-20260812-03', date: '2026-08-12', time: '22:41', mapId: 'lanshuiwu', queue: 'ranked', selfScore: 6, enemyScore: 4, selfOperator: '骇爪', selfSkill: 1.7, seed: 2026081203 },
        { id: 'bp-20260812-02', date: '2026-08-12', time: '21:28', mapId: 'hangtianzhuanzhan', queue: 'ranked', selfScore: 4, enemyScore: 6, selfOperator: '露娜', selfSkill: 1.4, seed: 2026081202 },
        { id: 'bp-20260812-01', date: '2026-08-12', time: '20:12', mapId: 'lanshuiwu', queue: 'casual', selfScore: 6, enemyScore: 2, selfOperator: '威龙', selfSkill: 2.0, seed: 2026081201 },
        // —— 2026-08-11：1胜2负 ——
        { id: 'bp-20260811-03', date: '2026-08-11', time: '22:57', mapId: 'hangtianzhuanzhan', queue: 'ranked', selfScore: 3, enemyScore: 6, selfOperator: '牧羊人', selfSkill: 1.2, seed: 2026081103 },
        { id: 'bp-20260811-02', date: '2026-08-11', time: '21:40', mapId: 'lanshuiwu', queue: 'ranked', selfScore: 6, enemyScore: 5, selfOperator: '红狼', selfSkill: 1.8, seed: 2026081102 },
        { id: 'bp-20260811-01', date: '2026-08-11', time: '20:53', mapId: 'hangtianzhuanzhan', queue: 'casual', selfScore: 2, enemyScore: 6, selfOperator: '暗刃', selfSkill: 1.3, seed: 2026081101 },
        // —— 2026-08-10：2胜 ——
        { id: 'bp-20260810-02', date: '2026-08-10', time: '22:20', mapId: 'lanshuiwu', queue: 'ranked', selfScore: 6, enemyScore: 3, selfOperator: '威龙', selfSkill: 1.8, seed: 2026081002 },
        { id: 'bp-20260810-01', date: '2026-08-10', time: '21:15', mapId: 'hangtianzhuanzhan', queue: 'ranked', selfScore: 6, enemyScore: 4, selfOperator: '露娜', selfSkill: 1.6, seed: 2026081001 },
        // —— 2026-08-09：1胜1负 ——
        { id: 'bp-20260809-02', date: '2026-08-09', time: '22:05', mapId: 'lanshuiwu', queue: 'casual', selfScore: 6, enemyScore: 1, selfOperator: '骇爪', selfSkill: 1.9, seed: 2026080902 },
        { id: 'bp-20260809-01', date: '2026-08-09', time: '20:30', mapId: 'hangtianzhuanzhan', queue: 'ranked', selfScore: 5, enemyScore: 6, selfOperator: '威龙', selfSkill: 1.6, seed: 2026080901 },
        // —— 2026-08-08：1负 ——
        { id: 'bp-20260808-01', date: '2026-08-08', time: '21:48', mapId: 'lanshuiwu', queue: 'ranked', selfScore: 1, enemyScore: 6, selfOperator: '蜂医', selfSkill: 1.1, seed: 2026080801 },
        // —— 2026-08-07：1胜1负 ——
        { id: 'bp-20260807-02', date: '2026-08-07', time: '21:59', mapId: 'hangtianzhuanzhan', queue: 'ranked', selfScore: 4, enemyScore: 6, selfOperator: '红狼', selfSkill: 1.4, seed: 2026080702 },
        { id: 'bp-20260807-01', date: '2026-08-07', time: '20:22', mapId: 'lanshuiwu', queue: 'ranked', selfScore: 6, enemyScore: 2, selfOperator: '威龙', selfSkill: 1.7, seed: 2026080701 }
    ];

    /* ============================================
       对局生成
       ============================================ */
    function pickWeighted(rng, team) {
        // 己方队伍中当前玩家获得事件的概率略高，便于日报/详情演示
        const selfWeight = team.some(function (p) { return p.isSelf; }) ? 0.3 : 0;
        if (selfWeight > 0 && rng() < selfWeight) {
            return team.find(function (p) { return p.isSelf; });
        }
        return team[randint(rng, 0, team.length - 1)];
    }

    function buildPlayers(rng, spec) {
        const teammateNames = shuffle(rng, TEAMMATE_NAMES.slice()).slice(0, 4);
        const enemyNames = shuffle(rng, ENEMY_NAMES.slice()).slice(0, 5);
        const selfOps = [spec.selfOperator];
        const teammateOps = shuffle(rng, OPERATOR_POOL.filter(function (op) { return op !== spec.selfOperator; })).slice(0, 4);
        const enemyOps = shuffle(rng, OPERATOR_POOL.slice()).slice(0, 5);

        const selfTeam = [{
            playerId: CURRENT_PLAYER.playerId,
            name: CURRENT_PLAYER.name,
            operator: spec.selfOperator,
            isSelf: true,
            skill: spec.selfSkill,
            headBase: 0.34
        }];
        teammateNames.forEach(function (name, i) {
            selfTeam.push({
                playerId: spec.id + '-t' + (i + 1),
                name: name,
                operator: teammateOps[i],
                isSelf: false,
                skill: 1.0 + rng() * 0.7,
                headBase: 0.18 + rng() * 0.12
            });
        });
        const enemyTeam = enemyNames.map(function (name, i) {
            return {
                playerId: spec.id + '-e' + (i + 1),
                name: name,
                operator: enemyOps[i],
                isSelf: false,
                skill: 1.0 + rng() * 0.8,
                headBase: 0.16 + rng() * 0.14
            };
        });
        void selfOps;
        return { selfTeam: selfTeam, enemyTeam: enemyTeam };
    }

    function buildRounds(rng, spec, selfTeam, enemyTeam) {
        const selfIsWinner = spec.selfScore > spec.enemyScore;
        // 先排出除去“赛点回合”的胜负序列，最后追加获胜方赛点，保证比分严格等于回合统计
        const pool = [];
        for (let i = 0; i < (selfIsWinner ? spec.selfScore - 1 : spec.selfScore); i++) pool.push('self');
        for (let i = 0; i < (selfIsWinner ? spec.enemyScore : spec.enemyScore - 1); i++) pool.push('enemy');
        shuffle(rng, pool);
        pool.push(selfIsWinner ? 'self' : 'enemy');

        const selfStartSide = rng() < 0.5 ? 'attack' : 'defense';
        const totalRounds = pool.length;

        const rounds = pool.map(function (winner, idx) {
            const index = idx + 1;
            const selfSide = index <= RULESET.sideSwitchAfterRound
                ? selfStartSide
                : (selfStartSide === 'attack' ? 'defense' : 'attack');
            const attackerKey = selfSide === 'attack' ? 'self' : 'enemy';
            const attackerTeam = attackerKey === 'self' ? selfTeam : enemyTeam;
            const defenderTeam = attackerKey === 'self' ? enemyTeam : selfTeam;
            const winnerTeam = winner === 'self' ? selfTeam : enemyTeam;
            const loserTeam = winner === 'self' ? enemyTeam : selfTeam;
            const attackerWon = winner === attackerKey;

            let endReason;
            let planted = false;
            const roll = rng();
            if (attackerWon) {
                if (roll < 0.45) { endReason = 'detonation'; planted = true; }
                else if (roll < 0.62) { endReason = 'elimination'; planted = true; } // 安放后歼灭
                else { endReason = 'elimination'; }
            } else if (roll < 0.30) {
                endReason = 'defuse'; planted = true;
            } else if (roll < 0.42) {
                endReason = 'timeout';
            } else {
                endReason = 'elimination';
            }

            let site = 'none';
            let plantBy = null;
            let defuseBy = null;
            if (planted) {
                site = rng() < 0.5 ? 'A' : 'B';
                plantBy = pickWeighted(rng, attackerTeam).playerId;
                if (endReason === 'defuse') {
                    defuseBy = pickWeighted(rng, defenderTeam).playerId;
                }
            }

            const firstKillBy = pickWeighted(rng, winnerTeam).playerId;
            const firstDeathBy = loserTeam[randint(rng, 0, loserTeam.length - 1)].playerId;

            let duration = randint(rng, 55, RULESET.roundDurationSeconds + 30);
            if (endReason === 'detonation') duration += RULESET.detonationDurationSeconds;
            if (endReason === 'defuse') duration += randint(rng, 20, RULESET.detonationDurationSeconds);

            return {
                index: index,
                selfSide: selfSide,
                winner: winner,
                endReason: endReason,
                site: site,
                plantBy: plantBy,
                defuseBy: defuseBy,
                firstKillBy: firstKillBy,
                firstDeathBy: firstDeathBy,
                durationSeconds: duration
            };
        });

        return { rounds: rounds, selfStartSide: selfStartSide, totalRounds: totalRounds };
    }

    function fillPlayerCombatStats(rng, player, totalRounds) {
        const kills = Math.max(2, Math.round(totalRounds * (0.5 + player.skill * 0.3) + (rng() * 4 - 2)));
        const deaths = Math.max(1, Math.round(totalRounds * (0.45 + rng() * 0.3)));
        const assists = Math.max(0, Math.round(kills * (0.15 + rng() * 0.35)));
        const damage = Math.round(kills * (105 + rng() * 60) + assists * 35 + rng() * 260);
        const totalHits = Math.max(kills, Math.round(kills * (2.4 + rng() * 1.2)));
        const headShare = clamp(player.headBase + (rng() * 0.08 - 0.04), 0.08, 0.5);
        const legShare = 0.08 + rng() * 0.08;
        const headHits = Math.round(totalHits * headShare);
        const legHits = Math.round(totalHits * legShare);

        const multiKill2 = kills >= 6 ? randint(rng, 0, 3) : 0;
        const multiKill3 = kills >= 8 ? randint(rng, 0, 2) : 0;
        const multiKill4 = kills >= 9 && rng() < 0.6 ? 1 : 0;
        const multiKill5 = kills >= 12 && rng() < 0.45 ? 1 : 0;

        const clutchAttempts = player.isSelf ? randint(rng, 0, 2) : randint(rng, 0, 1);

        const economyEarned = totalRounds * randint(rng, 2100, 2600);
        const economySpent = Math.round(economyEarned * (0.78 + rng() * 0.16));

        player.kills = kills;
        player.deaths = deaths;
        player.assists = assists;
        player.damage = damage;
        player.adr = Math.round(damage / totalRounds);
        player.headHits = headHits;
        player.bodyHits = totalHits - headHits - legHits;
        player.legHits = legHits;
        player.plants = 0;
        player.defuses = 0;
        player.firstKills = 0;
        player.firstDeaths = 0;
        player.multiKill = { 2: multiKill2, 3: multiKill3, 4: multiKill4, 5: multiKill5 };
        player.clutchAttempts = clutchAttempts;
        player.clutchWins = randint(rng, 0, clutchAttempts);
        player.economy = { earned: economyEarned, spent: economySpent };
    }

    function finalizePlayers(rng, match, allPlayers) {
        allPlayers.forEach(function (p) {
            p.combatScore = Math.round(
                p.kills * 26 + p.assists * 11 +
                p.plants * 38 + p.defuses * 42 +
                p.firstKills * 22 + p.damage * 0.09 +
                p.multiKill[2] * 10 + p.multiKill[3] * 18 + p.multiKill[4] * 28 + p.multiKill[5] * 40 +
                p.clutchWins * 30
            );
            p.acs = Math.round(p.combatScore / match.totalRounds);
            p.grade = p.acs >= 85 ? 'S' : (p.acs >= 70 ? 'A' : (p.acs >= 55 ? 'B' : 'C'));
            p.mvp = false;
        });
        // 全场 MVP：战斗评分最高者
        let mvpPlayer = allPlayers[0];
        allPlayers.forEach(function (p) {
            if (p.combatScore > mvpPlayer.combatScore) mvpPlayer = p;
        });
        mvpPlayer.mvp = true;
        void rng;
    }

    function generateMatch(spec) {
        const rng = mulberry32(spec.seed);
        const teams = buildPlayers(rng, spec);
        const roundData = buildRounds(rng, spec, teams.selfTeam, teams.enemyTeam);
        const allPlayers = teams.selfTeam.concat(teams.enemyTeam);

        allPlayers.forEach(function (p) {
            fillPlayerCombatStats(rng, p, roundData.totalRounds);
        });

        // 目标与首杀事件由回合明细回填，保证玩家数据与回合数据严格一致
        roundData.rounds.forEach(function (round) {
            allPlayers.forEach(function (p) {
                if (round.plantBy === p.playerId) p.plants += 1;
                if (round.defuseBy === p.playerId) p.defuses += 1;
                if (round.firstKillBy === p.playerId) p.firstKills += 1;
                if (round.firstDeathBy === p.playerId) p.firstDeaths += 1;
            });
        });

        const result = spec.selfScore > spec.enemyScore ? 'victory' : 'defeat';
        const durationSeconds = roundData.rounds.reduce(function (sum, r) { return sum + r.durationSeconds; }, 0);

        const match = {
            matchId: spec.id,
            seasonId: SEASON_ID,
            rulesetVersion: RULESET.rulesetVersion,
            queueType: spec.queue,
            queueLabel: QUEUE_LABELS[spec.queue] || spec.queue,
            mapId: spec.mapId,
            mapName: MAP_BY_ID[spec.mapId].name,
            date: spec.date,
            time: spec.time,
            startedAtLabel: spec.date + ' ' + spec.time,
            startedAtTs: Date.parse(spec.date + 'T' + spec.time + ':00'),
            durationSeconds: durationSeconds,
            totalRounds: roundData.totalRounds,
            selfStartSide: roundData.selfStartSide,
            score: { self: spec.selfScore, enemy: spec.enemyScore },
            result: result,
            rankScoreChange: spec.queue === 'ranked'
                ? (result === 'victory' ? randint(rng, 16, 30) : -randint(rng, 12, 24))
                : null,
            teams: { self: teams.selfTeam, enemy: teams.enemyTeam },
            rounds: roundData.rounds
        };

        finalizePlayers(rng, match, allPlayers);
        return match;
    }

    /* ============================================
       数据集
       ============================================ */
    const MATCHES = MATCH_SPECS.map(generateMatch).sort(function (a, b) {
        return b.startedAtTs - a.startedAtTs;
    });
    const MATCH_BY_ID = MATCHES.reduce(function (acc, m) { acc[m.matchId] = m; return acc; }, {});

    function getSelfParticipant(match) {
        return match.teams.self.find(function (p) { return p.isSelf; });
    }

    /* ============================================
       查询与聚合
       ============================================ */
    function getAllMatches() {
        return MATCHES.slice();
    }

    function getMatchById(matchId) {
        return MATCH_BY_ID[matchId] || null;
    }

    function getMatchesByDate(date) {
        return MATCHES.filter(function (m) { return m.date === date; });
    }

    function queryMatches(options) {
        const opts = options || {};
        const mapId = opts.mapId || 'all';
        const result = opts.result || 'all';
        const offset = opts.offset || 0;
        const limit = opts.limit || MATCHES.length;

        const filtered = MATCHES.filter(function (m) {
            if (mapId !== 'all' && m.mapId !== mapId) return false;
            if (result !== 'all' && m.result !== result) return false;
            return true;
        });

        return {
            total: filtered.length,
            items: filtered.slice(offset, offset + limit),
            hasMore: offset + limit < filtered.length
        };
    }

    function getDailySummary(date) {
        const dayMatches = getMatchesByDate(date);
        if (!dayMatches.length) {
            return { date: date, matchCount: 0 };
        }

        const summary = {
            date: date,
            matchCount: dayMatches.length,
            wins: 0,
            losses: 0,
            mvpCount: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            headHits: 0,
            totalHits: 0,
            plants: 0,
            defuses: 0,
            firstKills: 0,
            multiKill3: 0,
            multiKill4: 0,
            multiKill5: 0,
            attackRounds: 0,
            attackRoundWins: 0,
            defenseRounds: 0,
            defenseRoundWins: 0,
            rankScoreChange: 0,
            bestMatch: null,
            bestCombatScore: -1
        };

        dayMatches.forEach(function (match) {
            const self = getSelfParticipant(match);
            if (match.result === 'victory') summary.wins += 1;
            else summary.losses += 1;
            if (self.mvp) summary.mvpCount += 1;
            summary.kills += self.kills;
            summary.deaths += self.deaths;
            summary.assists += self.assists;
            summary.headHits += self.headHits;
            summary.totalHits += self.headHits + self.bodyHits + self.legHits;
            summary.plants += self.plants;
            summary.defuses += self.defuses;
            summary.firstKills += self.firstKills;
            summary.multiKill3 += self.multiKill[3];
            summary.multiKill4 += self.multiKill[4];
            summary.multiKill5 += self.multiKill[5];
            if (match.rankScoreChange) summary.rankScoreChange += match.rankScoreChange;

            match.rounds.forEach(function (round) {
                if (round.selfSide === 'attack') {
                    summary.attackRounds += 1;
                    if (round.winner === 'self') summary.attackRoundWins += 1;
                } else {
                    summary.defenseRounds += 1;
                    if (round.winner === 'self') summary.defenseRoundWins += 1;
                }
            });

            if (self.combatScore > summary.bestCombatScore) {
                summary.bestCombatScore = self.combatScore;
                summary.bestMatch = match;
            }
        });

        // 百分比均可由离散场次还原（如 3胜1负 · 75.0%）
        summary.winRate = Math.round((summary.wins / summary.matchCount) * 1000) / 10;
        summary.kd = summary.deaths > 0 ? Math.round((summary.kills / summary.deaths) * 10) / 10 : summary.kills;
        summary.kda = summary.deaths > 0
            ? Math.round(((summary.kills + summary.assists) / summary.deaths) * 10) / 10
            : summary.kills + summary.assists;
        summary.headshotRate = summary.totalHits > 0
            ? Math.round((summary.headHits / summary.totalHits) * 1000) / 10
            : 0;
        summary.attackWinRate = summary.attackRounds > 0
            ? Math.round((summary.attackRoundWins / summary.attackRounds) * 1000) / 10
            : 0;
        summary.defenseWinRate = summary.defenseRounds > 0
            ? Math.round((summary.defenseRoundWins / summary.defenseRounds) * 1000) / 10
            : 0;

        return summary;
    }

    /* ============================================
       赛季汇总（由对局明细聚合，补充指标为演示固定值）
       ============================================ */
    function getSeasonSummary() {
        const matches = getAllMatches();
        const summary = {
            matchCount: matches.length,
            wins: 0,
            losses: 0,
            mvpCount: 0,
            kills: 0,
            deaths: 0,
            totalCombatScore: 0,
            headHits: 0,
            totalHits: 0,
            plants: 0,
            defuses: 0
        };

        matches.forEach(function (match) {
            const self = getSelfParticipant(match);
            if (match.result === 'victory') summary.wins += 1;
            else summary.losses += 1;
            if (self.mvp) summary.mvpCount += 1;
            summary.kills += self.kills;
            summary.deaths += self.deaths;
            summary.totalCombatScore += self.combatScore;
            summary.headHits += self.headHits;
            summary.totalHits += self.headHits + self.bodyHits + self.legHits;
            summary.plants += self.plants;
            summary.defuses += self.defuses;
        });

        summary.winRate = summary.matchCount > 0
            ? Math.round((summary.wins / summary.matchCount) * 1000) / 10
            : 0;
        summary.kd = summary.deaths > 0
            ? Math.round((summary.kills / summary.deaths) * 100) / 100
            : summary.kills;
        summary.avgScore = summary.matchCount > 0
            ? Math.round(summary.totalCombatScore / summary.matchCount)
            : 0;
        summary.headshotRate = summary.totalHits > 0
            ? Math.round((summary.headHits / summary.totalHits) * 1000) / 10
            : 0;

        // 演示补充指标（对局明细暂不可推导，接入真实接口后替换）
        summary.mvpLikes = 17;          // MVP点赞数
        summary.hitRate = 31.8;         // 命中率
        summary.plantGuardKills = 11;   // 累计守护炸弹击杀
        summary.plantDenyKills = 8;     // 累计阻止安装击杀

        return summary;
    }

    /* ============================================
       格式化辅助（三端页面共用）
       ============================================ */
    function fmtNumber(n) {
        return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function fmtPercent(value) {
        return value.toFixed(1) + '%';
    }

    function fmtDuration(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + '分' + (s > 0 ? s + '秒' : '');
    }

    function fmtDateLabel(date) {
        return date.slice(5).replace('-', '-');
    }

    /* ============================================
       一致性校验（开发期自检，返回问题列表）
       ============================================ */
    function validate() {
        const issues = [];

        MATCHES.forEach(function (match) {
            const selfRoundWins = match.rounds.filter(function (r) { return r.winner === 'self'; }).length;
            const enemyRoundWins = match.rounds.length - selfRoundWins;
            if (selfRoundWins !== match.score.self || enemyRoundWins !== match.score.enemy) {
                issues.push(match.matchId + ': 比分与回合胜负统计不一致');
            }
            if (Math.max(match.score.self, match.score.enemy) !== RULESET.roundsToWin) {
                issues.push(match.matchId + ': 获胜方未达到规则胜分');
            }
            if (match.rounds.length > RULESET.maxRounds) {
                issues.push(match.matchId + ': 回合数超过规则上限');
            }

            const allPlayers = match.teams.self.concat(match.teams.enemy);
            const firstKillTotal = allPlayers.reduce(function (sum, p) { return sum + p.firstKills; }, 0);
            if (firstKillTotal !== match.totalRounds) {
                issues.push(match.matchId + ': 首杀总数不等于回合数');
            }

            allPlayers.forEach(function (p) {
                const teamKey = match.teams.self.indexOf(p) >= 0 ? 'self' : 'enemy';
                const attackRounds = match.rounds.filter(function (r) {
                    return (r.selfSide === 'attack' ? 'self' : 'enemy') === teamKey;
                }).length;
                const enemyPlantRounds = match.rounds.filter(function (r) {
                    return r.plantBy && (r.selfSide === 'attack' ? 'self' : 'enemy') !== teamKey;
                }).length;
                if (p.plants > attackRounds) {
                    issues.push(match.matchId + '/' + p.name + ': 下包次数超过进攻回合数');
                }
                if (p.defuses > enemyPlantRounds) {
                    issues.push(match.matchId + '/' + p.name + ': 拆包次数超过对方安放回合数');
                }
                if (p.kills > match.totalRounds * RULESET.teamSize) {
                    issues.push(match.matchId + '/' + p.name + ': 击杀数超出理论上限');
                }
                if (p.headHits + p.bodyHits + p.legHits <= 0) {
                    issues.push(match.matchId + '/' + p.name + ': 命中数据为空');
                }
            });
        });

        const daily = getDailySummary(DAILY_DATE);
        if (daily.matchCount > 0) {
            if (Math.abs(daily.winRate - (daily.wins / daily.matchCount) * 100) > 0.11) {
                issues.push('日报胜率无法由胜负场次还原');
            }
            if (!daily.bestMatch || daily.bestMatch.date !== DAILY_DATE) {
                issues.push('日报最佳对局不属于当日');
            }
        }

        return issues;
    }

    /* ============================================
       导出
       ============================================ */
    global.DemolitionMock = {
        ruleset: RULESET,
        seasonId: SEASON_ID,
        dailyDate: DAILY_DATE,
        currentPlayer: CURRENT_PLAYER,
        maps: MAPS,
        endReasonLabels: END_REASON_LABELS,
        getAllMatches: getAllMatches,
        getMatchById: getMatchById,
        getMatchesByDate: getMatchesByDate,
        getDailySummary: getDailySummary,
        getSeasonSummary: getSeasonSummary,
        getSelfParticipant: getSelfParticipant,
        queryMatches: queryMatches,
        validate: validate,
        fmt: {
            number: fmtNumber,
            percent: fmtPercent,
            duration: fmtDuration,
            dateLabel: fmtDateLabel
        }
    };

    // 浏览器环境加载时做一次自检，问题仅输出到控制台
    if (typeof window !== 'undefined' && typeof console !== 'undefined') {
        const issues = validate();
        if (issues.length) {
            console.warn('[DemolitionMock] 数据一致性问题:', issues);
        }
    }
})(typeof window !== 'undefined' ? window : globalThis);
