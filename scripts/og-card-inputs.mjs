// The exact inputs of a chapter's share card and their hash. Pure: no browser, no file system.
// scripts/build-og-cards.mjs writes the hashes to scripts/og-cards.json; tests/og-cards.test.mjs
// recomputes them from src/lib/chapters.ts, so a retitled chapter fails the test until the cards
// are rebuilt. Bump OG_TEMPLATE_VERSION whenever the card's design changes.
import { createHash } from 'node:crypto';

export const OG_TEMPLATE_VERSION = 'chapter-card-v1';
export const OG_CARDS_COMMAND = 'npm run og:cards -- --playwright <playwright-core folder>';

export function cardInputs(chapter, partLabel) {
  return {
    template: OG_TEMPLATE_VERSION,
    part: partLabel,
    title: chapter.title,
    subtitle: chapter.subtitle,
  };
}

export function cardHash(inputs) {
  const material = JSON.stringify([inputs.template, inputs.part, inputs.title, inputs.subtitle]);
  return createHash('sha256').update(material, 'utf8').digest('hex');
}
