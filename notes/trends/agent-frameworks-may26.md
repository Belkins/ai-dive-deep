# Agent frameworks — May 2026 state

> what changed since Vlad's Ch 36 shipped. real numbers per framework. honest about hype vs adoption. all dates as of 2026-05-14.

## Major frameworks — quick table

| Framework | Latest version | Last release | GitHub stars | Production-ready? | Best for |
|---|---|---|---|---|---|
| CrewAI | 1.14.5a3 (pre-release) — stable line ~1.14.x | 2026-05-09 | ~47.8k (high) | yes — 12M daily executions, 150+ enterprise | role-based multi-agent crews, fastest enterprise adoption curve |
| LangGraph | 1.1.10 + prebuilt 1.0.12 (Apr 2026), recent control-plane refresh ~2026-05-12 | 2026-05-12 | ~28.2k (high) | yes — Klarna, Replit, LinkedIn in production | graph-based workflows, durable state, "production tier" of the LangChain world |
| AutoGen → Microsoft Agent Framework (MAF) | MAF 1.0 GA | 2026-04-03 | AutoGen repo ~56.6k (high); MAF separate | yes — .NET + Python, A2A/MCP interop | enterprise .NET shops, anyone already on Azure / Semantic Kernel |
| OpenAI Agents SDK | 0.14 (sandbox + model-native harness) | 2026-04-15 | unverified — repo openai/openai-agents-python; medium | yes — sandbox + harness GA, subagents + code mode "coming soon" | OpenAI-native code agents w/ sandboxed FS + native harness |
| Anthropic Claude Agent SDK + Managed Agents | Agent SDK active rolling releases; Managed Agents public beta | Managed Agents GA-beta 2026-04-08; Memory beta 2026-04-23 | unverified star count; high adoption signal | yes — Vlad's primary platform | Claude-native agents, esp. coding/Cowork-style work, persistent memory |
| Vercel AI SDK 6 + Workflow DevKit (DurableAgent) | AI SDK 6 GA | 2026 (AI SDK 6 launch); Workflow DevKit active | 20M+ monthly downloads (high) | yes — DurableAgent drop-in replacement for Agent class | TS-first product teams, "agent-in-a-Next-app" pattern, durable pause/resume |
| mastra-ai | 1.x (1.0 hit Jan 2026) | rolling, 2026 | ~22k (medium-high) | yes — 300k weekly npm downloads | TS-only teams, YC W25, agents + workflows + RAG in one |
| Inngest AgentKit | 0.13.x line | rolling 2026 | unverified (medium) | yes — built on Inngest durable infra | event-driven shops who already run Inngest jobs, deterministic routing |
| Google ADK | rolling — rebranded under Gemini Enterprise Agent Platform at Cloud Next 2026 | 2026 | unverified | yes — internally used for Agentspace, Vertex agent gallery | GCP-shop enterprises, code-first w/ Vertex Agent Engine deploy |

confidence on the numbers above: star counts are aggregator-reported, not pulled from GitHub API live — treat as **medium confidence** unless cited from official release notes (high).

## Browser / Computer Use state

the headline of May 2026: **Anthropic now leads computer use, OpenAI shut down Operator (Aug 2025), and the benchmark gap to human-level is still ~25 points on OSWorld.**

- **OSWorld** (full desktop control, the honest benchmark): Claude Sonnet 4.6 at **72.5%**, Coasty at **82%**, OpenAI CUA at **38.1%**, older Anthropic Computer Use at 44%. human baseline ~72%. so Sonnet 4.6 is essentially at human-level for OSWorld, which would have sounded crazy a year ago. confidence: high (multiple sources).
- **WebVoyager / WebArena** (web-only): OpenAI CUA hit 87% / 58.1% before being deprecated. these numbers are now stale — Operator was shut down 2025-08-31 because it couldn't reliably complete checkout flows with JS + CAPTCHA + sessions. confidence: high.
- **Anthropic computer use**: graduated from research preview (2024) to consumer-shipping product on Pro/Max via Cowork + Claude Code in **2026-03-23**. this is what Vlad uses daily — clicking, typing, multi-app workflows. confidence: high.
- **browser-use** (open-source Python lib): still the canonical "drive Chrome from an LLM" library. less hyped than a year ago; the action moved up-stack to Claude/Operator-style products. confidence: medium.
- **Google's surf-on-chrome**: integrated into Gemini Enterprise Agent Platform, no independent benchmark surface yet. confidence: low.

honest read: computer use **works for narrow scoped tasks** (a single multi-step workflow Vlad sets up) but is still an **observability nightmare** for production unattended ops. operators are using it for back-office work — invoice processing, screenshot QA — not for customer-facing flows.

## Multi-agent orchestration — what's actually working

the consensus that hardened in 2026: **hub-and-spoke wins production. swarm wins demos.**

- **Hub-and-spoke (orchestrator-worker)** — ~70% of production deployments per public case studies. a single orchestrator decomposes the task, dispatches to workers, aggregates. workers don't talk to each other. **easiest to debug** (one control flow to trace). Microsoft's own guidance: start centralized, decentralize only when a concrete scalability bottleneck appears. this is the pattern behind Anthropic's research-style multi-agent system, and the default in MAF + CrewAI flows.
- **Swarm / peer-to-peer handoff** — popularized by OpenAI Swarm (now folded into the Agents SDK). powerful for parallelism but **observability is brutal**. Vlad's own memory note (`feedback_parallel_agent_ceiling.md`) — 3-4 agents per wave, 5+ invites filesystem contention — is the operator's version of this lesson.
- **DAG / graph** — LangGraph's native model. great when the topology is known up-front (e.g. classifier → router → 3 parallel skills → reducer). production-friendly because every edge is explicit.
- **Hierarchical / manager-of-managers** — research-paper-stage for most teams. Magentic-One (now in MAF) ships it; very few production case studies outside Microsoft and Anthropic Research.

production patterns that **work today**:
- 1 orchestrator + 3-5 specialized workers + a verifier/critic = the standard "production agent" topology
- between-wave audits (see Vlad's `agent-wave-verify` skill) to catch silent failures
- deterministic routing (Inngest AgentKit's selling point) for anything touching $$$ or PII

what's **not** working in production: full free-form swarm with 10+ agents debating. token cost + nondeterminism kills it before it ships.

## Benchmarks — May 2026 snapshot

| Benchmark | Top score | Holder | Human baseline | Notes |
|---|---|---|---|---|
| SWE-bench Verified | **93.9%** | Claude Mythos Preview | n/a (curated) | OpenAI flagged contamination — every frontier model can reproduce gold patches verbatim. OpenAI now reports SWE-bench Pro instead. confidence: high |
| SWE-bench Pro | **77.8%** | Claude Mythos Preview | n/a | 1,865 multi-file tasks, avg 107 LOC across 4.1 files. the honest coding benchmark. confidence: high |
| GAIA (Princeton HAL) | **74.6%** | Claude Sonnet 4.5 | ~92% | Anthropic sweeps top 6 HAL spots. confidence: medium |
| GAIA (other variants) | 44.8 | GPT-5 Mini | — | leaderboard fragmentation — pick which one to trust carefully. confidence: medium |
| OSWorld | **82%** | Coasty (closed system) | ~72% | Claude Sonnet 4.6 at 72.5% essentially matches humans. confidence: high |
| WebVoyager | 87% | OpenAI CUA (deprecated) | — | stale — product shut down 2025-08-31 |
| AgentBench | maintained THUDM | — | — | aggregate hides per-env failures. confidence: medium |
| τ-bench (tool-calling reliability) | varies | — | — | useful for "does my agent loop reliably call the right tool" — not a leaderboard scorer |

**critical caveat**: Berkeley RDI demonstrated reward-hacking on **all 8 major benchmarks** on 2026-04-12. third-party Epoch AI / BenchLM scores are now the preferred reference. **the right answer for operators is: run your own held-out evaluation on your domain.** every public score should be discounted ~10-15 points for contamination + gaming.

## Build-your-own-agent — when to bypass frameworks

Vlad's Ch 30 thesis (use raw Anthropic SDK with a 60-line while loop) **gets stronger in May 2026, not weaker**. the evidence:

1. **OpenAI is converging toward this** — the new "model-native harness" in Agents SDK 0.14 is OpenAI conceding that the agent loop should live closer to the model, not in a framework on top.
2. **Anthropic's Managed Agents** explicitly let you write the agent loop yourself or have Anthropic host the runtime — they don't push you into a framework.
3. **Operator-grade insight from the community**: when something breaks in production, 60 lines of your own code is debuggable; 60k lines of someone else's CrewAI graph is not. this is now the dominant view in HN threads and the n8n "re-learn what AI agent dev tools are in 2026" post.
4. **the rule that's emerging**: single agent + 1-3 tools → use raw SDK with structured outputs. multi-agent + 5+ tools + durable state → use a framework (LangGraph, Mastra, Workflow DevKit). everything in between → still raw SDK, because the framework's value is below your engineering cost.

operators bypassing frameworks today: most YC W25-W26 batch agent companies, most Anthropic-platform shops, most Vercel-shop TS teams who can use AI SDK 6's lighter `streamText` + tool primitives without going full DurableAgent.

## Overhyped / skip-able

- **OpenAI Swarm** — folded into the Agents SDK. don't build new things on the standalone Swarm repo.
- **AutoGen (original)** — in maintenance mode. Microsoft has explicitly migrated to MAF. if you're starting today, start on MAF, not AutoGen.
- **LangChain (the old "chains" model)** — LangGraph is the future of that ecosystem; LangChain itself is increasingly a compatibility layer. don't build a new production agent on raw LangChain in 2026.
- **MCP-only agent stacks** — community signal: "MCP had a meteoric rise and then fizzled out." MCP is great as a *protocol* for tool exposure; it's not a framework. don't treat "MCP-everything" as a strategy.
- **Generic visual/no-code agent builders** — Gartner has agentic AI at the Peak of Inflated Expectations. 17% deployed vs 60% planning. most no-code builders that promised "describe your agent and we'll build it" have not shipped production reliability. n8n is the exception because it's workflow-first, not agent-first.

## Anthropic's agent stack — Vlad's primary platform

what shipped in 2026 that matters for Vlad's audience:

- **Claude Agent SDK** (renamed from Claude Code SDK in early 2026) — Python + TypeScript, same loop + tools + context management that powers Claude Code. rolling releases on `anthropics/claude-agent-sdk-python` and `-typescript`.
- **Managed Agents (public beta)** — 2026-04-08. Anthropic hosts the runtime + error recovery + execution. you keep using the standard `anthropic` SDK or `ant` CLI.
- **Memory files for Managed Agents** — 2026-04-23. persistent memory across sessions, mounted as `/mnt/memory/` directory inside the agent's container. read/write with the same bash + file tools the agent already uses. exportable, editable in Console or via API. **this is the biggest unlock** — the "stateless agent" problem is solved for Anthropic-platform shops.
- **Adaptive thinking** — on Opus 4.6 / Sonnet 4.6 / Mythos, `budget_tokens` deprecated in favor of `thinking: { type: "adaptive" }`. Claude decides when + how much to think. **automatically enables interleaved thinking** — every inter-tool reasoning step moves into a thinking block. preserved across turns by default. confidence: high.
- **Parallel tool calls** — Claude 4-line and Mythos have built-in token-efficient parallel tool use; recent fixes ensure sibling commands don't cancel on one failure, and the SDK no longer hangs on malformed parallel tool names.
- **Computer use** — production-tier on Pro/Max via Cowork + Claude Code (2026-03-23). 72.5% OSWorld on Sonnet 4.6 = at human baseline.
- **Files API, Skills (beta), MCP connector (beta), Web Search, Web Fetch, Code Execution, prompt caching, citations, batch** — all GA-or-beta surface as of May 2026.
- **Pricing change inbound**: starting 2026-06-15, Agent SDK + `claude -p` usage on subscription plans draws from a new monthly Agent SDK credit, separate from interactive usage limits. operators on Pro/Max need to plan for this.

honest read: Anthropic is now the **most operator-friendly platform** for new agent builds — the loop is exposed, the runtime is hostable both ways (yours or theirs), memory is solved, parallel + thinking are clean. CrewAI still wins for "I want a 4-agent crew with role-play, ready in 20 minutes." LangGraph still wins for "I have a known DAG and I want durable resumable state." but for "I'm a single operator and I want the best leverage per line of code" — Anthropic's the answer.

## Implications for the book

- **Ch 30** ("build your own agent" / raw SDK thesis) — **gets stronger**, doesn't need a rewrite, but worth a 2026 reality-check sidebar: Managed Agents + Memory files raise the floor of what you get from Anthropic without a framework.
- **Ch 33** (orchestration patterns) — needs the "hub-and-spoke wins, swarm loses" update, the Microsoft "start centralized" guidance, and the 70% production stat.
- **Ch 35** (computer use + browser agents) — needs the **OSWorld 72.5% milestone**, the **Operator shutdown** note, and reframing from "computer use is research preview" to "computer use is production-tier on Pro/Max."
- **Ch 36** ("Beyond Claude Code") — biggest rewrite candidate. AutoGen → MAF 1.0, OpenAI Swarm folded into Agents SDK 0.14, Mastra at 1.0 + YC graduation, Vercel Workflow DevKit / DurableAgent shipped, Inngest AgentKit deserves a row. **CrewAI's 47.8k stars + 12M daily executions + 150 enterprise customers** is too big to leave at the same depth as the others.
- **new note worth writing**: "the benchmark crisis of April 2026" — Berkeley RDI breaking all 8 majors, SWE-bench Verified contamination, the case for held-out per-domain evals. would slot before or alongside Ch 35-36.
- **chapter to strike entirely**: any standalone OpenAI Swarm or original AutoGen coverage. fold both into a one-paragraph "what got absorbed" note.

## TL;DR — 3 frameworks Vlad's audience should care about + 1 trap

1. **Anthropic Claude Agent SDK + Managed Agents + Memory** — Vlad's primary platform. now stateful, now production-tier, leverage per line of code is highest here.
2. **LangGraph** — the production/enterprise tier of the LangChain world. graph-based, durable, debuggable. if you have a known DAG and need pause/resume + observability, this is the bet.
3. **CrewAI** — fastest path from "I want a crew of agents" to shipped code. 12M daily executions and 150 enterprise customers don't lie. honest about its sweet spot: role-based, sequential-or-hierarchical, less ideal for fully dynamic routing.

**the trap: don't bet on Microsoft Agent Framework unless you're a .NET / Azure shop.** MAF 1.0 is real and production-ready, but for Vlad's audience (TS / Python / Anthropic-first operators) the gravitational pull of MAF will burn weeks on Azure-specific patterns that don't transfer. Microsoft's own migration guide is honest — MAF is for orgs already on Semantic Kernel or AutoGen. starting fresh in 2026? skip MAF.

## Sources

- [CrewAI Releases](https://github.com/crewAIInc/crewAI/releases)
- [CrewAI Changelog](https://docs.crewai.com/en/changelog)
- [CrewAI 47.8K stars + 2B agent runs](https://digitalbydefault.ai/blog/crewai-multi-agent-orchestration-2026)
- [CrewAI 44,335 stars surge](https://theagenttimes.com/articles/44335-stars-and-counting-crewais-github-surge-maps-the-rise-of-the-multi-agent-e)
- [LangGraph 1.0 GA announcement](https://changelog.langchain.com/announcements/langgraph-1-0-is-now-generally-available)
- [LangGraph release notes](https://github.com/langchain-ai/langgraph/releases)
- [LangChain State of AI Agents](https://www.langchain.com/state-of-agent-engineering)
- [Microsoft Agent Framework 1.0 GA](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/)
- [MAF migration from AutoGen / SK](https://devblogs.microsoft.com/agent-framework/migrate-your-semantic-kernel-and-autogen-projects-to-microsoft-agent-framework-release-candidate/)
- [Microsoft ships Agent Framework 1.0 — VS Magazine](https://visualstudiomagazine.com/articles/2026/04/06/microsoft-ships-production-ready-agent-framework-1-0-for-net-and-python.aspx)
- [OpenAI: Next evolution of Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/)
- [TechCrunch: OpenAI updates Agents SDK](https://techcrunch.com/2026/04/15/openai-updates-its-agents-sdk-to-help-enterprises-build-safer-more-capable-agents/)
- [OpenAI Agents SDK 0.14 deep dive](https://explore.n1n.ai/blog/openai-agents-sdk-0-14-sandbox-harness-2026-05-11)
- [Anthropic Memory for Managed Agents](https://www.edtechinnovationhub.com/news/anthropic-brings-persistent-memory-to-claude-managed-agents-in-public-beta)
- [Anthropic Memory beta — SD Times](https://sdtimes.com/anthropic/anthropic-adds-memory-to-claude-managed-agents/)
- [Claude Computer Use product page](https://tech-insider.org/anthropic-claude-computer-use-agent-2026/)
- [Anthropic Computer Use API docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- [Anthropic Memory Stack developer guide](https://caucasusbusinessjournal.com/news/claude-memory-apis-developer-guide-2026)
- [Anthropic Extended Thinking docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Anthropic Adaptive Thinking docs](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- [Anthropic release notes May 2026](https://releasebot.io/updates/anthropic)
- [Claude Agent SDK Python](https://github.com/anthropics/claude-agent-sdk-python)
- [Claude Agent SDK TypeScript](https://github.com/anthropics/claude-agent-sdk-typescript)
- [Agent SDK overview docs](https://code.claude.com/docs/en/agent-sdk/overview)
- [Vercel AI SDK 6 announcement](https://vercel.com/blog/ai-sdk-6)
- [Vercel Workflow DevKit](https://vercel.com/docs/workflows)
- [Vercel Workflow GitHub](https://github.com/vercel/workflow)
- [Building Durable AI Agents — Workflow DevKit](https://www.mintlify.com/vercel/workflow/ai/overview)
- [Mastra GitHub](https://github.com/mastra-ai/mastra)
- [Mastra YC profile](https://www.ycombinator.com/companies/mastra)
- [Mastra complete guide 2026](https://www.generative.inc/mastra-ai-the-complete-guide-to-the-typescript-agent-framework-2026)
- [Inngest AgentKit](https://agentkit.inngest.com/)
- [Inngest useAgent hook](https://www.inngest.com/blog/agentkit-useagent-realtime-hook)
- [SWE-bench leaderboards](https://www.swebench.com/)
- [SWE-bench Verified leaderboard llm-stats](https://llm-stats.com/benchmarks/swe-bench-verified)
- [SWE-bench Pro leaderboard Morph](https://www.morphllm.com/swe-bench-pro)
- [SWE-bench Pro Scale labs](https://labs.scale.com/leaderboard/swe_bench_pro_public)
- [Claude Mythos 93.9% breakdown](https://www.mindstudio.ai/blog/claude-mythos-benchmark-results-swe-bench)
- [GAIA leaderboard Princeton HAL](https://hal.cs.princeton.edu/gaia)
- [GAIA HuggingFace leaderboard](https://huggingface.co/spaces/gaia-benchmark/leaderboard)
- [Top 7 benchmarks that matter — MarkTechPost](https://www.marktechpost.com/2026/04/26/top-7-benchmarks-that-actually-matter-for-agentic-reasoning-in-large-language-models/)
- [AI agent benchmark results 2026 — Coasty](https://coasty.ai/blog/ai-agent-benchmark-results-2026-who-actually-wins-20260507)
- [OpenAI Computer-Using Agent](https://openai.com/index/computer-using-agent/)
- [OpenAI Operator review 2026 — Coasty](https://coasty.ai/blog/openai-operator-review-2026-20260504)
- [Agent orchestration patterns — Gurusup](https://gurusup.com/blog/agent-orchestration-patterns)
- [Conductor vs Swarm — Agix](https://agixtech.com/conductor-vs-swarm-multi-agent-ai-orchestration/)
- [Hub-and-spoke coordinator agents — Medium](https://medium.com/@anmjawad007/designing-coordinator-agents-hub-and-spoke-architectures-for-reliable-ai-workflows-3cb6831d4a49)
- [Multi-agent orchestration without buzzwords — Augment Code](https://www.augmentcode.com/guides/multi-agent-orchestration-architecture-guide)
- [Anthropic Agent SDK what ships vs what you build — Augment](https://www.augmentcode.com/guides/anthropic-agent-sdk-what-ships-vs-what-you-build)
- [Anthropic Managed Agents vs Agent SDK — Momentic](https://momenticmarketing.com/blog/anthropic-managed-agents-vs-agent-sdk)
- [AI Agent Frameworks 2026 — Morphllm](https://www.morphllm.com/ai-agent-framework)
- [Build agent from scratch 60-line loop](https://www.aibuilderclub.com/blog/how-to-build-ai-agent-from-scratch)
- [n8n: re-learn what AI agent dev tools are in 2026](https://blog.n8n.io/we-need-re-learn-what-ai-agent-development-tools-are-in-2026/)
- [Gartner 2026 hype cycle for agentic AI](https://www.gartner.com/en/articles/hype-cycle-for-agentic-ai)
- [Google ADK overview Vertex](https://docs.cloud.google.com/agent-builder/agent-development-kit/overview)
- [Google ADK Python repo](https://github.com/google/adk-python)
