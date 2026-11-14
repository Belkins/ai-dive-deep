import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { shikiConfig } from '../src/lib/code-colours.mjs';

// Code in the light theme was pale: the dark highlighter colours sat on the light surface.
// The light code theme (src/lib/code-colours.mjs) must leave every token a reader sees at
// WCAG AA, 4.5:1, against the surface behind it, and must leave dark pages as they were.
const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

const block = (selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `global.css has a ${selector} block`);
  return css.slice(at, css.indexOf('}', at));
};
const tokensOf = (body) => Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*(\d+ \d+ \d+);/g)].map((m) => [m[1], m[2].split(' ').map(Number)]));
const darkTokens = tokensOf(block(':root'));
const lightTokens = { ...darkTokens, ...tokensOf(block("[data-theme='light']")) };

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

// Every foreground a theme can paint, leaving out rules that bring their own background.
async function themeColours(theme) {
  const t = typeof theme === 'string'
    ? (await import(new URL(`../node_modules/@shikijs/themes/dist/${theme}.mjs`, import.meta.url))).default
    : theme;
  const out = [t.colors['editor.foreground']];
  for (const rule of t.tokenColors) if (rule.settings.foreground && !rule.settings.background) out.push(rule.settings.foreground);
  return out;
}
const lightSurface = () => lightTokens[block("[data-theme='light'] pre.astro-code-themes").match(/background: rgb\(var\(--([a-z0-9-]+)\)\)/)[1]];

test('every token colour in the light theme reaches 4.5:1 on its code surface', async () => {
  const cfg = shikiConfig();
  assert.equal(cfg.themes.light, 'github-light-high-contrast');
  const surface = lightSurface();
  for (const c of (await themeColours(cfg.themes.light)).map(hex)) {
    assert.ok(ratio(c, surface) >= 4.5, `${c.join(' ')} on ${surface.join(' ')} is ${ratio(c, surface).toFixed(2)}:1`);
  }
});

test('dark pages keep github-dark-dimmed as the colour written inline', () => {
  const cfg = shikiConfig();
  assert.equal(cfg.themes.dark, 'github-dark-dimmed');
  assert.equal(cfg.defaultColor, 'dark');
});

test('the light site theme paints each token with its light colour, over the inline dark one', () => {
  assert.match(css, /\[data-theme='light'\] \.astro-code-themes span \{ color: var\(--shiki-light\) !important; \}/);
});

test('inline code in the flame accent sits on --paper in the light theme, where it reads at 4.5:1', () => {
  const rule = css.match(/\[data-theme='light'\] :is\(a code, code\[style\*='--accent'\]\) \{ background: rgb\(var\(--([a-z0-9-]+)\)\); \}/);
  assert.ok(rule, 'global.css gives linked and accent inline code its own light background');
  const surface = lightTokens[rule[1]];
  assert.ok(ratio(lightTokens.accent, surface) >= 4.5, `accent on ${surface.join(' ')} is ${ratio(lightTokens.accent, surface).toFixed(2)}:1`);
});
