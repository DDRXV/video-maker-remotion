import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const BrandScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('brand');
  const pTitle = progress('show-title');
  const pBrandFile = progress('show-brand-file');
  const pColors = progress('show-colors');
  const pTypo = progress('show-typography');
  const pApplied = progress('show-applied');
  const pSummary = progress('show-summary');

  const cardX = grid.x(0.04);
  const cardW = grid.x(0.44);

  const appliedDim = interpolate(pApplied, [0, 1], [1, 0.2]);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>7</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Brand Guidelines</text>
      </g>

      {/* Brand file card */}
      <g style={{ opacity: pBrandFile * appliedDim }}>
        <rect x={cardX} y={grid.y(0.14)} width={cardW} height={560} rx={12}
          fill={C.codeBg} stroke={C.amber} strokeWidth={2} />
        <text x={cardX + 16} y={grid.y(0.14) + 28} fill={C.codeOrange}
          fontSize={14} fontFamily="monospace" fontWeight={600}>brand/colors.md</text>
      </g>

      {/* Color palette section */}
      <g style={{ opacity: pColors * appliedDim }}>
        <text x={cardX + 16} y={grid.y(0.14) + 60} fill={C.codeBlue}
          fontSize={14} fontFamily="monospace" fontWeight={600}>## Color Palette</text>

        {[
          { name: 'Primary', hex: '#C75B2A', color: '#C75B2A' },
          { name: 'Secondary', hex: '#2563eb', color: '#2563eb' },
          { name: 'Success', hex: '#16a34a', color: '#16a34a' },
          { name: 'Neutral', hex: '#475569', color: '#475569' },
        ].map((c, i) => {
          const cp = entranceSpring(frame, fps, beat('show-colors') + i * 4);
          const cy = grid.y(0.14) + 82 + i * 44;
          return (
            <g key={i} style={{ opacity: cp }}>
              <rect x={cardX + 16} y={cy} width={32} height={32} rx={6} fill={c.color} />
              <text x={cardX + 60} y={cy + 14} fill="#e2e8f0" fontSize={13} fontFamily="monospace" fontWeight={500}>{c.name}</text>
              <text x={cardX + 60} y={cy + 30} fill={C.codeGray} fontSize={12} fontFamily="monospace">{c.hex}</text>
            </g>
          );
        })}
      </g>

      {/* Typography section */}
      <g style={{ opacity: pTypo * appliedDim }}>
        <text x={cardX + 16} y={grid.y(0.14) + 270} fill={C.codeBlue}
          fontSize={14} fontFamily="monospace" fontWeight={600}>## Typography</text>

        {[
          { label: 'Headings:', value: 'Inter, 700, 24px' },
          { label: 'Body:', value: 'Inter, 400, 16px' },
          { label: 'Code:', value: 'JetBrains Mono, 14px' },
        ].map((t, i) => {
          const tp = entranceSpring(frame, fps, beat('show-typography') + i * 4);
          const ty = grid.y(0.14) + 296 + i * 30;
          return (
            <g key={i} style={{ opacity: tp }}>
              <text x={cardX + 16} y={ty} fill={C.codeOrange} fontSize={13} fontFamily="monospace">{t.label}</text>
              <text x={cardX + 130} y={ty} fill="#e2e8f0" fontSize={13} fontFamily="monospace">{t.value}</text>
            </g>
          );
        })}

        <text x={cardX + 16} y={grid.y(0.14) + 400} fill={C.codeBlue}
          fontSize={14} fontFamily="monospace" fontWeight={600}>## Doc Format</text>
        <text x={cardX + 16} y={grid.y(0.14) + 426} fill="#e2e8f0" fontSize={13} fontFamily="monospace">Logo: top-left, 120x40px</text>
        <text x={cardX + 16} y={grid.y(0.14) + 450} fill="#e2e8f0" fontSize={13} fontFamily="monospace">Margins: 1 inch all sides</text>
        <text x={cardX + 16} y={grid.y(0.14) + 474} fill="#e2e8f0" fontSize={13} fontFamily="monospace">Page numbers: bottom-center</text>
      </g>

      {/* Applied output — right side */}
      <g style={{ opacity: pApplied }}>
        <text x={grid.x(0.54)} y={grid.y(0.16)} fill={C.dark}
          fontSize={FONT_SIZE.lg} fontWeight={700}>Output matches your brand</text>

        {/* Mini PDF mockup */}
        <rect x={grid.x(0.54)} y={grid.y(0.22)} width={380} height={480} rx={8}
          fill={C.cardFill} stroke={C.hairline} strokeWidth={2} />
        {/* Logo placeholder */}
        <rect x={grid.x(0.54) + 20} y={grid.y(0.22) + 20} width={100} height={32} rx={4}
          fill={C.accent} fillOpacity={0.15} stroke={C.accent} strokeWidth={1} />
        <text x={grid.x(0.54) + 70} y={grid.y(0.22) + 40} textAnchor="middle" fill={C.accent}
          fontSize={12} fontWeight={600}>LOGO</text>
        {/* Title in brand color */}
        <rect x={grid.x(0.54) + 20} y={grid.y(0.22) + 70} width={280} height={24} rx={2} fill={C.accent} fillOpacity={0.08} />
        <text x={grid.x(0.54) + 30} y={grid.y(0.22) + 88} fill={C.accent}
          fontSize={FONT_SIZE.sm} fontWeight={700}>Team Collaboration PRD</text>
        {/* Content lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={grid.x(0.54) + 20} y={grid.y(0.22) + 110 + i * 22}
            width={200 + Math.random() * 140} height={8} rx={2}
            fill={C.hairline} />
        ))}
        {/* Mermaid diagram placeholder */}
        <rect x={grid.x(0.54) + 20} y={grid.y(0.22) + 380} width={340} height={80} rx={8}
          fill={C.tealLight} stroke={C.teal} strokeWidth={1} />
        <text x={grid.x(0.54) + 190} y={grid.y(0.22) + 425} textAnchor="middle" fill={C.teal}
          fontSize={13} fontWeight={500}>Architecture Diagram</text>
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Every output looks like it came from your company.
        </text>
      </g>
    </g>
  );
};
