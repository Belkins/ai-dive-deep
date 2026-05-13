# Ch 39 — usability + installation walkthroughs

## Part A — Operator-first-time-install read

Read through the eyes of someone who's heard "Claude has Skills" five times on podcasts and never run `git clone` against `~/.claude/skills/`. Where the chapter assumes too much, fear-mongers, or stays abstract:

- **L18-20 (cold open).** "Six skills installed back-to-back" — the reader doesn't know what installing a skill looks like. No command shown. They imagine an app store. The cold open lands harder if line 18 carries a one-line aside: *"install = `git clone <repo> ~/.claude/skills/<name>`, then Claude picks them up on next session start."*
- **L28-35 (the 73% problem).** The bullet list is precise but reads like a benchmark report to a non-installer. "Allowed-tools posture" and "frontmatter" arrive before the reader has seen a SKILL.md. Risks feeling like fear-mongering — *another* "ecosystem is broken" headline. Fix: one inline 6-line code block showing a real `frontmatter` block (good vs. wildcarded) before the bullets. Concretize before generalizing.
- **L47-49 (S-tier entries).** Each S-tier library gets a stars + URL + one-paragraph description. Zero "how would I actually try this." A reader who trusts the recommendation has nowhere to go. Every S-tier needs a 2-line install hook: clone command + the smoke-test prompt. Part B below fills this.
- **L54 (antigravity-awesome-skills).** "1,459+ skills" with no install path or curation guide reads as a warning, not a recommendation. Either drop or add one line: *"if you install, use their installer CLI — don't symlink the whole thing into `~/.claude/skills/`."*
- **L61 (trailofbits).** Strongest pattern in the chapter, weakest hook. "B-tier for stars, A+ for pattern" is exactly right, but the reader doesn't know which of the ten skills to actually try. Name one. (Part B does.)
- **L156-158 (Saturday cost).** The `allowed-tools: ["*"]` story is the right scary, but the lesson lives in another chapter. A reader who hasn't installed yet hears "this can delete your files" with no playbook for *what to read on install*. The Quickstart (Part C) closes this — the line-by-line audit move before activation.
- **General cadence.** Chapter assumes the reader knows where skills live on disk (`~/.claude/skills/`), how Claude discovers them (filesystem scan at session start), and that SKILL.md is the contract. One paragraph after the cold open carrying these three facts unblocks the rest.

## Part B — 3 walkthroughs

### anthropics/skills

The reference implementation. Install:

```bash
git clone https://github.com/anthropics/skills ~/.claude/skills/anthropic
```

Restart your Claude Code session. The skills register on session start via filesystem scan — no installer, no package manager.

**Three to try first:**

1. **`/spec`** — not a runnable skill, the SKILL.md contract itself. Open `~/.claude/skills/anthropic/spec/SKILL.md` and read it once. Every community skill you install later is graded against this file.
2. **`pdf-form-fill`** (dev/technical bucket) — practical, narrow, fires reliably. Smoke-test: drop any blank PDF form in your working directory, then prompt *"fill out this PDF using the info in my resume.md"*. If it doesn't fire, the description-matcher is the issue and the skill needs a trigger phrase edit.
3. **`brand-guidelines`** (creative/design) — useful if you maintain a style sheet. Smoke-test: create a `brand.md` with three rules, then prompt *"check this draft against my brand guidelines"*. Watch for the skill picking up the file by name.

**Known gotcha:** Anthropic's repo updates frequently. If you cloned into `~/.claude/skills/anthropic/` and skills stop firing after a Claude Code update, `cd` in and `git pull` — the SKILL.md frontmatter spec evolves and stale skills miss the new matcher fields. Pin to a tag if you want stability over freshness.

### garrytan/gstack

One operator's full Claude Code setup. MIT-licensed, ~37 skills + power tools.

```bash
git clone https://github.com/garrytan/gstack ~/.claude/skills/gstack
```

Restart Claude Code.

**Two to try first:**

1. **`/office-hours`** — the CEO-mode skill, six forcing questions on any new product idea (demand reality, status quo, desperate specificity, narrowest wedge, observation, future-fit). Smoke-test: prompt *"office hours on this idea — a Slack bot that posts our team's weekly retro to a public channel"*. The skill should run the six questions in sequence, not generic advice. If it produces bullet-point "considerations," it didn't fire.
2. **`/review`** — pre-landing PR review with SQL safety + LLM trust-boundary checks. Operator-relevant for anyone shipping code, even if you're not the engineer. Smoke-test: in any repo with an open PR, prompt *"/review this PR against main"*. Expect a structured diff analysis with severity tags, not free-form prose.

**Known gotcha:** Gstack ships ~37 skills. After install, ~12 will be irrelevant to your work (e.g., `/canary` if you don't deploy production services, `/ship-ios` if you're not on iOS). Prune them — `rm -rf ~/.claude/skills/gstack/<unused-skill>/` — because every loaded skill costs context budget on session start, and a skill that never fires is dead weight in the matcher.

### trailofbits/skills

Security-vertical example — the model to copy when publishing your own vertical.

```bash
git clone https://github.com/trailofbits/skills ~/.claude/skills/trailofbits
```

**Why this is the template:** Trail of Bits already audits smart contracts and writes Semgrep rules for paying clients. The repo is the skill version of work they bill for. The publishing thesis: *"this is a credible vertical, here's the skill bundle, our audience is now indexed against our brand."* That's the move for any operator with a defensible vertical — sales-ops, content-ops, deliverability, mentoring. Read their `README.md` and the structure of any one SKILL.md inside, then mirror the shape.

**One specific skill: `semgrep-rule-creator`.** Generates a custom Semgrep rule from a natural-language description of a code anti-pattern you want to catch. Smoke-test: prompt *"write me a Semgrep rule that flags any `eval()` call inside a route handler"*. The skill should produce a ready-to-paste YAML rule with `pattern:` + `message:` + `severity:`. If you get prose explaining what Semgrep is, the skill misfired.

The lesson is structural: one repo, ten skills, all derived from real client work. Star count (5.2k) is irrelevant. The pattern is the asset.

## Part C — Quickstart section draft

### Quickstart: install your first community skill in ten minutes

Three commands, two files to read, one habit that keeps your vault intact.

**Step 1 — clone (60 seconds).** Skills live at `~/.claude/skills/`. Pick one library from the tier list. Clone into a named subdirectory:

```bash
git clone https://github.com/garrytan/gstack ~/.claude/skills/gstack
```

That's the install. No package manager, no registry, no `npm install`. Claude Code scans `~/.claude/skills/**/SKILL.md` on session start.

**Step 2 — read SKILL.md before activation (3 minutes).** Open the SKILL.md of the first skill you plan to use. Four lines decide whether it fires safely:

- **`description:`** — should read like a search query, not marketing copy. If under 20 words or zero trigger phrases (*"use when the user says X"*), the matcher won't fire reliably. Skip it.
- **`allowed-tools:`** — the security line. `["Bash", "Read", "Write"]` is normal. `["*"]` is `chmod 777`. Don't install wildcard tool access from a maintainer you don't trust.
- **`version:`** — present means maintained. Missing means one-shot. Treat one-shots as suspect.
- **Body structure.** Look for code blocks and named sections. A wall of prose can't be parsed into an imperative — Claude won't extract the action.

**Step 3 — smoke-test (3 minutes).** Restart your Claude Code session so the new skill registers. Run one prompt that matches the description's trigger phrase verbatim. Watch the response: does it use the skill's structure (named sections, expected output shape), or fall back to generic prose? Generic prose means the matcher missed — the description needs a trigger-phrase edit or the skill is broken.

**Step 4 — if it misfires.** Move it out of the active path: `mv ~/.claude/skills/<library>/<broken-skill>/ ~/.claude/skills-archive/`. Don't `rm` — the SKILL.md might be a useful starting point for your own version. The audit habit: read every imported SKILL.md before the next session start. Eight seconds per skill. Saves the Saturday I had.

## Recommended insertion points

- **Part B — anthropics/skills walkthrough:** insert after L47 (the `anthropics/skills` bullet in the S tier). It earns the deepest first-touch because it doubles as the SKILL.md spec primer.
- **Part B — gstack walkthrough:** insert after L48 (the `garrytan/gstack` bullet). This is the library most operators should actually install first; the walkthrough turns the recommendation into action.
- **Part B — trailofbits walkthrough:** insert after L144 (the end of "The Trail of Bits vertical pattern" paragraph, before the bulleted list of un-built operator verticals). The walkthrough completes the pattern lesson — *here's how to actually open the repo and see the shape you'd mirror*.
- **Part C — Quickstart section:** insert as a new H2 between the current "Saturday, 10:42 AM, six tabs" cold open (ends L24) and "The 73% problem" (starts L26). The reader meets the failure mode in the cold open, gets a working ten-minute path *before* hearing the audit numbers, and arrives at the 73% problem already equipped with the audit habit. Alternative: place after "The 73% problem" (L39) if the chapter prefers problem-before-playbook cadence — but earlier is better for a reader who hasn't installed before.
