import { useEffect, useRef, useState } from 'react';

const SHIFTS = [
  { time: '6:30 AM', job: 'Morning briefing', artifact: 'morning-brief.canvas', icon: '☀' },
  { time: '4:00 PM Fri', job: 'Friday wrap-up', artifact: 'friday-wrap.canvas', icon: '🗓' },
  { time: '5:00 PM', job: 'Deal-advancement alerts', artifact: 'deal-ticker.dm', icon: '↗' },
  { time: '7:00 PM', job: 'Vault sync', artifact: 'vault.md', icon: '⌥' },
];

type Stage = 'idle' | 'arrive' | 'reading' | 'working' | 'delivering' | 'gone';

export default function TempAgencyLoop() {
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState<Stage>('idle');
  const [artifacts, setArtifacts] = useState<string[]>([]);
  const [autoplay, setAutoplay] = useState(true);
  const timerRef = useRef<number | null>(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!autoplay || reduceMotion) return;
    runShift(active);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, autoplay]);

  const runShift = (idx: number) => {
    setStage('idle');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const sequence: { stage: Stage; delay: number }[] = [
      { stage: 'arrive', delay: 100 },
      { stage: 'reading', delay: 700 },
      { stage: 'working', delay: 1700 },
      { stage: 'delivering', delay: 2700 },
      { stage: 'gone', delay: 3300 },
    ];
    sequence.forEach(({ stage: s, delay }) => {
      timerRef.current = window.setTimeout(() => {
        setStage(s);
        if (s === 'delivering') {
          setArtifacts((a) => Array.from(new Set([...a, SHIFTS[idx].artifact])));
        }
        if (s === 'gone') {
          timerRef.current = window.setTimeout(() => {
            setActive((a) => (a + 1) % SHIFTS.length);
          }, 700);
        }
      }, delay);
    });
  };

  const shift = SHIFTS[active];

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider flex items-center justify-between" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          <span>The temp agency, looping</span>
          <button type="button" onClick={() => { setAutoplay(!autoplay); if (!autoplay) runShift(active); }} className="text-[11px] px-2 py-0.5 rounded-md" style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>
            {autoplay ? 'Pause' : 'Play'}
          </button>
        </div>

        <div className="px-5 py-6 relative" style={{ minHeight: 220 }}>
          <div className="text-xs font-mono mb-3" style={{ color: 'rgb(var(--muted))' }}>
            {shift.time} · {shift.job}
          </div>
          <div className="relative h-24" style={{ background: 'rgb(var(--bg))', borderRadius: 8, border: '1px solid rgb(var(--line))' }}>
            {/* Stage indicator */}
            <div className="absolute inset-0 flex items-center justify-around px-4">
              <StageBox label="Handbook" active={stage === 'reading'} />
              <Arrow />
              <StageBox label={shift.job} active={stage === 'working'} />
              <Arrow />
              <StageBox label="Deliver" active={stage === 'delivering'} />
            </div>

            {/* Temp avatar moving */}
            <div
              className="absolute top-1/2 transition-all"
              style={{
                left:
                  stage === 'idle' ? '-8%' :
                  stage === 'arrive' ? '5%' :
                  stage === 'reading' ? '20%' :
                  stage === 'working' ? '50%' :
                  stage === 'delivering' ? '78%' :
                  '108%',
                transform: 'translateY(-50%)',
                opacity: stage === 'gone' ? 0 : 1,
                transitionDuration: reduceMotion ? '0ms' : '700ms',
              }}
            >
              <div className="rounded-full w-9 h-9 flex items-center justify-center font-mono text-xs" style={{ background: 'rgb(var(--accent))', color: 'white', border: '2px solid rgb(var(--bg))' }}>
                {shift.icon}
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs" style={{ color: 'rgb(var(--muted))' }}>
            {stage === 'arrive'     && 'A new instance arrives. Brilliant resume. Zero memory of you.'}
            {stage === 'reading'    && 'Reads the handbook (CLAUDE.md + vault) in three seconds.'}
            {stage === 'working'    && 'Does the job it was hired for.'}
            {stage === 'delivering' && 'Files the report. The artifact persists.'}
            {stage === 'gone'       && 'Walks off-stage. The instance dies.'}
            {stage === 'idle'       && 'Each shift is a different employee on day one.'}
          </div>
        </div>

        <div className="px-5 pb-4">
          <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted))' }}>Artifacts (the chain that survives)</div>
          <div className="flex flex-wrap gap-2">
            {artifacts.length === 0 && <span className="text-xs" style={{ color: 'rgb(var(--muted))' }}>None yet — they accumulate as instances finish.</span>}
            {artifacts.map((a) => (
              <span key={a} className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--accent-2))' }}>
                {a}
              </span>
            ))}
            {artifacts.length > 0 && (
              <button type="button" onClick={() => setArtifacts([])} className="text-[11px] px-2 py-0.5 rounded" style={{ color: 'rgb(var(--muted))', border: '1px solid rgb(var(--line))' }}>Clear</button>
            )}
          </div>
          <div className="mt-3 text-xs italic" style={{ color: 'rgb(var(--muted))' }}>
            "Continuity is a chain of artifacts, not a chain of brains."
          </div>
        </div>
      </div>
    </div>
  );
}

function StageBox({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className="rounded-md px-2 py-1 text-[11px] font-mono transition-colors"
      style={{
        background: active ? 'rgb(var(--accent) / 0.15)' : 'transparent',
        border: '1px solid ' + (active ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
        color: active ? 'rgb(var(--accent))' : 'rgb(var(--muted))',
      }}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return <span className="font-mono text-sm" style={{ color: 'rgb(var(--muted))' }}>→</span>;
}
