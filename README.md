# Anindit Bordoloi — Portfolio Website

A single-page portfolio site that renders project, experience, education, and skills sections dynamically from JSON data, with an expandable-card layout, detail modals, and a dark/light theme toggle.

**Live demo:** https://aninditb.github.io/pages/

## Features

- Projects, experience, education, and skills rendered dynamically from `data/*.json`
- Expandable cards with modal detail views, keyboard-accessible (Tab, Enter/Space, Escape)
- Share-to-LinkedIn, share-to-Twitter, and copy-link actions from each modal
- Dark/light theme toggle with saved preference (`localStorage`)
- Scroll-based section animations and a subtle parallax background
- "Book a call" page (`schedule.html`) with an embedded Cal.com scheduler

## Tech stack

Plain HTML, CSS, and JavaScript — no framework, no build step, no dependencies.

## Project structure

```
frontend/
  index.html          Page markup and section containers
  resume.html         Résumé page markup
  schedule.html       "Book a call" page markup

  css/
    base.css          Reset, theme tokens, body/nav/button styles
    theme-toggle.css  Sun/moon theme-switch component
    layout.css        Homepage sections, cards, modal, shared responsive rules
    resume.css        Résumé page layout
    schedule.css      Schedule page layout
    print.css         Résumé print styles

  js/
    data.js           Shared fetchData() helper (fetches from ../data/)
    theme.js          Shared dark/light theme toggle
    mobile-nav.js     Shared mobile nav open/close logic
    main.js           Homepage data fetching, card/modal rendering
    resume.js         Résumé data rendering, print button
    schedule.js       Cal.com embed setup

data/               projects.json, experience.json, education.json, skills.json, certifications.json
docs/               DESIGN.md (design system reference), FLOWCHART.md (site flow diagrams), progress.md (changelog)
```

`schedule.html` needs a real Cal.com event link set in `frontend/js/schedule.js`'s `CAL_LINK` constant before it will show a live booking calendar — until then it displays a placeholder message.

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

## Deployment

Deployed via GitHub Pages, served directly from the `main` branch, publish source set to `/frontend`.
