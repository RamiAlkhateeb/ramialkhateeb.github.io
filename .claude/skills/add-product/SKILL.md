---
name: add-product
description: Add a new project/product to the portfolio site (products.html grid + product.html detail page). Use when the user asks to add, create, or list a new product/project/side-project on the site.
---

# Add a product

Products are entirely data-driven from `window.RAMI_PROJECTS` in `js/projects.js` — no HTML editing needed. `js/site.js` renders them onto the homepage teaser, `products.html`, and `product.html?slug=<slug>` automatically.

## 1. Add the entry to `js/projects.js`

Append an object to the `RAMI_PROJECTS` array matching this shape (match the file's existing dense, single-line-per-object style — don't reformat the whole file):

```js
{
  slug: 'my-product',                 // used in URLs and asset folder name
  logo: 'assets/projects/my-product/logo.png',
  screenshots: ['assets/projects/my-product/1.png', 'assets/projects/my-product/2.png'], // omit if using video
  video: '',                          // optional: 'assets/projects/my-product/my-product_teaser.mp4'
  tryUrl: '',                         // live URL, or '' to show "Coming soon"
  sourceUrl: '',                      // optional GitHub link
  pricing: [],                        // optional: [{name, price, period, features:[...]}]
  en: {
    title: 'My Product',
    short: 'One-sentence description shown on cards.',
    // optional narrative fields shown on the product.html detail page if present:
    problem: '', decisions: '', architecture: '', constraints: '', outcome: '', learning: '',
    journey: []                       // optional array of milestone strings
  },
  ar: { title: '...', short: '...' }  // Arabic is optional — falls back to `en` via localized()
}
```

Only `slug`, `logo`/`screenshots`/`video`, and `en.title`/`en.short` are required. Everything else is optional and simply won't render its section if absent.

## 2. Add assets

Create `assets/projects/<slug>/` containing:
- `logo.png` — shown on the product card.
- `1.png`, `2.png`, … — screenshots opened in the popup carousel (skip if using a video).
- `<slug>_teaser.mp4` — optional demo video; when `video` is set, the popup plays it instead of screenshots.

See `assets/projects/README.md` for the full media convention.

## 3. Verify

Use the `preview-site` skill to serve the site locally and check: the product appears in the homepage teaser, on `products.html` as a card, and its detail page at `product.html?slug=<slug>` renders correctly (media popup opens, pricing section appears only if `pricing` was set).
