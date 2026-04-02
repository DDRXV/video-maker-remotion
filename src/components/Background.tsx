import React from 'react';
import { CANVAS, COLORS } from '../design-system/tokens';

export const Background: React.FC<{ pattern?: 'dots' | 'clean'; opacity?: number }> = ({ pattern = 'dots', opacity = 0.06 }) => {
  if (pattern === 'clean') return <rect x={0} y={0} width={CANVAS.width} height={CANVAS.height} fill={COLORS.background} />;
  const dots: React.ReactNode[] = [];
  for (let x = 32; x < CANVAS.width; x += 32)
    for (let y = 32; y < CANVAS.height; y += 32)
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill={COLORS.mediumStroke} fillOpacity={opacity} />);
  return <g>{dots}</g>;
};
