import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

const TIER_ORDER: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F'];

const TIER_COLORS: Record<Tier, string> = {
  S: '#FF6B2C',
  A: '#FF8E54',
  B: '#FFB48C',
  C: '#22D3A0',
  D: '#56544B',
  F: '#26251F',
};

const TIER_DESCRIPTIONS: Record<Tier, string> = {
  S: 'Run my life',
  A: 'Open every day',
  B: 'Useful for one job each',
  C: 'I see why people use these but I don’t',
  D: 'Exists, fine, not for me',
  F: 'Actively bad / don’t',
};

// B uses dark ink; everything else uses white text on the colored chip.
const TIER_TEXT_DARK: Record<Tier, boolean> = {
  S: false,
  A: false,
  B: true,
  C: false,
  D: false,
  F: false,
};

const MAX_NAME_LEN = 18;
const MAX_TOOLS_PER_ROW = 9;

function truncate(name: string): string {
  if (name.length <= MAX_NAME_LEN) return name;
  return name.slice(0, MAX_NAME_LEN - 1) + '…';
}

function decodePlacements(tl: string | null): Record<string, string> {
  if (!tl) return {};
  try {
    // Edge runtime: atob is available; Buffer may not be.
    const decoded =
      typeof atob === 'function'
        ? decodeURIComponent(
            atob(tl)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          )
        : Buffer.from(tl, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

function groupByTier(
  placements: Record<string, string>
): Record<Tier, string[]> {
  const grouped: Record<Tier, string[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    F: [],
  };
  for (const [tool, tier] of Object.entries(placements)) {
    if (TIER_ORDER.includes(tier as Tier)) {
      grouped[tier as Tier].push(tool);
    }
  }
  return grouped;
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const tl = url.searchParams.get('tl');
  const placements = decodePlacements(tl);
  const grouped = groupByTier(placements);
  const hasAny = Object.values(grouped).some((arr) => arr.length > 0);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0E0F11',
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '40px 56px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
            }}
          >
            Vlad&rsquo;s Ultimate AI Dive Deep
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#A1A1AA',
              letterSpacing: '1px',
              marginTop: '4px',
              textTransform: 'uppercase',
            }}
          >
            Tier List — Operator Usefulness
          </div>
        </div>

        {/* Tier rows or fallback copy */}
        {hasAny ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '8px',
            }}
          >
            {TIER_ORDER.map((tier) => {
              const tools = grouped[tier].slice(0, MAX_TOOLS_PER_ROW);
              const overflow = grouped[tier].length - tools.length;
              const chipBg = TIER_COLORS[tier];
              const chipText = TIER_TEXT_DARK[tier] ? '#0E0F11' : '#FFFFFF';

              return (
                <div
                  key={tier}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px',
                    minHeight: '72px',
                  }}
                >
                  {/* Tier letter chip */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '72px',
                      height: '72px',
                      backgroundColor: chipBg,
                      color: chipText,
                      fontSize: '40px',
                      fontWeight: 800,
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                  >
                    {tier}
                  </div>

                  {/* Tier description + tools */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#71717A',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {TIER_DESCRIPTIONS[tier]}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '6px',
                        alignItems: 'center',
                      }}
                    >
                      {tools.length === 0 ? (
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#3F3F46',
                            fontStyle: 'italic',
                          }}
                        >
                          (empty)
                        </div>
                      ) : (
                        tools.map((tool) => (
                          <div
                            key={tool}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 12px',
                              backgroundColor: '#1A1B1F',
                              border: '1px solid #2A2B30',
                              borderRadius: '999px',
                              fontSize: '16px',
                              fontWeight: 500,
                              color: '#E4E4E7',
                            }}
                          >
                            {truncate(tool)}
                          </div>
                        ))
                      )}
                      {overflow > 0 ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 12px',
                            fontSize: '14px',
                            color: '#71717A',
                          }}
                        >
                          +{overflow} more
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                fontWeight: 800,
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Build your own tier list
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#A1A1AA',
                textAlign: 'center',
              }}
            >
              Drag 30+ AI tools into S–F. Share your verdict.
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '12px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              color: '#71717A',
              letterSpacing: '1px',
            }}
          >
            dive.vladyslavpodoliako.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
