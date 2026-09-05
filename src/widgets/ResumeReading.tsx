import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CHAPTERS } from '@/lib/chapters';
import {
  getResumeTarget, readLastRead, readReadingProgress, readingHref,
  LAST_READ_STORAGE_KEY, PROGRESS_STORAGE_KEY, PROGRESS_CHANGED_EVENT,
} from '@/lib/reading-progress';

const getResume = () => getResumeTarget(readReadingProgress(), readLastRead(), CHAPTERS);

export default function ResumeReading() {
  const [resumeAt, setResumeAt] = useState<ReturnType<typeof getResume>>(null);

  useEffect(() => {
    const refresh = () => setResumeAt(getResume());
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === PROGRESS_STORAGE_KEY || event.key === LAST_READ_STORAGE_KEY) refresh();
    };
    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('astro:page-load', refresh);
    return () => {
      window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('astro:page-load', refresh);
    };
  }, []);

  if (!resumeAt) return null;

  return (
    <a
      href={readingHref(resumeAt.slug, resumeAt.anchor, import.meta.env.BASE_URL)}
      className="inline-flex w-full max-w-lg min-w-0 items-center gap-3 rounded-lg px-3 py-3 mt-4 no-underline sm:px-4"
      title={`${resumeAt.visitedAt ? 'Resume' : 'Continue'} reading: ${resumeAt.title}`}
      style={{
        background: 'rgb(var(--paper))',
        border: '1px solid rgb(var(--accent))',
        color: 'rgb(var(--fg))',
      }}
    >
      <span
        className="inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-full font-mono text-xs"
        style={{ background: 'rgb(var(--accent))', color: 'white' }}
      >
        {String(resumeAt.number).padStart(2, '0')}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-xs" style={{ color: 'rgb(var(--muted))' }}>
          {resumeAt.visitedAt ? 'Resume reading' : 'Continue reading'}
          <span className="whitespace-nowrap"> &middot; {Math.round(resumeAt.pct)}% in</span>
        </span>
        <span className="block font-medium truncate">{resumeAt.title}</span>
      </span>
      <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" style={{ color: 'rgb(var(--accent))' }} />
    </a>
  );
}
