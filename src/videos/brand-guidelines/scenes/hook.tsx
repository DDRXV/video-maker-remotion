import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

/** Miniature wireframe of a generic AI-built app */
const GenericApp: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; opacity: number;
}> = ({ x, y, w, h, label, opacity }) => (
  <g style={{ opacity }}>
    <rect x={x} y={y} width={w} height={h} rx={14} fill={C.white} stroke={C.hairline} strokeWidth={2} />
    {/* Browser chrome */}
    <rect x={x} y={y} width={w} height={36} rx={14} fill="#f1f5f9" />
    <rect x={x} y={y + 36} width={w} height={1} fill={C.hairline} />
    <circle cx={x + 18} cy={y + 18} r={6} fill="#fca5a5" />
    <circle cx={x + 36} cy={y + 18} r={6} fill="#fde68a" />
    <circle cx={x + 54} cy={y + 18} r={6} fill="#86efac" />
    {/* Gradient hero - thick and visible */}
    <defs>
      <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <rect x={x + 12} y={y + 46} width={w - 24} height={h * 0.38} rx={8} fill={`url(#grad-${label})`} />
    {/* Hero text */}
    <rect x={x + w * 0.15} y={y + 66} width={w * 0.7} height={12} rx={6} fill="white" fillOpacity={0.9} />
    <rect x={x + w * 0.22} y={y + 88} width={w * 0.56} height={8} rx={4} fill="white" fillOpacity={0.5} />
    {/* Blue CTA button */}
    <rect x={x + w * 0.28} y={y + 108} width={w * 0.44} height={28} rx={14} fill="#0066FF" />
    <rect x={x + w * 0.36} y={y + 117} width={w * 0.28} height={8} rx={4} fill="white" fillOpacity={0.9} />
    {/* Card row */}
    {[0, 1, 2].map(i => {
      const cw = (w - 56) / 3;
      const cx = x + 14 + i * (cw + 14);
      const cy = y + h * 0.52;
      const ch = h * 0.3;
      return (
        <g key={i}>
          <rect x={cx} y={cy} width={cw} height={ch} rx={8} fill={C.white} stroke="#e2e8f0" strokeWidth={1.5} />
          <rect x={cx + 10} y={cy + 10} width={cw - 20} height={ch * 0.28} rx={4} fill="#f1f5f9" />
          <rect x={cx + 10} y={cy + ch * 0.38} width={cw * 0.65} height={6} rx={3} fill="#cbd5e1" />
          <rect x={cx + 10} y={cy + ch * 0.5} width={cw * 0.85} height={5} rx={2.5} fill="#e2e8f0" />
          <rect x={cx + 10} y={cy + ch * 0.6} width={cw * 0.5} height={5} rx={2.5} fill="#e2e8f0" />
          <rect x={cx + 10} y={cy + ch * 0.74} width={cw * 0.45} height={18} rx={9} fill="#0066FF" fillOpacity={0.8} />
        </g>
      );
    })}
    <text x={x + w / 2} y={y + h - 16} textAnchor="middle" fill={C.light} fontSize={FONT_SIZE.lg} fontFamily="Inter, sans-serif" fontWeight={500}>{label}</text>
  </g>
);

/** Codepup-branded app wireframe */
const BrandedApp: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; opacity: number;
}> = ({ x, y, w, h, label, opacity }) => (
  <g style={{ opacity }}>
    <rect x={x} y={y} width={w} height={h} rx={14} fill={C.cardFill} stroke={C.accent} strokeWidth={2} />
    <rect x={x} y={y} width={w} height={36} rx={14} fill={C.accentLight} />
    <rect x={x} y={y + 36} width={w} height={1} fill={C.hairline} />
    <circle cx={x + 18} cy={y + 18} r={6} fill={C.accent} fillOpacity={0.6} />
    <circle cx={x + 36} cy={y + 18} r={6} fill={C.accent} fillOpacity={0.3} />
    <circle cx={x + 54} cy={y + 18} r={6} fill={C.accent} fillOpacity={0.15} />
    {/* Clean hero */}
    <rect x={x + 12} y={y + 46} width={w - 24} height={h * 0.38} rx={8} fill={C.accentLight} />
    <rect x={x + w * 0.12} y={y + 66} width={w * 0.76} height={12} rx={6} fill={C.dark} />
    <rect x={x + w * 0.2} y={y + 88} width={w * 0.6} height={8} rx={4} fill={C.mid} fillOpacity={0.4} />
    <rect x={x + w * 0.28} y={y + 108} width={w * 0.44} height={28} rx={10} fill={C.accent} />
    <rect x={x + w * 0.36} y={y + 117} width={w * 0.28} height={8} rx={4} fill="white" fillOpacity={0.9} />
    {/* Branded cards */}
    {[0, 1, 2].map(i => {
      const cw = (w - 56) / 3;
      const cx = x + 14 + i * (cw + 14);
      const cy = y + h * 0.52;
      const ch = h * 0.3;
      return (
        <g key={i}>
          <rect x={cx} y={cy} width={cw} height={ch} rx={8} fill={C.white} stroke={C.accent} strokeWidth={1} strokeOpacity={0.3} />
          <rect x={cx + 10} y={cy + 10} width={cw - 20} height={ch * 0.28} rx={4} fill={C.accentLight} />
          <rect x={cx + 10} y={cy + ch * 0.38} width={cw * 0.65} height={6} rx={3} fill={C.accent} fillOpacity={0.5} />
          <rect x={cx + 10} y={cy + ch * 0.5} width={cw * 0.85} height={5} rx={2.5} fill={C.mid} fillOpacity={0.25} />
          <rect x={cx + 10} y={cy + ch * 0.6} width={cw * 0.5} height={5} rx={2.5} fill={C.mid} fillOpacity={0.15} />
          <rect x={cx + 10} y={cy + ch * 0.74} width={cw * 0.45} height={18} rx={6} fill={C.accent} fillOpacity={0.8} />
        </g>
      );
    })}
    <text x={x + w / 2} y={y + h - 16} textAnchor="middle" fill={C.accent} fontSize={FONT_SIZE.lg} fontFamily="Inter, sans-serif" fontWeight={600}>{label}</text>
  </g>
);

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');
  const pTitle = progress('show-title');
  const pApp1 = progress('show-app1');
  const pApp2 = progress('show-app2');
  const pApp3 = progress('show-app3');
  const pSameness = progress('show-sameness');
  const pCodepup = progress('show-codepup');
  const pConsistency = progress('show-consistency');
  const pTeaser = progress('show-teaser');

  const genericDim = interpolate(pCodepup, [0, 1], [1, 0.15]);
  const codepupDim = interpolate(pTeaser, [0, 1], [1, 0.25]);

  // Larger wireframes filling 75%+ of canvas
  const appW = 500;
  const appH = 460;
  const gap = 36;
  const totalW = appW * 3 + gap * 2;
  const startX = (1920 - totalW) / 2;
  const appY = grid.y(0.1);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle * genericDim }}>
        <text x={grid.center().x} y={grid.y(0.01)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['3xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Every AI Prototype Looks the Same
        </text>
      </g>

      {/* Three generic apps */}
      <GenericApp x={startX} y={appY} w={appW} h={appH} label="SaaS Dashboard" opacity={pApp1 * genericDim} />
      <GenericApp x={startX + appW + gap} y={appY} w={appW} h={appH} label="E-commerce App" opacity={pApp2 * genericDim} />
      <GenericApp x={startX + 2 * (appW + gap)} y={appY} w={appW} h={appH} label="Pet Food Startup" opacity={pApp3 * genericDim} />

      {/* "Same blue, same gradients" callout */}
      <g style={{ opacity: pSameness * genericDim }}>
        <line x1={startX + 30} y1={appY + appH + 20} x2={startX + totalW - 30} y2={appY + appH + 20}
          stroke={C.error} strokeWidth={3} strokeLinecap="round" />
        <text x={grid.center().x} y={appY + appH + 56} textAnchor="middle" fill={C.error}
          fontSize={FONT_SIZE['2xl']} fontWeight={600} fontFamily="Inter, sans-serif">
          Same gradients. Same blue buttons. Same layout.
        </text>
      </g>

      {/* Codepup branded apps */}
      {(() => {
        const slideY = interpolate(pCodepup, [0, 1], [50, 0]);
        return (
          <g style={{ opacity: pCodepup * codepupDim, transform: `translateY(${slideY}px)` }}>
            <text x={grid.center().x} y={grid.y(0.01)} textAnchor="middle" fill={C.accent}
              fontSize={FONT_SIZE['3xl']} fontWeight={700} fontFamily="Inter, sans-serif">
              My Apps All Look Like the Same Product
            </text>
            <BrandedApp x={startX} y={appY} w={appW} h={appH} label="codepup.ai" opacity={1} />
            <BrandedApp x={startX + appW + gap} y={appY} w={appW} h={appH} label="Dashboard" opacity={entranceSpring(frame, fps, beat('show-codepup') + 4)} />
            <BrandedApp x={startX + 2 * (appW + gap)} y={appY} w={appW} h={appH} label="Internal Tools" opacity={entranceSpring(frame, fps, beat('show-codepup') + 8)} />
          </g>
        );
      })()}

      {/* Consistency callout */}
      <g style={{ opacity: pConsistency * codepupDim }}>
        <line x1={startX + 30} y1={appY + appH + 20} x2={startX + totalW - 30} y2={appY + appH + 20}
          stroke={C.green} strokeWidth={3} strokeLinecap="round" />
        <text x={grid.center().x} y={appY + appH + 56} textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE['2xl']} fontWeight={600} fontFamily="Inter, sans-serif">
          Same orange. Same spacing. Same card style.
        </text>
      </g>

      {/* Teaser */}
      <g style={{ opacity: pTeaser }}>
        <rect x={grid.center().x - 260} y={grid.center().y - 40} width={520} height={80} rx={16}
          fill={C.accent} fillOpacity={0.08} stroke={C.accent} strokeWidth={2} />
        <text x={grid.center().x} y={grid.center().y + 8} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Here's how I did it.
        </text>
      </g>
    </g>
  );
};
