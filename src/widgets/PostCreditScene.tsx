import { useEffect, useState } from 'react';

type Props = { children?: React.ReactNode };

// Post-credit scene — hidden until the reader reaches the bottom of the page
// AND lingers ~1.5s. Respects prefers-reduced-motion (instant reveal).
// Reveal once; subsequent scrolls don't re-trigger.
export default function PostCreditScene({ children }: Props) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setRevealed(true); return; }

    let timer: number | null = null;
    const check = () => {
      const doc = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 24;
      if (atBottom && timer == null) {
        timer = window.setTimeout(() => setRevealed(true), 1500);
      } else if (!atBottom && timer != null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => {
      window.removeEventListener('scroll', check);
      if (timer != null) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      aria-hidden={!revealed}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 700ms ease-out, transform 700ms ease-out',
        pointerEvents: revealed ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  );
}
