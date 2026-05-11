# Chapter map for retitling — all 36 chapters

Each row: number, slug, current title, current subtitle, one-line "what it actually
teaches" (the navigation-honest summary). Agents producing alternative title systems
should read THIS file as input — it's the canonical map.

| # | Slug | Current title | Current subtitle | What it actually teaches |
|---|---|---|---|---|
| 01 | 01-killed-my-tabs | The Day I Killed My Tabs | A Tuesday morning that changed how I work. | Why operators should treat AI as an OS, not a chatbot; the morning briefing that killed 40 open tabs. |
| 02 | 02-five-tools | Five Tools, Not Fifty | Five tools, eighty percent of my output. The kitchen brigade. | The five-tool AI stack (Claude CC + Cowork, Gemini, ChatGPT/Codex, ElevenLabs); routing rules per task. |
| 03 | 03-temp-agency | AI Is A Temp Agency, Not A Genius | Why every Claude session is a fresh employee on day one. | The mental model: instances are stateless temps; continuity is artifacts not brains. |
| 04 | 04-the-vault | The Vault: Where AI Becomes Useful | Obsidian, neuron logic, and the second brain that makes AI durable. | Setting up Obsidian as AI working memory; CLAUDE.md, daily notes, neuron logic. |
| 05 | 05-skills | Skills: Recipes The Chef Reads Before Cooking | Recipe cards the chef reads before cooking. | What a skill IS — folder + SKILL.md; why descriptions are 80% of the work; three patterns. |
| 06 | 06-the-swarm | The Swarm | Stop doing things sequentially. The fan-out is the unlock. | Spawning subagents in parallel; fan-out / pipeline / map-reduce / adversarial patterns. |
| 07 | 07-cron | Cron: Make AI Work While You Sleep | How to make AI work while you sleep. | Scheduled tasks; pull vs push reframe; my scheduled stack; cron syntax + design checklist. |
| 08 | 08-three-doors | Three Doors to Claude | Chat, Cowork, Code — same engine, three vehicles. | Choosing between Chat / Cowork / Claude Code per task; decision tree. |
| 09 | 09-dont-get-owned | Don't Get Owned | The blast-radius mental model. | Security: API key hygiene, prompt injection, blast radius, sandboxing, incident response. |
| 10 | 10-wild-stuff | The Wild Stuff | Agents, local models, and what I'd do tomorrow morning. | Hosted vs self-hosted agents, Rick platform, local models (Ollama/LM Studio), the world-class travel prompt. |
| 11 | 11-build-a-skill | How to Build a Skill, End to End | How to build a skill end-to-end, in code. | Building the morning-briefing skill from scratch — frontmatter, body, scripts, anti-patterns, test loop. |
| 12 | 12-connectors-mcp | Connectors and MCP | Types of connectors, how to install, and how to write your own. | MCP protocol, connector taxonomy, install paths for Cowork + CC, 50-line custom server. |
| 13 | 13-quickstart | The 10-Minute Quickstart | From zero to first task in under ten minutes. | Install Claude Code in 10 minutes; first run, /init, approve/reject loop, first MCP server. |
| 14 | 14-cheat-sheet | Slash Commands & The Cheat Sheet | Slash commands, settings, and the keys you actually press. | Every Claude Code slash command, settings keys, env vars, file paths, keyboard shortcuts. |
| 15 | 15-permissions | Permissions, Sandboxes, and the Sharp Edges | Permissions, sandboxes, and the foot-gun named --dangerously-skip-permissions. | Permission model, allow/deny rules, sandboxing with Docker/devcontainer, when to skip permissions safely. |
| 16 | 16-hooks-subagents | Hooks and Subagents | How to turn Claude Code from autocomplete into a coworker. | PreToolUse / PostToolUse / Stop hooks, format-on-save, custom subagents with tool allow-lists. |
| 17 | 17-tips-tricks | Tips, Tricks, and Hard-Won Wisdom | Twenty-five operator tips you only learn at hour two hundred. | 25 tips across context, cost, permissions, skills/hooks/swarms, workflow. |
| 18 | 18-headless-ci | Headless, CI, and Claude in Production | How to run Claude in production: headless, cron, GitHub Actions. | claude --print, output formats, CI integration, the 24/7 monitor pattern, cost discipline. |
| 19 | 19-build-products | How to Build Products With AI | From idea to deployed URL in a single Saturday. | Shipping a product in one Saturday: PRD, repo, MVP swarm, deploy, the "Not Done" list. |
| 20 | 20-terminal-windows | Terminal Windows | tmux, named sessions, worktrees — running 6 Claudes without losing your mind. | Multi-session ops with tmux + named sessions + git worktrees; running 6 Claudes concurrently. |
| 21 | 21-three-modes | Interactive, Plan, Auto | Knowing which mode you are in is half the discipline. | The three CC modes; when to use each; mode-picker rubric (cost × steps × awake). |
| 22 | 22-sessions | Session Management | Resume, replay, fork — the right way to re-enter work. | --continue vs --resume, /clear vs /compact, forking, session-as-filesystem. |
| 23 | 23-vibe-coding | Vibe Coding | A real Saturday build, hour by hour, with the misfires kept in. | Hour-by-hour vibe-coded Saturday: $72, 6 bugs, MP3 in iCloud. The full receipt version of Ch 19. |
| 24 | 24-tier-list | The Tier List | Vlad rates every AI tool, connector, and adjacent tool he uses. | S/A/B/C/D/F rankings across AI tools, MCP connectors, infra. Honest tier list. |
| 25 | 25-evals-or-hope | Evals or Hope, Pick One | If you don't have evals, you don't have a workflow — you have a prayer with a Slack channel. | Writing your first eval; smoke / regression / golden / adversarial; running on cron; the 30-min starter. |
| 26 | 26-team-adoption | Getting Twelve People to Use This | Single-operator AI is easy. Team AI is a change-management problem dressed up as a tooling problem. | Team adoption: 4-3-2-2-1 distribution, team vs personal CLAUDE.md, skills as policy. |
| 27 | 27-voice-agents | Voice Agents, Phone Number to Production | Why every voice-agent demo is a lie about latency and what a real stack costs. | STT → LLM → TTS architecture; latency budget; Twilio / ElevenLabs / Deepgram; cost per minute. |
| 28 | 28-failure-receipts | The Receipts I'd Rather Not Show You | Six failures, six bills, six things the demo videos won't tell you. | 6 real failures with dollar amounts: recursion bill, wrong vault, exfil, DDoS-your-laptop, migration break, silent subagent. |
| 29 | 29-cost-economics | The Bill, Demystified | Token math, prompt caching, batch API, model routing — what actually moves your invoice. | Prompt caching contract, batch API, model routing for cost, token economics at production scale. |
| 30 | 30-sdk-direct | Building With the Anthropic SDK Directly | When Claude Code and Cowork stop being the answer and you have to write 30 lines of Python. | Using anthropic SDK directly; tool use, prompt caching, streaming/retries; Vercel function deploy. |
| 31 | 31-stages | The Stages: Ideation to Deploy | Six stages. One Saturday. The order matters more than the speed. | Six-stage shipping framework: ideation → foundation → creation → polishing → security → deploy. |
| 32 | 32-archetypes-rick | How to Build Rick | OpenClaw, NemoClaw, Hermes — pick a preset, the agent shows up dressed for the job. | Rick agent platform; archetypes per use case (sales/research/ops); graduation to CC subagents; cost model. |
| 33 | 33-browser-agents | Browser Agents: Login, Click, Scrape, Post | When the connector doesn't exist and the workflow lives on a webpage. | Playwright + Claude pattern; login flows; CAPTCHA reality; ToS lines; kill switch; 50-line example. |
| 34 | 34-write-on-behalf | Writing On Your Behalf, Without Becoming a Bot | Voice clones, persona agents, and the four lines you should never let an agent cross. | Persona agents that draft in your voice; four hard NEVERs; approval gate; audit log requirement. |
| 35 | 35-codex-and-cc | Codex × Claude Code | They're not competing. They're shifts. | Codex (night-shift) + Claude Code (day-shift) running together; shared .mcp.json + CLAUDE.md; cost. |
| 36 | 36-frameworks-beyond | Frameworks Beyond Claude Code | When CC's subagent system stops being the answer and you have to architect a graph. | When to leave CC; CrewAI handoffs; LangGraph state machines; Anthropic SDK as floor; build-vs-buy. |

## Voice context (for the agents)

This is Vlad Podoliako's field manual for operators. His VOICE is punchy, lowercase tendencies, em-dashes, real numbers. The CURRENT titles ("The Day I Killed My Tabs") are evocative and great for readers in long-form, but bad when someone is scanning the chapter grid or Cmd-K trying to find "how do I use cron." We're producing alternative title systems that prioritize **scannability** without sacrificing the voice.
