import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { DashFlow } from '../../../components/DashFlow';
import { FlowArrow } from '../../../components/FlowArrow';
import { TextBox } from '../../../components/TextBox';

/**
 * ByteByteGo-style full pipeline + incremental adoption steps.
 * Clean numbered blocks, self-correction loop, step-by-step adoption card.
 */

const PipelineBlock: React.FC<{
  x: number; y: number; w: number; h: number;
  color: string; label: string; subLabel?: string;
  enterAt: number;
}> = ({ x, y, w, h, color, label, subLabel, enterAt }) => {
  const { frame, fps } = useScene('full-picture');
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [16, 0], { extrapolateRight: 'clamp' });
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={C.cardFill} stroke={color} strokeWidth={2} />
      <rect x={x} y={y} width={5} height={h} rx={2.5} fill={color} fillOpacity={0.7} />
      <text x={x + w / 2} y={y + h / 2 - (subLabel ? 6 : 0)} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
      {subLabel && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={12} fontWeight={400} fontFamily="monospace" fillOpacity={0.7}>{subLabel}</text>
      )}
    </g>
  );
};

const StepRow: React.FC<{
  x: number; y: number; num: number; text: string; when: string;
  enterAt: number; maxW: number;
}> = ({ x, y, num, text, when, enterAt, maxW }) => {
  const { frame, fps } = useScene('full-picture');
  const p = entranceSpring(frame, fps, enterAt);
  return (
    <g style={{ opacity: p }}>
      <circle cx={x + 12} cy={y + 10} r={12} fill={C.blue} fillOpacity={0.08} stroke={C.blue} strokeWidth={1} />
      <text x={x + 12} y={y + 11} textAnchor="middle" dominantBaseline="central" fill={C.blue} fontSize={FONT_SIZE.xs} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{num}</text>
      <text x={x + 32} y={y + 11} dominantBaseline="central" fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>{text}</text>
      <text x={x + maxW} y={y + 11} textAnchor="end" dominantBaseline="central" fill={C.mid} fontSize={FONT_SIZE.xs} fontFamily="monospace">{when}</text>
    </g>
  );
};

export const FullPictureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('full-picture');

  const diagP = progress('show-full-diagram');
  const flowP = progress('animate-flow');
  const incP = progress('show-incremental');
  const finalP = progress('final-frame');

  const pipeY = grid.y(0.14);
  const pipeH = 64;
  const totalW = grid.x(0.84);
  const startX = grid.x(0.08);
  const blockCount = 6;
  const gap = 28;
  const blockW = (totalW - gap * (blockCount - 1)) / blockCount;

  const modules = [
    { label: 'Routing', color: C.routing },
    { label: 'Query', subLabel: 'Construction', color: C.queryConstruction },
    { label: 'Query', subLabel: 'Translation', color: C.queryTranslation },
    { label: 'Indexing', subLabel: '+ Data Sources', color: C.indexing },
    { label: 'Retrieval', subLabel: '+ Ranking', color: C.retrieval },
    { label: 'Generation', subLabel: '+ Self-RAG', color: C.generation },
  ];

  const incX = grid.x(0.06);
  const incStartY = grid.y(0.46);
  const incRowH = 38;
  const incMaxW = grid.x(0.88);

  const steps = [
    { text: 'Start with basic RAG', when: 'Day 1' },
    { text: 'Add routing for multiple sources', when: 'When sources > 1' },
    { text: 'Add query translation', when: 'When recall drops' },
    { text: 'Add re-ranking', when: 'When precision matters' },
    { text: 'Add generation feedback', when: 'When trust matters' },
  ];

  const dashY = pipeY + pipeH + 16;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: diagP }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle" fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Complete System</text>
      </g>

      {/* Question label + arrow */}
      <g style={{ opacity: diagP }}>
        <text x={startX - 28} y={pipeY + pipeH / 2 + 1} textAnchor="end" dominantBaseline="central" fill={C.blue} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Question</text>
        <line x1={startX - 24} y1={pipeY + pipeH / 2} x2={startX - 8} y2={pipeY + pipeH / 2} stroke={C.blue} strokeWidth={1.5} strokeLinecap="round" />
        <polygon points={`${startX - 2},${pipeY + pipeH / 2} ${startX - 9},${pipeY + pipeH / 2 - 4} ${startX - 9},${pipeY + pipeH / 2 + 4}`} fill={C.blue} />
      </g>

      {/* Pipeline blocks */}
      {modules.map((mod, i) => {
        const bx = startX + i * (blockW + gap);
        return (
          <PipelineBlock
            key={i} x={bx} y={pipeY} w={blockW} h={pipeH}
            color={mod.color} label={mod.label} subLabel={mod.subLabel}
            enterAt={beat('show-full-diagram')}
          />
        );
      })}

      {/* Answer label + arrow */}
      {(() => {
        const lastBlockRight = startX + blockCount * (blockW + gap) - gap + 4;
        const ansArrowEnd = lastBlockRight + 24;
        const ay = pipeY + pipeH / 2;
        return (
          <g style={{ opacity: diagP }}>
            <line x1={lastBlockRight} y1={ay} x2={ansArrowEnd - 8} y2={ay} stroke={C.success} strokeWidth={1.5} strokeLinecap="round" />
            <polygon points={`${ansArrowEnd},${ay} ${ansArrowEnd - 7},${ay - 4} ${ansArrowEnd - 7},${ay + 4}`} fill={C.success} />
            <text x={ansArrowEnd + 8} y={ay + 1} dominantBaseline="central" fill={C.success} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Answer</text>
          </g>
        );
      })()}

      {/* Straight horizontal arrows between blocks */}
      {modules.slice(0, -1).map((_, i) => {
        const fromX = startX + (i + 1) * (blockW + gap) - gap + 4;
        const toX = startX + (i + 1) * (blockW + gap) - 4;
        const ay = pipeY + pipeH / 2;
        return (
          <g key={`a-${i}`} style={{ opacity: diagP }}>
            <line x1={fromX} y1={ay} x2={toX - 8} y2={ay} stroke={C.cardStroke} strokeWidth={1.5} strokeLinecap="round" />
            <polygon points={`${toX},${ay} ${toX - 7},${ay - 4} ${toX - 7},${ay + 4}`} fill={C.cardStroke} />
          </g>
        );
      })}

      {/* DashFlow */}
      {frame >= beat('animate-flow') && (
        <DashFlow
          from={{ x: startX, y: dashY }}
          to={{ x: startX + blockCount * (blockW + gap) - gap, y: dashY }}
          enterAt={beat('animate-flow')} color={C.blue} strokeWidth={2} speed={40}
        />
      )}

      {/* Self-correction loop — box-style L-shaped path, well below blocks */}
      {frame >= beat('animate-flow') && (() => {
        const genRight = startX + 5 * (blockW + gap) + blockW / 2;
        const qtLeft = startX + 2 * (blockW + gap) + blockW / 2;
        const loopY = pipeY + pipeH + 14;
        const loopBottomY = pipeY + pipeH + 46;
        const r = 12; // corner radius
        const lp = entranceSpring(frame, fps, beat('animate-flow'));
        // Box path: down from gen, horizontal left, up to qt
        const d = `M ${genRight} ${loopY} L ${genRight} ${loopBottomY - r} Q ${genRight} ${loopBottomY} ${genRight - r} ${loopBottomY} L ${qtLeft + r} ${loopBottomY} Q ${qtLeft} ${loopBottomY} ${qtLeft} ${loopBottomY - r} L ${qtLeft} ${loopY}`;
        return (
          <g style={{ opacity: lp * 0.6 }}>
            <path d={d} fill="none" stroke={C.generation} strokeWidth={1.5} strokeDasharray="6 4" strokeLinecap="round" />
            {/* Arrowhead pointing up at qt */}
            <polygon points={`${qtLeft},${loopY - 2} ${qtLeft - 4},${loopY + 6} ${qtLeft + 4},${loopY + 6}`} fill={C.generation} />
            {/* Label centered on bottom segment */}
            <rect x={(genRight + qtLeft) / 2 - 70} y={loopBottomY - 12} width={140} height={20} rx={4} fill={C.bg} />
            <text x={(genRight + qtLeft) / 2} y={loopBottomY} textAnchor="middle" dominantBaseline="central" fill={C.generation} fontSize={12} fontFamily="monospace" fillOpacity={0.8}>self-correction loop</text>
          </g>
        );
      })()}

      {/* Incremental adoption */}
      {frame >= beat('show-incremental') && (
        <g>
          <rect x={incX - 16} y={incStartY - 24} width={incMaxW + 32} height={steps.length * incRowH + 56} rx={12} fill={C.cardFill} stroke={C.cardStroke} strokeWidth={1} style={{ opacity: incP }} />
          <text x={incX} y={incStartY} fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily} style={{ opacity: incP }}>Incremental Adoption</text>
          {steps.map((step, i) => (
            <StepRow
              key={i} x={incX} y={incStartY + 22 + i * incRowH}
              num={i + 1} text={step.text} when={step.when}
              enterAt={beat('show-incremental')} maxW={incMaxW}
            />
          ))}
        </g>
      )}

      {/* Final text */}
      <g style={{ opacity: finalP }}>
        <text x={grid.center().x} y={grid.y(0.92)} textAnchor="middle" fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Production RAG</text>
        <text x={grid.center().x} y={grid.y(0.96)} textAnchor="middle" fill={C.mid} fontSize={FONT_SIZE.lg} fontWeight={400} fontFamily={TYPOGRAPHY.body.fontFamily}>Six modules, incrementally adoptable.</text>
      </g>
    </g>
  );
};
