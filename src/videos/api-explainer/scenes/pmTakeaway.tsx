import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const PmTakeawayScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('pm-takeaway');
  const pTitle = progress('show-title');
  const pBuild = progress('show-build-yourself');
  const pTools = progress('show-ai-tools');
  const pJob = progress('show-your-job');
  const pClosing = progress('show-closing');

  const cx = grid.center().x;

  const cards = [
    {
      title: 'You can build it yourself',
      color: C.sdk,
      bg: C.sdkLight,
      progress: pBuild,
      enterAt: beat('show-build-yourself'),
      lines: [
        'Describe what you want',
        'AI writes the SDK calls',
        'Stripe checkout in minutes',
        'Supabase query in seconds',
      ],
    },
    {
      title: 'AI tools do the wiring',
      color: C.accent,
      bg: C.accentLight,
      progress: pTools,
      enterAt: beat('show-ai-tools'),
      lines: [
        'CodePup AI: simple builds',
        'Claude Code: complex apps',
        'Plumbing is standard',
        'AI knows every SDK pattern',
      ],
    },
    {
      title: 'Your job: the decisions',
      color: C.api,
      bg: C.apiLight,
      progress: pJob,
      enterAt: beat('show-your-job'),
      lines: [
        'Pick the right service',
        'Define the requirements',
        'Every category has 2-3 options',
        'Then build or delegate',
      ],
    },
  ];

  const cardW = 480;
  const cardH = 380;
  const cardGap = 32;
  const totalW = 3 * cardW + 2 * cardGap;
  const startX = cx - totalW / 2;
  const cardY = grid.y(0.12);

  const activeCards = cards.filter(c => c.progress > 0.5);
  const focusedIdx = activeCards.length > 0
    ? cards.indexOf(activeCards.reduce((a, b) => a.enterAt > b.enterAt ? a : b))
    : -1;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          What Changes for You
        </text>
      </g>

      {/* Three cards */}
      {cards.map((card, i) => {
        const sp = card.progress;
        const ccx = startX + i * (cardW + cardGap);
        const slideY = interpolate(sp, [0, 1], [20, 0]);
        const isFocused = i === focusedIdx && pClosing < 0.5;
        const isRevealed = sp > 0.5;
        const dimFactor = pClosing > 0.5 ? 0.7 : (isFocused ? 1 : (isRevealed ? 0.35 : 1));

        return (
          <g key={i} style={{ opacity: sp * dimFactor, transform: `translateY(${slideY}px)` }}>
            {isFocused && (
              <rect x={ccx - 8} y={cardY - 8} width={cardW + 16} height={cardH + 16} rx={20}
                fill={card.color} fillOpacity={0.06} />
            )}

            <rect x={ccx} y={cardY} width={cardW} height={cardH} rx={16}
              fill={C.cardFill} stroke={card.color}
              strokeWidth={isFocused ? 2.5 : 1.5}
              filter={isFocused ? 'url(#shadow-md)' : undefined} />
            <rect x={ccx} y={cardY + 10} width={6} height={cardH - 20} rx={3}
              fill={card.color} fillOpacity={isFocused ? 0.8 : 0.3} />

            {/* Number */}
            <circle cx={ccx + 36} cy={cardY + 40} r={20}
              fill="none" stroke={card.color} strokeWidth={2} />
            <text x={ccx + 36} y={cardY + 40} textAnchor="middle" dominantBaseline="central"
              fill={card.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {i + 1}
            </text>

            {/* Title */}
            <text x={ccx + 68} y={cardY + 40} dominantBaseline="central"
              fill={card.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {card.title}
            </text>

            {/* Detail lines */}
            {card.lines.map((line, li) => {
              const lp = entranceSpring(frame, fps, card.enterAt + 6 + li * 4);
              const ly = cardY + 80 + li * 68;
              return (
                <g key={li} style={{ opacity: lp }}>
                  <rect x={ccx + 20} y={ly} width={cardW - 40} height={54} rx={10}
                    fill={card.bg} fillOpacity={0.5} stroke={card.color} strokeWidth={0.5} />
                  <circle cx={ccx + 42} cy={ly + 27} r={5}
                    fill={card.color} fillOpacity={0.5} />
                  <text x={ccx + 60} y={ly + 27} dominantBaseline="central"
                    fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={500}>
                    {line}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Closing */}
      <g style={{ opacity: pClosing }}>
        <text x={cx} y={grid.y(0.84)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The plumbing is standard. Now you can build it yourself.
        </text>
      </g>

      {/* Particles */}
      {[...Array(5)].map((_, i) => {
        const px = 260 + i * 310 + Math.sin(frame * 0.02 + i * 1.5) * 16;
        const py = 90 + Math.sin(frame * 0.017 + i * 2) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.026 + i) * 0.04} />
        );
      })}
    </g>
  );
};
