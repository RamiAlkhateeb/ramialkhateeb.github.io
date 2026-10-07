# Rami Alkhateeb Portfolio

Static bilingual portfolio for Senior Software Engineer, Technical Lead, and Software Architect opportunities.

`index.html` is a single page containing every section — hero, about (photo intro, impact metrics, what I do, floating skill chips, a Syria/UAE/Germany landmark strip, and education/languages), products, and contact. The header nav and the route rail down the side both scroll to those anchors; the section list lives once in `SITE_STOPS` at the top of `js/components.js`. `about.html` and `products.html` are redirect stubs kept only for older inbound links. `nxt7.html` lists every app under the NxT7 umbrella, and `product.html?slug=<slug>` is the per-app detail page.

## Update project media

Edit `js/projects.js` to add products and live `tryUrl`/`sourceUrl` values. Each product renders on `nxt7.html` as a logo-only card linking to its detail page, which opens with a "How the AI helps" example (from the project's `ai` field) and shows the screenshots as plain images (no device frame), then a short problem/outcome summary. `nxt7.html` also has a diagram of the apps on their shared libraries, built from the `nxt7.eng.*` and `shared.*` keys of `TEXT` in `js/site.js` or the demo `video`. The home page's `#products` section shows two umbrella cards from `window.RAMI_BRANDS`: NxT7 and Courses (coming soon).

- `assets/projects/<slug>/logo.svg` — card logo (the NxT7 apps use the SVGs from the shared `Nxt.UI` library).
- `assets/projects/<slug>/1.webp`, `2.webp`, … — 591×1280 screenshots .
- `assets/projects/<slug>/<slug>_teaser.mp4` — optional demo video for the detail page (pair it with a `poster` image).

See `assets/projects/README.md` for details.

Set the contact email and Calendly link in `js/config.js` before publishing.

## Recommendations and languages

- `window.RAMI_RECOMMENDATIONS` in `js/projects.js` drives the Recommendations block under About. It is empty on purpose: add real quotes only (`{name, role:{en,ar,de}, quote:{en,ar,de}, linkedin}`) and the block appears.
- The site is English / German / Arabic. UI strings live in `TEXT.en|de|ar` in `js/site.js` (`node scripts/check-i18n-parity.js` checks all three).

## Local preview

No build step. Serve the folder with any static server — do not open via `file://`, which breaks the custom elements and the page JS:

```
python3 -m http.server   # not `npx serve`: its clean-URL redirect drops ?slug= query strings
```
