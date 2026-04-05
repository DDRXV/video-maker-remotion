import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring, pulse } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';
import { WaveformBar } from '../../../components/WaveformBar';

export const TurnTakingScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('turn-taking');
  const pTitle = progress('show-title');
  const pWave = progress('show-waveform');
  const pVAD = progress('show-vad');
  const pEnd = progress('show-endpointing');
  const pBarge = progress('show-bargein');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;
  const timelineY = grid.y(0.12);
  const timelineW = grid.x(0.88);
  const timelineX = grid.x(0.06);

  // Timeline segments showing a conversation exchange
  const segments = [
    { label: 'Customer speaking', x: 0, w: 0.30, color: C.mid, waveActive: true },
    { label: 'Silence', x: 0.30, w: 0.06, color: C.hairline, waveActive: false },
    { label: 'Agent speaking', x: 0.36, w: 0.28, color: C.accent, waveActive: true },
    { label: 'Barge-in!', x: 0.64, w: 0.04, color: C.red, waveActive: true },
    { label: 'Customer resumes', x: 0.68, w: 0.32, color: C.mid, waveActive: true },
  ];

  // Concept cards below the timeline
  const concepts = [
    {
      title: 'Voice Activity Detection',
      abbr: 'VAD',
      color: C.stt,
      bg: C.sttLight,
      enterAt: beat('show-vad'),
      lines: [
        'Listens for audio energy',
        'Filters background noise',
        'Detects speech onset',
        'Triggers STT pipeline',
      ],
    },
    {
      title: 'Endpointing',
      abbr: 'EP',
      color: C.llm,
      bg: C.llmLight,
      enterAt: beat('show-endpointing'),
      lines: [
        'Pause vs full stop?',
        '300ms silence = maybe done',
        '800ms silence = definitely done',
        'Semantic context helps decide',
      ],
    },
    {
      title: 'Barge-in Handling',
      abbr: 'BI',
      color: C.red,
      bg: C.redLight,
      enterAt: beat('show-bargein'),
      lines: [
        'Customer interrupts mid-reply',
        'Kill TTS playback (<50ms)',
        'Cancel pending LLM output',
        'Switch to listening mode',
      ],
    },
  ];

  const cardW = 500;
  const cardH = 340;
  const cardGap = 28;
  const totalCardsW = concepts.length * cardW + (concepts.length - 1) * cardGap;
  const cardsStartX = cx - totalCardsW / 2;
  const cardY = grid.y(0.40);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.04)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Turn-Taking and Interruptions
        </text>
      </g>

      {/* Conversation timeline */}
      <g style={{ opacity: pWave }}>
        {/* Timeline track */}
        <rect x={timelineX} y={timelineY} width={timelineW} height={80} rx={12}
          fill="#f8fafc" stroke={C.hairline} strokeWidth={1.5} />

        {segments.map((seg, i) => {
          const sx = timelineX + seg.x * timelineW;
          const sw = seg.w * timelineW;
          const sp = entranceSpring(frame, fps, beat('show-waveform') + i * 4);
          return (
            <g key={i} style={{ opacity: sp }}>
              {/* Segment background */}
              <rect x={sx} y={timelineY + 2} width={sw} height={76} rx={0}
                fill={seg.color} fillOpacity={seg.label === 'Silence' ? 0.1 : 0.12} />
              {/* Waveform inside */}
              {seg.waveActive && (
                <WaveformBar
                  x={sx + 4} y={timelineY + 16} width={sw - 8} height={44}
                  color={seg.color} enterAt={beat('show-waveform') + i * 4 + 2}
                  frame={frame} fps={fps}
                  barCount={Math.max(4, Math.floor(sw / 14))}
                  active={seg.label !== 'Barge-in!'}
                  opacity={0.7}
                />
              )}
              {/* Label below timeline */}
              <text x={sx + sw / 2} y={timelineY + 104} textAnchor="middle"
                fill={seg.color === C.hairline ? C.light : seg.color}
                fontSize={FONT_SIZE.xs} fontWeight={600}>
                {seg.label}
              </text>
            </g>
          );
        })}

        {/* Barge-in marker */}
        {(() => {
          const bp = entranceSpring(frame, fps, beat('show-bargein') - 6);
          const bargeX = timelineX + 0.64 * timelineW;
          return (
            <g style={{ opacity: bp }}>
              <line x1={bargeX} y1={timelineY - 8} x2={bargeX} y2={timelineY + 88}
                stroke={C.red} strokeWidth={2.5} strokeDasharray="6 3" />
              <rect x={bargeX - 36} y={timelineY - 32} width={72} height={24} rx={12}
                fill={C.redLight} stroke={C.red} strokeWidth={1.5} />
              <text x={bargeX} y={timelineY - 20} textAnchor="middle"
                dominantBaseline="central" fill={C.red} fontSize={FONT_SIZE.xs} fontWeight={700}>
                CUT
              </text>
            </g>
          );
        })()}
      </g>

      {/* Concept cards */}
      {concepts.map((concept, i) => {
        const cp = entranceSpring(frame, fps, concept.enterAt);
        const slideY = interpolate(cp, [0, 1], [24, 0]);
        const ccx = cardsStartX + i * (cardW + cardGap);

        return (
          <g key={i} style={{ opacity: cp, transform: `translateY(${slideY}px)` }}>
            <rect x={ccx} y={cardY} width={cardW} height={cardH} rx={14}
              fill={C.cardFill} stroke={concept.color} strokeWidth={2} />
            {/* Header */}
            <rect x={ccx} y={cardY} width={cardW} height={52} rx={14}
              fill={concept.bg} />
            <rect x={ccx} y={cardY + 32} width={cardW} height={20}
              fill={concept.bg} />
            {/* Abbreviation badge */}
            <rect x={ccx + 16} y={cardY + 12} width={42} height={28} rx={6}
              fill={concept.color} />
            <text x={ccx + 37} y={cardY + 26} textAnchor="middle"
              dominantBaseline="central" fill="#ffffff"
              fontSize={FONT_SIZE.xs} fontWeight={700}>
              {concept.abbr}
            </text>
            <text x={ccx + 68} y={cardY + 28} dominantBaseline="central"
              fill={concept.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {concept.title}
            </text>

            {/* Detail rows */}
            {concept.lines.map((line, li) => {
              const lp = entranceSpring(frame, fps, concept.enterAt + 4 + li * 3);
              const ry = cardY + 68 + li * 62;
              return (
                <g key={li} style={{ opacity: lp }}>
                  <rect x={ccx + 16} y={ry} width={cardW - 32} height={50} rx={8}
                    fill={concept.bg} fillOpacity={0.4} />
                  <circle cx={ccx + 38} cy={ry + 25} r={5}
                    fill={concept.color} fillOpacity={0.6} />
                  <text x={ccx + 56} y={ry + 28} dominantBaseline="central"
                    fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={500}>
                    {line}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.88)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          This is what separates a voice agent from an IVR menu.
        </text>
      </g>

      {/* Ambient particles */}
      {[...Array(5)].map((_, i) => {
        const px = 260 + i * 310 + Math.sin(frame * 0.02 + i * 1.5) * 16;
        const py = 110 + Math.sin(frame * 0.017 + i * 2) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.026 + i) * 0.04} />
        );
      })}
    </g>
  );
};
