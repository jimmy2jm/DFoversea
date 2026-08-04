---
name: discord-publisher
description: Track TIMI Global (LI) Delta Force HQ homepage Banner loadouts, maintain operation and publication ledgers, generate validated English 16:9 weapon posts, and publish through an exact configured Discord webhook alias. Use when Codex needs to refresh or inspect LI Banner builds, fetch or prepare a Delta Force gun build, create or validate a share card/post, review publication history, or send one approved Discord forum post.
---

# Delta Force Discord Publisher

Maintain a live, auditable Banner-build inventory and turn an official English Delta Force HQ build or user-provided build into the approved share card and Discord forum post. Let the active AI handle extraction and writing; use the bundled scripts for deterministic refresh, validation, record keeping, and publishing. Do not call a separate AI API.

## Mandatory records

Read [references/record-keeping.md](references/record-keeping.md) before any operation. Every operation must append to `activity-log.jsonl`. Every successful live publication must append to `publish-log.jsonl` and update the matching build record. Never delete or rewrite prior JSONL entries.

For any request that fetches, inspects, selects, or prepares homepage Banner builds, refresh first:

```bash
node scripts/records.mjs --action refresh --operation <fetch|inspect|select|prepare>
```

For a local action that does not refresh or invoke `validate.mjs`/`publish.mjs`, append a result after the action:

```bash
node scripts/records.mjs --action log --operation <name> --status <success|failed> [--scheme-id <id>] [--build-code <code>] [--note <text>]
```

`validate.mjs` and `publish.mjs` log themselves. A live publish automatically refreshes both English TIMI Global (`LI`) Banner sources before contacting Discord and refuses to send if refresh is incomplete or an `hq-banner` record is stale. Do not fetch, select, prepare, or publish GA builds; retain previously recorded GA entries as inactive history only.

## Workflow

1. Default to the official English tools site: `https://www.playdeltaforce.com/events/hq/`. Refresh the Banner records instead of relying on training memory or an old working file.
2. Select the exact active `LI` build from `banner-builds.json`. Treat `LI` as the TIMI Global channel. Never select a GA record, including one retained as history. Preserve the Banner build code, scheme ID, source set, channel, mode, official English weapon name/class, price state, author, tags, six statistics, finished weapon image, and canonical HQ URL. Never invent a missing value.
3. For non-Banner HQ or user-provided sources, record the operation and extract the same post fields. Preserve codes, identifiers, URLs, prices, and numbers exactly.
4. Read [references/message-format.md](references/message-format.md), [references/content-guidelines.md](references/content-guidelines.md), [references/gun-build-style.md](references/gun-build-style.md), and [references/discord-forum-tags.md](references/discord-forum-tags.md). Start from `assets/gun-build.example.json`, `assets/post.example.json`, and the current `design/gun-card-prototype.html`.
5. Generate the 16:9 card at 2400 × 1350 or larger. Keep all visible copy in English, omit brand logos, include the HQ QR code, keep `OPEN DELTA FORCE HQ` on one line, and preserve the approved teal/blue/amber tag differentiation. Save generated working files outside the skill directory.
6. Add the required top-level `record` object to the post specification. Use `sourceType: "hq-banner"` plus the exact scheme ID and full Banner build code for a homepage Banner post. Copy the build record's three `discordTagAliases` into `thread.tags`: exactly one mode, one product-channel, and one weapon-type tag. For LI builds the product-channel tag is always `global`.
7. Resolve the exact configured destination alias. Never map “test channel,” “正式频道,” or another descriptive name to a different alias. If the requested destination has no exact configured alias, stop and ask; never fall back to `delta-force-official`.
8. Validate the post. The command appends a validation result to the activity log:

   ```bash
   node scripts/validate.mjs --input /absolute/path/to/post.json
   ```

9. Fix every validation error. Explain warnings that affect publishing behavior.
10. Run a dry run. It appends a dry-run result to the activity log. Inspect the destination alias, thread title or ID, resolved tags, record identity, attachment names, silent state, mention state, and redacted request summary:

   ```bash
   node scripts/publish.mjs --input /absolute/path/to/post.json
   ```

11. Treat only a request to send one post to an exact configured alias as authorization for that one live publication. Drafting, preparing, validating, previewing, or saying “test channel” without a configured test alias is not authorization to use another destination.
12. After authorization, publish with the live-send guard. The command refreshes the Banner database, validates the selected Banner record, writes the receipt, appends the publication ledger, and updates the build's publication count:

   ```bash
   node scripts/publish.mjs --input /absolute/path/to/post.json --confirm-send --receipt /absolute/path/to/receipt.json
   ```

13. Report the refresh timestamp, record status, Discord message ID, thread ID, and message URL. Never print or repeat a webhook URL.

## Safety rules

- Treat webhook URLs as credentials. Read them only through the local private configuration.
- Never place webhook URLs in a post specification, command argument, record file, log, example, or response.
- Keep `allowed_mentions.parse` empty by default. Enable real mentions only when the user explicitly asks and has reviewed them.
- Never publish after a draft-only, inventory-only, refresh-only, preview-only, or validate-only request.
- Never substitute a configured official destination when the user requested an unconfigured test destination.
- Never publish a weapon post without exactly three matching Discord forum tags. Treat page recommendation tags as content metadata, never as Discord forum tags.
- Do not invent missing codes, prices, URLs, tag IDs, dates, or product facts. Mark uncertain content and stop before publishing.
- Preserve codes, identifiers, URLs, and numbers exactly during translation.
- Do not infer that permission to publish one post authorizes a batch or a different channel.
- Stop after an HTTP error. Do not bypass Discord validation, permissions, or rate limits.
- Do not delete publication or activity records unless the user explicitly requests an exact, recoverable cleanup.

## Local configuration

The installed personal skill may contain `.private/discord-publisher.config.json` and `.private/webhook.env`. Treat both as local credentials: never display, quote, copy into working files, or commit them. The publisher loads them automatically. Configure `recordsDir` in the publisher configuration or set `DISCORD_PUBLISHER_RECORDS_DIR`; otherwise records default to `./records/delta-force-publisher` under the command's working directory.

Use Node.js 20 or newer. The scripts have no package dependencies.
