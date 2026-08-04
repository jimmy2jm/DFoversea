# Post specification

Use one JSON object per Discord message or forum post.

```json
{
  "channel": "community-en",
  "thread": {
    "name": "320K Aurora AR Build",
    "id": "",
    "tags": ["guide", "assault-rifle"]
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
- `thread.name`: Create a new forum post. Maximum 100 characters.
- `thread.id`: Reply to an existing thread. Accept a Discord snowflake or a Discord channel/thread URL.
- `thread.tags`: Up to five aliases from the selected channel's `tagMap`, or raw Discord tag IDs. Tags apply only to a new forum post.
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
