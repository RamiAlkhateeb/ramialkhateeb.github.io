---
name: add-product
description: Add a new project/product to the portfolio site (the app grid in the home page's #products section + product.html detail page). Use when the user asks to add, create, or list a new product/project/side-project on the site.
---

# Add a product

Products are entirely data-driven from `window.RAMI_PROJECTS` in `js/projects.js` — no HTML editing needed. `js/site.js` renders them into the `#project-grid` container in the home page's `#products` section (`nxt7.html` is only a redirect), and onto `product.html?slug=<slug>`, automatically.

## 1. Add the entry to `js/projects.js`

Append an object to the `RAMI_PROJECTS` array matching this shape (match the file's existing dense, single-line-per-object style — don't reformat the whole file):

```js
{
  slug: 'my-product',                 // used in URLs and asset folder name
  logo: 'assets/projects/my-product/logo.png',   // family products: copy from Nxt.UI/wwwroot/logos/
  screenshots: ['assets/projects/my-product/1.webp', 'assets/projects/my-product/2.webp'], // 591×1280 WebP; omit if using video
  video: '',                          // optional: 'assets/projects/my-product/my-product_teaser.mp4' (+ poster:'…/poster.webp')
  tags: ['Gemini AI'],                // 'Gemini AI' renders as the highlighted AI chip
  arabicFirst: false,                 // optional: adds an "Arabic-first" chip
  ai: {                               // optional: "How the AI helps" block on the detail page
    en: { summary: '…', prompt: 'example request', result: ['line', 'line'] },
    ar: { summary: '…', prompt: '…', result: ['…'] },
    de: { summary: '…', prompt: '…', result: ['…'] }
  },
  tryUrl: '',                         // live URL, or '' to show "Coming soon"
  // href: 'https://…',              // optional: the tile opens this external site instead of product.html; such entries are not added to NxT7's `apps` chips
  sourceUrl: '',                      // optional GitHub link
  pricing: [],                        // optional: [{name, price, period, features:[...]}]
  en: {
    title: 'My Product',
    short: 'One-sentence description shown on cards.',
    // optional narrative fields shown on the product.html detail page if present:
    problem: '', outcome: ''           // only problem and outcome are shown on the detail page
  },
  // ar / de: { ...every en field you want shown... }  // optional; localized() swaps the WHOLE object, so a partial `ar`/`de` hides the missing sections
}
```

Only `slug`, `logo`/`screenshots`/`video`, and `en.title`/`en.short` are required. Everything else is optional and simply won't render its section if absent.

## 2. Add assets

Create `assets/projects/<slug>/` containing:
- `logo.png` (512px, rounded tile with transparent corners; `.svg`/`.webp` also work) — shown on the product card.
- `1.webp`, `2.webp`, … — 591×1280 phone screenshots in English. The first three are shown in phone frames in the detail page hero; the Products-section card shows only the logo.
- `<slug>_teaser.mp4` — optional demo video shown on the detail page.

See `assets/projects/README.md` for the full media convention.

## 3. Verify

Only if the user explicitly asks to see the result, use the `preview-site` skill to serve the site locally and check: the product appears as a card in the home page's Products section, and its detail page at `product.html?slug=<slug>` renders correctly (screenshots/video show, pricing section appears only if `pricing` was set, back-link returns to `index.html#products`). Otherwise just report the change as done — this project's convention is not to verify proactively.
