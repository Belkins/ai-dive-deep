// LMArena leaderboard snapshot — transcribed from arena.ai / the
// lmarena-ai/arena-leaderboard HF space. The live page blocks iframe
// embedding, so this is a hand-verified static mirror. Update by
// editing this file (one source of truth) — the component re-renders.
//
// Snapshot captured: 2026-05-18. Per-category freshness noted below
// (LMArena recomputes each board on its own cadence).

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

export const LMARENA_SNAPSHOT = '2026-05-18';
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
    freshness: 'overall category',
    rows: [
      { rank: 1,  model: 'claude-opus-4-6-thinking', score: 1502, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-7-thinking', score: 1500, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-6',          score: 1498, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-7',          score: 1492, vendor: 'anthropic' },
      { rank: 5,  model: 'muse-spark',               score: 1490, vendor: 'meta' },
      { rank: 6,  model: 'gemini-3.1-pro-preview',   score: 1489, vendor: 'google' },
      { rank: 7,  model: 'gemini-3-pro',             score: 1486, vendor: 'google' },
      { rank: 8,  model: 'gpt-5.5-high',             score: 1484, vendor: 'openai' },
      { rank: 9,  model: 'gpt-5.4-high',             score: 1479, vendor: 'openai' },
      { rank: 10, model: 'grok-4.20-beta1',          score: 1479, vendor: 'xai' },
    ],
  },
  {
    id: 'webdev',
    name: 'WebDev',
    blurb: 'Build a working web app from a prompt.',
    freshness: 'updated 3 days ago',
    rows: [
      { rank: 1,  model: 'claude-opus-4-7-thinking',        score: 1567, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-7',                 score: 1559, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-6-thinking',        score: 1546, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-6',                 score: 1541, vendor: 'anthropic' },
      { rank: 5,  model: 'glm-5.1',                         score: 1532, vendor: 'zhipu' },
      { rank: 6,  model: 'claude-sonnet-4-6',               score: 1524, vendor: 'anthropic' },
      { rank: 7,  model: 'kimi-k2.6',                       score: 1519, vendor: 'moonshot' },
      { rank: 8,  model: 'muse-spark',                      score: 1509, vendor: 'meta' },
      { rank: 9,  model: 'gpt-5.5-xhigh (codex-harness)',   score: 1501, vendor: 'openai' },
      { rank: 10, model: 'qwen3.6-max-preview',             score: 1491, vendor: 'alibaba' },
    ],
  },
  {
    id: 'image-to-webdev',
    name: 'Image-to-WebDev',
    blurb: 'Turn a screenshot into a working front-end.',
    freshness: 'updated 3 days ago',
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
    freshness: 'recently updated',
    rows: [
      { rank: 1,  model: 'claude-opus-4-6-thinking',  score: 1522, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6',           score: 1513, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-7',           score: 1510, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-7-thinking',  score: 1509, vendor: 'anthropic' },
      { rank: 5,  model: 'gpt-5.5-high',              score: 1496, vendor: 'openai' },
      { rank: 6,  model: 'claude-sonnet-4-6',         score: 1495, vendor: 'anthropic' },
      { rank: 7,  model: 'gpt-5.5',                   score: 1492, vendor: 'openai' },
      { rank: 8,  model: 'gpt-5.4',                   score: 1474, vendor: 'openai' },
      { rank: 9,  model: 'claude-opus-4-5-20251101',  score: 1466, vendor: 'anthropic' },
      { rank: 10, model: 'kimi-k2.6',                 score: 1454, vendor: 'moonshot' },
    ],
  },
  {
    id: 'vision',
    name: 'Vision',
    blurb: 'Understanding images, charts, and screenshots.',
    freshness: 'updated 5 days ago',
    rows: [
      { rank: 1,  model: 'claude-opus-4-7-thinking',          score: 1305, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-7',                   score: 1303, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-6-thinking',          score: 1300, vendor: 'anthropic' },
      { rank: 4,  model: 'muse-spark',                        score: 1299, vendor: 'meta' },
      { rank: 5,  model: 'claude-opus-4-6',                   score: 1292, vendor: 'anthropic' },
      { rank: 6,  model: 'gpt-5.5',                           score: 1290, vendor: 'openai' },
      { rank: 7,  model: 'gemini-3-pro',                      score: 1289, vendor: 'google' },
      { rank: 8,  model: 'gpt-5.5-high',                      score: 1282, vendor: 'openai' },
      { rank: 9,  model: 'gpt-5.2-chat-latest-20260210',      score: 1279, vendor: 'openai' },
      { rank: 10, model: 'gpt-5.5-instant',                   score: 1278, vendor: 'openai' },
    ],
  },
  {
    id: 'search',
    name: 'Search',
    blurb: 'Grounded answers with live web retrieval.',
    freshness: 'updated 5 days ago',
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
    freshness: 'updated 5 days ago',
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',              score: 1393, vendor: 'openai' },
      { rank: 2,  model: 'gemini-3.1-flash-image-preview',    score: 1268, vendor: 'google' },
      { rank: 3,  model: 'gemini-3-pro-image-preview-2k',     score: 1242, vendor: 'google' },
      { rank: 4,  model: 'gpt-image-1.5-high-fidelity',       score: 1241, vendor: 'openai' },
      { rank: 5,  model: 'gemini-3-pro-image-preview',        score: 1232, vendor: 'google' },
      { rank: 6,  model: 'grok-imagine-image-quality',        score: 1223, vendor: 'xai' },
      { rank: 7,  model: 'uni-1.1-max',                       score: 1192, vendor: 'other' },
      { rank: 8,  model: 'uni-1.1',                           score: 1183, vendor: 'other' },
      { rank: 9,  model: 'mai-image-2',                       score: 1181, vendor: 'other' },
      { rank: 10, model: 'grok-imagine-image',                score: 1172, vendor: 'xai' },
    ],
  },
  {
    id: 'image-edit',
    name: 'Image Edit',
    blurb: 'Edit an existing image to instruction.',
    freshness: 'updated 5 days ago',
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
    freshness: 'recently updated',
    rows: [
      { rank: 1,  model: 'dreamina-seedance-2.0-720p', score: 1457, vendor: 'bytedance' },
      { rank: 2,  model: 'happyhorse-1.0',             score: 1435, vendor: 'other' },
      { rank: 3,  model: 'veo-3.1-audio-1080p',        score: 1372, vendor: 'google' },
      { rank: 4,  model: 'sora-2-pro',                 score: 1368, vendor: 'openai' },
      { rank: 5,  model: 'veo-3.1-audio',              score: 1366, vendor: 'google' },
      { rank: 6,  model: 'veo-3.1-fast-audio',         score: 1364, vendor: 'google' },
      { rank: 7,  model: 'veo-3.1-fast-audio-1080p',   score: 1364, vendor: 'google' },
      { rank: 8,  model: 'grok-imagine-video-720p',    score: 1357, vendor: 'xai' },
      { rank: 9,  model: 'veo-3-fast-audio',           score: 1349, vendor: 'google' },
      { rank: 10, model: 'wan2.6-t2v',                 score: 1341, vendor: 'alibaba' },
    ],
  },
  {
    id: 'image-to-video',
    name: 'Image-to-Video',
    blurb: 'Animate a still image into video.',
    freshness: 'updated 5 days ago',
    rows: [
      { rank: 1,  model: 'dreamina-seedance-2.0-720p', score: 1462, vendor: 'bytedance' },
      { rank: 2,  model: 'happyhorse-1.0',             score: 1445, vendor: 'other' },
      { rank: 3,  model: 'grok-imagine-video-720p',    score: 1423, vendor: 'xai' },
      { rank: 4,  model: 'veo-3.1-audio',              score: 1397, vendor: 'google' },
      { rank: 5,  model: 'veo-3.1-audio-1080p',        score: 1394, vendor: 'google' },
      { rank: 6,  model: 'veo-3.1-fast-audio',         score: 1384, vendor: 'google' },
      { rank: 7,  model: 'grok-imagine-video-480p',    score: 1383, vendor: 'xai' },
      { rank: 8,  model: 'veo-3.1-fast-audio-1080p',   score: 1376, vendor: 'google' },
      { rank: 9,  model: 'vidu-q3-pro',                score: 1361, vendor: 'other' },
      { rank: 10, model: 'kling-v3-pro',               score: 1360, vendor: 'other' },
    ],
  },
  {
    id: 'video-edit',
    name: 'Video Edit',
    blurb: 'Edit an existing clip to instruction.',
    freshness: 'updated 5 days ago',
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
