import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';
import { WaveformBar } from '../../../components/WaveformBar';

export const PipelineScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('pipeline');
  const pTitle = progress('show-title');
  const pCustomer = progress('show-customer-speaks');
  const pSTT = progress('show-stt');
  const pLLM = progress('show-llm');
  const pTTS = progress('show-tts');
  const pTotal = progress('show-total');

  const stageW = 380;
  const stageH = 360;
  const stageGap = 24;
  const totalPipeW = 4 * stageW + 3 * stageGap;
  const startX = grid.center().x - totalPipeW / 2;
  const stageY = grid.y(0.12);

  const stages = [
    { label: 'Customer Speaks', color: C.mid, bg: '#f1f5f9' },
    { label: 'Speech-to-Text', color: C.stt, bg: C.sttLight },
    { label: 'LLM + Context', color: C.llm, bg: C.llmLight },
    { label: 'Text-to-Speech', color: C.tts, bg: C.ttsLight },
  ];

  const stageProgress = [pCustomer, pSTT, pLLM, pTTS];
  const stageBeatNames = ['show-customer-speaks', 'show-stt', 'show-llm', 'show-tts'];
  const latencyLabels = ['', '100ms', '200ms', '150ms'];

  const stageDetails: { lines: string[]; mono?: boolean }[] = [
    { lines: ['"Yeah, but the pricing', 'feels steep for what', 'we need."'] },
    { lines: ['Stream as they speak', 'Partials every 50ms', '98.2% confidence'], mono: true },
    { lines: ['CRM + playbook ctx', 'Compare spend data', 'Generate counter'], mono: true },
    { lines: ['Voice: Sarah clone', 'Speed: 1.05x', 'Tone: confident'], mono: true },
  ];

  // Find the most recently activated stage for focus
  const activeStages = stageProgress.map((p, i) => ({ p, i })).filter(s => s.p > 0.5);
  const focusedIdx = activeStages.length > 0
    ? activeStages.reduce((a, b) => beat(stageBeatNames[a.i]) > beat(stageBeatNames[b.i]) ? a : b).i
    : -1;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Real-Time Pipeline
        </text>
      </g>

      {/* Pipeline stages */}
      {stages.map((stage, i) => {
        const sp = stageProgress[i];
        const sx = startX + i * (stageW + stageGap);
        const slideY = interpolate(sp, [0, 1], [16, 0]);

        const isFocused = i === focusedIdx && pTotal < 0.5;
        const isRevealed = sp > 0.5;
        // When total shows, bring all cards back to full opacity
        const dimFactor = pTotal > 0.5 ? 0.7 : (isFocused ? 1 : (isRevealed ? 0.35 : 1));

        return (
          <g key={i} style={{ opacity: sp * dimFactor, transform: `translateY(${slideY}px)` }}>
            {/* Color zone halo when focused */}
            {isFocused && (
              <rect x={sx - 8} y={stageY - 8} width={stageW + 16} height={stageH + 16} rx={20}
                fill={stage.color} fillOpacity={0.06} />
            )}

            {/* Card */}
            <rect x={sx} y={stageY} width={stageW} height={stageH} rx={16}
              fill={C.cardFill} stroke={stage.color}
              strokeWidth={isFocused ? 2.5 : 1.5}
              filter={isFocused ? 'url(#shadow-md)' : undefined} />

            {/* Left accent stripe */}
            <rect x={sx} y={stageY + 12} width={6} height={stageH - 24} rx={3}
              fill={stage.color} fillOpacity={isFocused ? 0.8 : 0.3} />

            {/* Header text */}
            <text x={sx + 24} y={stageY + 36} dominantBaseline="central"
              fill={stage.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {stage.label}
            </text>

            {/* Waveform for customer stage */}
            {i === 0 && (
              <WaveformBar
                x={sx + 24} y={stageY + 60} width={stageW - 48} height={44}
                color={stage.color} enterAt={beat(stageBeatNames[i]) + 4}
                frame={frame} fps={fps} barCount={18} active={pSTT < 0.5}
              />
            )}

            {/* Internal detail lines */}
            {stageDetails[i].lines.map((line, li) => {
              const lp = entranceSpring(frame, fps, beat(stageBeatNames[i]) + 6 + li * 4);
              const baseY = stageY + (i === 0 ? 120 : 68);
              const ly = baseY + li * 56;
              return (
                <g key={li} style={{ opacity: lp }}>
                  <rect x={sx + 18} y={ly} width={stageW - 36} height={44} rx={8}
                    fill={stage.bg} fillOpacity={0.5} stroke={stage.color} strokeWidth={0.5} />
                  <text x={sx + 34} y={ly + 26} dominantBaseline="central"
                    fill={C.dark}
                    fontSize={stageDetails[i].mono ? FONT_SIZE.sm : FONT_SIZE.md}
                    fontWeight={500}
                    fontFamily={stageDetails[i].mono ? TYPOGRAPHY.mono.fontFamily : TYPOGRAPHY.body.fontFamily}>
                    {line}
                  </text>
                </g>
              );
            })}

            {/* Latency badge - inside card bottom */}
            {latencyLabels[i] && (
              <g style={{ opacity: sp }}>
                <text x={sx + stageW - 24} y={stageY + stageH - 20}
                  textAnchor="end" dominantBaseline="central"
                  fill={stage.color} fontSize={FONT_SIZE.lg} fontWeight={700}
                  fontFamily={TYPOGRAPHY.mono.fontFamily}>
                  {latencyLabels[i]}
                </text>
              </g>
            )}

            {/* Arrow to next stage */}
            {i < stages.length - 1 && (() => {
              const ap = entranceSpring(frame, fps, beat(stageBeatNames[i + 1]) - 2);
              const ax1 = sx + stageW + 4;
              const ax2 = sx + stageW + stageGap - 4;
              const ay = stageY + stageH / 2;
              const len = ax2 - ax1;
              const offset = interpolate(ap, [0, 1], [len, 0]);
              return (
                <g style={{ opacity: ap }}>
                  <line x1={ax1} y1={ay} x2={ax2} y2={ay}
                    stroke={stages[i + 1].color} strokeWidth={2} strokeLinecap="round"
                    strokeDasharray={`${len}`} strokeDashoffset={offset} />
                  <polyline
                    points={`${ax2 - 8},${ay - 6} ${ax2},${ay} ${ax2 - 8},${ay + 6}`}
                    fill="none" stroke={stages[i + 1].color} strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ opacity: ap }} />
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* Total round-trip summary — clean typography, no green pill */}
      <g style={{ opacity: pTotal }}>
        <text x={grid.center().x} y={grid.y(0.80)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Under 500ms round trip
        </text>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle"
          fill={C.mid} fontSize={FONT_SIZE.xl}>
          The customer hears a reply before they notice any pause.
        </text>

        {/* Thin horizontal rule */}
        <line x1={grid.center().x - 120} y1={grid.y(0.76)} x2={grid.center().x + 120} y2={grid.y(0.76)}
          stroke={C.hairline} strokeWidth={1} />
      </g>

      {/* Ambient particles */}
      {[...Array(6)].map((_, i) => {
        const px = 200 + i * 280 + Math.sin(frame * 0.02 + i) * 20;
        const py = 120 + Math.sin(frame * 0.015 + i * 2) * 30;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.03 + i) * 0.04} />
        );
      })}
    </g>
  );
};
