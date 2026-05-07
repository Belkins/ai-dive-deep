# Edition 2 — Synthesis

The audit ran. Eight deliverables in `notes/edition-2/`. This is the doc that
lets you open one file and see the full picture. If you read nothing else, read
this.

---

## The single sentence that captures the bet

**Edition 1 is voice-perfect at the punchline level and voice-drifted at the
paragraph level. Fix the TL;DRs, ship 6 new chapters, build 4 new widgets,
launch with one contrarian distribution move, and Edition 2 is the artifact
operators send to their replacement. The discipline doesn't change. The receipts
get sharper.**

---

## Top 5 highest-leverage moves, ranked

### 1. Replace the 24 TL;DRs with the voice-perfect versions

**File:** `notes/edition-2/02-voice-fidelity.md` Part A
**Effort:** 30 min total (24 small frontmatter edits)
**Why it matters:** TL;DR is the first thing a reader reads after the title.
The current ones are "summaries." The new ones are hooks. Single biggest voice
win in the artifact, lowest cost.

### 2. Ship the 12 a11y + UX patches

**File:** `notes/edition-2/08-a11y-fixes.md`
**Effort:** ~3 hours total, can split across two commits
**Why it matters:** Glossary popovers (don't navigate away mid-read), focus rings,
fix `--paper` contrast, above-fold proof strip on landing, anchor links on H2s.
Everything is commit-ready diff. ~80% of the user-facing improvement.

### 3. Write the 6 Edition 2 chapters (Ch 25-30)

**File:** `notes/edition-2/01-content-gaps.md` Part B
**Effort:** ~5-7 days (one chapter per day)
**Why it matters:** P0 gaps in Edition 1: evals, team adoption, voice agent
architecture, failure stories with receipts, cost economics deep dive, Anthropic
SDK direct. Outlines exist; just write the bodies. Stays under the 35-chapter
ceiling.

### 4. Add the 10 operator prompts to `/resources`

**File:** `notes/edition-2/06-prompt-library.md`
**Effort:** ~30 min wiring (drop into `src/lib/snippets.ts`, render via existing
`<CopyBlock>`)
**Why it matters:** The `/resources` page is the most-bookmarked URL after the
landing. Tripling the prompt library gives readers a reason to return weekly.

### 5. Ship the contrarian distribution move

**File:** `notes/edition-2/04-distribution.md` Part E
**Effort:** ~30 min ElevenLabs + 1 distributor upload
**Why it matters:** Cheat sheet (Ch 14) → audio → Spotify under the existing
AI-music artist profile. Side door into an audience that doesn't read Substack.
Permanent compounding for ~$0.

---

## What changed across 8 deliverables (the patterns)

### The voice drifted at the seams, not at the marquee

The pull-quotes survived ("Stack envy is the new tab-trash", "Imagination is a
terrible product manager"). The TL;DRs and the body transitions softened. The
4 migration agents preserved Vlad's most quotable lines but smoothed the
connective tissue. The fix is targeted: TL;DRs + 5 specific chapters spot-checked.

### The artifact reads beautifully, then breaks at the glossary

Cmd-K palette, view transitions, dark mode, reading progress — all of it works.
The single biggest reading-flow break: hover a glossary term, click, get
navigated away to the glossary page, lose your spot. Patch 10 fixes it with a
Radix popover. ~20 minutes of work, ~80% of the in-chapter friction gone.

### The book teaches operating AI but doesn't operate its own audience

24 chapters, no per-chapter share buttons, no quote cards, no llms.txt, no
schema.org Article markup. The book's whole pitch is "operator-grade discipline."
The distribution should match. 8 SEO/AEO improvements + 5 launch posts in your
voice + 1 contrarian play.

### The widgets work but the next 4 are obvious

TokenBurnCalculator (Ch 2), TempAgencyLoop (Ch 3), VaultGraphPreview (Ch 4),
HookEventTimeline (Ch 16). All four reinforce load-bearing concepts the prose
explains but the reader still struggles to feel. Specs are build-ready.

---

## Edition 2 chapter list (proposed, ranked)

| # | Title | Status |
| --- | --- | --- |
| 01-24 | (existing) | Tighten TL;DRs, fix voice drifts |
| 25 | Evals — If You Don't Have Them, You Have a Hope | Outline exists |
| 26 | Team Adoption — How A 12-Person Sales Team Actually Uses This | Outline exists |
| 27 | Voice Agents — STT, LLM, TTS, And The Latency Budget That Owns You | Outline exists |
| 28 | Failure Stories With Receipts | Outline + 3 case studies in `05-case-studies.md` |
| 29 | The Token Economics Of An Agent At Scale | Outline exists |
| 30 | Building With The Anthropic SDK Directly | Outline exists |

Total: 30 chapters. Inside the 35-chapter discipline ceiling. P1 gaps (RAG, memory
consolidation, vendor migration, the anti-stack) get sidebars in adjacent chapters
or hold for Edition 3.

---

## Edition 2 widgets (proposed)

Existing 8 stay. Four new:

| # | Widget | Chapter | Status |
| --- | --- | --- | --- |
| 9 | TokenBurnCalculator | Ch 02 + new Ch 29 | Spec ready |
| 10 | TempAgencyLoop | Ch 03 hero | Spec ready |
| 11 | VaultGraphPreview | Ch 04 | Spec ready |
| 12 | HookEventTimeline | Ch 16 | Spec ready |

Total: 12 widgets.

---

## The 5 strategic refusals (saying no IS the brand)

1. **No paid tier.** Free + open. The tier list IS the brand.
2. **No backend, ever.** Static HTML, no signups, no analytics gates. Cmd-K and
   localStorage handle everything personalization-related.
3. **No ChatGPT-killer wrapper marketing.** This is a book. The artifact is a
   surface for the book. We don't sell anything.
4. **No 36th chapter.** Discipline ceiling holds. RAG, vendor migration, anti-stack
   become sidebars or Edition 3.
5. **No corporate hedging in the voice.** Every TL;DR in Edition 2 is voice-perfect
   or it doesn't ship.

---

## Open questions that need your decision

1. **Custom domain?** `belkins.github.io/ai-dive-deep` works. But `aidivedeep.com`
   or `ai.vladyslavpodoliako.com` would be sharper for distribution. Decision
   affects the canonical URLs and the OG cards.

2. **Edition 2 release cadence.** Three options:
   - Big-bang: 6 new chapters + 4 widgets + all patches in one Edition 2 ship.
   - Rolling: ship 1 chapter / week through the newsletter, announce E2 once
     all six land. Builds momentum.
   - Mixed: ship the patches + voice-fidelity fixes immediately, announce
     E2 chapters as they land.
   I'd default to **Mixed** — patches ship today, chapters ship weekly, full E2
   announcement when ch 30 lands.

3. **Russian translation?** You mentioned it as a contrarian distribution move
   in your prior swarm-strategic-plan output. Edition 2 is the natural moment.
   Adds ~3-5 hours of work via Claude. If yes, ship as `belkins.github.io/ai-dive-deep/ru/`.

4. **Audio version on Spotify** (the contrarian move). Yes / no / which chapters
   first. Cheat sheet is the safest first ship. Ch 1, 3, 6, 24 are the next
   most-shareable.

5. **Newsletter integration form.** A no-backend Substack iframe in the footer
   would convert artifact readers → newsletter subs. Worth the visual cost?

---

## Suggested next move

**Today (1 hour):** Apply patches 1-7 from `08-a11y-fixes.md`. They're small,
high-leverage, commit-ready. `.env` contrast, focus rings, skip-link, nav
tap targets, above-fold proof strip, reading-time placement.

**Tomorrow (30 min):** Replace all 24 TL;DRs with the voice-perfect versions
from `02-voice-fidelity.md` Part A. The voice drift fix that takes a half hour.

**This week:** Drop the 10 operator prompts into `/resources` (~30 min). Apply
patches 8-12 (anchor links, glossary popovers, print stylesheet, reduced-motion).

**Saturday (the build day):** Build 1 of the 4 new widgets. TokenBurnCalculator
is the easiest first ship and the highest reader impact.

**The week after:** Write Ch 25 (Evals). Ship as a soft launch via the newsletter.

**A month from now:** Edition 2 is shipped. 30 chapters, 12 widgets, voice-perfect
TL;DRs, glossary popovers, the audio cheat-sheet on Spotify, Russian translation
optional.

---

## Document index

| File | Purpose | Word count |
| --- | --- | --- |
| `BRIEF.md` | Voice rules + hard constraints (locked) | ~600 |
| `01-content-gaps.md` | 15 gaps ranked + 6 chapter outlines | ~5,500 |
| `02-voice-fidelity.md` | TL;DR audit + voice diff + closer-line fixes | ~2,400 |
| `03-reader-ux.md` | First-3-second test + 12 friction points + 10 quick wins | ~2,200 |
| `04-distribution.md` | 5 launch posts + SEO/AEO + contrarian Spotify move | ~1,900 |
| `05-case-studies.md` | The 11 minutes / the $81 Saturday / the 6-minute book | ~2,200 |
| `06-prompt-library.md` | 10 new operator prompts ready for `/resources` | ~2,800 |
| `07-new-widgets.md` | 4 widget specs build-ready | ~1,800 |
| `08-a11y-fixes.md` | 12 commit-ready patches | ~2,400 |
| `SYNTHESIS.md` | This file | ~1,400 |
| **Total** | | **~23,200 words** |

---

## The closer

Edition 1 shipped on a Saturday. Edition 2 ships in chapters, voice fixes, and
patches you can commit between deals. The discipline doesn't change. The
receipts get sharper.

The list will rewrite itself. The voice won't.
