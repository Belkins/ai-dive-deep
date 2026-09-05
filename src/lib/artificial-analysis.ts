// Artificial Analysis: a limited editorial selection of public benchmark facts.
// Captured 2026-09-05 from /models JSON-LD using parse5 + JSON.parse, joining
// exact effort/fallback labels. No keyed API, source-page archive or live feed.
// Public accessibility is not an open redistribution license; retain attribution
// and terms, and do not expand this into a mirror of AA's datasets.
// The JSON-LD has no dateModified: this is OUR capture date, not AA's update date.
// Capture details and source discrepancies: outputs/model-release-2026-09-05/aa-evidence.md.

import type { Vendor } from './lmarena';

export const AA_SNAPSHOT = '2026-09-05';
export const AA_INDEX_VERSION = 'Intelligence Index v4.2';
export const AA_SOURCE_URL = 'https://artificialanalysis.ai/models';
export const AA_METHODOLOGY_URL = 'https://artificialanalysis.ai/methodology/intelligence-benchmarking';
export const AA_TERMS_URL = 'https://artificialanalysis.ai/docs/legal/Terms-of-Use.pdf';
export const AA_ATTRIBUTION = 'Artificial Analysis (2025). LLM benchmarks dataset.';

export const AA_DISCLOSURE =
  'These are AA evaluations, not vendor claims or our own tests. Fable 5.1 is measured with fallback, as served. The public snapshot does not establish whether any launch involved pre-release coordination; the July Opus 5 disclosure is not evidence about the current leader.';

export const AA_METHODOLOGY: { version: string; since: string; categories: { name: string; weight: number; benches: string[] }[]; retired: string[]; changes: string } = {
  version: 'v4.2',
  since: 'September 2026; announced September 4',
  categories: [
    { name: 'Agents', weight: 30, benches: ['AA-Briefcase · 15%', 'GDPval-AA v2 · 10%', '𝜏³-Banking · 5%'] },
    { name: 'Coding', weight: 20, benches: ['Terminal-Bench v2.1 · 10%', 'SciCode · 10%'] },
    { name: 'Scientific reasoning', weight: 20, benches: ['HLE · 10%', 'CritPt · 10%'] },
    { name: 'General', weight: 30, benches: ['AA-Omniscience · 15% (accuracy 10% + non-hallucination 5%)', 'GDP.pdf · 10%', 'AA-LCR v1.1 · 5%'] },
  ],
  retired: ['GPQA Diamond'],
  changes: 'Ten evaluations: v4.2 adds AA-Briefcase and GDP.pdf, removes GPQA Diamond from the Index, upgrades AA-LCR to v1.1 and regrades SciCode v1.0.1. Weights and grading changed, so scores and per-task costs are not a like-for-like trend against July or August captures.',
};

export const AA_AGENTIC_NOTE =
  'The former Agentic Index URL returned HTTP 404 at this capture. No comparable current standalone Agentic scores were verified in the public JSON-LD; the old column is omitted, not carried into v4.2 or reconstructed from individual benchmarks.';

export const AA_SCOPE_NOTE =
  'Seven selected model settings with a verified Index score and task cost, not the full leaderboard. Effort and fallback labels are preserved. AA mentions Astra xhigh in its page summary but supplies no numeric xhigh row in the captured JSON-LD; max is not a substitute. Missing values are unverified, not zero.';

export const AA_SPEED_NOTE =
  'Speed is the /models chart output rate, not end-to-end task time. Astra max differs between that chart and its detail-page summary at capture; this panel keeps the chart value. Gemini 3.8 Flash has no speed in the captured chart, so it remains unscored here.';

export const AA_PRECISION = 'AA estimates a 95% confidence interval below ±1% for the Index; individual benchmarks may be wider. That aggregate estimate is not a published pairwise significance test. Small score differences do not establish a universal winner.';

export type AAMetric = 'intelligence' | 'agentic' | 'cost' | 'speed';

export type AAModel = {
  model: string;
  vendor: Vendor;
  // Same-capture AA Intelligence Index v4.2. Higher is better.
  intelligence: number;
  // Reserved for independently verified, comparable standalone scores.
  // None verified at this capture; never copy the old v4.1.1 values here.
  agentic?: number;
  // Weighted USD cost per Intelligence Index task, NOT a standalone benchmark,
  // entire-Index run, subscription price or dollars per million tokens.
  costPerTaskUsd: number;
  // Public /models chart output rate, tokens/sec. Missing stays undefined.
  outputTokensPerSec?: number;
};

// Limited comparison: new leaders, Opus/Sol predecessors and lower-cost choices.
// Index/speed rounded to 1 decimal; task costs to 3. Sol's cost is the sum of
// the five published token-cost components in Cost per Intelligence Index Task.
export const AA_MODELS: AAModel[] = [
  { model: 'Claude Fable 5.1 (max with fallback)', vendor: 'anthropic', intelligence: 56.8, costPerTaskUsd: 6.117, outputTokensPerSec: 67.1 },
  { model: 'GPT-6 Astra (max)',                   vendor: 'openai',    intelligence: 54.7, costPerTaskUsd: 2.567, outputTokensPerSec: 62.5 },
  { model: 'Claude Opus 5 (max)',                 vendor: 'anthropic', intelligence: 54.1, costPerTaskUsd: 4.205, outputTokensPerSec: 57.5 },
  { model: 'Muse Spark 1.3 (max)',                vendor: 'meta',      intelligence: 53.0, costPerTaskUsd: 0.959, outputTokensPerSec: 190.1 },
  { model: 'GPT-5.6 Sol (max)',                   vendor: 'openai',    intelligence: 51.3, costPerTaskUsd: 1.249, outputTokensPerSec: 85.4 },
  { model: 'Gemini 3.8 Flash (high)',             vendor: 'google',    intelligence: 47.1, costPerTaskUsd: 0.738 },
  { model: 'GPT-5.6 Luna (max)',                  vendor: 'openai',    intelligence: 43.4, costPerTaskUsd: 0.097, outputTokensPerSec: 133.0 },
];

// The effort ladder, measured by AA on 2026-07-24 and captured 2026-07-27 — a
// DATED ARTIFACT (pages citing it must use OPUS5_EFFORT_CAPTURED, never the
// moving AA_SNAPSHOT). Still the single most
// decision-useful table in the Opus 5 release, because the dial is the only
// lever that moves both capability and the invoice at once. `costToRunIndexUsd`
// is what AA paid to run the whole Index at that setting, NOT a per-task figure
// — different denominator, kept in its own field so the two can never be
// confused.
export const OPUS5_EFFORT_CAPTURED = '2026-07-27';

export type EffortRow = {
  effort: string;
  intelligence: number;
  rankOf190: number;
  costToRunIndexUsd: number;
  outputTokensM: number;
  ttftSeconds: number;
};

export const OPUS5_EFFORT_LADDER: EffortRow[] = [
  { effort: 'low',    intelligence: 51.0, rankOf190: 23, costToRunIndexUsd: 556.06,  outputTokensM: 12,  ttftSeconds: 3.66 },
  { effort: 'medium', intelligence: 56.3, rankOf190: 8,  costToRunIndexUsd: 1114.96, outputTokensM: 29,  ttftSeconds: 5.88 },
  { effort: 'high',   intelligence: 58.9, rankOf190: 5,  costToRunIndexUsd: 1973.77, outputTokensM: 52,  ttftSeconds: 21.67 },
  { effort: 'xhigh',  intelligence: 60.1, rankOf190: 2,  costToRunIndexUsd: 2909.91, outputTokensM: 76,  ttftSeconds: 37.38 },
  { effort: 'max',    intelligence: 60.7, rankOf190: 1,  costToRunIndexUsd: 3835.51, outputTokensM: 100, ttftSeconds: 66.36 },
];
