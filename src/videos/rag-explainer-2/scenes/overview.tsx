import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { FlowArrow } from '../../../components/FlowArrow';
import { DashFlow } from '../../../components/DashFlow';
import { TextBox } from '../../../components/TextBox';

/**
 * ByteByteGo-style horizontal bus pipeline.
 * Clean numbered blocks with vertical branches for data sources.
 */

interface BlockDef {
  id: string; label: string; color: string; beatLabel: string;
}

const blocks: BlockDef[] = [
  { id: 'question', label: 'Question', color: C.blue, beatLabel: 'show-question-in' },
  { id: 'routing', label: 'Routing', color: C.routing, beatLabel: 'show-routing' },
  { id: 'translation', label: 'Translation', color: C.queryTranslation, beatLabel: 'show-query-translation' },
  { id: 'datasources', label: 'Data Sources', color: C.indexing, beatLabel: 'show-data-sources' },
  { id: 'retrieval', label: 'Retrieval', color: C.retrieval, beatLabel: 'show-retrieval' },
  { id: 'generation', label: 'Generation', color: C.generation, beatLabel: 'show-generation' },
  { id: 'answer', label: 'Answer', color: C.success, beatLabel: 'show-answer-out' },
];

export const OverviewScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('overview');

  const blockW = 170;
  const blockH = 64;
  const gap = 16;
  const totalW = blocks.length * blockW + (blocks.length - 1) * gap;
  const startX = grid.center().x - totalW / 2;
  const pipeY = grid.y(0.34);

  const pHighlight = progress('highlight-six');

  // 3B1B focus
  const latestVisibleIndex = (() => {
    for (let i = blocks.length - 1; i >= 0; i--) {
      if (progress(blocks[i].beatLabel) > 0.05) return i;
    }
    return 0;
  })();

  return (
    <g>
      {/* Title */}
      <text x={grid.center().x} y={grid.y(0.06)} textAnchor="middle" fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
        The Full Architecture
      </text>

      {/* Pipeline blocks */}
      {blocks.map((b, i) => {
        const bx = startX + i * (blockW + gap);
        const np = progress(b.beatLabel);
        const ty = interpolate(np, [0, 1], [20, 0], { extrapolateRight: 'clamp' });

        const distFromLatest = latestVisibleIndex - i;
        const focusOpacity = np > 0.05
          ? (distFromLatest === 0 ? 1 : distFromLatest <= 2 ? 0.5 : 0.25)
          : 0;

        return (
          <g key={b.id} style={{ opacity: focusOpacity, transform: `translateY(${ty}px)` }}>
            {/* Block */}
            <rect x={bx} y={pipeY} width={blockW} height={blockH} rx={10} fill={C.cardFill} stroke={b.color} strokeWidth={2} />
            {/* Left accent */}
            <rect x={bx} y={pipeY} width={5} height={blockH} rx={2.5} fill={b.color} fillOpacity={0.7} />
            {/* Number */}
            <text x={bx + 20} y={pipeY + blockH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={b.color} fontSize={FONT_SIZE.xs} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{i + 1}</text>
            {/* Label */}
            <text x={bx + 36} y={pipeY + blockH / 2 + 1} dominantBaseline="central" fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{b.label}</text>
          </g>
        );
      })}

      {/* Connection arrows */}
      {blocks.slice(0, -1).map((_, i) => {
        const fromX = startX + i * (blockW + gap) + blockW;
        const toX = startX + (i + 1) * (blockW + gap);
        return (
          <FlowArrow
            key={`arrow-${i}`}
            from={{ x: fromX + 2, y: pipeY + blockH / 2 }}
            to={{ x: toX - 2, y: pipeY + blockH / 2 }}
            enterAt={beat(blocks[i + 1].beatLabel)}
            color={C.cardStroke} strokeWidth={1.5}
          />
        );
      })}

      {/* Data Sources: 3 mini DBs below the data sources block */}
      {(() => {
        const dsIndex = 3;
        const dsCx = startX + dsIndex * (blockW + gap) + blockW / 2;
        const branchY = pipeY + blockH + 60;
        const dbs = [
          { label: 'Vector', offset: -120 },
          { label: 'SQL', offset: 0 },
          { label: 'Graph', offset: 120 },
        ];
        const dsP = progress('show-data-sources');

        return dbs.map((db, i) => {
          const cx = dsCx + db.offset;
          const delay = beat('show-data-sources') + 6 + i * 5;
          const dp = entranceSpring(frame, fps, delay);
          return (
            <g key={db.label} style={{ opacity: dp }}>
              {/* Connection line */}
              <line x1={dsCx} y1={pipeY + blockH} x2={cx} y2={branchY - 16} stroke={C.indexing} strokeWidth={1.5} strokeLinecap="round" />
              {/* Junction dot */}
              <circle cx={dsCx} cy={pipeY + blockH} r={3.5} fill={C.indexing} />
              {/* DB cylinder */}
              <ellipse cx={cx} cy={branchY - 8} rx={24} ry={8} fill="none" stroke={C.indexing} strokeWidth={1.5} />
              <line x1={cx - 24} y1={branchY - 8} x2={cx - 24} y2={branchY + 12} stroke={C.indexing} strokeWidth={1.5} />
              <line x1={cx + 24} y1={branchY - 8} x2={cx + 24} y2={branchY + 12} stroke={C.indexing} strokeWidth={1.5} />
              <ellipse cx={cx} cy={branchY + 12} rx={24} ry={8} fill="none" stroke={C.indexing} strokeWidth={1.5} />
              <text x={cx} y={branchY + 38} textAnchor="middle" fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>{db.label}</text>
            </g>
          );
        });
      })()}

      {/* Feedback loop: dashed curved path from Generation back to Translation */}
      {(() => {
        const genIndex = 5;
        const transIndex = 2;
        const genX = startX + genIndex * (blockW + gap) + blockW / 2;
        const transX = startX + transIndex * (blockW + gap) + blockW / 2;
        const loopY = pipeY - 60;
        const lp = progress('show-generation');
        const pathLen = 600;
        const offset = interpolate(lp, [0, 1], [pathLen, 0], { extrapolateRight: 'clamp' });

        return (
          <g style={{ opacity: lp * 0.7 }}>
            <path
              d={`M ${genX} ${pipeY} C ${genX} ${loopY}, ${transX} ${loopY}, ${transX} ${pipeY}`}
              fill="none" stroke={C.generation} strokeWidth={2}
              strokeDasharray="8 5" strokeDashoffset={offset} strokeLinecap="round"
            />
            <polygon
              points={`${transX},${pipeY} ${transX - 6},${pipeY - 12} ${transX + 6},${pipeY - 12}`}
              fill={C.generation} style={{ opacity: lp }}
            />
            {/* Label */}
            {(() => {
              const labelX = (genX + transX) / 2;
              const labelW = 200;
              return (
                <g>
                  <rect x={labelX - labelW / 2} y={loopY - 18} width={labelW} height={30} rx={15} fill={C.generation} fillOpacity={0.08} stroke={C.generation} strokeWidth={1} />
                  <text x={labelX} y={loopY - 2} textAnchor="middle" dominantBaseline="central" fill={C.generation} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>re-retrieve if needed</text>
                </g>
              );
            })()}
          </g>
        );
      })()}

      {/* DashFlow along bottom after highlight */}
      {pHighlight > 0.1 && (
        <DashFlow
          from={{ x: startX, y: pipeY + blockH + 16 }}
          to={{ x: startX + totalW, y: pipeY + blockH + 16 }}
          enterAt={beat('highlight-six')} color={C.blue} speed={90} strokeWidth={1.2}
        />
      )}

      {/* Bottom text */}
      <TextBox
        x={grid.x(0.1)} y={grid.y(0.86)} maxWidth={grid.x(0.8)}
        fontSize={FONT_SIZE.xl} fontWeight={600} color={C.dark}
        enterAt={beat('highlight-six')} align="center"
      >
        Six modules. Each independently improvable.
      </TextBox>
    </g>
  );
};
