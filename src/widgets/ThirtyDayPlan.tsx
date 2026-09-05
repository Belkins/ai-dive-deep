import { useMemo, useState } from 'react';

type Stack = 'beginner' | 'operator' | 'builder';
type Cadence = 'gentle' | 'aggressive';
type Focus = 'ops' | 'eng' | 'creative';

type Day = { day: number; theme: string; tasks: string[]; chapter?: string; minutes: number };

export default function ThirtyDayPlan() {
  const [stack, setStack] = useState<Stack>('operator');
  const [cadence, setCadence] = useState<Cadence>('gentle');
  const [focus, setFocus] = useState<Focus>('ops');

  const days = useMemo(() => buildPlan(stack, cadence, focus), [stack, cadence, focus]);

  const exportMarkdown = () => {
    const md = ["# 30-day plan — Vlad's Playbook", '',
      `Stack: ${stack} · Cadence: ${cadence} · Focus: ${focus}`, ''].concat(
      days.flatMap((d) => [`## Day ${d.day} — ${d.theme}`, '', d.minutes ? `${d.minutes} minutes` : 'Rest day', '', ...d.tasks.map((t) => `- ${absoluteChapterLinks(t)}`), '']),
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
          <div className="text-xs uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>30 days · {days.filter((d) => d.minutes > 0).length} sessions</div>
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
                <div className="text-xs mt-1" style={{ color: 'rgb(var(--muted))' }}>{d.minutes ? `${d.minutes} min` : 'Rest day'}</div>
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
            aria-pressed={value === o.v}
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
  return text.replace(/\[Ch (\d+)\]\(([^)]+)\)/g, (_m, num, slug) => `<a href="../chapters/${slug}/">Ch ${num}</a>`);
}

function buildPlan(stack: Stack, cadence: Cadence, focus: Focus): Day[] {
  // Safety gates precede any tool setup, connector or unattended task on every path.
  const sequence = [COMMON.security, COMMON.perms, ...STACKS[stack].flat()
    .filter((template) => template !== COMMON.security && template !== COMMON.perms)];
  return sequence.slice(0, 30).map((template, i) => {
    const rest = template === COMMON.rest;
    const tasks = template.tasks(focus);
    if (!rest && cadence === 'aggressive') tasks.push(STRETCH_TASKS[template.chapter || 'audit'](focus));
    return { day: i + 1, theme: template.theme, tasks, chapter: template.chapter, minutes: rest ? 0 : cadence === 'gentle' ? 30 : 75 };
  });
}

type DayTemplate = {
  theme: string;
  chapter?: string;
  tasks: (focus: Focus) => string[];
};

const FOCUS_EXERCISES: Record<Focus, { source: string; deliverable: string; task: string; check: string }> = {
  ops: {
    source: 'a sanitized local status note',
    deliverable: 'a weekly operations brief',
    task: 'Extract decisions, owners and due dates into a weekly operations brief.',
    check: 'Trace every owner and date back to the source; flag missing information instead of filling it in.',
  },
  eng: {
    source: 'a local sample issue and test log with no credentials',
    deliverable: 'a reproducible bug-triage report',
    task: 'Turn a sample issue and test log into reproduction steps and a failing-test proposal.',
    check: 'Check that the reproduction uses the supplied fixture and does not invent a test result.',
  },
  creative: {
    source: 'a local writing sample you own',
    deliverable: 'a newsletter outline and opening paragraph',
    task: 'Draft a newsletter outline and opening paragraph using your writing sample.',
    check: 'Compare the draft with the sample for voice, and remove unsupported factual claims.',
  },
};

const STRETCH_TASKS: Record<string, (focus: Focus) => string> = {
  '01': () => 'Map one repeated handoff between your tools; record its inputs, owner and current time cost.',
  '02': () => 'Run the same sanitized task in two tools and compare correction time before choosing one.',
  '03': (focus) => `Start a fresh session with ${FOCUS_EXERCISES[focus].source}; compare results with and without a short context file.`,
  '04': () => 'Retrieve three notes from a new session and fix the folder names or index wherever retrieval fails.',
  '05': (focus) => `Run the skill on three different samples. ${FOCUS_EXERCISES[focus].check}`,
  '06': () => 'Compare the parallel result with one sequential run; record elapsed time and conflicting recommendations.',
  '07': () => 'Test a missing-input run and a duplicate run; confirm neither sends an unintended notification.',
  '08': (focus) => `Compare two available surfaces on ${FOCUS_EXERCISES[focus].deliverable}; record where a human correction was needed.`,
  '09': () => 'Inventory existing integrations and revoke one unnecessary scope; record how to disable the remaining integrations.',
  '13': () => 'Run the workflow in a disposable repository and inspect every proposed file change before accepting it.',
  '14': () => 'Try three reference commands in a disposable project and annotate the conditions under which each is useful.',
  '15': () => 'Use harmless test fixtures to verify one allowed operation and one denied operation, without accessing real secrets.',
  '16': () => 'Test each hook on matching and non-matching fixture files; verify failure stops the intended action.',
  '17': () => 'Compare an instrumented run before and after one tip; keep it only if it improves the outcome.',
  '18': () => 'Run the CI job twice on the same fixture and verify it produces one artifact without duplicate side effects.',
  '19': (focus) => `Build a local prototype of ${FOCUS_EXERCISES[focus].deliverable} and try it with a second sample.`,
  '20': () => 'Run two disposable worktrees simultaneously and verify each terminal has the expected working directory and branch.',
  '21': () => 'Compare Plan and Interactive modes on the same disposable change; record the review work each requires.',
  '22': () => 'Resume and fork the same fixture session; compare which context survives in each case.',
  '23': (focus) => `Test a second input and publish only after review. ${FOCUS_EXERCISES[focus].check}`,
  '24': () => 'Run one representative task in two tools whose rankings are close; update the tiers from that comparison.',
  audit: (focus) => `Re-run a saved example of ${FOCUS_EXERCISES[focus].deliverable}; record any regression and its fix, or document the passing result.`,
};

const COMMON: Record<string, DayTemplate> = {
  killTabs:  { theme: 'Kill the tabs',          chapter: '01', tasks: () => ['Read [Ch 1](01-killed-my-tabs)', 'Write down the 5 systems you tab-hop between most.'] },
  fiveTools: { theme: 'Pick five tools',        chapter: '02', tasks: () => ['Read [Ch 2](02-five-tools)', 'Audit your AI subscriptions. Cancel one.'] },
  temp:      { theme: 'Temp agency reframe',    chapter: '03', tasks: () => ['Read [Ch 3](03-temp-agency)', 'Stop saying "my AI". Start saying "an instance".'] },
  vault:     { theme: 'Build the vault',        chapter: '04', tasks: (focus) => ['Create a local vault and a short CLAUDE.md index.', `Add ${FOCUS_EXERCISES[focus].source} and record where it came from.`] },
  skills:    { theme: 'First skill',            chapter: '05', tasks: (focus) => ['Read [Ch 5](05-skills)', `Write a skill for this task: ${FOCUS_EXERCISES[focus].task}`] },
  swarm:     { theme: 'Run a swarm',            chapter: '06', tasks: (focus) => ['Read [Ch 6](06-the-swarm)', `Have three read-only subagents review ${FOCUS_EXERCISES[focus].source} for missing inputs, proposed output and failure cases.`] },
  cron:      { theme: 'First scheduled task',   chapter: '07', tasks: (focus) => [`Run one manual draft of ${FOCUS_EXERCISES[focus].deliverable} from local sample data.`, 'Then schedule a draft-only run with a stop condition; review its output before connecting a delivery channel.'] },
  doors:     { theme: 'Three doors',            chapter: '08', tasks: () => ['Read [Ch 8](08-three-doors)', 'Run the StackSelector. Settle on your 50/40/10 split.'] },
  security:  { theme: "Don't get owned",        chapter: '09', tasks: () => ['Read [Ch 9](09-dont-get-owned)', 'Set spending caps before adding keys or integrations. Store existing keys in a secret manager and choose sanitized local practice data.'] },
  cli:       { theme: 'Claude Code first run',  chapter: '13', tasks: () => ['Install Claude Code.', 'Run /init in a side-project repo.', 'Edit CLAUDE.md by hand.'] },
  cheat:     { theme: 'Print the cheat sheet',  chapter: '14', tasks: () => ['Read [Ch 14](14-cheat-sheet)', 'Print and tape next to monitor.'] },
  perms:     { theme: 'Permissions discipline', chapter: '15', tasks: () => ['Audit your permissions block.', 'Add deny rules for rm -rf, .env, push to main.'] },
  hooks:     { theme: 'First two hooks',        chapter: '16', tasks: (focus) => ['Add a block-push-to-main hook in a disposable project.', `Write a validation check for the output: ${FOCUS_EXERCISES[focus].check}`] },
  tips:      { theme: 'Three tips',             chapter: '17', tasks: () => ['Read [Ch 17](17-tips-tricks)', 'Pick 3 tips. Wire them in this week.'] },
  headless:  { theme: 'Headless / CI',          chapter: '18', tasks: (focus) => [`Run a headless job producing ${FOCUS_EXERCISES[focus].deliverable} from a local fixture.`, 'Save the output as a reviewable artifact; keep external posting disabled.'] },
  product:   { theme: 'Scope a small build',    chapter: '19', tasks: (focus) => [`Write a one-page spec for ${FOCUS_EXERCISES[focus].deliverable}.`, 'Name one input, one output, an acceptance check and an explicit out-of-scope list.'] },
  terminal:  { theme: 'Multi-session setup',    chapter: '20', tasks: () => ['Install tmux.', 'Write the work() shell function.'] },
  modes:     { theme: 'Modes by job',           chapter: '21', tasks: () => ['Run ModePicker on next 3 tasks.', 'Try Plan mode for a 5-file refactor.'] },
  sessions:  { theme: 'Resume / fork',          chapter: '22', tasks: () => ['Practice claude --continue and --resume.', 'Fork a session deliberately.'] },
  vibe:      { theme: 'Build one working slice', chapter: '23', tasks: (focus) => [`Build the smallest local version of ${FOCUS_EXERCISES[focus].deliverable} using one sample input.`, 'Stop at the timebox, inspect the result and record the next missing acceptance check.'] },
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

function absoluteChapterLinks(text: string): string {
  return text.replace(/\[Ch (\d+)\]\(([^)]+)\)/g, (_match, number, slug) => `[Ch ${number}](https://dive.vladyslavpodoliako.com/chapters/${slug}/)`);
}

function icsDate(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeICS(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function foldICS(line: string): string {
  const encoder = new TextEncoder();
  const lines: string[] = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) { lines.push(current); current = ' '; bytes = 1; }
    current += char;
    bytes += size;
  }
  lines.push(current);
  return lines.join('\r\n');
}

function buildICS(days: Day[], now = new Date()): string {
  const start = new Date(now);
  start.setHours(9, 0, 0, 0);
  start.setDate(start.getDate() + 1);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ai-dive-deep//30day//EN'];
  for (const d of days) {
    if (d.minutes === 0) continue;
    const dt = new Date(start);
    dt.setDate(start.getDate() + d.day - 1);
    const dtStart = icsDate(dt);
    const dtEnd = new Date(dt.getTime() + d.minutes * 60 * 1000);
    const desc = absoluteChapterLinks(d.tasks.join('\n')).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1: $2');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:dive-deep-${icsDate(start).slice(0, 8)}-day-${d.day}@vladpodolyako`);
    lines.push(`DTSTAMP:${icsDate(now)}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${icsDate(dtEnd)}`);
    lines.push(`SUMMARY:${escapeICS(`Day ${d.day} — ${d.theme}`)}`);
    lines.push(`DESCRIPTION:${escapeICS(desc)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldICS).join('\r\n') + '\r\n';
}

function download(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
