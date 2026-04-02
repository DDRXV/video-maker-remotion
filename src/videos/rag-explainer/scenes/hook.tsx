import React from 'react';
import { interpolate } from 'remotion';
import { useScene } from '../../../utils/scene';
import { grid } from '../../../utils/layout';
import { COLORS, TYPOGRAPHY, FONT_SIZE, MODULE_COLORS } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { FlowArrow } from '../../../components/FlowArrow';
import { TextBox } from '../../../components/TextBox';
import { LabelBadge } from '../../../components/LabelBadge';

/* ── inline SVG icons for circular nodes ── */

const DocIcon: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.cardFill} stroke={COLORS.mediumStroke} strokeWidth={2} />
    {/* stacked pages */}
    <rect x={cx - 10} y={cy - 12} width={16} height={20} rx={2} fill="none" stroke={COLORS.mediumStroke} strokeWidth={1.5} />
    <rect x={cx - 6} y={cy - 16} width={16} height={20} rx={2} fill={COLORS.cardFill} stroke={COLORS.mediumStroke} strokeWidth={1.5} />
    <line x1={cx - 2} y1={cy - 8} x2={cx + 6} y2={cy - 8} stroke={COLORS.lightStroke} strokeWidth={1} />
    <line x1={cx - 2} y1={cy - 4} x2={cx + 4} y2={cy - 4} stroke={COLORS.lightStroke} strokeWidth={1} />
    <line x1={cx - 2} y1={cy} x2={cx + 6} y2={cy} stroke={COLORS.lightStroke} strokeWidth={1} />
  </g>
);

const EmbedIcon: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.cardFill} stroke={COLORS.mediumStroke} strokeWidth={2} />
    {/* bracket pair */}
    <text x={cx} y={cy + 6} textAnchor="middle" fontSize={20} fontFamily="monospace" fill={COLORS.mediumStroke} fontWeight={700}>{'[ ]'}</text>
  </g>
);

const SearchIcon: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.cardFill} stroke={COLORS.mediumStroke} strokeWidth={2} />
    {/* magnifying glass */}
    <circle cx={cx - 3} cy={cy - 3} r={8} fill="none" stroke={COLORS.mediumStroke} strokeWidth={2} />
    <line x1={cx + 3} y1={cy + 3} x2={cx + 10} y2={cy + 10} stroke={COLORS.mediumStroke} strokeWidth={2} strokeLinecap="round" />
  </g>
);

const AnswerIcon: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.cardFill} stroke={COLORS.mediumStroke} strokeWidth={2} />
    {/* chat bubble */}
    <rect x={cx - 10} y={cy - 10} width={20} height={14} rx={4} fill="none" stroke={COLORS.mediumStroke} strokeWidth={1.5} />
    <polygon points={`${cx - 3},${cy + 4} ${cx + 2},${cy + 4} ${cx - 1},${cy + 10}`} fill={COLORS.mediumStroke} />
  </g>
);

/* ── problem illustration mini icons ── */

const MissedTargetIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    <circle cx={cx} cy={cy} r={18} fill="none" stroke={COLORS.error} strokeWidth={1.5} />
    <circle cx={cx} cy={cy} r={10} fill="none" stroke={COLORS.error} strokeWidth={1.5} />
    <circle cx={cx} cy={cy} r={3} fill={COLORS.error} />
    {/* arrow missing the center */}
    <line x1={cx + 14} y1={cy - 18} x2={cx + 6} y2={cy - 10} stroke={COLORS.error} strokeWidth={2} strokeLinecap="round" />
    <polyline points={`${cx + 14},${cy - 18} ${cx + 14},${cy - 12} ${cx + 8},${cy - 18}`} fill="none" stroke={COLORS.error} strokeWidth={1.5} />
  </g>
);

const MisfitChunkIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* puzzle pieces that don't fit */}
    <rect x={cx - 16} y={cy - 10} width={14} height={14} rx={2} fill="none" stroke={COLORS.error} strokeWidth={1.5} transform={`rotate(-8 ${cx - 9} ${cy - 3})`} />
    <rect x={cx + 2} y={cy - 6} width={14} height={14} rx={2} fill="none" stroke={COLORS.error} strokeWidth={1.5} transform={`rotate(12 ${cx + 9} ${cy + 1})`} />
    <line x1={cx - 2} y1={cy - 14} x2={cx + 2} y2={cy + 12} stroke={COLORS.error} strokeWidth={1} strokeDasharray="3 3" />
  </g>
);

const EmptyResultIcon: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {/* empty list */}
    <rect x={cx - 14} y={cy - 16} width={28} height={32} rx={3} fill="none" stroke={COLORS.error} strokeWidth={1.5} />
    <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy - 8} stroke={COLORS.error} strokeWidth={1} strokeDasharray="4 3" />
    <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke={COLORS.error} strokeWidth={1} strokeDasharray="4 3" />
    <line x1={cx - 8} y1={cy + 8} x2={cx + 8} y2={cy + 8} stroke={COLORS.error} strokeWidth={1} strokeDasharray="4 3" />
    <text x={cx} y={cy + 2} textAnchor="middle" fontSize={18} fill={COLORS.error} fontWeight={700}>?</text>
  </g>
);

/* ── main scene ── */

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');

  const pBasic = progress('show-basic-flow');
  const pProblems = progress('show-problems');
  const pModules = progress('show-six-modules');

  const nodeR = 42;
  const pipelineY = grid.y(0.3);
  const nodes = [
    { x: grid.x(0.12), label: 'Documents' },
    { x: grid.x(0.37), label: 'Embed' },
    { x: grid.x(0.62), label: 'Search' },
    { x: grid.x(0.87), label: 'Answer' },
  ];
  const Icons = [DocIcon, EmbedIcon, SearchIcon, AnswerIcon];

  // Pipeline dims when problems appear
  const pipelineOpacity = interpolate(pProblems, [0, 1], [1, 0.25]);
  // Everything dims when modules appear
  const allDimOpacity = interpolate(pModules, [0, 1], [1, 0.15]);

  // Problem cards
  const problems = [
    { label: 'Missed documents', x: grid.x(0.18), Icon: MissedTargetIcon },
    { label: 'Wrong chunk sizes', x: grid.x(0.5), Icon: MisfitChunkIcon },
    { label: 'Empty results', x: grid.x(0.82), Icon: EmptyResultIcon },
  ];
  const problemY = grid.y(0.56);

  // Six module pills
  const modules = [
    { name: 'Query Construction', color: MODULE_COLORS.queryConstruction, icon: '1' },
    { name: 'Query Translation', color: MODULE_COLORS.queryTranslation, icon: '2' },
    { name: 'Routing', color: MODULE_COLORS.routing, icon: '3' },
    { name: 'Indexing', color: MODULE_COLORS.indexing, icon: '4' },
    { name: 'Retrieval', color: MODULE_COLORS.retrieval, icon: '5' },
    { name: 'Generation', color: MODULE_COLORS.generation, icon: '6' },
  ];

  // Determine which node was most recently revealed for pulse ring
  const latestNodeIndex = (() => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const delay = beat('show-basic-flow') + i * 8;
      const np = entranceSpring(frame, fps, delay);
      if (np > 0.05) return i;
    }
    return -1;
  })();

  const PARTICLE_COLOR = COLORS.accent;

  return (
    <g>
      {/* ── Floating particles ── */}
      {[
        { x: 0.85, y: 0.15, r: 3, cycle: 100, amp: 7 },
        { x: 0.12, y: 0.72, r: 2.5, cycle: 130, amp: 9 },
        { x: 0.68, y: 0.82, r: 2, cycle: 110, amp: 6 },
        { x: 0.92, y: 0.55, r: 3.5, cycle: 150, amp: 8 },
        { x: 0.35, y: 0.12, r: 2, cycle: 90, amp: 5 },
      ].map((p, i) => {
        const py = interpolate(frame % p.cycle, [0, p.cycle / 2, p.cycle], [0, -p.amp, 0]);
        return (
          <circle key={`particle-${i}`} cx={grid.x(p.x)} cy={grid.y(p.y)} r={p.r}
            fill={PARTICLE_COLOR} fillOpacity={0.08 + (i % 3) * 0.03}
            style={{ transform: `translateY(${py}px)` }} />
        );
      })}

      {/* ── Beat 1: Basic pipeline ── */}
      <g style={{ opacity: pBasic * pipelineOpacity * allDimOpacity }}>
        {/* Subtitle */}
        <text
          x={grid.center().x} y={grid.y(0.08)}
          textAnchor="middle" fill={COLORS.lightStroke}
          fontSize={FONT_SIZE.lg} fontFamily={TYPOGRAPHY.label.fontFamily} fontWeight={TYPOGRAPHY.label.fontWeight}
          style={{ opacity: pBasic }}
        >
          The tutorial version
        </text>

        {/* Nodes */}
        {nodes.map((n, i) => {
          const Icon = Icons[i];
          const delay = beat('show-basic-flow') + i * 8;
          const np = entranceSpring(frame, fps, delay);
          const translateY = interpolate(np, [0, 1], [30, 0]);
          const isBrightest = i === latestNodeIndex;
          return (
            <g key={n.label} style={{ opacity: np, transform: `translateY(${translateY}px)` }}>
              {/* Pulse ring on newest node */}
              {isBrightest && np > 0.3 && (() => {
                const ringR = interpolate(np, [0.3, 1], [nodeR, nodeR + 30]);
                const ringOpacity = interpolate(np, [0.3, 0.6, 1], [0, 0.3, 0]);
                return (
                  <circle cx={n.x} cy={pipelineY} r={ringR} fill="none" stroke={COLORS.mediumStroke} strokeWidth={1.5} strokeOpacity={ringOpacity} />
                );
              })()}
              <Icon cx={n.x} cy={pipelineY} r={nodeR} />
              <text
                x={n.x} y={pipelineY + nodeR + 22}
                textAnchor="middle" fill={COLORS.dark}
                fontSize={FONT_SIZE.md} fontFamily={TYPOGRAPHY.label.fontFamily} fontWeight={TYPOGRAPHY.label.fontWeight}
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {/* Connection arrows */}
        {nodes.slice(0, -1).map((n, i) => (
          <FlowArrow
            key={i}
            from={{ x: n.x + nodeR + 4, y: pipelineY }}
            to={{ x: nodes[i + 1].x - nodeR - 4, y: pipelineY }}
            enterAt={beat('show-basic-flow') + (i + 1) * 8}
            color={COLORS.mediumStroke}
            strokeWidth={2}
          />
        ))}
      </g>

      {/* ── Beat 2: Problem cards ── */}
      <g style={{ opacity: pProblems * allDimOpacity }}>
        {problems.map((p, i) => {
          const delay = beat('show-problems') + i * 10;
          const cp = entranceSpring(frame, fps, delay);
          const dropY = interpolate(cp, [0, 1], [-40, 0]);
          return (
            <g key={p.label} style={{ opacity: cp, transform: `translateY(${dropY}px)` }}>
              {/* card background */}
              <rect
                x={p.x - 85} y={problemY - 45} width={170} height={120} rx={14}
                fill={COLORS.cardFill} stroke={COLORS.error} strokeWidth={2}
              />
              <p.Icon cx={p.x} cy={problemY - 2} />
              <text
                x={p.x} y={problemY + 44}
                textAnchor="middle" fill={COLORS.error}
                fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.label.fontFamily} fontWeight={600}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* ── Beat 3: Production RAG title + 6 module pills ── */}
      <g style={{ opacity: pModules }}>
        {/* Title */}
        <text
          x={grid.center().x} y={grid.y(0.22)}
          textAnchor="middle" fill={COLORS.dark}
          fontSize={FONT_SIZE['3xl']} fontFamily={TYPOGRAPHY.heading.fontFamily} fontWeight={TYPOGRAPHY.heading.fontWeight}
        >
          Production RAG
        </text>

        {/* Accent underline draws on */}
        {(() => {
          const lineW = 220;
          const lineX = grid.center().x - lineW / 2;
          const lineY = grid.y(0.22) + 14;
          const drawn = interpolate(pModules, [0, 1], [lineW, 0]);
          return (
            <line
              x1={lineX} y1={lineY} x2={lineX + lineW} y2={lineY}
              stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
              strokeDasharray={lineW} strokeDashoffset={drawn}
            />
          );
        })()}

        {/* Subtitle */}
        {(() => {
          const subDelay = beat('show-six-modules') + 12;
          const sp = entranceSpring(frame, fps, subDelay);
          return (
            <text
              x={grid.center().x} y={grid.y(0.32)}
              textAnchor="middle" fill={COLORS.lightStroke}
              fontSize={FONT_SIZE.xl} fontFamily={TYPOGRAPHY.body.fontFamily} fontWeight={TYPOGRAPHY.body.fontWeight}
              style={{ opacity: sp }}
            >
              Six modules that make RAG work at scale
            </text>
          );
        })()}

        {/* Module pills — 2 rows of 3 with wave stagger */}
        {modules.map((m, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const px = grid.x(0.05) + col * 340;
          const py = grid.y(0.44) + row * 90;
          const groupDelay = Math.floor(i / 3) * 14;
          const itemDelay = (i % 3) * 3;
          const delay = beat('show-six-modules') + 16 + groupDelay + itemDelay;
          const mp = entranceSpring(frame, fps, delay);
          const slideX = interpolate(mp, [0, 1], [20, 0]);

          return (
            <g key={m.name} style={{ opacity: mp, transform: `translateX(${slideX}px)` }}>
              {/* pill background */}
              <rect x={px} y={py} width={300} height={56} rx={28} fill={m.color} fillOpacity={0.12} stroke={m.color} strokeWidth={1.5} />
              {/* mini circle with number */}
              <circle cx={px + 30} cy={py + 28} r={18} fill={m.color} fillOpacity={0.25} />
              <text
                x={px + 30} y={py + 28} textAnchor="middle" dominantBaseline="central"
                fill={m.color} fontSize={FONT_SIZE.sm} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}
              >
                {m.icon}
              </text>
              {/* module name */}
              <text
                x={px + 62} y={py + 28} dominantBaseline="central"
                fill={COLORS.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}
              >
                {m.name}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};
