import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { FlowArrow } from '../../../components/FlowArrow';
import { DashFlow } from '../../../components/DashFlow';
import { TextBox } from '../../../components/TextBox';

/* ── Pipeline node definitions ── */

interface PipelineNode {
  id: string;
  label: string;
  color: string;
  beatLabel: string;
}

const pipelineNodes: PipelineNode[] = [
  { id: 'question', label: 'Question', color: COLORS.accent, beatLabel: 'show-question-in' },
  { id: 'routing', label: 'Routing', color: MODULE_COLORS.routing, beatLabel: 'show-routing' },
  { id: 'translation', label: 'Translation', color: MODULE_COLORS.queryTranslation, beatLabel: 'show-query-translation' },
  { id: 'datasources', label: 'Data Sources', color: MODULE_COLORS.indexing, beatLabel: 'show-data-sources' },
  { id: 'retrieval', label: 'Retrieval', color: MODULE_COLORS.retrieval, beatLabel: 'show-retrieval' },
  { id: 'generation', label: 'Generation', color: MODULE_COLORS.generation, beatLabel: 'show-generation' },
  { id: 'answer', label: 'Answer', color: COLORS.success, beatLabel: 'show-answer-out' },
];

/* ── Inline SVG mini-icons for each node ── */

const QuestionIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <text x={cx} y={cy + 7} textAnchor="middle" fontSize={26} fontWeight={700} fontFamily="Inter, sans-serif" fill={COLORS.accent}>?</text>
);

const RoutingIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* fork shape */}
    <line x1={cx - 8} y1={cy} x2={cx} y2={cy} stroke={MODULE_COLORS.routing} strokeWidth={2} strokeLinecap="round" />
    <line x1={cx} y1={cy} x2={cx + 8} y2={cy - 8} stroke={MODULE_COLORS.routing} strokeWidth={2} strokeLinecap="round" />
    <line x1={cx} y1={cy} x2={cx + 8} y2={cy + 8} stroke={MODULE_COLORS.routing} strokeWidth={2} strokeLinecap="round" />
    <circle cx={cx + 8} cy={cy - 8} r={2.5} fill={MODULE_COLORS.routing} />
    <circle cx={cx + 8} cy={cy + 8} r={2.5} fill={MODULE_COLORS.routing} />
  </g>
);

const TranslationIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* two overlapping speech bubbles */}
    <rect x={cx - 10} y={cy - 8} width={14} height={10} rx={3} fill="none" stroke={MODULE_COLORS.queryTranslation} strokeWidth={1.5} />
    <rect x={cx - 4} y={cy - 2} width={14} height={10} rx={3} fill="none" stroke={MODULE_COLORS.queryTranslation} strokeWidth={1.5} />
  </g>
);

const DataSourceIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* cylinder (database) */}
    <ellipse cx={cx} cy={cy - 6} rx={10} ry={4} fill="none" stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    <line x1={cx - 10} y1={cy - 6} x2={cx - 10} y2={cy + 6} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    <line x1={cx + 10} y1={cy - 6} x2={cx + 10} y2={cy + 6} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
    <ellipse cx={cx} cy={cy + 6} rx={10} ry={4} fill="none" stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
  </g>
);

const RetrievalIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* funnel */}
    <polygon points={`${cx - 10},${cy - 8} ${cx + 10},${cy - 8} ${cx + 3},${cy + 2} ${cx - 3},${cy + 2}`} fill="none" stroke={MODULE_COLORS.retrieval} strokeWidth={1.5} strokeLinejoin="round" />
    <line x1={cx} y1={cy + 2} x2={cx} y2={cy + 10} stroke={MODULE_COLORS.retrieval} strokeWidth={1.5} strokeLinecap="round" />
  </g>
);

const GenerationIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* brain / sparkle */}
    <circle cx={cx - 4} cy={cy - 3} r={5} fill="none" stroke={MODULE_COLORS.generation} strokeWidth={1.5} />
    <circle cx={cx + 4} cy={cy - 3} r={5} fill="none" stroke={MODULE_COLORS.generation} strokeWidth={1.5} />
    <path d={`M ${cx - 6} ${cy + 2} Q ${cx} ${cy + 10} ${cx + 6} ${cy + 2}`} fill="none" stroke={MODULE_COLORS.generation} strokeWidth={1.5} />
  </g>
);

const AnswerCheckIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    <polyline points={`${cx - 7},${cy} ${cx - 2},${cy + 6} ${cx + 8},${cy - 6}`} fill="none" stroke={COLORS.success} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const nodeIcons: Record<string, React.FC<{ cx: number; cy: number }>> = {
  question: QuestionIcon,
  routing: RoutingIcon,
  translation: TranslationIcon,
  datasources: DataSourceIcon,
  retrieval: RetrievalIcon,
  generation: GenerationIcon,
  answer: AnswerCheckIcon,
};

/* ── Sub-DB icons under Data Sources ── */

const MiniDB: React.FC<{ cx: number; cy: number; label: string; enterAt: number }> = ({ cx, cy, label, enterAt }) => {
  const { frame, fps } = useScene('overview');
  const p = entranceSpring(frame, fps, enterAt);
  return (
    <g style={{ opacity: p }}>
      <ellipse cx={cx} cy={cy - 8} rx={16} ry={6} fill="none" stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
      <line x1={cx - 16} y1={cy - 8} x2={cx - 16} y2={cy + 8} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
      <line x1={cx + 16} y1={cy - 8} x2={cx + 16} y2={cy + 8} stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
      <ellipse cx={cx} cy={cy + 8} rx={16} ry={6} fill="none" stroke={MODULE_COLORS.indexing} strokeWidth={1.5} />
      <text x={cx} y={cy + 30} textAnchor="middle" fill={COLORS.dark} fontSize={FONT_SIZE.sm} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
    </g>
  );
};

/* ── Main scene ── */

export const OverviewScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('overview');

  const nodeR = 42;
  const pipelineY = grid.y(0.42);
  const nodeCount = pipelineNodes.length;
  const startX = grid.x(0.04);
  const endX = grid.x(0.96);
  const spacing = (endX - startX) / (nodeCount - 1);

  // Determine which beat index is the "newest" for 3B1B focus dimming
  const beatIndices = pipelineNodes.map((n, i) => ({ i, p: progress(n.beatLabel) }));
  const latestVisibleIndex = (() => {
    for (let i = beatIndices.length - 1; i >= 0; i--) {
      if (beatIndices[i].p > 0.05) return i;
    }
    return 0;
  })();

  const pHighlight = progress('highlight-six');

  const PARTICLE_COLOR = COLORS.mediumStroke;

  return (
    <g>
      {/* ── Floating particles ── */}
      {[
        { x: 0.85, y: 0.15, r: 3, cycle: 100, amp: 7 },
        { x: 0.12, y: 0.72, r: 2.5, cycle: 130, amp: 9 },
        { x: 0.68, y: 0.82, r: 2, cycle: 110, amp: 6 },
        { x: 0.92, y: 0.55, r: 3.5, cycle: 150, amp: 8 },
        { x: 0.35, y: 0.12, r: 2, cycle: 90, amp: 5 },
      ].map((p, i) => {
        const py = interpolate(frame % p.cycle, [0, p.cycle / 2, p.cycle], [0, -p.amp, 0]);
        return (
          <circle key={`particle-${i}`} cx={grid.x(p.x)} cy={grid.y(p.y)} r={p.r}
            fill={PARTICLE_COLOR} fillOpacity={0.08 + (i % 3) * 0.03}
            style={{ transform: `translateY(${py}px)` }} />
        );
      })}

      {/* Color zone halos behind each node */}
      {pipelineNodes.map((n, i) => {
        const cx = startX + i * spacing;
        const np = progress(n.beatLabel);
        return (
          <rect
            key={`zone-${n.id}`}
            x={cx - 55} y={pipelineY - 55} width={110} height={110} rx={16}
            fill={n.color} fillOpacity={0.08}
            style={{ opacity: np }}
          />
        );
      })}

      {/* Pipeline nodes */}
      {pipelineNodes.map((n, i) => {
        const cx = startX + i * spacing;
        const np = progress(n.beatLabel);
        const translateY = interpolate(np, [0, 1], [24, 0]);

        // Three-layer opacity: latest = 1, previous 2 = 0.55, older = 0.25
        const distFromLatest = latestVisibleIndex - i;
        const focusOpacity = np > 0.05
          ? (distFromLatest === 0 ? 1 : distFromLatest <= 2 ? 0.55 : 0.25)
          : 0;

        const isBrightest = i === latestVisibleIndex;
        const Icon = nodeIcons[n.id];

        return (
          <g key={n.id} style={{ opacity: focusOpacity, transform: `translateY(${translateY}px)` }}>
            {/* glow halo for newest */}
            {isBrightest && np > 0.5 && (
              <circle cx={cx} cy={pipelineY} r={nodeR + 16} fill={n.color} fillOpacity={0.12} />
            )}

            {/* Pulse ring on newest node */}
            {isBrightest && np > 0.3 && (() => {
              const ringR = interpolate(np, [0.3, 1], [nodeR, nodeR + 30]);
              const ringOpacity = interpolate(np, [0.3, 0.6, 1], [0, 0.3, 0]);
              return (
                <circle cx={cx} cy={pipelineY} r={ringR} fill="none" stroke={n.color} strokeWidth={1.5} strokeOpacity={ringOpacity} />
              );
            })()}

            <circle cx={cx} cy={pipelineY} r={nodeR} fill={COLORS.cardFill} stroke={n.color} strokeWidth={2.5} />
            {Icon && <Icon cx={cx} cy={pipelineY} />}

            <text
              x={cx} y={pipelineY + nodeR + 22}
              textAnchor="middle" fill={COLORS.dark}
              fontSize={FONT_SIZE.md} fontFamily={TYPOGRAPHY.label.fontFamily} fontWeight={TYPOGRAPHY.label.fontWeight}
            >
              {n.label}
            </text>
          </g>
        );
      })}

      {/* Connection lines between nodes */}
      {pipelineNodes.slice(0, -1).map((n, i) => {
        const fromX = startX + i * spacing + nodeR + 4;
        const toX = startX + (i + 1) * spacing - nodeR - 4;
        return (
          <FlowArrow
            key={`arrow-${i}`}
            from={{ x: fromX, y: pipelineY }}
            to={{ x: toX, y: pipelineY }}
            enterAt={beat(pipelineNodes[i + 1].beatLabel)}
            color={COLORS.mediumStroke}
            strokeWidth={1.5}
          />
        );
      })}

      {/* Data Sources: 3 mini DB icons branching below */}
      {(() => {
        const dsIndex = 3; // datasources index
        const dsCx = startX + dsIndex * spacing;
        const dsEnter = beat('show-data-sources');
        const branchY = pipelineY + 110;
        const dbs = [
          { label: 'Graph DB', offset: -90 },
          { label: 'Relational', offset: 0 },
          { label: 'Vectorstore', offset: 90 },
        ];

        return (
          <g>
            {dbs.map((db, i) => (
              <g key={db.label}>
                <FlowArrow
                  from={{ x: dsCx, y: pipelineY + nodeR + 2 }}
                  to={{ x: dsCx + db.offset, y: branchY - 10 }}
                  enterAt={dsEnter + 6 + i * 4}
                  color={MODULE_COLORS.indexing}
                  strokeWidth={1}
                  curved
                />
                <MiniDB cx={dsCx + db.offset} cy={branchY} label={db.label} enterAt={dsEnter + 8 + i * 4} />
              </g>
            ))}
          </g>
        );
      })()}

      {/* Feedback loop: dashed curved path from Generation back to Translation */}
      {(() => {
        const genIndex = 5;
        const transIndex = 2;
        const genX = startX + genIndex * spacing;
        const transX = startX + transIndex * spacing;
        const loopY = pipelineY - 100;

        const lp = progress('show-generation');
        const d = `M ${genX} ${pipelineY - nodeR - 2} C ${genX} ${loopY}, ${transX} ${loopY}, ${transX} ${pipelineY - nodeR - 2}`;
        const pathLen = 500;
        const offset = interpolate(lp, [0, 1], [pathLen, 0]);

        return (
          <g style={{ opacity: lp * 0.8 }}>
            <path
              d={d} fill="none" stroke={MODULE_COLORS.generation} strokeWidth={2}
              strokeDasharray="8 5" strokeDashoffset={offset} strokeLinecap="round"
            />
            {/* arrowhead */}
            <polygon
              points={`${transX},${pipelineY - nodeR - 2} ${transX - 6},${pipelineY - nodeR - 14} ${transX + 6},${pipelineY - nodeR - 14}`}
              fill={MODULE_COLORS.generation} style={{ opacity: lp }}
            />
            {/* Label badge */}
            {(() => {
              const labelX = (genX + transX) / 2;
              const labelY = loopY - 6;
              const labelW = 220;
              return (
                <g>
                  <rect x={labelX - labelW / 2} y={labelY - 16} width={labelW} height={30} rx={15} fill={MODULE_COLORS.generation} fillOpacity={0.1} stroke={MODULE_COLORS.generation} strokeWidth={1} />
                  <text
                    x={labelX} y={labelY}
                    textAnchor="middle" dominantBaseline="central" fill={MODULE_COLORS.generation}
                    fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}
                  >
                    re-retrieve if needed
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })()}

      {/* Ambient DashFlow along pipeline bottom after highlight-six */}
      {progress('highlight-six') > 0.1 && (
        <DashFlow
          from={{ x: startX, y: pipelineY + nodeR + 40 }}
          to={{ x: endX, y: pipelineY + nodeR + 40 }}
          enterAt={beat('highlight-six')}
          color={COLORS.accent}
          speed={90}
          strokeWidth={1.2}
        />
      )}

      {/* Bottom text */}
      <TextBox
        x={grid.x(0.15)} y={grid.y(0.85)} maxWidth={grid.x(0.7)}
        fontSize={FONT_SIZE.xl} fontWeight={600} color={COLORS.dark}
        enterAt={beat('highlight-six')} align="center"
      >
        Six modules. Each independently improvable.
      </TextBox>
    </g>
  );
};
