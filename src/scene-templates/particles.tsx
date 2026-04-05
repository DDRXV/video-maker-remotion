/**
 * Floating background particles — ambient life layer.
 * Uses frame-based oscillation (no CSS animations).
 * Opacity 0.08-0.15 for subtle depth.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { grid } from '../utils/layout';

const oscillate = (frame: number, cycle: number, amp: number, phase = 0) =>
  Math.sin(((frame + phase) / cycle) * Math.PI * 2) * amp;

interface ParticleConfig {
  /** Fractional x position (0-1) */
  x: number;
  /** Fractional y position (0-1) */
  y: number;
  /** Circle radius */
  r: number;
  /** Oscillation cycle in frames */
  cycle: number;
  /** X amplitude */
  ampX: number;
  /** Y amplitude */
  ampY: number;
  /** Phase offset */
  phase: number;
}

const DEFAULT_PARTICLES: ParticleConfig[] = [
  { x: 0.06, y: 0.1, r: 3, cycle: 130, ampX: 7, ampY: 9, phase: 0 },
  { x: 0.94, y: 0.08, r: 3.5, cycle: 160, ampX: -6, ampY: 8, phase: 25 },
  { x: 0.88, y: 0.88, r: 2.5, cycle: 110, ampX: 8, ampY: -7, phase: 55 },
  { x: 0.1, y: 0.82, r: 4, cycle: 145, ampX: -9, ampY: 6, phase: 80 },
  { x: 0.52, y: 0.04, r: 2.5, cycle: 120, ampX: 5, ampY: -10, phase: 40 },
];

interface FloatingParticlesProps {
  color?: string;
  baseOpacity?: number;
  particles?: ParticleConfig[];
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  color = '#C75B2A',
  baseOpacity = 0.1,
  particles = DEFAULT_PARTICLES,
}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={grid.x(p.x) + oscillate(frame, p.cycle, p.ampX, p.phase)}
          cy={grid.y(p.y) + oscillate(frame, p.cycle * 1.3, p.ampY, p.phase + 40)}
          r={p.r}
          fill={color}
          fillOpacity={baseOpacity + (i % 3) * 0.03}
        />
      ))}
    </g>
  );
};

export { oscillate };
