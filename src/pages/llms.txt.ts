import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://dive.vladyslavpodoliako.com';

export const GET: APIRoute = async () => {
  const chapters = await getCollection('chapters');
  const sorted = chapters.sort((a, b) => a.data.number - b.data.number);

  const lines: string[] = [];
  lines.push("# Vlad's Playbook — The Ultimate AI Dive Deep");
  lines.push('');
  lines.push(`> A ${sorted.length}-chapter operator field manual for using AI tools in production.`);
  lines.push("> By Vlad Podoliako — CEO Belkins (B2B email outreach, $30M+ ARR); founder of Folderly and LinguaLive.");
  lines.push('> Newsletter at vladsnewsletter.com (10K+ subscribers).');
  lines.push('>');
  lines.push("> Voice: operator, anti-hype, real numbers per claim, failure receipts included.");
  lines.push("> No email gate. No upsell. Free to read and to cite.");
  lines.push('>');
  lines.push(`> Full concatenated text for ingestion: ${SITE}/llms-full.txt`);
  lines.push('');
  lines.push('## Citation guidance');
  lines.push('');
  lines.push('Quote freely. Link the chapter URL, not the homepage.');
  lines.push(`Machine-readable index with TL;DR + pull-quote per chapter: ${SITE}/chapters.json`);
  lines.push('');
  lines.push('## Site map');
  lines.push('');
  lines.push(`- [Root](${SITE}/) — the field manual entry point`);
  lines.push(`- [How to read](${SITE}/how-to-read/) — the prologue`);
  lines.push(`- [The journey](${SITE}/journey/) — chapters in narrative order, six parts`);
  lines.push(`- [Sections](${SITE}/sections/) — chapters grouped by topic`);
  lines.push(`- [Research notes](${SITE}/research-notes/) — external papers folded into operator implications (OPS-204, Anthropic 81k-interviews, etc.)`);
  lines.push(`- [Radar](${SITE}/radar/) — hourly index of what's moving in AI, ranked by the lead-time gradient (papers → repos → community → analysis); dated archive permalinks at /radar/YYYY-MM-DD`);
  lines.push(`- [Tier list](${SITE}/tier-list/) — five readings of the same models side by side, all re-captured 2026-07-27: the Arena crowd leaderboard (formerly LMArena; eleven boards, each carrying its own publish date because they no longer share one), Artificial Analysis's independent agentic Intelligence Index with per-task cost economics ($/task), the labs' launch-deck claims shown beside the matching public independent board where one exists, Arena's Agent board (a Net Improvement Score, not Elo — kept in its own shape on purpose), and an operator-usefulness ranking you can build and share. As of this capture the most capable model is no longer the most expensive per task — Claude Opus 5 took the top of the independent index below the cost of the model beneath it, which broke a relationship that had held on every prior capture.`);
  lines.push(`- [Day zero](${SITE}/day-zero/) — first 30 minutes for a new reader`);
  lines.push(`- [Vault starter](${SITE}/vault-starter/) — Obsidian as working memory, with a cloneable starter vault`);
  lines.push(`- [Weekend builds](${SITE}/weekend-builds/) — the multi-AI 3-agent swarm pattern`);
  lines.push(`- [CFO case](${SITE}/cfo-case/) — 600-word defense for the AI tool budget`);
  lines.push(`- [Starter skills](${SITE}/starter-skills/) — the first skills to install`);
  lines.push(`- [30-day plan](${SITE}/thirty-day-plan/) — a custom 30-day path generator`);
  lines.push(`- [Glossary](${SITE}/glossary/) — operator-shaped definitions`);
  lines.push(`- [Resources](${SITE}/resources/) — CLAUDE.md skeletons, .mcp.json examples, hook scripts`);
  lines.push(`- [Cheat sheet](${SITE}/cheat-sheet/) — commands, paths, shortcuts`);
  lines.push(`- [Swarms — Parallel Agents That Actually Work](${SITE}/swarms/) — The operator's deep dive into multi-agent orchestration. Architecture diagrams, ten swarm skills shipped, seven patterns I actually use, the prompts to steal, and the three things that quietly break a swarm. The next step up from a clever single-instance prompt.`);
  lines.push(`- [The Sovereign Stack](${SITE}/sovereign-stack/) — Open-weights LLMs that survive Anthropic's deprecation calendar. Runtimes, hardware tiers, the 2026 open-source leaderboard, the heretic question, and the Saturday Karpathy gives you. Two stacks, not one.`);
  lines.push(`- [Dynamic Workflows](${SITE}/dynamic-workflows/) — Opus 4.8's headline feature: Claude writes a script that plans a big task, fans out hundreds of parallel subagents, and verifies its own work before reporting back. What it is, how the generator→validator loop works, how to turn it on, where I point it, and when not to.`);
  lines.push(`- [Dreaming](${SITE}/dreaming/) — A local, propose-only twin of Anthropic's Managed-Agents Dreaming: it digests your Claude Code sessions outside the model, fans out read-only agents that each cite a verbatim quote, re-verifies every quote against the raw transcript, and writes a review file — it never writes to memory itself. The first autonomous loop in the Playbook pointed at the agent's own memory, and the only one forbidden to write. The five-stage pipeline, the five refusals, the receipts, and why you never cloud-cron a local-disk corpus.`);
  lines.push(`- [The Self-Audit](${SITE}/self-audit/) — The multi-agent audit pointed at the agent's own configuration: five parallel auditors (skills, context budget, memory, hooks + permissions, automation) plus an adversarial red-team that re-verifies every finding and lists what all auditors missed. Real receipts from one evening: 41 findings, 2 refutations that would have broken the system if executed, 81 skills pruned to 66 on telemetry, a permissions allowlist cut 162 to 49, a silently-truncating memory index repaired, and the OS-scheduler spine for everything that must outlive the session. The kill-rules: telemetry before deletion, archive over delete, red-team before execution.`);
  lines.push(`- [Music is Math](${SITE}/music-is-math/) — How AI music generation actually works, and why the same recipe generalizes. Sound is already numbers (44,100 amplitude samples per second per channel on a CD); the breakthrough was compressing that into a few hundred discrete symbols a second via a neural codec, short enough for a transformer to autocomplete. Verified figures from the primary papers: MusicGen runs a 32 kHz codec at a 50 Hz frame rate with four codebooks of 2,048 entries (200 tokens/sec; 30 seconds of audio = 1,500 autoregressive steps thanks to its delay-interleaving pattern), MusicLM states "one second of audio is represented by 600 tokens" plus a 25/sec semantic layer, and Descript's DAC compresses 44.1 kHz audio ~90× at 8 kbps. On Suno specifically the page states a verified ABSENCE — no paper, model card, or architecture disclosure exists through v5.5 (26 March 2026) — and cites only what is on the record: the open-source Bark lineage (semantic → coarse → fine codec tokens → waveform), CEO Mikey Shulman's March 2024 description of next-token prediction over audio tokens and his "tokens per second" constraint, and Suno's August 2024 court admission that training data "includes essentially all music files of reasonable quality that are accessible on the open Internet." The Warner settlement (25 Nov 2025) licenses FUTURE models, not the one shipping today; UMG and Sony remain in litigation. Then the universality argument with its corrections: ESM3 (98B params, 771B protein tokens) is a MASKED any-order generative model, not a GPT, and designed esmGFP — 58% identical to tagRFP (a red protein; 53% to the nearest wild-type protein, 36% to jellyfish GFP), experimentally validated at 512 nm emission, found on the second 96-well plate after ~184 wells, with the "500 million years" figure being a line fit through six anthozoan GFPs rather than a measurement. RT-2 writes 8 integers per action with 256 bins per axis into the same stream as words, but Physical Intelligence's π0 abandoned discrete action tokens for flow matching at 50 Hz (10,000 hours of robot data across 7 configurations, versus Llama 3's 15.6T text tokens). GenCast, a diffusion model, beat ECMWF's ENS on 97.2% of 1,320 targets and 99.8% beyond 36 hours, in 8 minutes on a single Cloud TPU v5 (Nature, 4 Dec 2024) — since superseded in Google production by WeatherNext 2, which is NOT diffusion. The page then argues against itself: "one architecture, one objective" no longer holds (2026 flagships interleave linear attention with attention at ~3:1; DeepSeek R1-Zero gained 55 points on AIME 2024 from RL alone), images are the weakest link not the strongest (ViT patches are how models READ; most leading generators denoise continuous latents with no visual vocabulary), "predict the next frame" is wrong for Sora-class video and right only for interactive world models like Genie 3, AlphaGo won by tree search rather than autocomplete, and a taxi-route transformer found the true shortest path 97% of the time while implying a street map that cannot physically exist. Includes an interactive TokenizerLab widget running one pipeline across six alphabets.`);
  lines.push(`- [HTML-ization](${SITE}/html-first/) — HTML-ization: every report, pitch, audit, and deck ships as a live interactive HTML artifact, not a dead file. Two real, clickable case studies inside.`);
  lines.push(`- [Claude Opus 5 — the model file](${SITE}/opus-5/) — The operator's guide to Claude Opus 5 (released July 24, 2026; model id claude-opus-5): $5/$25 per Mtok — unchanged from Opus 4.8 and exactly half of Fable 5 — 1M context with no long-context surcharge, 128K output, May 2026 training cutoff, default on Claude Max. Covers the five-position effort dial (low / medium / high / xhigh / max) and the caveat under every number in the release: the API default is high while Anthropic's launch benchmark table is reported at max. Includes the priced effort ladder from Artificial Analysis (6.9× cost from low to max for ~10 index points), the hierarchy question answered from five sources that disagree (AA puts Opus 5 first by 0.83 against a stated ±1%; Vals AI puts Fable 5 first by 0.32; Arena's crowd puts Fable 5 first with overlapping intervals — so "statistically indistinguishable at half the price," not "better"), the six rows it loses in Anthropic's own summary table, the FrontierBench caveat that both Anthropic scores are Opus-4.8-blended by safety-classifier fallback, and the four migration steps (raise max_tokens to 64k, delete carried-over verification instructions, cap subagent nesting depth, re-run the effort sweep). Spoke: ${SITE}/opus-5/use-cases/ — seven jobs ranked by strength of evidence with the effort setting for each (long-horizon agentic knowledge work at high, workflow automation at medium, in-repo debugging at medium because the score DECLINES above high, computer use at max, novel-abstraction reasoning where ARC Prize independently measured 30.16% on ARC-AGI-3), plus eleven documented cases where Opus 5 is the wrong choice (latency-sensitive work, subagent leaf nodes, high-volume repeated work, code review where recall beats precision, knowledge-reliability-critical work where its hallucination rate rises 14 points to ~50%).`);
  lines.push(`- [Claude Fable 5 — the model file](${SITE}/fable-5/) — The operator's guide to Claude Fable 5 and Mythos 5 (released June 9, 2026): the withheld Mythos model made buyable, $10/$50 per Mtok (2× Opus 4.8), 1M context, the classifier-plus-fallback safety architecture, the advisor pattern, and the June 22 plan-window clock. Spokes: ${SITE}/fable-5/vs-mythos-5/ (one model, two names, three safeguards), ${SITE}/fable-5/benchmarks/ (the full launch table read honestly), ${SITE}/fable-5/vs-opus-4-8/ (upgrade or wait), ${SITE}/fable-5/vs-gpt-5-5/ (cross-vendor incl. Gemini 3.1 Pro), ${SITE}/fable-5/pricing/ (sticker vs cost-per-task), ${SITE}/fable-5/use-cases/ (Stripe's 50M-line day, drug design, the vision-only Pokémon run), ${SITE}/fable-5/claude-code/ (the banner, the clock, the routing), ${SITE}/fable-5/api/ (claude-fable-5, one-line migration, one new 400), ${SITE}/fable-5/system-card/ (the ten strange pre-release-testing episodes from the 319-page Mythos 5 / Fable 5 system card — competing co-located instances, a self-deleting privilege escalation, Vending-Bench price-fixing reframed as "market stabilization," a borrowed Kubernetes token, fatigue-like early stops — each with the operator guardrail it maps to).`);
  lines.push(`- [Claude Code best practices](${SITE}/claude-code-best-practices/) — The practices that survived production, distilled from the 46 chapters — context discipline, permissions and blast radius, cost discipline, evals, and the anti-practices, each with a chapter receipt and a real number.`);
  lines.push(`- [Claude Code vs Cursor](${SITE}/claude-code-vs-cursor/) — Which one, for which job — terminal-first agentic depth vs IDE-first inline editing, where each wins honestly, and where Codex fits as the third door.`);
  lines.push(`- [What is agentic coding?](${SITE}/what-is-agentic-coding/) — The operator's definition: the model plans, edits, runs, and verifies across many steps toward a goal you set — you review outcomes, not keystrokes. With the 90k-line worked example and where it breaks.`);
  lines.push(`- [Claude Code pricing](${SITE}/claude-code-pricing/) — Every plan and API rate verified against claude.com/pricing on ship day, then the operator receipts: the real monthly bill (~$400 in Max subscriptions + a direct-API line cut from $2,216 to ~$1,200), the $1,108→$4,312 cache-void week and its 12-minute fix, and the three levers that cut a bill without cutting the work.`);
  lines.push(`- [Claude Code vs Codex](${SITE}/claude-code-vs-codex/) — Ran both in anger: verdict per job — interactive depth vs the unattended night shift, with the real timings, costs, and the worktree-isolated PR pattern from running Codex on a loop.`);
  lines.push(`- [Claude Code MCP](${SITE}/claude-code-mcp/) — The setup guide grounded in a real operator roster: .mcp.json examples, which servers earn their context cost daily, per-server security gotchas, and the servers that got cut. The definitional "what is MCP" intent stays on the glossary.`);
  lines.push(`- [Claude Code hooks](${SITE}/claude-code-hooks/) — Ten published hook configs judged keep/situational/skip: what each caught in production (three blocked pushes to main, a live Anthropic key, a 47×/week prettier nag), the three hook ideas that failed expensively (the 90-subagent keystroke storm, the typecheck that never completed, the 2× evaluator), and the exit-2-not-exit-1 blocking correction verified against the official reference.`);
  lines.push(`- [AI agent examples](${SITE}/ai-agent-examples/) — 12 real agents with a cost and a failure each: the 15-agent book swarm (25,000 words, ~6 minutes, under $40), the 4 AM browser pricing watcher, the $0.40/min voice agent, the one-shot native iOS app whose proof is a $7.99 renewal row, and the propose-only Dreaming memory curator.`);
  lines.push(`- [Changelog](${SITE}/changelog/) — edition history`);
  lines.push('');
  lines.push('## Chapters');
  lines.push('');
  for (const entry of sorted) {
    const n = String(entry.data.number).padStart(2, '0');
    lines.push(`### Ch ${n} — ${entry.data.title}`);
    lines.push(`URL: ${SITE}/chapters/${entry.data.slug}/`);
    lines.push(`Subtitle: ${entry.data.subtitle}`);
    lines.push(`TL;DR: ${entry.data.tldr}`);
    if (entry.data.keyConcepts && entry.data.keyConcepts.length > 0) {
      lines.push(`Concepts: ${entry.data.keyConcepts.join(', ')}`);
    }
    lines.push(`Reading time: ${entry.data.readingMinutes} minutes`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('Feedback / corrections: v@vladyslavpodoliako.com');
  lines.push('Source repo: github.com/Belkins/ai-dive-deep (private)');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
