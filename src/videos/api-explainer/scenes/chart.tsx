import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const ChartScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('chart');
  const pTitle = progress('show-title');
  const pAxes = progress('show-axes');
  const pApi = progress('show-api-dot');
  const pCli = progress('show-cli-dot');
  const pMcp = progress('show-mcp-dot');
  const pSdk = progress('show-sdk-dot');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;

  // Chart area
  const chartX = grid.x(0.10);
  const chartY = grid.y(0.14);
  const chartW = grid.x(0.78);
  const chartH = grid.y(0.60);
  const chartRight = chartX + chartW;
  const chartBottom = chartY + chartH;

  // Plot positions (fraction of chart area)
  const dots = [
    {
      id: 'api', label: 'Raw API', sublabel: 'Full control, slow to build',
      fx: 0.15, fy: 0.12,  // top-left: high flex, slow
      color: C.http, bg: C.httpLight, progress: pApi, enterAt: beat('show-api-dot'),
    },
    {
      id: 'cli', label: 'CLI', sublabel: 'Ops tasks, limited scope',
      fx: 0.35, fy: 0.72,  // bottom-left-ish: low flex, moderate speed
      color: C.dark, bg: '#f1f5f9', progress: pCli, enterAt: beat('show-cli-dot'),
    },
    {
      id: 'mcp', label: 'MCP', sublabel: 'AI wires it, bounded scope',
      fx: 0.82, fy: 0.60,  // right-lower: very fast, moderate flex
      color: C.accent, bg: C.accentLight, progress: pMcp, enterAt: beat('show-mcp-dot'),
    },
    {
      id: 'sdk', label: 'SDK', sublabel: 'Fast + flexible enough',
      fx: 0.72, fy: 0.18,  // upper-right: THE SWEET SPOT
      color: C.sdk, bg: C.sdkLight, progress: pSdk, enterAt: beat('show-sdk-dot'),
    },
  ];

  // Find focused dot (most recently activated)
  const activeDots = dots.filter(d => d.progress > 0.5);
  const focusedId = activeDots.length > 0
    ? activeDots.reduce((a, b) => a.enterAt > b.enterAt ? a : b).id
    : null;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          How They Compare
        </text>
      </g>

      {/* Axes */}
      <g style={{ opacity: pAxes }}>
        {/* Y-axis: More Flexibility */}
        <line x1={chartX} y1={chartBottom} x2={chartX} y2={chartY}
          stroke={C.hairline} strokeWidth={2} strokeLinecap="round" />
        <polyline points={`${chartX - 8},${chartY + 12} ${chartX},${chartY} ${chartX + 8},${chartY + 12}`}
          fill="none" stroke={C.mid} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <text x={chartX - 16} y={chartY + chartH / 2}
          textAnchor="middle" dominantBaseline="central"
          fill={C.mid} fontSize={FONT_SIZE.lg} fontWeight={600}
          transform={`rotate(-90, ${chartX - 16}, ${chartY + chartH / 2})`}>
          More Flexibility
        </text>

        {/* X-axis: Faster to Build */}
        <line x1={chartX} y1={chartBottom} x2={chartRight} y2={chartBottom}
          stroke={C.hairline} strokeWidth={2} strokeLinecap="round" />
        <polyline points={`${chartRight - 12},${chartBottom - 8} ${chartRight},${chartBottom} ${chartRight - 12},${chartBottom + 8}`}
          fill="none" stroke={C.mid} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <text x={chartX + chartW / 2} y={chartBottom + 44}
          textAnchor="middle" dominantBaseline="central"
          fill={C.mid} fontSize={FONT_SIZE.lg} fontWeight={600}>
          Faster to Build
        </text>

        {/* Subtle grid lines */}
        {[0.25, 0.5, 0.75].map(f => (
          <g key={`grid-${f}`}>
            <line x1={chartX + chartW * f} y1={chartY} x2={chartX + chartW * f} y2={chartBottom}
              stroke={C.hairline} strokeWidth={0.5} strokeDasharray="4 8" />
            <line x1={chartX} y1={chartY + chartH * f} x2={chartRight} y2={chartY + chartH * f}
              stroke={C.hairline} strokeWidth={0.5} strokeDasharray="4 8" />
          </g>
        ))}
      </g>

      {/* Data points */}
      {dots.map((dot) => {
        const dp = dot.progress;
        const dx = chartX + dot.fx * chartW;
        const dy = chartY + dot.fy * chartH;
        const scale = interpolate(dp, [0, 1], [0.5, 1], { extrapolateRight: 'clamp' as const });
        const isFocused = dot.id === focusedId && pSummary < 0.5;
        const isRevealed = dp > 0.5;
        const isSdk = dot.id === 'sdk';
        const dimFactor = pSummary > 0.5 ? (isSdk ? 1 : 0.5) : (isFocused ? 1 : (isRevealed ? 0.35 : 1));
        const dotR = isSdk ? 18 : 14;

        return (
          <g key={dot.id} style={{
            opacity: dp * dimFactor,
            transform: `scale(${scale})`,
            transformOrigin: `${dx}px ${dy}px`,
          }}>
            {/* SDK sweet spot halo — always visible once SDK appears */}
            {isSdk && pSdk > 0.5 && (
              <>
                <rect x={dx - 120} y={dy - 80} width={240} height={160} rx={20}
                  fill={C.sdk} fillOpacity={0.06} stroke={C.sdk} strokeWidth={1}
                  strokeDasharray="6 4" />
              </>
            )}

            {/* Focus halo */}
            {isFocused && !isSdk && (
              <circle cx={dx} cy={dy} r={dotR + 20}
                fill={dot.color} fillOpacity={0.06} />
            )}

            {/* Dot */}
            <circle cx={dx} cy={dy} r={dotR}
              fill={dot.bg} stroke={dot.color}
              strokeWidth={isFocused || isSdk ? 3 : 2}
              filter={isFocused || (isSdk && pSdk > 0.5) ? 'url(#shadow-md)' : undefined} />

            {/* Label card */}
            {(() => {
              const labelW = Math.max(220, dot.label.length * 14 + 40);
              const labelH = 68;
              // Position label to avoid axis overlap
              const labelX = dot.fx > 0.5 ? dx - labelW - dotR - 12 : dx + dotR + 12;
              const labelY = dy - labelH / 2;
              return (
                <g>
                  <rect x={labelX} y={labelY} width={labelW} height={labelH} rx={10}
                    fill={C.cardFill} stroke={dot.color} strokeWidth={1.5} />
                  <rect x={labelX} y={labelY + 6} width={4} height={labelH - 12} rx={2}
                    fill={dot.color} fillOpacity={0.7} />
                  <text x={labelX + 16} y={labelY + 22} dominantBaseline="central"
                    fill={dot.color} fontSize={FONT_SIZE.lg} fontWeight={700}>
                    {dot.label}
                  </text>
                  <text x={labelX + 16} y={labelY + 48} dominantBaseline="central"
                    fill={C.mid} fontSize={FONT_SIZE.sm}>
                    {dot.sublabel}
                  </text>
                </g>
              );
            })()}

            {/* "Sweet Spot" callout for SDK */}
            {isSdk && pSdk > 0.5 && (
              <g>
                <rect x={dx - 70} y={dy + dotR + 14} width={140} height={34} rx={17}
                  fill={C.sdk} />
                <text x={dx} y={dy + dotR + 31} textAnchor="middle" dominantBaseline="central"
                  fill="#ffffff" fontSize={FONT_SIZE.md} fontWeight={700}>
                  Sweet Spot
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.90)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          For 90% of integrations, SDK is the answer.
        </text>
      </g>

      {/* Particles */}
      {[...Array(5)].map((_, i) => {
        const px = 240 + i * 320 + Math.sin(frame * 0.02 + i * 1.5) * 16;
        const py = 90 + Math.sin(frame * 0.016 + i * 2.1) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.sdk} fillOpacity={0.06 + Math.sin(frame * 0.028 + i) * 0.04} />
        );
      })}
    </g>
  );
};
