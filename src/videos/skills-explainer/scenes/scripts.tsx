import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

// Animated line with draw-on effect
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

// Open chevron arrowhead pointing right
const ChevronRight: React.FC<{ x: number; y: number; color: string; opacity: number }> = ({ x, y, color, opacity }) => (
  <polyline points={`${x - 10},${y - 7} ${x},${y} ${x - 10},${y + 7}`}
    fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    style={{ opacity }} />
);

// Junction dot at branch points
const JunctionDot: React.FC<{ cx: number; cy: number; color: string; opacity: number }> = ({ cx, cy, color, opacity }) => (
  <circle cx={cx} cy={cy} r={3.5} fill={color} style={{ opacity }} />
);

export const ScriptsScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('scripts');
  const pTitle = progress('show-title');
  const pMdInput = progress('show-md-input');
  const pPdfScript = progress('show-pdf-script');
  const pOutput = progress('show-output');

  // Layout columns
  const inputX = grid.x(0.02);
  const inputW = 220;
  const backboneX = grid.x(0.22);
  const scriptX = grid.x(0.3);
  const scriptW = 300;
  const outputX = grid.x(0.72);

  // Rows
  const rows = [
    { y: grid.y(0.12), centerY: grid.y(0.12) + 50 },
    { y: grid.y(0.36), centerY: grid.y(0.36) + 50 },
    { y: grid.y(0.60), centerY: grid.y(0.60) + 50 },
  ];

  const inputCenterY = rows[1].centerY;

  const scripts = [
    { label: 'export-pdf.sh', desc: 'Branded PDF with logo,\ncolors, page layout', color: C.accent, beatLabel: 'show-pdf-script', row: 0 },
    { label: 'gen-mermaid.sh', desc: 'Mermaid diagrams\nrendered as PNG', color: C.teal, beatLabel: 'show-mermaid-script', row: 1 },
    { label: 'deploy-notion.sh', desc: 'Push to Notion or\nConfluence workspace', color: C.purple, beatLabel: 'show-deploy-script', row: 2 },
  ];

  const outputs = [
    { label: 'PRD.pdf', icon: 'PDF', color: C.accent, row: 0 },
    { label: 'architecture.png', icon: 'IMG', color: C.teal, row: 1 },
    { label: 'Notion page', icon: 'WEB', color: C.purple, row: 2 },
  ];

  const firstBeat = beat('show-pdf-script');

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>6</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Scripts and Automation</text>
      </g>

      {/* Input: PRD.md card */}
      <g style={{ opacity: pMdInput }}>
        <rect x={inputX} y={inputCenterY - 50} width={inputW} height={100} rx={12}
          fill={C.cardFill} stroke={C.hairline} strokeWidth={2} />
        <text x={inputX + inputW / 2} y={inputCenterY - 16} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.md} fontWeight={600}>PRD.md</text>
        <rect x={inputX + 30} y={inputCenterY + 2} width={100} height={6} rx={2} fill={C.hairline} />
        <rect x={inputX + 30} y={inputCenterY + 14} width={70} height={6} rx={2} fill={C.hairline} />
        <rect x={inputX + 30} y={inputCenterY + 26} width={110} height={6} rx={2} fill={C.hairline} />
        <text x={inputX + inputW / 2} y={inputCenterY + 56} textAnchor="middle" fill={C.light}
          fontSize={FONT_SIZE.xs}>Markdown output</text>
      </g>

      {/* ── SOLID data flow: PRD → backbone → scripts ── */}

      {/* Horizontal stem */}
      <AnimLine x1={inputX + inputW + 4} y1={inputCenterY} x2={backboneX} y2={inputCenterY}
        color={C.dark} enterAt={firstBeat} frame={frame} fps={fps} width={2} />

      {/* Junction dot at backbone */}
      <JunctionDot cx={backboneX} cy={inputCenterY} color={C.dark}
        opacity={entranceSpring(frame, fps, firstBeat + 2)} />

      {/* Vertical backbone */}
      <AnimLine x1={backboneX} y1={rows[0].centerY} x2={backboneX} y2={rows[2].centerY}
        color={C.dark} enterAt={firstBeat + 4} frame={frame} fps={fps} width={2} />

      {/* Junction dots at each branch */}
      {rows.map((r, i) => (
        <JunctionDot key={`jd-${i}`} cx={backboneX} cy={r.centerY} color={C.dark}
          opacity={entranceSpring(frame, fps, beat(scripts[i].beatLabel))} />
      ))}

      {/* Horizontal branches to each script — solid */}
      {scripts.map((s, i) => {
        const sp = entranceSpring(frame, fps, beat(s.beatLabel));
        return (
          <g key={`branch-${i}`}>
            <AnimLine x1={backboneX} y1={rows[i].centerY} x2={scriptX - 8} y2={rows[i].centerY}
              color={C.dark} enterAt={beat(s.beatLabel) + 2} frame={frame} fps={fps} width={2} />
            <ChevronRight x={scriptX - 4} y={rows[i].centerY} color={C.dark} opacity={sp} />
          </g>
        );
      })}

      {/* Script cards */}
      {scripts.map((s, i) => {
        const sp = entranceSpring(frame, fps, beat(s.beatLabel));
        const slideX = interpolate(sp, [0, 1], [20, 0]);
        return (
          <g key={`script-${i}`} style={{ opacity: sp, transform: `translateX(${slideX}px)` }}>
            <rect x={scriptX} y={rows[i].y} width={scriptW} height={100} rx={12}
              fill={C.codeBg} stroke={s.color} strokeWidth={2} />
            <text x={scriptX + 16} y={rows[i].y + 28} fill={C.codeGreen} fontSize={14} fontFamily="monospace">$</text>
            <text x={scriptX + 30} y={rows[i].y + 28} fill={s.color} fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="monospace">
              {s.label}
            </text>
            {s.desc.split('\n').map((line, li) => (
              <text key={li} x={scriptX + 16} y={rows[i].y + 52 + li * 20} fill={C.codeGray}
                fontSize={13} fontFamily="monospace">{line}</text>
            ))}
          </g>
        );
      })}

      {/* ── Script → Output: solid colored arrows ── */}
      <g style={{ opacity: pOutput }}>
        {outputs.map((out, i) => {
          const op = entranceSpring(frame, fps, beat('show-output') + i * 5);
          const slideX = interpolate(op, [0, 1], [20, 0]);
          const cy = rows[i].centerY;

          return (
            <g key={`out-${i}`}>
              <AnimLine x1={scriptX + scriptW + 4} y1={cy} x2={outputX - 8} y2={cy}
                color={out.color} enterAt={beat('show-output') + i * 5} frame={frame} fps={fps} width={1.5} />
              <ChevronRight x={outputX - 4} y={cy} color={out.color} opacity={op} />

              <g style={{ opacity: op, transform: `translateX(${slideX}px)` }}>
                <rect x={outputX} y={cy - 35} width={240} height={70} rx={12}
                  fill={C.greenLight} stroke={C.green} strokeWidth={2} />
                <rect x={outputX + 12} y={cy - 20} width={44} height={28} rx={6}
                  fill={out.color} fillOpacity={0.15} stroke={out.color} strokeWidth={1} />
                <text x={outputX + 34} y={cy - 2} textAnchor="middle" fill={out.color}
                  fontSize={11} fontWeight={700}>{out.icon}</text>
                <text x={outputX + 68} y={cy - 4} fill={C.dark}
                  fontSize={FONT_SIZE.sm} fontWeight={600}>{out.label}</text>
                <text x={outputX + 68} y={cy + 18} fill={C.mid}
                  fontSize={FONT_SIZE.xs}>Finished deliverable</text>
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
