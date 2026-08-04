# Content guidelines

## Extracting source material

- Separate directly observed text from inferred meaning.
- Preserve codes, IDs, URLs, prices, dates, version numbers, and proper nouns exactly.
- Use an explicit placeholder such as `[NEEDS CONFIRMATION]` when a required value is unreadable or absent. Never fabricate it.
- Prefer concise Discord-native hierarchy over copying the source layout literally.

## Translation

- Translate explanatory prose, titles, and field labels.
- Do not translate import codes, commands, URLs, filenames, IDs, or product identifiers.
- Keep each language in a separate post specification unless the user requests a bilingual post.
- Re-run deterministic validation after every translation.

## Discord formatting

- Use `content` for short context or a call to action.
- Use an embed title for the primary subject.
- Use fields for values users need to scan or copy.
- Put a machine-importable code alone inside a fenced code block.
- Use an embed image for the main visual; use attachments only when a local file must be uploaded.
- Avoid decorative emoji unless the source brand or user explicitly calls for them.

## Pre-publish review

Present the refreshed-at timestamp, record source type, scheme ID/build code, exact channel alias, language, thread title or ID, resolved tag IDs, attachment names, silent state, mention state, and validation warnings. Ask for explicit confirmation before invoking `--confirm-send`.
