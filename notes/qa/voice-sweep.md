# Voice sweep — Wave A content

Reviewed: Ch 38, Ch 39, top 3 research notes (Mythos / Berkeley / CVE), and 9 sharpen edits (Ch 9, 14, 21, 24, 25, 30, 33, 35, 36).

Scope: NEW content only. Voice rules: lowercase tolerant, em-dashes as breath marks, real numbers, clipped sentences, no LinkedIn cadence, no banned words, anti-takeaway closers.

---

## Ch 38 — Run Until Done (38-run-until-done.mdx)

### Banned words
- None found. Clean.

### Long sentences (>24 words)
- **Line 18:** "Mechanical work. Boring work. The kind I usually start, get bored of at file 4, and walk away from until the deadline hisses." — last sentence is 22 words, technically within limit, but borderline. Pass.
- **Line 20:** "I typed `/goal all references to claude-3-5-sonnet in this repo are replaced with claude-opus-4-7, tests pass, the diff lives on a branch named model-bump, or stop after 30 turns`." — 33 words but it's a single quoted prompt command. Quoted commands are exempt from clip rule. Pass.
- **Line 24:** "Forty-one turns later I killed it manually because the agent was looping on the same three hypotheses, the evaluator kept saying 'not yet — cause not isolated,' and I'd spent $11 to learn nothing." — **35 words.** Suggested split: "Forty-one turns later I killed it manually. The agent was looping on the same three hypotheses, the evaluator kept saying 'not yet — cause not isolated,' and I'd spent $11 to learn nothing." [LOW]
- **Line 32:** "After every turn, a small fast model — Haiku 4.5 by default per `/en/model-config` — inspects the conversation transcript and judges whether the condition holds." — **26 words.** Mild overrun, em-dash structure earns some grace. Suggested split: "After every turn, a small fast model — Haiku 4.5 by default per `/en/model-config` — inspects the transcript. It judges whether the condition holds." [LOW]
- **Line 52:** "Use this when you want determinism — 'stop when this script returns 0' — rather than a model judging the transcript." — 22 words. Pass.
- **Line 64:** "A `/goal` session can have Stop hooks firing alongside it — the goal evaluator decides whether to take another turn, the Stop hook still runs after each turn and can format files, post Slack, draft commit messages, whatever." — **38 words.** Suggested split: "A `/goal` session can have Stop hooks firing alongside it. The goal evaluator decides whether to take another turn — the Stop hook still runs after each turn and can format files, post Slack, draft commit messages, whatever." [MEDIUM]
- **Line 74:** "You can run all three at once and the result is an agent that proposes, executes, and self-terminates without you in the loop until the deliverable is real." — **28 words.** Suggested split: "Run all three at once. The result is an agent that proposes, executes, and self-terminates — without you in the loop until the deliverable is real." [LOW]
- **Line 150:** "If you ran the evaluator on Opus, a 30-turn `/goal` session would add $13.50 in eval cost on top of the $13.50 in main-turn cost." — 25 words. Borderline. Pass.
- **Line 152:** "The first day I had `/goal`, I tried to force the evaluator to Opus through a custom hook config (I will not explain how — it was a bad idea)." — 28 words but the parenthetical clip earns it. Pass.
- **Line 173:** "I opened the live URL and the checkout button 500'd because the agent had pushed without re-running the build after a last-minute env var rename." — **26 words.** Borderline; flow earns it. Pass.
- **Line 173:** "The page was live, the customers were locked out, and the receipt was a deploy log timestamped 5:58:14 PM with green check marks next to every step the agent watched itself complete." — **32 words.** Suggested split: "The page was live, the customers were locked out, and the receipt was a deploy log timestamped 5:58:14 PM. Green check marks next to every step the agent watched itself complete." [MEDIUM]
- **Line 175:** "Pair every clock condition with a quality one — 'ship by 6pm AND the live URL returns 200 AND the checkout flow completes a test transaction' — or don't write a clock condition at all." — **34 words.** Pull-quote style, em-dash structure. Pass — voice intentional.

### Influencer cadence
- None found. No "Here's the thing", no "I've been thinking", no "Let me tell you".

### Generic openings
- **Line 16 ("Tuesday, May 12, 8:47 AM"):** time-stamped scene opener. Conforms.

### Closer drift
- **Lines 171-177:** "What I got wrong" — names a specific mistake (shipping a 500-erroring checkout at 5:58 PM because the goal was clock-shaped, not quality-shaped). Anti-takeaway. Conforms.

### Hyphens that should be em-dashes
- None found — diff hyphens are inside code blocks (`claude-3-5-sonnet`, `claude-opus-4-7`, `--max-warnings`, `--noEmit`) which is correct usage.

### Missing real numbers
- All claims have receipts: $0.04, $3.12, $11, 12 turns, 18 minutes, 30 turns, 8 turns, 20 turns, 47-turn session $20→$42, 5:58 PM, 6:11 PM. Clean.

### Other voice issues
- **Line 26:** "If you can't measure done, you can't run until done." — chapter thesis line, intentional repetition. Pass.
- **Line 62 (PullQuote):** "/goal removes per-turn prompts the way auto mode removes per-tool prompts. it's the same wedge, one level up." — lowercase 'it's' after period is intentional Vlad style. Conforms.
- **Line 152 (parenthetical):** "(I will not explain how — it was a bad idea)" — strong voice. Conforms.

---

## Ch 39 — Skills You Should Steal (39-skills-you-should-steal.mdx)

### Banned words
- None found. No "amazing", "incredible", "powerful", "game-changer", "revolutionary", "thrilled", "best-in-class", "cutting-edge".

### Long sentences (>24 words)
- **Line 18:** "It's Saturday morning, May 9, 2026. Coffee on the desk, no calls until Monday, and I'm doing the thing I told myself I'd do for a month — sit down and audit the community <GlossaryTerm term="Skill">skills</GlossaryTerm> ecosystem I'd been hearing about every other podcast." — second sentence is **42 words.** Suggested split: "Coffee on the desk, no calls until Monday. I'm doing the thing I told myself I'd do for a month — sit down and audit the community skills ecosystem I'd been hearing about every other podcast." [MEDIUM]
- **Line 20:** "One fires when I didn't want it to, mid-newsletter draft, and rewrites three paragraphs into a generic LinkedIn voice." — 19 words. Pass.
- **Line 20:** "Another has `allowed-tools: ['*']` in its frontmatter and I notice that line about ninety seconds too late — more on that at the end of this chapter." — **27 words.** Borderline; flow earns it. Pass.
- **Line 39:** "Star count measures how many people clicked 'I want this.' It does not measure whether the thing fires." — 17 words. Pass.
- **Line 47:** "The reference implementation of the SKILL.md spec, four buckets (creative/design, dev/technical, enterprise/comms, docs), plus the `/spec` and `/template` directories that define the contract." — **24 words** at limit. Pass.
- **Line 48:** "Twenty-three specialist skills plus ~14 power tools — `/office-hours`, `/plan-ceo-review`, `/qa`, `/ship`, `/canary`, `/retro`, `/careful`, `/guard`." — list, fragment voice. Pass.
- **Line 49:** "The flagship community index — skills, hooks, slash-commands, agent orchestrators, applications, plugins. Currently mid-restructure because the original TOC outgrew itself." — fragment OK. Pass.
- **Line 54:** "1,459+ skills, role-based bundles, installer CLI, web catalog, multi-platform (Claude Code, Cursor, Codex CLI, Gemini, Antigravity, Kiro, OpenCode, Copilot)." — list fragment. Pass.
- **Line 60:** "Includes the security guidance line every primer should have: *'skills can execute arbitrary code, review before installing.'*" — 17 words. Pass.
- **Line 71:** "YC president, gstack maintainer, daily output claims that read like LinkedIn bait but are partially backed by the public repo." — 21 words. Pass.
- **Line 74:** "The strongest signal of small-collective curation rather than one-author or mega-aggregator." — 13 words. Pass.
- **Line 98:** "Every morning, I want one Slack DM that pulls HubSpot deal motion across all five, Gong signals from yesterday's calls, calendar conflicts for today, Stripe anomalies overnight, and any Sentry / Vercel deploy receipts that drifted red." — **38 words.** This is a list-shape sentence; comma-splice voice. Borderline pass but consider split: "Every morning, I want one Slack DM. It pulls HubSpot deal motion across all five, Gong signals from yesterday's calls, calendar conflicts for today, Stripe anomalies overnight, and any Sentry / Vercel deploy receipts that drifted red." [LOW]
- **Line 117:** "Each session has pre-session prep (last week's notes, action tracker, patterns file, agenda generation), during-session capture (structured notes against a four-frame template), post-session fan-out (summary, action tracker update, patterns refresh, next session scheduled)." — **34 words.** Parenthetical-stacked, list-shape. Voice intentional but consider split: "Each session has pre-session prep — last week's notes, action tracker, patterns file, agenda generation. During-session capture against a four-frame template. Post-session fan-out — summary, action tracker update, patterns refresh, next session scheduled." [LOW]
- **Line 125:** "every paid product I ship has three customer-touching surfaces — the landing page (where money moves), the day-one fulfillment page (what they see after purchase), the welcome email (what hits their inbox)." — **31 words.** Em-dash-structured list. Voice OK; consider split if tightening: "every paid product has three customer-touching surfaces. The landing page (where money moves), the day-one fulfillment page (what they see after purchase), the welcome email (what hits their inbox)." [LOW]
- **Line 156:** "Two prompts later, in a session where I'd asked Claude to clean up some scratch files, the skill fired against a phrase that wasn't in its description, picked up a `Bash(rm)` it had no reason to invoke, and ran it against a path inside my Obsidian vault before I caught it on the receipts." — **52 words.** Suggested split: "Two prompts later, I asked Claude to clean up some scratch files. The skill fired against a phrase that wasn't in its description, picked up a `Bash(rm)` it had no reason to invoke, and ran it against a path inside my Obsidian vault. I caught it on the receipts." [HIGH — clearest run-on in Wave A]
- **Line 158:** "A 95k-star repo and a 95-star repo both run with your permissions once they fire." — 16 words. Pass.

### Influencer cadence
- None found.

### Generic openings
- **Line 16 ("Saturday, 10:42 AM, six tabs"):** time-stamped scene. Conforms.

### Closer drift
- **Lines 154-168:** "What this Saturday cost me" — names a specific mistake (the wildcard `allowed-tools: ['*']` skill that ran `Bash(rm)` against the vault). Anti-takeaway closer. Conforms.

### Hyphens that should be em-dashes
- Line 142: "Smart-contract audit. Semgrep rule creation. Differential review. YARA authoring." — hyphens here are compound modifiers, correct.
- All em-dashes used correctly. No `--` found.

### Missing real numbers
- All major claims have numbers: 73%, 214 skills, 60%, 41%, 62%, 55%, 134k, 95.7k, 43.6k, 59.6k, 37.4k, 21.6k, 14.7k, 12.5k, 5.2k stars; 1000+, 1459+, 1100+, 268, 70+ skills; 300k monthly views. Strong.

### Other voice issues
- **Line 71:** "daily output claims that read like LinkedIn bait" — strong voice. Conforms.
- **Line 73:** "Closest published voice to where this book lives." — clipped fragment. Conforms.
- **Line 168:** "The receipts will update. The audit habit won't." — clipped closing. Conforms.

---

## Research notes — top 3 entries (research-notes.ts)

### Entry 1: Mythos (lines 16-44)

#### Banned words
- None.

#### Long sentences (>24 words)
- **Line 23 (takeaway):** Entire takeaway is one paragraph of long sentences. Notable runs:
  - "Operators who built directly on the Anthropic SDK (Ch 30) absorb the Mythos upgrade with a one-line config change." — 19 words. Pass.
  - "Operators who built on heavier frameworks (CrewAI, LangGraph, Microsoft Agent Framework) wait for the framework to ship Mythos support — usually 2-6 weeks behind." — **24 words.** Borderline. Pass.
  - "And the June 15 deprecation cliff for claude-sonnet-4 / claude-opus-4 is the harder forcing function — Mythos may or may not ship before that date." — 26 words. Pass.

#### Influencer cadence
- None.

#### Generic openings
- Takeaway opens with "At Code with Claude 2026 (May 6), Anthropic publicly conceded..." — date-stamped, specific. Conforms.

#### Closer drift
- Research notes don't have closers in the chapter sense. Implications act as the closer surface; they're operator-action shaped. Conforms.

#### Other voice issues
- **Line 23:** "The lesson the model landscape keeps teaching: the closer you are to the SDK, the faster you move." — strong epigram. Conforms.

### Entry 2: Berkeley RDI (lines 45-72)

#### Banned words
- None.

#### Long sentences (>24 words)
- **Line 51 (takeaway):** "On April 12, 2026, Berkeley RDI released a paper demonstrating reward-hacking attacks against eight major agent benchmarks — SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, and two others." — **27 words.** List structure, em-dash carries it. Pass.
- "The pattern: agents detected which environment they were in (test signature, file structure) and adjusted strategies accordingly." — 17 words. Pass.
- "Caveats: not every score gain is reward-hacking, and not every benchmark is equally gameable — OSWorld held up better than SWE-bench Verified per the paper." — 25 words. Borderline pass.
- "This is the third independent confirmation of the same eval gap — DELEGATE-52 from the technical side (content drift), 81k interviews from the user side (unreliability at 26.7%), Berkeley RDI from the benchmark side (gaming)." — **34 words.** List-style with em-dash, voice intentional. Pass.
- **Line 55 (implication):** "For agent framework selection, weight production case studies (named companies, real workflows) higher than benchmark scores. CrewAI claiming 12M daily executions across 150 enterprises is a stronger signal than any leaderboard number." — second sentence 27 words. Borderline. Pass.
- **Line 57:** "Anthropic's Sonnet 4.6 at 72.5% on OSWorld is the current production-realistic number to anchor on — partly because OSWorld is harder to game than the others (per the paper), partly because Anthropic published the number on its own product page." — **38 words.** Suggested split: "Anthropic's Sonnet 4.6 at 72.5% on OSWorld is the current production-realistic number to anchor on. Partly because OSWorld is harder to game than the others (per the paper), partly because Anthropic published the number on its own product page." [LOW]

#### Generic openings / closer drift / influencer cadence
- None.

#### Other voice issues
- **Line 49 (tagline):** "Agents didn't get smarter. They learned to game the tests. Evals are structural, benchmarks are gameable." — strong clipped voice. Conforms.
- **Line 51:** "Three methods, one answer: evals or hope, pick one." — closer epigram. Conforms.

### Entry 3: CVE-2026-30623 (lines 73-103)

#### Banned words
- None.

#### Long sentences (>24 words)
- **Line 79 (takeaway):** "~200,000 MCP servers across the public registries are vulnerable to STDIO command injection — by design, the STDIO transport can execute arbitrary OS commands, and the registries weren't gating malicious packages." — **30 words.** Strong voice, em-dash + comma-splice intentional. Pass.
- "Anthropic confirmed the underlying behavior is by-design (sanitization is the developer's responsibility) and declined to modify upstream — the fix lives at the registry layer and in operator discipline." — **29 words.** Pass — fact-dense.
- "Pin SKILL.md versions to commit SHAs, not tags. Pin MCP server commit hashes in .mcp.json. Read every line of an imported skill before activation. Audit .mcp.json configurations the same way you'd audit package.json — every server that runs in your context can run arbitrary commands." — last sentence is **30 words.** Borderline; receipt-dense. Pass.
- "The days of npx <random-mcp> from untrusted authors are over, and the days of installing a community skill without diff-reading it never really started." — 25 words. Pass.
- **Line 83 (implication):** "Use a hook (extend HOOK_SECRETS_SCAN or write a sibling) to block Write/Edit when a SKILL.md change pulls in new allowed-tools entries you haven't approved." — 24 words. Pass.

#### Generic openings / closer drift / influencer cadence
- None.

#### Other voice issues
- **Line 77 (tagline):** "Pin your skill versions. Audit the MCP servers you wire. The supply chain is the new attack surface." — clipped triplet. Conforms.

---

## Sharpen edits — Ch 9 (MCP supply chain section)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 92 (new content, "Here's the receipt that changes the threat model. In April 2026..."):** "Anthropic's response was the part operators need to absorb: by design, fix-at-registry, sanitization is the developer's responsibility." — 17 words. Pass.
- "Treat third-party MCP servers like you'd treat an npm dependency in 2018: assume nothing, audit something." — 16 words. Pass.
- **Line 94:** "Audit `.mcp.json` server configs the same way you'd audit `package.json` dependencies: who's the maintainer, when was the last commit, what does the server actually have access to." — **26 words.** Em-dash/colon list structure. Pass.
- "For portfolio companies, the cleaner play is mirroring the official MCP registry internally — Anthropic designed the new registry preview to be mirror-able for exactly this reason." — **26 words.** Borderline pass.

### Influencer cadence
- **Line 92:** "Here's the receipt that changes the threat model." — **FLAG.** This opens with "Here's the receipt..." which echoes the banned "Here's the thing" pattern. It's softer (specific noun "receipt" vs. abstract "thing") and may be intentional Vlad voice, but worth review. [LOW — borderline]
  Suggested alternative if rewriting: "In April 2026, OX Security disclosed CVE-2026-30623 — and the threat model shifted."

### Generic openings
- Section is mid-chapter (not opening), so opening-rule doesn't apply.

### Closer drift
- Final paragraph (line 96): "The ledger shifted. Skill installs and MCP wiring are supply-chain operations now, not feature toggles. The same care you take with `package.json` is the floor — the ceiling is treating every connector as a contractor with your keys." — strong, names the shift, ends with concrete metaphor. Conforms.

### Hyphens that should be em-dashes
- None found. All em-dashes correct.

### Missing real numbers
- "roughly 200,000 publicly accessible MCP servers", "Nine out of eleven public MCP registries", "April 2026". Solid.

### Other voice issues
- Clean section. The single "Here's the receipt..." opener is the only mild flag.

---

## Sharpen edits — Ch 14 (May 2026 surface section)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 83:** "Sets a finish-line condition, runs turn after turn, and a small fast model (Haiku 4.5) inspects the transcript after every turn to check whether the condition holds." — **27 words.** Borderline; technical description. Suggested split: "Sets a finish-line condition, runs turn after turn. A small fast model (Haiku 4.5) inspects the transcript after every turn to check whether the condition holds." [LOW]
- "Stops itself when satisfied; aliases for clear include `stop`, `off`, `reset`, `cancel`." — 12 words. Pass.
- **Line 85:** "Single CLI surface showing every background session (running, blocked, done), dispatch new sessions inline." — 14 words. Pass.
- **Line 89:** "Some are bundled skills, some built-ins; verify in your version." — 10 words. Pass.
- "Highlights: `/batch` decomposes a large change into worktree-isolated subagent jobs (the multi-agent fan-out command), `/ultrareview` runs a cloud-sandbox multi-agent review with 3 free runs/month on Pro and Max, `/rewind` rolls both chat and files back to a previous point." — **38 words.** List-of-three structure with parentheticals. Suggested split: "Highlights: `/batch` decomposes a large change into worktree-isolated subagent jobs (the multi-agent fan-out command). `/ultrareview` runs a cloud-sandbox multi-agent review with 3 free runs/month on Pro and Max. `/rewind` rolls both chat and files back to a previous point." [LOW]
- **Line 91:** "Check your version (`claude --version`) before relying on any specific one — the names sometimes outlive the implementations and vice versa." — 21 words. Pass.

### Influencer cadence
- None.

### Generic openings
- Section header "May 2026 surface — what shipped since Edition 1" is voice-appropriate (date-stamped, receipt-shaped). Conforms.

### Closer drift
- Not a chapter closer (mid-chapter). Last line "the names sometimes outlive the implementations and vice versa" lands as voice-style. Conforms.

### Hyphens that should be em-dashes
- None.

### Missing real numbers
- Strong: "2026-05-11, Claude Code v2.1.139", "2026-04-01, v2.1.90", "2026-04-10, v2.1.101", "Option+P (Mac) / Alt+P (Linux/Windows)", "3 free runs/month".

### Other voice issues
- **Line 90:** "Cosmetic but real if you live in Cowork." — clipped, voice-consistent. Conforms.

---

## Sharpen edits — Ch 21 (Mode 4 section)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 152:** "The fourth mode shipped May 11, 2026 in Claude Code v2.1.139, and it's a different category of move than the first three." — 23 words. Pass.
- "Anthropic's own framing in the docs is the clean version: 'auto mode removes per-tool prompts, and `/goal` removes per-turn prompts.'" — 20 words (with the quote). Pass.
- "That's a stack, not a choice. Plan → approve the plan → Auto → don't approve each tool → `/goal` → don't approve each turn." — clipped sequence, intentional. Conforms.
- **Line 154:** "After the turn, a small fast model (Haiku 4.5 by default) reads the transcript and judges whether the condition holds." — 21 words. Pass.
- "A live overlay labeled `◎ /goal active` shows elapsed time, turns evaluated, tokens spent." — 14 words. Pass.
- "One goal per session. Setting a new one replaces the old. `/goal clear` (aliases `stop`, `off`, `reset`, `cancel`) kills it." — fragment voice. Conforms.
- **Line 156:** "Same shape for 'all P0 issues labeled `auth` are closed' or 'the auth migration in `src/auth/*` compiles under strict tsc, and no file outside `src/auth/` has been modified.'" — **27 words** (a single quoted condition). Quoted command, exempt. Pass.
- **Line 158:** "Open-ended `/goal` conditions create vibe-eval loops — 'make the code better' never converges, 'the docs are good' is interpretation, and Haiku will happily decide 'not yet' forever while burning your budget." — **31 words.** Strong voice; em-dash + comma-splice. Pass.
- "If the test runs in a subprocess whose stdout doesn't bubble back, the evaluator never sees pass/fail and you loop forever." — 22 words. Pass.
- "Put a stop clause in the condition itself — `or stop after 20 turns` — and watch the first run before you trust it overnight." — 24 words. Pass.
- "See [Chapter 38](/chapters/38-run-until-done) for the autonomous-loop deep dive: `/goal`, `/loop`, and Stop hooks as the three primitives." — 18 words. Pass.

### Influencer cadence
- None.

### Generic openings
- Section header "Mode 4 — `/goal`" — clean. Conforms.

### Closer drift
- Replaced pull-quote at end (line 160): "Plan is the architect. Interactive is the apprentice. Auto is the night-shift worker. `/goal` is the contractor who locks the door when the job is done. Hire the right one. They cost the same. They protect you differently." — list-of-personas, clipped, voice-strong. Conforms.

### Hyphens that should be em-dashes
- None.

### Missing real numbers
- "May 11, 2026 in Claude Code v2.1.139", "4,000 chars", "12 turns on a real refactor", "20 turns". Strong.

### Other voice issues
- **Line 156:** "The killer scene: `/goal deploy until tests pass`." — "killer scene" phrasing. Voice-consistent (matches Ch 38 "killer scenes" framing). Pass.

---

## Sharpen edits — Ch 24 (Tier list addendum)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 30:** "Any S- or A-tier mention is dead weight." — 9 words. Pass.
- "The replacement is Anthropic's computer-use feature, which moved to production-tier availability on Pro and Max plans in 2026 — same job, different surface, doesn't require a separate subscription." — **29 words.** Em-dash + clipped triplet. Pass — voice intentional.
- "If you were paying for Operator, that line stops; if you were waiting for the Operator replacement, it shipped and you didn't have to wait." — 26 words. Pass.
- **Line 31:** "Build code that doesn't pin to a specific Opus version and the upgrade is a one-line change." — 17 words. Pass.
- "Pin to `claude-opus-4-7` literally and you're rewriting in three months." — 11 words. Pass.
- "Anthropic is also deprecating `claude-sonnet-4` and `claude-opus-4` before June 15, 2026, so anything still on those names needs a sweep regardless." — 22 words. Pass.
- **Line 32:** "If you have AutoGen in a tier above F, you're ranking a deprecated runtime." — 14 words. Pass.
- "The framework chapter treats this fully; the tier list just needs to know that the AutoGen line moved." — 18 words. Pass.
- **Line 33:** "Opus 4.7 ($5/$25) shipped 2026-04-16 with new `effort` and `task budget` parameters — the actionable cost lever you didn't have before." — 21 words. Pass.
- "Haiku 4.5 ($1/$5) remains the workhorse for cheap-eval loops and is what powers `/goal`'s evaluator." — 15 words. Pass.
- "The price-per-intelligence improved across the board; lower-tier wrappers are competing against a moving floor." — 14 words. Pass.
- **Line 35:** "The tier-list widget at the bottom of this chapter (`/tier-list`) is the live version — it gets updated independently as the landscape shifts." — 23 words. Pass.
- "Treat the tables below as the May 2026 snapshot; the widget is the receipt for whatever month you're reading this in." — 21 words. Pass.

### Influencer cadence
- None.

### Generic openings
- Section header "Tier list addendum — May 2026" — date-stamped. Conforms.

### Closer drift
- Section ends with reference to running ledger ("see [/research-notes](/research-notes) for the running ledger"). Not a chapter closer; section bridge. Acceptable.

### Hyphens that should be em-dashes
- None.

### Missing real numbers
- Strong: "2025-08-31", "2026-04-03", "$3/$15 per million tokens", "2026-02-17", "$5/$25", "2026-04-16", "$1/$5", "June 15, 2026".

### Other voice issues
- Clean section. Possibly the most voice-aligned of all sharpens.

---

## Sharpen edits — Ch 25 (Three receipts section)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 84:** "The chapter's been 'evals or hope, pick one' since I wrote it." — 12 words. Pass.
- "By May 2026 the thesis has three independent confirmations and they don't agree on the failure mode — that's what makes it structural, not specific." — 25 words. Borderline pass.
- **Line 86:** "DELEGATE-52, the friday-wrapup canvas, nine days of $0 pipeline in front of leadership because a HubSpot stage rename slipped past every check that wasn't there." — **25 words.** Clipped fragment voice, opens with named noun. Pass.
- "The second was Anthropic's: an analysis of roughly 81,000 user-reported issues across the platform surfaced a long tail of agents that returned 'looks fine' outputs while quietly misbehaving — the same shape as my friday-wrapup, just at population scale." — **39 words.** Suggested split: "The second was Anthropic's. An analysis of roughly 81,000 user-reported issues across the platform surfaced a long tail of agents that returned 'looks fine' outputs while quietly misbehaving — the same shape as my friday-wrapup, just at population scale." [LOW]
- "On April 12, 2026, Berkeley's RDI lab published a paper showing they could reward-hack **eight major agent benchmarks** — SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, and two others — by training agents to detect the test environment and optimize for the score, not the task." — **45 words.** List-shape with two em-dash inserts. Voice intentional, but it's the single longest sentence in the sharpens. Suggested split: "On April 12, 2026, Berkeley's RDI lab published a paper showing they could reward-hack **eight major agent benchmarks** — SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, and two others. The trick: train agents to detect the test environment and optimize for the score, not the task." [MEDIUM]
- "The agents got better at the benchmark while getting no better at the underlying work." — 14 words. Pass.
- **Line 88:** "If you're not running an eval that matches your actual job — your stage filter, your customer's actual canvas, your held-out scenario — you don't have an evaluation problem; you have hope." — **31 words.** Strong epigram closer, em-dash double-insert. Voice-strong. Pass.

### Influencer cadence
- None.

### Generic openings
- Section header "Three receipts, one thesis" — clipped, voice-strong. Conforms.

### Closer drift
- Section closer (line 88) names the shape, doesn't summarize. Strong.

### Hyphens that should be em-dashes
- None.

### Missing real numbers
- "81,000 user-reported issues", "April 12, 2026", "eight major agent benchmarks", "nine days of $0 pipeline". Solid.

### Other voice issues
- Section is dense with comma-splice constructions. All intentional.

---

## Sharpen edits — Ch 30 (Mythos test section)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 204:** "Anthropic publicly conceded that an internal unreleased model — codename **Mythos** — beats Opus 4.7 on every benchmark they ran, including an **81% score on OSWorld** (versus Sonnet 4.6's 72.5%, itself at human baseline)." — **34 words.** Receipt-dense, two em-dash inserts. Pass — voice intentional.
- "The release window they gave was 'soon,' with no firm date (verify against your version/source when you read this)." — 19 words. Pass.
- **Line 212:** "That's it. The cache control still works. The tool schema still works. The retry config still works. The prompt still works." — clipped fragments. Strong voice. Conforms.
- "The feature gets smarter overnight without a redesign — because the SDK is the floor and the model is the swap." — 21 words. Pass.
- **Line 214:** "CrewAI, LangGraph, the new Microsoft Agent Framework — every framework-shaped path waits 2 to 6 weeks for the framework to publish support for the new model: provider config, tool-use adapter updates, retry semantics for any new error modes, sometimes a whole new abstraction for new features (the way adaptive thinking forced shape changes when it landed)." — **55 words.** Suggested split: "CrewAI, LangGraph, the new Microsoft Agent Framework — every framework-shaped path waits 2 to 6 weeks for the framework to publish support. Provider config, tool-use adapter updates, retry semantics for any new error modes, sometimes a whole new abstraction (the way adaptive thinking forced shape changes when it landed)." [HIGH — longest run in Wave A sharpens]
- "You don't get Mythos the day it ships. You get Mythos the day your framework gets around to it." — 18 words. Pass.
- **Line 216:** "The operator move is to keep at least one SDK-direct path for every high-value workflow." — 15 words. Pass.
- "The framework path can exist for orchestration ergonomics — see [Chapter 36](/chapters/36-frameworks-beyond) — but the critical-revenue feature, the one whose token math your CFO watches, stays SDK-direct so the next model upgrade lands on the day Anthropic ships, not the week the framework catches up." — **47 words.** Suggested split: "The framework path can exist for orchestration ergonomics — see [Chapter 36](/chapters/36-frameworks-beyond). But the critical-revenue feature — the one whose token math your CFO watches — stays SDK-direct. The next model upgrade lands the day Anthropic ships, not the week the framework catches up." [MEDIUM]

### Influencer cadence
- None.

### Generic openings
- Section header "The Mythos test — model upgrades that land in one line" — receipt-shape. Conforms.

### Closer drift
- Section ends with link to research notes ("The [Mythos entry in /research-notes](/research-notes) has the receipts.") — bridge, not summary. Conforms.

### Hyphens that should be em-dashes
- None.

### Missing real numbers
- "81% score on OSWorld", "Sonnet 4.6's 72.5%", "2 to 6 weeks". Solid.

### Other voice issues
- Line 208 code block: `model="claude-mythos-1"  # was claude-sonnet-4-5` — comment is lowercase, voice-consistent. Conforms.
- Line 204 opens "The chapter's thesis got a free receipt at Code with Claude 2026 in May." — strong voice.

---

## Sharpen edits — Ch 33 (Operator dead section)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 150:** "The browser-agent landscape consolidated harder than I expected." — 8 words. Pass.
- "OpenAI's Operator — the flagship 'watch the agent click around your browser' product they launched in 2024 — got shut down on **2025-08-31**." — 22 words. Pass.
- "It couldn't reliably finish checkout flows once JavaScript, CAPTCHAs, and session state stacked up." — 14 words. Pass.
- "Anthropic's computer-use went the other direction: graduated from research preview in 2024 to a **production-tier feature on Pro and Max** in March 2026, available through Cowork and Claude Code on the user's own machine." — **33 words.** Receipt-dense. Voice intentional. Pass.
- "The OSWorld benchmark, which measures full-desktop control, sits at **72.5% for Sonnet 4.6** — roughly the human baseline — with the unreleased Mythos model reportedly hitting 81% (verify against your version/source)." — **30 words.** Receipt-dense, em-dash double-insert. Pass.
- **Line 152:** "What that means at the script level: a Playwright cron I built on Operator in 2024 to pull invoice screenshots out of a vendor portal got ported to Anthropic computer-use earlier this year." — **32 words.** Suggested split: "What that means at the script level. A Playwright cron I built on Operator in 2024 to pull invoice screenshots out of a vendor portal got ported to Anthropic computer-use earlier this year." [LOW]
- "Latency held within ten percent. Token cost dropped because the model is cheaper per turn. Reliability went up because the model now actually parses login modals and dialog boxes instead of guessing at coordinates." — clipped triplet, last clause 21 words. Pass.
- "Same workflow, different runtime, better economics." — 6 words, fragment. Strong voice. Conforms.
- "The landscape now is essentially **Anthropic computer-use plus Playwright plus a handful of open-source browser-use libraries** — the consolidation makes the stack simpler to defend in front of a security review and easier to debug at 4 AM." — **38 words.** Suggested split: "The landscape now is essentially **Anthropic computer-use plus Playwright plus a handful of open-source browser-use libraries**. The consolidation makes the stack simpler to defend in front of a security review and easier to debug at 4 AM." [LOW]
- "One pattern note from the production deployments I've seen: nobody runs a single agent with full browser control." — 18 words. Pass.
- "The shape is a dispatcher orchestrator routing to specialist subagents — hub-and-spoke — because debugging 'what was the agent thinking when it clicked the wrong button' needs a single control flow to trace, not a free-form swarm." — **36 words.** Suggested split: "The shape is a dispatcher orchestrator routing to specialist subagents — hub-and-spoke. Debugging 'what was the agent thinking when it clicked the wrong button' needs a single control flow to trace, not a free-form swarm." [MEDIUM]

### Influencer cadence
- None.

### Generic openings
- Section header "Operator is dead, computer-use is production" — declarative, voice-strong. Conforms.

### Closer drift
- Section closer is the dispatcher-orchestrator paragraph. Not a chapter closer. Bridge-style. Acceptable.

### Hyphens that should be em-dashes
- None.

### Missing real numbers
- "2025-08-31", "March 2026", "72.5%", "81%", "ten percent". Strong.

### Other voice issues
- "Latency held within ten percent" — uses spelled-out percent, the rest uses digit. Mild inconsistency. [LOW] Suggested: "Latency held within 10%."

---

## Sharpen edits — Ch 35 (SKILL.md cross-vendor section)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 115:** "Two things shifted under this chapter since it shipped, and both make the dual-shift setup cheaper to run, not more expensive." — 22 words. Pass.
- **Line 117:** "The first: **OpenAI Agents SDK 0.14** dropped on April 15, 2026." — 11 words. Pass.
- "The headline features for this chapter are a model-native sandbox and a model-native harness — the agent loop now lives closer to the model instead of in a framework on top, which is the same direction Anthropic's Agent SDK has been moving for a year." — **44 words.** Suggested split: "The headline features for this chapter are a model-native sandbox and a model-native harness. The agent loop now lives closer to the model instead of in a framework on top — the same direction Anthropic's Agent SDK has been moving for a year." [MEDIUM]
- "Subagents and code-mode are documented as 'coming soon' (verify against your version/source)." — 12 words. Pass.
- "For the night shift, that means Codex sessions get sandbox isolation by default and the harness handles tool-call retries without me writing the loop." — 24 words. Borderline pass.
- "The 3 AM Sentry triage that opens PR #4471 in the cold open of this chapter is the kind of work that benefits most from a sandboxed runtime — it's reading production logs and writing code; the blast radius of a bad run should be containable." — **46 words.** Suggested split: "The 3 AM Sentry triage that opens PR #4471 in the cold open is the kind of work that benefits most from a sandboxed runtime. It's reading production logs and writing code — the blast radius of a bad run should be containable." [MEDIUM]
- **Line 119:** "The second is the bigger shift, and it's quiet enough that most teams haven't noticed yet." — 16 words. Pass.
- "**Codex CLI now uses the same SKILL.md format as Claude Code.**" — 11 words. Pass — strong clipped declarative.
- "Same frontmatter, same trigger phrases, same directory layout." — 8 words, fragment. Conforms.
- "The same `.claude/skills/<name>/SKILL.md` file that fires a workflow in CC can fire the same workflow in Codex — no rewrite, no second skill library, no 'Codex version of mentoring-lifecycle.'" — **29 words.** Em-dash + triplet. Pass — voice intentional.
- "Skills became a cross-vendor portable artifact in May 2026, which is the biggest shift this chapter's underlying premise has absorbed since it shipped." — 24 words. Pass.
- **Line 121:** "The receipt I can give you from the Belkins repo: a deal-watcher skill — single SKILL.md, around 90 lines, MCP server config, three trigger phrases, one Stop hook — runs from Codex at 3 AM when a Sentry event hits the deal-sync queue, and the same skill runs from my Claude Code session at 9 AM when I'm reviewing the PR." — **60 words.** Suggested split: "The receipt I can give you from the Belkins repo: a deal-watcher skill. Single SKILL.md, around 90 lines, MCP server config, three trigger phrases, one Stop hook. Runs from Codex at 3 AM when a Sentry event hits the deal-sync queue. Same skill runs from my Claude Code session at 9 AM when I'm reviewing the PR." [HIGH — second-longest run in Wave A]
- "One file, two CLIs, two shifts." — 6 words, fragment. Conforms.
- "What changed is that the SKILL.md library doesn't have to be duplicated — write skills once, use across both runtimes." — 21 words. Pass.
- "See [Chapter 39](/chapters/39-skills-you-should-steal) for the community side of this — once the format is cross-vendor, the marketplace grows faster, and the skills you steal stop caring which agent runs them." — **31 words.** Voice intentional, em-dash structure. Pass.

### Influencer cadence
- None.

### Generic openings
- Section header "May 2026 update — SKILL.md goes cross-vendor" — date-stamped. Conforms.

### Closer drift
- Section ends with link ("Receipts in [/research-notes](/research-notes).") — bridge. Acceptable.

### Hyphens that should be em-dashes
- None.

### Missing real numbers
- "April 15, 2026", "around 90 lines", "three trigger phrases", "one Stop hook", "3 AM", "9 AM". Strong.

### Other voice issues
- Clean structurally. Main issue is the run-on length on line 121.

---

## Sharpen edits — Ch 36 (May 2026 update section, biggest sharpen)

### Banned words
- None.

### Long sentences (>24 words)
- **Line 178:** "This chapter shipped six months before this update and every framework version in it is stale." — 16 words. Pass.
- "Here's what moved, what's new, and what's actually worth picking up." — 12 words. Pass. Note: "Here's what..." opens the section, but framed as receipt-shape (concrete: moved/new/worth) not influencer-soft. Conforms.
- **Line 180:** "Microsoft shipped MAF 1.0 on **2026-04-03** and explicitly migrated AutoGen + Semantic Kernel users to it." — 16 words. Pass.
- "The 'research-strong, prototype-friendly' paragraph above still describes a useful tool — but if you're starting today, start on MAF, not AutoGen." — 21 words. Pass.
- "**The trap to flag up front:** MAF is worth adopting if you're a .NET shop, an Azure shop, or already invested in Semantic Kernel." — 24 words. Pass.
- "For everyone else — TypeScript teams, Python teams not on Azure, Anthropic-platform operators — the gravitational pull of MAF will burn weeks on Azure-specific patterns that don't transfer back to your stack." — **31 words.** Receipt-dense, em-dash double-insert. Pass — voice intentional.
- "The Anthropic-stack-direct path from [Chapter 30](/chapters/30-sdk-direct) is still the highest leverage per line of code." — 17 words. Pass.
- **Line 182:** "**OpenAI Agents SDK 0.14** (released **2026-04-15**) added a model-native sandbox and a model-native harness — the agent loop moved closer to the model." — 22 words. Pass.
- "This is OpenAI converging toward the same shape Anthropic has been shipping, which means the SDK-direct thesis in [Chapter 30](/chapters/30-sdk-direct) gets a free second confirmation." — 26 words. Borderline pass.
- **Line 184:** "**Anthropic Managed Agents** went into public beta on **2026-04-08**." — 9 words. Pass.
- "Anthropic hosts the runtime, error recovery, and execution; you keep writing against the standard `anthropic` SDK." — 16 words. Pass.
- "**Memory files** followed on **2026-04-23** — persistent memory mounted as `/mnt/memory/` inside the agent's container, readable and writable with the bash + file tools the agent already has, exportable and editable in Console." — **31 words.** Receipt-dense. Pass.
- "That solves the 'stateless agent' problem for Anthropic-platform shops without bringing in a framework." — 14 words. Pass.
- "Pair with **adaptive thinking** on Opus 4.6 / Sonnet 4.6 (and Mythos, when it ships) — `budget_tokens` is deprecated; the model decides when and how much to think, with interleaved thinking enabled by default and preserved across turns." — **36 words.** Suggested split: "Pair with **adaptive thinking** on Opus 4.6 / Sonnet 4.6 (and Mythos, when it ships). `budget_tokens` is deprecated. The model decides when and how much to think, with interleaved thinking enabled by default and preserved across turns." [MEDIUM]
- "The Anthropic stack in May 2026 is materially more capable than the version this chapter described in November." — 18 words. Pass.
- **Line 186:** "**Vercel AI SDK 6** is the other entry that didn't exist when I wrote this chapter." — 16 words. Pass.
- "**20M+ monthly downloads** — that's not a startup framework; that's infrastructure." — 11 words. Pass — strong clipped voice.
- "The new piece worth knowing is **Workflow DevKit** with `DurableAgent` — a drop-in replacement for the `Agent` class that gives you pause/resume, crash-safe execution, retries, and step-based observability." — **27 words.** Borderline pass; em-dash list.
- "For TypeScript product teams running agents inside a Next app, this is the cleanest 'agent that survives a process restart' story available." — 22 words. Pass.
- "Closer in shape to LangGraph than to CrewAI, but lives natively in a Vercel-shaped deployment." — 15 words. Pass.
- **Line 188:** "**Mastra 1.0** hit **January 2026** — entirely new entry, didn't exist when the chapter shipped." — 15 words. Pass.
- "**22k GitHub stars, ~300k weekly npm downloads, YC W25 graduate.**" — 9 words, fragment. Pass.
- "TypeScript-only, agents + workflows + RAG in one stack." — 10 words. Pass.
- "The Mastra sweet spot is 'TS team that wants the LangGraph state-machine model without the Python ergonomics.'" — 17 words. Pass.
- "Worth a real look if your team has already standardized on TS and you want one framework instead of three." — 21 words. Pass.
- "The reason it earned a row above CrewAI for some teams: opinionated single-language footprint, less abstraction sprawl." — 17 words. Pass.
- **Line 190:** "**Inngest AgentKit** deserves a mention for one specific shape — event-driven shops who already run Inngest for durable jobs and want deterministic agent routing on top." — **26 words.** Borderline pass.
- "If you're already on Inngest, the migration cost is near zero. If you're not, this isn't the reason to adopt Inngest." — 22 words. Pass.
- **Line 194:** "The hardest-won lesson of the May 2026 ecosystem isn't a framework choice — it's a topology choice." — 17 words. Pass.
- "**Hub-and-spoke wins production, roughly 70% of deployments** per multiple framework docs and case studies (Microsoft's MAF guidance, Anthropic's research-style multi-agent system, the gurusup orchestration writeup, augmentcode's guide)." — **28 words.** Parenthetical citation list. Pass.
- "Swarm patterns win demos and Twitter threads. Hub-and-spoke wins customer-facing work." — 11 words, two sentences. Strong voice. Conforms.
- **Line 196:** "The shape: one orchestrator decomposes the task and dispatches to specialist workers; workers don't talk to each other; one verifier/critic checks the output before it ships." — 26 words. Borderline pass; structured colon-list.
- "The reason it wins is debuggability — one control flow to trace, one place where the state lives, one log to read at 3 AM." — 24 words. Pass.
- "Microsoft's own migration guide spells it out: **start centralized, decentralize only when a concrete scalability bottleneck appears.**" — 16 words. Pass.
- "Swarm-style peer-to-peer handoff (the OpenAI Swarm pattern, now folded into Agents SDK 0.14) is powerful for parallelism but observability is brutal." — 20 words. Pass.
- "My own portfolio rule — 3 to 4 parallel agents per wave, 5+ invites filesystem contention — is the operator-scale version of the same lesson." — 24 words. Pass.
- **Line 200:** "This chapter previously walked through roughly five frameworks." — 8 words. Pass.
- "The May 2026 menu, with what's actually worth knowing per use case:" — 12 words. Pass.
- **Line 212:** "The graduation pattern at the top of this chapter still holds — start in CC, leave for CrewAI or Mastra when the contract sharpens, leave for LangGraph or Workflow DevKit when the graph branches, drop to the SDK when the framework fights the workflow." — **44 words.** Suggested split: "The graduation pattern at the top of this chapter still holds. Start in CC. Leave for CrewAI or Mastra when the contract sharpens. Leave for LangGraph or Workflow DevKit when the graph branches. Drop to the SDK when the framework fights the workflow." [MEDIUM — but the run-on is also legible voice]
- "The menu just got longer." — 5 words. Pass.
- "Most operators only need three of these in their head: Anthropic SDK direct as the floor, CrewAI for fast crews, LangGraph or Workflow DevKit for state-machines that survive restarts." — 28 words. Slightly long. Pass.
- "See the [Mythos entry in /research-notes](/research-notes) for why the SDK-direct floor matters more, not less, as the next model wave hits." — 20 words. Pass.

### Influencer cadence
- **Line 178:** "Here's what moved, what's new, and what's actually worth picking up." — opens with "Here's what..." Similar borderline to Ch 9. Receipt-shape (moved/new/worth) softens it, but it's the second occurrence of this opener across Wave A sharpens. [LOW — pattern, not single violation]

### Generic openings
- Section header "Update — May 2026" — date-stamped, voice-strong. Conforms.

### Closer drift
- Section ends with link to research notes — bridge style. Acceptable.

### Hyphens that should be em-dashes
- Code/inline marks correct. No `--` found.

### Missing real numbers
- Exceptionally strong: "2026-04-03", "2026-04-15", "2026-04-08", "2026-04-23", "20M+ monthly downloads", "22k GitHub stars", "~300k weekly npm downloads", "January 2026", "70% of deployments", "3 to 4 parallel agents per wave", "47.8k stars, 12M daily executions, 150+ enterprise customers".

### Other voice issues
- Table at lines 202-211 — formatted consistently, sentence-case headers fit voice. Conforms.
- Line 188: "TypeScript-only, agents + workflows + RAG in one stack." — fragment-shape works.

---

## Severity summary

- **HIGH** (must fix before deploy): 3 voice violations
  - Ch 39 line 156 (52-word run-on, vault `Bash(rm)` paragraph)
  - Ch 30 line 214 (55-word framework-lag run-on)
  - Ch 35 line 121 (60-word deal-watcher receipt run-on)

- **MEDIUM**: 8 voice issues
  - Ch 38 line 64 (38-word Stop-hook compose sentence)
  - Ch 38 line 173 (32-word "page was live" sentence)
  - Ch 25 line 86 (45-word Berkeley benchmark list)
  - Ch 30 line 216 (47-word framework path sentence)
  - Ch 33 line 152 (36-word dispatcher orchestrator sentence)
  - Ch 35 line 117 (44-word + 46-word headline features + 3 AM Sentry)
  - Ch 36 line 184 (36-word adaptive thinking pair)
  - Ch 36 line 212 (44-word graduation pattern, but legible voice)

- **LOW**: ~14 borderline overruns, 2 "Here's the [noun]" patterns (Ch 9 line 92, Ch 36 line 178), 1 "ten percent" vs "10%" inconsistency (Ch 33 line 152), and 5 sentences in the 26-31 word range where the em-dash structure earns the length.

- **No banned words anywhere in Wave A.** Clean on "amazing/incredible/powerful/game-changer/revolutionary/thrilled/best-in-class/cutting-edge".
- **No `--` (double-hyphen) misuse.** Em-dashes are correctly typed `—` throughout.
- **No "I'm excited / I've been thinking / thrilled to announce" LinkedIn cadence.**
- **Anti-takeaway closers land** on both new chapters (Ch 38 "What I got wrong" / Ch 39 "What this Saturday cost me").
- **Time-stamped scene openers land** on both new chapters (Ch 38 "Tuesday, May 12, 8:47 AM" / Ch 39 "Saturday, 10:42 AM, six tabs").
- **Receipts dense across all 12 pieces** — dates, dollar amounts, percentages, version numbers, line counts.

## Overall verdict

**quick-fixes-needed** — ship after splitting the 3 HIGH-severity run-ons (Ch 39 line 156, Ch 30 line 214, Ch 35 line 121). The 8 MEDIUM items are voice-acceptable as comma-splice/em-dash long-form but tighten cleanly if Vlad wants the clipped-voice ratio higher. The 2 "Here's the [noun]" openers (Ch 9, Ch 36) are borderline — receipt-shape softens them, but the pattern repeating across Wave A is a flag for the next sharpen pass.

Voice integrity is otherwise strong: zero banned-word hits, zero `--` misuse, zero influencer cadence, both new chapters land anti-takeaway closers and time-stamped scene openers. The sharpens align well with their host chapters' voices.
