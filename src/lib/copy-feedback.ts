// Shared copy-to-clipboard feedback: the React widgets (src/widgets/useCopy.tsx) and the
// inline page scripts (cfo-case, research-notes) announce the same two messages.
export const COPY_SUCCESS_MESSAGE = 'Copied to clipboard';
export const COPY_FAILURE_MESSAGE = 'Copy failed. Select the text and copy it by hand.';
// A failure message is longer than a "Copied" flash, so it stays up long enough to read.
export const COPY_FAILURE_MS = 4000;

export type CopyResult = 'copied' | 'failed';

type ClipboardLike = { writeText?: (text: string) => Promise<void> } | undefined | null;

/** Writes text to the clipboard and reports the outcome instead of throwing. */
export async function copyText(text: string, clipboard: ClipboardLike = globalThis.navigator?.clipboard): Promise<CopyResult> {
  try {
    if (!clipboard || typeof clipboard.writeText !== 'function') return 'failed';
    await clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export function copyMessage(result: CopyResult): string {
  return result === 'copied' ? COPY_SUCCESS_MESSAGE : COPY_FAILURE_MESSAGE;
}

/** The visually hidden live region the inline page scripts announce through. Create it on page
 *  load, before the first copy, so screen readers register it before its text changes. */
export function copyLiveRegion(doc: Document = document): HTMLElement {
  let region = doc.getElementById('copy-status');
  if (!region) {
    region = doc.createElement('span');
    region.id = 'copy-status';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.className = 'sr-only';
    doc.body.appendChild(region);
  }
  return region;
}
