# Rami Alkhateeb Portfolio

Static bilingual portfolio for Senior Software Engineer, Technical Lead, and Software Architect opportunities.

`index.html` is a single page containing every section — hero, about (photo intro, impact metrics, what I do, floating skill chips, a Syria/UAE/Germany landmark strip, and education/languages), products, and contact. The header nav and the route rail down the side both scroll to those anchors; the section list lives once in `SITE_STOPS` at the top of `js/components.js`. `about.html` and `products.html` are redirect stubs kept only for older inbound links. `nxt7.html` lists every app under the NxT7 umbrella, and `product.html?slug=<slug>` is the per-app detail page.

## Update project media

Edit `js/projects.js` to add products and live `tryUrl`/`sourceUrl` values. Each product renders on `nxt7.html` as a card (screenshot background, logo, name, short description, tags) linking to its detail page, which shows the screenshots in phone frames or the demo `video`. The home page's `#products` section shows two umbrella cards from `window.RAMI_BRANDS`: NxT7 and Courses (coming soon).

- `assets/projects/<slug>/logo.png` — card logo.
- `assets/projects/<slug>/1.png`, `2.png`, … — screenshots (the first is the card background).
- `assets/projects/<slug>/<slug>_teaser.mp4` — optional demo video for the detail page (pair it with a `poster` image).

See `assets/projects/README.md` for details.

Set the contact email and Calendly link in `js/config.js` before publishing.

## Local preview

No build step. Serve the folder with any static server — do not open via `file://`, which breaks the custom elements and the page JS:

```
python3 -m http.server   # not `npx serve`: its clean-URL redirect drops ?slug= query strings
```
