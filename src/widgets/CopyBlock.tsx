import { useState } from 'react';

export default function CopyBlock({ text, language = 'bash', filename }: { text: string; language?: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const onDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'snippet.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="rounded-md overflow-hidden my-3" style={{ border: '1px solid rgb(var(--line))' }}>
      <div className="flex items-center justify-between px-3 py-2 text-[11px] font-mono" style={{ background: 'rgb(var(--paper))', color: 'rgb(var(--muted))' }}>
        <span>{filename || language}</span>
        <div className="flex gap-1.5">
          {filename && (
            <button type="button" onClick={onDownload} className="px-2 py-0.5 rounded" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', color: 'rgb(var(--fg))' }}>Download</button>
          )}
          <button type="button" onClick={onCopy} className="px-2 py-0.5 rounded" style={{ background: 'rgb(var(--fg))', color: 'rgb(var(--bg))' }}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
      </div>
      <pre className="p-3 text-[12px] font-mono leading-relaxed overflow-x-auto m-0" style={{ background: 'rgb(var(--bg))', color: 'rgb(var(--fg) / 0.92)' }}>
        <code>{text}</code>
      </pre>
    </div>
  );
}
