import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// The current section in a chapter's contents (the box on phones, the rail on laptops) is the reader's
// "you are here". Its text must read at WCAG AA, 4.5:1, against the tint it sits on in the light theme, and
// the dark theme must keep the colour it had (34 211 160).
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const css = read('../src/styles/global.css');
const block = (selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `global.css has a ${selector} block`);
  return css.slice(at, css.indexOf('}', at));
};
const tokensOf = (body) => Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*(\d+ \d+ \d+);/g)].map((m) => [m[1], m[2].split(' ').map(Number)]));
const dark = tokensOf(block(':root'));
const light = { ...dark, ...tokensOf(block("[data-theme='light']")) };

const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const over = (top, alpha, under) => top.map((v, i) => v * alpha + under[i] * (1 - alpha));

// The active rule's text token and its tint (token and alpha), read from the component.
const activeRule = (file, selector) => {
  const src = read(file);
  const at = src.indexOf(selector);
  assert.ok(at >= 0, `${file} styles ${selector}`);
  const body = src.slice(at, src.indexOf('}', at));
  const color = body.match(/\bcolor: rgb\(var\(--([a-z0-9-]+)\)\);/)[1];
  const [, tint, alpha] = body.match(/background: rgb\(var\(--([a-z0-9-]+)\) \/ ([\d.]+)\);/);
  return { color, tint, alpha: Number(alpha) };
};
const places = [
  // The box is filled with --paper (its inline style); the rail sits on the page, --bg.
  { name: 'the contents box', file: '../src/components/ChapterToc.astro', selector: '.chapter-toc .toc-link[data-active="true"] {', ground: 'paper' },
  { name: 'the laptop rail', file: '../src/components/ChapterRail.astro', selector: ".chapter-rail-link[data-active='true'] {", ground: 'bg' },
];

test('the current section reads at 4.5:1 in the light theme, in the box and in the rail', () => {
  assert.match(read('../src/components/ChapterToc.astro'), /class="chapter-toc[^"]*" style="[^"]*background: rgb\(var\(--paper\)\)/);
  for (const p of places) {
    const r = activeRule(p.file, p.selector);
    const ground = over(light[r.tint], r.alpha, light[p.ground]);
    const got = ratio(light[r.color], ground);
    assert.ok(got >= 4.5, `${p.name}: ${light[r.color].join(' ')} on its tint is ${got.toFixed(2)}:1`);
  }
});

test('the dark theme keeps the current section in 34 211 160', () => {
  for (const p of places) {
    const r = activeRule(p.file, p.selector);
    assert.deepEqual(dark[r.color], [34, 211, 160], `${p.name} changed colour in the dark theme`);
  }
});
