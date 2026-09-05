import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST_DIR = 'dist';
const DESCRIPTION_MAX_LENGTH = 160;
const EXPECTED_ORIGIN = new URL(process.env.SITE_URL || 'https://dive.vladyslavpodoliako.com').origin;
const PLACEHOLDER_VALUE_PATTERN = /^(?:undefined|null|nan)$/i;
const PLACEHOLDER_URL_SEGMENT_PATTERN = /(?:^|[/?#&=])(?:undefined|null|nan)(?=$|[/?#&=])/i;
const MARKDOWN_PATTERN = /!?(?:\[[^\]]*\]\([^)]*\))|`|\*\*|~~|(?:^|\s)#{1,6}\s|<\/?(?:a|abbr|b|blockquote|br|code|div|em|h[1-6]|i|img|li|ol|p|pre|script|span|strong|style|sub|sup|table|tbody|td|th|thead|tr|u|ul)\b[^>]*>/i;
const errors = [];

const isUnicodeScalar = (codePoint) => Number.isInteger(codePoint)
  && codePoint >= 0
  && codePoint <= 0x10ffff
  && !(codePoint >= 0xd800 && codePoint <= 0xdfff);

const decodeHtml = (value = '') => value
  .replace(/&#(x[\da-f]+|\d+);/gi, (entity, key) => {
    const hex = key[0].toLowerCase() === 'x';
    const codePoint = Number.parseInt(key.slice(hex ? 1 : 0), hex ? 16 : 10);
    return isUnicodeScalar(codePoint) ? String.fromCodePoint(codePoint) : entity;
  })
  .replace(/&quot;/gi, '"')
  .replace(/&apos;|&#39;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&');

const textContent = (value = '') => decodeHtml(value
  .replace(/<(?:script|style|template)\b[^>]*>[\s\S]*?<\/(?:script|style|template)>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim());

const headingText = (value = '') => {
  const visibleText = textContent(value);
  if (visibleText) return visibleText;
  const label = value.match(/\baria-label\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  return decodeHtml(label?.[1] ?? label?.[2] ?? '').trim();
};

function filesUnder(directory, predicate) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) files.push(...filesUnder(path, predicate));
    else if (predicate(path)) files.push(path);
  }
  return files;
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
    result[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}

function metaContent(html, key, value) {
  const matches = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => attributes(tag))
    .filter((attrs) => attrs[key] === value);
  return matches.map((attrs) => attrs.content ?? '');
}

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function hasPlaceholderLeak(value, { url = false } = {}) {
  const normalized = value.trim();
  return PLACEHOLDER_VALUE_PATTERN.test(normalized)
    || (url && PLACEHOLDER_URL_SEGMENT_PATTERN.test(normalized));
}

function jsonLdHasPlaceholderLeak(value, key = '') {
  if (typeof value === 'string') {
    return hasPlaceholderLeak(value, { url: ['@id', 'image', 'url'].includes(key) });
  }
  if (Array.isArray(value)) return value.some((entry) => jsonLdHasPlaceholderLeak(entry, key));
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(([childKey, child]) => jsonLdHasPlaceholderLeak(child, childKey));
}

function validateText(file, label, value, { allowLong = false, url = false } = {}) {
  if (!value.trim()) fail(file, `missing ${label}`);
  if (hasPlaceholderLeak(value, { url })) fail(file, `${label} contains placeholder leakage`);
  if (MARKDOWN_PATTERN.test(value)) fail(file, `${label} contains Markdown or HTML`);
  const length = Array.from(value).length;
  if (!allowLong && length > DESCRIPTION_MAX_LENGTH) {
    fail(file, `${label} is ${length} characters (max ${DESCRIPTION_MAX_LENGTH})`);
  }
}

function routeFor(file) {
  const path = relative(DIST_DIR, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  if (path.endsWith('/index.html')) return `/${path.slice(0, -'index.html'.length)}`;
  return `/${path.replace(/\.html$/, '')}/`;
}

function validateHtml(file) {
  const displayFile = relative('.', file);
  const html = readFileSync(file, 'utf8');
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';

  if (routeFor(file) === '/the-bill/') {
    const robots = metaContent(head, 'name', 'robots');
    if (robots.length !== 1 || !robots[0].toLowerCase().split(/[\s,]+/).includes('noindex')) {
      fail(displayFile, 'unfinished invoice draft must emit one robots meta tag containing noindex');
    }
  }
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attributes(match[1]).href;
    if (!href) continue;
    let target;
    try {
      target = new URL(href, `${EXPECTED_ORIGIN}${routeFor(file)}`);
    } catch {
      continue; // Malformed links are handled by the rendered-link checker.
    }
    if (routeFor(file) !== '/the-bill/' && target.origin === EXPECTED_ORIGIN
      && target.pathname.replace(/\/$/, '') === '/the-bill'
      && !/\bdraft\b/i.test(textContent(match[2]))) {
      fail(displayFile, 'links to the unfinished invoice must label it as a draft');
    }
  }

  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => textContent(match[1]));
  if (titles.length !== 1) fail(displayFile, `expected one title, found ${titles.length}`);
  else validateText(displayFile, 'title', titles[0], { allowLong: true });

  const descriptions = metaContent(head, 'name', 'description');
  const ogDescriptions = metaContent(head, 'property', 'og:description');
  const twitterDescriptions = metaContent(head, 'name', 'twitter:description');
  for (const [label, values] of [
    ['meta description', descriptions],
    ['Open Graph description', ogDescriptions],
    ['Twitter description', twitterDescriptions],
  ]) {
    if (values.length !== 1) fail(displayFile, `expected one ${label}, found ${values.length}`);
    else validateText(displayFile, label, values[0]);
  }
  if (
    descriptions.length === 1
    && (descriptions[0] !== ogDescriptions[0] || descriptions[0] !== twitterDescriptions[0])
  ) {
    fail(displayFile, 'meta, Open Graph, and Twitter descriptions do not match');
  }

  const canonicalTags = [...head.matchAll(/<link\b[^>]*>/gi)]
    .map(([tag]) => attributes(tag))
    .filter((attrs) => attrs.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  if (canonicalTags.length !== 1) {
    fail(displayFile, `expected one canonical, found ${canonicalTags.length}`);
  } else {
    const canonical = canonicalTags[0].href ?? '';
    try {
      const url = new URL(canonical);
      if (url.protocol !== 'https:') fail(displayFile, 'canonical must use HTTPS');
      if (url.origin !== EXPECTED_ORIGIN) {
        fail(displayFile, `canonical origin ${url.origin} does not match ${EXPECTED_ORIGIN}`);
      }
      if (url.search) fail(displayFile, 'canonical must not contain a query string');
      if (url.hash) fail(displayFile, 'canonical must not contain a fragment');
      const expectedPath = routeFor(file).replace(/\/$/, '') || '/';
      const actualPath = url.pathname.replace(/\/$/, '') || '/';
      if (actualPath !== expectedPath) fail(displayFile, `canonical path ${url.pathname} does not match ${routeFor(file)}`);
      validateText(displayFile, 'canonical', canonical, { allowLong: true, url: true });
    } catch {
      fail(displayFile, `canonical is not an absolute URL: ${canonical || '(empty)'}`);
    }
  }

  const h1Values = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => headingText(match[1]));
  if (h1Values.length === 0) fail(displayFile, 'missing H1');
  h1Values.forEach((value, index) => validateText(displayFile, `H1 ${index + 1}`, value, { allowLong: true }));

  const jsonLdScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => attributes(match[1]).type?.toLowerCase() === 'application/ld+json');
  if (jsonLdScripts.length === 0) fail(displayFile, 'missing JSON-LD');
  jsonLdScripts.forEach((match, index) => {
    try {
      const parsed = JSON.parse(match[2]);
      if (jsonLdHasPlaceholderLeak(parsed)) fail(displayFile, `JSON-LD ${index + 1} contains placeholder leakage`);
      const pageTypes = new Set(['Article', 'Book', 'WebPage']);
      const types = Array.isArray(parsed?.['@type']) ? parsed['@type'] : [parsed?.['@type']];
      if (types.some((type) => pageTypes.has(type))) {
        validateText(displayFile, `JSON-LD ${index + 1} description`, parsed.description ?? '');
        if (descriptions.length === 1 && parsed.description !== descriptions[0]) {
          fail(displayFile, `JSON-LD ${index + 1} description does not match the meta description`);
        }
      }
    } catch (error) {
      fail(displayFile, `JSON-LD ${index + 1} is not parseable: ${error.message}`);
    }
  });
}

function validateSitemaps() {
  const indexFile = join(DIST_DIR, 'sitemap-index.xml');
  if (!existsSync(indexFile)) {
    fail(DIST_DIR, 'missing sitemap-index.xml');
    return 0;
  }

  const indexXml = readFileSync(indexFile, 'utf8');
  const references = [...indexXml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)]
    .map((match) => decodeHtml(match[1].trim()));
  if (references.length === 0) {
    fail(relative('.', indexFile), 'sitemap index contains no URL-set references');
    return 0;
  }

  const sitemapFiles = [];
  const seen = new Set();
  for (const reference of references) {
    let fileName;
    try {
      const referenceUrl = new URL(reference);
      if (referenceUrl.protocol !== 'https:') {
        fail(relative('.', indexFile), `sitemap reference must use HTTPS: ${reference}`);
      }
      if (referenceUrl.origin !== EXPECTED_ORIGIN) {
        fail(relative('.', indexFile), `sitemap reference origin ${referenceUrl.origin} does not match ${EXPECTED_ORIGIN}`);
      }
      fileName = referenceUrl.pathname.split('/').filter(Boolean).at(-1);
      if (referenceUrl.search) fail(relative('.', indexFile), `sitemap reference must not contain a query string: ${reference}`);
      if (referenceUrl.hash) fail(relative('.', indexFile), `sitemap reference must not contain a fragment: ${reference}`);
    } catch {
      fail(relative('.', indexFile), `invalid sitemap reference: ${reference || '(empty)'}`);
      continue;
    }
    if (!fileName || !/^sitemap-\d+\.xml$/.test(fileName)) {
      fail(relative('.', indexFile), `invalid URL-set reference: ${reference || '(empty)'}`);
      continue;
    }
    if (new URL(reference).pathname !== `/${fileName}`) {
      fail(relative('.', indexFile), `sitemap reference must use root path /${fileName}: ${reference}`);
    }
    const file = join(DIST_DIR, fileName);
    if (!existsSync(file)) {
      fail(relative('.', indexFile), `referenced URL set is missing: ${fileName}`);
      continue;
    }
    if (!seen.has(file)) {
      seen.add(file);
      sitemapFiles.push(file);
    }
  }
  if (sitemapFiles.length === 0) return 0;

  const timestampCounts = new Map();
  let urlCount = 0;
  const now = Date.now();

  for (const file of sitemapFiles) {
    const xml = readFileSync(file, 'utf8');
    for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      urlCount += 1;
      const block = match[1];
      const loc = decodeHtml(block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim() ?? '');
      const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim();
      let path;
      try {
        const sitemapUrl = new URL(loc);
        if (sitemapUrl.protocol !== 'https:') {
          fail(relative('.', file), `sitemap URL must use HTTPS: ${loc}`);
        }
        if (sitemapUrl.origin !== EXPECTED_ORIGIN) {
          fail(relative('.', file), `sitemap URL origin ${sitemapUrl.origin} does not match ${EXPECTED_ORIGIN}`);
        }
        if (sitemapUrl.search) fail(relative('.', file), `sitemap URL must not contain a query string: ${loc}`);
        if (sitemapUrl.hash) fail(relative('.', file), `sitemap URL must not contain a fragment: ${loc}`);
        path = sitemapUrl.pathname.replace(/\/$/, '') || '/';
      } catch {
        fail(relative('.', file), `invalid sitemap URL: ${loc || '(empty)'}`);
        continue;
      }

      const isRadar = path === '/radar' || /^\/radar\/\d{4}-\d{2}-\d{2}$/.test(path);
      if (path === '/the-bill') fail(relative('.', file), 'unfinished invoice draft must stay out of the sitemap');
      if (!isRadar && lastmod) fail(relative('.', file), `${path} has a non-authoritative lastmod`);
      if (isRadar && !lastmod) fail(relative('.', file), `${path} is missing its authoritative lastmod`);
      if (!lastmod) continue;

      const timestamp = Date.parse(lastmod);
      if (!Number.isFinite(timestamp)) fail(relative('.', file), `${path} has invalid lastmod ${lastmod}`);
      else if (timestamp > now + 5 * 60 * 1000) fail(relative('.', file), `${path} has future lastmod ${lastmod}`);

      if (/^\/radar\/\d{4}-\d{2}-\d{2}$/.test(path) && !lastmod.startsWith(path.slice('/radar/'.length))) {
        fail(relative('.', file), `${path} lastmod does not match its archive date`);
      }
      timestampCounts.set(lastmod, (timestampCounts.get(lastmod) ?? 0) + 1);
    }
  }

  for (const [timestamp, count] of timestampCounts) {
    if (count >= 5 && count / urlCount >= 0.25) {
      fail('sitemaps', `${count}/${urlCount} URLs share lastmod ${timestamp}; possible blanket build timestamp`);
    }
  }
  if (urlCount === 0) fail('sitemaps', 'referenced URL sets contain no URLs');
  return urlCount;
}

if (!existsSync(DIST_DIR)) {
  console.error(`SEO check failed: ${DIST_DIR}/ does not exist. Run the build first.`);
  process.exit(1);
}

const htmlFiles = filesUnder(DIST_DIR, (file) => file.endsWith('.html'))
  .filter((file) => !relative(DIST_DIR, file).split(sep).includes('artifacts'));
htmlFiles.forEach(validateHtml);
const sitemapUrlCount = validateSitemaps();

if (errors.length > 0) {
  console.error(`SEO check failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`SEO check passed: ${htmlFiles.length} generated HTML pages and ${sitemapUrlCount} sitemap URLs validated.`);
