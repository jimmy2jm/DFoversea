# 改枪码推荐管理端 — 页面结构与 API 抓取记录

> 抓取时间：2026-07-10
> 抓取来源：https://playdeltaforce-cms.levelinfiniteapps.com/gun-codes?tab=sol （登录态下抓取，仅读取，未做任何写操作）
> 抓取方式：DOM/网络请求分析（非视觉截图），信息可靠性较高

---

## 一、系统整体架构

- 前端框架：Vue.js SPA（`<div id="app" data-v-app>`）
- 样式：Tailwind CSS（class 风格如 `flex h-screen border-df-border/15`）
- 域名：`playdeltaforce-cms.levelinfiniteapps.com`
- 登录：走 `login.levelinfiniteapps.com`（腾讯 OA / Ory 鉴权，cookie 含 `access_token` / `refresh_token`）

### 侧边栏导航（6 个模块）

| 模块 | 路由 |
|------|------|
| 资源数据库 | `/resource-db` |
| **改枪码推荐**（当前分析对象） | `/gun-codes` |
| 临时活动 | `/temp-activities` |
| 用户反馈 | `/user-feedbacks` |
| Twitch 插件管理 | `/twitch-plugin-management` |
| 操作记录 | `/operation-logs` |

---

## 二、改枪码推荐页面（/gun-codes）结构

### 顶部操作栏

| 按钮 | 说明 |
|------|------|
| 发布 | 批量发布操作 |
| 烽火配置 / 全面战场配置 | 模式 Tab 切换，对应 API 参数 `mode=sol` / `mode=mp` |
| 烽火运营位（LI）/ 全面战场运营位（LI） | LevelInfinite 渠道运营位配置 |
| 烽火运营位（GA）/ 全面战场运营位（GA） | GoogleAds 渠道运营位配置 |
| 标签编辑 | 标签库管理 |
| 作者库编辑 | 作者库管理 |

### 方案列表表格列

方案ID / 预览图 / 方案名称 / 关联枪械 / 渠道（LI/GA） / 改枪码 / 标签 / 作者信息 / 优先级 / 最后编辑 / 发布状态 / 更新时间 / 操作（编辑/删除）

### 筛选区

方案名称、ID精确搜索、标签筛选、搜索作者、搜索武器、渠道筛选（全部渠道）、查询、重置

### 分页

每页显示 10/... 条，共 74 条记录（烽火），支持翻页

---

## 三、核心 API 清单

### 1. 方案列表

```
GET /api/cms/gun-codes/schemes?mode=sol&page=1&page_size=10&sort_field=updated_at&sort_order=desc
GET /api/cms/gun-codes/schemes?mode=mp&page=1&page_size=10&sort_field=updated_at&sort_order=desc
```

按枪械+渠道筛选：
```
GET /api/cms/gun-codes/schemes?mode=sol&gun_id=18010000015&channel=LI&page_size=100
GET /api/cms/gun-codes/schemes?mode=sol&gun_id=18010000037&channel=GA&page_size=100
```

**返回结构（单条方案）**：

```json
{
  "id": 416,
  "mode": "sol",
  "name": "Mid & Close range Warfare weapon",
  "gun_code": "6KCH4LC0BET1KQ9O3SCOA",
  "channel": "LI",
  "image_url": "https://www.playdeltaforce.com/gun-codes/images/1783327139033_p6z2e3.webp",
  "config_data": {
    "guncode_result": {
      "gun_id": "18010000024",
      "gun_info": {
        "gun_id": "18010000024",
        "name": "PTR-32突击步枪",
        "name_zh_tw": "PTR-32突擊步槍",
        "image_url": "https://www.playdeltaforce.com/basic_info/guns_xxx.png",
        "category": "步枪",
        "i18n": {
          "zh": "PTR-32突击步枪", "en": "PTR-32 Assault Rifle",
          "de": "...", "fr": "...", "ru": "...", "ja": "...",
          "ko": "...", "zh-TW": "...", "es": "...", "pt": "...",
          "tr": "...", "ar": "...", "vi": "...", "th": "...", "id": "..."
        }
      },
      "components": [
        {
          "slot": 2,
          "slot_info": { "name": "枪管", "name_zh_tw": "槍管", "attachment_type": "枪管" },
          "prop_data": {
            "attachment_info": {
              "name": "G3平台神射枪管组合",
              "image_url": "https://www.playdeltaforce.com/basic_info/attachments_xxx.png",
              "category": "枪管",
              "grade": "4"
            },
            "components": [ /* 嵌套子配件，如枪口/护木下挂载件 */ ]
          }
        }
        /* ... 更多 slot：护木/瞄准镜/弹匣/枪托/后握把/前握把等 */
      ],
      "missing_attachments": [ { "id": "13050000320", "slot": 4 } ]
    },
    "name_i18n": { "en": "Mid & Close range Warfare weapon" },
    "tags_snapshot": [
      { "id": 1, "name": "赛事同款", "color": "#0962ae" },
      { "id": 22, "name": "火力压制", "color": "#aae4aa" },
      { "id": 31, "name": "性能均衡", "color": "#da5758" }
    ]
  },
  "gun_id": "18010000024",
  "gun_name": "PTR-32突击步枪",
  "price": null,
  "priority": 1,
  "last_editor": "v_ycnnyuan",
  "created_at": "2026-07-06T08:39:02.000Z",
  "updated_at": "2026-07-06T09:10:21.000Z",
  "sync_status": 1,
  "synced_at": "2026-07-06T09:10:21.000Z",
  "tag_ids": [1, 22, 31],
  "author_ids": [42]
}
```

> 关键点：
> - `mode`: `sol`=烽火（撤离），`mp`=全面战场
> - `channel`: `LI`（LevelInfinite）/ `GA`（GoogleAds），同一方案可能有多渠道版本
> - `config_data.guncode_result.components` 是**嵌套树结构**，每个 slot 可能挂子配件（如枪管下挂枪口，护木下挂贴片+前握把）
> - `sync_status` / `synced_at` 字段已存在，说明管理端本身已有"同步状态"概念（可能用于其他同步场景，可复用字段设计思路）
> - `i18n` 覆盖 14 种语言：zh / en / de / fr / ru / ja / ko / zh-TW / es / pt / tr / ar / vi / th / id
> - `image_url` 已是可直接访问的完整图片 URL（webp 格式，托管在 playdeltaforce.com）

### 2. 标签列表

```
GET /api/cms/gun-codes/tags?page=1&page_size=9999
```

**返回结构**：
```json
{
  "id": 1,
  "name": "赛事同款",
  "color": "#0962ae",
  "sort_order": 1,
  "i18n": { "zh": "赛事同款", "en": "Tournament Edition", "ja": "大会仕様", ... },
  "creator": "v_ycnnyuan",
  "created_at": "2026-05-13T15:43:21.000Z",
  "updated_at": "2026-05-13T15:43:21.000Z",
  "used_count": 2
}
```

已知标签样例（部分）：赛事同款、高稳定性、伤害提升、版本增强、洲末品枪、近战适用、通用键位、夜战专用、侦察专用、修脚神器、玻璃大炮、高性价比、机动性强、稳定灵活、超高射速、高阶操作、探头灵活、新手推荐、20w低配 ...

### 3. 作者标签

```
GET /api/cms/gun-codes/author-tags?page=1&page_size=9999
```

### 4. 运营位配置（4 种模式组合）

```
GET /api/cms/gun-codes/op-config?mode=sol      // 烽火 · LI
GET /api/cms/gun-codes/op-config?mode=mp       // 全面战场 · LI
GET /api/cms/gun-codes/op-config?mode=sol_ga   // 烽火 · GA
GET /api/cms/gun-codes/op-config?mode=mp_ga    // 全面战场 · GA
```

### 5. 武器搜索

```
GET /api/cms/gun-codes/search?type=guns&keyword=
```

### 6. 鉴权

```
POST /api/auth/check
```
Cookie 含：`login_type` / `username` / `access_token`（ory_at_ 前缀，Ory Hydra/Kratos 鉴权体系）/ `refresh_token` / `expire_timestamp` / `sign`

---

## 四、数据规模现状（抓取时刻）

- 烽火（sol）方案：**74 条**，已发布方案居多
- 全面战场（mp）方案：未完全展开，但结构一致
- 渠道：LI、GA 两种，同一 gun_id 可能在两个渠道各有独立方案
- 更新频率：观察到的记录多为近期批量更新（如 2026-07-06 17:10:21 同一批次多条），说明存在"批量导入/批量发布"的运营习惯

---

## 五、对 Discord 同步功能设计的关键启示

1. **方案数量级**：74+ 条（仅烽火单一模式），加上 mp 模式和两个渠道（LI/GA），总量可能达到 **200-300+ 条**。同步功能必须考虑批量操作和分批发送，不能假设"少量方案手动点选"。
2. **多渠道设计**：LI / GA 渠道概念已存在于源数据中，Discord 同步的"频道"概念可以复用或对应渠道（但也可能是独立的 Discord 服务器区分，需与产品确认）。
3. **多语言完备**：`i18n` 已覆盖 14 种语言，为 Discord 多语言频道（如 Japan 频道用 `ja` 字段）提供了数据基础，且可扩展到更多语言频道而非仅 Global/Japan 两个。
4. **已有同步状态字段**：`sync_status` / `synced_at` 已存在于源数据结构，proto 中自建的 `sync` 字段可与之对齐，减少后端改动。
5. **配件数据复杂**：`config_data.guncode_result.components` 是深层嵌套结构，转换为 Discord Embed 时需要做**扁平化摘要**（不能直接把整树扔进消息），需要设计"哪些 slot 展示在 Discord 卡片上"的规则（例如只展示一级 slot 的 attachment_info.name，忽略嵌套子件，或最多展示 5-6 个核心部位）。
6. **`priority` 字段（已澄清）**：产品已确认该字段仅用于工具站内的方案展示排序，**不代表方案的紧急程度/重要性**，因此 Discord 同步逻辑中不应基于该字段做"优先发布"之类的判断，仅可用于列表展示排序。
7. **方案的"渠道"和"模式"是两个独立维度**（mode: sol/mp，channel: LI/GA），排列组合是 4 种；Discord 同步逻辑需要明确：是否所有渠道方案都同步，还是只同步某个渠道（如只同步 LI，因为 GA 可能是特定投放渠道不适合公开发到社区）。

---

## 六、待与产品/开发确认的问题（本次抓取无法获知）

- [ ] Discord 目标服务器/频道数量和命名规则（Global / Japan 是否为最终形态，是否要支持更多语言频道）
- [ ] LI / GA 渠道方案是否都需要同步到 Discord，还是只同步 LI
- [ ] 是否需要区分 sol（烽火）和 mp（全面战场）两个 Discord 频道，还是同一频道用标签区分
- [ ] 方案更新后（如改了配件），已同步的 Discord 帖子是否需要联动更新，还是仅追加新帖
- [ ] 已发布到 Discord 的帖子若被官方/社区举报删除，管理端如何感知并处理映射关系
