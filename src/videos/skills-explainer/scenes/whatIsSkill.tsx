import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const WhatIsSkillScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('what-is-skill');
  const pTitle = progress('show-title');
  const pMdFile = progress('show-md-file');
  const pPath = progress('show-path');
  const pTrigger = progress('show-trigger');
  const pFront = progress('show-frontmatter');
  const pBody = progress('show-body');

  const fileX = grid.x(0.3);
  const fileY = grid.y(0.2);
  const fileW = 480;
  const fileH = 520;

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>2</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>What Is a Skill?</text>
      </g>

      {/* One-line definition */}
      <g style={{ opacity: pMdFile }}>
        <text x={grid.x(0.04)} y={grid.y(0.13)} fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600}>
          A markdown file that teaches Claude a specific job.
        </text>
      </g>

      {/* File mockup */}
      <g style={{ opacity: pPath }}>
        {/* File path */}
        <rect x={fileX} y={fileY - 36} width={fileW} height={32} rx={8}
          fill={C.codeBg} />
        <text x={fileX + 16} y={fileY - 16} fill={C.codeGray} fontSize={14} fontFamily="monospace">
          ~/.claude/skills/prd-maker/
        </text>
        <text x={fileX + 340} y={fileY - 16} fill={C.codeOrange} fontSize={14} fontFamily="monospace" fontWeight={600}>
          skill.md
        </text>

        {/* File container */}
        <rect x={fileX} y={fileY} width={fileW} height={fileH} rx={12}
          fill={C.cardFill} stroke={C.hairline} strokeWidth={2} />
      </g>

      {/* Frontmatter section */}
      <g style={{ opacity: pFront }}>
        <rect x={fileX + 16} y={fileY + 16} width={fileW - 32} height={140} rx={8}
          fill={C.accentLight} stroke={C.accent} strokeWidth={1.5} />
        <text x={fileX + 32} y={fileY + 42} fill={C.codeGray} fontSize={14} fontFamily="monospace">---</text>
        <text x={fileX + 32} y={fileY + 64} fill={C.accent} fontSize={14} fontFamily="monospace" fontWeight={600}>name:</text>
        <text x={fileX + 100} y={fileY + 64} fill={C.dark} fontSize={14} fontFamily="monospace"> prd-maker</text>
        <text x={fileX + 32} y={fileY + 86} fill={C.accent} fontSize={14} fontFamily="monospace" fontWeight={600}>description:</text>
        <text x={fileX + 160} y={fileY + 86} fill={C.dark} fontSize={14} fontFamily="monospace"> Creates detailed PRDs</text>
        <text x={fileX + 80} y={fileY + 108} fill={C.dark} fontSize={14} fontFamily="monospace">with diagrams and branded export</text>
        <text x={fileX + 32} y={fileY + 130} fill={C.codeGray} fontSize={14} fontFamily="monospace">---</text>

        {/* Label */}
        <rect x={fileX + fileW - 130} y={fileY + 16} width={114} height={28} rx={14}
          fill={C.accent} fillOpacity={0.1} stroke={C.accent} strokeWidth={1} />
        <text x={fileX + fileW - 73} y={fileY + 34} textAnchor="middle" fill={C.accent}
          fontSize={13} fontWeight={600}>Frontmatter</text>
      </g>

      {/* Body section */}
      <g style={{ opacity: pBody }}>
        <rect x={fileX + 16} y={fileY + 172} width={fileW - 32} height={320} rx={8}
          fill={C.bg} stroke={C.hairline} strokeWidth={1} />

        {/* Instruction lines */}
        {[
          { text: '# PRD Maker', color: C.dark, weight: 700, size: FONT_SIZE.md },
          { text: '', color: C.dark, weight: 400, size: 14 },
          { text: '## Step 1: Ask Questions', color: C.accent, weight: 600, size: 15 },
          { text: 'Before writing, ask:', color: C.mid, weight: 400, size: 14 },
          { text: '- What feature?', color: C.dark, weight: 400, size: 14 },
          { text: '- Who is the user?', color: C.dark, weight: 400, size: 14 },
          { text: '- What are the constraints?', color: C.dark, weight: 400, size: 14 },
          { text: '', color: C.dark, weight: 400, size: 14 },
          { text: '## Step 2: Draft PRD', color: C.accent, weight: 600, size: 15 },
          { text: 'Follow the structure in', color: C.mid, weight: 400, size: 14 },
          { text: 'references/prd-template.md', color: C.blue, weight: 500, size: 14 },
          { text: '', color: C.dark, weight: 400, size: 14 },
          { text: '## Step 3: Generate Diagrams', color: C.accent, weight: 600, size: 15 },
          { text: '...', color: C.light, weight: 400, size: 14 },
        ].map((line, i) => {
          const lp = entranceSpring(frame, fps, beat('show-body') + i * 2);
          return (
            <text key={i} x={fileX + 32} y={fileY + 196 + i * 22} fill={line.color}
              fontSize={line.size} fontWeight={line.weight} fontFamily="monospace"
              style={{ opacity: lp }}>
              {line.text}
            </text>
          );
        })}

        {/* Label */}
        <rect x={fileX + fileW - 150} y={fileY + 172} width={134} height={28} rx={14}
          fill={C.blue} fillOpacity={0.1} stroke={C.blue} strokeWidth={1} />
        <text x={fileX + fileW - 83} y={fileY + 190} textAnchor="middle" fill={C.blue}
          fontSize={13} fontWeight={600}>Instructions</text>
      </g>

      {/* Trigger explanation — right side */}
      <g style={{ opacity: pTrigger }}>
        {(() => {
          const rx = grid.x(0.04);
          const ry = grid.y(0.7);
          return (
            <g>
              <rect x={rx} y={ry} width={260} height={80} rx={12}
                fill={C.cardFill} stroke={C.accent} strokeWidth={2} />
              <text x={rx + 130} y={ry + 30} textAnchor="middle" fill={C.dark}
                fontSize={FONT_SIZE.sm} fontWeight={600}>Triggers on</text>
              <text x={rx + 130} y={ry + 56} textAnchor="middle" fill={C.accent}
                fontSize={FONT_SIZE.md} fontWeight={700} fontFamily="monospace">/prd</text>
            </g>
          );
        })()}
      </g>
    </g>
  );
};
