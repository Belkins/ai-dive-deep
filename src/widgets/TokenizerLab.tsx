import { useEffect, useRef, useState } from 'react';

// One engine, six alphabets. The reader picks a domain and watches the same
// four-stage pipeline run with that domain's vocabulary: continuous thing →
// discrete tokens → predict the next one → decode back to the thing.
//
// Every figure shown here comes from the page's research register. Where no
// figure survived verification, the card states a mechanism instead.

type Dialect = 'autoregressive' | 'diffusion' | 'both';

type Domain = {
  id: string;
  label: string;
  rawTitle: string;
  rawSub: string;
  glyph: 'wave' | 'grid' | 'chain' | 'arm' | 'field';
  tokenName: string;
  tokens: string[];
  alphabet: string;
  predict: string;
  outTitle: string;
  outSub: string;
  dialect: Dialect;
  systems: string;
  caveat: string;
};

const DIALECT_LABEL: Record<Dialect, string> = {
  autoregressive: 'Autoregressive — predict the next piece',
  diffusion: 'Diffusion — start from noise, denoise into the thing',
  both: 'Both dialects, in production, today',
};

const DOMAINS: Domain[] = [
  {
    id: 'music',
    label: 'Music',
    rawTitle: 'A pressure wave',
    rawSub: 'CD audio is 44,100 numbers a second, per channel',
    glyph: 'wave',
    tokenName: 'audio tokens',
    tokens: ['512', '88', '301', '77', '159', '42', '263', '90'],
    alphabet: "A learned codebook. MusicGen's runs 4 codebooks of 2,048 entries at 50 frames a second",
    predict: 'the next slice of sound',
    outTitle: 'New audio',
    outSub: 'the decoder turns tokens back into a waveform you can hear',
    dialect: 'both',
    systems: 'MusicGen and MusicLM autocomplete discrete tokens · Stable Audio denoises a continuous latent instead',
    caveat:
      'Audio tokens are not a tidy single stream. Each time-step carries a stack of codes from several codebooks at once — "one word after another" is the shape of the idea, not the literal layout.',
  },
  {
    id: 'vision',
    label: 'Images & video',
    rawTitle: 'A grid of pixels',
    rawSub: 'video is the same grid with a time axis',
    glyph: 'grid',
    tokenName: 'patches',
    tokens: ['▧', '▨', '▩', '▤', '▥', '▦', '▧', '▨'],
    alphabet: 'Fixed-size square patches — 16×16 in the original Vision Transformer',
    predict: 'the next patch, or the next frame',
    outTitle: 'New frames',
    outSub: 'patches reassemble into a picture, or a moving one',
    dialect: 'diffusion',
    systems: 'The leading image and video models denoise; patch-by-patch generation exists but is not where the frontier sits',
    caveat:
      'This is where the tokenization story gets overstated most often. Patches are how a model READS an image. The best models GENERATE by denoising a continuous latent — not by autocompleting patches.',
  },
  {
    id: 'protein',
    label: 'Proteins',
    rawTitle: 'A chain of amino acids',
    rawSub: 'evolution wrote the training set for free',
    glyph: 'chain',
    tokenName: 'amino acids',
    tokens: ['M', 'K', 'V', 'L', 'A', 'G', 'S', 'T'],
    alphabet: '20 canonical letters — the whole vocabulary of every protein you are made of',
    predict: 'the residue that belongs there',
    outTitle: 'A new protein',
    outSub: 'a sequence no organism has ever expressed',
    dialect: 'both',
    systems: 'ESM3 generates over discrete tokens · AlphaFold3 folds structure with a diffusion module',
    caveat:
      'Generating the sequence is the cheap part. A designed protein is a hypothesis until something expresses it in a lab and it actually works.',
  },
  {
    id: 'dna',
    label: 'DNA',
    rawTitle: 'A genome',
    rawSub: 'the longest sentence in biology',
    glyph: 'chain',
    tokenName: 'bases',
    tokens: ['A', 'C', 'G', 'T', 'A', 'T', 'G', 'C'],
    alphabet: '4 letters — A, C, G, T',
    predict: 'the next base',
    outTitle: 'New sequence',
    outSub: 'genomic models both read and write this alphabet',
    dialect: 'autoregressive',
    systems: 'Genomic language models, trained the way text models are',
    caveat:
      'A four-letter alphabet is trivially easy to tokenize and brutally hard to interpret. Fluency in the language is not understanding of the organism.',
  },
  {
    id: 'robot',
    label: 'Robot motion',
    rawTitle: 'A movement',
    rawSub: 'joint angles and gripper state, changing over time',
    glyph: 'arm',
    tokenName: 'action tokens',
    tokens: ['⟵', '⟶', '↻', '⇧', '⊙', '⟶', '⇩', '⊗'],
    alphabet: 'Motor commands chopped into bins — RT-2 used 256 bins per axis, 8 integers per step',
    predict: 'the next motion',
    outTitle: 'The arm moves',
    outSub: 'tokens become torques on real hardware',
    dialect: 'both',
    systems:
      "RT-2 writes actions into the same stream as words · π0's action head dropped bins for flow matching · π0-FAST put tokens back and matched it",
    caveat:
      'You cannot scrape the physical world. This is the domain where the recipe is fine and the data simply is not there — the whole lesson, wearing overalls.',
  },
  {
    id: 'weather',
    label: 'Weather',
    rawTitle: 'A grid of numbers',
    rawSub: 'pressure, temperature, wind — over the whole planet',
    glyph: 'field',
    tokenName: 'grid states',
    tokens: ['t₀', 't₁', 't₂', 't₃', 't₄', 't₅', 't₆', 't₇'],
    alphabet: 'No alphabet at all — continuous fields, rolled forward a step at a time',
    predict: 'the state of the atmosphere hours out',
    outTitle: 'A forecast',
    outSub: 'stepped forward, one interval after another',
    dialect: 'diffusion',
    systems: 'GenCast denoises the next atmospheric state, then rolls it forward',
    caveat:
      'The purest case of "predict what comes next" — and there is not a single token in it. The pattern is the objective, not the vocabulary.',
  },
];

const STAGES = ['The raw thing', 'Now it is a language', 'Predict the next piece', 'Back to the thing'];

function Glyph({ kind }: { kind: Domain['glyph'] }) {
  const stroke = 'rgb(var(--accent-2))';
  if (kind === 'wave') {
    return (
      <svg viewBox="0 0 120 40" className="w-full h-10" fill="none" aria-hidden="true">
        <path
          d="M0 20 Q7.5 4 15 20 T30 20 T45 20 T60 20 T75 20 T90 20 T105 20 T120 20"
          stroke={stroke}
          strokeWidth="2"
        />
      </svg>
    );
  }
  if (kind === 'grid') {
    return (
      <svg viewBox="0 0 120 40" className="w-full h-10" fill="none" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((c) =>
          [0, 1].map((r) => (
            <rect
              key={`${c}-${r}`}
              x={4 + c * 19}
              y={4 + r * 17}
              width="16"
              height="14"
              stroke={stroke}
              strokeWidth="1.2"
              opacity={0.35 + ((c + r) % 3) * 0.25}
            />
          ))
        )}
      </svg>
    );
  }
  if (kind === 'chain') {
    return (
      <svg viewBox="0 0 120 40" className="w-full h-10" fill="none" aria-hidden="true">
        <path d="M4 28 C 20 8, 34 8, 50 28 S 84 46, 100 20 L116 20" stroke={stroke} strokeWidth="1.6" />
        {[8, 26, 44, 62, 80, 98, 114].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 === 0 ? 24 : 18} r="3" fill={stroke} opacity="0.8" />
        ))}
      </svg>
    );
  }
  if (kind === 'arm') {
    return (
      <svg viewBox="0 0 120 40" className="w-full h-10" fill="none" aria-hidden="true">
        <path d="M14 36 L14 22 L44 12 L74 24" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="22" r="3.5" fill={stroke} />
        <circle cx="44" cy="12" r="3.5" fill={stroke} />
        <path d="M74 24 l10 -4 M74 24 l9 6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M96 12 h18 M96 20 h18 M96 28 h18" stroke={stroke} strokeWidth="1" opacity="0.35" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10" fill="none" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((c) =>
        [0, 1, 2].map((r) => (
          <circle
            key={`${c}-${r}`}
            cx={8 + c * 15}
            cy={8 + r * 12}
            r="2.4"
            fill={stroke}
            opacity={0.25 + (((c * 3 + r) % 4) / 4) * 0.7}
          />
        ))
      )}
    </svg>
  );
}

export default function TokenizerLab() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const d = DOMAINS[active];

  useEffect(() => {
    const t = timers.current;
    setRevealed(0);
    setRunning(false);
    return () => {
      t.forEach(clearTimeout);
      timers.current = [];
    };
  }, [active]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setRevealed(d.tokens.length);
      setRunning(false);
      return;
    }
    setRunning(true);
    setRevealed(0);
    d.tokens.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setRevealed(i + 1), 200 + i * 240));
    });
    timers.current.push(window.setTimeout(() => setRunning(false), 200 + d.tokens.length * 240));
  };

  return (
    <div
      className="rounded-xl border overflow-hidden my-8"
      style={{ borderColor: 'rgb(var(--line))', background: 'rgb(var(--paper))' }}
    >
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: 'rgb(var(--line))' }}>
        <div className="text-[0.7rem] uppercase tracking-[0.25em] mb-3" style={{ color: 'rgb(var(--accent))' }}>
          One engine · six alphabets
        </div>
        <div role="tablist" aria-label="Pick a domain" className="flex flex-wrap gap-2">
          {DOMAINS.map((dom, i) => (
            <button
              key={dom.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className="text-sm px-3 py-1.5 rounded-full border transition"
              style={
                i === active
                  ? {
                      borderColor: 'rgb(var(--accent))',
                      background: 'rgb(var(--accent) / 0.14)',
                      color: 'rgb(var(--accent))',
                      fontWeight: 600,
                    }
                  : { borderColor: 'rgb(var(--line))', color: 'rgb(var(--fg) / 0.72)' }
              }
            >
              {dom.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border p-4" style={{ borderColor: 'rgb(var(--line))' }}>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgb(var(--muted))' }}>
              1 · {STAGES[0]}
            </div>
            <Glyph kind={d.glyph} />
            <div className="mt-2 font-semibold text-sm">{d.rawTitle}</div>
            <div className="text-xs mt-1" style={{ color: 'rgb(var(--muted))' }}>
              {d.rawSub}
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ borderColor: 'rgb(var(--line))' }}>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgb(var(--muted))' }}>
              2 · {STAGES[1]}
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] items-start">
              {d.tokens.slice(0, 5).map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center justify-center rounded px-2 py-1 text-xs font-mono"
                  style={{ background: 'rgb(var(--accent-2) / 0.14)', color: 'rgb(var(--accent-2))' }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-2 font-semibold text-sm">{d.tokenName}</div>
            <div className="text-xs mt-1" style={{ color: 'rgb(var(--muted))' }}>
              {d.alphabet}
            </div>
          </div>

          <div
            className="rounded-lg border p-4"
            style={{ borderColor: 'rgb(var(--accent) / 0.45)', background: 'rgb(var(--accent) / 0.05)' }}
          >
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgb(var(--accent))' }}>
              3 · {STAGES[2]}
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[2.5rem] items-start" aria-live="polite">
              {d.tokens.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center justify-center rounded px-2 py-1 text-xs font-mono transition-opacity duration-200"
                  style={
                    i < revealed
                      ? { background: 'rgb(var(--accent) / 0.18)', color: 'rgb(var(--accent))', opacity: 1 }
                      : { background: 'rgb(var(--line) / 0.5)', color: 'rgb(var(--muted))', opacity: 0.28 }
                  }
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-2 font-semibold text-sm">Given what came before, predict {d.predict}.</div>
            <button
              onClick={run}
              disabled={running}
              className="mt-3 text-xs px-3 py-1.5 rounded border transition w-full"
              style={
                running
                  ? { borderColor: 'rgb(var(--line))', color: 'rgb(var(--muted))' }
                  : { borderColor: 'rgb(var(--accent))', color: 'rgb(var(--accent))', fontWeight: 600 }
              }
            >
              {running ? 'generating…' : revealed ? 'run it again' : 'run the autocomplete'}
            </button>
          </div>

          <div className="rounded-lg border p-4" style={{ borderColor: 'rgb(var(--line))' }}>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgb(var(--muted))' }}>
              4 · {STAGES[3]}
            </div>
            <div
              className="transition-opacity duration-300"
              style={{ opacity: revealed >= d.tokens.length ? 1 : 0.3 }}
            >
              <Glyph kind={d.glyph} />
            </div>
            <div className="mt-2 font-semibold text-sm">{d.outTitle}</div>
            <div className="text-xs mt-1" style={{ color: 'rgb(var(--muted))' }}>
              {d.outSub}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-4" style={{ borderColor: 'rgb(var(--line))' }}>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-1.5" style={{ color: 'rgb(var(--accent-2))' }}>
              Which dialect
            </div>
            <div className="text-sm font-semibold">{DIALECT_LABEL[d.dialect]}</div>
            <div className="text-xs mt-1.5" style={{ color: 'rgb(var(--muted))' }}>
              {d.systems}
            </div>
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: 'rgb(var(--accent) / 0.35)' }}>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] mb-1.5" style={{ color: 'rgb(var(--accent))' }}>
              Where the analogy leaks
            </div>
            <div className="text-xs leading-relaxed" style={{ color: 'rgb(var(--fg) / 0.85)' }}>
              {d.caveat}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
