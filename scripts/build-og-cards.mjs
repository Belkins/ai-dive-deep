// Writes one 1200x630 share card per chapter to public/og/chapters/<slug>.png and the hash of each
// card's inputs to scripts/og-cards.json. Run it after a chapter is added or retitled:
//   npm run og:cards -- --playwright <folder of the playwright-core package>
// (or set OG_PLAYWRIGHT). playwright-core is not a dependency of this repo on purpose: the cards
// are committed, so CI and the deploy never render them.
//
// The design is the sample Vlad chose on 10 Nov 2026: public/og-default.svg's dark ground and
// orange top rule, the part label in orange letter-spaced capitals, the title in the site's serif,
// the subtitle in grey letter-spaced sans, the hairline, and the two footer lines. Text comes from
// src/lib/chapters.ts as written: never reworded, truncated or ellipsised.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { cardHash, cardInputs } from './og-card-inputs.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = join(ROOT, 'public', 'fonts');
const ORIGIN = 'https://og-card.invalid';
export const W = 1200;
export const H = 630;
const SIDE = 80;
const HAIRLINE_Y = 500;
const TITLE_SIZES = [88, 84, 80, 76, 72, 68, 64, 60, 56];
const SUBTITLE_SIZES = [34, 32, 30, 28];

// Fonts load from the repo's own files by path, under aliases, so neither the fonts installed on
// this machine nor a font file's internal name can change the result.
const FACES = [
  { family: 'OG Serif', file: 'source-serif-4-latin.woff2', weight: '400 700' },
  { family: 'OG Serif', file: 'source-serif-4-latin-ext.woff2', weight: '400 700', range: 'U+0100-02AF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF' },
  { family: 'OG Sans', file: 'inter-latin.woff2', weight: '400 700' },
  { family: 'OG Sans', file: 'inter-latin-ext.woff2', weight: '400 700', range: 'U+0100-02AF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF' },
];

export function fontFaceCss(aliases = {}) {
  return FACES.map((f) => `@font-face { font-family: '${aliases[f.family] ?? f.family}'; font-weight: ${f.weight}; font-style: normal; src: url('${ORIGIN}/fonts/${f.file}') format('woff2');${f.range ? ` unicode-range: ${f.range};` : ''} }`).join('\n');
}

export function playwrightDir(argv = process.argv.slice(2), env = process.env) {
  const i = argv.indexOf('--playwright');
  const dir = i >= 0 ? argv[i + 1] : env.OG_PLAYWRIGHT;
  if (!dir) {
    console.error('build-og-cards: pass --playwright <folder of the playwright-core package> or set OG_PLAYWRIGHT (it needs a Chromium installed by that package).');
    process.exit(2);
  }
  return resolve(dir);
}

// A page on a private origin whose requests are answered from memory and from public/fonts only.
export async function openCardPage(dir) {
  const { chromium } = createRequire(import.meta.url)(dir);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  let html = '';
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) return route.abort();
    if (url.pathname === '/card.html') return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
    if (url.pathname.startsWith('/fonts/') && /^[\w.-]+\.woff2$/.test(url.pathname.slice(7))) {
      return route.fulfill({ contentType: 'font/woff2', body: readFileSync(join(FONTS, url.pathname.slice(7))) });
    }
    return route.abort();
  });
  const load = async (body) => {
    html = body;
    await page.goto(`${ORIGIN}/card.html`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
  };
  return { browser, page, load };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function cardHtml({ part, title, subtitle }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaceCss()}
html, body { margin: 0; padding: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #0E0F11; }
body { position: relative; -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; }
#rule { position: absolute; left: 0; top: 0; width: ${W}px; height: 6px; background: #FF6B2C; }
#block { position: absolute; left: ${SIDE}px; width: ${W - 2 * SIDE}px; top: 0; }
#part { font: 600 22px/28px 'OG Sans'; letter-spacing: 7px; text-transform: uppercase; color: #FF6B2C; white-space: nowrap; }
#title { margin-top: 32px; font-family: 'OG Serif'; font-weight: 600; color: #FAFAF7; letter-spacing: -1.5px; line-height: 1.08; white-space: nowrap; text-wrap: balance; }
#subtitle { margin-top: 26px; font-family: 'OG Sans'; font-weight: 400; color: #AAA79A; letter-spacing: 3px; line-height: 1.3; white-space: nowrap; text-wrap: balance; }
#hair { position: absolute; left: ${SIDE}px; top: ${HAIRLINE_Y}px; width: ${W - 2 * SIDE}px; height: 1px; background: #2A3138; }
.foot { position: absolute; top: 527px; font: 24px/32px 'OG Sans'; }
#brand { left: ${SIDE}px; color: #71717A; }
#site { right: ${SIDE}px; color: #FF6B2C; font-weight: 600; }
</style></head><body>
<div id="rule"></div>
<div id="block"><div id="part">${esc(part)}</div><div id="title">${esc(title)}</div><div id="subtitle">${esc(subtitle)}</div></div>
<div id="hair"></div>
<div class="foot" id="brand">Vlad’s Playbook</div>
<div class="foot" id="site">dive.vladyslavpodoliako.com</div>
</body></html>`;
}

// Fit the title (shrink on one line, then wrap at the floor) and the subtitle (wrap onto two lines,
// then shrink), then place the block so the space above and below it keeps the sample's proportion.
async function layout(page) {
  return page.evaluate(({ TITLE_SIZES, SUBTITLE_SIZES, SIDE, HAIRLINE_Y, W }) => {
    const $ = (id) => document.getElementById(id);
    const maxW = W - 2 * SIDE;
    const lines = (el, size, lh) => Math.round(el.getBoundingClientRect().height / (size * lh));
    const title = $('title');
    let titleSize = TITLE_SIZES.at(-1);
    let titleLines = 1;
    title.style.whiteSpace = 'nowrap';
    for (const size of TITLE_SIZES) {
      title.style.fontSize = `${size}px`;
      if (title.scrollWidth <= maxW) { titleSize = size; break; }
      titleSize = size;
    }
    if (title.scrollWidth > maxW) {
      title.style.whiteSpace = 'normal';
      titleLines = lines(title, titleSize, 1.08);
    }
    const sub = $('subtitle');
    let subSize = SUBTITLE_SIZES[0];
    sub.style.fontSize = `${subSize}px`;
    sub.style.whiteSpace = 'nowrap';
    let subLines = 1;
    if (sub.scrollWidth > maxW) {
      sub.style.whiteSpace = 'normal';
      for (const size of SUBTITLE_SIZES) {
        sub.style.fontSize = `${size}px`;
        subSize = size;
        subLines = lines(sub, size, 1.3);
        if (subLines <= 2) break;
      }
    }
    // The sample (one-line title and subtitle) leaves its gaps above and below the text block in
    // this ratio; larger blocks keep it, so a two-line title moves the block up as well as down.
    const block = $('block');
    const top0 = 6;
    const free = HAIRLINE_Y - top0 - block.getBoundingClientRect().height;
    const TOP_SHARE = 0.36;
    block.style.top = `${Math.round(top0 + free * TOP_SHARE)}px`;
    // The text's own extent (a Range over it), not its block box, which always spans the full width.
    const box = (id) => {
      const range = document.createRange();
      range.selectNodeContents($(id));
      const r = range.getBoundingClientRect();
      return { x: r.left, y: r.top, right: r.right, bottom: r.bottom, scrollW: $(id).scrollWidth };
    };
    return {
      titleSize, titleLines, subSize, subLines,
      part: box('part'), title: box('title'), subtitle: box('subtitle'), block: box('block'),
      brand: box('brand'), site: box('site'),
    };
  }, { TITLE_SIZES, SUBTITLE_SIZES, SIDE, HAIRLINE_Y, W });
}

async function fontsLoaded(page) {
  return page.evaluate(async () => {
    const want = ['600 88px "OG Serif"', '600 22px "OG Sans"', '400 34px "OG Sans"'];
    for (const f of want) await document.fonts.load(f, 'Ag');
    const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
    return { serif: loaded.includes('OG Serif'), sans: loaded.includes('OG Sans'), checks: want.map((f) => document.fonts.check(f, 'Ag')) };
  });
}

export async function loadChapters() {
  const src = readFileSync(join(ROOT, 'src', 'lib', 'chapters.ts'), 'utf8');
  const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

export function partLabelFor(PARTS, slug) {
  const part = PARTS.find((p) => p.slugs.includes(slug));
  if (!part) throw new Error(`build-og-cards: ${slug} is in no part of PARTS`);
  return part.label;
}

async function main() {
  const dir = playwrightDir();
  const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
  const reportPath = process.argv.includes('--report') ? process.argv[process.argv.indexOf('--report') + 1] : null;
  const sharp = (await import('sharp')).default;
  const { CHAPTERS, PARTS } = await loadChapters();
  const outDir = join(ROOT, 'public', 'og', 'chapters');
  mkdirSync(outDir, { recursive: true });
  const ledgerPath = join(ROOT, 'scripts', 'og-cards.json');
  const ledger = {};
  const report = [];
  const problems = [];
  const { browser, page, load } = await openCardPage(dir);
  try {
    for (const chapter of CHAPTERS) {
      const inputs = cardInputs(chapter, partLabelFor(PARTS, chapter.slug));
      ledger[chapter.slug] = cardHash(inputs);
      if (only && !only.includes(chapter.slug)) continue;
      await load(cardHtml(inputs));
      const fonts = await fontsLoaded(page);
      if (!fonts.serif || !fonts.sans || fonts.checks.includes(false)) {
        throw new Error(`build-og-cards: the card fonts did not load for ${chapter.slug}: ${JSON.stringify(fonts)}`);
      }
      const geo = await layout(page);
      const right = W - SIDE;
      for (const k of ['part', 'title', 'subtitle']) {
        if (geo[k].x < SIDE - 0.5 || geo[k].right > right + 0.5 || geo[k].scrollW > W - 2 * SIDE) problems.push(`${chapter.slug}: ${k} crosses the side margin`);
      }
      if (geo.block.y < 40) problems.push(`${chapter.slug}: text block starts ${geo.block.y}px from the top`);
      if (geo.block.bottom > HAIRLINE_Y - 32) problems.push(`${chapter.slug}: text block ends ${HAIRLINE_Y - geo.block.bottom}px above the hairline`);
      if (geo.titleLines > 3 || geo.subLines > 2) problems.push(`${chapter.slug}: title ${geo.titleLines} lines, subtitle ${geo.subLines} lines`);
      const raw = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
      const png = await sharp(raw).png({ compressionLevel: 9, palette: true, colors: 256, effort: 10 }).toBuffer();
      writeFileSync(join(outDir, `${chapter.slug}.png`), png);
      report.push({ slug: chapter.slug, number: chapter.number, bytes: png.length, ...geo });
    }
  } finally {
    await browser.close();
  }
  if (!only) writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
  if (reportPath) writeFileSync(reportPath, JSON.stringify(report, null, 1));
  const total = report.reduce((n, r) => n + r.bytes, 0);
  const largest = report.reduce((a, r) => (r.bytes > (a?.bytes ?? 0) ? r : a), null);
  console.log(`build-og-cards: ${report.length} cards, ${total} bytes in all, largest ${largest?.slug} at ${largest?.bytes} bytes${only ? ' (ledger not written: --only)' : ''}`);
  if (problems.length) {
    console.error(`build-og-cards: ${problems.length} layout problem(s):\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
