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
  dataShape: string;
  color: string;
  bgColor: string;
  beatLabel: string;
}

const steps: PipelineStep[] = [
  { id: 'text', label: 'Text In', sublabel: '"How does..."', dataShape: 'Raw string', color: BBG.dark, bgColor: '#f1f5f9', beatLabel: 'show-pipeline' },
  { id: 'tokenizer', label: 'Tokenizer', sublabel: 'Text → Token IDs', dataShape: '[15496, 38, 2898, ...]', color: BBG.orange, bgColor: BBG.orangeLight, beatLabel: 'show-tokenizer' },
  { id: 'embedding', label: 'Embedding', sublabel: 'IDs → Vectors', dataShape: '(n, 4096) float32', color: BBG.purple, bgColor: BBG.purpleLight, beatLabel: 'show-embedding' },
  { id: 'transformers', label: 'Transformers', sublabel: '80+ blocks', dataShape: '(n, 4096) refined', color: BBG.accent, bgColor: BBG.accentLight, beatLabel: 'show-transformers' },
  { id: 'output', label: 'Output Layer', sublabel: '→ Probabilities', dataShape: '(1, 100K) softmax', color: BBG.teal, bgColor: BBG.tealLight, beatLabel: 'show-output' },
];

export const FullPictureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('full-picture');

  const pLoop = progress('show-loop');
  const pFinal = progress('show-final');

  const pipelineY = grid.y(0.3);
  const cardW = 200;
  const cardH = 160;
  const startX = grid.x(0.01);
  const totalW = grid.x(0.82) - startX;
  const gap = (totalW - steps.length * cardW) / (steps.length - 1);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: progress('show-pipeline') }}>
        <text x={grid.center().x} y={grid.y(0.06)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE['3xl']} fontWeight={800} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Complete LLM Pipeline
        </text>
        <line x1={grid.center().x - 160} y1={grid.y(0.06) + 16}
          x2={grid.center().x + 160} y2={grid.y(0.06) + 16}
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

        const isTransformer = step.id === 'transformers';

        return (
          <g key={step.id} style={{ opacity: focusOp, transform: `translateY(${slideY}px)` }}>
            {/* Card */}
            <rect x={cx} y={pipelineY} width={cardW} height={cardH} rx={14}
              fill={step.bgColor} stroke={step.color} strokeWidth={2} />

            {/* Number badge */}
            <circle cx={cx + cardW / 2} cy={pipelineY - 16} r={16}
              fill={step.color} fillOpacity={0.15} stroke={step.color} strokeWidth={1.5} />
            <text x={cx + cardW / 2} y={pipelineY - 16} textAnchor="middle" dominantBaseline="central"
              fill={step.color} fontSize={FONT_SIZE.xs} fontWeight={700}>{i + 1}</text>

            {/* Label */}
            <text x={cx + cardW / 2} y={pipelineY + 32} textAnchor="middle" fill={step.color}
              fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
              {step.label}
            </text>
            <text x={cx + cardW / 2} y={pipelineY + 58} textAnchor="middle" fill={BBG.mid}
              fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.label.fontFamily}>
              {step.sublabel}
            </text>

            {/* Transformer internal detail — mini Attention + FFN */}
            {isTransformer && (
              <g>
                <rect x={cx + 14} y={pipelineY + 72} width={cardW - 28} height={28} rx={6}
                  fill={BBG.tealLight} stroke={BBG.teal} strokeWidth={1} />
                <text x={cx + cardW / 2} y={pipelineY + 90} textAnchor="middle" fill={BBG.teal}
                  fontSize={12} fontWeight={600}>Self-Attention</text>
                <rect x={cx + 14} y={pipelineY + 106} width={cardW - 28} height={28} rx={6}
                  fill={BBG.purpleLight} stroke={BBG.purple} strokeWidth={1} />
                <text x={cx + cardW / 2} y={pipelineY + 124} textAnchor="middle" fill={BBG.purple}
                  fontSize={12} fontWeight={600}>Feed-Forward</text>
                {/* Repeat indicator */}
                <text x={cx + cardW - 10} y={pipelineY + 145} textAnchor="end" fill={BBG.light}
                  fontSize={11} fontStyle="italic">×80</text>
              </g>
            )}

            {/* Non-transformer cards: decorative content */}
            {!isTransformer && step.id === 'tokenizer' && (
              <g>
                {['Chat', 'G', 'PT'].map((tok, ti) => (
                  <rect key={ti} x={cx + 16 + ti * 58} y={pipelineY + 76} width={50} height={24} rx={5}
                    fill={step.color} fillOpacity={0.12} stroke={step.color} strokeWidth={0.8} />
                ))}
                {['Chat', 'G', 'PT'].map((tok, ti) => (
                  <text key={`t-${ti}`} x={cx + 41 + ti * 58} y={pipelineY + 93} textAnchor="middle"
                    fill={step.color} fontSize={11} fontWeight={500} fontFamily="monospace">{tok}</text>
                ))}
              </g>
            )}

            {!isTransformer && step.id === 'embedding' && (
              <g>
                {[0.28, -0.14, 0.89, '...'].map((v, vi) => (
                  <rect key={vi} x={cx + 10 + vi * 46} y={pipelineY + 76} width={40} height={24} rx={4}
                    fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.8} />
                ))}
                {[0.28, -0.14, 0.89, '...'].map((v, vi) => (
                  <text key={`v-${vi}`} x={cx + 30 + vi * 46} y={pipelineY + 92} textAnchor="middle"
                    fill={step.color} fontSize={10} fontFamily="monospace">{typeof v === 'number' ? v.toFixed(2) : v}</text>
                ))}
              </g>
            )}

            {!isTransformer && step.id === 'output' && (
              <g>
                {/* Mini probability bars */}
                {[0.23, 0.15, 0.08, 0.04].map((p, pi) => (
                  <g key={pi}>
                    <rect x={cx + 16} y={pipelineY + 76 + pi * 18} width={p * 500} height={12} rx={3}
                      fill={step.color} fillOpacity={pi === 0 ? 0.5 : 0.2} />
                  </g>
                ))}
              </g>
            )}

            {/* Data shape annotation */}
            <text x={cx + cardW / 2} y={pipelineY + cardH + 22} textAnchor="middle" fill={BBG.light}
              fontSize={FONT_SIZE.xs} fontFamily="monospace" fontWeight={400}>
              {step.dataShape}
            </text>
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
        const tx = startX + (steps.length - 1) * (cardW + gap) + cardW + 30;
        return (
          <g style={{ opacity: tp }}>
            <rect x={tx} y={pipelineY + 40} width={110} height={68} rx={14}
              fill={BBG.greenLight} stroke={BBG.green} strokeWidth={2} />
            <text x={tx + 55} y={pipelineY + 70} textAnchor="middle" fill={BBG.green}
              fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="monospace">
              "the"
            </text>
            <text x={tx + 55} y={pipelineY + 92} textAnchor="middle" fill={BBG.mid}
              fontSize={12}>23% prob</text>
          </g>
        );
      })()}

      {/* Loop arc */}
      <g style={{ opacity: pLoop }}>
        {(() => {
          const rightX = startX + (steps.length - 1) * (cardW + gap) + cardW + 80;
          const leftX = startX + cardW / 2;
          const loopY = pipelineY + cardH + 60;
          const d = `M ${rightX} ${pipelineY + cardH + 4} C ${rightX} ${loopY + 40}, ${leftX} ${loopY + 40}, ${leftX} ${pipelineY + cardH + 4}`;
          const pathLen = 1000;
          const lp = entranceSpring(frame, fps, beat('show-loop'));
          const offset = interpolate(lp, [0, 1], [pathLen, 0]);

          return (
            <g>
              <path d={d} fill="none" stroke={BBG.accent} strokeWidth={2}
                strokeDasharray="8 5" strokeDashoffset={offset} strokeLinecap="round" />
              {/* Label badge */}
              <rect x={grid.center().x - 140} y={loopY + 24} width={280} height={40} rx={20}
                fill={BBG.accentLight} stroke={BBG.accent} strokeWidth={1.5} />
              <text x={grid.center().x} y={loopY + 48} textAnchor="middle" fill={BBG.accent}
                fontSize={FONT_SIZE.sm} fontWeight={600}>
                Append token, repeat until done
              </text>
            </g>
          );
        })()}
      </g>

      {/* Final message */}
      <g style={{ opacity: pFinal }}>
        <text x={grid.center().x} y={grid.y(0.9)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Billions of parameters. One job: predict the next token.
        </text>
      </g>
    </g>
  );
};
