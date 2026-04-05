import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const WhatIsSdkScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('what-is-sdk');
  const pTitle = progress('show-title');
  const pRaw = progress('show-raw-api');
  const pSdk = progress('show-sdk-version');
  const pComp = progress('show-comparison');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;
  const cardW = 700;
  const cardH = 380;
  const gap = 60;
  const leftX = cx - cardW - gap / 2;
  const rightX = cx + gap / 2;
  const cardY = grid.y(0.14);

  // Raw API lines
  const rawLines = [
    'fetch("https://api.stripe.com/v1/charges", {',
    '  method: "POST",',
    '  headers: {',
    '    "Authorization": "Bearer sk_live_...",',
    '    "Content-Type": "application/x-www..."',
    '  },',
    '  body: "amount=4900&currency=usd"',
    '})',
  ];

  // SDK lines
  const sdkLines = [
    'const stripe = require("stripe")(key);',
    '',
    'await stripe.charges.create({',
    '  amount: 4900,',
    '  currency: "usd",',
    '});',
  ];

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          API vs SDK
        </text>
      </g>

      {/* Raw API card — left */}
      <g style={{ opacity: pRaw * (pComp > 0.5 ? 0.5 : 1) }}>
        <rect x={leftX} y={cardY} width={cardW} height={cardH} rx={16}
          fill={C.codeBg} stroke={C.http} strokeWidth={2} />
        <rect x={leftX} y={cardY + 8} width={6} height={cardH - 16} rx={3}
          fill={C.http} fillOpacity={0.8} />

        <text x={leftX + 28} y={cardY + 34} dominantBaseline="central"
          fill={C.http} fontSize={FONT_SIZE.lg} fontWeight={700}>
          Raw HTTP Request
        </text>
        <text x={leftX + cardW - 24} y={cardY + 34} textAnchor="end"
          dominantBaseline="central" fill={C.codeGray} fontSize={FONT_SIZE.sm}
          fontFamily={TYPOGRAPHY.mono.fontFamily}>
          15 lines
        </text>

        {rawLines.map((line, i) => {
          const lp = entranceSpring(frame, fps, beat('show-raw-api') + 4 + i * 2);
          return (
            <text key={i} x={leftX + 28} y={cardY + 68 + i * 34}
              dominantBaseline="central" fill={C.codeGreen}
              fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.mono.fontFamily}
              style={{ opacity: lp }}>
              {line}
            </text>
          );
        })}
      </g>

      {/* SDK card — right */}
      <g style={{ opacity: pSdk }}>
        {/* Halo when comparison shows */}
        {pComp > 0.5 && (
          <rect x={rightX - 8} y={cardY - 8} width={cardW + 16} height={cardH + 16} rx={20}
            fill={C.sdk} fillOpacity={0.06} />
        )}

        <rect x={rightX} y={cardY} width={cardW} height={cardH} rx={16}
          fill={C.codeBg} stroke={C.sdk} strokeWidth={pComp > 0.5 ? 2.5 : 2}
          filter={pComp > 0.5 ? 'url(#shadow-md)' : undefined} />
        <rect x={rightX} y={cardY + 8} width={6} height={cardH - 16} rx={3}
          fill={C.sdk} fillOpacity={0.8} />

        <text x={rightX + 28} y={cardY + 34} dominantBaseline="central"
          fill={C.sdk} fontSize={FONT_SIZE.lg} fontWeight={700}>
          With SDK
        </text>
        <text x={rightX + cardW - 24} y={cardY + 34} textAnchor="end"
          dominantBaseline="central" fill={C.codeGray} fontSize={FONT_SIZE.sm}
          fontFamily={TYPOGRAPHY.mono.fontFamily}>
          3 lines
        </text>

        {sdkLines.map((line, i) => {
          const lp = entranceSpring(frame, fps, beat('show-sdk-version') + 4 + i * 3);
          if (!line) return null;
          return (
            <text key={i} x={rightX + 28} y={cardY + 68 + i * 38}
              dominantBaseline="central" fill={C.codePurple}
              fontSize={FONT_SIZE.md} fontFamily={TYPOGRAPHY.mono.fontFamily}
              fontWeight={500} style={{ opacity: lp }}>
              {line}
            </text>
          );
        })}
      </g>

      {/* Comparison callout */}
      <g style={{ opacity: pComp }}>
        {/* "vs" circle */}
        <circle cx={cx} cy={cardY + cardH / 2} r={28}
          fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5} />
        <text x={cx} y={cardY + cardH / 2} textAnchor="middle" dominantBaseline="central"
          fill={C.mid} fontSize={FONT_SIZE.lg} fontWeight={700}>
          vs
        </text>
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.86)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Same result. Less work. That is why every service ships an SDK.
        </text>
      </g>

      {/* Particles */}
      {[...Array(5)].map((_, i) => {
        const px = 220 + i * 330 + Math.sin(frame * 0.02 + i * 1.5) * 16;
        const py = 90 + Math.sin(frame * 0.016 + i * 2.1) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.sdk} fillOpacity={0.06 + Math.sin(frame * 0.028 + i) * 0.04} />
        );
      })}
    </g>
  );
};
