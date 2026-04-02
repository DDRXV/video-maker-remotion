import React, { useId } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY } from '../design-system/tokens';
import { entranceSpring } from '../design-system/easing';

interface AnimatedCardProps {
  x: number; y: number; width: number; height: number; title?: string; enterAt?: number;
  fill?: string; strokeColor?: string; strokeWidth?: number; accentHeader?: boolean;
  clipContent?: boolean; shadow?: boolean; children?: React.ReactNode;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ x, y, width, height, title, enterAt = 0, fill = COLORS.cardFill, strokeColor = COLORS.mediumStroke, strokeWidth = 1.5, accentHeader = false, clipContent = true, shadow = true, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clipId = useId();
  const progress = entranceSpring(frame, fps, enterAt);
  const translateY = interpolate(progress, [0, 1], [20, 0]);
  const headerHeight = title ? 36 : 0;

  return (
    <g style={{ opacity: progress, transform: `translateY(${translateY}px)` }}>
      {clipContent && <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} rx={12} /></clipPath></defs>}
      {shadow && <rect x={x + 2} y={y + 3} width={width} height={height} rx={12} fill={COLORS.dark} fillOpacity={0.06} />}
      <rect x={x} y={y} width={width} height={height} rx={12} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} />
      {title && (<>
        <rect x={x} y={y} width={width} height={headerHeight} rx={12} fill={accentHeader ? strokeColor : COLORS.mediumStroke} fillOpacity={accentHeader ? 0.1 : 0.05} />
        <rect x={x} y={y + headerHeight - 12} width={width} height={12} fill={accentHeader ? strokeColor : COLORS.mediumStroke} fillOpacity={accentHeader ? 0.1 : 0.05} />
        <text x={x + 16} y={y + headerHeight / 2 + 1} dominantBaseline="central" fill={accentHeader ? strokeColor : COLORS.dark} fontSize={TYPOGRAPHY.badge.fontSize} fontFamily={TYPOGRAPHY.badge.fontFamily} fontWeight={TYPOGRAPHY.badge.fontWeight}>{title}</text>
      </>)}
      <g transform={`translate(${x}, ${y + headerHeight})`} clipPath={clipContent ? `url(#${clipId})` : undefined}>{children}</g>
    </g>
  );
};
