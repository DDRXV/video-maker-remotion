import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { FlowArrow } from '../../../components/FlowArrow';
import { C, useScene } from '../styles';

export const ActivationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('activation');
  const pTitle = progress('show-title');
  const pUserInput = progress('show-user-input');
  const pMatch = progress('show-match');
  const pLoadSkill = progress('show-load-skill');
  const pOnDemand = progress('show-on-demand');
  const pExecute = progress('show-execute');
  const pSummary = progress('show-summary');

  const flowY = grid.y(0.32);
  const nodeW = 200;
  const nodeH = 100;
  const startX = grid.x(0.02);
  const gapX = 60;

  const nodes = [
    { label: 'User Types', sub: '"/prd add collab\nto dashboard"', color: C.dark, bg: '#f1f5f9', beatP: pUserInput },
    { label: 'Match Skills', sub: 'Check all skill\ndescriptions', color: C.accent, bg: C.accentLight, beatP: pMatch },
    { label: 'Load skill.md', sub: 'Instructions enter\nClaude context', color: C.blue, bg: C.blueLight, beatP: pLoadSkill },
    { label: 'Execute Steps', sub: 'Follow plan,\npull refs on demand', color: C.green, bg: C.greenLight, beatP: pExecute },
  ];

  // Focus dimming
  const latestNode = (() => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i].beatP > 0.05) return i;
    }
    return -1;
  })();

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>8</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>How Activation Works</text>
      </g>

      {/* Flow nodes */}
      {nodes.map((node, i) => {
        const nx = startX + i * (nodeW + gapX);
        const dist = latestNode - i;
        const focusOp = node.beatP > 0.05 ? (dist === 0 ? 1 : dist <= 1 ? 0.55 : 0.3) : 0;
        const slideY = interpolate(node.beatP, [0, 1], [20, 0]);

        return (
          <g key={i} style={{ opacity: focusOp, transform: `translateY(${slideY}px)` }}>
            <rect x={nx} y={flowY} width={nodeW} height={nodeH} rx={14}
              fill={node.bg} stroke={node.color} strokeWidth={2} />
            {/* Step number */}
            <circle cx={nx + nodeW / 2} cy={flowY - 16} r={14}
              fill={node.color} fillOpacity={0.15} stroke={node.color} strokeWidth={1.5} />
            <text x={nx + nodeW / 2} y={flowY - 16} textAnchor="middle" dominantBaseline="central"
              fill={node.color} fontSize={FONT_SIZE.xs} fontWeight={700}>{i + 1}</text>

            <text x={nx + nodeW / 2} y={flowY + 30} textAnchor="middle" fill={node.color}
              fontSize={FONT_SIZE.sm} fontWeight={700}>{node.label}</text>
            {node.sub.split('\n').map((line, li) => (
              <text key={li} x={nx + nodeW / 2} y={flowY + 54 + li * 20} textAnchor="middle" fill={C.mid}
                fontSize={FONT_SIZE.xs}>{line}</text>
            ))}
          </g>
        );
      })}

      {/* Arrows between nodes */}
      {nodes.slice(0, -1).map((_, i) => {
        const fromX = startX + i * (nodeW + gapX) + nodeW + 4;
        const toX = startX + (i + 1) * (nodeW + gapX) - 4;
        const beatLabels = ['show-match', 'show-load-skill', 'show-execute'];
        return (
          <FlowArrow key={i}
            from={{ x: fromX, y: flowY + nodeH / 2 }}
            to={{ x: toX, y: flowY + nodeH / 2 }}
            enterAt={beat(beatLabels[i])}
            color={C.mid} strokeWidth={2} elbow />
        );
      })}

      {/* On-demand loading detail */}
      <g style={{ opacity: pOnDemand }}>
        <text x={grid.center().x} y={grid.y(0.56)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.lg} fontWeight={700}>References loaded on demand</text>

        {/* Timeline showing sequential loading */}
        {[
          { step: 'Step 3: Analytics', file: 'analytics/events.md', color: C.purple },
          { step: 'Step 4: Architecture', file: 'architecture/diagrams.md', color: C.teal },
          { step: 'Step 5: User Flow', file: 'use-cases/stories.md', color: C.blue },
          { step: 'Step 6: Brand', file: 'brand/colors.md', color: C.amber },
          { step: 'Step 7: Export', file: 'scripts/export-pdf.sh', color: C.green },
        ].map((item, i) => {
          const ip = entranceSpring(frame, fps, beat('show-on-demand') + i * 5);
          const ix = grid.x(0.06) + i * 190;
          const iy = grid.y(0.64);
          return (
            <g key={i} style={{ opacity: ip }}>
              <rect x={ix} y={iy} width={175} height={70} rx={10}
                fill={C.cardFill} stroke={item.color} strokeWidth={1.5} />
              <text x={ix + 88} y={iy + 24} textAnchor="middle" fill={item.color}
                fontSize={13} fontWeight={600}>{item.step}</text>
              <text x={ix + 88} y={iy + 48} textAnchor="middle" fill={C.mid}
                fontSize={12} fontFamily="monospace">{item.file}</text>
              {/* Arrow down indicating "loaded here" */}
              <line x1={ix + 88} y1={iy - 4} x2={ix + 88} y2={iy - 16}
                stroke={item.color} strokeWidth={1.5} />
              <circle cx={ix + 88} cy={iy - 20} r={4} fill={item.color} />
            </g>
          );
        })}
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The skill is the plan. The references are the expertise.
        </text>
      </g>
    </g>
  );
};
