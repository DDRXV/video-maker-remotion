import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

const MODULE_COLOR = MODULE_COLORS.queryTranslation;

/* ── Technique data ── */

interface Technique {
  name: string;
  description: string;
  beatLabel: string;
  bulletColor: string;
}

const techniques: Technique[] = [
  { name: 'Multi-Query', description: 'Generate multiple re-phrasings of the question', beatLabel: 'show-multi-query', bulletColor: '#ef4444' },
  { name: 'RAG-Fusion', description: 'Merge results with reciprocal rank fusion', beatLabel: 'show-rag-fusion', bulletColor: '#f97316' },
  { name: 'Decomposition', description: 'Break complex questions into sub-questions', beatLabel: 'show-decomposition', bulletColor: '#eab308' },
  { name: 'Step-Back', description: 'Ask a more general question first', beatLabel: 'show-stepback', bulletColor: '#22c55e' },
  { name: 'HyDE', description: 'Generate a hypothetical answer, then search for it', beatLabel: 'show-hyde', bulletColor: '#3b82f6' },
];

/* ── Main Scene ── */

export const QueryTranslationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('query-translation');

  const pTitle = progress('show-title');
  const pQuestion = progress('show-input-question');
  const pSummary = progress('show-summary');

  // Layout
  const questionX = grid.x(0.08);
  const questionY = grid.y(0.42);
  const questionR = 32;

  const cardStartX = grid.x(0.34);
  const cardWidth = grid.x(0.58);
  const cardHeight = 56;
  const cardGap = 12;
  const firstCardY = grid.y(0.14);

  // 3B1B focus: find newest visible technique
  const latestTechnique = (() => {
    for (let i = techniques.length - 1; i >= 0; i--) {
      if (progress(techniques[i].beatLabel) > 0.05) return i;
    }
    return -1;
  })();

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={18} fill={MODULE_COLOR} fillOpacity={0.15} stroke={MODULE_COLOR} strokeWidth={1.5} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLOR} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>2</text>
        <text x={grid.x(0.04) + 30} y={grid.y(0.04)} dominantBaseline="central" fill={COLORS.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Query Translation</text>
      </g>

      {/* Color zone halo */}
      <rect x={grid.x(0.02)} y={grid.y(0.1)} width={grid.x(0.96) - grid.x(0.02)} height={60} rx={12} fill={MODULE_COLOR} fillOpacity={0.04} style={{ opacity: pTitle }} />

      {/* Input question bubble */}
      <g style={{ opacity: pQuestion }}>
        {(() => {
          const translateX = interpolate(pQuestion, [0, 1], [-30, 0]);
          return (
            <g style={{ transform: `translateX(${translateX}px)` }}>
              {/* Speech bubble shape */}
              <circle cx={questionX} cy={questionY} r={questionR} fill={COLORS.cardFill} stroke={COLORS.accent} strokeWidth={2.5} />
              <text x={questionX} y={questionY - 4} textAnchor="middle" dominantBaseline="central" fill={COLORS.accent} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>?</text>
              <text x={questionX} y={questionY + 18} textAnchor="middle" fill={COLORS.lightStroke} fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.mono.fontFamily}>user query</text>
            </g>
          );
        })()}
      </g>

      {/* Technique cards */}
      {techniques.map((tech, i) => {
        const tp = progress(tech.beatLabel);
        const isBrightest = i === latestTechnique;
        const focusOpacity = tp > 0.05 ? (isBrightest ? 1 : 0.35) : 0;
        const cardY = firstCardY + i * (cardHeight + cardGap);
        const translateX = interpolate(tp, [0, 1], [40, 0]);

        // Curved arrow from question bubble to this card
        const arrowStartX = questionX + questionR + 4;
        const arrowStartY = questionY;
        const arrowEndX = cardStartX;
        const arrowEndY = cardY + cardHeight / 2;
        const ctrlX = (arrowStartX + arrowEndX) / 2;
        const arrowD = `M ${arrowStartX} ${arrowStartY} Q ${ctrlX} ${arrowEndY}, ${arrowEndX} ${arrowEndY}`;
        const arrowLen = 350;
        const arrowOffset = interpolate(tp, [0, 1], [arrowLen, 0]);

        return (
          <g key={tech.name} style={{ opacity: focusOpacity }}>
            {/* Curved arrow */}
            <path
              d={arrowD} fill="none" stroke={MODULE_COLOR} strokeWidth={1.5}
              strokeDasharray={arrowLen} strokeDashoffset={arrowOffset}
              strokeLinecap="round" style={{ opacity: 0.5 }}
            />

            {/* Card */}
            <g style={{ transform: `translateX(${translateX}px)` }}>
              <rect
                x={cardStartX} y={cardY} width={cardWidth} height={cardHeight} rx={12}
                fill={COLORS.cardFill} stroke={COLORS.hairline} strokeWidth={1}
              />
              {/* shadow */}
              <rect
                x={cardStartX + 1} y={cardY + 2} width={cardWidth} height={cardHeight} rx={12}
                fill={COLORS.dark} fillOpacity={0.04}
                style={{ zIndex: -1 }}
              />

              {/* Colored circle bullet */}
              <circle cx={cardStartX + 28} cy={cardY + cardHeight / 2} r={10} fill={tech.bulletColor} fillOpacity={0.15} stroke={tech.bulletColor} strokeWidth={1.5} />

              {/* Technique name */}
              <text
                x={cardStartX + 50} y={cardY + 22}
                fill={COLORS.dark} fontSize={FONT_SIZE.lg} fontWeight={700}
                fontFamily={TYPOGRAPHY.label.fontFamily}
              >
                {tech.name}
              </text>

              {/* Description */}
              <text
                x={cardStartX + 50} y={cardY + 42}
                fill={COLORS.lightStroke} fontSize={FONT_SIZE.sm}
                fontFamily={TYPOGRAPHY.body.fontFamily} fontWeight={400}
              >
                {tech.description}
              </text>
            </g>
          </g>
        );
      })}

      {/* Summary */}
      <TextBox
        x={grid.x(0.08)} y={grid.y(0.9)} maxWidth={grid.x(0.84)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={COLORS.lightStroke}
        enterAt={beat('show-summary')} align="left"
      >
        Each technique solves a different retrieval failure mode.
      </TextBox>
    </g>
  );
};
