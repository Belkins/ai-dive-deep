# Edition 2 — Four New Widget Specs

Ranked by leverage. Each has placement, learning objective, UI sketch, props,
edge cases, fallback. Build-ready.

---

## Widget 1 — TokenBurnCalculator

**Chapter placement:** Ch 02 (Five Tools, Not Fifty), after "The Token Math, in English"

**Learning objective:** After using this widget, the reader can defend a 1B+
tokens/month spend to their CFO with real per-employee equivalence math.

### UI sketch

```
┌──────────────────────────────────────────────────────────┐
│  Token burn calculator                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Daily input tokens   ──◯──────────  120M               │
│  Daily output tokens  ───◯─────────   30M               │
│  Cache hit rate       ────────◯────   78%               │
│                                                          │
│  Model mix:                                              │
│  Sonnet 80% │ Opus 15% │ Haiku 5%                       │
│  ──────────────────────────────────                     │
│                                                          │
│  Monthly spend       $4,287                              │
│  Annual spend        $51,440                             │
│  Senior eng equiv    0.43 (≈$120K/yr fully loaded)      │
│  Tokens/$            ~6.7M                               │
│                                                          │
│  [Copy as Slack canvas]   [Compare with prompt cache off]│
└──────────────────────────────────────────────────────────┘
```

### Props
```ts
type Props = {
  defaultDailyInputTokens?: number;   // default 100M
  defaultDailyOutputTokens?: number;  // default 25M
  defaultCacheHitRate?: number;       // 0–1, default 0.7
  modelPrices?: { input: number; output: number; cached: number }; // override
};
```

### Edge cases
- 0 tokens → show "you haven't unlocked the swarm yet" (Vlad-voice line)
- >10B/mo → render "operator-grade" badge
- Compare-with-cache-off mode: stays toggleable; shows the 90% saving line

### Fallback
Server-rendered HTML showing default values. JS hydration adds interactivity.
Reduced-motion: no slider animation, just inputs.

### File path
`src/widgets/TokenBurnCalculator.tsx`

---

## Widget 2 — TempAgencyLoop

**Chapter placement:** Ch 03 (AI Is A Temp Agency), as the chapter hero animation

**Learning objective:** After watching this loop, the reader internalizes
"instances are born, do work, die — there is no continuity in the model" — the
load-bearing concept of the entire book.

### UI sketch

```
A horizontal time strip. Above the strip, three "shifts" labeled 7am, 7pm, next
7am. At each shift:
- A small pixel-style "temp" walks in from the left
- Reads a "handbook" sprite (CLAUDE.md / vault files)
- Does a job (animated icon — Slack canvas, deal alert, Gong summary)
- Walks off-stage right and dissolves
- Output artifact persists in a "files" tray below the strip

Click any past shift → the temp re-runs but reads the same handbook +
artifacts from the previous shift's tray. Demonstrates: "continuity is a chain
of artifacts, not a chain of brains."
```

### Props
```ts
type Props = {
  shifts?: { time: string; job: string; artifact: string }[];  // default = 3 shifts
  speed?: number;  // 1 = realtime feel, 0.5 = slower for first read
  autoplay?: boolean;
};
```

### Edge cases
- Reduced-motion → show the strip statically with caption: "Each shift is a new
  instance. The artifacts persist. The instances don't."
- Mobile → stack shifts vertically, not horizontally

### Fallback
Static SVG with three static panels showing the same idea. JS layer adds the loop.

### File path
`src/widgets/TempAgencyLoop.tsx`

---

## Widget 3 — VaultGraphPreview

**Chapter placement:** Ch 04 (The Vault), after "The neuron logic" section

**Learning objective:** After interacting, the reader sees how a vault graph is
not a filing cabinet but a network — clicking one node activates the cluster.

### UI sketch

```
A force-directed graph (small, ~25 nodes). Pre-loaded with a stub vault:
- Mentee A (people note)
- Mentee A — Session 1 through Session 12 (12 daily notes)
- Mentee A — Action Tracker
- Mentee A — Patterns
- Belkins (company)
- Folderly (company)
- Newsletter (project)
- 2026-04-12 (daily note)
- ... etc

Click a node:
- Highlight all connected nodes
- Render the file's contents in a side panel (markdown rendered)
- Show the "neuron firing" animation — pulse rings out from the clicked node

Hover any node → tooltip with backlinks count + last-modified date.
```

### Props
```ts
type Props = {
  graph?: { nodes: Node[]; edges: Edge[] };  // default = stub vault
  highlightNode?: string;  // for permalinks
};
```

### Edge cases
- Mobile → graph collapses to a list view with click-to-expand
- Reduced-motion → no force-directed simulation; show pre-laid graph
- Disabled JS → render a static SVG of the layout

### Fallback
Static SVG. Same nodes, no interactivity. Caption: "A vault graph in motion.
The center is dense. The edges are bridges. Files that get touched, get loaded."

### File path
`src/widgets/VaultGraphPreview.tsx`

### Library
Use `force-graph` or `d3-force` (both small). Don't add `cytoscape` — too heavy.

---

## Widget 4 — HookEventTimeline

**Chapter placement:** Ch 16 (Hooks and Subagents), after "What hooks actually are"

**Learning objective:** After interacting, the reader sees exactly when each hook
fires and can build a mental model for "policy lives in the hook, not in the prompt."

### UI sketch

```
A horizontal timeline of a single agent turn. Tap "Run turn" to animate:

  SessionStart
       │
       ├──→ inject context (cat sprint-priorities.md to stdout)
       │
   UserPromptSubmit
       │
       ├──→ "fix the auth bug" (user types)
       │
   PreToolUse(Edit)
       │      ├──→ ❌ deny if file matches .env*
       │      └──→ ✅ allow
       │
   tool runs: Edit src/auth.ts
       │
   PostToolUse(Edit)
       │      └──→ prettier --write $CLAUDE_FILE_PATH
       │
   PreToolUse(Bash)
       │      └──→ deny if "git push origin main"
       │
   ... continues ...
       │
   Stop
       │      └──→ Slack DM: turn finished, $0.18 spent

Below the timeline: a "policy panel" with toggleable hooks. Toggle one off →
re-run the animation, see the difference. Toggle all PostToolUse hooks off →
animation runs without prettier; show the failure mode.
```

### Props
```ts
type Props = {
  turn?: TurnSpec;  // default = the auth-bug turn above
  hooks?: HookSpec[];  // toggleable list
};
```

### Edge cases
- Reduced-motion → render the full timeline statically with arrows; no animation
- Mobile → vertical stack timeline (CSS grid)
- Power user → "Custom turn" button → paste your own JSON spec, see your own hooks

### Fallback
Static SVG/HTML showing the full timeline with all hooks fired. Reading is the
fallback. The interaction is gravy.

### File path
`src/widgets/HookEventTimeline.tsx`

---

## Build sequence (if Vlad approves)

If we ship 1 widget per Saturday:

- Wk 1: TokenBurnCalculator (highest reader impact, simplest to build)
- Wk 2: HookEventTimeline (clarifies the chapter that confuses readers most)
- Wk 3: TempAgencyLoop (reinforces the load-bearing concept)
- Wk 4: VaultGraphPreview (the most "wow" widget, but heaviest dep)

Total: 4 weeks, +4 widgets, no new chapters. Edition 2 ships at chapter 30 with
12 total widgets.

## Anti-patterns to avoid

- Don't build a "swarm cost calculator" — TokenBurnCalculator covers it.
- Don't build a "MCP server picker" — ConnectorMap already does it.
- Don't build a "session forking visualizer" — too niche, not enough payoff.
- Don't build a "model picker" — StackSelector already covers model + surface.
