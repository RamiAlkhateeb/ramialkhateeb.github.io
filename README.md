# Rami Alkhateeb Portfolio

Static bilingual portfolio for Senior Software Engineer, Technical Lead, and Software Architect opportunities.

`index.html` is a single page containing every section — hero, about (with a condensed background summary, a Syria/UAE/Germany landmark strip, and education/languages), what I do, products, and contact. The header nav and the route rail down the side both scroll to those anchors; the section list lives once in `SITE_STOPS` at the top of `js/components.js`. `about.html` and `products.html` are redirect stubs kept only for older inbound links. `product.html?slug=<slug>` is the one real second page.

## Update project media

Edit `js/projects.js` to add products and live `tryUrl`/`sourceUrl` values. Each product renders in the `#products` section as a compact card (logo, name, short description) with a "View screenshots"/"Watch demo" button and a Try/Coming-soon action. Clicking a card opens its detail page; the media button opens a popup — a video when `video` is set (e.g. `carousel-engine/carousel_engine_teaser.mp4`), otherwise a screenshot carousel.

- `assets/projects/<slug>/logo.png` — card logo.
- `assets/projects/<slug>/1.png`, `2.png`, … — screenshots opened in the popup carousel.
- `assets/projects/<slug>/<slug>_teaser.mp4` — optional demo video that plays in the popup instead of screenshots.

See `assets/projects/README.md` for details.

Set the contact email and Calendly link in `js/config.js` before publishing.

## Local preview

No build step. Serve the folder with any static server — do not open via `file://`, which breaks the custom elements and the popup JS:

```
npx serve .
```
