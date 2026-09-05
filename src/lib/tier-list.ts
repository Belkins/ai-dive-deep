export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'pool';
export const TIER_ORDER: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F', 'pool'];
const ALLOWED_TIERS = new Set<string>(TIER_ORDER);
const MAX_PAYLOAD_LENGTH = 16_384;

export function isTier(value: unknown): value is Tier {
  return typeof value === 'string' && ALLOWED_TIERS.has(value);
}

export function sanitizePlacements(value: unknown, defaults: Readonly<Record<string, Tier>>): Record<string, Tier> {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return Object.fromEntries(Object.entries(defaults).map(([tool, fallback]) => {
    // Iterate the trusted tool list, never keys or inherited values from a payload.
    const entry = Object.getOwnPropertyDescriptor(source, tool)?.value;
    return [tool, isTier(entry) ? entry : fallback];
  }));
}

function parsePlacements(raw: string | null, defaults: Readonly<Record<string, Tier>>): Record<string, Tier> | null {
  if (!raw || raw.length > MAX_PAYLOAD_LENGTH) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return sanitizePlacements(parsed, defaults);
  } catch {
    return null;
  }
}

export function restorePlacements(hash: string, stored: string | null, defaults: Readonly<Record<string, Tier>>): Record<string, Tier> {
  if (hash.startsWith('#tl=') && hash.length <= MAX_PAYLOAD_LENGTH * 2) {
    try {
      const shared = parsePlacements(atob(decodeURIComponent(hash.slice(4))), defaults);
      if (shared) return shared;
    } catch { /* A malformed share must not prevent loading the local ranking. */ }
  }
  return parsePlacements(stored, defaults) ?? sanitizePlacements(null, defaults);
}

export function groupPlacements(placements: Readonly<Record<string, unknown>>, tools: readonly string[]): Record<Tier, string[]> {
  const groups: Record<Tier, string[]> = { S: [], A: [], B: [], C: [], D: [], F: [], pool: [] };
  for (const tool of tools) {
    const tier = Object.getOwnPropertyDescriptor(placements, tool)?.value;
    groups[isTier(tier) ? tier : 'pool'].push(tool);
  }
  return groups;
}
