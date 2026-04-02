import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { DashFlow } from '../../../components/DashFlow';
import { FlowArrow } from '../../../components/FlowArrow';
import { TextBox } from '../../../components/TextBox';

/* ── pipeline module block ────────────────────────────── */

interface PipelineBlockProps {
  x: number; y: number; w: number; h: number;
  color: string; label: string; subLabel?: string;
  enterAt: number; dimmed?: boolean;
}

const PipelineBlock: React.FC<PipelineBlockProps> = ({ x, y, w, h, color, label, subLabel, enterAt, dimmed = false }) => {
  const { frame, fps } = useScene('full-picture');
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [16, 0]);
  return (
    <g style={{ opacity: p * (dimmed ? 0.5 : 1), transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 - (subLabel ? 6 : 0)} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
      {subLabel && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="monospace" fillOpacity={0.7}>{subLabel}</text>
      )}
    </g>
  );
};

/* ── incremental step row ─────────────────────────────── */

const StepRow: React.FC<{ x: number; y: number; num: number; text: string; when: string; enterAt: number; maxW: number }> = ({ x, y, num, text, when, enterAt, maxW }) => {
  const { frame, fps } = useScene('full-picture');
  const p = entranceSpring(frame, fps, enterAt);
  return (
    <g style={{ opacity: p }}>
      <circle cx={x + 12} cy={y + 10} r={12} fill={COLORS.accent} fillOpacity={0.1} stroke={COLORS.accent} strokeWidth={1} />
      <text x={x + 12} y={y + 11} textAnchor="middle" dominantBaseline="central" fill={COLORS.accent} fontSize={FONT_SIZE.xs} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{num}</text>
      <text x={x + 32} y={y + 11} dominantBaseline="central" fill={COLORS.dark} fontSize={FONT_SIZE.md} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>{text}</text>
      <text x={x + maxW} y={y + 11} textAnchor="end" dominantBaseline="central" fill={COLORS.lightStroke} fontSize={FONT_SIZE.xs} fontFamily="monospace">{when}</text>
    </g>
  );
};

/* ── scene ─────────────────────────────────────────────── */

export const FullPictureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('full-picture');

  const diagP = progress('show-full-diagram');
  const flowP = progress('animate-flow');
  const incP = progress('show-incremental');
  const finalP = progress('final-frame');

  // Pipeline layout
  const pipeY = grid.y(0.16);
  const pipeH = 60;
  const totalW = grid.x(0.82);
  const startX = grid.x(0.09);
  const blockCount = 6;
  const gap = 12;
  const blockW = (totalW - gap * (blockCount - 1)) / blockCount;

  const modules = [
    { label: 'Routing', color: MODULE_COLORS.routing },
    { label: 'Query', subLabel: 'Construction', color: MODULE_COLORS.queryConstruction },
    { label: 'Query', subLabel: 'Translation', color: MODULE_COLORS.queryTranslation },
    { label: 'Indexing', subLabel: '+ Data Sources', color: MODULE_COLORS.indexing },
    { label: 'Retrieval', subLabel: '+ Ranking', color: MODULE_COLORS.retrieval },
    { label: 'Generation', subLabel: '+ Self-RAG', color: MODULE_COLORS.generation },
  ];

  // Incremental steps
  const incX = grid.x(0.08);
  const incStartY = grid.y(0.48);
  const incRowH = 36;
  const incMaxW = grid.x(0.84);

  const steps = [
    { text: 'Start with basic RAG', when: 'Day 1' },
    { text: 'Add routing for multiple sources', when: 'When sources > 1' },
    { text: 'Add query translation', when: 'When recall drops' },
    { text: 'Add re-ranking', when: 'When precision matters' },
    { text: 'Add generation feedback', when: 'When trust matters' },
  ];

  // DashFlow animation line
  const dashY = pipeY + pipeH + 16;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: diagP }}>
        <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={COLORS.dark} fontSize={FONT_SIZE['3xl']} fontWeight={TYPOGRAPHY.heading.fontWeight} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Complete System</text>
      </g>

      {/* "Question" label on far left */}
      <g style={{ opacity: diagP }}>
        <text x={startX - 16} y={pipeY + pipeH / 2 + 1} textAnchor="end" dominantBaseline="central" fill={COLORS.accent} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Question</text>
        <FlowArrow from={{ x: startX - 14, y: pipeY + pipeH / 2 }} to={{ x: startX - 4, y: pipeY + pipeH / 2 }} enterAt={beat('show-full-diagram')} color={COLORS.accent} strokeWidth={1.5} />
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

      {/* "Answer" label on far right */}
      <g style={{ opacity: diagP }}>
        <FlowArrow from={{ x: startX + blockCount * (blockW + gap) - gap + 4, y: pipeY + pipeH / 2 }} to={{ x: startX + blockCount * (blockW + gap) - gap + 14, y: pipeY + pipeH / 2 }} enterAt={beat('show-full-diagram')} color={COLORS.success} strokeWidth={1.5} />
        <text x={startX + blockCount * (blockW + gap) - gap + 18} y={pipeY + pipeH / 2 + 1} dominantBaseline="central" fill={COLORS.success} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>Answer</text>
      </g>

      {/* Connecting arrows between blocks */}
      {modules.slice(0, -1).map((_, i) => {
        const fromX = startX + (i + 1) * (blockW + gap) - gap;
        const toX = startX + (i + 1) * (blockW + gap);
        return (
          <FlowArrow
            key={`arrow-${i}`}
            from={{ x: fromX, y: pipeY + pipeH / 2 }}
            to={{ x: toX, y: pipeY + pipeH / 2 }}
            enterAt={beat('show-full-diagram')} color={COLORS.hairline} strokeWidth={1.5}
          />
        );
      })}

      {/* DashFlow animation across bottom of pipeline */}
      {frame >= beat('animate-flow') && (
        <DashFlow
          from={{ x: startX, y: dashY }}
          to={{ x: startX + blockCount * (blockW + gap) - gap, y: dashY }}
          enterAt={beat('animate-flow')} color={COLORS.accent} strokeWidth={2} speed={40}
        />
      )}

      {/* Self-correction loop: dashed curved arrow from Generation back to Query Translation */}
      {frame >= beat('animate-flow') && (() => {
        const genCenterX = startX + 5 * (blockW + gap) + blockW / 2;
        const qtCenterX = startX + 2 * (blockW + gap) + blockW / 2;
        const loopY = pipeY + pipeH + 40;
        const loopBottomY = loopY + 30;
        const lp = entranceSpring(frame, fps, beat('animate-flow'));
        return (
          <g style={{ opacity: lp * 0.7 }}>
            <path
              d={`M ${genCenterX} ${pipeY + pipeH} C ${genCenterX} ${loopBottomY}, ${qtCenterX} ${loopBottomY}, ${qtCenterX} ${pipeY + pipeH}`}
              fill="none" stroke={MODULE_COLORS.generation} strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round"
            />
            {/* Arrow head pointing up at query translation */}
            <polygon
              points={`${qtCenterX},${pipeY + pipeH} ${qtCenterX - 5},${pipeY + pipeH + 8} ${qtCenterX + 5},${pipeY + pipeH + 8}`}
              fill={MODULE_COLORS.generation}
            />
            <text x={(genCenterX + qtCenterX) / 2} y={loopBottomY + 4} textAnchor="middle" fill={MODULE_COLORS.generation} fontSize={FONT_SIZE.xs} fontFamily="monospace" fillOpacity={0.8}>self-correction loop</text>
          </g>
        );
      })()}

      {/* Incremental adoption card */}
      {frame >= beat('show-incremental') && (
        <g>
          <rect x={incX - 16} y={incStartY - 24} width={incMaxW + 32} height={steps.length * incRowH + 56} rx={12} fill={COLORS.cardFill} stroke={COLORS.hairline} strokeWidth={1} style={{ opacity: incP }} />
          <text x={incX} y={incStartY} fill={COLORS.dark} fontSize={FONT_SIZE.lg} fontWeight={TYPOGRAPHY.subheading.fontWeight} fontFamily={TYPOGRAPHY.subheading.fontFamily} style={{ opacity: incP }}>Incremental Adoption</text>

          {steps.map((step, i) => (
            <StepRow
              key={i} x={incX} y={incStartY + 20 + i * incRowH}
              num={i + 1} text={step.text} when={step.when}
              enterAt={beat('show-incremental')} maxW={incMaxW}
            />
          ))}
        </g>
      )}

      {/* Final frame text */}
      <g style={{ opacity: finalP }}>
        <text x={grid.center().x} y={grid.y(0.92)} textAnchor="middle" fill={COLORS.dark} fontSize={FONT_SIZE['2xl']} fontWeight={TYPOGRAPHY.heading.fontWeight} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Production RAG
        </text>
        <text x={grid.center().x} y={grid.y(0.96)} textAnchor="middle" fill={COLORS.lightStroke} fontSize={FONT_SIZE.lg} fontWeight={400} fontFamily={TYPOGRAPHY.body.fontFamily}>
          Six modules, incrementally adoptable.
        </text>
      </g>
    </g>
  );
};
