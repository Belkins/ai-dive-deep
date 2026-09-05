// Arena (formerly LMArena) leaderboard snapshot — a hand-verified static mirror
// of the public boards. The live page blocks iframe embedding and Arena ships no
// machine-readable public API, so this file is the one source of truth; edit it
// and the widget re-renders.
//
// Capture: 2026-09-05. All eleven Elo boards and the overall Agent board were
// retrieved from their public arena.ai URLs and their embedded JSON parsed.
// Elo rows retain Arena's rank and display name; scores are Math.round(rating).
// Each `source` retains the exact published cutoff, counts and snapshot id,
// separately from our capture date. Text and Vision use Arena's default
// style-controlled overall boards; the other nine use raw overall boards.
// Ten Elo boards plus Agent's top ten were corroborated against the community
// mirror's data/2026-09-05/: ranks, names, scores and vote/session counts match.
// Image-to-Code is still single-sourced. Arena is always the primary citation.
//
// THE BOARDS DO NOT SHARE A DATE. Arena recomputes each board on its own
// cadence. Ten Elo cutoffs advanced since August; Document's published cutoff
// is still 2026-07-26 and its displayed rows are unchanged. No board failed
// retrieval. The current cutoff spread is 40 days (2026-07-26 to 2026-09-04).
// Each category's visible `freshness` is the source cutoff, not today's date.
//
// New-model availability was checked across ALL published entries, not just
// the displayed top rows: claude-fable-5.1-max ranks only on Text (#3, 1504)
// and Code (#1, 1763). No GPT-6 Astra variant has a published ranking on these
// eleven overall Elo boards or overall Agent. Both families appear in Arena's
// shared model catalog; catalog presence is not a scored leaderboard entry.
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

export type ArenaSource = {
  url: string;
  snapshotId: string;
  captured: string;
  voteCutoffISOString: string;
  totalVotes: number;
  totalModels: number;
};

export type Category = {
  id: string;
  name: string;
  blurb: string;
  freshness: string;
  source: ArenaSource;
  rows: Row[];
  // Rendered under the board when the rows carry a caveat a reader would
  // otherwise miss — thin vote samples, display defects, absent models.
  note?: string;
};

export const LMARENA_SNAPSHOT = '2026-09-05';
export const LMARENA_LIVE = 'https://arena.ai/leaderboard';
export const LMARENA_MIRROR = 'https://github.com/oolong-tea-2026/arena-ai-leaderboards/tree/main/data/2026-09-05';

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

// Effort suffixes and harness parentheticals are load-bearing. Fable 5.1's
// `max` result is not a result for `high` or the default API configuration.
// Opus 5 high/max and Sol's `(codex-harness)` remain distinct competitors.
// Board intervals in notes are rounded endpoints from Arena's rating bounds;
// overlapping intervals do not establish a statistically resolved winner.
export const LMARENA: Category[] = [
  {
    id: 'text',
    name: 'Text',
    blurb: 'The headline board — head-to-head chat votes.',
    freshness: 'votes through 2026-09-02 · 8.00M votes · 400 models',
    source: {
      url: 'https://arena.ai/leaderboard/text',
      snapshotId: 'leaderboard-sets/public/leaderboards/text-overall-style_control/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-09-02T21:00:00.000Z',
      totalVotes: 7999020,
      totalModels: 400,
    },
    rows: [
      { rank: 1,  model: 'claude-fable-5',          score: 1507, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-6-high',    score: 1505, vendor: 'anthropic' },
      { rank: 3,  model: 'claude-fable-5.1-max',    score: 1504, vendor: 'anthropic' },
      { rank: 4,  model: 'claude-opus-4-7-high',    score: 1502, vendor: 'anthropic' },
      { rank: 5,  model: 'muse-spark-1.2 (xHigh)',  score: 1499, vendor: 'meta' },
      { rank: 6,  model: 'claude-opus-4-6',         score: 1498, vendor: 'anthropic' },
      { rank: 7,  model: 'claude-opus-4-7',         score: 1494, vendor: 'anthropic' },
      { rank: 8,  model: 'gemini-3.8-flash-high',   score: 1494, vendor: 'google' },
      { rank: 9,  model: 'claude-opus-5-high',      score: 1493, vendor: 'anthropic' },
      { rank: 10, model: 'muse-spark-1.1',          score: 1492, vendor: 'meta' },
      { rank: 11, model: 'gemini-3.7-flash-high',   score: 1491, vendor: 'google' },
      { rank: 12, model: 'kimi-k3-max',             score: 1489, vendor: 'moonshot' },
    ],
    note: 'Style-controlled overall board. Fable 5.1 enters at #3 as claude-fable-5.1-max: 1504 on 2,906 votes, with a 1493–1515 interval that overlaps Fable 5 at #1 (1502–1512). This is a max-effort result, not a generic Fable 5.1 score. Gemini 3.8 Flash and 3.7 Flash carry Arena\'s Preliminary flag. No OpenAI model is in the top 12; GPT-6 Astra is catalog-listed but has no published row on this board.',
  },
  {
    id: 'code',
    name: 'Code',
    blurb: 'Build a working web app from a prompt.',
    freshness: 'votes through 2026-09-04 · 0.65M votes · 125 models',
    source: {
      url: 'https://arena.ai/leaderboard/code',
      snapshotId: 'leaderboard-sets/public/leaderboards/webdev-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-09-04T17:00:00.000Z',
      totalVotes: 648157,
      totalModels: 125,
    },
    rows: [
      { rank: 1,  model: 'claude-fable-5.1-max',               score: 1763, vendor: 'anthropic' },
      { rank: 2,  model: 'qwen3.8-max-0902',                   score: 1689, vendor: 'alibaba' },
      { rank: 3,  model: 'claude-opus-5-max',                  score: 1687, vendor: 'anthropic' },
      { rank: 4,  model: 'kimi-k3-max',                        score: 1674, vendor: 'moonshot' },
      { rank: 5,  model: 'qwen3.8-max',                        score: 1670, vendor: 'alibaba' },
      { rank: 6,  model: 'claude-opus-5-high',                 score: 1662, vendor: 'anthropic' },
      { rank: 7,  model: 'claude-fable-5',                     score: 1629, vendor: 'anthropic' },
      { rank: 8,  model: 'grok-4.6-high',                      score: 1625, vendor: 'xai' },
      { rank: 9,  model: 'qwen3.8-flash-next',                 score: 1625, vendor: 'alibaba' },
      { rank: 10, model: 'hy4-preview',                        score: 1623, vendor: 'other' },
      { rank: 11, model: 'muse-spark-1.3 (xHigh)',             score: 1618, vendor: 'meta' },
      { rank: 12, model: 'gpt-5.6-sol-xhigh (codex-harness)',  score: 1618, vendor: 'openai' },
    ],
    note: 'The payload still calls this board webdev. Fable 5.1 at max leads at 1763 on 2,227 votes (1746–1779), above #2 Qwen3.8 Max 0902 at 1689 (1672–1706). The intervals do not overlap, but this is web-app preference evidence, not repository-resolution or general-agent evidence. Arena marks the Qwen rows at #2, #5 and #9 and hy4-preview at #10 as Preliminary. Sol retains its xhigh effort and codex-harness qualifier. Astra has no published row.',
  },
  {
    id: 'image-to-code',
    name: 'Image-to-Code',
    blurb: 'Turn a screenshot into a working front-end.',
    freshness: 'votes through 2026-08-25 · 110K votes · 44 models · single-sourced',
    source: {
      url: 'https://arena.ai/leaderboard/image-to-code',
      snapshotId: 'leaderboard-sets/public/leaderboards/image_to_webdev-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-08-25T00:00:00.000Z',
      totalVotes: 110117,
      totalModels: 44,
    },
    rows: [
      { rank: 1,  model: 'claude-opus-5-max',                  score: 1664, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-fable-5',                     score: 1623, vendor: 'anthropic' },
      { rank: 3,  model: 'qwen3.8-max',                        score: 1618, vendor: 'alibaba' },
      { rank: 4,  model: 'gpt-5.6-sol-xhigh (codex-harness)',  score: 1606, vendor: 'openai' },
      { rank: 5,  model: 'claude-opus-4-7-high',               score: 1576, vendor: 'anthropic' },
      { rank: 6,  model: 'grok-4.5',                           score: 1574, vendor: 'xai' },
      { rank: 7,  model: 'qwen3.8-27b',                        score: 1574, vendor: 'alibaba' },
      { rank: 8,  model: 'kimi-k3-max',                        score: 1573, vendor: 'moonshot' },
      { rank: 9,  model: 'claude-opus-4-7',                    score: 1564, vendor: 'anthropic' },
      { rank: 10, model: 'gemini-3.6-flash-high',              score: 1544, vendor: 'google' },
    ],
    note: 'Single-sourced from Arena\'s image_to_webdev payload. Opus 5 at max leads on 1,765 votes (1649–1680), clear of Fable 5\'s 1611–1635 interval. Qwen3.8 Max at #3 carries Arena\'s Preliminary flag. This board still has relatively thin samples and an August 25 cutoff. Neither Fable 5.1 nor Astra has a published row; do not transfer their Text or Code results here.',
  },
  {
    id: 'document',
    name: 'Document',
    blurb: 'Long-document reasoning and synthesis.',
    freshness: 'votes through 2026-07-26 · 0.32M votes · 39 models · cutoff unchanged since July',
    source: {
      url: 'https://arena.ai/leaderboard/document',
      snapshotId: 'leaderboard-sets/public/leaderboards/document-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-07-26T18:00:00.000Z',
      totalVotes: 322650,
      totalModels: 39,
    },
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
    note: 'Rechecked September 5: Arena still publishes the July 26 cutoff and the same displayed rows. This does not establish that no new votes have been collected. Opus 5 high leads on 1,663 votes versus #2\'s 37,271, with overlapping intervals (1505–1535 vs 1504–1516). Neither Fable 5.1 nor Astra has a published row. This remains a July result, not a September document evaluation.',
  },
  {
    id: 'vision',
    name: 'Vision',
    blurb: 'Understanding images, charts, and screenshots.',
    freshness: 'votes through 2026-08-27 · 1.26M votes · 148 models',
    source: {
      url: 'https://arena.ai/leaderboard/vision',
      snapshotId: 'leaderboard-sets/public/leaderboards/vision-overall-style_control/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-08-27T13:00:00.000Z',
      totalVotes: 1258468,
      totalModels: 148,
    },
    rows: [
      { rank: 1,  model: 'claude-fable-5',          score: 1313, vendor: 'anthropic' },
      { rank: 2,  model: 'claude-opus-4-7-high',    score: 1301, vendor: 'anthropic' },
      { rank: 3,  model: 'qwen3.8-max',             score: 1300, vendor: 'alibaba' },
      { rank: 4,  model: 'claude-opus-4-7',         score: 1299, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-opus-4-6-high',    score: 1299, vendor: 'anthropic' },
      { rank: 6,  model: 'muse-spark',              score: 1294, vendor: 'meta' },
      { rank: 7,  model: 'claude-opus-4-6',         score: 1293, vendor: 'anthropic' },
      { rank: 8,  model: 'muse-spark-1.2 (xHigh)',  score: 1292, vendor: 'meta' },
      { rank: 9,  model: 'claude-opus-5-high',      score: 1290, vendor: 'anthropic' },
      { rank: 10, model: 'gemini-3-pro',            score: 1289, vendor: 'google' },
    ],
    note: 'Style-controlled overall board. Fable 5 holds #1 at 1313 on 10,002 votes, but its 1305–1322 interval overlaps #2 Opus 4.7 high\'s 1295–1308. Ranks 2–10 span 12 Elo points. The published cutoff is August 27; neither Fable 5.1 nor Astra has a scored row, even though both families appear in Arena\'s shared catalog.',
  },
  {
    id: 'search',
    name: 'Search',
    blurb: 'Grounded answers with live web retrieval.',
    freshness: 'votes through 2026-08-24 · 1.11M votes · 34 models',
    source: {
      url: 'https://arena.ai/leaderboard/search',
      snapshotId: 'leaderboard-sets/public/leaderboards/search-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-08-24T20:00:00.000Z',
      totalVotes: 1110523,
      totalModels: 34,
    },
    rows: [
      { rank: 1,  model: 'gpt-5.6-sol-xhigh',         score: 1257, vendor: 'openai' },
      { rank: 2,  model: 'claude-opus-4-6-search',    score: 1253, vendor: 'anthropic' },
      { rank: 3,  model: 'gpt-5.5-search',            score: 1242, vendor: 'openai' },
      { rank: 4,  model: 'claude-opus-4-7',           score: 1233, vendor: 'anthropic' },
      { rank: 5,  model: 'claude-fable-5',            score: 1230, vendor: 'anthropic' },
      { rank: 6,  model: 'ernie-5.1',                 score: 1227, vendor: 'baidu' },
      { rank: 7,  model: 'claude-sonnet-4-6-search',  score: 1221, vendor: 'anthropic' },
      { rank: 8,  model: 'grok-4.5',                  score: 1213, vendor: 'xai' },
      { rank: 9,  model: 'gemini-3.1-pro-grounding',  score: 1210, vendor: 'google' },
      { rank: 10, model: 'gemini-3-pro-grounding',    score: 1207, vendor: 'google' },
    ],
    note: 'This board has finally advanced beyond July. GPT-5.6 Sol xhigh leads at 1257 on 29,663 votes (1250–1265), but overlaps #2 Opus 4.6 Search at 1253 (1248–1258). Arena\'s display name omits -search from Sol; the published model key is gpt-5.6-sol-search-xhigh. Neither Astra nor Fable 5.1 has a published row. Search scores should not be substituted for ordinary chat scores.',
  },
  {
    id: 'text-to-image',
    name: 'Text-to-Image',
    blurb: 'Generate an image from a prompt.',
    freshness: 'votes through 2026-09-04 · 6.12M votes · 76 models',
    source: {
      url: 'https://arena.ai/leaderboard/text-to-image',
      snapshotId: 'leaderboard-sets/public/leaderboards/text_to_image-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-09-04T12:00:00.000Z',
      totalVotes: 6120042,
      totalModels: 76,
    },
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                                 score: 1382, vendor: 'openai' },
      { rank: 2,  model: 'mai-image-2.6',                                        score: 1332, vendor: 'other' },
      { rank: 3,  model: 'grok-imagine-image-2.0 (low)',                         score: 1315, vendor: 'xai' },
      { rank: 4,  model: 'reve-2.1',                                             score: 1301, vendor: 'other' },
      { rank: 5,  model: 'muse-image',                                           score: 1279, vendor: 'meta' },
      { rank: 6,  model: 'reve-2.0',                                             score: 1270, vendor: 'other' },
      { rank: 7,  model: 'gemini-3.1-flash-image (nano-banana-2) [web-search]',  score: 1261, vendor: 'google' },
      { rank: 8,  model: 'seedream-5.0-pro',                                     score: 1258, vendor: 'bytedance' },
      { rank: 9,  model: 'qwen-image-3.0-pro',                                   score: 1254, vendor: 'alibaba' },
      { rank: 10, model: 'mai-image-2.5',                                        score: 1254, vendor: 'other' },
    ],
    note: 'gpt-image-2 (medium) leads at 1382, 50 points above Microsoft\'s mai-image-2.6 at 1332. The latter is no longer labelled -preview and has 10,086 votes (1325–1339), well below the leader\'s 1377–1386 interval. Grok Imagine Image 2.0 (low) remains Preliminary on 2,682 votes. Preserve the medium/low and web-search configuration labels when comparing.',
  },
  {
    id: 'image-edit',
    name: 'Image Edit',
    blurb: 'Edit an existing image to instruction.',
    freshness: 'votes through 2026-09-03 · 29.43M votes · 53 models',
    source: {
      url: 'https://arena.ai/leaderboard/image-edit',
      snapshotId: 'leaderboard-sets/public/leaderboards/image_edit-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-09-03T22:00:00.000Z',
      totalVotes: 29426679,
      totalModels: 53,
    },
    rows: [
      { rank: 1,  model: 'gpt-image-2 (medium)',                                 score: 1461, vendor: 'openai' },
      { rank: 2,  model: 'mai-image-2.6',                                        score: 1439, vendor: 'other' },
      { rank: 3,  model: 'grok-imagine-image-2.0 (low)',                         score: 1439, vendor: 'xai' },
      { rank: 4,  model: 'muse-image',                                           score: 1403, vendor: 'meta' },
      { rank: 5,  model: 'mai-image-2.5',                                        score: 1400, vendor: 'other' },
      { rank: 6,  model: 'seedream-5.0-pro',                                     score: 1394, vendor: 'bytedance' },
      { rank: 7,  model: 'chatgpt-image-latest-high-fidelity (20251216)',        score: 1390, vendor: 'openai' },
      { rank: 8,  model: 'grok-imagine-image-quality (20260519)',                score: 1390, vendor: 'xai' },
      { rank: 9,  model: 'gemini-3-pro-image-2k (nano-banana-pro)',              score: 1390, vendor: 'google' },
      { rank: 10, model: 'gemini-3.1-flash-image (nano-banana-2) [web-search]',  score: 1388, vendor: 'google' },
    ],
    note: '29.43M total votes. Microsoft\'s mai-image-2.6 moves to #2 on 5,086 votes, narrowly ahead of Grok Imagine Image 2.0 (low), which Arena still marks Preliminary. Both round to 1439 with overlapping intervals (1429–1448 and 1430–1447); their distinct published ranks must not be reconstructed from rounded scores. gpt-image-2 (medium) remains #1 at 1461.',
  },
  {
    id: 'text-to-video',
    name: 'Text-to-Video',
    blurb: 'Generate video from a prompt.',
    freshness: 'votes through 2026-09-04 · 0.67M votes · 47 models',
    source: {
      url: 'https://arena.ai/leaderboard/text-to-video',
      snapshotId: 'leaderboard-sets/public/leaderboards/text_to_video-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-09-04T16:00:00.000Z',
      totalVotes: 668045,
      totalModels: 47,
    },
    rows: [
      { rank: 1,  model: 'gemini-omni-1.1-flash',       score: 1515, vendor: 'google' },
      { rank: 2,  model: 'gemini-omni-flash',           score: 1511, vendor: 'google' },
      { rank: 3,  model: 'wan3.0',                      score: 1494, vendor: 'alibaba' },
      { rank: 4,  model: 'flux-3-video',                score: 1494, vendor: 'other' },
      { rank: 5,  model: 'dreamina-seedance-2.5-720p',  score: 1482, vendor: 'bytedance' },
      { rank: 6,  model: 'dreamina-seedance-2.0-720p',  score: 1479, vendor: 'bytedance' },
      { rank: 7,  model: 'minimax-h3',                  score: 1462, vendor: 'minimax' },
      { rank: 8,  model: 'muse-video',                  score: 1456, vendor: 'meta' },
      { rank: 9,  model: 'happyhorse-1.0',              score: 1427, vendor: 'alibaba' },
      { rank: 10, model: 'sora-2-pro',                  score: 1367, vendor: 'openai' },
    ],
    note: 'Gemini Omni 1.1 Flash enters at #1 on 1,777 votes (1499–1530), overlapping Gemini Omni Flash at #2 (1502–1521). Wan3.0 and Seedance 2.5 join at #3 and #5. Flux 3 Video at #4 remains Preliminary on 1,290 votes. The new #1 is a published preference lead, not a statistically isolated winner.',
  },
  {
    id: 'image-to-video',
    name: 'Image-to-Video',
    blurb: 'Animate a still image into video.',
    freshness: 'votes through 2026-09-02 · 1.91M votes · 47 models',
    source: {
      url: 'https://arena.ai/leaderboard/image-to-video',
      snapshotId: 'leaderboard-sets/public/leaderboards/image_to_video-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-09-02T20:00:00.000Z',
      totalVotes: 1906002,
      totalModels: 47,
    },
    rows: [
      { rank: 1,  model: 'minimax-h3',                   score: 1497, vendor: 'minimax' },
      { rank: 2,  model: 'gemini-omni-1.1-flash',        score: 1488, vendor: 'google' },
      { rank: 3,  model: 'wan3.0',                       score: 1481, vendor: 'alibaba' },
      { rank: 4,  model: 'dreamina-seedance-2.5-720p',   score: 1478, vendor: 'bytedance' },
      { rank: 5,  model: 'dreamina-seedance-2.0-720p',   score: 1477, vendor: 'bytedance' },
      { rank: 6,  model: 'gemini-omni-flash',            score: 1462, vendor: 'google' },
      { rank: 7,  model: 'grok-imagine-video-1.5-720p',  score: 1456, vendor: 'xai' },
      { rank: 8,  model: 'flux-3-video-20260811',        score: 1449, vendor: 'other' },
      { rank: 9,  model: 'happyhorse-1.0',               score: 1442, vendor: 'alibaba' },
      { rank: 10, model: 'wan2.7-i2v',                   score: 1428, vendor: 'alibaba' },
    ],
    note: 'MiniMax-H3 stays #1 at 1497 on 36,137 votes (1491–1503). New #2 Gemini Omni 1.1 Flash has 3,732 votes (1477–1499), with an overlapping interval; Wan3.0 at #3 has only 1,401 votes. Seedance 2.5 and 2.0 are separate rows at #4 and #5, not aliases.',
  },
  {
    id: 'video-to-video',
    name: 'Video-to-Video',
    blurb: 'Edit an existing clip to instruction.',
    freshness: 'votes through 2026-08-26 · 28K votes · 10 models · complete board',
    source: {
      url: 'https://arena.ai/leaderboard/video-to-video',
      snapshotId: 'leaderboard-sets/public/leaderboards/video_to_video-overall-raw/leaderboard-snapshots/latest',
      captured: '2026-09-05',
      voteCutoffISOString: '2026-08-26T18:00:00.000Z',
      totalVotes: 27930,
      totalModels: 10,
    },
    rows: [
      { rank: 1,  model: 'wan3.0',                      score: 1414, vendor: 'alibaba' },
      { rank: 2,  model: 'dreamina-seedance-2.5-720p',  score: 1410, vendor: 'bytedance' },
      { rank: 3,  model: 'minimax-h3',                  score: 1392, vendor: 'minimax' },
      { rank: 4,  model: 'gemini-omni-flash',           score: 1367, vendor: 'google' },
      { rank: 5,  model: 'dreamina-seedance-2.0-720p',  score: 1365, vendor: 'bytedance' },
      { rank: 6,  model: 'happyhorse-1.0',              score: 1307, vendor: 'alibaba' },
      { rank: 7,  model: 'grok-imagine-video',          score: 1258, vendor: 'xai' },
      { rank: 8,  model: 'kling-o3-pro',                score: 1255, vendor: 'other' },
      { rank: 9,  model: 'kling-o1-pro',                score: 1197, vendor: 'other' },
      { rank: 10, model: 'runway-gen4-aleph',           score: 1182, vendor: 'other' },
    ],
    note: 'The complete board now has ten models. Wan3.0 debuts #1 on 463 votes (1388–1440), Seedance 2.5 #2 on 429 (1383–1436), and MiniMax-H3 is #3 on 962 (1374–1411). All three intervals overlap. At 27,930 total votes this remains a small, thin-sample board, despite the apparent precision of its ranks.',
  },
];

// ---------------------------------------------------------------------------
// Arena's Agent board — deliberately NOT a Category.
//
// It does not use Elo. Its metric is a "Net Improvement Score" expressed as a
// percentage, and it renders prettified display names rather than model slugs.
// Coercing it into the `score: number` Elo shape above would render 13.74 in a
// column that reads 1507 two tabs over — the exact category error this chapter
// exists to argue against. It gets its own shape and its own panel.

export type AgentRow = { rank: number; model: string; net: string; vendor: Vendor };

export const ARENA_AGENT_META = {
  published: '2026-09-01',
  captured: '2026-09-05',
  lastUpdatedISOString: '2026-09-01T21:00:00.000Z',
  source: 'https://arena.ai/leaderboard/agent',
  totalSessions: 2188416,
  totalModels: 58,
  sessions: '2,188,416 sessions · 58 models',
  metric: 'Net Improvement Score',
  note: 'Overall Agent board, not its Code subcategory. Percentages are 100 × avgScore.value with 100 × avgScore.ci, not Elo or a task-success rate. Opus 5 high leads at 13.74% ± 1.80%, with an interval overlapping both Opus 5 max and Fable 5 high. Neither Fable 5.1 nor GPT-6 Astra appears among the 58 published rows; shared model-catalog entries are not ranked evidence.',
};

export const ARENA_AGENT: AgentRow[] = [
  { rank: 1,  model: 'Claude Opus 5 (High)',      net: '13.74% ± 1.80%', vendor: 'anthropic' },
  { rank: 2,  model: 'Claude Opus 5 (Max)',       net: '11.69% ± 2.01%', vendor: 'anthropic' },
  { rank: 3,  model: 'Claude Fable 5 (High)',     net: '10.61% ± 1.53%', vendor: 'anthropic' },
  { rank: 4,  model: 'GPT 5.6 Sol (xHigh)',       net: '9.49% ± 1.51%',  vendor: 'openai' },
  { rank: 5,  model: 'Claude Opus 4.8 (High)',    net: '9.22% ± 1.53%',  vendor: 'anthropic' },
  { rank: 6,  model: 'Kimi K3 (Max)',             net: '8.71% ± 0.66%',  vendor: 'moonshot' },
  { rank: 7,  model: 'GPT 5.5 (xHigh)',           net: '7.53% ± 1.08%',  vendor: 'openai' },
  { rank: 8,  model: 'Claude Sonnet 5 (High)',    net: '7.51% ± 2.11%',  vendor: 'anthropic' },
  { rank: 9,  model: 'Claude Opus 4.7 (High)',    net: '6.49% ± 1.42%',  vendor: 'anthropic' },
  { rank: 10, model: 'GLM 5.2 (Max)',            net: '6.23% ± 0.77%',  vendor: 'zhipu' },
];

// ---------------------------------------------------------------------------
// Lab-claimed agentic benchmarks — launch-deck numbers, NOT arena votes.
// Every figure traces to a dated entry in src/lib/research-notes.ts.
// Historical July evidence, deliberately not refreshed with the Arena capture.
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
