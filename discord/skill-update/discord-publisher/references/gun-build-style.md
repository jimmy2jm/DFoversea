# Gun build post style

Use one embed and keep the visual hierarchy stable.

## Information order

1. Set the forum title to `[WEAPON · PRICE] BUILD NAME` for Operations, or `[WEAPON · WARFARE] BUILD NAME` when the refreshed Warfare price is not applicable.
2. Put the game mode in `embed.author.name`, for example `OPERATIONS`.
3. Put the build name in `embed.title` and link it to the canonical HQ URL.
4. Start `embed.description` with the official English weapon name and class, then `**PRICE · 340K**`. Preserve the supplied number format and remove currency symbols.
5. Put two or three short characteristic tags below the price as inline-code chips: `` `Agile Lean Peek` `Bracing Stability` `New Weapon` ``.
6. Put blank lines only above and below the build-code section. Keep the exact English build/import code alone inside a fenced code block.
7. Add the concise HQ guidance and `[OPEN DELTA FORCE HQ](https://www.playdeltaforce.com/events/hq/)` without an extra blank line between guidance and link.
8. Put the composite gun card in `embed.image`; keep the statistics in the card instead of duplicating them as fields.
9. Set the footer to `Build by AUTHOR`.

Do not add decorative emoji or extra descriptions unless the user provides a use case for them.

## Color

Use one restrained embed accent color to distinguish the card without competing with the weapon image. The default accent is Delta-style teal `#24F4B2`, represented in Discord JSON as decimal `2421938`:

```json
{ "color": 2421938 }
```

Discord renders this as the embed's left-side accent bar. Do not simulate colored text with ANSI code blocks or fill the statistics with colored square emoji; those approaches reduce readability and render inconsistently across clients.

## Price

- Display the price immediately below the build title and above the characteristic tags.
- Use `PRICE · VALUE` in English and localize only the label for other languages.
- Do not add `$`, `¥`, `₽`, `€`, or another currency symbol.
- Preserve compact notation such as `340K` or `34万` when provided.
- Never infer or calculate a missing price.
- Treat the HQ detail value `-1` as not applicable, never as a price.
- For Warfare with a not-applicable price, use `[WEAPON · WARFARE] BUILD NAME` and omit the price line from both the embed and card.
- For Operations, block publishing when the refreshed record has no usable price.

## Statistics

Use this English set and order:

- HANDLING SPEED
- STABILITY
- EFFECTIVE RANGE
- BASE DAMAGE
- HIP-FIRE ACCURACY
- RECOIL CONTROL

Use localized labels for other languages, but do not change the underlying order.

For values normalized to 0–100, render a ten-cell bar plus the exact number:

```text
`████████░░` **82**
```

Calculate filled cells as the nearest whole tenth, clamped from 0 to 10. Never create a progress bar when the value scale is unknown. In that case, show only the exact raw value until the user provides the maximum or normalization rule.

## Tags

Keep two tag layers distinct:

- `thread.tags`: Discord Forum tag aliases or IDs used for filtering.
- Visual characteristic tags in `embed.description`: two or three short phrases describing the build.

Use the same wording in both layers only when the forum taxonomy actually contains that tag.

Assign visual tags a semantic type so the renderer can differentiate them consistently:

- `mobility`: blue, arrow/forward-motion symbol.
- `control`: teal-green, square/stability symbol.
- `status`: amber, diamond/status symbol.

Discord text cannot color individual tags reliably, so preserve the same distinction there with the symbols as well as the wording.

## Image

Prefer a `2400 × 1350` (16:9) composite PNG for sharp Discord display. Keep the file below Discord's configured upload limit and use either:

- A stable HTTPS URL in `embed.image.url`, or
- A local attachment declared in `files` and referenced as `attachment://filename`.

Render directly at `2400 × 1350` or larger and crop to the 16:9 canvas. Do not generate at 1200 × 675 and enlarge later.

The composite layout should use:

- A 44% left information column and a 56% right weapon area.
- Build name, weapon name, author, price, and two or three characteristic tags above the statistics.
- Six vertically stacked progress bars with exact numeric values. Use at least 14 px labels and 18 px values at the 1200 px source width.
- A dark teal base, one `#24F4B2` accent, restrained grid texture, and at least 36 px safe padding.
- The finished weapon centered in the right panel with enough empty space around the muzzle and stock.

Keep the exact build/import code outside the image in a Discord fenced code block so it remains copyable. Preserve all six raw values in the input JSON, and add an image or attachment description containing the values for accessibility when the Discord payload supports it.

When a tools-site URL is available, include a locally stored QR code in the lower-right action area of the composite image. Encode the exact canonical URL, use black modules on white with a four-module quiet zone and Q-level error correction, and show a readable short URL beside it. The QR image must remain scannable after the card is displayed at roughly half its source width in Discord.
