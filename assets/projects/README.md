# Project media

`assets/projects/<project-slug>/logo.svg` is the logo on the app's card and detail page. The NxT7 apps (Makdous, NxtTask, Syrian Radio) use the icons from the shared Nxt.UI library (`Nxt.UI/wwwroot/logos/`); copy the new SVG over when an app's icon changes.

Screenshots go in the project folder as `1.webp`, `2.webp`, `3.webp`, … at 591×1280 (a 375×812 phone viewport at 1.576× scale), in the English UI where the app supports it. They appear as plain screenshots on the detail page; the `nxt7.html` card shows only the logo.

AI screens can be captured without a real key: run the app locally, set `nxt.ai.key` to a placeholder, and have Playwright answer requests to `generativelanguage.googleapis.com` with a sample JSON reply that matches the app's `response_schema`.

A demo or teaser video can be added as `<project-slug>_teaser.mp4` (e.g. `carousel-engine/carousel_engine_teaser.mp4`) and set as `video`; it plays on the detail page.

`assets/images/nxt7-logo.svg` is the NxT7 studio logo used on the home page card and `nxt7.html`.
