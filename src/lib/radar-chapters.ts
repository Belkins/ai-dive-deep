// Which live Radar items to show on a chapter page ("On the Radar"). The pipeline
// (radar-pipeline issue #13) publishes `chapters: [slug]` only for chapters with a
// certifying receipt, never a probability; this module only filters and caps.
// Covered by tests/radar-chapters.test.mjs.

export interface RadarChapterItem {
  title: string;
  url: string;
  domain?: string;
  demoted?: boolean;
  chapters?: string[];
}

/** At most this many items per chapter page: a strip, not a second board. */
export const MAX_ITEMS = 4;

/** Board order is kept; demoted (non-AI) items never appear on a chapter page. */
export function radarItemsForChapter(items: RadarChapterItem[] | undefined, slug: string): RadarChapterItem[] {
  return (items ?? [])
    .filter((it) => Array.isArray(it.chapters) && it.chapters.includes(slug) && !it.demoted)
    .slice(0, MAX_ITEMS);
}
