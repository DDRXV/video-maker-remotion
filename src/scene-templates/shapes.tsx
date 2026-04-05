/**
 * Purpose-built shapes — every shape looks like what it represents.
 * NO GENERIC CIRCLES. Each shape shows internal content.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { entranceSpring } from '../design-system/easing';

/** Document page with corner fold and visible text lines */
export const DocumentPage: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; textLines: string[];
  strokeColor?: string; enterAt?: number;
}> = ({ x, y, w, h, title, textLines, strokeColor = '#C75B2A', enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterAt ? entranceSpring(frame, fps, enterAt) : 1;
  const ty = interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
  const fold = Math.min(16, w * 0.08);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x + 2} y={y + 2} width={w} height={h} rx={6} fill="#1c1917" fillOpacity={0.04} />
      <path d={`M ${x} ${y + 4} Q ${x} ${y} ${x + 4} ${y} L ${x + w - fold} ${y} L ${x + w} ${y + fold} L ${x + w} ${y + h - 4} Q ${x + w} ${y + h} ${x + w - 4} ${y + h} L ${x + 4} ${y + h} Q ${x} ${y + h} ${x} ${y + h - 4} Z`}
        fill="#FFFFFF" stroke={strokeColor} strokeWidth={1.5} strokeOpacity={0.5} />
      <path d={`M ${x + w - fold} ${y} L ${x + w - fold} ${y + fold} L ${x + w} ${y + fold}`} fill={strokeColor} fillOpacity={0.06} stroke={strokeColor} strokeWidth={1} strokeOpacity={0.2} />
      <text x={x + 10} y={y + 18} fill="#1c1917" fontSize={Math.min(14, w * 0.07)} fontWeight={700} fontFamily="Inter, sans-serif">{title}</text>
      <line x1={x + 8} y1={y + 24} x2={x + w - 8} y2={y + 24} stroke="#d6d3d1" strokeWidth={0.8} />
      {textLines.map((line, i) => (
        <text key={i} x={x + 10} y={y + 36 + i * 14} fill={line ? '#78716c' : 'transparent'} fontSize={Math.min(11, w * 0.06)} fontFamily="Inter, sans-serif">{line}</text>
      ))}
    </g>
  );
};

/** Database cylinder with visible data rows */
export const DBCylinder: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; rows?: { key: string; value: string }[];
  highlightRow?: number; color?: string; enterAt?: number;
}> = ({ x, y, w, h, label, rows = [], highlightRow, color = '#2563eb', enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterAt ? entranceSpring(frame, fps, enterAt) : 1;
  const ty = interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
  const cx = x + w / 2;
  const ry = Math.min(12, h * 0.06);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <ellipse cx={cx} cy={y + ry} rx={w / 2} ry={ry} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
      <rect x={x} y={y + ry} width={w} height={h - ry * 2} fill="#FFFFFF" />
      <line x1={x} y1={y + ry} x2={x} y2={y + h - ry} stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
      <line x1={x + w} y1={y + ry} x2={x + w} y2={y + h - ry} stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
      <ellipse cx={cx} cy={y + h - ry} rx={w / 2} ry={ry} fill={color} fillOpacity={0.04} stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
      {rows.map((row, i) => {
        const rowY = y + ry + 12 + i * Math.min(20, (h - ry * 2 - 24) / rows.length);
        const isHL = highlightRow === i;
        return (
          <g key={i}>
            {isHL && <rect x={x + 4} y={rowY - 2} width={w - 8} height={14} rx={3} fill="#16a34a" fillOpacity={0.1} />}
            <text x={x + 8} y={rowY + 8} fill={isHL ? '#16a34a' : '#78716c'} fontSize={10} fontFamily="monospace" fontWeight={isHL ? 600 : 400}>{row.key}</text>
            <text x={x + w / 2} y={rowY + 8} fill={isHL ? '#16a34a' : '#a8a29e'} fontSize={10} fontFamily="monospace">{row.value}</text>
          </g>
        );
      })}
      <text x={cx} y={y + h + 14} textAnchor="middle" fill={color} fontSize={12} fontWeight={600} fontFamily="Inter, sans-serif">{label}</text>
    </g>
  );
};

/** Transformer block — shows input→output transformation */
export const TransformerBlock: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; inputLabel: string; outputLabel: string;
  color?: string; enterAt?: number;
}> = ({ x, y, w, h, label, inputLabel, outputLabel, color = '#7c3aed', enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterAt ? entranceSpring(frame, fps, enterAt) : 1;
  const ty = interpolate(p, [0, 1], [10, 0], { extrapolateRight: 'clamp' });
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#FFFFFF" stroke={color} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={6} rx={3} fill={color} fillOpacity={0.2} />
      <text x={x + w / 2} y={y + 24} textAnchor="middle" fill={color} fontSize={14} fontWeight={700} letterSpacing={0.5}>{label}</text>
      <text x={x + 14} y={y + 48} fill="#78716c" fontSize={12} fontWeight={600}>INPUT</text>
      <text x={x + 14} y={y + 66} fill="#57534e" fontSize={11} fontFamily="monospace">{inputLabel}</text>
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill={color} fontSize={20} fillOpacity={0.4}>→</text>
      <text x={x + w / 2 + 14} y={y + 48} fill="#78716c" fontSize={12} fontWeight={600}>OUTPUT</text>
      <text x={x + w / 2 + 14} y={y + 66} fill={color} fontSize={11} fontFamily="monospace">{outputLabel}</text>
    </g>
  );
};

/** Chat bubble with user avatar */
export const ChatBubbleShape: React.FC<{
  x: number; y: number; w: number; h: number;
  text: string; senderLabel?: string; enterAt?: number;
}> = ({ x, y, w, h, text, senderLabel = 'User', enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterAt ? entranceSpring(frame, fps, enterAt) : 1;
  const ty = interpolate(p, [0, 1], [10, 0], { extrapolateRight: 'clamp' });
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#FFFFFF" stroke="#d6d3d1" strokeWidth={1.2} />
      <polygon points={`${x + 16},${y + h} ${x + 10},${y + h + 10} ${x + 26},${y + h}`} fill="#FFFFFF" stroke="#d6d3d1" strokeWidth={1} />
      <circle cx={x + 20} cy={y + 18} r={10} fill="#dbeafe" stroke="#2563eb" strokeWidth={0.8} strokeOpacity={0.3} />
      <text x={x + 20} y={y + 19} textAnchor="middle" dominantBaseline="central" fill="#2563eb" fontSize={10} fontWeight={700}>U</text>
      <text x={x + 36} y={y + 20} fill="#57534e" fontSize={12} fontWeight={600}>{senderLabel}</text>
      <text x={x + 14} y={y + 42} fill="#1c1917" fontSize={16} fontWeight={500}>{text}</text>
    </g>
  );
};

/** Code block with dark background and line numbers */
export const CodeBlock: React.FC<{
  x: number; y: number; w: number;
  lines: string[]; enterAt?: number;
}> = ({ x, y, w, lines, enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterAt ? entranceSpring(frame, fps, enterAt) : 1;
  const lineH = 20;
  const padY = 10;
  const h = lines.length * lineH + padY * 2;
  return (
    <g style={{ opacity: p }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#1e293b" />
      <rect x={x} y={y} width={28} height={h} rx={6} fill="#0f172a" />
      <rect x={x + 22} y={y} width={6} height={h} fill="#0f172a" />
      {lines.map((line, i) => (
        <g key={i}>
          <text x={x + 14} y={y + padY + i * lineH + 14} textAnchor="middle" fill="#475569" fontSize={11} fontFamily="monospace">{i + 1}</text>
          <text x={x + 36} y={y + padY + i * lineH + 14} fill="#e2e8f0" fontSize={12} fontFamily="monospace">{line}</text>
        </g>
      ))}
    </g>
  );
};

/** Chunk card — numbered text fragment */
export const ChunkCard: React.FC<{
  x: number; y: number; w: number; h: number;
  num: number; text: string; highlighted?: boolean; enterAt?: number;
}> = ({ x, y, w, h, num, text, highlighted, enterAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = enterAt ? entranceSpring(frame, fps, enterAt) : 1;
  const tx = interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
  return (
    <g style={{ opacity: p, transform: `translateX(${tx}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={highlighted ? '#dcfce7' : '#FFFFFF'} stroke={highlighted ? '#16a34a' : '#d6d3d1'} strokeWidth={highlighted ? 1.5 : 1} />
      <rect x={x} y={y} width={24} height={h} rx={6} fill={highlighted ? '#16a34a' : '#a8a29e'} fillOpacity={0.08} />
      <rect x={x + 18} y={y} width={6} height={h} fill={highlighted ? '#16a34a' : '#a8a29e'} fillOpacity={0.08} />
      <text x={x + 12} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={highlighted ? '#16a34a' : '#57534e'} fontSize={11} fontWeight={700}>{num}</text>
      <text x={x + 30} y={y + h / 2 + 1} dominantBaseline="central" fill="#57534e" fontSize={12}>{text}</text>
    </g>
  );
};
