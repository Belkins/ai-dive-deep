import assert from 'node:assert/strict';
import test from 'node:test';
import { pageTitle } from '../src/lib/page-title.mjs';

// Vlad's decision of 10 Nov 2026: the brand suffix only where the full title stays
// within 60 characters; past that, the authored title stands alone and unchanged.
const BRAND = "Vlad's Playbook";
const HOME = "Vlad's Playbook — The Agentic AI & Claude Code Field Manual";

test('the suffix is added at 59 and 60 characters and dropped at 61', () => {
  const at59 = pageTitle('Claude Code hooks: the eleven I use daily', BRAND, HOME);
  const at60 = pageTitle('Claude Code hooks: the eleven I use weekly', BRAND, HOME);
  const at61 = pageTitle('Claude Code hooks: the eleven I use monthly', BRAND, HOME);
  assert.equal(at59, "Claude Code hooks: the eleven I use daily — Vlad's Playbook");
  assert.equal([...at59].length, 59);
  assert.equal(at60, "Claude Code hooks: the eleven I use weekly — Vlad's Playbook");
  assert.equal([...at60].length, 60);
  assert.equal(at61, 'Claude Code hooks: the eleven I use monthly');
});

test('a long authored title is kept word for word, never cut', () => {
  const long = 'AI Agent Examples: 12 Real Agents I Run — Costs, Architecture, Failures (2026)';
  assert.equal(pageTitle(long, BRAND, HOME), long);
});

test('the home page keeps its full title', () => {
  assert.equal(pageTitle(BRAND, BRAND, HOME), HOME);
  assert.equal(pageTitle(HOME, BRAND, HOME), HOME);
});

test('characters are counted as code points, not UTF-16 units', () => {
  // 42 code points but 43 UTF-16 units (one emoji): 60 code points with the suffix
  // (61 UTF-16 units), so it keeps the suffix.
  const emoji = 'Claude Code hooks: the eleven I use 🔁 days';
  assert.equal([...emoji].length, 42);
  assert.equal(emoji.length, 43);
  assert.equal(pageTitle(emoji, BRAND, HOME), `${emoji} — Vlad's Playbook`);
});
