---
name: update-journey
description: Update the About page career roadmap/timeline. Use when the user asks to add, edit, or sync a job/role/experience entry on the About page, or to update the résumé-driven timeline.
---

# Update the career journey/roadmap

The About page's roadmap timeline (`about.html` → `#roadmap`, rendered by `renderJourney()` in `js/site.js`) is driven entirely by `window.RAMI_JOURNEY` in `js/journey.js`. It is meant to stay in sync with the résumé at `assets/senior_software_engineer.md` — treat that file as the source of truth for dates, titles, and achievements.

## Entry shape

Each array entry in `js/journey.js`:

```js
{
  country: 'Germany',        // short label, paired with flag in the roadmap badge
  flag: '🇩🇪',                // emoji flag shown next to location
  company: 'Company Name',
  role: 'Job Title',
  location: 'City, Country',
  period: 'Mon YYYY – Mon YYYY',   // or "– Present"
  bullets: ['Achievement one.', 'Achievement two.', 'Achievement three.']
}
```

Entries render in array order (top to bottom = timeline order), so insert new roles in the correct chronological position — the roadmap doesn't sort them for you.

## Workflow

1. If updating from a new résumé version, diff `assets/senior_software_engineer.md` against `js/journey.js` for new roles, changed dates, or reworded bullets.
2. Keep bullets tight (2-3 per role, matching the concise tone of existing entries) rather than pasting full résumé bullet lists verbatim.
3. Match the file's existing single-line-per-object style.
4. Use the `preview-site` skill to confirm the new/edited node renders correctly and the scroll-reveal animation still triggers per node.
