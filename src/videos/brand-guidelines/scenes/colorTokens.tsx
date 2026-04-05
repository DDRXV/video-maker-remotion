import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ColorTokensScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('color-tokens');
  const pTitle = progress('show-title');
  const pHeader = progress('show-file-header');
  const pAccent = progress('show-accent');
  const pBg = progress('show-background');
  const pText = progress('show-text-colors');
  const pSwatches = progress('show-swatches');
  const pSemantic = progress('show-semantic');
  const pUse = progress('show-components-use');

  const fileDim = interpolate(pSemantic, [0, 1], [1, 0.3]);

  // Token file - wider and taller
  const fileX = grid.x(0.01);
  const fileY = grid.y(0.1);
  const fileW = 540;
  const fileH = 560;

  // Color swatches on the right
  const swatchStartX = grid.x(0.5);
  const swatchY = grid.y(0.1);

  const colors = [
    { name: 'accent', hex: '#C75B2A', color: '#C75B2A', role: 'Buttons, links, emphasis' },
    { name: 'background', hex: '#FDFBF8', color: '#FDFBF8', role: 'Page background', border: true },
    { name: 'card-fill', hex: '#FFFFFF', color: '#FFFFFF', role: 'Card surfaces', border: true },
    { name: 'text-primary', hex: '#1c1917', color: '#1c1917', role: 'Headings, key text' },
    { name: 'text-secondary', hex: '#57534e', color: '#57534e', role: 'Body text, labels' },
    { name: 'border', hex: '#d6d3d1', color: '#d6d3d1', role: 'Card borders, dividers', border: true },
    { name: 'success', hex: '#16a34a', color: '#16a34a', role: 'Confirmation states' },
    { name: 'error', hex: '#dc2626', color: '#dc2626', role: 'Error states' },
  ];

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.x(0.01)} y={grid.y(0.02)} fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Color Tokens
        </text>
        <text x={grid.x(0.19)} y={grid.y(0.02)} fill={C.mid}
          fontSize={FONT_SIZE.lg} fontFamily="Inter, sans-serif">
          (inside design-tokens.md)
        </text>
      </g>

      {/* Token file */}
      <g style={{ opacity: pHeader * fileDim }}>
        <rect x={fileX} y={fileY} width={fileW} height={fileH} rx={14}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <rect x={fileX} y={fileY} width={fileW} height={38} rx={14} fill={C.accent} fillOpacity={0.1} />
        <rect x={fileX} y={fileY + 26} width={fileW} height={12} fill={C.accent} fillOpacity={0.1} />
        <text x={fileX + 18} y={fileY + 26} fill={C.codeOrange} fontSize={16} fontFamily="monospace" fontWeight={600}>
          ## Colors
        </text>
      </g>

      {/* Accent */}
      <g style={{ opacity: pAccent * fileDim }}>
        <rect x={fileX + 18} y={fileY + 58} width={18} height={18} rx={4} fill="#C75B2A" />
        <text x={fileX + 44} y={fileY + 73} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          accent: #C75B2A
        </text>
        <text x={fileX + 280} y={fileY + 73} fill={C.codeGray} fontSize={15} fontFamily="monospace" fillOpacity={0.5}>
          // primary brand
        </text>
      </g>

      {/* Background */}
      <g style={{ opacity: pBg * fileDim }}>
        <rect x={fileX + 18} y={fileY + 96} width={18} height={18} rx={4} fill="#FDFBF8" stroke={C.light} strokeWidth={1.5} />
        <text x={fileX + 44} y={fileY + 111} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          background: #FDFBF8
        </text>
        <text x={fileX + 320} y={fileY + 111} fill={C.codeGray} fontSize={15} fontFamily="monospace" fillOpacity={0.5}>
          // warm off-white
        </text>

        <rect x={fileX + 18} y={fileY + 132} width={18} height={18} rx={4} fill="#FFFFFF" stroke={C.light} strokeWidth={1.5} />
        <text x={fileX + 44} y={fileY + 147} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          card-fill: #FFFFFF
        </text>
      </g>

      {/* Text colors */}
      <g style={{ opacity: pText * fileDim }}>
        <rect x={fileX + 18} y={fileY + 180} width={18} height={18} rx={4} fill="#1c1917" />
        <text x={fileX + 44} y={fileY + 195} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          text-primary: #1c1917
        </text>
        <text x={fileX + 350} y={fileY + 195} fill={C.codeGray} fontSize={15} fontFamily="monospace" fillOpacity={0.5}>
          // headings
        </text>

        <rect x={fileX + 18} y={fileY + 218} width={18} height={18} rx={4} fill="#57534e" />
        <text x={fileX + 44} y={fileY + 233} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          text-secondary: #57534e
        </text>
        <text x={fileX + 380} y={fileY + 233} fill={C.codeGray} fontSize={15} fontFamily="monospace" fillOpacity={0.5}>
          // body
        </text>

        <rect x={fileX + 18} y={fileY + 268} width={18} height={18} rx={4} fill="#d6d3d1" stroke={C.light} strokeWidth={1} />
        <text x={fileX + 44} y={fileY + 283} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          border: #d6d3d1
        </text>

        <rect x={fileX + 18} y={fileY + 306} width={18} height={18} rx={4} fill="#16a34a" />
        <text x={fileX + 44} y={fileY + 321} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          success: #16a34a
        </text>

        <rect x={fileX + 18} y={fileY + 344} width={18} height={18} rx={4} fill="#dc2626" />
        <text x={fileX + 44} y={fileY + 359} fill={C.codeGreen} fontSize={17} fontFamily="monospace">
          error: #dc2626
        </text>
      </g>

      {/* Color swatch cards - 2x4 grid, bigger */}
      {colors.map((c, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const sx = swatchStartX + col * 265;
        const sy = swatchY + row * 116;
        const sp = entranceSpring(frame, fps, beat('show-swatches') + i * 3);
        const dim = interpolate(pSemantic, [0, 1], [1, 0.3]);
        return (
          <g key={i} style={{ opacity: sp * dim }}>
            <rect x={sx} y={sy} width={248} height={100} rx={12}
              fill={C.white} stroke={C.hairline} strokeWidth={1.5} />
            <circle cx={sx + 40} cy={sy + 36} r={22}
              fill={c.color} stroke={c.border ? C.mid : 'none'} strokeWidth={c.border ? 2 : 0} />
            <text x={sx + 72} y={sy + 32} fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
              {c.name}
            </text>
            <text x={sx + 72} y={sy + 54} fill={C.light} fontSize={FONT_SIZE.md} fontFamily="monospace">
              {c.hex}
            </text>
            <text x={sx + 16} y={sy + 84} fill={C.mid} fontSize={FONT_SIZE.sm} fontFamily="Inter, sans-serif">
              {c.role}
            </text>
          </g>
        );
      })}

      {/* Semantic mapping */}
      <g style={{ opacity: pSemantic }}>
        <text x={grid.center().x} y={grid.y(0.62)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Semantic Color Roles
        </text>

        {/* Website → Claude → Roles */}
        <rect x={grid.x(0.04)} y={grid.y(0.69)} width={240} height={86} rx={12}
          fill={C.accentLight} stroke={C.accent} strokeWidth={1.5} />
        <text x={grid.x(0.04) + 120} y={grid.y(0.69) + 34} textAnchor="middle"
          fill={C.accent} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          Your Website
        </text>
        <text x={grid.x(0.04) + 120} y={grid.y(0.69) + 60} textAnchor="middle"
          fill={C.mid} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
          (screenshot)
        </text>

        <line x1={grid.x(0.04) + 250} y1={grid.y(0.73)} x2={grid.x(0.3)} y2={grid.y(0.73)}
          stroke={C.accent} strokeWidth={2} strokeLinecap="round" />
        <polyline points={`${grid.x(0.3) - 10},${grid.y(0.73) - 7} ${grid.x(0.3)},${grid.y(0.73)} ${grid.x(0.3) - 10},${grid.y(0.73) + 7}`}
          fill="none" stroke={C.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        <rect x={grid.x(0.3)} y={grid.y(0.69)} width={220} height={86} rx={12}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <text x={grid.x(0.3) + 110} y={grid.y(0.69) + 34} textAnchor="middle"
          fill={C.codeOrange} fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif">
          Claude
        </text>
        <text x={grid.x(0.3) + 110} y={grid.y(0.69) + 60} textAnchor="middle"
          fill={C.codeGray} fontSize={FONT_SIZE.md} fontFamily="Inter, sans-serif">
          extracts + maps
        </text>

        <line x1={grid.x(0.3) + 230} y1={grid.y(0.73)} x2={grid.x(0.56)} y2={grid.y(0.73)}
          stroke={C.green} strokeWidth={2} strokeLinecap="round" />
        <polyline points={`${grid.x(0.56) - 10},${grid.y(0.73) - 7} ${grid.x(0.56)},${grid.y(0.73)} ${grid.x(0.56) - 10},${grid.y(0.73) + 7}`}
          fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Mapped roles */}
        {['accent', 'background', 'surface', 'text-primary', 'text-secondary'].map((role, i) => {
          const rp = entranceSpring(frame, fps, beat('show-semantic') + 6 + i * 3);
          const ry = grid.y(0.66) + i * 36;
          const rc: Record<string, string> = {
            accent: '#C75B2A', background: '#FDFBF8', surface: '#FFFFFF',
            'text-primary': '#1c1917', 'text-secondary': '#57534e',
          };
          const nb = role === 'background' || role === 'surface';
          return (
            <g key={i} style={{ opacity: rp }}>
              <circle cx={grid.x(0.58)} cy={ry + 8} r={12}
                fill={rc[role]} stroke={nb ? C.mid : 'none'} strokeWidth={nb ? 2 : 0} />
              <text x={grid.x(0.61)} y={ry + 14} fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={500} fontFamily="monospace">
                {role}
              </text>
            </g>
          );
        })}
      </g>

      {/* Bottom */}
      <g style={{ opacity: pUse }}>
        <text x={grid.center().x} y={grid.y(0.92)} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily="Inter, sans-serif">
          Every component Claude builds pulls from these values
        </text>
      </g>
    </g>
  );
};
