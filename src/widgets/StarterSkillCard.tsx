import { useState } from 'react';
import type { StarterSkill } from '@/lib/starter-skills';

export default function StarterSkillCard({ skill, baseUrl }: { skill: StarterSkill; baseUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const base = baseUrl.replace(/\/$/, '');

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(skill.skillMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onDownload = () => {
    const blob = new Blob([skill.skillMd], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.name}-SKILL.md`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <article
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}
    >
      <header className="p-5 border-b" style={{ borderColor: 'rgb(var(--line))' }}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
          <code className="font-mono text-lg" style={{ color: 'rgb(var(--accent))' }}>{skill.name}</code>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--muted))' }}>
            {skill.cadence}
          </span>
        </div>
        <p className="text-sm leading-snug m-0" style={{ color: 'rgb(var(--fg) / 0.9)' }}>{skill.oneLiner}</p>
      </header>

      <div className="p-5 space-y-3 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>Trigger phrases</div>
          <div className="font-mono text-xs leading-relaxed" style={{ color: 'rgb(var(--fg) / 0.85)' }}>{skill.trigger}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>Expected output</div>
          <div className="text-xs leading-relaxed" style={{ color: 'rgb(var(--fg) / 0.85)' }}>{skill.output}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>Chapters that teach the bits</div>
          <div className="flex flex-wrap gap-1.5">
            {skill.chapters.map((c) => (
              <a
                key={c.slug}
                href={`${base}/chapters/${c.slug}/`}
                className="text-xs px-2 py-0.5 rounded no-underline"
                style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--accent))' }}
              >
                {c.ref}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="text-xs px-3 py-1.5 rounded-md"
          style={{ background: 'rgb(var(--accent))', color: 'white' }}
        >
          {copied ? '✓ Copied to clipboard' : 'Copy SKILL.md'}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="text-xs px-3 py-1.5 rounded-md"
          style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}
        >
          Download as file
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs px-3 py-1.5 rounded-md ml-auto"
          style={{ border: '1px solid rgb(var(--line))', color: 'rgb(var(--muted))' }}
        >
          {open ? 'Hide preview' : 'Preview'}
        </button>
      </div>

      {open && (
        <pre className="m-0 p-4 text-[12px] font-mono leading-relaxed overflow-x-auto" style={{ background: 'rgb(var(--bg))', borderTop: '1px solid rgb(var(--line))', color: 'rgb(var(--fg) / 0.92)', maxHeight: 380 }}>
          <code>{skill.skillMd}</code>
        </pre>
      )}

      <div className="px-5 py-3 text-[11px] font-mono" style={{ background: 'rgb(var(--bg))', borderTop: '1px solid rgb(var(--line))', color: 'rgb(var(--muted))' }}>
        Save to: <span style={{ color: 'rgb(var(--accent))' }}>~/.claude/skills/{skill.name}/SKILL.md</span>
      </div>
    </article>
  );
}
