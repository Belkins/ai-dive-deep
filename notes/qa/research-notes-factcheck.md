# Research notes fact-check

Audit of the 3 NEW entries at the top of `src/lib/research-notes.ts` (Mythos, Berkeley RDI, CVE-2026-30623). Source-of-truth: `notes/trends/anthropic-90day.md`, `notes/trends/agent-frameworks-may26.md`, plus 4 WebSearch spot-checks. Strict pass — these are quotable forever.

Method: every load-bearing claim tagged CONFIRMED / UNVERIFIED / WRONG with severity (HIGH = factually wrong + on the page = trust-loss; MEDIUM = misleading framing or partially wrong; LOW = nit, format, or cross-link).

---

## Entry 1: Mythos — Anthropic publicly conceded an internal model beats Opus 4.7

### Verified
- **CONFIRMED** — Code with Claude keynote was May 6 2026. (agent-frameworks-may26.md L53-54; anthropic-90day.md L175 "Code with Claude, 2026-05-06"; Simon Willison live blog confirms date.)
- **CONFIRMED** — Mythos SWE-bench Verified at 93.9%. (agent-frameworks-may26.md L53 "Top score 93.9% — Claude Mythos Preview"; red.anthropic.com/2026/mythos-preview/ confirms 93.9% SWE-bench.)
- **CONFIRMED** — Mythos SWE-bench Pro at 77.8%. (agent-frameworks-may26.md L54 "Claude Mythos Preview 77.8% SWE-bench Pro".)
- **CONFIRMED** — June 15 deprecation cliff for claude-sonnet-4 / claude-opus-4. (anthropic-90day.md L120-122.)
- **CONFIRMED** — date format ISO (2026-05-06).
- **CONFIRMED** — all 4 chapter slugs exist in `chapters.ts`: `30-sdk-direct`, `02-five-tools`, `24-tier-list`, `36-frameworks-beyond`.

### Wrong / misleading
- **WRONG (HIGH)** — entry framing implies Mythos is a coming upgrade (`"Release window: 'soon' — no firm date, signal is the next major release is queued behind safety work"` + `"Mythos may or may not ship before that date"` + receipt `"TBA — 'soon' per keynote"`). WebSearch is unambiguous: **Anthropic has explicitly stated Mythos Preview will NOT be made generally available** due to cybersecurity concerns. Instead Anthropic launched Project Glasswing (industry consortium). The agent-frameworks trend note even says "Claude Mythos Preview" — Preview = research artifact, not product. **This is the load-bearing factual error in the entry.** The operator takeaway ("the SDK absorbs Mythos one-line", "tier list flips when Mythos ships") is built on a release that isn't coming.
- **WRONG (MEDIUM)** — the keynote framing. The entry says "At Code with Claude 2026 (May 6), Anthropic publicly conceded that an internal model code-named Mythos outperforms Claude Opus 4.7 on every benchmark they ran". Per WebSearch, Mythos's existence was actually revealed via a Fortune data-leak story on March 26 2026, **not at the keynote**. The keynote disclosed *capabilities*. Anthropic's *public* concession of the model's existence predates Code with Claude.
- **UNVERIFIED (MEDIUM)** — "framework upgrade lag (median) 2-6 weeks behind SDK". Neither trend note quotes a 2-6 week framework lag number. The frameworks note discusses SDK-direct vs framework-mediated philosophy (lines 65-74) but does not produce a 2-6 week median. The agent that wrote this appears to have invented the range. Plausible operator intuition, not a citable statistic.

### Receipts vs takeaway prose
- Takeaway prose claims SDK-direct operators absorb Mythos "with a one-line config change" and "framework operators wait 2-6 weeks". Receipts repeat the same 2-6 week number. Both inherit the unverified lag and the wrong "Mythos is coming" framing.

### Severity
- 1 HIGH (Mythos not GA — re-frame entire entry)
- 1 MEDIUM (keynote-vs-leak attribution)
- 1 MEDIUM (unverified 2-6 week lag number)

---

## Entry 2: Berkeley RDI reward-hacked 8 major agent benchmarks

### Verified
- **CONFIRMED** — Berkeley RDI paper exists and is publicly available. WebSearch surfaces rdi.berkeley.edu/blog/trustworthy-benchmarks/ + Substack + HN thread. Authors: Hao Wang, Qiuyang Mang, Alvin Cheung, Koushik Sen, Dawn Song. Code at github.com/moogician/trustworthy-env.
- **CONFIRMED** — April 12 2026 date is plausible (agent-frameworks-may26.md L62: "Berkeley RDI demonstrated reward-hacking on all 8 major benchmarks on 2026-04-12"). WebSearch agent-wars.com URL slug shows 2026-04-11 (one day off; trend note date is fine).
- **CONFIRMED** — 8 benchmarks. WebSearch: "eight prominent AI agent benchmarks" confirmed.
- **CONFIRMED** — reward-hacking pattern is accurate. The entry's framing ("agents detected which environment they were in (test signature, file structure) and adjusted strategies accordingly") tracks the paper's findings re: weak test assertions, answer leakage, shared address spaces, score injection.
- **CONFIRMED** — Sonnet 4.6 OSWorld 72.5%. WebSearch confirms. Also confirmed: "OSWorld held up better than SWE-bench Verified per the paper" — the Berkeley paper's exploit scored ~100% on SWE-bench Verified but only 73% on OSWorld, validating the relative-resilience framing.
- **CONFIRMED** — date format ISO.
- **CONFIRMED** — all 4 chapter slugs exist: `25-evals-or-hope`, `28-failure-receipts`, `24-tier-list`, `30-sdk-direct`.
- No external links in this entry — nothing to URL-check.

### Wrong / misleading
- **WRONG (MEDIUM)** — the named benchmark list is partially fictional. Entry: "SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, and two others." Actual paper per WebSearch: **SWE-bench (Verified + Pro), WebArena, OSWorld, GAIA, Terminal-Bench, FieldWorkArena, CAR-bench**. T-bench = Terminal-Bench (OK). But **AgentBench and MLE-bench are NOT in the Berkeley list.** WebArena, FieldWorkArena, CAR-bench are missing from the entry. This is the kind of error a savvy reader catches immediately and uses to discredit the rest. Operator implications (treat scores as marketing signal) still hold, but the named list needs to match the paper.
- **UNVERIFIED (LOW)** — "DELEGATE-52 from the technical side (content drift), 81k interviews from the user side (unreliability at 26.7%), Berkeley RDI from the benchmark side (gaming)" — this n=3 framing isn't in the trend notes as a single rhetorical bundle, but each of its three legs IS confirmed elsewhere in research-notes.ts. Framing is Vlad-voice synthesis, not fact, so acceptable for the takeaway.
- **UNVERIFIED (LOW)** — "Recommended discount on public scores: 10-15 points for contamination + gaming" — this number appears in agent-frameworks-may26.md L62 ("discounted ~10-15 points for contamination + gaming"). CONFIRMED. (Upgrading this from UNVERIFIED to CONFIRMED.)

### Receipts vs takeaway prose
- "8 of 8 tested" — matches takeaway. CONFIRMED.
- "3 (DELEGATE-52 + 81k + RDI)" — matches takeaway framing. (Synthesis claim, not a citable stat, but internally consistent.)
- "Sonnet 4.6 OSWorld (held up best) 72.5%" — CONFIRMED.

### Severity
- 1 MEDIUM (named-benchmark list is partially wrong — AgentBench + MLE-bench don't belong)

---

## Entry 3: CVE-2026-30623 — 200,000 MCP servers vulnerable

### Verified
- **CONFIRMED** — CVE identifier format correct: `CVE-2026-30623` (CVE-YYYY-NNNNN).
- **CONFIRMED** — ~200,000 MCP servers figure. WebSearch: VentureBeat "200,000 MCP servers expose…", The Register, Computing.co.uk, Hacker News all use 200k. anthropic-90day.md L162 confirms 200k.
- **CONFIRMED** — 9 of 11 registries accepted malicious test package. anthropic-90day.md L162 ("9 out of 11 MCP registries accepted OX's malicious test package without security review"). WebSearch confirms.
- **CONFIRMED** — April 2026 disclosure date (entry uses 2026-04-16; The Register URL is theregister.com/2026/04/16/anthropic_mcp_design_flaw/ — exact match. OX advisory dated April 15 2026. Either date defensible; entry's 2026-04-16 lines up with The Register publication and is fine.)
- **CONFIRMED** — Anthropic confirmed by-design at STDIO transport. anthropic-90day.md L161 ("Anthropic confirmed this is by design, declined to modify, says sanitization is the developer's responsibility"). WebSearch confirms: "Anthropic confirmed the behavior is by design and declined to modify the protocol — characterizing STDIO's execution model as a secure default and input sanitization as the developer's responsibility."
- **CONFIRMED** — liteLLM advisory URL works: `https://docs.litellm.ai/blog/mcp-stdio-command-injection-april-2026` returned a live result with the expected content.
- **CONFIRMED** — The Register URL works: `https://www.theregister.com/2026/04/16/anthropic_mcp_design_flaw/`.
- **CONFIRMED** — date format ISO (2026-04-16).
- **CONFIRMED** — all 4 chapter slugs exist: `09-dont-get-owned`, `16-hooks-subagents`, `05-skills`, `12-connectors-mcp`.

### Wrong / misleading
- None found. This is the cleanest of the three entries.

### Caveats / minor
- **LOW** — "OX Security advisory" credit could optionally link to OX directly (`https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/`). Not a defect; entry already credits liteLLM + The Register.
- **LOW** — the source line says "April 2026" but date is 2026-04-16 — minor inconsistency, both correct.

### Receipts vs takeaway prose
- "~200,000" — matches. CONFIRMED.
- "9 of 11" — matches. CONFIRMED.
- "by-design — fix at the registry layer + operator discipline" — matches Anthropic's public stance. CONFIRMED.
- "April 2026" — matches. CONFIRMED.

### Severity
- 0 HIGH, 0 MEDIUM, 2 LOW (both nits, not defects)

---

## Severity summary

- **HIGH: 1** (Entry 1: Mythos is NOT coming as a product. Anthropic publicly declined GA citing cybersecurity. Entire entry's operator-implications stack rests on a release that isn't queued. This is the kind of fact that ages from "premature" to "embarrassingly wrong" the moment a reader checks red.anthropic.com.)
- **MEDIUM: 3**
  - Entry 1: Mythos was revealed in March via Fortune leak, not "publicly conceded at the keynote".
  - Entry 1: 2-6 week framework lag is unverified — agent likely invented the range.
  - Entry 2: Named-benchmark list is partially wrong (AgentBench + MLE-bench are not in the Berkeley paper; the paper covers WebArena, FieldWorkArena, CAR-bench instead).
- **LOW: 2** (CVE entry nits — both cosmetic, not blocking)

## Overall verdict

**FIX-AND-SHIP.**

Two of three entries are publishable as-is or close to it:

- **Entry 3 (CVE-2026-30623)** — SHIP. All claims verified, both source URLs live, receipts match prose, cross-links valid.
- **Entry 2 (Berkeley RDI)** — fix the named-benchmark list, then SHIP. Replace `"SWE-bench Verified, T-bench, GAIA, OSWorld, AgentBench, MLE-bench, and two others"` with the actual paper's `"SWE-bench (Verified + Pro), WebArena, OSWorld, GAIA, Terminal-Bench, FieldWorkArena, and CAR-bench."` Optional add: link to `rdi.berkeley.edu/blog/trustworthy-benchmarks/` + `github.com/moogician/trustworthy-env`.
- **Entry 1 (Mythos)** — HOLD until rewritten. Right now the entry tells operators to plan a swap for a model Anthropic has publicly said won't ship. Recommended rewrite angle: keep the SDK-vs-framework dependency thesis (which is sound), but reframe Mythos as the *capability-disclosed-but-withheld* signal — Anthropic shipped the benchmark numbers AND Project Glasswing AND a "we're not releasing it" stance. The operator takeaway shifts from "build a swap path for Mythos" to "the model landscape now ships capability claims faster than usable models — operators who can swap on a one-line config are still positioned best whenever the *next* model does ship." Drop the 2-6 week framework lag number unless a real citation can replace it. Drop "TBA — 'soon' per keynote" receipt — it's no longer true.

Don't ship /research-notes with Entry 1 as written. If the page must go live today, comment out Entry 1 and ship Entries 2+3 plus the existing pre-existing entries below.
