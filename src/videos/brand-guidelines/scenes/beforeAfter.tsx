import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

/** Generic AI wireframe */
const GenericScreen: React.FC<{
  x: number; y: number; w: number; h: number; label: string; opacity: number;
}> = ({ x, y, w, h, label, opacity }) => (
  <g style={{ opacity }}>
    <rect x={x} y={y} width={w} height={h} rx={8} fill={C.white} stroke="#e2e8f0" strokeWidth={1.5} />
    <rect x={x} y={y} width={w} height={22} rx={8} fill="#f1f5f9" />
    <rect x={x} y={y + 22} width={w} height={1} fill="#e2e8f0" />
    {/* Gradient hero */}
    <defs>
      <linearGradient id={`ba-grad-${label}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <rect x={x + 6} y={y + 28} width={w - 12} height={h * 0.3} rx={4} fill={`url(#ba-grad-${label})`} />
    <rect x={x + w * 0.2} y={y + 38} width={w * 0.6} height={6} rx={3} fill="white" fillOpacity={0.8} />
    <rect x={x + w * 0.3} y={y + 50} width={w * 0.4} height={12} rx={6} fill="#0066FF" />
    {/* Cards */}
    {[0, 1].map(i => (
      <g key={i}>
        <rect x={x + 8 + i * (w * 0.46 + 4)} y={y + h * 0.42} width={w * 0.44} height={h * 0.3} rx={4}
          fill={C.white} stroke="#e2e8f0" strokeWidth={1} />
        <rect x={x + 14 + i * (w * 0.46 + 4)} y={y + h * 0.45} width={w * 0.3} height={4} rx={2} fill="#cbd5e1" />
        <rect x={x + 14 + i * (w * 0.46 + 4)} y={y + h * 0.5} width={w * 0.36} height={3} rx={1.5} fill="#e2e8f0" />
        <rect x={x + 14 + i * (w * 0.46 + 4)} y={y + h * 0.54} width={w * 0.24} height={3} rx={1.5} fill="#e2e8f0" />
      </g>
    ))}
    <text x={x + w / 2} y={y + h - 6} textAnchor="middle" fill={C.light}
      fontSize={11} fontFamily="Inter, sans-serif">{label}</text>
  </g>
);

/** Branded wireframe */
const BrandedScreen: React.FC<{
  x: number; y: number; w: number; h: number; label: string; opacity: number;
}> = ({ x, y, w, h, label, opacity }) => (
  <g style={{ opacity }}>
    <rect x={x} y={y} width={w} height={h} rx={8} fill={C.cardFill} stroke={C.accent} strokeWidth={1.5} />
    <rect x={x} y={y} width={w} height={22} rx={8} fill={C.accentLight} />
    <rect x={x} y={y + 22} width={w} height={1} fill={C.hairline} />
    {/* Clean hero with brand bg */}
    <rect x={x + 6} y={y + 28} width={w - 12} height={h * 0.3} rx={4} fill={C.accentLight} />
    <rect x={x + w * 0.15} y={y + 38} width={w * 0.7} height={6} rx={3} fill={C.dark} />
    <rect x={x + w * 0.3} y={y + 50} width={w * 0.4} height={12} rx={4} fill={C.accent} />
    {/* Branded cards */}
    {[0, 1].map(i => (
      <g key={i}>
        <rect x={x + 8 + i * (w * 0.46 + 4)} y={y + h * 0.42} width={w * 0.44} height={h * 0.3} rx={4}
          fill={C.white} stroke={C.accent} strokeWidth={0.8} strokeOpacity={0.3} />
        <rect x={x + 14 + i * (w * 0.46 + 4)} y={y + h * 0.45} width={w * 0.3} height={4} rx={2} fill={C.accent} fillOpacity={0.5} />
        <rect x={x + 14 + i * (w * 0.46 + 4)} y={y + h * 0.5} width={w * 0.36} height={3} rx={1.5} fill={C.mid} fillOpacity={0.3} />
        <rect x={x + 14 + i * (w * 0.46 + 4)} y={y + h * 0.54} width={w * 0.24} height={3} rx={1.5} fill={C.mid} fillOpacity={0.2} />
      </g>
    ))}
    <text x={x + w / 2} y={y + h - 6} textAnchor="middle" fill={C.accent}
      fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">{label}</text>
  </g>
);

export const BeforeAfterScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('before-after');
  const pTitle = progress('show-title');
  const pWithout = progress('show-without');
  const pWithoutScreens = progress('show-without-screens');
  const pWith = progress('show-with');
  const pWithScreens = progress('show-with-screens');
  const pSameBrand = progress('show-same-brand');
  const pClosing = progress('show-closing');
  const pFinal = progress('show-final');

  const beforeDim = interpolate(pWith, [0, 1], [1, 0.4]);
  const afterDim = interpolate(pClosing, [0, 1], [1, 0.3]);

  const screenW = 200;
  const screenH = 180;
  const gap = 16;

  // Left side: without
  const leftX = grid.x(0.04);
  const screensY = grid.y(0.24);

  // Right side: with
  const rightX = grid.x(0.54);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Before and After
        </text>
      </g>

      {/* WITHOUT section */}
      <g style={{ opacity: pWithout * beforeDim }}>
        <rect x={leftX} y={grid.y(0.11)} width={200} height={36} rx={8}
          fill={C.error} fillOpacity={0.08} stroke={C.error} strokeWidth={1.5} />
        <text x={leftX + 100} y={grid.y(0.11) + 22} textAnchor="middle" fill={C.error}
          fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="Inter, sans-serif">
          Without CLAUDE.md
        </text>
      </g>

      {/* Without screens */}
      {['Login', 'Dashboard', 'Settings', 'Profile', 'Landing', 'Pricing'].map((label, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const sx = leftX + col * (screenW + gap);
        const sy = screensY + row * (screenH + gap);
        const sp = entranceSpring(frame, fps, beat('show-without-screens') + i * 3);
        return (
          <GenericScreen key={i} x={sx} y={sy} w={screenW} h={screenH}
            label={label} opacity={sp * beforeDim} />
        );
      })}

      {/* Divider */}
      <line x1={grid.x(0.5)} y1={grid.y(0.12)} x2={grid.x(0.5)} y2={grid.y(0.85)}
        stroke={C.hairline} strokeWidth={2} strokeDasharray="8 6" style={{ opacity: pWith * 0.5 }} />

      {/* WITH section */}
      <g style={{ opacity: pWith * afterDim }}>
        <rect x={rightX} y={grid.y(0.11)} width={180} height={36} rx={8}
          fill={C.green} fillOpacity={0.08} stroke={C.green} strokeWidth={1.5} />
        <text x={rightX + 90} y={grid.y(0.11) + 22} textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="Inter, sans-serif">
          With CLAUDE.md
        </text>
      </g>

      {/* With screens */}
      {['Login', 'Dashboard', 'Settings', 'Profile', 'Landing', 'Pricing'].map((label, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const sx = rightX + col * (screenW + gap);
        const sy = screensY + row * (screenH + gap);
        const sp = entranceSpring(frame, fps, beat('show-with-screens') + i * 3);
        return (
          <BrandedScreen key={i} x={sx} y={sy} w={screenW} h={screenH}
            label={label} opacity={sp * afterDim} />
        );
      })}

      {/* Same brand callout */}
      <g style={{ opacity: pSameBrand * afterDim }}>
        <rect x={rightX + 20} y={screensY + 2 * (screenH + gap) + 14} width={3 * screenW + 2 * gap - 40} height={36} rx={8}
          fill={C.green} fillOpacity={0.08} stroke={C.green} strokeWidth={1} />
        <text x={rightX + (3 * screenW + 2 * gap) / 2} y={screensY + 2 * (screenH + gap) + 38} textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
          Same colors. Same spacing. Same components.
        </text>
      </g>

      {/* Closing statement */}
      <g style={{ opacity: pClosing }}>
        <rect x={grid.center().x - 340} y={grid.y(0.78)} width={680} height={52} rx={12}
          fill={C.accent} fillOpacity={0.08} stroke={C.accent} strokeWidth={1.5} />
        <text x={grid.center().x} y={grid.y(0.78) + 32} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily="Inter, sans-serif">
          Brand guidelines are the instruction set
        </text>
      </g>

      {/* Final */}
      <g style={{ opacity: pFinal }}>
        <text x={grid.center().x} y={grid.y(0.9)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily="Inter, sans-serif">
          Put them in CLAUDE.md. Claude follows them every time.
        </text>
      </g>
    </g>
  );
};
