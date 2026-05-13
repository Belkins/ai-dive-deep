# Community Claude Code skills — May 2026 state

> Survey of the public skills ecosystem. Real GitHub numbers pulled May 14, 2026 — where a number isn't verifiable, it's flagged. Researched for the Ultimate AI Dive Deep operator field manual.

## How big the ecosystem actually is

The skills space went from "a handful of Anthropic examples" in October 2025 to a tracked 1M+ community-published skills by May 2026. The signal is no longer "is anyone publishing?" — it's "which 8-12 should I install and how do I tell a real one from a vibe-coded one?"

Three forces are shaping the landscape right now:
1. **Anthropic seeded it** with `anthropics/skills` (Apache-2.0, 134k stars) which set the SKILL.md spec.
2. **A small set of operators built large opinionated stacks** — Garry Tan's `gstack` (95.7k stars) is the dominant single-author example.
3. **Aggregators bloomed** — five+ "awesome-claude-skills" repos now compete to be the index. The biggest are doing 37k–60k stars.

The reality underneath the star counts: a dev.to audit (Mar 26, 2026) of 214 community skills found **73% scored below 60/100** — vague descriptions, missing trigger phrases, no version field, prose walls instead of structured bodies. Most published skills don't actually fire reliably. This is the gap an operator-quality library can fill.

## Notable libraries

### anthropics/skills
- URL: https://github.com/anthropics/skills
- Stars: 134k
- Last commit: 34 commits on main; specific date not surfaced in fetch — recent (active)
- What's in it: Anthropic's reference implementation of the SKILL.md spec. Four buckets — creative/design, dev/technical, enterprise/comms, and document skills (docx/pdf/pptx/xlsx). Includes the `/spec` directory that defines the contract and a `/template` for new skills.
- Why it matters: This is the canonical spec. If a community skill doesn't match what's in `/spec` and `/template`, treat it as suspect.
- Voice match for Vlad's audience: medium — official, polished, but generic-corporate. Useful as reference, not as direct inspiration.

### garrytan/gstack
- URL: https://github.com/garrytan/gstack
- Stars: 95.7k
- Forks: 14.2k
- Last commit: Active, exact date not exposed
- What's in it: 23 specialist skills + ~14 power tools. The skills are roles, not utilities — /office-hours, /plan-ceo-review, /plan-eng-review, /design-review, /qa, /qa-only, /ship, /land-and-deploy, /canary, /investigate, /retro, /pair-agent, /cso, /benchmark, /document-release. Plus the power tools — /careful, /freeze, /guard, /learn, /autoplan, /codex, /open-gstack-browser, /gstack-upgrade.
- Why it matters: One operator's complete Claude Code setup, MIT-licensed. Largely co-authored with Claude itself. Tan claims 10k-20k LOC/day output while running YC full-time. This is the highest-credibility single-author skill stack in the ecosystem.
- Voice match for Vlad's audience: **high** — operator-as-product, opinionated defaults, "I use this every day" rather than "here's a generic library."

### Anthropic awesome-claude-code (hesreallyhim)
- URL: https://github.com/hesreallyhim/awesome-claude-code
- Stars: 43.6k
- Forks: 3.7k
- Last commit: Active — README notes it's being reorganized May 2026
- What's in it: The flagship community index. Skills, hooks, slash-commands, agent orchestrators, applications, plugins. Currently mid-restructure because the original TOC outgrew itself.
- Why it matters: Default discovery layer. Issue #833 references a `claude-skill-twitter` skill — the issues queue is where new skills get nominated for inclusion.
- Voice match for Vlad's audience: medium — index, not opinion.

### sickn33/antigravity-awesome-skills
- URL: https://github.com/sickn33/antigravity-awesome-skills
- Stars: 37.4k
- Forks: 6.1k
- Last release: v11.2.0 on May 13, 2026
- What's in it: 1,459+ skills, role-based bundles, installer CLI, web catalog. Multi-platform (Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity, Kiro, OpenCode, Copilot). 150+ named contributors.
- Why it matters: Biggest skill count by quantity. But quantity-over-quality is exactly what the dev.to audit flagged — assume a meaningful slice of these 1,459 are in the "73% below 60" bucket.
- Voice match for Vlad's audience: low — bulk catalog, weak curation signal.

### VoltAgent/awesome-agent-skills
- URL: https://github.com/VoltAgent/awesome-agent-skills
- Stars: 21.6k
- Forks: 2.3k
- Last commit: active, exact date not exposed
- What's in it: 1,100+ skills explicitly positioned as "real-world Agent Skills created by actual engineering teams, not mass AI-generated stuff." Official skills from Anthropic, Google Labs, Vercel, Stripe, Cloudflare, Netlify. Companion site officialskills.sh (300k monthly views) with a sponsor-logo model.
- Why it matters: The "curated, not bulk" alternative to antigravity-awesome-skills. The positioning itself is a tell — the ecosystem is now self-aware about AI-slop skills.
- Voice match for Vlad's audience: medium-high — curated, vendor-backed, operator-quality bias.

### alirezarezvani/claude-skills
- URL: https://github.com/alirezarezvani/claude-skills
- Stars: 14.7k
- Forks: 2k
- Last commit: March 4, 2026 (v2.0.0 release)
- What's in it: 268 production skills across 9 domains (Engineering Core, Engineering POWERFUL Tier, Playwright Pro, Self-Improving Agent, Product, Marketing, Project Management, Regulatory & Quality, C-Level Advisory). 305 stdlib-only Python CLI tools (zero deps). Includes a "Skill Security Auditor" for pre-install vetting and persona presets (Startup CTO, Growth Marketer, Solo Founder).
- Why it matters: Single-maintainer (Alireza Rezvani, @alirezarezvani) building structured, security-conscious, domain-segmented skills. The C-Level Advisory bucket and persona presets map closer to operator/founder workflow than to dev-only.
- Voice match for Vlad's audience: high — closest in shape to what an operator would actually want.

### Jeffallan/claude-skills
- URL: https://github.com/jeffallan/claude-skills
- Stars: 9k
- Forks: 754
- Last commit: May 1, 2026 (v0.4.14)
- What's in it: 66 skills across 12 categories — languages, backend/frontend frameworks, infra, APIs, testing, DevOps, security, data/ML, platform specialists. 366 reference files, 9 workflow commands.
- Why it matters: Tightly developer-focused — full-stack pair-programmer persona. Smaller, more disciplined than the 1000+ bulk repos.
- Voice match for Vlad's audience: low-medium — pure dev workflow, not operator workflow.

### ComposioHQ/awesome-claude-skills
- URL: https://github.com/ComposioHQ/awesome-claude-skills
- Stars: 59.6k
- Forks: 6.5k
- Last commit: active, not exposed
- What's in it: 1000+ skills curated by Composio (the SaaS-app-integration platform). Document processing, dev tools, data analysis, business automation, comms, creative, productivity, collab, security, plus app integrations *via Composio*.
- Why it matters: Vendor-owned aggregator. Tradeoff — high quality bar on the Composio-integrated ones, neutral on the rest. Worth watching specifically for "skill → SaaS tool" pairings.
- Voice match for Vlad's audience: medium — closer to operator integrations than pure dev.

### rohitg00/awesome-claude-code-toolkit
- URL: https://github.com/rohitg00/awesome-claude-code-toolkit
- Stars: 1.6k
- Forks: 508
- Last commit: March 2026 (per badge)
- What's in it: 135 agents, 35 curated skills (+ 400k via SkillKit), 42 commands, 176+ plugins, 20 hooks, 15 rules, 7 templates, 14 MCP configs, 26 companion apps. Cross-references gstack and similar.
- Why it matters: The "everything kitchen-sink" toolkit. Useful as a map of what's adjacent to skills — hooks, rules, MCP configs — when planning a holistic Claude Code setup.
- Voice match for Vlad's audience: low — overwhelming.

### trailofbits/skills
- URL: https://github.com/trailofbits/skills
- Stars: 5.2k
- Forks: 456
- Last commit: 113 commits to main, recent
- What's in it: Security-research-focused skills from Trail of Bits (a recognized security firm). Smart-contract audit, C-review, differential review, static analysis, semgrep rule creation, supply-chain risk audit, YARA authoring, constant-time analysis, mutation testing, property-based testing, zeroize audit, DWARF expert, Firebase APK scanner.
- Why it matters: First credible vendor-published, narrow-vertical skill repo. The "we already do this for paying clients, here's the skill version" signal — exactly the model the rest of the ecosystem will follow.
- Voice match for Vlad's audience: medium — proves the vendor-vertical pattern, even though the topic is niche.

### daymade/claude-code-skills
- URL: https://github.com/daymade/claude-code-skills
- Stars: 1k
- Forks: 159
- Last commit: not exposed
- What's in it: 52 production skills positioned as a "marketplace." Strong on macOS-flavored utilities — capture-screen, macos-cleaner, youtube-downloader, twitter-reader. Also doc-to-markdown, mermaid-tools, deep-research, financial-data-collector, competitors-analysis, terraform-skill, scrapling-skill, iOS-APP-developer, i18n-expert, ui-designer.
- Why it matters: Single-author, opinionated, scoped. Better quality signal than the 1000+ bulk repos.
- Voice match for Vlad's audience: medium.

### travisvn/awesome-claude-skills
- URL: https://github.com/travisvn/awesome-claude-skills
- Stars: 12.5k
- Forks: 1.3k
- Last commit: badge says "Last Updated: Feb 2026" — likely stale-ish
- What's in it: Curation list — official + community, plus comparison framework explaining skills vs prompts vs subagents vs MCP. Includes security guidance: "skills can execute arbitrary code, review before installing."
- Why it matters: Closest thing to a sensible primer for someone new to the ecosystem.
- Voice match for Vlad's audience: medium — explanatory, not opinionated.

## Public operators worth following

- **Garry Tan** — @garrytan on X, https://github.com/garrytan/gstack. YC president, 95.7k-star skill stack, daily output claims that read like LinkedIn bait but are partially backed by the public repo. The most-cited single operator.
- **Alireza Rezvani** — @alirezarezvani on GitHub, https://github.com/alirezarezvani/claude-skills. Building the most disciplined large-scale skill library with security tooling and persona presets. Closer to Vlad's audience than gstack is.
- **Ruben Hassid** — @ruben on Substack (ruben.substack.com), runs makemyskill.com. Non-developer-operator voice — Skills for LinkedIn posts, contracts, weekly reports. Audience = "I use AI daily, I'm not a coder." This is Vlad's audience profile.
- **Frank Andrade** — @thepycoach, runs the artificialcorner.com "We Built 70+ Claude Skills" piece (May 11, 2026) with seven co-writers. Strongest signal of small-collective skill curation rather than one-author or mega-aggregator.
- **Koen Stam** — GTMcraft Substack (koenstam.substack.com), "What 100+ operators get wrong about running Claude as infrastructure." Operator-as-infrastructure framing maps directly to Vlad's vocabulary.
- **thestack_ai** — @thestack_ai on dev.to. Published the 214-skill audit (Mar 26, 2026) and an MIT-licensed CLI (pulser) that scores skills against the spec. Gave the ecosystem its first quality benchmark.

## Over-saturated skill categories (already commoditized)

- **Commit message / PR description generators**: every aggregator has one; gstack's /review covers the higher-value end. Don't publish another.
- **Generic code-review skills**: at least 6 different "code review" skills across the top 4 libraries. Trail of Bits' security review is the only one with credibility-by-publisher.
- **Doc writers / README generators**: commoditized in `anthropics/skills` document family (docx/pdf/pptx/xlsx) plus 50+ community variants.
- **Test runners / scaffolders**: Jeffallan and gstack both ship strong versions; the bar to publish a new one is high.
- **Twitter/X thread writers**: at least 4 separate "viral threads" skills indexed across awesome-claude-* repos. All formulaic.
- **HN post optimizers**: even this niche is filled — JanBussieck/hn-skill ships built on 5 years of front-page data plus 157k Show HN analysis. Don't compete here.

## Under-served gaps (operator should write this)

- **Portfolio-CEO daily-briefing skill** that pulls from N project channels (Slack/Linear/GitHub/Stripe) and outputs a single morning brief, not a generic standup. Vlad already has the inputs — `health-pulse` + `daily` + `closeday` — but no public version exists that maps to "I run 5 companies." Closest analogs are SyncGTM's sales daily-briefing pieces, which are CRM-only.
- **Mentoring / coaching session lifecycle**: pre-session prep + during-session capture + post-session fan-out. The mentoring-lifecycle pattern Vlad already runs against the Obsidian vault has no public counterpart. Operators paying for coaches / running coaching businesses would install this immediately.
- **Demand-test runbook skill**: build landing page → wire Stripe Payment Link → instrument analytics → set decision date → fan out to fulfillment templates. Vlad's 10k mrr ideas portfolio is literally this — and no published skill walks the operator through it. Closest: gstack's /ship but it's deploy-only, not commercial.
- **Cross-trio audit (landing + day-1 + welcome email)**: already a Vlad skill, zero public versions. This is a productized-launch-quality safety net.
- **GTM "is this idea worth building" gate skill**: gstack's /office-hours is the closest, but it's design-focused, not demand-focused. Operator version would force-rank "demand evidence" before any code is written.
- **Operator newsletter pipeline**: aimaker.substack.com mentions running an entire newsletter inside Claude Code via skills, but doesn't publish the skills. A public newsletter-ops skill (idea → draft → fact-check → schedule → repurpose to LinkedIn/X) does not exist as an installable bundle in any of the top 6 repos checked.
- **Vendor-vertical skills like Trail of Bits**: that pattern (we already do this professionally, here's the skill version) is wide open for sales, recruiting, M&A diligence, deliverability auditing (Folderly), etc.

## Quality patterns — what "good" looks like in May 2026

Across the high-rated libraries and the dev.to audit, the convergent quality signals:

1. **Quoted trigger phrases in the description** — "use when the user says 'X'" beats "this skill helps with X." Adding trigger phrases raised audit scores by 20-35 points in a single edit.
2. **Folder + SKILL.md, never a flat .md** — root-level `.md` files don't register reliably with the skill loader; nest in a folder.
3. **20+ word description with concrete activation conditions** — sub-20-word descriptions failed in 41% of audited skills.
4. **2+ code blocks or worked examples in the body** — 55% of failing skills had zero code blocks. The fix is concrete examples, not more prose.
5. **Version field in frontmatter** — 62% of audited skills omitted it. Indicates the author treats the skill as a one-shot, not a maintained artifact.
6. **References directory** — top skills ship `references/` with worked-out patterns the SKILL.md links to. Keeps the SKILL.md under the 5k-token soft ceiling while making the supporting material discoverable.
7. **Opinionated, not generic** — gstack's voice ("CEO who rethinks the product, eng manager who locks architecture") outperforms generic "helps with engineering" wording.

## Anti-patterns — what to avoid when copying community skills

1. **Bulk AI-generated skill packs** (the 1,000+ libraries). High install count, low fire rate. Pulser-style audit before trusting.
2. **First-person voice in descriptions** ("I can help with X") — the skill matcher doesn't fire reliably on first-person.
3. **Wall-of-text SKILL.md bodies** — no headers, no lists, no examples. Claude can't extract the imperative.
4. **Skills with broad shell/MCP permissions** — security guidance from `travisvn/awesome-claude-skills` and recent Backslash/Checkmarx writeups: skills run with the same permissions as Claude Code. A skill with `--dangerously-skip-permissions` baked in is a credential exfil vector.
5. **Conditional logic in CLAUDE.md that should be in a skill** — global rules that only apply sometimes pollute every session. Move conditionals into mode-specific skills.
6. **Orphan skills** — described but never invoked because the trigger phrase is wrong or the description is unfindable. 20 out of 192 in the buildtolaunch.substack audit. Recompile/prune quarterly.
7. **Singleton .md files at the root** — drop these, use folders.
8. **Duplicate doctrine across multiple skills** — no single source of truth, output drifts. The buildtolaunch audit found 30 duplicate definitions in a 192-file setup.

## Cowork-integrated skills vs Claude Code-only skills

The divide is real but blurring. Anthropic's own positioning: skills work identically across Claude.ai, Claude Code, and the API — write once, run everywhere. In practice:

- **Claude Code-only** skills tend to assume filesystem access (Edit/Write/Bash) and a checked-in repo. gstack, Jeffallan, alirezarezvani all assume this.
- **Cowork-friendly** skills tend to pair with MCP connectors instead of bash — they read from Gmail/Slack/Notion/HubSpot/Stripe via MCP rather than a local `.env`. ComposioHQ's catalog is biased here; so are the SyncGTM and Summit53 sales-skill writeups.
- **Pure portability** is rare in practice. Most published skills assume *one* surface even when they could run on both. An operator publishing a skill in May 2026 should declare its surface in the SKILL.md description and test on both before claiming portability.

The Vlad-relevant gap: Cowork users still mostly install Claude Code skills and accept the filesystem-assumption mismatch. A *Cowork-first* operator skill library — designed against MCP connectors, no bash, no local repo — doesn't yet exist as a recognizable brand.

## Implications for the book

- **Existing chapters that benefit:**
  - Any chapter on Claude Code operator setup — gstack is now the canonical reference point; cite it directly.
  - Chapter on demand testing / launching — the absence of a public demand-test skill is the gap to claim.
  - Chapter on mentoring / advisory workflows — the mentoring-lifecycle pattern is genuinely novel publicly.
  - Any chapter on portfolio / multi-company operations — same as above.

- **New content to add:**
  - A standalone chapter: **"Skills you should steal (and the three you should write yourself)"** — frames gstack + Trail of Bits + alirezarezvani as the install-list, then teaches the operator how to publish their own vendor-vertical skill the way Trail of Bits published theirs.
  - **/resources page expansion:** add a "Top 5 skill libraries to install today" block plus a "Top 5 operators to follow on skills" block (Tan, Rezvani, Hassid, Andrade, Stam).
  - A research note (this file) feeds a future "state of the ecosystem May 2026" sidebar.
  - Sidebar: **"The 73% problem"** — the dev.to audit number is highly memorable and gives the chapter a quote-worthy stat.

## Sources

- https://github.com/anthropics/skills
- https://github.com/garrytan/gstack
- https://github.com/hesreallyhim/awesome-claude-code
- https://github.com/sickn33/antigravity-awesome-skills
- https://github.com/VoltAgent/awesome-agent-skills
- https://github.com/alirezarezvani/claude-skills
- https://github.com/Jeffallan/claude-skills
- https://github.com/ComposioHQ/awesome-claude-skills
- https://github.com/rohitg00/awesome-claude-code-toolkit
- https://github.com/trailofbits/skills
- https://github.com/daymade/claude-code-skills
- https://github.com/travisvn/awesome-claude-skills
- https://github.com/JanBussieck/hn-skill
- https://github.com/calef/us-federal-tax-assistant-skill
- https://dev.to/thestack_ai/i-audited-214-claude-code-skills-73-were-silently-broken-2m9a
- https://buildtolaunch.substack.com/p/claude-skills-not-working-fix
- https://ruben.substack.com/p/claude-skills
- https://artificialcorner.com/p/best-claude-skills
- https://koenstam.substack.com/p/what-100-operators-get-wrong-about
- https://aimaker.substack.com/p/claude-code-newsletter-agentic-system
- https://www.augmentcode.com/learn/garry-tan-gstack-claude-code
- https://www.mager.co/blog/2026-03-28-gstack-garry-tan-claude-plugin/
- https://www.syncgtm.com/blog/claude-code-gtm-skills-2026
- https://www.summit53.com/blog/claude-code-skills-sales-intelligence
- https://www.buildfastwithai.com/blogs/claude-skills-complete-guide-2026
- https://code.claude.com/docs/en/security
- https://checkmarx.com/learn/ai-security/claude-code-security-top-6-risks-controls-and-best-practices/
- https://adversa.ai/blog/claude-code-security-bypass-deny-rules-disabled/

---

## TL;DR — operator action items

**Three libraries Vlad should look at first (in priority order):**
1. **garrytan/gstack** — install the whole thing, then prune to the 8-12 that actually fire for portfolio-CEO work. Highest credibility, opinionated by a real operator, MIT-licensed.
2. **alirezarezvani/claude-skills** — closest to operator/founder shape, has the C-Level Advisory + Growth Marketer + Solo Founder persona presets that map to Vlad's actual workflow. Plus a Skill Security Auditor.
3. **trailofbits/skills** — not for the security topic, but as a *publishing pattern* to copy. "We already do this professionally, here's the skill version" is the model Belkins / Folderly / LinguaLive should each adopt.

**Two gaps Vlad could fill himself (publish-worthy, brand-aligned):**
1. **Portfolio-CEO daily-briefing skill** — multi-company morning brief pulled from N MCP sources. Vlad already runs the pattern via `health-pulse` + `daily`. No public version exists. Brand fit: belkins / portfolio operator.
2. **Mentoring lifecycle skill** — pre-session prep + during-session capture + post-session fan-out. Mentees + coaches + advisors + agencies would install immediately. Brand fit: Vlad's mentoring practice + the broader advisory market.
