// Tests for src/lib/eyebrow.ts — the derivation behind TileEyebrow.astro.
// The point of the feature is that "New" EXPIRES; these tests pin that rule
// with an injected clock, which no build-day grep of dist/ can do.
import test from 'node:test';
import assert from 'node:assert/strict';
import { eyebrowLabel, NEW_WINDOW_DAYS } from '../src/lib/eyebrow.ts';

// Fixed clock: midnight UTC so day arithmetic below is exact.
const NOW = Date.parse('2026-08-17T00:00:00Z');

test('a page inside the window badges New and carries its ship date', () => {
  // 29 days old — one day short of the window. If this fails, fresh pages
  // lose their badge early and the label is lying in the other direction.
  const { text, isNew, when } = eyebrowLabel('2026-07-19', 'Method', NOW);
  assert.equal(isNew, true);
  assert.equal(text, 'New · Jul 19 · Method');
  // `when` feeds the chip layout; it must agree with the flat text or the
  // aria-label and the visible badge would state different dates.
  assert.equal(when, 'Jul 19');
});

test('an expired page returns no `when` — the chip must not render', () => {
  const { when } = eyebrowLabel('2026-06-10', 'Reference', NOW);
  assert.equal(when, undefined);
});

test('a page at the window boundary has expired', () => {
  // Exactly NEW_WINDOW_DAYS old — the window is exclusive. This is the
  // half a build-day grep can never observe: flip the comparison in the
  // lib and every tile badges forever while the build stays green.
  const { text, isNew } = eyebrowLabel('2026-07-18', 'Method', NOW);
  assert.equal(isNew, false);
  assert.equal(text, 'Method');
});

test('a long-expired page renders the bare category', () => {
  const { text, isNew } = eyebrowLabel('2026-06-10', 'Reference', NOW);
  assert.equal(isNew, false);
  assert.equal(text, 'Reference');
});

test('single-digit days format without padding, en-US short month, UTC', () => {
  // Pins the "Aug 3" shape the homepage shows — a locale or timezone drift
  // would silently reformat every badge.
  const { text } = eyebrowLabel('2026-08-03', 'Hardware', NOW);
  assert.equal(text, 'New · Aug 3 · Hardware');
});

test('a malformed added date throws instead of silently rendering not-new', () => {
  // Date.parse('2026-8-17T00:00:00Z') is NaN (unpadded month misses the ISO
  // fast path); NaN comparisons are false, so without the throw the badge
  // would be silently absent from exactly the tile that needs it.
  assert.throws(() => eyebrowLabel('2026-8-17', 'Method', NOW), /invalid added date/);
});

test('the window constant is the documented 30 days', () => {
  // The tests above hardcode dates derived from 30; keep the constant and
  // the fixtures from drifting apart silently.
  assert.equal(NEW_WINDOW_DAYS, 30);
});
