import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// The glossary filter box (src/components/GlossaryFilter.astro). A reader types and keeps only the terms whose
// name or definition holds the words; letters left empty disappear from the list and from the A-Z links; the count
// says how many match; Esc and "Clear filter" bring everything back; a link to a term the filter hid clears the
// filter first, because otherwise the jump lands on nothing.
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const toModule = (source) => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString('base64')}`;
const { normalizeSearchText } = await import(toModule(read('../src/lib/search.ts')));
const source = read('../src/components/GlossaryFilter.astro');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*$/m, '');
const compiled = ts.transpileModule(script, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;

const TERMS = [
  ['A', 'Agent', 'A model that calls tools in a loop.'],
  ['A', 'API', 'Application programming interface.'],
  ['C', 'Claude Code', 'Run <code>claude</code> in your terminal.'],
  ['C', 'Cron', 'Schedules a job. The résumé example runs at 7.'],
  ['M', 'MCP', 'Model Context Protocol, revised for 5.5.'],
];

function node(props = {}) {
  const attrs = new Map();
  return Object.assign(new EventTarget(), { hidden: false, parent: null, attrs,
    getAttribute: (name) => attrs.get(name) ?? null,
    closest(selector) {
      for (let el = this; el; el = el.parent) {
        if (selector === '[hidden]' && el.hidden) return el;
        if (selector === 'li' && el.tag === 'li') return el;
        if (selector === 'a[href^="#"]' && el.tag === 'a' && String(attrs.get('href')).startsWith('#')) return el;
      }
      return null;
    } }, props);
}

function page() {
  const byId = new Map();
  const groups = [];
  const entries = [];
  const tocLinks = [];
  for (const letter of ['A', 'C', 'M']) {
    const group = node({ dataset: { letter: `letter-${letter}` } });
    group.querySelector = (sel) => {
      assert.equal(sel, '[data-term]:not([hidden])');
      return entries.find((e) => e.parent === group && !e.hidden) ?? null;
    };
    groups.push(group);
    // Each letter has a link in the phone drawer and one in the laptop rail.
    for (let i = 0; i < 2; i++) {
      const li = node({ tag: 'li' });
      const a = node({ tag: 'a', parent: li, parentElement: li });
      a.attrs.set('data-toc-link', `letter-${letter}`);
      tocLinks.push(a);
    }
  }
  for (const [letter, term, html] of TERMS) {
    const text = html.replace(/<[^>]+>/g, '');
    const entry = node({ id: term, parent: groups.find((g) => g.dataset.letter === `letter-${letter}`),
      querySelector: (sel) => ({ dt: { textContent: term }, dd: { textContent: text } })[sel] });
    entries.push(entry);
    byId.set(term, entry);
  }
  const input = node({ value: '', focused: false, focus() { this.focused = true; } });
  const count = node({ textContent: '' });
  const query = { textContent: '' };
  const empty = node({ hidden: true, querySelector: () => query });
  const clearButton = node();
  // A Related link inside "Claude Code" pointing at MCP.
  const relatedToMcp = node({ tag: 'a', parent: byId.get('Claude Code') });
  relatedToMcp.attrs.set('href', '#MCP');
  for (const [id, el] of Object.entries({ 'glossary-q': input, 'glossary-count': count, 'glossary-empty': empty, 'glossary-clear': clearButton })) byId.set(id, el);
  const document = Object.assign(new EventTarget(), {
    getElementById: (id) => byId.get(id) ?? null,
    querySelectorAll: (sel) => {
      if (sel === '[data-letter]') return groups;
      if (sel === '[data-term]') return entries;
      const m = sel.match(/^\[data-toc-link="(.+)"\]$/);
      assert.ok(m, `unexpected selector ${sel}`);
      return tocLinks.filter((a) => a.attrs.get('data-toc-link') === m[1]);
    },
  });
  const window = new EventTarget();
  const location = { hash: '' };
  runInNewContext(compiled, { document, window, location, norm: normalizeSearchText, Event });
  document.dispatchEvent(new Event('astro:page-load'));
  const type = (value) => { input.value = value; input.dispatchEvent(new Event('input')); };
  const shown = () => entries.filter((e) => !e.hidden).map((e) => e.id);
  const lettersShown = () => groups.filter((g) => !g.hidden).map((g) => g.dataset.letter);
  const linksShown = () => tocLinks.filter((a) => !a.parent.hidden).map((a) => a.attrs.get('data-toc-link'));
  const click = (target) => {
    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: target });
    document.dispatchEvent(event);
  };
  return { input, count, empty, query, clearButton, window, location, relatedToMcp, type, shown, lettersShown, linksShown, click };
}

test('words found only in a definition keep that term, and empty letters leave the list and both A-Z lists', () => {
  const p = page();
  p.type('terminal');
  assert.deepEqual(p.shown(), ['Claude Code']);
  assert.deepEqual(p.lettersShown(), ['letter-C']);
  assert.deepEqual(p.linksShown(), ['letter-C', 'letter-C']);
  assert.equal(p.count.textContent, 'Showing 1 of 5 terms');
  assert.equal(p.empty.hidden, true);
});

test('matching ignores case and accents, keeps version numbers whole, and takes words in any order', () => {
  const p = page();
  p.type('RESUME');
  assert.deepEqual(p.shown(), ['Cron']);
  p.type('Résumé');
  assert.deepEqual(p.shown(), ['Cron'], 'an accented query matches the same terms');
  p.type('5.5');
  assert.deepEqual(p.shown(), ['MCP']);
  p.type('terminal claude');
  assert.deepEqual(p.shown(), ['Claude Code']);
});

test('an empty box shows every term and no count', () => {
  const p = page();
  p.type('agent');
  p.type('   ');
  assert.equal(p.shown().length, 5);
  assert.equal(p.count.textContent, '');
});

test('a query with no match says so, names the query, and Clear filter restores the list', () => {
  const p = page();
  p.type('zebra');
  assert.deepEqual(p.shown(), []);
  assert.equal(p.count.textContent, 'Showing 0 of 5 terms');
  assert.equal(p.empty.hidden, false);
  assert.equal(p.query.textContent, 'zebra');
  p.clearButton.dispatchEvent(new Event('click'));
  assert.equal(p.input.value, '');
  assert.equal(p.shown().length, 5);
  assert.equal(p.empty.hidden, true);
  assert.equal(p.input.focused, true);
});

test('Escape clears a typed filter', () => {
  const p = page();
  p.type('agent');
  const key = Object.assign(new Event('keydown', { cancelable: true }), { key: 'Escape' });
  p.input.dispatchEvent(key);
  assert.equal(p.input.value, '');
  assert.equal(p.shown().length, 5);
  assert.equal(key.defaultPrevented, true);
});

test('a Related link to a hidden term clears the filter before the jump; one to a shown term keeps it', () => {
  const p = page();
  p.type('terminal');
  p.click(p.relatedToMcp);
  assert.equal(p.input.value, '');
  assert.equal(p.shown().length, 5);
  p.type('protocol claude');
  assert.deepEqual(p.shown(), []);
  p.type('model');
  assert.deepEqual(p.shown(), ['Agent', 'MCP']);
  p.click(p.relatedToMcp);
  assert.equal(p.input.value, 'model');
});

test('arriving at a hidden term by its address (Cmd-K, a typed #term) clears the filter', () => {
  const p = page();
  p.type('terminal');
  p.location.hash = '#Agent';
  p.window.dispatchEvent(new Event('hashchange'));
  assert.equal(p.input.value, '');
  assert.equal(p.shown().length, 5);
});

test('the filter markup gives the box a real label and announces the count politely', () => {
  assert.match(source, /<label for="glossary-q"[^>]*>Filter terms<\/label>/);
  assert.match(source, /<input id="glossary-q" type="search"/);
  assert.match(source, /id="glossary-count" role="status" aria-live="polite"/);
});

test('the filter sits under the page intro, above the list, at most 576 px wide', () => {
  // The owner's pick: the box sits on top, under the intro, before the A-Z links and the list, 576 px wide
  // at most. Tailwind's max-w-xl is 36rem, 36 x 16 = 576 px; no other max-w class may hold that width.
  const page = read('../src/pages/glossary.astro');
  const intro = page.slice(page.indexOf('<h1>'), page.indexOf('</section>'));
  const wrap = intro.match(/<div class="([^"]+)"><GlossaryFilter \/><\/div>/);
  assert.ok(wrap, 'the filter left the page intro');
  const REM = { 'max-w-lg': 32, 'max-w-xl': 36, 'max-w-2xl': 42, 'max-w-3xl': 48 };
  const widths = wrap[1].split(/\s+/).filter((c) => c in REM).map((c) => REM[c] * 16);
  assert.deepEqual(widths, [576]);
  assert.equal(page.match(/<GlossaryFilter\b/g).length, 1, 'one filter on the page');
  assert.ok(page.indexOf('<GlossaryFilter') < page.indexOf('<SectionNav'), 'the filter comes before the A-Z links');
  assert.ok(page.indexOf('<GlossaryFilter') < page.indexOf('<dl id="glossary-list"'), 'the filter comes before the list');
});

test('the filter box edge reads at 3:1 against the page and the box in both themes', () => {
  // A form control's edge needs 3:1 (WCAG 1.4.11). The edge is --muted at an alpha over the box's own --paper
  // fill and next to the page's --bg; at 0.6 it was 2.73:1 in the light theme.
  const css = read('../src/styles/global.css');
  const tokens = (sel) => {
    const at = css.indexOf(`${sel} {`);
    return Object.fromEntries([...css.slice(at, css.indexOf('}', at)).matchAll(/--([a-z0-9-]+):\s*(\d+ \d+ \d+);/g)].map((m) => [m[1], m[2].split(' ').map(Number)]));
  };
  const dark = tokens(':root');
  const light = { ...dark, ...tokens("[data-theme='light']") };
  const lum = (c) => { const v = c.map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const [, token, alpha] = source.match(/\.gl-filter input \{[^}]*border: 1px solid rgb\(var\(--([a-z0-9-]+)\) \/ ([\d.]+)\);/);
  assert.match(source, /\.gl-filter input \{[^}]*background: rgb\(var\(--paper\)\);/);
  for (const [name, t] of [['light', light], ['dark', dark]]) {
    for (const ground of ['paper', 'bg']) {
      const edge = t[token].map((v, i) => v * Number(alpha) + t[ground][i] * (1 - Number(alpha)));
      const got = ratio(edge, t[ground]);
      assert.ok(got >= 3, `${name}: the edge on --${ground} is ${got.toFixed(2)}:1`);
    }
  }
});
