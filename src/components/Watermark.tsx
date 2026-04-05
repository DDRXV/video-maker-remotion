import React from 'react';
import { CANVAS } from '../design-system/tokens';

/**
 * Top-right branding — text only, prominent like ByteByteGo.
 */
export const Watermark: React.FC = () => {
  const rightPad = 40;
  const topPad = 32;

  return (
    <g>
      <text
        x={CANVAS.width - rightPad}
        y={topPad}
        textAnchor="end"
        fill="#1c1917"
        fillOpacity={0.75}
        fontSize={22}
        fontWeight={600}
        fontFamily="Inter, sans-serif"
        letterSpacing={0.3}
      >
        Rajesh P, Founder
      </text>
      <text
        x={CANVAS.width - rightPad}
        y={topPad + 28}
        textAnchor="end"
        fill="#C75B2A"
        fontSize={24}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
        letterSpacing={0.5}
      >
        Codepup AI
      </text>
    </g>
  );
};
