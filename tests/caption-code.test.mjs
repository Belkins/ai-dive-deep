import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTs } from './helpers/load-ts.mjs';

// Screenshot captions are authored with `backticks`, and 10 of the built figcaptions
// showed the marks as literal text. The component renders each paired span as <code>.
const { splitCodeSpans, stripCodeMarks } = loadTs(new URL('../src/lib/caption-code.ts', import.meta.url));

test('paired backticks become code parts and no word changes', () => {
  const caption = 'A real `~/.claude/settings.json` permissions block from my main machine';
  assert.deepEqual(splitCodeSpans(caption), [
    { text: 'A real ', code: false },
    { text: '~/.claude/settings.json', code: true },
    { text: ' permissions block from my main machine', code: false },
  ]);
  assert.equal(stripCodeMarks(caption), 'A real ~/.claude/settings.json permissions block from my main machine');
});

test('a caption that opens with code and holds several spans keeps every span', () => {
  const parts = splitCodeSpans('`claude` running with CLAUDE.md visible and `/mcp` showing your server.');
  assert.deepEqual(parts.filter((p) => p.code).map((p) => p.text), ['claude', '/mcp']);
  assert.equal(parts.map((p) => p.text).join(''), 'claude running with CLAUDE.md visible and /mcp showing your server.');
});

test('a caption without backticks, or with a lone one, is left as written', () => {
  assert.deepEqual(splitCodeSpans('Emberling, alive on the desktop'), [{ text: 'Emberling, alive on the desktop', code: false }]);
  assert.deepEqual(splitCodeSpans('one ` mark'), [{ text: 'one ` mark', code: false }]);
});
