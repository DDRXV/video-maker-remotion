import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { FlowArrow } from '../../../components/FlowArrow';
import { LabelBadge } from '../../../components/LabelBadge';
import { TextBox } from '../../../components/TextBox';

const MODULE_COLOR = MODULE_COLORS.queryConstruction;

/* ── Inline SVG icons ── */

const TableIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* grid lines for table */}
    <rect x={cx - 14} y={cy - 12} width={28} height={24} rx={3} fill="none" stroke={MODULE_COLOR} strokeWidth={1.5} />
    <line x1={cx - 14} y1={cy - 4} x2={cx + 14} y2={cy - 4} stroke={MODULE_COLOR} strokeWidth={1} />
    <line x1={cx - 14} y1={cy + 4} x2={cx + 14} y2={cy + 4} stroke={MODULE_COLOR} strokeWidth={1} />
    <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke={MODULE_COLOR} strokeWidth={1} />
  </g>
);

const GraphIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* 3 connected circles */}
    <circle cx={cx - 8} cy={cy - 6} r={4} fill="none" stroke={MODULE_COLOR} strokeWidth={1.5} />
    <circle cx={cx + 8} cy={cy - 6} r={4} fill="none" stroke={MODULE_COLOR} strokeWidth={1.5} />
    <circle cx={cx} cy={cy + 8} r={4} fill="none" stroke={MODULE_COLOR} strokeWidth={1.5} />
    <line x1={cx - 4} y1={cy - 4} x2={cx + 4} y2={cy - 4} stroke={MODULE_COLOR} strokeWidth={1} />
    <line x1={cx - 6} y1={cy - 2} x2={cx - 2} y2={cy + 4} stroke={MODULE_COLOR} strokeWidth={1} />
    <line x1={cx + 6} y1={cy - 2} x2={cx + 2} y2={cy + 4} stroke={MODULE_COLOR} strokeWidth={1} />
  </g>
);

const VectorIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <text x={cx} y={cy + 6} textAnchor="middle" fontSize={18} fontFamily="monospace" fontWeight={600} fill={MODULE_COLOR}>{'{ }'}</text>
);

/* ── Main Scene ── */

export const QueryConstructionScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('query-construction');

  const pTitle = progress('show-title');
  const pRelational = progress('show-relational');
  const pGraph = progress('show-graphdb');
  const pVector = progress('show-vectordb');
  const pSelfQuery = progress('show-self-query');
  const pSummary = progress('show-summary');

  // Layout — Q on left, 3 target cards stacked on right
  const qX = grid.x(0.14);
  const qY = grid.y(0.42);
  const qR = 40;

  // Target cards positioned as large horizontal cards on the right
  const cardX = grid.x(0.38);
  const cardW = 520;
  const cardH = 72;
  const paths = [
    {
      label: 'Text-to-SQL',
      subtitle: 'Relational Database',
      y: grid.y(0.18),
      Icon: TableIcon,
      beatProgress: pRelational,
      beatFrame: beat('show-relational'),
      query: 'SELECT revenue FROM q3_reports',
    },
    {
      label: 'Text-to-Cypher',
      subtitle: 'Graph Database',
      y: grid.y(0.42),
      Icon: GraphIcon,
      beatProgress: pGraph,
      beatFrame: beat('show-graphdb'),
      query: 'MATCH (n:Company)-[:REPORTED]->(r)',
    },
    {
      label: 'Self-query',
      subtitle: 'Vector Store',
      y: grid.y(0.66),
      Icon: VectorIcon,
      beatProgress: pVector,
      beatFrame: beat('show-vectordb'),
      query: 'similarity_search(query, filter={...})',
    },
  ];

  // 3B1B focus: find newest visible path
  const latestPath = (() => {
    for (let i = paths.length - 1; i >= 0; i--) {
      if (paths[i].beatProgress > 0.05) return i;
    }
    return -1;
  })();

  const PARTICLE_COLOR = MODULE_COLOR;

  return (
    <g>
      {/* ── Floating particles ── */}
      {[
        { x: 0.85, y: 0.15, r: 3, cycle: 100, amp: 7 },
        { x: 0.12, y: 0.72, r: 2.5, cycle: 130, amp: 9 },
        { x: 0.68, y: 0.82, r: 2, cycle: 110, amp: 6 },
        { x: 0.92, y: 0.55, r: 3.5, cycle: 150, amp: 8 },
        { x: 0.35, y: 0.12, r: 2, cycle: 90, amp: 5 },
      ].map((p, i) => {
        const py = interpolate(frame % p.cycle, [0, p.cycle / 2, p.cycle], [0, -p.amp, 0]);
        return (
          <circle key={`particle-${i}`} cx={grid.x(p.x)} cy={grid.y(p.y)} r={p.r}
            fill={PARTICLE_COLOR} fillOpacity={0.08 + (i % 3) * 0.03}
            style={{ transform: `translateY(${py}px)` }} />
        );
      })}

      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={MODULE_COLOR} fillOpacity={0.18} stroke={MODULE_COLOR} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLOR} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>1</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={COLORS.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Query Construction</text>
      </g>

      {/* Color zone halo */}
      <rect x={grid.x(0.02)} y={grid.y(0.1)} width={grid.x(0.96) - grid.x(0.02)} height={60} rx={12} fill={MODULE_COLOR} fillOpacity={0.04} style={{ opacity: pTitle }} />

      {/* Question "Q" circle */}
      <g style={{ opacity: pRelational > 0.01 ? 1 : pTitle }}>
        <circle cx={qX} cy={qY} r={qR} fill={COLORS.cardFill} stroke={COLORS.accent} strokeWidth={2.5} />
        <text x={qX} y={qY + 1} textAnchor="middle" dominantBaseline="central" fill={COLORS.accent} fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Q</text>
      </g>

      {/* Scan line on Q circle — sweeps down over 3 seconds */}
      {(() => {
        const scanCycle = 90; // 3s at 30fps
        const scanY = interpolate(frame % scanCycle, [0, scanCycle], [qY - qR, qY + qR]);
        const scanOpacity = interpolate(frame % scanCycle, [0, 10, 80, 90], [0, 0.4, 0.4, 0]);
        return (
          <line x1={qX - qR} y1={scanY} x2={qX + qR} y2={scanY}
            stroke={COLORS.accent} strokeWidth={1.5} strokeOpacity={scanOpacity * pRelational}
            strokeLinecap="round" />
        );
      })()}

      {/* Three diverging curved paths + target cards */}
      {paths.map((p, i) => {
        const isBrightest = i === latestPath;
        const focusOpacity = p.beatProgress > 0.05 ? (isBrightest ? 1 : 0.45) : 0;
        const translateX = interpolate(p.beatProgress, [0, 1], [30, 0]);
        const iconCx = cardX + 36;

        return (
          <g key={p.label} style={{ opacity: focusOpacity }}>
            {/* Curved connecting path from Q to card */}
            {(() => {
              const startX = qX + qR + 4;
              const startY = qY;
              const endX = cardX;
              const endY = p.y;
              const cp1x = startX + (endX - startX) * 0.45;
              const cp1y = startY;
              const cp2x = startX + (endX - startX) * 0.55;
              const cp2y = endY;
              const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
              const pathLen = 500;
              const offset = interpolate(p.beatProgress, [0, 1], [pathLen, 0]);
              return (
                <path d={d} fill="none" stroke={MODULE_COLOR} strokeWidth={2} strokeDasharray={pathLen} strokeDashoffset={offset} strokeLinecap="round" />
              );
            })()}

            {/* Card container */}
            <g style={{ transform: `translateX(${translateX}px)` }}>
              <rect x={cardX} y={p.y - cardH / 2} width={cardW} height={cardH} rx={16}
                fill={COLORS.cardFill} stroke={MODULE_COLOR} strokeWidth={1.5} />

              {/* Icon circle inside card */}
              <circle cx={iconCx} cy={p.y} r={26} fill={MODULE_COLOR} fillOpacity={0.1} stroke={MODULE_COLOR} strokeWidth={1.5} />
              <p.Icon cx={iconCx} cy={p.y} />

              {/* Label */}
              <text x={cardX + 76} y={p.y - 8} dominantBaseline="central"
                fill={COLORS.dark} fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>
                {p.label}
              </text>

              {/* Monospace query preview */}
              <text x={cardX + 76} y={p.y + 16} dominantBaseline="central"
                fill={COLORS.lightStroke} fontSize={FONT_SIZE.xs}
                fontFamily={TYPOGRAPHY.mono.fontFamily}>
                {p.query}
              </text>
            </g>
          </g>
        );
      })}

      {/* Self-query: metadata filter pills peel off below the self-query card */}
      {(() => {
        const filters = [
          { text: 'date: Q3' },
          { text: 'topic: revenue' },
          { text: 'type: report' },
        ];
        const baseX = cardX + 76;
        const baseY = paths[2].y + cardH / 2 + 12;

        return filters.map((f, i) => {
          const delay = beat('show-self-query') + i * 6;
          const fp = entranceSpring(frame, fps, delay);
          const slideX = interpolate(fp, [0, 1], [-20, 0]);
          const pillX = baseX + i * 155;
          return (
            <g key={f.text} style={{ opacity: fp, transform: `translateX(${slideX}px)` }}>
              <rect x={pillX} y={baseY} width={140} height={32} rx={16} fill={MODULE_COLOR} fillOpacity={0.1} stroke={MODULE_COLOR} strokeWidth={1.5} />
              <text x={pillX + 70} y={baseY + 16} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLOR} fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.mono.fontFamily} fontWeight={500}>{f.text}</text>
            </g>
          );
        });
      })()}

      {/* Summary */}
      <TextBox
        x={grid.x(0.08)} y={grid.y(0.86)} maxWidth={grid.x(0.84)}
        fontSize={FONT_SIZE.xl} fontWeight={600} color={COLORS.dark}
        enterAt={beat('show-summary')} align="left"
      >
        Real production data lives across multiple systems. Query construction handles them all.
      </TextBox>
    </g>
  );
};
