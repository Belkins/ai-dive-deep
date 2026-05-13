# Ch 38 fact-check report

## Method
Read the chapter, checked each claim against the source-of-truth trend notes (`claude-code-commands-may26.md` and `anthropic-90day.md`). Verified cross-link slugs by listing `src/content/chapters/`. Calculated cost claims against pricing already confirmed in the trend notes (Opus 4.7 = $5/$25 per million; Haiku 4.5 = $1/$5 per million) — no WebSearches needed since pricing was already first-party confirmed in `anthropic-90day.md`.

---

## Verified claims (no action needed)

- **`/goal` shipped in Claude Code v2.1.139** (chapter line 6, 30): CONFIRMED — `claude-code-commands-may26.md` lines 10, 26, 346; `anthropic-90day.md` line 13.
- **Ship date May 11, 2026** (chapter line 6, 30): CONFIRMED — `claude-code-commands-may26.md` lines 10, 27; `anthropic-90day.md` line 13.
- **v2.1.140 hotfix the next day for silent-hang under certain hook configurations** (chapter line 30): CONFIRMED — `claude-code-commands-may26.md` lines 12, 29, 83 ("v2.1.140 fixed `/goal silently hanging with certain hook configurations`").
- **Official docs URL https://code.claude.com/docs/en/goal** (chapter line 30): CONFIRMED — `claude-code-commands-may26.md` line 10, 22, 381.
- **Session-scoped, wraps a prompt-based Stop hook** (chapter line 32): CONFIRMED — `claude-code-commands-may26.md` line 50 ("`/goal is a wrapper around a session-scoped prompt-based Stop hook`").
- **`/clear` removes it; `--resume` restores it but counters reset** (chapter line 36): CONFIRMED — `claude-code-commands-may26.md` lines 50–51.
- **One goal per session; new one replaces old** (chapter line 37): CONFIRMED — `claude-code-commands-may26.md` line 52.
- **Aliases for `/goal clear` are `stop`, `off`, `reset`, `none`, `cancel`** (chapter line 37): CONFIRMED — `claude-code-commands-may26.md` line 72; also in `anthropic-90day.md` line 15.
- **Default evaluator is Haiku** (chapter line 32, 148): CONFIRMED — `claude-code-commands-may26.md` line 53 ("default: Haiku, per `/en/model-config`"); `anthropic-90day.md` lines 12, 112 ("Haiku 4.5 is what powers the `/goal` evaluator").
- **Evaluator has no tools; cannot run commands or read files** (chapter line 38): CONFIRMED — `claude-code-commands-may26.md` line 53.
- **Condition must be demonstrable in transcript / test stdout caveat** (chapter line 40): CONFIRMED — `claude-code-commands-may26.md` line 80.
- **`disableAllHooks` / `allowManagedHooksOnly` disables `/goal` and tells you why** (chapter line 42): CONFIRMED — `claude-code-commands-may26.md` line 77.
- **Overlay panel: elapsed time, turns evaluated, tokens spent** (chapter line 20, 56–57): CONFIRMED — `claude-code-commands-may26.md` lines 56–57, 114.
- **"why not yet" reason surfaces after each turn** (chapter line 57, 169): CONFIRMED — `claude-code-commands-may26.md` lines 57, 116.
- **`/loop [interval] [prompt]` interval-driven** (chapter line 50): CONFIRMED — `claude-code-commands-may26.md` lines 154–158 (`/loop 5m check if the deploy finished` is the canonical example, verbatim match).
- **Stop hooks live in `settings.json`, exit code 0 means done** (chapter line 52): CONFIRMED — implied by `claude-code-commands-may26.md` line 99.
- **`/goal` with "or stop after N turns" / 20-turn / 30-turn syntax** (chapter line 86, 87, 167): CONFIRMED — `claude-code-commands-may26.md` lines 81 ("Without `or stop after 20 turns`") and 108–111 (verbatim "or stop after 30 turns").
- **Plan→Auto→/goal stacking framing** (chapter line 66–76): CONFIRMED — `claude-code-commands-may26.md` line 321 has the docs framing verbatim: "auto mode removes per-tool prompts, and `/goal` removes per-turn prompts," and lines 318–323 lay out the full Plan→Auto→/goal stack.
- **Cross-link Ch 7 (cron)**: CONFIRMED — `src/content/chapters/07-cron.mdx` exists.
- **Cross-link Ch 16 (hooks-subagents)**: CONFIRMED — `src/content/chapters/16-hooks-subagents.mdx` exists. Chapter links to `/chapters/16-hooks-subagents` (matches).
- **Cross-link Ch 21 (three-modes)**: CONFIRMED — `src/content/chapters/21-three-modes.mdx` exists. Chapter links to `/chapters/21-three-modes` (matches).

---

## Unverified claims — need source or removal

- **"Anthropic's own framing" / "the docs' own framing" quote about Plan→Auto→/goal stack** (chapter line 68: "Anthropic's docs frame `/goal` as the third rung of an autonomy ladder"): PARTIALLY VERIFIED. The trend notes paraphrase the framing on line 321 ("that's the docs' own framing: 'auto mode removes per-tool prompts, and `/goal` removes per-turn prompts'") but the chapter's framing of an explicit "third rung of an autonomy ladder" is the author's gloss, not a direct Anthropic quote. **Suggest**: keep the framing, but the wording "Anthropic's docs frame" overstates — the docs frame the per-prompt-removal pattern; the "ladder/rung" language is the chapter's. Soften to "the docs frame these as composable: auto removes per-tool prompts, `/goal` removes per-turn prompts."
- **Eval cost: "Opus turn ~$0.45, Haiku eval ~$0.003"** (chapter line 148): UNVERIFIED-BUT-DEFENSIBLE. Pricing inputs are confirmed (Opus 4.7 = $5/$25 per M; Haiku 4.5 = $1/$5 per M — `anthropic-90day.md` lines 96, 109). The Opus $0.45/turn figure is plausible for a heavy coding turn (~30k input + 5k output ≈ $0.275; rounding up for thinking tokens and tool I/O — $0.45 is the high end but not unreasonable). The Haiku $0.003 figure is plausible *only if* the evaluator reads incremental delta (~3k tokens), not full transcript. The trend notes (`claude-code-commands-may26.md` line 82) say "typically negligible compared to main-turn spend" but give no per-turn dollar figure. **Suggest**: either soften to "roughly $0.40 vs roughly under a cent" (avoid spurious precision) or add a footnote "back-of-envelope at $5/$25 and $1/$5 per million; your mileage varies."
- **"$13.50 in eval cost on top of $13.50 in main-turn cost" for a 30-turn session** (chapter line 150): UNVERIFIED. Derived math from the $0.45/turn figure above. If the $0.45 number is shaky, this derived number compounds the uncertainty. **Suggest**: same as above — soften the precision.
- **"47-turn session that should have cost $20 cost $42"** (chapter line 152): UNVERIFIED — operator anecdote, no public source. Plausible but not in trend notes. Acceptable as personal narrative.
- **"$11" loss on the open-ended vibe-eval research run** (chapter line 24, 160): UNVERIFIED — operator anecdote. Acceptable as personal narrative.
- **"$0.04 Haiku spend + $3.12 Opus spend" on the model-bump migration** (chapter line 22): UNVERIFIED — operator anecdote. Plausible at the confirmed pricing. Acceptable.
- **"30+ turn" / "12 turn" / "18 minute" specifics in the opening scene** (chapter lines 20–22): UNVERIFIED — operator anecdote. Acceptable as personal narrative.
- **"June 15 deprecation deadline" for `claude-3-5-sonnet`** (chapter line 18): The trend notes mention June 15, 2026 as the Sonnet 4 / Opus 4 deprecation deadline (`anthropic-90day.md` line 120), not specifically for `claude-3-5-sonnet`. **Suggest**: minor — `claude-3-5-sonnet` was deprecated earlier; the chapter's scene works as narrative but the model name + June 15 pairing isn't quite the live deprecation cycle the notes confirm. Either change the model name to `claude-sonnet-4` to match the actual June 15 sweep, or generalize ("before the deprecation deadline"). **MEDIUM** priority — operator readers will catch the mismatch.
- **"Saturday, May 16, 2026" scene** (chapter line 173): The chapter's current "today" anchor is May 12. May 16 is a forward-looking date. UNVERIFIED as past-tense anecdote (it's in the future relative to the chapter's opening scene). **Suggest**: change to a past Saturday, e.g. "Saturday a few weeks back" or pick a date before May 12. Or acknowledge it's hypothetical. **LOW-MEDIUM** — readers may notice the date sequence is incoherent (opening is May 12, "what I got wrong" is May 16).

---

## Wrong claims — must fix

- **None identified as outright wrong.** The chapter's factual spine — version, date, hotfix, aliases, evaluator model, docs URL, syntax — all match the trend notes precisely.

---

## Sentence-level voice issues

Scanned for banned words ("amazing", "incredible", "powerful", "game-changer", "thrilled"). **None found.** Voice is in spec — lowercase tolerant, em-dashes present, no influencer cadence.

Minor cadence flags (none banned, but worth a glance):
- Line 24: "The first run was the whole point of `/goal`. The second run was the warning label." — strong, in-voice.
- Line 26: "If you can't measure done, you can't run until done." — strong, in-voice.
- Line 62 (PullQuote): "/goal removes per-turn prompts the way auto mode removes per-tool prompts. it's the same wedge, one level up." — in-voice; "wedge" is a Vlad word and lands.
- Line 167: "Determinism beats vibes when the vibes can cost $11." — in-voice.
- Line 175: "A clock condition only knows about the clock." — strong closing turn, in-voice.

No sentences drift toward influencer cadence.

---

## Cross-link integrity

- **Ch 7 (cron)**: exists — `07-cron.mdx`. Link `/chapters/07-cron` matches.
- **Ch 16 (hooks)**: exists — `16-hooks-subagents.mdx`. Link `/chapters/16-hooks-subagents` matches.
- **Ch 21 (three-modes)**: exists — `21-three-modes.mdx`. Link `/chapters/21-three-modes` matches.

All three cross-links are intact.

---

## Severity summary

- **HIGH (must fix before next deploy):** 0 issues
- **MEDIUM (should fix soon):** 3 issues
  1. `claude-3-5-sonnet` + June 15 model-name mismatch in opening scene (line 18) — operator readers will catch
  2. Eval-cost specificity ($0.45 / $0.003) — defensible at confirmed pricing but presented with more precision than the trend notes support; either soften or footnote
  3. "Anthropic's docs frame `/goal` as the third rung of an autonomy ladder" overclaims attribution — the ladder/rung framing is the chapter's, not the docs'; the docs only frame the per-prompt-removal pairing
- **LOW (nice to fix):** 1 issue
  1. May 16 scene-date is future-relative to opening May 12 scene — minor coherence issue

---

## Overall verdict

**fix-and-ship.** Factual spine is clean — all version numbers, dates, aliases, docs URLs, syntax, and cross-links verify against the trend notes. Three medium issues are gloss/precision/date-coherence problems, not factual errors. No banned voice words. No broken cross-links. No wrong claims.

Severity counts: 0 HIGH / 3 MEDIUM / 1 LOW — overall verdict: fix-and-ship.
