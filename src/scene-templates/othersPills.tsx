/**
 * "Also worth knowing" pill strip — shows alternative techniques.
 * Used at bottom of hero-technique scenes.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { entranceSpring } from '../design-system/easing';
import { FONT_SIZE, TYPOGRAPHY } from '../design-system/tokens';

interface OthersPillsProps {
  x: number;
  y: number;
  items: string[];
  color?: string;
  enterAt?: number;
}

export const OthersPills: React.FC<OthersPillsProps> = ({
  x, y, items, color = '#64748b', enterAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterAt ? entranceSpring(frame, fps, enterAt) : 1;
  let cx = x;

  return (
    <g style={{ opacity: p }}>
      <text x={cx} y={y + 13} fill="#64748b" fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>
        Also worth knowing:
      </text>
      {(() => { cx += 160; return null; })()}
      {items.map((item) => {
        const pw = item.length * 8 + 28;
        const px = cx;
        cx += pw + 10;
        return (
          <g key={item}>
            <rect x={px} y={y} width={pw} height={26} rx={13} fill={color} fillOpacity={0.06} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
            <text x={px + pw / 2} y={y + 14} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={12} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>{item}</text>
          </g>
        );
      })}
    </g>
  );
};
