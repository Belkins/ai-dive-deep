<%*
const today = tp.date.now("YYYY-MM-DD");
const yday = tp.date.now("YYYY-MM-DD", -1);
const tomo = tp.date.now("YYYY-MM-DD", 1);
const dow = tp.date.now("dddd");
-%>
---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
tags: [daily]
date: <% today %>
dow: <% dow %>
---

# <% today %> · <% dow %>

← [[<% yday %>]] · [[<% tomo %>]] →

## Focus
- [ ]

## What shipped today

## What I owe to whom

## Notes & links

## Tomorrow's #1 priority
