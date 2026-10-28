# Project media

`assets/projects/<project-slug>/logo.png` is the logo on the app's card and detail page. All five products (Makdous, NxtTask, Syrian Radio, Zubda, Carousel Engine) use the icons from the shared Nxt.UI library (`Nxt.UI/wwwroot/logos/*.png`, 512px tiles with transparent rounded corners); copy the new PNG over when a product's icon changes.

Screenshots go in the project folder as `1.webp`, `2.webp`, `3.webp`, … at 591×1280 (a 375×812 phone viewport at 1.576× scale), in the English UI where the app supports it. The first three appear in phone frames in the detail page hero; the Products-section card shows only the logo.

AI screens can be captured without a real key: run the app locally, set `nxt.ai.key` to a placeholder, and have Playwright answer requests to `generativelanguage.googleapis.com` with a sample JSON reply that matches the app's `response_schema`.

A demo or teaser video can be added as `<project-slug>_teaser.mp4` (e.g. `carousel-engine/carousel_engine_teaser.mp4`) and set as `video`; it plays on the detail page.

`assets/images/nxt7-logo.svg` is the NxT7 studio logo used in the home page's Products section.
