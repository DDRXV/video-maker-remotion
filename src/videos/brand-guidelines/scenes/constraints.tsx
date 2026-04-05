import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ConstraintsScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('constraints');
  const pTitle = progress('show-title');
  const pHeader = progress('show-header');
  const pNoGrad = progress('show-no-gradients');
  const pNoNeon = progress('show-no-neon');
  const pNoShadow = progress('show-no-shadows');
  const pNoRounded = progress('show-no-rounded');
  const pNoHero = progress('show-no-hero');
  const pCrosses = progress('show-crosses');
  const pInsight = progress('show-insight');
  const pBlocks = progress('show-blocks-defaults');
  const pSummary = progress('show-summary');

  const rulesDim = interpolate(pInsight, [0, 1], [1, 0.25]);

  const rules = [
    { label: 'No gradient fills', desc: 'Flat colors only', bad: 'gradient' },
    { label: 'No neon blues', desc: '#0066FF, #00d4ff banned', bad: 'neon' },
    { label: 'No heavy box shadows', desc: 'Max: 0 1px 3px', bad: 'shadow' },
    { label: 'No rounded-full buttons', desc: 'Max radius: 12px', bad: 'pill' },
    { label: 'No dark hero overlays', desc: 'No text over dark images', bad: 'overlay' },
  ];

  // Bigger cards, centered 3-2 grid
  const cardW = 400;
  const cardH = 170;
  const gapX = 30;
  const gapY = 24;
  const row1StartX = (1920 - (3 * cardW + 2 * gapX)) / 2;
  const row2StartX = (1920 - (2 * cardW + 1 * gapX)) / 2;
  const startY = grid.y(0.13);

  const beatMap: Record<number, string> = {
    0: 'show-no-gradients', 1: 'show-no-neon', 2: 'show-no-shadows',
    3: 'show-no-rounded', 4: 'show-no-hero',
  };

  const getCardPos = (i: number) => {
    if (i < 3) return { x: row1StartX + i * (cardW + gapX), y: startY };
    return { x: row2StartX + (i - 3) * (cardW + gapX), y: startY + cardH + gapY };
  };

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.x(0.01)} y={grid.y(0.02)} fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Design Constraints
        </text>
        <text x={grid.x(0.25)} y={grid.y(0.02)} fill={C.error}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily="Inter, sans-serif">
          The "Never Do" List
        </text>
      </g>

      {/* Subtitle */}
      <g style={{ opacity: pHeader }}>
        <text x={grid.x(0.01)} y={grid.y(0.09)} fill={C.mid}
          fontSize={FONT_SIZE.lg} fontFamily="Inter, sans-serif">
          These block the defaults Claude falls back on
        </text>
      </g>

      {/* Rule cards */}
      {rules.map((rule, i) => {
        const { x: cx, y: cy } = getCardPos(i);
        const rp = progress(beatMap[i]);

        return (
          <g key={i} style={{ opacity: rp * rulesDim }}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={14}
              fill={C.white} stroke={C.error} strokeWidth={1.5} strokeOpacity={0.6} />

            {/* Bad example */}
            {rule.bad === 'gradient' && (
              <g>
                <defs>
                  <linearGradient id="bad-grad-c" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
                <rect x={cx + 20} y={cy + 18} width={cardW - 40} height={60} rx={10} fill="url(#bad-grad-c)" />
                <rect x={cx + 50} y={cy + 34} width={cardW - 100} height={10} rx={5} fill="white" fillOpacity={0.6} />
                <rect x={cx + 70} y={cy + 52} width={cardW - 140} height={8} rx={4} fill="white" fillOpacity={0.3} />
              </g>
            )}
            {rule.bad === 'neon' && (
              <g>
                <rect x={cx + 20} y={cy + 18} width={100} height={48} rx={10} fill="#0066FF" />
                <text x={cx + 70} y={cy + 46} textAnchor="middle" fill="white" fontSize={15} fontWeight={600} fontFamily="Inter, sans-serif">CTA</text>
                <rect x={cx + 136} y={cy + 18} width={100} height={48} rx={10} fill="#00d4ff" />
                <text x={cx + 186} y={cy + 46} textAnchor="middle" fill="white" fontSize={15} fontWeight={600} fontFamily="Inter, sans-serif">Action</text>
                <rect x={cx + 252} y={cy + 18} width={100} height={48} rx={10} fill="#0099FF" />
                <text x={cx + 302} y={cy + 46} textAnchor="middle" fill="white" fontSize={15} fontWeight={600} fontFamily="Inter, sans-serif">Buy</text>
              </g>
            )}
            {rule.bad === 'shadow' && (
              <g>
                <defs>
                  <filter id="heavy-shadow-c" x="-20%" y="-20%" width="140%" height="160%">
                    <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000" floodOpacity="0.35" />
                  </filter>
                </defs>
                <rect x={cx + 50} y={cy + 18} width={cardW - 100} height={52} rx={10}
                  fill={C.white} stroke="#e2e8f0" strokeWidth={1} filter="url(#heavy-shadow-c)" />
                <rect x={cx + 66} y={cy + 34} width={cardW - 132} height={8} rx={4} fill="#cbd5e1" />
                <rect x={cx + 66} y={cy + 48} width={cardW - 170} height={6} rx={3} fill="#e2e8f0" />
              </g>
            )}
            {rule.bad === 'pill' && (
              <g>
                <rect x={cx + 36} y={cy + 18} width={140} height={48} rx={24} fill="#0066FF" />
                <text x={cx + 106} y={cy + 46} textAnchor="middle" fill="white" fontSize={15} fontWeight={600} fontFamily="Inter, sans-serif">Sign Up</text>
                <rect x={cx + 200} y={cy + 18} width={140} height={48} rx={24}
                  fill="none" stroke="#0066FF" strokeWidth={2} />
                <text x={cx + 270} y={cy + 46} textAnchor="middle" fill="#0066FF" fontSize={15} fontWeight={600} fontFamily="Inter, sans-serif">Learn</text>
              </g>
            )}
            {rule.bad === 'overlay' && (
              <g>
                <rect x={cx + 20} y={cy + 18} width={cardW - 40} height={60} rx={10} fill="#1a1a2e" />
                <rect x={cx + 30} y={cy + 24} width={cardW - 60} height={48} rx={6} fill="#16213e" fillOpacity={0.8} />
                <rect x={cx + 70} y={cy + 38} width={cardW - 140} height={8} rx={4} fill="white" fillOpacity={0.8} />
                <rect x={cx + 90} y={cy + 52} width={cardW - 180} height={6} rx={3} fill="white" fillOpacity={0.4} />
              </g>
            )}

            {/* Red X cross */}
            <g style={{ opacity: pCrosses }}>
              <line x1={cx + 14} y1={cy + 14} x2={cx + cardW - 14} y2={cy + cardH - 40}
                stroke={C.error} strokeWidth={3.5} strokeLinecap="round" />
              <line x1={cx + cardW - 14} y1={cy + 14} x2={cx + 14} y2={cy + cardH - 40}
                stroke={C.error} strokeWidth={3.5} strokeLinecap="round" />
            </g>

            {/* Label */}
            <text x={cx + 18} y={cy + cardH - 22} fill={C.error}
              fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
              {rule.label}
            </text>
            <text x={cx + cardW - 18} y={cy + cardH - 22} textAnchor="end" fill={C.light}
              fontSize={FONT_SIZE.sm} fontFamily="Inter, sans-serif">
              {rule.desc}
            </text>
          </g>
        );
      })}

      {/* Insight */}
      <g style={{ opacity: pInsight }}>
        <text x={grid.center().x} y={grid.y(0.58)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily="Inter, sans-serif">
          Negative constraints work harder than positive ones
        </text>
      </g>

      {/* Blocks defaults flow */}
      <g style={{ opacity: pBlocks }}>
        {/* Claude's defaults */}
        <rect x={grid.x(0.04)} y={grid.y(0.66)} width={320} height={110} rx={14}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <text x={grid.x(0.04) + 160} y={grid.y(0.66) + 28} textAnchor="middle"
          fill={C.codeGray} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
          Claude's defaults
        </text>
        <text x={grid.x(0.04) + 160} y={grid.y(0.66) + 56} textAnchor="middle"
          fill={C.codeBlue} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          gradient? blue? pill buttons?
        </text>
        <text x={grid.x(0.04) + 160} y={grid.y(0.66) + 80} textAnchor="middle"
          fill={C.codeBlue} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          heavy shadow? dark overlay?
        </text>

        {/* Block wall */}
        <rect x={grid.x(0.26)} y={grid.y(0.64)} width={28} height={130} rx={6}
          fill={C.error} fillOpacity={0.15} stroke={C.error} strokeWidth={2.5} />
        <text x={grid.x(0.26) + 14} y={grid.y(0.72)} textAnchor="middle"
          fill={C.error} fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily="Inter, sans-serif">
          X
        </text>

        {/* Arrow blocked */}
        <line x1={grid.x(0.04) + 330} y1={grid.y(0.72)} x2={grid.x(0.26) - 8} y2={grid.y(0.72)}
          stroke={C.error} strokeWidth={2} strokeDasharray="8 5" strokeLinecap="round" />

        {/* design-tokens.md */}
        <rect x={grid.x(0.3)} y={grid.y(0.64)} width={280} height={130} rx={14}
          fill={C.error} fillOpacity={0.06} stroke={C.error} strokeWidth={1.5} />
        <text x={grid.x(0.3) + 140} y={grid.y(0.66) + 6} textAnchor="middle"
          fill={C.error} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
          design-tokens.md
        </text>
        <text x={grid.x(0.3) + 20} y={grid.y(0.66) + 36} fill={C.error} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          - No gradients
        </text>
        <text x={grid.x(0.3) + 20} y={grid.y(0.66) + 60} fill={C.error} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          - No neon blues
        </text>
        <text x={grid.x(0.3) + 20} y={grid.y(0.66) + 84} fill={C.error} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          - No heavy shadows
        </text>

        {/* Arrow to output */}
        <line x1={grid.x(0.3) + 290} y1={grid.y(0.72)} x2={grid.x(0.62)} y2={grid.y(0.72)}
          stroke={C.green} strokeWidth={2} strokeLinecap="round" />
        <polyline points={`${grid.x(0.62) - 10},${grid.y(0.72) - 7} ${grid.x(0.62)},${grid.y(0.72)} ${grid.x(0.62) - 10},${grid.y(0.72) + 7}`}
          fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Clean output */}
        <rect x={grid.x(0.62)} y={grid.y(0.64)} width={340} height={130} rx={14}
          fill={C.greenLight} stroke={C.green} strokeWidth={1.5} />
        <text x={grid.x(0.62) + 170} y={grid.y(0.66) + 6} textAnchor="middle"
          fill={C.green} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif">
          Claude's output
        </text>
        <text x={grid.x(0.62) + 170} y={grid.y(0.66) + 36} textAnchor="middle"
          fill={C.mid} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          flat fills, brand orange
        </text>
        <text x={grid.x(0.62) + 170} y={grid.y(0.66) + 60} textAnchor="middle"
          fill={C.mid} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          12px radius, subtle shadow
        </text>
        <text x={grid.x(0.62) + 170} y={grid.y(0.66) + 84} textAnchor="middle"
          fill={C.mid} fontSize={FONT_SIZE.sm} fontFamily="monospace">
          clean, warm backgrounds
        </text>
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.92)} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily="Inter, sans-serif">
          Every banned pattern = one less way to look generic
        </text>
      </g>
    </g>
  );
};
