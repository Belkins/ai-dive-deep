<%*
const monday = tp.date.weekday("YYYY-MM-DD", 1);
const friday = tp.date.weekday("YYYY-MM-DD", 5);
const week = tp.date.now("YYYY-[W]ww");
-%>
---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
tags: [weekly-review]
week: <% week %>
range: <% monday %> → <% friday %>
---

# Weekly review · <% week %>

## What shipped

## What slipped — and why

## What I owe to whom

## Patterns I saw

## Next week's #1 priority

```dataview
TABLE WITHOUT ID file.link AS "Daily note", file.cday AS Date
FROM "01-Daily"
WHERE file.cday >= date(<% monday %>) AND file.cday <= date(<% friday %>)
SORT file.cday ASC
```

## Stale projects (no update in 7+ days)

```dataview
TABLE status, last_updated
FROM "02-Projects/Active"
WHERE last_updated < date(today) - dur(7 days)
SORT last_updated ASC
```
