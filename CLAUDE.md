# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, bilingual (English/Arabic) personal portfolio site for Rami Alkhateeb. Plain HTML/CSS/vanilla JS — no framework, no bundler, no package manager, no build step. Files are served as-is. Shared header/footer come from custom elements in `js/components.js`; page content is mostly rendered from `window.*` data arrays (`js/projects.js`, `js/journey.js`) by `js/site.js`, the single app entry point.

## Commands

No build/lint/test tooling (no `package.json`). Preview locally with any static server — **never open via `file://`**, it breaks the custom elements and popup/carousel JS:

```
npx serve .
```

Deployment is automatic via `.github/workflows/deploy.yml`: on push to `main`, it copies `*.html`, `css/`, `js/`, `assets/` to `gh-pages-out/` and publishes to the `gh-pages` branch. What's on `main` is what ships — no separate build artifact.

## Before you dig in

- Adding a product/project → use the `add-product` skill.
- Updating the About page career roadmap → use the `update-journey` skill.
- Need to see a change rendered/screenshotted → use the `preview-site` skill.
- Reviewing a change to this site → see `.claude/review.md` (or the `site-reviewer` sub-agent), which covers this repo's i18n-parity, RTL, and styling conventions.
- Editing `js/site.js`'s `TEXT` dictionary triggers an automated en/ar key-parity check (see `.claude/settings.json` hooks + `scripts/check-i18n-parity.js`).
