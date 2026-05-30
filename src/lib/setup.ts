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
    "description": "Push a local .gs source file to a Google Apps Script project and bump an existing deployment to the new version \u2014 no Apps Script editor UI needed. Handles one-time clasp install, OAuth login, Apps Script API enablement, cloning, push, and deployment-by-ID update. Use when you need a local Apps Script code change live on a deployed webhook URL, or when som\u2026",
    "category": "build"
  },
  {
    "name": "audit",
    "description": "",
    "category": "review"
  },
  {
    "name": "bughunter",
    "description": "Inspect a scope (file, module, or full repo) and identify likely bugs \u2014 returns concrete findings with file paths, severity, and fix suggestions",
    "category": "review"
  },
  {
    "name": "build-feature",
    "description": "Build a feature with parallel agents for backend, tests, and API layer",
    "category": "build"
  },
  {
    "name": "competitor-intel",
    "description": "Compare a domain against competitors using Ahrefs \u2014 keyword gaps, traffic comparison, backlink analysis, and content opportunities.",
    "category": "strategy"
  },
  {
    "name": "content-draft",
    "description": "Draft LinkedIn post, newsletter section, or blog article from recent work \u2014 turns technical insights into engaging content.",
    "category": "strategy"
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
    "name": "deploy-check",
    "description": "Run pre-deployment validation checks",
    "category": "build"
  },
  {
    "name": "device-logs",
    "description": "",
    "category": "build"
  },
  {
    "name": "diagnose-iap",
    "description": "",
    "category": "build"
  },
  {
    "name": "git-ship",
    "description": "Commit all changes with a smart message, push to remote, and optionally create a PR \u2014 all in one command.",
    "category": "build"
  },
  {
    "name": "google-apps-script-debug",
    "description": "Diagnose Google Apps Script web app webhooks that look broken from outside \u2014 covers the non-obvious 302 redirect, Deploy-vs-Manage-Deployments distinction, doPost-in-editor failure, getActiveSheet footgun, and status-field drift. Use when a Next.js/React frontend posts to a `script.google.com/macros/s/.../exec` URL and data isn't arriving, or when an Apps\u2026",
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
    "name": "gstack-office-hours",
    "description": "YC Office Hours \u2014 two modes. Startup mode: six forcing questions that expose demand reality, status quo, desperate specificity, narrowest wedge, observation, and future-fit. Builder mode: design thinking brainstorming for side projects, hackathons, learning, and open source. Saves a design doc. Use when asked to \"brainstorm this\", \"I have an idea\", \"help\u2026",
    "category": "strategy"
  },
  {
    "name": "gstack-qa",
    "description": "Systematically QA test a web application and fix bugs found. Runs QA testing, then iteratively fixes bugs in source code, committing each fix atomically and re-verifying. Use when asked to \"qa\", \"QA\", \"test this site\", \"find bugs\", \"test and fix\", or \"fix what's broken\". Proactively suggest when the user says a feature is ready for testing or asks \"does t\u2026",
    "category": "review"
  },
  {
    "name": "gstack-review",
    "description": "Pre-landing PR review. Analyzes diff against the base branch for SQL safety, LLM trust boundary violations, conditional side effects, and other structural issues. Use when asked to \"review this PR\", \"code review\", \"pre-landing review\", or \"check my diff\". Proactively suggest when the user is about to merge or land code changes. (gstack)",
    "category": "review"
  },
  {
    "name": "harden",
    "description": "Audit and harden Supabase edge functions \u2014 CORS lockdown, JWT auth, secret cleanup, rate limiting",
    "category": "review"
  },
  {
    "name": "health-pulse",
    "description": "Check CI, deploy, and cron health across all active projects. Updates ~/.claude/health/heartbeat-state.json. Alerts via Telegram on state transitions.",
    "category": "ops"
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
    "name": "pc",
    "description": "a B2B SaaS dispatcher \u2014 routes to pc-api (NestJS backend) or pc-client (Nuxt 4 frontend) based on task context. Use /pc <describe your task>.",
    "category": "portfolio"
  },
  {
    "name": "pc-api",
    "description": "a B2B SaaS API quick-reference \u2014 NestJS backend patterns, module map, auth flow, HubSpot CRM loop, and gotchas.",
    "category": "portfolio"
  },
  {
    "name": "pc-client",
    "description": "a B2B SaaS Client quick-reference \u2014 Nuxt 4 SPA patterns, gateway layer, explicit imports requirement, auth flow, and gotchas.",
    "category": "portfolio"
  },
  {
    "name": "perf-check",
    "description": "Performance audit \u2014 finds N+1 queries, missing indexes, blocking operations, memory issues, and pagination gaps.",
    "category": "review"
  },
  {
    "name": "pitch-html",
    "description": "Generate a single-file interactive HTML pitch artifact from a project's strategic docs (BRIEF + MONETIZATION + REVENUE-MODEL + BRAND-IDENTITY). Use when Vlad says \"create me a beautiful artifact to send to friends\" / \"make me an HTML pitch\" / \"build interactive [slide deck / 1-pager]\". Output: a self-contained .html file, email-attachable, no build step,\u2026",
    "category": "build"
  },
  {
    "name": "plan-only",
    "description": "Enter plan-only mode \u2014 analyze and design without creating, editing, or modifying any files.",
    "category": "strategy"
  },
  {
    "name": "preflight-external-deps",
    "description": "Audit external data sources and API integrations for 2026 viability BEFORE writing code. Spawn parallel research agents to verify each dependency still works as documented, catch deprecations, rate-limit changes, and policy shifts. Use when starting a project with listed data feeds, external APIs, or third-party integrations. Saves 2-3 weeks of wasted sca\u2026",
    "category": "meta"
  },
  {
    "name": "preflight-ios",
    "description": "",
    "category": "build"
  },
  {
    "name": "quick-fix",
    "description": "Rapid bug fix \u2014 finds root cause, implements minimal fix, and verifies with tests. From bug report to verified fix.",
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
    "name": "review-and-fix",
    "description": "Implement a change with parallel code review and testing",
    "category": "review"
  },
  {
    "name": "scaffold",
    "description": "Scaffold a new module or component for any framework \u2014 detects project type and generates all boilerplate following existing patterns.",
    "category": "build"
  },
  {
    "name": "security-audit",
    "description": "Run a 4-agent security audit on any codebase \u2014 client exposure, auth, secrets, injection",
    "category": "review"
  },
  {
    "name": "security-review",
    "description": "Security audit of a file, module, or full codebase \u2014 OWASP Top 10, auth issues, injection, secret exposure, and access control gaps",
    "category": "review"
  },
  {
    "name": "seo-check",
    "description": "Quick SEO health check for a URL or domain \u2014 technical issues, keyword performance, and quick-win opportunities from Ahrefs.",
    "category": "strategy"
  },
  {
    "name": "ship-ios",
    "description": "",
    "category": "build"
  },
  {
    "name": "sprint-kickoff",
    "description": "Break down a sprint goal into tasks with estimates",
    "category": "ops"
  },
  {
    "name": "supabase-state-check",
    "description": "Report drift between your local Supabase migration files and the actual production DB state via Management API. Surfaces tables that exist but aren't in the tracker, migrations in the repo that aren't applied, and RLS gaps on user-data tables. Use before running `supabase db push` on a project where migrations are sometimes applied via dashboard.",
    "category": "build"
  },
  {
    "name": "swarm-strategic-plan",
    "description": "Generate a complete 25-document strategic plan for a greenfield venture using a 5-wave \u00d7 4-agent swarm. Use when Vlad says \"draft me plans for [new venture]\" or \"build me a complete strategy for X\" and the project does not yet exist. Outputs: scaffolded folder + master BRIEF + 20 specialist docs + 8 brainstorming personas + cross-cutting synthesis.",
    "category": "strategy"
  },
  {
    "name": "tdd-workflow",
    "description": "Test-driven development methodology \u2014 red-green-refactor cycle, test patterns, and TDD best practices for any project.",
    "category": "review"
  },
  {
    "name": "telegram-report",
    "description": "Send a formatted report or message to a Telegram chat using the Telegram MCP plugin.",
    "category": "ops"
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
    "name": "verify-file-durability",
    "description": "Detect silent file reversion (bindfs mirrors, overlay mounts, sync agents, watchdog skills) by capturing a snapshot, waiting, then re-checking. Use after writing to any path where an upstream process might re-sync and overwrite the edit \u2014 Claude.ai Cowork /mnt/skills/, Codex worktrees, Dropbox/iCloud folders, network mounts.",
    "category": "build"
  },
  {
    "name": "verify-next-public-env",
    "description": "Verify a NEXT_PUBLIC_* env var actually made it into the live production bundle. NEXT_PUBLIC_* vars bake at build time, so changing them on Vercel has zero effect until a redeploy rebuilds the client JS. This skill pulls Vercel env, checks for formatting issues (trailing whitespace, dupes), and greps the currently-deployed bundle to confirm the new value\u2026",
    "category": "build"
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
    "description": "Lead development agent for a B2B SaaS API. Runs a multi-task loop \u2014 builds features, fixes security issues, writes tests, reviews code. Does 3-5 tasks per session to maximize output.",
    "category": "agent"
  },
  {
    "name": "pc-api-qa",
    "description": "QA agent for a B2B SaaS API. Reviews recent commits, writes tests for coverage gaps, fixes bugs. Does 3-5 tasks per session.",
    "category": "agent"
  },
  {
    "name": "pc-client-lead",
    "description": "Lead development agent for a B2B SaaS Client. Runs a multi-task loop \u2014 builds features, fixes UX issues, adds missing states. Does 3-5 tasks per session.",
    "category": "agent"
  },
  {
    "name": "pc-client-qa",
    "description": "QA agent for a B2B SaaS Client. Reviews commits, writes tests, fixes responsive/design/accessibility issues. Does 3-5 tasks per session.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-data",
    "description": "Data & analytics strategist for a B2B SaaS. Identifies what data exists but isn't surfaced, proposes dashboards and insights. Writes to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-growth",
    "description": "Growth strategist for a B2B SaaS. Identifies features that drive acquisition, retention, and network effects. Writes proposals to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-logic",
    "description": "Business logic strategist for a B2B SaaS. Audits API services for edge cases, missing validations, and business rule gaps. Writes findings to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-product",
    "description": "Product strategist for a B2B SaaS. Analyzes the codebase, identifies gaps in user flows, proposes features that drive revenue. Writes findings to ROADMAP.md.",
    "category": "agent"
  },
  {
    "name": "pc-strategist-ux",
    "description": "UX/UI strategist for a B2B SaaS. Audits every page for usability issues, missing states, confusing flows. Writes improvement tasks to ROADMAP.md.",
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
export const SETUP_STATS = { skills: 62, agents: 32, plugins: 12 } as const;