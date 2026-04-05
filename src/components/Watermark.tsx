import React from 'react';
import { CANVAS } from '../design-system/tokens';

interface WatermarkProps {
  text?: string;
  opacity?: number;
  fontSize?: number;
}

export const Watermark: React.FC<WatermarkProps> = ({
  text = 'Rajesh Pentakota',
  opacity = 0.25,
  fontSize = 22,
}) => (
  <text
    x={CANVAS.width - 40}
    y={CANVAS.height - 32}
    textAnchor="end"
    fill="#1e293b"
    fillOpacity={opacity}
    fontSize={fontSize}
    fontWeight={600}
    fontFamily="Inter, sans-serif"
    letterSpacing={0.5}
  >
    {text}
  </text>
);
