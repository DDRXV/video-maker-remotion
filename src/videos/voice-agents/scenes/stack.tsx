import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const StackScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('stack');
  const pTitle = progress('show-title');
  const pSTT = progress('show-stt-layer');
  const pLLM = progress('show-llm-layer');
  const pTTS = progress('show-tts-layer');
  const pOrch = progress('show-orchestrator-layer');
  const pTel = progress('show-telephony-layer');
  const pSummary = progress('show-summary');

  const layers = [
    {
      label: 'Telephony',
      color: C.mid,
      bg: '#f1f5f9',
      options: ['Twilio', 'Vonage', 'Telnyx'],
      detail: 'SIP trunking, phone numbers, routing',
      enterAt: beat('show-telephony-layer'),
      progress: pTel,
    },
    {
      label: 'Orchestrator',
      color: C.accent,
      bg: C.accentLight,
      options: ['Vapi', 'Bland', 'Retell', 'LiveKit'],
      detail: 'Pipeline state, turn-taking logic',
      enterAt: beat('show-orchestrator-layer'),
      progress: pOrch,
    },
    {
      label: 'Text-to-Speech',
      color: C.tts,
      bg: C.ttsLight,
      options: ['ElevenLabs', 'PlayHT', 'Cartesia'],
      detail: 'Voice cloning, emotion, streaming',
      enterAt: beat('show-tts-layer'),
      progress: pTTS,
    },
    {
      label: 'LLM',
      color: C.llm,
      bg: C.llmLight,
      options: ['GPT-4o', 'Claude', 'Fine-tuned OSS'],
      detail: 'Reasoning, context injection',
      enterAt: beat('show-llm-layer'),
      progress: pLLM,
    },
    {
      label: 'Speech-to-Text',
      color: C.stt,
      bg: C.sttLight,
      options: ['Deepgram', 'AssemblyAI', 'Whisper'],
      detail: 'Streaming transcription, low latency',
      enterAt: beat('show-stt-layer'),
      progress: pSTT,
    },
  ];

  const layerH = 108;
  const layerGap = 12;
  const layerW = grid.x(0.86);
  const layerX = grid.x(0.07);
  const stackStartY = grid.y(0.10);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Five Decisions for a PM
        </text>
      </g>

      {/* Layer stack */}
      {(() => {
        // Find the most recently activated layer (highest enterAt with progress > 0.5)
        const activeLayers = layers.filter(l => l.progress > 0.5);
        const focusedIdx = activeLayers.length > 0
          ? layers.indexOf(activeLayers.reduce((a, b) => a.enterAt > b.enterAt ? a : b))
          : -1;

        return layers.map((layer, i) => {
          const sp = entranceSpring(frame, fps, layer.enterAt);
          const ly = stackStartY + i * (layerH + layerGap);
          const slideX = interpolate(sp, [0, 1], [-40, 0]);

          const isFocused = i === focusedIdx;
          const isRevealed = layer.progress > 0.5;

          return (
            <g key={i} style={{
              opacity: sp * (isFocused ? 1 : (isRevealed ? 0.35 : 1)),
              transform: `translateX(${slideX}px)`,
            }}>
            {/* Layer bar */}
            <rect x={layerX} y={ly} width={layerW} height={layerH} rx={14}
              fill={C.cardFill} stroke={layer.color}
              strokeWidth={isFocused ? 2.5 : 1.5}
              filter={isFocused ? 'url(#shadow-md)' : undefined} />

            {/* Color accent left stripe */}
            <rect x={layerX} y={ly + 8} width={8} height={layerH - 16} rx={4}
              fill={layer.color} />

            {/* Layer label */}
            <text x={layerX + 32} y={ly + 36} dominantBaseline="central"
              fill={layer.color} fontSize={FONT_SIZE['2xl']} fontWeight={700}>
              {layer.label}
            </text>

            {/* Detail text - use C.dark not C.light for readability */}
            <text x={layerX + 32} y={ly + 72} dominantBaseline="central"
              fill={C.mid} fontSize={FONT_SIZE.md}
              fontFamily={TYPOGRAPHY.mono.fontFamily}>
              {layer.detail}
            </text>

            {/* Option pills - right side, properly spaced */}
            {(() => {
              const pillH = 40;
              const pillGap = 14;
              // Calculate pill widths first
              const pills = layer.options.map(opt => ({
                text: opt,
                w: Math.max(110, opt.length * 12 + 32),
              }));
              const totalPillW = pills.reduce((s, p) => s + p.w, 0) + (pills.length - 1) * pillGap;
              const pillStartX = layerX + layerW - 24 - totalPillW;
              let offsetX = 0;

              return pills.map((pill, oi) => {
                const op = entranceSpring(frame, fps, layer.enterAt + 4 + oi * 3);
                const px = pillStartX + offsetX;
                offsetX += pill.w + pillGap;
                return (
                  <g key={oi} style={{ opacity: op }}>
                    <rect x={px} y={ly + layerH / 2 - pillH / 2} width={pill.w} height={pillH} rx={pillH / 2}
                      fill={layer.bg} stroke={layer.color} strokeWidth={1.5} />
                    <text x={px + pill.w / 2} y={ly + layerH / 2 + 1} textAnchor="middle"
                      dominantBaseline="central" fill={layer.color}
                      fontSize={FONT_SIZE.md} fontWeight={600}>
                      {pill.text}
                    </text>
                  </g>
                );
              });
            })()}
          </g>
        );
      });
      })()}

      {/* Connecting dashes between layers */}
      {layers.slice(0, -1).map((_, i) => {
        const ap = layers[i + 1].progress;
        const y1 = stackStartY + i * (layerH + layerGap) + layerH;
        const y2 = stackStartY + (i + 1) * (layerH + layerGap);
        const midX = grid.center().x;
        return (
          <g key={`conn-${i}`} style={{ opacity: ap * 0.3 }}>
            <line x1={midX} y1={y1 + 2} x2={midX} y2={y2 - 2}
              stroke={layers[i + 1].color} strokeWidth={1.5}
              strokeDasharray="4 4" strokeLinecap="round" />
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.92)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Pick each layer based on latency budget and accuracy needs.
        </text>
      </g>

      {/* Ambient particles */}
      {[...Array(5)].map((_, i) => {
        const px = 300 + i * 320 + Math.sin(frame * 0.02 + i * 1.3) * 20;
        const py = 100 + Math.sin(frame * 0.016 + i * 2) * 25;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.07 + Math.sin(frame * 0.025 + i) * 0.04} />
        );
      })}
    </g>
  );
};
