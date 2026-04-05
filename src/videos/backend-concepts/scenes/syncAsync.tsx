import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';

/* ── Coffee cup icon ── */
const CoffeeCup: React.FC<{ x: number; y: number; color: string; size?: number }> = ({ x, y, color, size = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`}>
    <rect x={-10} y={-14} width={20} height={22} rx={3} fill="none" stroke={color} strokeWidth={2} />
    <path d={`M 10,-8 Q 18,-8 18,-2 Q 18,4 10,4`} fill="none" stroke={color} strokeWidth={1.5} />
    <path d={`M -4,-20 Q -4,-26 0,-26 Q 4,-26 4,-20`} fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
    <rect x={-12} y={8} width={24} height={3} rx={1.5} fill={color} fillOpacity={0.3} />
  </g>
);

/* ── Person icon ── */
const PersonIcon: React.FC<{ x: number; y: number; color: string; size?: number }> = ({ x, y, color, size = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`}>
    <circle cx={0} cy={-10} r={7} fill="none" stroke={color} strokeWidth={2} />
    <path d="M -10,6 Q -10,-4 0,-4 Q 10,-4 10,6" fill="none" stroke={color} strokeWidth={2} />
  </g>
);

/* ── Clock icon ── */
const ClockIcon: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <circle cx={x} cy={y} r={12} fill="none" stroke={color} strokeWidth={1.5} />
    <line x1={x} y1={y} x2={x} y2={y - 7} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <line x1={x} y1={y} x2={x + 5} y2={y + 2} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </g>
);

/* ── Spinner icon (loading) ── */
const SpinnerIcon: React.FC<{ x: number; y: number; color: string; frame: number }> = ({ x, y, color, frame }) => {
  const rotation = (frame * 8) % 360;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx={0} cy={0} r={10} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.2} />
      <path
        d="M 0,-10 A 10,10 0 0,1 10,0"
        fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"
        transform={`rotate(${rotation})`}
      />
    </g>
  );
};

export const SyncAsyncScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('sync-async');

  const pTitle = progress('show-title');
  const pSyncBarista = progress('show-sync-barista');
  const pSyncQueue = progress('show-sync-queue');
  const pAsyncBarista = progress('show-async-barista');
  const pAsyncParallel = progress('show-async-parallel');
  const pAppSync = progress('show-app-sync');
  const pAppFrozen = progress('show-app-frozen');
  const pAppAsync = progress('show-app-async');
  const pAppResponsive = progress('show-app-responsive');

  // Coffee shop section is top half, app section is bottom half
  const coffeeActive = pAppSync < 0.5 ? 1 : 0.15;
  const appActive = pAppSync >= 0.5 ? 1 : 0;

  // Section divider Y
  const divY = grid.y(0.52);

  return (
    <g>
      {/* Scene title */}
      <g style={{ opacity: pTitle }}>
        <text
          x={grid.center().x} y={grid.y(0.02)}
          textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontFamily="Inter, sans-serif" fontWeight={700}
        >
          Synchronous vs Asynchronous
        </text>
      </g>

      {/* ═══ COFFEE SHOP SECTION ═══ */}
      <g style={{ opacity: coffeeActive }}>
        {/* ── LEFT: Synchronous barista ── */}
        <g style={{ opacity: pSyncBarista }}>
          {/* Section label */}
          <rect
            x={grid.x(0.02)} y={grid.y(0.09)}
            width={220} height={44} rx={22}
            fill={C.sync} fillOpacity={0.10}
            stroke={C.sync} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.02) + 110} y={grid.y(0.09) + 22}
            textAnchor="middle" dominantBaseline="central"
            fill={C.sync} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Synchronous
          </text>

          {/* Barista counter */}
          <rect
            x={grid.x(0.04)} y={grid.y(0.18)}
            width={360} height={260} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          {/* Left accent stripe */}
          <rect
            x={grid.x(0.04)} y={grid.y(0.18)}
            width={6} height={260} rx={3}
            fill={C.sync} fillOpacity={0.6}
          />

          {/* Barista */}
          <PersonIcon x={grid.x(0.08)} y={grid.y(0.24)} color={C.sync} size={1.2} />
          <text
            x={grid.x(0.08)} y={grid.y(0.24) + 28}
            textAnchor="middle" fill={C.sync}
            fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Barista
          </text>

          {/* Sequential workflow - vertical timeline */}
          {['Take order', 'Make coffee', 'Hand to customer'].map((step, i) => {
            const stepDelay = beat('show-sync-barista') + i * 6;
            const sp = entranceSpring(frame, fps, stepDelay);
            const stepY = grid.y(0.24) + i * 56;
            const stepW = step.length * 12 + 56;
            return (
              <g key={step} style={{ opacity: sp }}>
                <rect
                  x={grid.x(0.14)} y={stepY}
                  width={stepW} height={42} rx={8}
                  fill={C.sync} fillOpacity={0.08}
                  stroke={C.sync} strokeWidth={1} strokeOpacity={0.4}
                />
                <text
                  x={grid.x(0.14) + stepW / 2} y={stepY + 21}
                  textAnchor="middle" dominantBaseline="central"
                  fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={500}
                  fontFamily="Inter, sans-serif"
                >
                  {step}
                </text>
                {/* Arrow down */}
                {i < 2 && (
                  <line
                    x1={grid.x(0.14) + stepW / 2} y1={stepY + 42}
                    x2={grid.x(0.14) + stepW / 2} y2={stepY + 56}
                    stroke={C.sync} strokeWidth={1.5} strokeLinecap="round"
                    markerEnd="url(#arrow-sync)"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Queue of waiting people */}
        <g style={{ opacity: pSyncQueue }}>
          {[0, 1, 2].map((i) => {
            const delay = beat('show-sync-queue') + i * 4;
            const qp = entranceSpring(frame, fps, delay);
            const qx = grid.x(0.30) - i * 36;
            const qy = grid.y(0.23);
            return (
              <g key={i} style={{ opacity: qp * 0.6 }}>
                <PersonIcon x={qx} y={qy} color={C.mid} size={0.9} />
                <ClockIcon x={qx + 16} y={qy - 14} color={C.red} />
              </g>
            );
          })}
          <text
            x={grid.x(0.22)} y={grid.y(0.49)}
            textAnchor="middle" fill={C.red}
            fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Everyone waits
          </text>
        </g>

        {/* ── RIGHT: Asynchronous barista ── */}
        <g style={{ opacity: pAsyncBarista }}>
          {/* Section label */}
          <rect
            x={grid.x(0.54)} y={grid.y(0.09)}
            width={240} height={44} rx={22}
            fill={C.async} fillOpacity={0.10}
            stroke={C.async} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.54) + 120} y={grid.y(0.09) + 22}
            textAnchor="middle" dominantBaseline="central"
            fill={C.async} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Asynchronous
          </text>

          {/* Barista counter */}
          <rect
            x={grid.x(0.54)} y={grid.y(0.18)}
            width={400} height={260} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          {/* Left accent stripe */}
          <rect
            x={grid.x(0.54)} y={grid.y(0.18)}
            width={6} height={260} rx={3}
            fill={C.async} fillOpacity={0.6}
          />

          {/* Barista takes orders in parallel */}
          <PersonIcon x={grid.x(0.58)} y={grid.y(0.24)} color={C.async} size={1.2} />
          <text
            x={grid.x(0.58)} y={grid.y(0.24) + 28}
            textAnchor="middle" fill={C.async}
            fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Barista
          </text>

          {/* Two parallel tracks */}
          <g style={{ opacity: pAsyncParallel }}>
            {/* Track labels */}
            <text
              x={grid.x(0.66)} y={grid.y(0.21)}
              textAnchor="middle" fill={C.mid}
              fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily="Inter, sans-serif"
            >
              Orders
            </text>
            <text
              x={grid.x(0.82)} y={grid.y(0.21)}
              textAnchor="middle" fill={C.mid}
              fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily="Inter, sans-serif"
            >
              Making
            </text>

            {/* Order tickets - stacked */}
            {['#1', '#2', '#3'].map((ticket, i) => {
              const td = beat('show-async-parallel') + i * 4;
              const tp = entranceSpring(frame, fps, td);
              const ty = grid.y(0.24) + i * 48;
              return (
                <g key={ticket} style={{ opacity: tp }}>
                  {/* Order ticket */}
                  <rect
                    x={grid.x(0.62)} y={ty}
                    width={120} height={38} rx={6}
                    fill={C.async} fillOpacity={0.08}
                    stroke={C.async} strokeWidth={1}
                  />
                  <text
                    x={grid.x(0.62) + 60} y={ty + 19}
                    textAnchor="middle" dominantBaseline="central"
                    fill={C.dark} fontSize={FONT_SIZE.sm} fontWeight={500}
                    fontFamily="Inter, sans-serif"
                  >
                    Order {ticket}
                  </text>

                  {/* Arrow to making */}
                  <line
                    x1={grid.x(0.62) + 124} y1={ty + 19}
                    x2={grid.x(0.75)} y2={ty + 19}
                    stroke={C.async} strokeWidth={1.5} strokeLinecap="round"
                    strokeDasharray="4 3"
                  />

                  {/* Coffee being made */}
                  <CoffeeCup x={grid.x(0.82)} y={ty + 19} color={C.async} />
                </g>
              );
            })}

            {/* Ready numbers */}
            {['#1', '#2'].map((num, i) => {
              const rd = beat('show-async-parallel') + 12 + i * 6;
              const rp = entranceSpring(frame, fps, rd);
              return (
                <g key={`ready-${num}`} style={{ opacity: rp }}>
                  <rect
                    x={grid.x(0.88)} y={grid.y(0.24) + i * 48}
                    width={90} height={38} rx={6}
                    fill={C.greenLight}
                    stroke={C.green} strokeWidth={1}
                  />
                  <text
                    x={grid.x(0.88) + 45} y={grid.y(0.24) + i * 48 + 19}
                    textAnchor="middle" dominantBaseline="central"
                    fill={C.green} fontSize={FONT_SIZE.sm} fontWeight={600}
                    fontFamily="Inter, sans-serif"
                  >
                    Ready
                  </text>
                </g>
              );
            })}
          </g>

          <text
            x={grid.x(0.75)} y={grid.y(0.49)}
            textAnchor="middle" fill={C.green}
            fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            No one waits
          </text>
        </g>
      </g>

      {/* ═══ Divider ═══ */}
      {pAppSync > 0.1 && (
        <line
          x1={grid.x(0)} y1={divY} x2={grid.x(1)} y2={divY}
          stroke={C.hairline} strokeWidth={1}
          style={{ opacity: interpolate(pAppSync, [0, 1], [0, 0.6], { extrapolateRight: 'clamp' }) }}
        />
      )}

      {/* ═══ APP SECTION (bottom half) ═══ */}
      <g style={{ opacity: appActive }}>
        {/* Section title */}
        <g style={{ opacity: pAppSync }}>
          <text
            x={grid.center().x} y={divY + 30}
            textAnchor="middle" fill={C.mid}
            fontSize={FONT_SIZE.lg} fontFamily="Inter, sans-serif" fontWeight={600}
          >
            In your app
          </text>
        </g>

        {/* ── LEFT: Sync app ── */}
        <g style={{ opacity: pAppSync }}>
          {/* App window - sync */}
          <rect
            x={grid.x(0.04)} y={divY + 50}
            width={380} height={230} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          {/* Window title bar */}
          <rect
            x={grid.x(0.04)} y={divY + 50}
            width={380} height={32} rx={12}
            fill={C.sync} fillOpacity={0.06}
          />
          {/* Traffic lights */}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={grid.x(0.04) + 20 + i * 16} cy={divY + 66} r={4}
              fill={[C.red, C.amber, C.green][i]} fillOpacity={0.5} />
          ))}

          {/* Generate button */}
          <rect
            x={grid.x(0.10)} y={divY + 100}
            width={140} height={44} rx={8}
            fill={C.sync} fillOpacity={0.15}
            stroke={C.sync} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.10) + 70} y={divY + 122}
            textAnchor="middle" dominantBaseline="central"
            fill={C.sync} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Generate
          </text>

          {/* Arrow to API */}
          <line
            x1={grid.x(0.10) + 145} y1={divY + 122}
            x2={grid.x(0.10) + 200} y2={divY + 122}
            stroke={C.sync} strokeWidth={1.5} strokeLinecap="round"
          />
          {/* OpenAI API box */}
          <rect
            x={grid.x(0.10) + 204} y={divY + 100}
            width={120} height={44} rx={8}
            fill={C.cardFill} stroke={C.sync} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.10) + 264} y={divY + 116}
            textAnchor="middle" dominantBaseline="central"
            fill={C.dark} fontSize={FONT_SIZE.xs} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            OpenAI API
          </text>
          <text
            x={grid.x(0.10) + 264} y={divY + 134}
            textAnchor="middle" dominantBaseline="central"
            fill={C.mid} fontSize={FONT_SIZE.xs} fontWeight={400}
            fontFamily="monospace"
          >
            3-5 sec
          </text>
        </g>

        {/* Frozen UI overlay */}
        <g style={{ opacity: pAppFrozen }}>
          <rect
            x={grid.x(0.04)} y={divY + 160}
            width={380} height={110} rx={0}
            fill={C.red} fillOpacity={0.04}
          />
          {/* Frozen placeholder lines */}
          {[0, 1, 2].map((i) => (
            <rect key={i}
              x={grid.x(0.08)} y={divY + 175 + i * 28}
              width={180 - i * 40} height={12} rx={4}
              fill={C.mid} fillOpacity={0.12}
            />
          ))}
          {/* Frozen label */}
          <rect
            x={grid.x(0.10)} y={divY + 186}
            width={200} height={48} rx={10}
            fill={C.redLight} stroke={C.red} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.10) + 100} y={divY + 210}
            textAnchor="middle" dominantBaseline="central"
            fill={C.red} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            UI Frozen
          </text>
        </g>

        {/* ── RIGHT: Async app ── */}
        <g style={{ opacity: pAppAsync }}>
          {/* App window - async */}
          <rect
            x={grid.x(0.54)} y={divY + 50}
            width={400} height={230} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          {/* Window title bar */}
          <rect
            x={grid.x(0.54)} y={divY + 50}
            width={400} height={32} rx={12}
            fill={C.async} fillOpacity={0.06}
          />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={grid.x(0.54) + 20 + i * 16} cy={divY + 66} r={4}
              fill={[C.red, C.amber, C.green][i]} fillOpacity={0.5} />
          ))}

          {/* Generate button */}
          <rect
            x={grid.x(0.58)} y={divY + 100}
            width={140} height={44} rx={8}
            fill={C.async} fillOpacity={0.15}
            stroke={C.async} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.58) + 70} y={divY + 122}
            textAnchor="middle" dominantBaseline="central"
            fill={C.async} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Generate
          </text>

          {/* Loading spinner */}
          <SpinnerIcon x={grid.x(0.58) + 170} y={divY + 122} color={C.async} frame={frame} />
          <text
            x={grid.x(0.58) + 196} y={divY + 122}
            dominantBaseline="central"
            fill={C.async} fontSize={FONT_SIZE.xs} fontWeight={500}
            fontFamily="Inter, sans-serif"
          >
            Generating...
          </text>
        </g>

        {/* Responsive UI content */}
        <g style={{ opacity: pAppResponsive }}>
          {/* Simulated content being interactable */}
          {[0, 1, 2].map((i) => {
            const ld = beat('show-app-responsive') + i * 3;
            const lp = entranceSpring(frame, fps, ld);
            return (
              <g key={i} style={{ opacity: lp }}>
                <rect
                  x={grid.x(0.58)} y={divY + 160 + i * 32}
                  width={220 - i * 30} height={16} rx={4}
                  fill={C.async} fillOpacity={0.12}
                />
              </g>
            );
          })}

          {/* Responsive label */}
          <rect
            x={grid.x(0.66)} y={divY + 186}
            width={240} height={48} rx={10}
            fill={C.greenLight} stroke={C.green} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.66) + 120} y={divY + 210}
            textAnchor="middle" dominantBaseline="central"
            fill={C.green} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            UI Responsive
          </text>
        </g>
      </g>

      {/* Arrow markers */}
      <defs>
        <marker id="arrow-sync" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M 0,0 L 8,3 L 0,6" fill="none" stroke={C.sync} strokeWidth={1.5} />
        </marker>
      </defs>
    </g>
  );
};
