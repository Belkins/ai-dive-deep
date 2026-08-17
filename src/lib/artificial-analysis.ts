// Artificial Analysis — independent agentic evals + per-task economics.
//
// Hand-captured from the PUBLIC boards at https://artificialanalysis.ai/models
// and https://artificialanalysis.ai/models/capabilities/agentic (each page
// embeds its figures as JSON-LD `Dataset` blocks, isAccessibleForFree; the
// /models page ships 18 of them, one per chart — a 19th JSON-LD block is a
// FAQPage — each listing that chart's own model subset; the table below merges
// Intelligence, Cost per Task and Output Speed by model label). This is NOT the keyed API: AA's free API tier is
// "internal use only, no redistribution," so we mirror the LAB_CLAIMS trust
// model instead — a dated, attributed, fair-use snapshot of published facts,
// refreshed by hand when AA revises the index.
//
// Source: Artificial Analysis (2025). LLM benchmarks dataset. https://artificialanalysis.ai
// Captured 2026-08-17 · Intelligence Index v4.1.1 (AA's default board cut).
//
// AA publishes no `dateModified` and no visible "last updated" stamp on /models,
// so the only defensible date anchor is OUR capture date. It is labelled
// "captured", never "as of" — those are different claims.
//
// Honesty discipline (Ch 24): the Index is a weighted composite that can be gamed.
// Read it as an independent referee's reading — disinterested, not infallible —
// not as a new oracle. Value is triangulation against the crowd and the labs.
//
// One disclosure that belongs on the page, not in a footnote: AA states it
// "supported @AnthropicAI to evaluate Claude Opus 5 ahead of release." AA ran the
// evals on its own harness, so this is not a vendor claim — but the board's #1
// entry involved pre-release vendor coordination, and a page built on trust tiers
// should say so rather than present the debut as a cold third-party measurement.

import type { Vendor } from './lmarena';

export const AA_SNAPSHOT = '2026-08-17';
export const AA_INDEX_VERSION = 'Intelligence Index v4.1.1';
export const AA_SOURCE_URL = 'https://artificialanalysis.ai/models';
export const AA_AGENTIC_URL = 'https://artificialanalysis.ai/models/capabilities/agentic';
export const AA_METHODOLOGY_URL = 'https://artificialanalysis.ai/methodology/intelligence-benchmarking';
export const AA_ATTRIBUTION = 'Artificial Analysis (2025). LLM benchmarks dataset. artificialanalysis.ai';

// AA ran the Opus 5 evals pre-release at Anthropic's request. Rendered on the
// panel so the #1 row carries its own provenance. The quote is from AA's Opus 5
// launch communications (July 2026, verified at the 2026-07-27 capture) — it
// does not appear on the /models page itself, so it is date-stamped rather than
// cited as current page copy.
export const AA_DISCLOSURE =
  'At the Opus 5 launch (July 2026) AA disclosed it “supported Anthropic to evaluate Claude Opus 5 ahead of release.” Own harness, own hardware — but pre-release vendor coordination on the #1 row. Weigh it as such.';

// Re-verified against AA's methodology page on the 2026-08-17 capture: the
// version history now ends at v4.1.1 (August 2026 — current), a maintenance
// cut of the v4.1 redesign — 𝜏³-Banking moved to the upstream tau2-bench
// v1.0.1 dataset/grader, and the grader model for HLE, AA-LCR and
// AA-Omniscience upgraded to GPT-5.6 Luna (medium). The same nine benches and
// category weights carry over unchanged, so the structure below is v4.1's
// design under the v4.1.1 label.
export const AA_METHODOLOGY: { version: string; since: string; categories: { name: string; weight: number; benches: string[] }[]; retired: string[] } = {
  version: 'v4.1.1',
  since: 'August 2026 — current; the v4.1 redesign shipped June 2026',
  categories: [
    { name: 'Agents', weight: 34, benches: ['GDPval-AA v2 · 20%', '𝜏³-Banking · 14%'] },
    { name: 'Coding', weight: 24, benches: ['Terminal-Bench v2.1 · 16%', 'SciCode · 8%'] },
    { name: 'Scientific reasoning', weight: 24, benches: ['HLE · 12%', 'GPQA Diamond · 6%', 'CritPt · 6%'] },
    { name: 'General', weight: 18, benches: ['AA-Omniscience · 12% (accuracy 8% + non-hallucination 4%)', 'AA-LCR · 6%'] },
  ],
  // What v4.1 retired to chase agentic signal — the "why now" in three names.
  // (AA states only that IFBench was removed from the Index — it gives no
  // saturation rationale, so none is printed.)
  retired: ['IFBench', 'Terminal-Bench Hard', '𝜏²-Bench Telecom'],
};

// The Agentic Index — AA's second headline board, published as its own page.
// Per AA's own description it is the agentic slice: GDPval-AA v2 + 𝜏³-Banking,
// "tool use, planning, autonomy, and complex problem solving." Same harness,
// same capture discipline; a per-model score in the table below.
export const AA_AGENTIC_NOTE =
  'The Agentic Index isolates AA\'s agentic benches (GDPval-AA v2 + 𝜏³-Banking) as its own board. AA also scores four models on it without publishing an Index-task cost — Qwen3.8 27B (50.9), Motif 3 (37.6), Solar Open2 250B (27.8), A.X-K2 (25.7) — so they sit outside this economics table by the standing rule.';

// AA's own stated precision, applied to the 2026-08-17 board. The gap between
// the top two models — Opus 5 at max effort (63.1) and Fable 5 (62.1) — is 0.98
// points, inside AA's own interval. (Unlike the July board, the public board now
// lists ONE effort setting per model, so there is no same-model-twice #2 row to
// footnote away; the July variant capture is preserved in AA_INDEX_ONLY below.)
export const AA_PRECISION = 'AA estimates a 95% confidence interval of less than ±1% on the Index. The gap between the top two models — Opus 5 at max effort and Fable 5 — is 0.98 points, inside it.';

export type AAMetric = 'intelligence' | 'agentic' | 'cost' | 'speed';

export type AAModel = {
  model: string;
  vendor: Vendor;
  // AA Intelligence Index v4.1 — the headline composite. Higher is better.
  intelligence: number;
  // AA Agentic Index — the agentic slice, from the /models/capabilities/agentic
  // board. undefined = AA does not score this model there (rendered "—").
  agentic?: number;
  // Weighted-average cost in USD to run ONE INTELLIGENCE INDEX task. Lower is
  // better. Naming this precisely matters: AA also publishes a separate, larger
  // "cost per task" for the AGENTIC Index (Sol $2.55, Grok 4.6 $1.95 there vs
  // $1.23 / $0.84 here), and before that an AA-Briefcase figure — secondary
  // coverage quotes them interchangeably. This column is the Intelligence Index
  // one, always.
  costPerTaskUsd: number;
  // Median output speed, tokens/sec. Higher is better. undefined = AA's board
  // does not publish a speed for this model (rendered "—", never invented).
  outputTokensPerSec?: number;
};

// Captured by hand 2026-08-17 from AA's public boards. Every figure traces to
// the JSON-LD on that date. Only models AA lists with BOTH an Index score and
// a per-task cost are included — an economics panel needs the economics.
//
// "Claude Fable 5 (with fallback)" is AA's own row label, verbatim — AA scores
// the model as served, fallback architecture included.
//
// Unlike the 2026-07-27 board, the public board now carries one effort setting
// per model — no separately-ranked xhigh/high/medium variants.
export const AA_MODELS: AAModel[] = [
  { model: 'Claude Opus 5 (max)',            vendor: 'anthropic', intelligence: 63.1, agentic: 59.2, costPerTaskUsd: 2.337, outputTokensPerSec: 52.7 },
  { model: 'Claude Fable 5 (with fallback)', vendor: 'anthropic', intelligence: 62.1, agentic: 56.6, costPerTaskUsd: 3.140, outputTokensPerSec: 67.1 },
  { model: 'GPT-5.6 Sol (max)',              vendor: 'openai',    intelligence: 60.9, agentic: 57.8, costPerTaskUsd: 1.231, outputTokensPerSec: 69.7 },
  { model: 'Grok 4.6 (high)',                vendor: 'xai',       intelligence: 60.9, agentic: 58.7, costPerTaskUsd: 0.837, outputTokensPerSec: 58.3 },
  { model: 'Kimi K3 (max)',                  vendor: 'moonshot',  intelligence: 59.7, agentic: 54.3, costPerTaskUsd: 0.837, outputTokensPerSec: 38.4 },
  { model: 'Qwen3.8 Max',                    vendor: 'alibaba',   intelligence: 58.1, agentic: 58.4, costPerTaskUsd: 1.132 },
  { model: 'Muse Spark 1.2 (xhigh)',         vendor: 'meta',      intelligence: 56.8, agentic: 49.3, costPerTaskUsd: 0.399 },
  { model: 'GPT-5.6 Terra (max)',            vendor: 'openai',    intelligence: 56.6, agentic: 50.2, costPerTaskUsd: 0.508, outputTokensPerSec: 123.8 },
  { model: 'Gemini 3.7 Flash (high)',        vendor: 'google',    intelligence: 56.0, agentic: 45.1, costPerTaskUsd: 0.402, outputTokensPerSec: 413.3 },
  { model: 'DeepSeek V4 Pro 0813 (max)',     vendor: 'deepseek',  intelligence: 53.2, agentic: 49.6, costPerTaskUsd: 0.252, outputTokensPerSec: 80.2 },
  { model: 'GLM-5.2 (max)',                  vendor: 'zhipu',     intelligence: 52.6, agentic: 45.7, costPerTaskUsd: 0.321, outputTokensPerSec: 155.0 },
  { model: 'GPT-5.6 Luna (max)',             vendor: 'openai',    intelligence: 52.3, agentic: 46.9, costPerTaskUsd: 0.047, outputTokensPerSec: 171.2 },
  { model: 'MiniMax-M3',                     vendor: 'minimax',   intelligence: 45.4, agentic: 36.1, costPerTaskUsd: 0.139, outputTokensPerSec: 95.9 },
  { model: 'Inkling',                        vendor: 'other',     intelligence: 42.3, agentic: 34.1, costPerTaskUsd: 0.339, outputTokensPerSec: 83.6 },
  { model: 'Nemotron 3 Ultra',               vendor: 'nvidia',    intelligence: 38.3, agentic: 27.5, costPerTaskUsd: 0.383, outputTokensPerSec: 139.8 },
  { model: 'Gemini 3.5 Flash-Lite',          vendor: 'google',    intelligence: 37.4, agentic: 27.2, costPerTaskUsd: 0.097, outputTokensPerSec: 356.1 },
  { model: 'Muse Glimmer (high)',            vendor: 'meta',      intelligence: 35.1,                costPerTaskUsd: 0.073, outputTokensPerSec: 110.9 },
];

// DATED ARTIFACT — the 2026-07-27 capture, when AA still ranked effort variants
// as separate board rows. The 2026-08-17 board lists one setting per model, so
// this block is no longer refreshable; it stays as the July record the Opus 5
// model file narrates (the same-model-twice #2, the 10-point low→max spread).
export const AA_INDEX_ONLY: { model: string; intelligence: number; note?: string }[] = [
  { model: 'Claude Opus 5 (xhigh)',   intelligence: 60.07 },
  { model: 'Claude Opus 5 (high)',    intelligence: 58.86, note: 'the API default' },
  { model: 'GPT-5.6 Sol (xhigh)',     intelligence: 57.65 },
  { model: 'Claude Opus 5 (medium)',  intelligence: 56.28 },
  { model: 'GPT-5.6 Sol (high)',      intelligence: 55.87 },
  { model: 'GPT-5.5 (xhigh)',         intelligence: 54.84 },
  { model: 'Claude Opus 4.7 (max)',   intelligence: 53.53 },
  { model: 'GPT-5.5 (high)',          intelligence: 53.13 },
  { model: 'DeepSeek V4 Pro (high)',  intelligence: 43.11 },
];

// The effort ladder, measured by AA on 2026-07-24 and captured 2026-07-27 — a
// DATED ARTIFACT like AA_INDEX_ONLY (pages citing it must use
// OPUS5_EFFORT_CAPTURED, never the moving AA_SNAPSHOT). Still the single most
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
