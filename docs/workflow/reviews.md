# Review agents

Read-only subagents that read a branch before the pull request is opened. Which of the six run
here is `review.agents` in [.claude/workflow-kit.json](../../.claude/workflow-kit.json).

## Rules

- **CI is the only gate.** No agent blocks anything.
- **Every finding is fixed, or dismissed with a reason in "Reviewer notes".** A finding dropped
  in silence is worse than one never raised.
- **A finding whose fix is small is fixed in the pull request that raised it**, whether or not the
  file is in the issue's `Entry points`, and "Reviewer notes" names it. That a file was undeclared
  is not a dismissal.
- **Small is the fix's own diffstat, not the finding's severity** — `review.smallFix` in the
  configuration: 50 changed lines or fewer by default, no new file or module, nothing under a
  protected path.
- **A larger fix is dismissed naming a filed follow-up issue**, opened before the pull request
  leaves draft. "Worth its own change" with no number is not a dismissal.
- **A file on `Must not touch` needs a recorded [boundary change](#the-boundary-change-line)**
  however small the fix, and stays a `blocker` without one.
- **A pull request stays a draft until the fleet has read the commit it now points at**, and it
  goes back to draft when it gains another. The state is the author's — it says the author is not
  finished, never that an agent objected, and the author lifts it. It is never written in the
  title, which is the commit message.
- **On `risk/high`, `security-reviewer` wakes regardless of paths, and its findings are not the
  implementer's to dismiss** — that is the human security reviewer's call.
- **Dispatch runs once, after the local checks pass**, and all selected agents in one message.
- **Give each agent the diff and the issue body, not the repository.**
- **Nothing a deterministic check already decides may appear in an agent prompt** — see
  [What an agent may not look at](#what-an-agent-may-not-look-at).
- **A finding with no failure scenario is a `nit`**, whatever severity the agent attached.

## The boundary change line

`Must not touch` is a boundary somebody agreed to, so it clears by changing the agreement rather
than by being small. Amend the issue, then record one line per file in "Reviewer notes", in this
shape and no other:

```text
Boundary change: <path> — issue #<n> amended, <why the file had to move>
```

`scope-reviewer` matches the `Boundary change:` prefix and the path, so a correct claim written
any other way leaves the `blocker` standing.

## The fleet

Dispatched by `/pick` step 6 or `/review`; routing is
[`.github/scripts/review.sh plan`](../../.github/scripts/review.sh), which reads the table below
out of the configuration rather than holding one of its own.

| Agent | Owns | Wakes on |
| --- | --- | --- |
| `db-reviewer` | schema, migrations, indexes, N+1, transaction boundaries | its `paths` — the migrations and data-access directories |
| `security-reviewer` | authn, tenant isolation, authorization, injection, secrets, log exposure | its `paths`, or any branch whose issue carries `risk/high` |
| `simplicity-reviewer` | abstraction that earned nothing, local reimplementation, altitude | any source file |
| `test-quality-reviewer` | behaviour vs. implementation, acceptance-criteria coverage, test tier | any source file |
| `contract-reviewer` | the shared contracts package: breaking vs. additive, regeneration, ordering | its `paths` |
| `scope-reviewer` | diff vs. the issue's "Entry points", "Must not touch", "Out" | always, on an issue branch |

Per-agent `model`, `maxTurns` and finding caps live in each agent file and only there.
`maxTurns` is a runaway guard, not a work budget: an agent that reaches it stops mid-run with no
report and the dispatcher is told it finished.

## The finding format

Shared by all six so `/review` can merge and dedupe.

| Field | |
| --- | --- |
| Severity | `blocker`, `should`, `nit` |
| Location | `path:line`, repo-relative |
| Defect | one sentence |
| Failure scenario | concrete input or state → wrong outcome |
| Suggested fix | specific enough to act on |

## What an agent may not look at

Anything already decided by a check that runs in under a minute. `review.deterministicChecks` in
the configuration is that list, and every agent is told to read it. A prompt that mentions one is
defective; delete the line rather than soften it.

Keep the list current. An entry that names a check this repository stopped running is a subject
nobody reviews and nobody runs.

## What a subagent inherits

- Its own system prompt and environment details — **not** the main system prompt.
- The whole `CLAUDE.md` hierarchy. Restating a `CLAUDE.md` rule in an agent file is the error.
- **Not** the conversation, the dispatcher's reads, the output style, or memory.

Read-only holds by the `tools` allowlist, not by `permissionMode: plan` — a parent session in
`bypassPermissions` or auto mode overrides that. `Bash` is granted for `git diff`, and a shell
can write.

## Adding an agent

**The test: it owns a class of defect that no existing check decides and no existing agent
owns.** Answer both halves in the issue that proposes it, naming the check and the agent you
compared against. A new agent also needs a row in `review.agents`, or it is never dispatched.
