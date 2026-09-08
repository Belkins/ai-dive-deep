// Snapshot-age derivation for the live Radar board (RadarBoard.astro).
// Lives here rather than in the component's script so the staleness rule is
// testable with an injected clock — .astro frontmatter can't be imported by
// node:test, and a clock-dependent label is exactly what a build-day grep of
// dist/ can never observe. Covered by tests/radar-age.test.mjs.

/** Past this age the board stops claiming to be live. */
export const STALE_H = 3;

/** Refresh cadence for the readout. The issue asks for at least once a minute. */
export const AGE_TICK_MS = 30_000;

export interface RadarAge {
  /** The bare reading: "42 min", "3 h", "2 d". */
  text: string;
  /** True once the snapshot is STALE_H or older — the page may not say "live". */
  stale: boolean;
  /** What the span beside the absolute stamp renders. */
  age: string;
  /** What the hero eyebrow renders. */
  eyebrow: string;
}

export function radarAge(generated: number, now: number = Date.now()): RadarAge {
  const hours = Math.max(0, (now - generated) / 3_600_000);
  // Floor, not round: the eyebrow flips at exactly STALE_H, so a rounding
  // readout would print "· 3 h ago" beside "Radar · live" for the half hour
  // before the switch — the two halves of the same page disagreeing about age.
  const text =
    hours < 1 ? `${Math.max(1, Math.floor(hours * 60))} min`
    : hours < 48 ? `${Math.floor(hours)} h`
    : `${Math.floor(hours / 24)} d`;
  const stale = hours >= STALE_H;
  // `age` and `eyebrow` are composed FROM `text`, so the reading beside the
  // stamp and the reading in the eyebrow cannot state two different ages —
  // agreement is structural, not asserted.
  return {
    text,
    stale,
    age: ` · ${text} ago`,
    eyebrow: stale ? `Radar · last snapshot ${text} ago` : 'Radar · live',
  };
}
