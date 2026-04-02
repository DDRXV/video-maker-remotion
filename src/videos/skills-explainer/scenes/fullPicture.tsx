import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

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

// Small filled dot — for automation endpoints
const EndDot: React.FC<{ cx: number; cy: number; color: string; opacity: number }> = ({ cx, cy, color, opacity }) => (
  <circle cx={cx} cy={cy} r={4} fill={color} style={{ opacity }} />
);

export const FullPictureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('full-picture');
  const pCenter = progress('show-center');
  const pDomains = progress('show-domains');
  const pScripts = progress('show-scripts');
  const pFlow = progress('show-flow');
  const pOutput = progress('show-output');
  const pFinal = progress('show-final');

  const cx = grid.center().x;
  const cy = grid.y(0.42);
  const skillW = 200;
  const skillH = 100;

  // Domain folders in a row above
  const domainY = grid.y(0.12);
  const domainCards = [
    { label: 'analytics/', sub: 'events, metrics,\ndashboards', color: C.purple, x: grid.x(0.08) },
    { label: 'architecture/', sub: 'diagrams, system\ndesign prompts', color: C.teal, x: grid.x(0.3) },
    { label: 'use-cases/', sub: 'user stories,\nedge cases', color: C.blue, x: grid.x(0.52) },
    { label: 'brand/', sub: 'colors, fonts,\ndoc format', color: C.amber, x: grid.x(0.74) },
  ];
  const domainW = 190;
  const domainH = 90;

  const scriptsY = cy + 120;
  const userX = grid.x(0.0);
  const delivX = grid.x(0.86);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pCenter }}>
        <text x={cx} y={grid.y(0.04)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['3xl']} fontWeight={800} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Complete Skill System
        </text>
        <line x1={cx - 150} y1={grid.y(0.04) + 14} x2={cx + 150} y2={grid.y(0.04) + 14}
          stroke={C.accent} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Center: skill.md */}
      <g style={{ opacity: pCenter }}>
        <rect x={cx - skillW / 2} y={cy - skillH / 2} width={skillW} height={skillH} rx={16}
          fill={C.accentLight} stroke={C.accent} strokeWidth={3} />
        <text x={cx} y={cy - 10} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="monospace">skill.md</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.sm}>Orchestrator</text>
        {[0, 1, 2].map(i => (
          <rect key={i} x={cx - 60} y={cy + 30 + i * 10} width={80 - i * 15} height={4} rx={2}
            fill={C.accent} fillOpacity={0.2} />
        ))}
      </g>

      {/* Domain folders — DASHED lines (reference/dependency) */}
      {domainCards.map((d, i) => {
        const dp = entranceSpring(frame, fps, beat('show-domains') + i * 5);
        const slideY = interpolate(dp, [0, 1], [-15, 0]);
        const cardCx = d.x + domainW / 2;

        return (
          <g key={i} style={{ opacity: dp }}>
            {/* Dashed vertical: folder bottom → horizontal rail */}
            <AnimLine x1={cardCx} y1={domainY + domainH + 4} x2={cardCx} y2={cy - skillH / 2 - 20}
              color={d.color} enterAt={beat('show-domains') + i * 5 + 2} frame={frame} fps={fps}
              width={1.5} dash="8 4" opacity={0.6} />
            {/* Dashed horizontal: rail → skill.md top */}
            <AnimLine x1={cardCx} y1={cy - skillH / 2 - 20} x2={cx} y2={cy - skillH / 2 - 20}
              color={d.color} enterAt={beat('show-domains') + i * 5 + 4} frame={frame} fps={fps}
              width={1.5} dash="8 4" opacity={0.6} />
            {/* No arrowhead — references just terminate */}

            {/* Folder card */}
            <g style={{ transform: `translateY(${slideY}px)` }}>
              <rect x={d.x} y={domainY} width={domainW} height={domainH} rx={12}
                fill={C.cardFill} stroke={d.color} strokeWidth={2} />
              <rect x={d.x + 12} y={domainY + 10} width={22} height={14} rx={3}
                fill={d.color} fillOpacity={0.2} stroke={d.color} strokeWidth={1} />
              <rect x={d.x + 12} y={domainY + 7} width={11} height={6} rx={2}
                fill={d.color} fillOpacity={0.3} />
              <text x={d.x + 42} y={domainY + 22} fill={d.color}
                fontSize={FONT_SIZE.xs} fontWeight={700} fontFamily="monospace">{d.label}</text>
              {d.sub.split('\n').map((line, li) => (
                <text key={li} x={d.x + 12} y={domainY + 44 + li * 18} fill={C.mid}
                  fontSize={12}>{line}</text>
              ))}
            </g>
          </g>
        );
      })}

      {/* Scripts folder — DOTTED line (automation/background) */}
      <g style={{ opacity: pScripts }}>
        {(() => {
          const sp = entranceSpring(frame, fps, beat('show-scripts'));
          return (
            <g style={{ opacity: sp }}>
              {/* Dotted vertical down */}
              <AnimLine x1={cx} y1={cy + skillH / 2 + 4} x2={cx} y2={scriptsY - 6}
                color={C.green} enterAt={beat('show-scripts')} frame={frame} fps={fps}
                width={1.5} dash="3 3" opacity={0.6} />
              {/* Filled dot at endpoint — automation trigger */}
              <EndDot cx={cx} cy={scriptsY - 4} color={C.green} opacity={sp * 0.6} />

              <rect x={cx - 120} y={scriptsY} width={240} height={80} rx={12}
                fill={C.greenLight} stroke={C.green} strokeWidth={2} />
              <text x={cx} y={scriptsY + 28} textAnchor="middle" fill={C.green}
                fontSize={FONT_SIZE.md} fontWeight={700} fontFamily="monospace">scripts/</text>
              <text x={cx} y={scriptsY + 52} textAnchor="middle" fill={C.mid}
                fontSize={FONT_SIZE.xs}>PDF export, mermaid gen, deploy</text>
            </g>
          );
        })()}
      </g>

      {/* User → skill.md: SOLID orange (primary data flow) */}
      <g style={{ opacity: pFlow }}>
        <rect x={userX} y={cy - 28} width={130} height={56} rx={10}
          fill={C.cardFill} stroke={C.dark} strokeWidth={2} />
        <text x={userX + 65} y={cy - 4} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.sm} fontWeight={600}>User</text>
        <text x={userX + 65} y={cy + 18} textAnchor="middle" fill={C.accent}
          fontSize={14} fontFamily="monospace" fontWeight={600}>/prd</text>

        <AnimLine x1={userX + 134} y1={cy} x2={cx - skillW / 2 - 8} y2={cy}
          color={C.accent} enterAt={beat('show-flow')} frame={frame} fps={fps} width={2} />
        <ChevronRight x={cx - skillW / 2 - 4} y={cy} color={C.accent}
          opacity={entranceSpring(frame, fps, beat('show-flow'))} />
      </g>

      {/* skill.md → Deliverable: SOLID green (primary data flow) */}
      <g style={{ opacity: pOutput }}>
        <AnimLine x1={cx + skillW / 2 + 4} y1={cy} x2={delivX - 8} y2={cy}
          color={C.green} enterAt={beat('show-output')} frame={frame} fps={fps} width={2} />
        <ChevronRight x={delivX - 4} y={cy} color={C.green}
          opacity={entranceSpring(frame, fps, beat('show-output'))} />

        <rect x={delivX} y={cy - 36} width={150} height={72} rx={12}
          fill={C.greenLight} stroke={C.green} strokeWidth={2.5} />
        <text x={delivX + 75} y={cy - 8} textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE.sm} fontWeight={700}>Deliverable</text>
        <text x={delivX + 75} y={cy + 14} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.xs}>PRD + Diagrams</text>
        <text x={delivX + 75} y={cy + 30} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.xs}>+ Branded PDF</text>
      </g>

      {/* Final message */}
      <g style={{ opacity: pFinal }}>
        <text x={cx} y={grid.y(0.9)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Build the skill once. Use it on every project.
        </text>
      </g>
    </g>
  );
};
