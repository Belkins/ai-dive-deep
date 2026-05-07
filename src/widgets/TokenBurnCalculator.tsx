import { useMemo, useState } from 'react';

// May 2026 Anthropic pricing (per million tokens). Adjust if pricing moves.
const PRICES = {
  haiku:  { input: 0.80,  output: 4.00,  cached: 0.08 },
  sonnet: { input: 3.00,  output: 15.00, cached: 0.30 },
  opus:   { input: 15.00, output: 75.00, cached: 1.50 },
};

const SR_ENG_FULLY_LOADED = 120000; // USD/yr

export default function TokenBurnCalculator() {
  const [dailyInputM, setDailyInputM] = useState(120); // input tokens (M = millions)
  const [dailyOutputM, setDailyOutputM] = useState(30);
  const [cacheHitPct, setCacheHitPct] = useState(78);
  const [sonnetPct, setSonnetPct] = useState(80);
  const [opusPct, setOpusPct] = useState(15);

  const haikuPct = Math.max(0, 100 - sonnetPct - opusPct);

  const monthly = useMemo(() => {
    const cacheRate = cacheHitPct / 100;
    const sonnetW = sonnetPct / 100;
    const opusW = opusPct / 100;
    const haikuW = haikuPct / 100;

    // Per million-tokens blended price.
    const blendedInput =
      sonnetW * (PRICES.sonnet.input * (1 - cacheRate) + PRICES.sonnet.cached * cacheRate) +
      opusW   * (PRICES.opus.input   * (1 - cacheRate) + PRICES.opus.cached   * cacheRate) +
      haikuW  * (PRICES.haiku.input  * (1 - cacheRate) + PRICES.haiku.cached  * cacheRate);
    const blendedOutput =
      sonnetW * PRICES.sonnet.output + opusW * PRICES.opus.output + haikuW * PRICES.haiku.output;

    const inputCostDay = dailyInputM * blendedInput;
    const outputCostDay = dailyOutputM * blendedOutput;
    const dayTotal = inputCostDay + outputCostDay;
    const monthTotal = dayTotal * 30;
    const yearTotal = dayTotal * 365;
    const monthTokensB = ((dailyInputM + dailyOutputM) * 30) / 1000;

    return {
      day: dayTotal,
      month: monthTotal,
      year: yearTotal,
      monthTokensB,
      engEquiv: yearTotal / SR_ENG_FULLY_LOADED,
      tokensPerDollar: monthTokensB > 0 ? (monthTokensB * 1e9) / monthTotal : 0,
    };
  }, [dailyInputM, dailyOutputM, cacheHitPct, sonnetPct, opusPct, haikuPct]);

  const noCache = useMemo(() => {
    // Same as above but cacheHitPct = 0
    const sonnetW = sonnetPct / 100;
    const opusW = opusPct / 100;
    const haikuW = haikuPct / 100;
    const blendedInput =
      sonnetW * PRICES.sonnet.input + opusW * PRICES.opus.input + haikuW * PRICES.haiku.input;
    const blendedOutput =
      sonnetW * PRICES.sonnet.output + opusW * PRICES.opus.output + haikuW * PRICES.haiku.output;
    const day = dailyInputM * blendedInput + dailyOutputM * blendedOutput;
    return day * 30;
  }, [dailyInputM, dailyOutputM, sonnetPct, opusPct, haikuPct]);

  const verdict = useMemo(() => {
    if (monthly.monthTokensB < 0.1) return { label: 'You haven\'t unlocked the swarm yet.', color: 'rgb(var(--muted))' };
    if (monthly.monthTokensB < 1) return { label: 'You\'re typing prompts.', color: 'rgb(var(--muted))' };
    if (monthly.monthTokensB < 3) return { label: 'You\'re using AI.', color: 'rgb(var(--accent-2))' };
    if (monthly.monthTokensB < 10) return { label: 'Operator-grade.', color: 'rgb(var(--accent))' };
    return { label: 'You\'re running a workforce.', color: 'rgb(var(--accent))' };
  }, [monthly.monthTokensB]);

  const fmtUSD = (n: number) => '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="container-prose" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(var(--paper))', border: '1px solid rgb(var(--line))' }}>
        <div className="px-5 py-3 border-b text-xs uppercase tracking-wider" style={{ borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }}>
          Token burn calculator
        </div>

        <div className="p-5 grid gap-5 md:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <Slider label="Daily input tokens" value={dailyInputM} setValue={setDailyInputM} min={1} max={1000} unit="M" />
            <Slider label="Daily output tokens" value={dailyOutputM} setValue={setDailyOutputM} min={1} max={250} unit="M" />
            <Slider label="Cache hit rate" value={cacheHitPct} setValue={setCacheHitPct} min={0} max={95} unit="%" />

            <div>
              <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgb(var(--muted))' }}>Model mix</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <ModelStat label="Haiku" value={haikuPct} color="#22D3A0" />
                <ModelStat label="Sonnet" value={sonnetPct} color="#FF6B2C" />
                <ModelStat label="Opus" value={opusPct} color="#FFB48C" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Slider label="Sonnet %" value={sonnetPct} setValue={(v) => setSonnetPct(Math.min(v, 100 - opusPct))} min={0} max={100} unit="%" small />
                <Slider label="Opus %" value={opusPct} setValue={(v) => setOpusPct(Math.min(v, 100 - sonnetPct))} min={0} max={100} unit="%" small />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Stat label="Monthly spend" value={fmtUSD(monthly.month)} accent />
            <Stat label="Annual spend" value={fmtUSD(monthly.year)} />
            <Stat label="Senior eng equivalents" value={`${monthly.engEquiv.toFixed(1)} × @ $120K/yr`} />
            <Stat label="Tokens / month" value={`${monthly.monthTokensB.toFixed(1)}B`} />
            <Stat label="Tokens per $" value={`~${(monthly.tokensPerDollar / 1e6).toFixed(1)}M`} />

            <div className="rounded-md p-3" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>Without prompt caching</div>
              <div className="text-sm font-mono">{fmtUSD(noCache)} / mo · <span style={{ color: 'rgb(var(--accent))' }}>+{fmtUSD(noCache - monthly.month)} extra</span></div>
            </div>

            <div className="rounded-md p-3" style={{ background: 'rgb(var(--bg))', border: '1px solid', borderColor: verdict.color }}>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgb(var(--muted))' }}>Verdict</div>
              <div className="font-display text-lg" style={{ color: verdict.color }}>{verdict.label}</div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-4 text-xs leading-relaxed" style={{ color: 'rgb(var(--muted))' }}>
          May 2026 pricing. The "without caching" line is the real bill people ship when their CLAUDE.md keeps changing. Cache caps at 95% in the slider — anything higher means you stopped writing.
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, setValue, min, max, unit, small }: {
  label: string; value: number; setValue: (v: number) => void;
  min: number; max: number; unit: string; small?: boolean;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--muted))' }}>{label}</span>
        <span className={`font-mono ${small ? 'text-xs' : 'text-sm'}`} style={{ color: 'rgb(var(--accent))' }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
        className="w-full h-1 rounded appearance-none"
        style={{ background: 'rgb(var(--line))', accentColor: 'rgb(var(--accent))' }}
      />
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md p-3" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))' }}>
      <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgb(var(--muted))' }}>{label}</div>
      <div className={`${accent ? 'font-display text-2xl' : 'font-mono text-base'}`} style={{ color: accent ? 'rgb(var(--accent))' : 'rgb(var(--fg))' }}>{value}</div>
    </div>
  );
}

function ModelStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-md p-2" style={{ background: 'rgb(var(--bg))', border: '1px solid rgb(var(--line))', textAlign: 'center' }}>
      <div className="text-[10px]" style={{ color: 'rgb(var(--muted))' }}>{label}</div>
      <div className="font-mono text-sm" style={{ color }}>{value}%</div>
    </div>
  );
}
