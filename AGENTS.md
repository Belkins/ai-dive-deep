# Repository Instructions

## Sustainable issue-to-delivery workflow

- Preserve this repository's existing verification and release requirements; keep private portfolio information out of public issues and documentation.
- The coordinating agent tracks meaningful features, bugs and operational changes in one canonical repository issue; attach tiny fixes to existing work. Check for an active owner or overlapping work before starting, and preserve assignees.
- Record the intended outcome and acceptance checks, then update the relevant delivery board at task start and completion. Use the same issue identity across boards; use sub-issues for separate deliverables and keep PRs linked rather than creating duplicate delivery cards.
- Move actual work through Inbox, Refining, Ready, In progress and In review. Preserve a manually Blocked state until its named dependency is resolved. Do not invent owners, priorities or roadmap dates.
- Direct pushes remain supported when permitted by the repository's existing rules. Reference the issue and exact commit; do not create a retrospective PR. Every PR retains the full required test suite.
- Mark Done and close the deliverable only after its acceptance checks pass, including the deployment and production smoke required by this repository. Record commit, CI, review and deployment evidence as applicable; merge or issue closure alone is insufficient. A failed deployment stays unfinished.
- Preserve cancellation and duplicate closure reasons rather than counting them as shipped work. Before adding or restoring a board card, check project-side membership including archived items. Keep credentials and secret values out of all checkpoints.
