import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const DefaultLookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('default-look');
  const pPrompt = progress('show-prompt');
  const pOutput = progress('show-generic-output');
  const pHero = progress('show-hero');
  const pButtons = progress('show-buttons');
  const pLayout = progress('show-layout');
  const pReason = progress('show-reason');
  const pMillions = progress('show-millions');
  const pMean = progress('show-mean');

  const outputDim = interpolate(pReason, [0, 1], [1, 0.2]);
  const promptDim = interpolate(pReason, [0, 1], [1, 0.2]);

  // Larger wireframe
  const wireW = 640;
  const wireH = 520;
  const wireX = (1920 - wireW) / 2;
  const wireY = grid.y(0.1);

  return (
    <g>
      {/* Claude prompt */}
      <g style={{ opacity: pPrompt * promptDim }}>
        <rect x={grid.x(0.01)} y={grid.y(0.01)} width={grid.x(0.98)} height={56} rx={12}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <text x={grid.x(0.03)} y={grid.y(0.01) + 22} fill={C.codeGreen} fontSize={16} fontFamily="monospace">$</text>
        <text x={grid.x(0.03) + 20} y={grid.y(0.01) + 22} fill={C.codeOrange} fontSize={16} fontFamily="monospace" fontWeight={600}>claude</text>
        <text x={grid.x(0.03) + 84} y={grid.y(0.01) + 22} fill={C.codeGray} fontSize={16} fontFamily="monospace">
          "Build me a landing page for a pet food startup"
        </text>
        <text x={grid.x(0.03)} y={grid.y(0.01) + 44} fill={C.codeBlue} fontSize={15} fontFamily="monospace">
          Building landing page...
        </text>
      </g>

      {/* Generic output wireframe */}
      <g style={{ opacity: pOutput * outputDim }}>
        {/* Browser chrome */}
        <rect x={wireX} y={wireY} width={wireW} height={wireH} rx={14} fill={C.white} stroke="#e2e8f0" strokeWidth={2} />
        <rect x={wireX} y={wireY} width={wireW} height={36} rx={14} fill="#f1f5f9" />
        <rect x={wireX} y={wireY + 36} width={wireW} height={1} fill="#e2e8f0" />
        <circle cx={wireX + 18} cy={wireY + 18} r={6} fill="#fca5a5" />
        <circle cx={wireX + 36} cy={wireY + 18} r={6} fill="#fde68a" />
        <circle cx={wireX + 54} cy={wireY + 18} r={6} fill="#86efac" />

        {/* Hero gradient */}
        <g style={{ opacity: pHero }}>
          <defs>
            <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <rect x={wireX + 14} y={wireY + 48} width={wireW - 28} height={160} rx={10} fill="url(#hero-grad)" />
          <rect x={wireX + wireW * 0.18} y={wireY + 80} width={wireW * 0.64} height={14} rx={7} fill="white" fillOpacity={0.9} />
          <rect x={wireX + wireW * 0.25} y={wireY + 106} width={wireW * 0.5} height={10} rx={5} fill="white" fillOpacity={0.5} />
        </g>

        {/* Blue CTA button */}
        <g style={{ opacity: pButtons }}>
          <rect x={wireX + wireW * 0.32} y={wireY + 132} width={wireW * 0.36} height={36} rx={18} fill="#0066FF" />
          <rect x={wireX + wireW * 0.4} y={wireY + 145} width={wireW * 0.2} height={10} rx={5} fill="white" fillOpacity={0.9} />
        </g>

        {/* Card grid */}
        <g style={{ opacity: pLayout }}>
          {[0, 1, 2].map(i => {
            const cardW = (wireW - 56 - 28) / 3;
            const cardX = wireX + 20 + i * (cardW + 14);
            const cardY = wireY + 228;
            const cardH = 150;
            return (
              <g key={i}>
                <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={10} fill={C.white} stroke="#e2e8f0" strokeWidth={1.5} />
                <rect x={cardX + 12} y={cardY + 12} width={cardW - 24} height={48} rx={6} fill="#f1f5f9" />
                <rect x={cardX + 12} y={cardY + 70} width={cardW * 0.7} height={7} rx={3.5} fill="#cbd5e1" />
                <rect x={cardX + 12} y={cardY + 84} width={cardW * 0.9} height={6} rx={3} fill="#e2e8f0" />
                <rect x={cardX + 12} y={cardY + 96} width={cardW * 0.6} height={6} rx={3} fill="#e2e8f0" />
                <rect x={cardX + 12} y={cardY + 116} width={cardW * 0.5} height={22} rx={11} fill="#0066FF" fillOpacity={0.8} />
              </g>
            );
          })}
        </g>

        {/* Footer */}
        <g style={{ opacity: pLayout }}>
          <rect x={wireX + 14} y={wireY + wireH - 56} width={wireW - 28} height={40} rx={8} fill="#f8fafc" />
          <rect x={wireX + 28} y={wireY + wireH - 40} width={100} height={6} rx={3} fill="#cbd5e1" />
          <rect x={wireX + 142} y={wireY + wireH - 40} width={70} height={6} rx={3} fill="#cbd5e1" />
        </g>
      </g>

      {/* Callout labels */}
      <g style={{ opacity: pHero * outputDim }}>
        <line x1={wireX - 10} y1={wireY + 120} x2={wireX - 70} y2={wireY + 100} stroke={C.error} strokeWidth={2} strokeLinecap="round" />
        <rect x={wireX - 270} y={wireY + 82} width={200} height={38} rx={10} fill={C.error} fillOpacity={0.08} stroke={C.error} strokeWidth={1.5} />
        <text x={wireX - 170} y={wireY + 106} textAnchor="middle" fill={C.error} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">Gradient hero</text>
      </g>
      <g style={{ opacity: pButtons * outputDim }}>
        <line x1={wireX - 10} y1={wireY + 150} x2={wireX - 70} y2={wireY + 170} stroke={C.error} strokeWidth={2} strokeLinecap="round" />
        <rect x={wireX - 270} y={wireY + 152} width={200} height={38} rx={10} fill={C.error} fillOpacity={0.08} stroke={C.error} strokeWidth={1.5} />
        <text x={wireX - 170} y={wireY + 176} textAnchor="middle" fill={C.error} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">Blue CTA (#0066FF)</text>
      </g>
      <g style={{ opacity: pLayout * outputDim }}>
        <line x1={wireX + wireW + 10} y1={wireY + 300} x2={wireX + wireW + 70} y2={wireY + 300} stroke={C.error} strokeWidth={2} strokeLinecap="round" />
        <rect x={wireX + wireW + 70} y={wireY + 282} width={220} height={38} rx={10} fill={C.error} fillOpacity={0.08} stroke={C.error} strokeWidth={1.5} />
        <text x={wireX + wireW + 180} y={wireY + 306} textAnchor="middle" fill={C.error} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">Cookie-cutter cards</text>
      </g>

      {/* Reason section */}
      <g style={{ opacity: pReason }}>
        <text x={grid.center().x} y={grid.y(0.5)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Why Does This Happen?
        </text>
      </g>

      {/* Mini websites - fewer, bigger, more visible */}
      <g style={{ opacity: pMillions }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          const sx = grid.x(0.08) + col * 130;
          const sy = grid.y(0.58) + row * 72;
          const ap = entranceSpring(frame, fps, beat('show-millions') + i * 2);
          return (
            <g key={i} style={{ opacity: ap * 0.5 }}>
              <rect x={sx} y={sy} width={110} height={56} rx={6} fill={C.white} stroke="#e2e8f0" strokeWidth={1.5} />
              <rect x={sx + 6} y={sy + 6} width={98} height={20} rx={3} fill="#667eea" fillOpacity={0.3} />
              <rect x={sx + 6} y={sy + 32} width={60} height={5} rx={2.5} fill="#e2e8f0" />
              <rect x={sx + 6} y={sy + 42} width={42} height={5} rx={2.5} fill="#e2e8f0" />
            </g>
          );
        })}

        <text x={grid.x(0.52)} y={grid.y(0.62)} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.xl} fontWeight={500} fontFamily="Inter, sans-serif">
          Claude has seen millions of websites
        </text>
      </g>

      {/* "Mean of the internet" */}
      <g style={{ opacity: pMean }}>
        <rect x={grid.center().x - 340} y={grid.y(0.84)} width={680} height={64} rx={14}
          fill={C.accent} fillOpacity={0.08} stroke={C.accent} strokeWidth={2} />
        <text x={grid.center().x} y={grid.y(0.84) + 38} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          You get the mean of the internet. Not your brand.
        </text>
      </g>
    </g>
  );
};
