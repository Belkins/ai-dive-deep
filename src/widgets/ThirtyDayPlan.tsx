import { useMemo, useState } from 'react';

type Stack = 'beginner' | 'operator' | 'builder';
type Cadence = 'gentle' | 'aggressive';
type Focus = 'ops' | 'eng' | 'creative';

type Day = { day: number; theme: string; tasks: string[]; chapter?: string };

export default function ThirtyDayPlan() {
  const [stack, setStack] = useState<Stack>('operator');
  const [cadence, setCadence] = useState<Cadence>('gentle');
  const [focus, setFocus] = useState<Focus>('ops');

  const days = useMemo(() => buildPlan(stack, cadence, focus), [stack, cadence, focus]);

  const exportMarkdown = () => {
    const md = ["# 30-day plan — Vlad's Ultimate AI Dive Deep", '',
      `Stack: ${stack} · Cadence: ${cadence} · Focus: ${focus}`, ''].concat(
      days.flatMap((d) => [`## Day ${d.day} — ${d.theme}`, '', ...d.tasks.map((t) => `- ${t}`), '']),
    ).join('\n');
    download(md, '30-day-plan.md');
  };

  const exportICS = () => {
    const ics = buildICS(days);
    download(ics, '30-day-plan.ics');
  };

  return (
    <div className="container-wide" style={{ marginTop: '1.5rem', marginBottom: '4rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-4 border-b grid gap-4 md:grid-cols-3" style={{ borderColor: 'rgb(var(--line))' }}>
          <Pick label="Where you are" value={stack} onChange={(v) => setStack(v as Stack)} options={[
            { v: 'beginner', l: 'Beginner', d: 'New to Claude. Maybe a Pro account.' },
            { v: 'operator', l: 'Operator', d: 'Use Cowork daily. No swarms yet.' },
            { v: 'builder', l: 'Builder', d: 'Comfortable in Claude Code. Want depth.' },
          ]} />
          <Pick label="Cadence" value={cadence} onChange={(v) => setCadence(v as Cadence)} options={[
            { v: 'gentle', l: 'Gentle', d: '20–30 min/day. Sustainable.' },
            { v: 'aggressive', l: 'Aggressive', d: '60–90 min/day. Sprint shape.' },
          ]} />
          <Pick label="Focus" value={focus} onChange={(v) => setFocus(v as Focus)} options={[
            { v: 'ops', l: 'Operations', d: 'Briefings, schedules, vault.' },
            { v: 'eng', l: 'Engineering', d: 'Swarms, hooks, CI, products.' },
            { v: 'creative', l: 'Creative', d: 'Newsletter, voice, video.' },
          ]} />
        </div>

        <div className="px-5 py-3 border-b flex items-center justify-between flex-wrap gap-2" style={{ borderColor: 'rgb(var(--line))' }}>
          <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>30 days · {days.length} sessions</div>
          <div className="flex gap-2">
            <button type="button" onClick={exportMarkdown} className="text-xs px-2 py-1 rounded-md" style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>Export markdown</button>
            <button type="button" onClick={exportICS} className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgb(var(--fg))', color: 'rgb(var(--bg))' }}>Export .ics (calendar)</button>
          </div>
        </div>

        <div className="p-5 grid gap-3">
          {days.map((d) => (
            <div key={d.day} className="rounded-md p-4 grid grid-cols-[80px_1fr] gap-4 items-start" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
              <div>
                <div className="font-display text-3xl leading-none" style={{ color: 'rgb(var(--accent))' }}>{String(d.day).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'rgb(var(--muted))' }}>Day</div>
              </div>
              <div>
                <div className="font-medium">{d.theme}</div>
                <ul className="mt-2 space-y-1 text-sm">
                  {d.tasks.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span style={{ color: 'rgb(var(--accent-2))' }}>›</span>
                      <span dangerouslySetInnerHTML={{ __html: linkify(t) }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pick<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: string) => void; options: { v: string; l: string; d: string }[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted))' }}>{label}</div>
      <div className="grid gap-1.5">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className="text-left rounded-md px-3 py-2 transition"
            style={{
              background: value === o.v ? 'rgb(var(--accent) / 0.12)' : 'rgb(var(--bg))',
              border: '1px solid ' + (value === o.v ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
            }}
          >
            <div className="text-sm font-medium" style={{ color: value === o.v ? 'rgb(var(--accent))' : 'rgb(var(--fg))' }}>{o.l}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--muted))' }}>{o.d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function linkify(text: string): string {
  // Convert "Ch X — slug" or "[Ch X](slug)" patterns into anchor tags.
  return text.replace(/\[Ch (\d+)\]\(([^)]+)\)/g, (_m, num, slug) => `<a href="../chapters/${slug}">Ch ${num}</a>`);
}

function buildPlan(stack: Stack, cadence: Cadence, focus: Focus): Day[] {
  // Base sequence varies by stack; tasks vary by focus; cadence multiplies workload.
  const weeks = STACKS[stack].slice();
  const customised: Day[] = [];
  let dayNum = 1;
  for (const week of weeks) {
    for (const dayTemplate of week) {
      const tasks = dayTemplate.tasks(focus, cadence);
      customised.push({ day: dayNum++, theme: dayTemplate.theme, tasks, chapter: dayTemplate.chapter });
    }
  }
  return customised.slice(0, 30);
}

type DayTemplate = {
  theme: string;
  chapter?: string;
  tasks: (focus: Focus, cadence: Cadence) => string[];
};

const COMMON: Record<string, DayTemplate> = {
  killTabs:  { theme: 'Kill the tabs',          chapter: '01', tasks: () => ['Read [Ch 1](01-killed-my-tabs)', 'Write down the 5 systems you tab-hop between most.'] },
  fiveTools: { theme: 'Pick five tools',        chapter: '02', tasks: () => ['Read [Ch 2](02-five-tools)', 'Audit your AI subscriptions. Cancel one.'] },
  temp:      { theme: 'Temp agency reframe',    chapter: '03', tasks: () => ['Read [Ch 3](03-temp-agency)', 'Stop saying "my AI". Start saying "an instance".'] },
  vault:     { theme: 'Build the vault',        chapter: '04', tasks: () => ['Install Obsidian.', 'Create the 5 base folders.', 'Write CLAUDE.md (≤100 lines).'] },
  skills:    { theme: 'First skill',            chapter: '05', tasks: () => ['Read [Ch 5](05-skills)', 'Pick a workflow you\'ve done 3+ times.'] },
  swarm:     { theme: 'Run a swarm',            chapter: '06', tasks: () => ['Read [Ch 6](06-the-swarm)', 'Spawn 3 Explore subagents in parallel.'] },
  cron:      { theme: 'First scheduled task',   chapter: '07', tasks: () => ['Schedule a morning briefing for 7:30 AM weekdays.', 'Confirm it lands in the right Slack channel.'] },
  doors:     { theme: 'Three doors',            chapter: '08', tasks: () => ['Read [Ch 8](08-three-doors)', 'Run the StackSelector. Settle on your 50/40/10 split.'] },
  security:  { theme: "Don't get owned",        chapter: '09', tasks: () => ['Read [Ch 9](09-dont-get-owned)', 'Rotate one API key. Move it to a secret manager.'] },
  cli:       { theme: 'Claude Code first run',  chapter: '13', tasks: () => ['Install Claude Code.', 'Run /init in a side-project repo.', 'Edit CLAUDE.md by hand.'] },
  cheat:     { theme: 'Print the cheat sheet',  chapter: '14', tasks: () => ['Read [Ch 14](14-cheat-sheet)', 'Print and tape next to monitor.'] },
  perms:     { theme: 'Permissions discipline', chapter: '15', tasks: () => ['Audit your permissions block.', 'Add deny rules for rm -rf, .env, push to main.'] },
  hooks:     { theme: 'First two hooks',        chapter: '16', tasks: () => ['Add format-on-save PostToolUse hook.', 'Add block-push-to-main PreToolUse hook.'] },
  tips:      { theme: 'Three tips',             chapter: '17', tasks: () => ['Read [Ch 17](17-tips-tricks)', 'Pick 3 tips. Wire them in this week.'] },
  headless:  { theme: 'Headless / CI',          chapter: '18', tasks: () => ['Ship the daily PR digest GitHub Action.', 'Verify Slack post lands.'] },
  product:   { theme: 'Saturday build',         chapter: '19', tasks: () => ['Pick a one-paragraph problem.', 'Spec a 1-pager PRD with a Don\'ts list.'] },
  terminal:  { theme: 'Multi-session setup',    chapter: '20', tasks: () => ['Install tmux.', 'Write the work() shell function.'] },
  modes:     { theme: 'Modes by job',           chapter: '21', tasks: () => ['Run ModePicker on next 3 tasks.', 'Try Plan mode for a 5-file refactor.'] },
  sessions:  { theme: 'Resume / fork',          chapter: '22', tasks: () => ['Practice claude --continue and --resume.', 'Fork a session deliberately.'] },
  vibe:      { theme: 'Vibe-code something',    chapter: '23', tasks: () => ['Pick a Saturday-shape project.', 'Hour 1: spec. Hour 2: deploy URL. Hour 7: ship.'] },
  tier:      { theme: 'Build your tier list',   chapter: '24', tasks: () => ['Open the TierListBuilder.', 'Defend it to your future self.'] },
  audit:     { theme: 'Toolbox audit',          tasks: () => ['Skim your week\'s commits.', 'Kill any skill that fired but didn\'t earn its slot.'] },
  rest:      { theme: 'Rest day',               tasks: () => ['Don\'t schedule anything.', 'Read one good essay; don\'t do homework.'] },
};

const STACKS: Record<Stack, DayTemplate[][]> = {
  beginner: [
    [COMMON.killTabs, COMMON.fiveTools, COMMON.temp, COMMON.vault, COMMON.cli, COMMON.cheat, COMMON.rest],
    [COMMON.skills, COMMON.cron, COMMON.doors, COMMON.security, COMMON.perms, COMMON.tips, COMMON.rest],
    [COMMON.swarm, COMMON.hooks, COMMON.modes, COMMON.sessions, COMMON.headless, COMMON.audit, COMMON.rest],
    [COMMON.product, COMMON.terminal, COMMON.vibe, COMMON.tier, COMMON.audit, COMMON.rest, COMMON.rest],
    [COMMON.audit, COMMON.tips],
  ],
  operator: [
    [COMMON.killTabs, COMMON.fiveTools, COMMON.vault, COMMON.skills, COMMON.cron, COMMON.cheat, COMMON.rest],
    [COMMON.doors, COMMON.swarm, COMMON.hooks, COMMON.security, COMMON.perms, COMMON.tips, COMMON.rest],
    [COMMON.modes, COMMON.sessions, COMMON.headless, COMMON.terminal, COMMON.product, COMMON.audit, COMMON.rest],
    [COMMON.vibe, COMMON.tier, COMMON.audit, COMMON.tips, COMMON.audit, COMMON.rest, COMMON.rest],
    [COMMON.audit, COMMON.tips],
  ],
  builder: [
    [COMMON.swarm, COMMON.hooks, COMMON.modes, COMMON.sessions, COMMON.headless, COMMON.cheat, COMMON.rest],
    [COMMON.skills, COMMON.cron, COMMON.security, COMMON.perms, COMMON.terminal, COMMON.tips, COMMON.rest],
    [COMMON.product, COMMON.vibe, COMMON.tier, COMMON.audit, COMMON.tips, COMMON.audit, COMMON.rest],
    [COMMON.audit, COMMON.tips, COMMON.audit, COMMON.tips, COMMON.audit, COMMON.rest, COMMON.rest],
    [COMMON.audit, COMMON.tips],
  ],
};

function pad(n: number) { return String(n).padStart(2, '0'); }

function buildICS(days: Day[]): string {
  const start = new Date();
  start.setHours(9, 0, 0, 0);
  start.setDate(start.getDate() + 1);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ai-dive-deep//30day//EN'];
  for (const d of days) {
    const dt = new Date(start.getTime() + (d.day - 1) * 24 * 60 * 60 * 1000);
    const dtStart = `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
    const dtEnd = new Date(dt.getTime() + 60 * 60 * 1000);
    const dtEndStr = `${dtEnd.getUTCFullYear()}${pad(dtEnd.getUTCMonth() + 1)}${pad(dtEnd.getUTCDate())}T${pad(dtEnd.getUTCHours())}${pad(dtEnd.getUTCMinutes())}00Z`;
    const desc = d.tasks.join('\\n').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:dive-deep-day-${d.day}@vladpodolyako`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEndStr}`);
    lines.push(`SUMMARY:Day ${d.day} — ${d.theme}`);
    lines.push(`DESCRIPTION:${desc}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
