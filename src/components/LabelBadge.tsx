import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, TYPOGRAPHY } from '../design-system/tokens';
import { entranceSpring } from '../design-system/easing';
import { measureText } from '../utils/text';

interface LabelBadgeProps { x: number; y: number; text: string; enterAt?: number; color?: string; filled?: boolean; minWidth?: number; }

export const LabelBadge: React.FC<LabelBadgeProps> = ({ x, y, text, enterAt = 0, color = COLORS.accent, filled = false, minWidth = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = entranceSpring(frame, fps, enterAt);
  const fontSize = TYPOGRAPHY.badge.fontSize;
  const textWidth = measureText(text, fontSize, TYPOGRAPHY.badge.fontWeight);
  const width = Math.max(textWidth + 28, minWidth);
  const height = fontSize + 12;

  return (
    <g style={{ opacity: progress }}>
      <rect x={x} y={y} width={width} height={height} rx={height / 2} fill={filled ? color : 'none'} fillOpacity={filled ? 0.1 : 0} stroke={color} strokeWidth={1} />
      <text x={x + width / 2} y={y + height / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={fontSize} fontFamily={TYPOGRAPHY.badge.fontFamily} fontWeight={TYPOGRAPHY.badge.fontWeight}>{text}</text>
    </g>
  );
};
