import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS } from '../design-system/tokens';
import { entranceSpring } from '../design-system/easing';

interface FlowArrowProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  enterAt?: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  label?: string;
  curved?: boolean;
  /** Custom path override (for complex routes) */
  path?: string;
  /** Arrowhead style */
  arrowStyle?: 'open' | 'filled' | 'none';
  /** Curvature amount (0 = straight, positive = curve away from midpoint) */
  curvature?: number;
}

/**
 * Architectural-style flow arrow.
 *
 * Uses cubic bezier curves (not quadratic) for smooth, organic feel.
 * Arrowhead is an open chevron (like hand-drawn diagrams), not a filled triangle.
 * Even "straight" lines have a very subtle curve for warmth.
 */
export const FlowArrow: React.FC<FlowArrowProps> = ({
  from,
  to,
  enterAt = 0,
  color = COLORS.accent,
  strokeWidth = 1.8,
  dashed = false,
  label,
  curved = false,
  path: customPath,
  arrowStyle = 'open',
  curvature,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = entranceSpring(frame, fps, enterAt);

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Build the path
  let d: string;

  if (customPath) {
    d = customPath;
  } else if (curved || curvature) {
    // Cubic bezier — smooth architectural curve
    // Control points offset perpendicular to the line
    const curve = curvature ?? dist * 0.25;
    const perpAngle = angle - Math.PI / 2;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;

    // Two control points for a smooth S-like or arc curve
    const cp1x = from.x + dx * 0.3 + Math.cos(perpAngle) * curve;
    const cp1y = from.y + dy * 0.3 + Math.sin(perpAngle) * curve;
    const cp2x = from.x + dx * 0.7 + Math.cos(perpAngle) * curve;
    const cp2y = from.y + dy * 0.7 + Math.sin(perpAngle) * curve;

    d = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
  } else {
    // "Straight" but with a very subtle curve for organic feel
    const subtleCurve = dist * 0.03;
    const perpAngle = angle - Math.PI / 2;
    const cpx = (from.x + to.x) / 2 + Math.cos(perpAngle) * subtleCurve;
    const cpy = (from.y + to.y) / 2 + Math.sin(perpAngle) * subtleCurve;

    d = `M ${from.x} ${from.y} Q ${cpx} ${cpy} ${to.x} ${to.y}`;
  }

  // Estimate path length for dash animation
  const estimatedLength = dist * (curved ? 1.2 : 1.05);
  const offset = interpolate(progress, [0, 1], [estimatedLength, 0]);

  // Arrowhead — open chevron style (architectural drawing feel)
  // Slightly pulled back from the endpoint so the line doesn't overshoot
  const arrowLen = 10;
  const arrowAngle = Math.PI / 5; // 36° spread — wider and softer than 30°

  // Compute the actual arrival angle at the endpoint
  // For curved paths, use the last segment direction
  let arrivalAngle = angle;
  if (curved || curvature) {
    // Approximate by using the direction from the second control point to the end
    const curve = curvature ?? dist * 0.25;
    const perpA = angle - Math.PI / 2;
    const cp2x = from.x + dx * 0.7 + Math.cos(perpA) * curve;
    const cp2y = from.y + dy * 0.7 + Math.sin(perpA) * curve;
    arrivalAngle = Math.atan2(to.y - cp2y, to.x - cp2x);
  }

  const arrowP1 = {
    x: to.x - arrowLen * Math.cos(arrivalAngle - arrowAngle),
    y: to.y - arrowLen * Math.sin(arrivalAngle - arrowAngle),
  };
  const arrowP2 = {
    x: to.x - arrowLen * Math.cos(arrivalAngle + arrowAngle),
    y: to.y - arrowLen * Math.sin(arrivalAngle + arrowAngle),
  };

  return (
    <g>
      {/* Main path */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '6 4' : `${estimatedLength}`}
        strokeDashoffset={dashed ? 0 : offset}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: dashed ? progress * 0.6 : progress }}
      />

      {/* Arrowhead */}
      {arrowStyle !== 'none' && (
        arrowStyle === 'open' ? (
          // Open chevron — like a hand-drawn arrow
          <polyline
            points={`${arrowP1.x},${arrowP1.y} ${to.x},${to.y} ${arrowP2.x},${arrowP2.y}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: progress }}
          />
        ) : (
          // Filled — small, soft, rounded feel
          <path
            d={`M ${arrowP1.x} ${arrowP1.y} L ${to.x} ${to.y} L ${arrowP2.x} ${arrowP2.y}`}
            fill={color}
            fillOpacity={0.7}
            stroke="none"
            style={{ opacity: progress }}
          />
        )
      )}

      {/* Label — positioned along the curve, offset above */}
      {label && (
        <text
          x={(from.x + to.x) / 2}
          y={(from.y + to.y) / 2 - 14}
          textAnchor="middle"
          fill={COLORS.lightStroke}
          fontSize={13}
          fontFamily="Inter, sans-serif"
          fontWeight={500}
          style={{ opacity: progress * 0.8 }}
        >
          {label}
        </text>
      )}
    </g>
  );
};
