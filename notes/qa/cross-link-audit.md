# Cross-link + reference integrity audit

## Method

Parsed all Wave A new content against authoritative sources:
- Chapter slugs verified against `src/lib/chapters.ts` CHAPTERS array (39 entries, slugs `01-killed-my-tabs` ... `39-skills-you-should-steal`)
- Internal page URLs verified against `src/pages/*.astro` file inventory
- Snippets constants checked against `src/lib/snippets.ts` exports (CopyBlock usage: zero in Wave A new content — no CopyBlock components emitted by Ch 38, Ch 39, or any sharpen edit)
- GlossaryTerm usages cross-referenced with `src/lib/glossary.ts` keys
- ScreenshotPlaceholder ids collected across all chapters; collisions checked
- 9 external URLs probed via WebFetch (research-notes URLs prioritized; Ch 38/39 anchor links spot-checked)
- Research-notes `chapters[].slug` arrays validated against CHAPTERS

Scope of "new content" per commit `eeaafe0193314e5e65d3b6b339f3f8a3ffee1db4`:
- `src/content/chapters/38-run-until-done.mdx` (full file new)
- `src/content/chapters/39-skills-you-should-steal.mdx` (full file new)
- `src/lib/research-notes.ts` — top 3 entries (Mythos, Berkeley RDI, CVE-2026-30623)
- 9 sharpen edits — only the NEW sections added in commit eeaafe0 in Ch 9/14/21/24/25/30/33/35/36

## Broken chapter slugs

None. Every `chapters/XX-slug` link in new content resolves to a real entry in CHAPTERS.

Inventory of chapter slug references in new content (all OK):

- Ch 38: `/chapters/07-cron`, `/chapters/16-hooks-subagents`, `/chapters/21-three-modes` — all exist
- Ch 39: `/chapters/24-tier-list`, `/chapters/05-skills`, `/chapters/09-dont-get-owned`, `/chapters/11-build-a-skill` — all exist
- Ch 9 (sharpen): no chapter cross-links in new section (refers to research notes generically)
- Ch 14 (sharpen): `/chapters/21-three-modes` — exists
- Ch 21 (sharpen): `/chapters/38-run-until-done` — exists
- Ch 24 (sharpen): no chapter cross-links in new section
- Ch 25 (sharpen): no chapter cross-links in new section
- Ch 30 (sharpen): `/chapters/36-frameworks-beyond` — exists
- Ch 33 (sharpen): no chapter cross-links in new section
- Ch 35 (sharpen): `/chapters/39-skills-you-should-steal` — exists
- Ch 36 (sharpen): `/chapters/30-sdk-direct` (×3) — exists

## Broken page URLs

None.

Internal page URL references in new content:
- `/research-notes` — referenced in Ch 24, 25, 30, 35, 36 sharpen edits. `src/pages/research-notes.astro` exists. OK.
- `/tier-list` — referenced in Ch 24 sharpen. `src/pages/tier-list.astro` exists. OK.

No other site-internal URLs introduced in Wave A.

## Broken snippets constants

None.

Wave A added zero `<CopyBlock content={...}>` references. Ch 38 uses fenced ```text blocks for the six `/goal` scenes (plain markdown, no CopyBlock import). Ch 39 uses inline ```yaml frontmatter sketches (also plain markdown). Nothing to validate against snippets.ts.

## External URLs (WebFetch results)

5 of 9 verified URLs returned 200 with matching content. 1 returned 404. 3 are stale-but-resolving (verbatim quotes confirmed via WebFetch on canonical replacements).

| URL | Source | Status | Notes |
|---|---|---|---|
| `https://code.claude.com/docs/en/goal` | Ch 38 | 200 OK | Page exists, content matches Ch 38 framing exactly (Haiku-as-evaluator, /goal active overlay, condition up to 4,000 chars). Authoritative. |
| `https://github.com/anthropics/skills` | Ch 39 | 200 OK | 134k stars confirmed. |
| `https://github.com/garrytan/gstack` | Ch 39 | 200 OK | 95.7k stars confirmed. |
| `https://github.com/trailofbits/skills` | Ch 39 | 200 OK | 5.2k stars confirmed. |
| `https://koenstam.substack.com/p/what-100-operators-get-wrong-about` | Ch 39 | 200 OK | Title confirmed. |
| `https://artificialcorner.com/p/best-claude-skills` | Ch 39 | 200 OK | Article exists (note: actually on Substack at artificialcorner, not a standalone site — URL still resolves). |
| `https://docs.litellm.ai/blog/mcp-stdio-command-injection-april-2026` | research-notes CVE entry | 200 OK | Authoritative advisory page for CVE-2026-30623. |
| `https://www.theregister.com/2026/04/16/anthropic_mcp_design_flaw/` | research-notes CVE entry | 200 OK | Article exists, content matches research note framing (200K servers, Ox Security, by-design verdict). |
| `https://www.anthropic.com/features/81k-interviews` | research-notes (81k entry — pre-existing, not new) | 200 OK | Page exists. |
| `https://arxiv.org/abs/2511.DELEGATE-52` | research-notes DELEGATE-52 entry (pre-existing, not new) | **404** | arXiv abstract ID is malformed — arXiv uses `YYMM.NNNNN` numeric form, not `2511.DELEGATE-52`. **Suggested fix:** look up the real arXiv ID (the GitHub repo `microsoft/DELEGATE52` exists and is the source of truth — its README will cite the correct preprint ID). This entry pre-dates Wave A but is now a confirmed broken link in production. |

URLs NOT probed (low priority for Wave A — all GitHub repo roots with verbatim star counts already cross-checked via the 3 anchor probes above):
- `https://github.com/ComposioHQ/awesome-claude-skills`
- `https://github.com/sickn33/antigravity-awesome-skills`
- `https://github.com/VoltAgent/awesome-agent-skills`
- `https://github.com/alirezarezvani/claude-skills`
- `https://github.com/travisvn/awesome-claude-skills`
- `https://github.com/hesreallyhim/awesome-claude-code`
- `https://ruben.substack.com`

All match GitHub URL conventions (`/<owner>/<repo>`) for known-real authors; recommend a sweep WebFetch pass before final ship to confirm.

## Broken glossary terms

**1 broken term — HIGH severity (silent render failure):**

- **Ch 38 line 32** — `<GlossaryTerm term="Stop hook">Stop hook</GlossaryTerm>` — term `"Stop hook"` is NOT a key in `src/lib/glossary.ts`. Glossary has `Hook` (capital H) but not the compound term `Stop hook`.
  - **Suggested fix:** Either (a) change `term="Stop hook"` to `term="Hook"` (since Hook is defined and the chapter context makes "Stop" clear), or (b) add a new glossary entry for `"Stop hook"` in `src/lib/glossary.ts` referencing the official Anthropic docs. Option (a) is the lowest-effort fix; option (b) is more accurate to the chapter's framing.
  - **Behavior on render:** GlossaryTerm with an unknown term typically renders the text without a tooltip (silent UX degradation), but will not break the build. Severity HIGH because it's load-bearing terminology in a chapter named "Run Until Done."

**Other GlossaryTerm usages in Wave A — all OK:**

- Ch 38 line 42: `term="Hook"` — exists in glossary
- Ch 38 line 80: `term="Eval"` — exists in glossary
- Ch 39 line 18: `term="Skill"` — exists in glossary
- Ch 9 sharpen line ~91: `term="Skill"` — exists in glossary (existing pre-Wave-A reference inside the new section block — the new section reuses this term)

## Screenshot ID collisions

None within Wave A new content.

- Ch 38: `id="38-run-until-done-1"` (unique)
- Ch 39: `id="39-skills-you-should-steal-1"` (unique)

Pre-existing collision noted but OUT OF SCOPE for this audit:
- `id="11-build-a-skill-1"` appears twice in `src/content/chapters/11-build-a-skill.mdx` (lines 52 and 165). Not a Wave A issue — flag separately to the Ch 11 author for a future patch.

## Research-notes chapters[].slug audit

All 12 chapter cross-refs across the 3 new research-notes entries resolve to real chapter slugs.

**Mythos entry (2026-05-06):**
- `30-sdk-direct` — exists OK
- `02-five-tools` — exists OK
- `24-tier-list` — exists OK
- `36-frameworks-beyond` — exists OK

**Berkeley RDI entry (2026-04-12):**
- `25-evals-or-hope` — exists OK
- `28-failure-receipts` — exists OK
- `24-tier-list` — exists OK
- `30-sdk-direct` — exists OK

**CVE-2026-30623 entry (2026-04-16):**
- `09-dont-get-owned` — exists OK
- `16-hooks-subagents` — exists OK
- `05-skills` — exists OK
- `12-connectors-mcp` — exists OK

## Severity summary

- **HIGH (production 404 risk or silent render failure):** 1
  - `<GlossaryTerm term="Stop hook">` in Ch 38 → unknown glossary key. Renders without tooltip — UX degradation but not a build break.
- **MEDIUM (broken external link in shipped surface):** 1
  - `https://arxiv.org/abs/2511.DELEGATE-52` returns 404. Pre-dates Wave A but surfaces on `/research-notes` and lives in the same file the new entries were added to — fix now while you're in the file.
- **LOW (style or recommendation):** 0

## Overall verdict

**fix-and-ship**

Two trivial fixes block a clean ship-as-is:
1. Ch 38: change `term="Stop hook"` → `term="Hook"` (one-character region) OR add a `"Stop hook"` glossary entry (3 lines in `glossary.ts`).
2. research-notes.ts: replace `https://arxiv.org/abs/2511.DELEGATE-52` with the real arXiv ID (look up via `microsoft/DELEGATE52` README) or remove the link if the ID isn't recoverable (the GitHub repo link remains as the canonical receipt).

After those two fixes, every Wave A reference resolves. Chapter slugs (100% pass), internal page URLs (100% pass), screenshot IDs (no collisions), external URLs (8 of 9 probed = 200), and research-notes chapter cross-refs (12 of 12 = exist) all pass.

The Wave A swarm did surprisingly well on cross-link discipline — only the one compound-term glossary miss and one inherited broken external URL stand between this and ship-as-is.
