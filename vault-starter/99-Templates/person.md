<%*
const today = tp.date.now("YYYY-MM-DD");
-%>
---
created: <% today %>
last_updated: <% today %>
tags: [person]
status: active
relationship: [colleague | mentee | mentor | customer | investor | friend | family]
first_met: 
last_interaction: <% today %>
---

# <% tp.file.title %>

## Who they are
[One paragraph. Role, company, where you met, why they matter.]

## Open threads
- [ ] 

## Last interaction
**Date:** <% today %>
**Channel:** [Slack / email / call / in-person]
**Notes:**

## Commitments
| I owe them | They owe me | By when |
| ---------- | ----------- | ------- |
|            |             |         |

## Patterns I'm noticing

## Background

## Backlinks
```dataview
LIST FROM [[]] WHERE file.path != this.file.path
```
