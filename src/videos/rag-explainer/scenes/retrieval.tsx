import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { AnimatedCard } from '../../../components/AnimatedCard';
import { FlowArrow } from '../../../components/FlowArrow';
import { DashFlow } from '../../../components/DashFlow';
import { TextBox } from '../../../components/TextBox';
import { LabelBadge } from '../../../components/LabelBadge';

/* ── inline SVG illustrations ─────────────────────────── */

const FunnelIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Funnel: wide top, narrow bottom */}
    <path d="M 0 0 L 70 0 L 50 30 L 50 50 L 20 50 L 20 30 Z" fill={MODULE_COLORS.retrieval} fillOpacity={0.12} stroke={MODULE_COLORS.retrieval} strokeWidth={1.5} strokeLinejoin="round" />
    {/* Docs entering */}
    <rect x={6} y={6} width={10} height={8} rx={1.5} fill={MODULE_COLORS.retrieval} fillOpacity={0.3} />
    <rect x={20} y={4} width={10} height={8} rx={1.5} fill={MODULE_COLORS.retrieval} fillOpacity={0.4} />
    <rect x={34} y={6} width={10} height={8} rx={1.5} fill={MODULE_COLORS.retrieval} fillOpacity={0.25} />
    <rect x={50} y={5} width={10} height={8} rx={1.5} fill={MODULE_COLORS.retrieval} fillOpacity={0.35} />
    {/* Single result out */}
    <rect x={28} y={54} width={14} height={10} rx={2} fill={MODULE_COLORS.retrieval} fillOpacity={0.6} stroke={MODULE_COLORS.retrieval} strokeWidth={1} />
  </g>
);

/* ── small step circle ────────────────────────────────── */

const StepCircle: React.FC<{ cx: number; cy: number; label: string; enterAt: number; color?: string }> = ({ cx, cy, label, enterAt, color = MODULE_COLORS.retrieval }) => {
  const { frame, fps } = useScene('retrieval');
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [12, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <circle cx={cx} cy={cy} r={26} fill={color} fillOpacity={0.1} stroke={color} strokeWidth={1.5} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
    </g>
  );
};

/* ── scene ─────────────────────────────────────────────── */

export const RetrievalScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('retrieval');

  const titleP = progress('show-title');
  const rankP = progress('show-ranking');
  const toolsP = progress('show-rerank-tools');
  const refineP = progress('show-refinement');
  const cragP = progress('show-crag');
  const activeP = progress('show-active-retrieval');
  const loopP = progress('show-feedback-loop');

  // 3B1B focus: newest bright, rest dims
  const activeBeat =
    frame >= beat('show-feedback-loop') ? 6
    : frame >= beat('show-active-retrieval') ? 5
    : frame >= beat('show-crag') ? 4
    : frame >= beat('show-refinement') ? 3
    : frame >= beat('show-rerank-tools') ? 2
    : frame >= beat('show-ranking') ? 1
    : 0;

  const dim = (idx: number) => (activeBeat === 0 || activeBeat === idx || activeBeat >= 6) ? 1 : 0.35;

  // Layout
  const leftCardX = grid.x(0.02);
  const leftCardY = grid.y(0.14);
  const leftCardW = 400;
  const leftCardH = 300;

  const rightCardX = grid.x(0.52);
  const rightCardY = grid.y(0.14);
  const rightCardW = 400;
  const rightCardH = 300;

  const activeCardX = grid.x(0.08);
  const activeCardY = grid.y(0.62);
  const activeCardW = grid.x(0.84);
  const activeCardH = 160;

  // Active retrieval step positions
  const stepY = activeCardY + 80;
  const step1X = activeCardX + activeCardW * 0.2;
  const step2X = activeCardX + activeCardW * 0.5;
  const step3X = activeCardX + activeCardW * 0.8;

  return (
    <g>
      {/* Color zone halo */}
      <circle cx={grid.center().x} cy={grid.center().y} r={440} fill={MODULE_COLORS.retrieval} fillOpacity={0.04} />

      {/* Module badge */}
      <g style={{ opacity: titleP }}>
        <circle cx={grid.x(0.06)} cy={grid.y(0.04)} r={20} fill={MODULE_COLORS.retrieval} fillOpacity={0.15} stroke={MODULE_COLORS.retrieval} strokeWidth={2} />
        <text x={grid.x(0.06)} y={grid.y(0.04) + 1} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLORS.retrieval} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>5</text>
        <text x={grid.x(0.06) + 30} y={grid.y(0.04) + 1} dominantBaseline="central" fill={MODULE_COLORS.retrieval} fontSize={FONT_SIZE.xl} fontWeight={TYPOGRAPHY.subheading.fontWeight} fontFamily={TYPOGRAPHY.subheading.fontFamily}>Retrieval</text>
      </g>

      {/* LEFT: Ranking card */}
      <g style={{ opacity: dim(1) }}>
        <AnimatedCard x={leftCardX} y={leftCardY} width={leftCardW} height={leftCardH} title="Ranking" enterAt={beat('show-ranking')} strokeColor={MODULE_COLORS.retrieval} accentHeader>
          <FunnelIcon x={16} y={10} />
          <TextBox x={16} y={90} maxWidth={leftCardW - 56} fontSize={FONT_SIZE.md} color={COLORS.dark}>
            Rank retrieved documents by actual relevance, not just vector similarity.
          </TextBox>
        </AnimatedCard>
      </g>

      {/* Tool badges under ranking card */}
      <g style={{ opacity: dim(2) }}>
        <LabelBadge x={leftCardX + 16} y={leftCardY + leftCardH + 12} text="Re-Rank" enterAt={beat('show-rerank-tools')} color={MODULE_COLORS.retrieval} filled />
        <LabelBadge x={leftCardX + 110} y={leftCardY + leftCardH + 12} text="RankGPT" enterAt={beat('show-rerank-tools')} color={MODULE_COLORS.retrieval} filled />
        <LabelBadge x={leftCardX + 210} y={leftCardY + leftCardH + 12} text="RAG-Fusion" enterAt={beat('show-rerank-tools')} color={MODULE_COLORS.retrieval} filled />
      </g>

      {/* RIGHT: Refinement card */}
      <g style={{ opacity: dim(3) }}>
        <AnimatedCard x={rightCardX} y={rightCardY} width={rightCardW} height={rightCardH} title="Refinement" enterAt={beat('show-refinement')} strokeColor={MODULE_COLORS.retrieval} accentHeader>
          <TextBox x={16} y={16} maxWidth={rightCardW - 56} fontSize={FONT_SIZE.md} color={COLORS.dark}>
            Evaluate whether retrieved documents are relevant. If not, trigger re-retrieval from different sources.
          </TextBox>
        </AnimatedCard>
      </g>

      {/* CRAG badge */}
      <g style={{ opacity: dim(4) }}>
        <LabelBadge x={rightCardX + 16} y={rightCardY + rightCardH + 12} text="CRAG" enterAt={beat('show-crag')} color={MODULE_COLORS.retrieval} filled />
        <TextBox x={rightCardX + 90} y={rightCardY + rightCardH + 10} maxWidth={280} fontSize={FONT_SIZE.sm} color={COLORS.lightStroke} enterAt={beat('show-crag')}>
          Corrective RAG — evaluate and re-retrieve
        </TextBox>
      </g>

      {/* BOTTOM: Active Retrieval card */}
      <g style={{ opacity: dim(5) }}>
        <AnimatedCard x={activeCardX} y={activeCardY} width={activeCardW} height={activeCardH} title="Active Retrieval" enterAt={beat('show-active-retrieval')} strokeColor={MODULE_COLORS.retrieval} accentHeader>
          {/* empty — steps rendered outside for positioning */}
        </AnimatedCard>

        {/* 3-step mini flow inside the card area */}
        <StepCircle cx={step1X} cy={stepY} label="Retrieve" enterAt={beat('show-active-retrieval')} />
        <StepCircle cx={step2X} cy={stepY} label="Evaluate" enterAt={beat('show-active-retrieval')} />
        <StepCircle cx={step3X} cy={stepY} label="Re-retrieve" enterAt={beat('show-active-retrieval')} />

        {/* Arrows between steps */}
        <FlowArrow from={{ x: step1X + 28, y: stepY }} to={{ x: step2X - 28, y: stepY }} enterAt={beat('show-active-retrieval')} color={MODULE_COLORS.retrieval} />
        <FlowArrow from={{ x: step2X + 28, y: stepY }} to={{ x: step3X - 28, y: stepY }} enterAt={beat('show-active-retrieval')} color={MODULE_COLORS.retrieval} />
      </g>

      {/* Feedback loop: curved dashed arrow from bottom-right back to top-left */}
      {frame >= beat('show-feedback-loop') && (
        <g style={{ opacity: loopP }}>
          <path
            d={`M ${step3X + 20} ${stepY + 30} C ${grid.x(0.95)} ${grid.y(0.95)}, ${grid.x(0.05)} ${grid.y(0.6)}, ${leftCardX + 20} ${leftCardY + leftCardH - 10}`}
            fill="none" stroke={MODULE_COLORS.retrieval} strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round"
          />
          {/* Arrow head at the end */}
          <polygon
            points={`${leftCardX + 20},${leftCardY + leftCardH - 10} ${leftCardX + 12},${leftCardY + leftCardH - 2} ${leftCardX + 28},${leftCardY + leftCardH - 2}`}
            fill={MODULE_COLORS.retrieval}
          />
          <text
            x={grid.x(0.5)} y={grid.y(0.96)}
            textAnchor="middle" fill={MODULE_COLORS.retrieval} fontSize={FONT_SIZE.sm}
            fontFamily={TYPOGRAPHY.label.fontFamily} fontWeight={500} fontStyle="italic"
          >
            feedback loop
          </text>
        </g>
      )}
    </g>
  );
};
