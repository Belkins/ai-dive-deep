import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(read('src/lib/chapters.ts'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { CHAPTERS, PARTS, SECTIONS, getNeighbors } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const additions = ['49-gpt-6-astra', '50-claude-fable-5-1'];

const { outputText: changelogJs } = ts.transpileModule(read('src/lib/changelog.ts'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { CHANGELOG } = await import(`data:text/javascript;base64,${Buffer.from(changelogJs).toString('base64')}`);
const { outputText: screenshotsJs } = ts.transpileModule(read('src/lib/screenshots.ts'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { SCREENSHOTS } = await import(`data:text/javascript;base64,${Buffer.from(screenshotsJs).toString('base64')}`);
const { outputText: glossaryJs } = ts.transpileModule(read('src/lib/glossary.ts'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { glossary } = await import(`data:text/javascript;base64,${Buffer.from(glossaryJs).toString('base64')}`);

test('every registered chapter has its file, its number, exactly one part and at least one section, in number order', () => {
  const numbers = CHAPTERS.map(chapter => chapter.number);
  assert.deepEqual(numbers, [...numbers].sort((a, b) => a - b), 'CHAPTERS must be sorted by number: prev/next navigation is derived from list order');
  assert.equal(new Set(numbers).size, numbers.length, 'chapter numbers must be unique');
  for (const chapter of CHAPTERS) {
    const content = read(`src/content/chapters/${chapter.slug}.mdx`);
    assert.match(content, new RegExp(`^number: ${chapter.number}$`, 'm'), `${chapter.slug}: frontmatter number`);
    assert.match(content, new RegExp(`^slug: ['"]?${chapter.slug}['"]?$`, 'm'), `${chapter.slug}: frontmatter slug`);
    assert.equal(PARTS.filter(part => part.slugs.includes(chapter.slug)).length, 1, `${chapter.slug}: exactly one part`);
    assert.ok(SECTIONS.some(section => section.slugs.includes(chapter.slug)), `${chapter.slug}: at least one section`);
  }
});

test('chapter 51 is wired: neighbours, the latest edition banner, both figures and every glossary key', () => {
  const slug = '51-jev-system-one';
  assert.equal(getNeighbors('50-claude-fable-5-1').next.slug, slug);
  assert.equal(getNeighbors(slug).prev.slug, '50-claude-fable-5-1');
  assert.equal(getNeighbors(slug).next, null);
  assert.equal(CHANGELOG[0].bannerHref, `/chapters/${slug}/`, 'the homepage banner must point at the newest chapter');
  assert.ok(CHANGELOG[0].bannerText, 'the latest edition must carry a banner');
  const content = read(`src/content/chapters/${slug}.mdx`);
  for (const id of [...content.matchAll(/id="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(id in SCREENSHOTS, `figure id ${id} must have a file in public/screens/`);
  }
  for (const term of [...content.matchAll(/<GlossaryTerm term="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(term in glossary, `glossary term "${term}" must be a key in glossary.ts`);
  }
});

test('model chapters register once with matching content, topic and narrative navigation', () => {
  for (const [index, slug] of additions.entries()) {
    const entries = CHAPTERS.filter(chapter => chapter.slug === slug);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].number, 49 + index);
    const content = read(`src/content/chapters/${slug}.mdx`);
    assert.match(content, new RegExp(`^number: ${49 + index}$`, 'm'));
    assert.match(content, new RegExp(`^slug: ['"]?${slug}['"]?$`, 'm'));
    assert.doesNotMatch(content, /^draft: true$/m);
    assert.equal(PARTS.filter(part => part.slugs.includes(slug)).length, 1);
    assert.ok(SECTIONS.some(section => section.slugs.includes(slug)));
  }
  assert.equal(getNeighbors('48-traffic-graph-that-lies').next.slug, additions[0]);
  assert.equal(getNeighbors(additions[0]).next.slug, additions[1]);
  assert.equal(getNeighbors(additions[1]).prev.slug, additions[0]);
});

test('model guides have direct discovery and contextual links, not just sitemap exposure', () => {
  for (const slug of additions) {
    const href = `/chapters/${slug}/`;
    for (const file of ['src/pages/index.astro', 'src/pages/tier-list.astro',
      'src/content/chapters/25-evals-or-hope.mdx', 'src/content/chapters/29-cost-economics.mdx',
      'src/content/chapters/35-codex-and-cc.mdx']) {
      assert.ok(read(file).includes(href), `${file} must link to ${href}`);
    }
    const other = additions.find(item => item !== slug);
    const content = read(`src/content/chapters/${slug}.mdx`);
    assert.ok(content.includes(`/chapters/${other}/`));
    assert.ok(content.includes('/workflow-planner/'));
    assert.ok(content.includes('/tier-list/'));
  }
});

test('published research guides retain a visible evidence boundary and no completed trial checklist', () => {
  for (const slug of additions) {
    const content = read(`src/content/chapters/${slug}.mdx`);
    assert.match(content, /2026-09-05/);
    assert.match(content, /(?:not (?:been )?run|unrun|not a hands-on|not (?:our|a) benchmark)/i);
    assert.doesNotMatch(content, /^\s*- \[[xX]\]/m, 'proposed exercises must not imply passed tests');
    assert.doesNotMatch(content, /ScreenshotPlaceholder|TODO|TBD/);
  }
});

test('Astra examples preserve caching assumptions and an ingestion-safe prompt', () => {
  const content = read('src/content/chapters/49-gpt-6-astra.mdx');
  assert.match(content, /prompt_cache_options.mode: "explicit"/);
  assert.match(content, /no cache breakpoints/);
  assert.match(content, /\$3\.625/);
  assert.match(content, /\$8\.25/);
  assert.match(content, /^> Work only in the disposable fixture\./m);
  assert.match(content, /Do not describe an unexecuted check as passing\./);
  assert.doesNotMatch(content, /<Code\b/);
});
