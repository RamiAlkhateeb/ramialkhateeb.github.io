# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, trilingual (English/German/Arabic) personal portfolio for Rami Alkhateeb. Plain HTML/CSS/vanilla JS — no framework, no bundler, no package manager, no build step. Files are served as-is. The header and footer come from custom elements in `js/components.js`; page content is mostly rendered from `window.*` data arrays (`js/projects.js`) by `js/site.js` (strings, language, product page) and `js/card.js` (the home page card).

`index.html` is **one wide "work card"** on a dark teal page. Sides: Card (front, cream), Impact, Stack, NxT7 Apps, About, plus an Info side that exists only in the compact (phone/tablet) layout. Each side is a `role=tabpanel` section; `js/card.js` flips between them (tabs, arrow keys, swipe, flip button, 3D rotateY ~0.4s, crossfade under `prefers-reduced-motion`) and handles deep links (`#impact`, `#stack`, `#apps`, `#about`, `#info`; legacy `#products` → apps, `#share` opens the share sheet). Each side must fit inside the card with no scrolling — if content grows, add a side, don't scroll. `css/card.css` sizes the compact layout in `cqw` from the card's own width (358px phone card up to ~900px) and switches to a fixed 1040×620 layout at `min-width:932px and min-height:561px`; phone landscape (`max-height:520px`) puts the tabs in a column beside the card. The Apps side renders every entry of `window.RAMI_PROJECTS`; tapping an app opens a bottom sheet (screenshot, short text, "Try it", link to its case study). The share sheet has the QR (`assets/images/qr-site.svg`, regenerate with the `qrcode` npm package if the site URL changes), a generated `.vcf` download, copy link and booking. Recommendations (`window.RAMI_RECOMMENDATIONS`) open in their own sheet.

`product.html?slug=<slug>` is the per-product detail page (deep-linked from the app sheet), plus `guides.html`, `reader.html`, `impressum.html`, `privacy.html`, all in the same dark teal / cream / brass look via the shared `css/site.css`. `about.html`, `products.html` and `nxt7.html` are one-line redirect stubs kept only for old inbound links.

`js/site.js` has no router: every render function runs on every page and self-aborts when its container is missing (`if(!grid||!window.RAMI_PROJECTS)return`). `applyLanguage()` re-runs on every language switch and calls `window.renderCard()` when the card page is loaded, so anything called from it must be idempotent.

The language switch in the header (EN / عربي / DE buttons with `data-lang`) sets `language` directly; only `ar` flips the page to RTL (`html[dir=rtl]`, IBM Plex Sans Arabic). `localized()` falls back to `en` when an object has no `de`/`ar` version, so data arrays in `js/projects.js` can be translated gradually.

Style tokens: page `#10232B`, cream `#F5EEE2`, ink `#18262D`, brass `#C9953F` (use `#8A5A1C` for brass text on cream), muted `#A9BCC3` on dark / `#5A6970` on cream. Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (small labels), IBM Plex Sans Arabic (RTL).

## Commands

No build/lint/test tooling (no `package.json`). Preview locally with any static server — **never open via `file://`**, it breaks the custom elements and the page JS:

```
python3 -m http.server   # not `npx serve`: its clean-URL redirect drops ?slug= query strings
```

Deployment is automatic via `.github/workflows/deploy.yml`: on push to `main`, it copies `*.html`, `css/`, `js/`, `assets/` to `gh-pages-out/` and publishes to the `gh-pages` branch. What's on `main` is what ships — no separate build artifact.

## Before you dig in

- Adding a product/project → use the `add-product` skill.
- Need to see a change rendered/screenshotted → use the `preview-site` skill.
- Reviewing a change to this site → see `.claude/review.md` (or the `site-reviewer` sub-agent), which covers this repo's i18n-parity, RTL, and styling conventions.
- Editing `js/site.js`'s `TEXT` dictionary triggers an automated en/ar/de key-parity check (see `.claude/settings.json` hooks + `scripts/check-i18n-parity.js`).
