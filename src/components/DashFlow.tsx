import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS } from '../design-system/tokens';
import { entranceSpring } from '../design-system/easing';

interface DashFlowProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  enterAt?: number;
  active?: boolean;
  color?: string;
  strokeWidth?: number;
  speed?: number;
  /** Custom SVG path. If omitted, auto-generates a subtle curve. */
  path?: string;
  /** Curvature amount. 0 = nearly straight, positive = arc outward */
  curvature?: number;
}

/**
 * Animated flowing dashes along a path.
 * Now uses subtle bezier curves by default for organic architectural feel.
 */
export const DashFlow: React.FC<DashFlowProps> = ({
  from,
  to,
  enterAt = 0,
  active = true,
  color = COLORS.accent,
  strokeWidth = 1.8,
  speed = 30,
  path: customPath,
  curvature,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entranceProgress = entranceSpring(frame, fps, enterAt);
  const flowOffset = active ? interpolate(frame % speed, [0, speed], [14, 0]) : 0;

  // Build path — subtle curve for organic feel
  let d: string;
  if (customPath) {
    d = customPath;
  } else {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const perpAngle = angle - Math.PI / 2;
    const curve = curvature ?? dist * 0.04;

    const cpx = (from.x + to.x) / 2 + Math.cos(perpAngle) * curve;
    const cpy = (from.y + to.y) / 2 + Math.sin(perpAngle) * curve;

    d = `M ${from.x} ${from.y} Q ${cpx} ${cpy} ${to.x} ${to.y}`;
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray="6 5"
      strokeDashoffset={flowOffset}
      strokeLinecap="round"
      style={{ opacity: entranceProgress * 0.55 }}
    />
  );
};
