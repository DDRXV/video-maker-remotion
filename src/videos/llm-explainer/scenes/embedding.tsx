import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { FlowArrow } from '../../../components/FlowArrow';
import { BBG, useScene } from '../styles';

export const EmbeddingScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('embedding');

  const pTitle = progress('show-title');
  const pTokenToVec = progress('show-token-to-vector');
  const pDims = progress('show-dimensions');
  const pSimilar = progress('show-similar');
  const pDistant = progress('show-distant');
  const pSummary = progress('show-summary');

  // Dim early content when vector space appears
  const earlyDim = interpolate(pSimilar, [0, 1], [1, 0.2]);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={BBG.accent} fontSize={FONT_SIZE.md} fontWeight={700}>4</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Embedding Layer</text>
      </g>

      {/* Token → Vector transformation */}
      <g style={{ opacity: pTokenToVec * earlyDim }}>
        {/* Token chip */}
        <rect x={grid.x(0.08)} y={grid.y(0.28) - 28} width={120} height={56} rx={12}
          fill={BBG.blueLight} stroke={BBG.blue} strokeWidth={2} />
        <text x={grid.x(0.08) + 60} y={grid.y(0.28) + 4} textAnchor="middle" fill={BBG.blue}
          fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="monospace">King</text>

        <FlowArrow from={{ x: grid.x(0.08) + 130, y: grid.y(0.28) }}
          to={{ x: grid.x(0.35), y: grid.y(0.28) }}
          enterAt={beat('show-token-to-vector')} color={BBG.accent} strokeWidth={2} />

        {/* Vector representation */}
        <rect x={grid.x(0.35)} y={grid.y(0.22)} width={grid.x(0.55)} height={100} rx={12}
          fill={BBG.cardFill} stroke={BBG.accent} strokeWidth={1.5} />
        <text x={grid.x(0.37)} y={grid.y(0.22) + 30} fill={BBG.mid}
          fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.label.fontFamily}>Embedding vector</text>

        {/* Number cells */}
        {[0.283, -0.147, 0.891, 0.034, -0.562, '...', 0.718].map((n, i) => {
          const cellX = grid.x(0.37) + i * 90;
          const cellY = grid.y(0.22) + 44;
          const dp = entranceSpring(frame, fps, beat('show-token-to-vector') + 8 + i * 2);
          return (
            <g key={i} style={{ opacity: dp }}>
              <rect x={cellX} y={cellY} width={78} height={38} rx={6}
                fill={BBG.accentLight} stroke={BBG.hairline} strokeWidth={1} />
              <text x={cellX + 39} y={cellY + 24} textAnchor="middle" fill={BBG.dark}
                fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily="monospace">
                {typeof n === 'number' ? n.toFixed(3) : n}
              </text>
            </g>
          );
        })}
      </g>

      {/* Dimensions label */}
      <g style={{ opacity: pDims * earlyDim }}>
        <rect x={grid.x(0.35)} y={grid.y(0.22) + 100} width={160} height={36} rx={18}
          fill={BBG.purpleLight} stroke={BBG.purple} strokeWidth={1.5} />
        <text x={grid.x(0.35) + 80} y={grid.y(0.22) + 122} textAnchor="middle" fill={BBG.purple}
          fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>
          4,096 dimensions
        </text>
      </g>

      {/* Vector space visualization — similar/distant */}
      <g style={{ opacity: pSimilar }}>
        {/* Coordinate axes */}
        <line x1={grid.x(0.15)} y1={grid.y(0.85)} x2={grid.x(0.15)} y2={grid.y(0.35)}
          stroke={BBG.hairline} strokeWidth={2} />
        <line x1={grid.x(0.15)} y1={grid.y(0.85)} x2={grid.x(0.85)} y2={grid.y(0.85)}
          stroke={BBG.hairline} strokeWidth={2} />

        {/* King and Queen — close together */}
        {(() => {
          const kingX = grid.x(0.5);
          const kingY = grid.y(0.5);
          const queenX = grid.x(0.58);
          const queenY = grid.y(0.46);
          const kp = entranceSpring(frame, fps, beat('show-similar'));
          const qp = entranceSpring(frame, fps, beat('show-similar') + 6);

          return (
            <g>
              {/* Proximity indicator */}
              <g style={{ opacity: qp * 0.3 }}>
                <ellipse cx={(kingX + queenX) / 2} cy={(kingY + queenY) / 2} rx={80} ry={50}
                  fill={BBG.blue} fillOpacity={0.08} stroke={BBG.blue} strokeWidth={1} strokeDasharray="4 3" />
              </g>

              <g style={{ opacity: kp }}>
                <circle cx={kingX} cy={kingY} r={44} fill={BBG.blueLight} stroke={BBG.blue} strokeWidth={2.5} />
                <text x={kingX} y={kingY + 8} textAnchor="middle" fill={BBG.blue}
                  fontSize={FONT_SIZE.lg} fontWeight={700}>King</text>
              </g>
              <g style={{ opacity: qp }}>
                <circle cx={queenX} cy={queenY} r={44} fill={BBG.purpleLight} stroke={BBG.purple} strokeWidth={2.5} />
                <text x={queenX} y={queenY + 8} textAnchor="middle" fill={BBG.purple}
                  fontSize={FONT_SIZE.lg} fontWeight={700}>Queen</text>
              </g>
              <g style={{ opacity: qp }}>
                <text x={(kingX + queenX) / 2} y={(kingY + queenY) / 2 + 50} textAnchor="middle"
                  fill={BBG.green} fontSize={FONT_SIZE.sm} fontWeight={600}>Close!</text>
              </g>
            </g>
          );
        })()}

        {/* Banana — far away */}
        <g style={{ opacity: pDistant }}>
          {(() => {
            const bananaX = grid.x(0.2);
            const bananaY = grid.y(0.7);
            return (
              <g>
                <circle cx={bananaX} cy={bananaY} r={44} fill={BBG.orangeLight} stroke={BBG.orange} strokeWidth={2.5} />
                <text x={bananaX} y={bananaY + 8} textAnchor="middle" fill={BBG.orange}
                  fontSize={FONT_SIZE.lg} fontWeight={700}>Banana</text>
                {/* Distance line */}
                <line x1={grid.x(0.5)} y1={grid.y(0.5)} x2={bananaX + 48} y2={bananaY - 28}
                  stroke={BBG.red} strokeWidth={2} strokeDasharray="8 5" />
                <text x={grid.x(0.34)} y={grid.y(0.62)} textAnchor="middle"
                  fill={BBG.red} fontSize={FONT_SIZE.md} fontWeight={700}>Far apart</text>
              </g>
            );
          })()}
        </g>
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          From here on, everything is vector math
        </text>
      </g>
    </g>
  );
};
