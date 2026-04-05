/**
 * Ambient animation components — pulsing rings, dashed orbits, traveling dots.
 * All frame-driven (no CSS/SVG animate).
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';

/** Pulsing ring — expanding/fading circle on active elements */
export const PulseRing: React.FC<{
  cx: number; cy: number; r: number; color: string;
  active: boolean; cycle?: number;
}> = ({ cx, cy, r, color, active, cycle = 50 }) => {
  const frame = useCurrentFrame();
  if (!active) return null;
  const t = (frame % cycle) / cycle;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + t * 24} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={(1 - t) * 0.25} />
      <circle cx={cx} cy={cy} r={r + ((t + 0.4) % 1) * 24} fill="none" stroke={color} strokeWidth={1} strokeOpacity={(1 - ((t + 0.4) % 1)) * 0.15} />
    </g>
  );
};

/** Rotating dashed orbit ring — structural guide layer */
export const DashedOrbit: React.FC<{
  cx: number; cy: number; r: number; color: string;
  opacity?: number; speed?: number;
}> = ({ cx, cy, r, color, opacity = 0.12, speed = 0.5 }) => {
  const frame = useCurrentFrame();
  const rot = (frame * speed) % 360;
  return (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.2}
      strokeDasharray="14 10" strokeOpacity={opacity}
      style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px` }} />
  );
};

/** Glow halo — soft background behind active elements */
export const GlowHalo: React.FC<{
  x: number; y: number; w: number; h: number;
  color: string; rx?: number; opacity?: number;
}> = ({ x, y, w, h, color, rx = 16, opacity = 0.04 }) => (
  <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={rx} fill={color} fillOpacity={opacity} />
);

/** Traveling dot on a flow arrow */
export const TravelingDot: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color?: string; cycle?: number; r?: number;
}> = ({ x1, y1, x2, y2, color = '#C75B2A', cycle = 45, r = 4 }) => {
  const frame = useCurrentFrame();
  const t = (frame % cycle) / cycle;
  return (
    <circle
      cx={x1 + (x2 - x1) * t}
      cy={y1 + (y2 - y1) * t}
      r={r} fill={color} fillOpacity={0.7}
    />
  );
};
