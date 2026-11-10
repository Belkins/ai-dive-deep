import assert from 'node:assert/strict';
import test from 'node:test';
import { addMissingLlmsPages, llmsMissingUrls, readPageHead, readSiteName } from '../src/lib/llms-site-map.mjs';

// astro.config.mjs completes llms.txt with these helpers after each build. They are imported
// here the way the config imports them: by plain Node, with no TypeScript step.

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
  assert.deepEqual(llmsMissingUrls(text, urls), [`${SITE}/opus-5/`, `${SITE}/about/`]);

  const next = addMissingLlmsPages(text, [
    { url: `${SITE}/opus-5/`, title: 'Opus 5' },
    { url: `${SITE}/about/`, title: 'About', description: 'Who wrote this. Why. And how to keep reading.' },
  ]);
  assert.deepEqual(llmsMissingUrls(next, urls), []);
  assert.ok(next.includes(`.\n- [Opus 5](${SITE}/opus-5/)\n- [About](${SITE}/about/) — Who wrote this. Why. And how to keep reading.\n\n## Chapters\n`));
  assert.throws(() => addMissingLlmsPages('no headings', [{ url: `${SITE}/x/`, title: 'X' }]), /Chapters/);
});

test('readPageHead returns the page title without the brand suffix and the meta description verbatim', () => {
  const html = '<title>Vlad&#39;s actual setup — Vlad&#39;s Playbook</title><meta name="description" content="54 skills &amp; more. It&#39;s live.">';
  assert.deepEqual(readPageHead(html, "Vlad's Playbook"), { title: "Vlad's actual setup", description: "54 skills & more. It's live." });
  assert.deepEqual(readPageHead('<title>Only</title>', "Vlad's Playbook"), { title: 'Only', description: undefined });
});

// The config takes the brand from the page itself. A page that declares no site name keeps
// its whole title: an empty brand must never cut a title that happens to end in a dash.
test('the brand suffix comes from the page\'s own og:site_name, and a page without one keeps its title', () => {
  const page = '<title>About — Vlad&#39;s Playbook</title><meta property="og:site_name" content="Vlad&#39;s Playbook">';
  assert.equal(readSiteName(page), "Vlad's Playbook");
  assert.deepEqual(readPageHead(page, readSiteName(page)), { title: 'About', description: undefined });

  const bare = '<title>Notes — </title>';
  assert.equal(readSiteName(bare), '');
  assert.deepEqual(readPageHead(bare, readSiteName(bare)), { title: 'Notes —', description: undefined });
});

test('the five characters Astro escapes come back as written, and nothing else is decoded', () => {
  const html = '<title>A &lt;b&gt; &quot;c&quot; &amp;amp; d&#39;e &nbsp; &#8212;</title>';
  assert.equal(readPageHead(html, '').title, 'A <b> "c" &amp; d\'e &nbsp; &#8212;');
});
