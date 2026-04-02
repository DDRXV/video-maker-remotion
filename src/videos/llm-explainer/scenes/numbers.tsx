import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { BBG, useScene } from '../styles';

const StatCard: React.FC<{
  x: number; y: number; number: string; label: string; color: string; bgColor: string;
  progress: number; frame: number; fps: number; delay: number;
}> = ({ x, y, number, label, color, bgColor, progress: p, frame, fps, delay }) => {
  const sp = entranceSpring(frame, fps, delay);
  const slideY = interpolate(sp, [0, 1], [30, 0]);
  const cardW = 380;
  const cardH = 140;
  return (
    <g style={{ opacity: sp, transform: `translateY(${slideY}px)` }}>
      <rect x={x} y={y} width={cardW} height={cardH} rx={14}
        fill={bgColor} stroke={color} strokeWidth={2} />
      <text x={x + cardW / 2} y={y + 58} textAnchor="middle" fill={color}
        fontSize={FONT_SIZE['3xl']} fontWeight={800} fontFamily={TYPOGRAPHY.heading.fontFamily}>
        {number}
      </text>
      <text x={x + cardW / 2} y={y + 100} textAnchor="middle" fill={BBG.mid}
        fontSize={FONT_SIZE.md} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>
        {label}
      </text>
    </g>
  );
};

export const NumbersScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('numbers');

  const pTitle = progress('show-title');
  const pPunchline = progress('show-punchline');

  // Dim stats when punchline arrives
  const statsDim = interpolate(pPunchline, [0, 1], [1, 0.25]);

  return (
    <g>
      {/* Section title */}
      <g style={{ opacity: pTitle }}>
        <rect x={grid.x(0.02)} y={grid.y(0.02)} width={12} height={40} rx={6} fill={BBG.accent} />
        <text x={grid.x(0.02) + 24} y={grid.y(0.02) + 30} fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Scale of LLMs
        </text>
      </g>

      {/* 3 stat cards in a grid */}
      <g style={{ opacity: statsDim }}>
        <StatCard x={grid.x(0.02)} y={grid.y(0.18)} number="1.8 Trillion" label="Parameters (GPT-4)"
          color={BBG.blue} bgColor={BBG.blueLight} progress={progress('show-params')}
          frame={frame} fps={fps} delay={beat('show-params')} />

        <StatCard x={grid.x(0.35)} y={grid.y(0.18)} number="13 Trillion" label="Training tokens (~10M books)"
          color={BBG.purple} bgColor={BBG.purpleLight} progress={progress('show-tokens')}
          frame={frame} fps={fps} delay={beat('show-tokens')} />

        <StatCard x={grid.x(0.68)} y={grid.y(0.18)} number="$100M+" label="Single training run cost"
          color={BBG.orange} bgColor={BBG.orangeLight} progress={progress('show-cost')}
          frame={frame} fps={fps} delay={beat('show-cost')} />
      </g>

      {/* Punchline card */}
      <g style={{ opacity: pPunchline }}>
        {(() => {
          const cx = grid.center().x;
          const cy = grid.y(0.52);
          return (
            <g>
              <rect x={cx - 320} y={cy - 50} width={640} height={100} rx={16}
                fill={BBG.cardFill} stroke={BBG.accent} strokeWidth={3} />
              <text x={cx} y={cy + 8} textAnchor="middle" fill={BBG.dark}
                fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
                It predicts the next word. That's it.
              </text>
            </g>
          );
        })()}
      </g>
    </g>
  );
};
