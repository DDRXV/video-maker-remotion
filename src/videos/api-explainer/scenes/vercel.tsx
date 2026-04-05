import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring, pulse } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const VercelScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('vercel');
  const pTitle = progress('show-title');
  const pLaptop = progress('show-laptop');
  const pGithub = progress('show-github');
  const pBuild = progress('show-vercel-build');
  const pLive = progress('show-live');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;

  // Horizontal pipeline: Laptop → GitHub → Vercel → Live
  const nodeW = 340;
  const nodeH = 300;
  const nodeGap = 48;
  const totalW = 4 * nodeW + 3 * nodeGap;
  const startX = cx - totalW / 2;
  const nodeY = grid.y(0.14);

  const nodes = [
    {
      label: 'Your Laptop',
      color: C.mid,
      progress: pLaptop,
      enterAt: beat('show-laptop'),
      lines: ['src/index.tsx', 'src/app.tsx', 'package.json', 'git commit -m "v2"'],
    },
    {
      label: 'GitHub',
      color: C.dark,
      progress: pGithub,
      enterAt: beat('show-github'),
      lines: ['git push origin main', 'Repository updated', 'Webhook fires', 'Notify Vercel'],
    },
    {
      label: 'Vercel',
      color: C.vercel,
      progress: pBuild,
      enterAt: beat('show-vercel-build'),
      lines: ['Detect change', 'Install deps (4s)', 'Build app (12s)', 'Deploy to CDN (8s)'],
    },
    {
      label: 'Live',
      color: C.green,
      progress: pLive,
      enterAt: beat('show-live'),
      lines: ['yourapp.vercel.app', '200 OK', 'Edge: 14 regions', '30s total'],
    },
  ];

  const activeNodes = nodes.filter(n => n.progress > 0.5);
  const focusedIdx = activeNodes.length > 0
    ? nodes.indexOf(activeNodes.reduce((a, b) => a.enterAt > b.enterAt ? a : b))
    : -1;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Deployment: Vercel
        </text>
      </g>

      {/* Node cards */}
      {nodes.map((node, i) => {
        const sp = node.progress;
        const nx = startX + i * (nodeW + nodeGap);
        const slideY = interpolate(sp, [0, 1], [16, 0]);
        const isFocused = i === focusedIdx && pSummary < 0.5;
        const isRevealed = sp > 0.5;
        const dimFactor = pSummary > 0.5 ? 0.7 : (isFocused ? 1 : (isRevealed ? 0.35 : 1));

        return (
          <g key={i} style={{ opacity: sp * dimFactor, transform: `translateY(${slideY}px)` }}>
            {isFocused && (
              <rect x={nx - 8} y={nodeY - 8} width={nodeW + 16} height={nodeH + 16} rx={20}
                fill={node.color} fillOpacity={0.06} />
            )}

            <rect x={nx} y={nodeY} width={nodeW} height={nodeH} rx={16}
              fill={i === 0 || i === 1 ? C.codeBg : C.cardFill}
              stroke={node.color} strokeWidth={isFocused ? 2.5 : 1.5}
              filter={isFocused ? 'url(#shadow-md)' : undefined} />
            <rect x={nx} y={nodeY + 10} width={6} height={nodeH - 20} rx={3}
              fill={node.color} fillOpacity={isFocused ? 0.8 : 0.3} />

            {/* Step number + label */}
            <circle cx={nx + 32} cy={nodeY + 34} r={14}
              fill="none" stroke={i < 2 ? '#ffffff' : node.color} strokeWidth={1.5} />
            <text x={nx + 32} y={nodeY + 34} textAnchor="middle" dominantBaseline="central"
              fill={i < 2 ? '#ffffff' : node.color} fontSize={FONT_SIZE.sm} fontWeight={700}>
              {i + 1}
            </text>
            <text x={nx + 56} y={nodeY + 34} dominantBaseline="central"
              fill={i < 2 ? '#ffffff' : node.color} fontSize={FONT_SIZE.lg} fontWeight={700}>
              {node.label}
            </text>

            {/* Detail lines */}
            {node.lines.map((line, li) => {
              const lp = entranceSpring(frame, fps, node.enterAt + 4 + li * 3);
              const ly = nodeY + 66 + li * 52;
              return (
                <g key={li} style={{ opacity: lp }}>
                  {i >= 2 && (
                    <rect x={nx + 16} y={ly} width={nodeW - 32} height={40} rx={6}
                      fill={node.color === C.green ? C.greenLight : C.vercelLight}
                      fillOpacity={0.5} stroke={node.color} strokeWidth={0.5} />
                  )}
                  <text x={nx + 28} y={ly + (i >= 2 ? 24 : 16)}
                    dominantBaseline="central"
                    fill={i < 2 ? C.codeGreen : C.dark}
                    fontSize={FONT_SIZE.sm} fontWeight={500}
                    fontFamily={TYPOGRAPHY.mono.fontFamily}>
                    {line}
                  </text>
                </g>
              );
            })}

            {/* Live pulse indicator */}
            {i === 3 && pLive > 0.5 && (
              <circle cx={nx + nodeW - 28} cy={nodeY + 34} r={6}
                fill={C.green} fillOpacity={pulse(frame, 40, 0.4, 1)} />
            )}
          </g>
        );
      })}

      {/* Arrows */}
      {[0, 1, 2].map(i => {
        const ap = entranceSpring(frame, fps, nodes[i + 1].enterAt - 3);
        const x1 = startX + i * (nodeW + nodeGap) + nodeW + 4;
        const x2 = startX + (i + 1) * (nodeW + nodeGap) - 4;
        const ay = nodeY + nodeH / 2;
        const len = x2 - x1;
        const offset = interpolate(ap, [0, 1], [len, 0]);
        return (
          <g key={`arr-${i}`} style={{ opacity: ap }}>
            <line x1={x1} y1={ay} x2={x2} y2={ay}
              stroke={nodes[i + 1].color} strokeWidth={2} strokeLinecap="round"
              strokeDasharray={`${len}`} strokeDashoffset={offset} />
            <polyline
              points={`${x2 - 8},${ay - 6} ${x2},${ay} ${x2 - 8},${ay + 6}`}
              fill="none" stroke={nodes[i + 1].color} strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.86)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Push code. It is live. No servers to manage.
        </text>
      </g>

      {/* Particles */}
      {[...Array(5)].map((_, i) => {
        const px = 260 + i * 310 + Math.sin(frame * 0.02 + i * 1.3) * 16;
        const py = 90 + Math.sin(frame * 0.016 + i * 2) * 22;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.026 + i) * 0.04} />
        );
      })}
    </g>
  );
};
