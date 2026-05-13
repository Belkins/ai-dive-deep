<%*
const today = tp.date.now("YYYY-MM-DD");
-%>
---
created: <% today %>
last_updated: <% today %>
tags: [company, project]
status: active
my_role: [founder | ceo | advisor | investor | board]
stage: [pre-seed | seed | series-a | growth | scaling]
revenue_band: [<$10K | $10-100K | $100K-1M | $1M-10M | $10M+]
mrr: 
headcount: 
---

# <% tp.file.title %>

## What it is
[One paragraph. Product, market, why it exists.]

## My role
[Founder / CEO / advisor / investor / board. % equity. Time commitment per week.]

## State
- **MRR / revenue:** 
- **Headcount:** 
- **Burn / runway:** 
- **Last raise:** 
- **#1 risk this quarter:** 
- **#1 opportunity this quarter:** 

## Open threads
- [ ] 

## Key people
- [[CTO name]] — technical lead
- [[Co-founder]] — co-founder
- [[Investor]] — lead investor

## This quarter
**Goal:** 
**Test:** 

## Decisions log
| Date | Decision | Why |
| ---- | -------- | --- |
|      |          |     |

## Backlinks
```dataview
LIST FROM [[]] WHERE file.path != this.file.path
```
