import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const checker = fileURLToPath(new URL('../scripts/check-seo.mjs', import.meta.url));
const escapeAttribute = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function html({
  route = '/null-safety/',
  title = 'Null safety and undefined behavior',
  description = 'Use __init__ and <repo>/.mcp.json safely while preserving ~/.claude/skills/ paths.',
  canonical,
  robots,
  body = '',
} = {}) {
  const canonicalUrl = canonical ?? `https://dive.vladyslavpodoliako.com${route}`;
  const encodedDescription = escapeAttribute(description);
  const encodedCanonical = escapeAttribute(canonicalUrl);
  return `<!doctype html><html><head>
    <title>${title}</title>
    <meta name="description" content="${encodedDescription}">
    <meta property="og:description" content="${encodedDescription}">
    <meta name="twitter:description" content="${encodedDescription}">
    ${robots === undefined ? '' : `<meta name="robots" content="${escapeAttribute(robots)}">`}
    <link rel="canonical" href="${encodedCanonical}">
    <script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonicalUrl,
    })}</script>
  </head><body><h1>${title}</h1>${body}</body></html>`;
}

function fixture({ sitemapIndex, sitemapSet, pageHtml = html(), page = 'null-safety' }) {
  const root = mkdtempSync(join(tmpdir(), 'dive-seo-check-'));
  const dist = join(root, 'dist');
  const pageDir = join(dist, page);
  mkdirSync(pageDir, { recursive: true });
  writeFileSync(join(pageDir, 'index.html'), pageHtml);
  if (sitemapIndex !== undefined) writeFileSync(join(dist, 'sitemap-index.xml'), sitemapIndex);
  if (sitemapSet !== undefined) writeFileSync(join(dist, 'sitemap-0.xml'), sitemapSet);
  return root;
}

function run(root) {
  return spawnSync(process.execPath, [checker], {
    cwd: root,
    encoding: 'utf8',
  });
}

const validIndex = '<sitemapindex><sitemap><loc>https://dive.vladyslavpodoliako.com/sitemap-0.xml</loc></sitemap></sitemapindex>';
const validSet = '<urlset><url><loc>https://dive.vladyslavpodoliako.com/null-safety/</loc></url></urlset>';

test('SEO checker accepts technical terms and a valid referenced URL set', () => {
  const root = fixture({ sitemapIndex: validIndex, sitemapSet: validSet });
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /1 generated HTML pages and 1 sitemap URLs validated/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker fails when the sitemap index references a missing URL set', () => {
  const root = fixture({ sitemapIndex: validIndex });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /referenced URL set is missing: sitemap-0\.xml/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker fails when referenced URL sets contain no URLs', () => {
  const root = fixture({ sitemapIndex: validIndex, sitemapSet: '<urlset></urlset>' });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /referenced URL sets contain no URLs/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker rejects an index that references itself', () => {
  const root = fixture({
    sitemapIndex: '<sitemapindex><sitemap><loc>https://dive.vladyslavpodoliako.com/sitemap-index.xml</loc></sitemap></sitemapindex>',
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /invalid URL-set reference/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker still rejects an actual placeholder value', () => {
  const root = fixture({
    sitemapIndex: validIndex,
    sitemapSet: validSet,
    pageHtml: html({ description: 'undefined' }),
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /meta description contains placeholder leakage/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker rejects a canonical on the wrong origin', () => {
  const root = fixture({
    sitemapIndex: validIndex,
    sitemapSet: validSet,
    pageHtml: html({ canonical: 'https://preview.example.com/null-safety/' }),
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /canonical origin https:\/\/preview\.example\.com does not match/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker rejects canonical query strings and fragments', () => {
  const root = fixture({
    sitemapIndex: validIndex,
    sitemapSet: validSet,
    pageHtml: html({ canonical: 'https://dive.vladyslavpodoliako.com/null-safety/?preview=1#section' }),
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /canonical must not contain a query string/);
    assert.match(result.stderr, /canonical must not contain a fragment/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker rejects sitemap references on the wrong origin', () => {
  const root = fixture({
    sitemapIndex: '<sitemapindex><sitemap><loc>https://preview.example.com/sitemap-0.xml</loc></sitemap></sitemapindex>',
    sitemapSet: validSet,
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /sitemap reference origin https:\/\/preview\.example\.com does not match/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker rejects sitemap references outside the root path', () => {
  const root = fixture({
    sitemapIndex: '<sitemapindex><sitemap><loc>https://dive.vladyslavpodoliako.com/broken/sitemap-0.xml</loc></sitemap></sitemapindex>',
    sitemapSet: validSet,
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /sitemap reference must use root path \/sitemap-0\.xml/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker rejects insecure sitemap page URLs', () => {
  const root = fixture({
    sitemapIndex: validIndex,
    sitemapSet: '<urlset><url><loc>http://dive.vladyslavpodoliako.com/null-safety/</loc></url></urlset>',
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /sitemap URL must use HTTPS/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker rejects sitemap page URLs with query strings or fragments', () => {
  const root = fixture({
    sitemapIndex: validIndex,
    sitemapSet: '<urlset><url><loc>https://dive.vladyslavpodoliako.com/null-safety/?preview=1#section</loc></url></urlset>',
  });
  try {
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /sitemap URL must not contain a query string/);
    assert.match(result.stderr, /sitemap URL must not contain a fragment/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('SEO checker counts Unicode code points consistently', () => {
  const root = fixture({
    sitemapIndex: validIndex,
    sitemapSet: validSet,
    pageHtml: html({ description: '\u{1F600}'.repeat(100) }),
  });
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('the public-review invoice draft requires noindex in rendered HTML', () => {
  for (const robots of [undefined, 'index, follow', 'noindex, nofollow']) {
    const root = fixture({
      sitemapIndex: validIndex, sitemapSet: validSet, page: 'the-bill',
      pageHtml: html({
        route: '/the-bill/', title: 'The Bill (Draft)', robots,
        body: '<a href="#receipt">The receipt</a>',
      }),
    });
    try {
      const result = run(root);
      assert.equal(result.status, robots === 'noindex, nofollow' ? 0 : 1, result.stderr);
      if (result.status !== 0) assert.match(result.stderr, /invoice draft must emit.*noindex/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test('the invoice draft cannot re-enter the sitemap even when it has noindex', () => {
  const root = fixture({
    sitemapIndex: validIndex,
    sitemapSet: validSet.replace('/null-safety/', '/the-bill/'),
    page: 'the-bill', pageHtml: html({ route: '/the-bill/', robots: 'noindex, nofollow' }),
  });
  try {
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /invoice draft must stay out of the sitemap/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rendered incoming invoice links must identify the draft, including absolute URLs and fragments', () => {
  for (const href of ['/the-bill/', '/the-bill#receipt', '../the-bill/', 'https://dive.vladyslavpodoliako.com/the-bill/']) {
    for (const label of ['The bill - live invoice math', 'The bill (unfinished draft)']) {
      const root = fixture({
        sitemapIndex: validIndex, sitemapSet: validSet,
        pageHtml: html({ body: `<a href="${href}">${label}</a>` }),
      });
      try {
        const result = run(root);
        assert.equal(result.status, label.includes('draft') ? 0 : 1, result.stderr);
        if (result.status !== 0) assert.match(result.stderr, /invoice must label it as a draft/);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  }
});

// Chapter lastmod (decided 10 Nov 2026): a chapter carries exactly its git modified date
// from src/data/chapter-dates.json, never a build time; other non-Radar pages carry none.
test('chapter lastmod must be the git modified date from chapter-dates.json', () => {
  const chapter = (lastmod) => `<url><loc>https://dive.vladyslavpodoliako.com/chapters/01-x/</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
  const set = (...urls) => `<urlset><url><loc>https://dive.vladyslavpodoliako.com/null-safety/</loc></url>${urls.join('')}</urlset>`;
  const cases = [
    { sitemapSet: set(chapter('2026-05-13T00:00:00.000Z')), ok: true },
    { sitemapSet: set(chapter('2026-05-14T00:00:00.000Z')), error: /lastmod 2026-05-14T00:00:00\.000Z does not match its git modified date 2026-05-13/ },
    { sitemapSet: set(chapter()), error: /\/chapters\/01-x is missing its authoritative lastmod/ },
    { sitemapSet: set(chapter('2026-05-13T00:00:00.000Z')).replace('/null-safety/</loc>', '/null-safety/</loc><lastmod>2026-05-13T00:00:00.000Z</lastmod>'), error: /\/null-safety has a non-authoritative lastmod/ },
    // A chapter the date file does not list has no git date to check against, so its lastmod is
    // as unverified as any other page's.
    { sitemapSet: set(chapter('2026-05-13T00:00:00.000Z'), '<url><loc>https://dive.vladyslavpodoliako.com/chapters/02-y/</loc><lastmod>2026-05-13T00:00:00.000Z</lastmod></url>'), error: /\/chapters\/02-y has a non-authoritative lastmod/ },
  ];
  for (const { sitemapSet, ok, error } of cases) {
    const root = fixture({ sitemapIndex: validIndex, sitemapSet });
    try {
      mkdirSync(join(root, 'src/data'), { recursive: true });
      writeFileSync(join(root, 'src/data/chapter-dates.json'), JSON.stringify({ '01-x': { modified: '2026-05-13', published: '2026-05-07' } }));
      const result = run(root);
      if (ok) assert.equal(result.status, 0, result.stderr);
      else {
        assert.equal(result.status, 1, result.stdout);
        assert.match(result.stderr, error);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

// A chapter date is the author's local day written as midnight UTC, so it can lead the clock by
// up to 14 hours; every other lastmod may lead it by 5 minutes. A date further ahead is a wrong
// clock or a typed date, and search engines distrust a sitemap that carries one. The times are
// taken from the real clock because the checker reads it.
test('a lastmod ahead of the clock is refused beyond its allowance', () => {
  const ahead = (minutes) => new Date(Date.now() + minutes * 60 * 1000).toISOString();
  const cases = [
    { label: 'chapter 13 hours 50 minutes ahead', path: '/chapters/01-x/', lastmod: ahead(13 * 60 + 50), ok: true },
    { label: 'chapter 14 hours 10 minutes ahead', path: '/chapters/01-x/', lastmod: ahead(14 * 60 + 10), error: /\/chapters\/01-x has future lastmod/ },
    { label: 'radar 2 minutes ahead', path: '/radar/', lastmod: ahead(2), ok: true },
    { label: 'radar 10 minutes ahead', path: '/radar/', lastmod: ahead(10), error: /\/radar has future lastmod/ },
  ];
  for (const { label, path, lastmod, ok, error } of cases) {
    const sitemapSet = '<urlset><url><loc>https://dive.vladyslavpodoliako.com/null-safety/</loc></url>'
      + `<url><loc>https://dive.vladyslavpodoliako.com${path}</loc><lastmod>${lastmod}</lastmod></url></urlset>`;
    const root = fixture({ sitemapIndex: validIndex, sitemapSet });
    try {
      mkdirSync(join(root, 'src/data'), { recursive: true });
      writeFileSync(join(root, 'src/data/chapter-dates.json'), JSON.stringify({ '01-x': { modified: lastmod.slice(0, 10), published: '2026-05-07' } }));
      const result = run(root);
      if (ok) assert.equal(result.status, 0, `${label}: ${result.stderr}`);
      else {
        assert.equal(result.status, 1, `${label}: ${result.stdout}`);
        assert.match(result.stderr, error, label);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

// Vlad's decision of 10 Nov 2026: the brand suffix only where the whole title fits 60
// characters. The layout applies it; this is the check on what the build actually wrote, so a
// later edit to the shared layout cannot quietly bring back the over-long suffixed titles.
test('a built title longer than 60 characters must not carry the brand suffix', () => {
  const suffix = " — Vlad's Playbook";
  const cases = [
    { label: '60 characters with the suffix', title: `${'a'.repeat(42)}${suffix}`, ok: true },
    { label: '61 characters with the suffix', title: `${'a'.repeat(43)}${suffix}`, error: /title is 61 characters with the brand suffix \(max 60\)/ },
    { label: '61 characters, apostrophe written as an entity', title: `${'a'.repeat(43)} — Vlad&#39;s Playbook`, error: /title is 61 characters with the brand suffix \(max 60\)/ },
    { label: 'a long title without the suffix', title: 'a'.repeat(90), ok: true },
    // The limit counts characters as a reader sees them. A character outside the basic plane is
    // one character and two UTF-16 units, so this title is 60 characters and 61 units.
    { label: '60 characters, one of them outside the basic plane', title: `${'a'.repeat(41)}${String.fromCodePoint(0x1F4D8)}${suffix}`, ok: true },
  ];
  for (const { label, title, ok, error } of cases) {
    assert.equal(Array.from(suffix).length, 18);
    const root = fixture({ sitemapIndex: validIndex, sitemapSet: validSet, pageHtml: html({ title }) });
    try {
      const result = run(root);
      if (ok) assert.equal(result.status, 0, `${label}: ${result.stderr}`);
      else {
        assert.equal(result.status, 1, `${label}: ${result.stdout}`);
        assert.match(result.stderr, error, label);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

// A sweep commit gives many chapters the same git modified day. Each of those dates is checked
// against chapter-dates.json, so they are not a build stamp and must not stop a deploy: with
// 24 of 127 sitemap URLs on one day (10 Nov 2026), 8 more would have tripped the 25% rule.
test('chapters that share one git modified date do not trip the blanket-timestamp rule', () => {
  const slugs = ['01-a', '02-b', '03-c', '04-d', '05-e', '06-f'];
  const urls = slugs.map((slug) => `<url><loc>https://dive.vladyslavpodoliako.com/chapters/${slug}/</loc><lastmod>2026-07-10T00:00:00.000Z</lastmod></url>`);
  const sitemapSet = `<urlset><url><loc>https://dive.vladyslavpodoliako.com/null-safety/</loc></url>${urls.join('')}</urlset>`;
  const root = fixture({ sitemapIndex: validIndex, sitemapSet });
  try {
    mkdirSync(join(root, 'src/data'), { recursive: true });
    writeFileSync(join(root, 'src/data/chapter-dates.json'), JSON.stringify(Object.fromEntries(slugs.map((slug) => [slug, { modified: '2026-07-10', published: '2026-05-07' }]))));
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.doesNotMatch(result.stderr, /possible blanket build timestamp/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// The other half of that rule: a date nothing verified is still counted. The only such dates in
// today's sitemap are the Radar's, and a dated Radar page with another day's date already fails
// by itself, so the rule is a backstop that reports beside that error.
test('lastmods that are not verified chapter dates still count toward the blanket-timestamp rule', () => {
  const days = ['2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10'];
  const urls = days.map((day) => `<url><loc>https://dive.vladyslavpodoliako.com/radar/${day}/</loc><lastmod>2026-07-10T00:00:00.000Z</lastmod></url>`);
  const sitemapSet = `<urlset><url><loc>https://dive.vladyslavpodoliako.com/null-safety/</loc></url>${urls.join('')}</urlset>`;
  const root = fixture({ sitemapIndex: validIndex, sitemapSet });
  try {
    const result = run(root);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /5\/6 URLs share lastmod 2026-07-10T00:00:00\.000Z; possible blanket build timestamp/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a chapter page must share its own card, and the card must be in dist', () => {
  const route = '/chapters/16-hooks-subagents/';
  const set = `<urlset><url><loc>https://dive.vladyslavpodoliako.com${route}</loc></url></urlset>`;
  const withImage = (path, twitterPath = path) => html({ route }).replace('</head>',
    `<meta property="og:image" content="https://dive.vladyslavpodoliako.com${path}">`
    + `<meta name="twitter:image" content="https://dive.vladyslavpodoliako.com${twitterPath}"></head>`);
  // The same address in both tags, written exactly as given (no site origin put in front).
  const withAddress = (address) => html({ route }).replace('</head>',
    `<meta property="og:image" content="${address}"><meta name="twitter:image" content="${address}"></head>`);
  const cases = [
    { label: 'own card present', page: withImage('/og/chapters/16-hooks-subagents.png?v=0123abcd'), card: true, status: 0 },
    { label: 'own card missing from dist', page: withImage('/og/chapters/16-hooks-subagents.png?v=0123abcd'), card: false, status: 1, error: /og:image file \/og\/chapters\/16-hooks-subagents\.png is not in dist/ },
    { label: 'site default card', page: withImage('/og-default.png'), card: true, status: 1, error: /expected \/og\/chapters\/16-hooks-subagents\.png/ },
    { label: 'twitter image differs', page: withImage('/og/chapters/16-hooks-subagents.png', '/og-default.png'), card: true, status: 1, error: /og:image and twitter:image differ/ },
    { label: 'no share image', page: html({ route }), card: true, status: 1, error: /expected one og:image and one twitter:image, found 0 and 0/ },
    // Two tags of one kind: a preview could show either picture.
    { label: 'two og:image tags', page: withImage('/og/chapters/16-hooks-subagents.png').replace('</head>', '<meta property="og:image" content="https://dive.vladyslavpodoliako.com/og-default.png"></head>'), card: true, status: 1, error: /expected one og:image and one twitter:image, found 2 and 1/ },
    { label: 'two twitter:image tags', page: withImage('/og/chapters/16-hooks-subagents.png').replace('</head>', '<meta name="twitter:image" content="https://dive.vladyslavpodoliako.com/og-default.png"></head>'), card: true, status: 1, error: /expected one og:image and one twitter:image, found 1 and 2/ },
    // Share previews are fetched by other sites, which cannot resolve a path without a host.
    { label: 'address without a host', page: withAddress('/og/chapters/16-hooks-subagents.png'), card: true, status: 1, error: /og:image is not an absolute URL: \/og\/chapters\/16-hooks-subagents\.png/ },
    // A card served from another site can change or vanish without this build noticing.
    { label: 'card on another site', page: withAddress('https://example.com/og/chapters/16-hooks-subagents.png'), card: true, status: 1, error: /og:image origin https:\/\/example\.com does not match https:\/\/dive\.vladyslavpodoliako\.com/ },
  ];
  for (const { label, page, card, status, error } of cases) {
    const root = fixture({ sitemapIndex: validIndex, sitemapSet: set, pageHtml: page, page: 'chapters/16-hooks-subagents' });
    try {
      writeFileSync(join(root, 'dist', 'og-default.png'), 'png');
      if (card) {
        mkdirSync(join(root, 'dist', 'og', 'chapters'), { recursive: true });
        writeFileSync(join(root, 'dist', 'og', 'chapters', '16-hooks-subagents.png'), 'png');
      }
      const result = run(root);
      assert.equal(result.status, status, `${label}: ${result.stderr}`);
      if (error) assert.match(result.stderr, error, label);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

// Every page that names a share image is checked, not only chapters: if the default card were
// renamed or deleted, every non-chapter page would share a broken picture.
test('a page outside the chapters must not share an image that is missing from dist', () => {
  const page = html().replace('</head>',
    '<meta property="og:image" content="https://dive.vladyslavpodoliako.com/og-default.png">'
    + '<meta name="twitter:image" content="https://dive.vladyslavpodoliako.com/og-default.png"></head>');
  const cases = [
    { label: 'default card present', present: true, status: 0 },
    { label: 'default card missing', present: false, status: 1, error: /og:image file \/og-default\.png is not in dist/ },
  ];
  for (const { label, present, status, error } of cases) {
    const root = fixture({ sitemapIndex: validIndex, sitemapSet: validSet, pageHtml: page });
    try {
      if (present) writeFileSync(join(root, 'dist', 'og-default.png'), 'png');
      const result = run(root);
      assert.equal(result.status, status, `${label}: ${result.stderr}`);
      if (error) assert.match(result.stderr, error, label);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

// One tag without the other: one network shows the card and the other shows none.
test('a page outside the chapters that names a share image names it in both tags', () => {
  const og = '<meta property="og:image" content="https://dive.vladyslavpodoliako.com/og-default.png">';
  const twitter = '<meta name="twitter:image" content="https://dive.vladyslavpodoliako.com/og-default.png">';
  const cases = [
    { label: 'og:image alone', tags: og, error: /expected one og:image and one twitter:image, found 1 and 0/ },
    { label: 'twitter:image alone', tags: twitter, error: /expected one og:image and one twitter:image, found 0 and 1/ },
  ];
  for (const { label, tags, error } of cases) {
    const root = fixture({ sitemapIndex: validIndex, sitemapSet: validSet, pageHtml: html().replace('</head>', `${tags}</head>`) });
    try {
      writeFileSync(join(root, 'dist', 'og-default.png'), 'png');
      const result = run(root);
      assert.equal(result.status, 1, `${label}: ${result.stdout}`);
      assert.match(result.stderr, error, label);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});
