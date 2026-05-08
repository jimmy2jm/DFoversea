#!/usr/bin/env bash
#
# install_skill.sh — 安装 GitHub Skill 到 .codebuddy/skills/
#
# 用法:
#   bash install_skill.sh <github_url> <skill_name> [target_dir] [--skip-audit]
#
# 参数:
#   github_url    — GitHub 仓库 URL (如 https://github.com/owner/repo)
#   skill_name    — Skill 名称 (如 my-skill)
#   target_dir    — 安装目标目录 (默认: .codebuddy/skills)
#   --skip-audit  — 跳过安全扫描（用户已确认风险时使用）
#
# 示例:
#   bash install_skill.sh https://github.com/anthropics/skill-pdf pdf-editor
#   bash install_skill.sh https://github.com/owner/repo my-skill ./custom/skills
#   bash install_skill.sh https://github.com/owner/repo my-skill --skip-audit

set -euo pipefail

# 解析参数：支持 --skip-audit 在任意位置
SKIP_AUDIT=false
POSITIONAL=()
for arg in "$@"; do
  case "${arg}" in
    --skip-audit) SKIP_AUDIT=true ;;
    *) POSITIONAL+=("${arg}") ;;
  esac
done

GITHUB_URL="${POSITIONAL[0]:?用法: bash install_skill.sh <github_url> <skill_name> [target_dir] [--skip-audit]}"
SKILL_NAME="${POSITIONAL[1]:?用法: bash install_skill.sh <github_url> <skill_name> [target_dir] [--skip-audit]}"
TARGET_DIR="${POSITIONAL[2]:-.codebuddy/skills}"

TMPDIR_PATH="$(mktemp -d)"
SKILL_DEST="${TARGET_DIR}/${SKILL_NAME}"

cleanup() {
  rm -rf "${TMPDIR_PATH}"
}
trap cleanup EXIT

echo "==> 克隆仓库到临时目录..."
if ! git clone --depth 1 "${GITHUB_URL}.git" "${TMPDIR_PATH}/repo" 2>&1; then
  echo "❌ 克隆失败，请检查："
  echo "   1. URL 是否正确: ${GITHUB_URL}"
  echo "   2. 网络是否正常"
  echo "   3. 仓库是否存在且为 public"
  exit 1
fi

echo "==> 查找 SKILL.md 位置..."

# 优先查找路径中包含 skill_name 的 SKILL.md（支持多 skill 仓库）
SKILL_MD_PATH=$(find "${TMPDIR_PATH}/repo" -name "SKILL.md" -not -path "*/node_modules/*" | grep -E "(${SKILL_NAME}|${SKILL_NAME//-/_})" | head -1)

# 如果没找到匹配的，再取第一个
if [ -z "${SKILL_MD_PATH}" ]; then
  SKILL_MD_PATH=$(find "${TMPDIR_PATH}/repo" -name "SKILL.md" -not -path "*/node_modules/*" | head -1)
fi

if [ -z "${SKILL_MD_PATH}" ]; then
  echo "❌ 未找到 SKILL.md 文件，该仓库可能不是标准 Skill。"
  echo "   仓库内容:"
  ls -la "${TMPDIR_PATH}/repo/"
  exit 1
fi

SKILL_SRC_DIR=$(dirname "${SKILL_MD_PATH}")
echo "   找到: ${SKILL_MD_PATH}"

# ─── 安全扫描 ───────────────────────────────────────────────────────
if [ "${SKIP_AUDIT}" = "true" ]; then
  echo "   ⏭️  已跳过安全扫描（--skip-audit）。"
else
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  AUDIT_SCRIPT="${SCRIPT_DIR}/skill_audit.py"

  if [ -f "${AUDIT_SCRIPT}" ] && command -v python3 &>/dev/null; then
    echo "==> 安装前安全扫描..."
    SCAN_OUTPUT=$(python3 "${AUDIT_SCRIPT}" --path "${SKILL_SRC_DIR}" --json --severity medium 2>/dev/null || true)

    if [ -n "${SCAN_OUTPUT}" ]; then
      # 提取严重级别计数
      CRITICAL=$(echo "${SCAN_OUTPUT}" | python3 -c "import sys,json; print(json.load(sys.stdin)['summary']['severity_counts'].get('CRITICAL',0))" 2>/dev/null || echo "0")
      HIGH=$(echo "${SCAN_OUTPUT}" | python3 -c "import sys,json; print(json.load(sys.stdin)['summary']['severity_counts'].get('HIGH',0))" 2>/dev/null || echo "0")
      MEDIUM=$(echo "${SCAN_OUTPUT}" | python3 -c "import sys,json; print(json.load(sys.stdin)['summary']['severity_counts'].get('MEDIUM',0))" 2>/dev/null || echo "0")

      if [ "${CRITICAL}" -gt 0 ] 2>/dev/null; then
        echo "🚨 发现 ${CRITICAL} 个严重安全风险！"
        # 输出扫描详情供 AI 读取
        echo "${SCAN_OUTPUT}"
        echo ""
        echo "⚠️  建议不要安装。如需继续，请在 AI 对话中确认。"
        exit 10
      elif [ "${HIGH}" -gt 0 ] 2>/dev/null; then
        echo "⚠️  发现 ${HIGH} 个高风险项，${MEDIUM} 个中风险项。"
        echo "${SCAN_OUTPUT}"
        echo ""
        echo "⚠️  建议审查后再安装。如需继续，请在 AI 对话中确认。"
        exit 11
      elif [ "${MEDIUM}" -gt 0 ] 2>/dev/null; then
        echo "ℹ️  发现 ${MEDIUM} 个中风险项（可能是误报）。"
      else
        echo "   ✅ 扫描通过，未发现安全风险。"
      fi
    else
      echo "   ⏭️  扫描器无输出，跳过安全检查。"
    fi
  else
    echo "   ⏭️  扫描器不可用（缺少 python3 或 skill_audit.py），跳过安全检查。"
  fi
fi
# ─── 安全扫描结束 ───────────────────────────────────────────────────

echo "==> 安装到 ${SKILL_DEST}/ ..."
mkdir -p "${SKILL_DEST}"

# 如果 SKILL.md 在仓库根目录，复制整个仓库内容（排除 .git）
if [ "${SKILL_SRC_DIR}" = "${TMPDIR_PATH}/repo" ]; then
  rsync -a --exclude='.git' --exclude='node_modules' --exclude='.github' \
    "${TMPDIR_PATH}/repo/" "${SKILL_DEST}/"
else
  # SKILL.md 在子目录中，复制该子目录内容
  rsync -a "${SKILL_SRC_DIR}/" "${SKILL_DEST}/"
fi

echo "==> 验证安装..."
if [ -f "${SKILL_DEST}/SKILL.md" ]; then
  echo "✅ 安装成功！"
  echo ""
  echo "   位置: ${SKILL_DEST}/"
  echo "   文件:"
  ls -la "${SKILL_DEST}/"
  echo ""
  head -5 "${SKILL_DEST}/SKILL.md"
else
  echo "❌ 安装验证失败 — SKILL.md 未找到"
  exit 1
fi
