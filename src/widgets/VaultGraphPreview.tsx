import { useEffect, useRef, useState } from 'react';

type Node = { id: string; label: string; type: 'people' | 'project' | 'company' | 'daily' | 'newsletter'; cx?: number; cy?: number };
type Edge = { from: string; to: string };

const NODES: Node[] = [
  { id: 'mentee-a',     label: 'Mentee A',          type: 'people' },
  { id: 'mentee-a-1',   label: 'Session 1',          type: 'daily' },
  { id: 'mentee-a-2',   label: 'Session 2',          type: 'daily' },
  { id: 'mentee-a-3',   label: 'Session 3',          type: 'daily' },
  { id: 'mentee-a-tracker', label: 'Action Tracker', type: 'project' },
  { id: 'mentee-a-patterns', label: 'Patterns',      type: 'project' },
  { id: 'mentee-a-strategic', label: 'Strategic Map', type: 'project' },
  { id: 'belkins',      label: 'Belkins',            type: 'company' },
  { id: 'folderly',     label: 'Folderly',           type: 'company' },
  { id: 'newsletter',   label: 'Newsletter',         type: 'newsletter' },
  { id: 'newsletter-12', label: 'Issue 12',          type: 'newsletter' },
  { id: 'newsletter-13', label: 'Issue 13',          type: 'newsletter' },
  { id: '2026-04-12',    label: '2026-04-12',        type: 'daily' },
  { id: '2026-04-15',    label: '2026-04-15',        type: 'daily' },
  { id: 'cto',           label: 'CTO',                type: 'people' },
  { id: 'partner-b',     label: 'Partner B',          type: 'people' },
];

const EDGES: Edge[] = [
  { from: 'mentee-a', to: 'mentee-a-1' },
  { from: 'mentee-a', to: 'mentee-a-2' },
  { from: 'mentee-a', to: 'mentee-a-3' },
  { from: 'mentee-a', to: 'mentee-a-tracker' },
  { from: 'mentee-a', to: 'mentee-a-patterns' },
  { from: 'mentee-a', to: 'mentee-a-strategic' },
  { from: 'mentee-a-tracker', to: '2026-04-12' },
  { from: 'mentee-a-patterns', to: '2026-04-15' },
  { from: 'belkins', to: 'cto' },
  { from: 'belkins', to: 'mentee-a' },
  { from: 'folderly', to: 'cto' },
  { from: 'mentee-a', to: 'partner-b' },
  { from: 'newsletter', to: 'newsletter-12' },
  { from: 'newsletter', to: 'newsletter-13' },
  { from: 'newsletter-13', to: 'mentee-a-strategic' },
  { from: '2026-04-12', to: 'belkins' },
  { from: '2026-04-15', to: 'folderly' },
];

const TYPE_COLOR: Record<Node['type'], string> = {
  people: '#FF6B2C',
  project: '#FFB48C',
  company: '#22D3A0',
  daily: '#8C897C',
  newsletter: '#FF8E54',
};

const W = 600, H = 360;

function layout() {
  // Hand-laid radial-ish layout for clarity. Center: mentee-a.
  const positions: Record<string, { x: number; y: number }> = {
    'mentee-a':              { x: W / 2,   y: H / 2 },
    'mentee-a-1':            { x: W / 2 - 180, y: H / 2 - 80 },
    'mentee-a-2':            { x: W / 2 - 200, y: H / 2 + 0  },
    'mentee-a-3':            { x: W / 2 - 180, y: H / 2 + 80 },
    'mentee-a-tracker':      { x: W / 2 - 20,  y: H / 2 - 130 },
    'mentee-a-patterns':     { x: W / 2 + 60,  y: H / 2 - 110 },
    'mentee-a-strategic':    { x: W / 2 + 130, y: H / 2 - 60  },
    'belkins':               { x: W / 2 - 130, y: H / 2 + 130 },
    'folderly':              { x: W / 2 + 30,  y: H / 2 + 140 },
    'newsletter':            { x: W / 2 + 220, y: H / 2 - 20  },
    'newsletter-12':         { x: W / 2 + 270, y: H / 2 - 90  },
    'newsletter-13':         { x: W / 2 + 270, y: H / 2 + 30  },
    '2026-04-12':            { x: W / 2 - 60,  y: H / 2 + 90  },
    '2026-04-15':            { x: W / 2 + 80,  y: H / 2 + 90  },
    'cto':                   { x: W / 2 + 60,  y: H / 2 + 170 },
    'partner-b':             { x: W / 2 - 240, y: H / 2 + 30  },
  };
  return positions;
}

export default function VaultGraphPreview() {
  const positions = useRef(layout()).current;
  const [selected, setSelected] = useState<string>('mentee-a');

  const connectedIds = (() => {
    const set = new Set<string>([selected]);
    EDGES.forEach((e) => {
      if (e.from === selected) set.add(e.to);
      if (e.to === selected) set.add(e.from);
    });
    return set;
  })();

  const sel = NODES.find((n) => n.id === selected);

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          Vault graph — click any node
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-0">
          <div style={{ background: 'rgb(var(--bg))' }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
              {EDGES.map((e, i) => {
                const a = positions[e.from], b = positions[e.to];
                const active = connectedIds.has(e.from) && connectedIds.has(e.to);
                return (
                  <line
                    key={i}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={active ? 'rgb(255,107,44)' : 'rgb(140,137,124)'}
                    strokeWidth={active ? 1.5 : 0.7}
                    opacity={active ? 0.9 : 0.3}
                    style={{ transition: 'all 250ms' }}
                  />
                );
              })}
              {NODES.map((n) => {
                const p = positions[n.id];
                const isSelected = n.id === selected;
                const isConnected = connectedIds.has(n.id);
                return (
                  <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(n.id)}>
                    <circle
                      cx={p.x} cy={p.y}
                      r={isSelected ? 10 : isConnected ? 7 : 4.5}
                      fill={TYPE_COLOR[n.type]}
                      opacity={isConnected ? 1 : 0.45}
                      style={{ transition: 'all 250ms' }}
                    />
                    {isSelected && (
                      <circle cx={p.x} cy={p.y} r={14} fill="none" stroke={TYPE_COLOR[n.type]} strokeWidth={1.5} opacity={0.5}>
                        <animate attributeName="r" from="10" to="22" dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="1.4s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <text
                      x={p.x} y={p.y + (isSelected || isConnected ? 22 : 16)}
                      textAnchor="middle"
                      fontSize={isSelected ? 11 : 9}
                      fontFamily="ui-monospace, monospace"
                      fill={isConnected ? 'rgb(var(--fg))' : 'rgb(var(--muted))'}
                      opacity={isConnected ? 1 : 0.6}
                      style={{ transition: 'all 250ms', pointerEvents: 'none' }}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="p-5 border-t lg:border-t-0 lg:border-l" style={{ borderColor: 'rgb(var(--line))' }}>
            {sel && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: TYPE_COLOR[sel.type] }} />
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>{sel.type}</span>
                </div>
                <div className="font-display text-xl mb-2">{sel.label}</div>
                <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted))' }}>Backlinks ({connectedIds.size - 1})</div>
                <div className="space-y-1.5">
                  {Array.from(connectedIds).filter((id) => id !== selected).map((id) => {
                    const n = NODES.find((x) => x.id === id)!;
                    return (
                      <button key={id} type="button" onClick={() => setSelected(id)} className="text-left text-sm px-2 py-1 rounded w-full" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>
                        <span className="inline-block h-1.5 w-1.5 rounded-full mr-2 align-middle" style={{ background: TYPE_COLOR[n.type] }} />
                        {n.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <div className="mt-5 text-xs italic" style={{ color: 'rgb(var(--muted))' }}>
              The neuron firing. One node activates the whole network.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
