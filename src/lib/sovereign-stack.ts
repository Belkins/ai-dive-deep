// Onyx Open Source LLM Leaderboard snapshot — captured 2026-03-24 (Roshan Desai).
// Source: https://onyx.app/open-llm-leaderboard
// This is a snapshot. The live source is the link above. Re-snap when ranking shifts.

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';
export type Category = 'overall' | 'coding' | 'math' | 'chat' | 'reasoning';

export type Lab =
  | 'zai'       // Z.ai (Zhipu)  — GLM
  | 'moonshot'  // Moonshot     — Kimi
  | 'minimax'   // MiniMax
  | 'deepseek'
  | 'stepfun'   // Stepfun       — Step
  | 'alibaba'   // Alibaba       — Qwen
  | 'mimo'      // MiMo
  | 'mistral'
  | 'nvidia'    // Nemotron
  | 'openai'    // gpt-oss
  | 'meta'      // Llama
  | 'google';   // Gemma

export type Model = {
  name: string;
  params: string;       // "744B" / "1T" / "397B"
  lab: Lab;
  // What this model is actually good at (used for the comparison strip).
  bestAt?: string;
  // Open-weights license type.
  license: 'open' | 'open-non-commercial' | 'open-permissive';
};

export const LAB_META: Record<Lab, { label: string; color: string; country: 'CN' | 'US' | 'FR' }> = {
  zai:       { label: 'Z.ai',     color: '#6D5DF6', country: 'CN' },
  moonshot:  { label: 'Moonshot', color: '#111111', country: 'CN' },
  minimax:   { label: 'MiniMax',  color: '#E94B3C', country: 'CN' },
  deepseek:  { label: 'DeepSeek', color: '#3D7DEB', country: 'CN' },
  stepfun:   { label: 'Stepfun',  color: '#7A2EE6', country: 'CN' },
  alibaba:   { label: 'Alibaba',  color: '#9B5DFF', country: 'CN' },
  mimo:      { label: 'MiMo',     color: '#FF7A1E', country: 'CN' },
  mistral:   { label: 'Mistral',  color: '#FF6B2C', country: 'FR' },
  nvidia:    { label: 'NVIDIA',   color: '#76B900', country: 'US' },
  openai:    { label: 'OpenAI',   color: '#10A37F', country: 'US' },
  meta:      { label: 'Meta',     color: '#1877F2', country: 'US' },
  google:    { label: 'Google',   color: '#34A853', country: 'US' },
};

// Canonical model facts — same set across all categories, only tier placement changes.
export const MODELS: Record<string, Model> = {
  'GLM-5':            { name: 'GLM-5',            params: '744B', lab: 'zai',      license: 'open',                bestAt: 'chat, reasoning' },
  'GLM-4.7':          { name: 'GLM-4.7',          params: '355B', lab: 'zai',      license: 'open',                bestAt: 'coding, math, chat' },
  'Kimi K2.5':        { name: 'Kimi K2.5',        params: '1T',   lab: 'moonshot', license: 'open',                bestAt: 'coding, agentic, chat' },
  'MiniMax M2.5':     { name: 'MiniMax M2.5',     params: '230B', lab: 'minimax',  license: 'open',                bestAt: 'overall, coding' },
  'DeepSeek V3.2':    { name: 'DeepSeek V3.2',    params: '685B', lab: 'deepseek', license: 'open',                bestAt: 'overall, math' },
  'DeepSeek R1':      { name: 'DeepSeek R1',      params: '671B', lab: 'deepseek', license: 'open',                bestAt: 'reasoning, math' },
  'DeepSeek V3':      { name: 'DeepSeek V3',      params: '671B', lab: 'deepseek', license: 'open',                bestAt: 'general' },
  'Qwen 3.5':         { name: 'Qwen 3.5',         params: '397B', lab: 'alibaba',  license: 'open',                bestAt: 'reasoning, chat' },
  'Qwen 3 235B':      { name: 'Qwen 3 235B',      params: '235B', lab: 'alibaba',  license: 'open',                bestAt: 'math, reasoning' },
  'Step-3.5-Flash':   { name: 'Step-3.5-Flash',   params: '196B', lab: 'stepfun',  license: 'open',                bestAt: 'speed, coding, math' },
  'Step3':            { name: 'Step3',            params: '316B', lab: 'stepfun',  license: 'open',                bestAt: 'general' },
  'MiMo-V2-Flash':    { name: 'MiMo-V2-Flash',    params: '309B', lab: 'mimo',     license: 'open',                bestAt: 'math, fast inference' },
  'Mistral Large':    { name: 'Mistral Large',    params: '675B', lab: 'mistral',  license: 'open-non-commercial', bestAt: 'chat, multilingual' },
  'GPT-oss 120B':     { name: 'GPT-oss 120B',     params: '117B', lab: 'openai',   license: 'open-permissive',     bestAt: 'general, reasoning' },
  'Llama 4 Maverick': { name: 'Llama 4 Maverick', params: '400B', lab: 'meta',     license: 'open',                bestAt: 'chat, vision' },
  'Gemma 3 27B':      { name: 'Gemma 3 27B',      params: '27B',  lab: 'google',   license: 'open',                bestAt: 'small-model chat' },
  'Nemotron Ultra 253B': { name: 'Nemotron Ultra 253B', params: '253B', lab: 'nvidia', license: 'open',            bestAt: 'general' },
  'Nemotron Super 49B':  { name: 'Nemotron Super 49B',  params: '49B',  lab: 'nvidia', license: 'open',            bestAt: 'small-model general' },
  'Nemotron Nano 30B':   { name: 'Nemotron Nano 30B',   params: '30B',  lab: 'nvidia', license: 'open',            bestAt: 'small-model general' },
};

export type CategoryDef = {
  id: Category;
  label: string;
  blurb: string;
  tiers: Record<Tier, string[]>; // model names, S→D
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'overall',
    label: 'Overall',
    blurb: 'Aggregate ranking across reasoning, coding, math, chat, instruction-following.',
    tiers: {
      S: ['GLM-5', 'Kimi K2.5', 'MiniMax M2.5', 'DeepSeek V3.2', 'Step-3.5-Flash', 'Qwen 3.5'],
      A: ['GLM-4.7', 'MiMo-V2-Flash', 'DeepSeek R1', 'Qwen 3 235B'],
      B: ['GPT-oss 120B', 'Mistral Large', 'Nemotron Ultra 253B', 'Nemotron Super 49B', 'Step3'],
      C: ['DeepSeek V3', 'Llama 4 Maverick', 'Gemma 3 27B', 'Nemotron Nano 30B'],
      D: [],
    },
  },
  {
    id: 'coding',
    label: 'Coding',
    blurb: 'SWE-Bench Verified + LiveCodeBench + agentic coding loops. The benchmark that maps to Claude Code replacement.',
    tiers: {
      S: ['GLM-4.7', 'Kimi K2.5', 'MiniMax M2.5', 'Qwen 3.5', 'Step-3.5-Flash'],
      A: ['MiMo-V2-Flash', 'DeepSeek V3.2', 'DeepSeek R1', 'Mistral Large'],
      B: ['GLM-5', 'Qwen 3 235B', 'Nemotron Super 49B', 'Nemotron Ultra 253B', 'GPT-oss 120B'],
      C: ['DeepSeek V3', 'Llama 4 Maverick', 'Step3'],
      D: ['Gemma 3 27B', 'Nemotron Nano 30B'],
    },
  },
  {
    id: 'math',
    label: 'Math',
    blurb: 'AIME + MATH + Olympiad-style proofs. Where reasoning models eat.',
    tiers: {
      S: ['GLM-4.7', 'Kimi K2.5', 'MiMo-V2-Flash', 'DeepSeek R1', 'Qwen 3 235B', 'Step-3.5-Flash'],
      A: ['Qwen 3.5', 'GLM-5', 'DeepSeek V3.2', 'MiniMax M2.5'],
      B: ['Mistral Large', 'GPT-oss 120B', 'Nemotron Super 49B', 'Nemotron Ultra 253B', 'Step3'],
      C: ['DeepSeek V3', 'Llama 4 Maverick'],
      D: ['Gemma 3 27B', 'Nemotron Nano 30B'],
    },
  },
  {
    id: 'chat',
    label: 'Chat',
    blurb: 'MT-Bench + Arena-Hard + instruction-following. The "is this a good drafting partner" axis.',
    tiers: {
      S: ['GLM-4.7', 'GLM-5', 'Kimi K2.5'],
      A: ['Qwen 3.5', 'Mistral Large', 'Qwen 3 235B'],
      B: ['DeepSeek R1', 'MiMo-V2-Flash', 'MiniMax M2.5', 'Nemotron Ultra 253B', 'Nemotron Super 49B'],
      C: ['GPT-oss 120B', 'DeepSeek V3', 'DeepSeek V3.2', 'Llama 4 Maverick', 'Gemma 3 27B', 'Step-3.5-Flash'],
      D: ['Nemotron Nano 30B', 'Step3'],
    },
  },
  {
    id: 'reasoning',
    label: 'Reasoning',
    blurb: 'GPQA-Diamond + ARC + multi-step proofs. The honest "can this model think" benchmark.',
    tiers: {
      S: ['Qwen 3.5', 'GLM-4.7', 'Kimi K2.5', 'GLM-5', 'MiniMax M2.5'],
      A: ['MiMo-V2-Flash', 'GPT-oss 120B', 'Qwen 3 235B', 'DeepSeek V3.2', 'DeepSeek R1', 'Step-3.5-Flash'],
      B: ['DeepSeek V3', 'Nemotron Ultra 253B', 'Nemotron Super 49B', 'Step3'],
      C: ['Llama 4 Maverick', 'Nemotron Nano 30B', 'Mistral Large'],
      D: ['Gemma 3 27B'],
    },
  },
];

export const TIER_COLOR: Record<Tier, string> = {
  S: '#FF4D4D',  // red
  A: '#FF8E2C',  // orange
  B: '#FFC83D',  // yellow
  C: '#3EBA70',  // green
  D: '#3D8DEB',  // blue
};

export const TIER_DESC: Record<Tier, string> = {
  S: 'Frontier — competitive with closed-source flagships',
  A: 'Excellent — close gap, ship at this tier for production',
  B: 'Strong — fine for batch and tool-use loops',
  C: 'Useful — small-task, specific-domain',
  D: 'Limited — pre-frontier, mostly historical interest',
};

export const SNAPSHOT_DATE = '2026-03-24';
export const SOURCE_URL = 'https://onyx.app/open-llm-leaderboard';
export const SOURCE_LABEL = 'Onyx Open Source LLM Leaderboard';
