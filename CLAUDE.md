# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

No build, lint, test, or package manager is configured. The site is plain HTML/CSS/JS served as static files.

Local dev (must serve from the repo root, not `frontend/`, so `../data/` resolves):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/frontend/`. The `.claude/launch.json` config runs the same command as `portfolio` on port 8000.

After editing the header, mobile nav, footer or theme `<head>` snippet, edit `scripts/shell.template.html` and run `node scripts/sync-shell.mjs` to update all three pages. `node scripts/sync-shell.mjs --check` verifies they match (the deploy workflow runs this).

Opening `frontend/*.html` via `file://` will fail because `fetch()` is blocked there.

There is no test suite. Verify changes by loading the pages in the browser at desktop and mobile widths.

## Architecture

**Two-folder layout with a fetch path that differs between dev and production.**
- `frontend/` holds all HTML, CSS, and JS. `data/` at the repo root holds the content as JSON.
- `frontend/js/data.js` fetches `` `../data/${file}` `` (relative to `frontend/`). The deploy workflow rewrites that path with `sed` to `` `data/${file}` `` in the built output, because the output flattens `frontend/*` to the site root. Do not change the fetch path in `data.js` to a root-relative or absolute URL without checking both environments.
- `.github/workflows/deploy-pages.yml` runs on every push to `main`. It copies `frontend/.` and `data/` into `_site/`, applies the `sed`, and deploys via GitHub Pages. The `sed` pattern must match the exact line in `data.js`; if you rewrite that line, update the workflow too.

**Content is data-driven.** Each homepage section and the résumé page render from `data/*.json` at load time. Adding or editing a project, job, or skill means editing JSON, not markup. The renderers are in `frontend/js/main.js` (projects, experience, education, skills, stats) and `frontend/js/resume.js` (résumé experience, education, skills, certifications).

**Shared JS is loaded as plain `<script>` tags, not modules.** Every page includes `theme.js`, `a11y.js` (the shared Tab focus trap) and `mobile-nav.js`; the homepage and résumé also include `data.js`, and each page adds one page-specific script. The scripts communicate through globals (`fetchData`, `portfolioData`, `openModal`, `toggleCard`). Keep script order in each HTML file: `data.js` must come before anything that calls `fetchData`.

**Shared shell is generated, not hand-maintained.** The header, mobile nav, footer and theme `<head>` snippet live in `scripts/shell.template.html` and are copied into each page between `<!-- partial:NAME:start/end -->` markers by `scripts/sync-shell.mjs`. Edit the template, not the pages.

**Theme is an `<html>` class.** `theme.js` toggles `.dark-mode` on `<html>` and stores the choice in `localStorage['theme']`. An inline script in each page's `<head>` applies it before paint. All colors come from CSS custom properties defined in `frontend/css/base.css` on `:root` and `html.dark-mode`. Use the tokens rather than hard-coding colors.

**Stylesheet load order matters.** `base.css` (tokens and reset) → `theme-toggle.css` → `layout.css` (shared sections, cards, modal, responsive rules) → page CSS (`resume.css`, `schedule.css`, `print.css`). Page-specific CSS overrides `layout.css`.

**Homepage interactions are built with string templates.** `main.js` builds card HTML from `formatters`, expands cards with `toggleCard`, and opens a focus-trapped modal with `openModal`/`closeModal`. Card markup uses inline `onclick` handlers that call these globals.

**Scheduling page is gated on a constant.** `frontend/js/schedule.js` has `CAL_LINK = ''`. The page shows a placeholder until a Cal.com event path is set there.

## Design reference

`docs/DESIGN.md` documents the design tokens, card and modal patterns, and the "corporate enterprise clean" direction. Read it before adding new UI so new components reuse the existing tokens and patterns. `docs/FLOWCHART.md` has Mermaid diagrams of the page flow.

## Plans

Save every plan generated for this repository under `docs/plans/` inside the repo, not only in the default Claude Code plan location outside the project. Name files `YYYY-MM-DD-short-slug.md`. Keep them in the repo so they can be reviewed and committed with the code they describe.

`docs/progress.md` is a historical log. Some entries reference files that no longer exist (`style.css`, `script.js`); the current equivalents are under `frontend/css/` and `frontend/js/`.
