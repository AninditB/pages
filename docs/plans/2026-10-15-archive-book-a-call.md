# Archive the "Book a call" page

## Context
`frontend/schedule.html` is a "Book a call" page meant to embed a Cal.com scheduler. `CAL_LINK` in `frontend/js/schedule.js` was never set, so the page only shows a "Coming soon" placeholder. The user wants it off the website but kept so it can be planned and brought back later. So we archive it rather than delete it: move the files to a folder the deploy never publishes, and remove every link to it from the live pages.

Why this works: `.github/workflows/deploy-pages.yml` publishes only `frontend/.` and `data/`, and `scripts/sync-shell.mjs` only touches `frontend/*.html`. A repo-root `archive/` folder is kept in git but never deployed or synced.

## Steps

0. **Save this plan in the repo** as `docs/plans/2026-10-15-archive-book-a-call.md`, as CLAUDE.md requires.

1. **Move the page files into `archive/schedule/`** with `git mv`, so their history is kept:
   - `frontend/schedule.html` → `archive/schedule/schedule.html`
   - `frontend/js/schedule.js` → `archive/schedule/schedule.js`
   - `frontend/css/schedule.css` → `archive/schedule/schedule.css`

2. **Move the shared badge CSS with the page.** In `frontend/css/components.css`, take `.schedule-placeholder-badge` out of the eyebrow selector group (lines 44–47) and the pill-badge group (lines 55–56). Delete its own block (lines 80–83) and change the line 54 comment to "Pill-shaped badges: the hero status badge". Add the full badge rules (eyebrow, pill and spacing combined) to the end of `archive/schedule/schedule.css`, so the archive holds everything the page needs.

3. **Add `archive/schedule/README.md`**: a few lines on what the page was, that it is archived and not deployed, and how to restore it:
   - Move the 3 files back to `frontend/`, `frontend/js/` and `frontend/css/`.
   - Fold the badge rules back into `components.css`.
   - Re-add the "Book a call" link to both navs in `shell.template.html` and run `node scripts/sync-shell.mjs`. The archived HTML's shell will be out of date by then, and the sync will refresh it.
   - Set `CAL_LINK`.

4. **Remove the nav links.** In `scripts/shell.template.html`, delete `<a href="schedule.html">Book a call</a>` from the desktop nav (line 23) and the mobile nav (line 72). Then run `node scripts/sync-shell.mjs` to update `frontend/index.html` and `frontend/resume.html`.

5. **Update docs:**
   - `CLAUDE.md`: replace the "Scheduling page is gated on a constant" paragraph with a one-liner saying the Book-a-call page is archived in `archive/schedule/` (not deployed; see its README). Remove `schedule.css` from the stylesheet-layers list. Change "all three pages" to "both pages".
   - `README.md`: remove the "Book a call" feature bullet and the schedule entries in the file tree. Replace the `CAL_LINK` note with a pointer to `archive/schedule/`.
   - `docs/DESIGN.md`: remove the schedule mentions (lines 3, 121, 128, 146) and the "Schedule placeholder" table row (line 175).
   - `docs/FLOWCHART.md`: remove the `S2`/`X2`/`Y2`/`Z2` nodes and edges (lines 35–39).
   - Leave `docs/progress.md` and the existing `docs/plans/*` files untouched. They are historical records.

6. **Deploy workflow:** no change. `archive/` is never copied into `_site/`.

## Verification
- `node scripts/sync-shell.mjs --check` passes.
- Grep `frontend/`, `scripts/`, `CLAUDE.md`, `README.md` and `docs/DESIGN.md` / `docs/FLOWCHART.md` for `schedule`, `Book a call` and `CAL_LINK`: no matches, except the archive pointer.
- Preview `portfolio` (port 8000) on `/frontend/` and `/frontend/resume.html`, at desktop width and 375px with the mobile menu open:
  - The nav shows Work, Experience, Skills, Contact, Résumé.
  - There are no console errors.
  - The hero badge and section labels look unchanged.
- `/frontend/schedule.html` returns 404.
