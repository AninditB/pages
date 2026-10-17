# Anindit Bordoloi — Portfolio Website

A single-page portfolio site that renders project, experience, education, and skills sections dynamically from JSON data, with an expandable-card layout, detail modals, and a dark/light theme toggle.

**Live demo:** https://aninditb.github.io/pages/

## Features

- Projects, experience, education, and skills rendered dynamically from `data/*.json`
- Expandable cards with modal detail views, keyboard-accessible (Tab, Enter/Space, Escape)
- Share-to-LinkedIn, share-to-Twitter, and copy-link actions from each modal
- Dark/light theme toggle with saved preference (`localStorage`)
- Scroll-based section animations and a subtle parallax background

## Tech stack

Plain HTML, CSS, and JavaScript — no framework, no build step, no dependencies.

## Project structure

```
frontend/
  index.html          Page markup and section containers
  resume.html         Résumé page markup

  css/
    tokens.css        Design tokens (light on :root, dark on html.dark-mode)
    base.css          Reset, focus ring, body, skip link, header/nav
    components.css    Buttons, badges, icon buttons, cards, lists, chips, modal, states
    theme-toggle.css  Sun/moon theme-switch component
    layout.css        Homepage sections, card specifics, CTA band, shared responsive rules
    resume.css        Résumé page layout
    print.css         Résumé print styles

  js/
    data.js           Shared fetchData() helper (fetches from ../data/)
    theme.js          Shared dark/light theme toggle
    mobile-nav.js     Shared mobile nav open/close logic
    main.js           Homepage data fetching, card/modal rendering
    resume.js         Résumé data rendering, print button

data/               projects.json, experience.json, education.json, skills.json, certifications.json
scripts/            sync-shell.mjs (keeps the shared header/footer in sync), shell.template.html (canonical shell)
docs/               DESIGN.md (design system reference), FLOWCHART.md (site flow diagrams), progress.md (changelog), plans/ (saved plans)
```

A "Book a call" page (Cal.com scheduler) is archived in `archive/schedule/` and is not deployed. See its README to restore it.

## Local development

Because `data.js` loads content via `fetch()` against the files in `data/`, opening `index.html` directly (`file://`) won't work — browsers block `fetch` requests from the `file://` origin. Serve the repo root (not the `frontend/` folder, so the `../data/` fetch resolves) instead:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000/frontend/` (or the port your server prints).

## Updating content

Edit the relevant file under `data/` — no build step or restart required, just refresh the browser.

## Editing the shared header and footer

The header, mobile nav, footer and theme `<head>` snippet are the same on every page. Edit `scripts/shell.template.html`, then run:

```bash
node scripts/sync-shell.mjs
```

`node scripts/sync-shell.mjs --check` fails if any page has drifted; the deploy workflow runs it before building.

## Deployment

Deployed via GitHub Pages using a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`, source set to "GitHub Actions" in repo Settings → Pages). On every push to `main`, the workflow copies `frontend/*` and `data/` into a flat build output (so `index.html` ends up at the site root) and rewrites `data.js`'s fetch path from `../data/` to `data/` to match, then deploys that output.
