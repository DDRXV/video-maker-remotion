import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const RevealScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('reveal');
  const pNotHuman = progress('show-not-human');
  const pBadge = progress('show-ai-badge');
  const pTrained = progress('show-trained');
  const pConnected = progress('show-connected');
  const pScale = progress('show-scale');

  const cx = grid.center().x;

  return (
    <g>
      {/* "Sarah is not a person." */}
      <g style={{ opacity: pNotHuman }}>
        <text x={cx} y={grid.y(0.06)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['3xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Sarah is not a person.
        </text>
      </g>

      {/* AI Voice Agent badge - larger */}
      <g style={{ opacity: pBadge }}>
        {(() => {
          const scale = interpolate(pBadge, [0, 1], [0.85, 1]);
          const badgeW = 520;
          const badgeH = 88;
          const bx = cx - badgeW / 2;
          const by = grid.y(0.16);
          return (
            <g style={{ transform: `scale(${scale})`, transformOrigin: `${cx}px ${by + badgeH / 2}px` }}>
              <rect x={bx} y={by} width={badgeW} height={badgeH} rx={44}
                fill={C.accentLight} stroke={C.accent} strokeWidth={2.5} />
              {/* Waveform icon (3 bars) */}
              {[18, 30, 22].map((h, i) => (
                <rect key={i} x={bx + 32 + i * 14} y={by + badgeH / 2 - h / 2}
                  width={7} height={h} rx={3.5} fill={C.accent} />
              ))}
              <text x={bx + 92} y={by + badgeH / 2 + 1} dominantBaseline="central"
                fill={C.accent} fontSize={FONT_SIZE['2xl']} fontWeight={700}>
                AI Voice Agent
              </text>
            </g>
          );
        })()}
      </g>

      {/* Three info cards in a row - bigger */}
      {(() => {
        const cards = [
          {
            title: 'Trained on Your Playbook',
            lines: ['Objection handling scripts', 'Closing techniques', 'Escalation rules', 'Tone and pacing'],
            color: C.accent,
            bg: C.accentLight,
            enterAt: beat('show-trained'),
          },
          {
            title: 'Connected to CRM',
            lines: ['Customer history', 'Deal stage + pipeline', 'Past interactions', 'Contract renewal dates'],
            color: C.stt,
            bg: C.sttLight,
            enterAt: beat('show-connected'),
          },
          {
            title: 'Runs at Scale',
            lines: ['500 concurrent calls', 'No breaks, no sick days', '24/7 availability', 'Consistent quality'],
            color: C.green,
            bg: C.greenLight,
            enterAt: beat('show-scale'),
          },
        ];

        const cardW = 490;
        const cardH = 400;
        const cardGap = 32;
        const totalW = cards.length * cardW + (cards.length - 1) * cardGap;
        const startX = cx - totalW / 2;
        const cardY = grid.y(0.32);

        return cards.map((card, ci) => {
          const cp = entranceSpring(frame, fps, card.enterAt);
          const slideY = interpolate(cp, [0, 1], [30, 0]);
          const cardX = startX + ci * (cardW + cardGap);
          return (
            <g key={ci} style={{ opacity: cp, transform: `translateY(${slideY}px)` }}>
              {/* Card */}
              <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={16}
                fill={C.cardFill} stroke={card.color} strokeWidth={2} />
              {/* Accent header */}
              <rect x={cardX} y={cardY} width={cardW} height={60} rx={16}
                fill={card.bg} />
              <rect x={cardX} y={cardY + 40} width={cardW} height={20}
                fill={card.bg} />
              {/* Icon dot */}
              <circle cx={cardX + 30} cy={cardY + 30} r={12}
                fill={card.color} fillOpacity={0.2} stroke={card.color} strokeWidth={1.5} />
              <circle cx={cardX + 30} cy={cardY + 30} r={5} fill={card.color} />
              <text x={cardX + 52} y={cardY + 30} dominantBaseline="central"
                fill={card.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
                {card.title}
              </text>

              {/* Detail rows - bigger */}
              {card.lines.map((line, li) => {
                const lp = entranceSpring(frame, fps, card.enterAt + 6 + li * 3);
                const rowY = cardY + 84 + li * 74;
                return (
                  <g key={li} style={{ opacity: lp }}>
                    <rect x={cardX + 20} y={rowY} width={cardW - 40} height={58} rx={10}
                      fill={card.bg} fillOpacity={0.5} stroke={card.color} strokeWidth={0.5} />
                    {/* Bullet dot */}
                    <circle cx={cardX + 44} cy={rowY + 29} r={5}
                      fill={card.color} fillOpacity={0.6} />
                    <text x={cardX + 62} y={rowY + 29} dominantBaseline="central"
                      fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={500}>
                      {line}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        });
      })()}

      {/* Ambient particles */}
      {[...Array(6)].map((_, i) => {
        const px = 200 + i * 280 + Math.sin(frame * 0.02 + i * 1.4) * 18;
        const py = 100 + Math.sin(frame * 0.015 + i * 2.2) * 24;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.07 + Math.sin(frame * 0.03 + i) * 0.04} />
        );
      })}
    </g>
  );
};
