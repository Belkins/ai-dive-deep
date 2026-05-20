// Edition timeline. Update when shipping a new edition.

export type ChangelogEntry = {
  edition: string;
  date: string;        // ISO yyyy-mm-dd
  tagline: string;
  shipped: string[];
  receipts?: { label: string; value: string }[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    edition: 'Edition 7',
    date: '2026-05-20',
    tagline: 'The book is open. The source is the recipe.',
    shipped: [
      'Repo flipped to public after a full git-filter-repo history scrub — 71 commits rewritten, 0 leaks across blobs and commit messages from an independent fresh-clone verification, backup ref preserved server-side',
      'New /launch page — the launch artifact IS the demo: typewriter hero, animated stat odometer (chapters/widgets/glossary/embeds/editions/stars), the 3 live embedded case studies, all 39 chapters as a click-anywhere mosaic, what-it-took timeline, post-credit AFC tease',
      'Homepage "Now" banner above the tile grid promoting the launch through launch week',
      'README rewrite to current reality (Edition 6/7, real counts, dive.vladyslavpodoliako.com as primary CTA), repo metadata (description, homepage, 12 topics, Discussions on), custom 1280x640 GitHub social-preview image',
      'SECURITY.md + CONTRIBUTING.md refreshed for the public posture; private-vulnerability-reporting path documented',
      'Ch 02 contradiction fixed (the Fathom-in-the-don\'t-use-bin error caught externally) — reframed as "picked Fathom, killed the rest" with the discipline of one transcript surface',
    ],
    receipts: [
      { label: 'Repo state', value: 'PUBLIC · github.com/Belkins/ai-dive-deep' },
      { label: 'History leaks (post-scrub, fresh-clone verified)', value: '0 / 71 commits' },
      { label: 'New page', value: '/launch' },
      { label: 'Edition 1 → public', value: '13 days, 7 editions' },
    ],
  },
  {
    edition: 'Edition 6',
    date: '2026-05-19',
    tagline: 'The method, embedded. Click the artifacts.',
    shipped: [
      'New /html-first page — the htmlization thesis (every deliverable ships as a live interactive artifact, not a dead file) with two REAL artifacts embedded and clickable',
      'AFC case: the dinner-table idea whose investment deck + robot-stable annex got spun up as interactive HTML before the next meeting — Vlad\'s own venture, embedded as-is',
      'Folderly case: a real ~90-domain / ~5K-mailbox external deliverability audit, swarm-produced on the Folderly methodology — fully de-identified (client, all 90 domains, SPF/infra fingerprints, WHOIS name) and embedded as a sanitized sample',
      'New ArtifactEmbed.astro — sandboxed, lazy, render-on-click iframe modal (no src until opened; referrerpolicy=no-referrer)',
      'Ch 19 callout + glossary "Htmlization" + Cmd-K (page + 4 section anchors) wired',
    ],
    receipts: [
      { label: 'Live artifacts embedded', value: '3 (AFC ×2, audit ×1)' },
      { label: 'Folderly identifiers redacted', value: '90 domains + name + 2 SPF + WHOIS → 0 residual' },
      { label: 'New page / component', value: '/html-first + ArtifactEmbed' },
      { label: 'External calls in embeds', value: '0 (fully self-contained)' },
    ],
  },
  {
    edition: 'Edition 5',
    date: '2026-05-19',
    tagline: 'The bench moved. The reports stopped being files.',
    shipped: [
      'Gemini 3.5 Flash + Claude-for-the-legal-industry logged as dated research notes — signal-vs-receipt discipline, not a leaderboard edit',
      'Ch 35: corrected the stale "Gemini 3 Pro" reference + added the Flash-beats-last-gen-Pro signal, scoped as a Ch 29 cost question rather than a re-tiering',
      'Ch 29: new section — "The price of a model is not the price of a task" + a cost-per-task test loop you run on your own traffic',
      'Ch 24: May-2026 addendum extended; the live LMArena widget stays the source of truth — no slide-driven tier edits',
      'New thesis across Ch 19 / Ch 26 / About — every report ships as a living link on a private repo, not a dead file; unsanctioned copying as the truest adoption metric',
    ],
    receipts: [
      { label: 'Research notes added', value: '2' },
      { label: 'Chapters touched', value: '19, 24, 26, 29, 35' },
      { label: 'Live bench edits', value: '0 (signal, not receipt)' },
      { label: 'New components', value: '0' },
    ],
  },
  {
    edition: 'Edition 4',
    date: '2026-05-11',
    tagline: 'Retitled for navigation. Voice survived.',
    shipped: [
      'All 36 chapter titles rewritten — topical-primary, with question form on 9 chapters where intent shape beats subject shape',
      'Old hype titles preserved as subtitles ("The Day I Killed My Tabs" now sits below "AI as an Operating System")',
      'Cmd-K resolves "cron" → Scheduled Tasks, "browser" → Browser Agents with Playwright, "permissions" → When to Skip Permissions',
      'scripts/apply-titles.py — atomic re-runnable rewrite of all 36 frontmatters + chapters.ts. Re-run any time the map changes.',
    ],
    receipts: [
      { label: 'Chapters retitled', value: '36' },
      { label: 'Time to scan TOC', value: '~6s → ~2s' },
      { label: 'Voice lines lost', value: '0' },
    ],
  },
  {
    edition: 'Edition 3.5',
    date: '2026-05-09',
    tagline: "Repo flipped private. Site stayed public.",
    shipped: [
      'Repo visibility flipped to PRIVATE (Belkins on GH Pro tier)',
      'Issues, Wiki, Projects, Discussions disabled — attack surface reduced',
      'SECURITY.md committed with vulnerability reporting + ops rules',
      '.gitignore hardened — .pem, .key, .aws/, .kube/, secrets/, .vercel',
      'Vercel fallback config committed — dual-target astro.config.mjs reads DEPLOY_TARGET env',
      'Vercel security headers baked (HSTS, X-Frame-Options DENY, X-Content-Type-Options, Permissions-Policy)',
    ],
    receipts: [
      { label: 'Repo visibility', value: 'PUBLIC → PRIVATE' },
      { label: 'Site downtime during flip', value: '~3 min (Pages re-enable required)' },
      { label: 'Surfaces disabled', value: '4' },
    ],
  },
  {
    edition: 'Edition 3',
    date: '2026-05-07',
    tagline: 'Closed the original brief. Six new chapters, two new pages.',
    shipped: [
      'Ch 31 — The Stages: Ideation → Foundation → Creation → Polishing → Security → Deploy',
      'Ch 32 — How to Build Rick (OpenClaw, NemoClaw, Hermes archetypes)',
      'Ch 33 — Browser Agents with Playwright (login, click, scrape, post)',
      'Ch 34 — Persona Agents and the Four NEVERs',
      'Ch 35 — Codex × Claude Code (day shift, night shift)',
      'Ch 36 — Beyond Claude Code (CrewAI, LangGraph, SDK)',
      'StagesFlow widget (Ch 31) — six clickable stages with artifact + ready test + failure mode',
      'ArchetypePicker widget (Ch 32) — 3-question intake → recommended Rick archetype + install command',
      '/day-zero — literal first 30 minutes with 12 localStorage-persisted checkboxes',
      '/sections — chapters grouped by General / Claude / Security / AI Agents / Building / Team+Tier',
    ],
    receipts: [
      { label: 'Chapters added', value: '+6 (30 → 36)' },
      { label: 'Widgets added', value: '+2 (12 → 14)' },
      { label: 'New pages', value: '+2 (/day-zero, /sections)' },
    ],
  },
  {
    edition: 'Storytelling layer',
    date: '2026-05-08',
    tagline: '36 islands became one six-act journey.',
    shipped: [
      '/how-to-read — ~1,100-word prologue. Who this is for, the reframe, the journey, three ways to use the book.',
      '/journey — 6-part narrative arc (Reframe → Memory → Workshop → Discipline → Building → Frontier)',
      '/questions — 18 questions Vlad answers most weeks, each with short answer + chapter pointers',
      'Part pill on every chapter hero — readers know where they are in the arc',
      'Chapter footer transitions detect part boundaries: "Next: Part III — The Workshop →"',
      '/showcase — auto-extracted from ~/.claude/: 62 skills + 32 custom agents + 12 plugins, categorized + searchable',
      '/cowork-setup — sanitized: 12 connector categories + 8 scheduled-task patterns + day-shape timeline. Zero local-data scan.',
    ],
    receipts: [
      { label: 'Reader-facing pages added', value: '+5' },
      { label: 'Skills surfaced', value: '62' },
      { label: 'Sensitive paths read', value: '0 (Cowork showcase derived from published chapters)' },
    ],
  },
  {
    edition: 'Edition 2',
    date: '2026-05-07',
    tagline: 'Fixed the muscles. Wrote the spine.',
    shipped: [
      '6 new chapters (Ch 25-30): Evals, Team Adoption, Voice Agents, Failure Receipts, Cost Economics, Anthropic SDK Direct',
      '4 new widgets: TokenBurnCalculator (Ch 2/29), TempAgencyLoop (Ch 3), VaultGraphPreview (Ch 4), HookEventTimeline (Ch 16)',
      '12 a11y + UX patches: glossary popovers via Radix (no more navigate-away mid-read), focus rings, skip-to-content, paper contrast fix, 17px body on ≥640px, anchor links on H2/H3, print stylesheet',
      '10 new operator prompts added to /resources: deal post-mortem, hire screen, model migration, board update, mentee prep, RFP triage, kill decision, customer-call synthesis, writing-filter, Tuesday-9am triage',
      'ResumeReading pill on landing (localStorage-driven)',
      'Substack subscribe iframe in footer',
      'Sharper "Most readers go here next" copy in chapter footer',
    ],
    receipts: [
      { label: 'Chapters', value: '24 → 30' },
      { label: 'Widgets', value: '8 → 12' },
      { label: 'Pages', value: '32 → 38' },
    ],
  },
  {
    edition: 'Edition 1',
    date: '2026-05-07',
    tagline: 'The book became an artifact.',
    shipped: [
      '24 chapters migrated from .docx into MDX (4 parallel agents, partitioned by chapter range)',
      '8 interactive widgets: StackSelector, SwarmVisualizer, CronBuilder, ModePicker, SkillComposer, ConnectorMap, PermissionSimulator, TierListBuilder',
      'Cmd-K command palette + dark theme + view transitions + reading progress bar',
      'Resources page with copy-paste vault library: CLAUDE.md skeleton, .mcp.json examples, hook scripts, SKILL templates, 5 reusable prompts',
      'Printable cheat sheet (Ch 14, @media print styled)',
      '30-day plan generator (3 intake questions → custom 30-day calendar, .ics + markdown export)',
      'Drag-and-drop tier list builder with shareable URL hash',
      'GitHub Pages deployment via Actions; live in ~50s per push',
    ],
    receipts: [
      { label: 'Source words migrated', value: '~43,000' },
      { label: 'Parallel agents in chapter migration', value: '4' },
      { label: 'Wall-clock for full Edition 1 build', value: '~3 hours' },
      { label: 'Dist size', value: '1.4 MB / 32 pages' },
    ],
  },
];
