import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring, pulse } from '../../../design-system/easing';

/* ── Check icon ── */
const CheckIcon: React.FC<{ x: number; y: number; color: string; size?: number }> = ({ x, y, color, size = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`}>
    <circle cx={0} cy={0} r={14} fill={color} fillOpacity={0.12} />
    <path d="M -6,0 L -2,5 L 7,-5" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/* ── X icon ── */
const XIcon: React.FC<{ x: number; y: number; color: string; size?: number }> = ({ x, y, color, size = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`}>
    <circle cx={0} cy={0} r={14} fill={color} fillOpacity={0.12} />
    <line x1={-5} y1={-5} x2={5} y2={5} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <line x1={5} y1={-5} x2={-5} y2={5} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

/* ── Spinner ── */
const LoadingDots: React.FC<{ x: number; y: number; color: string; frame: number }> = ({ x, y, color, frame }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const phase = ((frame * 3) + i * 30) % 90;
      const opacity = interpolate(phase, [0, 30, 60, 90], [0.2, 0.8, 0.2, 0.2], { extrapolateRight: 'clamp' });
      return (
        <circle key={i} cx={x + i * 12} cy={y} r={4} fill={color} fillOpacity={opacity} />
      );
    })}
  </g>
);

/* ── Server icon ── */
const ServerIcon: React.FC<{ x: number; y: number; color: string; down?: boolean }> = ({ x, y, color, down }) => (
  <g>
    <rect x={x - 24} y={y - 30} width={48} height={60} rx={6}
      fill={C.cardFill} stroke={down ? C.red : color} strokeWidth={2} />
    {/* Server rack lines */}
    <line x1={x - 14} y1={y - 16} x2={x + 14} y2={y - 16} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
    <line x1={x - 14} y1={y - 2} x2={x + 14} y2={y - 2} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
    <line x1={x - 14} y1={y + 12} x2={x + 14} y2={y + 12} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
    {/* Status light */}
    <circle cx={x + 12} cy={y - 22} r={3} fill={down ? C.red : C.green} />
    {/* Down slash */}
    {down && (
      <line x1={x - 28} y1={y + 34} x2={x + 28} y2={y - 34}
        stroke={C.red} strokeWidth={2.5} strokeLinecap="round" />
    )}
  </g>
);

export const FaultToleranceScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('fault-tolerance');

  const pTitle = progress('show-title');
  const pApiCall = progress('show-api-call');
  const pApiDown = progress('show-api-down');
  const pBlank = progress('show-blank-screen');
  const pThreeStates = progress('show-three-states');
  const pHappy = progress('show-happy');
  const pLoading = progress('show-loading');
  const pError = progress('show-error');
  const pRetry = progress('show-retry-cascade');
  const pGraceful = progress('show-graceful-message');

  // Phase transitions
  const problemPhase = pThreeStates < 0.5 ? 1 : 0;
  const statesPhase = pThreeStates >= 0.5 ? 1 : 0;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text
          x={grid.center().x} y={grid.y(0.02)}
          textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontFamily="Inter, sans-serif" fontWeight={700}
        >
          Fault Tolerance and Graceful Degradation
        </text>
      </g>

      {/* ═══ PROBLEM PHASE ═══ */}
      <g style={{ opacity: problemPhase }}>
        {/* App calling API */}
        <g style={{ opacity: pApiCall }}>
          {/* App box */}
          <rect
            x={grid.x(0.10)} y={grid.y(0.16)}
            width={240} height={120} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.10)} y={grid.y(0.16)} width={6} height={120} rx={3}
            fill={C.fault} fillOpacity={0.5} />
          <text
            x={grid.x(0.10) + 120} y={grid.y(0.20)}
            textAnchor="middle" fill={C.dark}
            fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Your App
          </text>
          <text
            x={grid.x(0.10) + 120} y={grid.y(0.20) + 30}
            textAnchor="middle" fill={C.mid}
            fontSize={FONT_SIZE.sm} fontWeight={400} fontFamily="monospace"
          >
            openai.chat.create()
          </text>

          {/* Arrow */}
          <line
            x1={grid.x(0.10) + 245} y1={grid.y(0.24)}
            x2={grid.x(0.60)} y2={grid.y(0.24)}
            stroke={C.fault} strokeWidth={2} strokeLinecap="round"
          />
          <path
            d={`M ${grid.x(0.60) - 8},${grid.y(0.24) - 5} L ${grid.x(0.60)},${grid.y(0.24)} L ${grid.x(0.60) - 8},${grid.y(0.24) + 5}`}
            fill="none" stroke={C.fault} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          />
        </g>

        {/* API server - down */}
        <g style={{ opacity: pApiDown }}>
          <rect
            x={grid.x(0.60)} y={grid.y(0.16)}
            width={240} height={120} rx={12}
            fill={C.cardFill} stroke={C.red} strokeWidth={2}
            filter="url(#shadow-sm)"
          />
          <ServerIcon x={grid.x(0.60) + 60} y={grid.y(0.24)} color={C.mid} down />
          <text
            x={grid.x(0.60) + 160} y={grid.y(0.20)}
            textAnchor="middle" fill={C.red}
            fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            OpenAI API
          </text>
          <text
            x={grid.x(0.60) + 160} y={grid.y(0.20) + 24}
            textAnchor="middle" fill={C.red}
            fontSize={FONT_SIZE.sm} fontWeight={500} fontFamily="monospace"
          >
            503 Unavailable
          </text>
        </g>

        {/* What user sees - blank screen */}
        <g style={{ opacity: pBlank }}>
          <text
            x={grid.center().x} y={grid.y(0.46)}
            textAnchor="middle" fill={C.mid}
            fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            What does the user see?
          </text>

          {/* Blank screen mockup */}
          <rect
            x={grid.center().x - 180} y={grid.y(0.52)}
            width={360} height={220} rx={12}
            fill={C.cardFill} stroke={C.red} strokeWidth={1.5}
          />
          {/* Window bar */}
          <rect
            x={grid.center().x - 180} y={grid.y(0.52)}
            width={360} height={30} rx={12}
            fill={C.red} fillOpacity={0.06}
          />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={grid.center().x - 160 + i * 16} cy={grid.y(0.52) + 15} r={4}
              fill={[C.red, C.amber, C.green][i]} fillOpacity={0.5} />
          ))}

          {/* Raw error inside */}
          <text
            x={grid.center().x} y={grid.y(0.52) + 80}
            textAnchor="middle" fill={C.red}
            fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="monospace"
          >
            Error 503
          </text>
          <text
            x={grid.center().x} y={grid.y(0.52) + 110}
            textAnchor="middle" fill={C.mid}
            fontSize={FONT_SIZE.sm} fontWeight={400} fontFamily="monospace"
          >
            Service Temporarily Unavailable
          </text>
          <text
            x={grid.center().x} y={grid.y(0.52) + 160}
            textAnchor="middle" fill={C.red}
            fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Your fault, not the engineer's
          </text>
        </g>
      </g>

      {/* ═══ THREE STATES PHASE ═══ */}
      <g style={{ opacity: statesPhase }}>
        {/* Three states header */}
        <g style={{ opacity: pThreeStates }}>
          <text
            x={grid.center().x} y={grid.y(0.12)}
            textAnchor="middle" fill={C.dark}
            fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Every feature needs three states
          </text>
        </g>

        {/* Three state cards side by side */}
        {(() => {
          const states = [
            {
              label: 'Happy Path', color: C.green, colorLight: C.greenLight, p: pHappy,
              lines: ['Data loads correctly', 'AI generates response', 'User sees result'],
            },
            {
              label: 'Loading State', color: C.amber, colorLight: C.amberLight, p: pLoading,
              lines: ['Spinner visible', 'Skeleton content', 'User can interact'],
            },
            {
              label: 'Error State', color: C.red, colorLight: C.redLight, p: pError,
              lines: ['Friendly message', 'Retry button', 'Rest of page works'],
            },
          ];

          const cardW = 360;
          const cardH = 220;
          const gap = 50;
          const totalW = states.length * cardW + (states.length - 1) * gap;
          const startX = grid.center().x - totalW / 2;
          const cardY = grid.y(0.20);

          return states.map((s, i) => {
            const cx = startX + i * (cardW + gap);
            const slideY = interpolate(s.p, [0, 1], [20, 0], { extrapolateRight: 'clamp' });

            return (
              <g key={s.label} style={{ opacity: s.p, transform: `translateY(${slideY}px)` }}>
                {/* Card */}
                <rect
                  x={cx} y={cardY} width={cardW} height={cardH} rx={14}
                  fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
                  filter="url(#shadow-sm)"
                />
                {/* Left stripe */}
                <rect
                  x={cx} y={cardY} width={6} height={cardH} rx={3}
                  fill={s.color} fillOpacity={0.6}
                />

                {/* Icon */}
                {i === 0 && <CheckIcon x={cx + 30} y={cardY + 32} color={s.color} size={1.2} />}
                {i === 1 && <LoadingDots x={cx + 18} y={cardY + 32} color={s.color} frame={frame} />}
                {i === 2 && <XIcon x={cx + 30} y={cardY + 32} color={s.color} size={1.2} />}

                {/* Label */}
                <text
                  x={cx + 56} y={cardY + 36}
                  dominantBaseline="central" fill={s.color}
                  fontSize={FONT_SIZE.lg} fontWeight={700} fontFamily="Inter, sans-serif"
                >
                  {s.label}
                </text>

                {/* Content lines */}
                {s.lines.map((line, j) => (
                  <g key={j}>
                    {/* Bullet dot */}
                    <circle cx={cx + 28} cy={cardY + 80 + j * 42} r={3} fill={s.color} fillOpacity={0.5} />
                    {/* Line text */}
                    <text
                      x={cx + 42} y={cardY + 80 + j * 42}
                      dominantBaseline="central" fill={C.dark}
                      fontSize={FONT_SIZE.md} fontWeight={500} fontFamily="Inter, sans-serif"
                    >
                      {line}
                    </text>
                  </g>
                ))}
              </g>
            );
          });
        })()}

        {/* Retry cascade */}
        <g style={{ opacity: pRetry }}>
          <rect
            x={grid.x(0.02)} y={grid.y(0.60)}
            width={560} height={80} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.02)} y={grid.y(0.60)} width={6} height={80} rx={3}
            fill={C.fault} fillOpacity={0.5} />

          <text
            x={grid.x(0.05)} y={grid.y(0.62) + 6}
            fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Retry Strategy
          </text>

          {/* Retry attempts */}
          {['Attempt 1', 'Attempt 2', 'Attempt 3'].map((attempt, i) => {
            const ad = beat('show-retry-cascade') + i * 6;
            const ap = entranceSpring(frame, fps, ad);
            const isLast = i === 2;
            const label = isLast ? 'Attempt 3 (or fail)' : attempt;
            const boxW = label.length * 10 + 56;
            const ax = grid.x(0.05) + i * 170;
            return (
              <g key={i} style={{ opacity: ap }}>
                <rect
                  x={ax} y={grid.y(0.67)}
                  width={boxW} height={40} rx={8}
                  fill={isLast ? C.greenLight : C.redLight}
                  stroke={isLast ? C.green : C.red} strokeWidth={1}
                />
                <text
                  x={ax + boxW / 2} y={grid.y(0.67) + 20}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isLast ? C.green : C.red}
                  fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
                >
                  {label}
                </text>
                {/* Arrow between */}
                {i < 2 && (
                  <line
                    x1={ax + boxW + 4} y1={grid.y(0.67) + 20}
                    x2={ax + 166} y2={grid.y(0.67) + 20}
                    stroke={C.mid} strokeWidth={1.5} strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Graceful degradation message */}
        <g style={{ opacity: pGraceful }}>
          <rect
            x={grid.x(0.38)} y={grid.y(0.60)}
            width={540} height={80} rx={12}
            fill={C.cardFill} stroke={C.green} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.38)} y={grid.y(0.60)} width={6} height={80} rx={3}
            fill={C.green} fillOpacity={0.6} />
          <CheckIcon x={grid.x(0.41)} y={grid.y(0.64)} color={C.green} size={1.2} />
          <text
            x={grid.x(0.44)} y={grid.y(0.63)}
            fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Graceful Degradation
          </text>
          <text
            x={grid.x(0.41)} y={grid.y(0.66)}
            fill={C.mid} fontSize={FONT_SIZE.sm} fontWeight={400} fontFamily="Inter, sans-serif"
          >
            "AI suggestions unavailable. You can still save manually."
          </text>
        </g>

        {/* Bottom summary */}
        <g style={{ opacity: pGraceful }}>
          <text
            x={grid.center().x} y={grid.y(0.88)}
            textAnchor="middle" fill={C.dark}
            fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Never let one dependency take down the whole experience
          </text>
        </g>
      </g>
    </g>
  );
};
