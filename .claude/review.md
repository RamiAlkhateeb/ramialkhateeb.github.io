# Review checklist — ramialkhateeb.github.io

Project-specific things a generic reviewer would miss. Apply this in addition to normal correctness review whenever a change touches this portfolio site's HTML/CSS/JS.

## i18n
- [ ] Every `TEXT` key added or changed in `js/site.js` exists in **both** `TEXT.en` and `TEXT.ar`. Arabic content for data arrays (`js/projects.js`, `js/journey.js`) may legitimately be omitted — `localized()` falls back to `en` — but `TEXT` UI strings must not be English-only.
- [ ] Any string containing HTML markup (e.g. a `<br>`) is bound with `data-i18n-html`, not `data-i18n` — the latter sets `textContent` and will render the tag as literal text.

## RTL
- [ ] New CSS uses logical properties (`padding-inline-start`, `inset-inline-start`, `border-inline-start`, `margin-inline-start`, `text-align: start`) instead of physical `left`/`right`/`padding-left` etc., since the site flips to `dir="rtl"` for Arabic.

## Style consistency
- [ ] New/edited CSS and JS match the existing dense, minified-by-hand style (one rule per line in CSS, compact function bodies in JS) — don't reformat or expand surrounding code as a side effect of an unrelated change.
- [ ] `<app-header active="...">` on any page matches an existing `data-nav` value in `js/components.js`'s `AppHeader` template — a typo here silently fails to highlight the nav item.

## Cleanup after restructuring
- [ ] When a page/section is removed or replaced, grep for its old render function name, CSS classes, and data global (`window.RAMI_*`) to confirm nothing still references them.

## Data schemas
- [ ] New entries in `js/projects.js` and `js/journey.js` follow the shapes documented in the `add-product` / `update-journey` skills.

## Verification
- [ ] Changes were actually checked in a browser via the `preview-site` skill (served over HTTP, not `file://`) — not just read back as source.
