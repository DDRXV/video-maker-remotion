import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const DeepPromptsScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('deep-prompts');
  const pTitle = progress('show-title');
  const pAnalyticsOpen = progress('show-analytics-open');
  const pEventsContent = progress('show-events-content');
  const pArchOpen = progress('show-arch-open');
  const pDiagramContent = progress('show-diagram-content');
  const pSummary = progress('show-summary');

  const analyticsDim = interpolate(pArchOpen, [0, 1], [1, 0.25]);

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>5</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Deep Prompt Folders</text>
      </g>

      {/* Analytics folder — expanded */}
      <g style={{ opacity: pAnalyticsOpen * analyticsDim }}>
        {/* Folder header */}
        <rect x={grid.x(0.04)} y={grid.y(0.14)} width={grid.x(0.92)} height={52} rx={12}
          fill={C.purpleLight} stroke={C.purple} strokeWidth={2} />
        <text x={grid.x(0.08)} y={grid.y(0.14) + 32} fill={C.purple}
          fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="monospace">analytics/events-framework.md</text>

        {/* Content card */}
        <g style={{ opacity: pEventsContent }}>
          <rect x={grid.x(0.04)} y={grid.y(0.14) + 60} width={grid.x(0.92)} height={280} rx={12}
            fill={C.codeBg} stroke={C.purple} strokeWidth={1} />

          {/* Actual content showing the framework */}
          {[
            { text: '# Analytics Events Framework', color: '#e2e8f0', weight: 700 },
            { text: '', color: C.codeGray, weight: 400 },
            { text: '## Event Structure', color: C.codePurple, weight: 600 },
            { text: 'Every event must define:', color: C.codeGray, weight: 400 },
            { text: '', color: C.codeGray, weight: 400 },
            { text: '| Field          | Required | Example              |', color: C.codeBlue, weight: 400 },
            { text: '|----------------|----------|----------------------|', color: C.codeGray, weight: 400 },
            { text: '| event_name     | yes      | feature_activated    |', color: '#e2e8f0', weight: 400 },
            { text: '| trigger        | yes      | button_click         |', color: '#e2e8f0', weight: 400 },
            { text: '| properties     | yes      | { plan: "pro" }      |', color: '#e2e8f0', weight: 400 },
            { text: '| funnel         | yes      | onboarding           |', color: '#e2e8f0', weight: 400 },
          ].map((line, i) => {
            const lp = entranceSpring(frame, fps, beat('show-events-content') + i * 2);
            return (
              <text key={i} x={grid.x(0.06)} y={grid.y(0.14) + 88 + i * 22}
                fill={line.color} fontSize={14} fontWeight={line.weight} fontFamily="monospace"
                style={{ opacity: lp }}>
                {line.text}
              </text>
            );
          })}
        </g>
      </g>

      {/* Architecture folder — expanded */}
      <g style={{ opacity: pArchOpen }}>
        <rect x={grid.x(0.04)} y={grid.y(0.14)} width={grid.x(0.92)} height={52} rx={12}
          fill={C.tealLight} stroke={C.teal} strokeWidth={2} />
        <text x={grid.x(0.08)} y={grid.y(0.14) + 32} fill={C.teal}
          fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="monospace">architecture/diagram-standards.md</text>

        <g style={{ opacity: pDiagramContent }}>
          <rect x={grid.x(0.04)} y={grid.y(0.14) + 60} width={grid.x(0.92)} height={280} rx={12}
            fill={C.codeBg} stroke={C.teal} strokeWidth={1} />

          {[
            { text: '# Diagram Standards', color: '#e2e8f0', weight: 700 },
            { text: '', color: C.codeGray, weight: 400 },
            { text: '## Mermaid Conventions', color: C.codeBlue, weight: 600 },
            { text: '', color: C.codeGray, weight: 400 },
            { text: '- Use flowchart TD for user flows', color: '#e2e8f0', weight: 400 },
            { text: '- Use C4Context for system architecture', color: '#e2e8f0', weight: 400 },
            { text: '- Use sequenceDiagram for API flows', color: '#e2e8f0', weight: 400 },
            { text: '', color: C.codeGray, weight: 400 },
            { text: '## Node Labeling', color: C.codeBlue, weight: 600 },
            { text: '- Services: PascalCase (AuthService)', color: '#e2e8f0', weight: 400 },
            { text: '- Databases: suffix with DB (UsersDB)', color: '#e2e8f0', weight: 400 },
            { text: '- Queues: suffix with Queue (EmailQueue)', color: '#e2e8f0', weight: 400 },
          ].map((line, i) => {
            const lp = entranceSpring(frame, fps, beat('show-diagram-content') + i * 2);
            return (
              <text key={i} x={grid.x(0.06)} y={grid.y(0.14) + 88 + i * 22}
                fill={line.color} fontSize={14} fontWeight={line.weight} fontFamily="monospace"
                style={{ opacity: lp }}>
                {line.text}
              </text>
            );
          })}
        </g>
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          These encode your team's standards. Claude follows them exactly.
        </text>
      </g>
    </g>
  );
};
