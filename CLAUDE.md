# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DFoversea is a static web companion app for the game "Delta Force" (三角洲行动). It has no build step, no package manager, and no server-side code — everything is pure HTML/CSS/vanilla JS.

## Running Locally

The i18n module uses `fetch()` to load locale JSON files, so the project **must** be served over HTTP (not opened as `file://`):

```bash
# From the repo root or any subdirectory you want to preview
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:3000/desktop/` or `http://localhost:8080/desktop/` etc.

## Directory Structure

```
desktop/        Current desktop version (active development)
mobile/         Current mobile version (active development)
V2/
  desktop-V2/  Next-gen desktop (in progress)
  mobile-V2/   Next-gen mobile (in progress)
shared/         mock-data.js — shared mock game data used by both platforms
discord/        Discord bot message templates (JSON) and integration docs (MD)
```

Each platform folder (`desktop/`, `mobile/`, `V2/desktop-V2/`, etc.) is self-contained:
- HTML pages are multi-page (MPA), each is a standalone file
- `main.js` — all interactive JS for that platform
- `i18n.js` — i18n module (identical structure in desktop and mobile)
- `main.css` — all styles
- `locales/zh-CN.json`, `locales/de.json` — translation strings

## i18n System

- Language preference is persisted in `localStorage` under the key `df-language`
- Translations use dot-notation keys (e.g. `nav.home`) mapped via `data-i18n` attributes on HTML elements
- `I18n.t(key, params)` resolves a key; `{{param}}` placeholders are interpolated
- To translate an attribute instead of text content, add `data-i18n-attr="placeholder"` (or any attribute name)
- Fallback: if a non-Chinese locale file fails to load, it falls back to `zh-CN`
- Currently active languages: `zh-CN` (Simplified Chinese), `de` (German)

## Pages (desktop)

| File | Purpose |
|---|---|
| `index.html` | Home — daily reports (烽火日报 / 战场日报), quick gun-build preview |
| `my-data.html` | Player stats, K/D, match history |
| `gun-builds.html` | Weapon customization recommendations |
| `craft.html` | Trading / crafting price tracker |

## Key Patterns

- **Tab switching**: tabs store their type in `data-tab`; JS toggles `.active` and `.hidden` classes
- **Game modes**: "烽火地带" (Fenguo) vs "全面战场" (Zhanchang) — many components switch between these two
- **Login simulation**: `initDesktopLoginSystem()` in `main.js` handles the mock login UI; supports Level Infinite and Garena account types
- **Modal pattern**: daily poster share modal (`initDailyPosterModal`) follows standard overlay/close-on-outside-click
- **No external dependencies**: everything is vanilla; no npm, no bundler, no frameworks

## Discord Folder

`discord/` contains JSON templates for bot messages and a Markdown document describing the planned Discord Activities + Rich Presence integration. These are design/data artifacts, not executable code loaded by the web app.
