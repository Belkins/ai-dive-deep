import * as Popover from '@radix-ui/react-popover';
import { glossary } from '@/lib/glossary';

export default function GlossaryPopover({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  const entry = glossary[term];
  if (!entry) return <span>{children}</span>;

  const baseUrl = (import.meta as any).env?.BASE_URL ?? '/';
  const base = baseUrl.replace(/\/$/, '');

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="glossary-term"
          style={{ background: 'transparent', border: 'none', padding: 0, font: 'inherit', cursor: 'help' }}
        >
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded-md p-3 shadow-2xl text-sm"
          style={{
            background: 'rgb(var(--paper))',
            border: '1px solid rgb(var(--line))',
            color: 'rgb(var(--fg))',
            zIndex: 50,
            maxWidth: '20rem',
            maxHeight: 'min(60vh, 22rem, var(--radix-popover-content-available-height, 22rem))',
            overflowY: 'auto',
            animationDuration: '160ms',
          }}
          sideOffset={6}
          collisionPadding={12}
        >
          <div className="font-medium mb-1.5" style={{ color: 'rgb(var(--accent))' }}>
            {entry.term}
          </div>
          {/* Trusted static HTML from src/lib/glossary.ts, rendered the way /glossary renders it. */}
          <div
            className="glossary-popover-def leading-relaxed"
            style={{ color: 'rgb(var(--fg) / 0.92)' }}
            dangerouslySetInnerHTML={{ __html: entry.definition }}
          />
          {entry.related && entry.related.length > 0 && (
            <div className="mt-2 flex items-center gap-1 flex-wrap text-xs" style={{ color: 'rgb(var(--muted))' }}>
              <span>Related:</span>
              {entry.related.map((r) => (
                <a key={r} href={`${base}/glossary/#${encodeURIComponent(r)}`} style={{ textDecoration: 'underline' }}>
                  {r}
                </a>
              ))}
            </div>
          )}
          <a
            href={`${base}/glossary/#${encodeURIComponent(term)}`}
            className="block mt-2.5 text-xs"
            style={{ color: 'rgb(var(--muted))', textDecoration: 'underline' }}
          >
            Open glossary →
          </a>
          <Popover.Arrow style={{ fill: 'rgb(var(--paper))' }} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
