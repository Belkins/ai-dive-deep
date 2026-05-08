import { useState } from 'react';

type Stage = {
  id: string;
  label: string;
  color: string;
  artifact: string;
  readyTest: string;
  failureMode: string;
  example: string;
};

const STAGES: Stage[] = [
  {
    id: 'ideation',
    label: 'Ideation',
    color: '#FF6B2C',
    artifact: 'A one-paragraph problem in plain English.',
    readyTest: 'You can name the user (yourself counts) and the moment they hurt.',
    failureMode: 'You wrote a feature list, not a problem. Cut it. Try again.',
    example: 'Daily Voice Brief: "Every Saturday morning my brain dumps the same five things and I want my coffee to read them to me."',
  },
  {
    id: 'foundation',
    label: 'Foundation',
    color: '#FF8E54',
    artifact: 'A one-page PRD with a Done = and a Not Done = section.',
    readyTest: 'The Not Done section is bigger than the Done section.',
    failureMode: 'You skipped this and went straight to code. You will rebuild a UI you didn\'t need.',
    example: 'PRD said "no multi-voice, no settings page, no audio history." Saved 4 hours later.',
  },
  {
    id: 'creation',
    label: 'Creation',
    color: '#FFB48C',
    artifact: 'The smallest valuable slice running end-to-end. Real URL, real cron, real output.',
    readyTest: 'You can demo the happy path on your phone, in the kitchen, to your kid.',
    failureMode: 'You built three abstractions before one round-trip worked. Delete and start over.',
    example: 'Slack pull → ElevenLabs MP3 → iCloud drop. 4 hours hands-on, three files, no UI.',
  },
  {
    id: 'polishing',
    label: 'Polishing',
    color: '#22D3A0',
    artifact: 'Edge cases handled. The bug list shrinks. The 80% rule kicks in: cut every feature you don\'t need today.',
    readyTest: 'You can name what you are NOT going to fix and feel okay about it.',
    failureMode: 'You polished before the foundation was right. You\'re fixing UI on a feature that shouldn\'t exist.',
    example: 'Saturday\'s cron-timezone bug. Knew about it. Shipped anyway. Fixed Sunday in 11 minutes.',
  },
  {
    id: 'security',
    label: 'Security',
    color: '#FFAA00',
    artifact: 'No secrets in the repo. Scoped keys. Allow-list deny-list. Rate limits.',
    readyTest: 'A leaked key here costs you a postmortem, not a closure email.',
    failureMode: 'Skipped this stage. See chapter 28 for the dollar amounts.',
    example: 'Spend cap on the API key. Sandbox for the agent. Logs to a private vault file.',
  },
  {
    id: 'deploy',
    label: 'Deploy',
    color: '#FF6B2C',
    artifact: 'Public URL, cron firing, the thing exists in the world without you.',
    readyTest: 'You walk away from your laptop and the thing still runs.',
    failureMode: 'You shipped without telling anyone. Distribution is a stage. Don\'t skip it.',
    example: 'Pushed to main. Vercel deploy. Cron fires Monday 7:35 AM. Phone buzzes. Press play.',
  },
];

export default function StagesFlow() {
  const [selected, setSelected] = useState<string>('foundation');
  const sel = STAGES.find((s) => s.id === selected) ?? STAGES[0];

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          The six stages — click any one
        </div>

        <div className="p-5">
          {/* Stage row */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
            {STAGES.map((s, i) => {
              const isSelected = s.id === selected;
              return (
                <div key={s.id} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelected(s.id)}
                    className="flex flex-col items-center gap-1.5 transition-transform"
                    style={{ transform: isSelected ? 'scale(1.05)' : 'scale(1)' }}
                  >
                    <span
                      className="rounded-full font-mono text-[11px] flex items-center justify-center"
                      style={{
                        width: 36, height: 36,
                        background: isSelected ? s.color : 'rgb(var(--bg))',
                        color: isSelected ? 'white' : 'rgb(var(--fg))',
                        border: '2px solid ' + s.color,
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[11px] font-medium whitespace-nowrap" style={{ color: isSelected ? s.color : 'rgb(var(--muted))' }}>
                      {s.label}
                    </span>
                  </button>
                  {i < STAGES.length - 1 && (
                    <span className="font-mono" style={{ color: 'rgb(var(--muted))', opacity: 0.5 }}>→</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <DetailCard
              label="Artifact"
              hint="What gets produced"
              text={sel.artifact}
              color={sel.color}
            />
            <DetailCard
              label="Ready test"
              hint="How you know to advance"
              text={sel.readyTest}
              color={sel.color}
            />
            <DetailCard
              label="Failure mode"
              hint="What breaks if you skip it"
              text={sel.failureMode}
              color="rgb(var(--accent))"
            />
          </div>

          <div className="mt-3 rounded-md p-3" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>One real example</div>
            <div className="text-sm leading-relaxed" style={{ color: 'rgb(var(--fg) / 0.92)' }}>{sel.example}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, hint, text, color }: { label: string; hint: string; text: string; color: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color }}>{label}</span>
        <span className="text-[9px]" style={{ color: 'rgb(var(--muted))' }}>{hint}</span>
      </div>
      <div className="text-sm leading-snug" style={{ color: 'rgb(var(--fg) / 0.9)' }}>{text}</div>
    </div>
  );
}
