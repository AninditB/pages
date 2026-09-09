# Portfolio Progress

## Completed

- Created the main portfolio page in `index.html`.
- Added styling and responsive layout in `style.css`.
- Added dynamic rendering logic in `script.js`.
- Added JSON data files for projects, experience, education, and skills.
- Added expandable cards for portfolio sections.
- Added modal detail views for projects, experience, and education.
- Added sharing actions for LinkedIn, Twitter, and copy link.
- Added dark/light theme toggle with saved preference.
- Added smooth scrolling and scroll-based section animations.
- Added `FLOWCHART.md` with Mermaid diagrams for the site flow.
- Checked for text encoding issues in visible labels/icons — none found (audited HTML, JS, and JSON; all clean UTF-8).
- Added keyboard support for expandable cards (Tab focus, Enter/Space to toggle, visible focus ring) and fixed a dead `.expand-icon` reference that was throwing a console error on every card click.
- Added accessibility to the detail modal: dialog role/labelling, focus moves into the modal on open and returns to the trigger on close, and Tab/Shift+Tab are trapped inside it while open.
- Added `rel="noopener noreferrer"` to the external "View Project" links.
- Removed the unused, empty `script/main.js`.
- Added a deployed site link and setup/structure/maintenance notes to `README.md`.
- Gave each portfolio section wrapper its own `id` (`projects`/`experience`/`skills`/`education`) for nav anchors, and renamed the inner content containers to a `-list` suffix to remove the id collision.
- Added `schedule.html`/`schedule.js` — a "Book a call" page with a Cal.com inline embed, linked from the nav on `index.html` and `resume.html`.
- Manually verified the site at desktop and mobile (375px/768px) widths across `index.html`, `resume.html`, and `schedule.html`; no layout breakage found.
- Reorganized the project: split the single `style.css` into `css/base.css`, `css/theme-toggle.css`, `css/layout.css`, `css/resume.css`, `css/schedule.css`, `css/print.css`; moved scripts into `js/` (renaming `script.js` to `js/main.js`) and extracted the duplicated `fetchData`, theme-toggle, and mobile-nav logic into shared `js/data.js`, `js/theme.js`, `js/mobile-nav.js` modules; moved `DESIGN.md`, `FLOWCHART.md`, and this file into `docs/`.
- Reorganized the project again: moved `index.html`, `resume.html`, `schedule.html`, `css/`, and `js/` into a single `frontend/` folder, grouping all frontend code together and leaving `data/` as a top-level "extracted data" folder; updated `data.js`'s fetch path to `../data/`.
- Discovered GitHub Pages' "Deploy from a branch" source only supports `/(root)` or `/docs` as the publish folder, not `/frontend`. Switched Pages to the "GitHub Actions" build type and added `.github/workflows/deploy-pages.yml`, which flattens `frontend/*` + `data/` into a build output and rewrites the `data.js` fetch path back to `data/` for the deployed site, so local dev (`../data/`) and production stay consistent with their own directory layouts.

## To Do

- Set `CAL_LINK` in `schedule.js` to a real Cal.com event link (currently a placeholder — the page shows a "not set up yet" message until it's configured).

## Notes

- Main entry point: `frontend/index.html`
- Main script: `frontend/js/main.js`
- Stylesheets: `frontend/css/`
- Data source folder: `data/`
- Scheduling page: `frontend/schedule.html` / `frontend/js/schedule.js`
