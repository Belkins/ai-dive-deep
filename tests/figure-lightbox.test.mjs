import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// A chapter figure opens over the page, whole, and the reader gets back to exactly where they
// were. An earlier lightbox cut tall screenshots in half by stretching them to the window width,
// and a link that stops being a link loses Cmd-click and the no-script reader.
const source = readFileSync(new URL('../src/lib/figure-lightbox.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { installLightbox } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const component = readFileSync(new URL('../src/components/ScreenshotPlaceholder.astro', import.meta.url), 'utf8');

// A small fake DOM: just enough tree, events and dialog behaviour for the lightbox's contract.
class FakeEl {
  constructor(tag, doc) {
    Object.assign(this, { tagName: tag.toUpperCase(), doc, children: [], parent: null, listeners: {}, attrs: {}, dataset: {}, className: '', textContent: '', open: false });
  }
  append(...kids) { for (const k of kids) { k.parent = this; this.children.push(k); } }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); }
  get isConnected() { let n = this; while (n.parent) n = n.parent; return n === this.doc && this.doc.body === this.topBody(); }
  topBody() { let n = this; while (n.parent && n.parent !== this.doc) n = n.parent; return n; }
  closest(sel) {
    const [tag, cls] = sel.split('.');
    for (let n = this; n instanceof FakeEl; n = n.parent) if (n.tagName === tag.toUpperCase() && n.className.split(' ').includes(cls)) return n;
    return null;
  }
  querySelector(tag) {
    for (const c of this.children) { if (c.tagName === tag.toUpperCase()) return c; const d = c.querySelector(tag); if (d) return d; }
    return null;
  }
  focus() { this.doc.activeElement = this; }
  showModal() { this.open = true; }
  close() { if (!this.open) return; this.open = false; fire(this, { type: 'close' }); }
}
function fire(target, init) {
  const ev = { target, button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...init };
  for (let n = target; n; n = n.parent) for (const fn of n.listeners?.[ev.type] ?? []) fn(ev);
  return ev;
}
function page() {
  const doc = { listeners: {}, activeElement: null, addEventListener(t, fn) { (this.listeners[t] ??= []).push(fn); } };
  doc.createElement = (tag) => new FakeEl(tag, doc);
  doc.body = doc.createElement('body');
  doc.body.parent = doc;
  const link = doc.createElement('a');
  link.className = 'shot-link block no-underline';
  link.href = '/screens/47-measurement-layer-1.webp';
  const img = doc.createElement('img');
  img.alt = 'The honest scorecard';
  link.append(img);
  doc.body.append(link);
  installLightbox(doc);
  const dialog = () => doc.body.children.find((c) => c.tagName === 'DIALOG');
  return { doc, link, img, dialog };
}

test('a plain click on a figure opens it in the page with the same file and its caption', () => {
  const { link, img, dialog } = page();
  const ev = fire(img, { type: 'click' });
  assert.equal(ev.defaultPrevented, true, 'the link must not also open a new tab');
  const d = dialog();
  assert.ok(d && d.open, 'the dialog is shown as a modal');
  const picture = d.querySelector('img');
  assert.equal(picture.src, '/screens/47-measurement-layer-1.webp');
  assert.equal(picture.alt, 'The honest scorecard');
  assert.equal(d.querySelector('figcaption').textContent, 'The honest scorecard');
  assert.equal(d.attrs['aria-label'], 'The honest scorecard');
  assert.ok(link);
});

test('the visible close button says Close and returns focus to the figure', () => {
  const { doc, link, img, dialog } = page();
  fire(img, { type: 'click' });
  const button = dialog().querySelector('button');
  assert.equal(button.textContent, 'Close');
  assert.equal(button.type, 'button');
  fire(button, { type: 'click' });
  assert.equal(dialog().open, false);
  assert.equal(doc.activeElement, link);
});

test('a tap on the backdrop closes, a tap on the picture itself does not (pinch and pan)', () => {
  const { doc, link, img, dialog } = page();
  fire(img, { type: 'click' });
  fire(dialog().querySelector('img'), { type: 'click' });
  assert.equal(dialog().open, true, 'touching the picture keeps it open');
  fire(dialog(), { type: 'click' });
  assert.equal(dialog().open, false);
  assert.equal(doc.activeElement, link);
});

test('Esc (the dialog closing by itself) also returns focus to the figure', () => {
  const { doc, link, img, dialog } = page();
  fire(img, { type: 'click' });
  dialog().close();
  assert.equal(doc.activeElement, link);
});

test('Cmd-, Ctrl-, Shift- and middle-clicks keep the browser opening the file in a new tab', () => {
  for (const mods of [{ metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const { img, dialog } = page();
    const ev = fire(img, { type: 'click', ...mods });
    assert.equal(ev.defaultPrevented, false, JSON.stringify(mods));
    assert.equal(dialog(), undefined, JSON.stringify(mods));
  }
});

test('after a client-side navigation swaps the body, figures on the new page still open', () => {
  const { doc, img, dialog } = page();
  fire(img, { type: 'click' });
  dialog().close();
  const next = doc.createElement('body');
  next.parent = doc;
  doc.body = next;
  const link = doc.createElement('a');
  link.className = 'shot-link';
  link.href = '/screens/16-hooks-subagents-1.svg';
  const img2 = doc.createElement('img');
  img2.alt = 'Three-subagent fan-out';
  link.append(img2);
  next.append(link);
  fire(img2, { type: 'click' });
  const d = next.children.find((c) => c.tagName === 'DIALOG');
  assert.ok(d && d.open, 'a dialog is rebuilt in the new body');
  assert.equal(d.querySelector('img').src, '/screens/16-hooks-subagents-1.svg');
});

const rule = (selector) => {
  const at = component.indexOf(`${selector} {`);
  assert.notEqual(at, -1, `missing CSS rule ${selector}`);
  return component.slice(at, component.indexOf('}', at));
};

test('the open picture is fitted whole and never stretched past its own size', () => {
  const img = rule('.shot-dialog img');
  assert.match(img, /width: auto;/);
  assert.match(img, /height: auto;/);
  assert.match(img, /max-width: 100%;/);
  assert.match(img, /max-height: calc\(100dvh - 12rem\);/);
  assert.doesNotMatch(img, /(^|[^-])width: 100%|min-width|object-fit: cover/, 'stretching to the window width cuts tall screenshots');
});

test('the page behind cannot scroll while a figure is open, and motion waits for no-preference', () => {
  assert.match(component, /html:has\(\.shot-dialog\[open\]\) \{ overflow: hidden; \}/);
  const motion = component.slice(component.indexOf('@media (prefers-reduced-motion: no-preference)'));
  assert.match(motion, /\.shot-dialog\[open\] \{ animation: shot-fade/);
  assert.equal(component.match(/animation:/g).length, 1, 'no animation outside the reduced-motion query');
});

test('the open figure sits on the dark backdrop in both themes', () => {
  // The owner's pick: a dark backdrop whatever the reader's theme, because the figures are drawn dark. The
  // dialog's own rule declares the site's dark tokens (the :root values), so a light page cannot reach it.
  const bodies = [];
  for (let at = component.indexOf('.shot-dialog {'); at !== -1; at = component.indexOf('.shot-dialog {', at + 1)) {
    bodies.push(component.slice(at, component.indexOf('}', at)));
  }
  const own = bodies.join('\n');
  assert.match(own, /background: rgb\(var\(--bg\)\);/);
  assert.match(own, /color-scheme: dark;/);
  for (const token of ['--bg: 14 15 17;', '--fg: 250 250 247;', '--muted: 170 167 154;', '--line: 38 37 31;', '--paper: 22 23 27;']) {
    assert.ok(own.includes(token), `the dialog lost the dark token ${token}`);
  }
  assert.doesNotMatch(component, /\[data-theme[^\]]*\][^{]*\.shot-dialog|prefers-color-scheme/, 'no theme rule may repaint the dialog');
  assert.doesNotMatch(component, /data-backdrop/, 'one backdrop, no switch');
});
