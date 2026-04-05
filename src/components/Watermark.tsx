import React from 'react';
import { staticFile } from 'remotion';
import { CANVAS } from '../design-system/tokens';

/**
 * Top-right branding: Logo + "Rajesh P, Founder Codepup AI"
 * Prominent, full opacity, every frame. Like ByteByteGo.
 */
export const Watermark: React.FC = () => {
  const logoSize = 44;
  const rightPad = 40;
  const topPad = 28;
  const textX = CANVAS.width - rightPad - logoSize - 12;
  const logoX = CANVAS.width - rightPad - logoSize;
  const cy = topPad + logoSize / 2;

  return (
    <g>
      {/* Text — right-aligned before logo */}
      <text
        x={textX}
        y={cy - 4}
        textAnchor="end"
        fill="#1c1917"
        fillOpacity={0.7}
        fontSize={16}
        fontWeight={600}
        fontFamily="Inter, sans-serif"
        letterSpacing={0.3}
      >
        Rajesh P, Founder
      </text>
      <text
        x={textX}
        y={cy + 16}
        textAnchor="end"
        fill="#C75B2A"
        fillOpacity={0.8}
        fontSize={16}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
        letterSpacing={0.3}
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
        opacity={0.85}
      />
    </g>
  );
};
