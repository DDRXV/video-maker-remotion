import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { BBG, useScene } from '../styles';

export const AttentionScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('attention');

  const pTitle = progress('show-title');
  const pQkv = progress('show-qkv');
  const pQueryKey = progress('show-query-key');
  const pScores = progress('show-scores');
  const pWeightedSum = progress('show-weighted-sum');
  const pMultihead = progress('show-multihead');
  const pSummary = progress('show-summary');

  // Dim QKV diagram when multihead appears
  const qkvDim = interpolate(pMultihead, [0, 1], [1, 0.15]);

  const tokenLabels = ['The', 'cat', 'sat', 'on', 'it'];
  const tokenStartX = grid.x(0.06);
  const tokenGap = 160;

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={BBG.accent} fontSize={FONT_SIZE.md} fontWeight={700}>6</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Attention In Detail</text>
      </g>

      {/* QKV Transform */}
      <g style={{ opacity: pQkv * qkvDim }}>
        {/* Token row */}
        {tokenLabels.map((t, i) => {
          const tx = tokenStartX + i * tokenGap;
          const ty = grid.y(0.16);
          const tp = entranceSpring(frame, fps, beat('show-qkv') + i * 3);
          return (
            <g key={t} style={{ opacity: tp }}>
              <rect x={tx} y={ty} width={100} height={42} rx={8}
                fill={BBG.cardFill} stroke={BBG.hairline} strokeWidth={2} />
              <text x={tx + 50} y={ty + 28} textAnchor="middle" fill={BBG.dark}
                fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="monospace">{t}</text>
            </g>
          );
        })}

        {/* Q, K, V columns for each token */}
        {['Q', 'K', 'V'].map((label, vi) => {
          const colors = [BBG.accent, BBG.teal, BBG.green];
          const bgColors = [BBG.accentLight, BBG.tealLight, BBG.greenLight];
          const descriptions = ['What am I looking for?', 'What do I advertise?', 'What do I contain?'];
          const color = colors[vi];
          const bgColor = bgColors[vi];
          const rowY = grid.y(0.32) + vi * 72;
          const lp = entranceSpring(frame, fps, beat('show-qkv') + 15 + vi * 8);

          return (
            <g key={label} style={{ opacity: lp }}>
              {/* Label */}
              <rect x={tokenStartX - 90} y={rowY} width={70} height={42} rx={8}
                fill={bgColor} stroke={color} strokeWidth={2} />
              <text x={tokenStartX - 55} y={rowY + 28} textAnchor="middle" fill={color}
                fontSize={FONT_SIZE.lg} fontWeight={700}>{label}</text>

              {/* Description */}
              <text x={tokenStartX + 5 * tokenGap + 20} y={rowY + 28} fill={BBG.mid}
                fontSize={FONT_SIZE.sm} fontStyle="italic" fontFamily={TYPOGRAPHY.body.fontFamily}>
                {descriptions[vi]}
              </text>

              {/* Vector boxes per token */}
              {tokenLabels.map((_, ti) => {
                const bx = tokenStartX + ti * tokenGap;
                const dp = entranceSpring(frame, fps, beat('show-qkv') + 18 + vi * 8 + ti * 2);
                return (
                  <g key={ti} style={{ opacity: dp }}>
                    <rect x={bx} y={rowY} width={100} height={42} rx={6}
                      fill={bgColor} fillOpacity={0.4} stroke={color} strokeWidth={1} />
                    <rect x={bx + 8} y={rowY + 12} width={30} height={8} rx={2} fill={color} fillOpacity={0.3} />
                    <rect x={bx + 44} y={rowY + 12} width={20} height={8} rx={2} fill={color} fillOpacity={0.2} />
                    <rect x={bx + 8} y={rowY + 24} width={45} height={8} rx={2} fill={color} fillOpacity={0.25} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>

      {/* Attention scores — "it" attends to "cat" */}
      <g style={{ opacity: pScores * qkvDim }}>
        {(() => {
          const itIdx = 4;
          const itX = tokenStartX + itIdx * tokenGap + 50;
          const itY = grid.y(0.7);
          const weights = [0.05, 0.62, 0.18, 0.03, 0.12];

          return (
            <g>
              <text x={grid.x(0.06)} y={itY - 20} fill={BBG.dark}
                fontSize={FONT_SIZE.md} fontWeight={600}>
                "it" attention scores:
              </text>
              {tokenLabels.map((t, i) => {
                const bx = tokenStartX + i * tokenGap;
                const w = weights[i];
                const barH = w * 100;
                const sp = entranceSpring(frame, fps, beat('show-scores') + i * 3);
                const isHighest = i === 1;
                return (
                  <g key={t} style={{ opacity: sp }}>
                    <rect x={bx + 10} y={itY + 60 - barH} width={80} height={barH} rx={4}
                      fill={isHighest ? BBG.accent : BBG.accentLight}
                      stroke={isHighest ? BBG.accent : BBG.hairline} strokeWidth={isHighest ? 2 : 1} />
                    <text x={bx + 50} y={itY + 76} textAnchor="middle" fill={BBG.dark}
                      fontSize={FONT_SIZE.xs} fontWeight={500}>{t}</text>
                    <text x={bx + 50} y={itY + 55 - barH} textAnchor="middle" fill={isHighest ? BBG.accent : BBG.mid}
                      fontSize={FONT_SIZE.xs} fontWeight={isHighest ? 700 : 400}>{w.toFixed(2)}</text>
                  </g>
                );
              })}
              {/* Highlight connection */}
              <text x={tokenStartX + 1 * tokenGap + 50} y={itY - 50} textAnchor="middle"
                fill={BBG.accent} fontSize={FONT_SIZE.sm} fontWeight={700}>
                "it" refers to "the cat"
              </text>
            </g>
          );
        })()}
      </g>

      {/* Multi-head visualization */}
      <g style={{ opacity: pMultihead }}>
        <text x={grid.center().x} y={grid.y(0.12)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Multi-Head Attention
        </text>
        <text x={grid.center().x} y={grid.y(0.19)} textAnchor="middle" fill={BBG.mid}
          fontSize={FONT_SIZE.md}>
          Multiple attention heads run in parallel
        </text>

        {/* Head cards */}
        {[
          { label: 'Head 1', focus: 'Grammar', color: BBG.accent },
          { label: 'Head 2', focus: 'Meaning', color: BBG.purple },
          { label: 'Head 3', focus: 'Position', color: BBG.teal },
          { label: 'Head 4', focus: 'Coreference', color: BBG.orange },
        ].map((h, i) => {
          const hx = grid.x(0.06) + i * 240;
          const hy = grid.y(0.3);
          const hp = entranceSpring(frame, fps, beat('show-multihead') + i * 5);
          const slideY = interpolate(hp, [0, 1], [20, 0]);
          return (
            <g key={h.label} style={{ opacity: hp, transform: `translateY(${slideY}px)` }}>
              <rect x={hx} y={hy} width={210} height={320} rx={14}
                fill={BBG.cardFill} stroke={h.color} strokeWidth={2} />
              <rect x={hx} y={hy} width={210} height={50} rx={14} fill={h.color} fillOpacity={0.1} />
              <rect x={hx} y={hy + 36} width={210} height={14} fill={BBG.cardFill} />
              <text x={hx + 105} y={hy + 32} textAnchor="middle" fill={h.color}
                fontSize={FONT_SIZE.md} fontWeight={700}>{h.label}</text>
              <text x={hx + 105} y={hy + 70} textAnchor="middle" fill={BBG.mid}
                fontSize={FONT_SIZE.sm} fontWeight={500}>Learns: {h.focus}</text>
              {/* Mini attention heatmap */}
              {Array.from({ length: 16 }).map((_, ci) => {
                const col = ci % 4;
                const row = Math.floor(ci / 4);
                const opacity = Math.random() * 0.6 + 0.1;
                return (
                  <rect key={ci} x={hx + 30 + col * 38} y={hy + 100 + row * 38}
                    width={32} height={32} rx={4}
                    fill={h.color} fillOpacity={opacity} />
                );
              })}
            </g>
          );
        })}
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          This is the mechanism that gives LLMs context
        </text>
      </g>
    </g>
  );
};
