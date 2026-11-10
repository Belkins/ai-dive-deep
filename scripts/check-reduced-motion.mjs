#!/usr/bin/env node
// check-reduced-motion.mjs — postbuild guard for the global reduced-motion
// kill switch (issue #13).
//
// src/styles/global.css carries one universal block:
//   @media (prefers-reduced-motion: reduce) {
//     *, *::before, *::after { animation-duration: 0.01ms !important;
//       transition-duration: 0.01ms !important; ... } }
// RadarBoard.astro and most motion idioms on the site rely on it, and deleting
// it kept every other check green. This guard reads the built CSS and fails
// unless some file holds that block: a reduce media query with a rule whose
// selector list includes a bare `*` and sets both durations to .01ms
// !important. Static and cheap, so it runs in postbuild.
//
// Usage: node scripts/check-reduced-motion.mjs [distDir]   (default: dist)

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = process.argv[2] ?? 'dist';

function cssFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...cssFiles(p));
    else if (name.endsWith('.css')) out.push(p);
  }
  return out;
}

// Return the text between the braces that open at `start` (index of '{').
function blockAt(css, start) {
  let depth = 0;
  for (let i = start; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(start + 1, i);
    }
  }
  return '';
}

const DURATION = (prop) => new RegExp(`${prop}\\s*:\\s*0?\\.01ms\\s*!important`);

function hasKillSwitch(css) {
  const media = /@media[^{]*prefers-reduced-motion\s*:\s*reduce[^{]*\{/g;
  let m;
  while ((m = media.exec(css))) {
    const body = blockAt(css, m.index + m[0].length - 1);
    const rules = /([^{}]+)\{([^{}]*)\}/g;
    let r;
    while ((r = rules.exec(body))) {
      const selectors = r[1].split(',').map((s) => s.trim());
      if (!selectors.includes('*')) continue;
      if (DURATION('animation-duration').test(r[2]) && DURATION('transition-duration').test(r[2])) return true;
    }
  }
  return false;
}

let files;
try {
  files = cssFiles(DIST);
} catch (err) {
  console.error(`✗ reduced-motion: cannot read ${DIST} (${err.code ?? err.message}); run astro build first`);
  process.exit(1);
}

const hit = files.find((f) => hasKillSwitch(readFileSync(f, 'utf8')));
if (!hit) {
  console.error(`✗ reduced-motion: none of ${files.length} built CSS file(s) under ${DIST} holds the global`);
  console.error('  @media (prefers-reduced-motion: reduce) { *, *::before, *::after {');
  console.error('    animation-duration: .01ms !important; transition-duration: .01ms !important } }');
  console.error('  block from src/styles/global.css. Restore it: readers with vestibular disorders rely on it.');
  process.exit(1);
}
console.log(`✓ reduced-motion kill switch present in ${hit} (${files.length} CSS file(s) scanned)`);
