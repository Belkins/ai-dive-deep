// Arena (formerly LMArena) leaderboard snapshot — a hand-verified static mirror
// of the public boards. The live page blocks iframe embedding and Arena ships no
// machine-readable public API, so this file is the one source of truth; edit it
// and the widget re-renders.
//
// Capture: 2026-07-27. Ten of eleven boards were cross-checked against an
// independent community mirror (github.com/oolong-tea-2026/arena-ai-leaderboards,
// data/2026-07-27/) — every rank, score and confidence interval matched. The
// exception is Image-to-WebDev, which the mirror does not cover: single-sourced.
// The community mirror is a corroborating source, never the primary citation.
//
// THE BOARDS DO NOT SHARE A DATE. Arena recomputes each board on its own cadence
// and the spread here is 34 days (2026-06-23 → 2026-07-26). One global "snapshot"
// date would be wrong for seven of eleven boards, so every category carries its
// own `freshness` stamp and the widget renders it per board.
//
// Two structural changes since the 2026-06-11 capture:
//   1. LMArena rebranded to Arena — lmarena.ai/leaderboard 301s to arena.ai.
//   2. The HuggingFace feed (lmarena-ai/leaderboard-dataset) was retired in the
//      rebrand and now 404s, so the widget's old live-fetch path is gone. There
//      is no replacement feed under an arena-ai namespace.
//
// Methodology caveat that must travel with any diff against an older capture:
// Arena's 2026-07-12 changelog states claude-fable-5's scores "have been updated
// to reflect only votes collected on or after July 1" for Code, Vision, Document
// and Search. Any Fable 5 delta vs. an earlier mirror measures a methodology
// change, not a capability change.

export type Row = { rank: number; model: string; score: number; vendor: Vendor };
export type Vendor =
  | 'anthropic' | 'openai' | 'google' | 'meta' | 'xai'
  | 'zhipu' | 'moonshot' | 'alibaba' | 'baidu' | 'bytedance'
  | 'deepseek' | 'minimax' | 'nvidia' | 'other';

export type Category = {
  id: string;
  name: string;
  blurb: string;
  freshness: string;
  rows: Row[];
  // Rendered under the board when the rows carry a caveat a reader would
  // otherwise miss — thin vote samples, display defects, absent models.
  note?: string;
};

export const LMARENA_SNAPSHOT = '2026-07-27';
export const LMARENA_LIVE = 'https://arena.ai/leaderboard';
export const LMARENA_MIRROR = 'https://github.com/oolong-tea-2026/arena-ai-leaderboards';

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
  deepseek:  { label: 'DeepSeek',  color: '#4D6BFE' },
  minimax:   { label: 'MiniMax',   color: '#E8554E' },
  nvidia:    { label: 'NVIDIA',    color: '#77B900' },
  other:     { label: '',          color: '#71717A' },
};

// Opus 5 appears on four boards as the exact string `claude-opus-5-high` — not
// `claude-opus-5`, not `-thinking`. The suffix is load-bearing: Arena is voting
// on the API DEFAULT effort, while every vendor benchmark table in the launch
// deck runs at `max`. Same for `claude-sonnet-5-high`. Model strings below are
// verbatim from Arena, including harness parentheticals like `(codex-harness)`
// and `(max)` — a different harness is a different competitor.
export const LMARENA: Category[] = [
  {
    id: 'text',
    name: 'Text',
    blurb: 'The headline board — head-to-head chat votes.',
    freshness: 'board published 2026-07-26 · 7.48M votes',
    rows: [
      { rank: 1,  model: 'claude-fable-5',           score: 1508, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6-thinking', score: 1505, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-7-thinking', score: 1502, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-6',          score: 1498, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-5-high',       score: 1495, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-opus-4-7',          score: 1493, vendor: 'anthropic' },
      { rank: 7,  model: 'muse-spark-1.1',           score: 1493, vendor: 'meta' },
      { rank: 8,  model: 'muse-spark',               score: 1488, vendor: 'meta' },
      { rank: 9,  model: 'gemini-3.1-pro-preview',   score: 1486, vendor: 'google' },
      { rank: 10, model: 'gemini-3-pro',             score: 1486, vendor: 'google' },
      { rank: 11, model: 'kimi-k3',                  score: 1485, vendor: 'moonshot' },
      { rank: 12, model: 'gpt-5.6-sol-xhigh',        score: 1485, vendor: 'openai' },
    ],
    note: 'Anthropic holds all six of the top six — a clean sweep — and no OpenAI model reaches the top 10; the highest GPT entry is #12. Opus 5 debuts 5th, behind three older Opus variants, on 5,417 votes against 16k–68k for the models above it (±8 vs ±4–6). Ranks 9–12 span a single Elo point.',
  },
  {
    id: 'webdev',
    name: 'WebDev',
    blurb: 'Build a working web app from a prompt.',
    freshness: 'board published 2026-07-26 · 486K votes',
    rows: [
      { rank: 1,  model: 'kimi-k3',                           score: 1682, vendor: 'moonshot' },
      { rank: 2,  model: 'claude-opus-5-high',                score: 1673, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-fable-5',                    score: 1629, vendor: 'anthropic' },
      { rank: 4,  model: 'gpt-5.6-sol-xhigh (codex-harness)', score: 1625, vendor: 'openai' },
      { rank: 5,  model: 'glm-5.2 (max)',                     score: 1587, vendor: 'zhipu' },
      { rank: 6,  model: 'claude-opus-4-8-thinking',          score: 1568, vendor: 'anthropic' },
      { rank: 7,  model: 'claude-opus-4-7',                   score: 1559, vendor: 'anthropic' },
      { rank: 8,  model: 'claude-opus-4-7-thinking',          score: 1557, vendor: 'anthropic' },
      { rank: 9,  model: 'grok-4.5',                          score: 1549, vendor: 'xai' },
      { rank: 10, model: 'claude-opus-4-6-thinking',          score: 1546, vendor: 'anthropic' },
      { rank: 11, model: 'claude-sonnet-5-high',              score: 1543, vendor: 'anthropic' },
    ],
    note: 'The board a frontier lab does not lead: Kimi K3 — open weights, released 2026-07-16 — sits 9 Elo above Opus 5 with fully overlapping intervals (±13 / ±14). A statistical tie held by Moonshot. Opus 5 is on 2,392 votes, thin for the position.',
  },
  {
    id: 'image-to-webdev',
    name: 'Image-to-WebDev',
    blurb: 'Turn a screenshot into a working front-end.',
    freshness: 'board published 2026-07-17 · single-sourced',
    rows: [
      { rank: 1,  model: 'claude-fable-5',                score: 1636, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-fable-5',                score: 1627, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-7-thinking',      score: 1581, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-7',               score: 1567, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-4-6-thinking',      score: 1547, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-sonnet-4-6',             score: 1544, vendor: 'anthropic' },
      { rank: 7,  model: 'claude-opus-4-6',               score: 1537, vendor: 'anthropic' },
      { rank: 8,  model: 'claude-sonnet-5-high',          score: 1533, vendor: 'anthropic' },
      { rank: 9,  model: 'gpt-5.5-xhigh (codex-harness)', score: 1525, vendor: 'openai' },
      { rank: 10, model: 'kimi-k2.6',                     score: 1519, vendor: 'moonshot' },
    ],
    note: 'Ranks 1 and 2 render the identical display string with different vote counts (120 vs 1,930) and intervals (±62 vs ±15) — an Arena-side display defect, reproduced here rather than silently cleaned. Read rank 2 as the meaningful #1: rank 1\'s ±62 spans 1574–1698, indistinguishable from anything in the top five. Anthropic occupies ranks 1–8. Opus 5 is absent.',
  },
  {
    id: 'document',
    name: 'Document',
    blurb: 'Long-document reasoning and synthesis.',
    freshness: 'board published 2026-07-26 · 323K votes',
    rows: [
      { rank: 1,  model: 'claude-opus-5-high',       score: 1520, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6',          score: 1510, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-6-thinking', score: 1506, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-fable-5',           score: 1504, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-4-7',          score: 1498, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-opus-4-7-thinking', score: 1497, vendor: 'anthropic' },
      { rank: 7,  model: 'gpt-5.5-high',             score: 1485, vendor: 'openai' },
      { rank: 8,  model: 'claude-sonnet-4-6',        score: 1483, vendor: 'anthropic' },
      { rank: 9,  model: 'gpt-5.5',                  score: 1480, vendor: 'openai' },
      { rank: 10, model: 'claude-opus-4-8-thinking', score: 1475, vendor: 'anthropic' },
    ],
    note: 'Opus 5 debuts at #1 — on 1,663 votes against rank 2\'s 37,271, a 22× sample gap, with fully overlapping intervals (1505–1535 vs 1504–1516). "The #1 document model" is a leaderboard fact, not yet a statistical one. Sonnet 5 sits at rank 12 (1470); rank 11 was not captured and is not invented here.',
  },
  {
    id: 'vision',
    name: 'Vision',
    blurb: 'Understanding images, charts, and screenshots.',
    freshness: 'board published 2026-07-26 · 1.15M votes',
    rows: [
      { rank: 1,  model: 'claude-fable-5',           score: 1318, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-7-thinking', score: 1304, vendor: 'anthropic' },
      { rank: 3,  model: 'gemini-3.6-flash',         score: 1301, vendor: 'google' },
      { rank: 4,  model: 'claude-opus-4-6-thinking', score: 1300, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-5-high',       score: 1299, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-opus-4-7',          score: 1298, vendor: 'anthropic' },
      { rank: 7,  model: 'muse-spark',               score: 1295, vendor: 'meta' },
      { rank: 8,  model: 'claude-opus-4-6',          score: 1294, vendor: 'anthropic' },
      { rank: 9,  model: 'gemini-3-pro',             score: 1289, vendor: 'google' },
      { rank: 10, model: 'gpt-5.5',                  score: 1287, vendor: 'openai' },
    ],
    note: 'gemini-3.6-flash at #3 rests on 238 votes at ±38 — an interval spanning 1263–1339, which overlaps essentially the entire top 10. Provisional. Arena\'s own changelog omits Vision from the boards Opus 5 was added to, yet the board and the community mirror agree it sits at #5 on 1,992 votes; the changelog is incomplete, not the data.',
  },
  {
    id: 'search',
    name: 'Search',
    blurb: 'Grounded answers with live web retrieval.',
    freshness: 'board published 2026-07-21 · 940K votes',
    rows: [
      { rank: 1,  model: 'claude-opus-4-6-search',          score: 1253, vendor: 'anthropic' },
      { rank: 2,  model: 'gpt-5.5-search',                  score: 1240, vendor: 'openai' },
      { rank: 3,  model: 'claude-fable-5',                  score: 1237, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-7',                 score: 1233, vendor: 'anthropic' },
      { rank: 5,  model: 'ernie-5.1',                       score: 1226, vendor: 'baidu' },
      { rank: 6,  model: 'claude-sonnet-4-6-search',        score: 1221, vendor: 'anthropic' },
      { rank: 7,  model: 'gemini-3.1-pro-grounding',        score: 1212, vendor: 'google' },
      { rank: 8,  model: 'gemini-3-pro-grounding',          score: 1207, vendor: 'google' },
      { rank: 9,  model: 'gpt-5.2-search',                  score: 1206, vendor: 'openai' },
      { rank: 10, model: 'grok-4.20-multi-agent-beta-0309', score: 1205, vendor: 'xai' },
    ],
    note: 'Opus 5 has no Search entry; Sonnet 5 does — `claude-sonnet-5-search` at rank 16 (1188 ±6), below this top ten. Worth pairing with the API fact: the server-side `web_fetch` tool is not available on Opus 5, so a search agent on Opus 5 must bring its own fetcher.',
  },
  {
    id: 'text-to-image',
    name: 'Text-to-Image',
    blurb: 'Generate an image from a prompt.',
    freshness: 'board published 2026-07-10 · 17 days stale',
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                                score: 1385, vendor: 'openai' },
      { rank: 2,  model: 'reve-2.1',                                            score: 1302, vendor: 'other' },
      { rank: 3,  model: 'muse-image',                                          score: 1280, vendor: 'meta' },
      { rank: 4,  model: 'reve-2.0',                                            score: 1271, vendor: 'other' },
      { rank: 5,  model: 'gemini-3.1-flash-image (nano-banana-2) [web-search]', score: 1261, vendor: 'google' },
      { rank: 6,  model: 'mai-image-2.5',                                       score: 1257, vendor: 'other' },
      { rank: 7,  model: 'gemini-3.1-flash-lite-image (nano-banana-2-lite)',    score: 1250, vendor: 'google' },
      { rank: 8,  model: 'gemini-3-pro-image-2k (nano-banana-pro)',             score: 1245, vendor: 'google' },
      { rank: 9,  model: 'gpt-image-1.5-high-fidelity',                         score: 1240, vendor: 'openai' },
      { rank: 10, model: 'gemini-3-pro-image-preview (nano-banana-pro)',        score: 1232, vendor: 'google' },
    ],
    note: 'gpt-image-2 leads by 83 Elo — the widest #1-to-#2 gap on any board in this capture. Everywhere else the top of a board is a coin-flip; here it is not.',
  },
  {
    id: 'image-edit',
    name: 'Image Edit',
    blurb: 'Edit an existing image to instruction.',
    freshness: 'board published 2026-07-10 · 17 days stale',
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                               score: 1465, vendor: 'openai' },
      { rank: 2,  model: 'muse-image',                                         score: 1402, vendor: 'meta' },
      { rank: 3,  model: 'mai-image-2.5',                                      score: 1401, vendor: 'other' },
      { rank: 4,  model: 'seedream-5.0-pro',                                   score: 1393, vendor: 'bytedance' },
      { rank: 5,  model: 'chatgpt-image-latest-high-fidelity (20251216)',      score: 1389, vendor: 'openai' },
      { rank: 6,  model: 'grok-imagine-image-quality (20260519)',              score: 1389, vendor: 'xai' },
      { rank: 7,  model: 'gemini-3-pro-image-2k (nano-banana-pro)',            score: 1388, vendor: 'google' },
      { rank: 8,  model: 'gemini-3-pro-image-preview (nano-banana-pro)',       score: 1385, vendor: 'google' },
      { rank: 9,  model: 'gemini-3.1-flash-image (nano-banana-2) [web-search]', score: 1385, vendor: 'google' },
      { rank: 10, model: 'reve-2.1',                                           score: 1383, vendor: 'other' },
    ],
  },
  {
    id: 'text-to-video',
    name: 'Text-to-Video',
    blurb: 'Generate video from a prompt.',
    freshness: 'board published 2026-07-05 · 22 days stale',
    rows: [
      { rank: 1,  model: 'gemini-omni-flash',          score: 1527, vendor: 'google' },
      { rank: 2,  model: 'dreamina-seedance-2.0-720p', score: 1482, vendor: 'bytedance' },
      { rank: 3,  model: 'muse-video',                 score: 1459, vendor: 'meta' },
      { rank: 4,  model: 'happyhorse-1.0',             score: 1430, vendor: 'alibaba' },
      { rank: 5,  model: 'sora-2-pro',                 score: 1366, vendor: 'openai' },
      { rank: 6,  model: 'veo-3.1-audio-1080p',        score: 1364, vendor: 'google' },
      { rank: 7,  model: 'veo-3.1-audio',              score: 1364, vendor: 'google' },
      { rank: 8,  model: 'veo-3.1-fast-audio',         score: 1362, vendor: 'google' },
      { rank: 9,  model: 'veo-3.1-fast-audio-1080p',   score: 1360, vendor: 'google' },
      { rank: 10, model: 'grok-imagine-video-720p',    score: 1352, vendor: 'xai' },
    ],
  },
  {
    id: 'image-to-video',
    name: 'Image-to-Video',
    blurb: 'Animate a still image into video.',
    freshness: 'board published 2026-06-23 · 34 days stale',
    rows: [
      { rank: 1,  model: 'dreamina-seedance-2.0-720p',          score: 1474, vendor: 'bytedance' },
      { rank: 2,  model: 'gemini-omni-flash',                   score: 1469, vendor: 'google' },
      { rank: 3,  model: 'grok-imagine-video-1.5-preview-720p', score: 1466, vendor: 'xai' },
      { rank: 4,  model: 'happyhorse-1.0',                      score: 1444, vendor: 'alibaba' },
      { rank: 5,  model: 'wan2.7-i2v',                          score: 1434, vendor: 'alibaba' },
      { rank: 6,  model: 'grok-imagine-video-720p',             score: 1422, vendor: 'xai' },
      { rank: 7,  model: 'veo-3.1-audio',                       score: 1398, vendor: 'google' },
      { rank: 8,  model: 'veo-3.1-audio-1080p',                 score: 1391, vendor: 'google' },
      { rank: 9,  model: 'veo-3.1-fast-audio',                  score: 1385, vendor: 'google' },
      { rank: 10, model: 'grok-imagine-video-480p',             score: 1384, vendor: 'xai' },
    ],
    note: 'The stalest board in the set — 34 days since Arena last recomputed it. The top three are separated by 8 Elo with overlapping intervals: a three-way tie, not a ranking.',
  },
  {
    id: 'video-edit',
    name: 'Video Edit',
    blurb: 'Edit an existing clip to instruction.',
    freshness: 'board published 2026-06-29 · 28 days stale',
    rows: [
      { rank: 1, model: 'dreamina-seedance-2.0-720p', score: 1377, vendor: 'bytedance' },
      { rank: 2, model: 'gemini-omni-flash',          score: 1347, vendor: 'google' },
      { rank: 3, model: 'happyhorse-1.0',             score: 1308, vendor: 'alibaba' },
      { rank: 4, model: 'grok-imagine-video',         score: 1264, vendor: 'xai' },
      { rank: 5, model: 'kling-o3-pro',               score: 1251, vendor: 'other' },
      { rank: 6, model: 'kling-o1-pro',               score: 1203, vendor: 'other' },
      { rank: 7, model: 'runway-gen4-aleph',          score: 1194, vendor: 'other' },
    ],
    note: 'This is the complete board, not a truncated top ten — only seven models exist. Total votes are roughly 0.4% of the Text-to-Image board\'s.',
  },
];

// ---------------------------------------------------------------------------
// Arena's Agent board — deliberately NOT a Category.
//
// It does not use Elo. Its metric is a "Net Improvement Score" expressed as a
// percentage, and it renders prettified display names rather than model slugs.
// Coercing it into the `score: number` Elo shape above would render 12.72 in a
// column that reads 1508 two tabs over — the exact category error this chapter
// exists to argue against. It gets its own shape and its own panel.

export type AgentRow = { rank: number; model: string; net: string; vendor: Vendor };

export const ARENA_AGENT_META = {
  published: '2026-07-21',
  sessions: '1,242,857 sessions · 38 models',
  metric: 'Net Improvement Score',
};

export const ARENA_AGENT: AgentRow[] = [
  { rank: 1,  model: 'Claude Fable 5 (High)',        net: '12.72% ± 2.00%', vendor: 'anthropic' },
  { rank: 2,  model: 'GPT 5.6 Sol (xHigh)',          net: '10.12% ± 1.69%', vendor: 'openai' },
  { rank: 3,  model: 'Claude Opus 4.8 (Thinking)',   net: '9.75% ± 1.39%',  vendor: 'anthropic' },
  { rank: 4,  model: 'Kimi K3',                      net: '9.71% ± 1.52%',  vendor: 'moonshot' },
  { rank: 5,  model: 'Claude Sonnet 5 (High)',       net: '8.66% ± 1.89%',  vendor: 'anthropic' },
  { rank: 6,  model: 'GPT 5.5 (xHigh)',              net: '8.41% ± 0.87%',  vendor: 'openai' },
  { rank: 7,  model: 'Claude Opus 4.7 (Thinking)',   net: '7.94% ± 1.24%',  vendor: 'anthropic' },
  { rank: 8,  model: 'Claude Opus 4.7',              net: '7.67% ± 1.25%',  vendor: 'anthropic' },
  { rank: 9,  model: 'GPT 5.5 (High)',               net: '7.61% ± 0.81%',  vendor: 'openai' },
  { rank: 10, model: 'GLM 5.2 (Max)',                net: '6.50% ± 1.00%',  vendor: 'zhipu' },
];

// ---------------------------------------------------------------------------
// Lab-claimed agentic benchmarks — launch-deck numbers, NOT arena votes.
// Every figure traces to a dated entry in src/lib/research-notes.ts.
//
// Framing discipline (Ch 24): launch numbers get the Berkeley-RDI discount
// before they get respect; models you can't buy (Mythos 5) don't appear.
//
// New in the 2026-07-27 refresh: an optional SECOND column. Three of these four
// cards now carry the vendor's own number beside the public independent board's
// — which is the whole editorial thesis rendered as a table instead of asserted
// as a claim. Where a model is absent from the public board, the cell says so.

export type LabClaim = {
  bench: string;
  what: string;
  // When present, the entries render as two columns under these headers.
  columns?: [string, string];
  entries: { model: string; score: string; score2?: string; vendor: Vendor }[];
  source: string;
  caveat: string;
  // 'vendor' = launch-deck claim · 'independent' = run by a third party.
  tier: 'vendor' | 'independent';
};

export const LAB_CLAIMS: LabClaim[] = [
  {
    bench: 'SWE-Bench Pro',
    what: 'agentic coding — resolving real GitHub issues in real repos',
    tier: 'vendor',
    entries: [
      { model: 'claude-fable-5',  score: '80.0', vendor: 'anthropic' },
      { model: 'claude-opus-5',   score: '79.2', vendor: 'anthropic' },
      { model: 'claude-opus-4-8', score: '69.2', vendor: 'anthropic' },
      { model: 'gpt-5.6-sol',     score: '64.6', vendor: 'openai' },
    ],
    source: 'Anthropic · Claude Opus 5 System Card, Table 8.1.A · 2026-07-24',
    caveat: 'Max effort, mean of 5 trials — max is NOT the API default. Fable 5 still wins this row. Opus 5 appears on no independent SWE-Bench board. And Cursor\'s June study found 63% of Opus 4.8\'s passes retrieved a known fix rather than deriving one; sealing git history AND cutting internet access together dropped it 87.1% → 73.0% (of audited retrievals, web lookup was 57% and git-history mining only 9% — the internet is the bigger leak). Discount accordingly.',
  },
  {
    bench: 'FrontierBench v0.1',
    what: 'hard agentic terminal work — the Terminal-Bench successor',
    tier: 'vendor',
    columns: ['Anthropic\'s table', 'Public board'],
    entries: [
      { model: 'claude-opus-5',   score: '43.3', score2: '43.5', vendor: 'anthropic' },
      { model: 'gpt-5.6-sol',     score: '37.5', score2: '34.4', vendor: 'openai' },
      { model: 'claude-fable-5',  score: '33.7', score2: '33.8', vendor: 'anthropic' },
      { model: 'claude-opus-4-8', score: '18.7', score2: '21.1', vendor: 'anthropic' },
    ],
    source: 'Anthropic System Card Table 8.1.A · 2026-07-24 — vs. frontierbench.ai public board, read 2026-07-27',
    caveat: 'The most instructive row on this page, and not for the reason you would expect: the independent board AGREES on Opus 5 (43.5 ±1.65, rank 1) and disagrees sharply about its rival — Anthropic re-ran GPT-5.6 Sol itself at 37.5, while the public board has Sol at 34.4 on OpenAI\'s own agent. Two caveats survive the agreement. Anthropic\'s separate §8.5 run scores best at xhigh (44.4), not the max its headline prints. And in that run Opus 4.8 silently substituted whenever a safety classifier refused — 4% of Opus 5\'s trials, 26% of Fable 5\'s — so both Anthropic scores are two-model blends while the OpenAI score is clean. Note also that the public board mixes harnesses: Opus 5\'s rank-1 row runs on Princeton\'s mini-SWE-agent, Fable 5\'s on Anthropic\'s own.',
  },
  {
    bench: 'OSWorld 2.0',
    what: 'computer use — long-horizon desktop automation',
    tier: 'vendor',
    entries: [
      { model: 'claude-opus-5',   score: '70.6', vendor: 'anthropic' },
      { model: 'claude-fable-5',  score: '66.1', vendor: 'anthropic' },
      { model: 'gpt-5.6-sol',     score: '62.6', vendor: 'openai' },
      { model: 'claude-opus-4-8', score: '55.7', vendor: 'anthropic' },
    ],
    source: 'Anthropic · Claude Opus 5 System Card, Table 8.1.A · 2026-07-24',
    caveat: 'This is PARTIAL/checkpoint credit, not task completion — the OSWorld 2.0 paper scores Opus 4.8 at 20.6% binary against 54.8% partial, so "70.6% on computer tasks" reads about 3× what it means. Opus 4.8 was the grader. The GPT-5.6 figure was lifted from OpenAI\'s own post, so the gap is cross-harness. Opus 5 is absent from the official board.',
  },
  {
    bench: 'ARC-AGI-3',
    what: 'novel-environment reasoning, scored against human action efficiency',
    tier: 'independent',
    entries: [
      { model: 'claude-opus-5 (high)',  score: '30.16%', vendor: 'anthropic' },
      { model: 'anthropic fable-class', score: '~20%',   vendor: 'anthropic' },
      { model: 'gpt-5.6-sol (max)',     score: '13.33%', vendor: 'openai' },
    ],
    source: 'ARC Prize Foundation · arcprize.org · 2026-07-24 — run by ARC Prize, not by Anthropic',
    caveat: 'The one launch-window number on this page that earns full credit, because a third party executed and scored it. Read the config honestly: ARC Prize evaluated HIGH effort only — "due to the short testing window" — so no max-effort figure exists. All three rows above are the same Public Demo set; Anthropic\'s own table mixes in a Semi-Private score for GPT-5.6 (7.8%), which inflates the gap from ~2.3× to ~4×. One unresolved discrepancy worth stating rather than smoothing: Anthropic\'s §8.14.2 describes these same results as semi-private, while ARC Prize\'s own results page files them under the Public Demo set. We follow ARC Prize, since ARC Prize ran it.',
  },
];
