# 改枪码 Discord 同步 · 执行记录

> 记录改枪码内容同步到 Discord 论坛频道的完整方案、工具与踩坑点。
> 最后更新：2026-07-30

---

## 1. 背景与目标

把三角洲行动的**改枪码**内容，以规范化的卡片样式同步到 Discord 论坛频道（Forum Channel），
供海外玩家快速查看并一键复制使用。

核心信息字段：方案名称、枪械价格、改枪码、方案介绍、配装图、论坛标签。

---

## 2. 已交付内容

| 文件 | 说明 | 是否进版本库 |
|---|---|---|
| `discord/webhook-sender.html` | 工具页面结构（154 行） | ✅ |
| `discord/webhook-sender.css` | 工具样式（177 行，遵循 `design.md` 军事硬核风） | ✅ |
| `discord/webhook-sender.js` | 工具主逻辑（约 970 行，**不含任何真实凭证**） | ✅ |
| `discord/webhook-config.example.js` | 环境配置模板（占位符） | ✅ |
| `discord/webhook-config.js` | **本机私有配置**（含真实 Webhook 与标签） | ❌ 已 gitignore |
| `discord/examples/discord-payloads/改枪码论坛帖子模板.json` | 给开发用的变量占位模板 | ✅ |
| `discord/examples/discord-payloads/改枪码论坛帖子模板-EN示例.json` | 英文版示例（可直接测试） | ✅ |
| `discord/examples/discord-payloads/改枪码论坛帖子模板-JP示例.json` | 日文版示例（可直接测试） | ✅ |
| `discord/前端代码复制`、`前端代码复制-测试` | 标签栏 DOM 原始备份（含频道 ID） | ❌ 已 gitignore |

### 2.1 代码结构与迭代说明

工具为**纯前端、零依赖、零构建**，拆分为四个文件便于按需迭代：

```
webhook-sender.html   仅结构，改 UI 时动这里
webhook-sender.css    仅样式，改视觉时动这里
webhook-sender.js     全部逻辑，改功能时动这里
webhook-config.js     环境数据（凭证/频道/标签），换频道时只动这里
```

`webhook-sender.js` 内部按注释分区，顺序为：

```
配置读取 → 消息模板 → Webhook 预设 → 论坛标签 → JSON 处理
→ 限制校验 → 自定义模板 → 本地附件 → 预览渲染 → 发送
→ 历史与撤回 → 事件绑定 → 初始化
```

localStorage 键位：

| 键 | 内容 |
|---|---|
| `df-webhook-cfg` | 当前选中的预设索引 |
| `df-webhook-presets` | 预设列表（含各频道标签集） |
| `df-webhook-mytpl` | 用户自定义消息模板 |
| `df-webhook-hist` | 发送历史（含 message_id，撤回依赖它） |

> ⚠️ localStorage 中的预设**优先于**配置文件。改了 `webhook-config.js` 后若界面没变化，
> 点界面最下方「重置全部预设」即可重新载入配置。

### 2.2 迭代自检清单

改完代码后建议跑一遍（无需任何依赖）：

```bash
cd discord && node -e "
const fs=require('fs');
['webhook-sender.js','webhook-config.js'].forEach(f=>{
  try{ new Function(fs.readFileSync(f,'utf8')); console.log('✓ '+f); }
  catch(e){ console.log('✗ '+f+'：'+e.message); }
});
const html=fs.readFileSync('webhook-sender.html','utf8');
const js=fs.readFileSync('webhook-sender.js','utf8');
const miss=[...new Set([...js.matchAll(/\\\$\('([A-Za-z]+)'\)/g)].map(x=>x[1]))]
  .filter(id=>!new RegExp('id=\"'+id+'\"').test(html));
console.log(miss.length? '✗ 缺失 id: '+miss.join(', ') : '✓ 元素 id 齐全');
console.log(/discord\.com\/api\/webhooks\/\d+\//.test(js)? '✗ 主逻辑含真实凭证' : '✓ 主逻辑无凭证');
"
```

---

## 3. 本地工具使用说明

### 3.1 启动

工具依赖 `fetch` 跨域请求，且拆分后需加载同目录的 css/js，**必须通过 http 访问，不能用 `file://` 打开**：

```bash
cd /Users/jimmmywang/Documents/DFoversea
python3 -m http.server 8090
```

访问：`http://localhost:8090/discord/webhook-sender.html`

> 注：8080 端口本机已被其他服务占用，故使用 8090。
> 首次使用需确保 `discord/webhook-config.js` 存在（可从 `webhook-config.example.js` 复制）。

### 3.2 功能清单

| 模块 | 能力 |
|---|---|
| **Webhook 预设** | 下拉切换不同频道，每个预设自带 URL / Thread ID / **该频道的标签集**；支持新增、重命名、删除 |
| **论坛标签** | 标签点选（自动填 ID）；支持从前端 DOM 批量导入；内置控制台取标签脚本；最多 5 个（Discord 上限） |
| **消息编排** | JSON 编辑器、内置 EN/JP 模板、自定义模板保存、格式化、静默发送开关 |
| **本地附件** | 拖拽/选择上传图片，自动生成 `attachment://` 引用，缩略图确认，10MB 上限拦截 |
| **实时预览** | 近似 Discord 渲染（embed 卡片、代码块、Markdown、色条、标签、静默标记） |
| **发送前校验** | 字段超长、数量超限、空字段、附件缺失、Thread 冲突、标签缺失等逐条提示 |
| **发送** | 自动带 `wait=true` 获取 message_id；429 限流按 `retry_after` 自动重试（最多 3 次） |
| **历史管理** | 记录 message_id / thread_id / 跳转链接；支持删除（撤回）、更新内容、载入重编辑、导出 JSON |
| **快捷键** | `⌘/Ctrl + Enter` 发送 |

---

## 4. 频道配置数据

### 4.1 测试频道

- 论坛频道 ID：`1526132620503552150`
- Webhook：见本机 `discord/webhook-config.js`（不进版本库）

| 标签 | ID |
|---|---|
| operation | `1526132895343841431` |
| Warfare | `1526132928843616316` |
| 步枪 | `1526132956232421437` |
| 精确射手步枪 | `1526132976663007322` |
| 冲锋枪 | `1526132991129030729` |

### 4.2 正式频道

- 论坛频道 ID：`1314164395168763915`
- Webhook：**待提供**（拿到后填入 `webhook-config.js` 的「正式频道」预设，或在界面填好后点「保存到当前预设」）

| 标签 | ID |
|---|---|
| Operations | `1314164655408812092` |
| Warfare | `1314164668335390823` |
| Pistols | `1314164750699069480` |
| SMG | `1314164766557863996` |
| AR | `1314164775587942421` |
| BR | `1314164790683369542` |
| Shotguns | `1314164814121144361` |
| LMG | `1314164828704735274` |
| MR | `1314164840138412052` |
| SR | `1314164849982312448` |
| Garena | `1318109541153636412` |
| Global | `1318109578017247243` |

> ⚠️ 测试频道与正式频道标签体系不一致（测试为中文枪械类型，正式为英文缩写），
> 建议后续统一，以保证测试效果具备参考价值。

### 4.3 标签 ID 获取方式

标签 ID **无法通过右键复制**（Discord 只支持复制频道/消息 ID），且 Webhook Token 无权调
`GET /channels/{id}` 读 `available_tags`（需 Bot Token）。可行办法：

1. **控制台脚本**（推荐）：在 Discord 网页版打开论坛频道 → F12 → 粘贴执行
   ```js
   console.table([...document.querySelectorAll('[data-list-item-id*="forum-tag-"]')]
     .map(e=>({name:e.textContent.trim(),id:/forum-tag-(\d+)/.exec(e.dataset.listItemId)[1]})))
   ```
2. **复制 DOM**：复制标签栏 `tagListInner` 那一整块 HTML，用工具的「为当前预设导入标签」解析
   - 规律：`data-list-item-id="{频道ID}-tags-navigator___forum-tag-{标签ID}"`

---

## 5. 消息模板规范

### 5.1 帖子标题（thread_name）

格式：**价格 + 枪名 + build**

| 语言 | 示例 |
|---|---|
| EN | `340K M4A1 Build` |
| JP | `34万 M4A1 ビルド` |
| ZH（仅内部核对） | `34万 M4A1 改枪方案` |

### 5.2 正文结构

不使用 `author` / `color` / `footer` / 装饰性 emoji（早期版本因绿色色条与图文断层问题已移除）。
采用 **embed title + image + 3 个 fields** 的结构，靠 field 原生的"加粗小标题 + 正文"形成层级：

```json
{
  "thread_name": "340K M4A1 Build",
  "content": "",
  "embeds": [{
    "title": "340K M4A1 Build",
    "image": { "url": "..." },
    "fields": [
      { "name": "PRICE",       "value": "₽340,000", "inline": false },
      { "name": "GUN CODE",    "value": "```\n<改枪码>\n```", "inline": false },
      { "name": "DESCRIPTION", "value": "<方案介绍>", "inline": false }
    ]
  }]
}
```

### 5.3 多语言字段标题对照

| 字段 | EN | JP | ZH（参考） |
|---|---|---|---|
| 价格 | PRICE | 価格 | 价格 |
| 改枪码 | GUN CODE | 改造コード | 改枪码 |
| 方案介绍 | DESCRIPTION | 解説 | 方案介绍 |

### 5.4 复制体验

改枪码**必须单独放在代码块**（```` ``` ````）内，且代码块中只放码本身：
- Discord 桌面/网页端代码块右上角有悬浮「复制」图标，可一键复制
- 不夹杂 emoji / 说明文字，避免复制出多余字符导致游戏内导入失败

---

## 6. 技术要点备忘（踩坑记录）

### 6.1 论坛频道发帖

- Webhook 必须**直接创建在该论坛频道上**
- 新建帖子：请求体带 `thread_name`；回复已有帖子：URL 带 `?thread_id=`，**二者互斥**
- 缺 `thread_name` 向论坛发消息 → **405**
- 频道强制要求标签但未传 `applied_tags` → **400**
- `applied_tags` **仅新建帖子有效**，向已有帖子发消息会被忽略

### 6.2 消息删除 / 编辑

- 发送时必须带 `?wait=true`，否则只返回 204 空响应，**拿不到 message_id 就无法事后删除**
- 删除：`DELETE /webhooks/{id}/{token}/messages/{message_id}`，
  论坛帖/线程内的消息**必须额外带 `?thread_id=`**，否则 404
- ⚠️ **论坛帖首条消息即帖子本体，删除它会连带删除整个帖子**
- 编辑：同路径用 `PATCH`；但**无法重新上传附件**，含 `attachment://` 的消息只能删除重发
- 帖子标题（thread_name）创建后**无法通过 API 修改**，只能在客户端手动改

### 6.3 图片

- 外链：`embeds[].image.url` 直接填 URL
- 本地文件：必须用 `multipart/form-data`，`payload_json` 放 JSON + `files[n]` 放文件，
  JSON 内用 `attachment://文件名` 按文件名引用
- 附件随消息一次性上传，**不会自动成为永久图床**，需复用的图建议先上图床

### 6.4 频率限制

- **频道慢速模式（slowmode / `rate_limit_per_user`）对 Bot 和 Webhook 完全无效**，
  官方文档明确 "bots ... are unaffected"，无需自行模拟等待间隔
- 真正的限制是 API 速率限制：**单个 Webhook 5 次 / 2 秒**；全局 50 次/秒
- 超限返回 **429**，响应体带 `retry_after`（秒），按值等待重试即可

### 6.5 批量发送的"打扰"问题

区分两个层面，解法不同：

| 问题 | 解法 |
|---|---|
| **通知打扰**（手机狂震） | 消息带 `flags: 4096`（`SUPPRESS_NOTIFICATIONS`），正常显示但不推送通知 |
| **信息流刷屏**（列表被瞬间灌满） | 自行设置发送间隔、错峰分布，或把多条内容合并为单帖 |

### 6.6 Embed 视觉限制

- `color` 字段渲染出的**左侧竖色条无法自定义**（粗细/位置/样式都是平台固定），
  不想要就只能不设 `color`
- 色条沿整个 embed 高度延伸；图片作为**独立附件**发送时在 embed 外，会造成"图上文下"的断层感，
  放进 `embeds[].image` 才是同一张卡片
- `[显示文字](链接)` 这种隐藏文字超链接**仅在 Webhook/Bot/Embed 消息中生效**，
  普通用户手打无效（Discord 反钓鱼设计），手打只能用裸链接

### 6.7 字段限制（工具已内置校验）

| 项 | 上限 |
|---|---|
| content | 2000 |
| embed title | 256 |
| embed description | 4096 |
| field name | 256 |
| field value | 1024 |
| footer | 2048 |
| fields 数量 | 25 |
| embeds 数量 | 10 |
| 单条消息 embed 文本总量 | 6000 |
| thread_name | 100 |
| applied_tags | 5 |
| 单文件大小 | 10MB（免费额度） |

---

## 7. 国内延伸方案调研结论

| 阵地 | 自动化能力 | 结论 |
|---|---|---|
| **QQ频道** | 有 `PUT /channels/{id}/threads` 发帖接口，支持 Markdown / **JSON(RichText)** | **国内首选**。但发帖能力**仅私域机器人**开放（公域不支持申请）；RichText 支持分段/图片/视频/链接/加粗，**不支持代码块与卡片容器**，复制体验需靠自建网页承载 |
| QQ频道 ARK 消息 | 全场景（单聊/群聊/频道/私信）支持结构化卡片 | 需向官方申请专属模板 ID，官方项目可走绿色通道 |
| QQ频道 Markdown | 频道场景需内邀开通 | 建议内部找 QQ 开放平台对接人确认资格 |
| TapTap / 百度贴吧 | 无开放发帖接口 | 玩家密度最高，但只能人工搬运 |
| 企业微信群机器人 | 有 Webhook，支持图文卡片 | 能力弱、非玩家阵地，仅适合内部群 |
| 抖音 / 小红书 | 内容发布 API 面向企业级图文视频 | **不适用**，形态与规则均不匹配 |
| KOOK | 能力最接近 Discord（Webhook + 卡片消息 JSON + 可视化编辑器） | 已排除：非官方运营渠道 |

---

## 8. 待办

### 内容侧
- [ ] 正式频道 Webhook URL 待提供并填入 `webhook-config.js`
- [ ] 统一测试频道与正式频道的标签体系
- [ ] 多语言字段标题的最终文案确认（EN / JP）
- [ ] 配装图的图床方案确认（长期复用需固定 URL）

### 工具侧（下一步迭代方向）
- [ ] **批量队列发送**：多条内容 + 自定义间隔 + 静默 flag，解决一次发十几二十条的打扰问题
- [ ] **表单模式**：免 JSON，直接填「方案名/价格/改枪码/介绍/图片」自动生成，供运营同事使用
- [ ] **AI 接入**（BYOK 模式，见下）
- [ ] 从已发消息拉取内容回填（`GET /webhooks/{id}/{token}/messages/{message_id}`）

### AI 接入设计要点

若接入 AI，必须采用 **BYOK（Bring Your Own Key）** 模式以维持"零服务器、零凭证托管"的架构：

- 用户填写自己的 AI API Key，与 Webhook 同样只存本机 localStorage
- 浏览器**直接调用** AI 厂商 API，不经过任何中转服务
- 好处：无服务器成本、不承担 AI 调用费用、不接触用户数据

优先级建议（按"能省多少重复劳动"排序，而非按"技术炫酷度"）：

1. **截图 → 结构化字段**（多模态）：上传游戏内改枪界面截图，自动提取枪名/价格/改枪码填入模板
2. **一份内容 → 多语言批量**：保持 JSON 结构不变只翻译值，并自动校验各语言是否超字符限制
3. **表格/纯文本 → 批量帖子**：粘贴 CSV 或一段乱序文本，拆成 N 条结构化消息配合队列发送
4. **规范守卫**：依据品牌规范（如 `design.md`）检查生成内容一致性

> 定位提醒：不要做成"带 AI 的 Discohook"（正面竞争必败，且对方免费）。
> 价值应落在 Discohook 官方明确不做的事上——**自动化、批量、多语言、多平台分发**。

---

## 9. 安全与开源注意事项

### 9.1 凭证安全

⚠️ Webhook URL 等价于该频道的**写入凭证**，泄露后任何人都能向频道发消息。

现有设计已做的防护：

| 措施 | 说明 |
|---|---|
| 凭证外置 | 全部真实凭证集中在 `webhook-config.js`，已加入 `.gitignore` |
| 主逻辑干净 | `webhook-sender.js` / `.html` / `.css` 不含任何真实 Webhook 与频道 ID |
| 无服务端 | 配置只存本机 localStorage，请求由浏览器直发 Discord，不经任何中转 |
| DOM 备份隔离 | `前端代码复制*`（含频道 ID）已 gitignore |

如发生泄露：频道设置 → 整合 → 删除该 Webhook 并重建即可（旧 URL 立即失效）。

### 9.2 若考虑开源，先处理这三件事

1. **合规前置（硬阻塞）**：本工具为工作场景需求所开发，可能涉及职务作品归属、
   保密信息（频道 ID / 标签体系 / 内部调研结论）、竞业限制等问题。
   **开源前必须先走公司内部审批流程确认。**
2. **彻底信息剥离**：真实 Webhook、频道 ID、标签数据、改枪码示例全部替换为占位符；
   叙事改为通用工具视角，不提具体游戏项目。
3. **信任设计**：Discohook 靠开源建立"不偷凭证"的信任。若对外发布，
   应把「凭证永不离开浏览器、零服务器」作为核心卖点写在 README 首屏。

### 9.3 开源执行要点（若最终推进）

| 项 | 建议 |
|---|---|
| 在线 Demo | 纯静态项目，可直接挂 GitHub Pages / Cloudflare Pages，成本为 0。工具类项目无 Demo 基本无人 clone |
| README | **英文为主**（Discord 生态用户以海外为主），首屏放操作 GIF，15 秒讲清价值 |
| 差异化说明 | 主动回答"和 Discohook 有什么区别"，并坦承对方编辑器更成熟，自身价值在批量/AI/多平台 |
| 许可证 | 建议 MIT（最大化被使用） |
| 推广渠道 | Reddit（r/discordapp、r/selfhosted）、Show HN、Product Hunt、掘金 / V2EX |
