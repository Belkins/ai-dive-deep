import { useEffect, useState } from 'react';
import { CHAPTERS } from '@/lib/chapters';

type Progress = Record<string, number>;

export default function ResumeReading() {
  const [resumeAt, setResumeAt] = useState<{ slug: string; number: number; title: string; pct: number } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cc-progress');
      if (!raw) return;
      const data: Progress = JSON.parse(raw);
      // Find the chapter most recently progressed but not yet near-complete (1-95%)
      const candidates = Object.entries(data)
        .filter(([slug, pct]) => pct >= 5 && pct < 95)
        .map(([slug, pct]) => {
          const ch = CHAPTERS.find((c) => c.slug === slug);
          return ch ? { slug, number: ch.number, title: ch.title, pct } : null;
        })
        .filter(Boolean) as { slug: string; number: number; title: string; pct: number }[];
      if (candidates.length === 0) return;
      // Pick the one with the highest chapter number (assumed most recent)
      candidates.sort((a, b) => b.number - a.number);
      setResumeAt(candidates[0]);
    } catch {}
  }, []);

  if (!resumeAt) return null;

  const baseUrl = (import.meta as any).env?.BASE_URL ?? '/';
  const base = baseUrl.replace(/\/$/, '');

  return (
    <a
      href={`${base}/chapters/${resumeAt.slug}`}
      className="inline-flex items-center gap-3 rounded-lg px-4 py-3 mt-4 no-underline"
      style={{
        background: 'rgb(var(--paper))',
        border: '1px solid rgb(var(--accent))',
        color: 'rgb(var(--fg))',
      }}
    >
      <span
        className="inline-flex items-center justify-center h-8 w-8 rounded-full font-mono text-xs"
        style={{ background: 'rgb(var(--accent))', color: 'white' }}
      >
        {String(resumeAt.number).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>
          Resume reading · {resumeAt.pct}% in
        </div>
        <div className="font-medium truncate">{resumeAt.title}</div>
      </div>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'rgb(var(--accent))' }}>
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </a>
  );
}
