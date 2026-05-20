import { useEffect, useState } from 'react';

type Props = { text: string; speed?: number };

export default function LaunchTypewriter({ text, speed = 55 }: Props) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(text);
      setDone(true);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <span aria-label={text}>
      <span>{shown}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[0.06em] h-[0.85em] align-baseline ml-[0.05em]"
        style={{
          background: 'rgb(var(--accent))',
          transform: 'translateY(0.06em)',
          animation: done ? 'lt-blink 1.05s steps(2,end) infinite' : 'none',
          opacity: done ? 1 : 0.95,
        }}
      />
      <style>{`@keyframes lt-blink { 0%,50% {opacity:1} 50.01%,100% {opacity:0} }`}</style>
    </span>
  );
}
