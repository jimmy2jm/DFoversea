/**
 * Discord Webhook 推送工具 —— 环境配置模板
 *
 * 使用方式：
 *   1. 复制本文件为 webhook-config.js（同目录）
 *   2. 填入你自己的 Webhook URL 与论坛标签
 *   3. webhook-config.js 已在 .gitignore 中，不会被提交
 *
 * ⚠️ 切勿把真实 Webhook URL 写进本模板文件（本文件会进版本库）。
 *
 * 字段说明：
 *   name      预设显示名
 *   url       Webhook URL（留空则需在界面里手填）
 *   threadId  默认 Thread ID（发到已有帖子时用，通常留空）
 *   tags      默认选中的标签 ID，逗号分隔（通常留空，发帖时再点选）
 *   tagList   该频道的可用标签集 [{ name, id }]
 *
 * 如何获取 Webhook URL：
 *   目标频道 → 编辑频道 → 整合(Integrations) → Webhook → 新建 → 复制网址
 *   注意：论坛频道的 Webhook 必须直接创建在该论坛频道上。
 *
 * 如何获取论坛标签 ID（无需管理员权限）：
 *   标签 ID 无法右键复制，Webhook Token 也无权调用 GET /channels/{id}。
 *   在 Discord 网页版打开该论坛频道 → F12 控制台 → 执行：
 *
 *   console.table([...document.querySelectorAll('[data-list-item-id*="forum-tag-"]')]
 *     .map(e=>({name:e.textContent.trim(),id:/forum-tag-(\d+)/.exec(e.dataset.listItemId)[1]})))
 *
 *   也可直接复制标签栏那块 HTML，用工具界面的「为当前预设导入标签」自动解析。
 */
window.DF_WEBHOOK_CONFIG = {
  presets: [
    {
      name: '测试频道',
      url: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
      threadId: '',
      tags: '',
      tagList: [
        { name: 'ExampleTagA', id: '000000000000000001' },
        { name: 'ExampleTagB', id: '000000000000000002' }
      ]
    },
    {
      name: '正式频道',
      url: '',
      threadId: '',
      tags: '',
      tagList: []
    }
  ]
};
