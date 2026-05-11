#!/usr/bin/env python3
"""Apply Edition 4 title changes — topical-primary with question-form where it
lands harder than topical. Old titles become subtitles (voice preserved).

Run from repo root: python3 scripts/apply-titles.py
"""
import os, re, sys

# slug → (new_title, new_subtitle). new_subtitle is the OLD title (voice line)
# preserved as the hype subtitle.
RENAMES = {
    '01-killed-my-tabs':     ("AI as an Operating System",                    "The Day I Killed My Tabs"),
    '02-five-tools':         ("The Five-Tool Stack",                          "Five Tools, Not Fifty"),
    '03-temp-agency':        ("Why Claude Forgets You",                       "AI Is a Temp Agency, Not a Genius"),
    '04-the-vault':          ("Obsidian as Working Memory",                   "The Vault — Where AI Becomes Useful"),
    '05-skills':             ("What a Skill Is",                              "Recipes the Chef Reads Before Cooking"),
    '06-the-swarm':          ("Parallel Subagents and Fan-Out",               "The Swarm"),
    '07-cron':               ("Scheduled Tasks",                              "Make AI Work While You Sleep"),
    '08-three-doors':        ("Chat, Cowork, or Claude Code?",                "Three Doors to Claude"),
    '09-dont-get-owned':     ("Blast Radius and Key Hygiene",                 "Don't Get Owned"),
    '10-wild-stuff':         ("Hosted Agents, Local Models, Frontier",        "The Wild Stuff"),
    '11-build-a-skill':      ("Build a Skill in 30 Minutes",                  "How to Build a Skill, End to End"),
    '12-connectors-mcp':     ("Connectors and MCP",                           "Types, install paths, custom servers"),
    '13-quickstart':         ("Claude Code in 10 Minutes",                    "The 10-Minute Quickstart"),
    '14-cheat-sheet':        ("Slash Commands and Settings",                  "The Cheat Sheet"),
    '15-permissions':        ("When to Skip Permissions",                     "Permissions, Sandboxes, and Sharp Edges"),
    '16-hooks-subagents':    ("Hooks and Custom Subagents",                   "From Autocomplete to Coworker"),
    '17-tips-tricks':        ("25 Operator Tips",                             "Hard-Won Wisdom from Hour 200"),
    '18-headless-ci':        ("Headless Claude and CI",                       "claude --print in Production"),
    '19-build-products':     ("Shipping a Product in a Saturday",             "How to Build Products with AI"),
    '20-terminal-windows':   ("tmux, Worktrees, Named Sessions",              "Running Six Claudes at Once"),
    '21-three-modes':        ("Which Mode Right Now?",                        "Interactive, Plan, Auto"),
    '22-sessions':           ("Resume, Replay, Fork",                         "Session Management"),
    '23-vibe-coding':        ("A Saturday Build, Hour by Hour",               "Vibe Coding, with the Misfires Kept In"),
    '24-tier-list':          ("The Tier List",                                "Every Tool Ranked Without Mercy"),
    '25-evals-or-hope':      ("Evals — Smoke, Regression, Golden",            "Evals or Hope, Pick One"),
    '26-team-adoption':      ("How Do I Get My Team to Adopt?",               "Getting Twelve People to Use This"),
    '27-voice-agents':       ("Voice Agents — STT, LLM, TTS",                 "Phone Number to Production"),
    '28-failure-receipts':   ("Six Failures, Six Bills",                      "The Receipts I'd Rather Not Show You"),
    '29-cost-economics':     ("Why Is My Bill So High?",                      "Token Math, Caching, Batch, Routing"),
    '30-sdk-direct':         ("When to Drop CC for the SDK",                  "Building with the Anthropic SDK Directly"),
    '31-stages':             ("Six Stages from Idea to Deploy",               "Ideation, Foundation, Creation, Polishing, Security, Deploy"),
    '32-archetypes-rick':    ("Agent Archetypes (Rick Platform)",             "OpenClaw, NemoClaw, Hermes"),
    '33-browser-agents':     ("Browser Agents with Playwright",               "Login, Click, Scrape, Post"),
    '34-write-on-behalf':    ("Persona Agents and the Four NEVERs",           "Writing on Your Behalf Without Becoming a Bot"),
    '35-codex-and-cc':       ("Codex or Claude Code — or Both?",              "Day Shift, Night Shift"),
    '36-frameworks-beyond':  ("When Do I Outgrow Claude Code?",               "Beyond CC — CrewAI, LangGraph, SDK"),
}

CHAPTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'chapters')
CHAPTERS_TS  = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'chapters.ts')

def escape_yaml_str(s: str) -> str:
    # Use double quotes; escape internal double quotes.
    return '"' + s.replace('"', '\\"') + '"'

def update_mdx(slug: str, new_title: str, new_subtitle: str):
    path = os.path.join(CHAPTERS_DIR, f'{slug}.mdx')
    if not os.path.isfile(path):
        print(f"!! missing: {path}")
        return False
    with open(path, 'r') as f:
        text = f.read()

    # frontmatter is between two --- at the top
    m = re.match(r'^(---\s*\n)(.*?)(\n---\s*\n)', text, re.DOTALL)
    if not m:
        print(f"!! no frontmatter in {slug}")
        return False
    fm = m.group(2)

    # Replace title:
    new_fm = re.sub(
        r'^title:\s*.+$',
        f'title: {escape_yaml_str(new_title)}',
        fm,
        count=1,
        flags=re.MULTILINE,
    )
    # Replace subtitle:
    new_fm = re.sub(
        r'^subtitle:\s*.+$',
        f'subtitle: {escape_yaml_str(new_subtitle)}',
        new_fm,
        count=1,
        flags=re.MULTILINE,
    )
    new_text = m.group(1) + new_fm + m.group(3) + text[m.end():]
    with open(path, 'w') as f:
        f.write(new_text)
    return True

def update_chapters_ts():
    with open(CHAPTERS_TS, 'r') as f:
        text = f.read()

    for slug, (new_title, new_subtitle) in RENAMES.items():
        # Match the line for this slug, replace title and subtitle.
        # Pattern: { number: N, slug: '...', title: '...', subtitle: '...' },
        pattern = re.compile(
            r"(\{\s*number:\s*\d+,\s*slug:\s*['\"]" + re.escape(slug) + r"['\"],\s*title:\s*)(['\"])(.*?)\2(,\s*subtitle:\s*)(['\"])(.*?)\5(\s*\})",
            re.DOTALL,
        )
        # Escape single quotes
        nt = new_title.replace("'", "\\'")
        ns = new_subtitle.replace("'", "\\'")
        replacement = r"\1'" + nt + r"'\4'" + ns + r"'\7"
        text2, n = pattern.subn(replacement, text)
        if n != 1:
            print(f"!! could not update chapters.ts for {slug} (matched {n}× — fix manually)")
        else:
            text = text2

    with open(CHAPTERS_TS, 'w') as f:
        f.write(text)
    return True

def main():
    print("Applying title changes…")
    ok = 0
    for slug, (nt, ns) in RENAMES.items():
        if update_mdx(slug, nt, ns):
            ok += 1
    print(f"  MDX files updated: {ok}/{len(RENAMES)}")
    update_chapters_ts()
    print("  chapters.ts updated")
    print("Done.")

if __name__ == '__main__':
    main()
