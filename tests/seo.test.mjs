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

test('glossary JSON-LD descriptions are plain text while the set keeps every term', async () => {
  const { loadTs } = await import('./helpers/load-ts.mjs');
  const { glossary } = loadTs(new URL('../src/lib/glossary.ts', import.meta.url));
  const { PUBLISHER } = loadTs(new URL('../src/lib/author.ts', import.meta.url));
  const url = 'https://dive.vladyslavpodoliako.com/glossary/';
  const set = seo.createDefinedTermSet(`Glossary — ${PUBLISHER.name}`, url, Object.values(glossary));
  assert.equal(set.name, "Glossary — Vlad's Playbook");
  assert.equal(set.hasDefinedTerm.length, 105);
  const withMarkup = set.hasDefinedTerm.filter((t) => /<\/?[a-z][^>]*>/i.test(t.description));
  assert.deepEqual(withMarkup.map((t) => t.name), []);
  const abliteration = set.hasDefinedTerm.find((t) => t.name === 'Abliteration');
  assert.match(abliteration.description, /Produces a " heretic model "/);
  assert.equal(abliteration.url, `${url}#Abliteration`);
});

test('llms.txt coverage counts links and bare URLs, and catches a planted missing page', () => {
  const SITE = 'https://dive.vladyslavpodoliako.com';
  const text = [
    '## Site map',
    '',
    `- [Root](${SITE}/) — entry`,
    `- [Model](${SITE}/opus-5-archive/) — Spokes: ${SITE}/fable-5/pricing/, ${SITE}/opus-5/use-cases/.`,
    '',
    '## Chapters',
    '',
    `URL: ${SITE}/chapters/01-a/`,
    '',
  ].join('\n');
  const urls = [`${SITE}/`, `${SITE}/fable-5/pricing/`, `${SITE}/opus-5/use-cases/`, `${SITE}/chapters/01-a/`, `${SITE}/opus-5/`, `${SITE}/about/`];
  assert.deepEqual(seo.llmsMissingUrls(text, urls), [`${SITE}/opus-5/`, `${SITE}/about/`]);

  const next = seo.addMissingLlmsPages(text, [
    { url: `${SITE}/opus-5/`, title: 'Opus 5' },
    { url: `${SITE}/about/`, title: 'About', description: 'Who wrote this. Why. And how to keep reading.' },
  ]);
  assert.deepEqual(seo.llmsMissingUrls(next, urls), []);
  assert.ok(next.includes(`.\n- [Opus 5](${SITE}/opus-5/)\n- [About](${SITE}/about/) — Who wrote this. Why. And how to keep reading.\n\n## Chapters\n`));
  assert.throws(() => seo.addMissingLlmsPages('no headings', [{ url: `${SITE}/x/`, title: 'X' }]), /Chapters/);
});

test('readPageHead returns the page title without the brand suffix and the meta description verbatim', () => {
  const html = '<title>Vlad&#39;s actual setup — Vlad&#39;s Playbook</title><meta name="description" content="54 skills &amp; more. It&#39;s live.">';
  assert.deepEqual(seo.readPageHead(html, "Vlad's Playbook"), { title: "Vlad's actual setup", description: "54 skills & more. It's live." });
  assert.deepEqual(seo.readPageHead('<title>Only</title>', "Vlad's Playbook"), { title: 'Only', description: undefined });
});
