import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const TheFixScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('the-fix');
  const pTitle = progress('show-title');
  const pFile = progress('show-file');
  const pTree = progress('show-project-tree');
  const pReads = progress('show-reads-every-time');
  const pBrief = progress('show-persistent-brief');
  const pFollows = progress('show-follows-rules');
  const pQuestion = progress('show-question');

  const mainDim = interpolate(pQuestion, [0, 1], [1, 0.3]);

  // File tree - larger text
  const treeX = grid.x(0.02);
  const treeY = grid.y(0.16);
  const lineH = 42;
  const files = [
    { name: 'my-project/', indent: 0, isDir: true },
    { name: 'CLAUDE.md', indent: 1, isHighlight: true },
    { name: 'src/', indent: 1, isDir: true },
    { name: 'components/', indent: 2, isDir: true },
    { name: 'Header.tsx', indent: 3 },
    { name: 'Button.tsx', indent: 3 },
    { name: 'Card.tsx', indent: 3 },
    { name: 'pages/', indent: 2, isDir: true },
    { name: 'index.tsx', indent: 3 },
    { name: 'package.json', indent: 1 },
    { name: 'tsconfig.json', indent: 1 },
  ];

  // CLAUDE.md preview - larger
  const previewX = grid.x(0.32);
  const previewY = grid.y(0.08);
  const previewW = 640;
  const previewH = 560;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle * mainDim }}>
        <text x={grid.center().x} y={grid.y(0.02)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['3xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          The Fix: CLAUDE.md
        </text>
      </g>

      {/* Project file tree - larger */}
      <g style={{ opacity: pTree * mainDim }}>
        {files.map((f, i) => {
          const ap = entranceSpring(frame, fps, beat('show-project-tree') + i * 2);
          const x = treeX + f.indent * 28;
          const y = treeY + i * lineH;
          const isHL = (f as { isHighlight?: boolean }).isHighlight;
          return (
            <g key={i} style={{ opacity: ap }}>
              {isHL && (
                <rect x={treeX - 10} y={y - 14} width={300} height={lineH - 4} rx={8}
                  fill={C.accent} fillOpacity={0.1} stroke={C.accent} strokeWidth={2} />
              )}
              {f.isDir ? (
                <text x={x} y={y + 8} fill={C.accent} fontSize={FONT_SIZE.md} fontFamily="monospace" fontWeight={600}>{'>'}</text>
              ) : (
                <rect x={x} y={y - 4} width={12} height={16} rx={3} fill="none" stroke={C.light} strokeWidth={1.5} />
              )}
              <text x={x + 22} y={y + 8} fill={isHL ? C.accent : C.dark}
                fontSize={FONT_SIZE.lg} fontWeight={isHL ? 700 : 400} fontFamily="monospace">
                {f.name}
              </text>
            </g>
          );
        })}

        {/* Arrow from CLAUDE.md to preview */}
        <g style={{ opacity: pFile * mainDim }}>
          <line x1={treeX + 310} y1={treeY + lineH - 6} x2={previewX - 16} y2={previewY + 50}
            stroke={C.accent} strokeWidth={2} strokeDasharray="8 5" strokeLinecap="round" />
          <circle cx={previewX - 16} cy={previewY + 50} r={4.5} fill={C.accent} />
        </g>
      </g>

      {/* CLAUDE.md file preview - larger */}
      <g style={{ opacity: pFile * mainDim }}>
        <rect x={previewX} y={previewY} width={previewW} height={previewH} rx={14}
          fill={C.codeBg} stroke={C.accent} strokeWidth={2} />
        <rect x={previewX} y={previewY} width={previewW} height={40} rx={14} fill={C.accent} fillOpacity={0.15} />
        <rect x={previewX} y={previewY + 28} width={previewW} height={12} fill={C.accent} fillOpacity={0.15} />
        <text x={previewX + 18} y={previewY + 26} fill={C.codeOrange} fontSize={16} fontFamily="monospace" fontWeight={600}>
          CLAUDE.md
        </text>

        {/* File content - 16px minimum */}
        <text x={previewX + 22} y={previewY + 68} fill={C.codeGray} fontSize={16} fontFamily="monospace">
          # Design System
        </text>
        <text x={previewX + 22} y={previewY + 100} fill={C.codeGray} fontSize={15} fontFamily="monospace" fillOpacity={0.6}>
          ## Colors
        </text>
        <text x={previewX + 22} y={previewY + 126} fill={C.codeGreen} fontSize={15} fontFamily="monospace">
          primary: #C75B2A
        </text>
        <text x={previewX + 22} y={previewY + 150} fill={C.codeGreen} fontSize={15} fontFamily="monospace">
          background: #FDFBF8
        </text>
        <text x={previewX + 22} y={previewY + 174} fill={C.codeGreen} fontSize={15} fontFamily="monospace">
          text-dark: #1c1917
        </text>
        <text x={previewX + 22} y={previewY + 210} fill={C.codeGray} fontSize={15} fontFamily="monospace" fillOpacity={0.6}>
          ## Components
        </text>
        <text x={previewX + 22} y={previewY + 236} fill={C.codeBlue} fontSize={15} fontFamily="monospace">
          button: 48px tall, 12px radius
        </text>
        <text x={previewX + 22} y={previewY + 260} fill={C.codeBlue} fontSize={15} fontFamily="monospace">
          card: 24px padding, subtle shadow
        </text>
        <text x={previewX + 22} y={previewY + 296} fill={C.codeGray} fontSize={15} fontFamily="monospace" fillOpacity={0.6}>
          ## Never Do
        </text>
        <text x={previewX + 22} y={previewY + 322} fill={C.codePurple} fontSize={15} fontFamily="monospace">
          - No gradient fills
        </text>
        <text x={previewX + 22} y={previewY + 346} fill={C.codePurple} fontSize={15} fontFamily="monospace">
          - No neon blues (#0066FF)
        </text>
        <text x={previewX + 22} y={previewY + 370} fill={C.codePurple} fontSize={15} fontFamily="monospace">
          - No heavy box shadows
        </text>
        <text x={previewX + 22} y={previewY + 394} fill={C.codePurple} fontSize={15} fontFamily="monospace">
          - No rounded-full buttons
        </text>
        <text x={previewX + 22} y={previewY + 430} fill={C.codeGray} fontSize={14} fontFamily="monospace" fillOpacity={0.4}>
          ...
        </text>
      </g>

      {/* Annotation cards - larger */}
      <g style={{ opacity: pReads * mainDim }}>
        <rect x={previewX + previewW + 24} y={previewY + 20} width={320} height={90} rx={12}
          fill={C.accentLight} stroke={C.accent} strokeWidth={1.5} />
        <text x={previewX + previewW + 40} y={previewY + 52} fill={C.accent} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          Claude reads this file
        </text>
        <text x={previewX + previewW + 40} y={previewY + 78} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
          before every conversation
        </text>
      </g>

      <g style={{ opacity: pBrief * mainDim }}>
        <rect x={previewX + previewW + 24} y={previewY + 130} width={320} height={90} rx={12}
          fill={C.greenLight} stroke={C.green} strokeWidth={1.5} />
        <text x={previewX + previewW + 40} y={previewY + 162} fill={C.green} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          A persistent brief
        </text>
        <text x={previewX + previewW + 40} y={previewY + 188} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
          that never gets lost
        </text>
      </g>

      <g style={{ opacity: pFollows * mainDim }}>
        <rect x={previewX + previewW + 24} y={previewY + 240} width={320} height={90} rx={12}
          fill={C.blueLight} stroke={C.blue} strokeWidth={1.5} />
        <text x={previewX + previewW + 40} y={previewY + 272} fill={C.blue} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          Every file Claude touches
        </text>
        <text x={previewX + previewW + 40} y={previewY + 298} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
          follows these rules
        </text>
      </g>

      {/* Question */}
      <g style={{ opacity: pQuestion }}>
        <text x={grid.center().x} y={grid.y(0.9)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          So what goes in it?
        </text>
      </g>
    </g>
  );
};
