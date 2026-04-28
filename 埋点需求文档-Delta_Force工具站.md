# Delta Force 海外版工具站 — 数据埋点需求文档

> **产品名称**：Delta Force Tracker（三角洲行动海外版工具站）  
> **版本**：V1.0  
> **文档版本**：v1.3（双端拆分 · 两类事件版）  
> **撰写日期**：2026-03-12  
> **更新日期**：2026-03-25  
> **撰写人**：数据产品经理  
> **适用端**：Desktop (PC Web) + Mobile (H5)

---

## 一、文档说明

### 1.1 目的

本文档为 Delta Force 海外版工具站 V1.0 的数据埋点需求框架，提供给前后端开发团队实施埋点。Desktop 端与 Mobile 端采用**独立上报**策略，各端有独立的事件清单。文档不涉及 V1.0 注释隐藏的功能（Wiki 页、资产 Tab、地图工具、交易物价模块等）。

> 💡 **具体埋点事件清单**请参见配套文件：`埋点需求清单-Delta_Force工具站.xlsx`（含 Desktop 端清单、Mobile 端清单、双端差异对照表）

### 1.2 事件分类

所有埋点事件分为两类：

| 类型 | 命名前缀 | 说明 | 示例 |
|------|---------|------|------|
| **曝光** | `exp_` | 页面加载、模块进入可视区域、弹窗打开等「用户看到」的被动行为 | `exp_page`, `exp_daily_report`, `exp_login_modal` |
| **点击** | `click_` | 点击、切换、提交、复制、分享等「用户主动操作」的行为，含操作结果（通过 `success` 参数区分） | `click_login_entry`, `click_login_submit`, `click_copy_gun_code` |

### 1.3 命名规范

**事件名格式**：`{类型前缀}_{模块}_{动作}`

- 类型前缀：`exp_`（曝光）/ `click_`（点击）
- 模块名：小写英文，下划线分隔（如 `daily_report`, `gun_builds`, `craft`）
- 动作：动词或动词短语（如 `page`, `copy`, `share`, `submit`）
- 业务结果通过事件参数 `success: Boolean` 传递，不再单独设立事件类型

### 1.4 通用参数（每条事件默认携带）

| 参数名 | 类型 | 说明 |
|--------|------|------|
| `platform` | String | 端类型：`desktop` / `mobile` |
| `page_id` | String | 当前页面标识 |
| `user_id` | String | 用户ID（未登录传空） |
| `login_status` | String | `logged_in` / `guest` |
| `login_method` | String | 登录平台：`level_infinite` / `garena`（未登录传空） |
| `language` | String | 当前语言：`zh-CN` / `en` / `ja` / `ko` / `de` |
| `timestamp` | Long | 事件发生时间戳 |
| `session_id` | String | 会话ID |

---

## 二、页面结构总览

### Desktop 端（多页面架构）

| 页面 | 文件 | page_id | 说明 |
|------|------|---------|------|
| 首页 | `index.html` | `home` | 日报 + 密码 + 改枪推荐 + 制造 + 大红展馆 |
| 我的数据 | `my-data.html` | `my_data` | 个人资料 + 战绩数据（烽火/战场双模式） |
| 改枪推荐（独立页） | `gun-builds.html` | `gun_builds` | 枪械列表 + 改装方案（V1.0 导航隐藏但页面存在） |
| 交易制造（独立页） | `craft.html` | `craft_page` | 制造推荐 + 交易物价（V1.0 导航隐藏但页面存在） |

### Mobile 端（单页面架构，Tab 切换）

| 页面 | page_id | 说明 |
|------|---------|------|
| 首页 Tab | `m_home` | 日报 + 密码 + 收益 + 制造 + 改枪推荐 |
| 工具 Tab | `m_tools` | 制造推荐（交易物价 V1.0 隐藏） |
| 我的 Tab | `m_profile` | 个人资料 + 战绩 + 大红藏馆 |
| 物价详情子页面 | `m_price_detail` | 物品物价详情（从工具页点入） |

---

## 三、埋点模块概览与数据分析目标

> Desktop 端与 Mobile 端采用**独立事件清单**，各端具体埋点详见 Excel 文件对应 Sheet。此处列出各端模块划分与分析目标。

### 3.1 Desktop 端（28 条事件）

| 模块 | 事件数 | 核心分析目标 |
|------|--------|-------------|
| A：登录与账号 | 6 | 登录转化率、平台偏好、社交渠道使用率 |
| B：导航与页面 | 3 | 页面 PV/UV 热度、顶部导航使用分布、语言偏好 |
| C：日报模块 | 3 | 烽火/战场模式偏好、分享意愿 |
| D：今日密码 | 2 | 各地图密码使用热度排行 |
| E：改枪推荐 | 3 | 枪械关注度、⭐**改枪码复制次数**（含独立页来源区分） |
| F：特勤处制造 | 3 | Tab偏好、物品关注度（Hover Tooltip 交互） |
| G：大红展馆 | 2 | 海报分享渠道使用率（save_image / X / Facebook / Reddit） |
| H：分享功能 | 2 | ⭐**分享渠道转化率**（save_image / X / Discord / Facebook / Reddit） |
| K：我的数据 | 3 | 模式偏好、Profile 5 维度 Tab 关注度 |
| L：意见反馈 | 1 | 反馈提交率、成功率、内容完整度 |

### 3.2 Mobile 端（28 条事件）

| 模块 | 事件数 | 核心分析目标 |
|------|--------|-------------|
| A：登录与账号 | 6 | 登录转化率、平台偏好、社交渠道使用率 |
| B：导航与页面 | 3 | 各 Tab PV/UV 热度、底部导航使用分布、语言偏好 |
| C：日报模块 | 3 | 烽火/战场模式偏好、分享意愿 |
| D：今日密码 | 2 | 各地图密码使用热度排行（点击卡片打开指引弹窗） |
| E：改枪推荐 | 3 | 枪械关注度、⭐**改枪码复制次数**（仅首页内嵌） |
| F：特勤处制造 | 3 | Tab偏好、物品关注度（首页+工具Tab 双入口，区分 source） |
| G：大红藏馆 | 2 | 模块曝光量、各大红物品关注度排行 |
| H：分享功能 | 2 | ⭐**分享渠道转化率**（save_image / Discord / X / copy_link） |
| K：我的页面 | 3 | 模式偏好、战绩/大红藏馆 2 维度关注度 |
| L：意见反馈 | 1 | 反馈提交率、成功率、内容完整度 |

### 3.3 双端关键差异

| 差异点 | Desktop | Mobile |
|--------|---------|--------|
| 登录入口 | 顶部导航栏「Sign In」 | 「我的」Tab 内 |
| 退出登录 | 直接退出 | 确认弹窗后退出 |
| 导航方式 | 顶部导航栏链接 | 底部 Tab 导航 |
| 今日密码 | 直接展示 + 指引按钮 | 点击卡片打开弹窗 |
| 改枪推荐 | 首页内嵌 + 独立页 | 仅首页内嵌 |
| 制造交互 | Hover Tooltip | 点击底部抽屉弹窗 |
| 大红展馆 | 首页独立模块（海报分享） | 「我的」Tab 内（物品浏览） |
| 分享渠道 | save_image / X / Discord / Facebook / Reddit | save_image / Discord / X / copy_link |
| Profile 维度 | 总览/战绩/枪械/干员/地图（5项） | 战绩/大红藏馆（2项） |

---

## 四、关键用户路径（核心漏斗）

### 4.1 登录转化漏斗

```
首页曝光(exp_page) → 点击登录入口(click_login_entry) → 选择登录方式(click_login_method_select) → 登录弹窗曝光(exp_login_modal) → 提交登录(click_login_submit, success=true)
```

### 4.2 改枪码使用漏斗

```
改枪推荐曝光(exp_gun_builds) → 选择枪械(click_gun_selector) → 复制改枪码(click_copy_gun_code)
```

### 4.3 分享漏斗

```
日报曝光(exp_daily_report) → 点击分享按钮(click_daily_share_btn) → 海报弹窗曝光(exp_daily_poster_modal) → 选择分享渠道(click_daily_poster_share)
```

### 4.4 制造推荐使用漏斗

```
制造模块曝光(exp_craft) → 切换Tab(click_craft_main_tab) → 选中物品(click_craft_item)
```

---

## 五、核心指标看板建议

| 指标 | 计算方式 | 关注维度 |
|------|----------|----------|
| DAU / MAU | 每日/每月独立访客数 | 整体、按端拆分 |
| 登录率 | `click_login_submit(success=true)` / 总 UV | 按登录方式、社交渠道拆分 |
| 改枪码复制次数 | `click_copy_gun_code` 总数 | 按枪械、方案类型拆分 |
| 日报分享率 | `click_daily_poster_share` / `exp_daily_report` | 按分享渠道拆分 |
| 密码功能使用率 | `click_password_copy` / `exp_daily_password` | 按地图拆分 |
| 制造模块互动深度 | `click_craft_item` / `exp_craft` | 按工作台拆分 |
| 反馈提交率 | `click_feedback_submit(success=true)` / `click_feedback_submit` 总数 | — |
| 语言分布 | 按 `language` 参数分布 | — |

---

## 六、上报策略与注意事项

1. **双端独立上报**：Desktop 端和 Mobile 端各自使用独立的事件清单，独立上报。事件名相同但通过 `platform` 参数区分来源端。序号编码规则：`模块-D序号`（Desktop）/ `模块-M序号`（Mobile）。

2. **曝光事件去重**：同一会话内同一模块重复进入可视区域，仅上报首次曝光。

3. **登录态处理**：`user_id` 未登录时传空字符串，登录后补传。

4. **语言参数**：所有事件均携带当前界面语言，用于分析不同语言区用户行为差异。

5. **V1.0 不需要埋点的隐藏功能**：Desktop 被注释的导航链接、Mobile 隐藏的 Wiki Tab、交易物价模块（`display:none`）、资产 Tab。

6. **双端差异详情**：详见 Excel 文件「双端差异对照表」Sheet，涵盖页面架构、导航方式、交互差异等 13 项对照。

---

> 📎 **配套文件**：
> - `埋点需求清单-Delta_Force工具站.xlsx` — Desktop 端清单 + Mobile 端清单 + 双端差异对照表（开发实施用）
> - `埋点参考材料汇编.md` — 行业埋点规范与参考链接
