# Review checklist — ramialkhateeb.github.io

Project-specific things a generic reviewer would miss. Apply this in addition to normal correctness review whenever a change touches this portfolio site's HTML/CSS/JS.

## Work card structure
- [ ] `index.html` is the card: every side is a `section.wc-side[role=tabpanel]` with a matching `button[role=tab]` in `.wc-tabs`; a new side needs both, plus an entry in `SIDES`-related logic in `js/card.js` (`visible()` decides which tabs exist per layout) and a `tab.*` key in all three languages.
- [ ] Each side fits inside the card with no scrolling in en, de and ar, at 360px wide, 390×844, 844×390 (landscape) and 1440×900. Overflowing text means shorten it or add a side — never `overflow:auto` on a side.
- [ ] Text never below 11px on phone, touch targets ≥ 44px, contrast ≥ 4.5:1 (brass text on cream must use `--brass-text`).
- [ ] Desktop-only / phone-only content uses `.d-only` / `.m-only`; content hidden in the compact layout is clipped (screen-reader-visible), not `display:none`, unless it duplicates another visible control.
- [ ] Internal links point at `index.html#apps` / `#about` etc., never at `about.html`/`products.html` (redirect stubs). `product.html` stays a real page (`?slug=`).
- [ ] Anything called from `applyLanguage()` is idempotent (it runs on every language switch).

## i18n
- [ ] Every `TEXT` key added or changed in `js/site.js` exists in **all three** of `TEXT.en`, `TEXT.ar` and `TEXT.de`. Arabic and German content for data arrays (`js/projects.js`) may legitimately be omitted — `localized()` falls back to `en` — but `TEXT` UI strings must not be English-only.
- [ ] Any string containing HTML markup (e.g. a `<br>`) is bound with `data-i18n-html`, not `data-i18n` — the latter sets `textContent` and will render the tag as literal text.
- [ ] Markup rendered by `js/components.js` carries real English fallback text, not the `TEXT` key name — custom elements upgrade before `applyLanguage()` runs, so a key name would flash on screen.

## RTL
- [ ] New CSS uses logical properties (`padding-inline-start`, `inset-inline-start`, `border-inline-start`, `margin-inline-start`, `text-align: start`) instead of physical `left`/`right`/`padding-left` etc., since the site flips to `dir="rtl"` for Arabic.
- [ ] `--mono`/`--display`/`--font` are re-pointed to IBM Plex Sans Arabic under `html[dir=rtl]` in `css/site.css`; mono labels also drop letter-spacing/uppercase for RTL.
- [ ] Directional behaviour (swipe direction, arrow keys) follows `document.documentElement.dir`; check `js/card.js` when touching it.

## Style consistency
- [ ] New/edited CSS and JS match the existing dense, minified-by-hand style (one rule per line in CSS, compact function bodies in JS) — don't reformat or expand surrounding code as a side effect of an unrelated change.
- [ ] Colors come from the `:root` tokens in `css/site.css` (`--bg`, `--surface`, `--soft`, `--line`, `--text`, `--muted`, `--cream`, `--ink`, `--brass`, `--brass-text`, `--brass-soft`).
- [ ] New animation is neutralised in the `@media(prefers-reduced-motion:reduce)` block at the end of the base stylesheet.

## Cleanup after restructuring
- [ ] When a page/section is removed or replaced, grep for its old render function name, CSS classes, and data global (`window.RAMI_*`) to confirm nothing still references them.

## Data schemas
- [ ] New entries in `js/projects.js` follow the shape documented in the `add-product` skill.

## Verification
- [ ] Per project convention, don't proactively serve/screenshot changes after an edit — only use the `preview-site` skill if the user explicitly asked to see/preview the result.
