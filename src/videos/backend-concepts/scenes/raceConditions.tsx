import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';

/* ── User avatar ── */
const UserAvatar: React.FC<{ x: number; y: number; label: string; color: string }> = ({ x, y, label, color }) => (
  <g>
    <circle cx={x} cy={y} r={32} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={2} />
    <circle cx={x} cy={y - 6} r={9} fill="none" stroke={color} strokeWidth={2} />
    <path d={`M ${x - 14},${y + 14} Q ${x - 14},${y + 2} ${x},${y + 2} Q ${x + 14},${y + 2} ${x + 14},${y + 14}`}
      fill="none" stroke={color} strokeWidth={2} />
    <text
      x={x} y={y + 52}
      textAnchor="middle" fill={color}
      fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
    >
      {label}
    </text>
  </g>
);

/* ── Database cylinder ── */
const DatabaseIcon: React.FC<{ x: number; y: number; color: string; slots: string; highlight?: boolean }> = ({ x, y, color, slots, highlight }) => (
  <g>
    {/* Glow when highlighted */}
    {highlight && (
      <ellipse cx={x} cy={y} rx={58} ry={48} fill={color} fillOpacity={0.06} />
    )}
    {/* Cylinder body */}
    <rect x={x - 44} y={y - 30} width={88} height={60} fill={C.cardFill} stroke={color} strokeWidth={2} />
    {/* Top ellipse */}
    <ellipse cx={x} cy={y - 30} rx={44} ry={14} fill={C.cardFill} stroke={color} strokeWidth={2} />
    {/* Bottom ellipse (visible part) */}
    <path d={`M ${x - 44},${y + 30} Q ${x - 44},${y + 44} ${x},${y + 44} Q ${x + 44},${y + 44} ${x + 44},${y + 30}`}
      fill={C.cardFill} stroke={color} strokeWidth={2} />
    {/* Internal rows */}
    <line x1={x - 28} y1={y - 10} x2={x + 28} y2={y - 10} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
    <line x1={x - 28} y1={y + 4} x2={x + 28} y2={y + 4} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
    <line x1={x - 28} y1={y + 18} x2={x + 28} y2={y + 18} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
    {/* Slot count */}
    <text
      x={x} y={y + 2}
      textAnchor="middle" dominantBaseline="central"
      fill={color} fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="monospace"
    >
      {slots}
    </text>
    <text
      x={x} y={y + 60}
      textAnchor="middle" fill={C.mid}
      fontSize={FONT_SIZE.sm} fontWeight={500} fontFamily="Inter, sans-serif"
    >
      Slots remaining
    </text>
  </g>
);

/* ── Lock icon ── */
const LockIcon: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <rect x={x - 14} y={y - 4} width={28} height={22} rx={4} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
    <path d={`M ${x - 8},${y - 4} L ${x - 8},${y - 12} Q ${x - 8},${y - 22} ${x},${y - 22} Q ${x + 8},${y - 22} ${x + 8},${y - 12} L ${x + 8},${y - 4}`}
      fill="none" stroke={color} strokeWidth={2} />
    <circle cx={x} cy={y + 6} r={3} fill={color} />
  </g>
);

export const RaceConditionsScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('race-conditions');

  const pTitle = progress('show-title');
  const pUsers = progress('show-two-users');
  const pDB = progress('show-database');
  const pRead = progress('show-both-read');
  const pConfirm = progress('show-both-confirm');
  const pBug = progress('show-bug');
  const pQuestion = progress('show-question');
  const pFix = progress('show-atomic-fix');
  const pSummary = progress('show-summary');

  // Dimming: bug section dims everything before it, fix dims bug
  const preBugDim = pBug > 0.5 ? interpolate(pBug, [0.5, 1], [1, 0.15], { extrapolateRight: 'clamp' }) : 1;
  const bugDim = pFix > 0.5 ? interpolate(pFix, [0.5, 1], [1, 0.15], { extrapolateRight: 'clamp' }) : 1;

  const userAx = grid.x(0.12);
  const userBx = grid.x(0.88);
  const dbX = grid.center().x;
  const userY = grid.y(0.22);
  const dbY = grid.y(0.40);

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text
          x={grid.center().x} y={grid.y(0.02)}
          textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontFamily="Inter, sans-serif" fontWeight={700}
        >
          Concurrency and Race Conditions
        </text>
      </g>

      {/* ── Bug demonstration ── */}
      <g style={{ opacity: preBugDim }}>
        {/* Two users */}
        <g style={{ opacity: pUsers }}>
          <UserAvatar x={userAx} y={userY} label="User A" color={C.sync} />
          <UserAvatar x={userBx} y={userY} label="User B" color={C.idempotent} />

          {/* Click buttons */}
          {[userAx, userBx].map((ux, i) => {
            const btnDelay = beat('show-two-users') + 8 + i * 3;
            const bp = entranceSpring(frame, fps, btnDelay);
            return (
              <g key={i} style={{ opacity: bp }}>
                <rect
                  x={ux - 100} y={userY + 66}
                  width={200} height={42} rx={8}
                  fill={C.accent} fillOpacity={0.12}
                  stroke={C.accent} strokeWidth={1.5}
                />
                <text
                  x={ux} y={userY + 87}
                  textAnchor="middle" dominantBaseline="central"
                  fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={600}
                  fontFamily="Inter, sans-serif"
                >
                  Claim This Spot
                </text>
              </g>
            );
          })}
        </g>

        {/* Database */}
        <g style={{ opacity: pDB }}>
          <DatabaseIcon x={dbX} y={dbY} color={C.mid} slots="1" />
        </g>

        {/* Both read arrows */}
        <g style={{ opacity: pRead }}>
          {/* User A reads */}
          <line
            x1={userAx + 36} y1={userY + 30}
            x2={dbX - 50} y2={dbY - 30}
            stroke={C.sync} strokeWidth={2} strokeLinecap="round"
            strokeDasharray="6 4"
          />
          <rect
            x={userAx + 50} y={dbY - 70}
            width={150} height={40} rx={8}
            fill={C.syncLight} stroke={C.sync} strokeWidth={1}
          />
          <text
            x={userAx + 125} y={dbY - 50}
            textAnchor="middle" dominantBaseline="central"
            fill={C.sync} fontSize={FONT_SIZE.sm} fontWeight={600}
            fontFamily="monospace"
          >
            READ: 1
          </text>

          {/* User B reads */}
          <line
            x1={userBx - 36} y1={userY + 30}
            x2={dbX + 50} y2={dbY - 30}
            stroke={C.idempotent} strokeWidth={2} strokeLinecap="round"
            strokeDasharray="6 4"
          />
          <rect
            x={userBx - 200} y={dbY - 70}
            width={150} height={40} rx={8}
            fill={C.idempotentLight} stroke={C.idempotent} strokeWidth={1}
          />
          <text
            x={userBx - 125} y={dbY - 50}
            textAnchor="middle" dominantBaseline="central"
            fill={C.idempotent} fontSize={FONT_SIZE.sm} fontWeight={600}
            fontFamily="monospace"
          >
            READ: 1
          </text>
        </g>

        {/* Both confirmed */}
        <g style={{ opacity: pConfirm }}>
          {[{ x: userAx, color: C.sync }, { x: userBx, color: C.idempotent }].map((u, i) => (
            <g key={i}>
              <rect
                x={u.x - 80} y={userY + 114}
                width={160} height={42} rx={8}
                fill={C.greenLight} stroke={C.green} strokeWidth={1.5}
              />
              <text
                x={u.x} y={userY + 135}
                textAnchor="middle" dominantBaseline="central"
                fill={C.green} fontSize={FONT_SIZE.md} fontWeight={600}
                fontFamily="Inter, sans-serif"
              >
                Confirmed
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* ── BUG callout ── */}
      <g style={{ opacity: pBug * bugDim }}>
        {/* Big red warning */}
        <rect
          x={grid.center().x - 200} y={grid.y(0.62)}
          width={400} height={80} rx={14}
          fill={C.redLight} stroke={C.red} strokeWidth={2}
        />
        {/* X icon */}
        <circle cx={grid.center().x - 160} cy={grid.y(0.62) + 40} r={20}
          fill={C.red} fillOpacity={0.15} />
        <text
          x={grid.center().x - 160} y={grid.y(0.62) + 40}
          textAnchor="middle" dominantBaseline="central"
          fill={C.red} fontSize={FONT_SIZE.xl} fontWeight={700}
          fontFamily="Inter, sans-serif"
        >
          !
        </text>
        <text
          x={grid.center().x + 10} y={grid.y(0.62) + 32}
          textAnchor="middle" dominantBaseline="central"
          fill={C.red} fontSize={FONT_SIZE.lg} fontWeight={700}
          fontFamily="Inter, sans-serif"
        >
          Double Booking
        </text>
        <text
          x={grid.center().x + 10} y={grid.y(0.62) + 56}
          textAnchor="middle" dominantBaseline="central"
          fill={C.mid} fontSize={FONT_SIZE.sm} fontWeight={400}
          fontFamily="Inter, sans-serif"
        >
          Only 1 slot, but 2 users got it
        </text>

        {/* The question */}
        <g style={{ opacity: pQuestion }}>
          <rect
            x={grid.center().x - 300} y={grid.y(0.78)}
            width={600} height={52} rx={26}
            fill={C.accent} fillOpacity={0.08}
            stroke={C.accent} strokeWidth={1.5}
          />
          <text
            x={grid.center().x} y={grid.y(0.78) + 26}
            textAnchor="middle" dominantBaseline="central"
            fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            "What happens if two users do this at the same time?"
          </text>
        </g>
      </g>

      {/* ── FIX: Atomic transaction ── */}
      <g style={{ opacity: pFix }}>
        {/* Fixed database with lock */}
        <DatabaseIcon x={grid.center().x} y={grid.y(0.32)} color={C.green} slots="1" highlight />

        {/* Lock overlay */}
        <LockIcon x={grid.center().x + 54} y={grid.y(0.32) - 34} color={C.green} />

        {/* Atomic transaction wrapper */}
        <rect
          x={grid.center().x - 90} y={grid.y(0.18)}
          width={180} height={180} rx={16}
          fill="none" stroke={C.green} strokeWidth={2}
          strokeDasharray="8 4"
        />
        <text
          x={grid.center().x} y={grid.y(0.17)}
          textAnchor="middle" fill={C.green}
          fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
        >
          Atomic Transaction
        </text>

        {/* Read + Write as one operation */}
        <rect
          x={grid.center().x - 100} y={grid.y(0.56)}
          width={200} height={44} rx={8}
          fill={C.greenLight} stroke={C.green} strokeWidth={1.5}
        />
        <text
          x={grid.center().x} y={grid.y(0.56) + 22}
          textAnchor="middle" dominantBaseline="central"
          fill={C.green} fontSize={FONT_SIZE.md} fontWeight={600}
          fontFamily="monospace"
        >
          READ + WRITE
        </text>
        <text
          x={grid.center().x} y={grid.y(0.56) + 56}
          textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.sm} fontWeight={400} fontFamily="Inter, sans-serif"
        >
          One indivisible operation
        </text>

        {/* User A gets it, User B gets error */}
        <g>
          <rect
            x={grid.x(0.06)} y={grid.y(0.68)}
            width={260} height={70} rx={12}
            fill={C.cardFill} stroke={C.green} strokeWidth={1.5}
          />
          <rect x={grid.x(0.06)} y={grid.y(0.68)} width={6} height={70} rx={3}
            fill={C.green} fillOpacity={0.6} />
          <text
            x={grid.x(0.06) + 130} y={grid.y(0.68) + 24}
            textAnchor="middle" fill={C.green}
            fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            User A: Confirmed
          </text>
          <text
            x={grid.x(0.06) + 130} y={grid.y(0.68) + 50}
            textAnchor="middle" fill={C.mid}
            fontSize={FONT_SIZE.sm} fontWeight={400} fontFamily="Inter, sans-serif"
          >
            Got the lock first
          </text>
        </g>

        <g>
          <rect
            x={grid.x(0.58)} y={grid.y(0.68)}
            width={290} height={70} rx={12}
            fill={C.cardFill} stroke={C.amber} strokeWidth={1.5}
          />
          <rect x={grid.x(0.58)} y={grid.y(0.68)} width={6} height={70} rx={3}
            fill={C.amber} fillOpacity={0.6} />
          <text
            x={grid.x(0.58) + 145} y={grid.y(0.68) + 24}
            textAnchor="middle" fill={C.amber}
            fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            User B: Slot taken
          </text>
          <text
            x={grid.x(0.58) + 145} y={grid.y(0.68) + 50}
            textAnchor="middle" fill={C.mid}
            fontSize={FONT_SIZE.sm} fontWeight={400} fontFamily="Inter, sans-serif"
          >
            Sees accurate state
          </text>
        </g>

        {/* Summary */}
        <g style={{ opacity: pSummary }}>
          <text
            x={grid.center().x} y={grid.y(0.90)}
            textAnchor="middle" fill={C.dark}
            fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            The read and the write happen as one indivisible operation
          </text>
        </g>
      </g>
    </g>
  );
};
