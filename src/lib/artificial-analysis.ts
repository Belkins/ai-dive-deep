// Artificial Analysis — independent agentic evals + per-task economics.
//
// Hand-captured from the PUBLIC models board at https://artificialanalysis.ai/models
// (the page embeds its figures as JSON-LD `Dataset`, isAccessibleForFree). This is
// NOT the keyed API: AA's free API tier is "internal use only, no redistribution,"
// so we mirror the LAB_CLAIMS trust model instead — a dated, attributed, fair-use
// snapshot of published facts, refreshed by hand when AA revises the index.
//
// Source: Artificial Analysis (2025). LLM benchmarks dataset. https://artificialanalysis.ai
// Captured 2026-06-16 · Intelligence Index v4.1 (AA's default board cut).
//
// Honesty discipline (Ch 24): the Index is a weighted composite that can be gamed.
// Read it as an independent referee's reading — disinterested, not infallible —
// not as a new oracle. Value is triangulation against the crowd and the labs.

import type { Vendor } from './lmarena';

export const AA_SNAPSHOT = '2026-06-16';
export const AA_INDEX_VERSION = 'Intelligence Index v4.1';
export const AA_SOURCE_URL = 'https://artificialanalysis.ai/models';
export const AA_METHODOLOGY_URL = 'https://artificialanalysis.ai/methodology/intelligence-benchmarking';
export const AA_ATTRIBUTION = 'Artificial Analysis (2025). LLM benchmarks dataset. artificialanalysis.ai';

// The v4.1 methodology — verified against AA's methodology page on capture day.
// Drives the visible, extractable methodology block (AEO/GEO win).
export const AA_METHODOLOGY: { version: string; since: string; categories: { name: string; weight: number; benches: string[] }[]; retired: string[] } = {
  version: 'v4.1',
  since: 'June 2026',
  categories: [
    { name: 'Agents', weight: 34, benches: ['GDPval-AA v2 · 20%', '𝜏³-Banking · 14%'] },
    { name: 'Coding', weight: 24, benches: ['Terminal-Bench v2.1 · 16%', 'SciCode · 8%'] },
    { name: 'Scientific reasoning', weight: 24, benches: ['HLE · 12%', 'GPQA Diamond · 6%', 'CritPt · 6%'] },
    { name: 'General', weight: 18, benches: ['AA-Omniscience · 12%', 'AA-LCR · 6%'] },
  ],
  // What v4.1 retired to chase agentic signal — the "why now" in three names.
  retired: ['IFBench (saturated)', 'Terminal-Bench Hard', '𝜏²-Bench Telecom'],
};

export type AAMetric = 'intelligence' | 'cost' | 'speed';

export type AAModel = {
  model: string;
  vendor: Vendor;
  // AA Intelligence Index v4.1 — the headline composite. Higher is better.
  intelligence: number;
  // Weighted-average cost in USD to run ONE Intelligence Index task. Lower is
  // better. This is AA's new per-task economics metric — the operator's number,
  // the one that shows up on the invoice.
  costPerTaskUsd: number;
  // Median output speed, tokens/sec. Higher is better. undefined = AA's board
  // does not publish a speed for this model (rendered "—", never invented).
  outputTokensPerSec?: number;
};

// Captured by hand 2026-06-16 from AA's public /models board. Every figure traces
// to the JSON-LD on that date. Only models AA lists with BOTH an Index score and a
// per-task cost are included — an economics panel needs the economics. Headline
// models absent here (Opus 4.8, Sonnet 4.6) are absent BECAUSE AA's default board
// does not list them, not because we dropped them. Muse Spark is on AA's board with
// no published per-task cost, so it is out of an economics ranking.
export const AA_MODELS: AAModel[] = [
  { model: 'Claude Fable 5',  vendor: 'anthropic', intelligence: 59.9, costPerTaskUsd: 3.254 },
  { model: 'GPT-5.5 (xhigh)', vendor: 'openai',    intelligence: 54.8, costPerTaskUsd: 0.993, outputTokensPerSec: 64.7 },
  { model: 'Gemini 3.1 Pro',  vendor: 'google',    intelligence: 46.5, costPerTaskUsd: 0.305, outputTokensPerSec: 116.8 },
  { model: 'MiniMax-M3',      vendor: 'minimax',   intelligence: 44.4, costPerTaskUsd: 0.182, outputTokensPerSec: 60.0 },
  { model: 'DeepSeek V4 Pro', vendor: 'deepseek',  intelligence: 44.3, costPerTaskUsd: 0.056, outputTokensPerSec: 75.3 },
  { model: 'Kimi K2.6',       vendor: 'moonshot',  intelligence: 42.8, costPerTaskUsd: 0.294, outputTokensPerSec: 40.9 },
  { model: 'MiMo-V2.5-Pro',   vendor: 'other',     intelligence: 42.2, costPerTaskUsd: 0.062, outputTokensPerSec: 40.9 },
  { model: 'Nemotron 3 Ultra',vendor: 'nvidia',    intelligence: 37.8, costPerTaskUsd: 0.244, outputTokensPerSec: 168.4 },
  { model: 'Grok 4.3 (high)', vendor: 'xai',       intelligence: 37.6, costPerTaskUsd: 0.145, outputTokensPerSec: 166.7 },
  { model: 'gpt-oss-120b',    vendor: 'openai',    intelligence: 23.8, costPerTaskUsd: 0.061, outputTokensPerSec: 344.6 },
];
