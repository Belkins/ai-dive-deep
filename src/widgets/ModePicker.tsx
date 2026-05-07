import { useEffect, useState } from 'react';

type Cost = 'high' | 'medium' | 'low';
type Steps = 'few' | 'mid' | 'many';
type Awake = 'yes' | 'no';

const STORAGE_KEY = 'cc-mode-picker';

export default function ModePicker() {
  const [cost, setCost] = useState<Cost>('high');
  const [steps, setSteps] = useState<Steps>('few');
  const [awake, setAwake] = useState<Awake>('yes');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v.cost) setCost(v.cost);
        if (v.steps) setSteps(v.steps);
        if (v.awake) setAwake(v.awake);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ cost, steps, awake })); } catch {}
  }, [cost, steps, awake]);

  const recommendation = decide(cost, steps, awake);

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          Pick your mode
        </div>

        <div className="px-5 py-5 grid gap-5 md:grid-cols-2">
          <Question label="Cost of a wrong action?">
            <Choice active={cost === 'high'} onClick={() => setCost('high')} label="High" hint=".env, payments, prod migrations" />
            <Choice active={cost === 'medium'} onClick={() => setCost('medium')} label="Medium" hint="multi-file refactor, unfamiliar repo" />
            <Choice active={cost === 'low'} onClick={() => setCost('low')} label="Low" hint="sandbox, container, throwaway VM" />
          </Question>

          <Question label="How many steps?">
            <Choice active={steps === 'few'} onClick={() => setSteps('few')} label="1–4" hint="single edit, one tool call" />
            <Choice active={steps === 'mid'} onClick={() => setSteps('mid')} label="5–20" hint="refactor, migration" />
            <Choice active={steps === 'many'} onClick={() => setSteps('many')} label="100+" hint="batch classify, normalize, regenerate" />
          </Question>

          <Question label="Are you at the keyboard?">
            <Choice active={awake === 'yes'} onClick={() => setAwake('yes')} label="Yes" hint="I'll review every change" />
            <Choice active={awake === 'no'} onClick={() => setAwake('no')} label="No" hint="cron, CI, overnight job" />
          </Question>

          <div className="rounded-lg p-4 flex flex-col" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted))' }}>Recommendation</div>
            <div className="font-display text-2xl mb-1" style={{ color: recommendation.color }}>{recommendation.mode}</div>
            <div className="text-sm leading-relaxed mt-1" style={{ color: 'rgb(var(--fg) / 0.85)' }}>{recommendation.why}</div>
            <code className="mt-3 text-xs font-mono p-2 rounded" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--accent))' }}>{recommendation.command}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium mb-2" style={{ color: 'rgb(var(--fg))' }}>{label}</div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function Choice({ label, hint, active, onClick }: { label: string; hint: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-md px-3 py-2 transition"
      style={{
        background: active ? 'rgb(var(--accent) / 0.12)' : 'rgb(var(--bg))',
        border: '1px solid ' + (active ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
      }}
    >
      <div className="text-sm font-medium" style={{ color: active ? 'rgb(var(--accent))' : 'rgb(var(--fg))' }}>{label}</div>
      <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--muted))' }}>{hint}</div>
    </button>
  );
}

function decide(cost: Cost, steps: Steps, awake: Awake) {
  if (awake === 'no' && cost === 'low') {
    return {
      mode: 'Auto',
      color: '#22D3A0',
      why: 'You\'re asleep AND the environment can\'t hurt you. This is exactly what auto mode is for — sandbox, container, ephemeral VM.',
      command: 'claude --print --dangerously-skip-permissions \'…\'',
    };
  }
  if (awake === 'no' && cost !== 'low') {
    return {
      mode: 'Stop. Don\'t run.',
      color: '#FF6B2C',
      why: 'You can\'t auto-run with this blast radius. Either move into a sandbox, or wait until you\'re back at the keyboard. This is exactly the trap people fall into.',
      command: '# move work into a sandbox first',
    };
  }
  if (steps === 'many' && cost === 'low') {
    return {
      mode: 'Auto (allow-list)',
      color: '#22D3A0',
      why: 'High-volume batch work in a safe environment. Use a tight --allowed-tools allow-list — bypass interactive gates, keep the cage tight.',
      command: 'claude --allowed-tools "Bash(pytest*),Edit(src/**)" --dangerously-skip-permissions',
    };
  }
  if (steps === 'mid' || cost === 'medium') {
    return {
      mode: 'Plan, then Interactive',
      color: '#FF6B2C',
      why: 'Five-plus files or unfamiliar territory. Get the agent to describe the full plan first; read it; push back; only then run for real.',
      command: 'claude --plan',
    };
  }
  return {
    mode: 'Interactive',
    color: '#FF6B2C',
    why: 'Default mode. Every Edit, Write, Bash gets a preview and an approve gate. The slowness is the safety margin.',
    command: 'claude',
  };
}
