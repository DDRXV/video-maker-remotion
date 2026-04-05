import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

/* ─── Hand-drawn SVG line helpers ─── */

const AnimLine: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color: string; enterAt: number; frame: number; fps: number;
  width?: number; dash?: string; opacity?: number;
}> = ({ x1, y1, x2, y2, color, enterAt, frame, fps, width = 1.8, dash, opacity: baseOp = 1 }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const offset = dash ? 0 : interpolate(p, [0, 1], [len, 0]);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={width} strokeLinecap="round"
      strokeDasharray={dash || `${len}`} strokeDashoffset={offset}
      style={{ opacity: p * baseOp }} />
  );
};

const ChevronRight: React.FC<{ x: number; y: number; color: string; opacity: number }> = ({ x, y, color, opacity }) => (
  <polyline points={`${x - 10},${y - 7} ${x},${y} ${x - 10},${y + 7}`}
    fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    style={{ opacity }} />
);

const JunctionDot: React.FC<{ cx: number; cy: number; color: string; opacity: number }> = ({ cx, cy, color, opacity }) => (
  <circle cx={cx} cy={cy} r={3.5} fill={color} style={{ opacity }} />
);

export const FullPictureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('full-picture');
  const pUser = progress('show-user');
  const pOrch = progress('show-orchestrator');
  const pAgents = progress('show-agents');
  const pResultsBack = progress('show-results-back');
  const pResponse = progress('show-response');
  const pFinal = progress('show-final');

  const cx = grid.center().x;

  /* ─── Layout constants ─── */
  const userCardW = 200;
  const userCardH = 70;
  const userY = grid.y(0.08);

  const orchW = 280;
  const orchH = 100;
  const orchY = grid.y(0.26);

  const agentY = grid.y(0.54);
  const agentW = 320;
  const agentH = 120;
  const agents = [
    { name: 'Competitor Research', snippet: 'Jasper, Copy.ai, Writesonic...', color: C.blue },
    { name: 'Press Release', snippet: 'FOR IMMEDIATE RELEASE...', color: C.purple },
    { name: 'Timeline', snippet: 'Wk1: Beta. Wk2: Press...', color: C.teal },
    { name: 'Landing Copy', snippet: 'Write 10x faster...', color: C.accent },
  ];
  const agentGap = 20;
  const totalAgentsW = agents.length * agentW + (agents.length - 1) * agentGap;
  const agentStartX = cx - totalAgentsW / 2;

  const responseY = grid.y(0.84);
  const responseW = 360;
  const responseH = 110;

  const backboneTopY = orchY + orchH + 4;
  const backboneBottomY = agentY - 12;

  return (
    <g>
      {/* ─── Title ─── */}
      <g style={{ opacity: pUser }}>
        <text x={cx} y={grid.y(0.02)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['3xl']} fontWeight={800} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Complete System
        </text>
        <line x1={cx - 130} y1={grid.y(0.02) + 14} x2={cx + 130} y2={grid.y(0.02) + 14}
          stroke={C.accent} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* ─── User Card ─── */}
      <g style={{ opacity: pUser }}>
        <rect x={cx - userCardW / 2} y={userY} width={userCardW} height={userCardH} rx={12}
          fill={C.cardFill} stroke={C.dark} strokeWidth={2} />
        <text x={cx} y={userY + 26} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.sm} fontWeight={700}>User</text>
        <text x={cx} y={userY + 50} textAnchor="middle" fill={C.mid}
          fontSize={13} fontFamily="monospace">"Plan my launch"</text>
      </g>

      {/* ─── Line: User → Orchestrator (solid) ─── */}
      <AnimLine x1={cx} y1={userY + userCardH + 2} x2={cx} y2={orchY - 4}
        color={C.accent} enterAt={beat('show-orchestrator')} frame={frame} fps={fps} width={2} />
      <JunctionDot cx={cx} cy={orchY - 4} color={C.accent}
        opacity={entranceSpring(frame, fps, beat('show-orchestrator') + 2)} />

      {/* ─── Orchestrator ─── */}
      <g style={{ opacity: pOrch }}>
        <rect x={cx - orchW / 2} y={orchY} width={orchW} height={orchH} rx={16}
          fill={C.accentLight} stroke={C.accent} strokeWidth={3} />
        <text x={cx} y={orchY + 34} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.lg} fontWeight={700}>Orchestrator</text>
        <text x={cx} y={orchY + 58} textAnchor="middle" fill={C.mid}
          fontSize={13} fontFamily="monospace">Identifies 4 workstreams</text>
        {/* Mini decorative lines */}
        {[0, 1, 2].map(i => (
          <rect key={i} x={cx - 50} y={orchY + 70 + i * 8} width={70 - i * 15} height={3} rx={1.5}
            fill={C.accent} fillOpacity={0.15} />
        ))}
      </g>

      {/* ─── Backbone: Orchestrator → agents (solid, downward) ─── */}
      <g style={{ opacity: pAgents }}>
        <AnimLine x1={cx} y1={backboneTopY} x2={cx} y2={backboneBottomY}
          color={C.dark} enterAt={beat('show-agents')} frame={frame} fps={fps} width={2} />
        <JunctionDot cx={cx} cy={backboneBottomY} color={C.dark}
          opacity={entranceSpring(frame, fps, beat('show-agents') + 4)} />
      </g>

      {/* ─── 4 Agent Cards ─── */}
      {agents.map((a, i) => {
        const ap = entranceSpring(frame, fps, beat('show-agents') + 4 + i * 3);
        const ax = agentStartX + i * (agentW + agentGap);
        const agentCx = ax + agentW / 2;
        const slideY = interpolate(ap, [0, 1], [15, 0]);

        return (
          <g key={i} style={{ opacity: ap }}>
            {/* Horizontal branch from backbone */}
            <AnimLine x1={cx} y1={backboneBottomY}
              x2={agentCx} y2={backboneBottomY}
              color={C.dark} enterAt={beat('show-agents') + 4 + i * 3} frame={frame} fps={fps} width={1.5} />
            {/* Vertical drop to card */}
            <AnimLine x1={agentCx} y1={backboneBottomY}
              x2={agentCx} y2={agentY - 4}
              color={a.color} enterAt={beat('show-agents') + 6 + i * 3} frame={frame} fps={fps} width={1.5} />

            <g style={{ transform: `translateY(${slideY}px)` }}>
              <rect x={ax} y={agentY} width={agentW} height={agentH} rx={12}
                fill={C.cardFill} stroke={a.color} strokeWidth={2} />

              {/* Agent name */}
              <text x={ax + 14} y={agentY + 26} fill={a.color}
                fontSize={FONT_SIZE.sm} fontWeight={700}>{a.name}</text>

              {/* Output snippet */}
              <rect x={ax + 14} y={agentY + 40} width={agentW - 28} height={34} rx={4}
                fill={a.color} fillOpacity={0.06} />
              <text x={ax + 22} y={agentY + 62} fill={C.mid}
                fontSize={12} fontFamily="monospace">{a.snippet}</text>

              {/* Activity dot */}
              {(() => {
                const pulseOp = 0.3 + 0.3 * Math.sin(frame * 0.12 + i * 1.5);
                return (
                  <circle cx={ax + agentW - 16} cy={agentY + 16} r={5}
                    fill={a.color} fillOpacity={pulseOp * ap} />
                );
              })()}

              {/* Mini work lines */}
              <rect x={ax + 14} y={agentY + 84} width={agentW * 0.5} height={4} rx={2}
                fill={a.color} fillOpacity={0.12} />
              <rect x={ax + 14} y={agentY + 94} width={agentW * 0.35} height={4} rx={2}
                fill={a.color} fillOpacity={0.08} />
            </g>
          </g>
        );
      })}

      {/* ─── Results flowing back (dashed green lines) ─── */}
      <g style={{ opacity: pResultsBack }}>
        {agents.map((a, i) => {
          const rp = entranceSpring(frame, fps, beat('show-results-back') + i * 3);
          const ax = agentStartX + i * (agentW + agentGap) + agentW / 2;
          return (
            <g key={`result-${i}`} style={{ opacity: rp * 0.7 }}>
              <line x1={ax + 20} y1={agentY + agentH + 4} x2={ax + 20} y2={agentY + agentH + 40}
                stroke={C.green} strokeWidth={1.5} strokeDasharray="6 4" strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      {/* ─── Line: Orchestrator → Response (solid, downward through agents) ─── */}
      <AnimLine x1={cx} y1={agentY + agentH + 40} x2={cx} y2={responseY - 6}
        color={C.green} enterAt={beat('show-response')} frame={frame} fps={fps} width={2} />
      <ChevronRight x={cx + 7} y={responseY - 6} color={C.green}
        opacity={entranceSpring(frame, fps, beat('show-response') + 2)} />

      {/* ─── Response Card ─── */}
      <g style={{ opacity: pResponse }}>
        <rect x={cx - responseW / 2} y={responseY} width={responseW} height={responseH} rx={14}
          fill={C.greenLight} stroke={C.green} strokeWidth={2.5} />
        <text x={cx} y={responseY + 28} textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE.lg} fontWeight={700}>Launch Plan</text>

        {/* Structure lines inside response */}
        {[
          'Competitor Analysis',
          'Press Release',
          'Timeline',
          'Landing Page',
        ].map((label, i) => {
          const lp = entranceSpring(frame, fps, beat('show-response') + 4 + i * 2);
          return (
            <g key={i} style={{ opacity: lp }}>
              <circle cx={cx - responseW / 2 + 24} cy={responseY + 50 + i * 16} r={3}
                fill={C.green} fillOpacity={0.5} />
              <text x={cx - responseW / 2 + 36} y={responseY + 54 + i * 16} fill={C.mid}
                fontSize={12} fontWeight={500}>{label}</text>
            </g>
          );
        })}
      </g>

      {/* ─── Final message ─── */}
      <g style={{ opacity: pFinal }}>
        <text x={cx} y={grid.y(0.98)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          One prompt in. One launch plan out. Four specialists behind the scenes.
        </text>
      </g>
    </g>
  );
};
