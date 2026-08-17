// Tests for src/lib/aa-rank.ts — the ranking behind ArtificialAnalysisPanel.
// These pin the two relationships the rendered page cannot witness (see the
// lib's header): on today's data the Intelligence and Agentic leaders are the
// same model, so a selector that quietly picks by the wrong metric renders an
// identical page — until the first capture where the boards diverge.
import test from 'node:test';
import assert from 'node:assert/strict';
import { rankBy, agenticLeader } from '../src/lib/aa-rank.ts';

// Fixture deliberately shaped so broken selectors give different answers:
// alpha leads intelligence but is UNSCORED on agentic and sits at the array
// head (a stable no-op sort would leave it first); beta leads agentic.
const MODELS = [
  { model: 'alpha', intelligence: 90, costPerTaskUsd: 2.0 },
  { model: 'beta', intelligence: 50, agentic: 80, costPerTaskUsd: 3.0 },
  { model: 'gamma', intelligence: 60, agentic: 70, costPerTaskUsd: 0.5 },
];

test('agenticLeader picks the top agentic score, ignoring unscored models', () => {
  // If the selector fell back to intelligence (or skipped the filter), alpha
  // would win and the panel's callout would publish a false leader.
  assert.equal(agenticLeader(MODELS).model, 'beta');
});

test('a missing metric sorts last when higher is better', () => {
  const ranked = rankBy(MODELS, (m) => m.agentic, true);
  assert.deepEqual(ranked.map((r) => r.m.model), ['beta', 'gamma', 'alpha']);
});

test('a missing metric sorts last when lower is better too', () => {
  // The direction flip is the trap: a naive comparator sends undefined to the
  // TOP under one direction, rendering unscored models as ranks #1-#N with
  // "—" cells.
  const ranked = rankBy(MODELS, (m) => m.agentic, false);
  assert.deepEqual(ranked.map((r) => r.m.model), ['gamma', 'beta', 'alpha']);
});

test('present metrics rank correctly in both directions', () => {
  assert.deepEqual(rankBy(MODELS, (m) => m.costPerTaskUsd, false).map((r) => r.m.model), ['gamma', 'alpha', 'beta']);
  assert.deepEqual(rankBy(MODELS, (m) => m.intelligence, true).map((r) => r.m.model), ['alpha', 'gamma', 'beta']);
});
