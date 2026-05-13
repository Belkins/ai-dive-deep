// Dynamic OG image for tier-list shares.
// File is .mjs so Node loads it as ESM unconditionally — sidesteps every
// "type":"module" / @vercel/node bundler edge-case we hit on .tsx.
// Vercel auto-routes /api/og/tier-list to this handler.
//
// JSX would need TS+react-jsx transpilation; instead we use a tiny `h()`
// helper that mirrors React.createElement so the markup reads top-to-bottom
// like JSX would. @vercel/og's ImageResponse accepts React element trees.

import { ImageResponse } from '@vercel/og';
import React from 'react';

// Edge runtime: required by @vercel/og's fetch-style ImageResponse.
// Without this, Vercel Node runtime hangs waiting for an Express res.send().
export const config = { runtime: 'edge' };

const h = React.createElement;

const TIER_ORDER = ['S', 'A', 'B', 'C', 'D', 'F'];

const TIER_COLORS = {
  S: '#FF6B2C',
  A: '#FF8E54',
  B: '#FFB48C',
  C: '#22D3A0',
  D: '#56544B',
  F: '#26251F',
};

const TIER_DESCRIPTIONS = {
  S: 'Run my life',
  A: 'Open every day',
  B: 'Useful for one job each',
  C: 'I see why people use these but I don’t',
  D: 'Exists, fine, not for me',
  F: 'Actively bad / don’t',
};

const TIER_TEXT_DARK = { S: false, A: false, B: true, C: false, D: false, F: false };

const MAX_NAME_LEN = 18;
const MAX_TOOLS_PER_ROW = 9;

function truncate(name) {
  if (name.length <= MAX_NAME_LEN) return name;
  return name.slice(0, MAX_NAME_LEN - 1) + '…';
}

function decodePlacements(tl) {
  if (!tl) return {};
  try {
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
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

function groupByTier(placements) {
  const grouped = { S: [], A: [], B: [], C: [], D: [], F: [] };
  for (const [tool, tier] of Object.entries(placements)) {
    if (TIER_ORDER.includes(tier)) grouped[tier].push(tool);
  }
  return grouped;
}

function renderTierRow(tier, tools, overflow) {
  const chipBg = TIER_COLORS[tier];
  const chipText = TIER_TEXT_DARK[tier] ? '#0E0F11' : '#FFFFFF';

  const toolPills =
    tools.length === 0
      ? [
          h(
            'div',
            { style: { fontSize: 14, color: '#3F3F46', fontStyle: 'italic' } },
            '(empty)'
          ),
        ]
      : tools.map((tool) =>
          h(
            'div',
            {
              key: tool,
              style: {
                display: 'flex',
                alignItems: 'center',
                padding: '6px 12px',
                backgroundColor: '#1A1B1F',
                border: '1px solid #2A2B30',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 500,
                color: '#E4E4E7',
              },
            },
            truncate(tool)
          )
        );

  if (overflow > 0) {
    toolPills.push(
      h(
        'div',
        {
          key: '__overflow',
          style: {
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            fontSize: 14,
            color: '#71717A',
          },
        },
        '+' + overflow + ' more'
      )
    );
  }

  return h(
    'div',
    {
      key: tier,
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        minHeight: 72,
      },
    },
    // Tier letter chip
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 72,
          height: 72,
          backgroundColor: chipBg,
          color: chipText,
          fontSize: 40,
          fontWeight: 800,
          borderRadius: 10,
          flexShrink: 0,
        },
      },
      tier
    ),
    // Description + tool pills
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 4,
        },
      },
      h(
        'div',
        {
          style: {
            fontSize: 12,
            color: '#71717A',
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
        },
        TIER_DESCRIPTIONS[tier]
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            alignItems: 'center',
          },
        },
        ...toolPills
      )
    )
  );
}

export default async function handler(req) {
  // Vercel Node.js runtime: req.url is path-only ("/api/og/tier-list?tl=...").
  // Construct a full URL using the Host header so URL.searchParams works.
  const host = (req.headers && (req.headers.host || req.headers.Host)) || 'localhost';
  const protocol = host.includes('localhost') || host.startsWith('127.') ? 'http:' : 'https:';
  const url = new URL(req.url || '/', protocol + '//' + host);
  const tl = url.searchParams.get('tl');
  const placements = decodePlacements(tl);
  const grouped = groupByTier(placements);
  const hasAny = Object.values(grouped).some((arr) => arr.length > 0);

  const header = h(
    'div',
    { style: { display: 'flex', flexDirection: 'column', marginBottom: 20 } },
    h(
      'div',
      {
        style: {
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 2,
          color: '#FFFFFF',
          textTransform: 'uppercase',
        },
      },
      'Vlad’s Ultimate AI Dive Deep'
    ),
    h(
      'div',
      {
        style: {
          fontSize: 18,
          fontWeight: 500,
          color: '#A1A1AA',
          letterSpacing: 1,
          marginTop: 4,
          textTransform: 'uppercase',
        },
      },
      'Tier List — Operator Usefulness'
    )
  );

  const body = hasAny
    ? h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', flex: 1, gap: 8 } },
        ...TIER_ORDER.map((tier) => {
          const tools = grouped[tier].slice(0, MAX_TOOLS_PER_ROW);
          const overflow = grouped[tier].length - tools.length;
          return renderTierRow(tier, tools, overflow);
        })
      )
    : h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          },
        },
        h(
          'div',
          { style: { fontSize: 56, fontWeight: 800, color: '#FFFFFF', textAlign: 'center' } },
          'Build your own tier list'
        ),
        h(
          'div',
          { style: { fontSize: 24, color: '#A1A1AA', textAlign: 'center' } },
          'Drag 30+ AI tools into S–F. Share your verdict.'
        )
      );

  const footer = h(
    'div',
    { style: { display: 'flex', justifyContent: 'flex-end', marginTop: 12 } },
    h(
      'div',
      { style: { fontSize: 16, color: '#71717A', letterSpacing: 1 } },
      'dive.vladyslavpodoliako.com'
    )
  );

  const tree = h(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0E0F11',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '40px 56px',
      },
    },
    header,
    body,
    footer
  );

  return new ImageResponse(tree, { width: 1200, height: 630 });
}
