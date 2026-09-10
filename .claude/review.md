# Review checklist — ramialkhateeb.github.io

Project-specific things a generic reviewer would miss. Apply this in addition to normal correctness review whenever a change touches this portfolio site's HTML/CSS/JS.

## Single-page structure
- [ ] `index.html` holds every section (`#top`, `#about`, `#work`, `#journey`, `#products`, `#contact`). New sections must be registered in `SITE_STOPS` at the top of `js/components.js` — that array is the single source for both the header nav and the route rail, and `initNav()` derives its scroll-spy stops from the resulting `[data-scroll]` links.
- [ ] Internal links point at anchors on `index.html` (e.g. `index.html#products`), never at `about.html`/`products.html` — those are redirect stubs now.
- [ ] `product.html` stays a real page (`?slug=` deep links from `.project-card` clicks). Its nav still relies on the static `active="products"` attribute, so `initNav()` must keep bailing out when none of the `SITE_STOPS` ids exist in the document — don't change it to select sections by `main>section[id]`, which product.html would match.
- [ ] Scroll-spy and count-up run once per page load (`navInit`/`countersInit` flags). `applyLanguage()` re-runs on every language toggle, so anything new called from there must be idempotent.

## i18n
- [ ] Every `TEXT` key added or changed in `js/site.js` exists in **both** `TEXT.en` and `TEXT.ar`. Arabic content for data arrays (`js/projects.js`, `js/journey.js`) may legitimately be omitted — `localized()` falls back to `en` — but `TEXT` UI strings must not be English-only.
- [ ] Any string containing HTML markup (e.g. a `<br>`) is bound with `data-i18n-html`, not `data-i18n` — the latter sets `textContent` and will render the tag as literal text.
- [ ] Markup rendered by `js/components.js` carries real English fallback text, not the `TEXT` key name — custom elements upgrade before `applyLanguage()` runs, so a key name would flash on screen.

## RTL
- [ ] New CSS uses logical properties (`padding-inline-start`, `inset-inline-start`, `border-inline-start`, `margin-inline-start`, `text-align: start`) instead of physical `left`/`right`/`padding-left` etc., since the site flips to `dir="rtl"` for Arabic.
- [ ] Exception: the `.journey-sketch` map pins are positioned by raw percentage `left`/`top` matching pixel coordinates on a real map image (`assets/images/Europe-middle-east.png`) — don't "fix" this to logical properties (that would desync pins from the image), and don't mirror the map itself in RTL (it depicts real geography; flipping it would make it backwards). This is the one deliberate exception to the logical-properties rule above.
- [ ] Anything set in `--mono` (JetBrains Mono has no Arabic glyphs) is listed in the `body[dir=rtl]` font-reset rule near the top of `css/site.css`.
- [ ] Directional `transform`s aren't covered by logical properties — a `translateX`/`transform-origin` that assumes LTR needs a `body[dir=rtl]` override (see `.rail-label`, `.rail-progress`).

## Style consistency
- [ ] New/edited CSS and JS match the existing dense, minified-by-hand style (one rule per line in CSS, compact function bodies in JS) — don't reformat or expand surrounding code as a side effect of an unrelated change.
- [ ] Colors come from the `:root` tokens (`--bg`, `--surface`, `--soft`, `--line`, `--text`, `--muted`, `--accent`, `--accent-deep`). The palette is dark; no hard-coded light backgrounds.
- [ ] `<app-header active="...">` on any page matches an existing `data-nav` value in `SITE_STOPS` — a typo here silently fails to highlight the nav item.
- [ ] New animation is neutralised in the `@media(prefers-reduced-motion:reduce)` block at the end of the base stylesheet.

## Cleanup after restructuring
- [ ] When a page/section is removed or replaced, grep for its old render function name, CSS classes, and data global (`window.RAMI_*`) to confirm nothing still references them.

## Data schemas
- [ ] New entries in `js/projects.js` and `js/journey.js` follow the shapes documented in the `add-product` / `update-journey` skills.

## Verification
- [ ] Per project convention, don't proactively serve/screenshot changes after an edit — only use the `preview-site` skill if the user explicitly asked to see/preview the result.
