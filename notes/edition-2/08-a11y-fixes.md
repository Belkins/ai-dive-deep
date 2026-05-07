# Edition 2 — A11y + Mobile + Quick-Win Patches

Commit-ready diffs. Apply in order. Each one ≤30 minutes.

---

## Patch 1: Fix `--paper` contrast in dark mode

**File:** `src/styles/global.css`
**Line:** ~10 (the `:root` block)
**Why:** `--paper` and `--bg` are both `14 15 17` in dark mode → cards and code
blocks have no visible boundary. UX agent flagged as the worst contrast problem.

```diff
   :root {
     --bg: 14 15 17;
     --fg: 250 250 247;
     --muted: 140 137 124;
     --line: 38 37 31;
     --accent: 255 107 44;
     --accent-2: 34 211 160;
-    --paper: 14 15 17;
+    --paper: 22 23 27;
   }
```

---

## Patch 2: Focus rings on interactive elements

**File:** `src/styles/global.css`
**Why:** Keyboard navigation is currently invisible. WCAG 2.4.7 violation.

Append after the `.btn-flame:hover` block:

```css
.btn:focus-visible,
.btn-ghost:focus-visible,
.btn-flame:focus-visible,
button:focus-visible,
a:focus-visible {
  outline: 2px solid rgb(var(--accent));
  outline-offset: 2px;
  border-radius: 4px;
}

input:focus-visible,
textarea:focus-visible {
  outline: 2px solid rgb(var(--accent));
  outline-offset: 1px;
}
```

---

## Patch 3: Skip-to-content link

**File:** `src/layouts/BaseLayout.astro`
**Why:** Screen-reader and keyboard users currently must tab through the entire
nav before reaching content. WCAG 2.4.1 violation.

Inside `<body>`, before `<Nav />`:

```diff
   <body class="min-h-screen flex flex-col">
+    <a
+      href="#main-content"
+      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:rounded-md"
+      style="background: rgb(var(--accent)); color: white;"
+    >Skip to main content</a>
     {!noNav && <Nav />}
-    <main class="flex-1">
+    <main id="main-content" class="flex-1">
       <slot />
     </main>
```

Add to `src/styles/global.css`:

```css
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.focus\:not-sr-only:focus { position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal; }
```

(Tailwind's `sr-only` utility may already cover this — verify by inspecting the
built CSS. If yes, drop the manual classes.)

---

## Patch 4: Body font size on screens ≥640px

**File:** `src/styles/global.css`
**Why:** Default 16px gets tight on long reads. 17px on desktop is the
Substack/Medium sweet spot.

Append after the `body` block:

```css
@media (min-width: 640px) {
  body { font-size: 17px; }
}
```

---

## Patch 5: Tighten chapter prose width

**File:** `src/styles/global.css`
**Line:** the `.container-prose` block
**Why:** 760px on a 1440px display is fine for headers but the body line length
exceeds 78ch. 680px holds reading comfort better.

```diff
 .container-prose {
   margin-left: auto; margin-right: auto;
   padding-left: 1.5rem; padding-right: 1.5rem;
-  max-width: 760px;
+  max-width: 680px;
 }
```

(If the hero/landing widths feel cramped after this, add a `.container-hero`
class with the old 760px and apply only on the landing.)

---

## Patch 6: Bigger nav tap targets

**File:** `src/components/Nav.astro`
**Why:** Current `text-sm px-3 py-1.5` ≈ 32px tall, below the 44px iOS guideline.

```diff
-      <a href={`${base}/chapters/01-killed-my-tabs`} class="hidden sm:inline-flex text-sm px-3 py-1.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Chapters</a>
-      <a href={`${base}/glossary`} class="hidden sm:inline-flex text-sm px-3 py-1.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Glossary</a>
-      <a href={`${base}/resources`} class="hidden sm:inline-flex text-sm px-3 py-1.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Resources</a>
-      <a href={`${base}/tier-list`} class="hidden md:inline-flex text-sm px-3 py-1.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Tier list</a>
+      <a href={`${base}/chapters/01-killed-my-tabs`} class="hidden sm:inline-flex text-sm px-3 py-2.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Chapters</a>
+      <a href={`${base}/glossary`} class="hidden sm:inline-flex text-sm px-3 py-2.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Glossary</a>
+      <a href={`${base}/resources`} class="hidden sm:inline-flex text-sm px-3 py-2.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Resources</a>
+      <a href={`${base}/tier-list`} class="hidden md:inline-flex text-sm px-3 py-2.5 rounded hover:bg-white/5 transition" style="color: rgb(var(--fg) / 0.85)">Tier list</a>
```

Same change for the Cmd-K button: `py-1.5` → `py-2.5`.

---

## Patch 7: Above-fold proof strip on landing

**File:** `src/pages/index.astro`
**Line:** after the subtitle paragraph in the hero section
**Why:** Operators want receipts in the first 800px. Current hero has none.

```diff
     <p class="mt-3 text-sm" style="color: rgb(var(--muted))">by Vlad Podoliako · Edition 1 · May 2026</p>

+    <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-mono" style="color: rgb(var(--muted))">
+      <span><span style="color: rgb(var(--accent))">3-10B</span> tokens / mo</span>
+      <span style="opacity: 0.4">·</span>
+      <span><span style="color: rgb(var(--accent))">5</span> companies</span>
+      <span style="opacity: 0.4">·</span>
+      <span><span style="color: rgb(var(--accent))">24</span> chapters</span>
+      <span style="opacity: 0.4">·</span>
+      <span><span style="color: rgb(var(--accent))">8</span> widgets</span>
+      <span style="opacity: 0.4">·</span>
+      <span><span style="color: rgb(var(--accent))">$0</span> to read</span>
+    </div>
+
     <div class="mt-10 flex flex-wrap gap-3">
```

---

## Patch 8: Reading-time pill above the chapter title

**File:** `src/components/ChapterHero.astro`
**Why:** Skim-first readers want the time estimate before they commit. Currently
it's below the title and subtitle, which means they've already scrolled past it.

```diff
 <header class="container-prose pt-16 md:pt-24 pb-10">
-  <div class="flex items-baseline gap-6">
-    <div class="chapter-num">{padded}</div>
-    <div class="text-xs uppercase tracking-[0.2em]" style="color: rgb(var(--muted))">Chapter {number}</div>
-  </div>
-  <h1 class="mt-6 max-w-[20ch]">{title}</h1>
-  <p class="mt-3 text-lg md:text-xl max-w-[42ch]" style="color: rgb(var(--muted))">{subtitle}</p>
-  <div class="mt-6 flex flex-wrap gap-2 items-center">
-    <span class="pill">{readingMinutes} min read</span>
-    {keyConcepts.map((c) => <span class="pill">{c}</span>)}
-  </div>
+  <div class="flex items-baseline gap-6">
+    <div class="chapter-num">{padded}</div>
+    <div class="text-xs uppercase tracking-[0.2em]" style="color: rgb(var(--muted))">Chapter {number} · {readingMinutes} min read</div>
+  </div>
+  <h1 class="mt-6 max-w-[20ch]">{title}</h1>
+  <p class="mt-3 text-lg md:text-xl max-w-[42ch]" style="color: rgb(var(--muted))">{subtitle}</p>
+  <div class="mt-6 flex flex-wrap gap-2 items-center">
+    {keyConcepts.map((c) => <span class="pill">{c}</span>)}
+  </div>
 </header>
```

---

## Patch 9: Anchor links on every H2/H3

**File:** `astro.config.mjs`
**Why:** Readers who want to share a passage need anchor URLs. Currently none.

```diff
+import rehypeSlug from 'rehype-slug';
+import rehypeAutolinkHeadings from 'rehype-autolink-headings';
+
 export default defineConfig({
   ...
   markdown: {
+    rehypePlugins: [
+      rehypeSlug,
+      [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: ['anchor'], 'aria-label': 'permalink' }, content: { type: 'text', value: '#' } }],
+    ],
     shikiConfig: { ... },
   },
 });
```

Install: `npm i -D rehype-slug rehype-autolink-headings`

CSS for the anchor (in `global.css`):
```css
.anchor { opacity: 0; margin-left: 0.5rem; color: rgb(var(--muted)); text-decoration: none; transition: opacity 150ms; }
h2:hover .anchor, h3:hover .anchor, h4:hover .anchor { opacity: 1; }
```

---

## Patch 10: Glossary popovers (don't navigate away)

**File:** `src/components/GlossaryTooltip.astro`
**Why:** Currently clicking a glossary term navigates away mid-chapter. UX
agent flagged as worst reading-flow break.

The fix is to convert this from a navigation link to a Radix Popover (the dep
is already installed: `@radix-ui/react-popover`).

Create a new React island:
**File (new):** `src/widgets/GlossaryPopover.tsx`

```tsx
import * as Popover from '@radix-ui/react-popover';
import { glossary } from '@/lib/glossary';

export default function GlossaryPopover({ term, children }: { term: string; children: React.ReactNode }) {
  const entry = glossary[term];
  if (!entry) return <span>{children}</span>;
  const base = (import.meta as any).env?.BASE_URL?.replace(/\/$/, '') || '';
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="glossary-term">{children}</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded-md p-3 shadow-xl max-w-xs text-sm"
          style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))', zIndex: 50 }}
          sideOffset={6}
        >
          <div className="font-medium mb-1" style={{ color: 'rgb(var(--accent))' }}>{entry.term}</div>
          <div style={{ color: 'rgb(var(--fg) / 0.9)' }}>{entry.definition}</div>
          <a href={`${base}/glossary#${encodeURIComponent(term)}`} className="block mt-2 text-xs underline" style={{ color: 'rgb(var(--muted))' }}>Open glossary →</a>
          <Popover.Arrow style={{ fill: 'rgb(var(--paper))' }} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
```

Update `src/components/GlossaryTooltip.astro` to mount the React island:

```astro
---
import GlossaryPopover from '@/widgets/GlossaryPopover.tsx';
interface Props { term: string; }
const { term } = Astro.props;
---
<GlossaryPopover term={term} client:visible>
  <slot />
</GlossaryPopover>
```

---

## Patch 11: Reduced-motion respect inside SwarmVisualizer

**File:** `src/widgets/SwarmVisualizer.tsx`
**Why:** SVG `<animate>` bypasses CSS `prefers-reduced-motion` rules. Need
JS guard.

In the render section, replace the working-state pulse animation:

```diff
+const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
+
 ...
-        {state === 'working' && (
+        {state === 'working' && !reduceMotion && (
           <circle cx={p.x} cy={p.y} r={22} ...>
             <animate ... />
           </circle>
         )}
```

---

## Patch 12: Print stylesheet for chapter pages

**File:** `src/styles/global.css`
**Why:** Some readers want the cheat sheet AND the long chapters on paper.

Append to the existing `@media print` block:

```css
@media print {
  .chapter-num { font-size: 3rem !important; }
  header.container-prose, article.chapter-body { max-width: none; padding: 0; }
  iframe, .no-print, video, .progress-bar { display: none !important; }
  pre, blockquote, .card { break-inside: avoid; }
  h1, h2, h3 { break-after: avoid; }
}
```

---

## Apply order (commit per patch)

1, 2, 3, 4 (a11y baseline) → ship same day
5, 6, 7, 8 (UX wins) → ship same day
9, 10 (the heavy lifts — glossary popover + anchors) → ship as a separate PR
11, 12 (polish) → ship with the next round

Total: ~3 hours of wall-clock work, ~80% of the user-facing improvement called
out by the wave-1 audits.
