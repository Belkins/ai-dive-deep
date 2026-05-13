# Ch 39 "Skills You Should Steal" — Fact-Check

**Chapter:** `src/content/chapters/39-skills-you-should-steal.mdx`
**Source-of-truth:** `notes/trends/community-skills.md` (verified May 14, 2026)
**Audit date:** May 14, 2026
**Auditor:** Claude (fact-check pass, 8-min budget)

---

## VERIFIED (matches source-of-truth)

### Star counts — every cited number matches the trend note exactly
- `anthropics/skills` — 134k stars [MATCH, trend note L18]
- `garrytan/gstack` — 95.7k stars [MATCH, L27]
- `hesreallyhim/awesome-claude-code` — 43.6k stars [MATCH, L37]
- `ComposioHQ/awesome-claude-skills` — 59.6k stars [MATCH, L82]
- `sickn33/antigravity-awesome-skills` — 37.4k stars, 1,459+ skills, multi-platform list [MATCH, L46-49]
- `VoltAgent/awesome-agent-skills` — 21.6k stars, 1,100+ skills, 300k monthly companion-site views [MATCH, L55-58]
- `alirezarezvani/claude-skills` — 14.7k stars, 268 skills, 9 domains, Skill Security Auditor, persona presets [MATCH, L64-67]
- `travisvn/awesome-claude-skills` — 12.5k stars, last update Feb 2026 [MATCH, L118-120]
- `trailofbits/skills` — 5.2k stars [MATCH, L100]

### Operator handles — all six verified against trend note "Public operators worth following" section
- `@garrytan` (X + GitHub) — MATCH [L127]
- `@alirezarezvani` (GitHub) — MATCH [L128]
- `@ruben` (Substack, runs makemyskill.com) — MATCH [L129]
- `@thepycoach` / Frank Andrade (Artificial Corner, "We Built 70+ Claude Skills", 7 co-writers) — MATCH [L130]
- Koen Stam / GTMcraft Substack ("what 100+ operators get wrong") — MATCH [L131]
- `@thestack_ai` (dev.to, pulser CLI, MIT-licensed) — MATCH [L132]

### The 73% claim
- "214 community skills … 73% scored below 60/100" — MATCH trend note L14
- "March 26, 2026" — MATCH trend note L14 (`Mar 26, 2026`)
- Failure-mode breakdown: 41% sub-20-word descriptions, 62% no version field, 55% zero code blocks — ALL MATCH trend note quality-pattern + audit sections (L14, L159, L160, L161)
- Auditor handle `@thestack_ai` + pulser CLI — MATCH

### 1M+ tracked skills claim
- "By May 2026 the public skills ecosystem crossed a million entries" — MATCH trend note L7 ("a tracked 1M+ community-published skills by May 2026")

### Library URLs — all well-formed GitHub URLs, all match trend note
- `github.com/anthropics/skills` — MATCH
- `github.com/garrytan/gstack` — MATCH
- `github.com/hesreallyhim/awesome-claude-code` — MATCH
- `github.com/ComposioHQ/awesome-claude-skills` — MATCH
- `github.com/sickn33/antigravity-awesome-skills` — MATCH
- `github.com/VoltAgent/awesome-agent-skills` — MATCH
- `github.com/alirezarezvani/claude-skills` — MATCH
- `github.com/travisvn/awesome-claude-skills` — MATCH
- `github.com/trailofbits/skills` — MATCH

### gstack composition
- "Twenty-three specialist skills plus ~14 power tools" — MATCH trend note L31 (`23 specialist skills + ~14 power tools`)
- Specific power-tool names cited (`/office-hours`, `/qa`, `/ship`, `/canary`, `/retro`, `/careful`, `/guard`) all appear in trend note L31

### Three gap descriptions
- **Gap 1 — Portfolio-CEO daily briefing:** matches trend note L145 (HubSpot/Gong/calendar/Stripe/CI; SyncGTM and Summit53 as CRM-only analogs; `health-pulse` + `daily` + `closeday` stack)
- **Gap 2 — Mentoring lifecycle:** matches trend note L146 (pre-session prep + during-session capture + post-session fan-out; "no public counterpart" framing)
- **Gap 3 — Cross-trio audit:** matches trend note L148 (landing + day-1 + welcome email; "already a Vlad skill, zero public versions"; cross-trio drift framing)

### HN niche over-saturation
- "JanBussieck's `hn-skill` … 157k Show HN analysis" — MATCH trend note L141 ("JanBussieck/hn-skill ships built on 5 years of front-page data plus 157k Show HN analysis")

### Cross-link slugs — all four exist
- `/chapters/05-skills` — file `05-skills.mdx` exists ✓
- `/chapters/09-dont-get-owned` — file `09-dont-get-owned.mdx` exists ✓
- `/chapters/11-build-a-skill` — file `11-build-a-skill.mdx` exists ✓
- `/chapters/24-tier-list` — file `24-tier-list.mdx` exists ✓

### Date verification
- "Saturday morning, May 9, 2026" — May 9 2026 was indeed a Saturday ✓

---

## UNVERIFIED (real but not in source-of-truth)

### The 12k-star skill / Bash(rm) against vault anecdote (L20, L156)
- Trend note does NOT contain this incident — it's a survey doc, not a personal-receipts doc
- No record in `notes/`, no record in MEMORY.md vault-incident memories, no `feedback_vault_rm_*` memory
- The chapter presents it as a first-person receipt ("Two markdown files gone. Vault git history saved them.") with circumstantial detail (`allowed-tools: ["*"]`, "scratch files" cleanup phrase, "ninety seconds too late")
- **Severity: MEDIUM** — could be a genuine receipt Vlad never logged to MEMORY.md, OR could be illustrative scene-setting. The prompt asked to flag if invented. Flagged for Vlad to confirm: did this actually happen, or is it a composite scenario? If composite, recommend softening to *"the kind of thing that can happen with `allowed-tools: ['*']`"* rather than presenting as a specific past event.
- Note: the underlying claim is mechanically plausible (wildcard tool access + ambient `Bash(rm)` capability is a known foot-gun) and the lesson it teaches is correct regardless of whether the specific incident is real.

---

## WRONG / INCONSISTENT

### Trail of Bits — "Ten skills, all security-research-shaped" (L142)
- Trend note L103 enumerates **13** named skills: smart-contract audit, C-review, differential review, static analysis, semgrep rule creation, supply-chain risk audit, YARA authoring, constant-time analysis, mutation testing, property-based testing, zeroize audit, DWARF expert, Firebase APK scanner
- Chapter says "Ten skills" — **off by 3** vs trend note's enumeration
- **Severity: LOW** — could be a deliberate round-down ("ten-ish, all security-shaped") or an interim count. The trend note itself doesn't claim a clean "13 skills total" number, just enumerates 13 named items, so this may be that trend-note enumeration is non-exhaustive in the other direction. Recommend either changing to "roughly a dozen skills" / "ten-plus skills" or verifying the actual current repo count.

### "Order of magnitude below aggregators" for trailofbits 5.2k (L142)
- 5.2k vs the closest aggregator VoltAgent at 21.6k is **~4x**, not 10x
- 5.2k vs the biggest (anthropics 134k, gstack 95.7k) is 18-25x — that *is* order-of-magnitude
- **Severity: LOW** — depends which aggregator you compare to. Phrase is loose but defensible against the top of the tier list. Could tighten to "several times below the top aggregators" if wanted.

---

## VOICE ISSUES

### Banned-word scan (delve, leverage, robust, seamless, harness, tapestry, elevate, streamline, game-changer, cutting-edge, dive in, in today's, navigate, unlock, unleash)
- **ZERO hits.** Voice is clean.

### Tone notes
- First-person operator voice consistent throughout
- No corporate filler
- Pull quote ("A skill is a contract with future-you. Seventy-three percent of public skills break the contract on read one.") earns its placement
- Callout warning is appropriately tactical
- Closing line ("The audit habit won't.") lands

---

## CROSS-LINK INTEGRITY

| Link | Target slug | File present | Verdict |
|---|---|---|---|
| Chapter 5 (mentoring-lifecycle reference) | `05-skills` | ✓ | OK |
| Chapter 9 (don't get owned, vault-rm callback) | `09-dont-get-owned` | ✓ | OK |
| Chapter 11 (build-side workflow) | `11-build-a-skill` | ✓ | OK |
| Chapter 24 (tier-list cadence sibling) | `24-tier-list` | ✓ | OK |

All four cross-links resolve. No broken slugs.

External URLs in chapter body all match trend-note sources list (L202-229).

---

## SEVERITY SUMMARY

| Severity | Count | Items |
|---|---|---|
| HIGH | 0 | — |
| MEDIUM | 1 | Vault-rm anecdote not corroborated in notes or memory; flagged for Vlad to confirm or soften |
| LOW | 2 | Trail of Bits "10 skills" vs trend note's 13 enumerated; "order of magnitude" loose vs closest aggregator |
| VOICE | 0 | Clean on banned words |
| CROSS-LINK | 0 | All four slugs resolve |

---

## VERDICT

**Ship-ready pending one confirmation:** all star counts, operator handles, the 73% claim, the 1M+ claim, the gap descriptions, and the cross-links check out exactly against the source-of-truth trend note. Voice is clean. The only meaningful flag is the vault-rm anecdote (L20, L156) — Vlad should confirm whether it's a real undocumented receipt or a composite scene. If composite, recommend a one-line softening; if real, recommend adding it to MEMORY.md as a feedback memory so future fact-checks can corroborate. Two LOW items (Trail of Bits skill count, "order of magnitude" phrasing) are polish-tier, optional.
