# DFoversea · Delta Force 工具站（三角洲行动海外版）

面向游戏《三角洲行动》(Delta Force) 的静态网页工具站，提供每日数据、我的数据、改枪方案/推荐、交易制造等配套功能，并包含一套 Discord 改枪码发布/同步的集成方案与原型。

纯 HTML / CSS / 原生 JavaScript 实现，**无构建步骤、无包管理器、无服务端代码**，可直接静态部署。

## 技术栈

- 原生 HTML + CSS + Vanilla JS，无框架、无 npm、无 bundler
- i18n 模块通过 `fetch()` 加载 `locales/*.json`，因此必须通过 HTTP 服务访问（不能直接 `file://` 打开）
- 语言偏好持久化在 `localStorage` 的 `df-language` 键
- 当前支持语言：`zh-CN`（简体中文）、`de`（德语）

## 本地运行

```bash
# 在仓库根目录（或任意要预览的子目录）执行
npx serve .
# 或
python -m http.server 8080
```

然后访问 `http://localhost:3000/desktop/` 或 `http://localhost:8080/desktop/` 等。

> 根入口 `index.html` 会根据 User-Agent 自动检测设备并跳转到桌面端或移动端。

## 目录结构

```
index.html            根入口：设备检测后跳转 desktop / mobile
desktop/              桌面端（当前主力开发）
mobile/               移动端（当前主力开发）
shared/               双端共享的 mock 游戏数据（mock-data.js / gun-detail-mock.js）
discord/              Discord 集成：发布 skill、消息模板、发布记录、Webhook 工具
changelog-prototype/  更新日志管理端原型
discord-sync-prototype/  改枪方案 Discord 同步原型（含 PRD 与技术流程图）
analytics-dashboard/  数据分析看板原型（历史规划产物）
上线版本数分与埋点/    上线数据分析报告与埋点需求文档
枪械配件映射/          枪械配件映射处理数据（历史数据）
design.md             内容样式规范指引（UI 修改必须遵守）
CLAUDE.md             AI 助手协作指引
```

> 注：`desktop/`、`mobile/` 各自自包含（HTML 页面 + `main.js` + `i18n.js` + `main.css` + `locales/`）。

## 页面（桌面端 desktop/）

| 文件 | 用途 |
|---|---|
| `index.html` | 首页 / 每日数据（烽火日报、战场日报、改枪方案预览） |
| `my-data.html` | 我的数据（玩家战绩、K/D、对局历史） |
| `gun-plans.html` | 改枪方案 |
| `gun-builds.html` | 改枪推荐 |
| `craft.html` | 交易制造（制造/交易价格追踪） |

移动端 `mobile/mobile-prototype.html` 为单页应用（原型阶段）。

## 关键机制

- **Tab 切换**：tab 用 `data-tab` 存储类型，JS 切换 `.active` / `.hidden`
- **游戏模式**：`烽火地带`（Fenguo）与 `全面战场`（Zhanchang），多数组件在这两种模式间切换
- **登录模拟**：`main.js` 中的 `initDesktopLoginSystem()` 处理 mock 登录 UI，支持 Level Infinite 与 Garena 两种账号类型
- **Modal**：日报海报分享弹窗等遵循标准 overlay / 点击外部关闭模式

## Discord 集成（discord/）

| 路径 | 说明 |
|---|---|
| `discord/skill-update/discord-publisher/` | **改枪码发布 skill（当前版本）**：抓取 HQ Banner 配置、生成 16:9 分享卡、校验并发布英文论坛帖，维护操作/发布台账 |
| `discord/records/delta-force-publisher/` | 发布台账：`activity-log.jsonl`、`publish-log.jsonl`、`banner-builds`、`discord-tag-mapping` |
| `discord/examples/discord-payloads/` | Discord 消息模板（日报、改枪推荐、每日密码、周报等 JSON） |
| `discord/webhook-sender.*` | Webhook 发送工具（HTML/CSS/JS） |
| `discord/daily-password-generator.html` | 每日密码生成器 |
| `discord/Discord游戏集成功能整理.md` | Discord Activities + Rich Presence 集成规划 |
| `discord/改枪码DC同步-执行记录.md` | 改枪码同步执行记录 |

## 原型 / 需求文档

- `changelog-prototype/` — 更新日志红点提醒的管理端原型（发布 `changelogId` + 用户端红点比对）
- `discord-sync-prototype/` — 改枪方案同步 Discord 的管理端原型，需求文档 `DISCORD_SYNC_PRD.md` 已迭代至 v4.5
- `上线版本数分与埋点/` — 上线数据分析报告、埋点需求清单与文档
- `design.md` — 正式上线版本提炼的样式规范（直角切边、冷峻配色、品牌绿 `#24f4b2`）
