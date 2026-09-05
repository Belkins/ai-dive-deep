import { useEffect, useRef, useState } from 'react';
import { Copy, Download, Eraser, FilePlus2, Printer, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  WORKFLOW_FIELDS, WORKFLOW_TEMPLATES, buildWorkflowPlan, emptyWorkflowDraft, getWorkflowTemplate,
  isWorkflowPresetId, parseWorkflowPreset,
} from '@/lib/workflow-plan';
import type { WorkflowDraft, WorkflowField, WorkflowIssue, WorkflowPresetId } from '@/lib/workflow-plan';

function ToolButton({ label, icon: Icon, disabled, onClick }: {
  label: string; icon: LucideIcon; disabled: boolean; onClick: () => void;
}) {
  return <button type="button" className="wp-icon-button" aria-label={label} title={label} disabled={disabled} onClick={onClick}>
    <Icon size={18} aria-hidden="true" />
  </button>;
}

function DraftFields({ draft, issues, disabled, onChange }: {
  draft: WorkflowDraft; issues: WorkflowIssue[]; disabled: boolean;
  onChange: (key: WorkflowField, value: string) => void;
}) {
  return <fieldset className="wp-fields" disabled={disabled}>
    <legend className="sr-only">Workflow requirements; all fields required</legend>
    {WORKFLOW_FIELDS.map((field) => {
      const error = issues.find((issue) => issue.field === field.key);
      const id = `workflow-${field.key}`;
      const props = {
        id, value: draft[field.key], required: true, autoComplete: 'off',
        placeholder: field.placeholder, 'aria-invalid': Boolean(error),
        'aria-describedby': error ? `${id}-error` : undefined,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(field.key, event.target.value),
      };
      return <div className="wp-field" key={field.key}>
        <label htmlFor={id}>{field.label}</label>
        {field.rows === 1 ? <input {...props} type="text" /> : <textarea {...props} rows={field.rows} />}
        {error && <p id={`${id}-error`} className="wp-error">{error.message}</p>}
      </div>;
    })}
  </fieldset>;
}

export default function WorkflowPlanner() {
  const [templateId, setTemplateId] = useState<WorkflowPresetId>(WORKFLOW_TEMPLATES[0].id);
  const [draft, setDraft] = useState(() => getWorkflowTemplate(WORKFLOW_TEMPLATES[0].id));
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState('');
  const [copying, setCopying] = useState(false);
  const baseline = useRef(draft);
  const revision = useRef(0);
  const loadedSearch = useRef<string | null>(null);
  const result = buildWorkflowPlan(draft);
  useEffect(() => {
    const restorePreset = () => {
      const selected = parseWorkflowPreset(window.location.search);
      // Preserve Astro's history metadata, but never copy query fields into the draft.
      if (window.location.search !== selected.search) {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${selected.search}${window.location.hash}`);
      }
      if (loadedSearch.current === selected.search) return;
      loadedSearch.current = selected.search;
      const next = getWorkflowTemplate(selected.presetId);
      revision.current += 1;
      setTemplateId(selected.presetId);
      setDraft(next);
      baseline.current = next;
      setNotice(selected.rejected ? 'Unsupported URL options were ignored. Only a known preset ID can load a template. Tests have not been run.' : 'Template loaded. All proposed steps and tests remain not run.');
    };
    restorePreset();
    setHydrated(true);
    window.addEventListener('popstate', restorePreset);
    document.addEventListener('astro:page-load', restorePreset);
    return () => {
      revision.current += 1;
      window.removeEventListener('popstate', restorePreset);
      document.removeEventListener('astro:page-load', restorePreset);
    };
  }, []);

  function updateDraft(next: WorkflowDraft) {
    revision.current += 1;
    setDraft(next);
    setNotice('');
  }

  function replaceDraft(next: WorkflowDraft, clear = false) {
    const dirty = WORKFLOW_FIELDS.some(({ key }) => draft[key] !== baseline.current[key]);
    const hasContent = Object.values(draft).some((value) => value.trim());
    if (hasContent && (dirty || clear) && !window.confirm('Replace all current entries? Copy or download your draft first if you need to keep it.')) return;
    updateDraft(next);
    baseline.current = next;
    const search = clear ? '' : `?preset=${templateId}`;
    loadedSearch.current = search;
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${search}${window.location.hash}`);
    setNotice(clear ? 'All fields cleared. Add requirements to create a new draft.' : 'Template loaded. Review its requirements before sharing.');
  }

  async function copyMarkdown() {
    if (!result.ok) return;
    const copiedRevision = revision.current;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(result.markdown);
      if (revision.current === copiedRevision) setNotice('Markdown copied to clipboard. Tests have not been run.');
    } catch {
      if (revision.current === copiedRevision) setNotice('Clipboard unavailable. Select and copy the Markdown text, or download the file.');
    } finally { setCopying(false); }
  }

  function downloadMarkdown() {
    if (!result.ok) return;
    let url: string | undefined;
    const link = document.createElement('a');
    try {
      url = URL.createObjectURL(new Blob([result.markdown], { type: 'text/markdown;charset=utf-8' }));
      link.href = url;
      link.download = 'workflow-plan.md';
      link.className = 'ph-no-capture';
      document.body.appendChild(link);
      link.click();
      setNotice('Download requested: workflow-plan.md. Tests have not been run.');
    } catch { setNotice('Download unavailable. Copy or select the Markdown text instead.'); }
    finally {
      link.remove();
      if (url) { const objectUrl = url; window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000); }
    }
  }

  function printMarkdown() {
    if (!result.ok) return;
    try { window.print(); setNotice('Print dialog requested. Tests have not been run.'); }
    catch { setNotice('Printing unavailable. Download or copy the Markdown instead.'); }
  }

  return <div className="wp-planner ph-no-capture ph-sensitive" data-ph-no-capture data-private>
    <div className="wp-template-bar wp-no-print">
      <div className="wp-template-choice">
        <label htmlFor="workflow-template">Starting template</label>
        <select id="workflow-template" value={templateId} disabled={!hydrated} onChange={(event) => { if (isWorkflowPresetId(event.target.value)) setTemplateId(event.target.value); }}>
          {WORKFLOW_TEMPLATES.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
        </select>
      </div>
      <button type="button" className="btn-ghost wp-load" disabled={!hydrated} onClick={() => replaceDraft(getWorkflowTemplate(templateId))}>
        <FilePlus2 size={18} aria-hidden="true" /> Load template
      </button>
      <ToolButton label="Clear all fields" icon={Eraser} disabled={!hydrated} onClick={() => replaceDraft(emptyWorkflowDraft(), true)} />
    </div>
    <div className="wp-columns">
      <section id="workflow-editor" className="wp-editor wp-no-print" aria-labelledby="workflow-editor-title">
        <div className="wp-section-heading">
          <h2 id="workflow-editor-title">Requirements</h2>
          <a href="#workflow-preview">View draft</a>
        </div>
        <DraftFields draft={draft} issues={result.issues} disabled={!hydrated} onChange={(key, value) => updateDraft({ ...draft, [key]: value })} />
      </section>
      <section id="workflow-preview" className="wp-preview" aria-labelledby="workflow-preview-title">
        <div className="wp-section-heading wp-no-print">
          <h2 id="workflow-preview-title">Workflow specification</h2>
          <div className="wp-tools" role="group" aria-label="Export workflow specification">
            <ToolButton label={copying ? 'Copying Markdown' : 'Copy Markdown'} icon={Copy} disabled={!hydrated || !result.ok || copying} onClick={copyMarkdown} />
            <ToolButton label="Download Markdown" icon={Download} disabled={!hydrated || !result.ok} onClick={downloadMarkdown} />
            <ToolButton label="Print specification" icon={Printer} disabled={!hydrated || !result.ok} onClick={printMarkdown} />
          </div>
        </div>
        <p className="wp-draft-status wp-no-print" role="status" aria-live="polite" aria-atomic="true">
          {notice || (result.ok ? 'Draft only. Acceptance tests have not been run.' : `${result.issues.length} required fields need attention. Exports are unavailable.`)}
        </p>
        {result.ok ? <pre className="wp-markdown" tabIndex={0} aria-label="Workflow specification Markdown"><code>{result.markdown}</code></pre> :
          <div className="wp-empty">
            <ShieldCheck size={28} aria-hidden="true" />
            <h3>Define the boundaries first</h3>
            <p>A complete specification needs an objective, owner, trigger, inputs, outputs, approval boundaries, and acceptance tests.</p>
            <ul>{result.issues.map((issue) => <li key={issue.field}><a href={`#workflow-${issue.field}`}>{issue.message}</a></li>)}</ul>
          </div>}
        <a className="wp-back wp-no-print" href="#workflow-editor">Back to requirements</a>
      </section>
    </div>
  </div>;
}
