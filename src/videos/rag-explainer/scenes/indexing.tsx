import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { AnimatedCard } from '../../../components/AnimatedCard';
import { TextBox } from '../../../components/TextBox';
import { LabelBadge } from '../../../components/LabelBadge';

/* ── inline SVG illustrations ─────────────────────────── */

const ChunkIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Document splitting into different-sized pieces */}
    <rect x={0} y={0} width={32} height={44} rx={3} fill="none" stroke={MODULE_COLORS.indexing} strokeWidth={1.5} strokeDasharray="3 2" />
    <line x1={0} y1={14} x2={32} y2={14} stroke={MODULE_COLORS.indexing} strokeWidth={1} strokeDasharray="2 2" />
    <line x1={0} y1={30} x2={32} y2={30} stroke={MODULE_COLORS.indexing} strokeWidth={1} strokeDasharray="2 2" />
    <rect x={42} y={0} width={28} height={10} rx={3} fill={MODULE_COLORS.indexing} fillOpacity={0.15} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <rect x={42} y={16} width={28} height={18} rx={3} fill={MODULE_COLORS.indexing} fillOpacity={0.25} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <rect x={42} y={40} width={28} height={8} rx={3} fill={MODULE_COLORS.indexing} fillOpacity={0.1} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <path d={`M 34 22 L 40 6`} stroke={MODULE_COLORS.indexing} strokeWidth={1} fill="none" />
    <path d={`M 34 22 L 40 24`} stroke={MODULE_COLORS.indexing} strokeWidth={1} fill="none" />
    <path d={`M 34 36 L 40 42`} stroke={MODULE_COLORS.indexing} strokeWidth={1} fill="none" />
  </g>
);

const MultiRepIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Summary on top, full doc below, connected by line */}
    <rect x={10} y={0} width={50} height={14} rx={3} fill={MODULE_COLORS.indexing} fillOpacity={0.2} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <text x={35} y={10} textAnchor="middle" fill={MODULE_COLORS.indexing} fontSize={8} fontFamily="monospace">summary</text>
    <line x1={35} y1={14} x2={35} y2={24} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} strokeDasharray="2 2" />
    <rect x={4} y={24} width={62} height={24} rx={3} fill="none" stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    <line x1={10} y1={31} x2={58} y2={31} stroke={MODULE_COLORS.indexing} strokeWidth={0.8} strokeOpacity={0.4} />
    <line x1={10} y1={37} x2={58} y2={37} stroke={MODULE_COLORS.indexing} strokeWidth={0.8} strokeOpacity={0.4} />
    <line x1={10} y1={43} x2={40} y2={43} stroke={MODULE_COLORS.indexing} strokeWidth={0.8} strokeOpacity={0.4} />
  </g>
);

const EmbeddingIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Two vectors converging */}
    <line x1={0} y1={4} x2={30} y2={22} stroke={MODULE_COLORS.indexing} strokeWidth={2} />
    <line x1={60} y1={4} x2={30} y2={22} stroke={MODULE_COLORS.indexing} strokeWidth={2} />
    <circle cx={0} cy={4} r={4} fill={MODULE_COLORS.indexing} fillOpacity={0.3} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    <circle cx={60} cy={4} r={4} fill={MODULE_COLORS.indexing} fillOpacity={0.3} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    <circle cx={30} cy={22} r={6} fill={MODULE_COLORS.indexing} fillOpacity={0.5} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    {/* Small vector arrows */}
    <line x1={4} y1={34} x2={22} y2={34} stroke={MODULE_COLORS.indexing} strokeWidth={1} strokeOpacity={0.5} />
    <line x1={28} y1={34} x2={46} y2={34} stroke={MODULE_COLORS.indexing} strokeWidth={1} strokeOpacity={0.5} />
    <circle cx={4} cy={34} r={2} fill={MODULE_COLORS.indexing} fillOpacity={0.3} />
    <circle cx={22} cy={34} r={2} fill={MODULE_COLORS.indexing} fillOpacity={0.3} />
    <circle cx={28} cy={34} r={2} fill={MODULE_COLORS.indexing} fillOpacity={0.3} />
    <circle cx={46} cy={34} r={2} fill={MODULE_COLORS.indexing} fillOpacity={0.3} />
  </g>
);

const TreeIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Tree structure with nodes */}
    <circle cx={30} cy={6} r={6} fill={MODULE_COLORS.indexing} fillOpacity={0.4} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    <line x1={30} y1={12} x2={14} y2={24} stroke={MODULE_COLORS.indexing} strokeWidth={1.2} />
    <line x1={30} y1={12} x2={46} y2={24} stroke={MODULE_COLORS.indexing} strokeWidth={1.2} />
    <circle cx={14} cy={26} r={5} fill={MODULE_COLORS.indexing} fillOpacity={0.25} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <circle cx={46} cy={26} r={5} fill={MODULE_COLORS.indexing} fillOpacity={0.25} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <line x1={14} y1={31} x2={6} y2={40} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <line x1={14} y1={31} x2={22} y2={40} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <line x1={46} y1={31} x2={38} y2={40} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <line x1={46} y1={31} x2={54} y2={40} stroke={MODULE_COLORS.indexing} strokeWidth={1} />
    <circle cx={6} cy={42} r={3.5} fill={MODULE_COLORS.indexing} fillOpacity={0.15} stroke={MODULE_COLORS.indexing} strokeWidth={0.8} />
    <circle cx={22} cy={42} r={3.5} fill={MODULE_COLORS.indexing} fillOpacity={0.15} stroke={MODULE_COLORS.indexing} strokeWidth={0.8} />
    <circle cx={38} cy={42} r={3.5} fill={MODULE_COLORS.indexing} fillOpacity={0.15} stroke={MODULE_COLORS.indexing} strokeWidth={0.8} />
    <circle cx={54} cy={42} r={3.5} fill={MODULE_COLORS.indexing} fillOpacity={0.15} stroke={MODULE_COLORS.indexing} strokeWidth={0.8} />
  </g>
);

/* ── scene ─────────────────────────────────────────────── */

export const IndexingScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('indexing');

  const titleP = progress('show-title');
  const chunkP = progress('show-chunk-opt');
  const multiP = progress('show-multi-rep');
  const specP = progress('show-specialized');
  const hierP = progress('show-hierarchical');
  const sumP = progress('show-summary');

  // 3B1B focus dimming
  const activeBeat =
    frame >= beat('show-summary') ? 5
    : frame >= beat('show-hierarchical') ? 4
    : frame >= beat('show-specialized') ? 3
    : frame >= beat('show-multi-rep') ? 2
    : frame >= beat('show-chunk-opt') ? 1
    : 0;

  const dim = (idx: number) => (activeBeat === 0 || activeBeat === idx || activeBeat === 5) ? 1 : 0.35;

  // Card grid positions (2x2)
  const cardW = 380;
  const cardH = 220;
  const gapX = 40;
  const gapY = 30;
  const baseX = grid.x(0.5) - (cardW + gapX / 2);
  const baseY = grid.y(0.18);

  const cards = [
    { x: baseX, y: baseY, dimIdx: 1, enterAt: beat('show-chunk-opt'), p: chunkP, title: 'Chunk Optimization', technique: 'Semantic Splitter', desc: 'Optimize chunk size for your data and use case.', Icon: ChunkIcon },
    { x: baseX + cardW + gapX, y: baseY, dimIdx: 2, enterAt: beat('show-multi-rep'), p: multiP, title: 'Multi-Representation', technique: 'Parent Document, Dense X', desc: 'Search summaries, return full documents.', Icon: MultiRepIcon },
    { x: baseX, y: baseY + cardH + gapY, dimIdx: 3, enterAt: beat('show-specialized'), p: specP, title: 'Specialized Embeddings', technique: 'ColBERT, Fine-tuning', desc: 'Domain-specific embedding models.', Icon: EmbeddingIcon },
    { x: baseX + cardW + gapX, y: baseY + cardH + gapY, dimIdx: 4, enterAt: beat('show-hierarchical'), p: hierP, title: 'Hierarchical Indexing', technique: 'RAPTOR', desc: 'Summaries at different abstraction levels.', Icon: TreeIcon },
  ];

  return (
    <g>
      {/* Color zone halo */}
      <circle cx={grid.center().x} cy={grid.center().y} r={420} fill={MODULE_COLORS.indexing} fillOpacity={0.04} />

      {/* Module badge */}
      <g style={{ opacity: titleP }}>
        <circle cx={grid.x(0.06)} cy={grid.y(0.04)} r={20} fill={MODULE_COLORS.indexing} fillOpacity={0.15} stroke={MODULE_COLORS.indexing} strokeWidth={2} />
        <text x={grid.x(0.06)} y={grid.y(0.04) + 1} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLORS.indexing} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>4</text>
        <text x={grid.x(0.06) + 30} y={grid.y(0.04) + 1} dominantBaseline="central" fill={MODULE_COLORS.indexing} fontSize={FONT_SIZE.xl} fontWeight={TYPOGRAPHY.subheading.fontWeight} fontFamily={TYPOGRAPHY.subheading.fontFamily}>Indexing</text>
      </g>

      {/* 2x2 card grid */}
      {cards.map(({ x, y, dimIdx, enterAt, p, title, technique, desc, Icon }, i) => (
        <g key={i} style={{ opacity: dim(dimIdx) }}>
          <AnimatedCard x={x} y={y} width={cardW} height={cardH} title={title} enterAt={enterAt} strokeColor={MODULE_COLORS.indexing} accentHeader>
            {/* Illustration */}
            <Icon x={16} y={12} />
            {/* Technique badge in monospace */}
            <g transform={`translate(16, ${cardH - 36 - 86})`}>
              <rect x={0} y={0} width={cardW - 56} height={22} rx={4} fill={MODULE_COLORS.indexing} fillOpacity={0.08} />
              <text x={8} y={15} fill={MODULE_COLORS.indexing} fontSize={FONT_SIZE.xs} fontFamily="monospace" fontWeight={400}>{technique}</text>
            </g>
            {/* Description */}
            <TextBox x={16} y={cardH - 36 - 54} maxWidth={cardW - 56} fontSize={FONT_SIZE.md} color={COLORS.dark}>
              {desc}
            </TextBox>
          </AnimatedCard>
        </g>
      ))}

      {/* Summary text */}
      <TextBox
        x={grid.x(0.15)} y={grid.y(0.88)} maxWidth={grid.x(0.7)}
        fontSize={FONT_SIZE.lg} color={COLORS.lightStroke} enterAt={beat('show-summary')} align="center"
      >
        Four strategies to prepare your data. Pick the ones that match your failure modes.
      </TextBox>
    </g>
  );
};
