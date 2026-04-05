import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const OrchestrationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('orchestration');
  const pTitle = progress('show-title');
  const pUnderstand = progress('show-understand');
  const pBreakDown = progress('show-break-down');
  const pDelegate = progress('show-delegate');
  const pCollect = progress('show-collect');
  const pSynthesize = progress('show-synthesize');

  const steps = [
    { label: 'Understand', sub: 'Parse request', color: C.accent, beatP: pUnderstand },
    { label: 'Break Down', sub: 'Identify subtasks', color: C.blue, beatP: pBreakDown },
    { label: 'Delegate', sub: 'Spawn agents', color: C.purple, beatP: pDelegate },
    { label: 'Collect', sub: 'Gather results', color: C.green, beatP: pCollect },
    { label: 'Synthesize', sub: 'Build response', color: C.accent, beatP: pSynthesize },
  ];

  const pipeY = grid.y(0.38);
  const cardW = 180;
  const cardH = 100;
  const startX = grid.x(0.02);
  const totalW = grid.x(0.96) - startX;
  const gap = (totalW - steps.length * cardW) / (steps.length - 1);

  const latestIdx = (() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].beatP > 0.05) return i;
    }
    return -1;
  })();

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>7</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Orchestration Pattern</text>
      </g>

      {/* Pipeline steps */}
      {steps.map((step, i) => {
        const cx = startX + i * (cardW + gap);
        const slideY = interpolate(step.beatP, [0, 1], [20, 0]);
        const dist = latestIdx - i;
        const focusOp = step.beatP > 0.05 ? (dist === 0 ? 1 : dist <= 1 ? 0.55 : 0.3) : 0;

        return (
          <g key={i} style={{ opacity: focusOp, transform: `translateY(${slideY}px)` }}>
            {/* Number badge */}
            <circle cx={cx + cardW / 2} cy={pipeY - 18} r={16}
              fill={step.color} fillOpacity={0.15} stroke={step.color} strokeWidth={1.5} />
            <text x={cx + cardW / 2} y={pipeY - 18} textAnchor="middle" dominantBaseline="central"
              fill={step.color} fontSize={FONT_SIZE.xs} fontWeight={700}>{i + 1}</text>

            {/* Card */}
            <rect x={cx} y={pipeY} width={cardW} height={cardH} rx={14}
              fill={C.cardFill} stroke={step.color} strokeWidth={2} />
            <text x={cx + cardW / 2} y={pipeY + 36} textAnchor="middle" fill={step.color}
              fontSize={FONT_SIZE.md} fontWeight={700}>{step.label}</text>
            <text x={cx + cardW / 2} y={pipeY + 62} textAnchor="middle" fill={C.mid}
              fontSize={FONT_SIZE.sm}>{step.sub}</text>

            {/* Internal detail */}
            {step.label === 'Delegate' && (
              <g>
                {[0, 1, 2].map(j => (
                  <rect key={j} x={cx + 20 + j * 52} y={pipeY + 74} width={44} height={16} rx={4}
                    fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.8} />
                ))}
              </g>
            )}
            {step.label === 'Collect' && (
              <g>
                {[0, 1, 2].map(j => (
                  <rect key={j} x={cx + 20 + j * 52} y={pipeY + 74} width={44} height={16} rx={4}
                    fill={C.green} fillOpacity={0.15} stroke={C.green} strokeWidth={0.8} />
                ))}
              </g>
            )}

            {/* Arrow to next */}
            {i < steps.length - 1 && (() => {
              const ap = entranceSpring(frame, fps, beat(steps[i].label === 'Understand' ? 'show-understand' : steps[i].label === 'Break Down' ? 'show-break-down' : steps[i].label === 'Delegate' ? 'show-delegate' : steps[i].label === 'Collect' ? 'show-collect' : 'show-synthesize') + 8);
              const fromX = cx + cardW + 4;
              const toX = cx + cardW + gap - 4;
              const len = toX - fromX;
              const offset = interpolate(ap, [0, 1], [len, 0]);
              return (
                <g>
                  <line x1={fromX} y1={pipeY + cardH / 2} x2={toX} y2={pipeY + cardH / 2}
                    stroke={C.mid} strokeWidth={2} strokeLinecap="round"
                    strokeDasharray={len} strokeDashoffset={offset}
                    style={{ opacity: ap }} />
                  <polyline points={`${toX - 10},${pipeY + cardH / 2 - 7} ${toX},${pipeY + cardH / 2} ${toX - 10},${pipeY + cardH / 2 + 7}`}
                    fill="none" stroke={C.mid} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
                    style={{ opacity: ap }} />
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* "Like a tech lead" analogy */}
      <g style={{ opacity: pSynthesize }}>
        <text x={grid.center().x} y={grid.y(0.72)} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.lg}>
          Like a tech lead assigning work to specialists.
        </text>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Plan. Delegate. Synthesize.
        </text>
      </g>
    </g>
  );
};
