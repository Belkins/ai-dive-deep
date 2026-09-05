export const MODEL_RELEASES_CHECKED = '2026-09-05';

export const MODEL_RELEASES = [
  {
    name: 'GPT-6 Astra',
    modelId: 'gpt-6-astra',
    released: '2026-09-03',
    availability: 'Staged rollout. Availability differs across ChatGPT, Work, Codex, and the API; check your plan and workspace.',
    inputPerMillion: 10,
    outputPerMillion: 50,
    pricingNote: 'Standard API rate up to 272K input tokens. Above that threshold, the whole request costs $20 input / $75 output per million tokens. Cache and tool charges are separate.',
    context: '1,050,000-token context; 128,000-token maximum output.',
    candidate: 'Scoped repository changes, source-grounded research, and document creation with explicit acceptance tests.',
    boundary: 'Keep effort and harness versions in every result. Launch scores do not isolate model changes from changes to the agent system.',
    sources: [
      { label: 'Model reference and API rates', href: 'https://developers.openai.com/api/docs/models/gpt-6-astra' },
      { label: 'Availability by surface', href: 'https://help.openai.com/en/articles/20001354' },
      { label: 'Launch results and conditions', href: 'https://openai.com/index/gpt-6-astra/' },
    ],
  },
  {
    name: 'Claude Fable 5.1',
    modelId: 'claude-fable-5-1',
    released: '2026-09-01',
    availability: 'Generally available. Included allowance versus usage credits depends on the Claude plan; the Fable 5 launch promotion does not apply.',
    inputPerMillion: 10,
    outputPerMillion: 50,
    pricingNote: 'Standard Claude API rate across the 1M context. Cache reads cost $0.25 per million tokens; cache writes and tool charges are separate. Provider rates may differ.',
    context: '1,000,000-token context; 128,000-token maximum output.',
    candidate: 'Difficult debugging, multi-stage engineering, and research-to-document workflows with review checkpoints.',
    boundary: 'Record fallback and the model that actually served the task. Restricted-access Mythos 5.1 has different domain safeguards; its benchmark scores are not interchangeable with Fable 5.1 scores.',
    sources: [
      { label: 'Model reference', href: 'https://platform.claude.com/docs/en/models/fable-5-1/overview' },
      { label: 'API pricing', href: 'https://platform.claude.com/docs/en/about-claude/pricing' },
      { label: 'Plan access', href: 'https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan' },
      { label: 'Refusals and fallback', href: 'https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback' },
    ],
  },
] as const;
