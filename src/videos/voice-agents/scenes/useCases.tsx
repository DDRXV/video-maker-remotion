import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const UseCasesScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('use-cases');
  const pTitle = progress('show-title');
  const pSupport = progress('show-support');
  const pSchedule = progress('show-scheduling');
  const pQualify = progress('show-qualification');
  const pCollect = progress('show-collections');
  const pSummary = progress('show-summary');

  const useCases = [
    {
      title: 'Customer Support',
      color: C.stt,
      bg: C.sttLight,
      enterAt: beat('show-support'),
      progress: pSupport,
      knowledgeBase: 'Product docs + FAQs',
      lines: [
        { speaker: 'Customer', text: '"My integration keeps failing"' },
        { speaker: 'Agent', text: '"Your API key expired Mar 28.' },
        { speaker: '', text: '  Let me walk you through renewal."' },
      ],
      metric: '74% resolved w/o escalation',
    },
    {
      title: 'Appointment Scheduling',
      color: C.tts,
      bg: C.ttsLight,
      enterAt: beat('show-scheduling'),
      progress: pSchedule,
      knowledgeBase: 'Calendar + availability',
      lines: [
        { speaker: 'Customer', text: '"I need to see Dr. Patel this week"' },
        { speaker: 'Agent', text: '"Thursday 2pm or Friday 10am.' },
        { speaker: '', text: '  Which works better?"' },
      ],
      metric: '3.2 calls/min throughput',
    },
    {
      title: 'Lead Qualification',
      color: C.llm,
      bg: C.llmLight,
      enterAt: beat('show-qualification'),
      progress: pQualify,
      knowledgeBase: 'Scoring rubric + ICP',
      lines: [
        { speaker: 'Agent', text: '"How many seats for your team?"' },
        { speaker: 'Lead', text: '"Around 50, mostly engineering."' },
        { speaker: '', text: '' },
      ],
      metric: 'Score: 82/100, route to AE',
    },
    {
      title: 'Collections',
      color: C.amber,
      bg: C.amberLight,
      enterAt: beat('show-collections'),
      progress: pCollect,
      knowledgeBase: 'Payment history + policies',
      lines: [
        { speaker: 'Agent', text: '"I can set up a 3-month plan' },
        { speaker: '', text: '  at $340/mo. Would that work?"' },
        { speaker: 'Customer', text: '"Yes, that sounds manageable."' },
      ],
      metric: '31% higher recovery rate',
    },
  ];

  const cardW = 760;
  const cardH = 230;
  const cardGap = 20;
  const colGap = 28;
  const cols = 2;
  const totalW = cols * cardW + colGap;
  const startX = grid.center().x - totalW / 2;
  const startY = grid.y(0.12);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Same Pipeline. Different Knowledge Base.
        </text>
      </g>

      {/* Use case cards - 2x2 grid */}
      {useCases.map((uc, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cardW + colGap);
        const cy = startY + row * (cardH + cardGap);
        const sp = entranceSpring(frame, fps, uc.enterAt);
        const slideX = interpolate(sp, [0, 1], [col === 0 ? -20 : 20, 0]);

        return (
          <g key={i} style={{ opacity: sp, transform: `translateX(${slideX}px)` }}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={14}
              fill={C.cardFill} stroke={uc.color} strokeWidth={2} />

            {/* Left accent stripe */}
            <rect x={cx} y={cy + 8} width={8} height={cardH - 16} rx={4}
              fill={uc.color} />

            {/* Title */}
            <text x={cx + 28} y={cy + 30} dominantBaseline="central"
              fill={uc.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {uc.title}
            </text>

            {/* KB badge */}
            <rect x={cx + 28} y={cy + 48} width={Math.max(190, uc.knowledgeBase.length * 9)} height={28} rx={14}
              fill={uc.bg} stroke={uc.color} strokeWidth={0.8} />
            <text x={cx + 42} y={cy + 62} dominantBaseline="central"
              fill={uc.color} fontSize={FONT_SIZE.sm} fontWeight={600}
              fontFamily={TYPOGRAPHY.mono.fontFamily}>
              {uc.knowledgeBase}
            </text>

            {/* Example exchange lines */}
            {uc.lines.map((ex, ei) => {
              if (!ex.text) return null;
              const ep = entranceSpring(frame, fps, uc.enterAt + 4 + ei * 3);
              const ey = cy + 90 + ei * 36;
              const hasSpeaker = ex.speaker !== '';
              return (
                <g key={ei} style={{ opacity: ep }}>
                  {hasSpeaker && (
                    <>
                      <rect x={cx + 28} y={ey} width={ex.speaker.length * 10 + 16} height={26} rx={4}
                        fill={ex.speaker === 'Agent' ? uc.color : C.mid} fillOpacity={0.12} />
                      <text x={cx + 36} y={ey + 15} dominantBaseline="central"
                        fill={ex.speaker === 'Agent' ? uc.color : C.mid}
                        fontSize={FONT_SIZE.xs} fontWeight={700}>
                        {ex.speaker}
                      </text>
                    </>
                  )}
                  <text x={cx + (hasSpeaker ? 28 + ex.speaker.length * 10 + 24 : 52)} y={ey + 15}
                    dominantBaseline="central"
                    fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={400}
                    fontFamily={TYPOGRAPHY.mono.fontFamily}>
                    {ex.text}
                  </text>
                </g>
              );
            })}

            {/* Metric badge - top right */}
            {(() => {
              const mp = entranceSpring(frame, fps, uc.enterAt + 12);
              const metricW = Math.max(200, uc.metric.length * 9.5 + 32);
              return (
                <g style={{ opacity: mp }}>
                  <rect x={cx + cardW - metricW - 16} y={cy + 14} width={metricW} height={34} rx={17}
                    fill={C.greenLight} stroke={C.green} strokeWidth={1} />
                  <text x={cx + cardW - metricW / 2 - 16} y={cy + 31} textAnchor="middle"
                    dominantBaseline="central" fill={C.green}
                    fontSize={FONT_SIZE.sm} fontWeight={700}>
                    {uc.metric}
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Same architecture. Swap the knowledge base. New agent in hours.
        </text>
      </g>

      {/* Ambient particles */}
      {[...Array(5)].map((_, i) => {
        const px = 250 + i * 320 + Math.sin(frame * 0.02 + i * 1.5) * 18;
        const py = 140 + Math.sin(frame * 0.017 + i * 2.1) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.028 + i) * 0.04} />
        );
      })}
    </g>
  );
};
