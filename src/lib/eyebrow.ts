// Label derivation for homepage tile eyebrows (TileEyebrow.astro).
// Lives here rather than in the component so the expiry rule is testable
// with an injected clock — .astro frontmatter can't be imported by node:test.
// Covered by tests/eyebrow.test.mjs.

export const NEW_WINDOW_DAYS = 30;

export function eyebrowLabel(
  added: string,
  category: string,
  now: number = Date.now(),
): { text: string; isNew: boolean; when?: string } {
  const shipped = Date.parse(added + 'T00:00:00Z');
  if (Number.isNaN(shipped)) {
    // Fail the build, not the badge: a silent parse failure would render the
    // tile as merely not-new, which is invisible on the page that needs it.
    throw new Error(`eyebrowLabel: invalid added date "${added}" — expected ISO yyyy-mm-dd`);
  }
  const isNew = now - shipped < NEW_WINDOW_DAYS * 86_400_000;
  if (!isNew) return { text: category, isNew };
  const when = new Date(shipped).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  // `text` stays the full flat string (accessibility fallback + tests);
  // `when` lets the component render "New" as its own chip without re-deriving.
  return { text: `New · ${when} · ${category}`, isNew, when };
}
