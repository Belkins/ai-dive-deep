import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the invoice page keeps public review access and labels metadata and body as unfinished', () => {
  const page = source('src/pages/the-bill.astro');
  assert.match(page, /<BaseLayout\b[^>]*\bnoindex>/);
  assert.match(page, /title="The Bill \(Draft\)"/);
  assert.match(page, /description="Unfinished[^"\n]*not a verified portfolio invoice/);
  assert.match(page, /public review only/);
  assert.match(page, /Not a verified invoice or evidence of savings/);
  assert.match(page, /<h1>The Bill\.<\/h1>/);
  assert.doesNotMatch(page, /Astro\.redirect|not yet public|What follows is a real receipt|Here's the actual receipt/);
});

test('published guides no longer present unfinished invoice claims as measured evidence', () => {
  const comparison = source('src/pages/claude-code-vs-codex.astro');
  assert.doesNotMatch(comparison, /three receipts|1 to 2 million tokens per landed fix|30 round-trips of context/);
  assert.match(comparison, /two first-person usage accounts/);
  const pricing = source('src/pages/fable-5/pricing.astro');
  assert.doesNotMatch(pricing, /live invoice math|live read-ratio numbers/);
  const practices = source('src/pages/claude-code-best-practices.astro');
  assert.doesNotMatch(practices, /Full math and the live numbers/);
  assert.match(practices, /\/chapters\/29-cost-economics\/#the-price-of-a-model-is-not-the-price-of-a-task/);
  assert.match(source('src/content/chapters/29-cost-economics.mdx'), /## The price of a model is not the price of a task/);
});
