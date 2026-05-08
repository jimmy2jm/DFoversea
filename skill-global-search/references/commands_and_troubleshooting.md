# 命令参考 & 常见问题排查

## 安装命令

| 命令 | 功能 | 说明 |
|-----|-----|------|
| `bash scripts/install_skill.sh {url} {name}` | 安装到当前平台 | 自动安全扫描，直接复制文件 |
| `bash scripts/install_skill.sh {url} {name} --skip-audit` | 跳过安全扫描安装 | 用户已确认风险时使用 |
| `npx skills add {repo} -y` | 全平台安装 | 创建 symlink 到多个平台，不经安全扫描 |

## npx skills 命令

| 命令 | 功能 |
|-----|-----|
| `npx skills find {关键词}` | 搜索 skills |
| `npx skills add {repo} -g` | 全局安装 |
| `npx skills add {repo} -l` | 列出仓库中的 skills |
| `npx skills check` | 检查更新 |
| `npx skills update` | 更新全部 |

## 安全扫描命令

| 命令 | 功能 |
|-----|-----|
| `python3 scripts/skill_audit.py --path {skill_dir}` | 扫描指定目录（可读输出） |
| `python3 scripts/skill_audit.py --path {skill_dir} --json` | 扫描并输出 JSON |
| `python3 scripts/skill_audit.py --path {skill_dir} --json --severity medium` | 扫描 medium 及以上级别 |

安装脚本退出码含义：

| 退出码 | 含义 | AI 处理 |
|--------|------|---------|
| 0 | 扫描通过或仅中风险 | 安装完成，补充 AI 软判断 |
| 10 | 发现 CRITICAL 级风险 | 安装中止，用人话解释风险 |
| 11 | 发现 HIGH 级风险 | 安装中止，提示用户决定 |
| 1 | 安装失败（网络/仓库问题） | 提示排查网络或 URL |

## 已安装 Skill 管理

| 操作 | 方法 |
|------|------|
| 查看已安装 | `ls .codebuddy/skills/` |
| 查看某个 skill | `cat .codebuddy/skills/{name}/SKILL.md \| head -20` |
| 卸载 skill | `rm -rf .codebuddy/skills/{name}` |
| 更新 skill | 删除后重新安装，或使用 `npx skills update` |

## 常见问题排查

| 问题 | 解决方案 |
|-----|---------|
| npx 未找到 | 安装 Node.js（macOS: `brew install node`，Ubuntu: `sudo apt install nodejs npm`）或使用 `scripts/install_skill.sh` 手动安装 |
| 无搜索结果 | 尝试英文关键词、更宽泛的词、相关工具名 |
| 安装失败 | 检查网络；尝试 `scripts/install_skill.sh` 手动安装 |
| Skill 不工作 | 重启 IDE；检查路径 `.codebuddy/skills/{name}/SKILL.md` 是否存在 |
| SKILL.md 位置错误 | 检查仓库结构，可能在 `dist/skills/`、`skills/` 或 `.claude/skills/` 子目录中 |
| symlink 问题 | `npx skills add` 默认会在多个平台创建 symlink。推荐使用 `scripts/install_skill.sh` 直接复制文件到当前平台，避免 symlink |
| 安全扫描退出码 10/11 | 脚本检测到 CRITICAL/HIGH 风险并中止安装。AI 会读取 JSON 输出并用人话解释。用户确认风险后可用 `--skip-audit` 重装 |
| 安全扫描无输出 | python3 不可用或 skill_audit.py 缺失。扫描被跳过，安装正常继续，AI 仍会做软判断 |
| 安全扫描误报 | 部分 skill 的 network/shell 权限是功能所需（如联网查文档、执行构建命令）。结合 skill 描述判断权限是否合理，用人话向用户解释 |
