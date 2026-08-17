## What & why

<!-- What changes, and what problem it solves. Put `Closes #<n>` here. -->

## Contract change

<!--
Answer this even when the answer is nothing — replace the line below, do not
leave the section empty. An empty section is indistinguishable from an
unanswered one, which is the whole reason this field exists.

If the diff does not touch the shared contracts package, the answer is `none`.
Otherwise say additive or breaking, decided against this diff rather than
against the issue's dropdown — that was chosen before the diff existed, so
where the two disagree this one is right.
-->

`none`

- [ ] A breaking change names the release its expand half ships in, and what the
      consumers do in between
- [ ] The regenerated client and its call sites are in this diff

## How it was verified

<!--
List the checks you actually ran and what they printed. If you did not run
something, say so — do not claim a test passed without having run it.
-->

- [ ] Ran locally
- [ ] Tests added or updated
- [ ] Existing tests pass

## Reviewer notes

<!--
Where should the reviewer look hardest? Which parts are a guess, an assumption,
or otherwise less certain? Most of an AI-written repository is plausible on its
face — flagging the weak spots is what makes review effective.

This is also where the review fleet's result goes: which agents ran, what they
found, what was fixed and what was dismissed and why. If the routing selected
no agent, say so — "found nothing" and "did not run" are different facts.

A file on the issue's `Must not touch` list needs a line of the exact shape

    Boundary change: <path> — issue #<n> amended, <why>

without which scope-reviewer's blocker stands.
-->

---

- [ ] Scope is one concern; no unrelated reformatting or renames
- [ ] The review agents `.github/scripts/review.sh plan` named were run, and every
      finding is answered above
