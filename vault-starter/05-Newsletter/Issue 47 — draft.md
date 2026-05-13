---
created: 2026-05-12
last_updated: 2026-05-13
tags: [newsletter, draft, example]
status: drafting
issue_number: 47
target_ship_date: 2026-05-16
word_count_target: 1500
---

# Issue #47

> Sample newsletter draft. Adapt to your voice.

## Status
- **Stage:** drafting
- **Hook:** Microsoft Research just shipped a paper that says your AI corrupts 25% of your document after 20 edits
- **Reframe:** the drift is bursty — invisible to vibes-check, visible only to a content-diff eval
- **Operator move:** add a content-checksum eval to any long doc-editing workflow

## Cold open
It's 4:11 PM on a Wednesday and I'm reading a Microsoft Research preprint
that says the frontier models I've been delegating editing work to for
18 months silently lose ~25% of a document after 20 sequential edits.
A quarter of the file. Gone. Not visibly broken — just less of the
thing I started with.

## Act 1 — incident
[Detail the DELEGATE-52 benchmark, the 19 models, the burst pattern.]

## Act 2 — mechanism
[Why this happens — context drift, attention dilution, tool noise.
Why tools make it worse, not better. The 80/20 burst distribution.]

## Act 3 — operator move
[Content checksum eval pattern. Break long edit chains into shorter
sessions with validation steps. Use Python when you can — it's the
one safe domain. Don't reach for agentic tools by default in editing
workflows.]

## Anti-takeaway closer
The model never told me. The diff finally did.

## Voice check
- [x] No "I'm thrilled / excited / honored to"
- [x] No "in conclusion / to summarize / five lessons"
- [x] One operator-grade number per claim (25%, 20 edits, 80% of loss)
- [ ] Cut every "really / very / literally" — TODO before ship
- [x] Lowercase tendencies where they sharpen
- [x] Em-dashes welcome

## Source notes
- [[DELEGATE-52]] — primary
- [[2026-05-13]] — daily note where I first saw the paper
- [[Ch 25 - Evals]] — the chapter this issue grew out of
