import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ParallelScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('parallel');
  const pTitle = progress('show-title');
  const pSingleMsg = progress('show-single-message');
  const pFourAgents = progress('show-four-agents');
  const pRunning = progress('show-running');
  const pAllDone = progress('show-all-done');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;

  const agents = [
    { name: 'Competitor Research', task: 'Researching Jasper, Copy.ai...', color: C.blue },
    { name: 'Press Release', task: 'Drafting 400-word release...', color: C.purple },
    { name: 'Timeline', task: 'Building 6-week plan...', color: C.teal },
    { name: 'Landing Copy', task: 'Writing hero headline...', color: C.accent },
  ];

  const cardW = 340;
  const cardH = 110;
  const cardGap = 24;
  const totalW = agents.length * cardW + (agents.length - 1) * cardGap;
  const startX = cx - totalW / 2;

  const msgY = grid.y(0.14);
  const agentY = grid.y(0.38);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>5</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Parallel Execution</text>
      </g>

      {/* Single message bar */}
      <g style={{ opacity: pSingleMsg }}>
        <rect x={cx - 280} y={msgY} width={560} height={48} rx={10}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <text x={cx} y={msgY + 30} textAnchor="middle" fill={C.codeOrange} fontSize={14} fontFamily="monospace" fontWeight={600}>
          "Plan the launch for our new AI writing tool."
        </text>
      </g>

      {/* Backbone from message down to branch point */}
      <g style={{ opacity: pFourAgents }}>
        {(() => {
          const bp = entranceSpring(frame, fps, beat('show-four-agents'));
          return (
            <line x1={cx} y1={msgY + 52} x2={cx} y2={agentY - 28}
              stroke={C.accent} strokeWidth={2} strokeLinecap="round"
              style={{ opacity: bp }} />
          );
        })()}

        {/* "All start at t=0" pill */}
        <rect x={cx - 75} y={agentY - 46} width={150} height={24} rx={12}
          fill={C.greenLight} stroke={C.green} strokeWidth={1} />
        <text x={cx} y={agentY - 31} textAnchor="middle" fill={C.green}
          fontSize={12} fontWeight={600}>All start at t=0</text>
      </g>

      {/* Four agent cards */}
      {agents.map((a, i) => {
        const ap = entranceSpring(frame, fps, beat('show-four-agents') + 2 + i * 2);
        const slideY = interpolate(ap, [0, 1], [20, 0]);
        const ax = startX + i * (cardW + cardGap);
        const agentCx = ax + cardW / 2;

        // Running pulse (visible after show-running beat)
        const runP = entranceSpring(frame, fps, beat('show-running'));
        const pulseOp = 0.3 + 0.4 * Math.sin(frame * 0.15 + i * 2);

        // Done checkmark (visible after show-all-done beat)
        const doneP = entranceSpring(frame, fps, beat('show-all-done') + i * 2);

        return (
          <g key={i} style={{ opacity: ap }}>
            {/* Branch line from backbone to card */}
            <line x1={cx} y1={agentY - 28} x2={agentCx} y2={agentY - 4}
              stroke={a.color} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="6 3"
              style={{ opacity: ap * 0.5 }} />

            {/* Card */}
            <g style={{ transform: `translateY(${slideY}px)` }}>
              <rect x={ax} y={agentY} width={cardW} height={cardH} rx={12}
                fill={C.cardFill} stroke={a.color} strokeWidth={2} />

              {/* Agent name */}
              <text x={ax + 14} y={agentY + 24} fill={a.color}
                fontSize={FONT_SIZE.sm} fontWeight={700}>{a.name}</text>

              {/* Task description */}
              <text x={ax + 14} y={agentY + 48} fill={C.mid}
                fontSize={13} fontFamily="monospace">{a.task}</text>

              {/* Activity bar (shows during running) */}
              {(() => {
                const barW = interpolate(runP, [0, 1], [0, cardW - 28]);
                const barFill = doneP > 0.5 ? C.green : a.color;
                return (
                  <g style={{ opacity: runP }}>
                    <rect x={ax + 14} y={agentY + 66} width={cardW - 28} height={6} rx={3}
                      fill={C.hairline} />
                    <rect x={ax + 14} y={agentY + 66} width={barW} height={6} rx={3}
                      fill={barFill} fillOpacity={0.4} />
                  </g>
                );
              })()}

              {/* Pulsing activity dot (while running) */}
              <circle cx={ax + cardW - 18} cy={agentY + 18} r={6}
                fill={doneP > 0.5 ? C.green : a.color}
                fillOpacity={doneP > 0.5 ? 0.9 : pulseOp * runP} />

              {/* Done checkmark */}
              {doneP > 0.3 && (
                <text x={ax + cardW - 20} y={agentY + cardH - 12} textAnchor="middle"
                  fill={C.green} fontSize={14} fontWeight={700} style={{ opacity: doneP }}>
                  Done
                </text>
              )}
            </g>
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.82)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          15 seconds instead of 60.
        </text>
      </g>
    </g>
  );
};
