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
index.html    Page markup and section containers
style.css     Styling, theme variables, responsive layout
script.js     Data fetching, card/modal rendering, theme toggle
data/         projects.json, experience.json, education.json, skills.json
FLOWCHART.md  Mermaid diagrams documenting the site's rendering and interaction flow
```

## Local development

Because `script.js` loads content via `fetch()` against the files in `data/`, opening `index.html` directly (`file://`) won't work — browsers block `fetch` requests from the `file://` origin. Serve the folder instead:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000` (or the port your server prints).

## Updating content

Edit the relevant file under `data/` — no build step or restart required, just refresh the browser.

## Deployment

Deployed via GitHub Pages, served directly from the `main` branch.
