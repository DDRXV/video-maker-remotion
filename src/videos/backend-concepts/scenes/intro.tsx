import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';

const conceptPreviews = [
  { label: 'Sync vs Async', color: C.sync, icon: '⟳' },
  { label: 'Race Conditions', color: C.race, icon: '⚡' },
  { label: 'Idempotency', color: C.idempotent, icon: '=' },
  { label: 'Fault Tolerance', color: C.fault, icon: '↻' },
];

export const IntroScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('intro');

  const pTitle = progress('show-title');
  const pSub = progress('show-subtitle');
  const pConcepts = progress('show-concepts-preview');

  return (
    <g>
      {/* Floating ambient particles */}
      {[
        { x: 0.08, y: 0.15, r: 3, cycle: 120, amp: 8 },
        { x: 0.92, y: 0.22, r: 2.5, cycle: 100, amp: 6 },
        { x: 0.75, y: 0.85, r: 3.5, cycle: 140, amp: 7 },
        { x: 0.15, y: 0.78, r: 2, cycle: 110, amp: 9 },
      ].map((p, i) => {
        const py = interpolate(frame % p.cycle, [0, p.cycle / 2, p.cycle], [0, -p.amp, 0], { extrapolateRight: 'clamp' });
        return (
          <circle key={i} cx={grid.x(p.x)} cy={grid.y(p.y)} r={p.r}
            fill={C.accent} fillOpacity={0.08 + (i % 3) * 0.03}
            style={{ transform: `translateY(${py}px)` }} />
        );
      })}

      {/* Main title */}
      <g style={{ opacity: pTitle }}>
        <text
          x={grid.center().x} y={grid.y(0.22)}
          textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['3xl']} fontFamily="Inter, sans-serif" fontWeight={700}
        >
          Backend Architecture
        </text>
        <text
          x={grid.center().x} y={grid.y(0.22) + 60}
          textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE['2xl']} fontFamily="Inter, sans-serif" fontWeight={600}
        >
          for Product Managers
        </text>

        {/* Accent underline */}
        {(() => {
          const lineW = 280;
          const lineX = grid.center().x - lineW / 2;
          const lineY = grid.y(0.22) + 80;
          const drawn = interpolate(pTitle, [0, 1], [lineW, 0], { extrapolateRight: 'clamp' });
          return (
            <line
              x1={lineX} y1={lineY} x2={lineX + lineW} y2={lineY}
              stroke={C.accent} strokeWidth={3} strokeLinecap="round"
              strokeDasharray={lineW} strokeDashoffset={drawn}
            />
          );
        })()}
      </g>

      {/* Subtitle */}
      <g style={{ opacity: pSub }}>
        <text
          x={grid.center().x} y={grid.y(0.48)}
          textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.xl} fontFamily="Inter, sans-serif" fontWeight={400}
        >
          Four concepts that change how you build
        </text>
        <text
          x={grid.center().x} y={grid.y(0.48) + 36}
          textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.xl} fontFamily="Inter, sans-serif" fontWeight={400}
        >
          and how you talk about systems
        </text>
      </g>

      {/* Four concept preview cards */}
      {conceptPreviews.map((c, i) => {
        const delay = beat('show-concepts-preview') + i * 5;
        const cp = entranceSpring(frame, fps, delay);
        const slideY = interpolate(cp, [0, 1], [30, 0], { extrapolateRight: 'clamp' });
        const cardW = 340;
        const cardH = 64;
        const gap = 28;
        const totalW = conceptPreviews.length * cardW + (conceptPreviews.length - 1) * gap;
        const startX = grid.center().x - totalW / 2;
        const cx = startX + i * (cardW + gap);
        const cy = grid.y(0.72);

        return (
          <g key={c.label} style={{ opacity: cp, transform: `translateY(${slideY}px)` }}>
            {/* Card */}
            <rect
              x={cx} y={cy} width={cardW} height={cardH} rx={cardH / 2}
              fill={c.color} fillOpacity={0.08}
              stroke={c.color} strokeWidth={1.5}
            />
            {/* Left accent circle with number */}
            <circle
              cx={cx + 34} cy={cy + cardH / 2} r={20}
              fill={c.color} fillOpacity={0.15}
            />
            <text
              x={cx + 34} y={cy + cardH / 2}
              textAnchor="middle" dominantBaseline="central"
              fill={c.color} fontSize={FONT_SIZE.md} fontWeight={700}
              fontFamily="Inter, sans-serif"
            >
              {String(i + 1).padStart(2, '0')}
            </text>
            {/* Label */}
            <text
              x={cx + 68} y={cy + cardH / 2}
              dominantBaseline="central"
              fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600}
              fontFamily="Inter, sans-serif"
            >
              {c.label}
            </text>
          </g>
        );
      })}

      {/* Attribution */}
      <g style={{ opacity: pSub * 0.6 }}>
        <text
          x={grid.center().x} y={grid.y(0.92)}
          textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.sm} fontFamily="Inter, sans-serif" fontWeight={500}
        >
          By Rajesh Pentakota  ·  Codepup AI
        </text>
      </g>
    </g>
  );
};
