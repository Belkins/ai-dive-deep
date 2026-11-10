import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { installGlossaryClickReplay } from '../src/lib/glossary-click-replay.mjs';

// A glossary term answers clicks only after its script has loaded, which starts when the term
// scrolls into view. A reader who clicks in that gap must still get the pop-up, exactly once.
//
// The page is modelled as far as the code reads it: listeners registered on the document for
// the way down, a term inside an island that carries the `ssr` attribute until it is ready,
// and a pop-up that toggles on every click the ready term receives.
function makePage() {
  const listeners = { click: [], 'astro:hydrate': [] };
  const clock = { ms: 0 };
  const doc = {
    addEventListener(type, listener, onTheWayDown) {
      assert.equal(onTheWayDown, true, `${type} must be caught on the way down`);
      listeners[type].push(listener);
    },
  };
  const send = (type, target) => {
    let stopped = false;
    const event = { target, preventDefault() {}, stopPropagation() { stopped = true; } };
    for (const listener of listeners[type]) listener(event);
    return !stopped;
  };
  const addTerm = ({ ready = false } = {}) => {
    const island = {
      ready,
      hasAttribute: (name) => name === 'ssr' && !island.ready,
      contains: (node) => node === island || node === term,
      querySelector: (selector) => (selector === '.glossary-term' ? term : null),
    };
    const term = {
      open: false,
      toggles: 0,
      closest: (selector) => (selector === '.glossary-term' ? term : selector === 'astro-island' ? island : null),
      // What the browser does with a click on the term: the document sees it first, and the
      // pop-up toggles only when the term is ready and nothing stopped the click.
      click() {
        if (send('click', term) && island.ready) {
          term.toggles += 1;
          term.open = !term.open;
        }
      },
      wake() {
        island.ready = true;
        send('astro:hydrate', island);
      },
    };
    return term;
  };
  const elsewhere = { closest: () => null };
  installGlossaryClickReplay(doc, () => clock.ms);
  return { addTerm, clock, clickElsewhere: () => send('click', elsewhere) };
}

test('a click on a term that is not ready yet opens the pop-up once the term wakes up', () => {
  const page = makePage();
  const term = page.addTerm();
  term.click();
  assert.equal(term.open, false, 'nothing can open before the term is ready');
  page.clock.ms = 900;
  term.wake();
  assert.deepEqual([term.open, term.toggles], [true, 1]);
  term.wake();
  assert.deepEqual([term.open, term.toggles], [true, 1], 'a second wake-up repeats nothing');
});

test('two impatient clicks before the term is ready still open the pop-up once', () => {
  const page = makePage();
  const term = page.addTerm();
  term.click();
  page.clock.ms = 300;
  term.click();
  page.clock.ms = 900;
  term.wake();
  assert.deepEqual([term.open, term.toggles], [true, 1]);
});

test('a tap that lands just after the repeated click does not close the pop-up; a later one does', () => {
  const page = makePage();
  const term = page.addTerm();
  term.click();
  page.clock.ms = 900;
  term.wake();
  page.clock.ms = 900 + 300;
  term.click();
  assert.deepEqual([term.open, term.toggles], [true, 1], 'a tap 300 ms after the repeat is ignored');
  page.clock.ms = 900 + 600;
  term.click();
  assert.deepEqual([term.open, term.toggles], [false, 2], 'a tap 600 ms after the repeat closes it as usual');
});

test('a click on a term that is already ready is left alone', () => {
  const page = makePage();
  const term = page.addTerm({ ready: true });
  term.click();
  assert.deepEqual([term.open, term.toggles], [true, 1]);
  page.clock.ms = 2000;
  term.wake();
  assert.deepEqual([term.open, term.toggles], [true, 1], 'nothing was remembered, so nothing is repeated');
});

test('a remembered click is forgotten when the reader clicks elsewhere', () => {
  const page = makePage();
  const term = page.addTerm();
  term.click();
  page.clickElsewhere();
  page.clock.ms = 900;
  term.wake();
  assert.deepEqual([term.open, term.toggles], [false, 0]);
});

test('a click is repeated up to 8 seconds later and not after that', () => {
  const late = makePage();
  const slowTerm = late.addTerm();
  slowTerm.click();
  late.clock.ms = 7900;
  slowTerm.wake();
  assert.equal(slowTerm.open, true, 'a term that took 7.9 s still opens');

  const tooLate = makePage();
  const staleTerm = tooLate.addTerm();
  staleTerm.click();
  tooLate.clock.ms = 8100;
  staleTerm.wake();
  assert.deepEqual([staleTerm.open, staleTerm.toggles], [false, 0], 'after 8.1 s the reader has moved on');
});

test('the click is repeated on the term that was clicked, not on another term that woke up', () => {
  const page = makePage();
  const clicked = page.addTerm();
  const other = page.addTerm();
  clicked.click();
  page.clock.ms = 400;
  other.wake();
  assert.deepEqual([clicked.toggles, other.toggles], [0, 0]);
  page.clock.ms = 900;
  clicked.wake();
  assert.deepEqual([clicked.open, other.open], [true, false]);
});

test('every page that shows a glossary term installs the repeat', () => {
  const wrapper = readFileSync(new URL('../src/components/GlossaryTooltip.astro', import.meta.url), 'utf8');
  assert.match(wrapper, /<GlossaryPopover term=\{term\} client:visible>/, 'the term still wakes up when it is scrolled into view');
  assert.match(wrapper, /<script>[\s\S]*installGlossaryClickReplay\(document\);[\s\S]*<\/script>/);
});
