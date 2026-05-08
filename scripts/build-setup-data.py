#!/usr/bin/env python3
"""Build src/lib/setup.ts from ~/.claude/skills/ + ~/.claude/agents/ + plugins.json.

Run from repo root: python3 scripts/build-setup-data.py
"""
import json, os, re, sys

HOME = os.path.expanduser('~')
SKILLS_DIR = os.path.join(HOME, '.claude/skills')
AGENTS_DIR = os.path.join(HOME, '.claude/agents')
PLUGINS_JSON = os.path.join(HOME, '.claude/plugins/installed_plugins.json')

# Category map for skills — manual classification of Vlad's known patterns.
SKILL_CATEGORIES = {
    'daily': 'ops', 'weekly': 'ops', 'retro': 'ops', 'sprint-kickoff': 'ops',
    'vault-audit': 'ops', 'vault-note': 'ops', 'telegram-report': 'ops',
    'health-pulse': 'ops', 'memory-hygiene': 'ops', 'learn': 'ops',

    'audit': 'review', 'ultrareview': 'review', 'security-review': 'review',
    'security-audit': 'review', 'harden': 'review', 'bughunter': 'review',
    'debugging-guide': 'review', 'debug-swarm': 'review', 'review-and-fix': 'review',
    'perf-check': 'review', 'tdd-workflow': 'review', 'gstack-review': 'review',
    'gstack-qa': 'review', 'gstack-careful': 'review',

    'build-feature': 'build', 'deploy-check': 'build', 'git-ship': 'build',
    'scaffold': 'build', 'quick-fix': 'build', 'refactor': 'build',
    'pitch-html': 'build', 'ship-ios': 'build', 'preflight-ios': 'build',
    'diagnose-iap': 'build', 'device-logs': 'build',
    'vercel-env-flip': 'build', 'verify-next-public-env': 'build',
    'verify-file-durability': 'build', 'supabase-state-check': 'build',
    'apps-script-clasp-push': 'build', 'google-apps-script-debug': 'build',
    'webhook-guide': 'build', 'api-design': 'build',

    'research': 'strategy', 'competitor-intel': 'strategy',
    'growth-scan': 'strategy', 'monetize-idea': 'strategy',
    'ahrefs-budget-check': 'strategy', 'swarm-strategic-plan': 'strategy',
    'ultraplan': 'strategy', 'plan-only': 'strategy',
    'mirror-pattern': 'strategy', 'gstack-office-hours': 'strategy',
    'content-draft': 'strategy', 'seo-check': 'strategy',

    'pc': 'portfolio', 'pc-api': 'portfolio', 'pc-client': 'portfolio',
    'lingualive': 'portfolio',

    'agent-wave-verify': 'meta', 'preflight-external-deps': 'meta',
    'teleport': 'meta',
}

PLUGIN_CATEGORIES = {
    'ralph-loop': 'workflow',
    'frontend-design': 'design',
    'code-review': 'review',
    'context7': 'docs',
    'github': 'platform',
    'supabase': 'platform',
    'agent-sdk-dev': 'build',
    'feature-dev': 'build',
    'revenue-os': 'workflow',
    'vercel': 'platform',
    'swift-lsp': 'platform',
    'telegram': 'platform',
}

def parse_frontmatter(text):
    m = re.match(r'^---\s*\n(.*?)\n---', text, re.DOTALL)
    if not m: return {}
    fm = m.group(1)
    out = {}
    desc_match = re.search(r'^description:\s*\|\s*\n((?:[ \t]+.*\n?)+)', fm, re.MULTILINE)
    if desc_match:
        out['description'] = ' '.join(line.strip() for line in desc_match.group(1).splitlines() if line.strip())
    else:
        d = re.search(r'^description:\s*(.+?)\s*$', fm, re.MULTILINE)
        if d:
            out['description'] = d.group(1).strip().strip('"').strip("'")
    name = re.search(r'^name:\s*(.+?)\s*$', fm, re.MULTILINE)
    if name: out['name'] = name.group(1).strip()
    return out

def collect_skills():
    out = []
    for entry in sorted(os.listdir(SKILLS_DIR)):
        p = os.path.join(SKILLS_DIR, entry, 'SKILL.md')
        if not os.path.isfile(p): continue
        try:
            with open(p, 'r', errors='ignore') as f:
                fm = parse_frontmatter(f.read())
        except Exception:
            continue
        desc = fm.get('description', '').strip()
        if len(desc) > 360:
            desc = desc[:357].rstrip() + '…'
        out.append({
            'name': entry,
            'description': desc,
            'category': SKILL_CATEGORIES.get(entry, 'meta'),
        })
    return out

def collect_agents():
    out = []
    for f in sorted(os.listdir(AGENTS_DIR)):
        if not f.endswith('.md'): continue
        p = os.path.join(AGENTS_DIR, f)
        try:
            with open(p, 'r', errors='ignore') as fh:
                fm = parse_frontmatter(fh.read())
        except Exception:
            continue
        name = fm.get('name', f.replace('.md', ''))
        desc = fm.get('description', '').strip()
        # Strip examples and other long-form artifacts; just first sentence(s)
        # Many agent descriptions include `<example>` blocks — cut at the first <example>
        if '<example>' in desc:
            desc = desc.split('<example>')[0].strip()
        if 'Examples:' in desc:
            desc = desc.split('Examples:')[0].strip()
        if len(desc) > 360:
            desc = desc[:357].rstrip() + '…'
        out.append({
            'name': name,
            'description': desc,
            'category': 'agent',
        })
    return out

def collect_plugins():
    if not os.path.isfile(PLUGINS_JSON):
        return []
    with open(PLUGINS_JSON) as f:
        data = json.load(f)
    out = []
    for full_name in sorted(data.get('plugins', {}).keys()):
        # full name: 'github@claude-plugins-official' or 'revenue-os@local'
        name, _, source = full_name.partition('@')
        out.append({
            'name': name,
            'source': source,
            'category': PLUGIN_CATEGORIES.get(name, 'platform'),
        })
    return out

def main():
    skills = collect_skills()
    agents = collect_agents()
    plugins = collect_plugins()

    js = ['// Auto-generated from ~/.claude — do not edit by hand.', '// Run scripts/build-setup-data.py to refresh.', '']
    js.append("export type Skill = { name: string; description: string; category: string };")
    js.append("export type Agent = { name: string; description: string; category: 'agent' };")
    js.append("export type Plugin = { name: string; source: string; category: string };")
    js.append('')
    js.append(f"export const SKILLS: Skill[] = {json.dumps(skills, indent=2)};")
    js.append('')
    js.append(f"export const AGENTS: Agent[] = {json.dumps(agents, indent=2)};")
    js.append('')
    js.append(f"export const PLUGINS: Plugin[] = {json.dumps(plugins, indent=2)};")
    js.append('')
    js.append(f"// Stats")
    js.append(f"export const SETUP_STATS = {{ skills: {len(skills)}, agents: {len(agents)}, plugins: {len(plugins)} }} as const;")

    out_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'setup.ts')
    out_path = os.path.normpath(out_path)
    with open(out_path, 'w') as f:
        f.write('\n'.join(js))

    print(f"Wrote {out_path}")
    print(f"  Skills:  {len(skills)}")
    print(f"  Agents:  {len(agents)}")
    print(f"  Plugins: {len(plugins)}")

if __name__ == '__main__':
    main()
