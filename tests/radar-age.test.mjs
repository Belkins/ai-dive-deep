// Tests for src/lib/radar-age.ts — the rule behind the live Radar board's
// snapshot-age readout (RadarBoard.astro). The point of the feature is that the
// board STOPS claiming to be live once the pipeline goes quiet; these tests pin
// that switch with an injected clock, which no build-day grep of dist/ can do.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/radar-age.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { radarAge, STALE_H, AGE_TICK_MS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const GENERATED = Date.parse('2026-09-08T12:00:00Z');
const at = hours => radarAge(GENERATED, GENERATED + hours * 3_600_000);

test('a fresh snapshot reads in minutes and the board still says live', () => {
  const { text, stale, age, eyebrow } = at(0.5);
  assert.equal(text, '30 min');
  assert.equal(stale, false);
  assert.equal(age, ' · 30 min ago');
  assert.equal(eyebrow, 'Radar · live');
});

test('under an hour never rounds to zero — "1 min" is the floor', () => {
  // A snapshot seconds old must not read "0 min ago", which looks broken.
  assert.equal(at(0.001).text, '1 min');
  assert.equal(at(0).text, '1 min');
});

test('a clock behind the stamp is clamped, not rendered negative', () => {
  // The stamp is server-rendered; a visitor whose clock is slow would otherwise
  // see "-40 min ago" on a board that is in fact current.
  const { text, stale } = radarAge(GENERATED, GENERATED - 3_600_000);
  assert.equal(text, '1 min');
  assert.equal(stale, false);
});

test('hours floor down, so the reading never runs ahead of the stale switch', () => {
  // 1.49 h and 2.99 h are the halves a rounding formatter got wrong: it printed
  // "2 h"/"3 h" while the eyebrow still said live. Floor keeps the stamp and the
  // eyebrow telling the same story for the whole cycle.
  assert.equal(at(1.49).text, '1 h');
  assert.equal(at(2.99).text, '2 h');
  assert.equal(at(2.99).stale, false);
  assert.equal(at(2.99).eyebrow, 'Radar · live');
});

test('at exactly STALE_H the board stops claiming to be live', () => {
  // The whole point of the branch: with the pipeline throttled the page must
  // report its age instead of a pulse that says "live". Flip `>=` to `<` in the
  // lib and this is the only thing that goes red.
  const { text, stale, eyebrow } = at(STALE_H);
  assert.equal(text, '3 h');
  assert.equal(stale, true);
  assert.equal(eyebrow, 'Radar · last snapshot 3 h ago');
});

test('a long outage keeps counting in hours up to two days, then in days', () => {
  assert.equal(at(13.3).text, '13 h'); // the worst measured gap in the issue
  assert.equal(at(47.9).text, '47 h');
  assert.equal(at(48).text, '2 d');
  assert.equal(at(72).text, '3 d');
  assert.equal(at(48).eyebrow, 'Radar · last snapshot 2 d ago');
});

test('the eyebrow and the stamp readout are composed from one reading', () => {
  // Structural agreement: whatever `text` says, both surfaces quote it. A future
  // edit that formats one of them separately breaks this test, not the page.
  for (const hours of [0.25, 2, 5, 60]) {
    const { text, age, eyebrow } = at(hours);
    assert.ok(age.includes(text), `age readout must quote "${text}"`);
    if (at(hours).stale) assert.ok(eyebrow.includes(text), `eyebrow must quote "${text}"`);
  }
});

test('the constants are the documented 3 h threshold and a sub-minute refresh', () => {
  // The issue asks for a readout that refreshes at least once a minute and a
  // switch at 3 h; the fixtures above hardcode both, so pin them here.
  assert.equal(STALE_H, 3);
  assert.ok(AGE_TICK_MS <= 60_000, `AGE_TICK_MS must refresh at least once a minute, got ${AGE_TICK_MS}`);
});
