import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const sourceUrl = new URL('../src/lib/seo.ts', import.meta.url);
const source = readFileSync(sourceUrl, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const seo = await import(`data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString('base64')}`);

test('toPlainText removes Markdown without corrupting technical identifiers', () => {
  const input = 'Install at `~/.claude/skills/`, call `__init__`, `__enter__`, and `foo__bar__` from `<repo>/.mcp.json`, set `OPENAI_API_KEY`, and keep **bold**, _emphasis_, and ~~old~~ text.';
  assert.equal(
    seo.toPlainText(input),
    'Install at ~/.claude/skills/, call __init__, __enter__, and foo__bar__ from <repo>/.mcp.json, set OPENAI_API_KEY, and keep bold, emphasis, and old text.',
  );
});

test('toPlainText preserves invalid numeric entities instead of throwing', () => {
  assert.equal(seo.toPlainText('Keep &#1114112; intact'), 'Keep &#1114112; intact');
});

test('createSeoDescription sanitizes input and uses a fallback for empty values', () => {
  assert.equal(seo.createSeoDescription('**Useful** [guide](https://example.com)', 'Fallback'), 'Useful guide');
  assert.equal(seo.createSeoDescription('', 'A fallback description'), 'A fallback description');
});

test('truncateSeoDescription respects code-point boundaries and the maximum length', () => {
  const emoji = '\u{1F600}';
  const result = seo.truncateSeoDescription(`123456${emoji}789012345`, 10);
  assert.equal(Array.from(result).length, 10);
  assert.equal(result, `123456${emoji}...`);
  assert.equal(/[\uD800-\uDFFF]/u.test(result.replace(emoji, '')), false);
  assert.equal(seo.seoTextLength(emoji.repeat(100)), 100);
});

test('chapter descriptions prefer explicit copy and fall back from oversized TLDR text', () => {
  assert.equal(
    seo.createChapterSeoDescription({
      seoDescription: '**Operator-ready** guide',
      tldr: 'Ignored',
      title: 'Title',
      subtitle: 'Subtitle',
    }),
    'Operator-ready guide',
  );
  const fallback = seo.createChapterSeoDescription({
    tldr: 'Long '.repeat(50),
    title: 'Agent workflows',
    subtitle: 'A practical field guide',
  });
  assert.equal(fallback, 'Agent workflows. A practical field guide');
  assert.ok(Array.from(fallback).length <= seo.SEO_DESCRIPTION_MAX_LENGTH);
});
