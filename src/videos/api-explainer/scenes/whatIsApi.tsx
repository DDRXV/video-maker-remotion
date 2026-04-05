import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring, pulse } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const WhatIsApiScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('what-is-api');
  const pTitle = progress('show-title');
  const pSteps = progress('show-three-steps');
  const pReq = progress('show-request');
  const pProc = progress('show-processing');
  const pResp = progress('show-response');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;

  // Three-step flow: left → center → right
  const stepW = 420;
  const stepH = 320;
  const stepGap = 60;
  const totalW = 3 * stepW + 2 * stepGap;
  const startX = cx - totalW / 2;
  const stepY = grid.y(0.16);

  const steps = [
    {
      label: 'Your App',
      sublabel: 'Sends a request',
      color: C.accent,
      bg: C.accentLight,
      progress: pReq,
      enterAt: beat('show-request'),
      detail: [
        'POST /v1/charges',
        'amount: 4900',
        'currency: "usd"',
        'description: "Pro plan"',
      ],
    },
    {
      label: 'Stripe',
      sublabel: 'Does the work',
      color: C.stripe,
      bg: C.stripeLight,
      progress: pProc,
      enterAt: beat('show-processing'),
      detail: [
        'Validate card',
        'Contact bank',
        'Process $49.00',
        'Generate receipt',
      ],
    },
    {
      label: 'Response',
      sublabel: 'Sends back result',
      color: C.green,
      bg: C.greenLight,
      progress: pResp,
      enterAt: beat('show-response'),
      detail: [
        'status: "succeeded"',
        'receipt: #4829',
        'amount: $49.00',
        'card: ****4242',
      ],
    },
  ];

  // Focus: most recently activated step
  const activeSteps = steps.filter(s => s.progress > 0.5);
  const focusedIdx = activeSteps.length > 0
    ? steps.indexOf(activeSteps.reduce((a, b) => a.enterAt > b.enterAt ? a : b))
    : -1;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          What is an API?
        </text>
      </g>

      {/* Three-step label */}
      <g style={{ opacity: pSteps }}>
        <text x={cx} y={grid.y(0.10)} textAnchor="middle"
          fill={C.mid} fontSize={FONT_SIZE.lg}>
          Three steps. That is all it is.
        </text>
      </g>

      {/* Step cards */}
      {steps.map((step, i) => {
        const sp = step.progress;
        const sx = startX + i * (stepW + stepGap);
        const slideY = interpolate(sp, [0, 1], [20, 0]);
        const isFocused = i === focusedIdx && pSummary < 0.5;
        const isRevealed = sp > 0.5;
        const dimFactor = pSummary > 0.5 ? 0.7 : (isFocused ? 1 : (isRevealed ? 0.35 : 1));

        return (
          <g key={i} style={{ opacity: sp * dimFactor, transform: `translateY(${slideY}px)` }}>
            {/* Halo */}
            {isFocused && (
              <rect x={sx - 8} y={stepY - 8} width={stepW + 16} height={stepH + 16} rx={20}
                fill={step.color} fillOpacity={0.06} />
            )}

            <rect x={sx} y={stepY} width={stepW} height={stepH} rx={16}
              fill={C.cardFill} stroke={step.color}
              strokeWidth={isFocused ? 2.5 : 1.5}
              filter={isFocused ? 'url(#shadow-md)' : undefined} />

            {/* Left stripe */}
            <rect x={sx} y={stepY + 10} width={6} height={stepH - 20} rx={3}
              fill={step.color} fillOpacity={isFocused ? 0.8 : 0.3} />

            {/* Step number */}
            <circle cx={sx + 36} cy={stepY + 36} r={16}
              fill="none" stroke={step.color} strokeWidth={1.5} />
            <text x={sx + 36} y={stepY + 36} textAnchor="middle" dominantBaseline="central"
              fill={step.color} fontSize={FONT_SIZE.md} fontWeight={700}>
              {i + 1}
            </text>

            {/* Labels */}
            <text x={sx + 62} y={stepY + 30} dominantBaseline="central"
              fill={step.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {step.label}
            </text>
            <text x={sx + 62} y={stepY + 58} dominantBaseline="central"
              fill={C.mid} fontSize={FONT_SIZE.md}>
              {step.sublabel}
            </text>

            {/* Detail lines */}
            {step.detail.map((line, li) => {
              const lp = entranceSpring(frame, fps, step.enterAt + 6 + li * 4);
              const ly = stepY + 86 + li * 52;
              return (
                <g key={li} style={{ opacity: lp }}>
                  <rect x={sx + 18} y={ly} width={stepW - 36} height={42} rx={8}
                    fill={step.bg} fillOpacity={0.5} stroke={step.color} strokeWidth={0.5} />
                  <text x={sx + 34} y={ly + 24} dominantBaseline="central"
                    fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={500}
                    fontFamily={TYPOGRAPHY.mono.fontFamily}>
                    {line}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Arrows between steps */}
      {[0, 1].map(i => {
        const nextP = steps[i + 1].progress;
        const ap = entranceSpring(frame, fps, steps[i + 1].enterAt - 3);
        const x1 = startX + i * (stepW + stepGap) + stepW + 4;
        const x2 = startX + (i + 1) * (stepW + stepGap) - 4;
        const ay = stepY + stepH / 2;
        const len = x2 - x1;
        const offset = interpolate(ap, [0, 1], [len, 0]);
        return (
          <g key={`arr-${i}`} style={{ opacity: ap }}>
            <line x1={x1} y1={ay} x2={x2} y2={ay}
              stroke={steps[i + 1].color} strokeWidth={2} strokeLinecap="round"
              strokeDasharray={`${len}`} strokeDashoffset={offset} />
            <polyline
              points={`${x2 - 10},${ay - 7} ${x2},${ay} ${x2 - 10},${ay + 7}`}
              fill="none" stroke={steps[i + 1].color} strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.88)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Your app never touches the bank. It just asked Stripe to do the job.
        </text>
      </g>

      {/* Particles */}
      {[...Array(5)].map((_, i) => {
        const px = 240 + i * 310 + Math.sin(frame * 0.02 + i * 1.3) * 16;
        const py = 80 + Math.sin(frame * 0.017 + i * 2) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.api} fillOpacity={0.06 + Math.sin(frame * 0.025 + i) * 0.04} />
        );
      })}
    </g>
  );
};
