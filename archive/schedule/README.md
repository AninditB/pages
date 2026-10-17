# Archived: "Book a call" page

A scheduling page that was meant to embed a Cal.com booking calendar. `CAL_LINK` in
`schedule.js` was never set, so it only ever showed a "Coming soon" placeholder. It was taken
off the site on 2026-10-15 to be planned properly later.

This folder is not deployed: the Pages workflow publishes only `frontend/` and `data/`, and
`scripts/sync-shell.mjs` only touches `frontend/*.html`.

## Restoring

1. Move the files back: `schedule.html` → `frontend/`, `schedule.js` → `frontend/js/`,
   `schedule.css` → `frontend/css/`.
2. Move the `.schedule-placeholder-badge` rules at the end of `schedule.css` back into the
   eyebrow and pill-badge groups in `frontend/css/components.css`.
3. Add `<a href="schedule.html">Book a call</a>` back to both navs in
   `scripts/shell.template.html` and run `node scripts/sync-shell.mjs`. That also refreshes the
   archived page's header and footer, which are not kept in sync while it lives here.
4. Set `CAL_LINK` in `schedule.js` to the Cal.com event path.
