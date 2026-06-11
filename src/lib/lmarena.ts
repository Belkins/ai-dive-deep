// LMArena leaderboard snapshot — transcribed from the lmarena-ai/leaderboard-dataset
// HF dataset (the same feed the widget fetches live). The live page blocks iframe
// embedding, so this is a hand-verified static mirror. Update by
// editing this file (one source of truth) — the component re-renders.
//
// Snapshot captured: 2026-06-11. Per-category board publish dates noted in
// `freshness` (LMArena recomputes each board on its own cadence). Two boards
// could not be refreshed on capture day and keep their 2026-05-18 rows:
// image-to-webdev (no HF config) and image-edit (datasets-server HTTP 501).

export type Row = { rank: number; model: string; score: number; vendor: Vendor };
export type Vendor =
  | 'anthropic' | 'openai' | 'google' | 'meta' | 'xai'
  | 'zhipu' | 'moonshot' | 'alibaba' | 'baidu' | 'bytedance' | 'other';

export type Category = {
  id: string;
  name: string;
  blurb: string;
  freshness: string;
  rows: Row[];
};

export const LMARENA_SNAPSHOT = '2026-06-11';
export const LMARENA_LIVE = 'https://lmarena.ai/leaderboard';
export const LMARENA_HF = 'https://huggingface.co/spaces/lmarena-ai/arena-leaderboard';

export const VENDOR_META: Record<Vendor, { label: string; color: string }> = {
  anthropic: { label: 'Anthropic', color: '#FF6B2C' },
  openai:    { label: 'OpenAI',    color: '#2E9D7A' },
  google:    { label: 'Google',    color: '#5B8DEF' },
  meta:      { label: 'Meta',      color: '#4A6EE5' },
  xai:       { label: 'xAI',       color: '#9CA3AF' },
  zhipu:     { label: 'Zhipu',     color: '#C77DFF' },
  moonshot:  { label: 'Moonshot',  color: '#F5C24A' },
  alibaba:   { label: 'Alibaba',   color: '#8B5CF6' },
  baidu:     { label: 'Baidu',     color: '#4F86C6' },
  bytedance: { label: 'ByteDance', color: '#5EC8C8' },
  other:     { label: '',          color: '#71717A' },
};

export const LMARENA: Category[] = [
  {
    id: 'text',
    name: 'Text',
    blurb: 'The headline board — head-to-head chat votes.',
    freshness: 'board published 2026-06-10',
    rows: [
      { rank: 1,  model: 'claude-opus-4-6-thinking', score: 1511, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6',          score: 1507, vendor: 'anthropic' },
      { rank: 3,  model: 'gpt-5.4-mini-high',        score: 1499, vendor: 'openai' },
      { rank: 4,  model: 'claude-opus-4-7-thinking', score: 1498, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-fable-5',           score: 1497, vendor: 'anthropic' },
      { rank: 6,  model: 'gpt-5.4',                  score: 1495, vendor: 'openai' },
      { rank: 7,  model: 'gpt-5.2-high',             score: 1493, vendor: 'openai' },
      { rank: 8,  model: 'gpt-5.4-high',             score: 1491, vendor: 'openai' },
      { rank: 9,  model: 'gemini-3.1-pro-preview',   score: 1490, vendor: 'google' },
      { rank: 10, model: 'claude-opus-4-7',          score: 1490, vendor: 'anthropic' },
    ],
  },
  {
    id: 'webdev',
    name: 'WebDev',
    blurb: 'Build a working web app from a prompt.',
    freshness: 'board published 2026-06-10',
    rows: [
      { rank: 1,  model: 'claude-fable-5',           score: 1665, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-7-thinking', score: 1566, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-8-thinking', score: 1559, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-7',          score: 1557, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-4-8',          score: 1543, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-opus-4-6-thinking', score: 1542, vendor: 'anthropic' },
      { rank: 7,  model: 'claude-opus-4-6',          score: 1539, vendor: 'anthropic' },
      { rank: 8,  model: 'qwen3.7-max-20260517',     score: 1534, vendor: 'alibaba' },
      { rank: 9,  model: 'glm-5.1',                  score: 1532, vendor: 'zhipu' },
      { rank: 10, model: 'claude-sonnet-4-6',        score: 1523, vendor: 'anthropic' },
    ],
  },
  {
    id: 'image-to-webdev',
    name: 'Image-to-WebDev',
    blurb: 'Turn a screenshot into a working front-end.',
    freshness: 'no live feed · rows from 2026-05-18',
    rows: [
      { rank: 1,  model: 'claude-opus-4-7-thinking',      score: 1581, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-sonnet-4-6',             score: 1557, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-7',               score: 1556, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-6-thinking',      score: 1538, vendor: 'anthropic' },
      { rank: 5,  model: 'gpt-5.5-xhigh (codex-harness)', score: 1537, vendor: 'openai' },
      { rank: 6,  model: 'claude-opus-4-6',               score: 1534, vendor: 'anthropic' },
      { rank: 7,  model: 'kimi-k2.6',                     score: 1522, vendor: 'moonshot' },
      { rank: 8,  model: 'gpt-5.5-high (codex-harness)',  score: 1519, vendor: 'openai' },
      { rank: 9,  model: 'gemini-3.1-pro-preview',        score: 1490, vendor: 'google' },
      { rank: 10, model: 'gpt-5.5 (codex-harness)',       score: 1489, vendor: 'openai' },
    ],
  },
  {
    id: 'document',
    name: 'Document',
    blurb: 'Long-document reasoning and synthesis.',
    freshness: 'board published 2026-06-10',
    rows: [
      { rank: 1,  model: 'claude-opus-4-6',           score: 1507, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6-thinking',  score: 1507, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-7-thinking',  score: 1498, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-7',           score: 1496, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-fable-5',            score: 1495, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-sonnet-4-6',         score: 1487, vendor: 'anthropic' },
      { rank: 7,  model: 'gpt-5.5-high',              score: 1485, vendor: 'openai' },
      { rank: 8,  model: 'gpt-5.5',                   score: 1483, vendor: 'openai' },
      { rank: 9,  model: 'gpt-5.4',                   score: 1474, vendor: 'openai' },
      { rank: 10, model: 'claude-opus-4-8-thinking',  score: 1473, vendor: 'anthropic' },
    ],
  },
  {
    id: 'vision',
    name: 'Vision',
    blurb: 'Understanding images, charts, and screenshots.',
    freshness: 'board published 2026-06-10',
    rows: [
      { rank: 1,  model: 'claude-fable-5',           score: 1323, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-7-thinking', score: 1323, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-7',          score: 1317, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-6-thinking', score: 1317, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-4-6',          score: 1315, vendor: 'anthropic' },
      { rank: 6,  model: 'muse-spark',               score: 1307, vendor: 'meta' },
      { rank: 7,  model: 'gemini-3-pro',             score: 1305, vendor: 'google' },
      { rank: 8,  model: 'gpt-5.4-high',             score: 1301, vendor: 'openai' },
      { rank: 9,  model: 'gemini-3.1-pro-preview',   score: 1297, vendor: 'google' },
      { rank: 10, model: 'claude-opus-4-8-thinking', score: 1297, vendor: 'anthropic' },
    ],
  },
  {
    id: 'search',
    name: 'Search',
    blurb: 'Grounded answers with live web retrieval.',
    freshness: 'board published 2026-05-12',
    rows: [
      { rank: 1,  model: 'claude-opus-4-6-search',           score: 1251, vendor: 'anthropic' },
      { rank: 2,  model: 'gpt-5.5-search',                   score: 1239, vendor: 'openai' },
      { rank: 3,  model: 'claude-opus-4-7',                  score: 1237, vendor: 'anthropic' },
      { rank: 4,  model: 'ernie-5.1',                        score: 1226, vendor: 'baidu' },
      { rank: 5,  model: 'claude-sonnet-4-6-search',         score: 1219, vendor: 'anthropic' },
      { rank: 6,  model: 'gemini-3.1-pro-grounding',         score: 1216, vendor: 'google' },
      { rank: 7,  model: 'gpt-5.2-search',                   score: 1210, vendor: 'openai' },
      { rank: 8,  model: 'grok-4.20-multi-agent-beta-0309',  score: 1209, vendor: 'xai' },
      { rank: 9,  model: 'gemini-3-pro-grounding',           score: 1208, vendor: 'google' },
      { rank: 10, model: 'gemini-3-flash-grounding',         score: 1206, vendor: 'google' },
    ],
  },
  {
    id: 'text-to-image',
    name: 'Text-to-Image',
    blurb: 'Generate an image from a prompt.',
    freshness: 'board published 2026-06-05',
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                          score: 1385, vendor: 'openai' },
      { rank: 2,  model: 'reve-2.0',                                      score: 1273, vendor: 'other' },
      { rank: 3,  model: 'gemini-3.1-flash-image-preview (nano-banana-2)', score: 1269, vendor: 'google' },
      { rank: 4,  model: 'mai-image-2.5',                                 score: 1253, vendor: 'other' },
      { rank: 5,  model: 'gemini-3-pro-image-preview-2k (nano-banana-pro)', score: 1245, vendor: 'google' },
      { rank: 6,  model: 'gpt-image-1.5-high-fidelity',                   score: 1241, vendor: 'openai' },
      { rank: 7,  model: 'grok-imagine-image-quality',                    score: 1234, vendor: 'xai' },
      { rank: 8,  model: 'gemini-3-pro-image-preview (nano-banana-pro)',  score: 1232, vendor: 'google' },
      { rank: 9,  model: 'ideogram-4.0-quality',                          score: 1204, vendor: 'other' },
      { rank: 10, model: 'uni-1.1-max',                                   score: 1191, vendor: 'other' },
    ],
  },
  {
    id: 'image-edit',
    name: 'Image Edit',
    blurb: 'Edit an existing image to instruction.',
    freshness: 'feed offline on capture · rows from 2026-05-18',
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                 score: 1467, vendor: 'openai' },
      { rank: 2,  model: 'chatgpt-image-latest-high-fidelity',   score: 1393, vendor: 'openai' },
      { rank: 3,  model: 'gemini-3-pro-image-preview-2k',        score: 1387, vendor: 'google' },
      { rank: 4,  model: 'gemini-3-pro-image-preview',           score: 1386, vendor: 'google' },
      { rank: 5,  model: 'gemini-3.1-flash-image-preview',       score: 1386, vendor: 'google' },
      { rank: 6,  model: 'gpt-image-1.5-high-fidelity',          score: 1373, vendor: 'openai' },
      { rank: 7,  model: 'grok-imagine-image-quality',           score: 1356, vendor: 'xai' },
      { rank: 8,  model: 'uni-1.1-max',                          score: 1336, vendor: 'other' },
      { rank: 9,  model: 'grok-imagine-image',                   score: 1329, vendor: 'xai' },
      { rank: 10, model: 'grok-imagine-image-pro',               score: 1315, vendor: 'xai' },
    ],
  },
  {
    id: 'text-to-video',
    name: 'Text-to-Video',
    blurb: 'Generate video from a prompt.',
    freshness: 'board published 2026-05-29',
    rows: [
      { rank: 1,  model: 'dreamina-seedance-2.0-720p', score: 1463, vendor: 'bytedance' },
      { rank: 2,  model: 'happyhorse-1.0',             score: 1440, vendor: 'other' },
      { rank: 3,  model: 'wan2.7-t2v',                 score: 1385, vendor: 'alibaba' },
      { rank: 4,  model: 'veo-3.1-audio-1080p',        score: 1370, vendor: 'google' },
      { rank: 5,  model: 'sora-2-pro',                 score: 1367, vendor: 'openai' },
      { rank: 6,  model: 'veo-3.1-audio',              score: 1366, vendor: 'google' },
      { rank: 7,  model: 'veo-3.1-fast-audio',         score: 1364, vendor: 'google' },
      { rank: 8,  model: 'veo-3.1-fast-audio-1080p',   score: 1362, vendor: 'google' },
      { rank: 9,  model: 'grok-imagine-video-720p',    score: 1359, vendor: 'xai' },
      { rank: 10, model: 'veo-3-fast-audio',           score: 1349, vendor: 'google' },
    ],
  },
  {
    id: 'image-to-video',
    name: 'Image-to-Video',
    blurb: 'Animate a still image into video.',
    freshness: 'board published 2026-05-30',
    rows: [
      { rank: 1,  model: 'grok-imagine-video-1.5-preview-720p', score: 1473, vendor: 'xai' },
      { rank: 2,  model: 'dreamina-seedance-2.0-720p',          score: 1467, vendor: 'bytedance' },
      { rank: 3,  model: 'happyhorse-1.0',                      score: 1443, vendor: 'other' },
      { rank: 4,  model: 'grok-imagine-video-720p',             score: 1421, vendor: 'xai' },
      { rank: 5,  model: 'veo-3.1-audio',                       score: 1397, vendor: 'google' },
      { rank: 6,  model: 'veo-3.1-audio-1080p',                 score: 1393, vendor: 'google' },
      { rank: 7,  model: 'veo-3.1-fast-audio',                  score: 1384, vendor: 'google' },
      { rank: 8,  model: 'grok-imagine-video-480p',             score: 1383, vendor: 'xai' },
      { rank: 9,  model: 'veo-3.1-fast-audio-1080p',            score: 1374, vendor: 'google' },
      { rank: 10, model: 'vidu-q3-pro',                         score: 1360, vendor: 'other' },
    ],
  },
  {
    id: 'video-edit',
    name: 'Video Edit',
    blurb: 'Edit an existing clip to instruction.',
    freshness: 'board published 2026-05-12',
    rows: [
      { rank: 1, model: 'dreamina-seedance-2.0-720p', score: 1379, vendor: 'bytedance' },
      { rank: 2, model: 'happyhorse-1.0',             score: 1319, vendor: 'other' },
      { rank: 3, model: 'grok-imagine-video',         score: 1265, vendor: 'xai' },
      { rank: 4, model: 'kling-o3-pro',               score: 1247, vendor: 'other' },
      { rank: 5, model: 'kling-o1-pro',               score: 1208, vendor: 'other' },
      { rank: 6, model: 'runway-gen4-aleph',          score: 1204, vendor: 'other' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Lab-claimed agentic benchmarks — launch-deck numbers, NOT arena votes.
// Every figure traces to a dated entry in src/lib/research-notes.ts.
// Framing discipline (Ch 24): launch numbers get the Berkeley-RDI discount
// before they get respect; models you can't buy (Mythos 5) don't appear.

export type LabClaim = {
  bench: string;
  what: string;
  entries: { model: string; score: string; vendor: Vendor }[];
  source: string;
  caveat: string;
};

export const LAB_CLAIMS: LabClaim[] = [
  {
    bench: 'SWE-Bench Pro',
    what: 'agentic coding — the honest successor to Verified',
    entries: [
      { model: 'claude-fable-5',  score: '80.3%', vendor: 'anthropic' },
      { model: 'claude-opus-4-8', score: '69.2%', vendor: 'anthropic' },
      { model: 'gpt-5.5',         score: '58.6%', vendor: 'openai' },
    ],
    source: 'Anthropic launch table · 2026-06-09',
    caveat: 'first-party launch numbers — discount per Ch 24',
  },
  {
    bench: 'FrontierCode (Diamond)',
    what: 'long-horizon coding, built to be unsaturated',
    entries: [
      { model: 'claude-fable-5 (xhigh)', score: '29.3%', vendor: 'anthropic' },
      { model: 'claude-opus-4-8',        score: '13.4%', vendor: 'anthropic' },
    ],
    source: 'Anthropic launch table · 2026-06-09',
    caveat: '2.2× the previous frontier — still a launch number',
  },
  {
    bench: 'OSWorld',
    what: 'computer use — the board that held up best under RDI gaming tests',
    entries: [
      { model: 'claude-sonnet-4-6', score: '72.5%', vendor: 'anthropic' },
    ],
    source: 'Anthropic product page · per Berkeley RDI (2026-04-12)',
    caveat: 'the production-realistic anchor to calibrate against',
  },
  {
    bench: 'Terminal-Bench',
    what: 'agentic terminal work',
    entries: [
      { model: 'gemini-3.5-flash', score: '76.2', vendor: 'google' },
      { model: 'gemini-3.1-pro',   score: '70.3', vendor: 'google' },
    ],
    source: 'Google launch presentation · 2026-05-19',
    caveat: 'low confidence — vendor slide, not an independent eval',
  },
];
