import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { AnimatedCard } from '../../../components/AnimatedCard';
import { FlowArrow } from '../../../components/FlowArrow';
import { TextBox } from '../../../components/TextBox';
import { LabelBadge } from '../../../components/LabelBadge';

/* ── inline SVG icons for Self-RAG flow ───────────────── */

const BrainIcon: React.FC<{ cx: number; cy: number; r: number; enterAt: number }> = ({ cx, cy, r, enterAt }) => {
  const { frame, fps } = useScene('generation');
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [14, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <circle cx={cx} cy={cy} r={r} fill={MODULE_COLORS.generation} fillOpacity={0.1} stroke={MODULE_COLORS.generation} strokeWidth={1.5} />
      {/* Simplified brain paths */}
      <path d={`M ${cx - 8} ${cy + 2} C ${cx - 8} ${cy - 10}, ${cx} ${cy - 12}, ${cx} ${cy - 4} C ${cx} ${cy - 12}, ${cx + 8} ${cy - 10}, ${cx + 8} ${cy + 2}`} fill="none" stroke={MODULE_COLORS.generation} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 6} stroke={MODULE_COLORS.generation} strokeWidth={1.2} />
      <text x={cx} y={cy + r + 14} textAnchor="middle" fill={MODULE_COLORS.generation} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Generate</text>
    </g>
  );
};

const CheckIcon: React.FC<{ cx: number; cy: number; r: number; enterAt: number }> = ({ cx, cy, r, enterAt }) => {
  const { frame, fps } = useScene('generation');
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [14, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <circle cx={cx} cy={cy} r={r} fill={COLORS.success} fillOpacity={0.1} stroke={COLORS.success} strokeWidth={1.5} />
      <path d={`M ${cx - 7} ${cy} L ${cx - 2} ${cy + 5} L ${cx + 7} ${cy - 5}`} fill="none" stroke={COLORS.success} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <text x={cx} y={cy + r + 14} textAnchor="middle" fill={COLORS.success} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Evaluate</text>
    </g>
  );
};

const LoopIcon: React.FC<{ cx: number; cy: number; r: number; enterAt: number }> = ({ cx, cy, r, enterAt }) => {
  const { frame, fps } = useScene('generation');
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [14, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <circle cx={cx} cy={cy} r={r} fill={MODULE_COLORS.generation} fillOpacity={0.1} stroke={MODULE_COLORS.generation} strokeWidth={1.5} />
      {/* Loop arrow */}
      <path d={`M ${cx + 6} ${cy - 5} A 7 7 0 1 0 ${cx + 6} ${cy + 5}`} fill="none" stroke={MODULE_COLORS.generation} strokeWidth={1.8} strokeLinecap="round" />
      <polygon points={`${cx + 6},${cy + 5} ${cx + 10},${cy + 1} ${cx + 2},${cy + 1}`} fill={MODULE_COLORS.generation} />
      <text x={cx} y={cy + r + 14} textAnchor="middle" fill={MODULE_COLORS.generation} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Re-retrieve?</text>
    </g>
  );
};

/* ── RRR triangle node ────────────────────────────────── */

const RRRNode: React.FC<{ cx: number; cy: number; label: string; enterAt: number }> = ({ cx, cy, label, enterAt }) => {
  const { frame, fps } = useScene('generation');
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [12, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <circle cx={cx} cy={cy} r={30} fill={MODULE_COLORS.generation} fillOpacity={0.08} stroke={MODULE_COLORS.generation} strokeWidth={1.5} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLORS.generation} fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
    </g>
  );
};

/* ── scene ─────────────────────────────────────────────── */

export const GenerationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('generation');

  const titleP = progress('show-title');
  const selfRagP = progress('show-self-rag');
  const evalP = progress('show-evaluation');
  const rrrP = progress('show-rrr');
  const loopBackP = progress('show-loop-back');
  const sumP = progress('show-summary');

  // 3B1B focus
  const activeBeat =
    frame >= beat('show-summary') ? 5
    : frame >= beat('show-loop-back') ? 4
    : frame >= beat('show-rrr') ? 3
    : frame >= beat('show-evaluation') ? 2
    : frame >= beat('show-self-rag') ? 1
    : 0;

  const dim = (idx: number) => (activeBeat === 0 || activeBeat === idx || activeBeat === 5) ? 1 : 0.35;

  // Self-RAG card layout
  const selfRagX = grid.x(0.02);
  const selfRagY = grid.y(0.14);
  const selfRagW = grid.x(0.56);
  const selfRagH = 240;

  // Self-RAG flow node positions (inside the card area)
  const nodeY = selfRagY + 120;
  const node1X = selfRagX + selfRagW * 0.18;
  const node2X = selfRagX + selfRagW * 0.5;
  const node3X = selfRagX + selfRagW * 0.82;
  const nodeR = 26;

  // RRR card layout
  const rrrX = grid.x(0.02);
  const rrrY = grid.y(0.52);
  const rrrW = grid.x(0.56);
  const rrrH = 260;

  // RRR triangle positions
  const triTopX = rrrX + rrrW * 0.5;
  const triTopY = rrrY + 80;
  const triLeftX = rrrX + rrrW * 0.25;
  const triLeftY = rrrY + 200;
  const triRightX = rrrX + rrrW * 0.75;
  const triRightY = rrrY + 200;

  // Highlight box
  const hlX = grid.x(0.62);
  const hlY = grid.y(0.18);
  const hlW = grid.x(0.96) - hlX;
  const hlH = 180;

  return (
    <g>
      {/* Color zone halo */}
      <circle cx={grid.center().x} cy={grid.center().y} r={430} fill={MODULE_COLORS.generation} fillOpacity={0.04} />

      {/* Module badge */}
      <g style={{ opacity: titleP }}>
        <circle cx={grid.x(0.06)} cy={grid.y(0.04)} r={20} fill={MODULE_COLORS.generation} fillOpacity={0.15} stroke={MODULE_COLORS.generation} strokeWidth={2} />
        <text x={grid.x(0.06)} y={grid.y(0.04) + 1} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLORS.generation} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>6</text>
        <text x={grid.x(0.06) + 30} y={grid.y(0.04) + 1} dominantBaseline="central" fill={MODULE_COLORS.generation} fontSize={FONT_SIZE.xl} fontWeight={TYPOGRAPHY.subheading.fontWeight} fontFamily={TYPOGRAPHY.subheading.fontFamily}>Generation</text>
      </g>

      {/* Self-RAG card */}
      <g style={{ opacity: dim(1) }}>
        <AnimatedCard x={selfRagX} y={selfRagY} width={selfRagW} height={selfRagH} title="Self-RAG" enterAt={beat('show-self-rag')} strokeColor={MODULE_COLORS.generation} accentHeader>
          <TextBox x={16} y={selfRagH - 36 - 50} maxWidth={selfRagW - 56} fontSize={FONT_SIZE.md} color={COLORS.dark}>
            The model generates an answer, then evaluates its own output for quality.
          </TextBox>
        </AnimatedCard>

        {/* 3-step horizontal flow inside card */}
        <BrainIcon cx={node1X} cy={nodeY} r={nodeR} enterAt={beat('show-self-rag')} />
        <CheckIcon cx={node2X} cy={nodeY} r={nodeR} enterAt={beat('show-evaluation')} />
        <LoopIcon cx={node3X} cy={nodeY} r={nodeR} enterAt={beat('show-evaluation')} />

        {/* Arrows between flow nodes */}
        <FlowArrow from={{ x: node1X + nodeR + 2, y: nodeY }} to={{ x: node2X - nodeR - 2, y: nodeY }} enterAt={beat('show-evaluation')} color={MODULE_COLORS.generation} />
        <FlowArrow from={{ x: node2X + nodeR + 2, y: nodeY }} to={{ x: node3X - nodeR - 2, y: nodeY }} enterAt={beat('show-evaluation')} color={MODULE_COLORS.generation} />
      </g>

      {/* RRR card */}
      <g style={{ opacity: dim(3) }}>
        <AnimatedCard x={rrrX} y={rrrY} width={rrrW} height={rrrH} title="RRR — Rewrite, Retrieve, Read" enterAt={beat('show-rrr')} strokeColor={MODULE_COLORS.generation} accentHeader>
          {/* empty, nodes rendered separately */}
        </AnimatedCard>

        {/* Triangle: Rewrite (top), Retrieve (bottom-left), Read (bottom-right) */}
        <RRRNode cx={triTopX} cy={triTopY} label="Rewrite" enterAt={beat('show-rrr')} />
        <RRRNode cx={triLeftX} cy={triLeftY} label="Retrieve" enterAt={beat('show-rrr')} />
        <RRRNode cx={triRightX} cy={triRightY} label="Read" enterAt={beat('show-rrr')} />

        {/* Dashed arrows forming the cycle */}
        <FlowArrow from={{ x: triTopX - 20, y: triTopY + 26 }} to={{ x: triLeftX + 20, y: triLeftY - 26 }} enterAt={beat('show-rrr')} color={MODULE_COLORS.generation} dashed />
        <FlowArrow from={{ x: triLeftX + 32, y: triLeftY }} to={{ x: triRightX - 32, y: triRightY }} enterAt={beat('show-rrr')} color={MODULE_COLORS.generation} dashed />
        <FlowArrow from={{ x: triRightX + 20, y: triRightY - 26 }} to={{ x: triTopX + 20, y: triTopY + 26 }} enterAt={beat('show-rrr')} color={MODULE_COLORS.generation} dashed />

        {/* Description below triangle */}
        <TextBox x={rrrX + 16} y={rrrY + rrrH - 36 - 16} maxWidth={rrrW - 56} fontSize={FONT_SIZE.sm} color={COLORS.lightStroke}>
          Rewrite the query based on initial generation, retrieve again, and read the new results.
        </TextBox>
      </g>

      {/* Right side highlight box */}
      <g style={{ opacity: dim(4) }}>
        <AnimatedCard x={hlX} y={hlY} width={hlW} height={hlH} enterAt={beat('show-loop-back')} strokeColor={MODULE_COLORS.generation} fill={MODULE_COLORS.generation} shadow={false}>
          {/* just a box with a callout feel */}
        </AnimatedCard>
        {/* Override fill to very light */}
        <rect x={hlX} y={hlY} width={hlW} height={hlH} rx={12} fill={MODULE_COLORS.generation} fillOpacity={0.06} stroke={MODULE_COLORS.generation} strokeWidth={1.5} style={{ opacity: loopBackP }} />
        <TextBox
          x={hlX + 24} y={hlY + 30} maxWidth={hlW - 48}
          fontSize={FONT_SIZE.lg} fontWeight={600} color={MODULE_COLORS.generation} enterAt={beat('show-loop-back')}
        >
          The system checks its own work and loops back if needed.
        </TextBox>
      </g>

      {/* Summary text */}
      <TextBox
        x={grid.x(0.15)} y={grid.y(0.92)} maxWidth={grid.x(0.7)}
        fontSize={FONT_SIZE.lg} color={COLORS.lightStroke} enterAt={beat('show-summary')} align="center"
      >
        Generation + self-reflection = reliability.
      </TextBox>
    </g>
  );
};
