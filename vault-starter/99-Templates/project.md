<%*
const today = tp.date.now("YYYY-MM-DD");
-%>
---
created: <% today %>
last_updated: <% today %>
tags: [project]
status: active
type: [initiative | deal | content | side-bet | relationship]
owner: 
parent: 
deadline: 
---

# <% tp.file.title %>

## What it is
[One paragraph. The thing, the outcome, the lifecycle.]

## State
**Status:** active / paused / shipped / killed
**Last update:** <% today %>
**Next milestone:** 
**Health:** 🟢 / 🟡 / 🔴

## Why this exists
[One paragraph. What hurts if we don't do this. What we believe will change.]

## Open threads
- [ ] 

## Done = 
[One sentence. The unambiguous test.]

## Not done = 
- [What we won't build]
- [Scope creep to refuse]

## Decisions
| Date | Decision | Reasoning |
| ---- | -------- | --------- |
|      |          |           |

## Notes & artifacts

## Backlinks
```dataview
LIST FROM [[]] WHERE file.path != this.file.path
```
