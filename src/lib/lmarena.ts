// Arena (formerly LMArena) leaderboard snapshot — a hand-verified static mirror
// of the public boards. The live page blocks iframe embedding and Arena ships no
// machine-readable public API, so this file is the one source of truth; edit it
// and the widget re-renders.
//
// Capture: 2026-08-17, extracted from the embedded JSON payload of arena.ai
// (each board carries `voteCutoffISOString`, `totalVotes`, `totalModels` and
// full rating/CI/vote rows). Ten of eleven Elo boards plus the Agent board's
// top ten were cross-checked against an independent community mirror
// (github.com/oolong-tea-2026/arena-ai-leaderboards, data/2026-08-17/) — every
// rank, score and vote count matched. The exception is Image-to-Code, which the
// mirror does not cover: single-sourced. The community mirror is a
// corroborating source, never the primary citation.
//
// THE BOARDS DO NOT SHARE A DATE. Arena recomputes each board on its own
// cadence; the vote-cutoff spread in this capture is 25 days (2026-07-21 →
// 2026-08-15), and two boards (Document, Search) have not been recomputed since
// the previous 2026-07-27 capture. Every category carries its own `freshness`
// stamp and the widget renders it per board.
//
// Structural changes since the 2026-07-27 capture:
//   1. Arena renamed three boards: WebDev → Code, Image-to-WebDev →
//      Image-to-Code, Video Edit → Video-to-Video. The snapshot ids in the
//      payload still carry the old slugs (`webdev-overall-raw`,
//      `image_to_webdev-overall-raw`), which is how the continuity is provable.
//   2. Arena's organization column now displays xAI's models under "SpaceXAI".
//      This file keeps its own vendor taxonomy (`xai`, labelled "xAI").
//
// Methodology caveat that must travel with any diff against an older capture:
// Arena's 2026-07-12 changelog states claude-fable-5's scores "have been updated
// to reflect only votes collected on or after July 1" for Code, Vision, Document
// and Search. Any Fable 5 delta vs. a pre-July mirror measures a methodology
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

export const LMARENA_SNAPSHOT = '2026-08-17';
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

// Effort suffixes are load-bearing: `claude-opus-5-high` is the API DEFAULT and
// `claude-opus-5-max` is the launch-deck configuration — since this capture the
// crowd votes on BOTH as separate rows (Text has them at #7 and #10; Code at #4
// and #1). Model strings below are verbatim from Arena, including harness
// parentheticals like `(codex-harness)` — a different harness is a different
// competitor.
export const LMARENA: Category[] = [
  {
    id: 'text',
    name: 'Text',
    blurb: 'The headline board — head-to-head chat votes.',
    freshness: 'votes through 2026-08-12 · 7.78M votes · 391 models',
    rows: [
      { rank: 1,  model: 'claude-fable-5',          score: 1506, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6-high',    score: 1505, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-7-high',    score: 1502, vendor: 'anthropic' },
      { rank: 4,  model: 'muse-spark-1.2 (xHigh)',  score: 1498, vendor: 'meta' },
      { rank: 5,  model: 'claude-opus-4-6',         score: 1497, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-opus-4-7',         score: 1494, vendor: 'anthropic' },
      { rank: 7,  model: 'claude-opus-5-high',      score: 1493, vendor: 'anthropic' },
      { rank: 8,  model: 'qwen3.8-max',             score: 1491, vendor: 'alibaba' },
      { rank: 9,  model: 'gemini-3.7-flash-high',   score: 1490, vendor: 'google' },
      { rank: 10, model: 'claude-opus-5-max',       score: 1489, vendor: 'anthropic' },
      { rank: 11, model: 'muse-spark-1.1',          score: 1489, vendor: 'meta' },
      { rank: 12, model: 'kimi-k3-max',             score: 1489, vendor: 'moonshot' },
    ],
    note: 'July\'s clean sweep is over: Muse Spark 1.2 breaks into the all-Anthropic top six at #4 (3,280 votes, ±10). Fable 5\'s lead over Opus 5 is now statistically real — its interval (1501–1512) no longer overlaps claude-opus-5-high\'s (1488–1498), with Opus 5\'s sample grown from July\'s 5,417 votes to 20,030 — though #2 claude-opus-4-6-high (1501–1508) still overlaps Fable 5 fully, so the #1 spot itself remains a statistical tie. Both Opus 5 efforts carry rows now: high at #7, max at #10. Still no OpenAI model in the top 12. Ranks 8–12 span two Elo points.',
  },
  {
    id: 'code',
    name: 'Code',
    blurb: 'Build a working web app from a prompt.',
    freshness: 'votes through 2026-08-15 · 0.58M votes · 115 models',
    rows: [
      { rank: 1,  model: 'claude-opus-5-max',                  score: 1692, vendor: 'anthropic' },
      { rank: 2,  model: 'kimi-k3-max',                        score: 1674, vendor: 'moonshot' },
      { rank: 3,  model: 'qwen3.8-max',                        score: 1667, vendor: 'alibaba' },
      { rank: 4,  model: 'claude-opus-5-high',                 score: 1663, vendor: 'anthropic' },
      { rank: 5,  model: 'grok-4.6-high',                      score: 1631, vendor: 'xai' },
      { rank: 6,  model: 'claude-fable-5',                     score: 1627, vendor: 'anthropic' },
      { rank: 7,  model: 'gpt-5.6-sol-xhigh (codex-harness)',  score: 1622, vendor: 'openai' },
      { rank: 8,  model: 'gemini-3.7-flash-high',              score: 1587, vendor: 'google' },
      { rank: 9,  model: 'glm-5.2-max',                        score: 1585, vendor: 'zhipu' },
      { rank: 10, model: 'deepseek-v4-pro-high-20260813',      score: 1584, vendor: 'deepseek' },
      { rank: 11, model: 'deepseek-v4-flash-high',             score: 1581, vendor: 'deepseek' },
      { rank: 12, model: 'claude-opus-4-8-high',               score: 1564, vendor: 'anthropic' },
    ],
    note: 'Arena renamed this board from WebDev to Code (the payload id still says webdev). July\'s finding — the one board a frontier lab did not lead — is inverted: Opus 5 at max took #1 from Kimi K3, 1692 (1682–1701) over 1674 (1663–1685), an 18-point lead whose intervals still overlap by three points. Ranks 2–4 sit within 11 points of each other. Grok 4.6 debuts at #5 on 1,513 votes (±17) — provisional.',
  },
  {
    id: 'image-to-code',
    name: 'Image-to-Code',
    blurb: 'Turn a screenshot into a working front-end.',
    freshness: 'votes through 2026-08-04 · 87K votes · single-sourced',
    rows: [
      { rank: 1,  model: 'claude-opus-5-max',                  score: 1670, vendor: 'anthropic' },
      { rank: 2,  model: 'qwen3.8-max',                        score: 1631, vendor: 'alibaba' },
      { rank: 3,  model: 'claude-fable-5',                     score: 1626, vendor: 'anthropic' },
      { rank: 4,  model: 'gpt-5.6-sol-xhigh (codex-harness)',  score: 1581, vendor: 'openai' },
      { rank: 5,  model: 'grok-4.5',                           score: 1580, vendor: 'xai' },
      { rank: 6,  model: 'claude-opus-4-7-high',               score: 1579, vendor: 'anthropic' },
      { rank: 7,  model: 'kimi-k3-max',                        score: 1570, vendor: 'moonshot' },
      { rank: 8,  model: 'claude-opus-4-7',                    score: 1565, vendor: 'anthropic' },
      { rank: 9,  model: 'muse-spark-1.1',                     score: 1544, vendor: 'meta' },
      { rank: 10, model: 'claude-opus-4-6-high',               score: 1540, vendor: 'anthropic' },
    ],
    note: 'Renamed from Image-to-WebDev. July\'s two defects are both gone: the duplicated fable-5 display rows at #1/#2, and Opus 5\'s absence. Opus 5 (max) now debuts at #1 — on 922 votes (1649–1692, ±21), an interval that still touches Qwen3.8 Max\'s below it (Qwen\'s reaches 1651) but sits fully clear of Fable 5\'s (1613–1639). Thinnest samples of any Elo board here, and the one board the community mirror does not cover: single-sourced from Arena\'s payload.',
  },
  {
    id: 'document',
    name: 'Document',
    blurb: 'Long-document reasoning and synthesis.',
    freshness: 'votes through 2026-07-26 · 0.32M votes · cutoff unchanged since July',
    rows: [
      { rank: 1,  model: 'claude-opus-5-high',    score: 1520, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6',       score: 1510, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-opus-4-6-high',  score: 1506, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-fable-5',        score: 1504, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-4-7',       score: 1498, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-opus-4-7-high',  score: 1497, vendor: 'anthropic' },
      { rank: 7,  model: 'gpt-5.5-high',          score: 1485, vendor: 'openai' },
      { rank: 8,  model: 'claude-sonnet-4-6',     score: 1483, vendor: 'anthropic' },
      { rank: 9,  model: 'gpt-5.5',               score: 1480, vendor: 'openai' },
      { rank: 10, model: 'gpt-5.6-terra-xhigh',   score: 1479, vendor: 'openai' },
    ],
    note: 'Arena has collected no new votes for this board since the previous capture — the cutoff is still 2026-07-26 — though it re-published the rows (gpt-5.6 entries added, -thinking display names renamed to -high). The July caveat therefore stands: Opus 5\'s #1 rests on 1,663 votes against rank 2\'s 37,271, a 22× sample gap, with fully overlapping intervals (1506–1535 vs 1504–1516). "The #1 document model" is a leaderboard fact, not yet a statistical one.',
  },
  {
    id: 'vision',
    name: 'Vision',
    blurb: 'Understanding images, charts, and screenshots.',
    freshness: 'votes through 2026-08-06 · 1.19M votes · 145 models',
    rows: [
      { rank: 1,  model: 'claude-fable-5',          score: 1315, vendor: 'anthropic' },
      { rank: 2,  model: 'qwen3.8-max',             score: 1301, vendor: 'alibaba' },
      { rank: 3,  model: 'claude-opus-4-7-high',    score: 1301, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-6-high',    score: 1300, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-4-7',         score: 1299, vendor: 'anthropic' },
      { rank: 6,  model: 'claude-opus-5-high',      score: 1297, vendor: 'anthropic' },
      { rank: 7,  model: 'gemini-3.6-flash-high',   score: 1295, vendor: 'google' },
      { rank: 8,  model: 'muse-spark',              score: 1294, vendor: 'meta' },
      { rank: 9,  model: 'claude-opus-4-6',         score: 1293, vendor: 'anthropic' },
      { rank: 10, model: 'muse-spark-1.2 (xHigh)',  score: 1290, vendor: 'meta' },
    ],
    note: 'Fable 5 holds #1 by 14 points, though its interval (1306–1324) still brushes Qwen3.8 Max\'s (1292–1310) — a debut #2 on 5,344 votes. Ranks 2–9 span eight Elo points: a pile-up, not a ladder. July\'s provisional #3, gemini-3.6-flash on 238 votes, has settled to #7 on 1,205.',
  },
  {
    id: 'search',
    name: 'Search',
    blurb: 'Grounded answers with live web retrieval.',
    freshness: 'votes through 2026-07-21 · 0.94M votes · unchanged since the July capture',
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
    note: 'Also not recomputed since July — the vote cutoff is still 2026-07-21, so Opus 5 still has no Search entry here while `claude-sonnet-5-search` sits at rank 16 (1188 ±6). Worth pairing with the API fact: the server-side `web_fetch` tool is not available on Opus 5, so a search agent on Opus 5 must bring its own fetcher.',
  },
  {
    id: 'text-to-image',
    name: 'Text-to-Image',
    blurb: 'Generate an image from a prompt.',
    freshness: 'votes through 2026-08-10 · 5.92M votes · 77 models',
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                                score: 1381, vendor: 'openai' },
      { rank: 2,  model: 'mai-image-2.6-preview',                               score: 1336, vendor: 'other' },
      { rank: 3,  model: 'grok-imagine-image-2.0 (low)',                        score: 1316, vendor: 'xai' },
      { rank: 4,  model: 'reve-2.1',                                            score: 1302, vendor: 'other' },
      { rank: 5,  model: 'muse-image',                                          score: 1282, vendor: 'meta' },
      { rank: 6,  model: 'reve-2.0',                                            score: 1270, vendor: 'other' },
      { rank: 7,  model: 'gemini-3.1-flash-image (nano-banana-2) [web-search]', score: 1264, vendor: 'google' },
      { rank: 8,  model: 'seedream-5.0-pro',                                    score: 1258, vendor: 'bytedance' },
      { rank: 9,  model: 'qwen-image-3.0-pro',                                  score: 1257, vendor: 'alibaba' },
      { rank: 10, model: 'mai-image-2.5',                                       score: 1256, vendor: 'other' },
    ],
    note: 'gpt-image-2 still leads every board it is on, but July\'s 83-point gap to #2 has narrowed to 45: Microsoft\'s mai-image-2.6-preview debuts second on 3,488 votes (±11), with grok-imagine-image-2.0 arriving at #3. Still the widest #1 lead of any board in this capture.',
  },
  {
    id: 'image-edit',
    name: 'Image Edit',
    blurb: 'Edit an existing image to instruction.',
    freshness: 'votes through 2026-08-07 · 28.8M votes · 53 models',
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                                score: 1463, vendor: 'openai' },
      { rank: 2,  model: 'grok-imagine-image-2.0 (low)',                        score: 1439, vendor: 'xai' },
      { rank: 3,  model: 'muse-image',                                          score: 1405, vendor: 'meta' },
      { rank: 4,  model: 'mai-image-2.5',                                       score: 1402, vendor: 'other' },
      { rank: 5,  model: 'seedream-5.0-pro',                                    score: 1393, vendor: 'bytedance' },
      { rank: 6,  model: 'chatgpt-image-latest-high-fidelity (20251216)',       score: 1390, vendor: 'openai' },
      { rank: 7,  model: 'grok-imagine-image-quality (20260519)',               score: 1390, vendor: 'xai' },
      { rank: 8,  model: 'gemini-3-pro-image-2k (nano-banana-pro)',             score: 1389, vendor: 'google' },
      { rank: 9,  model: 'gemini-3-pro-image-preview (nano-banana-pro)',        score: 1385, vendor: 'google' },
      { rank: 10, model: 'gemini-3.1-flash-image (nano-banana-2) [web-search]', score: 1385, vendor: 'google' },
    ],
    note: 'The highest-volume board Arena runs — 28.8M votes. grok-imagine-image-2.0 debuts at #2 on 5,931 votes; ranks 5–10 sit within eight points of each other on five- and six-figure vote counts, which is a genuinely settled pile-up rather than a thin-sample one.',
  },
  {
    id: 'text-to-video',
    name: 'Text-to-Video',
    blurb: 'Generate video from a prompt.',
    freshness: 'votes through 2026-08-10 · 0.61M votes · 44 models',
    rows: [
      { rank: 1,  model: 'gemini-omni-flash',          score: 1512, vendor: 'google' },
      { rank: 2,  model: 'flux-3-video',               score: 1496, vendor: 'other' },
      { rank: 3,  model: 'dreamina-seedance-2.0-720p', score: 1478, vendor: 'bytedance' },
      { rank: 4,  model: 'muse-video',                 score: 1457, vendor: 'meta' },
      { rank: 5,  model: 'minimax-h3',                 score: 1453, vendor: 'minimax' },
      { rank: 6,  model: 'happyhorse-1.0',             score: 1428, vendor: 'alibaba' },
      { rank: 7,  model: 'sora-2-pro',                 score: 1366, vendor: 'openai' },
      { rank: 8,  model: 'veo-3.1-audio',              score: 1364, vendor: 'google' },
      { rank: 9,  model: 'veo-3.1-audio-1080p',        score: 1363, vendor: 'google' },
      { rank: 10, model: 'veo-3.1-fast-audio',         score: 1362, vendor: 'google' },
    ],
    note: 'Black Forest Labs\' flux-3-video debuts at #2 on 1,288 votes (±17), an interval wide enough to touch ranks 1 and 3 both. MiniMax-H3 arrives at #5 — and leads both boards below.',
  },
  {
    id: 'image-to-video',
    name: 'Image-to-Video',
    blurb: 'Animate a still image into video.',
    freshness: 'votes through 2026-08-13 · 1.72M votes · 44 models',
    rows: [
      { rank: 1,  model: 'minimax-h3',                  score: 1489, vendor: 'minimax' },
      { rank: 2,  model: 'dreamina-seedance-2.0-720p',  score: 1479, vendor: 'bytedance' },
      { rank: 3,  model: 'gemini-omni-flash',           score: 1462, vendor: 'google' },
      { rank: 4,  model: 'grok-imagine-video-1.5-720p', score: 1460, vendor: 'xai' },
      { rank: 5,  model: 'flux-3-video-20260811',       score: 1453, vendor: 'other' },
      { rank: 6,  model: 'happyhorse-1.0',              score: 1441, vendor: 'alibaba' },
      { rank: 7,  model: 'wan2.7-i2v',                  score: 1426, vendor: 'alibaba' },
      { rank: 8,  model: 'grok-imagine-video-720p',     score: 1416, vendor: 'xai' },
      { rank: 9,  model: 'veo-3.1-audio',               score: 1397, vendor: 'google' },
      { rank: 10, model: 'veo-3.1-audio-1080p',         score: 1390, vendor: 'google' },
    ],
    note: 'July\'s stalest board (34 days) got recomputed and changed hands: MiniMax-H3 debuts at #1 (1481–1496) over Seedance (1471–1487) — overlapping intervals, so a lead rather than a verdict. Seedance\'s 104,445 votes against H3\'s 10,626 is the sample gap to hold while reading it.',
  },
  {
    id: 'video-to-video',
    name: 'Video-to-Video',
    blurb: 'Edit an existing clip to instruction.',
    freshness: 'votes through 2026-08-13 · 26K votes · complete board',
    rows: [
      { rank: 1, model: 'minimax-h3',                  score: 1390, vendor: 'minimax' },
      { rank: 2, model: 'dreamina-seedance-2.0-720p',  score: 1358, vendor: 'bytedance' },
      { rank: 3, model: 'gemini-omni-flash',           score: 1358, vendor: 'google' },
      { rank: 4, model: 'happyhorse-1.0',              score: 1307, vendor: 'alibaba' },
      { rank: 5, model: 'grok-imagine-video',          score: 1263, vendor: 'xai' },
      { rank: 6, model: 'kling-o3-pro',                score: 1255, vendor: 'other' },
      { rank: 7, model: 'kling-o1-pro',                score: 1200, vendor: 'other' },
      { rank: 8, model: 'runway-gen4-aleph',           score: 1183, vendor: 'other' },
    ],
    note: 'Renamed from Video Edit. This is the complete board, not a truncated top ten — eight models, up from July\'s seven: MiniMax-H3 joined and joined at #1, on 499 votes (±26). The smallest board Arena runs, at less than 0.1% of Image Edit\'s volume.',
  },
];

// ---------------------------------------------------------------------------
// Arena's Agent board — deliberately NOT a Category.
//
// It does not use Elo. Its metric is a "Net Improvement Score" expressed as a
// percentage, and it renders prettified display names rather than model slugs.
// Coercing it into the `score: number` Elo shape above would render 12.19 in a
// column that reads 1506 two tabs over — the exact category error this chapter
// exists to argue against. It gets its own shape and its own panel.

export type AgentRow = { rank: number; model: string; net: string; vendor: Vendor };

export const ARENA_AGENT_META = {
  published: '2026-08-13',
  sessions: '1,793,983 sessions · 49 models',
  metric: 'Net Improvement Score',
};

export const ARENA_AGENT: AgentRow[] = [
  { rank: 1,  model: 'Claude Opus 5 (High)',      net: '12.19% ± 1.45%', vendor: 'anthropic' },
  { rank: 2,  model: 'Claude Fable 5 (High)',     net: '12.01% ± 2.57%', vendor: 'anthropic' },
  { rank: 3,  model: 'Claude Opus 5 (Max)',       net: '11.95% ± 1.71%', vendor: 'anthropic' },
  { rank: 4,  model: 'GPT 5.6 Sol (xHigh)',       net: '10.86% ± 1.80%', vendor: 'openai' },
  { rank: 5,  model: 'Kimi K3 (Max)',             net: '10.60% ± 1.04%', vendor: 'moonshot' },
  { rank: 6,  model: 'Claude Opus 4.8 (High)',    net: '9.78% ± 1.78%',  vendor: 'anthropic' },
  { rank: 7,  model: 'GPT 5.5 (xHigh)',           net: '8.90% ± 1.03%',  vendor: 'openai' },
  { rank: 8,  model: 'Claude Opus 4.7 (High)',    net: '8.17% ± 1.43%',  vendor: 'anthropic' },
  { rank: 9,  model: 'GPT 5.5 (High)',            net: '7.73% ± 0.97%',  vendor: 'openai' },
  { rank: 10, model: 'Claude Opus 4.7',           net: '7.66% ± 1.45%',  vendor: 'anthropic' },
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
