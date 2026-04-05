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
  const gap = 12;
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

      {/* Question label */}
      <g style={{ opacity: diagP }}>
        <text x={startX - 16} y={pipeY + pipeH / 2 + 1} textAnchor="end" dominantBaseline="central" fill={C.blue} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Question</text>
        <FlowArrow from={{ x: startX - 14, y: pipeY + pipeH / 2 }} to={{ x: startX - 4, y: pipeY + pipeH / 2 }} enterAt={beat('show-full-diagram')} color={C.blue} strokeWidth={1.5} />
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

      {/* Answer label */}
      <g style={{ opacity: diagP }}>
        <FlowArrow from={{ x: startX + blockCount * (blockW + gap) - gap + 4, y: pipeY + pipeH / 2 }} to={{ x: startX + blockCount * (blockW + gap) - gap + 14, y: pipeY + pipeH / 2 }} enterAt={beat('show-full-diagram')} color={C.success} strokeWidth={1.5} />
        <text x={startX + blockCount * (blockW + gap) - gap + 18} y={pipeY + pipeH / 2 + 1} dominantBaseline="central" fill={C.success} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Answer</text>
      </g>

      {/* Arrows between blocks */}
      {modules.slice(0, -1).map((_, i) => {
        const fromX = startX + (i + 1) * (blockW + gap) - gap;
        const toX = startX + (i + 1) * (blockW + gap);
        return (
          <FlowArrow
            key={`a-${i}`}
            from={{ x: fromX, y: pipeY + pipeH / 2 }}
            to={{ x: toX, y: pipeY + pipeH / 2 }}
            enterAt={beat('show-full-diagram')} color={C.cardStroke} strokeWidth={1.5}
          />
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

      {/* Self-correction loop */}
      {frame >= beat('animate-flow') && (() => {
        const genCX = startX + 5 * (blockW + gap) + blockW / 2;
        const qtCX = startX + 2 * (blockW + gap) + blockW / 2;
        const loopBottomY = pipeY + pipeH + 50;
        const lp = entranceSpring(frame, fps, beat('animate-flow'));
        return (
          <g style={{ opacity: lp * 0.7 }}>
            <path
              d={`M ${genCX} ${pipeY + pipeH} C ${genCX} ${loopBottomY + 16}, ${qtCX} ${loopBottomY + 16}, ${qtCX} ${pipeY + pipeH}`}
              fill="none" stroke={C.generation} strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round"
            />
            <polygon points={`${qtCX},${pipeY + pipeH} ${qtCX - 5},${pipeY + pipeH + 8} ${qtCX + 5},${pipeY + pipeH + 8}`} fill={C.generation} />
            <text x={(genCX + qtCX) / 2} y={loopBottomY + 22} textAnchor="middle" fill={C.generation} fontSize={FONT_SIZE.xs} fontFamily="monospace" fillOpacity={0.8}>self-correction loop</text>
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
