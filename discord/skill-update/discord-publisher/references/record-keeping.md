# Record keeping

Use deterministic records for every Delta Force Publisher operation. Never store webhook URLs, tokens, cookies, login data, or raw request authorization in these files.

## Files

- `banner-builds.json`: Canonical current-and-historical Banner build database.
- `banner-builds.md`: Human-readable table generated from the canonical JSON.
- `activity-log.jsonl`: Append-only record of refresh, inspect, prepare, validate, dry-run, publish, and failure operations.
- `publish-log.jsonl`: Append-only safe publication receipts.

Resolve the directory from `config.recordsDir`, then `DISCORD_PUBLISHER_RECORDS_DIR`, then `./records/delta-force-publisher`.

## Banner scope

Refresh only the two official English TIMI Global sources every time. The source/API channel value is `LI`:

- LI Operations: `op_sol_en.js`
- LI Warfare: `op_mp_en.js`

Do not request the `_ga_` sources and never select or publish a GA build. Preserve GA entries collected before this scope change as inactive history so publication and operation audits remain intact.

Preserve every Banner slot and every scheme inside each slot. Operations currently allows up to two schemes per gun; Warfare currently uses one. Do not hard-code those counts.

For every scheme, store the source set and slot, scheme ID, official English weapon name, parsed weapon class, mode, channel, raw and usable price state, author, page recommendation tags, three derived Discord forum tag aliases, all six final and base statistics, full Banner build code, detail API build code, finished image URL, base weapon image URL, canonical HQ URL, first/last seen timestamps, active state, fingerprint, publication count, and last publication IDs.

Read [discord-forum-tags.md](discord-forum-tags.md) for the authoritative Discord label, alias, and tag-ID mapping. A missing mode, product-channel, or weapon-type mapping makes the refresh partial and blocks publication.

## Price rules

- Preserve the raw detail price exactly.
- Treat raw `-1` as `not-applicable`, not as a publishable price.
- Never display `PRICE · -1`.
- For Warfare when price is not applicable, omit the price line and use `[WEAPON · WARFARE] BUILD NAME` for the forum title.
- For Operations, a missing price blocks publication until confirmed from the live source.

## Post record identity

Every publishable post JSON must contain:

```json
{
  "record": {
    "sourceType": "hq-banner",
    "schemeId": "32-character scheme ID",
    "buildCode": "exact full Banner import code",
    "weaponName": "official English weapon name",
    "buildName": "official build name"
  }
}
```

Use `sourceType: "hq"` for a non-Banner HQ build and `sourceType: "user-provided"` for a supplied build. A Banner live send must match an active refreshed record by scheme ID and full build code.

## Operation rules

- Refresh before Banner fetch, inspection, selection, or preparation.
- Append a success or failure event after every manual operation.
- Let `validate.mjs` log validation automatically.
- Let dry-run `publish.mjs` log its result automatically.
- Let live `publish.mjs` refresh both LI sources first, then write both the safe publication receipt and operation event automatically.
- Keep JSONL append-only. Regenerate only the JSON/Markdown Banner snapshot.
- If Banner refresh is partial, retain the generated diagnostic snapshot but block live publication.
