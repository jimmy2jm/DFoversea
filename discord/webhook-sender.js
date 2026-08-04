/**
 * Discord Webhook 本地推送工具 —— 主逻辑
 *
 * 设计原则：
 *   1. 纯前端、零依赖、零构建。所有请求由浏览器直接发往 Discord API。
 *   2. Webhook URL 等凭证只存本机 localStorage，绝不上传任何服务器。
 *   3. 频道/标签等环境数据全部外置在 webhook-config.js，本文件不含任何真实凭证。
 *
 * 模块划分（按代码顺序）：
 *   配置读取 → 消息模板 → Webhook 预设 → 论坛标签 → JSON 处理
 *   → 限制校验 → 自定义模板 → 本地附件 → 预览渲染 → 发送
 *   → 历史与撤回 → 事件绑定 → 初始化
 *
 * localStorage 键位：
 *   df-webhook-cfg      当前选中的预设索引
 *   df-webhook-presets  预设列表（含各频道标签集）
 *   df-webhook-mytpl    用户自定义消息模板
 *   df-webhook-hist     发送历史（含 message_id，撤回依赖它）
 */
(function () {
  'use strict';

  var LS_CFG = 'df-webhook-cfg';
  var LS_HIST = 'df-webhook-hist';
  var LS_PRESET = 'df-webhook-presets';
  var LS_MYTPL = 'df-webhook-mytpl';

  /* ---------------- 配置读取 ----------------
   * 环境数据来自 webhook-config.js（该文件不进版本库）。
   * 缺失时回退到一份空白预设，保证工具仍可用。
   */
  var CFG = (typeof window !== 'undefined' && window.DF_WEBHOOK_CONFIG) || {};

  var DEFAULT_PRESETS = (CFG.presets && CFG.presets.length)
    ? JSON.parse(JSON.stringify(CFG.presets))
    : [{ name: '未配置频道', url: '', threadId: '', tags: '', tagList: [] }];

  var $ = function (id) { return document.getElementById(id); };

  /* ---------------- 模板 ---------------- */
  var TEMPLATES = {
    build: {
      content: '',
      embeds: [{
        title: '340K M4A1 Build',
        image: { url: 'https://placehold.co/800x400/12262a/24f4b2?text=M4A1+BUILD' },
        fields: [
          { name: 'PRICE', value: '\u20BD340,000', inline: false },
          { name: 'GUN CODE', value: '```\nM4A1 Assault Rifle-Operations-6K1IUS400G02164FCEV6J\n```', inline: false },
          { name: 'DESCRIPTION', value: 'Great value for the price, with smooth handling and reliable performance.', inline: false }
        ]
      }]
    },
    buildJp: {
      content: '',
      embeds: [{
        title: '34\u4E07 M4A1 \u30D3\u30EB\u30C9',
        image: { url: 'https://placehold.co/800x400/12262a/24f4b2?text=M4A1+BUILD' },
        fields: [
          { name: '\u4FA1\u683C', value: '\u20BD340,000', inline: false },
          { name: '\u6539\u9020\u30B3\u30FC\u30C9', value: '```\nM4A1 Assault Rifle-Operations-6K1IUS400G02164FCEV6J\n```', inline: false },
          { name: '\u89E3\u8AAC', value: '\u30B3\u30B9\u30C8\u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9\u306B\u512A\u308C\u305F\u30D3\u30EB\u30C9\u3067\u3059\u3002\u64CD\u4F5C\u6027\u3082\u826F\u597D\u3067\u3001\u5B89\u5B9A\u3057\u305F\u6027\u80FD\u3092\u767A\u63EE\u3057\u307E\u3059\u3002', inline: false }
        ]
      }]
    },
    plain: { content: 'Hello from local sender.', embeds: [] }
  };

  /* ---------------- 配置存取 ---------------- */
  /* ---------------- Webhook 预设（每个预设自带标签集） ---------------- */
  var curIdx = 0;

  function getPresets() {
    try {
      var v = JSON.parse(localStorage.getItem(LS_PRESET) || 'null');
      if (v && v.length) return v;
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_PRESETS));
  }
  function setPresets(list) {
    localStorage.setItem(LS_PRESET, JSON.stringify(list));
  }
  function curPreset() {
    var list = getPresets();
    if (curIdx < 0 || curIdx >= list.length) curIdx = 0;
    return list[curIdx] || { name: '', url: '', threadId: '', tags: '', tagList: [] };
  }
  // 把界面上的字段写回当前预设
  function syncToPreset() {
    var list = getPresets();
    if (!list[curIdx]) return;
    list[curIdx].url = $('hookUrl').value.trim();
    list[curIdx].threadId = $('threadId').value.trim();
    list[curIdx].tags = $('appliedTags').value.trim();
    setPresets(list);
    localStorage.setItem(LS_CFG, JSON.stringify({ idx: curIdx }));
  }
  function saveCfg() { syncToPreset(); }

  function renderPresetSelect() {
    var list = getPresets();
    $('presetSelect').innerHTML = list.map(function (p, i) {
      var flag = p.url ? '' : '（未填 URL）';
      return '<option value="' + i + '"' + (i === curIdx ? ' selected' : '') + '>' +
        esc(p.name) + flag + '</option>';
    }).join('');
  }
  // 载入指定预设到界面
  function applyPreset(i) {
    var list = getPresets();
    if (!list[i]) return;
    curIdx = i;
    $('hookUrl').value = list[i].url || '';
    $('threadId').value = list[i].threadId || '';
    $('appliedTags').value = list[i].tags || '';
    localStorage.setItem(LS_CFG, JSON.stringify({ idx: curIdx }));
    renderPresetSelect();
    renderTags();
    renderPreview();
  }
  function loadCfg() {
    var idx = 0;
    try { idx = (JSON.parse(localStorage.getItem(LS_CFG) || '{}').idx) || 0; }
    catch (e) { /* ignore */ }
    var list = getPresets();
    setPresets(list);              // 首次运行时落盘默认预设
    curIdx = (idx >= 0 && idx < list.length) ? idx : 0;
    applyPreset(curIdx);
  }

  function newPreset() {
    var name = prompt('新预设名称（如 EN-改枪码频道 / JP-改枪码频道）：', '');
    if (name === null) return;
    name = (name || '').trim();
    if (!name) { say('cfgStatus', 'err', '名称不能为空'); return; }
    var list = getPresets();
    list.push({ name: name, url: '', threadId: '', tags: '', tagList: [] });
    setPresets(list);
    applyPreset(list.length - 1);
    say('cfgStatus', 'ok', '已新增预设「' + name + '」，请填入 Webhook URL 后点「保存到当前预设」。');
  }
  function updPreset() {
    var url = $('hookUrl').value.trim();
    if (!url) { say('cfgStatus', 'err', '请先填写 Webhook URL'); return; }
    syncToPreset();
    renderPresetSelect();
    say('cfgStatus', 'ok', '已保存到预设「' + curPreset().name + '」。');
  }
  function renamePreset() {
    var list = getPresets();
    if (!list[curIdx]) return;
    var name = prompt('重命名预设：', list[curIdx].name);
    if (name === null) return;
    name = (name || '').trim();
    if (!name) return;
    list[curIdx].name = name;
    setPresets(list);
    renderPresetSelect();
    say('cfgStatus', 'ok', '已重命名为「' + name + '」。');
  }
  function delPreset() {
    var list = getPresets();
    if (list.length <= 1) { say('cfgStatus', 'err', '至少保留一个预设。'); return; }
    if (!confirm('删除预设「' + list[curIdx].name + '」？该频道的标签集也会一起删除。')) return;
    list.splice(curIdx, 1);
    setPresets(list);
    applyPreset(0);
    say('cfgStatus', 'ok', '预设已删除。');
  }

  /* ---------------- 论坛标签（归属当前预设） ---------------- */
  function getTags() {
    var p = curPreset();
    return (p.tagList && p.tagList.length) ? p.tagList : [];
  }
  function setTags(list) {
    var all = getPresets();
    if (!all[curIdx]) return;
    all[curIdx].tagList = list;
    setPresets(all);
    renderTags();

  }
  function selectedTagIds() {
    return $('appliedTags').value.split(',')
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s; });
  }
  function renderTags() {
    var list = getTags(), sel = selectedTagIds(), bar = $('tagBar');
    if (!list.length) {
      bar.innerHTML = '<span style="font-size:11px;color:rgba(255,255,255,0.4)">' +
        '预设「' + esc(curPreset().name) + '」还没有标签数据。若该频道强制要求标签，' +
        '请点下方「为当前预设导入标签」。</span>';
      return;
    }
    bar.innerHTML = list.map(function (t) {
      var on = sel.indexOf(t.id) > -1;
      return '<span class="preset-chip' + (on ? ' active' : '') + '" data-tagid="' + t.id + '" ' +
        'title="' + esc(t.id) + '">' + esc(t.name) + '</span>';
    }).join('');
  }
  function toggleTag(id) {
    var sel = selectedTagIds(), i = sel.indexOf(id);
    if (i > -1) sel.splice(i, 1);
    else {
      if (sel.length >= 5) { say('cfgStatus', 'err', 'Discord 单个帖子最多应用 5 个标签。'); return; }
      sel.push(id);
    }
    $('appliedTags').value = sel.join(', ');
    renderTags();
    renderPreview();
    saveCfg();
  }
  function importTags() {
    var html = $('tagHtml').value.trim();
    if (!html) { say('cfgStatus', 'err', '请先粘贴标签栏 HTML'); return; }
    var found = [], chanId = '';
    try {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var nodes = doc.querySelectorAll('[data-list-item-id*="forum-tag-"]');
      Array.prototype.forEach.call(nodes, function (el) {
        var raw = el.getAttribute('data-list-item-id') || '';
        var mid = /forum-tag-(\d+)/.exec(raw);
        if (!mid) return;
        if (!chanId) {
          var mc = /^(\d+)-tags-navigator/.exec(raw);
          if (mc) chanId = mc[1];
        }
        var name = (el.textContent || '').trim();
        if (!name) {
          var al = el.getAttribute('aria-label') || '';
          var mn = /标签\s*(.+?)\s*筛选/.exec(al) || /tag\s+(.+?)\s+filter/i.exec(al);
          name = mn ? mn[1] : mid[1];
        }
        if (!found.some(function (x) { return x.id === mid[1]; })) {
          found.push({ name: name, id: mid[1] });
        }
      });
    } catch (e) {
      say('cfgStatus', 'err', 'HTML 解析失败：' + e.message); return;
    }
    if (!found.length) {
      say('cfgStatus', 'err', '没解析到标签。请确认复制的是含 forum-tag- 的那段 HTML。'); return;
    }
    setTags(found);
    $('tagImportBox').style.display = 'none';
    $('tagHtml').value = '';
    say('cfgStatus', 'ok', '已为预设「' + curPreset().name + '」导入 ' + found.length + ' 个标签' +
      (chanId ? '（论坛频道 ID：' + chanId + '）' : '') + '。');
  }

  var CONSOLE_JS = "console.table([...document.querySelectorAll('[data-list-item-id*=\"forum-tag-\"]')]" +
    ".map(e=>({name:e.textContent.trim(),id:/forum-tag-(\\d+)/.exec(e.dataset.listItemId)[1]})))";

  function say(id, type, msg) {
    var el = $(id);
    el.className = 'status show ' + type;
    el.textContent = msg;
  }
  function hide(id) { $(id).className = 'status'; }

  /* ---------------- JSON 处理 ---------------- */
  function getPayload() {
    var raw = $('jsonEditor').value.trim();
    if (!raw) throw new Error('JSON 内容为空');
    return JSON.parse(raw);
  }
  function setEditor(obj) {
    $('jsonEditor').value = JSON.stringify(obj, null, 2);
    renderPreview();
    updateCount();
  }

  /* ---------------- Discord 限制校验 ---------------- */
  var LIMITS = {
    content: 2000, title: 256, description: 4096,
    fieldName: 256, fieldValue: 1024, footer: 2048, author: 256,
    fields: 25, embeds: 10, total: 6000, threadName: 100
  };

  function validate(silent) {
    var out = [], p;
    try { p = getPayload(); }
    catch (e) {
      out.push(['err', 'JSON 解析失败：' + e.message]);
      paintCheck(out); return false;
    }

    var total = 0;
    function chk(val, max, label) {
      if (!val) return;
      var n = String(val).length;
      total += n;
      if (n > max) out.push(['err', label + ' 超限：' + n + ' / ' + max]);
      else if (n > max * 0.9) out.push(['warn', label + ' 接近上限：' + n + ' / ' + max]);
    }

    chk(p.content, LIMITS.content, 'content');
    chk($('threadName').value.trim(), LIMITS.threadName, 'thread_name');

    var embeds = p.embeds || [];
    if (embeds.length > LIMITS.embeds) out.push(['err', 'embeds 数量超限：' + embeds.length + ' / ' + LIMITS.embeds]);

    embeds.forEach(function (em, i) {
      var tag = 'embeds[' + i + ']';
      chk(em.title, LIMITS.title, tag + '.title');
      chk(em.description, LIMITS.description, tag + '.description');
      if (em.footer) chk(em.footer.text, LIMITS.footer, tag + '.footer');
      if (em.author) chk(em.author.name, LIMITS.author, tag + '.author');
      var fs = em.fields || [];
      if (fs.length > LIMITS.fields) out.push(['err', tag + '.fields 数量超限：' + fs.length + ' / ' + LIMITS.fields]);
      fs.forEach(function (f, j) {
        chk(f.name, LIMITS.fieldName, tag + '.fields[' + j + '].name');
        chk(f.value, LIMITS.fieldValue, tag + '.fields[' + j + '].value');
        if (!f.name || !f.value) out.push(['err', tag + '.fields[' + j + '] 的 name / value 不能为空']);
      });
      // 图片引用检查
      ['image', 'thumbnail'].forEach(function (k) {
        if (em[k] && em[k].url) {
          var m = /^attachment:\/\/(.+)$/.exec(em[k].url);
          if (m && !files.some(function (f) { return f.name === m[1]; })) {
            out.push(['err', tag + '.' + k + ' 引用了未选择的附件：' + m[1]]);
          }
        }
      });
    });

    if (total > LIMITS.total) out.push(['err', 'embed 文本总量超限：' + total + ' / ' + LIMITS.total]);

    // 结构性提醒
    if (!p.content && !embeds.length && !files.length) {
      out.push(['err', '消息为空：content / embeds / 附件 至少要有一个']);
    }
    var tn = $('threadName').value.trim(), ti = $('threadId').value.trim();
    if (tn && ti) out.push(['err', 'Thread Name 与 Thread ID 不能同时填写']);
    if (!tn && !ti) out.push(['warn', '两个 Thread 字段都为空：若目标是论坛频道会发送失败（405）']);
    var selTags = selectedTagIds();
    if (tn && !selTags.length) out.push(['warn', '新建论坛帖但未选标签：若该频道强制要求标签会返回 400']);
    if (selTags.length > 5) out.push(['err', '标签数量超限：' + selTags.length + ' / 5']);
    if (ti && selTags.length) out.push(['warn', '向已有帖子发消息时 applied_tags 无效，会被忽略']);

    var hasErr = out.some(function (x) { return x[0] === 'err'; });
    if (!out.length) out.push(['ok', '校验通过，未发现问题。']);
    if (!silent) paintCheck(out);
    return !hasErr;
  }

  function paintCheck(list) {
    $('checkList').innerHTML = list.map(function (x) {
      var icon = x[0] === 'ok' ? '\u2713' : (x[0] === 'warn' ? '!' : '\u2715');
      return '<div class="check-' + x[0] + '"><span>' + icon + '</span><span>' + esc(x[1]) + '</span></div>';
    }).join('');
  }

  function updateCount() {
    var p;
    try { p = getPayload(); } catch (e) { $('charCount').textContent = 'JSON 无效'; return; }
    var total = (p.content || '').length;
    (p.embeds || []).forEach(function (em) {
      total += (em.title || '').length + (em.description || '').length;
      if (em.footer) total += (em.footer.text || '').length;
      if (em.author) total += (em.author.name || '').length;
      (em.fields || []).forEach(function (f) {
        total += (f.name || '').length + (f.value || '').length;
      });
    });
    $('charCount').textContent = 'embeds ' + (p.embeds || []).length + '/10 · 文本 ' + total + '/6000';
  }

  /* ---------------- 自定义模板 ---------------- */
  function getMyTpl() {
    try { return JSON.parse(localStorage.getItem(LS_MYTPL) || '[]'); }
    catch (e) { return []; }
  }
  function setMyTpl(list) {
    localStorage.setItem(LS_MYTPL, JSON.stringify(list));
    renderMyTpl();
  }
  function renderMyTpl() {
    var list = getMyTpl(), bar = $('myTplBar');
    if (!list.length) { bar.innerHTML = ''; return; }
    bar.innerHTML = '<span style="font-size:10.5px;color:rgba(255,255,255,0.4);align-self:center">我的模板：</span>' +
      list.map(function (t, i) {
        return '<span class="preset-chip" data-tact="use" data-i="' + i + '">' + esc(t.name) +
          '<span class="x" data-tact="del" data-i="' + i + '">\u00D7</span></span>';
      }).join('');
  }
  function saveMyTpl() {
    var p;
    try { p = getPayload(); }
    catch (e) { say('sendStatus', 'err', 'JSON 解析失败，无法保存：' + e.message); return; }
    var name = prompt('模板名称：', (p.embeds && p.embeds[0] && p.embeds[0].title) || '未命名模板');
    if (name === null) return;
    name = (name || '').trim() || '未命名模板';
    var list = getMyTpl(), exist = -1;
    list.forEach(function (t, i) { if (t.name === name) exist = i; });
    if (exist > -1) {
      if (!confirm('已存在同名模板，覆盖？')) return;
      list[exist] = { name: name, payload: p };
    } else {
      list.push({ name: name, payload: p });
    }
    setMyTpl(list);
    say('sendStatus', 'ok', '模板「' + name + '」已保存到本机。');
  }

  /* ---------------- 本地附件 ---------------- */
  var files = [];          // { file, name, url(blobURL) }
  var MAX_SIZE = 10 * 1024 * 1024;

  function humanSize(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  }

  function addFiles(fileList) {
    Array.prototype.forEach.call(fileList, function (f) {
      if (f.size > MAX_SIZE) {
        say('sendStatus', 'err', '「' + f.name + '」超过 10MB，Discord 免费额度会拒收，已跳过。');
        return;
      }
      if (files.some(function (x) { return x.name === f.name; })) return;
      files.push({ file: f, name: f.name, url: URL.createObjectURL(f) });
    });
    renderFiles();
    renderPreview();
  }

  function removeFile(i) {
    if (files[i]) { URL.revokeObjectURL(files[i].url); files.splice(i, 1); }
    renderFiles();
    renderPreview();
  }

  function clearFiles() {
    files.forEach(function (f) { URL.revokeObjectURL(f.url); });
    files = [];
    renderFiles();
    renderPreview();
  }

  function renderFiles() {
    var box = $('fileList');
    if (!files.length) { box.innerHTML = ''; return; }
    box.innerHTML = files.map(function (f, i) {
      var isImg = /^image\//.test(f.file.type);
      return '<div class="file-item">' +
        (isImg ? '<img class="file-thumb" src="' + f.url + '" alt="">' : '<span class="file-thumb"></span>') +
        '<span class="file-name" style="flex:1">' + esc(f.name) + '</span>' +
        '<span class="file-size">' + humanSize(f.file.size) + '</span>' +
        '<span class="file-acts">' +
          '<button class="mini" data-fact="ref" data-i="' + i + '">插入引用</button>' +
          '<button class="mini danger" data-fact="rm" data-i="' + i + '">移除</button>' +
        '</span>' +
      '</div>';
    }).join('');
  }

  // 把 attachment://xxx 指向本地 blob，便于预览
  function resolveImg(url) {
    if (!url) return '';
    var m = /^attachment:\/\/(.+)$/.exec(url);
    if (!m) return url;
    var hit = files.filter(function (f) { return f.name === m[1]; })[0];
    return hit ? hit.url : '';
  }

  // 把引用写进第一个 embed 的 image 字段
  function insertRef(i) {
    var f = files[i];
    if (!f) return;
    var p;
    try { p = getPayload(); }
    catch (e) { say('sendStatus', 'err', 'JSON 解析失败：' + e.message); return; }
    if (!p.embeds || !p.embeds.length) p.embeds = [{}];
    p.embeds[0].image = { url: 'attachment://' + f.name };
    setEditor(p);
    say('sendStatus', 'info', '已把 attachment://' + f.name + ' 写入 embeds[0].image。');
  }

  /* ---------------- 预览渲染 ---------------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 近似还原 Discord markdown（预览用，非完整实现）
  function md(text) {
    var out = esc(text);
    var blocks = [];
    // 代码块
    out = out.replace(/```([a-zA-Z0-9]*)\n?([\s\S]*?)```/g, function (m, lang, code) {
      blocks.push('<div class="dc-code">' + code.replace(/\n$/, '') + '</div>');
      return '\u0000B' + (blocks.length - 1) + '\u0000';
    });
    // 行内代码
    out = out.replace(/`([^`\n]+)`/g, '<span class="dc-inline-code">$1</span>');
    // 隐藏文字链接
    out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a class="dc-link" href="$2" target="_blank" rel="noopener">$1</a>');
    // 裸链接
    out = out.replace(/(^|[\s])(https?:\/\/[^\s<]+)/g,
      '$1<a class="dc-link" href="$2" target="_blank" rel="noopener">$2</a>');
    // 标题 / 小字
    out = out.replace(/^### (.+)$/gm, '<div style="font-size:16px;font-weight:600;color:#f2f3f5">$1</div>');
    out = out.replace(/^## (.+)$/gm, '<div style="font-size:20px;font-weight:700;color:#f2f3f5">$1</div>');
    out = out.replace(/^# (.+)$/gm, '<div style="font-size:24px;font-weight:700;color:#f2f3f5">$1</div>');
    out = out.replace(/^-# (.+)$/gm, '<div style="font-size:12px;color:#949ba4">$1</div>');
    // 引用
    out = out.replace(/^&gt; (.+)$/gm,
      '<div style="border-left:4px solid #4e5058;padding-left:10px;margin:2px 0">$1</div>');
    // 粗斜体等
    out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/__([^_]+)__/g, '<u>$1</u>');
    out = out.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    out = out.replace(/~~([^~]+)~~/g, '<s>$1</s>');
    out = out.replace(/\|\|([^|]+)\|\|/g,
      '<span style="background:#1e1f22;color:#1e1f22;border-radius:3px;padding:0 2px">$1</span>');
    // 还原代码块
    out = out.replace(/\u0000B(\d+)\u0000/g, function (m, i) { return blocks[+i]; });
    return out;
  }

  function renderPreview() {
    var box = $('preview');
    var p;
    try { p = getPayload(); }
    catch (e) {
      box.innerHTML = '<div style="color:#ff8f8f;font-size:13px">JSON 解析失败：' + esc(e.message) + '</div>';
      return;
    }

    var html = '';
    var tName = $('threadName').value.trim();
    if (tName) {
      var tagCnt = $('appliedTags').value.trim()
        ? $('appliedTags').value.split(',').filter(function (s) { return s.trim(); }).length : 0;
      html += '<div class="dc-thread-title">' + esc(tName) +
              '<span class="dc-tag">FORUM POST</span>' +
              (tagCnt ? '<span class="dc-tag">' + tagCnt + ' TAG' + (tagCnt > 1 ? 'S' : '') + '</span>' : '') +
              '</div>';
    }

    html += '<div class="dc-msg"><div class="dc-avatar">\uD83E\uDD16</div><div class="dc-main">';
    html += '<div><span class="dc-name">Delta Force Bot</span><span class="dc-badge">APP</span>' +
            '<span class="dc-time">' + new Date().toLocaleString('zh-CN') + '</span></div>';

    if (p.content) html += '<div class="dc-content">' + md(p.content) + '</div>';

    (p.embeds || []).forEach(function (em) {
      var hasColor = typeof em.color === 'number';
      html += '<div class="dc-embed' + (hasColor ? ' has-color' : '') + '"' +
              (hasColor ? ' style="--ec:#' + ('000000' + em.color.toString(16)).slice(-6) + '"' : '') + '>';
      if (em.author && em.author.name) {
        html += '<div class="dc-embed-author">' +
          (em.author.icon_url ? '<img src="' + esc(em.author.icon_url) + '" alt="">' : '') +
          esc(em.author.name) + '</div>';
      }
      if (em.title) html += '<div class="dc-embed-title">' + md(em.title) + '</div>';
      if (em.description) html += '<div class="dc-embed-desc">' + md(em.description) + '</div>';
      (em.fields || []).forEach(function (f) {
        html += '<div><div class="dc-field-name">' + md(f.name || '') + '</div>' +
                '<div class="dc-field-val">' + md(f.value || '') + '</div></div>';
      });
      if (em.image && em.image.url) {
        var iu = resolveImg(em.image.url);
        html += iu
          ? '<img class="dc-embed-img" src="' + esc(iu) + '" alt="" onerror="this.style.display=\'none\'">'
          : '<div class="dc-code" style="color:#949ba4">附件未选择：' + esc(em.image.url) + '</div>';
      }
      if (em.footer && em.footer.text) {
        html += '<div class="dc-embed-footer">' + esc(em.footer.text) + '</div>';
      }
      html += '</div>';
    });

    if (p.flags === 4096) {
      html += '<div style="margin-top:8px;font-size:12px;color:#949ba4">' +
              '\uD83D\uDD15 静默发送（不触发通知）</div>';
    }
    html += '</div></div>';
    box.innerHTML = html;
  }

  /* ---------------- 发送 ---------------- */
  // 从帖子链接里提取 ID：https://discord.com/channels/{guild}/{channel}
  function extractId(v) {
    var m = /channels\/\d+\/(\d+)/.exec(v);
    return m ? m[1] : v;
  }

  function sendMsg() {
    var url = $('hookUrl').value.trim();
    if (!url) { say('sendStatus', 'err', '请先填写 Webhook URL'); return; }

    var payload;
    try { payload = getPayload(); }
    catch (e) { say('sendStatus', 'err', 'JSON 解析失败：' + e.message); return; }

    // 发送前本地校验，避免白跑一趟 400
    if (!validate(false)) {
      if (!confirm('校验发现问题（见下方列表），仍要强行发送吗？')) return;
    }

    var tName = $('threadName').value.trim();
    var tId = extractId($('threadId').value.trim());
    if (tName && tId) { say('sendStatus', 'err', 'Thread Name 与 Thread ID 不能同时填写'); return; }
    if (tName) payload.thread_name = tName;

    var tags = $('appliedTags').value.trim();
    if (tags && tName) {
      payload.applied_tags = tags.split(',').map(function (s) { return s.trim(); })
        .filter(function (s) { return s; });
    }

    // wait=true 才会返回消息对象（含 message id），删除功能依赖它
    var target = url + (url.indexOf('?') > -1 ? '&' : '?') + 'wait=true';
    if (tId) target += '&thread_id=' + encodeURIComponent(tId);

    function buildOpts() {
      var opts = { method: 'POST' };
      if (files.length) {
        // 带附件时必须用 multipart/form-data：payload_json + files[n]
        var fd = new FormData();
        payload.attachments = files.map(function (f, i) {
          return { id: i, filename: f.name };
        });
        fd.append('payload_json', JSON.stringify(payload));
        files.forEach(function (f, i) {
          fd.append('files[' + i + ']', f.file, f.name);
        });
        opts.body = fd;   // 不手动设 Content-Type，交给浏览器带 boundary
      } else {
        opts.headers = { 'Content-Type': 'application/json' };
        opts.body = JSON.stringify(payload);
      }
      return opts;
    }

    $('sendBtn').disabled = true;
    say('sendStatus', 'info', files.length ? '正在上传附件并发送…' : '正在发送…');

    function attempt(tryNo) {
      fetch(target, buildOpts()).then(function (res) {
        return res.text().then(function (txt) {
          return { ok: res.ok, status: res.status, txt: txt };
        });
      }).then(function (r) {
        // 429 限流：按 retry_after 自动重试，最多 3 次
        if (r.status === 429 && tryNo < 3) {
          var wait = 1;
          try { wait = (JSON.parse(r.txt).retry_after) || 1; } catch (e) { /* ignore */ }
          say('sendStatus', 'info', '触发限流，' + wait.toFixed(2) + 's 后自动重试（第 ' + (tryNo + 1) + ' 次）…');
          setTimeout(function () { attempt(tryNo + 1); }, wait * 1000 + 250);
          return;
        }
        $('sendBtn').disabled = false;
        if (!r.ok) {
          say('sendStatus', 'err', '发送失败 HTTP ' + r.status + '：' + r.txt);
          return;
        }
        var msg = {};
        try { msg = JSON.parse(r.txt); } catch (e) { /* ignore */ }
        var link = (msg.channel_id && msg.id)
          ? 'https://discord.com/channels/' + (msg.guild_id || '@me') + '/' + msg.channel_id + '/' + msg.id
          : '';
        addHist({
          id: msg.id || '',
          channelId: msg.channel_id || tId || '',
          guildId: msg.guild_id || '',
          link: link,
          title: tName || (payload.embeds && payload.embeds[0] && payload.embeds[0].title) || '(纯文本消息)',
          time: new Date().toLocaleString('zh-CN'),
          isThread: !!tName,
          hasFiles: files.length > 0,
          payload: payload
        });
        say('sendStatus', 'ok', '发送成功。message_id = ' + (msg.id || '未返回') +
            (tName ? '（已创建论坛帖，thread_id = ' + (msg.channel_id || '?') + '）' : '') +
            (link ? '\n跳转查看：' + link : ''));
      }).catch(function (e) {
        $('sendBtn').disabled = false;
        say('sendStatus', 'err', '请求异常：' + e.message + '（若为 CORS/网络问题，请确认已用 http 方式打开本页面）');
      });
    }
    attempt(0);
  }

  /* ---------------- 历史 & 删除 ---------------- */
  function getHist() {
    try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); }
    catch (e) { return []; }
  }
  function setHist(list) {
    localStorage.setItem(LS_HIST, JSON.stringify(list));
    renderHist();
  }
  function addHist(rec) {
    var list = getHist();
    list.unshift(rec);
    setHist(list.slice(0, 60));
  }

  function renderHist() {
    var list = getHist(), box = $('histList');
    if (!list.length) { box.innerHTML = '<div class="empty">暂无发送记录</div>'; return; }
    box.innerHTML = list.map(function (h, i) {
      return '<div class="hist-item">' +
        '<div class="hist-top">' +
          '<div class="hist-title">' + esc(h.title) +
            (h.isThread ? ' <span style="color:#24f4b2;font-size:10px">[FORUM]</span>' : '') +
            (h.hasFiles ? ' <span style="color:rgba(255,255,255,0.4);font-size:10px">[附件]</span>' : '') +
          '</div>' +
          '<div class="hist-actions">' +
            (h.link ? '<a class="dc-link" href="' + esc(h.link) + '" target="_blank" rel="noopener" ' +
              'style="font-size:11px;align-self:center;margin-right:2px">打开</a>' : '') +
            '<button class="mini" data-act="load" data-i="' + i + '">载入</button>' +
            '<button class="mini" data-act="edit" data-i="' + i + '">更新</button>' +
            '<button class="mini danger" data-act="del" data-i="' + i + '">删除</button>' +
          '</div>' +
        '</div>' +
        '<div class="hist-meta">' + esc(h.time) +
          ' · msg_id: ' + esc(h.id || '-') +
          (h.channelId ? ' · thread_id: ' + esc(h.channelId) : '') +
        '</div>' +
      '</div>';
    }).join('');
  }

  function msgUrl(h) {
    var base = $('hookUrl').value.trim();
    if (!base || !h.id) return null;
    var u = base + '/messages/' + h.id;
    // 论坛帖 / 线程内的消息必须带 thread_id
    if (h.channelId) u += '?thread_id=' + encodeURIComponent(h.channelId);
    return u;
  }

  function delMsg(i) {
    var list = getHist(), h = list[i];
    if (!h) return;
    var u = msgUrl(h);
    if (!u) {
      if (confirm('该记录缺少 message_id，无法通过 API 删除。是否仅从本地历史中移除？')) {
        list.splice(i, 1); setHist(list);
      }
      return;
    }
    var tip = h.isThread
      ? '这是论坛帖的首条消息，删除它会连带删除整个帖子。确认删除？'
      : '确认删除这条消息？';
    if (!confirm(tip)) return;

    fetch(u, { method: 'DELETE' }).then(function (res) {
      if (res.ok || res.status === 204) {
        list.splice(i, 1); setHist(list);
        say('sendStatus', 'ok', '已从 Discord 删除该消息。');
      } else {
        return res.text().then(function (t) {
          say('sendStatus', 'err', '删除失败 HTTP ' + res.status + '：' + t);
        });
      }
    }).catch(function (e) { say('sendStatus', 'err', '删除异常：' + e.message); });
  }

  function editMsg(i) {
    var list = getHist(), h = list[i];
    if (!h) return;
    var u = msgUrl(h);
    if (!u) { say('sendStatus', 'err', '该记录缺少 message_id，无法编辑。'); return; }
    var payload;
    try { payload = getPayload(); }
    catch (e) { say('sendStatus', 'err', 'JSON 解析失败：' + e.message); return; }
    delete payload.thread_name; // 编辑时不可带该字段
    delete payload.attachments;

    if (/attachment:\/\//.test(JSON.stringify(payload))) {
      say('sendStatus', 'err', '当前 JSON 引用了本地附件（attachment://），编辑接口无法重新上传文件。' +
        '请改用图片外链，或删除后重新发送。');
      return;
    }

    if (!confirm('将用当前编辑器中的 JSON 覆盖这条已发送消息，确认？')) return;

    fetch(u, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.text().then(function (t) { return { ok: res.ok, status: res.status, t: t }; });
    }).then(function (r) {
      if (r.ok) {
        h.payload = payload;
        h.time = new Date().toLocaleString('zh-CN') + '（已编辑）';
        setHist(list);
        say('sendStatus', 'ok', '消息内容已更新。');
      } else {
        say('sendStatus', 'err', '更新失败 HTTP ' + r.status + '：' + r.t);
      }
    }).catch(function (e) { say('sendStatus', 'err', '更新异常：' + e.message); });
  }

  /* ---------------- 事件绑定 ---------------- */
  $('presetSelect').addEventListener('change', function (e) {
    applyPreset(+e.target.value);
    say('cfgStatus', 'ok', '已切换到预设「' + curPreset().name + '」。');
  });
  $('newPreset').addEventListener('click', newPreset);
  $('updPreset').addEventListener('click', updPreset);
  $('renamePreset').addEventListener('click', renamePreset);
  $('delPreset').addEventListener('click', delPreset);
  $('hookUrl').addEventListener('change', syncToPreset);
  $('saveTpl').addEventListener('click', saveMyTpl);

  // 标签相关
  $('tagBar').addEventListener('click', function (e) {
    var el = e.target.closest('[data-tagid]');
    if (el) toggleTag(el.getAttribute('data-tagid'));
  });
  $('appliedTags').addEventListener('input', function () { renderTags(); renderPreview(); });
  $('importTags').addEventListener('click', function () {
    var box = $('tagImportBox');
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  });
  $('doImportTags').addEventListener('click', importTags);
  $('cancelImportTags').addEventListener('click', function () {
    $('tagImportBox').style.display = 'none';
  });
  $('clearTagSel').addEventListener('click', function () {
    $('appliedTags').value = '';
    renderTags(); renderPreview(); saveCfg();
  });
  $('copyConsoleJs').addEventListener('click', function () {
    var ta = document.createElement('textarea');
    ta.value = CONSOLE_JS;
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); say('cfgStatus', 'ok', '脚本已复制。到 Discord 网页版打开论坛频道 → F12 控制台 → 粘贴回车，即可打印出全部标签名与 ID。'); }
    catch (e) { say('cfgStatus', 'err', '复制失败，请手动复制：' + CONSOLE_JS); }
    document.body.removeChild(ta);
  });
  $('myTplBar').addEventListener('click', function (e) {
    var el = e.target.closest('[data-tact]');
    if (!el) return;
    var i = +el.getAttribute('data-i');
    var list = getMyTpl();
    if (el.getAttribute('data-tact') === 'del') {
      e.stopPropagation();
      if (!confirm('删除模板「' + list[i].name + '」？')) return;
      list.splice(i, 1); setMyTpl(list); return;
    }
    if (list[i]) setEditor(list[i].payload);
  });
  $('checkBtn').addEventListener('click', function () { validate(false); });
  $('exportHist').addEventListener('click', function () {
    var data = JSON.stringify(getHist(), null, 2);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.download = 'webhook-history-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $('clearHist').addEventListener('click', function () {
    if (!confirm('清空本地发送历史？（不会删除 Discord 上已发出的消息）')) return;
    setHist([]);
  });
  $('threadId').addEventListener('blur', function () {
    var v = $('threadId').value.trim();
    var id = extractId(v);
    if (id !== v) { $('threadId').value = id; say('cfgStatus', 'info', '已从链接中提取 Thread ID：' + id); }
    syncToPreset();
  });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); sendMsg(); }
  });
  $('clearCfg').addEventListener('click', function () {
    if (!confirm('重置全部预设为默认值？（自定义预设、已导入的标签都会丢失，发送历史保留）')) return;
    localStorage.removeItem(LS_PRESET);
    localStorage.removeItem(LS_CFG);
    $('threadName').value = '';
    curIdx = 0;
    setPresets(JSON.parse(JSON.stringify(DEFAULT_PRESETS)));
    applyPreset(0);
    say('cfgStatus', 'ok', '已重置为默认预设。');
  });
  $('sendBtn').addEventListener('click', sendMsg);
  $('previewBtn').addEventListener('click', renderPreview);
  $('fmtJson').addEventListener('click', function () {
    try { setEditor(getPayload()); hide('sendStatus'); }
    catch (e) { say('sendStatus', 'err', 'JSON 解析失败：' + e.message); }
  });
  $('silentToggle').addEventListener('click', function () {
    try {
      var p = getPayload();
      if (p.flags === 4096) { delete p.flags; say('sendStatus', 'info', '已关闭静默：本条消息会正常推送通知。'); }
      else { p.flags = 4096; say('sendStatus', 'info', '已开启静默（flags=4096）：消息正常显示但不推送通知。'); }
      setEditor(p);
    } catch (e) { say('sendStatus', 'err', 'JSON 解析失败：' + e.message); }
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-tpl]'), function (b) {
    b.addEventListener('click', function () { setEditor(TEMPLATES[b.getAttribute('data-tpl')]); });
  });
  // 附件相关事件
  $('fileInput').addEventListener('change', function (e) {
    addFiles(e.target.files);
    e.target.value = '';
  });
  $('clearFiles').addEventListener('click', clearFiles);
  $('fileList').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-fact]');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    if (b.getAttribute('data-fact') === 'rm') removeFile(i);
    else insertRef(i);
  });
  var fz = $('fileZone');
  ['dragenter', 'dragover'].forEach(function (ev) {
    fz.addEventListener(ev, function (e) { e.preventDefault(); fz.classList.add('drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    fz.addEventListener(ev, function (e) { e.preventDefault(); fz.classList.remove('drag'); });
  });
  fz.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });

  $('histList').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-act]');
    if (!b) return;
    var i = +b.getAttribute('data-i'), act = b.getAttribute('data-act');
    var h = getHist()[i];
    if (act === 'del') delMsg(i);
    else if (act === 'edit') editMsg(i);
    else if (act === 'load' && h && h.payload) setEditor(h.payload);
  });
  ['threadName', 'threadId'].forEach(function (id) {
    $(id).addEventListener('input', renderPreview);
  });
  var t = null;
  $('jsonEditor').addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () { renderPreview(); updateCount(); }, 400);
  });

  /* ---------------- 初始化 ---------------- */
  loadCfg();
  setEditor(TEMPLATES.build);
  renderMyTpl();
  renderFiles();
  renderHist();

  // 配置文件缺失时给出明确指引，而不是让用户面对一个空预设发懵
  if (!CFG.presets) {
    say('cfgStatus', 'err',
      '未找到 webhook-config.js。请把 webhook-config.example.js 复制为 webhook-config.js，' +
      '填入你的 Webhook URL 与论坛标签后刷新页面；也可以直接在上方手动填写使用。');
  }
})();
