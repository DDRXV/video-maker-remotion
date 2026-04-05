import React from 'react';
import { interpolate } from 'remotion';
import { entranceSpring } from '../design-system/easing';

interface WaveformBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  enterAt: number;
  frame: number;
  fps: number;
  barCount?: number;
  active?: boolean;
  opacity?: number;
}

/**
 * Animated waveform visualization. Each bar oscillates at a unique
 * frequency derived from its index, giving an organic audio feel.
 */
export const WaveformBar: React.FC<WaveformBarProps> = ({
  x, y, width, height, color, enterAt, frame, fps,
  barCount = 24, active = true, opacity: baseOp = 1,
}) => {
  const p = entranceSpring(frame, fps, enterAt);
  const barW = Math.max(2, (width / barCount) * 0.6);
  const gap = width / barCount;

  return (
    <g style={{ opacity: p * baseOp }}>
      {Array.from({ length: barCount }, (_, i) => {
        // Each bar gets a unique phase and frequency
        const phase = i * 1.7 + i * i * 0.3;
        const freq1 = 0.08 + (i % 5) * 0.02;
        const freq2 = 0.13 + (i % 3) * 0.03;
        const raw = active
          ? (Math.sin(frame * freq1 + phase) * 0.4 +
             Math.sin(frame * freq2 + phase * 0.7) * 0.3 +
             0.3)
          : 0.08;
        const barH = interpolate(raw, [0, 1], [height * 0.05, height]);
        const bx = x + i * gap;
        const by = y + (height - barH) / 2;
        return (
          <rect
            key={i}
            x={bx}
            y={by}
            width={barW}
            height={barH}
            rx={barW / 2}
            fill={color}
            fillOpacity={0.8}
          />
        );
      })}
    </g>
  );
};
