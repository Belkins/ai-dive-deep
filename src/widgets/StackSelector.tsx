import { useState } from 'react';

type Surface = 'chat' | 'cowork' | 'code';
type Model = 'haiku' | 'sonnet' | 'opus';

type Q = {
  id: string;
  label: string;
  options: { label: string; weight: Partial<Record<Surface, number>>; modelWeight?: Partial<Record<Model, number>> }[];
};

const QUESTIONS: Q[] = [
  {
    id: 'where',
    label: 'Where are you?',
    options: [
      { label: 'On my phone', weight: { chat: 3 }, modelWeight: { sonnet: 1 } },
      { label: 'At my desk', weight: { cowork: 1, code: 1 } },
      { label: 'In a real codebase', weight: { code: 3 } },
    ],
  },
  {
    id: 'work',
    label: 'What are you doing?',
    options: [
      { label: 'Quick brainstorm / casual chat', weight: { chat: 3 }, modelWeight: { sonnet: 1 } },
      { label: 'Pull data from CRM, calendar, Slack', weight: { cowork: 3 }, modelWeight: { sonnet: 1 } },
      { label: 'Read/write a repo, tests, infra', weight: { code: 3 } },
      { label: 'Spawn parallel agents', weight: { code: 3 } },
      { label: 'Long PDF / 800-page report ingest', weight: { chat: 1 } },
    ],
  },
  {
    id: 'when',
    label: 'When does it need to run?',
    options: [
      { label: 'Right now, manually', weight: {} },
      { label: 'On a schedule (cron)', weight: { cowork: 2, code: 2 } },
      { label: '24/7 background loop', weight: { code: 3 } },
    ],
  },
  {
    id: 'rigor',
    label: 'How hard is the reasoning?',
    options: [
      { label: 'Routine — summarize, classify, glue code', weight: {}, modelWeight: { sonnet: 2, haiku: 1 } },
      { label: 'Mid — refactor, doc writing, code review', weight: {}, modelWeight: { sonnet: 3 } },
      { label: 'Hard — architecture, multi-file refactor', weight: {}, modelWeight: { opus: 3 } },
      { label: 'Bulk — high-volume classification', weight: {}, modelWeight: { haiku: 3 } },
    ],
  },
];

export default function StackSelector() {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const setAnswer = (qid: string, idx: number) => setAnswers((prev) => ({ ...prev, [qid]: idx }));

  const surfaceScores: Record<Surface, number> = { chat: 0, cowork: 0, code: 0 };
  const modelScores: Record<Model, number> = { haiku: 0, sonnet: 0, opus: 0 };

  for (const q of QUESTIONS) {
    const idx = answers[q.id];
    if (idx == null) continue;
    const opt = q.options[idx];
    for (const k of Object.keys(opt.weight) as Surface[]) surfaceScores[k] += opt.weight[k] ?? 0;
    for (const k of Object.keys(opt.modelWeight ?? {}) as Model[]) modelScores[k] += opt.modelWeight![k] ?? 0;
  }

  const surfacePicked = Object.keys(surfaceScores).length > 0
    ? (Object.entries(surfaceScores).sort((a, b) => b[1] - a[1])[0][0] as Surface)
    : null;
  const modelPicked = (Object.entries(modelScores).sort((a, b) => b[1] - a[1])[0][0] as Model);
  const answered = Object.keys(answers).length;

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider flex items-center justify-between" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          <span>Pick the right surface</span>
          <span>{answered}/{QUESTIONS.length}</span>
        </div>

        <div className="px-5 py-5 grid gap-5 md:grid-cols-2">
          {QUESTIONS.map((q) => (
            <div key={q.id}>
              <div className="text-xs font-medium mb-2">{q.label}</div>
              <div className="grid gap-1.5">
                {q.options.map((opt, i) => {
                  const active = answers[q.id] === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAnswer(q.id, i)}
                      className="text-left text-sm px-3 py-2 rounded-md transition"
                      style={{
                        background: active ? 'rgb(var(--accent) / 0.12)' : 'rgb(var(--bg))',
                        border: '1px solid ' + (active ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
                        color: active ? 'rgb(var(--accent))' : 'rgb(var(--fg))',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5 grid gap-3 md:grid-cols-2">
          <ResultCard kind="surface" pick={surfacePicked} />
          <ResultCard kind="model" pick={modelPicked} />
        </div>
      </div>
    </div>
  );
}

function ResultCard({ kind, pick }: { kind: 'surface' | 'model'; pick: string | null }) {
  if (!pick) return (
    <div className="rounded-lg p-4" style={{ background: 'rgb(var(--bg))', border: '1px dashed rgb(var(--line))' }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>{kind}</div>
      <div className="text-sm" style={{ color: 'rgb(var(--muted))' }}>Pick a few options →</div>
    </div>
  );
  const data = (kind === 'surface' ? SURFACES : MODELS) as any;
  const d = data[pick];
  return (
    <div className="rounded-lg p-4" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--accent))' }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>{kind}</div>
      <div className="font-display text-xl mb-1" style={{ color: 'rgb(var(--accent))' }}>{d.title}</div>
      <div className="text-sm leading-relaxed" style={{ color: 'rgb(var(--fg) / 0.85)' }}>{d.why}</div>
    </div>
  );
}

const SURFACES: Record<Surface, { title: string; why: string }> = {
  chat: { title: 'Chat (claude.ai)', why: 'Mobile, casual, brainstorming. Web/iOS/Android. No connectors, no scheduled tasks. The sedan.' },
  cowork: { title: 'Cowork', why: 'Daily ops driver. Connectors to your enterprise stack, skills, scheduled tasks, mounted folders. The SUV.' },
  code: { title: 'Claude Code', why: 'CLI. Real engineering. Subagents, swarms, hooks, MCP servers. The pickup truck.' },
};
const MODELS: Record<Model, { title: string; why: string }> = {
  haiku: { title: 'Haiku', why: 'Cheap and fast. Use for high-volume classification subagents — labeling, normalizing, bulk passes.' },
  sonnet: { title: 'Sonnet', why: 'Default workhorse. Refactors, doc writing, code review, glue code. ~90% of normal work.' },
  opus: { title: 'Opus', why: 'Senior brain. Architecture, multi-file reasoning across unfamiliar code, anything where wrong-but-confident is expensive.' },
};
