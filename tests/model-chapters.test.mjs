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

test('chapter 51 is wired: neighbours, both figures and every glossary key', () => {
  const slug = '51-jev-system-one';
  assert.equal(getNeighbors('50-claude-fable-5-1').next.slug, slug);
  assert.equal(getNeighbors(slug).prev.slug, '50-claude-fable-5-1');
  assert.equal(getNeighbors(slug).next.slug, '52-what-agents-cant-see');
  const content = read(`src/content/chapters/${slug}.mdx`);
  for (const id of [...content.matchAll(/id="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(id in SCREENSHOTS, `figure id ${id} must have a file in public/screens/`);
  }
  for (const term of [...content.matchAll(/<GlossaryTerm term="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(term in glossary, `glossary term "${term}" must be a key in glossary.ts`);
  }
});

test('chapter 52 is wired: neighbours, every figure and every glossary key', () => {
  const slug = '52-what-agents-cant-see';
  assert.equal(getNeighbors(slug).prev.slug, '51-jev-system-one');
  assert.equal(getNeighbors(slug).next.slug, '53-first-real-caller');
  const content = read(`src/content/chapters/${slug}.mdx`);
  for (const id of [...content.matchAll(/id="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(id in SCREENSHOTS, `figure id ${id} must have a file in public/screens/`);
  }
  for (const term of [...content.matchAll(/<GlossaryTerm term="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(term in glossary, `glossary term "${term}" must be a key in glossary.ts`);
  }
});

test('chapter 53 is wired: neighbours, every figure and every glossary key', () => {
  const slug = '53-first-real-caller';
  assert.equal(getNeighbors(slug).prev.slug, '52-what-agents-cant-see');
  assert.equal(getNeighbors(slug).next.slug, '54-claude-opus-5-5');
  assert.equal(PARTS.find(part => part.slugs.includes(slug)).key, 'V', 'the chapter hero shows the Part V pill');
  assert.ok(SECTIONS.find(section => section.key === 'building').slugs.includes(slug), 'listed under Building Products');
  const content = read(`src/content/chapters/${slug}.mdx`);
  const ids = [...content.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  assert.ok(ids.length > 0, 'the chapter must carry its figures');
  for (const id of ids) {
    assert.ok(id in SCREENSHOTS, `figure id ${id} must have a file in public/screens/`);
  }
  for (const term of [...content.matchAll(/<GlossaryTerm term="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(term in glossary, `glossary term "${term}" must be a key in glossary.ts`);
  }
});

const guides55 = ['54-claude-opus-5-5', '55-claude-sonnet-5-5'];

test('chapters 54 and 55 are wired: neighbours, Part VI, Team + Tier, figures and glossary keys', () => {
  assert.equal(getNeighbors(guides55[0]).prev.slug, '53-first-real-caller');
  assert.equal(getNeighbors(guides55[0]).next.slug, guides55[1]);
  assert.equal(getNeighbors(guides55[1]).next.slug, '56-skill-leaderboard');
  for (const slug of guides55) {
    assert.equal(PARTS.find(part => part.slugs.includes(slug)).key, 'VI', `${slug}: sits with the other model guides in Part VI`);
    assert.ok(SECTIONS.find(section => section.key === 'resources').slugs.includes(slug), `${slug}: listed under Team + Tier`);
    const content = read(`src/content/chapters/${slug}.mdx`);
    const ids = [...content.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
    assert.ok(ids.length > 0, `${slug}: the measured chapter must carry its chart`);
    for (const id of ids) {
      assert.ok(id in SCREENSHOTS, `figure id ${id} must have a file in public/screens/`);
    }
    for (const term of [...content.matchAll(/<GlossaryTerm term="([^"]+)"/g)].map(m => m[1])) {
      assert.ok(term in glossary, `glossary term "${term}" must be a key in glossary.ts`);
    }
  }
});

test('chapter 56 is wired: neighbours, Part VI and AI Agents beside Chapter 39, figures and glossary keys', () => {
  const slug = '56-skill-leaderboard';
  assert.equal(getNeighbors(slug).prev.slug, '55-claude-sonnet-5-5');
  assert.equal(getNeighbors(slug).next.slug, '57-claude-code-mods');
  assert.equal(PARTS.find(part => part.slugs.includes(slug)).key, 'VI', 'the chapter hero shows the Part VI pill');
  const agents = SECTIONS.find(section => section.key === 'agents');
  assert.ok(agents.slugs.includes(slug) && agents.slugs.includes('39-skills-you-should-steal'), 'listed under AI Agents with the chapter it follows up');
  const content = read(`src/content/chapters/${slug}.mdx`);
  // The board's numbers are a one-day snapshot; without the dated callout they read as current.
  assert.match(content, /title="Evidence status: 2026-10-02"/, 'the evidence callout must carry the snapshot date');
  assert.ok(content.includes('/chapters/39-skills-you-should-steal/'), 'the sequel must link back to Chapter 39');
  const ids = [...content.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(ids.slice().sort(), [1, 2, 3].map(n => `${slug}-${n}`), 'all three charts are placed');
  for (const id of ids) {
    assert.ok(id in SCREENSHOTS, `figure id ${id} must have a file in public/screens/`);
  }
  for (const term of [...content.matchAll(/<GlossaryTerm term="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(term in glossary, `glossary term "${term}" must be a key in glossary.ts`);
  }
});

test('chapter 57 is wired: neighbours, Part IV beside Chapter 16, Claude beside Chapter 20, the latest edition banner, figures and glossary keys', () => {
  const slug = '57-claude-code-mods';
  assert.equal(getNeighbors(slug).prev.slug, '56-skill-leaderboard');
  assert.equal(getNeighbors(slug).next, null);
  const part = PARTS.find(item => item.slugs.includes(slug));
  assert.equal(part.key, 'IV', 'the chapter hero shows the Part IV pill');
  assert.equal(part.slugs[part.slugs.indexOf(slug) - 1], '16-hooks-subagents', 'it follows the hooks chapter it is the sequel to');
  const claude = SECTIONS.find(section => section.key === 'claude');
  assert.equal(claude.slugs[claude.slugs.indexOf(slug) - 1], '20-terminal-windows', 'listed under Claude beside running six sessions');
  const content = read(`src/content/chapters/${slug}.mdx`);
  // The mods were hours old when written; without the dated callout the chapter reads as a usage report.
  assert.match(content, /title="Evidence status: 2026-10-03"/, 'the evidence callout must carry the build date');
  for (const href of ['/chapters/16-hooks-subagents/', '/chapters/20-terminal-windows/', '/terminal-setup/']) {
    assert.ok(content.includes(href), `the chapter must link to ${href}`);
  }
  // Search and answer engines quote the opening: it has to name the thing and define it on its own.
  const frontmatter = content.split('---')[1];
  assert.match(frontmatter, /^title: ".*Claude Code Mods.*"$/m, 'the page <title> comes from the chapter title');
  const seoDescription = frontmatter.match(/^seoDescription: "(.*)"$/m)?.[1] ?? '';
  assert.ok(seoDescription.includes('Claude Code mods') && seoDescription.length <= 160, 'seoDescription names the query within 160 characters');
  const body = content.split('---').slice(2).join('---');
  const opening = body.split(/\n\s*\n/).map(block => block.trim()).find(block => block && !block.startsWith('import '));
  assert.ok(opening.startsWith('A Claude Code mod is'), 'the first paragraph is the definition');
  assert.ok(opening.split(/\s+/).length <= 60, 'the definition stands alone in 60 words or fewer');
  // Answer engines quote the comparison; without it the "how do mods differ" heading has nothing under it.
  assert.match(content, /^\|.*\| Draws UI \|/m, 'the comparison table has its header');
  for (const row of ['Mod', 'Settings hook', 'Skill', 'MCP server', 'Status line']) {
    assert.match(content, new RegExp(`^\\| ${row} \\|`, 'm'), `the comparison table has a ${row} row`);
  }
  const ids = [...content.matchAll(new RegExp(`id="(${slug}-\\d+)"`, 'g'))].map(m => m[1]);
  assert.deepEqual(ids.slice().sort(), [1, 2, 3].map(n => `${slug}-${n}`), 'all three figures are placed');
  for (const id of ids) {
    assert.ok(id in SCREENSHOTS, `figure id ${id} must have a file in public/screens/`);
  }
  for (const term of [...content.matchAll(/<GlossaryTerm term="([^"]+)"/g)].map(m => m[1])) {
    assert.ok(term in glossary, `glossary term "${term}" must be a key in glossary.ts`);
  }
  assert.equal(CHANGELOG[0].edition, 'Edition 19');
  assert.equal(CHANGELOG[0].date, '2026-10-03');
  assert.equal(CHANGELOG[0].bannerHref, `/chapters/${slug}/`, 'the homepage banner must point at the newest chapter');
  assert.ok(CHANGELOG[0].bannerText, 'the latest edition must carry a banner');
  assert.ok(CHANGELOG.slice(1).every(entry => !entry.bannerText && !entry.bannerHref), 'only the latest edition may carry a banner');
});

test('the Opus 5.5 and Sonnet 5.5 guides are discoverable and link each other', () => {
  for (const slug of guides55) {
    const href = `/chapters/${slug}/`;
    for (const file of ['src/pages/index.astro', 'src/pages/tier-list.astro']) {
      assert.ok(read(file).includes(href), `${file} must link to ${href}`);
    }
    const other = guides55.find(item => item !== slug);
    const content = read(`src/content/chapters/${slug}.mdx`);
    assert.ok(content.includes(`/chapters/${other}/`), `${slug} must link to its sibling guide`);
    assert.ok(content.includes('/workflow-planner/'));
    assert.ok(content.includes('/tier-list/'));
  }
  assert.ok(read('src/pages/opus-5/index.astro').includes('/chapters/54-claude-opus-5-5/'), 'the historical Opus 5 page must point at its successor');
});

test('measured guides keep the conditions a reader needs to weigh the numbers', () => {
  // The receipts are two runs per setting on one task. If an edit drops the date,
  // the sample size, the grading rule or the harness, the numbers read as a benchmark.
  for (const slug of guides55) {
    const content = read(`src/content/chapters/${slug}.mdx`);
    const status = content.match(/title="Evidence status: 2026-09-29">([\s\S]*?)<\/Callout>/);
    assert.ok(status, `${slug}: the dated Evidence status callout must be present`);
    assert.match(status[1], /two runs per (?:setting|model and effort level)/i, `${slug}: the evidence callout must state the sample size`);
    assert.match(status[1], /calibration, not a benchmark/, `${slug}: the evidence callout must say what the sample can carry`);
    assert.match(content, /within two lines of a planted bug/, `${slug}: the grading rule must be stated`);
    assert.match(content, /session context every (?:headless )?run carries/, `${slug}: list cost per run must say what it includes`);
    assert.doesNotMatch(content, /^\s*- \[[xX]\]/m, 'a guide must not read as a completed checklist');
    assert.doesNotMatch(content, /TODO|TBD/);
  }
  const opus = read('src/content/chapters/54-claude-opus-5-5.mdx');
  assert.match(opus, /workflow subagents/, 'the 22 September sweep ran as workflow subagents');
  const sonnet = read('src/content/chapters/55-claude-sonnet-5-5.mdx');
  assert.match(sonnet, /claude -p --model <id> --effort <level>/, 'the 29 September runs name their harness');
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
