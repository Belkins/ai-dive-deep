import { useEffect, useRef, useState } from 'react';

type Pattern = 'fan-out' | 'pipeline' | 'map-reduce' | 'adversarial';

const PATTERNS: { id: Pattern; label: string; tagline: string; agentCount: number }[] = [
  { id: 'fan-out', label: 'Fan-out', tagline: 'One task. N independent subtasks. Recombine.', agentCount: 6 },
  { id: 'pipeline', label: 'Pipeline', tagline: 'Draft → critique → revise → publish.', agentCount: 4 },
  { id: 'map-reduce', label: 'Map-reduce', tagline: 'N workers chew chunks. Reducer merges.', agentCount: 6 },
  { id: 'adversarial', label: 'Adversarial', tagline: 'Proposer + critic + arbiter.', agentCount: 3 },
];

type AgentState = 'idle' | 'dispatched' | 'working' | 'done';

export default function SwarmVisualizer() {
  const [pattern, setPattern] = useState<Pattern>('fan-out');
  const [running, setRunning] = useState(false);
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [tick, setTick] = useState(0);
  const timers = useRef<number[]>([]);

  const cfg = PATTERNS.find((p) => p.id === pattern)!;

  useEffect(() => {
    setAgents(Array(cfg.agentCount).fill('idle'));
    setRunning(false);
    setTick(0);
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, [pattern]);

  const dispatch = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setAgents(Array(cfg.agentCount).fill('idle'));
    setTick((t) => t + 1);

    // Simulate per-pattern timing.
    if (pattern === 'fan-out' || pattern === 'map-reduce') {
      // All dispatched at once, work in parallel, complete with slight jitter.
      for (let i = 0; i < cfg.agentCount; i++) {
        timers.current.push(window.setTimeout(() => updateAgent(i, 'dispatched'), 50));
        timers.current.push(window.setTimeout(() => updateAgent(i, 'working'), 250 + i * 30));
        timers.current.push(window.setTimeout(() => updateAgent(i, 'done'), 1500 + Math.random() * 800));
      }
      timers.current.push(window.setTimeout(() => setRunning(false), 2600));
    } else if (pattern === 'pipeline') {
      for (let i = 0; i < cfg.agentCount; i++) {
        const start = 50 + i * 600;
        timers.current.push(window.setTimeout(() => updateAgent(i, 'dispatched'), start));
        timers.current.push(window.setTimeout(() => updateAgent(i, 'working'), start + 100));
        timers.current.push(window.setTimeout(() => updateAgent(i, 'done'), start + 500));
      }
      timers.current.push(window.setTimeout(() => setRunning(false), 50 + cfg.agentCount * 600 + 600));
    } else if (pattern === 'adversarial') {
      // Proposer -> critic -> arbiter
      timers.current.push(window.setTimeout(() => updateAgent(0, 'dispatched'), 50));
      timers.current.push(window.setTimeout(() => updateAgent(0, 'working'), 200));
      timers.current.push(window.setTimeout(() => updateAgent(0, 'done'), 800));
      timers.current.push(window.setTimeout(() => updateAgent(1, 'dispatched'), 900));
      timers.current.push(window.setTimeout(() => updateAgent(1, 'working'), 1100));
      timers.current.push(window.setTimeout(() => updateAgent(1, 'done'), 1700));
      timers.current.push(window.setTimeout(() => updateAgent(2, 'dispatched'), 1800));
      timers.current.push(window.setTimeout(() => updateAgent(2, 'working'), 2000));
      timers.current.push(window.setTimeout(() => updateAgent(2, 'done'), 2600));
      timers.current.push(window.setTimeout(() => setRunning(false), 2800));
    }
  };

  const updateAgent = (i: number, s: AgentState) => {
    setAgents((prev) => {
      const next = [...prev];
      next[i] = s;
      return next;
    });
  };

  const allDone = agents.length > 0 && agents.every((a) => a === 'done');

  return (
    <div
      className="container-prose"
      style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}
      >
        <div className="px-5 py-3 flex flex-wrap gap-3 items-center justify-between border-b" style={{ borderColor: 'rgb(var(--line))' }}>
          <div className="flex items-center gap-2 flex-wrap">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPattern(p.id)}
                className="text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors"
                style={{
                  background: pattern === p.id ? 'rgb(var(--accent))' : 'transparent',
                  color: pattern === p.id ? 'white' : 'rgb(var(--fg) / 0.85)',
                  border: '1px solid ' + (pattern === p.id ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={dispatch}
            disabled={running}
            className="text-sm font-medium px-3 py-1.5 rounded-md disabled:opacity-50"
            style={{ background: 'rgb(var(--fg))', color: 'rgb(var(--bg))' }}
          >
            {running ? 'Dispatching…' : allDone ? 'Re-dispatch' : 'Dispatch swarm'}
          </button>
        </div>

        <div className="px-5 pt-4 pb-2 text-sm" style={{ color: 'rgb(var(--muted))' }}>
          {cfg.tagline}
        </div>

        <div className="relative px-5 py-8 min-h-[260px]">
          <SwarmCanvas pattern={pattern} agents={agents} />
        </div>

        <div className="px-5 pb-4 grid grid-cols-3 gap-2 text-xs font-mono">
          <Stat label="Agents" value={cfg.agentCount} />
          <Stat label="Wall clock" value={pattern === 'pipeline' ? `${(cfg.agentCount * 0.6).toFixed(1)}s` : pattern === 'adversarial' ? '2.6s' : '~1.5s'} />
          <Stat label="Sequential equivalent" value={`${(cfg.agentCount * 1.5).toFixed(1)}s`} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md p-2.5" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>{label}</div>
      <div className="text-sm" style={{ color: 'rgb(var(--fg))' }}>{value}</div>
    </div>
  );
}

function SwarmCanvas({ pattern, agents }: { pattern: Pattern; agents: AgentState[] }) {
  // Geometry: one orchestrator on the left, agents arrayed to the right, lines connecting.
  const W = 600, H = 220;
  const orchX = 80, orchY = H / 2;
  const positions = agents.map((_, i) => {
    if (pattern === 'pipeline') {
      const step = (W - 160) / Math.max(1, agents.length - 1);
      return { x: orchX + 80 + i * step, y: orchY };
    }
    if (pattern === 'adversarial') {
      const labels = ['Proposer', 'Critic', 'Arbiter'];
      return { x: orchX + 100 + i * 160, y: orchY, label: labels[i] };
    }
    const angle = -Math.PI / 4 + (Math.PI / 2) * (i / Math.max(1, agents.length - 1));
    const radius = 180;
    return { x: orchX + Math.cos(angle) * radius + 80, y: orchY + Math.sin(angle) * radius * 0.55 };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full h-auto" style={{ maxHeight: 280 }}>
      {/* Lines */}
      {positions.map((p, i) => {
        const fromX = pattern === 'pipeline' && i > 0 ? positions[i - 1].x : orchX;
        const fromY = pattern === 'pipeline' && i > 0 ? positions[i - 1].y : orchY;
        const state = agents[i];
        const active = state === 'dispatched' || state === 'working';
        const done = state === 'done';
        return (
          <line
            key={i}
            x1={fromX}
            y1={fromY}
            x2={p.x}
            y2={p.y}
            stroke={done ? 'rgb(34,211,160)' : active ? 'rgb(255,107,44)' : 'rgb(140,137,124)'}
            strokeWidth={active ? 2 : 1.2}
            strokeDasharray={state === 'idle' ? '4,4' : '0'}
            opacity={state === 'idle' ? 0.4 : 0.85}
            style={{ transition: 'all 250ms ease' }}
          />
        );
      })}

      {/* Orchestrator */}
      <g>
        <circle cx={orchX} cy={orchY} r={26} fill="rgb(255,107,44)" />
        <text x={orchX} y={orchY + 4} textAnchor="middle" fontSize="11" fontFamily="ui-sans-serif" fontWeight="600" fill="white">
          orch
        </text>
        <text x={orchX} y={orchY + 50} textAnchor="middle" fontSize="10" fill="rgb(var(--muted))" fontFamily="ui-monospace, monospace">
          orchestrator
        </text>
      </g>

      {/* Agents */}
      {positions.map((p, i) => {
        const state = agents[i];
        const fill =
          state === 'done' ? 'rgb(34,211,160)' :
          state === 'working' ? 'rgb(255,107,44)' :
          state === 'dispatched' ? 'rgb(255,142,84)' : 'rgb(38,37,31)';
        const stroke =
          state === 'idle' ? 'rgb(140,137,124)' : 'transparent';
        return (
          <g key={i} style={{ transition: 'all 300ms ease' }}>
            <circle cx={p.x} cy={p.y} r={state === 'idle' ? 14 : 18} fill={fill} stroke={stroke} strokeWidth={1.2} />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="600" fill={state === 'idle' ? 'rgb(var(--muted))' : 'white'}>
              {pattern === 'adversarial' ? (i === 0 ? 'P' : i === 1 ? 'C' : 'A') : `a${i + 1}`}
            </text>
            {(p as any).label && (
              <text x={p.x} y={p.y + 38} textAnchor="middle" fontSize="9" fill="rgb(var(--muted))" fontFamily="ui-monospace, monospace">
                {(p as any).label}
              </text>
            )}
            {state === 'working' && (
              <circle cx={p.x} cy={p.y} r={22} fill="none" stroke="rgb(255,107,44)" strokeWidth="1.5" opacity="0.4">
                <animate attributeName="r" from="18" to="28" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="0.9s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}
