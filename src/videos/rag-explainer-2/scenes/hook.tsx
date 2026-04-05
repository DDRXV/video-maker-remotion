import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { FlowArrow } from '../../../components/FlowArrow';
import { TextBox } from '../../../components/TextBox';

/**
 * ByteByteGo-style hook scene.
 * Shows the basic pipeline, reveals problems, then introduces the 6 modules.
 * Horizontal bus layout with clean numbered modules.
 */

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');

  const pBasic = progress('show-basic-flow');
  const pProblems = progress('show-problems');
  const pModules = progress('show-six-modules');

  // Pipeline
  const pipeY = grid.y(0.28);
  const nodeW = 160;
  const nodeH = 60;
  const nodes = ['Documents', 'Embed', 'Search', 'Answer'];
  const nodeGap = 80;
  const totalPipeW = nodes.length * nodeW + (nodes.length - 1) * nodeGap;
  const pipeStartX = grid.center().x - totalPipeW / 2;

  const pipelineOpacity = interpolate(pProblems, [0, 1], [1, 0.2], { extrapolateRight: 'clamp' });
  const allDimOpacity = interpolate(pModules, [0, 1], [1, 0.1], { extrapolateRight: 'clamp' });

  // Problems
  const problems = [
    { label: 'Missed documents', desc: 'Relevant docs not retrieved' },
    { label: 'Wrong chunk sizes', desc: 'Chunks too big or too small' },
    { label: 'Vague queries', desc: 'User questions don\'t match anything' },
  ];
  const problemY = grid.y(0.52);

  // Six modules
  const modules = [
    { name: 'Query Construction', color: C.queryConstruction },
    { name: 'Query Translation', color: C.queryTranslation },
    { name: 'Routing', color: C.routing },
    { name: 'Indexing', color: C.indexing },
    { name: 'Retrieval', color: C.retrieval },
    { name: 'Generation', color: C.generation },
  ];

  return (
    <g>
      {/* Subtitle */}
      <g style={{ opacity: pBasic * pipelineOpacity * allDimOpacity }}>
        <text x={grid.center().x} y={grid.y(0.06)} textAnchor="middle" fill={C.mid} fontSize={FONT_SIZE.lg} fontFamily={TYPOGRAPHY.label.fontFamily} fontWeight={500}>
          The tutorial version
        </text>
      </g>

      {/* Basic pipeline */}
      <g style={{ opacity: pBasic * pipelineOpacity * allDimOpacity }}>
        {nodes.map((label, i) => {
          const nx = pipeStartX + i * (nodeW + nodeGap);
          const delay = beat('show-basic-flow') + i * 8;
          const np = entranceSpring(frame, fps, delay);
          const ty = interpolate(np, [0, 1], [20, 0], { extrapolateRight: 'clamp' });
          return (
            <g key={label} style={{ opacity: np, transform: `translateY(${ty}px)` }}>
              <rect x={nx} y={pipeY} width={nodeW} height={nodeH} rx={10} fill={C.cardFill} stroke={C.blue} strokeWidth={2} />
              <text x={nx + nodeW / 2} y={pipeY + nodeH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
            </g>
          );
        })}
        {/* Arrows */}
        {nodes.slice(0, -1).map((_, i) => {
          const fromX = pipeStartX + i * (nodeW + nodeGap) + nodeW;
          const toX = pipeStartX + (i + 1) * (nodeW + nodeGap);
          return (
            <FlowArrow
              key={i}
              from={{ x: fromX + 4, y: pipeY + nodeH / 2 }}
              to={{ x: toX - 4, y: pipeY + nodeH / 2 }}
              enterAt={beat('show-basic-flow') + (i + 1) * 8}
              color={C.blue} strokeWidth={2}
            />
          );
        })}
      </g>

      {/* Problem cards */}
      <g style={{ opacity: pProblems * allDimOpacity }}>
        {problems.map((p, i) => {
          const cardW = 380;
          const gap = 40;
          const totalW = problems.length * cardW + (problems.length - 1) * gap;
          const sx = grid.center().x - totalW / 2 + i * (cardW + gap);
          const delay = beat('show-problems') + i * 10;
          const cp = entranceSpring(frame, fps, delay);
          const ty = interpolate(cp, [0, 1], [-30, 0], { extrapolateRight: 'clamp' });
          return (
            <g key={p.label} style={{ opacity: cp, transform: `translateY(${ty}px)` }}>
              <rect x={sx} y={problemY} width={cardW} height={100} rx={12} fill={C.cardFill} stroke={C.error} strokeWidth={1.5} />
              <rect x={sx} y={problemY} width={6} height={100} rx={3} fill={C.error} fillOpacity={0.8} />
              {/* X icon */}
              <circle cx={sx + 34} cy={problemY + 34} r={14} fill={C.error} fillOpacity={0.1} />
              <line x1={sx + 28} y1={problemY + 28} x2={sx + 40} y2={problemY + 40} stroke={C.error} strokeWidth={2} strokeLinecap="round" />
              <line x1={sx + 40} y1={problemY + 28} x2={sx + 28} y2={problemY + 40} stroke={C.error} strokeWidth={2} strokeLinecap="round" />
              <text x={sx + 60} y={problemY + 34} dominantBaseline="central" fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{p.label}</text>
              <text x={sx + 60} y={problemY + 64} fill={C.mid} fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.body.fontFamily}>{p.desc}</text>
            </g>
          );
        })}
      </g>

      {/* Six modules — horizontal numbered pills */}
      <g style={{ opacity: pModules }}>
        <text x={grid.center().x} y={grid.y(0.2)} textAnchor="middle" fill={C.dark} fontSize={FONT_SIZE['3xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Production RAG
        </text>

        {/* Underline */}
        {(() => {
          const lineW = 280;
          const drawn = interpolate(pModules, [0, 1], [lineW, 0], { extrapolateRight: 'clamp' });
          return (
            <line
              x1={grid.center().x - lineW / 2} y1={grid.y(0.2) + 16}
              x2={grid.center().x + lineW / 2} y2={grid.y(0.2) + 16}
              stroke={C.blue} strokeWidth={3} strokeLinecap="round"
              strokeDasharray={lineW} strokeDashoffset={drawn}
            />
          );
        })()}

        <text x={grid.center().x} y={grid.y(0.3)} textAnchor="middle" fill={C.mid} fontSize={FONT_SIZE.xl} fontFamily={TYPOGRAPHY.body.fontFamily}>
          Six modules that make RAG work at scale
        </text>

        {/* Module pills — 2 rows of 3 */}
        {modules.map((m, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const pillW = 340;
          const pillH = 56;
          const gapX = 30;
          const gapY = 24;
          const totalRowW = 3 * pillW + 2 * gapX;
          const baseX = grid.center().x - totalRowW / 2;
          const px = baseX + col * (pillW + gapX);
          const py = grid.y(0.4) + row * (pillH + gapY);
          const delay = beat('show-six-modules') + 16 + Math.floor(i / 3) * 14 + (i % 3) * 3;
          const mp = entranceSpring(frame, fps, delay);
          const slideX = interpolate(mp, [0, 1], [20, 0], { extrapolateRight: 'clamp' });

          return (
            <g key={m.name} style={{ opacity: mp, transform: `translateX(${slideX}px)` }}>
              <rect x={px} y={py} width={pillW} height={pillH} rx={pillH / 2} fill={m.color} fillOpacity={0.1} stroke={m.color} strokeWidth={1.5} />
              <circle cx={px + 30} cy={py + pillH / 2} r={18} fill={m.color} fillOpacity={0.2} />
              <text x={px + 30} y={py + pillH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={m.color} fontSize={FONT_SIZE.sm} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{i + 1}</text>
              <text x={px + 62} y={py + pillH / 2 + 1} dominantBaseline="central" fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{m.name}</text>
            </g>
          );
        })}
      </g>

      {/* Summary */}
      <TextBox
        x={grid.x(0.1)} y={grid.y(0.88)} maxWidth={grid.x(0.8)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={C.mid}
        enterAt={beat('show-six-modules') + 30} align="center"
      >
        Each one solves a specific failure mode. Let's walk through all six.
      </TextBox>
    </g>
  );
};
