import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { FlowArrow } from '../../../components/FlowArrow';
import { BBG, useScene } from '../styles';

export const GenerationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('generation');

  const pTitle = progress('show-title');
  const pFinalVec = progress('show-final-vector');
  const pProbs = progress('show-probabilities');
  const pPick = progress('show-pick-token');
  const pLoop = progress('show-loop');
  const pKv = progress('show-kv-cache');
  const pSummary = progress('show-summary');

  const vecX = grid.x(0.06);
  const vecY = grid.y(0.2);
  const probX = grid.x(0.06);
  const probY = grid.y(0.48);

  // Dim early content
  const earlyDim = interpolate(pLoop, [0, 1], [1, 0.15]);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={BBG.accent} fontSize={FONT_SIZE.md} fontWeight={700}>7</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Generating Output</text>
      </g>

      {/* Final vector */}
      <g style={{ opacity: pFinalVec * earlyDim }}>
        <text x={vecX} y={vecY - 14} fill={BBG.mid} fontSize={FONT_SIZE.sm} fontWeight={600}>
          Final vector (last token position)
        </text>
        <rect x={vecX} y={vecY} width={grid.x(0.88)} height={52} rx={10}
          fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={1.5} />
        {Array.from({ length: 14 }).map((_, i) => {
          const cx = vecX + 16 + i * 80;
          const dp = entranceSpring(frame, fps, beat('show-final-vector') + i);
          return (
            <rect key={i} x={cx} y={vecY + 10} width={64} height={32} rx={4}
              fill={BBG.accent} fillOpacity={0.15 + Math.random() * 0.25}
              style={{ opacity: dp }} />
          );
        })}
      </g>

      {/* Arrow to probabilities */}
      {pProbs > 0.1 && (
        <FlowArrow from={{ x: grid.center().x, y: vecY + 56 }}
          to={{ x: grid.center().x, y: probY - 12 }}
          enterAt={beat('show-probabilities')} color={BBG.accent} strokeWidth={2} />
      )}

      {/* Probability distribution */}
      <g style={{ opacity: pProbs * earlyDim }}>
        <text x={probX} y={probY - 8} fill={BBG.mid} fontSize={FONT_SIZE.sm} fontWeight={600}>
          Probability over ~100,000 tokens
        </text>
        {/* Top token probabilities as bars */}
        {[
          { token: 'the', prob: 0.23 },
          { token: 'a', prob: 0.15 },
          { token: 'an', prob: 0.08 },
          { token: 'that', prob: 0.06 },
          { token: 'this', prob: 0.04 },
          { token: 'one', prob: 0.03 },
          { token: '...', prob: 0.01 },
        ].map((t, i) => {
          const barMaxW = 500;
          const barW = t.prob * barMaxW / 0.23;
          const by = probY + 8 + i * 38;
          const bp = entranceSpring(frame, fps, beat('show-probabilities') + 4 + i * 2);
          const isTop = i === 0;
          const barAnimW = interpolate(bp, [0, 1], [0, barW]);
          return (
            <g key={i} style={{ opacity: bp }}>
              <text x={probX + 60} y={by + 22} textAnchor="end" fill={BBG.dark}
                fontSize={FONT_SIZE.sm} fontWeight={isTop ? 700 : 400} fontFamily="monospace">
                {t.token}
              </text>
              <rect x={probX + 74} y={by + 4} width={barAnimW} height={26} rx={6}
                fill={isTop ? BBG.accent : BBG.accentLight}
                stroke={isTop ? BBG.accent : BBG.hairline} strokeWidth={isTop ? 2 : 1} />
              <text x={probX + 86 + barW} y={by + 22} fill={isTop ? BBG.accent : BBG.mid}
                fontSize={FONT_SIZE.xs} fontWeight={isTop ? 700 : 400}>
                {(t.prob * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}

        {/* Pick highlight */}
        <g style={{ opacity: pPick }}>
          <rect x={probX + 70} y={probY + 4} width={550} height={34} rx={8}
            fill="none" stroke={BBG.green} strokeWidth={2.5} strokeDasharray="6 3" />
          <text x={probX + 640} y={probY + 28} fill={BBG.green}
            fontSize={FONT_SIZE.sm} fontWeight={700}>← Selected!</text>
        </g>
      </g>

      {/* Autoregressive loop */}
      <g style={{ opacity: pLoop }}>
        <text x={grid.center().x} y={grid.y(0.14)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Autoregressive Generation
        </text>

        {/* Token sequence building up */}
        {(() => {
          const words = ['A', 'neural', 'network', 'learns', 'through', '_'];
          const seqY = grid.y(0.28);
          return words.map((w, i) => {
            const wp = entranceSpring(frame, fps, beat('show-loop') + i * 6);
            const wx = grid.x(0.08) + i * 140;
            const isActive = i === words.length - 1;
            return (
              <g key={i} style={{ opacity: wp }}>
                <rect x={wx} y={seqY} width={120} height={48} rx={10}
                  fill={isActive ? BBG.accentLight : BBG.cardFill}
                  stroke={isActive ? BBG.accent : BBG.hairline} strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={wx + 60} y={seqY + 30} textAnchor="middle" fill={isActive ? BBG.accent : BBG.dark}
                  fontSize={FONT_SIZE.md} fontWeight={isActive ? 700 : 500} fontFamily="monospace">
                  {isActive ? '???' : w}
                </text>
                {/* Arrow to next */}
                {i < words.length - 1 && (
                  <line x1={wx + 124} y1={seqY + 24} x2={wx + 136} y2={seqY + 24}
                    stroke={BBG.hairline} strokeWidth={1.5} />
                )}
              </g>
            );
          });
        })()}

        {/* Loop arrow */}
        {(() => {
          const lp = entranceSpring(frame, fps, beat('show-loop') + 30);
          const arrowPath = `M ${grid.x(0.82)} ${grid.y(0.28) + 48} C ${grid.x(0.85)} ${grid.y(0.45)}, ${grid.x(0.12)} ${grid.y(0.45)}, ${grid.x(0.08)} ${grid.y(0.28) + 48}`;
          const pathLen = 800;
          const offset = interpolate(lp, [0, 1], [pathLen, 0]);
          return (
            <g style={{ opacity: lp }}>
              <path d={arrowPath} fill="none" stroke={BBG.accent} strokeWidth={2}
                strokeDasharray={pathLen} strokeDashoffset={offset} strokeLinecap="round" />
              <text x={grid.center().x} y={grid.y(0.46)} textAnchor="middle" fill={BBG.accent}
                fontSize={FONT_SIZE.md} fontWeight={600}>
                Append token, repeat
              </text>
            </g>
          );
        })()}
      </g>

      {/* KV Cache */}
      <g style={{ opacity: pKv }}>
        <rect x={grid.x(0.2)} y={grid.y(0.56)} width={grid.x(0.6)} height={110} rx={14}
          fill={BBG.greenLight} stroke={BBG.green} strokeWidth={2} />
        <text x={grid.center().x} y={grid.y(0.56) + 32} textAnchor="middle" fill={BBG.green}
          fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          KV Cache
        </text>
        <text x={grid.center().x} y={grid.y(0.56) + 62} textAnchor="middle" fill={BBG.mid}
          fontSize={FONT_SIZE.md}>
          Stores intermediate attention results
        </text>
        <text x={grid.center().x} y={grid.y(0.56) + 88} textAnchor="middle" fill={BBG.mid}
          fontSize={FONT_SIZE.sm}>
          No recomputation from scratch — makes real-time chat possible
        </text>
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          500-word response = 500+ full pipeline runs
        </text>
      </g>
    </g>
  );
};

