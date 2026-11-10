import { useEffect, useRef, useState } from 'react';
import { copyMessage, copyText, COPY_FAILURE_MS } from '@/lib/copy-feedback';

export type CopyStatus = 'idle' | 'copied' | 'failed';

/** Copy with a visible state plus a screen-reader message; both reset after a delay. */
export function useCopy(resetMs = 1500) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async (text: string) => {
    const result = await copyText(text);
    setStatus(result);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), result === 'copied' ? resetMs : COPY_FAILURE_MS);
  };
  // Cleared on reset so the next copy is announced again.
  const message = status === 'idle' ? '' : copyMessage(status);
  return { status, copy, message };
}

/** Visually hidden live region; render it always so the message change is announced. */
export function CopyLiveRegion({ message }: { message: string }) {
  return <span role="status" aria-live="polite" className="sr-only">{message}</span>;
}
