import { useEffect, useRef, useState } from 'react';

type Stat = { value: number; label: string; suffix?: string; prefix?: string };
type Props = { stats: Stat[]; duration?: number };

export default function LaunchCountUp({ stats, duration = 900 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<number[]>(() => stats.map(() => 0));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVals(stats.map((s) => s.value));
      setStarted(true);
      return;
    }
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            setStarted(true);
            const start = performance.now();
            const ease = (t: number) => 1 - Math.pow(1 - t, 4);
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const e = ease(t);
              setVals(stats.map((s) => Math.round(s.value * e)));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [stats, duration, started]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8"
    >
      {stats.map((s, i) => (
        <div key={s.label} className="text-left">
          <div
            className="font-display tabular-nums leading-none"
            style={{
              color: 'rgb(var(--fg))',
              fontWeight: 600,
              fontSize: 'clamp(2.1rem, 4.5vw, 3.6rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {s.prefix ?? ''}{vals[i].toLocaleString()}{s.suffix ?? ''}
          </div>
          <div
            className="mt-2 text-xs uppercase tracking-[0.2em]"
            style={{ color: 'rgb(var(--muted))' }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
