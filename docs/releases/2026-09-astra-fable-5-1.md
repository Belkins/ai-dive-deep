# Astra and Fable 5.1 Release Plan

Status: proposed editorial release, not published chapters.
Evidence checked: 2026-09-05. Owner and final editorial reviewer: Vlad.
Implementation tracking: https://github.com/Belkins/ai-dive-deep/issues/21

## Release Decision

Refresh the existing tier-list reference now. Prepare two substantial model
chapters and one measured comparison report. Do not manufacture ten overlapping
launch articles or turn an independent leaderboard position into a personal
recommendation. The differentiator is a reader leaving with a tested workflow,
an inspectable artifact, and a cost boundary.

The existing 48 numbered chapters teach durable operating methods. These next
chapters should connect new models to that material, not repeat it. Proposed
chapter numbers below must be checked against main immediately before writing.

## Sequence

Dates are editorial targets, not a schedule or promise of automatic publication.
No new job, API spend, model trial, or newsletter send is authorized by this plan.

| Stage | Target | Deliverable | Gate |
| --- | --- | --- | --- |
| Reference refresh | September 5 | Current release notes and dated benchmark tables on `/tier-list/` | Sources, configuration labels, build, responsive QA |
| Editorial brief | September 7 | Complete outlines and reproducible fixture specifications for both chapters | Scope and source review |
| Chapter 49 | September 9 | Astra field manual with clearly separated published evidence and local results | Access verified; at least one completed, reviewed workflow if presented as hands-on |
| Chapter 50 | September 11 | Fable 5.1 field manual with a fallback-aware workflow | Serving-model attribution, migration checks, and artifact review |
| Comparison report | September 14 or later | Astra vs Fable 5.1 on the same operator tasks | Matched runs complete, failures included, costs reconciled |

Missing access, budget approval, or receipts moves the measured report, not the
evidence standard. A source-only guide may ship earlier, explicitly identified
as research; it must not contain a first-person performance verdict.

## Chapter 49: GPT-6 Astra for Real Work

Proposed canonical: `/chapters/49-gpt-6-astra/`.
Working title: **GPT-6 Astra: Performance, Use Cases, and the Cost of a Finished Job**.
Reader: founder or operator deciding whether to escalate a difficult task from
an existing model. Search intents are hypotheses, not measured keyword volumes:
"GPT-6 Astra use cases", "Astra performance", "Astra Codex", "Astra pricing".

Answer to earn: which work deserves an Astra trial, and what evidence would make
you keep the cheaper baseline?

1. **What shipped and where it is available.** Separate Chat, Work, Codex, and
   API access. Use exact model IDs; do not assume a visible product label or
   runtime-only effort option is a public API contract.
2. **What performance numbers do and do not say.** Put independent measurements
   beside vendor claims, retaining benchmark version, effort, harness, capture
   date, and scoring method. No blended "overall win rate" across unrelated tests.
3. **Fix a real class of repository bug.** A disposable multi-file fixture,
   hidden tests, one scope boundary, and a human-readable diff. Show a failure
   or unnecessary edit as well as the accepted patch.
4. **Turn source material into a decision brief.** A fixed corpus with one stale
   source and one missing answer; require traceable citations and explicit unknowns.
5. **Produce a usable document.** Supply a template and check the artifact,
   not the agent's description of it. Inspect mobile/desktop HTML and exported files.
6. **The long-context and effort bill.** Separate token rates, cache events,
   tool charges, failed attempts, and human corrections. Compare like workloads.
7. **Where not to start.** Cheap extraction, latency-bound interactions, and
   tasks without a reliable acceptance test are not automatically frontier-model jobs.
8. **A reproducible handoff.** Prompt/specification, fixtures, tests, observed
   failure log, and a routing decision with an expiry/review date.

Suggested visual: a real annotated accepted diff or source-evidence table from
the exercise. An editorial cover may match the existing style but must not stand
in for performance evidence. Never fabricate benchmark screenshots.

## Chapter 50: Claude Fable 5.1 for Difficult Workflows

Proposed canonical: `/chapters/50-claude-fable-5-1/`.
Working title: **Claude Fable 5.1: Best-Fit Workflows, Fallbacks, and Real Costs**.
Reader: a Claude Code/Cowork operator deciding when an Opus baseline is insufficient.
Intent hypotheses: "Fable 5.1 use cases", "Fable 5.1 vs Opus 5", "Fable 5.1
Claude Code", "Fable 5.1 cache pricing".

1. **Identity and access.** Fable 5.1 is a separate version from Fable 5; do not
   copy Mythos 5.1 scores or restricted-access demonstrations into its verdict.
2. **Which evidence supports a trial.** Long-running engineering and
   document-heavy work are candidates, not promises of unattended correctness.
3. **Root-cause investigation.** Reproduce a seeded application crash, trace it
   across modules, repair it, and prove that unrelated behavior still works.
4. **Research carried into deliverables.** Build a report and spreadsheet from
   the same fixed inputs; reconcile totals and audit every factual statement.
5. **Scope and checkpoint discipline.** Define allowed writes, interruption
   recovery, reviewer responsibilities, and explicit stop conditions.
6. **Fallback is part of the system.** Record the model that served each step,
   refusal/partial-output status, retries, and billed iterations. A pure-model
   run and a fallback-enabled run are different experimental conditions.
7. **Pricing without the misleading discount headline.** Cache reads are not
   all tokens. Compare cold and warm contexts and include failed attempts.
8. **Migration and when to stay on the baseline.** Check tool choice, thinking
   blocks, streaming, endpoint support, plan permissions, and latency targets.
   Verify Covered Model retention requirements before using enterprise data:
   existing ZDR access does not automatically carry over. Record any authorized
   exception; distinguish interim eligible-customer ZDR access from the announced
   future EFS rollout. Do not enable retention or change organization terms
   without the data owner's approval.

Suggested visual: an actual workflow trace showing the serving model and review
checkpoint, paired with a redacted accepted artifact. Customer testimonials from
the launch remain attributed anecdotes, not our test results.

## Comparison Report: Astra vs Fable 5.1

Proposed canonical: `/astra-vs-fable-5-1/`. It is a report, not a third copy of the
two model introductions. Lead with the decision matrix and link back for specs.

Proposed title: **Astra vs Fable 5.1: Six Operator Tasks, Costs, and Failures**.
Use this title only after the tests are run. Until then: **Test Protocol**.

| Fixture | Accepted output | Main failure to detect |
| --- | --- | --- |
| Multi-file bug repair | Hidden tests pass; diff stays in scope | Superficial fix, unrelated changes |
| API migration | Contract tests and supported streaming paths pass | Invented parameters or obsolete endpoints |
| Evidence-backed market brief | Claims trace to supplied sources | Fabricated citation, ignored contradictory evidence |
| Pipeline analysis | Totals match a held-out answer key | Double counting, wrong denominator, misleading chart |
| Client report and deck | Editable files with accurate facts and legible layout | Overflow, broken images, altered figures |
| Browser/CRM dry run | Correct synthetic records and zero unauthorized writes | Duplicate actions, approval bypass, unrecoverable interruption |

Proposed configurations: Astra high/max, Fable 5.1 high/max, Opus 5 high, and
GPT-5.6 Sol high. Check availability before freezing the roster. Same effort name
does not mean the same compute budget. Report both configuration-specific
results and cost/latency-constrained decisions; do not quietly equalize labels.

Pilot: six fixtures x six configurations x one run = 36 runs. Expand to three
repeats per fixture/configuration = 108 total runs only after the pilot and a
separately approved spend cap. This is a small local evaluation, not a statistically
representative market benchmark. Claude's dateless IDs, including
`claude-fable-5-1`, pin fixed model snapshots; they are not moving aliases.
Serving infrastructure can still change, so preserve timestamps, provider
request IDs, and routing information. Check each provider's versioning contract.

Protocol:

1. Freeze fixture hashes, expected outputs, rubric, prompt, tool versions,
   permissions, and stop conditions before seeing results.
2. Use synthetic or explicitly cleared data. No customer secrets, live outreach,
   production migrations, or actual CRM writes in the exercise.
3. Randomize run order and start fresh sessions. Keep matched context, tools,
   permission boundaries, time limits, and maximum spend across model comparisons.
   Freeze service tiers separately from reasoning effort; Standard, Fast, and
   Flex can have different latency and billing even for the same model ID.
4. Record exact requested and serving model, effort, harness commit, provider,
   endpoint, requested/actual service tier, timestamp, cold/warm cache condition,
   tool calls, input/output/cache tokens, fallback, elapsed time, and human
   interventions. Distinguish API refusals, safety-monitor stops, partial
   execution, and reviewable Chat/Codex pauses rather than grouping them as
   generic failures.
5. Use deterministic tests where possible; blind the artifact reviewer to the
   model name. Record initial acceptance and acceptance after correction separately.
6. Reconcile billing including all attempts, cache writes, tools, and fallbacks.
   Cost per accepted output = total run spend / accepted outputs; if none pass,
   report no accepted output, not zero cost. Report human review minutes separately.
7. Publish every failure and timeout. With three repeats show individual values
   and the range; do not imply a reliable p95 or statistical equivalence.
8. Store a redacted evidence pack with fixture license, manifests, raw results,
   accepted artifacts, test output, and limitations. Never add invented rows to
   complete a chart.

## Tier and Model Reference Contract

- `/tier-list/` owns the current benchmark comparison. Keep model configuration,
  publication cutoff, our capture date, source, metric, and uncertainty together.
- AA v4.2 scores are not a continuation of v4.1.1 scores. No change arrows or
  percent improvement across that boundary. Missing metrics stay missing.
- Arena votes measure preference in a specific setting. Its Agent percentages
  are not Elo. Sample size and overlapping intervals limit rank interpretation.
- The personal tool tier builder remains unchanged until Vlad supplies or
  approves first-hand receipts. Candidate models are not automatically S-tier.
- Existing Fable 5 and Opus 5 model files remain dated records. Link to the current
  comparison; do not replace old receipts with new dates or silently rename models.

## Discovery and Release QA

One canonical URL per new piece. Do not also create a thin model hub with the
same text. Preserve the older Fable 5 URLs; any future consolidation needs a
content audit and explicit redirect map.

When chapters are actually ready, update chapter registration, Library, search,
RSS/changelog, sitemap, and llms summaries from the real published content.
Link from the tier list, the older model files, Chapter 25 (evals), Chapter 29
(cost), and Chapter 35 (Codex and Claude Code). Link to the workflow planner as
the practical next step. Main-site Thoughts should add an original operator
angle and link to the evidence, not syndicate the entire chapter.

Each piece needs a concise opening answer, substantive worked examples, dated
sources, honest author/reviewer credit, descriptive image text, and visible
limitations. Structured data must describe the rendered content. No fake FAQs,
reviews, measured results, keyword-volume claims, or guarantees of AI citations.

Release gates: source refresh within 24 hours of publication; artifact and
factual review; no unresolved access/pricing ambiguity; `npm run check`, full
build/postbuild guards, Node 20-compatible tests, `git diff --check`; rendered
320/390/768/1440px screenshots; no clipped CTA/model labels; working links and
keyboard controls; merged branch, successful production deployment, live
canonical/robots/schema/link smoke checks. A route returning 200 is not proof
of visual correctness or Google indexing.

At 14 and 28 days after publication, inspect Search Console page/query data,
non-branded clicks, engaged reading, planner/library referrals, and verified
backlinks. These are review milestones, not newly scheduled automations. Refine
the existing pieces from observed queries before adding more near-duplicate pages.

## Source Register and Open Evidence

Primary sources checked September 5, 2026:

- [OpenAI release notes](https://openai.com/products/release-notes/): Astra launch dated September 3; staged availability needs surface-specific checks.
- [Astra model reference](https://developers.openai.com/api/docs/models/gpt-6-astra) and [availability](https://help.openai.com/en/articles/20001354): API identity/specifications and product access.
- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing): service-tier and long-context billing conditions.
- [OpenAI launch results](https://openai.com/index/gpt-6-astra/): vendor measurements; retain harness and effort conditions.
- [OpenAI harness study](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/): agent configuration can change a benchmark result independently of the model.
- [Anthropic release notes](https://platform.claude.com/docs/en/release-notes/overview): Fable 5.1 launch dated September 1.
- [Fable 5.1 overview](https://platform.claude.com/docs/en/models/fable-5-1/overview), [pricing](https://platform.claude.com/docs/en/about-claude/pricing), and [plan access](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan): current product facts.
- [Anthropic launch](https://www.anthropic.com/claude-fable-and-mythos-5-1): separate Fable and Mythos columns, vendor results, and attributed customer examples.
- [Fable migration](https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1) and [fallback semantics](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback): integration gates.
- [Claude model versioning](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions): pinned dateless snapshots versus mutable serving infrastructure.
- [Covered Model retention](https://support.claude.com/en/articles/15425996-data-retention-practices-for-covered-models): enterprise access and data-handling prerequisites.
- [Artificial Analysis](https://artificialanalysis.ai/models) and [methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking): independent, versioned snapshots.
- [Arena](https://arena.ai/leaderboard): independently dated preference boards.

Outstanding before a hands-on verdict: actual model access, approved experiment
budget, completed local runs, reviewer decisions, and inspectable artifacts.
The joint Fable/Mythos 5.1 system-card document failed retrieval during research;
do not publish detailed system-card conclusions until the document is verified.
