# Discord forum tags

Use these aliases for forum channel `1314164395168763915`. The IDs were extracted from the user's saved Discord frontend markup. Every new weapon post must carry exactly one tag from each group.

| Group | Discord label | Alias | Tag ID |
|---|---|---|---|
| Mode | Operations | `operations` | `1314164655408812092` |
| Mode | Warfare | `warfare` | `1314164668335390823` |
| Product channel | Garena | `garena` | `1318109541153636412` |
| Product channel | Global | `global` | `1318109578017247243` |
| Weapon type | Pistols | `pistols` | `1314164750699069480` |
| Weapon type | SMG | `smg` | `1314164766557863996` |
| Weapon type | AR | `ar` | `1314164775587942421` |
| Weapon type | BR | `br` | `1314164790683369542` |
| Weapon type | Shotguns | `shotguns` | `1314164814121144361` |
| Weapon type | LMG | `lmg` | `1314164828704735274` |
| Weapon type | MR | `mr` | `1314164840138412052` |
| Weapon type | SR | `sr` | `1314164849982312448` |

## Build mapping

- `OPERATIONS` → `operations`; `WARFARE` → `warfare`.
- `LI` (TIMI Global) → `global`. Keep `GA` → `garena` only for historical interpretation; never publish a GA build.
- `PISTOL` → `pistols`.
- `SUBMACHINE GUN` → `smg`.
- `ASSAULT RIFLE` → `ar`.
- `BATTLE RIFLE` → `br`.
- `SHOTGUN` → `shotguns`.
- `GENERAL MACHINE GUN`, `LIGHT MACHINE GUN`, or `MACHINE GUN` → `lmg`.
- `MARKSMAN RIFLE` → `mr`.
- `SNIPER RIFLE` → `sr`.

Stop before publication when any group cannot be mapped, when a configured ID is missing, or when the post's three tags do not exactly match the refreshed Banner record.
