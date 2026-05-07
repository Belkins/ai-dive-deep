import { useMemo, useState } from 'react';

export default function SkillComposer() {
  const [name, setName] = useState('morning-briefing');
  const [description, setDescription] = useState(
    "Generate Vlad's daily morning briefing — pulls calendar, overnight Slack signals, HubSpot deal motion, then writes a Slack canvas. Use when user says \"morning briefing\", \"daily brief\", \"what's on my plate today\", or when the scheduled task fires at 7:30 AM ET. Do NOT use for end-of-day sync (use end-of-day-sync skill) or weekly wrap-up (use friday-wrapup)."
  );
  const [steps, setSteps] = useState(`Pull calendar events for today via the calendar MCP
Read overnight Slack DMs and channel mentions (Slack MCP)
Pull HubSpot deal stage changes since 5 PM yesterday (HubSpot MCP)
Run scripts/format_canvas.py with the gathered data
Post the rendered canvas to #morning-briefing in Slack`);
  const [output, setOutput] = useState(`Slack canvas with sections: Today's calendar, Overnight signals, Pipeline motion, #1 priority for today
Canvas title: "Morning Brief — {{ date }}"
Max 250 words across the whole canvas`);
  const [antipatterns, setAntipatterns] = useState(`Don't post if there's nothing useful to say (silent skip)
Don't include LinkedIn notifications (noise)
Don't speculate on deal status — only confirmed stage changes
Don't summarize meetings I haven't attended yet`);

  const md = useMemo(() => buildSkill({ name, description, steps, output, antipatterns }), [name, description, steps, output, antipatterns]);
  const issues = useMemo(() => coldRead(description), [description]);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          Compose your SKILL.md
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-5 space-y-4 border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'rgb(var(--line))' }}>
            <Field label="Name (kebab-case)">
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-2 py-1.5 rounded-md font-mono text-sm" style={inputStyle} />
            </Field>
            <Field label="Description (the trigger — most important)">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-2 py-1.5 rounded-md text-sm font-mono leading-relaxed" style={inputStyle} />
              <ColdReadFeedback issues={issues} />
            </Field>
            <Field label="Steps (one per line)">
              <textarea value={steps} onChange={(e) => setSteps(e.target.value)} rows={5} className="w-full px-2 py-1.5 rounded-md text-sm font-mono" style={inputStyle} />
            </Field>
            <Field label="Output format">
              <textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={3} className="w-full px-2 py-1.5 rounded-md text-sm font-mono" style={inputStyle} />
            </Field>
            <Field label="Anti-patterns (Don't do this)">
              <textarea value={antipatterns} onChange={(e) => setAntipatterns(e.target.value)} rows={3} className="w-full px-2 py-1.5 rounded-md text-sm font-mono" style={inputStyle} />
            </Field>
          </div>

          <div className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>Generated SKILL.md</div>
              <button onClick={onCopy} type="button" className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgb(var(--fg))', color: 'rgb(var(--bg))' }}>{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre className="rounded-md p-4 text-xs font-mono leading-relaxed flex-1 overflow-auto" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg) / 0.92)', maxHeight: 520 }}>
              <code>{md}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgb(var(--bg))',
  border: '1px solid rgb(var(--line))',
  color: 'rgb(var(--fg))',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>{label}</div>
      {children}
    </label>
  );
}

function ColdReadFeedback({ issues }: { issues: string[] }) {
  if (issues.length === 0) {
    return (
      <div className="mt-2 text-xs flex items-center gap-2" style={{ color: 'rgb(var(--accent-2))' }}>
        <span>✓</span> Cold-read passes. A new colleague would know when to fire it.
      </div>
    );
  }
  return (
    <div className="mt-2 text-xs space-y-0.5">
      {issues.map((i, idx) => (
        <div key={idx} className="flex items-start gap-2" style={{ color: 'rgb(var(--accent))' }}>
          <span>!</span><span>{i}</span>
        </div>
      ))}
    </div>
  );
}

function coldRead(desc: string): string[] {
  const issues: string[] = [];
  if (desc.length < 60) issues.push('Description is too short. Add explicit trigger phrases.');
  if (!/use when/i.test(desc) && !/fires?/i.test(desc)) issues.push('Add "Use when…" with concrete trigger phrases.');
  if (!/do not/i.test(desc) && !/not for/i.test(desc)) issues.push('Add "Do NOT use for X" — name adjacent skills it could collide with.');
  if (/help.*you|will help/i.test(desc)) issues.push('Cut marketing prose ("helps you", "will let you"). Body is for the AI, not the reader.');
  return issues;
}

function buildSkill({
  name,
  description,
  steps,
  output,
  antipatterns,
}: { name: string; description: string; steps: string; output: string; antipatterns: string }) {
  const stepsList = steps.split('\n').filter(Boolean).map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
  const outputList = output.split('\n').filter(Boolean).map((s) => `- ${s.trim()}`).join('\n');
  const antiList = antipatterns.split('\n').filter(Boolean).map((s) => `- ${s.trim()}`).join('\n');

  // Wrap description at 80 chars for readability.
  const wrappedDesc = description.replace(/\s+/g, ' ').trim();

  return `---
name: ${name}
description: ${wrappedDesc}
---

# ${name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}

## What to do
${stepsList}

## Output format
${outputList}

## Anti-patterns
${antiList}
`;
}
