import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const PatternScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('pattern');
  const pTitle = progress('show-title');
  const pTypes = progress('show-four-types');
  const pGrid = progress('show-services-grid');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;

  // Four integration types — top row
  const types = [
    { name: 'Raw API', detail: 'Full control, build everything', color: C.http, bg: C.httpLight },
    { name: 'SDK', detail: 'Practical choice, 3 lines', color: C.sdk, bg: C.sdkLight },
    { name: 'CLI', detail: 'Ops and deployment', color: C.dark, bg: '#f1f5f9' },
    { name: 'MCP', detail: 'AI connects directly', color: C.accent, bg: C.accentLight },
  ];
  const typeW = 340;
  const typeH = 100;
  const typeGap = 32;
  const typeTotalW = types.length * typeW + (types.length - 1) * typeGap;
  const typeStartX = cx - typeTotalW / 2;
  const typeY = grid.y(0.06);

  // Services as full-width rows — one row per category
  const categories = [
    { label: 'Database', services: [
      { name: 'Supabase', color: C.supabase },
      { name: 'Neon', color: '#4FFFB0' },
    ]},
    { label: 'Payments', services: [
      { name: 'Stripe', color: C.stripe },
      { name: 'Paddle', color: '#2E2E2E' },
    ]},
    { label: 'Deploy', services: [
      { name: 'Vercel', color: C.vercel },
      { name: 'Netlify', color: '#00C7B7' },
    ]},
    { label: 'AI Text', services: [
      { name: 'OpenAI', color: '#171717' },
      { name: 'Gemini', color: '#4285F4' },
    ]},
    { label: 'AI Image', services: [
      { name: 'Nano Banana', color: '#F59E0B' },
    ]},
    { label: 'AI Video', services: [
      { name: 'Heygen', color: '#5046E5' },
      { name: 'Kling', color: '#EF4444' },
    ]},
    { label: 'Web Fetch', services: [
      { name: 'Perplexity', color: '#20B2AA' },
      { name: 'Firecrawl', color: '#F97316' },
    ]},
    { label: 'Auth', services: [
      { name: 'Clerk', color: '#6C47FF' },
    ]},
    { label: 'Email', services: [
      { name: 'Resend', color: '#171717' },
    ]},
    { label: 'SMS', services: [
      { name: 'Twilio', color: '#F22F46' },
    ]},
  ];

  // Layout: 2 columns of 5 rows
  const cols = 2;
  const rowsPerCol = 5;
  const rowW = 720;
  const rowH = 72;
  const rowGapX = 40;
  const rowGapY = 16;
  const gridTotalW = cols * rowW + rowGapX;
  const gridStartX = cx - gridTotalW / 2;
  const gridStartY = grid.y(0.24);
  const labelW = 130;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.02)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Four Ways to Connect
        </text>
      </g>

      {/* Four integration type cards */}
      {types.map((type, i) => {
        const tp = entranceSpring(frame, fps, beat('show-four-types') + i * 4);
        const tx = typeStartX + i * (typeW + typeGap);
        const slideY = interpolate(tp, [0, 1], [12, 0]);
        return (
          <g key={i} style={{ opacity: pTypes > 0 ? tp : 0, transform: `translateY(${slideY}px)` }}>
            <rect x={tx} y={typeY} width={typeW} height={typeH} rx={12}
              fill={C.cardFill} stroke={type.color} strokeWidth={2} />
            <rect x={tx} y={typeY + 8} width={5} height={typeH - 16} rx={2.5}
              fill={type.color} fillOpacity={0.7} />
            <text x={tx + 22} y={typeY + 32} dominantBaseline="central"
              fill={type.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {type.name}
            </text>
            <text x={tx + 22} y={typeY + 62} dominantBaseline="central"
              fill={C.mid} fontSize={FONT_SIZE.sm}>
              {type.detail}
            </text>
          </g>
        );
      })}

      {/* Services grid — 2 columns, 5 rows each */}
      <g style={{ opacity: pGrid }}>
        {categories.map((cat, ci) => {
          const col = ci < rowsPerCol ? 0 : 1;
          const row = ci < rowsPerCol ? ci : ci - rowsPerCol;
          const rx = gridStartX + col * (rowW + rowGapX);
          const ry = gridStartY + row * (rowH + rowGapY);
          const cp = entranceSpring(frame, fps, beat('show-services-grid') + ci * 2);
          const slideX = interpolate(cp, [0, 1], [col === 0 ? -16 : 16, 0]);

          return (
            <g key={ci} style={{ opacity: cp, transform: `translateX(${slideX}px)` }}>
              {/* Row container */}
              <rect x={rx} y={ry} width={rowW} height={rowH} rx={12}
                fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5} />

              {/* Category label — left aligned */}
              <text x={rx + 18} y={ry + rowH / 2} dominantBaseline="central"
                fill={C.mid} fontSize={FONT_SIZE.md} fontWeight={600}>
                {cat.label}
              </text>

              {/* Thin separator */}
              <line x1={rx + labelW} y1={ry + 12} x2={rx + labelW} y2={ry + rowH - 12}
                stroke={C.hairline} strokeWidth={1} />

              {/* Service pills — right of label */}
              {cat.services.map((svc, si) => {
                const sp = entranceSpring(frame, fps, beat('show-services-grid') + ci * 2 + 4 + si * 3);
                const pillW = svc.name.length * 12 + 56;
                const pillH = 40;
                const pillX = rx + labelW + 24 + si * (pillW + 20);
                const pillCy = ry + rowH / 2;
                return (
                  <g key={si} style={{ opacity: sp }}>
                    <rect x={pillX} y={pillCy - pillH / 2} width={pillW} height={pillH} rx={pillH / 2}
                      fill="none" stroke={svc.color} strokeWidth={1.5} />
                    <circle cx={pillX + 20} cy={pillCy} r={5} fill={svc.color} />
                    <text x={pillX + pillW / 2 + 10} y={pillCy} textAnchor="middle"
                      dominantBaseline="central"
                      fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600}>
                      {svc.name}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.92)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Same pattern. Every category. Every service.
        </text>
      </g>

      {/* Particles */}
      {[...Array(6)].map((_, i) => {
        const px = 200 + i * 280 + Math.sin(frame * 0.02 + i * 1.4) * 18;
        const py = 100 + Math.sin(frame * 0.015 + i * 2.2) * 24;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.03 + i) * 0.04} />
        );
      })}
    </g>
  );
};
