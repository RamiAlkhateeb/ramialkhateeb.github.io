---
name: preview-site
description: Serve this static portfolio site locally and visually verify changes with a browser. Use whenever a change needs to be seen rendered, screenshotted, or checked in a real browser (layout, animation, RTL, popups).
---

# Preview and verify the site

This is a static site with no dev server config. **`file://` does not work** — the custom elements (`<app-header>`/`<app-footer>`), i18n bootstrapping, and media popup logic all break silently when opened directly as a file, which has caused repeated false starts in past sessions. Always serve over HTTP first.

## 1. Start a local server

Pick whichever is available in the environment:

```
npx serve .          # Node — no install needed beyond npx
python -m http.server # if Python is available
```

Run it in the background (it doesn't exit on its own).

## 2. Navigate and verify with Playwright MCP tools

Use `mcp__plugin_playwright_playwright__browser_navigate` to `http://localhost:<port>/<page>.html` (not `file://`), then `browser_snapshot` or `browser_take_screenshot` to inspect the result. Useful checks:
- Resize with `browser_resize` to the site's breakpoints (850px, 600px) to confirm responsive layout.
- Toggle the language switcher (`.language-toggle`) and re-check — this flips `dir` to `rtl` and re-renders all data-driven sections.
- For product cards: click to open the media popup and confirm it opens/closes and (if multiple screenshots) the prev/next arrows work.
- For About: scroll to confirm the roadmap's scroll-reveal (`.reveal`/`.in-view`) animates each node in.

## 3. Clean up

Background servers left running across turns can accumulate — stop the one you started once verification is done, or reuse an already-running one from a previous step in the same task rather than starting a second server on the same port.
