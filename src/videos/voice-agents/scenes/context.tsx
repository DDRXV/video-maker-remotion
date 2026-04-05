import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ContextScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('context');
  const pTitle = progress('show-title');
  const pCore = progress('show-llm-core');
  const pCatalog = progress('show-product-catalog');
  const pCRM = progress('show-crm-data');
  const pPlaybook = progress('show-playbook');
  const pArrows = progress('show-injection-arrows');
  const pSummary = progress('show-summary');

  // LLM core centered
  const llmW = 320;
  const llmH = 320;
  const llmX = grid.center().x - llmW / 2;
  const llmY = grid.y(0.22);

  // Source card dimensions
  const srcW = 400;
  const srcH = 300;

  const sources = [
    {
      id: 'catalog',
      title: 'Product Catalog',
      color: C.catalog,
      bg: C.catalogLight,
      x: grid.x(0.0),
      y: grid.y(0.10),
      lines: [
        { label: 'Enterprise', value: '$2,800/mo' },
        { label: 'Team', value: '$1,200/mo' },
        { label: 'Features', value: '42 integrations' },
        { label: 'SLA', value: '99.9% uptime' },
      ],
      progress: pCatalog,
      enterAt: beat('show-product-catalog'),
    },
    {
      id: 'crm',
      title: 'CRM Data',
      color: C.crm,
      bg: C.crmLight,
      x: grid.x(0.0),
      y: grid.y(0.50),
      lines: [
        { label: 'Account', value: 'TechCorp Inc.' },
        { label: 'Spend', value: '$4,200/mo' },
        { label: 'Stage', value: 'Negotiation' },
        { label: 'Renewal', value: 'Apr 15, 2026' },
      ],
      progress: pCRM,
      enterAt: beat('show-crm-data'),
    },
    {
      id: 'playbook',
      title: 'Sales Playbook',
      color: C.playbook,
      bg: C.playbookLight,
      x: grid.x(0.66),
      y: grid.y(0.10),
      lines: [
        { label: 'Price', value: 'Compare total cost' },
        { label: 'Timing', value: 'Reference renewal' },
        { label: 'Competitor', value: 'Feature matrix' },
        { label: 'Escalation', value: 'Warm transfer' },
      ],
      progress: pPlaybook,
      enterAt: beat('show-playbook'),
    },
  ];

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Your Org's Context
        </text>
      </g>

      {/* LLM core */}
      <g style={{ opacity: pCore }}>
        {/* Color zone halo */}
        <rect x={llmX - 16} y={llmY - 16} width={llmW + 32} height={llmH + 32} rx={24}
          fill={C.llm} fillOpacity={0.06} />
        <rect x={llmX} y={llmY} width={llmW} height={llmH} rx={20}
          fill={C.cardFill} stroke={C.llm} strokeWidth={2.5} />
        {/* Header */}
        <rect x={llmX} y={llmY} width={llmW} height={60} rx={20}
          fill={C.llmLight} />
        <rect x={llmX} y={llmY + 40} width={llmW} height={20}
          fill={C.llmLight} />
        {/* LLM label with icon */}
        <rect x={llmX + llmW / 2 - 32} y={llmY + 12} width={64} height={36} rx={8}
          fill={C.llm} />
        <text x={llmX + llmW / 2} y={llmY + 30} textAnchor="middle"
          dominantBaseline="central" fill="#ffffff"
          fontSize={FONT_SIZE.lg} fontWeight={700}>
          LLM
        </text>

        {/* Context window slots */}
        {(() => {
          const cwY = llmY + 76;
          const cwItems = [
            { label: 'system prompt', opacity: 0.10 },
            { label: 'knowledge base', opacity: 0.14 },
            { label: 'customer data', opacity: 0.18 },
            { label: 'conversation history', opacity: 0.22 },
          ];
          return cwItems.map((item, i) => {
            const ip = entranceSpring(frame, fps, beat('show-llm-core') + 6 + i * 3);
            return (
              <g key={i} style={{ opacity: ip }}>
                <rect x={llmX + 20} y={cwY + i * 52} width={llmW - 40} height={40} rx={8}
                  fill={C.llm} fillOpacity={item.opacity} stroke={C.llm} strokeWidth={0.5} />
                <text x={llmX + llmW / 2} y={cwY + i * 52 + 22} textAnchor="middle"
                  dominantBaseline="central" fill={C.llm} fontSize={FONT_SIZE.md}
                  fontWeight={500} fontFamily={TYPOGRAPHY.mono.fontFamily}>
                  {item.label}
                </text>
              </g>
            );
          });
        })()}
      </g>

      {/* Data source cards */}
      {sources.map((src) => {
        const slideX = src.x < grid.center().x ? -30 : 30;
        const animSlide = interpolate(src.progress, [0, 1], [slideX, 0]);
        return (
          <g key={src.id} style={{ opacity: src.progress, transform: `translateX(${animSlide}px)` }}>
            <rect x={src.x} y={src.y} width={srcW} height={srcH} rx={14}
              fill={C.cardFill} stroke={src.color} strokeWidth={2} />
            {/* Header */}
            <rect x={src.x} y={src.y} width={srcW} height={52} rx={14}
              fill={src.bg} />
            <rect x={src.x} y={src.y + 32} width={srcW} height={20}
              fill={src.bg} />
            <text x={src.x + 20} y={src.y + 28} dominantBaseline="central"
              fill={src.color} fontSize={FONT_SIZE.lg} fontWeight={700}>
              {src.title}
            </text>

            {/* Data rows */}
            {src.lines.map((line, li) => {
              const lp = entranceSpring(frame, fps, src.enterAt + 6 + li * 3);
              const ry = src.y + 66 + li * 54;
              return (
                <g key={li} style={{ opacity: lp }}>
                  <rect x={src.x + 16} y={ry} width={srcW - 32} height={42} rx={8}
                    fill={src.bg} fillOpacity={0.4} />
                  <text x={src.x + 30} y={ry + 24} dominantBaseline="central"
                    fill={C.mid} fontSize={FONT_SIZE.md} fontWeight={500}>
                    {line.label}
                  </text>
                  <text x={src.x + srcW - 30} y={ry + 24} dominantBaseline="central"
                    textAnchor="end" fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600}>
                    {line.value}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Injection arrows: hand-drawn paths, sources -> LLM */}
      <g style={{ opacity: pArrows }}>
        {/* Catalog -> LLM: horizontal then down */}
        {(() => {
          const ap = entranceSpring(frame, fps, beat('show-injection-arrows'));
          const x1 = grid.x(0.0) + srcW + 6;
          const y1 = grid.y(0.10) + srcH / 2;
          const x2 = llmX - 6;
          const y2 = llmY + 80;
          // L-shaped: go right, then turn down to LLM
          const midX = x1 + (x2 - x1) * 0.5;
          const path = `M${x1},${y1} L${midX},${y1} Q${midX + 20},${y1} ${midX + 20},${y1 + 20} L${midX + 20},${y2 - 20} Q${midX + 20},${y2} ${midX + 40},${y2} L${x2},${y2}`;
          const pathLen = 400;
          const offset = interpolate(ap, [0, 1], [pathLen, 0]);
          return (
            <g style={{ opacity: ap }}>
              <path d={path} fill="none" stroke={C.catalog} strokeWidth={2}
                strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={offset} />
              <polyline points={`${x2 - 10},${y2 - 7} ${x2},${y2} ${x2 - 10},${y2 + 7}`}
                fill="none" stroke={C.catalog} strokeWidth={2} strokeLinecap="round" style={{ opacity: ap }} />
              {/* Junction dot */}
              <circle cx={midX + 20} cy={y1} r={3.5} fill={C.catalog} style={{ opacity: ap }} />
            </g>
          );
        })()}

        {/* CRM -> LLM */}
        {(() => {
          const ap = entranceSpring(frame, fps, beat('show-injection-arrows') + 4);
          const x1 = grid.x(0.0) + srcW + 6;
          const y1 = grid.y(0.50) + srcH / 2;
          const x2 = llmX - 6;
          const y2 = llmY + 240;
          const midX = x1 + (x2 - x1) * 0.5;
          const path = `M${x1},${y1} L${midX},${y1} Q${midX + 20},${y1} ${midX + 20},${y1 - 20} L${midX + 20},${y2 + 20} Q${midX + 20},${y2} ${midX + 40},${y2} L${x2},${y2}`;
          const pathLen = 400;
          const offset = interpolate(ap, [0, 1], [pathLen, 0]);
          return (
            <g style={{ opacity: ap }}>
              <path d={path} fill="none" stroke={C.crm} strokeWidth={2}
                strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={offset} />
              <polyline points={`${x2 - 10},${y2 - 7} ${x2},${y2} ${x2 - 10},${y2 + 7}`}
                fill="none" stroke={C.crm} strokeWidth={2} strokeLinecap="round" style={{ opacity: ap }} />
              <circle cx={midX + 20} cy={y1} r={3.5} fill={C.crm} style={{ opacity: ap }} />
            </g>
          );
        })()}

        {/* Playbook -> LLM */}
        {(() => {
          const ap = entranceSpring(frame, fps, beat('show-injection-arrows') + 8);
          const x1 = grid.x(0.66) - 6;
          const y1 = grid.y(0.10) + srcH / 2;
          const x2 = llmX + llmW + 6;
          const y2 = llmY + 80;
          const midX = x2 + (x1 - x2) * 0.5;
          const path = `M${x1},${y1} L${midX},${y1} Q${midX - 20},${y1} ${midX - 20},${y1 + 20} L${midX - 20},${y2 - 20} Q${midX - 20},${y2} ${midX - 40},${y2} L${x2},${y2}`;
          const pathLen = 400;
          const offset = interpolate(ap, [0, 1], [pathLen, 0]);
          return (
            <g style={{ opacity: ap }}>
              <path d={path} fill="none" stroke={C.playbook} strokeWidth={2}
                strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={offset} />
              <polyline points={`${x2 + 10},${y2 - 7} ${x2},${y2} ${x2 + 10},${y2 + 7}`}
                fill="none" stroke={C.playbook} strokeWidth={2} strokeLinecap="round" style={{ opacity: ap }} />
              <circle cx={midX - 20} cy={y1} r={3.5} fill={C.playbook} style={{ opacity: ap }} />
            </g>
          );
        })()}
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.90)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Every response is grounded in your org's real data.
        </text>
      </g>

      {/* Ambient particles */}
      {[...Array(6)].map((_, i) => {
        const px = 180 + i * 300 + Math.sin(frame * 0.02 + i) * 15;
        const py = 160 + Math.sin(frame * 0.018 + i * 1.7) * 25;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.llm} fillOpacity={0.06 + Math.sin(frame * 0.03 + i) * 0.04} />
        );
      })}
    </g>
  );
};
