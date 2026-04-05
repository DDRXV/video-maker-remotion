import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const AgentTypesScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('agent-types');
  const pTitle = progress('show-title');
  const pSummary = progress('show-summary');

  const types = [
    {
      name: 'Explore', desc: 'Codebase search', tools: 'Read, Grep, Glob',
      color: C.blue, bgColor: C.blueLight, beatLabel: 'show-explore',
    },
    {
      name: 'Plan', desc: 'Implementation design', tools: 'Read, Grep, Glob',
      color: C.purple, bgColor: C.purpleLight, beatLabel: 'show-plan',
    },
    {
      name: 'Security', desc: 'Vulnerability review', tools: 'Read, Grep, Glob',
      color: C.red, bgColor: C.redLight, beatLabel: 'show-security',
    },
    {
      name: 'General', desc: 'Full capabilities', tools: 'All tools',
      color: C.accent, bgColor: C.accentLight, beatLabel: 'show-general',
    },
  ];

  const cardW = 400;
  const cardH = 100;
  const startY = grid.y(0.14);
  const cardGap = 24;

  // Focus dimming
  const latestIdx = (() => {
    for (let i = types.length - 1; i >= 0; i--) {
      if (progress(types[i].beatLabel) > 0.05) return i;
    }
    return -1;
  })();

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>4</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Agent Types</text>
      </g>

      {/* Type cards — left column with tools on right */}
      {types.map((t, i) => {
        const tp = progress(t.beatLabel);
        const y = startY + i * (cardH + cardGap);
        const slideX = interpolate(tp, [0, 1], [30, 0]);
        const dist = latestIdx - i;
        const focusOp = tp > 0.05 ? (dist === 0 ? 1 : dist <= 1 ? 0.5 : 0.25) : 0;

        return (
          <g key={i} style={{ opacity: focusOp, transform: `translateX(${slideX}px)` }}>
            {/* Card */}
            <rect x={grid.x(0.04)} y={y} width={cardW} height={cardH} rx={14}
              fill={t.bgColor} stroke={t.color} strokeWidth={2} />
            {/* Type badge */}
            <circle cx={grid.x(0.04) + 40} cy={y + cardH / 2} r={22}
              fill={t.color} fillOpacity={0.15} stroke={t.color} strokeWidth={1.5} />
            <text x={grid.x(0.04) + 40} y={y + cardH / 2} textAnchor="middle" dominantBaseline="central"
              fill={t.color} fontSize={14} fontWeight={700}>
              {t.name.charAt(0)}
            </text>
            {/* Name and desc */}
            <text x={grid.x(0.04) + 76} y={y + 36} fill={t.color}
              fontSize={FONT_SIZE.lg} fontWeight={700}>{t.name}</text>
            <text x={grid.x(0.04) + 76} y={y + 64} fill={C.mid}
              fontSize={FONT_SIZE.sm}>{t.desc}</text>

            {/* Tools pill on the right */}
            <rect x={grid.x(0.04) + cardW + 30} y={y + cardH / 2 - 18} width={200} height={36} rx={18}
              fill={C.cardFill} stroke={t.color} strokeWidth={1.5} />
            <text x={grid.x(0.04) + cardW + 130} y={y + cardH / 2 + 2} textAnchor="middle"
              dominantBaseline="central" fill={t.color} fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily="monospace">
              {t.tools}
            </text>

            {/* Dashed line connecting card to tools */}
            <line x1={grid.x(0.04) + cardW + 4} y1={y + cardH / 2}
              x2={grid.x(0.04) + cardW + 26} y2={y + cardH / 2}
              stroke={t.color} strokeWidth={1.5} strokeDasharray="4 3" strokeOpacity={0.5} />
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Pick the type that matches the job.
        </text>
      </g>
    </g>
  );
};
