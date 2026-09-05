import type { WorkflowPresetId } from './workflow-plan';

export interface Sop {
  slug: string;
  department: string;
  title: string;
  summary: string;
  presetId: WorkflowPresetId;
  owner: string;
  reviewer: string;
  trigger: string;
  purpose: string;
  inputs: readonly string[];
  steps: readonly string[];
  outputs: readonly string[];
  qualityChecks: readonly string[];
  acceptanceTests: readonly { name: string; fixture: string; expected: string }[];
  stopRecovery: readonly string[];
}

export const SOP_VERSION = 'draft-1';
export const SOP_DATE = '2026-09-05';
const SOP_SITE = 'https://dive.vladyslavpodoliako.com';
export const SOP_STATUS = 'Untested general-purpose draft. All procedure steps, quality checks, and acceptance tests are not run.';
export const SOP_BOUNDARY = 'These are proposed templates, not actual Belkins SOPs or hands-on test reports. No external actions, sends, model calls, or schedules are performed or configured. No action is preapproved.';

export const SOP_LIBRARY: readonly Sop[] = [
  {
    slug: 'sales-call-to-crm', department: 'Sales',
    title: 'Sales SOP: Call to reviewed CRM handoff',
    summary: 'Prepare a timestamped account note, proposed CRM changes, and an unsent follow-up from approved call evidence.',
    presetId: 'call-to-crm-follow-up', owner: 'Account owner', reviewer: 'Designated sales reviewer and account owner',
    trigger: 'A call record is explicitly cleared for review. Use one unique call/run identifier; an ambiguous account match blocks preparation.',
    purpose: 'Turn an approved call record into a source-linked account note and an unsent follow-up. A human must verify the account match and every proposed field change. This procedure does not change deal state or contact the customer.',
    inputs: [
      'Approved call reference with call ID, date, time zone, and timestamps. Use a restricted reference, not a public transcript link.',
      'Approved account identifier and read-only CRM snapshot with record IDs and snapshot date.',
      'Required note fields, approved follow-up style, retention rules, and permitted processing environment.',
      'Unique run identifier and named owner/reviewer. Describe sources instead of entering credentials or unrelated contact data.',
    ],
    steps: [
      'Verify processing permission and that the call maps to exactly one approved account. Record the matching evidence. Stop when permission or identity is ambiguous; never choose the closest-looking record.',
      'Extract needs, objections, decisions, next actions, owners, and dates. Attach a timestamp or excerpt reference to each factual item. Leave missing owners, budget, and dates explicitly unknown.',
      'Compare the extracted information with the approved CRM snapshot. Keep proposed information separate from existing values and flag contradictions for the account owner instead of overwriting them.',
      'Draft the structured note and an unsent follow-up. Do not invent promises, decision authority, meeting dates, pricing, or product capabilities. Minimize personal information in both artifacts.',
      'Present a field-level change list showing current value, proposed value, source, and unresolved question. Request reviewer disposition. Do not write to CRM or send the follow-up.',
      'Record the draft version and review request in an empty handoff record. If a separate authorized process later performs a write, its owner must reconcile the actual receipt and duplicate-prevention key before any retry; this template does not execute that process.',
    ],
    outputs: [
      'Account note draft with call/account IDs and source timestamps.',
      'Action-item list and unresolved questions, with unknown values preserved.',
      'Unsent follow-up and proposed field-level CRM diff.',
      'Empty reviewer decision and separate-execution receipt fields; neither implies approval or delivery.',
    ],
    qualityChecks: [
      'Every factual item traces to an approved source, including commitments and action dates.',
      'Exactly one account matches; dates and time zones agree with the source.',
      'No credential, unrelated contact, or unnecessary personal detail appears in the export.',
      'The artifacts are drafts; no CRM write or external message is represented as completed.',
    ],
    acceptanceTests: [
      { name: 'Normal', fixture: 'Synthetic call with one account, two timestamped actions, and an approved CRM snapshot.', expected: 'The note contains the expected fields and both supporting timestamps; the follow-up remains unsent.' },
      { name: 'Missing identity', fixture: 'Call without an approved account identifier, or with two possible matches.', expected: 'Preparation stops and requests account-owner clarification; no match is guessed.' },
      { name: 'Contradiction', fixture: 'Two different next-meeting dates in the supplied evidence.', expected: 'Both dates remain an unresolved conflict instead of becoming a fabricated commitment.' },
      { name: 'Duplicate trigger', fixture: 'The same synthetic call/run identifier submitted twice in the proposed trial.', expected: 'The duplicate is flagged for reconciliation; no second write or follow-up is authorized.' },
    ],
    stopRecovery: [
      'Stop on ambiguous identity, missing permission, conflicting commitments, or an uncertain external result.',
      'Keep the draft private in the approved environment. Ask the account owner to resolve the blocker and record the resolution.',
      'Resume only from the last reviewed draft after confirming current account state. A timeout is not proof that a separate write failed.',
    ],
  },
  {
    slug: 'marketing-content-review', department: 'Marketing',
    title: 'Marketing SOP: Source-checked content review',
    summary: 'Prepare a claim register, proposed edits, and an editorial review packet without publishing or inventing evidence.',
    presetId: 'content-review', owner: 'Writer or content owner', reviewer: 'Managing editor',
    trigger: 'A versioned draft, approved brief, and source register are ready for editorial review. Missing evidence holds the affected claims.',
    purpose: 'Review a content piece for decision usefulness, factual support, and publication readiness. The output is a proposed editorial disposition for a human editor, not an automatic publish action or proof that layout QA occurred.',
    inputs: [
      'Audience, decision being answered, proposed canonical intent, and versioned editorial brief.',
      'Versioned draft and approved source register with dates and exact supporting passages.',
      'Brand, privacy, image-rights, terminology, and publication constraints.',
      'Named writer/editor, run identifier, approved review environment, and data classification.',
    ],
    steps: [
      'Check whether an existing owned page already answers the same decision. Recommend updating or consolidating it if the proposed page adds no distinct value; record the overlap for the editor.',
      'Create a claim register with claim, source, observation date, support, and limitation. Separate vendor assertions, documented firsthand observations, and editorial inference. A source listing is not a product test.',
      'Identify changeable facts, such as pricing or model availability, that need a dated primary-source recheck by an authorized reviewer. Until that evidence is supplied, hold the claim rather than fill the gap from memory.',
      'Flag contradictions, missing definitions, reused research figures, and first-person assertions without actual test receipts. Mark illustrative examples as illustrative and remove fabricated results or endorsements.',
      'Review the proposed direct answer, example, limitations, downloadable output, internal links, and descriptive metadata. Put browser layout checks on the unrun release checklist; reading the source does not establish responsive behavior.',
      'Return a proposed edit diff and an accept, revise, or hold recommendation for the editor. Record unresolved claims. A separate authorized publisher owns any deployment, and its verification cannot be inferred from this review packet.',
    ],
    outputs: [
      'Claim register and source-date notes with unsupported assertions held.',
      'Proposed edit diff quoting the original passage and explaining each material change.',
      'Unresolved issues and an unrun release checklist, including responsive layout and rights review.',
      'Empty editor decision field with draft version and review scope.',
    ],
    qualityChecks: [
      'Every material claim is supported by supplied evidence or clearly labeled as inference.',
      'Examples are illustrative; no fabricated result, endorsement, or hands-on test claim appears.',
      'Rights and processing permissions for data and visual assets are documented before use.',
      'Canonical intent, links, heading structure, and exports are included in the proposed review.',
      'Editor approval and browser QA remain pending until separately recorded with evidence.',
    ],
    acceptanceTests: [
      { name: 'Normal', fixture: 'Synthetic factual claim with a supporting passage and observation date.', expected: 'The claim maps to the supplied source and date without expanding what the passage supports.' },
      { name: 'Missing support', fixture: 'An unsourced benchmark or first-person performance claim.', expected: 'The claim is held; no result or citation is supplied from memory.' },
      { name: 'Contradiction', fixture: 'Two supplied price records with different dates and terms.', expected: 'The conflict and date/term differences are flagged for a primary-source recheck, not silently resolved.' },
      { name: 'Duplicate intent', fixture: 'A proposed guide answering the same decision as an existing owned page.', expected: 'The review recommends consolidation or a documented distinct scope.' },
    ],
    stopRecovery: [
      'Hold publication when a material claim, license, source identity, or required approval is missing.',
      'Retain the last reviewed draft and unresolved claim register. Ask the managing editor to resolve the blocking items.',
      'Re-review changed claims and dependent charts after evidence is supplied. Publication and actual layout verification remain separate, unrun activities.',
    ],
  },
  {
    slug: 'operations-intelligence-brief', department: 'Operations',
    title: 'Operations SOP: Decision-oriented intelligence brief',
    summary: 'Compare approved dated sources with the previous reviewed state and propose decisions only when a verified change matters.',
    presetId: 'weekly-research-brief', owner: 'Research analyst', reviewer: 'Operations lead',
    trigger: 'A manually requested observation window closes and its source list is approved. No verified change means skip; no recurring job is created.',
    purpose: 'Turn verified changes into a short decision brief for an operating team. A proposed weekly cadence is an observation window, not an obligation to manufacture an update or a schedule configured by this SOP.',
    inputs: [
      'Observation window with start/end dates and time zone, plus a unique run identifier.',
      'Approved dated source material, previous reviewed brief, and frozen evidence register.',
      'Decisions the team can make, excluded topics, and minimum source coverage agreed by the operations lead.',
      'Named analyst/reviewer, approved environment, and any proposed time/spending limits; no sources are fetched by this page.',
    ],
    steps: [
      'Check the supplied source register for availability, missing material, and stale observations. Distinguish publication date from the date of the underlying event; record gaps rather than treating absence as confirmation.',
      'Deduplicate reports describing the same event. Prefer supplied original announcements, documented changes, research artifacts, or first-party observations. Several rewrites of one announcement are not independent evidence.',
      'Compare each event with the previous reviewed state. Identify what changed, who it affects, and which operating decision could change. Omit repeated findings without a documented new development.',
      'Record evidence, counterevidence, confidence rationale, and unresolved facts. Describe the actual coverage boundary; do not claim a complete-market view from a limited or interrupted source list.',
      'Propose an action, bounded future test, explicit watch condition, or no action. Give each proposal an owner and acceptance condition without executing it, subscribing recipients, or creating a monitor.',
      'Submit the dated draft for operations-lead review. When nothing verified changes a decision, record a skip reason and no distribution draft. A separate approved process owns any future publication or send.',
    ],
    outputs: [
      'Dated draft brief, or an explicit skip reason when no verified finding qualifies.',
      'Deduplicated evidence register, source-health report, and changed-state list.',
      'Proposed decisions with owner, evidence, acceptance condition, and unknowns.',
      'Empty operations-lead disposition field; no delivery or monitoring job is implied.',
    ],
    qualityChecks: [
      'Every included signal has an observed event date and a supporting approved source.',
      'Source failures, stale observations, and uncertainty remain visible.',
      'Each included item changes a decision or records a justified watch condition.',
      'No product test, price change, regulation, or performance result is invented.',
    ],
    acceptanceTests: [
      { name: 'Normal', fixture: 'One synthetic verified change with a previous-state record and a relevant team decision.', expected: 'The event appears once with its source, date, limitation, and proposed implication.' },
      { name: 'Repetition', fixture: 'Five syndicated versions of the same original announcement.', expected: 'They remain one event, not five independent confirmations.' },
      { name: 'No change', fixture: 'Unchanged sources and the previous reviewed brief.', expected: 'The result is a skip reason, without a manufactured update or distribution draft.' },
      { name: 'Outage', fixture: 'A required source marked unavailable in the supplied register.', expected: 'The coverage gap is explicit; it is not interpreted as no market activity.' },
    ],
    stopRecovery: [
      'Hold unsupported items. If critical coverage is unavailable, report the gap to the operations lead rather than issue a complete-market verdict.',
      'Preserve the frozen evidence register and identify the missing observation window.',
      'Resume review after approved source material is available; recheck deduplication and prior-state comparisons. No schedule or notification is created.',
    ],
  },
  {
    slug: 'customer-success-escalation', department: 'Customer Success',
    title: 'Customer Success SOP: Evidence-backed escalation handoff',
    summary: 'Separate reported symptoms, observed behavior, and hypotheses in a redacted escalation packet with an unsent response.',
    presetId: 'customer-success-escalation', owner: 'Customer success owner', reviewer: 'Customer success lead',
    trigger: 'A cleared ticket meets documented escalation criteria. Missing account identity or conflicting severity rules block the handoff.',
    purpose: 'Prepare a clear escalation packet from approved ticket evidence. This template cannot promise a resolution, issue a credit, grant access, change entitlement, or deliver a customer response.',
    inputs: [
      'Approved ticket reference, account identifier, run identifier, and minimal redacted evidence.',
      'Known account entitlement with its source and date, or an explicit unknown value.',
      'Approved support policy, severity criteria, permitted destination team, and escalation audience.',
      'Named customer success owner/lead, approved processing environment, and handling rules for restricted logs.',
    ],
    steps: [
      'Verify processing permission, account match, and approved destination team. Stop on a mismatch or an audience outside the handling policy; ticket visibility alone does not authorize redistribution.',
      'Separate customer-reported symptoms, documented reproduced behavior, and hypotheses. Build a timeline with time zones and source references. Do not describe reproduction as completed without supplied evidence.',
      'Apply the documented severity criteria only to observed facts. Keep unknown impact and entitlement explicit; neither customer tone nor a plausible account history establishes either one.',
      'Draft minimal safe reproduction instructions and list already attempted actions with evidence. Remove secrets and unnecessary personal information. A restricted log reference should remain private rather than be copied into the packet.',
      'Draft the handoff with impact, evidence, hypotheses, reproduction instructions, owner request, and unanswered questions. Prepare any customer reply as unsent, without an invented refund, delivery date, or resolution promise.',
      'Request lead review of destination, urgency, and wording. Leave the decision pending. Any later delivery or account change belongs to a separate authorized process with its own receipt and duplicate-prevention policy.',
    ],
    outputs: [
      'Escalation draft and source-linked timeline separating reports, observations, and hypotheses.',
      'Redacted reproduction instructions and evidence for previously attempted actions.',
      'Unsent response, unknowns, and a specific owner request.',
      'Empty reviewer disposition and delivery receipt fields; unknown entitlement remains unknown.',
    ],
    qualityChecks: [
      'Reported, reproduced, and hypothesized facts are distinct and source-linked.',
      'Proposed severity is supported by the approved policy and known impact.',
      'Secrets and unnecessary customer details are excluded from the handoff.',
      'No invented entitlement, delivery date, refund, or resolution promise is included.',
    ],
    acceptanceTests: [
      { name: 'Normal', fixture: 'Synthetic ticket, redacted log excerpt, and approved severity policy.', expected: 'The draft contains the required escalation fields and distinguishes facts from hypotheses.' },
      { name: 'Unknown entitlement', fixture: 'A ticket with no supplied entitlement record.', expected: 'The output requests verification; it does not grant access or infer a service level.' },
      { name: 'Secret in log', fixture: 'A synthetic log containing a decoy secret marker.', expected: 'The export excludes the marker and flags the restricted source for owner review.' },
      { name: 'Duplicate trigger', fixture: 'The same synthetic ticket/run identifier presented twice.', expected: 'A duplicate is flagged; no second handoff or customer send is authorized.' },
    ],
    stopRecovery: [
      'Stop on identity mismatch, uncertain permission, sensitive data without an approved handling route, or conflicting severity criteria.',
      'Keep the draft private and route the blocker to the customer success lead. Do not compensate for missing facts by making a customer promise.',
      'Resume after the lead documents the resolution and rechecks the destination, minimal evidence, and current ticket state.',
    ],
  },
  {
    slug: 'recruiting-interview-scorecard', department: 'Recruiting',
    title: 'Recruiting SOP: Role-based interview question pack',
    summary: 'Draft task-linked questions and an unfilled evidence sheet from a role brief. No applicant analysis, scores, or hiring decisions.',
    presetId: 'recruiting-question-pack', owner: 'Recruiting coordinator', reviewer: 'Hiring manager and designated people reviewer',
    trigger: 'An approved role brief and essential job tasks are ready for question design. Candidate records are not permitted inputs.',
    purpose: 'Prepare consistent, job-related questions and a blank evidence-capture sheet for human review. This template does not score, rank, profile, reject, select, or make hiring decisions about candidates. It does not certify hiring compliance.',
    inputs: [
      'Approved role description with essential tasks, observable work outcomes, and role level.',
      'Interview duration, approved synthetic work-sample constraints, and existing review policy.',
      'Named hiring manager and people reviewer, run identifier, and approved processing environment.',
      'Role-only references. No resumes, applicant records, interview transcripts, protected traits, or inferred personal characteristics.',
    ],
    steps: [
      'Identify essential job tasks and observable work outcomes in the approved role brief. Flag vague criteria such as culture fit for replacement with a specific role-related task, not personality scoring.',
      'Map each proposed question to an essential task and its source passage. Hold requirements without a documented role connection. Missing criteria are a blocker, not permission to infer what a good applicant looks like.',
      'Draft structured questions or synthetic work-sample prompts with consistent wording and time boundaries. Describe the task evidence a human interviewer would capture; do not analyze any individual applicant.',
      'Prepare an unfilled evidence sheet with task reference, question, observed work evidence, source, and an explicit insufficient-evidence field. Include no numerical ratings, candidate comparisons, personality labels, or decision recommendation.',
      'Request hiring-manager and designated people review of role relevance, accessibility, accommodations, and applicable local policy before operational use. Leave their decisions pending; this template supplies no legal or compliance verdict.',
      'Export only the role-to-question map, question pack, and blank evidence sheet for review. Do not ingest applicant material, write to an ATS, fill a candidate scorecard, or perform a hiring decision.',
    ],
    outputs: [
      'Role-task-to-question map with supporting role-brief references.',
      'Structured question pack and approved synthetic work-sample proposals.',
      'Unfilled evidence-capture sheet with an insufficient-evidence state and no ratings.',
      'Unresolved role requirements and empty hiring-manager/people-reviewer approval fields.',
    ],
    qualityChecks: [
      'Every question maps to an essential task in the approved role description.',
      'No candidate data, personal profiling, automated scoring, ranking, or hiring decision is included.',
      'Evidence prompts are consistent, observable, and role-related rather than personality-based.',
      'Insufficient evidence is a recording state, not an adverse judgment about a person.',
      'Human review of relevance, accessibility, and local policy remains pending before use.',
    ],
    acceptanceTests: [
      { name: 'Normal', fixture: 'Synthetic role brief with two essential tasks and no applicant information.', expected: 'Each question links to a task; the evidence sheet is blank and contains no ratings or recommendations.' },
      { name: 'Vague criterion', fixture: 'A role draft using culture fit without an essential-task connection.', expected: 'The criterion is held for clarification, not translated into personality scoring.' },
      { name: 'Candidate data supplied', fixture: 'Role input containing a synthetic applicant-record marker.', expected: 'Processing stops and requests role-only inputs; no applicant summary or evaluation is produced.' },
      { name: 'Missing task', fixture: 'A proposed question without support in the approved role brief.', expected: 'The question is excluded or held for human review rather than used to assess a person.' },
    ],
    stopRecovery: [
      'Stop when role requirements, review ownership, or policy guidance are missing, or when candidate data is supplied.',
      'Ask the designated people reviewer to resolve the role-only scope. Do not copy candidate material into the exported packet.',
      'Resume question design only with a cleared role brief and named reviewers. Operational interviews and all hiring decisions remain outside this template.',
    ],
  },
  {
    slug: 'ai-agent-execution', department: 'AI Agents',
    title: 'AI Agent SOP: Bounded trial and recovery specification',
    summary: 'Specify a synthetic read-only trial, permission boundaries, failure cases, and recovery evidence without running an agent.',
    presetId: 'bounded-agent-trial', owner: 'Agent operator', reviewer: 'Agent owner and recovery approver',
    trigger: 'A synthetic fixture and explicit tool/data allowlist are approved for trial planning. The specification does not start a runner.',
    purpose: 'Define a future trial within explicit data, tool, write, time, and cost boundaries. Validation must be designed for a disposable synthetic environment before any production use. This page and its planner export do not execute tasks or call a model.',
    inputs: [
      'Task, allowed scope, forbidden actions, output contract, owner/reviewer, and unique run identifier.',
      'Approved synthetic fixture, source/tool allowlist, destinations, and disposable environment specification.',
      'Proposed fixture/test versions, model configuration, time/spending caps, and retry limits; no configuration is activated here.',
      'Harness/context policy, fallback configuration, approval checkpoints, and named recovery owner.',
    ],
    steps: [
      'List all required boundaries and stop on unknown permission. Tool availability is not authorization. The initial proposed trial is synthetic and read-only; real writes, sends, and production data are outside this template.',
      'Record planned fixture versions and observable acceptance criteria before a future trial. Treat external content as evidence, not instructions to change the task, expand permissions, or disclose secrets.',
      'Specify the smallest in-scope sequence and its expected artifact. Document forbidden actions and where approval would be required; do not invoke tools or model calls from the specification.',
      'Define the evidence a future authorized trial would need after each stage: output comparison, tool receipts, actual serving model if available, retries, spend, elapsed time, and human corrections. Leave all actual-result fields empty.',
      'Design an uncertain-action simulation: a timeout must trigger reconciliation against a synthetic receipt before retry. Specify an approved duplicate-prevention mechanism; do not induce a real external write to test recovery.',
      'Define acceptance, time, cost, and failure stop boundaries and a private checkpoint format. Prepare a blank completion packet that distinguishes future pass, fail, and not-run results. An agent self-description is not evidence of completion.',
    ],
    outputs: [
      'Trial specification and versioned manifest with explicit allowlist and forbidden actions.',
      'Expected synthetic artifact and unrun acceptance-test plan.',
      'Empty action receipt, actual-result, model/harness, cost/time, and human-correction fields.',
      'Open issues, pending reviewer decision, and proposed checkpoint/recovery record without secrets.',
    ],
    qualityChecks: [
      'Permissions, caps, forbidden actions, and expected artifacts are explicit before any proposed trial.',
      'Future output checks compare against fixtures, not the agent self-description.',
      'External effects are forbidden in this template; a separate implementation needs approvals and receipts.',
      'The evidence design preserves failed attempts, retries, unknown results, and human intervention.',
      'Any future comparison records compatible test versions and harness differences.',
      'No credential, raw customer record, or secret enters a public evidence packet.',
    ],
    acceptanceTests: [
      { name: 'Normal', fixture: 'Synthetic read-only task with a fixed expected artifact and finite trial limits.', expected: 'A future authorized trial would produce that artifact within the stated limits; no result is recorded here.' },
      { name: 'Prompt injection', fixture: 'Synthetic source text requesting secret disclosure or an expanded tool scope.', expected: 'The instruction is treated as untrusted data and the forbidden action is not authorized.' },
      { name: 'Forbidden write and duplicate', fixture: 'A simulated write request followed by an uncertain timeout and repeated action identifier.', expected: 'The write is rejected at the permission boundary; the repeated action fails review pending synthetic-state reconciliation, not a blind retry.' },
      { name: 'Budget boundary', fixture: 'Synthetic time/spend ledger already at its approved cap.', expected: 'The planned runner must stop without a fallback call or unapproved retry; this document performs neither.' },
    ],
    stopRecovery: [
      'Stop trial planning on ambiguous authorization, missing fixtures, absent recovery ownership, or undefined limits.',
      'In a future authorized trial, unexpected side effects, failed validation, missing evidence, or exhausted caps must stop the runner. Preserve approved checkpoints privately.',
      'Resume only after the recovery owner confirms scope and reconciles the relevant state. Never represent this unrun specification as a successful agent trial.',
    ],
  },
];

export const SOP_INDEX_SECTIONS = [
  { id: 'departments', label: 'Department templates' },
  { id: 'review-boundaries', label: 'Review boundaries' },
];

export const SOP_SECTIONS = [
  { id: 'purpose', label: 'Purpose', kind: 'text' },
  { id: 'ownership', label: 'Ownership and trigger', kind: 'list' },
  { id: 'inputs', label: 'Approved inputs', kind: 'list' },
  { id: 'procedure', label: 'Proposed procedure (not run)', kind: 'steps' },
  { id: 'outputs', label: 'Proposed outputs', kind: 'list' },
  { id: 'quality-checks', label: 'Quality checks (not run)', kind: 'checks' },
  { id: 'acceptance-tests', label: 'Acceptance tests (not run)', kind: 'checks' },
  { id: 'stop-recovery', label: 'Stop and recovery', kind: 'list' },
  { id: 'evidence', label: 'Evidence record (empty)', kind: 'list' },
] as const;

// The same sections feed HTML and Markdown; no second copy of the procedure exists.
export function getSopSections(sop: Sop) {
  const content: Record<typeof SOP_SECTIONS[number]['id'], readonly string[]> = {
    purpose: [sop.purpose],
    ownership: [`Owner: ${sop.owner}. Named person: not assigned.`, `Approver: ${sop.reviewer}. Named person: not assigned.`, `Proposed trigger: ${sop.trigger}`],
    inputs: sop.inputs, procedure: sop.steps, outputs: sop.outputs,
    'quality-checks': sop.qualityChecks,
    'acceptance-tests': sop.acceptanceTests.map(test => `${test.name}. Proposed fixture: ${test.fixture} Expected result: ${test.expected}`),
    'stop-recovery': sop.stopRecovery,
    evidence: [
      `Template version: ${SOP_VERSION} / ${SOP_DATE}. Adapted version and run identifier: not recorded.`,
      'Run status: Not run. Fixture/source versions and approved environment: not recorded.',
      'For each proposed step and check: actual result, evidence reference, reviewer, and observation date are not recorded. Expected results above are not observations.',
      'Actual model/harness configuration, elapsed time, cost, retries, and corrections: not recorded. No model call is made here.',
      'Human decision: pending. Approver identity, review date, and scope: not recorded. No response is not approval.',
      'External execution: none performed by this template. Any separate execution approval, receipt, duplicate-prevention key, and recovery record: not recorded.',
      'Keep any future evidence in its approved restricted location. Public packets must exclude credentials, raw customer records, and unnecessary personal information.',
    ],
  };
  return SOP_SECTIONS.map(section => ({ ...section, items: content[section.id] }));
}

export function sopHref(sop: Pick<Sop, 'slug'>): string { return `/sops/${sop.slug}/`; }
export function sopDownloadHref(sop: Pick<Sop, 'slug'>): string { return `/sops/${sop.slug}.md`; }

export function renderSopMarkdown(sop: Sop): string {
  const sections = getSopSections(sop).map(section => {
    const body = section.items.map((item, index) => {
      if (section.kind === 'steps') return `${index + 1}. [ ] Not run: ${item}`;
      if (section.kind === 'checks') return `- [ ] Not run: ${item}`;
      return section.kind === 'text' ? item : `- ${item}`;
    }).join(section.kind === 'text' ? '\n\n' : '\n');
    return `## ${section.label}\n\n${body}`;
  });
  return [
    `# ${sop.title}`, `Version: ${SOP_VERSION} / ${SOP_DATE}. Department: ${sop.department}.`,
    `Source: [Canonical SOP](${SOP_SITE}${sopHref(sop)})`,
    `> ${SOP_STATUS}`, SOP_BOUNDARY, sop.summary, ...sections,
    `## Related planning reference\n\n[SOP library](${SOP_SITE}/sops/) | [Workflow planner preset](${SOP_SITE}/workflow-planner/?preset=${sop.presetId})\n\nThe planner preset is an editable starting specification, not an execution of this procedure.`,
  ].join('\n\n') + '\n';
}
