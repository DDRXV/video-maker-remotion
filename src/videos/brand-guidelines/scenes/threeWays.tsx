import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ThreeWaysScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('three-ways');
  const pTitle = progress('show-title');
  const pGoal = progress('show-goal');
  const pM1 = progress('show-method1');
  const pSS = progress('show-screenshot');
  const pM2 = progress('show-method2');
  const pFigma = progress('show-figma');
  const pM3 = progress('show-method3');
  const pDesigner = progress('show-designer');
  const pFastest = progress('show-fastest');
  const pGenerate = progress('show-claude-generates');
  const pOutput = progress('show-output-file');

  const cardW = 480;
  const cardH = 110;
  const cardX = grid.x(0.02);
  const cardStartY = grid.y(0.18);
  const cardGap = 18;

  const allDim = interpolate(pGenerate, [0, 1], [1, 0.4]);

  // Output file
  const outX = grid.x(0.5);
  const outY = grid.y(0.06);
  const outW = 500;
  const outH = 600;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.x(0.02)} y={grid.y(0.03)} fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Create Your Design Tokens
        </text>
      </g>

      {/* Goal */}
      <g style={{ opacity: pGoal }}>
        <text x={grid.x(0.02)} y={grid.y(0.11)} fill={C.mid}
          fontSize={FONT_SIZE.lg} fontFamily="Inter, sans-serif">
          Get Claude to generate a design-tokens.md
        </text>
      </g>

      {/* Method 1: Screenshot */}
      <g style={{ opacity: pM1 * allDim }}>
        <rect x={cardX} y={cardStartY} width={cardW} height={cardH} rx={14}
          fill={C.white} stroke={C.accent} strokeWidth={2} />
        <circle cx={cardX + 34} cy={cardStartY + 32} r={22} fill={C.accent} />
        <text x={cardX + 34} y={cardStartY + 34} textAnchor="middle" dominantBaseline="central"
          fill={C.white} fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily="Inter, sans-serif">1</text>
        <text x={cardX + 70} y={cardStartY + 36} fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          Screenshot your website or Figma
        </text>
        <g style={{ opacity: pSS }}>
          <text x={cardX + 70} y={cardStartY + 66} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
            Paste into Claude: "create a
          </text>
          <text x={cardX + 70} y={cardStartY + 92} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
            design-tokens.md from this"
          </text>
        </g>
      </g>

      {/* Method 2: Figma export */}
      <g style={{ opacity: pM2 * allDim }}>
        <rect x={cardX} y={cardStartY + cardH + cardGap} width={cardW} height={cardH} rx={14}
          fill={C.white} stroke={C.blue} strokeWidth={2} />
        <circle cx={cardX + 34} cy={cardStartY + cardH + cardGap + 32} r={22} fill={C.blue} />
        <text x={cardX + 34} y={cardStartY + cardH + cardGap + 34} textAnchor="middle" dominantBaseline="central"
          fill={C.white} fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily="Inter, sans-serif">2</text>
        <text x={cardX + 70} y={cardStartY + cardH + cardGap + 36} fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          Export tokens from Figma
        </text>
        <g style={{ opacity: pFigma }}>
          <text x={cardX + 70} y={cardStartY + cardH + cardGap + 66} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
            JSON or CSS variables. Claude
          </text>
          <text x={cardX + 70} y={cardStartY + cardH + cardGap + 92} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
            converts to design-tokens.md
          </text>
        </g>
      </g>

      {/* Method 3: Ask designer */}
      <g style={{ opacity: pM3 * allDim }}>
        <rect x={cardX} y={cardStartY + 2 * (cardH + cardGap)} width={cardW} height={cardH} rx={14}
          fill={C.white} stroke={C.purple} strokeWidth={2} />
        <circle cx={cardX + 34} cy={cardStartY + 2 * (cardH + cardGap) + 32} r={22} fill={C.purple} />
        <text x={cardX + 34} y={cardStartY + 2 * (cardH + cardGap) + 34} textAnchor="middle" dominantBaseline="central"
          fill={C.white} fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily="Inter, sans-serif">3</text>
        <text x={cardX + 70} y={cardStartY + 2 * (cardH + cardGap) + 36} fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          Ask your UX designer
        </text>
        <g style={{ opacity: pDesigner }}>
          <text x={cardX + 70} y={cardStartY + 2 * (cardH + cardGap) + 66} fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
            Many teams already have a token file
          </text>
        </g>
      </g>

      {/* "Fastest path" badge - above card 1, not overlapping */}
      <g style={{ opacity: pFastest }}>
        <rect x={cardX - 4} y={cardStartY - 4} width={cardW + 8} height={cardH + 8} rx={16}
          fill="none" stroke={C.accent} strokeWidth={3} />
        <rect x={cardX + cardW - 130} y={cardStartY - 24} width={140} height={30} rx={15}
          fill={C.accent} />
        <text x={cardX + cardW - 60} y={cardStartY - 7} textAnchor="middle" fill={C.white}
          fontSize={FONT_SIZE.sm} fontWeight={700} fontFamily="Inter, sans-serif">
          Fastest path
        </text>
      </g>

      {/* Arrow from cards to output */}
      <g style={{ opacity: pGenerate }}>
        <line x1={cardX + cardW + 12} y1={cardStartY + cardH / 2} x2={outX - 12} y2={outY + 70}
          stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
        <circle cx={outX - 12} cy={outY + 70} r={4.5} fill={C.accent} />
        <text x={(cardX + cardW + outX) / 2 + 10} y={outY + 36} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
          Claude generates
        </text>
      </g>

      {/* Output: design-tokens.md */}
      <g style={{ opacity: pOutput }}>
        <rect x={outX} y={outY} width={outW} height={outH} rx={14}
          fill={C.codeBg} stroke={C.green} strokeWidth={2} />
        <rect x={outX} y={outY} width={outW} height={40} rx={14} fill={C.green} fillOpacity={0.15} />
        <rect x={outX} y={outY + 28} width={outW} height={12} fill={C.green} fillOpacity={0.15} />
        <text x={outX + 18} y={outY + 26} fill={C.codeGreen} fontSize={16} fontFamily="monospace" fontWeight={600}>
          design-tokens.md
        </text>

        {[
          { y: 60, text: '# Design Tokens', color: C.codeGray },
          { y: 92, text: '## Colors', color: C.codeGray, op: 0.6 },
          { y: 116, text: 'accent: #C75B2A', color: C.codeOrange },
          { y: 138, text: 'background: #FDFBF8', color: C.codeOrange },
          { y: 160, text: 'text-primary: #1c1917', color: C.codeOrange },
          { y: 182, text: 'text-secondary: #57534e', color: C.codeOrange },
          { y: 214, text: '## Typography', color: C.codeGray, op: 0.6 },
          { y: 238, text: 'heading: Inter 700 48px', color: C.codeBlue },
          { y: 260, text: 'body: Inter 400 16px', color: C.codeBlue },
          { y: 292, text: '## Components', color: C.codeGray, op: 0.6 },
          { y: 316, text: 'button: 48px / 12px radius', color: C.codePurple },
          { y: 338, text: 'card: 24px padding / shadow-sm', color: C.codePurple },
          { y: 370, text: '## Constraints', color: C.codeGray, op: 0.6 },
          { y: 394, text: '- No gradient fills', color: C.codeGreen },
          { y: 416, text: '- No neon blues', color: C.codeGreen },
          { y: 438, text: '- No heavy shadows', color: C.codeGreen },
          { y: 460, text: '- No rounded-full buttons', color: C.codeGreen },
          { y: 490, text: '...', color: C.codeGray, op: 0.3 },
        ].map((line, i) => {
          const lp = entranceSpring(frame, fps, beat('show-output-file') + i * 1.5);
          return (
            <text key={i} x={outX + 22} y={outY + line.y} fill={line.color}
              fontSize={15} fontFamily="monospace" style={{ opacity: lp * (line.op ?? 1) }}>
              {line.text}
            </text>
          );
        })}
      </g>

      {/* CLAUDE.md instruction */}
      <g style={{ opacity: pOutput }}>
        <rect x={outX + 50} y={outY + outH + 18} width={outW - 100} height={48} rx={10}
          fill={C.accentLight} stroke={C.accent} strokeWidth={1.5} />
        <text x={outX + outW / 2} y={outY + outH + 48} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="monospace">
          CLAUDE.md: "Follow design-tokens.md"
        </text>
      </g>
    </g>
  );
};
