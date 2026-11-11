// Renders public/og-default.svg to public/og-default.png, the share card of every page that has
// no card of its own. Run it after the SVG changes:
//   node scripts/build-og-default.mjs --playwright <folder of the playwright-core package>
// (or set OG_PLAYWRIGHT), then record the SVG's new hash in scripts/numbers-ledger.json.
//
// It reuses the chapter cards' route (scripts/build-og-cards.mjs): a private page whose fonts come
// from public/fonts by path, so the card gets the site's own Source Serif 4 and Inter whatever is
// installed on the machine. The SVG is drawn exactly as written: no word or number is touched.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fontFaceCss, H, openCardPage, playwrightDir, W } from './build-og-cards.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SVG = join(ROOT, 'public', 'og-default.svg');
const PNG = join(ROOT, 'public', 'og-default.png');

const svg = readFileSync(SVG, 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaceCss({ 'OG Serif': 'Source Serif 4', 'OG Sans': 'Inter' })}
html, body { margin: 0; padding: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #0E0F11; }
body { -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; }
svg { display: block; }
</style></head><body>${svg}</body></html>`;

const sharp = (await import('sharp')).default;
const { browser, page, load } = await openCardPage(playwrightDir());
try {
  await load(html);
  // Every <text> must resolve to a face the page loaded from public/fonts: the serif where the
  // SVG asks for it, Inter elsewhere. A family name the browser cannot parse falls back silently,
  // so the check reads the family each element ended up with and the fonts that loaded.
  const fonts = await page.evaluate(async () => {
    await document.fonts.load('600 116px "Source Serif 4"', 'Ag');
    await document.fonts.load('600 22px "Inter"', 'Ag');
    const loaded = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
    const texts = [...document.querySelectorAll('text')].map((t) => ({ text: t.textContent.slice(0, 40), family: getComputedStyle(t).fontFamily, asks: t.getAttribute('font-family') || t.closest('[font-family]').getAttribute('font-family') }));
    return { loaded: [...new Set(loaded)], texts };
  });
  const bad = fonts.texts.filter((t) => (/Source Serif 4/.test(t.asks) ? !/^"?Source Serif 4/.test(t.family) : !/^"?Inter/.test(t.family)));
  if (!fonts.loaded.includes('Source Serif 4') || !fonts.loaded.includes('Inter') || bad.length) {
    throw new Error(`build-og-default: a card face did not resolve: ${JSON.stringify(fonts)}`);
  }
  const raw = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
  const png = await sharp(raw).png({ compressionLevel: 9, palette: true, colors: 256, effort: 10 }).toBuffer();
  writeFileSync(PNG, png);
  console.log(`build-og-default: public/og-default.png ${png.length} bytes; faces ${JSON.stringify(fonts.texts.map((t) => [t.text, t.family]))}`);
} finally {
  await browser.close();
}
