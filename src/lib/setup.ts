// Auto-generated from ~/.claude — do not edit by hand.
// Run scripts/build-setup-data.py to refresh.

export type Skill = { name: string; description: string; category: string };
export type Agent = { name: string; description: string; category: 'agent' };
export type Plugin = { name: string; source: string; category: string };

export const SKILLS: Skill[] = [
  {
    "name": "ahrefs-budget-check",
    "description": "Preflight check on Ahrefs subscription-info-limits-and-usage before running bulk keyword queries. Prevents 'API units limit reached' errors mid-batch. Estimates cost per operation (keywords-explorer-overview ~50 units minimum, serp-overview variable, site-explorer-organic-keywords 25+). Warns when <100 units remain before a bulk call that needs 500+.",
    "category": "strategy"
  },
  {
    "name": "antislop",
    "description": "De-slop, build or verify signed-in web app screens, iOS/Flutter/Expo screens, HTML email and generated documents against the repo's brand manifest, its slop checker and a two-theme render receipt. Invoked by design-taste Step 2 or as /antislop; never self-triggers on \"design\" asks. NOT for charts (dataviz), token extraction (design-system-extractor), func\u2026",
    "category": "review"
  },
  {
    "name": "arsenal",
    "description": "Four power questions on finished work \u2014 future-proofing, one industry-leading feature, unstated assumptions, what would have made the session smoother. Use on '/arsenal', 'arsenal check', 'power questions', or one of those questions asked after work completes. Report-only; a bare 'retro' means /retro, not this.",
    "category": "meta"
  },
  {
    "name": "audit",
    "description": "Parallel multi-dimension codebase audit \u2014 finds bugs, security issues, and silent failures across the repo, with adversarial verification of every finding. Use before deploying, after big feature sprints, or when suspicious bugs keep recurring.",
    "category": "review"
  },
  {
    "name": "audit-content",
    "description": "Verifies truthfulness, accuracy, and link integrity of content before publishing. Catches fabricated statistics, dead URLs, misattributed sources, and company claims that contradict the brand DNA.",
    "category": "review"
  },
  {
    "name": "audit-website-aeo",
    "description": "Audits a live website for AI-engine discoverability (AEO/GEO). Crawls the site, runs 16 deterministic checks plus a 6-dimension content evaluation, and produces a scored report (A-F) with prioritized fixes. Use to get a baseline before improve-aeo-geo, or to measure progress after changes.",
    "category": "review"
  },
  {
    "name": "bulk-rename-scoped",
    "description": "Pre-flight + scoped bulk rename for identifier-like strings (emails, brands, domains, keys): greps the portfolio, breaks down matches by dir, flags DB-lookup contexts, BLOCKS for scope confirmation before writing. Use on 'replace X with Y across/everywhere'.",
    "category": "build"
  },
  {
    "name": "claude-md-hygiene",
    "description": "Audit CLAUDE.md files for size bloat and the prepend-cascade accretion pattern (PRIOR ENTRY stacks, multi-date table-cell rows). Reports specific files, lines, and sections to compress. Run biweekly or when CLAUDE.md feels slow.",
    "category": "ops"
  },
  {
    "name": "credential-helper-lint",
    "description": "Lint a script before handing it to the owner to run with a real credential \u2014 catches secrets in argv, in usage lines, in output, in xtrace and in world-readable files. Use before handing any script that reads or sets a token, secret, password or API key to the owner, when writing a \"credential helper\", when asked to \"set registry credentials\" or to \"pipe\u2026",
    "category": "review"
  },
  {
    "name": "cutover-preflight",
    "description": "Acceptance sequence for moving a running service to a new host on the SAME database \u2014 differential old-vs-new probe, the exact candidate digest exercised on staging with a real money path, scheduler tick reading, headless client smoke, and the evidence rows that go into the cutover packet. Fires on \"cutover\", \"migration acceptance\", \"S1\", \"prove parity\",\u2026",
    "category": "build"
  },
  {
    "name": "debug-swarm",
    "description": "Investigate a bug with multiple competing hypotheses",
    "category": "review"
  },
  {
    "name": "deploy-to-box",
    "description": "Deploy a code/config fix to a git-tracked box reached over SSH (Raspberry Pi, self-hosted server) so it is LIVE, DURABLE across the next git pull, and visible in the user's warm browser. Use when editing files that run on such a box. Not for Vercel/Railway.",
    "category": "build"
  },
  {
    "name": "design-system-extractor",
    "description": "Reverse-engineer a verified design system (DTCG-flavored tokens, css, playbooks, component inventory, kitchen-sink page) from an existing site/app/repo/screenshots. Use on 'extract/build the design system or tokens from <X>'. Not for from-scratch design or restyling an existing surface (\u2192 frontend-design).",
    "category": "build"
  },
  {
    "name": "design-taste",
    "description": "Front door to the taste-skill design roster: resolves brand first, then routes to the right taste-skill:* skill. Use for any build-or-change-a-web-surface ask and on '/design-taste'. NOT for schemas/APIs/architecture, charts (dataviz), token extraction (design-system-extractor), or functional QA (gstack-qa).",
    "category": "build"
  },
  {
    "name": "dream",
    "description": "Dreaming for CC \u2014 surface candidate memory-learnings from recent session transcripts (digest -> extract agents -> quote re-verification -> dated REVIEW file). PROPOSE-ONLY, never writes memory. Use on /dream or 'what did we learn lately'.",
    "category": "ops"
  },
  {
    "name": "eval",
    "description": "Generate a synthetic test set for an AI feature, score its output two ways (LLM-judge + deterministic code-grade), and emit an honest HTML scorecard with a real pass rate. Use on '/eval', 'score this prompt', 'is this AI feature actually working', or before charging for model output. Wraps eval-harness/ (TS). Not for generic code review (that is /ship-fea\u2026",
    "category": "review"
  },
  {
    "name": "fixing-accessibility",
    "description": "Audit and fix HTML accessibility issues including ARIA labels, keyboard navigation, focus management, color contrast, and form errors. Use when adding interactive controls, forms, dialogs, or reviewing WCAG compliance.",
    "category": "review"
  },
  {
    "name": "fixing-metadata",
    "description": "Audit and fix HTML metadata including page titles, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, favicons, JSON-LD structured data, and robots directives. Use when adding SEO metadata, fixing social share previews, reviewing Open Graph tags, setting up canonical URLs, or shipping new pages that need correct meta tags.",
    "category": "build"
  },
  {
    "name": "folderly-external-audit",
    "description": "External read-only email-deliverability audit of a domain list -> client-ready report + action register + HTML. Fire on 'Folderly audit', 'deliverability audit', or a domain/mailbox spreadsheet to audit. Not for Folderly app internals or generic Q&A.",
    "category": "portfolio"
  },
  {
    "name": "framer",
    "description": "If Framer MCP tools (such as `open_project`) are available, use them instead and do not load this skill. Use when the user wants to design, edit, analyze, or publish a website or web page \u2014 creating layouts, editing sections, updating text or images, querying site analytics, managing CMS collections and content, syncing external data, creating or modifyin\u2026",
    "category": "build"
  },
  {
    "name": "framer-code-components",
    "description": "Framer code component implementation guidance, platform constraints, layout annotations, property controls, and authoring best practices. Use only after loading the framer skill and reading the Components row of the generated projects/<safeProjectId>/index.md task map first in the same task; never load this skill directly as the entry point.",
    "category": "build"
  },
  {
    "name": "gstack-careful",
    "description": "Safety guardrails for destructive commands. Warns before rm -rf, DROP TABLE, force-push, git reset --hard, kubectl delete, and similar destructive operations. User can override each warning. Use when touching prod, debugging live systems, or working in a shared environment. Use when asked to \"be careful\", \"safety mode\", \"prod mode\", or \"careful mode\". (gs\u2026",
    "category": "review"
  },
  {
    "name": "gstack-qa",
    "description": "Systematically QA a web app and fix the bugs found: test, fix atomically, re-verify; tiers Quick/Standard/Exhaustive; before/after health scores. Use on 'qa', 'test this site', 'find bugs', 'test and fix', 'quality check'. (gstack)",
    "category": "review"
  },
  {
    "name": "health-pulse",
    "description": "Check CI, deploy, and cron health across all active projects. Updates ~/.claude/health/heartbeat-state.json. Alerts via Telegram on state transitions.",
    "category": "ops"
  },
  {
    "name": "humanizer",
    "description": "Rewrite AI-sounding text so it reads like the writer without changing what it says. Use when editing or reviewing prose for AI tells: not-X-but-Y contrasts, one-line closers, staged openers, forced triads, dashes everywhere, inflated claims, sales language, stock AI words, bold labels, or filler. Based on Wikipedia's \"Signs of AI writing.\"",
    "category": "strategy"
  },
  {
    "name": "improve-aeo-geo",
    "description": "Audits a website codebase and makes code changes so AI engines (ChatGPT, Claude, Perplexity, Google AI Overviews) can better discover, parse, quote, and cite the site. Covers structured data, content structure, technical signals, and freshness.",
    "category": "build"
  },
  {
    "name": "learn",
    "description": "Write one lesson to this project's memory dir so future sessions load it \u2014 a correction Vlad made, a gotcha that burned time, or a confirmed non-obvious approach. Saves one lesson (new file or an update to the existing one) plus its MEMORY.md pointer; not the whole-session ceremony (that is /retro) and not the multi-session surfacer (that is /dream).",
    "category": "ops"
  },
  {
    "name": "memory-hygiene",
    "description": "Check MEMORY.md health \u2014 detect bloat, find stale memories, suggest consolidation. Run biweekly or after sprint bursts.",
    "category": "ops"
  },
  {
    "name": "negative-test-guards",
    "description": "Prove a guard, watchdog, backup, tripwire, health check or CI gate can actually FAIL before trusting it green. Use whenever you write or review code whose job is to detect a problem \u2014 guards, asserts, alerts, monitors, backups, verifiers, CI checks. Also fires on \"does this check actually work\", \"is this guard real\", \"why didn't this alert fire\".",
    "category": "review"
  },
  {
    "name": "newsletter-draft",
    "description": "Draft a newsletter/longform post in the author's real voice: fetches 2-3 archive issues FIRST as voice calibration before writing a word. Use on 'draft me a newsletter/Substack/longform' or prose 'in my style' for a named publication.",
    "category": "strategy"
  },
  {
    "name": "pitch-html",
    "description": "Generate a single-file interactive HTML pitch artifact from a project's strategic docs. Use on 'beautiful artifact to send to friends', 'make me an HTML pitch', 'interactive slide deck / 1-pager'. Self-contained .html, brand-locked, no build step.",
    "category": "build"
  },
  {
    "name": "posthog-wizard-followup",
    "description": "Run the PostHog wizard on a Nuxt or Vitest-tested codebase with baseline-test capture before/after \u2014 auto-applies the defensive trackEvent() wrapper if the wizard's `useNuxtApp()` injections break unit tests.",
    "category": "build"
  },
  {
    "name": "preflight-external-deps",
    "description": "Audit external data sources/APIs for current-year viability BEFORE writing code \u2014 parallel research agents verify each dependency, catching deprecations, rate-limit and policy changes. Use when starting a project with listed feeds/APIs/integrations.",
    "category": "meta"
  },
  {
    "name": "remove-ai-marks",
    "description": "Strip AI provenance marks: invisible Unicode, statistical text watermarks (rewrite), and C2PA/EXIF/XMP metadata on PNG/JPEG/WebP/SVG/PDF/DOCX/HTML/MD. Use on 'remove watermarks / C2PA / AI metadata / invisible Unicode' or /remove-ai-marks (alias /remove-claude-marks).",
    "category": "meta"
  },
  {
    "name": "research",
    "description": "Launch a research swarm to explore code from multiple angles",
    "category": "strategy"
  },
  {
    "name": "retro",
    "description": "End-of-session retrospective \u2014 reviews what happened, extracts lessons, saves insights to memory for future sessions.",
    "category": "ops"
  },
  {
    "name": "safe-git-cleanup",
    "description": "Preflight before any destructive git housekeeping \u2014 worktree remove, branch delete, gc/prune, reflog expire, clean -fdx, reset --hard, stash drop. Fires on \"clean up the repo\", \"remove the worktree\", \"tidy branches\", \"prune\", or before deleting anything git-adjacent.",
    "category": "build"
  },
  {
    "name": "seo-ops",
    "description": "Structural checklist and checker script for SEO foundation engineering. Use when reviewing or accepting a site/page for SEO/GEO structural compliance (robots, sitemap, canonical, 301 canonicalization, JSON-LD, OG, hreflang, CWV, AI crawler access, rendering strategy), when running the machine checks to produce a report, or when judging whether a frontend\u2026",
    "category": "review"
  },
  {
    "name": "ship-feature",
    "description": "Pre-ship gate \u2014 run a deep code review AND a multi-dimension audit on the current change in parallel, merge into one ship-readiness verdict, then fix blockers before commit. Use when Vlad says \"is this ready to ship\", \"pre-ship check\", \"review + audit this change\", or before committing a non-trivial feature.",
    "category": "review"
  },
  {
    "name": "substack-push",
    "description": "Push a finished Vlad's Newsletter draft from the vault (Vlad-Brain/Newsletter/Drafts) into Substack as an UNPUBLISHED draft through Vlad's connected Chrome, title and body both verified after reload. Use on \"push this week's Tuesday/Thursday edition\", \"push the newsletter draft to Substack\", \"create the Substack draft\". Never publishes. Not for writing th\u2026",
    "category": "ops"
  },
  {
    "name": "supabase-state-check",
    "description": "Report drift between your local Supabase migration files and the actual production DB state via Management API. Surfaces tables that exist but aren't in the tracker, migrations in the repo that aren't applied, and RLS gaps on user-data tables. Use before running `supabase db push` on a project where migrations are sometimes applied via dashboard.",
    "category": "build"
  },
  {
    "name": "swarm-strategic-plan",
    "description": "Multi-wave swarm planning for greenfield ventures or deep planning on existing decisions. Use on /swarm-strategic-plan, 'mega ultrathink', 'full plan on X', 'design swarm for Y'. Modes: full-swarm / lite-mode / solo-deep-think.",
    "category": "strategy"
  },
  {
    "name": "teleport",
    "description": "Jump to a file or symbol by name \u2014 searches filenames and content, returns up to 10 file matches and content matches with line numbers",
    "category": "meta"
  },
  {
    "name": "ultraplan",
    "description": "Deep multi-step execution planning with goals, risks, implementation sequence, verification steps, and rollback \u2014 ported from claw-code",
    "category": "strategy"
  },
  {
    "name": "ultrareview",
    "description": "Deep code review of a PR, file, or module \u2014 architecture, correctness, performance, security, and test coverage in one pass",
    "category": "review"
  },
  {
    "name": "use-railway",
    "description": "Operate Railway infrastructure: projects, services, databases, buckets, deploys, environments, domains, troubleshooting, docs. Use ONLY when Railway is explicitly named, the project is known to deploy on Railway (e.g. the folderly-dmarc worker), or a railway.toml/railway.app artifact is present. Do NOT fire for Vercel or generic deployment/build-failure/M\u2026",
    "category": "build"
  },
  {
    "name": "vercel-env-verify",
    "description": "Verify or flip an env var on Vercel and prove it reached the live bundle. Covers NEXT_PUBLIC_* (Next.js), VITE_* (Vite SPA) \u2014 both bake at build time, so changing them on Vercel does nothing until a redeploy \u2014 and plain production vars (rm + add + redeploy dance of CLI 50.x). Use after changing any Vercel env var, on 'did the env var reach prod', or to ro\u2026",
    "category": "build"
  },
  {
    "name": "verify-before-asking",
    "description": "Run before asking Vlad for ANY credential, key, ID, URL, account detail, or fact a past session likely established. Exhausts the derivation paths first. Fires on the impulse \"I need X from you\", \"please provide\", \"I don't have access to\", \"can you paste\", or before writing a hand-off that asks for a value.",
    "category": "meta"
  },
  {
    "name": "verify-file-durability",
    "description": "Detect silent file reversion (bindfs mirrors, overlay mounts, sync agents, watchdog skills) by capturing a snapshot, waiting, then re-checking. Use after writing to any path where an upstream process might re-sync and overwrite the edit \u2014 Claude.ai Cowork /mnt/skills/, Codex worktrees, Dropbox/iCloud folders, network mounts.",
    "category": "build"
  },
  {
    "name": "verify-live-surface",
    "description": "Prove a deployed web surface actually serves what you just shipped \u2014 by content marker with controls, never by status code. Use after any deploy, or when checking whether a page, route, endpoint, bundle or auth gate is live and correct. Fires on \"is it deployed\", \"did that go live\", \"check the page works\", \"verify the endpoint\", \"is the fix live on prod/t\u2026",
    "category": "review"
  },
  {
    "name": "visibility-flip-check",
    "description": "Pre-flight before flipping a GitHub repo public->private: checks Pages tier breakage, committed secrets, lost collab signals. Fire whenever Vlad says make/flip the repo private or runs gh repo edit --visibility private.",
    "category": "build"
  },
  {
    "name": "vlad-framer",
    "description": "Work on Vlad Website Main or vladyslavpodoliako.com using its live Framer skills for design, copy, CMS, SEO, accessibility and release. Use for Vlad's personal website, not unrelated Framer projects.",
    "category": "build"
  },
  {
    "name": "wf",
    "description": "Front door to the compiled Workflow library. /wf lists workflows with token estimates; /wf <name> [scope] resolves the scriptPath, assembles args as real JSON, and launches (lite tier default). Use on '/wf' or 'run the <X> workflow'.",
    "category": "meta"
  },
  {
    "name": "workflow-forge",
    "description": "Author, lint, list, and audit the compiled Workflow library at ~/.claude/workflows/. Use when Vlad says \"add a workflow\", \"new workflow for X\", \"lint the workflows\", \"what workflows do I have\", \"compile this skill into a workflow\", or when a workflow script misbehaves. Encodes the verified DSL gotchas so new scripts don't repeat them.",
    "category": "meta"
  }
];

export const AGENTS: Agent[] = [];

export const PLUGINS: Plugin[] = [
  {
    "name": "code-review",
    "source": "claude-plugins-official",
    "category": "review"
  },
  {
    "name": "context7",
    "source": "claude-plugins-official",
    "category": "docs"
  },
  {
    "name": "feature-dev",
    "source": "claude-plugins-official",
    "category": "build"
  },
  {
    "name": "ralph-loop",
    "source": "claude-plugins-official",
    "category": "workflow"
  },
  {
    "name": "revenue-os",
    "source": "local",
    "category": "workflow"
  },
  {
    "name": "supabase",
    "source": "claude-plugins-official",
    "category": "platform"
  },
  {
    "name": "swift-lsp",
    "source": "claude-plugins-official",
    "category": "platform"
  },
  {
    "name": "taste-skill",
    "source": "taste-skill",
    "category": "platform"
  },
  {
    "name": "vercel",
    "source": "claude-plugins-official",
    "category": "platform"
  },
  {
    "name": "workflow-kit",
    "source": "workflow-kit",
    "category": "platform"
  }
];

// Stats
export const SETUP_STATS = { skills: 54, agents: 0, plugins: 10 } as const;