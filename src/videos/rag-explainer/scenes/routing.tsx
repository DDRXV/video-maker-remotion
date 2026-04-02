import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { AnimatedCard } from '../../../components/AnimatedCard';
import { FlowArrow } from '../../../components/FlowArrow';
import { TextBox } from '../../../components/TextBox';

const MODULE_COLOR = MODULE_COLORS.routing;

/* ── Main Scene ── */

export const RoutingScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('routing');

  const pTitle = progress('show-title');
  const pQuestion = progress('show-question-in');
  const pLogical = progress('show-logical');
  const pSemantic = progress('show-semantic');
  const pCombined = progress('show-combined');
  const pSummary = progress('show-summary');

  // Layout
  const qX = grid.x(0.08);
  const qY = grid.y(0.44);
  const qR = 32;

  const cardX = grid.x(0.28);
  const cardW = 420;
  const cardH = 200;
  const logicalY = grid.y(0.12);
  const semanticY = grid.y(0.54);

  const combinedX = grid.x(0.74);
  const combinedY = grid.y(0.35);

  // 3B1B focus
  const isCombinedBright = pCombined > 0.05;
  const isSemanticBright = !isCombinedBright && pSemantic > 0.05;
  const isLogicalBright = !isSemanticBright && !isCombinedBright && pLogical > 0.05;

  const logicalOpacity = pLogical > 0.05 ? (isLogicalBright ? 1 : 0.35) : 0;
  const semanticOpacity = pSemantic > 0.05 ? (isSemanticBright ? 1 : 0.35) : 0;
  // Both cards brighten when combined appears
  const logicalFinal = isCombinedBright ? interpolate(pCombined, [0, 1], [0.35, 0.85]) : logicalOpacity;
  const semanticFinal = isCombinedBright ? interpolate(pCombined, [0, 1], [0.35, 0.85]) : semanticOpacity;

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={18} fill={MODULE_COLOR} fillOpacity={0.15} stroke={MODULE_COLOR} strokeWidth={1.5} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLOR} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>3</text>
        <text x={grid.x(0.04) + 30} y={grid.y(0.04)} dominantBaseline="central" fill={COLORS.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Routing</text>
      </g>

      {/* Color zone halo */}
      <rect x={grid.x(0.02)} y={grid.y(0.1)} width={grid.x(0.96) - grid.x(0.02)} height={60} rx={12} fill={MODULE_COLOR} fillOpacity={0.04} style={{ opacity: pTitle }} />

      {/* Question bubble */}
      <g style={{ opacity: pQuestion }}>
        {(() => {
          const translateX = interpolate(pQuestion, [0, 1], [-30, 0]);
          return (
            <g style={{ transform: `translateX(${translateX}px)` }}>
              <circle cx={qX} cy={qY} r={qR} fill={COLORS.cardFill} stroke={COLORS.accent} strokeWidth={2.5} />
              <text x={qX} y={qY - 4} textAnchor="middle" dominantBaseline="central" fill={COLORS.accent} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>?</text>
              <text x={qX} y={qY + 18} textAnchor="middle" fill={COLORS.lightStroke} fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.mono.fontFamily}>question</text>
            </g>
          );
        })()}
      </g>

      {/* Curved arrow to Logical */}
      <FlowArrow
        from={{ x: qX + qR + 4, y: qY - 10 }}
        to={{ x: cardX, y: logicalY + cardH / 2 }}
        enterAt={beat('show-logical')}
        color={MODULE_COLOR} strokeWidth={1.5} curved
      />

      {/* Curved arrow to Semantic */}
      <FlowArrow
        from={{ x: qX + qR + 4, y: qY + 10 }}
        to={{ x: cardX, y: semanticY + cardH / 2 }}
        enterAt={beat('show-semantic')}
        color={MODULE_COLOR} strokeWidth={1.5} curved
      />

      {/* ── Logical Routing Card ── */}
      <g style={{ opacity: logicalFinal }}>
        <AnimatedCard
          x={cardX} y={logicalY} width={cardW} height={cardH}
          title="Logical Routing" enterAt={beat('show-logical')}
          strokeColor={MODULE_COLOR} accentHeader
        >
          {/* Description */}
          <text x={16} y={30} fill={COLORS.dark} fontSize={FONT_SIZE.md} fontFamily={TYPOGRAPHY.body.fontFamily}>
            LLM chooses the data source
          </text>

          {/* Fork icon */}
          <g transform="translate(16, 50)">
            <line x1={0} y1={8} x2={20} y2={8} stroke={MODULE_COLOR} strokeWidth={2} strokeLinecap="round" />
            <line x1={20} y1={8} x2={35} y2={0} stroke={MODULE_COLOR} strokeWidth={2} strokeLinecap="round" />
            <line x1={20} y1={8} x2={35} y2={16} stroke={MODULE_COLOR} strokeWidth={2} strokeLinecap="round" />
          </g>

          {/* DB option pills */}
          {['SQL DB', 'Graph DB', 'Vector DB'].map((db, i) => {
            const pillX = 60 + i * 120;
            const pillY = 58;
            const delay = beat('show-logical') + 8 + i * 5;
            const pp = entranceSpring(frame, fps, delay);
            return (
              <g key={db} style={{ opacity: pp }}>
                <rect x={pillX} y={pillY} width={100} height={28} rx={14} fill={MODULE_COLOR} fillOpacity={0.1} stroke={MODULE_COLOR} strokeWidth={1} />
                <text x={pillX + 50} y={pillY + 14} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLOR} fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{db}</text>
              </g>
            );
          })}

          {/* Small monospace hint */}
          <text x={16} y={110} fill={COLORS.lightStroke} fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.mono.fontFamily}>
            llm.route(question) → data_source
          </text>
        </AnimatedCard>
      </g>

      {/* ── Semantic Routing Card ── */}
      <g style={{ opacity: semanticFinal }}>
        <AnimatedCard
          x={cardX} y={semanticY} width={cardW} height={cardH}
          title="Semantic Routing" enterAt={beat('show-semantic')}
          strokeColor={MODULE_COLOR} accentHeader
        >
          {/* Description */}
          <text x={16} y={30} fill={COLORS.dark} fontSize={FONT_SIZE.md} fontFamily={TYPOGRAPHY.body.fontFamily}>
            Embed question, match to prompts
          </text>

          {/* Embedding icon: dots converging */}
          <g transform="translate(16, 46)">
            <circle cx={4} cy={8} r={3} fill={MODULE_COLOR} fillOpacity={0.4} />
            <circle cx={20} cy={2} r={3} fill={MODULE_COLOR} fillOpacity={0.6} />
            <circle cx={20} cy={14} r={3} fill={MODULE_COLOR} fillOpacity={0.8} />
            <line x1={7} y1={8} x2={17} y2={4} stroke={MODULE_COLOR} strokeWidth={1} strokeDasharray="2 2" />
            <line x1={7} y1={8} x2={17} y2={12} stroke={MODULE_COLOR} strokeWidth={1} strokeDasharray="2 2" />
          </g>

          {/* Prompt pills */}
          {['Prompt #1', 'Prompt #2', 'Prompt #3'].map((prompt, i) => {
            const pillX = 50 + i * 125;
            const pillY = 58;
            const delay = beat('show-semantic') + 8 + i * 5;
            const pp = entranceSpring(frame, fps, delay);
            return (
              <g key={prompt} style={{ opacity: pp }}>
                <rect x={pillX} y={pillY} width={108} height={28} rx={14} fill={MODULE_COLOR} fillOpacity={0.1} stroke={MODULE_COLOR} strokeWidth={1} />
                <text x={pillX + 54} y={pillY + 14} textAnchor="middle" dominantBaseline="central" fill={MODULE_COLOR} fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{prompt}</text>
              </g>
            );
          })}

          {/* Small monospace hint */}
          <text x={16} y={110} fill={COLORS.lightStroke} fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.mono.fontFamily}>
            cosine_sim(embed(q), prompt_embeddings)
          </text>
        </AnimatedCard>
      </g>

      {/* ── Combined note card ── */}
      <g style={{ opacity: pCombined }}>
        {(() => {
          const translateX = interpolate(pCombined, [0, 1], [30, 0]);
          const noteW = 260;
          const noteH = 90;
          return (
            <g style={{ transform: `translateX(${translateX}px)` }}>
              {/* Subtle shadow */}
              <rect x={combinedX + 2} y={combinedY + 3} width={noteW} height={noteH} rx={12} fill={COLORS.dark} fillOpacity={0.05} />
              <rect x={combinedX} y={combinedY} width={noteW} height={noteH} rx={12} fill={COLORS.cardFill} stroke={MODULE_COLOR} strokeWidth={2} />

              {/* Accent bar */}
              <rect x={combinedX} y={combinedY} width={6} height={noteH} rx={3} fill={MODULE_COLOR} />

              <text x={combinedX + 24} y={combinedY + 30} fill={COLORS.dark} fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>
                In production,
              </text>
              <text x={combinedX + 24} y={combinedY + 56} fill={COLORS.dark} fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>
                use both.
              </text>

              {/* Connection lines from cards */}
              <FlowArrow
                from={{ x: cardX + cardW, y: logicalY + cardH / 2 }}
                to={{ x: combinedX, y: combinedY + noteH / 3 }}
                enterAt={beat('show-combined') + 4}
                color={MODULE_COLOR} strokeWidth={1} dashed curved
              />
              <FlowArrow
                from={{ x: cardX + cardW, y: semanticY + cardH / 2 }}
                to={{ x: combinedX, y: combinedY + noteH * 2 / 3 }}
                enterAt={beat('show-combined') + 6}
                color={MODULE_COLOR} strokeWidth={1} dashed curved
              />
            </g>
          );
        })()}
      </g>

      {/* Summary */}
      <TextBox
        x={grid.x(0.08)} y={grid.y(0.9)} maxWidth={grid.x(0.84)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={COLORS.lightStroke}
        enterAt={beat('show-summary')} align="left"
      >
        Route by logic and by meaning. Let the LLM decide where each question belongs.
      </TextBox>
    </g>
  );
};
