import { useMemo, useState } from 'react';

type Cron = { minute: string; hour: string; dom: string; month: string; dow: string };

const PRESETS: { label: string; cron: Cron; desc: string }[] = [
  { label: 'Daily 7:30 AM weekdays', cron: { minute: '30', hour: '7', dom: '*', month: '*', dow: '1-5' }, desc: 'Morning briefing' },
  { label: 'Friday 4 PM', cron: { minute: '0', hour: '16', dom: '*', month: '*', dow: '5' }, desc: 'Weekly wrap-up' },
  { label: 'Every 30 min', cron: { minute: '*/30', hour: '*', dom: '*', month: '*', dow: '*' }, desc: 'Sentry watcher' },
  { label: 'Monday 9 AM', cron: { minute: '0', hour: '9', dom: '*', month: '*', dow: '1' }, desc: 'Process-mining scan' },
  { label: 'Daily 5 PM ET wkdy', cron: { minute: '0', hour: '17', dom: '*', month: '*', dow: '1-5' }, desc: 'Deal-advancement alerts' },
  { label: 'Hourly on the hour', cron: { minute: '0', hour: '*', dom: '*', month: '*', dow: '*' }, desc: 'Codex bug sweep' },
];

export default function CronBuilder() {
  const [cron, setCron] = useState<Cron>(PRESETS[0].cron);
  const expr = `${cron.minute} ${cron.hour} ${cron.dom} ${cron.month} ${cron.dow}`;
  const human = useMemo(() => describeCron(cron), [cron]);
  const next = useMemo(() => nextRuns(cron, 7), [cron]);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(expr);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b flex items-center gap-3 flex-wrap" style={{ borderColor: 'rgb(var(--line))' }}>
          <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>Cron builder</div>
          <div className="ml-auto flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setCron(p.cron)}
                className="text-[11px] px-2 py-1 rounded-md"
                style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg) / 0.85)' }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 py-5 grid gap-5 md:grid-cols-[2fr_3fr]">
          <div>
            <div className="grid grid-cols-5 gap-2">
              {(['minute','hour','dom','month','dow'] as const).map((field) => (
                <label key={field} className="block">
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>
                    {field === 'dom' ? 'Day' : field === 'dow' ? 'Weekday' : field}
                  </div>
                  <input
                    type="text"
                    value={cron[field]}
                    onChange={(e) => setCron({ ...cron, [field]: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-md font-mono text-sm"
                    style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-md flex items-center justify-between gap-3" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
              <code className="font-mono text-sm" style={{ color: 'rgb(var(--accent))' }}>{expr}</code>
              <button
                type="button"
                onClick={onCopy}
                className="text-xs px-2 py-1 rounded-md whitespace-nowrap"
                style={{ background: 'rgb(var(--fg))', color: 'rgb(var(--bg))' }}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="mt-3 text-sm leading-relaxed" style={{ color: 'rgb(var(--fg) / 0.9)' }}>
              <span className="text-[10px] uppercase tracking-wider mr-2" style={{ color: 'rgb(var(--muted))' }}>In English</span>
              {human}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted))' }}>Next 7 fires</div>
            <ol className="space-y-1.5 list-none p-0 m-0 max-h-[240px] overflow-y-auto pr-1">
              {next.map((d) => (
                <li key={d.toISOString()} className="flex items-center gap-3 text-sm font-mono p-2 rounded-md" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'rgb(var(--accent-2))' }} />
                  <span style={{ color: 'rgb(var(--fg) / 0.9)' }}>{d.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </li>
              ))}
              {next.length === 0 && (
                <li className="text-sm" style={{ color: 'rgb(var(--muted))' }}>No matches in next 30 days. Check fields.</li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- minimal cron parser ---
function parseField(field: string, min: number, max: number): number[] {
  const parts = field.split(',').flatMap((p) => {
    let step = 1;
    let body = p;
    const stepMatch = p.match(/^(.*)\/(\d+)$/);
    if (stepMatch) { body = stepMatch[1]; step = parseInt(stepMatch[2], 10); }
    if (body === '*') {
      const out: number[] = [];
      for (let i = min; i <= max; i += step) out.push(i);
      return out;
    }
    const range = body.match(/^(\d+)-(\d+)$/);
    if (range) {
      const a = parseInt(range[1], 10), b = parseInt(range[2], 10);
      const out: number[] = [];
      for (let i = a; i <= b; i += step) out.push(i);
      return out;
    }
    if (/^\d+$/.test(body)) return [parseInt(body, 10)];
    return [];
  });
  return Array.from(new Set(parts)).filter((n) => n >= min && n <= max).sort((a, b) => a - b);
}

function matchesCron(date: Date, cron: Cron): boolean {
  try {
    const m = parseField(cron.minute, 0, 59);
    const h = parseField(cron.hour, 0, 23);
    const dom = parseField(cron.dom, 1, 31);
    const mon = parseField(cron.month, 1, 12);
    const dow = parseField(cron.dow, 0, 7).map((d) => d % 7);
    return (
      m.includes(date.getMinutes()) &&
      h.includes(date.getHours()) &&
      dom.includes(date.getDate()) &&
      mon.includes(date.getMonth() + 1) &&
      dow.includes(date.getDay())
    );
  } catch { return false; }
}

function nextRuns(cron: Cron, count: number): Date[] {
  const result: Date[] = [];
  const start = new Date();
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);
  const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
  const cursor = new Date(start);
  while (cursor < end && result.length < count) {
    if (matchesCron(cursor, cron)) result.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return result;
}

function describeCron(c: Cron): string {
  const parts: string[] = [];
  // hour:minute
  if (/^\d+$/.test(c.minute) && /^\d+$/.test(c.hour)) {
    const h = parseInt(c.hour, 10), m = parseInt(c.minute, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    parts.push(`at ${h12}:${String(m).padStart(2,'0')} ${ampm}`);
  } else if (c.minute.startsWith('*/')) {
    parts.push(`every ${c.minute.slice(2)} minutes`);
  } else if (c.minute === '0' && c.hour === '*') {
    parts.push('every hour on the hour');
  } else {
    parts.push(`at minute ${c.minute} of hour ${c.hour}`);
  }
  // day-of-week
  const dowMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (c.dow === '1-5') parts.push('on weekdays');
  else if (c.dow === '0,6' || c.dow === '6,0') parts.push('on weekends');
  else if (c.dow === '*') {} // every day
  else if (/^\d+$/.test(c.dow)) parts.push(`on ${dowMap[parseInt(c.dow, 10) % 7]}`);
  else if (/^\d+(-\d+)$/.test(c.dow)) parts.push(`on ${c.dow.split('-').map((d) => dowMap[parseInt(d, 10) % 7]).join('–')}`);
  // dom
  if (c.dom !== '*') parts.push(`on day-of-month ${c.dom}`);
  return parts.join(' ').replace(/^./, (s) => s.toUpperCase());
}
