// Ranking helpers for ArtificialAnalysisPanel — extracted so the two
// relationships the render cannot witness are pinned by tests/aa-rank.test.mjs.
// Both feed published claims:
//   1. the Agentic-Index leader must be picked among models AA actually scores
//      there — today the Intelligence and Agentic leaders coincide, so a broken
//      selector renders identically and only a test can tell them apart;
//   2. a model missing the active metric must sort last under BOTH directions,
//      or unscored models would render as top ranks with "—" cells the first
//      time a reader clicks the Agentic pill.

export type Ranked<T> = { m: T; v: number | undefined };

export function rankBy<T>(
  items: T[],
  value: (item: T) => number | undefined,
  higherBetter: boolean,
): Ranked<T>[] {
  return items
    .map((m) => ({ m, v: value(m) }))
    .sort((a, b) => {
      if (a.v === undefined) return 1;
      if (b.v === undefined) return -1;
      return higherBetter ? b.v - a.v : a.v - b.v;
    });
}

export function agenticLeader<T extends { agentic?: number }>(models: T[]): T {
  return models.filter((m) => m.agentic !== undefined).sort((a, b) => b.agentic! - a.agentic!)[0];
}
