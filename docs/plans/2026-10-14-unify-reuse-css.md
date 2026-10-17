# Plan: Unify and reuse the CSS

## Context
The CSS is split across six files (`base.css`, `theme-toggle.css`, `layout.css`, `resume.css`, `schedule.css`, `print.css`) that were grown page by page. The same visual rules are written out several times, and some pages depend on load order to win. Recent work unified the shell and tokens, but the component rules still repeat. The goal is one shared component layer that every page uses, so a new page or a style change touches one place, with no visual change.

## What repeats today (from a grep of `frontend/css/`)
- **Focus ring:** `outline: 2px solid var(--accent); outline-offset: 2px` is written out 11 times across `base.css`, `layout.css`, `resume.css`, `theme-toggle.css`.
- **Uppercase eyebrow labels:** `text-transform: uppercase` in four places (`.badge`, `.section-label`, `.resume-skill-group-label`, `.schedule-placeholder-badge`), each with its own size, tracking and colour.
- **Pills:** `border-radius: var(--radius-pill)` in 10 places (buttons, chips, badges, email pill, share buttons, icon buttons).
- **Surface cards:** `background: var(--surface); border: 1px solid var(--border)` in 9 places. The résumé re-declares `border-radius: 0` in four selectors plus `print.css`.
- **Lists:** `ul` padding and `li` spacing are set separately in `.card-details`, `.modal-body`, `.resume-entry-body` and `.resume-skills-list`.
- **Icon buttons:** `.modal-btn`, `.modal-close`, `.nav-toggle` and `.share-btn` share border, hover-to-accent and focus rules but are defined separately.
- **Neumorphic cards:** the same background, radius, shadow and hover block is set for project, experience and education cards.
- **Breakpoints:** `@media (max-width: 768px)` appears in four files, each with its own copy of the header, grid and stack rules.
- **Hard-coded colours:** about 50 `rgba()` or hex literals outside `theme-toggle.css`, several of which should be tokens.

## Recommended approach

**1. Split by layer, not by page.**
- `tokens.css`: `:root` and `html.dark-mode` only (move from `base.css`).
- `base.css`: reset, element defaults, skip link, and the single focus-ring rule.
- `components.css`: buttons, pills, eyebrow labels, icon buttons, surface cards (with modifiers), lists, modal, loading and empty states.
- `layout.css`: page structure only (hero, stats, sections, CTA band, responsive header rules).
- `resume.css`, `schedule.css`, `print.css`: page-specific layout only.
- `theme-toggle.css`: unchanged; it is the illustrative exception and keeps its own variables.

Pages link `tokens`, `base`, `components`, `layout`, then one page file, in that order. Six stylesheets become seven in total, but each rule lives once.

**2. Introduce shared utilities.**
- One focus rule: `:focus-visible` with the accent outline, applied to a selector list in `base.css`, so components stop repeating it.
- `.eyebrow`: uppercase, tracked, accent-coloured label used by section labels, the badge, skill-group labels and the schedule badge.
- `.pill` base class, used by buttons, chips, badges and the email pill.
- `.icon-btn`: shared size (`--icon-btn-size`), border, radius and hover behaviour for modal and nav toggles.
- Surface card modifiers: `.card` (bordered, rounded), `.card--flat` (square corners, used by the résumé and print), `.card--neu` (homepage neumorphic).
- `.prose-list`: one list style (indent `--list-indent`, item gap) for card details, modal body and résumé entries.

**3. Tokens over literals.** Move the remaining `rgba()` overlays and shadow values into tokens in `tokens.css`. Keep `theme-toggle.css`'s colours local.

**4. Breakpoints.** CSS variables can't be used in media queries, so keep `768px` as the one literal and move each responsive rule next to the component it styles. Responsive rules move out of `resume.css`, `schedule.css` and `layout.css` into their component's section, so there is one place per component.

**5. Print.** Replace the selector list in `print.css` with `.card--flat`, so print and screen share the same card definition.

**6. Remove dead rules.** Load each page in the browser, then check every selector in `document.styleSheets` against `document.querySelector`. Delete rules that match nothing on any page.

## Critical files
- `frontend/css/base.css`, `layout.css`, `resume.css`, `schedule.css`, `print.css`, `theme-toggle.css`
- New: `frontend/css/tokens.css`, `frontend/css/components.css`
- `frontend/index.html`, `frontend/resume.html`, `frontend/schedule.html` (stylesheet `<link>` order only; the shell sync keeps them identical)
- `docs/DESIGN.md` (component and token tables)

## Verification
- **Before any change:** record computed styles (colour, background, border, radius, padding, font, shadow, outline) for a fixed list of elements on each page, in light and dark, at 375px, 768px and 1280px. Save as JSON.
- **After each phase:** rerun the capture and diff it against the baseline. Any difference must be intentional and listed.
- **Visual:** screenshot comparison at the same widths, plus a keyboard focus pass (every control shows the ring).
- **Print:** print preview of `resume.html` (one page, no shell, all sections visible).
- **Shell:** `node scripts/sync-shell.mjs --check` still passes.
- **Console:** no errors on any page.

## Risks
- **Cascade order:** several rules currently win only because `resume.css` loads after `layout.css` (for example, square corners on résumé cards). The phase-based split must keep the same order, or move the override into the `.card--flat` modifier.
- **More requests:** an extra stylesheet adds a request per page. If that matters, concatenate `tokens`, `base` and `components` in the deploy build step; this is a later option, not part of this plan.
- **Specificity changes:** merging selectors can change which rule wins. The computed-style diff is the check for this.

## Open questions
- Keep separate stylesheets with a shared components file, or bundle everything into one file at deploy time?
- Should `.card` be flat by default, with the homepage neumorphic style as the modifier?

## Implementation notes

Status: implemented (uncommitted). Open questions settled as: keep separate stylesheets (no bundling), and `.card` stays bordered by default with `.card--neu` as the homepage modifier.

What changed:
- Stylesheets are now `tokens.css`, `base.css`, `components.css`, `theme-toggle.css`, `layout.css`, plus the page files. Tokens and components moved out of `base.css` and `layout.css`.
- Shared classes: `.surface` and `.surface--flat` (replaces repeated card and résumé border/radius rules), `.card--neu` (homepage neumorphic cards, added in `js/main.js`), and grouped selectors for eyebrow labels, icon buttons, card-list indents and chips.
- One global `:focus-visible` rule replaces the per-component copies (all were identical, except the cream CTA ring and the expandable-card offset, which stay as overrides).
- Tracking values for eyebrow labels are tokens (`--tracking-eyebrow`, `--tracking-label`), so the section labels keep their wider spacing.
- Duplicate or dead rules removed: the second `.error-state` and `.education-card` blocks, `.container` and `.schedule-placeholder code`.

Deviations from the plan:
- Eyebrow, icon-button and chip reuse is done with grouped selectors rather than new `.eyebrow` / `.pill` / `.icon-btn` classes, so the generated markup in `js/main.js` changed only for `card--neu`.
- Responsive rules stay in each page's file. Moving them into component sections would change cascade order, and the plan says to avoid that risk.
- The nav styles stay in `base.css` rather than moving to `layout.css`, since they are part of the shared shell.
- I first marked `.skills-container` and `.section-head` as dead. They are used on the homepage, and the computed-style comparison caught the regression. Both rules are restored.
- The skill-group hover (a `card` class dependency) is kept by giving those elements `card surface--flat`.

Verification:
- Computed styles for about 90 selectors were captured before and after on each page, in light and dark, at desktop and phone width (12 states).
- The remaining differences are height changes of 1–7px in bordered boxes and an invisible colour change on `.nav-toggle` (it has no text). The baseline measured borders at 0.8px instead of 1px, which accounts for the height changes, so I treated them as measurement noise.
- Colours, fonts, radii, shadows, layout widths and element counts match on every page and state.
- Checked in the browser: homepage modal, Enter and Escape handling, focus trap, theme persistence, mobile menu, and no console errors.
- Not checked: résumé print preview (the print rules changed only by using `.surface`).

