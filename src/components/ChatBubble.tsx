import React from 'react';
import { FONT_SIZE } from '../design-system/tokens';
import { entranceSpring } from '../design-system/easing';

interface ChatBubbleProps {
  x: number;
  y: number;
  text: string;
  sender: 'left' | 'right';
  color: string;
  bgColor: string;
  enterAt: number;
  frame: number;
  fps: number;
  maxWidth?: number;
  fontSize?: number;
  label?: string;
  labelColor?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  x, y, text, sender, color, bgColor, enterAt, frame, fps,
  maxWidth = 520, fontSize = FONT_SIZE.md, label, labelColor,
}) => {
  const p = entranceSpring(frame, fps, enterAt);
  const slideX = sender === 'right' ? 20 * (1 - p) : -20 * (1 - p);

  // Estimate line wrapping
  const charW = fontSize * 0.52;
  const usableW = maxWidth - 40;
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const test = current ? `${current} ${w}` : w;
    if (test.length * charW > usableW && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const lineH = fontSize * 1.5;
  const padY = 16;
  const padX = 20;
  const bubbleH = lines.length * lineH + padY * 2;
  const bubbleW = Math.min(maxWidth, Math.max(...lines.map(l => l.length * charW)) + padX * 2);

  const bx = sender === 'right' ? x - bubbleW : x;

  return (
    <g style={{ opacity: p, transform: `translateX(${slideX}px)` }}>
      {label && (
        <text
          x={sender === 'right' ? bx + bubbleW : bx}
          y={y - 8}
          textAnchor={sender === 'right' ? 'end' : 'start'}
          fill={labelColor || color}
          fontSize={FONT_SIZE.xs}
          fontWeight={600}
        >
          {label}
        </text>
      )}
      <rect
        x={bx} y={y}
        width={bubbleW} height={bubbleH}
        rx={14}
        fill={bgColor}
        stroke={color}
        strokeWidth={1.5}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={bx + padX}
          y={y + padY + i * lineH + fontSize * 0.38}
          fill={color === '#ffffff' ? '#ffffff' : '#1e293b'}
          fontSize={fontSize}
          fontWeight={400}
          fontFamily="Inter, sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
};
