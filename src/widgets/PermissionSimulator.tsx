import { useState } from 'react';

type Env = 'laptop' | 'sandbox' | 'ci';

const ENVS: { id: Env; label: string; desc: string }[] = [
  { id: 'laptop', label: 'Main laptop', desc: '~/.aws, ~/.kube, .env files, prod creds in scope' },
  { id: 'sandbox', label: 'Docker sandbox', desc: 'Isolated container, no network egress, scoped mount' },
  { id: 'ci', label: 'CI runner', desc: 'Ephemeral, scoped secrets, blown away at job end' },
];

const FLAGS = [
  { id: 'skipPerms', label: '--dangerously-skip-permissions', tone: 'danger' },
  { id: 'allowList', label: '--allowed-tools "Bash(npm test*),Edit(src/**)"', tone: 'good' },
  { id: 'denyEnv', label: 'deny: Edit(.env*)', tone: 'good' },
  { id: 'denyRm', label: 'deny: Bash(rm -rf*)', tone: 'good' },
  { id: 'denyPush', label: 'deny: Bash(git push origin main)', tone: 'good' },
];

type Risk = 'green' | 'yellow' | 'red';

export default function PermissionSimulator() {
  const [env, setEnv] = useState<Env>('laptop');
  const [active, setActive] = useState<Set<string>>(new Set(['allowList', 'denyEnv', 'denyRm']));

  const toggle = (id: string) => {
    setActive((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const risks = computeRisks(env, active);

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          Blast-radius simulator
        </div>

        <div className="p-5 grid gap-5 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium mb-2">Where are you running?</div>
              <div className="grid gap-1.5">
                {ENVS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setEnv(e.id)}
                    className="text-left rounded-md px-3 py-2 transition"
                    style={{
                      background: env === e.id ? 'rgb(var(--accent) / 0.12)' : 'rgb(var(--bg))',
                      border: '1px solid ' + (env === e.id ? 'rgb(var(--accent))' : 'rgb(var(--line))'),
                    }}
                  >
                    <div className="text-sm font-medium" style={{ color: env === e.id ? 'rgb(var(--accent))' : 'rgb(var(--fg))' }}>{e.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--muted))' }}>{e.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium mb-2">Flags & rules in effect</div>
              <div className="grid gap-1.5">
                {FLAGS.map((f) => {
                  const on = active.has(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggle(f.id)}
                      className="text-left rounded-md px-3 py-1.5 font-mono text-xs transition"
                      style={{
                        background: on ? (f.tone === 'danger' ? 'rgb(var(--accent) / 0.18)' : 'rgb(var(--accent-2) / 0.12)') : 'rgb(var(--bg))',
                        border: '1px solid ' + (on ? (f.tone === 'danger' ? 'rgb(var(--accent))' : 'rgb(var(--accent-2))') : 'rgb(var(--line))'),
                        color: on ? (f.tone === 'danger' ? 'rgb(var(--accent))' : 'rgb(var(--accent-2))') : 'rgb(var(--fg) / 0.8)',
                      }}
                    >
                      <span className="mr-2">{on ? '●' : '○'}</span>
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {risks.map((r) => (
              <div key={r.label} className="rounded-md p-3 flex items-center gap-3" style={{ background: 'rgb(var(--bg))', border: '1px solid ' + (r.risk === 'red' ? 'rgb(var(--accent))' : r.risk === 'yellow' ? 'rgb(255, 170, 0)' : 'rgb(var(--accent-2))') }}>
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: r.risk === 'red' ? 'rgb(var(--accent))' : r.risk === 'yellow' ? 'rgb(255, 170, 0)' : 'rgb(var(--accent-2))' }} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgb(var(--muted))' }}>{r.note}</div>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: r.risk === 'red' ? 'rgb(var(--accent))' : r.risk === 'yellow' ? 'rgb(255, 170, 0)' : 'rgb(var(--accent-2))' }}>{r.risk}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Surface = { label: string; risk: Risk; note: string };

function computeRisks(env: Env, active: Set<string>): Surface[] {
  const skip = active.has('skipPerms');
  const allowList = active.has('allowList');
  const denyEnv = active.has('denyEnv');
  const denyRm = active.has('denyRm');
  const denyPush = active.has('denyPush');

  const out: Surface[] = [];

  // Filesystem
  let fs: Risk = 'green', fsNote = 'Approval gates protect every Edit and Write.';
  if (env === 'laptop' && skip) { fs = 'red'; fsNote = 'Agent can rewrite anything in your home dir without asking.'; }
  if (env === 'laptop' && skip && (allowList || denyEnv)) { fs = 'yellow'; fsNote = 'Allow-list/deny scopes some surface, but anything not denied is open.'; }
  if (env === 'sandbox' && skip) { fs = 'green'; fsNote = 'Container is the cage. Worst case: rebuild the container.'; }
  if (env === 'ci' && skip && allowList) { fs = 'green'; fsNote = 'Tight allow-list inside ephemeral runner. Standard prod pattern.'; }
  if (env === 'ci' && skip && !allowList) { fs = 'yellow'; fsNote = 'Skip + no allow-list in CI is sloppy but bounded — runner dies in minutes.'; }
  out.push({ label: 'Filesystem (mutating)', risk: fs, note: fsNote });

  // .env files
  let envFile: Risk = denyEnv ? 'green' : 'yellow';
  let envNote = denyEnv ? '`Edit(.env*)` denied. Agent cannot rewrite secrets.' : 'Without an explicit deny, .env is reachable by any Edit.';
  if (env === 'laptop' && skip && !denyEnv) { envFile = 'red'; envNote = 'No gate, no deny. Your .env is one prompt-injection from being rewritten.'; }
  if (env !== 'laptop') { envFile = denyEnv ? 'green' : 'yellow'; envNote = env === 'sandbox' ? 'Container cage limits damage to mounted folder.' : 'CI: secrets scoped per-job; still: deny edits to .env.'; }
  out.push({ label: '.env / secret files', risk: envFile, note: envNote });

  // git push to main
  let push: Risk = denyPush ? 'green' : 'yellow';
  let pushNote = denyPush ? '`git push origin main` denied. Pushes wait for a human.' : 'Without explicit deny, agent could push to main.';
  if (env === 'laptop' && skip && !denyPush) { push = 'red'; pushNote = 'Agent can ship straight to prod without approval.'; }
  out.push({ label: 'git push origin main', risk: push, note: pushNote });

  // rm -rf
  let rm: Risk = denyRm ? 'green' : 'yellow';
  let rmNote = denyRm ? '`rm -rf` denied. Recursive deletes blocked.' : 'No explicit deny. The classic foot-gun.';
  if (env === 'laptop' && skip && !denyRm) { rm = 'red'; rmNote = 'Skip-permissions + no rm deny on your main laptop. Worst case happens here.'; }
  out.push({ label: 'rm -rf', risk: rm, note: rmNote });

  // Network egress
  let net: Risk = 'yellow', netNote = 'WebFetch and curl are reachable. Limit if not needed.';
  if (env === 'sandbox') { net = 'green'; netNote = '--network none in container. Egress impossible.'; }
  if (env === 'ci') { net = 'yellow'; netNote = 'CI typically allows egress to package registries and your own APIs.'; }
  out.push({ label: 'Network egress', risk: net, note: netNote });

  // Prod creds
  let creds: Risk = 'green', credsNote = 'No prod creds in this scope.';
  if (env === 'laptop') {
    creds = skip ? 'red' : 'yellow';
    credsNote = skip ? 'Skip-permissions on a machine with prod creds = the worst-case combo.' : 'Approval gates help, but the creds are still sitting on disk.';
  }
  if (env === 'ci') { creds = allowList ? 'green' : 'yellow'; credsNote = allowList ? 'Allow-list keeps the agent from touching anything outside its lane.' : 'Wide tool surface in CI with prod creds = audit risk.'; }
  out.push({ label: 'Production credentials', risk: creds, note: credsNote });

  return out;
}
