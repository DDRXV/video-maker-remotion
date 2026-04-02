import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

interface FolderEntry {
  name: string;
  indent: number;
  isFolder: boolean;
  color: string;
  beatLabel: string;
}

const tree: FolderEntry[] = [
  { name: 'prd-maker/', indent: 0, isFolder: true, color: C.accent, beatLabel: 'show-root' },
  { name: 'skill.md', indent: 1, isFolder: false, color: C.accent, beatLabel: 'show-root' },
  { name: 'analytics/', indent: 1, isFolder: true, color: C.purple, beatLabel: 'show-analytics' },
  { name: 'events-framework.md', indent: 2, isFolder: false, color: C.purple, beatLabel: 'show-analytics' },
  { name: 'metrics-template.md', indent: 2, isFolder: false, color: C.purple, beatLabel: 'show-analytics' },
  { name: 'dashboard-spec.md', indent: 2, isFolder: false, color: C.purple, beatLabel: 'show-analytics' },
  { name: 'architecture/', indent: 1, isFolder: true, color: C.teal, beatLabel: 'show-architecture' },
  { name: 'diagram-standards.md', indent: 2, isFolder: false, color: C.teal, beatLabel: 'show-architecture' },
  { name: 'system-design.md', indent: 2, isFolder: false, color: C.teal, beatLabel: 'show-architecture' },
  { name: 'use-cases/', indent: 1, isFolder: true, color: C.blue, beatLabel: 'show-usecases' },
  { name: 'user-stories.md', indent: 2, isFolder: false, color: C.blue, beatLabel: 'show-usecases' },
  { name: 'edge-cases.md', indent: 2, isFolder: false, color: C.blue, beatLabel: 'show-usecases' },
  { name: 'brand/', indent: 1, isFolder: true, color: C.amber, beatLabel: 'show-brand' },
  { name: 'colors.md', indent: 2, isFolder: false, color: C.amber, beatLabel: 'show-brand' },
  { name: 'typography.md', indent: 2, isFolder: false, color: C.amber, beatLabel: 'show-brand' },
  { name: 'doc-format.md', indent: 2, isFolder: false, color: C.amber, beatLabel: 'show-brand' },
  { name: 'scripts/', indent: 1, isFolder: true, color: C.green, beatLabel: 'show-scripts' },
  { name: 'export-pdf.sh', indent: 2, isFolder: false, color: C.green, beatLabel: 'show-scripts' },
  { name: 'gen-mermaid.sh', indent: 2, isFolder: false, color: C.green, beatLabel: 'show-scripts' },
  { name: 'deploy-notion.sh', indent: 2, isFolder: false, color: C.green, beatLabel: 'show-scripts' },
];

export const FolderStructureScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('folder-structure');
  const pTitle = progress('show-title');
  const pSummary = progress('show-summary');

  const treeX = grid.x(0.15);
  const treeY = grid.y(0.12);
  const lineH = 36;

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>4</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Folder Structure</text>
      </g>

      {/* File tree */}
      {tree.map((entry, i) => {
        const ep = entranceSpring(frame, fps, beat(entry.beatLabel) + (entry.indent === 2 ? 4 : 0) + i * 1);
        const ey = treeY + i * lineH;
        const ex = treeX + entry.indent * 32;
        const slideY = interpolate(ep, [0, 1], [10, 0]);

        return (
          <g key={i} style={{ opacity: ep, transform: `translateY(${slideY}px)` }}>
            {/* Tree connector lines */}
            {entry.indent > 0 && (
              <g>
                <line x1={ex - 16} y1={ey - lineH / 2 + 8} x2={ex - 16} y2={ey + 12}
                  stroke={C.hairline} strokeWidth={1.5} />
                <line x1={ex - 16} y1={ey + 12} x2={ex - 4} y2={ey + 12}
                  stroke={C.hairline} strokeWidth={1.5} />
              </g>
            )}

            {/* Folder/file icon */}
            {entry.isFolder ? (
              <g>
                <rect x={ex} y={ey + 2} width={22} height={16} rx={3}
                  fill={entry.color} fillOpacity={0.15} stroke={entry.color} strokeWidth={1.5} />
                <rect x={ex} y={ey - 1} width={12} height={6} rx={2}
                  fill={entry.color} fillOpacity={0.25} />
              </g>
            ) : (
              <rect x={ex + 2} y={ey + 2} width={16} height={18} rx={2}
                fill={C.cardFill} stroke={entry.color} strokeWidth={1} />
            )}

            {/* Name */}
            <text x={ex + 30} y={ey + 16} fill={entry.isFolder ? entry.color : C.dark}
              fontSize={FONT_SIZE.sm} fontWeight={entry.isFolder ? 700 : 400} fontFamily="monospace">
              {entry.name}
            </text>
          </g>
        );
      })}

      {/* Description cards on the right for each folder group */}
      {[
        { label: 'Domain prompts', sub: 'Each section of the PRD gets its own expert prompt', color: C.purple, y: grid.y(0.2), beatLabel: 'show-analytics' },
        { label: 'Diagram standards', sub: 'Mermaid syntax, diagram types, labeling rules', color: C.teal, y: grid.y(0.38), beatLabel: 'show-architecture' },
        { label: 'Brand consistency', sub: 'Colors, fonts, doc layout for every output', color: C.amber, y: grid.y(0.56), beatLabel: 'show-brand' },
        { label: 'Automation', sub: 'PDF export, image gen, deployment scripts', color: C.green, y: grid.y(0.7), beatLabel: 'show-scripts' },
      ].map((desc, i) => {
        const dp = entranceSpring(frame, fps, beat(desc.beatLabel) + 6);
        const slideX = interpolate(dp, [0, 1], [20, 0]);
        const dx = grid.x(0.6);
        return (
          <g key={i} style={{ opacity: dp, transform: `translateX(${slideX}px)` }}>
            <rect x={dx} y={desc.y} width={340} height={70} rx={12}
              fill={C.cardFill} stroke={desc.color} strokeWidth={1.5} />
            <text x={dx + 16} y={desc.y + 28} fill={desc.color}
              fontSize={FONT_SIZE.sm} fontWeight={700}>{desc.label}</text>
            <text x={dx + 16} y={desc.y + 52} fill={C.mid}
              fontSize={FONT_SIZE.xs}>{desc.sub}</text>
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Each folder is a domain of expertise that skill.md pulls from.
        </text>
      </g>
    </g>
  );
};
