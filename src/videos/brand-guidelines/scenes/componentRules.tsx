import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ComponentRulesScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('component-rules');
  const pTitle = progress('show-title');
  const pHeader = progress('show-section-header');
  const pBtnSpec = progress('show-button-spec');
  const pBtnEx = progress('show-button-examples');
  const pCardSpec = progress('show-card-spec');
  const pCardEx = progress('show-card-example');
  const pInputSpec = progress('show-input-spec');
  const pConsistency = progress('show-consistency');
  const pNoReprompt = progress('show-no-reprompt');

  const specDim = interpolate(pConsistency, [0, 1], [1, 0.3]);

  // Spec file on the left
  const fileX = grid.x(0.02);
  const fileY = grid.y(0.12);
  const fileW = 400;

  // Live examples on the right
  const exX = grid.x(0.42);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.x(0.02)} y={grid.y(0.03)} fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Component Rules
        </text>
        <text x={grid.x(0.25)} y={grid.y(0.03)} fill={C.mid}
          fontSize={FONT_SIZE.lg} fontFamily="Inter, sans-serif">
          (inside design-tokens.md)
        </text>
      </g>

      {/* Spec file */}
      <g style={{ opacity: pHeader * specDim }}>
        <rect x={fileX} y={fileY} width={fileW} height={500} rx={12}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <rect x={fileX} y={fileY} width={fileW} height={32} rx={12} fill={C.blue} fillOpacity={0.1} />
        <rect x={fileX} y={fileY + 20} width={fileW} height={12} fill={C.blue} fillOpacity={0.1} />
        <text x={fileX + 14} y={fileY + 20} fill={C.codeBlue} fontSize={13} fontFamily="monospace" fontWeight={600}>
          ## Components
        </text>
      </g>

      {/* Button spec in file */}
      <g style={{ opacity: pBtnSpec * specDim }}>
        <text x={fileX + 14} y={fileY + 56} fill={C.codeGray} fontSize={13} fontFamily="monospace" fillOpacity={0.6}>
          ### Buttons
        </text>
        <text x={fileX + 14} y={fileY + 78} fill={C.codeOrange} fontSize={13} fontFamily="monospace">
          height: 48px
        </text>
        <text x={fileX + 14} y={fileY + 98} fill={C.codeOrange} fontSize={13} fontFamily="monospace">
          border-radius: 12px
        </text>
        <text x={fileX + 14} y={fileY + 118} fill={C.codeOrange} fontSize={13} fontFamily="monospace">
          primary: solid fill (#C75B2A)
        </text>
        <text x={fileX + 14} y={fileY + 138} fill={C.codeOrange} fontSize={13} fontFamily="monospace">
          secondary: outline, 1.5px border
        </text>
        <text x={fileX + 14} y={fileY + 158} fill={C.codeOrange} fontSize={13} fontFamily="monospace">
          font: Inter 600 16px, white/accent
        </text>
      </g>

      {/* Button examples */}
      <g style={{ opacity: pBtnEx * specDim }}>
        <text x={exX} y={fileY + 50} fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
          What Claude generates:
        </text>
        {/* Primary button */}
        <rect x={exX} y={fileY + 64} width={180} height={48} rx={12} fill={C.accent} />
        <text x={exX + 90} y={fileY + 92} textAnchor="middle" fill={C.white}
          fontSize={16} fontWeight={600} fontFamily="Inter, sans-serif">Get Started</text>
        {/* Secondary button */}
        <rect x={exX + 200} y={fileY + 64} width={180} height={48} rx={12}
          fill="none" stroke={C.accent} strokeWidth={1.5} />
        <text x={exX + 290} y={fileY + 92} textAnchor="middle" fill={C.accent}
          fontSize={16} fontWeight={600} fontFamily="Inter, sans-serif">Learn More</text>
        {/* Dimension annotations */}
        <line x1={exX - 30} y1={fileY + 64} x2={exX - 30} y2={fileY + 112}
          stroke={C.light} strokeWidth={1} strokeDasharray="3 3" />
        <text x={exX - 38} y={fileY + 92} textAnchor="end" fill={C.light}
          fontSize={FONT_SIZE.xs} fontFamily="monospace">48px</text>
        {/* Radius annotation */}
        <path d={`M ${exX} ${fileY + 76} Q ${exX} ${fileY + 64} ${exX + 12} ${fileY + 64}`}
          fill="none" stroke={C.light} strokeWidth={1} strokeDasharray="3 3" />
        <text x={exX + 20} y={fileY + 58} fill={C.light}
          fontSize={FONT_SIZE.xs} fontFamily="monospace">12px</text>
      </g>

      {/* Card spec in file */}
      <g style={{ opacity: pCardSpec * specDim }}>
        <text x={fileX + 14} y={fileY + 196} fill={C.codeGray} fontSize={13} fontFamily="monospace" fillOpacity={0.6}>
          ### Cards
        </text>
        <text x={fileX + 14} y={fileY + 218} fill={C.codePurple} fontSize={13} fontFamily="monospace">
          padding: 24px
        </text>
        <text x={fileX + 14} y={fileY + 238} fill={C.codePurple} fontSize={13} fontFamily="monospace">
          border-radius: 12px
        </text>
        <text x={fileX + 14} y={fileY + 258} fill={C.codePurple} fontSize={13} fontFamily="monospace">
          border: 1px solid #d6d3d1
        </text>
        <text x={fileX + 14} y={fileY + 278} fill={C.codePurple} fontSize={13} fontFamily="monospace">
          shadow: 0 1px 3px rgba(0,0,0,0.1)
        </text>
        <text x={fileX + 14} y={fileY + 298} fill={C.codePurple} fontSize={13} fontFamily="monospace">
          background: #FFFFFF
        </text>
      </g>

      {/* Card example */}
      <g style={{ opacity: pCardEx * specDim }}>
        {/* Example card */}
        <g filter="url(#shadow-sm)">
          <rect x={exX} y={fileY + 180} width={320} height={160} rx={12}
            fill={C.white} stroke={C.hairline} strokeWidth={1} />
        </g>
        {/* Card content */}
        <text x={exX + 24} y={fileY + 210} fill={C.dark}
          fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
          Feature Card
        </text>
        <rect x={exX + 24} y={fileY + 224} width={272} height={4} rx={2} fill={C.hairline} />
        <text x={exX + 24} y={fileY + 252} fill={C.mid}
          fontSize={FONT_SIZE.sm} fontFamily="Inter, sans-serif">
          24px padding on all sides.
        </text>
        <text x={exX + 24} y={fileY + 274} fill={C.mid}
          fontSize={FONT_SIZE.sm} fontFamily="Inter, sans-serif">
          12px border radius. Subtle shadow.
        </text>
        {/* Orange accent line */}
        <rect x={exX + 24} y={fileY + 300} width={60} height={24} rx={6} fill={C.accent} />
        <text x={exX + 54} y={fileY + 316} textAnchor="middle" fill={C.white}
          fontSize={12} fontWeight={600} fontFamily="Inter, sans-serif">View</text>

        {/* Padding annotations */}
        <line x1={exX + 2} y1={fileY + 184} x2={exX + 2} y2={fileY + 206}
          stroke={C.purple} strokeWidth={1} strokeDasharray="3 3" />
        <text x={exX - 6} y={fileY + 198} textAnchor="end" fill={C.purple}
          fontSize={11} fontFamily="monospace">24px</text>
      </g>

      {/* Input spec */}
      <g style={{ opacity: pInputSpec * specDim }}>
        <text x={fileX + 14} y={fileY + 336} fill={C.codeGray} fontSize={13} fontFamily="monospace" fillOpacity={0.6}>
          ### Inputs
        </text>
        <text x={fileX + 14} y={fileY + 358} fill={C.codeBlue} fontSize={13} fontFamily="monospace">
          height: 44px
        </text>
        <text x={fileX + 14} y={fileY + 378} fill={C.codeBlue} fontSize={13} fontFamily="monospace">
          border: 1px solid #d6d3d1
        </text>
        <text x={fileX + 14} y={fileY + 398} fill={C.codeBlue} fontSize={13} fontFamily="monospace">
          focus: 2px solid #C75B2A
        </text>
        <text x={fileX + 14} y={fileY + 418} fill={C.codeBlue} fontSize={13} fontFamily="monospace">
          padding: 0 12px
        </text>

        {/* Input example */}
        <rect x={exX} y={fileY + 370} width={280} height={44} rx={8}
          fill={C.white} stroke={C.accent} strokeWidth={2} />
        <text x={exX + 12} y={fileY + 396} fill={C.mid}
          fontSize={15} fontFamily="Inter, sans-serif">
          Enter your email...
        </text>
        <text x={exX + 290} y={fileY + 396} fill={C.light}
          fontSize={11} fontFamily="monospace">focus state</text>
      </g>

      {/* Consistency message */}
      <g style={{ opacity: pConsistency }}>
        <rect x={grid.x(0.12)} y={grid.y(0.76)} width={grid.x(0.76)} height={56} rx={12}
          fill={C.green} fillOpacity={0.08} stroke={C.green} strokeWidth={1.5} />
        <text x={grid.center().x} y={grid.y(0.76) + 22} textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily="Inter, sans-serif">
          Every button, card, and input follows the same spec
        </text>
        <text x={grid.center().x} y={grid.y(0.76) + 44} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
          No matter which page Claude generates
        </text>
      </g>

      {/* No reprompt */}
      <g style={{ opacity: pNoReprompt }}>
        <rect x={grid.center().x - 240} y={grid.y(0.88)} width={480} height={44} rx={10}
          fill={C.accent} fillOpacity={0.08} stroke={C.accent} strokeWidth={1.5} />
        <text x={grid.center().x} y={grid.y(0.88) + 28} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          You stop re-prompting "make the buttons match"
        </text>
      </g>
    </g>
  );
};
