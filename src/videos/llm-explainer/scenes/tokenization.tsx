import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { FlowArrow } from '../../../components/FlowArrow';
import { BBG, useScene } from '../styles';

export const TokenizationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('tokenization');

  const pTitle = progress('show-title');
  const pInput = progress('show-input-text');
  const pSplit = progress('show-split');
  const pIds = progress('show-ids');
  const pOutput = progress('show-output');

  const tokens = [
    { text: 'Chat', color: BBG.accent },
    { text: 'G', color: BBG.purple },
    { text: 'PT', color: BBG.teal },
    { text: ' is', color: BBG.orange },
    { text: ' amazing', color: BBG.green },
  ];

  const tokenIds = [15496, 38, 2898, 318, 12243];

  const inputY = grid.y(0.22);
  const tokenY = grid.y(0.42);
  const idY = grid.y(0.62);

  // Dim previous rows
  const inputDim = interpolate(pIds, [0, 1], [1, 0.3]);
  const tokenDim = interpolate(pOutput, [0, 1], [1, 0.3]);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={BBG.accent} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>3</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Tokenization</text>
      </g>

      {/* Input text */}
      <g style={{ opacity: pInput * inputDim }}>
        <rect x={grid.x(0.1)} y={inputY - 28} width={grid.x(0.8)} height={56} rx={12}
          fill={BBG.cardFill} stroke={BBG.hairline} strokeWidth={2} />
        <text x={grid.x(0.14)} y={inputY + 6} fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={500} fontFamily={TYPOGRAPHY.body.fontFamily}>
          "ChatGPT is amazing"
        </text>
        <text x={grid.x(0.82)} y={inputY + 6} textAnchor="end" fill={BBG.light}
          fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.label.fontFamily}>
          Input text
        </text>
      </g>

      {/* Arrow down */}
      {pSplit > 0.1 && (
        <FlowArrow
          from={{ x: grid.center().x, y: inputY + 32 }}
          to={{ x: grid.center().x, y: tokenY - 40 }}
          enterAt={beat('show-split')}
          color={BBG.accent} strokeWidth={2}
        />
      )}

      {/* Token chips */}
      <g style={{ opacity: tokenDim }}>
        {tokens.map((t, i) => {
          const delay = beat('show-split') + i * 4;
          const tp = entranceSpring(frame, fps, delay);
          const chipW = Math.max(t.text.length * 20 + 32, 80);
          const startX = grid.x(0.1);
          const gap = 16;
          let xOff = 0;
          for (let j = 0; j < i; j++) {
            xOff += Math.max(tokens[j].text.length * 20 + 32, 80) + gap;
          }
          const cx = startX + xOff;
          const slideY = interpolate(tp, [0, 1], [-20, 0]);

          return (
            <g key={i} style={{ opacity: tp, transform: `translateY(${slideY}px)` }}>
              <rect x={cx} y={tokenY - 24} width={chipW} height={48} rx={10}
                fill={t.color} fillOpacity={0.1} stroke={t.color} strokeWidth={2} />
              <text x={cx + chipW / 2} y={tokenY + 4} textAnchor="middle" fill={t.color}
                fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="monospace">
                {t.text}
              </text>
            </g>
          );
        })}
      </g>

      {/* Arrow down to IDs */}
      {pIds > 0.1 && (
        <FlowArrow
          from={{ x: grid.center().x, y: tokenY + 30 }}
          to={{ x: grid.center().x, y: idY - 40 }}
          enterAt={beat('show-ids')}
          color={BBG.accent} strokeWidth={2}
        />
      )}

      {/* Token IDs */}
      {tokens.map((t, i) => {
        const delay = beat('show-ids') + i * 3;
        const ip = entranceSpring(frame, fps, delay);
        const chipW = 100;
        const gap = 16;
        const startX = grid.x(0.12);
        const cx = startX + i * (chipW + gap);

        return (
          <g key={`id-${i}`} style={{ opacity: ip }}>
            <rect x={cx} y={idY - 24} width={chipW} height={48} rx={10}
              fill={BBG.cardFill} stroke={BBG.mid} strokeWidth={1.5} />
            <text x={cx + chipW / 2} y={idY + 4} textAnchor="middle" fill={BBG.dark}
              fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="monospace">
              {tokenIds[i]}
            </text>
          </g>
        );
      })}

      {/* Output label */}
      <g style={{ opacity: pOutput }}>
        <text x={grid.center().x} y={grid.y(0.84)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Your prompt is now a list of integers
        </text>
        <text x={grid.center().x} y={grid.y(0.91)} textAnchor="middle" fill={BBG.light}
          fontSize={FONT_SIZE.md} fontFamily={TYPOGRAPHY.label.fontFamily}>
          ~100,000 token vocabulary
        </text>
      </g>
    </g>
  );
};
