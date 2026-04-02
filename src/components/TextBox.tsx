import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, TYPOGRAPHY } from '../design-system/tokens';
import { entranceSpring } from '../design-system/easing';
import { wrapText } from '../utils/text';

interface TextBoxProps {
  x: number; y: number; children: string; maxWidth: number;
  fontSize?: number; fontWeight?: number; fontFamily?: string; lineHeight?: number;
  color?: string; enterAt?: number; align?: 'left' | 'center' | 'right';
}

export const TextBox: React.FC<TextBoxProps> = ({ x, y, children, maxWidth, fontSize = TYPOGRAPHY.body.fontSize, fontWeight = TYPOGRAPHY.body.fontWeight, fontFamily = TYPOGRAPHY.body.fontFamily, lineHeight = 1.4, color = COLORS.dark, enterAt, align = 'left' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = wrapText(children, maxWidth, fontSize, fontWeight);
  const lineSpacing = fontSize * lineHeight;
  const opacity = enterAt !== undefined ? entranceSpring(frame, fps, enterAt) : 1;
  const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';
  const tx = align === 'center' ? x + maxWidth / 2 : align === 'right' ? x + maxWidth : x;

  return (
    <text x={tx} y={y + fontSize} textAnchor={anchor} fill={color} fontSize={fontSize} fontWeight={fontWeight} fontFamily={fontFamily} style={{ opacity }}>
      {lines.map((line, i) => <tspan key={i} x={tx} dy={i === 0 ? 0 : lineSpacing}>{line}</tspan>)}
    </text>
  );
};
