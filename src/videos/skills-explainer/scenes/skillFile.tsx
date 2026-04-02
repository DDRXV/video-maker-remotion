import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const SkillFileScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('skill-file');
  const pTitle = progress('show-title');
  const pSkillmd = progress('show-skillmd');
  const pSteps = progress('show-steps');
  const pRefAnalytics = progress('show-ref-analytics');
  const pRefArch = progress('show-ref-arch');
  const pRefScripts = progress('show-ref-scripts');
  const pSummary = progress('show-summary');

  const mdX = grid.x(0.02);
  const mdY = grid.y(0.14);
  const mdW = 420;

  const refX = grid.x(0.52);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>3</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>skill.md: The Control Center</text>
      </g>

      {/* skill.md card with step references highlighted */}
      <g style={{ opacity: pSkillmd }}>
        <rect x={mdX} y={mdY} width={mdW} height={560} rx={12}
          fill={C.codeBg} stroke={C.mid} strokeWidth={1.5} />
        <text x={mdX + 16} y={mdY + 28} fill={C.codeOrange} fontSize={14} fontFamily="monospace" fontWeight={600}>skill.md</text>
      </g>

      {/* Steps inside skill.md */}
      <g style={{ opacity: pSteps }}>
        {[
          { step: 'Step 1', text: 'Ask questions', ref: null },
          { step: 'Step 2', text: 'Write problem statement', ref: null },
          { step: 'Step 3', text: 'Define analytics events', ref: 'analytics/' },
          { step: 'Step 4', text: 'Create architecture', ref: 'architecture/' },
          { step: 'Step 5', text: 'Build user flow', ref: 'use-cases/' },
          { step: 'Step 6', text: 'Apply brand guidelines', ref: 'brand/' },
          { step: 'Step 7', text: 'Export to PDF', ref: 'scripts/' },
        ].map((s, i) => {
          const sp = entranceSpring(frame, fps, beat('show-steps') + i * 4);
          const ly = mdY + 52 + i * 68;
          const hasRef = s.ref !== null;
          return (
            <g key={i} style={{ opacity: sp }}>
              <rect x={mdX + 12} y={ly} width={mdW - 24} height={56} rx={8}
                fill={hasRef ? 'rgba(199, 91, 42, 0.06)' : 'rgba(255,255,255,0.04)'}
                stroke={hasRef ? C.accent : 'rgba(255,255,255,0.08)'} strokeWidth={1} />
              <text x={mdX + 24} y={ly + 22} fill={C.codeGreen} fontSize={13} fontFamily="monospace" fontWeight={600}>{s.step}</text>
              <text x={mdX + 100} y={ly + 22} fill="#e2e8f0" fontSize={13} fontFamily="monospace">{s.text}</text>
              {hasRef && (
                <text x={mdX + 24} y={ly + 42} fill={C.codeOrange} fontSize={12} fontFamily="monospace">
                  → {s.ref}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Reference folder cards on the right */}
      {[
        { label: 'analytics/', sub: 'events-framework.md\nmetrics-template.md', color: C.purple, bgColor: C.purpleLight, beat: 'show-ref-analytics', p: pRefAnalytics, y: grid.y(0.16) },
        { label: 'architecture/', sub: 'diagram-standards.md\nsystem-design.md', color: C.teal, bgColor: C.tealLight, beat: 'show-ref-arch', p: pRefArch, y: grid.y(0.4) },
        { label: 'scripts/', sub: 'export-pdf.sh\ngen-mermaid.sh', color: C.green, bgColor: C.greenLight, beat: 'show-ref-scripts', p: pRefScripts, y: grid.y(0.64) },
      ].map((ref, i) => {
        const rp = entranceSpring(frame, fps, beat(ref.beat));
        const slideX = interpolate(rp, [0, 1], [30, 0]);
        return (
          <g key={i} style={{ opacity: rp, transform: `translateX(${slideX}px)` }}>
            {/* Dashed line from skill.md to reference — reference/dependency style */}
            {(() => {
              const lineY = ref.y + 50;
              const lx1 = mdX + mdW + 4;
              const lx2 = refX - 4;
              return (
                <line x1={lx1} y1={lineY} x2={lx2} y2={lineY}
                  stroke={ref.color} strokeWidth={1.5} strokeLinecap="round"
                  strokeDasharray="8 4" style={{ opacity: rp * 0.6 }} />
              );
            })()}

            {/* Reference card */}
            <rect x={refX} y={ref.y} width={380} height={120} rx={12}
              fill={ref.bgColor} stroke={ref.color} strokeWidth={2} />
            {/* Folder icon */}
            <rect x={refX + 14} y={ref.y + 14} width={32} height={24} rx={4}
              fill={ref.color} fillOpacity={0.2} stroke={ref.color} strokeWidth={1.5} />
            <rect x={refX + 14} y={ref.y + 10} width={16} height={8} rx={3}
              fill={ref.color} fillOpacity={0.3} />
            <text x={refX + 58} y={ref.y + 32} fill={ref.color}
              fontSize={FONT_SIZE.md} fontWeight={700} fontFamily="monospace">{ref.label}</text>
            {/* File list */}
            {ref.sub.split('\n').map((file, fi) => (
              <text key={fi} x={refX + 30} y={ref.y + 60 + fi * 24} fill={C.mid}
                fontSize={FONT_SIZE.xs} fontFamily="monospace">{file}</text>
            ))}
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          skill.md orchestrates. Reference files carry the expertise.
        </text>
      </g>
    </g>
  );
};
