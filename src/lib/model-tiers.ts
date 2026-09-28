import type { Vendor } from '@/lib/lmarena';

// Vlad's model tiers — personal placements supplied 2026-09-28, transcribed
// row by row from his tier image. Names keep the image's exact spelling
// ("GPT-5.6 SOL", "mimo V2.5 Pro"). These are operator preferences, not a
// benchmark result or a matched-workload test. Vendor only drives the chip
// dot; a lab not in VENDOR_META, or one the image doesn't make certain,
// stays 'other' and gets no dot. The image's right-hand row percentages carry no stated
// meaning and are deliberately not reproduced.
export const MODEL_TIERS_UPDATED = '2026-09-28';

export const MODEL_TIER_ORDER = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'E', 'Google'] as const;
export type ModelTier = (typeof MODEL_TIER_ORDER)[number];

export type TieredModel = { name: string; vendor: Vendor };

export const MODEL_TIERS: Record<ModelTier, TieredModel[]> = {
  SSS: [
    { name: 'Opus 5.5', vendor: 'anthropic' },
  ],
  SS: [
    { name: 'GPT-6 Astra', vendor: 'openai' },
  ],
  S: [
    { name: 'Fable 5.1', vendor: 'anthropic' },
    { name: 'GPT-6 Sol', vendor: 'openai' },
  ],
  A: [
    { name: 'Opus 5', vendor: 'anthropic' },
    { name: 'Fable 5', vendor: 'anthropic' },
    { name: 'GPT-5.6 SOL', vendor: 'openai' },
    { name: 'Kimi K3', vendor: 'moonshot' },
    { name: 'Grok 4.6', vendor: 'xai' },
    { name: 'Qwen3.8 Max 0902', vendor: 'alibaba' },
    { name: 'GLM-5.3', vendor: 'zhipu' },
    { name: 'GPT-6 Luna', vendor: 'openai' },
    { name: 'Muse Spark 1.3', vendor: 'meta' },
    { name: 'DeepSeek V4.1 Flash', vendor: 'deepseek' },
    { name: 'Hy-4 Preview', vendor: 'other' },
    { name: 'Grok 4.7', vendor: 'xai' },
  ],
  B: [
    { name: 'GPT-5.6 Terra', vendor: 'openai' },
    { name: 'Qwen3.8-Flash-Next', vendor: 'alibaba' },
    { name: 'GLM-5.3 Flash', vendor: 'zhipu' },
    { name: 'Sonnet 5', vendor: 'anthropic' },
    { name: 'K2 Horizon 375B A23B', vendor: 'other' },
  ],
  C: [
    { name: 'GPT-5.6 Luna', vendor: 'openai' },
    { name: 'Grok 4.5', vendor: 'xai' },
    { name: 'Qwen3.8 27B', vendor: 'alibaba' },
    { name: 'Muse Spark 1.2', vendor: 'meta' },
    { name: 'mimo V2.5 Pro', vendor: 'other' },
    { name: 'Hy-3', vendor: 'other' },
    { name: 'MiniMax-M3', vendor: 'minimax' },
  ],
  D: [
    { name: 'Inkling', vendor: 'other' },
    { name: 'Nemotron 3 Ultra', vendor: 'nvidia' },
    { name: 'Muse Glimmer', vendor: 'meta' },
  ],
  E: [
    { name: 'Haiku 4.5', vendor: 'anthropic' },
    { name: 'Mistral Medium 3.5', vendor: 'other' },
    { name: 'Nemotron 3.5 Lightning', vendor: 'nvidia' },
  ],
  Google: [
    { name: 'Gemini 3.8 Flash', vendor: 'google' },
    { name: 'Gemini 3.7 Flash', vendor: 'google' },
    { name: 'Gemini 3.6 Flash', vendor: 'google' },
    { name: 'Gemini 3.5 Flash', vendor: 'google' },
  ],
};
