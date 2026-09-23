// Topic filter chips for the Radar board. The pipeline (radar-pipeline #16) publishes a
// `topic` label only when its classifier is confident (receipt: right 115 of 116 at the
// published threshold); items without one appear under "All" only. Pure so it is testable:
// covered by tests/radar-topics.test.mjs.

/** Chip text per pipeline label, in the order the chips render. */
export const TOPIC_LABELS: Record<string, string> = {
  model_release: 'Models',
  research_paper: 'Research',
  tooling_or_framework: 'Tools',
  infrastructure_or_hardware: 'Infrastructure',
  policy_or_safety: 'Policy & safety',
  business_or_market: 'Business',
  operator_practice: 'Practice',
};

export interface TopicChip { topic: string; label: string; count: number }

/** Chips for the topics present on this board, in TOPIC_LABELS order; unknown labels are ignored. */
export function topicChips(items: { topic?: string }[]): TopicChip[] {
  const counts = new Map<string, number>();
  for (const it of items) if (it.topic && it.topic in TOPIC_LABELS) counts.set(it.topic, (counts.get(it.topic) ?? 0) + 1);
  return Object.keys(TOPIC_LABELS).filter((t) => counts.has(t)).map((t) => ({ topic: t, label: TOPIC_LABELS[t], count: counts.get(t)! }));
}

/** Whether a board row is hidden for the selected chip ('' = All): All hides nothing; a topic hides every other row. */
export const rowHidden = (rowTopic: string, selected: string): boolean => selected !== '' && rowTopic !== selected;
