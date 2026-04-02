import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { FlowArrow } from '../../../components/FlowArrow';
import { BBG, useScene } from '../styles';

interface PipelineStep {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  beatLabel: string;
}

const steps: PipelineStep[] = [
  { id: 'text', label: 'Text In', sublabel: '"How does..."', color: BBG.dark, bgColor: '#f1f5f9', beatLabel: 'show-pipeline' },
  { id: 'tokenizer', label: 'Tokenizer', sublabel: 'Text → IDs', color: BBG.orange, bgColor: BBG.orangeLight, beatLabel: 'show-tokenizer' },
  { id: 'embedding', label: 'Embedding', sublabel: 'IDs → Vectors', color: BBG.purple, bgColor: BBG.purpleLight, beatLabel: 'show-embedding' },
  { id: 'transformers', label: 'Transformers', sublabel: '80+ blocks', color: BBG.accent, bgColor: BBG.accentLight, beatLabel: 'show-transformers' },
  { id: 'output', label: 'Output Layer', sublabel: 'Probabilities', color: BBG.teal, bgColor: BBG.tealLight, beatLabel: 'show-output' },
];

export const FullPictureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('full-picture');

  const pLoop = progress('show-loop');
  const pFinal = progress('show-final');

  const pipelineY = grid.y(0.38);
  const cardW = 180;
  const cardH = 100;
  const startX = grid.x(0.02);
  const totalW = grid.x(0.96) - startX;
  const gap = (totalW - steps.length * cardW) / (steps.length - 1);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: progress('show-pipeline') }}>
        <text x={grid.center().x} y={grid.y(0.08)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE['3xl']} fontWeight={800} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Complete LLM Pipeline
        </text>
        <line x1={grid.center().x - 160} y1={grid.y(0.08) + 16}
          x2={grid.center().x + 160} y2={grid.y(0.08) + 16}
          stroke={BBG.accent} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Pipeline cards */}
      {steps.map((step, i) => {
        const sp = progress(step.beatLabel);
        const cx = startX + i * (cardW + gap);
        const slideY = interpolate(sp, [0, 1], [30, 0]);

        // Focus dimming
        const latestIdx = (() => {
          for (let j = steps.length - 1; j >= 0; j--) {
            if (progress(steps[j].beatLabel) > 0.05) return j;
          }
          return 0;
        })();
        const dist = latestIdx - i;
        const focusOp = sp > 0.05 ? (dist === 0 ? 1 : dist <= 1 ? 0.6 : 0.35) : 0;

        return (
          <g key={step.id} style={{ opacity: focusOp, transform: `translateY(${slideY}px)` }}>
            {/* Card */}
            <rect x={cx} y={pipelineY} width={cardW} height={cardH} rx={14}
              fill={step.bgColor} stroke={step.color} strokeWidth={2} />
            <text x={cx + cardW / 2} y={pipelineY + 38} textAnchor="middle" fill={step.color}
              fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
              {step.label}
            </text>
            <text x={cx + cardW / 2} y={pipelineY + 64} textAnchor="middle" fill={BBG.mid}
              fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.label.fontFamily}>
              {step.sublabel}
            </text>

            {/* Number badge */}
            <circle cx={cx + cardW / 2} cy={pipelineY - 16} r={16}
              fill={step.color} fillOpacity={0.15} stroke={step.color} strokeWidth={1.5} />
            <text x={cx + cardW / 2} y={pipelineY - 16} textAnchor="middle" dominantBaseline="central"
              fill={step.color} fontSize={FONT_SIZE.xs} fontWeight={700}>{i + 1}</text>
          </g>
        );
      })}

      {/* Arrows between cards */}
      {steps.slice(0, -1).map((_, i) => {
        const fromX = startX + i * (cardW + gap) + cardW + 4;
        const toX = startX + (i + 1) * (cardW + gap) - 4;
        return (
          <FlowArrow key={`arrow-${i}`}
            from={{ x: fromX, y: pipelineY + cardH / 2 }}
            to={{ x: toX, y: pipelineY + cardH / 2 }}
            enterAt={beat(steps[i + 1].beatLabel)}
            color={BBG.mid} strokeWidth={2} />
        );
      })}

      {/* Output token */}
      {progress('show-output') > 0.5 && (() => {
        const tp = entranceSpring(frame, fps, beat('show-output') + 10);
        const tx = startX + (steps.length - 1) * (cardW + gap) + cardW + 40;
        return (
          <g style={{ opacity: tp }}>
            <rect x={tx} y={pipelineY + 20} width={100} height={56} rx={12}
              fill={BBG.greenLight} stroke={BBG.green} strokeWidth={2} />
            <text x={tx + 50} y={pipelineY + 54} textAnchor="middle" fill={BBG.green}
              fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="monospace">
              "the"
            </text>
          </g>
        );
      })()}

      {/* Loop arc */}
      <g style={{ opacity: pLoop }}>
        {(() => {
          const rightX = startX + (steps.length - 1) * (cardW + gap) + cardW + 80;
          const leftX = startX + cardW / 2;
          const loopY = pipelineY + cardH + 70;
          const d = `M ${rightX} ${pipelineY + cardH + 4} C ${rightX} ${loopY + 30}, ${leftX} ${loopY + 30}, ${leftX} ${pipelineY + cardH + 4}`;
          const pathLen = 1000;
          const lp = entranceSpring(frame, fps, beat('show-loop'));
          const offset = interpolate(lp, [0, 1], [pathLen, 0]);

          return (
            <g>
              <path d={d} fill="none" stroke={BBG.accent} strokeWidth={2}
                strokeDasharray="8 5" strokeDashoffset={offset} strokeLinecap="round" />
              {/* Label badge */}
              <rect x={grid.center().x - 120} y={loopY + 14} width={240} height={36} rx={18}
                fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={1.5} />
              <text x={grid.center().x} y={loopY + 36} textAnchor="middle" fill={BBG.accent}
                fontSize={FONT_SIZE.sm} fontWeight={600}>
                Append token, repeat until done
              </text>
            </g>
          );
        })()}
      </g>

      {/* Final message */}
      <g style={{ opacity: pFinal }}>
        <text x={grid.center().x} y={grid.y(0.86)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Billions of parameters. One job: predict the next token.
        </text>
      </g>
    </g>
  );
};
