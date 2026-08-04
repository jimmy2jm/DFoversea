---
name: discord-publisher
description: Pull English Delta Force weapon builds from Delta Force HQ or user-provided sources, generate the 16:9 weapon share card, compose and validate the English Discord forum post, attach media, and publish it through the user's locally configured webhook. Use when the user asks to fetch, prepare, preview, send, or publish a Delta Force gun build or loadout to Discord. A direct request to send or publish one post to the configured official channel is authorization for that one live publish; drafting or previewing is not.
---

# Delta Force Discord Publisher

Turn an official English Delta Force HQ build or user-provided build into the approved share card and Discord forum post. Let the active AI handle extraction and writing; use the bundled scripts for deterministic validation and publishing. Do not call a separate AI API.

## Workflow

1. Default to the official English tools site: `https://www.playdeltaforce.com/events/hq/`. Browse the live page because its builds can change. If login blocks the build code, obtain it from an English page/session or ask the user; never translate a Chinese build code.
2. Extract the build name, official English weapon name and class, mode, price without currency symbol, author, two or three characteristic tags, all six statistics, build code, finished weapon image, and canonical HQ URL. Never invent a missing value.
3. Read [references/message-format.md](references/message-format.md), [references/content-guidelines.md](references/content-guidelines.md), and [references/gun-build-style.md](references/gun-build-style.md). Start from `assets/gun-build.example.json` and the current `design/gun-card-prototype.html`.
4. Generate the 16:9 card at 2400 × 1350 or larger. Keep all visible copy in English, omit brand logos, include the HQ QR code, keep `OPEN DELTA FORCE HQ` on one line, and preserve the approved teal/blue/amber tag differentiation. Save generated working files outside the skill directory.
5. Create one post specification following `assets/post.example.json`. Use channel alias `delta-force-official` unless the user names another configured destination.
6. Resolve the installed skill directory and validate the post. The local configuration is discovered automatically; do not read or print its webhook secret:

   ```bash
   node scripts/validate.mjs --input /absolute/path/to/post.json
   ```

7. Fix every validation error. Explain warnings that affect publishing behavior.
8. Run a dry run and inspect the destination alias, thread title or ID, resolved tags, attachment names, and redacted request summary:

   ```bash
   node scripts/publish.mjs --input /absolute/path/to/post.json
   ```

9. Treat an explicit request such as “发送”, “推送”, or “publish to the official channel” as confirmation for one post to `delta-force-official`. Ask before sending when the destination, post count, or requested action is ambiguous. A request only to draft, prepare, preview, or validate is not permission to publish.
10. After authorization, publish with the live-send guard:

   ```bash
   node scripts/publish.mjs --input /absolute/path/to/post.json --confirm-send --receipt /absolute/path/to/receipt.json
   ```

11. Report the Discord message ID, thread ID, and message URL returned by the script. Never print or repeat a webhook URL.

## Safety Rules

- Treat webhook URLs as credentials. Read them only through the local private configuration.
- Never place webhook URLs in a post specification, command argument, generated example, log, or response.
- Keep `allowed_mentions.parse` empty by default. Enable real mentions only when the user explicitly asks and has reviewed them.
- Never publish after a draft-only or preview-only request. A direct request to send one post to the configured official channel authorizes that one send.
- Do not invent missing codes, prices, URLs, tag IDs, dates, or product facts. Mark uncertain content and ask the user.
- Preserve codes, identifiers, URLs, and numbers exactly during translation.
- Do not infer that permission to publish one post authorizes a batch or a different channel.
- Stop after an HTTP error. Do not bypass Discord validation, permissions, or rate limits.

## Local Configuration

The installed personal skill may contain `.private/discord-publisher.config.json` and `.private/webhook.env`. Treat both as local credentials: never display, quote, copy into working files, or commit them. The publisher loads them automatically. For an exported or open-source copy, omit `.private/` and use `assets/config.example.json`.

Use Node.js 20 or newer. The scripts have no package dependencies.
