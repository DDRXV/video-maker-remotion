import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');
  const pPrompt = progress('show-prompt');
  const pSpawn = progress('show-agents-spawn');
  const pBars = progress('show-parallel-bars');
  const pResults = progress('show-results');
  const pPunch = progress('show-punchline');

  const barsDim = interpolate(pPunch, [0, 1], [1, 0.15]);

  const agents = [
    {
      name: 'Competitor Research',
      color: C.blue,
      duration: 12,
      result: 'Jasper: PH launch, 5K upvotes. Copy.ai: Twitter threads...',
    },
    {
      name: 'Press Release',
      color: C.purple,
      duration: 8,
      result: 'FOR IMMEDIATE RELEASE...',
    },
    {
      name: 'Launch Timeline',
      color: C.teal,
      duration: 15,
      result: 'Week 1: Beta invites. Week 2: Press outreach...',
    },
    {
      name: 'Landing Page Copy',
      color: C.accent,
      duration: 10,
      result: 'Write 10x faster. AI that sounds like you.',
    },
  ];

  const labelW = 210;
  const barX = grid.x(0.24);
  const barMaxW = grid.x(0.42);
  const resultX = barX + barMaxW + 50;
  const barH = 48;
  const barGap = 20;
  const barStartY = grid.y(0.22);

  return (
    <g>
      {/* User prompt */}
      <g style={{ opacity: pPrompt * barsDim }}>
        <rect x={grid.x(0.04)} y={grid.y(0.06)} width={grid.x(0.92)} height={56} rx={12}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <text x={grid.x(0.06)} y={grid.y(0.06) + 22} fill={C.codeGreen} fontSize={14} fontFamily="monospace">$</text>
        <text x={grid.x(0.06) + 18} y={grid.y(0.06) + 22} fill={C.codeOrange} fontSize={14} fontFamily="monospace" fontWeight={600}>claude</text>
        <text x={grid.x(0.06) + 80} y={grid.y(0.06) + 22} fill={C.codeGray} fontSize={14} fontFamily="monospace">
          "Plan the launch for our new AI writing tool"
        </text>
        <text x={grid.x(0.06)} y={grid.y(0.06) + 44} fill={C.codeBlue} fontSize={13} fontFamily="monospace">
          Spawning 4 agents in parallel...
        </text>
      </g>

      {/* Agent cards on the left */}
      <g style={{ opacity: pSpawn * barsDim }}>
        {agents.map((a, i) => {
          const ap = entranceSpring(frame, fps, beat('show-agents-spawn') + i * 4);
          const y = barStartY + i * (barH + barGap);
          return (
            <g key={i} style={{ opacity: ap }}>
              <rect x={grid.x(0.04)} y={y} width={labelW} height={barH} rx={10}
                fill={C.cardFill} stroke={a.color} strokeWidth={2} />
              <text x={grid.x(0.04) + labelW / 2} y={y + barH / 2 + 1} textAnchor="middle" dominantBaseline="central"
                fill={a.color} fontSize={FONT_SIZE.xs} fontWeight={700}>{a.name}</text>
            </g>
          );
        })}
      </g>

      {/* Gantt bars */}
      <g style={{ opacity: pBars * barsDim }}>
        {agents.map((a, i) => {
          const bp = entranceSpring(frame, fps, beat('show-parallel-bars') + i * 2);
          const y = barStartY + i * (barH + barGap);
          const barW = (a.duration / 15) * barMaxW;
          const animW = interpolate(bp, [0, 1], [0, barW]);
          return (
            <g key={`bar-${i}`}>
              {/* Track */}
              <rect x={barX} y={y + 8} width={barMaxW} height={barH - 16} rx={6}
                fill={C.hairline} fillOpacity={0.5} style={{ opacity: bp }} />
              {/* Filled bar */}
              <rect x={barX} y={y + 8} width={animW} height={barH - 16} rx={6}
                fill={a.color} fillOpacity={0.2} stroke={a.color} strokeWidth={1.5}
                style={{ opacity: bp }} />
              {/* Duration label */}
              <text x={barX + barW + 12} y={y + barH / 2 + 1} dominantBaseline="central"
                fill={a.color} fontSize={FONT_SIZE.xs} fontWeight={600}
                style={{ opacity: bp }}>
                {a.duration}s
              </text>
            </g>
          );
        })}

        {/* "15s total" marker */}
        {(() => {
          const lp = entranceSpring(frame, fps, beat('show-parallel-bars') + 20);
          const lineX = barX + barMaxW;
          return (
            <g style={{ opacity: lp }}>
              <line x1={lineX} y1={barStartY - 10} x2={lineX} y2={barStartY + 4 * (barH + barGap) - barGap + 10}
                stroke={C.accent} strokeWidth={2} strokeDasharray="6 3" />
              <rect x={lineX - 50} y={barStartY - 36} width={100} height={28} rx={14}
                fill={C.accentLight} stroke={C.accent} strokeWidth={1.5} />
              <text x={lineX} y={barStartY - 20} textAnchor="middle" fill={C.accent}
                fontSize={FONT_SIZE.sm} fontWeight={700}>15s total</text>
            </g>
          );
        })()}
      </g>

      {/* Results */}
      <g style={{ opacity: pResults * barsDim }}>
        {agents.map((a, i) => {
          const rp = entranceSpring(frame, fps, beat('show-results') + i * 3);
          const y = barStartY + i * (barH + barGap);
          const slideX = interpolate(rp, [0, 1], [20, 0]);
          return (
            <g key={`result-${i}`} style={{ opacity: rp, transform: `translateX(${slideX}px)` }}>
              <text x={resultX} y={y + barH / 2 + 1} dominantBaseline="central"
                fill={C.mid} fontSize={FONT_SIZE.xs}>
                {a.result}
              </text>
            </g>
          );
        })}
      </g>

      {/* Punchline */}
      <g style={{ opacity: pPunch }}>
        <text x={grid.center().x} y={grid.y(0.48)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Multi-Agent Orchestration
        </text>
        <text x={grid.center().x} y={grid.y(0.58)} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.xl}>
          One prompt. Four specialists. Fifteen seconds.
        </text>
      </g>
    </g>
  );
};
