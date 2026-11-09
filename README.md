# Rami Alkhateeb Portfolio

Static bilingual portfolio for Senior Software Engineer, Technical Lead, and Software Architect opportunities.

`index.html` is the whole portfolio as one flippable work card (Card, Impact, Stack, NxT7 Apps, About; plus an Info side on phones) with a share sheet (QR, vCard, copy link, booking). Tech logos in `assets/icons/tech/` are from devicon (MIT) and Simple Icons (CC0). See `CLAUDE.md` for how the card, its deep links and the secondary pages (`product.html`, guides, legal) fit together.

## Update project media

Edit `js/projects.js` to add products and live `tryUrl`/`sourceUrl` values. Each product renders as an icon on the card's NxT7 Apps side; tapping it opens a sheet that links to its detail page, which is a dark teal page: a hero with eyebrow, buttons, tag chips and up to three screenshots in phone frames, a "How the AI helps" example (from the `ai` field, with EN/DE/AR chips), a six-block case study (problem, decisions, architecture, constraints, outcome, learning), the `journey` rows and a closing booking CTA. The Products section also has a diagram of the apps on their shared libraries, built from the `nxt7.eng.*` and `shared.*` keys of `TEXT` in `js/site.js` or the demo `video`. - `assets/projects/<slug>/logo.svg` — card logo (the NxT7 apps use the SVGs from the shared `Nxt.UI` library).
- `assets/projects/<slug>/1.webp`, `2.webp`, `3.webp` — 591×1280 screenshots, shown in the hero's phone frames (first three).
- `assets/projects/<slug>/<slug>_teaser.mp4` — optional demo video for the detail page (pair it with a `poster` image).

See `assets/projects/README.md` for details.

Set the contact email and Calendly link in `js/config.js` before publishing.

## Recommendations and languages

- `window.RAMI_RECOMMENDATIONS` in `js/projects.js` drives the Recommendations block under About. It holds the LinkedIn recommendations (English only; quotes are not translated). Entries are `{name, role:{en,...}, quote:{en,...}, linkedin}`; an empty array hides the block.
- The site is English / German / Arabic. UI strings live in `TEXT.en|de|ar` in `js/site.js` (`node scripts/check-i18n-parity.js` checks all three).

## Local preview

No build step. Serve the folder with any static server — do not open via `file://`, which breaks the custom elements and the page JS:

```
python3 -m http.server   # not `npx serve`: its clean-URL redirect drops ?slug= query strings
```
