import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const StripeScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('stripe');
  const pTitle = progress('show-title');
  const pReq = progress('show-app-request');
  const pUrl = progress('show-checkout-url');
  const pPays = progress('show-customer-pays');
  const pWebhook = progress('show-webhook');
  const pHandles = progress('show-stripe-handles');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;

  // Flow: 4 stages left to right
  const stageW = 340;
  const stageH = 380;
  const stageGap = 40;
  const totalW = 4 * stageW + 3 * stageGap;
  const startX = cx - totalW / 2;
  const stageY = grid.y(0.12);

  const stages = [
    {
      label: 'Your App',
      color: C.accent,
      progress: pReq,
      enterAt: beat('show-app-request'),
      lines: [
        'stripe.checkout.sessions',
        '  .create({',
        '  product: "Pro Plan",',
        '  price: 4900,',
        '  redirect: "/thanks"',
        '  })',
      ],
    },
    {
      label: 'Stripe Checkout',
      color: C.stripe,
      progress: pUrl,
      enterAt: beat('show-checkout-url'),
      lines: [
        'Hosted payment page',
        'Card form + validation',
        'Apple Pay / Google Pay',
        'PCI compliant',
        'Fraud detection',
      ],
    },
    {
      label: 'Customer Pays',
      color: C.green,
      progress: pPays,
      enterAt: beat('show-customer-pays'),
      lines: [
        'Enters card details',
        'On Stripe\'s page',
        'You never see the card',
        'Bank authorizes',
        'Payment completes',
      ],
    },
    {
      label: 'Webhook',
      color: C.amber,
      progress: pWebhook,
      enterAt: beat('show-webhook'),
      lines: [
        'event: payment_intent',
        '  .succeeded',
        'amount: $49.00',
        'customer: cus_abc',
        'receipt: re_4829',
      ],
    },
  ];

  const activeStages = stages.filter(s => s.progress > 0.5);
  const focusedIdx = activeStages.length > 0
    ? stages.indexOf(activeStages.reduce((a, b) => a.enterAt > b.enterAt ? a : b))
    : -1;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Payments: Stripe
        </text>
      </g>

      {/* Stage cards */}
      {stages.map((stage, i) => {
        const sp = stage.progress;
        const sx = startX + i * (stageW + stageGap);
        const slideY = interpolate(sp, [0, 1], [16, 0]);
        const isFocused = i === focusedIdx && pHandles < 0.5;
        const isRevealed = sp > 0.5;
        const dimFactor = pHandles > 0.5 ? 0.7 : (isFocused ? 1 : (isRevealed ? 0.35 : 1));
        const isMono = i === 0 || i === 3;

        return (
          <g key={i} style={{ opacity: sp * dimFactor, transform: `translateY(${slideY}px)` }}>
            {isFocused && (
              <rect x={sx - 8} y={stageY - 8} width={stageW + 16} height={stageH + 16} rx={20}
                fill={stage.color} fillOpacity={0.06} />
            )}

            <rect x={sx} y={stageY} width={stageW} height={stageH} rx={16}
              fill={isMono ? C.codeBg : C.cardFill}
              stroke={stage.color} strokeWidth={isFocused ? 2.5 : 1.5}
              filter={isFocused ? 'url(#shadow-md)' : undefined} />
            <rect x={sx} y={stageY + 10} width={6} height={stageH - 20} rx={3}
              fill={stage.color} fillOpacity={isFocused ? 0.8 : 0.3} />

            {/* Step number + label */}
            <circle cx={sx + 32} cy={stageY + 34} r={14}
              fill="none" stroke={stage.color} strokeWidth={1.5} />
            <text x={sx + 32} y={stageY + 34} textAnchor="middle" dominantBaseline="central"
              fill={stage.color} fontSize={FONT_SIZE.sm} fontWeight={700}>
              {i + 1}
            </text>
            <text x={sx + 56} y={stageY + 34} dominantBaseline="central"
              fill={stage.color} fontSize={FONT_SIZE.lg} fontWeight={700}>
              {stage.label}
            </text>

            {/* Detail lines */}
            {stage.lines.map((line, li) => {
              const lp = entranceSpring(frame, fps, stage.enterAt + 4 + li * 3);
              const ly = stageY + 66 + li * 48;
              return (
                <text key={li} x={sx + 28} y={ly + 16}
                  dominantBaseline="central"
                  fill={isMono ? C.codeGreen : C.dark}
                  fontSize={FONT_SIZE.sm}
                  fontWeight={isMono ? 400 : 500}
                  fontFamily={isMono ? TYPOGRAPHY.mono.fontFamily : TYPOGRAPHY.body.fontFamily}
                  style={{ opacity: lp }}>
                  {line}
                </text>
              );
            })}
          </g>
        );
      })}

      {/* Arrows between stages */}
      {[0, 1, 2].map(i => {
        const nextP = stages[i + 1].progress;
        const ap = entranceSpring(frame, fps, stages[i + 1].enterAt - 3);
        const x1 = startX + i * (stageW + stageGap) + stageW + 4;
        const x2 = startX + (i + 1) * (stageW + stageGap) - 4;
        const ay = stageY + stageH / 2;
        const len = x2 - x1;
        const offset = interpolate(ap, [0, 1], [len, 0]);
        // Last arrow goes backwards (webhook returns to app)
        const isReturn = i === 2;
        return (
          <g key={`arr-${i}`} style={{ opacity: ap }}>
            <line x1={x1} y1={ay} x2={x2} y2={ay}
              stroke={stages[i + 1].color} strokeWidth={2} strokeLinecap="round"
              strokeDasharray={isReturn ? '8 4' : `${len}`}
              strokeDashoffset={isReturn ? 0 : offset} />
            <polyline
              points={`${x2 - 8},${ay - 6} ${x2},${ay} ${x2 - 8},${ay + 6}`}
              fill="none" stroke={stages[i + 1].color} strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* What Stripe handles — bottom row */}
      <g style={{ opacity: pHandles }}>
        {['PCI compliance', 'Fraud detection', 'Receipts', 'Refunds'].map((item, i) => {
          const hp = entranceSpring(frame, fps, beat('show-stripe-handles') + i * 3);
          const ix = cx - 400 + i * 220;
          return (
            <g key={i} style={{ opacity: hp }}>
              <circle cx={ix} cy={grid.y(0.82)} r={5}
                fill={C.stripe} fillOpacity={0.5} />
              <text x={ix + 14} y={grid.y(0.82)} dominantBaseline="central"
                fill={C.mid} fontSize={FONT_SIZE.md} fontWeight={500}>
                {item}
              </text>
            </g>
          );
        })}
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.90)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          One API call to start. One webhook to confirm. Stripe handles the rest.
        </text>
      </g>

      {/* Particles */}
      {[...Array(5)].map((_, i) => {
        const px = 250 + i * 300 + Math.sin(frame * 0.02 + i * 1.6) * 14;
        const py = 85 + Math.sin(frame * 0.017 + i * 2.3) * 20;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.stripe} fillOpacity={0.06 + Math.sin(frame * 0.027 + i) * 0.04} />
        );
      })}
    </g>
  );
};
