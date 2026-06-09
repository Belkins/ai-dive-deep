# Vlad's Playbook — Design System

> **The "warm-dark editorial field manual."** Serif display + sans body + monospace
> machine-voice, set in ink "paper" lit by a single hot flame-orange, with terminal-green
> as the system/agent secondary. **Book meets terminal.**
>
> This is the canonical, reverse-engineered design system for
> [dive.vladyslavpodoliako.com](https://dive.vladyslavpodoliako.com/) — the live Playbook
> (Astro 5 + Tailwind 3 + React islands). Every token, component, and pattern below was
> **parsed and verified against the source** (`tailwind.config.ts`, `src/styles/global.css`,
> the 17 Astro components, 29 React widgets, and 38 pages). Drift is flagged, not hidden —
> this doc is the instrument for taming it.
>
> **Companion artifact:** [`design-system.html`](../design-system.html) — a standalone,
> interactive kitchen-sink style guide that renders every token and component live.
> Open it in a browser.

| | |
|---|---|
| **Stack** | Astro 5 (`applyBaseStyles: false`) · Tailwind 3.4 · React 18 islands · framer-motion · Radix UI |
| **Theme mode** | Dark-first. `:root` **is** the dark theme; `[data-theme='light']` is a partial override. |
| **Fonts** | Source Serif 4 (display) · Inter (sans) · JetBrains Mono (mono) — loaded from Google Fonts |
| **Color model** | Semantic CSS vars as space-separated RGB triplets → `rgb(var(--x) / <alpha>)` |
| **Source of color** | 7 semantic vars, applied via inline `style=` (999×). The numbered Tailwind palette is ~95% dead. |
| **Surfaces** | Hairline borders (1px `--line`), modest radii, **no shadows** (7 total in the whole app) |

---

## Table of contents

1. [Design principles](#1-design-principles)
2. [Foundations — tokens](#2-foundations--tokens)
   - [2.1 Color](#21-color) · [2.2 Typography](#22-typography) · [2.3 Spacing](#23-spacing) · [2.4 Radius](#24-radius--corners) · [2.5 Elevation & z-index](#25-elevation--z-index) · [2.6 Layout, containers & breakpoints](#26-layout-containers--breakpoints) · [2.7 Motion](#27-motion) · [2.8 Iconography](#28-iconography)
3. [Token export (CSS + DTCG JSON)](#3-token-export)
4. [Component primitives (CSS layer)](#4-component-primitives-css-layer)
5. [Components (Astro)](#5-components-astro)
6. [Layout shell](#6-layout-shell)
7. [Page patterns](#7-page-patterns)
8. [Interactive widgets](#8-interactive-widgets)
9. [Accessibility](#9-accessibility)
10. [Drift & standardization backlog](#10-drift--standardization-backlog)
11. [How to use & extend this system](#11-how-to-use--extend-this-system)

---

## 1. Design principles

The aesthetic in one line: **a warm-dark editorial field manual** — it reads like a printed
technical manual re-skinned for a glowing screen at night. The bones are a *book* (serif
display, comfortable sans, fixed reading measure, warm ink surfaces); the *terminal* half is
the machine register (monospace, one hot accent, terminal-green for system state).

| # | Principle | Rule | Do / Don't |
|---|-----------|------|------------|
| 1 | **Dark-first** | `:root` *is* the dark theme (`color-scheme: dark`, `--bg: 14 15 17`). Light is a 5-of-7-var override. | Design on near-black first. Don't ship a component that only reads in light — there's no `[data-theme='dark']` fallback block. |
| 2 | **One hot accent, used sparingly** | Flame `#FF6B2C` (`--accent`) is the *only* warm accent — links, primary CTA, focus rings, chapter numerals, blockquote rule. | Reach for it when something is *the* thing to act on. Don't accent a whole region in flame — if everything is orange, nothing is. |
| 3 | **Monospace = machine voice** | `font-mono` means "the machine is talking." Serif = author, sans = reader, mono = machine/agent. | Set commands, paths, tool I/O, stat read-outs in mono. Don't use mono for "techy flavor" on human prose — it changes *who is speaking*. |
| 4 | **Terminal-green = system state** | `--accent-2` `#22D3A0` marks what the *system* reports (read-state badge, "Official", verified, done). | Flame = what *you* do; mint = what the *system* knows. Don't cross the wires (no green CTAs, no flame checkmarks). |
| 5 | **Generous reading measure** | Long-form lives in a fixed narrow column — **760px** / ~68ch, centered, 16→17px desktop bump, `line-height: 1.75`. | Wrap prose in `.container-prose`; use `.container-wide` (1152px) only for nav + tiled grids. Don't run prose full-bleed. |
| 6 | **Restraint & density over ornament** | Few weights (headings always **500**, never 700), hairline structure, modest radii, **no shadows**. | Express hierarchy through size, serif-vs-sans, and the single accent. Don't add drop shadows or gradients "to pop." |
| 7 | **Motion is an accent, not decoration** | Whole vocabulary = 3 entrances (`fade-in`, `rise`, `pulse-soft`) + one 150ms micro-transition. | Use `rise`/`fade-in` to settle content in. Don't add spin/scale/parallax or new durations. |
| 8 | **Warm neutrals, never pure gray** | The neutral ramp is `ink` — warm off-blacks/off-whites (`#0E0F11`, `#FAFAF7`), not `#000`/`#888`/`#fff`. | Pull from `ink` / the semantic vars. Don't drop in raw `#000`, `#fff`, or Tailwind `gray-*`/`slate-*` (cold, off-palette). |
| 9 | **Accessible by default** | Flame `:focus-visible` rings on every control, a skip-link, a thorough `prefers-reduced-motion` block, a full print stylesheet. | Keep focus + reduced-motion on every new interactive/animated element. Don't ship a control with no visible focus. |
| 10 | **Token-driven via RGB triplets** | `--accent: 255 107 44` consumed as `rgb(var(--accent) / <alpha>)` → one token, a full opacity ladder. | Derive tints/washes/borders by alpha-modulating a token. Don't hard-code "flame at 60%" — write `rgb(var(--accent) / 0.6)`. |

---

## 2. Foundations — tokens

### 2.1 Color

#### Semantic tokens (the live system)

All real color flows through **7 CSS custom properties**, defined as space-separated RGB
triplets so they compose with alpha: `rgb(var(--token) / 0.5)`. **Dark = `:root`. Light =
`[data-theme='light']`.**

| Token | Role | Dark triplet | Dark hex | Light triplet | Light hex |
|-------|------|--------------|----------|---------------|-----------|
| `--bg` | Page background | `14 15 17` | `#0E0F11` | `250 250 247` | `#FAFAF7` |
| `--fg` | Primary text | `250 250 247` | `#FAFAF7` | `14 15 17` | `#0E0F11` |
| `--muted` | Secondary text / labels | `170 167 154` | `#AAA79A` | `86 84 75` | `#56544B` |
| `--line` | Hairline borders / fills | `38 37 31` | `#26251F` | `229 227 218` | `#E5E3DA` |
| `--paper` | Elevated surface (cards) | `22 23 27` | `#16171B` | `242 241 236` | `#F2F1EC` |
| `--accent` | **Flame** — human intent | `255 107 44` | `#FF6B2C` | *(inherits)* | `#FF6B2C` |
| `--accent-2` | **Terminal** — system state | `34 211 160` | `#22D3A0` | *(inherits)* | `#22D3A0` |

> `--accent` / `--accent-2` are **theme-invariant** by design — they are not re-declared in
> light mode. `::selection` = `rgb(var(--accent) / 0.25)`.

**Canonical alpha ladder** (how the 7 vars actually flex):

| Alpha | Use |
|-------|-----|
| `/ 0.04`–`/ 0.08` | tinted wash backgrounds (active toc-link, accent-2 chip) |
| `/ 0.12`–`/ 0.18` | chip/badge fills, focus-ring glow |
| `/ 0.25` | `::selection` |
| `/ 0.4`–`/ 0.6` | hairline-on-hover, secondary borders |
| `/ 0.7`–`/ 0.85` | muted text, `.pill` background, link hover |
| `/ 0.92` | body prose text (`--fg / 0.92`) |

#### Bespoke palettes (`tailwind.config.ts`)

Three named scales. **Important:** the numbered steps are **~95% unused** — color is delivered
through the semantic vars above, not these utilities (see [§10](#10-drift--standardization-backlog),
DEAD-1). They survive as the *reference ramp* the vars were sampled from, and only
`border-flame` (the `DEFAULT`/`.400` step) is used directly (43×).

**`ink`** — warm-gray neutral ramp (11 steps, no `DEFAULT`):

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FAFAF7` | `#F2F1EC` | `#E5E3DA` | `#C9C6B8` | `#8C897C` | `#56544B` | `#3A3933` | `#26251F` | `#1A1916` | `#0E0F11` | `#08090B` |
| `--bg` (lt) | `--paper` (lt) | `--line` (lt) | | | `--muted` (lt) | | `--line` (dk) | | `--bg` (dk) | |

**`flame`** — primary accent (orange; `DEFAULT` + 50→900, no 950). `DEFAULT` = `.400` = `--accent`:

| DEFAULT/400 | 50 | 100 | 200 | 300 | 500 | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FF6B2C` | `#FFF1E9` | `#FFD9C4` | `#FFB48C` | `#FF8E54` | `#E0521A` | `#B33E10` | `#85300C` | `#5C2108` | `#3D1604` |

**`terminal`** — secondary accent (mint; `DEFAULT` + 50→900, no 950). `DEFAULT` = `.400` = `--accent-2`:

| DEFAULT/400 | 50 | 100 | 200 | 300 | 500 | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#22D3A0` | `#E6FBF3` | `#BFF4DD` | `#7AE9BF` | `#3CDCA8` | `#15B387` | `#0E8E6A` | `#0A684E` | `#064433` | `#03281D` |

#### Status colors — **proposed** (not yet tokenized)

The app invents raw hexes for status because no semantic status tokens exist (see DRIFT-4).
Promote these to vars so authors stop hard-coding. Recommended canonical set:

| Token | Hex | Currently hard-coded as | Where |
|-------|-----|-------------------------|-------|
| `--success` | `#22C55E` (or reuse `--accent-2`) | `#22c55e` | `HeroIntro.tsx` |
| `--warning` | `#FFAA00` | `#FFAA00`, `#f59e0b`, `#FFC83D`, `#F5C24A` | `cowork-setup.astro`, `StagesFlow.tsx`, `HeroIntro.tsx` |
| `--error` | `#EF4444` | `#ef4444`, `#FF4D4D`, `#E94B3C` | `HeroIntro.tsx` |
| `--info` | `#8B5CF6` | `#8B5CF6` → `#C77DFF` (purple ramp) | `lmarena.ts`, `sovereign-stack.ts` (categorical data-viz) |

> The **purple family** (`#7A2EE6`→`#8B5CF6`→`#9B5DFF`→`#C77DFF`) is a categorical data-viz
> scale in the leaderboard / sovereign-stack charts — legitimate as a chart palette, but it
> should live in a documented `--chart-*` token set, not as scattered literals.

---

### 2.2 Typography

#### Font families

| Token | Stack | Role |
|-------|-------|------|
| `font-display` | `"Source Serif 4", "Source Serif Pro", Georgia, serif` | Headings, chapter numerals, display lines, card titles (`223×`) |
| `font-sans` | `"Inter", system-ui, -apple-system, sans-serif` | Body / UI default (set on `html`; rarely needs the utility) |
| `font-mono` | `"JetBrains Mono", "Fira Code", ui-monospace, monospace` | Code, terminal blocks, **stat read-outs, the machine voice** (`126×`) |

Loaded via Google Fonts: `Inter:400,500,600,700` · `JetBrains Mono:400,500,600` ·
`Source Serif 4:opsz 8..60, 400,500,600`.

#### Type scale (headings — `global.css`)

All headings share: `font-family: Source Serif 4`, `font-weight: 500`, `letter-spacing: -0.015em`,
`color: --fg`. **Never 600/700.** Headings are fluid (`clamp`) except `h4`.

| El | `font-size` | px range | line-height | margin-top | margin-bottom |
|----|-------------|----------|-------------|------------|---------------|
| `h1` | `clamp(2.5rem, 6vw, 4rem)` | 40→64 | `1.05` | — | — |
| `h2` | `clamp(1.75rem, 3vw, 2.25rem)` | 28→36 | `1.2` | `3rem` | `1rem` |
| `h3` | `clamp(1.25rem, 2vw, 1.5rem)` | 20→24 | `1.3` | `2.5rem` | `0.75rem` |
| `h4` | `1.125rem` (static) | 18 | inherit | `2rem` | `0.5rem` |
| `.chapter-num` | `clamp(4rem, 8vw, 6rem)` | 64→96 | `1` | — | color `--accent`, `font-feature-settings: 'lnum'` |

In-page display headings frequently override with Tailwind: hero `h1` =
`text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight`; section `h2` =
`text-3xl md:text-4xl`; card `h3` = `font-display text-2xl` (feature) or `text-lg` (compact).

#### Body, prose & code

| Element | Spec |
|---------|------|
| Body base | Inter, 16px mobile → **17px ≥640px**; `antialiased`, `optimizeLegibility` |
| `.chapter-body p` | `line-height: 1.75`, `color: --fg / 0.92`, `margin: 1.25rem 0` |
| `.chapter-body a` | `color: --accent`, `text-underline-offset: 4px`, hover `--accent / 0.85` |
| `.chapter-body blockquote` | `border-left: 2px solid --accent`, italic, `font-size: 1.05em` |
| `code` (inline) | mono `0.92em`, bg `--line / 0.6`, `padding: 0.15rem 0.4rem`, `radius: 4px` |
| `pre` (block) | mono `0.86em`, bg `--paper`, `1px --line`, `radius: 0.5rem`, `padding: 1.25rem` · **Shiki `github-dark-dimmed`, fixed-dark (doesn't theme-switch)** |

#### The eyebrow / micro-label — **the most-used atom (≈108×), and the biggest drift**

A small uppercase, letter-spaced label sits above almost every heading, card, and section.
It is built ad-hoc every time across **9 font sizes × 9 tracking values**. **This is the #1
thing to standardize.** Canonical recommendation → **two tokens only**:

| Proposed token | Spec | Use |
|----------------|------|-----|
| `.eyebrow` | `text-[11px] uppercase tracking-[0.18em] font-medium` | default label (vendor, section kicker) |
| `.eyebrow--loud` | `text-xs uppercase tracking-[0.25em]` | hero / band labels |

Colour by meaning: `--accent` (a topic/intent label), `--accent-2` ("new / official / system"),
`--muted` (a neutral category). Today the live spread to collapse:

- **Sizes:** `text-[10px]` (73×) · `text-[0.7rem]` (35×) · `text-[11px]` (33×) · `text-[0.65rem]` (25×) · + `0.62/0.72/0.6/0.55/0.9px`/`text-xs`
- **Tracking:** `tracking-wider` (173×, = `0.05em`) · `tracking-[0.25em]` (48×) · `[0.18em]` (21×) · `[0.2em]` (15×) · + `0.24/0.22/0.28/0.14/0.3/0.32em`

---

### 2.3 Spacing

No formal spacing token set exists; the app uses Tailwind's default 4px scale. **Empirically**
(frequency-ranked across `src`), the de-facto system is tight and clusters hard:

| Tier | Steps (Tailwind) | px | Use | Evidence |
|------|------------------|-----|-----|----------|
| **Micro** | `1` `2` `3` | 4 / 8 / 12 | gaps & padding inside components | `gap-3`×70, `gap-2`×62, `gap-1`×45, `p-3`×117, `py-2`×124 |
| **Component** | `4` `5` `6` | 16 / 20 / 24 | card padding, button rows | `p-4`×52, `p-5`×49, `gap-4`×35 |
| **Block** | `8` `10` `12` | 32 / 40 / 48 | between blocks within a section | `gap-10`×13, `py-12`×7 |
| **Section** | `14` `16` `20` `24` | 56 / 64 / 80 / 96 | vertical section rhythm | `mt-24`×65, `mt-14`×55, `mt-16`, `mt-20` |

> **Canonical recommendation:** standardize on `{0,1,2,3,4,5,6}` for intra-component spacing,
> `{8,10,12}` for block gaps, `{14,16,20,24}` for section rhythm. Section headers consistently
> get `mt-16`/`mb-8`; footers/big bands `mt-24`.

---

### 2.4 Radius & corners

Four+ radii are in use for "a panel." The canonical anchor is `.card` = `rounded-xl`.

| Tailwind | rem | Frequency | Canonical role |
|----------|-----|-----------|----------------|
| `rounded` | 0.25rem | 59× | nav tabs, kbd, tiny chips |
| `rounded-md` | 0.375rem | **99×** | buttons (`.btn` = 0.375), small interactive blocks |
| `rounded-lg` | 0.5rem | 69× | Callout, ArtifactEmbed card, light panels |
| `rounded-xl` | 0.75rem | 46× | **`.card`** — the canonical surface radius |
| `rounded-2xl` | 1rem | 2× | (avoid — off-system) |
| `rounded-full` | 9999px | 18× | `.pill`, badges, read-check |

> **Drift:** the same conceptual "card" appears at `md`/`lg`/`xl`. **Pick one card radius
> (`rounded-xl`, 0.75rem)** and reserve `rounded-md` for buttons, `rounded-full` for pills.
> Custom radii seen in CSS: `.nl-input`/`.nl-btn` = `0.625rem`, modal panel = `12px`.

---

### 2.5 Elevation & z-index

**There is essentially no elevation system — and that's intentional** (Principle 6). Only **7**
shadow utilities exist in the entire app; surfaces are separated by the `--paper` fill + a 1px
`--line` border, not shadows. The *one* real shadow is the artifact modal
(`0 24px 80px rgb(0 0 0 / 0.5)`) — reserved for the top-most overlay.

**Z-index layers** (the de-facto stack):

| z | Layer |
|---|-------|
| `z-30` | reading progress bar (`ProgressBar`) |
| `z-40` | sticky header (`Nav`) |
| `z-50` | command palette / popovers |
| `60` (raw) | artifact modal (`.artifact-modal`) |
| `100` (raw) | `.skip-link` (must beat everything) |

> Promote these into a documented `z` scale (`header: 40`, `overlay: 50`, `modal: 60`,
> `skip: 100`) so new overlays don't collide.

---

### 2.6 Layout, containers & breakpoints

| Container | max-width | Padding (base → ≥640px) | Use |
|-----------|-----------|--------------------------|-----|
| `.container-prose` | **760px** | 1.5rem → 2rem | reading column (chapters, callouts, prose) |
| `.container-wide` | **72rem / 1152px** | 1.5rem → 2rem | nav, hero, tile grids, footer |
| `maxWidth.prose` | `68ch` | — | *(declared but dead — see DEAD-3)* |
| `maxWidth.article` | `760px` | — | duplicate of `.container-prose` |

**Breakpoints** (Tailwind defaults; `xl` rare, `2xl` unused):

| bp | min-width | Usage | Note |
|----|-----------|-------|------|
| `sm` | 640px | 70× | also the container-padding breakpoint & 16→17px body bump |
| `md` | 768px | **94×** | the primary responsive breakpoint |
| `lg` | 1024px | 69× | nav desktop tabs appear; 3-up grids; sidebar rails |
| `xl` | 1280px | 5× | nav 6th/7th tab + edition pill only |
| `2xl` | 1536px | 0× | unused |

**Grid patterns:** `grid-cols-2` (49×) and `grid-cols-3` (23×) dominate. Canonical tile grids:
`grid gap-3 sm:grid-cols-2 lg:grid-cols-3` (chapter cards) and
`grid gap-6 md:grid-cols-2 lg:grid-cols-4` (feature tiles). Two-column reading layout with a
sticky rail: `lg:grid lg:grid-cols-[240px_1fr] lg:gap-10`.

---

### 2.7 Motion

The entire motion vocabulary — keep it this tight.

| Name | Shorthand | Duration | Easing | Use |
|------|-----------|----------|--------|-----|
| `animate-fade-in` | `fadeIn` | 600ms | `ease-out` | opacity-only entrance |
| `animate-rise` | `rise` | 600ms | `cubic-bezier(0.2,0.7,0.2,1)` | content settle (8px lift + fade) |
| `animate-pulse-soft` | `pulseSoft` | 2.4s ∞ | `ease-in-out` | live/loading pulse (0.6↔1 opacity) |

```
fadeIn:    0 → 1 opacity
rise:      {opacity:0, translateY(8px)} → {opacity:1, translateY(0)}
pulseSoft: 0%,100% opacity .6 · 50% opacity 1
```

- **Micro-interactions:** a single **150ms** transition on `background-color` / `border-color` /
  `color` / `opacity` (`.btn*`, `.card`, links, `.anchor`). One stray `duration-100` (progress
  bar) — otherwise 150ms is the law.
- **Scroll reveal:** `.reveal` class + IntersectionObserver; `SectionNav` uses IO for active state.
- **framer-motion** is a dependency but **interactive widgets animate mostly via CSS/IO**, not
  `motion.*` (0 `motion.`/`whileInView` matches in widgets) — treat framer-motion as available
  but not the default; prefer the named CSS animations.
- **`prefers-reduced-motion: reduce`** neutralizes all three animations + the 150ms transitions +
  smooth scroll. Honor it on anything new.

---

### 2.8 Iconography

**There is no icon font and no icon component — and `lucide-react` is a dead dependency**
(declared in `package.json`, **0 imports**). Icons are **hand-authored inline SVG**, and that
is the system:

```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">…</svg>
```

| Spec | Value |
|------|-------|
| Viewbox | `0 0 24 24` |
| Fill | `none` (line icons) |
| Stroke | `currentColor` (inherits text color — themes for free) |
| Stroke width | `2` (UI) · `3` (the read-state checkmark, for weight at small size) |
| Caps/joins | `stroke-linecap="round" stroke-linejoin="round"` |
| Sizing | `h-3 w-3` … `h-5 w-5` (Tailwind), matched to adjacent text |

> **Recommendation:** either delete `lucide-react` (dead weight) **or** adopt it deliberately —
> but if adopting, keep the 24×24 / `currentColor` / stroke-2 conventions so icons stay
> consistent with the existing inline set.

**Brand & assets** (`public/`): text wordmark **"Vlad's Playbook"** (`font-display text-lg`,
no logo image) · `favicon.svg` · `og-default.{png,svg}` + `og-launch.{png,svg}` (social cards) ·
`screens/` (90 product screenshots) · `artifacts/` (embedded interactive HTML case studies).

---

## 3. Token export

Drop-in. The first block is **live today**; the commented additions are the recommended
promotions from the [drift backlog](#10-drift--standardization-backlog).

### CSS custom properties

```css
:root {
  color-scheme: dark;
  /* surfaces & text */
  --bg: 14 15 17;        /* #0E0F11 */
  --fg: 250 250 247;     /* #FAFAF7 */
  --muted: 170 167 154;  /* #AAA79A */
  --line: 38 37 31;      /* #26251F */
  --paper: 22 23 27;     /* #16171B */
  /* accents (theme-invariant) */
  --accent: 255 107 44;  /* #FF6B2C flame — human intent */
  --accent-2: 34 211 160;/* #22D3A0 terminal — system state */

  /* ── RECOMMENDED ADDITIONS ─────────────────────────── */
  /* status (promote raw hexes — DRIFT-4) */
  /* --success: 34 197 94;   #22C55E */
  /* --warning: 255 170 0;   #FFAA00 */
  /* --error:   239 68 68;   #EF4444 */
  /* --info:    139 92 246;  #8B5CF6 */
  /* on-accent text (replace literal #fff — D-7) */
  /* --on-accent: 255 255 255; */
}

[data-theme="light"] {
  color-scheme: light;
  --bg: 250 250 247;     /* #FAFAF7 */
  --fg: 14 15 17;        /* #0E0F11 */
  --muted: 86 84 75;     /* #56544B */
  --line: 229 227 218;   /* #E5E3DA */
  --paper: 242 241 236;  /* #F2F1EC */
  /* --accent / --accent-2 intentionally NOT overridden */
}
```

**Tailwind addition — ✅ shipped** (`tailwind.config.ts`, branch `design-system`). The vars are now
wired into utilities, so the 999 inline `style=` attrs can become `text-accent` / `bg-paper` /
`border-line` (MISSING-1). These are theme-aware (they resolve to the CSS vars, so they flip in
light mode) and alpha-modifier-aware (`bg-accent/10` → `rgb(var(--accent) / .1)`). The live config:

```ts
// tailwind.config.ts → theme.extend.colors
bg:        'rgb(var(--bg) / <alpha-value>)',
fg:        'rgb(var(--fg) / <alpha-value>)',
muted:     'rgb(var(--muted) / <alpha-value>)',
line:      'rgb(var(--line) / <alpha-value>)',
paper:     'rgb(var(--paper) / <alpha-value>)',
accent:    'rgb(var(--accent) / <alpha-value>)',
'accent-2':'rgb(var(--accent-2) / <alpha-value>)',
// ink/flame/terminal retained for now — see H2 (delete-or-adopt)
```

### DTCG (W3C Design Tokens) — abridged

```json
{
  "$description": "Vlad's Playbook design tokens (dark-default)",
  "color": {
    "bg":      { "$type": "color", "$value": "#0E0F11" },
    "fg":      { "$type": "color", "$value": "#FAFAF7" },
    "muted":   { "$type": "color", "$value": "#AAA79A" },
    "line":    { "$type": "color", "$value": "#26251F" },
    "paper":   { "$type": "color", "$value": "#16171B" },
    "accent":  { "$type": "color", "$value": "#FF6B2C", "$description": "flame — human intent" },
    "accent2": { "$type": "color", "$value": "#22D3A0", "$description": "terminal — system state" }
  },
  "font": {
    "display": { "$type": "fontFamily", "$value": ["Source Serif 4", "Source Serif Pro", "Georgia", "serif"] },
    "sans":    { "$type": "fontFamily", "$value": ["Inter", "system-ui", "-apple-system", "sans-serif"] },
    "mono":    { "$type": "fontFamily", "$value": ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"] }
  },
  "fontSize": {
    "h1": { "$value": "clamp(2.5rem, 6vw, 4rem)" },
    "h2": { "$value": "clamp(1.75rem, 3vw, 2.25rem)" },
    "h3": { "$value": "clamp(1.25rem, 2vw, 1.5rem)" },
    "h4": { "$value": "1.125rem" },
    "body": { "$value": "17px" },
    "eyebrow": { "$value": "11px" }
  },
  "letterSpacing": { "heading": { "$value": "-0.015em" }, "eyebrow": { "$value": "0.18em" } },
  "radius": { "button": { "$value": "0.375rem" }, "card": { "$value": "0.75rem" }, "pill": { "$value": "9999px" } },
  "space":  { "micro": { "$value": "0.75rem" }, "component": { "$value": "1.5rem" }, "section": { "$value": "4rem" } },
  "duration": { "micro": { "$type": "duration", "$value": "150ms" }, "entrance": { "$type": "duration", "$value": "600ms" } },
  "easing": { "entrance": { "$type": "cubicBezier", "$value": [0.2, 0.7, 0.2, 1] } },
  "container": { "prose": { "$value": "760px" }, "wide": { "$value": "1152px" } }
}
```

---

## 4. Component primitives (CSS layer)

Defined in `global.css`. **Reuse these before reaching for raw Tailwind.** All states verified.

### Buttons

| Class | Recipe | State |
|-------|--------|-------|
| `.btn` | inverted: `bg --fg / color --bg`, `padding .625rem 1rem`, `radius .375rem`, `font-weight 500` | hover `--fg / 0.9` |
| `.btn-ghost` | `1px --line` outline, `color --fg`, transparent | hover bg `--line / 0.4` |
| `.btn-flame` | `bg --accent / color #fff` (the one accent CTA) | hover `--accent / 0.9` |

All: `inline-flex items-center gap-2`, 150ms `background-color`, flame `:focus-visible` ring.
> **Drift D-7:** `.btn-flame` hard-codes `color: white` — promote to `--on-accent`.

### Surfaces & labels

| Class | Recipe |
|-------|--------|
| `.card` | `bg --paper`, `1px --line`, `radius 0.75rem`, `padding 1.5rem`; **hover `border-color --accent / 0.6`**. The canonical surface. Composed everywhere as `card hover:border-flame`. |
| `.pill` | `inline-flex` chip, `bg --line / 0.7`, `1px --line`, `radius 9999px`, `text 0.75rem`, `padding .25rem .625rem`. **Reimplemented ad-hoc ~10× in widgets — consolidate (DRIFT-6).** |
| `.chapter-num` | display numeral, `font-display`, `clamp(4rem,8vw,6rem)`, `color --accent`, lining numerals |
| `.glossary-term` | inline help: `border-bottom: 1px dotted --accent/0.6`, `cursor: help`, hover `--accent` |
| `.anchor` | heading-autolink; `opacity 0` → `0.6` on heading hover, `1` + accent on its own hover |

### Read-state (terminal-green system affordance)

`.chapter-card` + `[data-read="true"]` (set by JS when scroll ≥ 85%): shows a `--accent-2`
`.read-check` badge (top-right, `box-shadow: 0 0 0 3px --bg`), border → `--accent-2 / 0.35`,
title dims to `--fg / 0.7`.

### Containers & a11y

`.container-prose` (760px) · `.container-wide` (1152px) · `.skip-link` (off-screen → fixed
flame chip on focus) · focus-visible ring (`2px --accent`, offset 2px / 1px on inputs).

### Component-scoped classes (live in `<style>` blocks — candidates to promote)

| Class(es) | Owner | What |
|-----------|-------|------|
| `.nl-input` / `.nl-btn` | `Footer.astro` | newsletter field + submit (radius `0.625rem`, focus ring `box-shadow 0 0 0 3px --accent/0.18`) |
| `.toc-link` | `SectionNav.astro` **+** `resources.astro` (dup — DRIFT-7) | section-rail link; active = `--accent-2` left-border |
| `.artifact-modal*` (9 classes) | `ArtifactEmbed.astro` | sandboxed-iframe lightbox: backdrop `rgb(0 0 0/.78)`, panel `min(1200px,95vw)×min(88vh,1000px)`, the one real shadow, `z 60` |
| `.manifesto-*` | `ManifestoQuote.astro` | gradient hairline rules (56px, accent fade), quote marks, `manifesto-rise` 0.9s |
| `.badge-pill` / `.badge-strike` / `.badge-go`, `.ch-tile`, `.sig-link`, `.reveal` | `launch.astro` | launch-page vocabulary |

---

## 5. Components (Astro)

Reusable presentational components in `src/components/`. Props verified from source.

### Content blocks (live in `.container-prose`)

| Component | Anatomy | Props |
|-----------|---------|-------|
| **Callout** | `aside.my-8` → `.rounded-lg.p-5`, `bg --paper`, **3px left border** colored by type; eyebrow `text-xs font-semibold uppercase tracking-wider` | `type: 'note'\|'warn'\|'tip'\|'watch'` (border = muted/accent/accent-2/accent), `title?` |
| **TLDR** | `.card.relative`, 3px left accent border, "TL;DR" accent eyebrow, `text-base` body | `text: string` |
| **PullQuote** | `border-l-2 pl-6` accent, `font-display text-2xl md:text-3xl`, optional muted attribution | `attribution?` |
| **ManifestoQuote** | centered `figure`, `max-w-3xl`, accent eyebrow `tracking-[0.32em]`, **gradient hairline rules**, blockquote `clamp(1.6rem,4.2vw,2.75rem)`, accent quote marks; `manifesto-rise` entrance | `quote`, `attribution`, `tag='The why'` |

### Chapter / reading components

| Component | Anatomy |
|-----------|---------|
| **ChapterHero** | `header.pt-16 md:pt-24`, `flex items-baseline gap-6`: `.chapter-num` + eyebrow `"Chapter N · M min read"` (`tracking-[0.2em]`) + part link (`text-[10px]` accent). `h1.mt-6.max-w-[20ch]`, subtitle `text-lg md:text-xl max-w-[42ch]` muted, optional `.pill` row. |
| **ChapterFooter** | prev/next `grid gap-4 sm:grid-cols-2` of `.card hover:border-flame`; eyebrows `text-xs tracking-wider` (prev=muted, next=accent); part-crossing tagline; feedback mailto line. |
| **ProgressBar** | `fixed top-14 h-0.5 z-30`, bar `bg --accent`, width = scroll %, `duration-100`. Persists `cc-progress` to localStorage (drives read-state). |
| **SectionNav** | `<details>` drawer (`<lg`) + sticky desktop rail (`.toc-link`, left-border, IO active = accent-2). Host: `lg:grid-cols-[240px_1fr] gap-10`, sections get `data-section-target` + `id`. |

### UI components

| Component | Anatomy |
|-----------|---------|
| **CourseCard** | `a.card hover:border-flame block h-full`; vendor eyebrow `text-[0.62rem] tracking-[0.18em]` accent + **Official** (accent-2 outline) / **Independent** (line outline) badge; title `font-display text-lg` + `↗`; chip row (`text-[0.62rem]` `--line/0.7` fills) + free/paid chip (accent-2/accent tint). |
| **ThemeToggle** | `button h-8 w-8 rounded border`, sun/moon inline SVG; toggles `data-theme` (handled by BaseLayout bootstrap). |
| **ArtifactEmbed** | `.rounded-lg.p-5` card (tag eyebrow, `font-display text-xl` title, mono meta, blurb) + two `.btn-ghost` (▶ Preview here / Open full ↗) → `.artifact-modal` sandboxed-iframe lightbox. |
| **VideoEmbed / GlossaryTooltip / CommandPaletteMount** | thin wrappers (lazy iframe, dotted-term tooltip, palette island mount). |

---

## 6. Layout shell

### BaseLayout (`src/layouts/BaseLayout.astro`)

`<html data-theme="dark">` → `<head>` (canonical, OG/Twitter cards, JSON-LD `Article`/`Book`/
`WebPage`, RSS + chapters.json alternates, Google Fonts preconnect, **inline theme-bootstrap
script** that survives Astro view-transitions, GA, gated PostHog) → `<body class="min-h-screen
flex flex-col">` → `.skip-link` → `<Nav>` → `<main id="main-content" class="flex-1"><slot/></main>`
→ `<Footer>` → Cmd-K keydown listener. Props: `title`, `description?`, `ogImage?`, `noNav?`.

### Nav (`src/components/Nav.astro`)

Sticky header: `sticky top-0 z-40 backdrop-blur border-b`, `bg --bg / 0.78`, `h-14`, inside
`.container-wide`.

- **Wordmark** "Vlad's Playbook" (`font-display text-lg`) + edition pill (`xl:` only).
- **Desktop tabs:** progressive — `lg` shows 5 (Start here, Learn, Journey, Questions, Setup),
  `xl` adds 2 (Resources, Tier list). Each: `whitespace-nowrap text-sm px-2.5 py-2 rounded
  hover:bg-white/5`. "Start here" = accent, "Learn" = accent-2, rest = `--fg/0.85`.
  ⚠ **Hard ~7-tab budget** capped by the 1152px container — new tabs must use `whitespace-nowrap`
  + a breakpoint, or they wrap.
- **Read-counter** (`font-mono`, accent-2 outline, hidden until ≥1 chapter read).
- **Cmd-K search button** (`min-w 140–200px`) + **ThemeToggle**.
- **Mobile (`<lg`):** hamburger → full-width drawer with grouped `mobileNav` (Start / Read /
  Reference / More), `grid-cols-2` link grid. **The drawer is the real phone on-ramp — the
  inline tabs are desktop-only.**

### Footer (`src/components/Footer.astro`)

Two bands: **(1)** newsletter capture (`mt-24` border-top, `container-wide grid
md:grid-cols-[2fr_3fr]`, accent "Stay close" eyebrow, `--paper` card with `.newsletter-form`).
**(2)** 4-column link footer (`md:grid-cols-[2fr_1fr_1fr_1fr]`): wordmark + blurb + "Built by
25+ agents" + reset-reading button · **Read** · **Use** · **Vlad** (external links). Column
headers = `text-xs uppercase tracking-wider` muted; lists `space-y-1.5 text-sm`.

---

## 7. Page patterns

Named, reusable page-level recipes (canonical versions from `index.astro` + the chapter template).
Use these recipes verbatim — they *are* the layout language.

### P1 · Hero
```
section.container-wide.pt-16.md:pt-24.pb-10
  eyebrow      → text-xs uppercase tracking-[0.25em]   (--accent)
  h1           → font-display font-medium leading-[0.95] text-[clamp(3rem,8vw,7rem)] tracking-tight
                 (one word/clause wrapped in --accent)
  superlabel   → text-sm uppercase tracking-[0.2em]    (--muted)
  lede         → max-w-[55ch] text-lg md:text-xl       (--fg / 0.85)
  byline       → text-sm (--muted)
  stat bar     → flex flex-wrap gap-x-3 text-sm font-mono (--muted),
                 accent numbers + "·" dividers at opacity .4
  CTA row      → mt-10 flex flex-wrap gap-3  (.btn-flame primary + .btn-ghost secondaries)
```

### P2 · Section header
```
flex items-baseline justify-between mb-8 flex-wrap gap-3
  h2  → font-display text-3xl md:text-4xl   ·   descriptor → text-sm (--muted)
```

### P3 · Chapter-card grid
```
ol.grid.gap-3.sm:grid-cols-2.lg:grid-cols-3  (list-none, p-0, m-0)
  li > a.chapter-card.card.hover:border-flame.relative  [data-chapter-slug]
       number → font-display text-2xl tabular-nums (--accent)
       title  → font-display text-lg
       subtitle → text-sm (--muted)
       .read-check badge (terminal-green, shown when read)
```

### P4 · Feature-tile grid
```
grid.gap-6.md:grid-cols-2.lg:grid-cols-4
  a.card.hover:border-flame
    eyebrow → text-xs uppercase tracking-wider  (--accent topic / --accent-2 "new")
    h3      → font-display text-2xl
    blurb   → text-sm (--muted)
```
Compact variant (the "shelf"): `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`, eyebrow
`text-[0.65rem] tracking-[0.18em]`, `h3 font-display text-lg`.

### P5 · Promo / "Now" banner
```
a.block.rounded-xl   border: 1px --accent/0.45
  background: linear-gradient(180deg, --accent/0.05, --paper)
  eyebrow "Now · {edition} · {date}" → tracking-[0.28em] (--accent)
  font-display text-2xl md:text-3xl headline  ·  "Read the launch →" accent affordance
```

### P6 · Two-column reading + sticky rail
```
lg:grid lg:grid-cols-[240px_1fr] lg:gap-10
  <SectionNav items={…}/>   +   content with [data-section-target] sections
```

### P7 · Chapter / article page (the reading template)
```
<ChapterHero/>  →  article.chapter-body.container-prose   (MDX prose, styled by global.css)
                →  <ChapterFooter/>  +  <ProgressBar/>
```

---

## 8. Interactive widgets

29 React islands (`src/widgets/`), hydrated `client:load`/`client:visible`. They are *built on*
the foundations (cards, `--paper` panels, accent/accent-2, mono read-outs, inline SVG, tabs/
sliders/toggles), but most predate the shared primitives and **reinvent pills, badges, and
accent hexes locally** — the single biggest source of code-level drift (DRIFT-3/4/6).

**Pattern families** (use these to build new widgets consistently):

| Family | Widgets | Shared treatment |
|--------|---------|------------------|
| **Leaderboard / table** | `LMArenaLeaderboard`, `OnyxLeaderboard` | `--paper` rows, accent rank, mono numbers, categorical purple chart palette |
| **Builder / picker** | `TierListBuilder`, `StackSelector`, `SkillComposer`, `ArchetypePicker`, `ModePicker`, `CronBuilder` | tab/segment controls, drag-drop, accent active state |
| **Calculator / sim** | `TokenBurnCalculator`, `PermissionSimulator`, `ThirtyDayPlan`, `DayZeroChecklist` | sliders/toggles, live mono read-out, accent result |
| **Diagram / graph** | `SwarmVisualizer`, `ConnectorMap`, `VaultGraphPreview`, `StagesFlow`, `HookEventTimeline`, `TempAgencyLoop` | inline SVG, `currentColor`/accent strokes, animated states |
| **Launch / hero FX** | `HeroIntro`, `LaunchTypewriter`, `LaunchCountUp`, `PostCreditScene` | typewriter, odometer, traffic-light status dots |
| **Reading aids** | `CommandPalette` (Cmd-K), `ResumeReading`, `GlossaryPopover`, `CopyBlock`, `SetupShowcase`, `QuestionsBoard`, `StarterSkillCard` | Radix dialog/popover/tabs, `.card` surfaces |

> **Standardization target:** give widgets the shared `.pill`, a `.eyebrow` class, and the
> semantic color utilities so they stop hard-coding `#FF6B2C`/`#22d3a0`/`#aaa79a` and ad-hoc
> rounded-full chips. Reserve raw hexes for SVG `fill`/canvas where a CSS var is genuinely
> awkward (and document that exception).

---

## 9. Accessibility

A11y is a **foundation, not a layer** — preserve all of it on anything new:

- **Focus:** `:focus-visible` flame ring (`2px --accent`, offset `2px`; inputs `1px`) on every
  button/link/input — in both themes.
- **Skip link:** off-screen `.skip-link` → fixed flame chip on focus → `#main-content`.
- **Reduced motion:** global `prefers-reduced-motion: reduce` block kills all 3 animations + the
  150ms transitions + smooth scroll. Every new animation needs a fallback.
- **Semantics:** `aside`/`figure`/`nav`/`details`/`dialog` used correctly; `aria-label`,
  `aria-expanded`, `aria-modal`, `aria-hidden` on interactive chrome; mobile menu wires Escape.
- **Print:** full `@media print` stylesheet (force light, hide chrome/iframes, avoid breaks).
- **Color:** `--fg` on `--bg` and `--accent`/`--accent-2` clear AA on the dark surface; verify any
  new tint passes contrast before shipping (esp. muted-on-paper).

---

## 10. Drift & standardization backlog

Parsed from the live code. The system is coherent at the *token* level but has drifted at the
*application* level. Prioritized — do HIGH first.

### Headline findings
1. **The numbered palette is ~95% dead.** `ink`/`flame`/`terminal` utilities (`bg-flame-400`, …)
   are used **0×**; only `border-flame` (43×) survives. All color flows through the 7 semantic
   vars via **999 inline `style=` attrs** — because no semantic color *utilities* exist.
2. **The eyebrow is the most-used undocumented atom** — ~108 instances across **9 sizes × 9
   tracking values**. No token, no class.
3. **Status colors are invented per-use** — `#FFAA00`/`#ef4444`/`#22c55e`/purple ramp, no tokens.

### HIGH — token-system integrity
- [x] **H1. ✅ Shipped** (`tailwind.config.ts`). Added semantic color utilities (`text-accent`,
  `bg-paper`, `border-line`, `text-muted`, `text-fg`, `bg-bg`, `text-accent-2`) wired to the vars —
  theme-aware + alpha-aware. Build-verified they generate as `rgb(var(--x) / <alpha>)`. **Next:**
  migrate the 999 inline `style=` attrs onto these utilities (the larger, page-touching follow-up).
- [ ] **H2.** Decide the fate of the `ink`/`flame`/`terminal` numbered scales — **delete** (keep
  only vars + `flame`/`terminal` DEFAULT) **or** adopt + migrate.
- [ ] **H3.** Create `.eyebrow` (+`.eyebrow--loud`) and collapse 108 ad-hoc labels to ≤2 sizes/trackings.
- [ ] **H4.** Add `--success/--warning/--error/--info` (+ a `--chart-*` purple ramp); replace raw hexes.
- [ ] **H5.** Replace hard-coded `#FF6B2C`/`#22d3a0`/`#aaa79a` in ~9 widgets with tokens (document the SVG-fill exception).

### MEDIUM
- [ ] **M1.** One card radius (`rounded-xl`); audit `rounded-md/lg/xl/2xl` card-like blocks.
- [ ] **M2.** Consolidate the pill — make the ~10 ad-hoc widget chips use `.pill`.
- [ ] **M3.** Collapse the 3 reading-width tokens to one (`760px`); drop dead `68ch` (`maxWidth.prose`).
- [ ] **M4.** Reconcile off-scale `--paper`(`#16171B`)/`--muted`(`#AAA79A`) dark with the `ink` ramp (add `ink.350/850` or document the exception).
- [ ] **M5.** Promote a documented `z-index` scale (header 40 / overlay 50 / modal 60 / skip 100).

### LOW
- [ ] **L1.** Remove the dead `darkMode` selector `[data-theme="dark"]` (no matching CSS block) or add the block.
- [ ] **L2.** De-dupe `.toc-link` (defined in both `SectionNav.astro` and `resources.astro`).
- [ ] **L3.** Replace literal `#fff`/`white` on-accent text with `--on-accent` (`.btn-flame`, `.nl-btn`, `.skip-link`).
- [ ] **L4.** Normalize the lone `duration-100` (progress bar) — or document a `fast` tier.
- [ ] **L5.** Remove the empty `typography: () => ({})` stub or configure `prose`.
- [ ] **L6.** Decide on `lucide-react` — delete the dead dependency, or adopt it with the 24/`currentColor`/stroke-2 conventions.
- [ ] **L7.** Drop hard-coded font stacks in `global.css` in favor of `theme('fontFamily.*')`; restore the `"Source Serif Pro"` fallback dropped by `.chapter-num`.

---

## 11. How to use & extend this system

**1 · Token-first, always.** Reach for the semantic var → named palette → raw utility, in that
order: `rgb(var(--accent))` › `flame.DEFAULT` › a raw color. Surfaces/text/borders from
`--bg/--fg/--muted/--line/--paper`; accents from `--accent` (flame, human) and `--accent-2`
(terminal, system). The only sanctioned raw colors are the documented escape hatches
(`#fff` in `.btn-flame`/`.nl-btn`/`.skip-link`, and the `@media print` block).

**2 · Reuse primitives before raw Tailwind.** Compose `.btn*`, `.card`, `.pill`,
`.container-prose`/`.container-wide`, `.chapter-body`, `.chapter-num`, `.glossary-term`, the
read-state classes, and `animate-*`. Remember: **Tailwind Preflight is off** and
`@tailwindcss/typography` is a stub — base element + prose styling lives in `global.css`, not in
Tailwind defaults or `prose-*`.

**3 · Match the page patterns.** New pages should assemble [§7](#7-page-patterns)'s named recipes
(hero, section header, tile grids, promo banner, sticky-rail) rather than inventing layout.

**4 · When adding a new pattern** — extend the *token layer*, not raw values:
- New color → a `--var` (keep flame = intent, terminal = state). Don't paste a hex.
- New measure/spacing → reuse an existing step; **don't** add a 4th reading width.
- New motion → only if the 3 animations can't express it, always with a reduced-motion fallback.
- New interactive element → ships with a `:focus-visible` ring by default.

> Every drift in [§10](#10-drift--standardization-backlog) came from *not* doing the above —
> prefer extending one token over forking a value, and mirror an existing primitive rather than
> inventing a one-off.

---

### Provenance

Reverse-engineered from the live source on 2026-06-09 by parsing `tailwind.config.ts`,
`src/styles/global.css`, `astro.config.mjs`, all 17 `src/components/*.astro`, the `src/widgets/`
React islands, `src/layouts/BaseLayout.astro`, and the page set in `src/pages/` — cross-checked
with frequency-ranked `grep` sweeps over `src` (spacing, radius, shadow, grid, breakpoints,
tracking, arbitrary values, hex literals, icon usage). Working extracts: `notes/.ds-extract/`
(gitignored — local provenance). This is documentation of the *existing* system; the only code
change made alongside it is the additive, var-backed token config for H1 (above) — **no authored
content was touched.**
