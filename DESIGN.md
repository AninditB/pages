# Design system

Documents the visual language used across `index.html`, `resume.html`, and `schedule.html`. All
tokens live in `style.css:7-70` as CSS custom properties on `:root` (light) and `body.dark-mode`
(dark); theme is toggled by adding/removing the `dark-mode` class on `<body>` and persisted to
`localStorage['theme']`.

## Direction

**Corporate enterprise clean.** Conservative, credible, low-personality — built for enterprise
hiring managers and clients rather than a "creative portfolio" feel. Flat by default, restrained
motion, one accent color used sparingly.

## Color

```yaml
light:
  bg:             "#f7f8fa"
  bg-alt:         "#eef1f5"
  surface:        "#ffffff"
  text:           "#161b22"
  text-secondary: "#5b6472"
  border:         "#dde2e8"
  accent:         "#1f5fbf"
  accent-soft:    "rgba(31, 95, 191, .10)"
  btn-bg:         "#161b22"
  btn-text:       "#f7f8fa"
  cta-bg:         "#101425"
  cta-text:       "#f5f6f8"
  shadow-sm:      "rgba(22, 27, 34, .06)"
  shadow-md:      "rgba(22, 27, 34, .10)"
  shadow-lg:      "rgba(22, 27, 34, .18)"

dark:
  bg:             "#0f1420"
  bg-alt:         "#161c2c"
  surface:        "#1a2133"
  text:           "#eef1f6"
  text-secondary: "#9aa4b2"
  border:         "#2a3244"
  accent:         "#7fb0ff"
  accent-soft:    "rgba(127, 176, 255, .14)"
  btn-bg:         "#eef1f6"
  btn-text:       "#10141f"
  cta-bg:         "#0b0f1a"
  cta-text:       "#eef1f6"
  shadow-sm:      "rgba(0, 0, 0, .25)"
  shadow-md:      "rgba(0, 0, 0, .40)"
  shadow-lg:      "rgba(0, 0, 0, .55)"
```

| Token | Use |
|---|---|
| `bg` | Page background |
| `bg-alt` | Alternating section background |
| `surface` | Cards, sidebar, modal, embed container |
| `text` | Primary text |
| `text-secondary` | Body copy, meta, labels |
| `border` | Card/section borders, dividers |
| `accent` | Links, badges, focus rings, chip hover |
| `accent-soft` | Badge / chip-hover fill |
| `btn-bg` / `btn-text` | Primary button |
| `cta-bg` / `cta-text` | Footer CTA band |
| `shadow-sm/md/lg` | Elevation levels (see [Elevation](#elevation)) |

Accent contrast is pre-checked (WCAG relative luminance):

| Pair | Ratio | Grade |
|---|---|---|
| Light `accent` on white | 6.09:1 | AA |
| Dark `accent` on dark `bg` | 8.38:1 | AA/AAA |
| Light `text-secondary` on `bg` | 5.98:1 | AA |
| Dark `text-secondary` on `bg` | 7.30:1 | AA/AAA |

Project-thumb gradients (`.thumb-1/2/3`) and the CTA band's translucent overlays
(`--cta-text-rgb`) are theme-derived rather than hardcoded, so they don't need per-theme
duplication.

## Typography

Font: **Inter**, loaded via Google Fonts (`400/500/600/700`, `display=swap`) in each page's
`<head>`, falling back to the system sans stack if the request fails.

```yaml
font-sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

size:
  xs:   0.75rem
  sm:   0.85rem
  base: 1rem
  md:   1.05rem
  lg:   1.25rem
  xl:   1.5rem
  2xl:  1.75rem
  3xl:  2rem
  4xl:  "clamp(2rem, 4.5vw, 3.2rem)"
  stat: 2.25rem   # kept outside the scale — largest text on the page

weight:
  regular:  400
  medium:   500
  semibold: 600
  bold:     700

leading:
  tight:   1.15
  snug:    1.3
  normal:  1.6
  relaxed: 1.7
```

| Size token | Typical use |
|---|---|
| `xs` | Eyebrows, badges, stat labels, chips |
| `sm` | Meta text, buttons |
| `base` | Body copy |
| `md` | Card / entry headings |
| `lg` | Modal title |
| `xl` | Résumé name |
| `2xl` | Section `h2` |
| `3xl` | CTA `h2`, schedule `h1` |
| `4xl` | Hero `h1` |
| `stat` | Stats-strip numbers |

## Spacing & radius

4px/8px rhythm. Section vertical rhythm is unified across all three pages at
`space.10 space.6` (homepage sections) or `space.7 space.6 space.10` (résumé/schedule layouts).

```yaml
space:
  1: 0.25rem
  2: 0.5rem
  3: 0.75rem
  4: 1rem
  5: 1.5rem
  6: 2rem
  7: 2.5rem
  8: 3rem
  9: 4rem
  10: 5rem

radius:
  xs:   0.4rem   # inline code
  sm:   0.6rem   # tech-stack box
  md:   0.9rem   # cards, résumé cards, schedule embed
  lg:   1rem     # modal
  pill: 999px    # buttons, badges, chips, circular icon buttons
```

## Elevation

Two-level system, used deliberately rather than everywhere:

| Level | Shadow | Applied to |
|---|---|---|
| None | — | Buttons, nav, CTA band — flat by design |
| Resting | border only | Cards at rest |
| Hover | `0 8px 20px` `shadow-md` | Card hover |
| Modal | `0 20px 40px` `shadow-lg` | Modal — highest elevation on the site |

## Components

| Component | Classes | Key styling | Notes |
|---|---|---|---|
| Buttons | `.btn` `.btn-primary` `.btn-secondary` `.btn-sm` | pill radius, subtle opacity/border hover | no lift; `:focus-visible` accent ring |
| Chips | `.skill` `.tag-pill` | one shared ruleset, pill radius | accent-soft fill + accent border/text on hover |
| Cards | `.card` `.project-card` `.experience-card` `.education-card` | `radius-md`, border-only at rest, hover elevation | `.education-card` hover suppressed — not expandable, avoids a false "clickable" signal |
| Résumé cards | `.resume-entry` `.resume-skill-group` `.resume-sidebar` | same card language as homepage | unifies the résumé's visual system with the rest of the site |
| Modal | `.modal-overlay` `.modal-content` | `radius-lg`, highest elevation | focus-visible rings on close/action buttons |
| Theme switch | `.theme-switch*` | checkbox-driven sun/moon toggle | own internal CSS vars, not wired into shared tokens — the one deliberately illustrative element on the page; `--toggle-size: 14px` (~79×35px) fits the header; native `<input type="checkbox">` under a `<label>` — keyboard-operable and exposes checked state to AT for free |
| Mobile nav | `.nav-toggle` `.mobile-nav` | hamburger + absolutely-positioned dropdown at `≤768px` | replaces the old dead-end `.main-nav { display: none }`; full keyboard support (see [Accessibility](#accessibility)) |
| Empty / error states | `.empty-state` `.error-state` | secondary-color vs. accent-color text | `fetchData()` returns tagged `{ ok, data }` so a failed fetch never looks identical to a genuinely-empty dataset |
| Schedule placeholder | `.schedule-placeholder*` | "Coming soon" badge + message | shown when `CAL_LINK` is unset in `schedule.js`, so the page reads as intentional rather than broken |

## Résumé layout

`resume.html`-specific grid structure, layered on top of the shared tokens/components above —
every résumé block (sidebar, entries, skill groups, cert list) uses the `.card` treatment from
the [Components](#components) table, just arranged in its own layout. Corners are squared off
(`border-radius: 0`, overriding `--radius-md`) rather than rounded — a deliberately sharper,
document-like edge for the résumé specifically, distinct from the softer rounded cards used
elsewhere on the site.

```yaml
resume-layout:
  max-width: 1100px
  grid-template-columns: "260px 1fr"   # sidebar / main
  gap: space.9
  padding: "space.7 space.6 space.10"

resume-sidebar:
  card: true
  radius: 0                            # squared off, overrides radius.md
  padding: space.6

resume-entry:                          # one per experience/education item
  card: true
  radius: 0
  grid-template-columns: "220px 1fr"   # meta / body
  gap: space.6
  padding: space.6
  stacking-gap: space.4                # between consecutive entries

resume-skills-groups:
  grid-template-columns: "repeat(2, 1fr)"
  gap: space.5
  each-group:
    card: true
    radius: 0
    padding: space.5

resume-cert-card:                      # single card wrapping the whole <ul>
  card: true
  radius: 0
  padding: "space.2 space.5"

breakpoint-768:
  resume-layout: "1fr — sidebar stacks above main"
  resume-entry: "1fr — meta stacks above body"
  resume-skills-groups: "1fr — groups stack"
```

| Section | Container | Cards |
|---|---|---|
| Name, title, bio, contact links | `.resume-sidebar` | One card |
| Each experience / education item | `.resume-entry` | One card per item |
| Each skill category | `.resume-skill-group` | One card per group |
| Certifications | `.resume-cert-card` | One card wraps the entire list |

## Print

`resume.html`'s `@media print` block hides the header/CTA band, resets to black-on-white, and
flattens the résumé's card styling so the on-screen treatment doesn't bleed color or shadows onto
the printed page.

```yaml
media: print
hide: [".site-header", ".cta-band"]
reset:
  background: "#ffffff"
  color: "#000000"
flatten:
  selectors: [".card", ".resume-entry", ".resume-sidebar", ".resume-skill-group"]
  box-shadow: none
  border-radius: 0
  border: "1px solid #000"
```

## Accessibility

| Element | Behavior |
|---|---|
| All interactive elements | `:focus-visible` — 2px accent outline (buttons, nav links, chips' parent controls, modal close/action buttons, mobile-nav trigger, résumé contact links) |
| Mobile nav panel | Uses the `hidden` attribute (not a CSS class) — inert to assistive tech and removed from Tab order when closed |
| Mobile nav panel (open) | Focus moves in on open; Tab/Shift+Tab trapped within its links; Escape closes and returns focus to the trigger; click-outside closes |
| Modal | Same focus-trap + Escape-to-close pattern (`trapFocus` in `script.js`), predates this redesign |
