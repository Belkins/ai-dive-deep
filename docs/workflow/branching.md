# Branches, rebasing and conflicts

How a feature branch is kept in step with the main branch, and what to do when it is not.

The main branch is squash-merged and linear: one commit per pull request, no merge commits, no
force-pushes. Keep feature branches shaped to match.

## Rules

- **Update by rebasing, never by merging the main branch in.** A merge commit adds unrelated
  changes to the diff and the squash throws it away anyway.
- **Force-push only with `--force-with-lease`.** Plain `--force` silently discards a teammate's
  work if they pushed to the same branch.
- **Never rebase or force-push the main branch.**
- **Short-lived branches are the real conflict prevention.** Open and merge within a day; a
  branch alive for a week will conflict and no merge strategy saves you. Split the work instead.
- **Rebase before starting a new chunk of work**, not only before merging.
- **Never resolve a lockfile conflict by hand.**
- **Delete the branch after merge.**

## Rebasing

```sh
git fetch origin
git rebase origin/main
git push --force-with-lease
```

On GitHub, the "Update branch" button has a rebase option — use that one.

Configure once, so the everyday commands do the right thing without thinking about it:

```sh
git config --global push.default current
git config --global pull.rebase true
git config --global rerere.enabled true
```

`rerere` remembers how you resolved a given conflict and replays it the next time the same one
appears, which happens constantly when rebasing a branch repeatedly.

## Conflicts

Resolve them during the rebase, one commit at a time:

```sh
# fix the files, then
git add <files>
git rebase --continue
# to bail out and start over
git rebase --abort
```

**A lockfile is not resolved by hand** — a hand-merged one is usually internally inconsistent and
the damage surfaces later, in CI or in production, far from the merge:

```sh
git checkout origin/main -- <lockfile>
<package-manager> install
git add <lockfile>
```

**When a rebase conflict is large in AI-written code, regenerate rather than merge.** Reset the
branch onto the current main branch and re-apply the change with the new context; reconciling two
divergent generated implementations by hand is slower and produces worse code.

## After the merge

GitHub deletes the remote branch automatically. Locally:

```sh
git switch main && git pull && git branch -D <branch>
```

`-D` and not `-d`: the squash puts the branch's commits on no ancestor of the main branch, so
`-d` refuses with "not fully merged" even though it is.
