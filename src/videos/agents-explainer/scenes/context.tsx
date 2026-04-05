import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ContextScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('context');
  const pTitle = progress('show-title');
  const pMainCtx = progress('show-main-context');
  const pSubCtx = progress('show-subagent-context');
  const pIsolation = progress('show-isolation');
  const pResultSlim = progress('show-result-slim');
  const pSummary = progress('show-summary');

  const mainX = grid.x(0.02);
  const subX = grid.x(0.52);
  const ctxY = grid.y(0.14);
  const ctxW = 400;
  const ctxH = 460;

  const arrowMidX = (mainX + ctxW + subX) / 2;

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>6</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Context Isolation</text>
      </g>

      {/* ─── Main Context Window (left, accent border) ─── */}
      <g style={{ opacity: pMainCtx }}>
        <rect x={mainX} y={ctxY} width={ctxW} height={ctxH} rx={14}
          fill={C.cardFill} stroke={C.accent} strokeWidth={2.5} />
        {/* Header */}
        <rect x={mainX} y={ctxY} width={ctxW} height={44} rx={14} fill={C.accentLight} />
        <rect x={mainX} y={ctxY + 30} width={ctxW} height={14} fill={C.accentLight} />
        <text x={mainX + ctxW / 2} y={ctxY + 28} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.sm} fontWeight={700}>Main Context</text>

        {/* Prompt line */}
        {(() => {
          const lp = entranceSpring(frame, fps, beat('show-main-context') + 4);
          return (
            <g style={{ opacity: lp }}>
              <rect x={mainX + 16} y={ctxY + 60} width={ctxW - 32} height={32} rx={6}
                fill={C.codeBg} />
              <text x={mainX + 26} y={ctxY + 81} fill={C.codeOrange}
                fontSize={12} fontFamily="monospace" fontWeight={600}>
                "Plan my launch"
              </text>
            </g>
          );
        })()}

        {/* 4 slim result lines */}
        {[
          { text: 'Competitor report: 2 paragraphs', color: C.blue, w: 260 },
          { text: 'Press release: 400 words', color: C.purple, w: 220 },
          { text: 'Timeline: 6 weeks', color: C.teal, w: 180 },
          { text: 'Landing copy: 4 sections', color: C.accent, w: 210 },
        ].map((line, i) => {
          const lp = entranceSpring(frame, fps, beat('show-result-slim') + i * 3);
          return (
            <g key={i} style={{ opacity: lp }}>
              <rect x={mainX + 16} y={ctxY + 110 + i * 36} width={line.w} height={24} rx={5}
                fill={line.color} fillOpacity={0.1} stroke={line.color} strokeWidth={0.5} />
              <text x={mainX + 26} y={ctxY + 110 + i * 36 + 16} fill={line.color}
                fontSize={12} fontFamily="monospace" fontWeight={500}>{line.text}</text>
            </g>
          );
        })}

        {/* Clean label at bottom */}
        <text x={mainX + ctxW / 2} y={ctxY + ctxH - 24} textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE.xs} fontWeight={600} style={{ opacity: pMainCtx }}>
          Clean and focused
        </text>
      </g>

      {/* ─── Subagent Context Window (right, blue border) ─── */}
      <g style={{ opacity: pSubCtx }}>
        <rect x={subX} y={ctxY} width={ctxW} height={ctxH} rx={14}
          fill={C.cardFill} stroke={C.blue} strokeWidth={2.5} />
        {/* Header */}
        <rect x={subX} y={ctxY} width={ctxW} height={44} rx={14} fill={C.blueLight} />
        <rect x={subX} y={ctxY + 30} width={ctxW} height={14} fill={C.blueLight} />
        <text x={subX + ctxW / 2} y={ctxY + 28} textAnchor="middle" fill={C.blue}
          fontSize={FONT_SIZE.sm} fontWeight={700}>Subagent Context</text>

        {/* Messy research data lines */}
        {[
          { text: 'jasper.ai/blog/launch', color: C.blue },
          { text: 'Copy.ai raised $11M Series A', color: C.blue },
          { text: 'Writesonic: 2M users globally', color: C.blue },
          { text: '"How Jasper scaled to $80M ARR"', color: C.mid },
          { text: 'competitor_pricing_table.csv', color: C.mid },
          { text: 'G2 reviews: Jasper 4.7, Copy 4.4', color: C.blue },
          { text: 'Writesonic launch timeline: 3 wks', color: C.mid },
          { text: '"AI writing market hits $4.5B"', color: C.mid },
          { text: 'jasper.ai/enterprise pricing page', color: C.blue },
          { text: 'Copy.ai free tier comparison', color: C.mid },
          { text: 'HN thread: "best AI writing tool"', color: C.blue },
          { text: 'blog.writesonic.com/seo-features', color: C.mid },
        ].map((line, i) => {
          const lp = entranceSpring(frame, fps, beat('show-subagent-context') + i * 0.8);
          return (
            <g key={i} style={{ opacity: lp }}>
              <text x={subX + 16} y={ctxY + 64 + i * 28} fill={line.color}
                fontSize={11} fontFamily="monospace" fontWeight={400}>
                {line.text}
              </text>
            </g>
          );
        })}

        {/* Packed label at bottom */}
        <text x={subX + ctxW / 2} y={ctxY + ctxH - 24} textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.xs} fontWeight={500} style={{ opacity: pSubCtx }}>
          30 articles, competitor sites, raw notes
        </text>
      </g>

      {/* ─── Isolation boundary (dashed line between windows) ─── */}
      <g style={{ opacity: pIsolation }}>
        <line x1={arrowMidX} y1={ctxY + 50} x2={arrowMidX} y2={ctxY + ctxH - 40}
          stroke={C.red} strokeWidth={2} strokeDasharray="8 5" />
        <text x={arrowMidX} y={ctxY + 42} textAnchor="middle" fill={C.red}
          fontSize={13} fontWeight={700}>Isolated</text>
      </g>

      {/* ─── Green arrow with "Only the result" pill ─── */}
      <g style={{ opacity: pResultSlim }}>
        {/* Arrow line from subagent toward main */}
        <line x1={subX - 6} y1={ctxY + 140} x2={mainX + ctxW + 10} y2={ctxY + 140}
          stroke={C.green} strokeWidth={2.5} strokeLinecap="round" />
        {/* Arrowhead */}
        <polyline points={`${mainX + ctxW + 20},${ctxY + 133} ${mainX + ctxW + 10},${ctxY + 140} ${mainX + ctxW + 20},${ctxY + 147}`}
          fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* "Only the result" pill */}
        <rect x={arrowMidX - 65} y={ctxY + 114} width={130} height={26} rx={13}
          fill={C.greenLight} stroke={C.green} strokeWidth={1.5} />
        <text x={arrowMidX} y={ctxY + 131} textAnchor="middle" fill={C.green}
          fontSize={13} fontWeight={700}>Only the result</text>
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Main context stays focused. Exploration stays contained.
        </text>
      </g>
    </g>
  );
};
