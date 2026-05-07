import { useEffect, useRef, useState } from 'react';

type Event = {
  id: string;
  label: string;
  type: 'session' | 'user' | 'pre-tool' | 'tool' | 'post-tool' | 'stop';
  hook?: string;
  blocked?: boolean;
};

type HookKey = 'pre-edit-deny-env' | 'pre-bash-deny-push' | 'post-format' | 'stop-slack';

const HOOKS_DEFAULT: Record<HookKey, boolean> = {
  'pre-edit-deny-env': true,
  'pre-bash-deny-push': true,
  'post-format': true,
  'stop-slack': true,
};

const TURN: Event[] = [
  { id: 'session-start', label: 'SessionStart', type: 'session' },
  { id: 'inject-context', label: 'inject sprint priorities', type: 'session' },
  { id: 'user-prompt', label: 'UserPromptSubmit: "fix the auth bug"', type: 'user' },
  { id: 'pre-edit-1', label: 'PreToolUse(Edit) — src/auth.ts', type: 'pre-tool' },
  { id: 'tool-edit-1', label: 'Edit src/auth.ts', type: 'tool' },
  { id: 'post-edit-1', label: 'PostToolUse(Edit) — prettier', type: 'post-tool', hook: 'post-format' },
  { id: 'pre-edit-2', label: 'PreToolUse(Edit) — .env.local', type: 'pre-tool', hook: 'pre-edit-deny-env' },
  { id: 'tool-edit-2', label: 'Edit .env.local — BLOCKED', type: 'tool', blocked: true },
  { id: 'pre-bash-1', label: 'PreToolUse(Bash) — npm test', type: 'pre-tool' },
  { id: 'tool-bash-1', label: 'Bash: npm test', type: 'tool' },
  { id: 'pre-bash-2', label: 'PreToolUse(Bash) — git push origin main', type: 'pre-tool', hook: 'pre-bash-deny-push' },
  { id: 'tool-bash-2', label: 'Bash: git push — BLOCKED', type: 'tool', blocked: true },
  { id: 'stop', label: 'Stop — turn finished', type: 'stop', hook: 'stop-slack' },
];

const TYPE_COLORS: Record<Event['type'], string> = {
  session: 'rgb(var(--muted))',
  user: 'rgb(var(--accent-2))',
  'pre-tool': '#FFB48C',
  tool: 'rgb(var(--accent))',
  'post-tool': '#FF8E54',
  stop: 'rgb(var(--accent-2))',
};

export default function HookEventTimeline() {
  const [hooks, setHooks] = useState<Record<HookKey, boolean>>(HOOKS_DEFAULT);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timersRef = useRef<number[]>([]);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggleHook = (k: HookKey) => setHooks((h) => ({ ...h, [k]: !h[k] }));

  const run = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setRunning(true);
    setActiveIndex(-1);
    setTick((t) => t + 1);

    const visibleEvents = TURN.filter((e) => {
      // Hide hook-driven entries when their hook is off (or skip the corresponding tool block)
      if (e.hook === 'pre-edit-deny-env' && !hooks['pre-edit-deny-env']) return true;  // event still shows but tool not blocked
      if (e.hook === 'pre-bash-deny-push' && !hooks['pre-bash-deny-push']) return true;
      if (e.hook === 'post-format' && !hooks['post-format']) return false;
      if (e.hook === 'stop-slack' && !hooks['stop-slack']) return false;
      return true;
    });

    visibleEvents.forEach((e, i) => {
      const t = window.setTimeout(() => {
        setActiveIndex(i);
        if (i === visibleEvents.length - 1) {
          window.setTimeout(() => setRunning(false), 600);
        }
      }, reduceMotion ? 0 : i * 380);
      timersRef.current.push(t);
    });
  };

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Compute visible events for rendering
  const events = TURN.map((e) => {
    if (e.hook === 'post-format' && !hooks['post-format']) return null;
    if (e.hook === 'stop-slack' && !hooks['stop-slack']) return null;
    if (e.id === 'tool-edit-2') {
      // .env block depends on the deny-env hook
      return { ...e, blocked: hooks['pre-edit-deny-env'] };
    }
    if (e.id === 'tool-bash-2') {
      return { ...e, blocked: hooks['pre-bash-deny-push'] };
    }
    return e;
  }).filter(Boolean) as Event[];

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider flex items-center justify-between" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          <span>Hook event timeline · one agent turn</span>
          <button type="button" onClick={run} disabled={running} className="text-xs px-2.5 py-1 rounded-md disabled:opacity-50" style={{ background: 'rgb(var(--fg))', color: 'rgb(var(--bg))' }}>
            {running ? 'Running…' : 'Re-run turn'}
          </button>
        </div>

        <div className="grid md:grid-cols-[2fr_3fr] gap-0">
          {/* Hooks panel */}
          <div className="p-5 border-b md:border-b-0 md:border-r" style={{ borderColor: 'rgb(var(--line))' }}>
            <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: 'rgb(var(--muted))' }}>Hooks in effect</div>
            <div className="space-y-1.5">
              <HookToggle label='PreToolUse: deny Edit(.env*)' active={hooks['pre-edit-deny-env']} onClick={() => toggleHook('pre-edit-deny-env')} tone="good" />
              <HookToggle label='PreToolUse: deny "git push origin main"' active={hooks['pre-bash-deny-push']} onClick={() => toggleHook('pre-bash-deny-push')} tone="good" />
              <HookToggle label="PostToolUse: prettier --write" active={hooks['post-format']} onClick={() => toggleHook('post-format')} tone="neutral" />
              <HookToggle label="Stop: Slack DM with run summary" active={hooks['stop-slack']} onClick={() => toggleHook('stop-slack')} tone="neutral" />
            </div>
            <div className="mt-4 text-xs leading-relaxed" style={{ color: 'rgb(var(--muted))' }}>
              Toggle a hook off, hit re-run. Watch the .env edit succeed and the push to main go live. That's the cost of hooks not being there.
            </div>
          </div>

          {/* Timeline */}
          <div className="p-5">
            <ol className="relative pl-4 list-none m-0" style={{ borderLeft: '1px solid rgb(var(--line))' }}>
              {events.map((e, i) => {
                const reached = activeIndex < 0 || i <= activeIndex;
                return (
                  <li
                    key={e.id + '-' + tick}
                    className="relative pl-4 pb-3 last:pb-0"
                    style={{
                      opacity: reached ? 1 : 0.25,
                      transform: reached ? 'translateX(0)' : 'translateX(-4px)',
                      transition: 'all 240ms ease',
                    }}
                  >
                    <span
                      className="absolute -left-[7px] top-1.5 inline-block h-3 w-3 rounded-full"
                      style={{ background: TYPE_COLORS[e.type], border: '2px solid rgb(var(--paper))' }}
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider font-mono" style={{ color: TYPE_COLORS[e.type] }}>{e.type}</span>
                      <span className={`text-sm ${e.blocked ? 'line-through' : ''}`} style={{ color: e.blocked ? 'rgb(var(--accent))' : 'rgb(var(--fg))' }}>{e.label}</span>
                      {e.blocked && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgb(var(--accent) / 0.15)', color: 'rgb(var(--accent))' }}>blocked by hook</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function HookToggle({ label, active, onClick, tone }: { label: string; active: boolean; onClick: () => void; tone: 'good' | 'neutral' }) {
  const onColor = tone === 'good' ? 'rgb(var(--accent-2))' : 'rgb(var(--accent))';
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-md px-2.5 py-1.5 font-mono text-xs transition w-full"
      style={{
        background: active ? `${onColor.replace('rgb(', 'rgba(').replace(')', ' / 0.12)')}` : 'rgb(var(--bg))',
        border: '1px solid ' + (active ? onColor : 'rgb(var(--line))'),
        color: active ? onColor : 'rgb(var(--muted))',
      }}
    >
      <span className="mr-2">{active ? '●' : '○'}</span>{label}
    </button>
  );
}
