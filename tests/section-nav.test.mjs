import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/SectionNav.astro', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
const compiled = ts.transpileModule(script, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
function page(ids = ['purpose', 'procedure']) {
  const drawers = ids.map(() => ({ open: true }));
  const links = ids.map((id, i) => {
    const attributes = new Map([['data-toc-link', id]]);
    return Object.assign(new EventTarget(), {
      getAttribute: name => attributes.get(name),
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
      closest: selector => { assert.equal(selector, 'details'); return drawers[i]; },
    });
  });
  const heads = new Map(ids.map((id, i) => [id, { id, getBoundingClientRect: () => ({ top: i * 100 }) }]));
  return { links, drawers, heads };
}
function harness(withObserver = true) {
  let current = page();
  const observers = [];
  class Observer {
    observed = [];
    disconnected = false;
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.observed.push(target); }
    disconnect() { this.disconnected = true; }
  }
  const document = Object.assign(new EventTarget(), {
    querySelectorAll: selector => { assert.equal(selector, '[data-section-nav] a[data-toc-link]'); return current.links; },
    getElementById: id => current.heads.get(id) || null,
  });
  runInNewContext(compiled, { document, window: withObserver ? { IntersectionObserver: Observer } : {}, IntersectionObserver: Observer });
  return { document, observers, get page() { return current; }, setPage: next => { current = next; }, load: () => document.dispatchEvent(new Event('astro:page-load')) };
}
test('section links close their own drawer even without IntersectionObserver', () => {
  const h = harness(false);
  h.page.links[1].dispatchEvent(new Event('click'));
  assert.equal(h.page.drawers[1].open, false);
  assert.equal(h.page.drawers[0].open, true);
  assert.equal(h.observers.length, 0);
});
test('client navigation disconnects old observers and binds the new drawer once', () => {
  const h = harness();
  const old = h.page;
  h.document.dispatchEvent(new Event('astro:before-swap'));
  assert.equal(h.observers[0].disconnected, true);
  assert.equal(getEventListeners(old.links[0], 'click').length, 0);
  h.setPage(page(['new-target']));
  h.load();
  h.page.links[0].dispatchEvent(new Event('click'));
  assert.equal(h.page.drawers[0].open, false);
  assert.equal(h.page.links[0].getAttribute('aria-current'), 'location');
  h.load();
  assert.equal(getEventListeners(h.page.links[0], 'click').length, 1);
  assert.equal(h.observers.filter(observer => !observer.disconnected).length, 1);
});
test('disposed observer callbacks do not alter a later page', () => {
  const h = harness();
  const observer = h.observers[0];
  h.setPage(page(['replacement']));
  h.load();
  observer.callback([{ target: { id: 'procedure' }, isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(h.page.links[0].getAttribute('aria-current'), 'location');
  h.setPage(page([]));
  h.load();
  assert.equal(h.observers.filter(item => !item.disconnected).length, 0);
});
