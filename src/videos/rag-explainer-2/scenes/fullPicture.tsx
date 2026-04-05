import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { FloatingParticles } from '../../../scene-templates';
import { TextBox } from '../../../components/TextBox';

/**
 * The Complete System — full pipeline + incremental adoption.
 *
 * Clean box arrows, no DashFlow, no overlapping lines.
 * Premium: floating particles, glow halos on blocks, staggered entrance.
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';

export const FullPictureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('full-picture');

  const diagP = progress('show-full-diagram');
  const flowP = progress('animate-flow');
  const incP = progress('show-incremental');
  const finalP = progress('final-frame');

  // Layout
  const pipeY = grid.y(0.16);
  const pipeH = 68;
  const startX = grid.x(0.1);
  const endX = grid.x(0.9);
  const blockCount = 6;
  const gap = 32;
  const totalW = endX - startX;
  const blockW = (totalW - gap * (blockCount - 1)) / blockCount;
  const ay = pipeY + pipeH / 2; // arrow Y — constant for all horizontal arrows

  const modules = [
    { label: 'Routing', color: C.routing },
    { label: 'Query', subLabel: 'Construction', color: C.queryConstruction },
    { label: 'Query', subLabel: 'Translation', color: C.queryTranslation },
    { label: 'Indexing', subLabel: '+ Data Sources', color: C.indexing },
    { label: 'Retrieval', subLabel: '+ Ranking', color: C.retrieval },
    { label: 'Generation', subLabel: '+ Self-RAG', color: C.generation },
  ];

  const incX = grid.x(0.06);
  const incStartY = grid.y(0.5);
  const incRowH = 38;
  const incMaxW = grid.x(0.88);

  const steps = [
    { text: 'Start with basic RAG', when: 'Day 1' },
    { text: 'Add routing for multiple sources', when: 'When sources > 1' },
    { text: 'Add query translation', when: 'When recall drops' },
    { text: 'Add re-ranking', when: 'When precision matters' },
    { text: 'Add generation feedback', when: 'When trust matters' },
  ];

  // Block positions helper
  const blockX = (i: number) => startX + i * (blockW + gap);
  const blockRight = (i: number) => blockX(i) + blockW;
  const blockCenterX = (i: number) => blockX(i) + blockW / 2;

  return (
    <g>
      <FloatingParticles color={C.blue} baseOpacity={0.06} />

      {/* Title */}
      <g style={{ opacity: diagP }}>
        <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={SLATE}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The Complete System
        </text>
        {/* Underline */}
        {(() => {
          const lw = 240;
          const drawn = interpolate(diagP, [0, 1], [lw, 0], { extrapolateRight: 'clamp' });
          return <line x1={grid.center().x - lw / 2} y1={grid.y(0.04) + 14} x2={grid.center().x + lw / 2} y2={grid.y(0.04) + 14}
            stroke={C.blue} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={lw} strokeDashoffset={drawn} />;
        })()}
      </g>

      {/* ── Question label ── */}
      <g style={{ opacity: diagP }}>
        <text x={startX - 30} y={ay + 1} textAnchor="end" dominantBaseline="central"
          fill={C.blue} fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>Question</text>
        <line x1={startX - 26} y1={ay} x2={startX - 10} y2={ay} stroke={C.blue} strokeWidth={2} strokeLinecap="round" />
        <polygon points={`${startX - 4},${ay} ${startX - 11},${ay - 4.5} ${startX - 11},${ay + 4.5}`} fill={C.blue} />
      </g>

      {/* ── Pipeline blocks with staggered entrance ── */}
      {modules.map((mod, i) => {
        const bx = blockX(i);
        const delay = beat('show-full-diagram') + i * 4;
        const p = entranceSpring(frame, fps, delay);
        const ty = interpolate(p, [0, 1], [14, 0], { extrapolateRight: 'clamp' });
        return (
          <g key={i} style={{ opacity: p, transform: `translateY(${ty}px)` }}>
            {/* Glow halo */}
            <rect x={bx - 4} y={pipeY - 4} width={blockW + 8} height={pipeH + 8} rx={14} fill={mod.color} fillOpacity={0.03} />
            {/* Block */}
            <rect x={bx} y={pipeY} width={blockW} height={pipeH} rx={10} fill={C.white} stroke={mod.color} strokeWidth={2} />
            {/* Left accent stripe */}
            <rect x={bx} y={pipeY} width={5} height={pipeH} rx={2.5} fill={mod.color} fillOpacity={0.7} />
            {/* Label */}
            <text x={bx + blockW / 2} y={ay - (mod.subLabel ? 7 : 0)} textAnchor="middle" dominantBaseline="central"
              fill={mod.color} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{mod.label}</text>
            {mod.subLabel && (
              <text x={bx + blockW / 2} y={ay + 14} textAnchor="middle" dominantBaseline="central"
                fill={mod.color} fontSize={13} fontWeight={400} fontFamily="monospace" fillOpacity={0.7}>{mod.subLabel}</text>
            )}
          </g>
        );
      })}

      {/* ── Straight horizontal arrows between blocks ── */}
      {modules.slice(0, -1).map((_, i) => {
        const fromX = blockRight(i) + 6;
        const toX = blockX(i + 1) - 6;
        const delay = beat('show-full-diagram') + (i + 1) * 4;
        const p = entranceSpring(frame, fps, delay);
        return (
          <g key={`arrow-${i}`} style={{ opacity: p * 0.7 }}>
            <line x1={fromX} y1={ay} x2={toX - 8} y2={ay} stroke={SLATE_LIGHT} strokeWidth={2} strokeLinecap="round" />
            <polygon points={`${toX},${ay} ${toX - 8},${ay - 4.5} ${toX - 8},${ay + 4.5}`} fill={SLATE_LIGHT} />
          </g>
        );
      })}

      {/* ── Answer label ── */}
      {(() => {
        const fromX = blockRight(5) + 6;
        const toX = fromX + 22;
        return (
          <g style={{ opacity: diagP }}>
            <line x1={fromX} y1={ay} x2={toX - 8} y2={ay} stroke={C.success} strokeWidth={2} strokeLinecap="round" />
            <polygon points={`${toX},${ay} ${toX - 8},${ay - 4.5} ${toX - 8},${ay + 4.5}`} fill={C.success} />
            <text x={toX + 8} y={ay + 1} dominantBaseline="central"
              fill={C.success} fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>Answer</text>
          </g>
        );
      })()}

      {/* ── Self-correction loop — clean L-shape below pipeline ── */}
      {flowP > 0.05 && (() => {
        const genCX = blockCenterX(5);
        const qtCX = blockCenterX(2);
        const loopTop = pipeY + pipeH + 10;
        const loopBottom = pipeY + pipeH + 42;
        const r = 14;
        const lp = flowP;
        // Path: down from Generation, left along bottom, up to Query Translation
        const d = [
          `M ${genCX} ${loopTop}`,
          `L ${genCX} ${loopBottom - r}`,
          `Q ${genCX} ${loopBottom} ${genCX - r} ${loopBottom}`,
          `L ${qtCX + r} ${loopBottom}`,
          `Q ${qtCX} ${loopBottom} ${qtCX} ${loopBottom - r}`,
          `L ${qtCX} ${loopTop}`,
        ].join(' ');
        return (
          <g style={{ opacity: lp * 0.5 }}>
            <path d={d} fill="none" stroke={C.generation} strokeWidth={1.5} strokeDasharray="6 4" strokeLinecap="round" />
            {/* Arrowhead pointing up */}
            <polygon points={`${qtCX},${loopTop - 2} ${qtCX - 5},${loopTop + 7} ${qtCX + 5},${loopTop + 7}`} fill={C.generation} fillOpacity={0.6} />
            {/* Label with background */}
            <rect x={(genCX + qtCX) / 2 - 74} y={loopBottom - 11} width={148} height={20} rx={4} fill={C.bg} />
            <text x={(genCX + qtCX) / 2} y={loopBottom + 1} textAnchor="middle" dominantBaseline="central"
              fill={C.generation} fontSize={12} fontFamily="monospace" fillOpacity={0.7}>self-correction loop</text>
          </g>
        );
      })()}

      {/* ── Incremental adoption card ── */}
      {incP > 0.05 && (
        <g>
          <rect x={incX - 16} y={incStartY - 24} width={incMaxW + 32} height={steps.length * incRowH + 56} rx={12}
            fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1} style={{ opacity: incP }} />
          <text x={incX} y={incStartY} fill={SLATE} fontSize={FONT_SIZE.lg} fontWeight={700}
            fontFamily={TYPOGRAPHY.heading.fontFamily} style={{ opacity: incP }}>Incremental Adoption</text>

          {steps.map((step, i) => {
            const sp = entranceSpring(frame, fps, beat('show-incremental') + i * 3);
            const ry = incStartY + 22 + i * incRowH;
            return (
              <g key={i} style={{ opacity: sp }}>
                <circle cx={incX + 12} cy={ry + 10} r={12} fill={C.blue} fillOpacity={0.06} stroke={C.blue} strokeWidth={1} />
                <text x={incX + 12} y={ry + 11} textAnchor="middle" dominantBaseline="central"
                  fill={C.blue} fontSize={FONT_SIZE.xs} fontWeight={700}>{i + 1}</text>
                <text x={incX + 32} y={ry + 11} dominantBaseline="central"
                  fill={SLATE} fontSize={FONT_SIZE.md} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>{step.text}</text>
                <text x={incX + incMaxW} y={ry + 11} textAnchor="end" dominantBaseline="central"
                  fill={SLATE_MID} fontSize={FONT_SIZE.xs} fontFamily="monospace">{step.when}</text>
              </g>
            );
          })}
        </g>
      )}

      {/* ── Final text ── */}
      <g style={{ opacity: finalP }}>
        <text x={grid.center().x} y={grid.y(0.92)} textAnchor="middle" fill={SLATE}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Production RAG</text>
        <text x={grid.center().x} y={grid.y(0.96)} textAnchor="middle" fill={SLATE_MID}
          fontSize={FONT_SIZE.lg} fontWeight={400} fontFamily={TYPOGRAPHY.body.fontFamily}>Six modules, incrementally adoptable.</text>
      </g>
    </g>
  );
};
