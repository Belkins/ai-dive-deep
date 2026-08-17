// Label derivation for homepage tile eyebrows (TileEyebrow.astro).
// Lives here rather than in the component so the expiry rule is testable
// with an injected clock — .astro frontmatter can't be imported by node:test.
// Covered by tests/eyebrow.test.mjs.

export const NEW_WINDOW_DAYS = 30;

export function eyebrowLabel(
  added: string,
  category: string,
  now: number = Date.now(),
): { text: string; isNew: boolean; tail?: string } {
  const shipped = Date.parse(added + 'T00:00:00Z');
  if (Number.isNaN(shipped)) {
    // Fail the build, not the badge: a silent parse failure would render the
    // tile as merely not-new, which is invisible on the page that needs it.
    throw new Error(`eyebrowLabel: invalid added date "${added}" — expected ISO yyyy-mm-dd`);
  }
  const isNew = now - shipped < NEW_WINDOW_DAYS * 86_400_000;
  if (!isNew) return { text: category, isNew };
  const when = new Date(shipped).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  // `tail` is what the component renders beside the chip; `text` is composed
  // FROM it so the flat string and the rendered badge cannot state different
  // dates — agreement is structural, not asserted.
  const tail = `${when} · ${category}`;
  return { text: `New · ${tail}`, isNew, tail };
}
