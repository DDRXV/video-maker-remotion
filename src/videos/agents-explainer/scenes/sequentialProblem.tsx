import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const SequentialProblemScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('sequential-problem');
  const pTitle = progress('show-title');
  const pSingle = progress('show-single-thread');
  const pBlocking = progress('show-blocking');
  const pTimeline = progress('show-timeline');
  const pBottleneck = progress('show-bottleneck');

  const tasks = [
    { name: 'Read file', duration: 3, color: C.blue },
    { name: 'Think', duration: 2, color: C.mid },
    { name: 'Read file', duration: 3, color: C.blue },
    { name: 'Think', duration: 2, color: C.mid },
    { name: 'Read file', duration: 3, color: C.blue },
    { name: 'Think', duration: 2, color: C.mid },
    { name: 'Write', duration: 4, color: C.green },
  ];

  const timelineY = grid.y(0.42);
  const blockW = 80;
  const blockH = 56;
  const startX = grid.x(0.04);

  const earlyDim = interpolate(pBottleneck, [0, 1], [1, 0.2]);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>2</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Sequential Bottleneck</text>
      </g>

      {/* Single thread visualization */}
      <g style={{ opacity: pSingle * earlyDim }}>
        <text x={grid.x(0.04)} y={timelineY - 40} fill={C.dark}
          fontSize={FONT_SIZE.lg} fontWeight={600}>Single-threaded execution</text>

        {/* Task blocks in sequence */}
        {tasks.map((t, i) => {
          const tp = entranceSpring(frame, fps, beat('show-single-thread') + i * 4);
          const x = startX + i * (blockW + 4);
          const slideX = interpolate(tp, [0, 1], [-20, 0]);
          return (
            <g key={i} style={{ opacity: tp, transform: `translateX(${slideX}px)` }}>
              <rect x={x} y={timelineY} width={blockW} height={blockH} rx={8}
                fill={t.color} fillOpacity={0.1} stroke={t.color} strokeWidth={1.5} />
              <text x={x + blockW / 2} y={timelineY + 22} textAnchor="middle" fill={t.color}
                fontSize={12} fontWeight={600}>{t.name}</text>
              <text x={x + blockW / 2} y={timelineY + 42} textAnchor="middle" fill={C.light}
                fontSize={11}>{t.duration}s</text>
            </g>
          );
        })}

        {/* Blocking arrows between tasks */}
        <g style={{ opacity: pBlocking }}>
          {tasks.slice(0, -1).map((_, i) => {
            const x = startX + i * (blockW + 4) + blockW;
            const bp = entranceSpring(frame, fps, beat('show-blocking') + i * 2);
            return (
              <g key={`block-${i}`} style={{ opacity: bp * 0.6 }}>
                <line x1={x + 1} y1={timelineY + blockH / 2} x2={x + 3} y2={timelineY + blockH / 2}
                  stroke={C.red} strokeWidth={2} />
              </g>
            );
          })}
        </g>
      </g>

      {/* Timeline comparison */}
      <g style={{ opacity: pTimeline * earlyDim }}>
        {/* Sequential bar */}
        {(() => {
          const y = grid.y(0.68);
          const tp = entranceSpring(frame, fps, beat('show-timeline'));
          const totalDur = tasks.reduce((s, t) => s + t.duration, 0);
          const barW = interpolate(tp, [0, 1], [0, grid.x(0.7)]);
          return (
            <g>
              <text x={grid.x(0.04)} y={y - 8} fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={600}>Sequential</text>
              <rect x={grid.x(0.18)} y={y - 16} width={barW} height={32} rx={6}
                fill={C.red} fillOpacity={0.15} stroke={C.red} strokeWidth={1.5} />
              <text x={grid.x(0.18) + grid.x(0.7) + 16} y={y + 2} fill={C.red}
                fontSize={FONT_SIZE.sm} fontWeight={700} style={{ opacity: tp }}>{totalDur}s</text>
            </g>
          );
        })()}

        {/* Parallel bar */}
        {(() => {
          const y = grid.y(0.78);
          const tp = entranceSpring(frame, fps, beat('show-timeline') + 10);
          const barW = interpolate(tp, [0, 1], [0, grid.x(0.22)]);
          return (
            <g>
              <text x={grid.x(0.04)} y={y - 8} fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={600}>Parallel</text>
              <rect x={grid.x(0.18)} y={y - 16} width={barW} height={32} rx={6}
                fill={C.green} fillOpacity={0.15} stroke={C.green} strokeWidth={1.5} />
              <text x={grid.x(0.18) + grid.x(0.22) + 16} y={y + 2} fill={C.green}
                fontSize={FONT_SIZE.sm} fontWeight={700} style={{ opacity: tp }}>~6s</text>
            </g>
          );
        })()}
      </g>

      {/* Bottleneck callout */}
      <g style={{ opacity: pBottleneck }}>
        <text x={grid.center().x} y={grid.y(0.46)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The bottleneck is not intelligence.
        </text>
        <text x={grid.center().x} y={grid.y(0.56)} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.xl} fontWeight={600}>
          It is the sequential execution model.
        </text>
      </g>
    </g>
  );
};
