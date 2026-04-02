import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { BBG, useScene } from '../styles';

export const TransformerScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('transformer');

  const pTitle = progress('show-title');
  const pBlock = progress('show-block');
  const pAttention = progress('show-attention');
  const pFfn = progress('show-ffn');
  const pStack = progress('show-stack');
  const pSummary = progress('show-summary');

  const blockX = grid.x(0.3);
  const blockW = 500;
  const blockH = 420;
  const blockY = grid.y(0.14);

  // Dim single block when stack appears
  const singleDim = interpolate(pStack, [0, 1], [1, 0.15]);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={BBG.accent} fontSize={FONT_SIZE.md} fontWeight={700}>5</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Transformer Block</text>
      </g>

      {/* Single transformer block diagram */}
      <g style={{ opacity: pBlock * singleDim }}>
        {/* Outer container */}
        <rect x={blockX} y={blockY} width={blockW} height={blockH} rx={16}
          fill={BBG.cardFill} stroke={BBG.accent} strokeWidth={2} />
        <text x={blockX + blockW / 2} y={blockY - 12} textAnchor="middle" fill={BBG.mid}
          fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>
          Transformer Block
        </text>

        {/* Input arrow */}
        <line x1={blockX + blockW / 2} y1={blockY + blockH + 4} x2={blockX + blockW / 2} y2={blockY + blockH + 40}
          stroke={BBG.accent} strokeWidth={2} markerEnd="none" />
        <text x={blockX + blockW / 2} y={blockY + blockH + 60} textAnchor="middle" fill={BBG.mid}
          fontSize={FONT_SIZE.sm}>Input vectors</text>

        {/* Self-Attention sub-block */}
        <g style={{ opacity: pAttention }}>
          <rect x={blockX + 30} y={blockY + 30} width={blockW - 60} height={140} rx={12}
            fill={BBG.tealLight} stroke={BBG.teal} strokeWidth={2} />
          <text x={blockX + blockW / 2} y={blockY + 70} textAnchor="middle" fill={BBG.teal}
            fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
            Self-Attention
          </text>
          <text x={blockX + blockW / 2} y={blockY + 105} textAnchor="middle" fill={BBG.mid}
            fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.body.fontFamily}>
            Each token looks at every other token
          </text>
          <text x={blockX + blockW / 2} y={blockY + 130} textAnchor="middle" fill={BBG.mid}
            fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.body.fontFamily}>
            "How relevant are you to me?"
          </text>
        </g>

        {/* Arrow between sub-blocks */}
        {pFfn > 0.1 && (
          <line x1={blockX + blockW / 2} y1={blockY + 175} x2={blockX + blockW / 2} y2={blockY + 210}
            stroke={BBG.accent} strokeWidth={2} />
        )}

        {/* Feed-Forward sub-block */}
        <g style={{ opacity: pFfn }}>
          <rect x={blockX + 30} y={blockY + 210} width={blockW - 60} height={140} rx={12}
            fill={BBG.purpleLight} stroke={BBG.purple} strokeWidth={2} />
          <text x={blockX + blockW / 2} y={blockY + 250} textAnchor="middle" fill={BBG.purple}
            fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
            Feed-Forward Network
          </text>
          <text x={blockX + blockW / 2} y={blockY + 285} textAnchor="middle" fill={BBG.mid}
            fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.body.fontFamily}>
            Processes each token independently
          </text>
          <text x={blockX + blockW / 2} y={blockY + 310} textAnchor="middle" fill={BBG.mid}
            fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.body.fontFamily}>
            Adds learned knowledge
          </text>
        </g>

        {/* Output arrow */}
        <line x1={blockX + blockW / 2} y1={blockY - 4} x2={blockX + blockW / 2} y2={blockY - 40}
          stroke={BBG.accent} strokeWidth={2} />
        <text x={blockX + blockW / 2} y={blockY - 48} textAnchor="middle" fill={BBG.mid}
          fontSize={FONT_SIZE.sm}>Output vectors</text>
      </g>

      {/* Stacked blocks visualization */}
      <g style={{ opacity: pStack }}>
        <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          80-120 Transformer Blocks
        </text>

        {/* Stack of blocks */}
        {Array.from({ length: 8 }).map((_, i) => {
          const delay = beat('show-stack') + i * 3;
          const sp = entranceSpring(frame, fps, delay);
          const sx = grid.x(0.25) + i * 12;
          const sy = grid.y(0.2) + i * 55;
          const isLast = i === 7;
          const slideX = interpolate(sp, [0, 1], [-20, 0]);
          const label = i === 0 ? 'Block 1' : i === 7 ? 'Block 80+' : i <= 2 ? `Block ${i + 1}` : '';
          const showDots = i === 3;

          if (showDots) {
            return (
              <g key={i} style={{ opacity: sp }}>
                <text x={sx + 200} y={sy + 25} textAnchor="middle" fill={BBG.mid}
                  fontSize={FONT_SIZE['2xl']} fontWeight={700}>⋮</text>
              </g>
            );
          }

          return (
            <g key={i} style={{ opacity: sp, transform: `translateX(${slideX}px)` }}>
              <rect x={sx} y={sy} width={400} height={44} rx={10}
                fill={isLast ? BBG.accentLight : BBG.cardFill}
                stroke={isLast ? BBG.accent : BBG.hairline} strokeWidth={isLast ? 2 : 1.5} />
              {/* Mini attention + FFN inside */}
              <rect x={sx + 12} y={sy + 8} width={160} height={28} rx={6}
                fill={BBG.tealLight} stroke={BBG.teal} strokeWidth={1} />
              <text x={sx + 92} y={sy + 26} textAnchor="middle" fill={BBG.teal}
                fontSize={12} fontWeight={600}>Attention</text>
              <rect x={sx + 184} y={sy + 8} width={120} height={28} rx={6}
                fill={BBG.purpleLight} stroke={BBG.purple} strokeWidth={1} />
              <text x={sx + 244} y={sy + 26} textAnchor="middle" fill={BBG.purple}
                fontSize={12} fontWeight={600}>FFN</text>
              {label && (
                <text x={sx + 420} y={sy + 28} fill={BBG.mid}
                  fontSize={FONT_SIZE.sm} fontWeight={500}>{label}</text>
              )}
            </g>
          );
        })}
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Each block refines the representation further
        </text>
      </g>
    </g>
  );
};
