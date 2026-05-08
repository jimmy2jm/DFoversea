# 搜索词模板参考

## CLI 查询词构造（信任 CLI 语义理解）

CLI（`npx skills find`）已具备英文语义理解和模糊匹配能力，**不要做同义词扩展**。

| 搜索意图 | 用户输入示例 | CLI 查询词 |
|---------|------------|-----------|
| **精确名称** | "找 find-skills 这个 skill" | `find-skills` |
| **自然语言** | "自动生成饮食计划" | `generate meal plan automatically` |
| **自然语言** | "帮我做 PR review" | `help me review pull requests` |
| **领域关键词** | "react testing" | `react testing` |
| **模糊需求** | "竞品分析" | `competitor analysis` |
| **复合意图** | "把 md 材料生成 PPT" | `markdown to presentation slides` |

**识别精确名称的信号**：用户说"这个 skill"、"叫 xxx 的"、提供了含连字符的名称（如 `health-coach`）。

**CLI 无结果时降级**：可尝试一次同义词扩展后重试，如 `meal plan` → `meal plan diet`，最多重试一次。

## GitHub 搜索词模板（4 路并行）

GitHub 搜索是纯文本匹配（不具备语义理解），适度使用同义词扩展。

| 策略 | 搜索词模板 | 说明 |
|------|-----------|------|
| 精确搜 | `github {关键词} repository stars` | 找高星仓库 |
| 合集搜 | `github awesome-{关键词} OR awesome {关键词} list` | 找 awesome 合集 |
| 工具搜 | `github {工具名} {关键词} library collection` | 找工具生态 |
| Skill 搜 | `"{关键词}" "SKILL.md" site:github.com` | 找真正的 Skill 仓库 |

## 示例

| 用户输入 | 精确搜 | 合集搜 | 工具搜 | Skill 搜 |
|---------|--------|--------|--------|----------|
| 提示词 | github prompt repository stars | github awesome-prompts OR awesome prompt list | github chatgpt prompt library collection | "prompt" "SKILL.md" site:github.com |
| SQL | github sql repository stars | github awesome-sql OR awesome sql list | github sql query builder library | "sql" "SKILL.md" site:github.com |
| 视频剪辑 | github video editing repository stars | github awesome-video OR awesome video-editing list | github ffmpeg video editor library | "video" "SKILL.md" site:github.com |
| 数据可视化 | github data visualization repository stars | github awesome-dataviz OR awesome data-visualization list | github d3 echarts visualization library | "visualization" "SKILL.md" site:github.com |
| API 测试 | github api testing repository stars | github awesome-api-testing OR awesome api test list | github postman api testing library | "api testing" "SKILL.md" site:github.com |

## 降级搜索（无 Node.js 时替代 CLI）

| # | 搜索词模板 | 说明 |
|---|-----------|------|
| 1 | `skills.sh {英文关键词} skill` | 通过网页搜索 skills.sh 索引 |
| 2 | `github claude code skill {英文关键词}` | 搜索 Claude Code 生态 |
| 3 | `github awesome-{关键词} list` | 搜索 awesome 合集 |
