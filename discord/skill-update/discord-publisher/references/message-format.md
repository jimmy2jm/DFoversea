# Post specification

Use one JSON object per Discord message or forum post.

```json
{
  "channel": "community-en",
  "record": {
    "sourceType": "hq-banner",
    "schemeId": "8432decd361ded23bfb74f096e701922",
    "buildCode": "AR-57 Assault Rifle-Operations-6K1STRS052HRDQOIRARB5",
    "weaponName": "AR-57 Assault Rifle",
    "buildName": "RoguePringle's AR57"
  },
  "thread": {
    "name": "320K Aurora AR Build",
    "id": "",
    "tags": ["operations", "global", "ar"]
  },
  "message": {
    "content": "",
    "embeds": []
  },
  "files": [],
  "options": {
    "silent": true,
    "allowMentions": false
  }
}
```

## Fields

- `channel`: Required alias from the publisher configuration.
- `record`: Required safe identity used by the activity and publication ledgers. Use `hq-banner`, `hq`, or `user-provided` as `sourceType`; `hq-banner` also requires the exact 32-character scheme ID.
- `thread.name`: Create a new forum post. Maximum 100 characters.
- `thread.id`: Reply to an existing thread. Accept a Discord snowflake or a Discord channel/thread URL.
- `thread.tags`: For every weapon publication, provide exactly three aliases derived from the build record: one mode tag, one product-channel tag, and one weapon-type tag. Tags apply only to a new forum post; replying to an existing thread is not a valid weapon publication flow.
- `message`: Discord webhook message payload. Prefer `content` and `embeds`; the publisher adds thread and attachment metadata.
- `files`: Local attachments. Resolve relative paths from the post specification file.
- `options.silent`: Add Discord's suppress-notifications flag.
- `options.allowMentions`: Preserve explicit `allowed_mentions`. When false or omitted, replace it with `{ "parse": [] }`.

Do not set both `thread.name` and `thread.id`.

## Attachments

Declare each local file:

```json
{
  "path": "./images/build.png",
  "name": "build.png"
}
```

Reference it from an embed with the exact attachment name:

```json
{
  "image": { "url": "attachment://build.png" }
}
```

## Core Discord limits

- Content: 2,000 characters
- Embeds: 10
- Combined embed text: 6,000 characters
- Embed title: 256 characters
- Embed description: 4,096 characters
- Fields per embed: 25
- Field name: 256 characters
- Field value: 1,024 characters
- Footer text: 2,048 characters
- Author name: 256 characters
- Forum title: 100 characters
- Forum tags: 5
- Attachments: 10

The default attachment size check is a conservative 10 MiB. Override it with `maxFileBytes` in the publisher configuration if the target Discord environment supports another limit.

Set an optional `guildId` on each channel configuration when message links are required. Discord webhook responses do not always include the guild ID; publishing still succeeds without it, but the receipt cannot construct a clickable Discord URL.
