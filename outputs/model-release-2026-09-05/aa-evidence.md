# AA Evidence Handoff

Captured 2026-09-05. Public HTML only, no keyed API. Parsed `application/ld+json`
script nodes with parse5, then `JSON.parse`; joined Dataset rows by exact label.
No raw page, complete dataset, benchmark tasks or grading prompts retained.

## Sources

- [Public models board](https://artificialanalysis.ai/models)
- [Current methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking)
- [v4.2 announcement, September 4](https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-2)
- [Astra model detail](https://artificialanalysis.ai/models/gpt-6-astra)
- [Source terms](https://artificialanalysis.ai/docs/legal/Terms-of-Use.pdf)

Dataset attribution: Artificial Analysis (2025). LLM benchmarks dataset.
The JSON-LD license points to website terms, not an open-data license.
`isAccessibleForFree` is not permission to redistribute. The existing unsupported
"fair-use" assertion was removed. This is a small attributed factual selection,
not a licensed feed; no claim of legal clearance is made. AA's terms restrict
reproduction and automated extraction, so do not expand into a dataset mirror
or recurring scraper without permission. Publication/licensing review remains
with the owner; these implementation changes do not grant redistribution rights.

## Comparable Selection

Seven settings, not the whole board. Index/speed rounded to one decimal and
USD/task to three. Source numerics were joined before rounding.

| Exact AA label | v4.2 Index | USD/Index task | Chart tok/s |
| --- | ---: | ---: | ---: |
| Claude Fable 5.1 (max with fallback) | 56.8 | 6.117 | 67.1 |
| GPT-6 Astra (max) | 54.7 | 2.567 | 62.5 |
| Claude Opus 5 (max) | 54.1 | 4.205 | 57.5 |
| Muse Spark 1.3 (max) | 53.0 | 0.959 | 190.1 |
| GPT-5.6 Sol (max) | 51.3 | 1.249 | 85.4 |
| Gemini 3.8 Flash (high) | 47.1 | 0.738 | not in captured chart |
| GPT-5.6 Luna (max) | 43.4 | 0.097 | 133.0 |

Index uses `Artificial Analysis Intelligence Index.data[].intelligenceIndex`,
cross-checked where available with `Intelligence.artificialAnalysisIntelligenceIndex`.
Task costs use `Cost per Task.costPerIntelligenceIndexTask`; Sol is absent there,
so its cost is the sum of `answer`, `reasoning`, `cacheWrite`, `cacheHit`, and
`input` in `Cost per Intelligence Index Task` (1.2494611748928333 before rounding).
Speed uses `Output Speed.outputSpeed`, corroborated where present with
`Speed.medianOutputSpeed`. Fable's cost exists in the highlight Dataset, although
its token-component row is absent from the larger cost Dataset.

## Caveats

- Astra xhigh appears in the public page summary, but neither Intelligence
  JSON-LD chart contains its numeric row. No xhigh score, task cost or speed
  is asserted. The source page summary and structured subset are not identical.
- Astra max detail summary says 87.5 tok/s, while the /models chart reports
  62.4665467134099. Keep the chart's value and explicit provenance; do not join
  values across these contexts. Gemini speed is left undefined.
- The former `/models/capabilities/agentic` returned HTTP 404. No standalone
  Agentic scores were verified. All August agentic numbers are removed from
  the moving snapshot; the panel has no Agentic ranking or dead source link.
- v4.2 changes benchmarks, weights and grading. A lower Index than the August
  snapshot is not evidence of model regression; cost denominators changed too.
- Methodology: 10 benchmarks; Agents 30%, Coding 20%, Scientific Reasoning 20%,
  General 30%. Adds AA-Briefcase and GDP.pdf, removes GPQA Diamond, upgrades
  AA-LCR v1.1 and regrades SciCode v1.0.1. Full weights live in the module.
- AA estimates an aggregate 95% interval below +/-1%. That is not a pairwise
  significance test. Remove the old blanket tie / 0.98-point claims.
- The current selected leader is also the most expensive selected setting.
  Luna is cheapest in this selection, not proven cheapest across all AA models.
  Do not interpret a percentage of a weighted Index as a capability percentage.
- The July Opus effort ladder and its separate capture date remain unchanged.
  The July vendor-coordination disclosure must not be attached to Fable 5.1.

## Main-Owned Consumers

- `src/pages/tier-list.astro`: FAQ economics/old ratios, Opus/Fable FAQ, opening
  refresh paragraph, AA introduction/version, dead Agentic links, and apparent
  full-board claims. Replace with current limited-selection caveats. The moving
  capture interpolation currently risks relabeling old economics as current.
- `src/pages/opus-5/index.astro`: FAQ near line 49, AA comparison near line 204,
  and ladder caption near line 172. Preserve July figures, but qualify the claim
  that AA no longer lists effort variants: its summary now names Astra xhigh,
  while the captured structured subset omits it. Old numeric comparisons must
  be visibly historical, not current routing evidence.
- `src/pages/opus-5/use-cases.astro`: July AA-Briefcase recommendation and July
  latency / knowledge-reliability FAQs are historical measurements, not v4.2.
  Keep their July source dates explicit; do not silently refresh their dates.
- `src/lib/research-notes.ts`: existing July note is historical and stays dated;
  add a separate September note rather than overwriting its receipts.
- `src/lib/aa-rank.ts` and `tests/aa-rank.test.mjs`: no behavior changes needed;
  their comments still say Intelligence/Agentic leaders currently coincide.
  `agenticLeader` returns undefined for this capture; the panel no longer calls it.
- Main's catalog and Astra/Fable chapter plan should distinguish the exact max
  and max-with-fallback results from xhigh/default settings. Do not infer an
  independent score from availability or AA's prose mention alone.
- `src/widgets/TierListBuilder.tsx::DEFAULT_PLACEMENTS` was not touched.

## Verification

Focused verification: `node --test tests/aa-rank.test.mjs tests/aa-snapshot.test.mjs`
passed all 12 tests on Node 26.3.0 and `/usr/local/bin/node` 20.9.0.
Scoped TypeScript program check for the library and widget: zero diagnostics.
Scoped `git diff --check`: clean. No commit, push or personal placement changes.
The new test uses in-memory TS transpilation rather than Node's native type
stripping, including SSR checks for each supported sort and missing speed.
Final focused rerun on Node 20.9.0: all 12 tests passed.
Main reports build/check and all 139 tests passed, with AA sorts and missing-value
behavior verified at 320px. These assembled-page results were reported by main,
not independently rerun by this worker. Main will rerun the final full gates
after this handoff. AA implementation and evidence are ready; no further edits
are planned.
