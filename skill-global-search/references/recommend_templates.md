# 智能推荐策略模板

## 角色判定表

综合已安装 skill 组合和工作区特征推断用户角色。角色搜索词为候选池，使用前排除已被已安装 skill 覆盖的关键词。

| 角色 | 典型 skill 组合 | 工作区特征 | 角色搜索词候选池 | 能力缺口方向 |
|------|---------------|-----------|----------------|-------------|
| 产品经理 | `pptx`+`docx`+`brainstorming`+`*-prd` | `.md`/`.docx` 为主 | `product manager`, `pm`, `prd`, `roadmap` | 竞品分析、用户调研、项目管理 |
| 前端开发 | `ui-*`+`frontend-*`+测试类 | `.tsx`/`.vue`+`package.json` | `frontend`, `react`, `vue`, `component` | 测试、部署、设计系统 |
| 后端开发 | `api-*`+`docker-*`+`mock-*` | `.py`/`.go`/`.java`+框架配置 | `backend`, `api`, 具体框架名 | 测试、文档、监控 |
| 全栈开发 | 前后端 skill 混合 | 前后端代码共存 | `fullstack`, 主技术栈名 | 部署、CI/CD、测试 |
| 数据分析师 | `csv-*`+`echarts`+`xlsx` | `.csv`/`.xlsx`/`.sql` 为主 | `data analysis`, `data`, `analytics` | 可视化、数据库、BI |
| 设计师 | `ui-*`+`frontend-design` | `.figma`/`.sketch`/设计资产 | `design`, `ui`, `figma` | 原型、动效、图标 |
| 内容创作者 | `writing-*`+`pptx`+`pdf` | `.md`/`.docx` 为主 | `writing`, `content`, `blog` | SEO、发布、排版 |
| 学生/学习者 | `tutor*`+`learning-*` | 多样化文件 | `learning`, `study`, `tutor` | 笔记、知识管理、练习 |

信号不足时标注为"通用用户"，跳过角色搜索词。此表为参考，非穷举。

## Skill → 画像映射表

对每个已安装 skill 从三个维度推断用户画像。第 4 列为**默认搭配词**，角色明确时改用角色视角的搭配词。

| 已安装 Skill 名称模式 | 领域标签 | 用户倾向 | 默认搭配推荐搜索词 |
|---------------------|---------|---------|----------------|
| `ui-*`, `frontend-*`, `css-*` | UI/前端 | 重视视觉质量和用户体验 | `component`, `design system`, `accessibility`, `testing` |
| `pdf`, `docx`, `pptx`, `xlsx` | 文档处理 | 工作流效率导向 | `report`, `template`, `automation`, `writing`, `slides` |
| `csv-*`, `data-*`, `echarts` | 数据分析 | 关注数据驱动决策 | `dashboard`, `visualization`, `database`, `chart` |
| `api-*`, `rest-*`, `graphql-*` | API 开发 | 构建服务端能力 | `testing`, `documentation`, `mock`, `authentication` |
| `test-*`, `jest-*`, `cypress-*` | 测试 | 重视质量和可靠性 | `ci`, `coverage`, `code review`, `linting` |
| `docker-*`, `k8s-*`, `deploy-*` | 运维/部署 | 关注交付和运行时稳定性 | `monitoring`, `logging`, `security`, `performance` |
| `git-*`, `pr-*`, `code-review-*` | 代码协作 | 团队协作者 | `documentation`, `automation`, `linting`, `ci` |
| `tutor*`, `learning-*` | 学习 | 持续学习者 | `documentation`, `notes`, `knowledge`, `flashcard` |
| `brainstorming` | 创意/发散 | 重视前期思考 | `planning`, `diagram`, `mindmap`, `writing` |
| `project-*`, `architect-*` | 规划/设计 | 关注全局视角 | `diagram`, `documentation`, `analysis`, `planning` |
| `mock-*`, `faker-*` | 模拟数据 | 重视开发效率 | `testing`, `api`, `database`, `seed` |
| `skill-writer`, `skill-creator` | Skill 开发 | AI 工具链构建者 | `prompt engineering`, `mcp`, `agent`, `workflow` |
| `prompt-*` | Prompt 工程 | 关注 AI 交互质量 | `agent`, `workflow`, `rag`, `chain` |
| `music*`, `audio-*`, `video-*` | 媒体创作 | 多媒体内容生产者 | `audio`, `video`, `image`, `creative` |
| `writing-*`, `blog-*`, `content-*` | 内容创作 | 内容生产导向 | `writing`, `seo`, `publishing`, `markdown` |

`skill-global-search` 不作为推荐依据。此表为参考映射，非穷举，未覆盖的 skill 根据其 description 自行推断。

### 角色过滤示例

同一个 skill 被不同角色使用时，搭配方向不同：
- 产品经理装了 `ui-ux-pro-max` → 搭配 `prototype`, `design review`, `usability`
- 前端开发装了 `ui-ux-pro-max` → 搭配 `component`, `testing`, `design system`

## 工作区文件 → 工作场景推断

通过文件扩展名分布推断工作场景。注意：工作区可能是代码项目，也可能是办公/创作/学习等非代码场景。

### 代码项目
| 文件特征 | 场景 | 推荐方向关键词 |
|---------|------|--------------|
| `package.json` + `.tsx`/`.jsx` | React 前端 | `react`, `ui`, `testing`, `storybook` |
| `package.json` + `.vue` | Vue 前端 | `vue`, `ui`, `component` |
| `requirements.txt` / `pyproject.toml` + `.py` | Python 项目 | `python`, `testing`, `data` |
| `go.mod` + `.go` | Go 项目 | `go`, `api`, `testing` |
| `pom.xml` / `build.gradle` + `.java` | Java 项目 | `java`, `spring`, `testing` |
| `.swift` / `Podfile` | iOS 项目 | `swift`, `ios`, `mobile` |
| `Dockerfile` / `docker-compose.yml` | 容器化项目 | `docker`, `deploy`, `ci` |
| `.sql` / 数据库迁移文件 | 数据库项目 | `sql`, `database`, `migration` |
| `miniprogram` / `app.json` + `.wxml` | 小程序项目 | `miniprogram`, `wechat` |

### 非代码场景
| 文件特征 | 场景 | 推荐方向关键词 |
|---------|------|--------------|
| `.md` 为主 | 文档/知识库/写作 | `writing`, `documentation`, `notes`, `publishing` |
| `.docx`, `.pptx`, `.pdf` 为主 | 办公文档处理 | `document`, `template`, `report`, `slides` |
| `.xlsx`, `.csv` 为主 | 数据分析/报表 | `data`, `visualization`, `chart`, `dashboard` |
| `.png`, `.jpg`, `.svg`, `.figma` 为主 | 设计/视觉资产 | `image`, `design`, `ui`, `icon` |
| `.mp3`, `.wav`, `.mp4` 为主 | 媒体创作 | `audio`, `video`, `music`, `creative` |
| 混合文件类型，无明显技术栈标识 | 通用工作区 | 依赖已安装 skill 和 AI 记忆推断 |

> 如果工作区文件特征不明显或为空工作区，不要强行推断场景，转而加大已安装 skill 和 AI 记忆两个维度的权重。

## 项目业务领域推断

代码项目不仅有技术栈，还有**业务领域**。技术栈告诉你"用什么技术"，业务领域告诉你"做什么事情"。推荐应优先关注业务价值（让项目做得更好），其次才是研发基建（测试、CI/CD 等）。

### 推断规则

从以下信号源**按优先级**推断业务领域。高优先级信号已明确时，低优先级仅用于补充验证：

1. **README.md 项目定位**（P0，最高优先级）：前 30 行通常包含项目名称和一句话定位（如"XX 管理平台"、"智能 XX 助手"），这是最直接的业务语义信号。**必须优先于目录名和依赖文件**
2. **AI 记忆中的项目描述**（P1）：记忆提到的项目类型、业务目标、当前工作重点
3. **目录名关键词**（P2）：一级/二级目录名中出现的业务语义词
4. **依赖文件**（P3）：依赖文件前 20 行中的关键库名（推断技术方向，**注意区分技术栈和业务领域**）

> ⚠️ **核心原则**：目录名和依赖文件只能告诉你"用了什么技术"（如 agent/、openai、chromadb），README.md 才能告诉你"做什么业务"（如在线教育、客户管理、内容社区）。两者冲突时以 README.md 为准。

### 目录名 → 业务领域映射

| 目录名关键词（出现任一） | 推断业务领域 | 领域搜索词 |
|------------------------|------------|-----------|
| `agent/`, `agents/`, `skills/`, `prompts/`, `chains/` | AI Agent / LLM 应用 | `rag`, `prompt engineering`, `mcp`, `llm`, `agent` |
| `rag/`, `embeddings/`, `vectors/`, `retrieval/` | RAG / 知识检索 | `rag`, `vector`, `embedding`, `knowledge base` |
| `crawler/`, `scraper/`, `spider/` | 数据采集 / 爬虫 | `scraper`, `crawler`, `data extraction` |
| `auth/`, `login/`, `users/`, `rbac/`, `permissions/` | 用户系统 / 权限 | `authentication`, `auth`, `user management` |
| `payment/`, `billing/`, `subscription/`, `checkout/` | 支付 / 交易 | `payment`, `stripe`, `billing` |
| `cart/`, `products/`, `catalog/`, `orders/`, `shop/` | 电商 | `ecommerce`, `shop`, `product` |
| `cms/`, `posts/`, `articles/`, `content/`, `blog/` | 内容管理 | `cms`, `blog`, `content`, `markdown` |
| `chat/`, `messages/`, `realtime/`, `socket/` | 即时通讯 / 实时 | `chat`, `realtime`, `websocket` |
| `analytics/`, `metrics/`, `dashboard/`, `reports/` | 数据分析 / BI | `analytics`, `dashboard`, `visualization` |
| `ml/`, `models/`, `training/`, `inference/`, `notebooks/` | 机器学习 | `machine learning`, `ml`, `model`, `data science` |
| `game/`, `engine/`, `scenes/`, `assets/`, `levels/` | 游戏开发 | `game`, `unity`, `game dev` |
| `iot/`, `devices/`, `sensors/`, `firmware/` | IoT / 嵌入式 | `iot`, `embedded`, `hardware` |
| `infra/`, `terraform/`, `helm/`, `k8s/`, `deploy/` | 基础设施 / DevOps | `devops`, `infrastructure`, `deploy`, `terraform` |
| `docs/`, `wiki/`, `spec/`, `specs/` 且为项目主体 | 文档/规范驱动项目 | `documentation`, `api docs`, `spec` |
| `miniprogram/`, `weapp/`, `wechat/` | 微信生态 | `miniprogram`, `wechat`, `weapp` |

> 如果目录名不在此表中，不要强行映射。检查 AI 记忆和依赖文件是否有更明确的信号。

### 依赖文件辅助推断

当目录名不足以判断业务领域时，可读取依赖文件的**前 20 行**辅助推断（不读源代码）：

| 依赖关键词（出现在 package.json / requirements.txt 等中） | 辅助推断领域 | 领域搜索词 |
|------------------------------------------------------|------------|-----------|
| `langchain`, `llama-index`, `openai`, `anthropic` | AI/LLM 应用 | `llm`, `agent`, `prompt engineering` |
| `chromadb`, `pinecone`, `weaviate`, `faiss` | RAG / 向量检索 | `rag`, `vector`, `embedding` |
| `stripe`, `paypal`, `alipay` | 支付集成 | `payment`, `billing` |
| `socket.io`, `ws`, `websocket` | 实时通讯 | `realtime`, `chat`, `websocket` |
| `tensorflow`, `pytorch`, `scikit-learn`, `transformers` | 机器学习 | `ml`, `model`, `data science` |
| `three.js`, `babylon`, `phaser`, `unity` | 3D/游戏 | `3d`, `game`, `visualization` |
| `next`, `nuxt`, `gatsby` | SSR/SSG 站点 | `seo`, `performance`, `web` |
| `electron`, `tauri` | 桌面应用 | `desktop`, `electron`, `cross-platform` |
| `react-native`, `flutter`, `expo` | 移动应用 | `mobile`, `app`, `cross-platform` |

### 业务领域推荐逻辑

- 领域搜索词应优先进入搜索位（R3），因为**业务价值 > 研发基建**
- 同一领域表中可能返回多个搜索词，选择与项目最相关的 **1-2 个**
- 领域搜索词与技术栈搜索词可以组合（如 `python rag` 优于单独的 `rag`）
- 如果领域明确，推荐排序中领域匹配 skill 应排在基建类 skill（测试、CI）之前

## AI 记忆信号提取

从 AI 记忆（memory）中提取推荐信号的规则：

1. **直接提取**：记忆中提到的技术名词、工具名、文件格式 → 直接作为搜索关键词
2. **痛点识别**：记忆中提到"难点"、"问题"、"需要"、"想要" → 提取对应领域
3. **频率信号**：同一领域在多条记忆中出现 → 提高该领域的推荐权重
4. **时效性**：优先关注近期记忆中的信号

## 推荐排序规则

最终推荐按以下优先级排序。**所有推荐必须经过用户角色校验**——推荐的 skill 应该是该角色会用到的，而非该领域通用的。

1. **业务领域匹配**（权重 6）：与项目业务领域直接相关、能为项目创造业务价值的 skill
   - 例：AI Agent 项目 → 推荐 `rag`、`prompt engineering`、`mcp` 类 skill
   - 例：电商项目 → 推荐 `payment`、`ecommerce`、`product` 类 skill
   - 例：实时通讯项目 → 推荐 `websocket`、`chat` 类 skill
   - **核心原则**：为业务创造价值 > 补齐研发基建
2. **角色缺口匹配**（权重 5）：该角色通常需要但用户未覆盖的核心能力
   - 例：产品经理缺竞品分析能力 → 推荐 `competitor analysis` skill
   - 例：前端开发缺测试 → 推荐 `testing` skill
3. **强信号匹配**（权重 4）：潜在需求与工作场景 + 用户倾向双重匹配
   - 例：用户装了 `xlsx` + 工作区有大量 `.csv` → 推荐数据可视化 skill
   - 例：用户装了 `skill-writer` + 记忆提到 MCP → 推荐 `mcp` 或 `agent` 类 skill
4. **记忆驱动**（权重 3）：AI 记忆中提到但用户未安装对应 skill 的领域
5. **场景驱动**（权重 2）：工作区特征直接对应的 skill
   - 代码场景例：FastAPI 项目 → 搜 `fastapi`；有 `Dockerfile` → 推荐部署 skill
   - 非代码场景例：工作区全是 .pptx → 搜 `slides`；全是 .csv → 搜 `visualization`
6. **热门补充**（权重 1）：skills.sh 上高安装量且与用户角色相关的 skill

## 推荐数量控制

- 推荐列表最多 **5 个**，最少 **2 个**
- 每个推荐必须有明确的、基于用户画像的理由（不允许泛泛推荐）
- 如果信号不足（如新项目、无已安装 skill、无记忆），坦诚告知，给出 2-3 个通用型热门 skill，并标注"通用推荐"

## 反模式（禁止）

- ❌ 推荐用户已安装的 skill（已安装 = 用户已有，不需要重复推荐）
- ❌ 无理由推荐（每条必须有基于画像的具体理由）
- ❌ 读取工作区文件内容来推断需求（仅扫描目录和扩展名，除非用户主动要求）
- ❌ 推荐 `skill-global-search` 本身（元搜索工具，不是能力工具）
- ❌ 使用自然语言长句作为 CLI 搜索词（如 `"RAG vector search for documents"` → 应用 `rag` 或 `vector`）
- ❌ 忽略工作区的具体特征而只搜泛化词（如工作区明确是 FastAPI 却只搜 `python`，或明明是 PPT 制作场景却只搜 `document`）
- ❌ 预设用户是开发者（工作区可能是办公、创作、学习等非代码场景，推荐方向应与实际场景匹配）
- ❌ 忽略用户角色直接使用映射表搭配词（如产品经理装了 `ui-ux-pro-max` 却推荐 `component`、`testing` 等开发向 skill）
- ❌ 推荐超出用户角色日常工作范围的 skill（检验：这个角色会日常用 AI 工具做这件事吗？产品经理不会用 AI 做 code review，开发者不会用 AI 写竞品分析报告）
- ❌ 角色明确时跳过角色搜索词（CLI 位 1 和 GitHub 位 1 必须含角色词，如 `product manager`/`pm` 或 `backend`/`fastapi`，不可全部填能力缺口词）
- ❌ 代码项目只推荐研发基建类 skill（测试、CI、linting），忽略项目的业务领域（业务价值 > 基建补齐）
- ❌ 不分析项目业务领域就直接推荐泛化 skill（如项目明明是 AI Agent 平台却只推荐 `testing` 和 `documentation`）
- ❌ 用目录名/依赖文件的技术栈推断覆盖 README.md 的业务定位（如 README 写"在线教育平台"、目录有 `agent/`+`chromadb`，应推荐教育类 skill 而非 RAG 技术类 skill）
