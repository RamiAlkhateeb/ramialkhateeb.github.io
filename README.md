# Rami Alkhateeb Portfolio

Static bilingual portfolio for Senior Software Engineer, Technical Lead, and Software Architect opportunities.

## Update project media

Edit `js/projects.js` to add products and live `tryUrl`/`sourceUrl` values. Each product renders on `products.html` as a compact card (logo, name, short description) with a "View screenshots"/"Watch demo" button and a Try/Coming-soon action. Clicking a card opens its media in a popup — a video when `video` is set (e.g. `carousel-engine/carousel_engine_teaser.mp4`), otherwise a screenshot carousel. The homepage only shows a compact linked teaser.

- `assets/projects/<slug>/logo.png` — card logo.
- `assets/projects/<slug>/1.png`, `2.png`, … — screenshots opened in the popup carousel.
- `assets/projects/<slug>/<slug>_teaser.mp4` — optional demo video that plays in the popup instead of screenshots.

See `assets/projects/README.md` for details.

The career roadmap on `about.html` is sourced from `js/journey.js` (`window.RAMI_JOURNEY`), which should stay in sync with [assets/senior_software_engineer.md](assets/senior_software_engineer.md).

Set the contact email, CV URL, and Calendly link in `js/config.js` before publishing. Leave `cvUrl` empty to retain the disabled Download CV action.
