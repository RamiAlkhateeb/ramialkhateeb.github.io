# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, bilingual (English/Arabic) personal portfolio site for Rami Alkhateeb. Plain HTML/CSS/vanilla JS — no framework, no bundler, no package manager, no build step. Files are served as-is.

## Commands

There is no build/lint/test tooling in this repo (no `package.json`). To preview locally, serve the directory with any static file server and open `index.html` (opening via `file://` will break things like the header/footer custom elements and JSON fetches, so always serve over HTTP), e.g.:

```
npx serve .
```

Deployment is automatic: `.github/workflows/deploy.yml` runs on every push to `main`, copies `*.html`, `css/`, `js/`, and `assets/` into `gh-pages-out/`, and publishes that to the `gh-pages` branch via `peaceiris/actions-gh-pages`. There's no separate build artifact — what's in those folders on `main` is what ships.

## Architecture

**Shared page shell via custom elements.** Every real page includes `<app-header active="...">` and `<app-footer>`, both defined in `js/components.js`. `AppHeader` reads its `active` attribute (`home` / `products` / `about` / `contact`) to highlight the matching nav link — when adding a page, set this attribute and make sure a matching `data-nav` value exists in the header markup. Header/footer markup is injected as a JS template string, not real HTML includes, so anything shared across pages must be edited in `js/components.js`, not duplicated per-page.

**Content lives in JS data files, not HTML.** Pages with repeated/structured content render themselves from global `window.*` arrays at load time via functions in `js/site.js`:
- `js/projects.js` → `window.RAMI_PROJECTS` — drives the products teaser on the homepage, the `products.html` grid, and the `product.html?slug=<slug>` detail view (via `renderProductsTeaser`, `renderProductsPage`, `renderProductPage`). Each project has a `slug`, optional `logo`/`screenshots`/`video`, `tryUrl`/`sourceUrl`, optional `pricing` tiers, and localized copy under `en`/`ar` keys (`title`, `short`, plus optional narrative fields like `problem`/`decisions`/`architecture`/`constraints`/`outcome`/`learning`/`journey`).
- `js/journey.js` → `window.RAMI_JOURNEY` — drives the career roadmap timeline on `about.html` (`renderJourney`). This is meant to stay in sync with the résumé source of truth at `assets/senior_software_engineer.md`.
- `js/config.js` → `window.PORTFOLIO_CONFIG` (`email`, `cvUrl`, `calendlyUrl`) — the single place contact/CV/booking links are configured; `.email-link` elements resolve to Calendly (if set) or a `mailto:` fallback, `.cv-link` elements are disabled unless `cvUrl` is set.

Assets for a given project go under `assets/projects/<slug>/` (`logo.png`, `1.png`/`2.png`/… for screenshots, `<slug>_teaser.mp4` for an optional demo video) — see `assets/projects/README.md`.

**`js/site.js` is the single app entry point** — there's no per-page JS. It handles:
- i18n: a `TEXT` dict keyed by `en`/`ar`; `t(key)` looks up the current language with an English fallback. Elements bind via `data-i18n` (sets `textContent`) or `data-i18n-html` (sets `innerHTML` — required when the string contains markup, e.g. a `<br>`). Language is toggled by `.language-toggle` clicks, persisted to `localStorage['rami-language']`, and flips `document.documentElement.dir` for RTL.
- `localized(item)` fallback pattern used throughout data rendering: `item[language] || item.en` — Arabic content is often incomplete and expected to fall back to English.
- Rendering functions for every data-driven section (see above), all re-run from one `applyLanguage()` call so a language switch re-renders everything in place.
- The media popup/carousel (screenshot gallery or demo video) on the products page, and scroll-reveal animation via a single `IntersectionObserver` toggling `.in-view` on `.reveal` elements.
- All click/keydown handling is delegated from one listener on `document` (language toggle, opening/closing the media popup, popup prev/next, clicking a project card to navigate to `product.html`) — new interactive behavior should generally extend this delegation rather than adding new per-element listeners.

**Styling** is a single hand-authored `css/site.css` (dense, largely one rule per line, not run through a formatter — match that style rather than reformatting). Palette and spacing are driven by CSS custom properties on `:root` (`--ink`, `--muted`, `--paper`, `--surface`, `--accent`, `--soft`, `--line`, `--radius`). Because the site supports RTL, layout rules use logical properties (`padding-inline-start`, `inset-inline-start`, `border-inline-start`, `margin-inline-start`) instead of physical `left`/`right` wherever direction matters.

**Pages outside the shared app shell**: `reader.html`, `cheatsheet.html`, and `claude-input.html` are self-contained one-off pages (their own inline structure, not using `app-header`/`app-footer` or `site.js` data rendering) — treat them as independent from the main portfolio app.
