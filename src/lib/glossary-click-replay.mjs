// A glossary term is an Astro island that loads its script when it scrolls into view
// (client:visible). Until that script has loaded the term is plain HTML, and a click on it
// did nothing. This remembers a click made in that gap and repeats it once the term is ready.

/** A remembered click is dropped after this long: the reader has moved on. */
export const REPLAY_WINDOW_MS = 8000;
/** A second tap that lands just after the repeated click would close the pop-up it opened. */
export const ECHO_GUARD_MS = 500;

export function installGlossaryClickReplay(doc, now = () => performance.now()) {
  let waiting = null; // { term, at }: a click on a term that was not ready
  let repeated = null; // { term, at }: the click this code repeated
  let repeating = false;

  doc.addEventListener(
    'click',
    (event) => {
      if (repeating) return;
      const term = event.target?.closest?.('.glossary-term') ?? null;
      if (term && repeated?.term === term && now() - repeated.at < ECHO_GUARD_MS) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      // A click anywhere else, or on a term that is ready, forgets the remembered one.
      const island = term?.closest('astro-island');
      waiting = island?.hasAttribute('ssr') ? { term, at: now() } : null;
    },
    true,
  );

  // Astro fires this on the island once its component has been handed to React. The event does
  // not bubble, so it is caught on the way down.
  doc.addEventListener(
    'astro:hydrate',
    (event) => {
      const island = event.target;
      if (!waiting || !island?.contains?.(waiting.term)) return;
      const { at } = waiting;
      waiting = null;
      if (now() - at > REPLAY_WINDOW_MS) return;
      const term = island.querySelector('.glossary-term');
      if (!term) return;
      repeated = { term, at: now() };
      repeating = true;
      try {
        term.click();
      } finally {
        repeating = false;
      }
    },
    true,
  );
}
