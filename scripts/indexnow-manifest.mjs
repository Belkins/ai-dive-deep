#!/usr/bin/env node
// indexnow-manifest.mjs — write dist/indexnow-manifest.json after the build.
//
// One entry per sitemap URL: the page path and a hash of that page's <main>
// element, so shared chrome (nav, footer, announcement bar, CSS bundle names)
// does not count as a change. The deploy workflow keeps the live copy from
// before each deploy, and scripts/indexnow-ping.py submits only the paths
// whose hash is new or changed (dive-seo-distribution-04).
//
// This step must never fail the build: any error prints a warning and exits
// 0, and with no manifest the ping falls back to the full sitemap.
//
// Usage: node scripts/indexnow-manifest.mjs [distDir]   (default: dist)

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = process.argv[2] ?? 'dist';
const OUT = 'indexnow-manifest.json';

// Per-build noise inside <main>: Astro island uid and prefix attributes, the
// React useId values built from the prefix (radix-:r4R0:), and content-hashed
// asset names.
export function normalise(html) {
  return html
    .replace(/\suid="[^"]*"/g, '')
    .replace(/\sprefix="r\d+"/g, '')
    .replace(/:r[0-9A-Za-z]+:/g, ':r:')
    .replace(/(\/_astro\/[\w.-]+?)\.[\w-]{8}\.(js|css|mjs)/g, '$1.$2');
}

export function mainContent(html) {
  const start = html.search(/<main[\s>]/);
  const end = html.lastIndexOf('</main>');
  if (start === -1 || end === -1 || end < start) {
    const body = html.match(/<body[\s\S]*<\/body>/);
    return body ? body[0] : html;
  }
  return html.slice(start, end + '</main>'.length);
}

export function pageHash(html) {
  return createHash('sha256').update(normalise(mainContent(html))).digest('hex').slice(0, 16);
}

function sitemapPaths(dist) {
  const paths = [];
  for (const name of readdirSync(dist)) {
    if (!/^sitemap-\d+\.xml$/.test(name)) continue;
    const xml = readFileSync(join(dist, name), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) paths.push(new URL(m[1]).pathname);
  }
  return paths;
}

function fileFor(dist, path) {
  const rel = decodeURIComponent(path).replace(/^\//, '');
  if (rel === '' || rel.endsWith('/')) return join(dist, rel, 'index.html');
  return join(dist, rel);
}

function main() {
  const pages = {};
  let missing = 0;
  for (const path of sitemapPaths(DIST)) {
    const file = fileFor(DIST, path);
    if (!existsSync(file)) {
      missing += 1;
      continue;
    }
    pages[path] = pageHash(readFileSync(file, 'utf8'));
  }
  const count = Object.keys(pages).length;
  if (count === 0) {
    console.warn(`! indexnow-manifest: no sitemap pages found under ${DIST}; not written (the ping will send the full sitemap)`);
    return;
  }
  writeFileSync(join(DIST, OUT), `${JSON.stringify({ version: 1, pages }, null, 1)}\n`);
  console.log(`✓ indexnow-manifest: ${count} pages hashed${missing ? `, ${missing} sitemap URL(s) without a built file skipped` : ''}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    main();
  } catch (err) {
    console.warn(`! indexnow-manifest: skipped (${err.message}); the ping will send the full sitemap`);
  }
}
