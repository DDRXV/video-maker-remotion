import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * Routing — Hero: Logical Routing with two concrete examples
 *
 * Top: "What was last quarter's revenue?" → routes to SQL DB
 * Bottom: "Explain our refund policy" → routes to Document Store
 * Contrast makes routing click instantly.
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const MOD = C.routing;

/* ── Database cylinder with rows ── */
const DBCylinder: React.FC<{
  x: number; y: number; w: number; label: string;
  dimmed?: boolean; enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, label, dimmed, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const h = 48;
  const stroke = dimmed ? SLATE_LIGHT : SLATE;
  const op = dimmed ? 0.3 : 1;
  return (
    <g style={{ opacity: p * op }}>
      <ellipse cx={x + w / 2} cy={y + 7} rx={w / 2} ry={7} fill="none" stroke={stroke} strokeWidth={1.5} />
      <rect x={x} y={y + 7} width={w} height={h - 14} fill={C.white} stroke="none" />
      <line x1={x} y1={y + 7} x2={x} y2={y + h - 7} stroke={stroke} strokeWidth={1.5} />
      <line x1={x + w} y1={y + 7} x2={x + w} y2={y + h - 7} stroke={stroke} strokeWidth={1.5} />
      <ellipse cx={x + w / 2} cy={y + h - 7} rx={w / 2} ry={7} fill="none" stroke={stroke} strokeWidth={1.5} />
      {/* Data rows */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={x + 6} y={y + 16 + i * 10} width={w - 12} height={5} rx={2} fill={stroke} fillOpacity={0.15} />
      ))}
      <text x={x + w / 2} y={y + h + 14} textAnchor="middle" fill={dimmed ? SLATE_LIGHT : SLATE_MID} fontSize={11} fontWeight={600} fontFamily="monospace">{label}</text>
    </g>
  );
};

/* ── Doc stack icon ── */
const DocStack: React.FC<{
  x: number; y: number; w: number;
  dimmed?: boolean; enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, dimmed, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const op = dimmed ? 0.3 : 1;
  const stroke = dimmed ? SLATE_LIGHT : SLATE;
  return (
    <g style={{ opacity: p * op }}>
      {/* Stacked pages */}
      <rect x={x + 4} y={y} width={w - 4} height={40} rx={3} fill={C.white} stroke={stroke} strokeWidth={1} />
      <rect x={x + 2} y={y + 3} width={w - 4} height={40} rx={3} fill={C.white} stroke={stroke} strokeWidth={1} />
      <rect x={x} y={y + 6} width={w - 4} height={40} rx={3} fill={C.white} stroke={stroke} strokeWidth={1.2} />
      {/* Text lines */}
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={x + 6} y={y + 14 + i * 8} width={w - 18 - (i % 2) * 8} height={2.5} rx={1} fill={stroke} fillOpacity={0.2} />
      ))}
      <text x={x + (w - 4) / 2} y={y + 58} textAnchor="middle" fill={dimmed ? SLATE_LIGHT : SLATE_MID} fontSize={11} fontWeight={600} fontFamily="monospace">doc store</text>
    </g>
  );
};

/* ── Router example row ── */
const RouterRow: React.FC<{
  y: number; question: string; intent: string; target: string;
  labelPrefix: string;
  enterQuestion: number; enterRouter: number; enterRoute: number;
  frame: number; fps: number;
  children: React.ReactNode;
}> = ({ y, question, intent, target, labelPrefix, enterQuestion, enterRouter, enterRoute, frame, fps, children }) => {
  const qP = entranceSpring(frame, fps, enterQuestion);
  const rP = entranceSpring(frame, fps, enterRouter);
  const tP = entranceSpring(frame, fps, enterRoute);

  const qX = grid.x(0.02);
  const routerX = grid.x(0.38);
  const targetX = grid.x(0.68);
  const qW = grid.x(0.32);
  const routerW = grid.x(0.26);
  const rowH = 60;

  return (
    <g>
      {/* Label */}
      <text x={qX} y={y - 10} fill={SLATE_MID} fontSize={11} fontWeight={600}>{labelPrefix}</text>

      {/* Question */}
      <g style={{ opacity: qP }}>
        <rect x={qX} y={y} width={qW} height={rowH} rx={8} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.2} />
        <text x={qX + 14} y={y + rowH / 2 + 1} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={500}>"{question}"</text>
      </g>

      {/* Arrow to router */}
      <g style={{ opacity: rP * 0.5 }}>
        <line x1={qX + qW} y1={y + rowH / 2} x2={routerX - 4} y2={y + rowH / 2} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinecap="round" />
        <polygon points={`${routerX},${y + rowH / 2} ${routerX - 7},${y + rowH / 2 - 4} ${routerX - 7},${y + rowH / 2 + 4}`} fill={SLATE_LIGHT} />
      </g>

      {/* Router box */}
      <g style={{ opacity: rP }}>
        <rect x={routerX} y={y} width={routerW} height={rowH} rx={8} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
        <rect x={routerX} y={y} width={4} height={rowH} rx={2} fill={MOD} fillOpacity={0.5} />
        <text x={routerX + 14} y={y + 18} fill={MOD} fontSize={11} fontWeight={700}>LLM ROUTER</text>
        <text x={routerX + 14} y={y + 38} fill={SLATE_MID} fontSize={11} fontFamily="monospace">{intent}</text>
        <text x={routerX + 14} y={y + 52} fill={SLATE} fontSize={12} fontWeight={600} fontFamily="monospace">→ {target}</text>
      </g>

      {/* Arrow to target */}
      <g style={{ opacity: tP * 0.5 }}>
        <line x1={routerX + routerW} y1={y + rowH / 2} x2={targetX - 4} y2={y + rowH / 2} stroke={MOD} strokeWidth={1.5} strokeLinecap="round" strokeOpacity={0.5} />
        <polygon points={`${targetX},${y + rowH / 2} ${targetX - 7},${y + rowH / 2 - 4} ${targetX - 7},${y + rowH / 2 + 4}`} fill={MOD} fillOpacity={0.5} />
      </g>

      {/* Target (rendered via children) */}
      <g style={{ opacity: tP }}>
        {children}
      </g>
    </g>
  );
};

export const RoutingScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('routing');

  const pTitle = progress('show-title');
  const pOthers = progress('show-others');

  const targetX = grid.x(0.68);
  const row1Y = grid.y(0.18);
  const row2Y = grid.y(0.54);

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.03)} cy={grid.y(0.03)} r={18} fill={MOD} fillOpacity={0.12} stroke={MOD} strokeWidth={1.5} />
        <text x={grid.x(0.03)} y={grid.y(0.03)} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={FONT_SIZE.md} fontWeight={700}>3</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03)} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Routing</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03) + 28} dominantBaseline="central" fill={SLATE_MID} fontSize={FONT_SIZE.sm}>Logical Routing</text>
      </g>

      {/* Example A: Revenue → SQL DB */}
      <RouterRow y={row1Y} question="What was last quarter's revenue?"
        intent="intent: financial_data" target="SQL Database"
        labelPrefix="EXAMPLE A"
        enterQuestion={beat('show-example-a')} enterRouter={beat('show-router-a')} enterRoute={beat('show-route-a')}
        frame={frame} fps={fps}>
        <DBCylinder x={targetX} y={row1Y + 4} w={80} label="sales DB" enterAt={beat('show-route-a')} frame={frame} fps={fps} />
        {/* Dimmed other DBs */}
        <DocStack x={targetX + 110} y={row1Y + 6} w={60} dimmed enterAt={beat('show-route-a')} frame={frame} fps={fps} />
      </RouterRow>

      {/* Divider */}
      <line x1={grid.x(0.05)} y1={(row1Y + row2Y) / 2 + 10} x2={grid.x(0.95)} y2={(row1Y + row2Y) / 2 + 10} stroke={SLATE_LIGHT} strokeWidth={0.8} strokeDasharray="6 4" />

      {/* Example B: Policy → Doc Store */}
      <RouterRow y={row2Y} question="Explain our refund policy"
        intent="intent: policy_document" target="Document Store"
        labelPrefix="EXAMPLE B"
        enterQuestion={beat('show-example-b')} enterRouter={beat('show-router-b')} enterRoute={beat('show-route-b')}
        frame={frame} fps={fps}>
        <DBCylinder x={targetX} y={row2Y + 4} w={80} label="sales DB" dimmed enterAt={beat('show-route-b')} frame={frame} fps={fps} />
        <DocStack x={targetX + 110} y={row2Y + 6} w={60} enterAt={beat('show-route-b')} frame={frame} fps={fps} />
      </RouterRow>

      {/* Others strip */}
      <g style={{ opacity: pOthers }}>
        <text x={grid.x(0.02)} y={grid.y(0.84) + 13} fill={SLATE_MID} fontSize={FONT_SIZE.xs} fontWeight={500}>Also worth knowing:</text>
        <rect x={grid.x(0.02) + 160} y={grid.y(0.84)} width={140} height={26} rx={13} fill={MOD} fillOpacity={0.06} stroke={MOD} strokeWidth={1} strokeOpacity={0.3} />
        <text x={grid.x(0.02) + 230} y={grid.y(0.84) + 14} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={12} fontWeight={500}>Semantic Routing</text>
      </g>

      {/* Summary */}
      <TextBox
        x={grid.x(0.02)} y={grid.y(0.92)} maxWidth={grid.x(0.96)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={SLATE_MID}
        enterAt={beat('show-summary')} align="left"
      >
        Different questions need different databases. The router makes sure each one lands in the right place.
      </TextBox>
    </g>
  );
};
