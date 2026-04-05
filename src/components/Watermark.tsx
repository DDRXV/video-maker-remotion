import React from 'react';
import { staticFile } from 'remotion';
import { CANVAS } from '../design-system/tokens';

/**
 * Top-right branding — prominent like ByteByteGo.
 * Logo (80px) + "Rajesh P, Founder Codepup AI" in large text.
 */
export const Watermark: React.FC = () => {
  const logoSize = 80;
  const rightPad = 36;
  const topPad = 20;
  const logoX = CANVAS.width - rightPad - logoSize;
  const textX = logoX - 16;
  const cy = topPad + logoSize / 2;

  return (
    <g>
      {/* Text — right-aligned before logo */}
      <text
        x={textX}
        y={cy - 6}
        textAnchor="end"
        fill="#1c1917"
        fillOpacity={0.8}
        fontSize={24}
        fontWeight={600}
        fontFamily="Inter, sans-serif"
        letterSpacing={0.3}
      >
        Rajesh P, Founder
      </text>
      <text
        x={textX}
        y={cy + 24}
        textAnchor="end"
        fill="#C75B2A"
        fontSize={26}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
        letterSpacing={0.5}
      >
        Codepup AI
      </text>

      {/* Logo */}
      <image
        href={staticFile('codepup_logo_transparent.png')}
        x={logoX}
        y={topPad}
        width={logoSize}
        height={logoSize}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};
