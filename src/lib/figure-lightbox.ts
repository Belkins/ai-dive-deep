// Chapter figures open over the page in one native <dialog> instead of leaving the book for a
// bare image file. The link stays a plain link: without script, or on a middle-, Cmd- or
// Ctrl-click, it opens the file in a new tab as before. Sizing lives in the CSS beside
// ScreenshotPlaceholder.astro: the picture is fitted whole and never enlarged past its own size.

export const CLOSE_LABEL = 'Close';

interface ClickLike {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}

/** A plain primary click or Enter; anything with a modifier keeps the browser's own new-tab behaviour. */
export const isPlainActivation = (e: ClickLike): boolean =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;

export function installLightbox(doc: Document): void {
  let dialog: HTMLDialogElement | undefined;
  let image: HTMLImageElement;
  let caption: HTMLElement;
  let opener: HTMLElement | null = null;

  const build = (): HTMLDialogElement => {
    const d = doc.createElement('dialog');
    d.className = 'shot-dialog';
    const close = doc.createElement('button');
    close.type = 'button';
    close.className = 'shot-close';
    close.textContent = CLOSE_LABEL;
    const figure = doc.createElement('figure');
    image = doc.createElement('img');
    image.decoding = 'async';
    caption = doc.createElement('figcaption');
    figure.append(image, caption);
    d.append(close, figure);
    // Any click but one on the picture closes it: the backdrop, the caption, the close button.
    // Taps on the picture itself stay, so a reader can pinch and pan without losing it.
    d.addEventListener('click', (e) => {
      if (e.target !== image) d.close();
    });
    // Esc, the button and the backdrop all end here; focus goes back to the figure's link.
    d.addEventListener('close', () => {
      opener?.focus();
      opener = null;
    });
    doc.body.append(d);
    dialog = d;
    return d;
  };

  // One listener on the document survives client-side navigation (ClientRouter swaps the body,
  // so the dialog is rebuilt when the old one is gone).
  doc.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest?.('a.shot-link') as HTMLAnchorElement | null;
    const inline = link?.querySelector('img');
    if (!link || !inline || !isPlainActivation(e)) return;
    e.preventDefault();
    const d = dialog?.isConnected ? dialog : build();
    image.src = link.href;
    image.alt = inline.alt;
    caption.textContent = inline.alt;
    d.setAttribute('aria-label', inline.alt);
    opener = link;
    d.showModal();
  });
}
