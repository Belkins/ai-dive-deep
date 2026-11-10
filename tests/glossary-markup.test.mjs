import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';

// Glossary definitions are inserted as HTML (set:html on /glossary/, innerHTML in the
// popover), so Markdown is never rendered there: the "Claude Code" and "Cron" entries
// once showed readers literal backticks around `claude` and `0 7 * * 1-5`. A code term
// is marked up with <code>, as the other entries already do.
const { glossary } = loadTs(new URL('../src/lib/glossary.ts', import.meta.url));

const MARKDOWN_MARKS = [
  ['a backtick', /`/],
  ['Markdown bold (**)', /\*\*/],
  ['a Markdown link [text](url)', /\[[^\]]+\]\([^)]+\)/],
];

test('no glossary entry shows raw Markdown marks', () => {
  for (const [key, entry] of Object.entries(glossary)) {
    for (const field of ['term', 'definition']) {
      for (const [name, re] of MARKDOWN_MARKS) {
        assert.equal(re.test(entry[field] ?? ''), false, `glossary["${key}"].${field} contains ${name}; use <code> or <a> markup`);
      }
    }
  }
});

test('the two fixed entries mark their code terms with <code>', () => {
  assert.match(glossary['Claude Code'].definition, /<code>claude<\/code> in your terminal\./);
  assert.match(glossary.Cron.definition, /<code>0 7 \* \* 1-5<\/code> = 7 AM weekdays\./);
});
