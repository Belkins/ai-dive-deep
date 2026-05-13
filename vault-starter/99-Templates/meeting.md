<%*
const today = tp.date.now("YYYY-MM-DD");
const now = tp.date.now("HH:mm");
-%>
---
created: <% today %> <% now %>
tags: [meeting]
date: <% today %>
attendees: 
type: [1on1 | team | external | board | mentee | investor]
---

# <% tp.file.title %>

**Date:** <% today %> · <% now %>
**Attendees:** 
**Channel:** [Zoom / in-person / phone]

## Prep (read before the call)
- What they want:
- What I want:
- Open thread from last:

## Live notes

## Decisions made
- 

## Action items
- [ ] [me] 
- [ ] [them] 

## Sentiment
[Single sentence on tone, energy, where we're going from here.]

## Backlinks
```dataview
LIST FROM [[]] WHERE file.path != this.file.path
```
