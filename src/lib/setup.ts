// Auto-generated from ~/.claude — do not edit by hand.
// Run scripts/build-setup-data.py to refresh.

export type Skill = { name: string; description: string; category: string };
export type Agent = { name: string; description: string; category: 'agent' };
export type Plugin = { name: string; source: string; category: string };

export const SKILLS: Skill[] = [
  {
    "name": "agent-wave-verify",
    "description": "Between-wave audit for parallel agent orchestration. After 3-4 agents finish a wave, run file-count/LOC/commit-hash verification to confirm each agent delivered. Catches silent failures (agent returned OK but left no commit), race conditions (two agents wrote to same file), and scope drift (agent added files outside its assigned directory). Use after any\u2026",
    "category": "meta"
  },
  {
    "name": "ahrefs-budget-check",
    "description": "Preflight check on Ahrefs subscription-info-limits-and-usage before running bulk keyword queries. Prevents 'API units limit reached' errors mid-batch. Estimates cost per operation (keywords-explorer-overview ~50 units minimum, serp-overview variable, site-explorer-organic-keywords 25+). Warns when <100 units remain before a bulk call that needs 500+.",
    "category": "strategy"
  },
  {
    "name": "api-design",
    "description": "Design REST API endpoints from requirements \u2014 generates route table, DTOs, response schemas, and auth requirements.",
    "category": "build"
  },
  {
    "name": "apps-script-clasp-push",
    "description": "Push a local .gs file to a Google Apps Script project and bump an existing deployment \u2014 no editor UI. Handles clasp install/login/API enablement. Use on 'push/redeploy/update the apps script' or 'run clasp push'.",
    "category": "build"
  },
  {
    "name": "audit",
    "description": "Parallel multi-dimension codebase audit \u2014 finds bugs, security issues, and silent failures across the repo, with adversarial verification of every finding. Use before deploying, after big feature sprints, or when suspicious bugs keep recurring.",
    "category": "review"
  },
  {
    "name": "bulk-rename-scoped",
    "description": "Pre-flight + scoped bulk rename for identifier-like strings (emails, brands, domains, keys): greps the portfolio, breaks down matches by dir, flags DB-lookup contexts, BLOCKS for scope confirmation before writing. Use on 'replace X with Y across/everywhere'.",
    "category": "meta"
  },
  {
    "name": "claude-md-hygiene",
    "description": "Audit CLAUDE.md files for size bloat and the prepend-cascade accretion pattern (PRIOR ENTRY stacks, multi-date table-cell rows). Reports specific files, lines, and sections to compress. Run biweekly or when CLAUDE.md feels slow.",
    "category": "meta"
  },
  {
    "name": "competitor-intel",
    "description": "Compare a domain against competitors using Ahrefs \u2014 keyword gaps, traffic comparison, backlink analysis, and content opportunities.",
    "category": "strategy"
  },
  {
    "name": "compound-launch",
    "description": "Multi-surface launch pattern: Day 0 simultaneous newsletter/X/LinkedIn with different openers, Day 1-6 live receipts-diary, Day 7 'Numbers.' post-mortem. Use when launching a public artifact whose thesis touches distribution. Not for quiet ships.",
    "category": "meta"
  },
  {
    "name": "content-draft",
    "description": "Draft LinkedIn post, newsletter section, or blog article from recent work \u2014 turns technical insights into engaging content.",
    "category": "strategy"
  },
  {
    "name": "cross-trio-audit",
    "description": "Audit consistency across the 3 docs a paying customer touches \u2014 landing page, Day-1 fulfillment page, welcome email \u2014 catching tier/price/refund/cadence contradictions before money moves. Use before any preorder Stripe link or tier change.",
    "category": "meta"
  },
  {
    "name": "daily",
    "description": "Morning standup across all projects \u2014 reviews yesterday's git activity, surfaces priorities and blockers.",
    "category": "ops"
  },
  {
    "name": "debug-swarm",
    "description": "Investigate a bug with multiple competing hypotheses",
    "category": "review"
  },
  {
    "name": "debugging-guide",
    "description": "Systematic debugging methodology \u2014 reproduce, isolate, hypothesize, fix, verify. Reference guide for bug investigation.",
    "category": "review"
  },
  {
    "name": "design-system-extractor",
    "description": "Reverse-engineer a verified design system (DTCG-flavored tokens, css, playbooks, component inventory, kitchen-sink page) from an existing site/app/repo/screenshots. Use on 'extract/build the design system or tokens from <X>'. Not for from-scratch design or restyling an existing surface (\u2192 frontend-design).",
    "category": "meta"
  },
  {
    "name": "device-logs",
    "description": "Stream and filter logs from a connected iOS device for debugging (purchase/StoreKit/RevenueCat, Sentry/errors, or all app logs). Use when debugging an iOS app on a physical device.",
    "category": "build"
  },
  {
    "name": "diagnose-iap",
    "description": "Systematic In-App Purchase failure diagnosis \u2014 checks the 6-link IAP config chain before code. Use when iOS IAP/StoreKit/RevenueCat purchases fail or products won't load.",
    "category": "build"
  },
  {
    "name": "dream",
    "description": "Dreaming for CC \u2014 surface candidate memory-learnings from recent session transcripts (digest -> extract agents -> quote re-verification -> dated REVIEW file). PROPOSE-ONLY, never writes memory. Use on /dream or 'what did we learn lately'.",
    "category": "meta"
  },
  {
    "name": "folderly-external-audit",
    "description": "External read-only email-deliverability audit of a domain list -> client-ready report + action register + HTML. Fire on 'Folderly audit', 'deliverability audit', or a domain/mailbox spreadsheet to audit. Not for Folderly app internals or generic Q&A.",
    "category": "meta"
  },
  {
    "name": "google-apps-script-debug",
    "description": "Diagnose Apps Script web-app webhooks that look broken from outside: 302 redirect, Deploy-vs-Manage-Deployments, doPost-in-editor, getActiveSheet, status drift. Use when posts to script.google.com/macros/.../exec aren't arriving.",
    "category": "build"
  },
  {
    "name": "growth-scan",
    "description": "Pull Ahrefs metrics for any domain \u2014 traffic, keywords, backlinks, domain rating \u2014 and analyze growth trends.",
    "category": "strategy"
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
    "name": "hub-edit",
    "description": "DEPRECATED redirect \u2014 belkins.app hub changes go through the manifest, not hand-edits. Fires only to point at the correct flow.",
    "category": "meta"
  },
  {
    "name": "learn",
    "description": "Save a lesson or insight to persistent memory for future sessions. Use when something non-obvious should be remembered.",
    "category": "ops"
  },
  {
    "name": "lingualive",
    "description": "LinguaLive project quick-reference \u2014 loads non-obvious architecture patterns, state model, payment flow, and gotchas at session start to save investigation time.",
    "category": "portfolio"
  },
  {
    "name": "memory-hygiene",
    "description": "Check MEMORY.md health \u2014 detect bloat, find stale memories, suggest consolidation. Run biweekly or after sprint bursts.",
    "category": "ops"
  },
  {
    "name": "mirror-pattern",
    "description": "Prompt template for \"mirror the structure of <existing file>\" when spawning agents to create files matching an established pattern. Reliably produces consistent output across parallel agents where a free-form prompt would drift. Used for: scraper replication, test-file creation, schema migration, deploy-pattern replication.",
    "category": "strategy"
  },
  {
    "name": "monetize-idea",
    "description": "Generate monetization strategy for a product \u2014 revenue models, pricing tiers, financial projections, and go-to-market plan.",
    "category": "strategy"
  },
  {
    "name": "newsletter-draft",
    "description": "Draft a newsletter/longform post in the author's real voice: fetches 2-3 archive issues FIRST as voice calibration before writing a word. Use on 'draft me a newsletter/Substack/longform' or prose 'in my style' for a named publication.",
    "category": "meta"
  },
  {
    "name": "pc",
    "description": "Partner Connector dispatcher \u2014 routes to pc-api (NestJS backend) or pc-client (Nuxt 4 frontend) based on task context. Use /pc <describe your task>.",
    "category": "portfolio"
  },
  {
    "name": "pc-api",
    "description": "Partner Connector API quick-reference \u2014 NestJS backend patterns, module map, auth flow, HubSpot CRM loop, and gotchas.",
    "category": "portfolio"
  },
  {
    "name": "pc-client",
    "description": "Partner Connector Client quick-reference \u2014 Nuxt 4 SPA patterns, gateway layer, explicit imports requirement, auth flow, and gotchas.",
    "category": "portfolio"
  },
  {
    "name": "pitch-html",
    "description": "Generate a single-file interactive HTML pitch artifact from a project's strategic docs. Use on 'beautiful artifact to send to friends', 'make me an HTML pitch', 'interactive slide deck / 1-pager'. Self-contained .html, brand-locked, no build step.",
    "category": "build"
  },
  {
    "name": "playbook-new-page",
    "description": "Add a standalone page to Vlad's Playbook (ai-dive-deep) via the 6 mandatory wiring surfaces \u2014 page, Cmd-K index, cross-link, glossary, homepage tile, changelog. Use on 'add a new page' / 'create a /<slug> page' for dive.vladyslavpodoliako.com.",
    "category": "meta"
  },
  {
    "name": "portfolio-product-scaffold",
    "description": "Scaffold a new 10K-MRR portfolio product end-to-end: mirror 09-receiptradar's 18-file pattern, wire the fulfillment trio, hub tile via products.json + make hub, first Vercel deploy, register in github_push.sh. Use when Vlad says 'add product'.",
    "category": "meta"
  },
  {
    "name": "posthog-wizard-followup",
    "description": "Run the PostHog wizard on a Nuxt or Vitest-tested codebase with baseline-test capture before/after \u2014 auto-applies the defensive trackEvent() wrapper if the wizard's `useNuxtApp()` injections break unit tests.",
    "category": "meta"
  },
  {
    "name": "preflight-external-deps",
    "description": "Audit external data sources/APIs for current-year viability BEFORE writing code \u2014 parallel research agents verify each dependency, catching deprecations, rate-limit and policy changes. Use when starting a project with listed feeds/APIs/integrations.",
    "category": "meta"
  },
  {
    "name": "preflight-ios",
    "description": "Pre-submission App Store Review checklist \u2014 catches the config issues that cause Apple rejections. Use before submitting an iOS build to App Store Connect.",
    "category": "build"
  },
  {
    "name": "refactor",
    "description": "Safe refactoring with test baseline before and after \u2014 ensures no regressions while improving code quality.",
    "category": "build"
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
    "name": "scaffold",
    "description": "Scaffold a new module or component for any framework \u2014 detects project type and generates all boilerplate following existing patterns.",
    "category": "build"
  },
  {
    "name": "seo-check",
    "description": "Quick SEO health check for a URL or domain \u2014 technical issues, keyword performance, and quick-win opportunities from Ahrefs.",
    "category": "strategy"
  },
  {
    "name": "ship-feature",
    "description": "Pre-ship gate \u2014 run a deep code review AND a multi-dimension audit on the current change in parallel, merge into one ship-readiness verdict, then fix blockers before commit. Use when Vlad says \"is this ready to ship\", \"pre-ship check\", \"review + audit this change\", or before committing a non-trivial feature.",
    "category": "meta"
  },
  {
    "name": "ship-ios",
    "description": "Build and upload an iOS release IPA to App Store Connect \u2014 bumps the build number, builds a release IPA, opens Transporter. Use when shipping an iOS build for TestFlight or review.",
    "category": "build"
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
    "name": "tdd-workflow",
    "description": "Test-driven development methodology \u2014 red-green-refactor cycle, test patterns, and TDD best practices for any project.",
    "category": "review"
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
    "description": ">",
    "category": "meta"
  },
  {
    "name": "vault-audit",
    "description": "Audit the Obsidian vault \u2014 find orphan notes, broken links, empty notes, duplicate titles, and tag inventory.",
    "category": "ops"
  },
  {
    "name": "vault-note",
    "description": "Create a structured Obsidian note from current work context \u2014 proper frontmatter, tags, and wikilinks to existing notes.",
    "category": "ops"
  },
  {
    "name": "vercel-env-flip",
    "description": "Flip an existing Vercel production env var to a new value and redeploy so the change takes effect. Wraps the CLI 50.x dance of rm + add + redeploy that trips up non-interactive flows. Use when changing a feature flag, rotating a secret, or correcting a misconfigured env var in prod.",
    "category": "build"
  },
  {
    "name": "verify-deploy",
    "description": "Post-push verification for GITHUB PAGES / Actions-built static sites: polls Actions for the pushed SHA, probes live content + exposure patterns + HTTP 200, prints evidence into the transcript. Use after a push to a Pages/Actions site.",
    "category": "meta"
  },
  {
    "name": "verify-file-durability",
    "description": "Detect silent file reversion (bindfs mirrors, overlay mounts, sync agents, watchdog skills) by capturing a snapshot, waiting, then re-checking. Use after writing to any path where an upstream process might re-sync and overwrite the edit \u2014 Claude.ai Cowork /mnt/skills/, Codex worktrees, Dropbox/iCloud folders, network mounts.",
    "category": "build"
  },
  {
    "name": "verify-next-public-env",
    "description": "Verify a NEXT_PUBLIC_* var actually reached the live prod bundle (they bake at build time; changing on Vercel does nothing until redeploy). Pulls env, checks formatting, greps the deployed bundle. Use after changing any NEXT_PUBLIC_* var.",
    "category": "build"
  },
  {
    "name": "verify-static-deploy",
    "description": "Verify a static one-file VERCEL site is actually live after vercel --prod: custom-domain check (not deployment URL), served-bytes match, inline-script lint, re-alias if stale. Use after deploying any static landing/hub to Vercel.",
    "category": "meta"
  },
  {
    "name": "visibility-flip-check",
    "description": "Pre-flight before flipping a GitHub repo public->private: checks Pages tier breakage, committed secrets, lost collab signals. Fire whenever Vlad says make/flip the repo private or runs gh repo edit --visibility private.",
    "category": "meta"
  },
  {
    "name": "webhook-guide",
    "description": "Webhook integration patterns \u2014 signature validation, queue processing, idempotency, and retry strategies for external service webhooks.",
    "category": "build"
  },
  {
    "name": "weekly",
    "description": "Weekly review across all projects \u2014 git activity summary, metrics, memory cleanup, and next-week planning.",
    "category": "ops"
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

export const AGENTS: Agent[] = [
  {
    "name": "architect",
    "description": "Software architecture specialist for system design, scalability, and technical decision-making. Use PROACTIVELY when planning new features, refactoring large systems, or making architectural decisions.",
    "category": "agent"
  },
  {
    "name": "architecture-designer",
    "description": "Use this agent when you need to design system architecture, make technology stack decisions, plan database schemas, define deployment strategies, or create architectural documentation and diagrams. This includes situations where you're starting a new project, refactoring existing systems, evaluating technology choices, or documenting architectural decisions.",
    "category": "agent"
  },
  {
    "name": "build-error-resolver",
    "description": "Build and TypeScript error resolution specialist. Use PROACTIVELY when build fails or type errors occur. Fixes build/type errors only with minimal diffs, no architectural edits. Focuses on getting the build green quickly.",
    "category": "agent"
  },
  {
    "name": "business-planner",
    "description": "Use this agent when you need to create comprehensive business plans, develop go-to-market strategies, analyze competitive landscapes, define pricing models, or prepare financial projections. This agent excels at transforming business ideas into structured, actionable plans with clear market positioning and financial forecasts.",
    "category": "agent"
  },
  {
    "name": "client-acquisition",
    "description": "Creates plans to secure the first 100 clients. Designs outreach strategies, referral programmes and partnerships. Use this agent when you need to develop strategies, content, or systems for acquiring new clients or customers. This includes creating lead generation campaigns, optimizing conversion funnels, developing outreach strategies, analyzing customer\u2026",
    "category": "agent"
  },
  {
    "name": "code-builder",
    "description": "Use this agent when you need to implement new features, create functions, build components, or write any production-ready code. This agent excels at translating requirements into clean, maintainable code following project conventions and best practices.",
    "category": "agent"
  },
  {
    "name": "code-reviewer",
    "description": "Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code. MUST BE USED for all code changes.",
    "category": "agent"
  },
  {
    "name": "doc-updater",
    "description": "Documentation and codemap specialist. Use PROACTIVELY for updating codemaps and documentation. Runs /update-codemaps and /update-docs, generates docs/CODEMAPS/*, updates READMEs and guides.",
    "category": "agent"
  },
  {
    "name": "e2e-runner",
    "description": "End-to-end testing specialist using Playwright. Use PROACTIVELY for generating, maintaining, and running E2E tests. Manages test journeys, quarantines flaky tests, uploads artifacts (screenshots, videos, traces), and ensures critical user flows work.",
    "category": "agent"
  },
  {
    "name": "error-diagnostics-expert",
    "description": "Use this agent when you encounter errors, bugs, unexpected behaviors, or need to diagnose why something isn't working as expected. This includes runtime errors, logic errors, performance issues, or any situation where code behavior deviates from expectations.",
    "category": "agent"
  },
  {
    "name": "marketing-strategist",
    "description": "Use this agent when you need to develop comprehensive marketing strategies, identify target audiences, create go-to-market plans, or specifically find the most efficient path to acquire your first 100 customers. This agent excels at analyzing market conditions, defining customer personas, mapping customer journeys, and creating actionable marketing funnels.",
    "category": "agent"
  },
  {
    "name": "monetization-strategist",
    "description": "Use this agent when you need to develop comprehensive monetization strategies for products or services, analyze revenue potential, design pricing models beyond traditional subscriptions, or optimize profit margins. This includes creating innovative revenue streams, calculating financial projections, analyzing market positioning for pricing, and developing\u2026",
    "category": "agent"
  },
  {
    "name": "mvp-planner",
    "description": "Use this agent when you need to define and plan a minimum viable product (MVP), including establishing product vision, gathering requirements, prioritizing features, or creating user stories. This agent excels at translating business goals into actionable development plans and ensuring the MVP focuses on core value delivery.",
    "category": "agent"
  },
  {
    "name": "ops-automation",
    "description": "Use this agent when you need to design and implement operational workflows, automation systems, CI/CD pipelines, deployment processes, monitoring solutions, or marketing/CRM automation. This includes setting up GitHub Actions, configuring deployment scripts, implementing automated testing workflows, creating monitoring dashboards, designing email automati\u2026",
    "category": "agent"
  },
  {
    "name": "orchestrator-manager",
    "description": "Use this agent when facing complex, multi-faceted tasks that require coordination across different domains or skill sets. This agent excels at breaking down large projects into manageable subtasks, delegating to specialized agents, and synthesizing results. Ideal for projects involving multiple steps, diverse expertise requirements, or when optimal effici\u2026",
    "category": "agent"
  },
  {
    "name": "pc-api-lead",
    "description": "Lead development agent for Partner Connector API. Runs a multi-task loop \u2014 builds features, fixes security issues, writes tests, reviews code. Does 3-5 tasks per session to maximize output.",
    "category": "agent"
  },
  {
    "name": "pc-api-qa",
    "description": "QA agent for Partner Connector API. Reviews recent commits, writes tests for coverage gaps, fixes bugs. Does 3-5 tasks per session.",
    "category": "agent"
  },
  {
    "name": "pc-client-lead",
    "description": "Lead development agent for Partner Connector Client. Runs a multi-task loop \u2014 builds features, fixes UX issues, adds missing states. Does 3-5 tasks per session.",
    "category": "agent"
  },
  {
    "name": "pc-client-qa",
    "description": "QA agent for Partner Connector Client. Reviews commits, writes tests, fixes responsive/design/accessibility issues. Does 3-5 tasks per session.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-data",
    "description": "Data & analytics strategist for Partner Connector. Identifies what data exists but isn't surfaced, proposes dashboards and insights. Writes to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-growth",
    "description": "Growth strategist for Partner Connector. Identifies features that drive acquisition, retention, and network effects. Writes proposals to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-logic",
    "description": "Business logic strategist for Partner Connector. Audits API services for edge cases, missing validations, and business rule gaps. Writes findings to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-product",
    "description": "Product strategist for Partner Connector. Analyzes the codebase, identifies gaps in user flows, proposes features that drive revenue. Writes findings to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-ux",
    "description": "UX/UI strategist for Partner Connector. Audits every page for usability issues, missing states, confusing flows. Writes improvement tasks to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "planner",
    "description": "Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.",
    "category": "agent"
  },
  {
    "name": "project-manager",
    "description": "Use this agent when you need to coordinate development efforts across multiple tasks, manage project timelines, assign work to team members or other agents, track progress on deliverables, or ensure proper communication between different parts of a project. This agent excels at breaking down complex projects into manageable tasks, monitoring dependencies,\u2026",
    "category": "agent"
  },
  {
    "name": "refactor-cleaner",
    "description": "Dead code cleanup and consolidation specialist. Use PROACTIVELY for removing unused code, duplicates, and refactoring. Runs analysis tools (knip, depcheck, ts-prune) to identify dead code and safely removes it.",
    "category": "agent"
  },
  {
    "name": "security-reviewer",
    "description": "Security vulnerability detection and remediation specialist. Use PROACTIVELY after writing code that handles user input, authentication, API endpoints, or sensitive data. Flags secrets, SSRF, injection, unsafe crypto, and OWASP Top 10 vulnerabilities.",
    "category": "agent"
  },
  {
    "name": "seo-aeo-expert",
    "description": "Use this agent when you need to optimize content, pages, or entire websites for search engines (SEO) and answer engines (AEO). This includes keyword research, on-page optimization, schema markup implementation, technical SEO audits, content optimization for featured snippets, and building authoritative citations. The agent should be engaged for tasks like\u2026",
    "category": "agent"
  },
  {
    "name": "tdd-guide",
    "description": "Test-Driven Development specialist enforcing write-tests-first methodology. Use PROACTIVELY when writing new features, fixing bugs, or refactoring code. Ensures 80%+ test coverage.",
    "category": "agent"
  },
  {
    "name": "test-runner",
    "description": "Use this agent when you need to execute unit and integration tests after code changes, analyze test failures, and get actionable suggestions for fixes. This includes running test suites, interpreting test output, identifying root causes of failures, and proposing code corrections.",
    "category": "agent"
  },
  {
    "name": "traffic-growth-strategist",
    "description": "Use this agent when you need to develop comprehensive strategies for reaching initial traffic milestones, particularly the first 10,000 visitors. This includes planning content calendars, designing viral mechanics, mapping community engagement tactics, and structuring advertising experiments. The agent excels at creating actionable roadmaps that balance o\u2026",
    "category": "agent"
  }
];

export const PLUGINS: Plugin[] = [
  {
    "name": "agent-sdk-dev",
    "source": "claude-plugins-official",
    "category": "build"
  },
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
    "name": "frontend-design",
    "source": "claude-plugins-official",
    "category": "design"
  },
  {
    "name": "github",
    "source": "claude-plugins-official",
    "category": "platform"
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
    "name": "telegram",
    "source": "claude-plugins-official",
    "category": "platform"
  },
  {
    "name": "vercel",
    "source": "claude-plugins-official",
    "category": "platform"
  }
];

// Stats
export const SETUP_STATS = { skills: 66, agents: 32, plugins: 12 } as const;