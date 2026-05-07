# Edition 2 — Reader UX Audit

Reading the live artifact at https://belkins.github.io/ai-dive-deep/ from the
seat of someone who landed from a tweet and has 6 minutes before their next call.

---

## Part A — First-3-second test

What lands at the top of the landing page right now: tagline, "ULTIMATE AI DIVE DEEP",
subtitle, three buttons, the Before/After hero animation, then the chapter grid.

**What's missing in the first 800px:**

1. **No proof above the fold.** The book's whole pitch is "operator with receipts" —
   3-10B tokens/month, 5 portfolio companies, 10K+ newsletter subs. None of those
   numbers appear in the first scroll. Add a single-line strip below the subtitle:
   `3-10B tokens/mo · 5 companies · 24 chapters · $0 to read` — separators in muted,
   numbers in flame.
2. **No reader path hint.** Three CTAs ("Start at chapter 1", "30-day plan", "Tier list")
   are all equal weight. New readers don't know which to pick. Make "Start at chapter 1"
   the primary; the others are secondary "if you've got 6 minutes" links.
3. **The hero is a clever animation but doesn't say what the book is.** Add a single
   sentence above the Before/After: "Same operator, two Tuesdays. Eighteen months apart."
   That gives the animation context.

**File:** `src/pages/index.astro` lines ~10–30.

---

## Part B — Reading flow friction (12 specific points)

Read Ch 1 → Ch 2 → halfway into Ch 6. What broke:

1. **No "where am I" indicator inside the chapter.** Top progress bar is fine but
   doesn't tell me how many sections remain. Add: "Section 3 of 8" pill in the top
   nav of chapter pages, or a sticky TOC sidebar on desktop.
   *Fix in:* `src/pages/chapters/[slug].astro` + `src/components/ProgressBar.astro`.
2. **TL;DR is great but no "skip to" or "this is the whole story" badge.** A reader
   who clicked from a tweet wants to skim. Add an "or jump to the punchline" link
   inside the TL;DR card that scrolls to the closer.
3. **Glossary terms have a dotted underline but no popover.** Currently they navigate
   away to `/glossary#term`. That breaks reading. Add a Radix popover on hover/focus
   that shows the definition inline; click for full page.
   *Fix in:* `src/components/GlossaryTooltip.astro` (currently just routes; needs JS popover).
4. **No bookmarks.** Reading 20 minutes in, want to mark a paragraph and return tomorrow.
   Add: section-level anchors visible on hover (the GitHub-style `#` icon next to H2/H3),
   plus a "save to my reading list" star (localStorage) per chapter.
5. **Code blocks have no copy button by default.** The `CopyBlock.tsx` widget has one,
   but the MDX-rendered `<pre>` blocks don't. Add a global copy button overlay.
   *Fix in:* a small client island that selects all `pre code` and decorates them.
6. **No "share this passage" affordance.** Highlight text → quote-share to Twitter/LinkedIn
   is the muscle Stripe Press built. Implement with a small selection-toolbar island.
7. **Cmd-K is great but invisible.** The `⌘K` chip in the nav is faint. Make it more
   prominent or show a one-time onboarding tooltip on first visit.
8. **The chapter "Watch alongside" video block sits at the bottom.** Some readers
   want to watch first. Move it next to the TL;DR as a compact "▶ 7 min companion"
   chip; full embed remains at the bottom.
9. **Footer is generic.** No "next up" recommendation. After ch 6, the footer should
   say "Most readers go to ch 11 next — How to Build a Skill" with a strong CTA.
10. **No print stylesheet for chapter pages.** Cheat sheet has it. Chapters don't.
    A reader who wants a paper copy is stuck. Add `@media print` rules to chapter pages.
    *Fix in:* `src/styles/global.css`.
11. **No reading mode.** Toggling to a serif-only, max-65ch, no-nav view would be
    appreciated for long chapters (17, 19, 23).
12. **Cross-references like "see Chapter 11" should preview on hover.** Right now
    they're just blue links. Add a hover card with the target chapter's TL;DR.

---

## Part C — Mobile / a11y / typography

Reading from `src/styles/global.css` and components:

1. **Body text on mobile.** `clamp(2.5rem, 6vw, 4rem)` for h1 is fine, but `p` has
   no clamp. Default Tailwind/browser size is 16px which is acceptable but tight.
   Set `body { font-size: 17px; }` on screens ≥640px for better long-read comfort.
2. **Line length on desktop.** `container-prose { max-width: 760px }` is fine for
   reading but the body text gets close to 80ch on wide displays. Tighten to `680px`
   for chapter body. The 760 stays for hero/tldr.
3. **Tap targets.** Nav links are `text-sm px-3 py-1.5` — that's roughly 32px tall.
   Below the 44px iOS/Android guideline. Bump to `py-2` or wrap in larger hit boxes.
   *Fix in:* `src/components/Nav.astro`.
4. **Focus rings missing on custom buttons.** All the `.btn-flame`, `.btn-ghost`, etc.
   need `:focus-visible { outline: 2px solid rgb(var(--accent)); outline-offset: 2px; }`.
   Keyboard navigation is broken without this.
   *Fix in:* `src/styles/global.css`.
5. **Color contrast.** `--muted: 140 137 124` on `--bg: 14 15 17` is roughly 5.2:1 —
   passes AA for body text but fails AAA. For tiny text in pills/captions, bump muted
   to `170 167 154` (≈7.1:1).
6. **Code blocks horizontal-scrolling on mobile.** The `pre` has `overflow-x: auto`
   which is right, but the shadow/edge gradient hint that more content exists is
   missing. Add a subtle right-edge fade.
7. **Reduced-motion.** The `@media (prefers-reduced-motion: reduce)` rule exists but
   the SwarmVisualizer's `<animate>` SVG elements bypass it. Add `if (prefers-reduced-motion)`
   guards inside the React widget.
   *Fix in:* `src/widgets/SwarmVisualizer.tsx`.
8. **Dark/light theme bug:** the `--paper` token is currently `--bg` in dark mode
   (both 14 15 17). That means cards and code blocks have no visible background.
   Set dark `--paper` to `26 25 31` for contrast.
   *Fix in:* `src/styles/global.css` `:root` block.
9. **Screen-reader landmarks.** No `<main>` (well, there is in BaseLayout) but no
   `aria-label="Chapter navigation"` on the prev/next, no `<nav role="navigation">`.
   Add basic landmarks.
10. **Skip-to-content link.** Missing. Add a hidden-until-focus `Skip to main content`
    at the top of `BaseLayout.astro`.

---

## Part D — Stealable patterns from the references

**Stripe Press**: section-margin handles. Hover any heading, see a `#` anchor and a
"share this section" affordance. Steal exactly.

**Linear docs**: Cmd-K palette has live previews of pages on the right pane as you
arrow-key through. Our palette only shows titles. Add inline preview on focus.

**Every (every.to)**: paragraph-level highlight + comment overlay. Too much for us,
but the "selection toolbar" UX (highlight → small floating button bar with quote-tweet)
is the muscle. Steal that.

**Substack**: the "estimated 8 min read" is in the meta but they put it ABOVE the
title, not below. Try moving readingMinutes pill above the chapter title for
skim-first behavior.

**WaitButWhy**: the inline footnote popovers (click a number, dialog opens). Better
than our "navigate away" glossary pattern. Steal.

---

## Part E — 10 quick wins (≤30 min each)

Ranked by impact-per-minute:

1. **Glossary popover (not navigate-away)** — `src/components/GlossaryTooltip.astro` →
   wrap in Radix `Popover` from the existing dep. ~20 min. Eliminates the worst
   reading-flow break.
2. **Fix `--paper` contrast in dark mode.** One-line CSS change.
   `src/styles/global.css`. ~2 min. Cards become visible.
3. **Add focus rings to all buttons.** ~10 min. a11y fix.
4. **Skip-to-content link.** ~5 min. a11y baseline.
5. **Above-fold proof strip on landing.** "3-10B tokens/mo · 5 companies · 24 chapters · $0".
   ~15 min. `src/pages/index.astro`.
6. **Replace flat TL;DRs with the voice-fidelity replacements** (see `02-voice-fidelity.md`).
   24 frontmatter edits, ~30 min total. The biggest voice win in the book.
7. **Print stylesheet for chapter pages.** ~15 min. `src/styles/global.css`.
8. **Anchor on every H2/H3.** Astro's `rehype-autolink-headings` plugin. ~10 min config.
9. **Reading-time pill above the title (not below).** ~5 min. `src/components/ChapterHero.astro`.
10. **Footer "next up" recommendation per chapter.** Use `getNeighbors` already in `src/lib/chapters.ts`.
    Already partially exists in `ChapterFooter.astro`; just sharpen the language. ~10 min.

Total ≤2.5 hours of wall-clock work, ~80% of the user-facing improvement.
