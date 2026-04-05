import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../design-system/tokens';
import { entranceSpring } from '../design-system/easing';

interface LatencySegmentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  ms: string;
  color: string;
  bgColor: string;
  enterAt: number;
  frame: number;
  fps: number;
}

/**
 * A horizontal bar segment showing a latency budget allocation.
 * Animates its width from 0 on entrance.
 */
export const LatencySegment: React.FC<LatencySegmentProps> = ({
  x, y, width, height, label, ms, color, bgColor, enterAt, frame, fps,
}) => {
  const p = entranceSpring(frame, fps, enterAt);
  const animW = interpolate(p, [0, 1], [0, width]);

  return (
    <g style={{ opacity: p }}>
      {/* Background track */}
      <rect x={x} y={y} width={width} height={height} rx={8}
        fill={bgColor} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
      {/* Filled portion */}
      <rect x={x} y={y} width={animW} height={height} rx={8}
        fill={color} fillOpacity={0.2} stroke={color} strokeWidth={1.5} />
      {/* Label */}
      <text x={x + 16} y={y + height / 2 + 1} dominantBaseline="central"
        fill={color} fontSize={FONT_SIZE.md} fontWeight={600}>
        {label}
      </text>
      {/* Milliseconds */}
      <text x={x + width - 16} y={y + height / 2 + 1} dominantBaseline="central"
        textAnchor="end" fill={color} fontSize={FONT_SIZE.lg} fontWeight={700}>
        {ms}
      </text>
    </g>
  );
};
