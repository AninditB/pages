# Plan: Unified UI/UX across the frontend

## Context
The three pages (`frontend/index.html`, `resume.html`, `schedule.html`) share design tokens but drift apart in header, nav, footer, theme-switch markup, section headings, spacing, focus styling and breakpoints. The goal is one consistent system built on the existing tokens in `frontend/css/base.css`, with `schedule.html` fully included. The visual direction in `docs/DESIGN.md` stays the same; this is a consistency and accessibility pass.

## Decisions (confirmed)
- Scope: shared shell plus components, using existing tokens. No redesign.
- `schedule.html` is fully in the same system.
- Header CTA: "Get in touch" on every page.
- Dark background: site token `#0f1420` everywhere; `theme-toggle.css`'s `#1d1f2c` is retired.
- Nav: index shows anchor links; other pages use `index.html#section` links so the same nav works everywhere.
- Plan copy: saved to `~/.claude/plans/` and copied to `docs/plans/` in the repo.

## Key findings driving the plan
- Header/footer drift: nav link counts differ (index 6, others 2); wordmark href `#top` vs `index.html`; CTA differs (index "Get in touch", résumé "Print résumé", schedule none); footer headings differ; `section-animate` only on index.
- Theme-switch markup (~35 lines) duplicated per page.
- Spacing conflicts: `.section-label` margin (`layout.css:94-101` vs `resume.css:68-70`); list padding and spacing (`layout.css:240/245/483/487`, `resume.css:111/115`); icon button sizes (`layout.css:199/430`, `base.css:223`).
- Hard-coded values: neumorphic shadow and radius (`layout.css:145-152, 269`); modal overlay (`layout.css:372`); inline styles in `main.js` (~161, 212, 256-257, 446); résumé sidebar 300px vs DESIGN.md 260px; `theme-toggle.css` colours not from tokens.
- Accessibility: nested `.modal-btn` inside a `role="button"` card is swallowed by `handleCardKeydown` (`main.js` ~118-123); theme checkbox `display:none` (`theme-toggle.css:55-57`); no focus ring on mobile nav links (`base.css:262-265`) or résumé contact links (`resume.css:57-60`); no `scroll-margin-top` for the sticky header; index stats show "0" on fetch failure.
- Only one breakpoint exists (768px), in `layout.css:572`, `resume.css:176`, `schedule.css:72`.
- DESIGN.md claims that don't match code: card style (bordered vs neumorphic), theme switch keyboard access, focus rings on résumé links and mobile nav.

## Recommended approach

**Shared shell without a build step.** Keep static HTML. Each page holds the header, nav, mobile nav, theme switch and footer as a block wrapped in marker comments (`<!-- partial:shell:start -->` ... `<!-- partial:shell:end -->`). A small Node script (`scripts/sync-shell.mjs`, outside `frontend/` so it isn't deployed) copies the canonical block into all three pages. It has a `--check` mode for CI and a write mode for local edits. Rejected: runtime fetch of a partial (breaks `file://`, flashes unstyled nav) and build-time copy only in the deploy workflow (drift is only caught on push).

**Theme without flash.** Keep `theme.js` and the `theme` localStorage key. Add a tiny synchronous inline script to each `<head>` that applies `dark-mode` before paint.

## Implementation phases (each a separate reviewable change)
- **P0 Guardrails:** add `scripts/sync-shell.mjs` with `--check`; add a CI step; add an assertion in `.github/workflows/deploy-pages.yml` that the `data.js` `sed` pattern actually matched. Capture baseline screenshots.
- **P1 Tokens:** in `frontend/css/base.css`, add radius, shadow-neumorphic, overlay and scroll-offset tokens to `:root` and `body.dark-mode`. Replace hard-coded values in `layout.css`, `resume.css`, `theme-toggle.css`. Set dark background to the site token.
- **P2 Shared shell:** replace header, nav, mobile nav and theme-switch blocks in all three HTML files with the canonical block. Wordmark href `index.html` everywhere. Add a skip link. Visually hide the theme checkbox (not `display:none`) so it stays keyboard-operable, with a focus ring on `.theme-switch`. Add the head script.
- **P3 Type and sections:** change `resume.html`'s `div.section-label` headings to real `h2`s. Resolve the section-label margin conflict with one rule in `base.css`.
- **P4 Components:** unify cards, buttons, list spacing and icon-button size (minimum 40px hit area). Move inline styles from `main.js` into classes.
- **P5 Interaction and a11y:** in `main.js`, skip the card toggle when the event target is a nested control, so the modal button is reachable by keyboard. Add focus rings to mobile nav and résumé contact links. Add `scroll-margin-top` / `scroll-padding-top` for the sticky header. Show "—" instead of "0" when stats fail. Use one focus-trap helper for `mobile-nav.js` and the `main.js` modal, and bind Escape once per open.
- **P6 Schedule:** apply the shell and section structure to `schedule.html`; reconcile its 900px width with the 1100px header container.
- **P7 Breakpoints and print:** keep 768px as the single breakpoint; add 480px only if 375px needs it. Confirm `print.css` hides the shell and forces `section-animate` content visible.
- **P8 Docs:** update `docs/DESIGN.md` to match what was built, including the résumé width decision.

## Critical files
- `frontend/css/base.css`, `layout.css`, `resume.css`, `schedule.css`, `theme-toggle.css`, `print.css`
- `frontend/index.html`, `resume.html`, `schedule.html`
- `frontend/js/main.js`, `mobile-nav.js`, `theme.js`
- `docs/DESIGN.md`
- `.github/workflows/deploy-pages.yml`
- New: `scripts/sync-shell.mjs`

## Reuse
- `frontend/js/theme.js` and `mobile-nav.js` (extended, not replaced)
- `frontend/js/data.js` `fetchData` (keep the `../data/` path the deploy `sed` depends on)
- Existing tokens in `base.css` `:root` / `body.dark-mode` (extend, no second token set)

## Verification
- Serve from repo root: `python -m http.server 8000`; open `/frontend/`, `/frontend/resume.html`, `/frontend/schedule.html`.
- Check 375px, 768px and 1280px in light and dark against the P0 baselines.
- Keyboard-only walkthrough: skip link, nav, theme switch, card expand, modal open/close (focus returns to trigger), mobile nav open and Escape. Every control shows a focus ring.
- Print preview of the résumé: one page, no shell, all sections visible.
- Run `scripts/sync-shell.mjs --check`; confirm the deploy `sed` assertion passes.
- Check the browser console for errors on all three pages.

## Risks
- The deploy `sed` matches the exact `` fetch(`../data/${file}`) `` line; a change there silently disables the rewrite (hence the P0 assertion).
- `data.js` already fails under `file://`; that is pre-existing and unchanged.
- The footer reveal animation must be consistent across pages, or footer content stays hidden.
- No automated visual tests; the shell check and screenshot comparison are the only gates.

## Implementation notes

Status: implemented (uncommitted). Verified in the browser at 1280px and 375px, light and dark.

Deviations from the plan:
- P0 baseline screenshots were not captured before changes; checks were run after the changes instead.
- Print preview was not checked visually; the print rules were reviewed in `frontend/css/print.css`.
- Theme class moved from `<body>` to `<html>` so the head script can apply it before paint (`frontend/js/theme.js`, `frontend/css/base.css`).
- Wordmark and nav links use `{{home}}`: `#top` / `#projects` on the homepage, `index.html#top` / `index.html#projects` elsewhere.
- Footer no longer uses `section-animate` on any page, so footer content is never hidden waiting for a scroll observer.
- The print button moved from the header into the résumé sidebar, marked `.no-print`.
- Mobile header rules (`layout.css`, `≤768px`) were added so the wordmark, theme switch, menu toggle and CTA fit on one line at 375px. No 480px breakpoint was needed.
- Inline animation delays for staggered cards and skill chips stay inline (they are per item); the animation itself moved to `.fade-in-up`.

Added: `scripts/sync-shell.mjs` and `scripts/shell.template.html`, a `js/a11y.js` focus-trap helper, a shell-sync and `data.js` rewrite check in `.github/workflows/deploy-pages.yml`, and the design doc and README updates.
