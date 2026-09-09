---
name: update-journey
description: Update the About page career journey (map + always-visible timeline). Use when the user asks to add, edit, or sync a job/role/experience entry on the About page, or to update the résumé-driven timeline.
---

# Update the career journey

The About page shows career history in two parts, both driven by `window.RAMI_JOURNEY` in `js/journey.js` (kept in sync with the résumé at `assets/senior_software_engineer.md`, the source of truth for dates, titles, and achievements):

- **`#journey-map`** (`renderJourneyMap()` in `js/site.js`): a real map image with one highlighted marker per unique country, connected by an animated route in travel order. Purely illustrative — clicking a marker smooth-scrolls down to that country's card(s) in the list; it never hides or filters anything.
- **`#journey-list`** (`renderJourneyList()`): **every** entry, always visible, as a vertical timeline (all countries and all roles shown at once — this was previously an interactive "click a pin to reveal" panel and was reverted because it hid content the user wants always visible; don't reintroduce click-to-filter behavior here).

## Entry shape

Each array entry in `js/journey.js`:

```js
{
  country: 'Germany',        // groups entries into one map marker — must match exactly across roles in the same country
  flag: '🇩🇪',                // emoji flag shown on the marker and in the list's badge
  x: 31, y: 15,               // % position (0-100) matching that country's pixel location on assets/images/Europe-middle-east.png (see below)
  company: 'Company Name',
  role: 'Job Title',
  location: 'City, Country',
  period: 'Mon YYYY – Mon YYYY',   // or "– Present"
  bullets: ['Achievement one.', 'Achievement two.', 'Achievement three.']
}
```

**Ordering rules:**
- Entries are stored **newest-first** (matches the résumé) — `renderJourneyList()` renders them in that order directly.
- The map's marker sequence is computed automatically: `buildJourneyStops()` reverses the whole array (oldest-first) and takes the first occurrence of each unique `country` — the array's overall order determines travel order.
- **`x`/`y` must be identical for every entry sharing the same `country`** (all UAE entries today use `x:88,y:68`).

## The map background

`renderJourneyMap()` overlays markers and an animated route (SVG `viewBox="0 0 100 100"`) on top of the real map image `assets/images/Europe-middle-east.png` (1050×760px, despite the `.png` extension it's actually a GIF — browsers render it fine via content sniffing, but be aware if a build tool ever inspects the file). A marker's `x`/`y` (see `js/journey.js`) is that country's position as a **percentage of the image's pixel width/height**: `x = pixelX/1050*100`, `y = pixelY/760*100`. Since the container (`.journey-sketch`) is locked to the image's exact aspect ratio (`aspect-ratio:1050/760` in `css/site.css`) and the image uses `object-fit:cover`, percentage positions stay aligned with the image at any screen size. Current coordinates are an eyeballed approximation (documented in a comment at the top of `js/journey.js`) — nudge them by eye against the actual image if they're off. The map is **not mirrored in RTL** (unlike the earlier abstract-sketch version) since it depicts real geography — flipping a real map would make it geographically backwards.

If a country you add is outside the frame of this particular image (i.e. not Europe/North Africa/Middle East), you'll need a different background image — this one only covers that region.

## Workflow

1. If updating from a new résumé version, diff `assets/senior_software_engineer.md` against `js/journey.js` for new roles, changed dates, or reworded bullets.
2. Keep bullets tight (2-3 per role, matching the concise tone of existing entries) rather than pasting full résumé bullet lists verbatim.
3. Match the file's existing single-line-per-object style.
4. If the user asks to verify the result, use the `preview-site` skill — otherwise don't proactively serve/screenshot per this project's convention.
