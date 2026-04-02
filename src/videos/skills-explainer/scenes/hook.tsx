import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');
  const pTerm = progress('show-terminal');
  const pCmd = progress('show-command');
  const pStack = progress('show-output-stack');
  const pPdf = progress('show-pdf');
  const pPunch = progress('show-punchline');

  const termX = grid.x(0.05);
  const termY = grid.y(0.08);
  const termW = grid.x(0.55);
  const termH = 320;

  const stackDim = interpolate(pPunch, [0, 1], [1, 0.2]);

  return (
    <g>
      {/* Terminal mockup */}
      <g style={{ opacity: pTerm * stackDim }}>
        <rect x={termX} y={termY} width={termW} height={termH} rx={12}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        {/* Title bar */}
        <rect x={termX} y={termY} width={termW} height={36} rx={12} fill={C.codeBg} />
        <rect x={termX} y={termY + 24} width={termW} height={12} fill={C.codeBg} />
        <circle cx={termX + 20} cy={termY + 18} r={6} fill="#ef4444" fillOpacity={0.8} />
        <circle cx={termX + 40} cy={termY + 18} r={6} fill="#eab308" fillOpacity={0.8} />
        <circle cx={termX + 60} cy={termY + 18} r={6} fill="#22c55e" fillOpacity={0.8} />
        <text x={termX + termW / 2} y={termY + 22} textAnchor="middle" fill={C.codeGray}
          fontSize={13} fontFamily="monospace">Claude Code</text>

        {/* Prompt line */}
        <g style={{ opacity: pCmd }}>
          <text x={termX + 20} y={termY + 70} fill={C.codeGreen} fontSize={FONT_SIZE.sm} fontFamily="monospace">$</text>
          <text x={termX + 40} y={termY + 70} fill={C.codeOrange} fontSize={FONT_SIZE.sm} fontFamily="monospace" fontWeight={600}>/prd</text>
          <text x={termX + 110} y={termY + 70} fill={C.codeGray} fontSize={FONT_SIZE.sm} fontFamily="monospace">
            "Add team collaboration to the dashboard"
          </text>
        </g>

        {/* Output lines appearing */}
        {[
          { text: '> Analyzing feature scope...', color: C.codeGray, delay: 8 },
          { text: '> Writing problem statement...', color: C.codeBlue, delay: 14 },
          { text: '> Generating user stories (8)...', color: C.codeBlue, delay: 20 },
          { text: '> Defining analytics events (12)...', color: C.codePurple, delay: 26 },
          { text: '> Creating architecture diagram...', color: C.codePurple, delay: 32 },
          { text: '> Building user flow (mermaid)...', color: C.codeOrange, delay: 38 },
          { text: '> Exporting branded PDF...', color: C.codeGreen, delay: 44 },
          { text: '✓ PRD complete. 12 pages.', color: C.codeGreen, delay: 50 },
        ].map((line, i) => {
          const lp = entranceSpring(frame, fps, beat('show-command') + line.delay);
          return (
            <text key={i} x={termX + 20} y={termY + 105 + i * 28} fill={line.color}
              fontSize={14} fontFamily="monospace" style={{ opacity: lp }}>
              {line.text}
            </text>
          );
        })}
      </g>

      {/* Output stack — cards appearing on the right */}
      <g style={{ opacity: pStack * stackDim }}>
        {[
          { label: 'Problem Statement', sub: '2 paragraphs', color: C.accent, delay: 0 },
          { label: 'User Stories', sub: '8 stories with acceptance criteria', color: C.blue, delay: 6 },
          { label: 'Analytics Events', sub: '12 tracking events', color: C.purple, delay: 12 },
          { label: 'Architecture Diagram', sub: 'Mermaid system design', color: C.teal, delay: 18 },
          { label: 'User Flow', sub: 'Mermaid flowchart', color: C.amber, delay: 24 },
        ].map((card, i) => {
          const cp = entranceSpring(frame, fps, beat('show-output-stack') + card.delay);
          const cx = grid.x(0.64);
          const cy = grid.y(0.1) + i * 80;
          const slideX = interpolate(cp, [0, 1], [30, 0]);
          return (
            <g key={i} style={{ opacity: cp, transform: `translateX(${slideX}px)` }}>
              <rect x={cx} y={cy} width={320} height={64} rx={12}
                fill={C.cardFill} stroke={card.color} strokeWidth={2} />
              <circle cx={cx + 28} cy={cy + 32} r={14} fill={card.color} fillOpacity={0.12} stroke={card.color} strokeWidth={1.5} />
              <text x={cx + 28} y={cy + 36} textAnchor="middle" dominantBaseline="central" fill={card.color}
                fontSize={13} fontWeight={700}>{i + 1}</text>
              <text x={cx + 54} y={cy + 24} fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={600}>{card.label}</text>
              <text x={cx + 54} y={cy + 46} fill={C.light} fontSize={FONT_SIZE.xs}>{card.sub}</text>
            </g>
          );
        })}

        {/* PDF output card */}
        <g style={{ opacity: pPdf }}>
          {(() => {
            const cx = grid.x(0.64);
            const cy = grid.y(0.1) + 5 * 80;
            const pp = entranceSpring(frame, fps, beat('show-pdf'));
            const slideX = interpolate(pp, [0, 1], [30, 0]);
            return (
              <g style={{ transform: `translateX(${slideX}px)` }}>
                <rect x={cx} y={cy} width={320} height={64} rx={12}
                  fill={C.greenLight} stroke={C.green} strokeWidth={2.5} />
                <text x={cx + 28} y={cy + 26} fill={C.green} fontSize={FONT_SIZE.md} fontWeight={700}>PDF</text>
                <text x={cx + 80} y={cy + 26} fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={600}>Branded Export</text>
                <text x={cx + 80} y={cy + 48} fill={C.mid} fontSize={FONT_SIZE.xs}>Logo, colors, page layout</text>
              </g>
            );
          })()}
        </g>
      </g>

      {/* Punchline */}
      <g style={{ opacity: pPunch }}>
        <text x={grid.center().x} y={grid.y(0.42)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['3xl']} fontWeight={800} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          One slash command.
        </text>
        <text x={grid.center().x} y={grid.y(0.54)} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE['2xl']} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          This is what Claude Code Skills do.
        </text>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600}>
          Let me show you how to build one.
        </text>
      </g>
    </g>
  );
};
