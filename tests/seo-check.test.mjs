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
