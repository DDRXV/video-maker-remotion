import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';

/* ── Wifi cut icon ── */
const WifiCutIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M ${x - 16},${y - 8} Q ${x},${y - 20} ${x + 16},${y - 8}`}
      fill="none" stroke={C.red} strokeWidth={2} />
    <path d={`M ${x - 10},${y - 2} Q ${x},${y - 10} ${x + 10},${y - 2}`}
      fill="none" stroke={C.red} strokeWidth={2} />
    <circle cx={x} cy={y + 4} r={2.5} fill={C.red} />
    {/* Slash through */}
    <line x1={x - 16} y1={y + 10} x2={x + 16} y2={y - 18}
      stroke={C.red} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

/* ── Key icon ── */
const KeyIcon: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <circle cx={x - 6} cy={y} r={8} fill="none" stroke={color} strokeWidth={2} />
    <line x1={x + 2} y1={y} x2={x + 18} y2={y} stroke={color} strokeWidth={2} strokeLinecap="round" />
    <line x1={x + 14} y1={y} x2={x + 14} y2={y + 6} stroke={color} strokeWidth={2} strokeLinecap="round" />
    <line x1={x + 18} y1={y} x2={x + 18} y2={y + 4} stroke={color} strokeWidth={2} strokeLinecap="round" />
  </g>
);

/* ── Cursor click icon ── */
const CursorClick: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g>
    <path d={`M ${x},${y} L ${x},${y + 18} L ${x + 5},${y + 13} L ${x + 10},${y + 20}`}
      fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    {/* Click ripple */}
    <circle cx={x} cy={y} r={6} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.4} />
    <circle cx={x} cy={y} r={12} fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.2} />
  </g>
);

export const IdempotencyScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('idempotency');

  const pTitle = progress('show-title');
  const pSubmit = progress('show-user-submit');
  const pNetCut = progress('show-network-cut');
  const pDouble = progress('show-double-click');
  const pDuplicate = progress('show-duplicate-records');
  const pIdempotent = progress('show-idempotent-result');
  const pKeyFlow = progress('show-key-flow');
  const pBackend = progress('show-backend-check');
  const pStripe = progress('show-stripe-reference');

  // Phase transitions
  const problemPhase = pKeyFlow < 0.5 ? 1 : 0;
  const solutionPhase = pKeyFlow >= 0.5 ? 1 : 0;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text
          x={grid.center().x} y={grid.y(0.02)}
          textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontFamily="Inter, sans-serif" fontWeight={700}
        >
          Idempotency
        </text>
      </g>

      {/* ═══ PROBLEM PHASE ═══ */}
      <g style={{ opacity: problemPhase }}>

        {/* User + form */}
        <g style={{ opacity: pSubmit }}>
          {/* Form card */}
          <rect
            x={grid.x(0.06)} y={grid.y(0.12)}
            width={320} height={220} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.06)} y={grid.y(0.12)} width={6} height={220} rx={3}
            fill={C.idempotent} fillOpacity={0.5} />

          {/* Form fields */}
          <text
            x={grid.x(0.09)} y={grid.y(0.16)}
            fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Payment Form
          </text>
          {['Card: **** 4242', 'Amount: $49.99', 'Email: user@email.com'].map((field, i) => (
            <g key={i}>
              <rect
                x={grid.x(0.09)} y={grid.y(0.20) + i * 40}
                width={260} height={30} rx={6}
                fill={C.idempotent} fillOpacity={0.04}
                stroke={C.hairline} strokeWidth={1}
              />
              <text
                x={grid.x(0.09) + 12} y={grid.y(0.20) + i * 40 + 15}
                dominantBaseline="central"
                fill={C.mid} fontSize={FONT_SIZE.sm} fontWeight={400}
                fontFamily="monospace"
              >
                {field}
              </text>
            </g>
          ))}

          {/* Submit button */}
          <rect
            x={grid.x(0.09)} y={grid.y(0.38)}
            width={160} height={42} rx={8}
            fill={C.idempotent} fillOpacity={0.15}
            stroke={C.idempotent} strokeWidth={1.5}
          />
          <text
            x={grid.x(0.09) + 80} y={grid.y(0.38) + 21}
            textAnchor="middle" dominantBaseline="central"
            fill={C.idempotent} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Submit
          </text>

          {/* Cursor clicking */}
          <CursorClick x={grid.x(0.09) + 120} y={grid.y(0.38) + 10} color={C.dark} />
        </g>

        {/* Network cut */}
        <g style={{ opacity: pNetCut }}>
          {/* Arrow from form to server */}
          <line
            x1={grid.x(0.06) + 325} y1={grid.y(0.28)}
            x2={grid.x(0.50)} y2={grid.y(0.28)}
            stroke={C.mid} strokeWidth={2} strokeLinecap="round"
            strokeDasharray="6 4"
          />
          {/* Network cut overlay */}
          <WifiCutIcon x={grid.x(0.40)} y={grid.y(0.24)} />

          {/* Question mark thought bubble */}
          <rect
            x={grid.x(0.10)} y={grid.y(0.48)}
            width={260} height={44} rx={22}
            fill={C.amberLight} stroke={C.amber} strokeWidth={1}
          />
          <text
            x={grid.x(0.10) + 130} y={grid.y(0.48) + 22}
            textAnchor="middle" dominantBaseline="central"
            fill={C.amber} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Did it go through?
          </text>
        </g>

        {/* Double click */}
        <g style={{ opacity: pDouble }}>
          <CursorClick x={grid.x(0.09) + 130} y={grid.y(0.38) + 15} color={C.red} />
          <text
            x={grid.x(0.09) + 165} y={grid.y(0.38) + 6}
            fill={C.red} fontSize={FONT_SIZE.xs} fontWeight={700}
            fontFamily="Inter, sans-serif"
          >
            Click again!
          </text>
        </g>

        {/* ── Without idempotency: duplicate records ── */}
        <g style={{ opacity: pDuplicate }}>
          <rect
            x={grid.x(0.52)} y={grid.y(0.12)}
            width={360} height={190} rx={12}
            fill={C.cardFill} stroke={C.red} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.52)} y={grid.y(0.12)} width={6} height={190} rx={3}
            fill={C.red} fillOpacity={0.6} />

          <text
            x={grid.x(0.55)} y={grid.y(0.16)}
            fill={C.red} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Without Idempotency
          </text>

          {/* Database rows */}
          <rect
            x={grid.x(0.55)} y={grid.y(0.20)}
            width={310} height={36} rx={6}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1}
          />
          <text
            x={grid.x(0.55) + 10} y={grid.y(0.20) + 18}
            dominantBaseline="central"
            fill={C.mid} fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily="monospace"
          >
            id  amount  status     created_at
          </text>

          {/* Row 1 */}
          <rect
            x={grid.x(0.55)} y={grid.y(0.20) + 40}
            width={310} height={32} rx={4}
            fill={C.redLight} fillOpacity={0.3}
          />
          <text
            x={grid.x(0.55) + 10} y={grid.y(0.20) + 56}
            dominantBaseline="central"
            fill={C.dark} fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="monospace"
          >
            101 $49.99  charged    10:04:31
          </text>

          {/* Row 2 - duplicate */}
          <rect
            x={grid.x(0.55)} y={grid.y(0.20) + 76}
            width={310} height={32} rx={4}
            fill={C.redLight} fillOpacity={0.5}
          />
          <text
            x={grid.x(0.55) + 10} y={grid.y(0.20) + 92}
            dominantBaseline="central"
            fill={C.red} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily="monospace"
          >
            102 $49.99  charged    10:04:32
          </text>

          {/* Duplicate badge */}
          <rect
            x={grid.x(0.55) + 180} y={grid.y(0.20) + 78}
            width={140} height={32} rx={16}
            fill={C.red} fillOpacity={0.12}
            stroke={C.red} strokeWidth={1}
          />
          <text
            x={grid.x(0.55) + 250} y={grid.y(0.20) + 94}
            textAnchor="middle" dominantBaseline="central"
            fill={C.red} fontSize={FONT_SIZE.sm} fontWeight={700}
            fontFamily="Inter, sans-serif"
          >
            DUPLICATE
          </text>
        </g>

        {/* ── With idempotency ── */}
        <g style={{ opacity: pIdempotent }}>
          <rect
            x={grid.x(0.52)} y={grid.y(0.52)}
            width={360} height={140} rx={12}
            fill={C.cardFill} stroke={C.green} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.52)} y={grid.y(0.52)} width={6} height={140} rx={3}
            fill={C.green} fillOpacity={0.6} />

          <text
            x={grid.x(0.55)} y={grid.y(0.56)}
            fill={C.green} fontSize={FONT_SIZE.md} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            With Idempotency
          </text>

          {/* Single row */}
          <rect
            x={grid.x(0.55)} y={grid.y(0.60)}
            width={310} height={36} rx={6}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1}
          />
          <text
            x={grid.x(0.55) + 10} y={grid.y(0.60) + 18}
            dominantBaseline="central"
            fill={C.mid} fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily="monospace"
          >
            id  amount  status     created_at
          </text>

          <rect
            x={grid.x(0.55)} y={grid.y(0.60) + 40}
            width={310} height={32} rx={4}
            fill={C.greenLight} fillOpacity={0.3}
          />
          <text
            x={grid.x(0.55) + 10} y={grid.y(0.60) + 56}
            dominantBaseline="central"
            fill={C.dark} fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="monospace"
          >
            101 $49.99  charged    10:04:31
          </text>

          <text
            x={grid.x(0.55) + 155} y={grid.y(0.60) + 86}
            textAnchor="middle" fill={C.green}
            fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Same result returned. No duplicate.
          </text>
        </g>
      </g>

      {/* ═══ SOLUTION PHASE: Key flow diagram ═══ */}
      <g style={{ opacity: solutionPhase }}>

        {/* Flow diagram: Frontend → Key → Backend → Check → Return */}
        <g style={{ opacity: pKeyFlow }}>
          {/* Frontend box */}
          <rect
            x={grid.x(0.02)} y={grid.y(0.14)}
            width={240} height={280} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.02)} y={grid.y(0.14)} width={6} height={280} rx={3}
            fill={C.idempotent} fillOpacity={0.5} />
          <text
            x={grid.x(0.02) + 120} y={grid.y(0.17)}
            textAnchor="middle" fill={C.idempotent}
            fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Frontend
          </text>

          {/* Step 1: Generate key */}
          <rect
            x={grid.x(0.05)} y={grid.y(0.22)}
            width={200} height={48} rx={8}
            fill={C.idempotent} fillOpacity={0.08}
            stroke={C.idempotent} strokeWidth={1}
          />
          <text
            x={grid.x(0.05) + 14} y={grid.y(0.22) + 18}
            fill={C.dark} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            1. Generate unique key
          </text>
          <text
            x={grid.x(0.05) + 14} y={grid.y(0.22) + 36}
            fill={C.idempotent} fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="monospace"
          >
            key: a1b2c3d4
          </text>

          {/* Step 2: Send with request */}
          {(() => {
            const s2d = beat('show-key-flow') + 8;
            const s2p = entranceSpring(frame, fps, s2d);
            return (
              <g style={{ opacity: s2p }}>
                <rect
                  x={grid.x(0.05)} y={grid.y(0.30)}
                  width={200} height={48} rx={8}
                  fill={C.idempotent} fillOpacity={0.08}
                  stroke={C.idempotent} strokeWidth={1}
                />
                <text
                  x={grid.x(0.05) + 14} y={grid.y(0.30) + 18}
                  fill={C.dark} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily="Inter, sans-serif"
                >
                  2. Send with request
                </text>
                <text
                  x={grid.x(0.05) + 14} y={grid.y(0.30) + 36}
                  fill={C.mid} fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="monospace"
                >
                  {'POST /pay {key: a1b2..}'}
                </text>
              </g>
            );
          })()}

          {/* Key icon */}
          <KeyIcon x={grid.x(0.05) + 170} y={grid.y(0.22) + 24} color={C.idempotent} />
        </g>

        {/* Arrow from frontend to backend */}
        <g style={{ opacity: pKeyFlow }}>
          <line
            x1={grid.x(0.02) + 245} y1={grid.y(0.30)}
            x2={grid.x(0.42)} y2={grid.y(0.30)}
            stroke={C.idempotent} strokeWidth={2} strokeLinecap="round"
          />
          {/* Arrowhead */}
          <path
            d={`M ${grid.x(0.42) - 8},${grid.y(0.30) - 5} L ${grid.x(0.42)},${grid.y(0.30)} L ${grid.x(0.42) - 8},${grid.y(0.30) + 5}`}
            fill="none" stroke={C.idempotent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          />
        </g>

        {/* Backend box */}
        <g style={{ opacity: pBackend }}>
          <rect
            x={grid.x(0.42)} y={grid.y(0.14)}
            width={500} height={280} rx={12}
            fill={C.cardFill} stroke={C.hairline} strokeWidth={1.5}
            filter="url(#shadow-sm)"
          />
          <rect x={grid.x(0.42)} y={grid.y(0.14)} width={6} height={280} rx={3}
            fill={C.green} fillOpacity={0.5} />
          <text
            x={grid.x(0.42) + 250} y={grid.y(0.17)}
            textAnchor="middle" fill={C.green}
            fontSize={FONT_SIZE.lg} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Backend
          </text>

          {/* Decision diamond - simplified as card */}
          <rect
            x={grid.x(0.45)} y={grid.y(0.22)}
            width={280} height={52} rx={8}
            fill={C.green} fillOpacity={0.08}
            stroke={C.green} strokeWidth={1}
          />
          <text
            x={grid.x(0.45) + 140} y={grid.y(0.22) + 18}
            textAnchor="middle" fill={C.dark}
            fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
          >
            Check: seen this key before?
          </text>
          <text
            x={grid.x(0.45) + 140} y={grid.y(0.22) + 38}
            textAnchor="middle" fill={C.mid}
            fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="monospace"
          >
            SELECT * WHERE key = a1b2..
          </text>

          {/* Two outcomes */}
          {/* NO path */}
          {(() => {
            const noDelay = beat('show-backend-check') + 6;
            const noP = entranceSpring(frame, fps, noDelay);
            return (
              <g style={{ opacity: noP }}>
                <rect
                  x={grid.x(0.45)} y={grid.y(0.32)}
                  width={250} height={80} rx={8}
                  fill={C.idempotentLight}
                  stroke={C.idempotent} strokeWidth={1}
                />
                <text
                  x={grid.x(0.45) + 125} y={grid.y(0.32) + 18}
                  textAnchor="middle" fill={C.idempotent}
                  fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
                >
                  New key? Process it.
                </text>
                <text
                  x={grid.x(0.45) + 125} y={grid.y(0.32) + 42}
                  textAnchor="middle" fill={C.mid}
                  fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="Inter, sans-serif"
                >
                  Execute payment
                </text>
                <text
                  x={grid.x(0.45) + 125} y={grid.y(0.32) + 62}
                  textAnchor="middle" fill={C.mid}
                  fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="Inter, sans-serif"
                >
                  Store result with key
                </text>
              </g>
            );
          })()}

          {/* YES path */}
          {(() => {
            const yesDelay = beat('show-backend-check') + 12;
            const yesP = entranceSpring(frame, fps, yesDelay);
            return (
              <g style={{ opacity: yesP }}>
                <rect
                  x={grid.x(0.68)} y={grid.y(0.32)}
                  width={270} height={80} rx={8}
                  fill={C.greenLight}
                  stroke={C.green} strokeWidth={1}
                />
                <text
                  x={grid.x(0.68) + 135} y={grid.y(0.32) + 18}
                  textAnchor="middle" fill={C.green}
                  fontSize={FONT_SIZE.sm} fontWeight={600} fontFamily="Inter, sans-serif"
                >
                  Seen before? Return cache.
                </text>
                <text
                  x={grid.x(0.68) + 135} y={grid.y(0.32) + 42}
                  textAnchor="middle" fill={C.mid}
                  fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="Inter, sans-serif"
                >
                  Skip payment
                </text>
                <text
                  x={grid.x(0.68) + 135} y={grid.y(0.32) + 62}
                  textAnchor="middle" fill={C.mid}
                  fontSize={FONT_SIZE.xs} fontWeight={400} fontFamily="Inter, sans-serif"
                >
                  Return cached result
                </text>
              </g>
            );
          })()}
        </g>

        {/* Stripe reference */}
        <g style={{ opacity: pStripe }}>
          <rect
            x={grid.center().x - 300} y={grid.y(0.80)}
            width={600} height={52} rx={26}
            fill={C.idempotent} fillOpacity={0.06}
            stroke={C.idempotent} strokeWidth={1.5}
          />
          <text
            x={grid.center().x} y={grid.y(0.80) + 26}
            textAnchor="middle" dominantBaseline="central"
            fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            Stripe uses this pattern for every payment API call
          </text>
        </g>
      </g>
    </g>
  );
};
