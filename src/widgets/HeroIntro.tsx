import { useEffect, useState } from 'react';

const TABS = [
  'gmail.com',
  'hubspot.com',
  'app.slack.com',
  'notion.so',
  'calendar.google.com',
  'sentry.io',
  'dashboard.stripe.com',
  'app.ahrefs.com',
  'chat.openai.com',
  'linear.app',
];

export default function HeroIntro() {
  const [killed, setKilled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setKilled(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgb(var(--paper)), rgb(var(--line) / 0.6))',
        border: '1px solid rgb(var(--line))',
      }}
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Before */}
        <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r" style={{ borderColor: 'rgb(var(--line))' }}>
          <div className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'rgb(var(--muted))' }}>Before</div>
          <div className="font-display text-2xl mb-4">Ten tabs. Twenty minutes. No decisions yet.</div>
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t, i) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono"
                style={{
                  background: 'rgb(var(--bg))',
                  border: '1px solid rgb(var(--line))',
                  color: 'rgb(var(--fg) / 0.8)',
                  transform: killed ? `translateX(${(i % 2 ? 1 : -1) * (i + 1) * 30}px) scale(0.4)` : 'none',
                  opacity: killed ? 0 : 1,
                  transition: `all 800ms cubic-bezier(0.65, 0, 0.35, 1) ${i * 60}ms`,
                  pointerEvents: 'none',
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: ['#ef4444', '#f59e0b', '#22c55e'][i % 3] }}
                />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* After */}
        <div className="p-6 sm:p-8">
          <div className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'rgb(var(--accent))' }}>After</div>
          <div className="font-display text-2xl mb-4">One channel. One coffee. The week is closed.</div>
          <div className="rounded-lg p-4" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: 'rgb(var(--accent-2))' }}></span>
              <span className="font-mono text-xs" style={{ color: 'rgb(var(--muted))' }}>#ops · 6:30 AM</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-mono text-xs mt-0.5" style={{ color: 'rgb(var(--accent))' }}>1.</span>
                <span>HubSpot — 2 deals advanced overnight, 1 went dark</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-xs mt-0.5" style={{ color: 'rgb(var(--accent))' }}>2.</span>
                <span>Folderly — deliverability holding 96%, no incidents</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-xs mt-0.5" style={{ color: 'rgb(var(--accent))' }}>3.</span>
                <span>Mentee A — prep doc generated, three open threads</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-xs mt-0.5" style={{ color: 'rgb(var(--accent))' }}>4.</span>
                <span>One investor on calendar at 2 PM, conflict resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
