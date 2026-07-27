// Artificial Analysis — independent agentic evals + per-task economics.
//
// Hand-captured from the PUBLIC models board at https://artificialanalysis.ai/models
// (the page embeds its figures as JSON-LD `Dataset`, isAccessibleForFree). This is
// NOT the keyed API: AA's free API tier is "internal use only, no redistribution,"
// so we mirror the LAB_CLAIMS trust model instead — a dated, attributed, fair-use
// snapshot of published facts, refreshed by hand when AA revises the index.
//
// Source: Artificial Analysis (2025). LLM benchmarks dataset. https://artificialanalysis.ai
// Captured 2026-07-27 · Intelligence Index v4.1 (AA's default board cut).
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

export const AA_SNAPSHOT = '2026-07-27';
export const AA_INDEX_VERSION = 'Intelligence Index v4.1';
export const AA_SOURCE_URL = 'https://artificialanalysis.ai/models';
export const AA_METHODOLOGY_URL = 'https://artificialanalysis.ai/methodology/intelligence-benchmarking';
export const AA_ATTRIBUTION = 'Artificial Analysis (2025). LLM benchmarks dataset. artificialanalysis.ai';

// AA ran the Opus 5 evals pre-release at Anthropic's request. Rendered on the
// panel so the #1 row carries its own provenance.
export const AA_DISCLOSURE =
  'AA discloses it “supported Anthropic to evaluate Claude Opus 5 ahead of release.” Own harness, own hardware — but pre-release vendor coordination on the #1 row. Weigh it as such.';

// The v4.1 methodology — re-verified against AA's methodology page on capture day.
// STILL v4.1: AA's version history reads "Version 4.1 — June 2026—current", and
// there is no v4.2 or v5. One methodology generation, two very different boards
// six weeks apart — which is itself the finding.
export const AA_METHODOLOGY: { version: string; since: string; categories: { name: string; weight: number; benches: string[] }[]; retired: string[] } = {
  version: 'v4.1',
  since: 'June 2026 — current',
  categories: [
    { name: 'Agents', weight: 34, benches: ['GDPval-AA v2 · 20%', '𝜏³-Banking · 14%'] },
    { name: 'Coding', weight: 24, benches: ['Terminal-Bench v2.1 · 16%', 'SciCode · 8%'] },
    { name: 'Scientific reasoning', weight: 24, benches: ['HLE · 12%', 'GPQA Diamond · 6%', 'CritPt · 6%'] },
    { name: 'General', weight: 18, benches: ['AA-Omniscience · 12% (accuracy 8% + non-hallucination 4%)', 'AA-LCR · 6%'] },
  ],
  // What v4.1 retired to chase agentic signal — the "why now" in three names.
  retired: ['IFBench (saturated)', 'Terminal-Bench Hard', '𝜏²-Bench Telecom'],
};

// AA's own stated precision. Load-bearing, and stated carefully: AA's raw board
// ranks EFFORT VARIANTS separately, so its literal #1 and #2 are Opus 5 at max
// (60.69) and Opus 5 at xhigh (60.07) — the same model twice, 0.62 apart. The
// number that matters for "who leads" is the gap between the top two DISTINCT
// models, Opus 5 max and Fable 5: 0.83 points. Both are inside AA's own interval.
export const AA_PRECISION = 'AA estimates a 95% confidence interval of less than ±1% on the Index. The gap between the top two distinct models — Opus 5 at max effort and Fable 5 — is 0.83 points, inside it. (AA ranks effort variants separately, so its literal #2 is Opus 5 at xhigh.)';

export type AAMetric = 'intelligence' | 'cost' | 'speed';

export type AAModel = {
  model: string;
  vendor: Vendor;
  // AA Intelligence Index v4.1 — the headline composite. Higher is better.
  intelligence: number;
  // Weighted-average cost in USD to run ONE INTELLIGENCE INDEX task. Lower is
  // better. Naming this precisely matters: AA publishes a second, much larger
  // "cost per task" for AA-Briefcase (Opus 5 max = $17.79, Fable 5 = $22.30),
  // and secondary coverage quotes the two interchangeably. This column is the
  // Intelligence Index one, always.
  costPerTaskUsd: number;
  // Median output speed, tokens/sec. Higher is better. undefined = AA's board
  // does not publish a speed for this model (rendered "—", never invented).
  outputTokensPerSec?: number;
};

// Captured by hand 2026-07-27 from AA's public /models board. Every figure traces
// to the JSON-LD on that date. Only models AA lists with BOTH an Index score and
// a per-task cost are included — an economics panel needs the economics.
//
// Effort variants are separate entries because AA scores them separately, and on
// this model that is the whole story: Opus 5 at `max` and Opus 5 at `low` are 10
// index points and 6.9× cost apart. Where a variant has no published cost, it
// lives in AA_INDEX_ONLY below rather than being given an invented one.
//
// Do NOT headline "61". AA's charts round to integers and collapse Opus 5 (61),
// Opus 5 xhigh (60) and Fable 5 (60) into a near-tie; the JSON-LD resolves it to
// 60.69 / 60.07 / 59.86.
export const AA_MODELS: AAModel[] = [
  { model: 'Claude Opus 5 (max)',            vendor: 'anthropic', intelligence: 60.7, costPerTaskUsd: 2.028, outputTokensPerSec: 52.8 },
  { model: 'Claude Fable 5',                 vendor: 'anthropic', intelligence: 59.9, costPerTaskUsd: 2.750, outputTokensPerSec: 70.9 },
  { model: 'GPT-5.6 Sol (max)',              vendor: 'openai',    intelligence: 58.9, costPerTaskUsd: 1.537, outputTokensPerSec: 77.1 },
  { model: 'Kimi K3',                        vendor: 'moonshot',  intelligence: 57.1, costPerTaskUsd: 0.723, outputTokensPerSec: 33.0 },
  { model: 'Claude Opus 4.8 (max)',          vendor: 'anthropic', intelligence: 55.7, costPerTaskUsd: 1.797, outputTokensPerSec: 55.4 },
  { model: 'GPT-5.6 Terra (max)',            vendor: 'openai',    intelligence: 55.0, costPerTaskUsd: 0.825, outputTokensPerSec: 135.7 },
  { model: 'Grok 4.5 (high)',                vendor: 'xai',       intelligence: 53.8, costPerTaskUsd: 0.350, outputTokensPerSec: 56.4 },
  { model: 'Claude Sonnet 5 (max)',          vendor: 'anthropic', intelligence: 53.4, costPerTaskUsd: 1.525, outputTokensPerSec: 74.2 },
  { model: 'GPT-5.6 Luna (max)',             vendor: 'openai',    intelligence: 51.2, costPerTaskUsd: 0.277, outputTokensPerSec: 188.2 },
  { model: 'GLM-5.2 (max)',                  vendor: 'zhipu',     intelligence: 51.1, costPerTaskUsd: 0.319, outputTokensPerSec: 219.0 },
  { model: 'Muse Spark 1.1 (xhigh)',         vendor: 'meta',      intelligence: 50.6, costPerTaskUsd: 0.261, outputTokensPerSec: 127.6 },
  { model: 'Gemini 3.6 Flash',               vendor: 'google',    intelligence: 50.1, costPerTaskUsd: 0.501, outputTokensPerSec: 235.4 },
  { model: 'Qwen3.7 Max',                    vendor: 'alibaba',   intelligence: 46.0, costPerTaskUsd: 1.033, outputTokensPerSec: 201.8 },
  { model: 'MiniMax-M3',                     vendor: 'minimax',   intelligence: 44.4, costPerTaskUsd: 0.125, outputTokensPerSec: 79.8 },
  { model: 'DeepSeek V4 Pro (max)',          vendor: 'deepseek',  intelligence: 44.3, costPerTaskUsd: 0.045, outputTokensPerSec: 63.5 },
  { model: 'Nemotron 3 Ultra',               vendor: 'nvidia',    intelligence: 37.8, costPerTaskUsd: 0.245, outputTokensPerSec: 203.8 },
  { model: 'gpt-oss-120b (high)',            vendor: 'openai',    intelligence: 23.8, costPerTaskUsd: 0.061, outputTokensPerSec: 286.6 },
];

// Rows AA scores on the Index but publishes no cost-per-task for. Kept out of the
// economics ranking above (an economics panel needs the economics) but surfaced
// on the Opus 5 page, where the effort ladder is the point.
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

// The effort ladder, measured by AA on 2026-07-24 — the single most decision-useful
// table in the Opus 5 release, because the dial is the only lever that moves both
// capability and the invoice at once. `costToRunIndexUsd` is what AA paid to run
// the whole Index at that setting, NOT a per-task figure — different denominator,
// kept in its own field so the two can never be confused.
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
