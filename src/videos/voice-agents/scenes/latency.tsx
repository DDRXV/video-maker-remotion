import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const LatencyScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('latency');
  const pTitle = progress('show-title');
  const pBudget = progress('show-budget-bar');
  const pSTT = progress('show-stt-chunk');
  const pLLM = progress('show-llm-stream');
  const pTTS = progress('show-tts-chunk');
  const pFit = progress('show-total-fit');

  const budgetW = grid.x(0.86);
  const budgetX = grid.x(0.07);
  const budgetY = grid.y(0.10);

  // Strategy cards - ordered to match pipeline: STT, LLM/Interruption, TTS
  const strategies = [
    {
      title: 'Streaming STT',
      color: C.stt,
      bg: C.sttLight,
      enterAt: beat('show-stt-chunk'),
      lines: [
        'Transcribe as customer speaks',
        'Partial results every 50ms',
        'No waiting for full sentence',
        'Final result: high confidence',
      ],
    },
    {
      title: 'Chunked TTS',
      color: C.tts,
      bg: C.ttsLight,
      enterAt: beat('show-tts-chunk'),
      lines: [
        'Start speaking sentence 1',
        'While LLM generates sentence 2',
        'Overlap generation + playback',
        'Perceived latency: near zero',
      ],
    },
    {
      title: 'Interruption Detection',
      color: C.red,
      bg: C.redLight,
      enterAt: beat('show-llm-stream'),
      lines: [
        'Customer starts talking?',
        'Stop TTS playback instantly',
        'Cancel pending LLM tokens',
        'Resume listening mode',
      ],
    },
  ];

  const cardW = 490;
  const cardH = 310;
  const cardGap = 32;
  const totalCardsW = 3 * cardW + 2 * cardGap;
  const cardsStartX = grid.center().x - totalCardsW / 2;
  const cardY = grid.y(0.36);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Latency Budget
        </text>
      </g>

      {/* 500ms budget bar */}
      <g style={{ opacity: pBudget }}>
        {/* Total budget track */}
        <rect x={budgetX} y={budgetY} width={budgetW} height={56} rx={12}
          fill="#f1f5f9" stroke={C.hairline} strokeWidth={1.5} />
        <text x={budgetX + 24} y={budgetY + 28} dominantBaseline="central"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={700}>
          500ms Budget
        </text>
        <text x={budgetX + budgetW - 24} y={budgetY + 28} dominantBaseline="central"
          textAnchor="end" fill={C.mid} fontSize={FONT_SIZE.md}>
          Anything longer feels unnatural
        </text>

        {/* Segmented bar below */}
        {(() => {
          const barY = budgetY + 72;
          const barH = 52;
          const segments = [
            { label: 'STT', ms: '100ms', fraction: 0.2, color: C.stt, bg: C.sttLight, enterAt: beat('show-stt-chunk') },
            { label: 'LLM', ms: '200ms', fraction: 0.4, color: C.llm, bg: C.llmLight, enterAt: beat('show-llm-stream') },
            { label: 'TTS', ms: '150ms', fraction: 0.3, color: C.tts, bg: C.ttsLight, enterAt: beat('show-tts-chunk') },
          ];
          let offset = 0;
          return (
            <g>
              {segments.map((seg, i) => {
                const sx = budgetX + offset * budgetW;
                const sw = seg.fraction * budgetW;
                offset += seg.fraction;
                const sp = entranceSpring(frame, fps, seg.enterAt);
                const animW = interpolate(sp, [0, 1], [0, sw]);
                return (
                  <g key={i} style={{ opacity: sp }}>
                    <rect x={sx} y={barY} width={sw} height={barH}
                      rx={i === 0 ? 10 : 0}
                      fill={seg.bg} stroke={seg.color} strokeWidth={0.5} />
                    <rect x={sx} y={barY} width={animW} height={barH}
                      rx={i === 0 ? 10 : 0}
                      fill={seg.color} fillOpacity={0.25} />
                    <text x={sx + sw / 2} y={barY + barH / 2} textAnchor="middle"
                      dominantBaseline="central" fill={seg.color}
                      fontSize={FONT_SIZE.lg} fontWeight={700}>
                      {seg.label} {seg.ms}
                    </text>
                  </g>
                );
              })}
              {/* 50ms buffer */}
              {(() => {
                const bufX = budgetX + 0.9 * budgetW;
                const bufW = 0.1 * budgetW;
                return (
                  <g style={{ opacity: pTTS }}>
                    <rect x={bufX} y={barY} width={bufW} height={barH}
                      rx={0} fill={C.greenLight} stroke={C.green} strokeWidth={0.5} />
                    <text x={bufX + bufW / 2} y={barY + barH / 2} textAnchor="middle"
                      dominantBaseline="central" fill={C.green}
                      fontSize={FONT_SIZE.md} fontWeight={600}>
                      50ms buffer
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })()}
      </g>

      {/* Strategy cards */}
      {strategies.map((strat, i) => {
        const sp = entranceSpring(frame, fps, strat.enterAt);
        const slideY = interpolate(sp, [0, 1], [24, 0]);
        const ccx = cardsStartX + i * (cardW + cardGap);

        return (
          <g key={i} style={{ opacity: sp, transform: `translateY(${slideY}px)` }}>
            <rect x={ccx} y={cardY} width={cardW} height={cardH} rx={14}
              fill={C.cardFill} stroke={strat.color} strokeWidth={2} />
            {/* Header */}
            <rect x={ccx} y={cardY} width={cardW} height={56} rx={14}
              fill={strat.bg} />
            <rect x={ccx} y={cardY + 36} width={cardW} height={20}
              fill={strat.bg} />
            <text x={ccx + 24} y={cardY + 30} dominantBaseline="central"
              fill={strat.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {strat.title}
            </text>

            {/* Detail rows */}
            {strat.lines.map((line, li) => {
              const lp = entranceSpring(frame, fps, strat.enterAt + 4 + li * 3);
              const ry = cardY + 72 + li * 56;
              return (
                <g key={li} style={{ opacity: lp }}>
                  <rect x={ccx + 18} y={ry} width={cardW - 36} height={44} rx={8}
                    fill={strat.bg} fillOpacity={0.4} />
                  <circle cx={ccx + 38} cy={ry + 22} r={5}
                    fill={strat.color} fillOpacity={0.6} />
                  <text x={ccx + 56} y={ry + 25} dominantBaseline="central"
                    fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={500}>
                    {line}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Total fit summary */}
      <g style={{ opacity: pFit }}>
        <text x={grid.center().x} y={grid.y(0.90)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Every millisecond is accounted for. That is what makes it feel real.
        </text>
      </g>

      {/* Ambient particles */}
      {[...Array(5)].map((_, i) => {
        const px = 240 + i * 320 + Math.sin(frame * 0.02 + i * 1.6) * 16;
        const py = 130 + Math.sin(frame * 0.016 + i * 2.3) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.027 + i) * 0.04} />
        );
      })}
    </g>
  );
};
