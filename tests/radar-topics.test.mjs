// Tests for src/lib/radar-topics.ts — the chip list behind the Radar board filter. Chips must
// exist only for topics the payload actually carries (an old archive renders none), in a fixed
// order, and never for a label the site does not know.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/radar-topics.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { topicChips, TOPIC_LABELS } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('chips count the topics present, in the fixed order', () => {
  const items = [{ topic: 'tooling_or_framework' }, { topic: 'model_release' }, { topic: 'tooling_or_framework' }, {}];
  assert.deepEqual(topicChips(items), [
    { topic: 'model_release', label: 'Models', count: 1 },
    { topic: 'tooling_or_framework', label: 'Tools', count: 2 },
  ]);
});

test('a payload without topics (older archives, pipeline off) yields no chips', () => {
  assert.deepEqual(topicChips([{}, {}]), []);
  assert.deepEqual(topicChips(undefined), []);
});

test('an unknown label never becomes a chip', () => {
  assert.deepEqual(topicChips([{ topic: 'gossip' }]), []);
});

test('the seven pipeline labels all have chip text', () => {
  assert.deepEqual(Object.keys(TOPIC_LABELS), ['model_release', 'research_paper', 'tooling_or_framework', 'infrastructure_or_hardware', 'policy_or_safety', 'business_or_market', 'operator_practice']);
});
