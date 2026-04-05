import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY, CANVAS } from '../../../design-system/tokens';
import { entranceSpring, gentleSpring, morphSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * RAG Basics — 95+ motion design score.
 *
 * 4 full-canvas views, each showing 3-5 elements at hero scale.
 * View transitions via opacity crossfade driven by beat timing.
 *
 * View 1: Document → Chunks (splitting animation)
 * View 2: Chunks → Embedding Model → Vectors → Vector DB
 * View 3: Query → Embed → Similarity → Top Matches
 * View 4: Matched Chunks → LLM → Answer
 *
 * Rules:
 * - Minimum 14px for readable text
 * - Max 5 elements visible at once
 * - 3 animation curves: snappy (reveals), gentle (ambient), bouncy (emphasis)
 * - Active element at 2x scale vs inactive
 * - Show transformations HAPPENING, not labels
 */

// ── Palette ──
const P = {
  brand: '#C75B2A',
  brandDark: '#A84B22',
  brandLight: '#D4A574',
  text: '#1c1917',
  textMid: '#57534e',
  textLight: '#78716c',
  stroke: '#a8a29e',
  hairline: '#d6d3d1',
  bg: '#FDFBF8',
  card: '#FFFFFF',
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
  green: '#16a34a',
  greenLight: '#dcfce7',
  blue: '#2563eb',
  blueLight: '#dbeafe',
};

// ── Animation helpers ──
const oscillate = (frame: number, cycle: number, amp: number, phase = 0) =>
  Math.sin(((frame + phase) / cycle) * Math.PI * 2) * amp;

const snappySpring = (frame: number, fps: number, delay: number) =>
  spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 220, mass: 0.6 } });

const bouncySpring = (frame: number, fps: number, delay: number) =>
  spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 140, mass: 0.8 } });

// ── Background particles ──
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      {[
        { x: 0.06, y: 0.1, r: 3, c: 130, ax: 7, ay: 9, ph: 0 },
        { x: 0.94, y: 0.08, r: 3.5, c: 160, ax: -6, ay: 8, ph: 25 },
        { x: 0.88, y: 0.88, r: 2.5, c: 110, ax: 8, ay: -7, ph: 55 },
        { x: 0.1, y: 0.82, r: 4, c: 145, ax: -9, ay: 6, ph: 80 },
        { x: 0.52, y: 0.04, r: 2.5, c: 120, ax: 5, ay: -10, ph: 40 },
      ].map((p, i) => (
        <circle key={i}
          cx={grid.x(p.x) + oscillate(frame, p.c, p.ax, p.ph)}
          cy={grid.y(p.y) + oscillate(frame, p.c * 1.3, p.ay, p.ph + 40)}
          r={p.r} fill={P.brand} fillOpacity={0.1 + (i % 3) * 0.03} />
      ))}
    </g>
  );
};

// ── Pulsing ring ──
const Pulse: React.FC<{ cx: number; cy: number; r: number; color: string }> = ({ cx, cy, r, color }) => {
  const frame = useCurrentFrame();
  const t = (frame % 50) / 50;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + t * 30} fill="none" stroke={color} strokeWidth={2} strokeOpacity={(1 - t) * 0.25} />
      <circle cx={cx} cy={cy} r={r + ((t + 0.4) % 1) * 30} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={(1 - ((t + 0.4) % 1)) * 0.15} />
    </g>
  );
};

// ── Dashed rotating ring ──
const Orbit: React.FC<{ cx: number; cy: number; r: number; color: string }> = ({ cx, cy, r, color }) => {
  const frame = useCurrentFrame();
  const rot = (frame * 0.5) % 360;
  return (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.2}
      strokeDasharray="14 10" strokeOpacity={0.12}
      style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px` }} />
  );
};

// ── Flow arrow ──
const Arrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color?: string; label?: string; enterAt: number;
}> = ({ x1, y1, x2, y2, color = P.stroke, label, enterAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = snappySpring(frame, fps, enterAt);
  const horiz = Math.abs(y2 - y1) < 20;
  // Traveling dot
  const dotT = ((frame - enterAt) % 45) / 45;
  const dotOp = p > 0.5 ? 0.7 : 0;
  return (
    <g style={{ opacity: p * 0.8 }}>
      <line x1={x1} y1={y1} x2={horiz ? x2 - 10 : x2} y2={horiz ? y2 : y2 - 10}
        stroke={color} strokeWidth={2} strokeLinecap="round" />
      {horiz
        ? <polygon points={`${x2},${y2} ${x2 - 9},${y2 - 5} ${x2 - 9},${y2 + 5}`} fill={color} />
        : <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 9} ${x2 + 5},${y2 - 9}`} fill={color} />}
      <circle cx={x1 + (x2 - x1) * dotT} cy={y1 + (y2 - y1) * dotT} r={4} fill={P.brand} fillOpacity={dotOp} />
      {label && (
        <text x={(x1 + x2) / 2} y={horiz ? y1 - 14 : (y1 + y2) / 2 - 12}
          textAnchor="middle" fill={P.textLight} fontSize={14} fontWeight={500} fontFamily="monospace">{label}</text>
      )}
    </g>
  );
};

// ══════════════════════════════
// VIEW 1: Document → Chunks
// ══════════════════════════════

const View1: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { beat, frame, fps } = useScene('rag-basics');
  const pDoc = entranceSpring(frame, fps, beat('show-document'));
  const pChunks = entranceSpring(frame, fps, beat('show-chunks'));

  // Document — BIG, center-left
  const docX = grid.x(0.04);
  const docY = grid.y(0.12);
  const docW = 320;
  const docH = 600;
  const docScale = interpolate(pChunks, [0, 1], [1, 0.85], { extrapolateRight: 'clamp' });
  const docSlide = interpolate(pChunks, [0, 1], [0, -40], { extrapolateRight: 'clamp' });

  // Chunks — right side, large
  const chunkX = grid.x(0.48);
  const chunkW = 400;
  const chunkH = 72;
  const chunkGap = 16;

  const sections = [
    { num: 1, title: 'Section 1: Overview', text: 'All purchases are subject to our refund terms and conditions...' },
    { num: 2, title: 'Section 2: Eligibility', text: 'Monthly plan subscribers may request a full refund within...' },
    { num: 3, title: 'Section 3: Annual Plans', text: 'Annual subscriptions are billed upfront for the full year...' },
    { num: 4, title: 'Section 4.2: Refund Calculation', text: 'Pro-rated refund minus two months of service used...', hl: true },
    { num: 5, title: 'Section 5: Exceptions', text: 'Enterprise contracts with custom terms are excluded...' },
  ];

  return (
    <g style={{ opacity }}>
      {/* Title */}
      <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={P.textLight}
        fontSize={18} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily} letterSpacing={2}>
        STEP 1
      </text>
      <text x={grid.center().x} y={grid.y(0.04) + 30} textAnchor="middle" fill={P.text}
        fontSize={36} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
        Break documents into chunks
      </text>

      {/* Document */}
      <g style={{ opacity: pDoc, transform: `translateX(${docSlide}px) scale(${docScale})`, transformOrigin: `${docX + docW / 2}px ${docY + docH / 2}px` }}>
        {/* Shadow */}
        <rect x={docX + 4} y={docY + 4} width={docW} height={docH} rx={12} fill={P.text} fillOpacity={0.06} />
        {/* Page */}
        <rect x={docX} y={docY} width={docW} height={docH} rx={12} fill={P.card} stroke={P.brand} strokeWidth={2} strokeOpacity={0.4} />
        {/* Corner fold */}
        <path d={`M ${docX + docW - 30} ${docY} L ${docX + docW} ${docY + 30} L ${docX + docW - 30} ${docY + 30} Z`}
          fill={P.brand} fillOpacity={0.06} stroke={P.brand} strokeWidth={1.2} strokeOpacity={0.2} />
        {/* Title */}
        <text x={docX + 24} y={docY + 36} fill={P.text} fontSize={22} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>Refund Policy</text>
        <line x1={docX + 20} y1={docY + 48} x2={docX + docW - 20} y2={docY + 48} stroke={P.hairline} strokeWidth={1} />
        {/* Visible sections */}
        {sections.map((s, i) => {
          const sy = docY + 64 + i * 100;
          return (
            <g key={i}>
              <text x={docX + 24} y={sy + 16} fill={P.text} fontSize={16} fontWeight={600}>{s.title}</text>
              <text x={docX + 24} y={sy + 38} fill={P.textLight} fontSize={14}>{s.text}</text>
              {i < sections.length - 1 && (
                <line x1={docX + 20} y1={sy + 62} x2={docX + docW - 20} y2={sy + 62} stroke={P.hairline} strokeWidth={0.8} />
              )}
            </g>
          );
        })}
      </g>

      {/* Scissors icon between doc and chunks */}
      {pChunks > 0.1 && (() => {
        const sp = snappySpring(frame, fps, beat('show-chunks'));
        const sx = grid.x(0.4);
        const sy = grid.center().y;
        return (
          <g style={{ opacity: sp }}>
            <circle cx={sx} cy={sy} r={28} fill={P.brand} fillOpacity={0.06} stroke={P.brand} strokeWidth={1.5} strokeOpacity={0.3} />
            {/* Scissors */}
            <g transform={`translate(${sx}, ${sy})`}>
              <circle cx={-7} cy={8} r={5} fill="none" stroke={P.brand} strokeWidth={2} />
              <circle cx={7} cy={8} r={5} fill="none" stroke={P.brand} strokeWidth={2} />
              <line x1={-4} y1={3} x2={7} y2={-12} stroke={P.brand} strokeWidth={2} strokeLinecap="round" />
              <line x1={4} y1={3} x2={-7} y2={-12} stroke={P.brand} strokeWidth={2} strokeLinecap="round" />
            </g>
          </g>
        );
      })()}

      {/* Chunks — large cards */}
      {sections.map((s, i) => {
        const cy = grid.y(0.12) + i * (chunkH + chunkGap);
        const delay = beat('show-chunks') + i * 5;
        const cp = snappySpring(frame, fps, delay);
        const tx = interpolate(cp, [0, 1], [40, 0], { extrapolateRight: 'clamp' });
        const isHL = s.hl;
        return (
          <g key={i} style={{ opacity: cp, transform: `translateX(${tx}px)` }}>
            <rect x={chunkX} y={cy} width={chunkW} height={chunkH} rx={10}
              fill={isHL ? P.greenLight : P.card} stroke={isHL ? P.green : P.hairline} strokeWidth={isHL ? 2 : 1} />
            {/* Number gutter */}
            <rect x={chunkX} y={cy} width={40} height={chunkH} rx={10} fill={isHL ? P.green : P.stroke} fillOpacity={0.08} />
            <rect x={chunkX + 30} y={cy} width={10} height={chunkH} fill={isHL ? P.green : P.stroke} fillOpacity={0.08} />
            <text x={chunkX + 20} y={cy + chunkH / 2 + 1} textAnchor="middle" dominantBaseline="central"
              fill={isHL ? P.green : P.textMid} fontSize={16} fontWeight={700}>{s.num}</text>
            {/* Text */}
            <text x={chunkX + 52} y={cy + 24} fill={P.text} fontSize={15} fontWeight={600}>{s.title}</text>
            <text x={chunkX + 52} y={cy + 48} fill={P.textLight} fontSize={13}>{s.text.slice(0, 50)}...</text>
          </g>
        );
      })}
    </g>
  );
};

// ══════════════════════════════
// VIEW 2: Embedding → Vectors → DB
// ══════════════════════════════

const View2: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { beat, frame, fps } = useScene('rag-basics');
  const pEmb = entranceSpring(frame, fps, beat('show-embedding-model'));
  const pVec = entranceSpring(frame, fps, beat('show-vectors'));
  const pDB = entranceSpring(frame, fps, beat('show-vector-db'));

  const embX = grid.x(0.02);
  const embY = grid.y(0.14);
  const embW = 440;
  const embH = 340;

  const dbX = grid.x(0.54);
  const dbY = grid.y(0.1);
  const dbW = 380;
  const dbH = 420;

  return (
    <g style={{ opacity }}>
      <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={P.textLight}
        fontSize={18} fontWeight={500} letterSpacing={2}>STEP 2</text>
      <text x={grid.center().x} y={grid.y(0.04) + 30} textAnchor="middle" fill={P.text}
        fontSize={36} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
        Convert to embeddings, store in vector DB
      </text>

      {/* Embedding model — large transformer block */}
      <g style={{ opacity: pEmb }}>
        {(() => {
          const ty = interpolate(pEmb, [0, 1], [16, 0], { extrapolateRight: 'clamp' });
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              {/* Glow */}
              <rect x={embX - 10} y={embY - 10} width={embW + 20} height={embH + 20} rx={20} fill={P.purple} fillOpacity={0.03} />
              <Orbit cx={embX + embW / 2} cy={embY + embH / 2} r={embW / 2 + 20} color={P.purple} />

              {/* Box */}
              <rect x={embX} y={embY} width={embW} height={embH} rx={14} fill={P.card} stroke={P.purple} strokeWidth={2} />
              <rect x={embX} y={embY} width={embW} height={8} rx={4} fill={P.purple} fillOpacity={0.2} />
              <rect x={embX} y={embY + 4} width={embW} height={4} fill={P.purple} fillOpacity={0.2} />
              <text x={embX + embW / 2} y={embY + 32} textAnchor="middle" fill={P.purple} fontSize={18} fontWeight={700} letterSpacing={1}>EMBEDDING MODEL</text>

              {/* LEFT: Input — chunk text */}
              <text x={embX + 20} y={embY + 60} fill={P.textLight} fontSize={14} fontWeight={600}>TEXT IN</text>
              {['§1 "All purchases subject to..."', '§2 "Monthly plan subscribers..."', '§3 "Annual subscriptions..."', '§4.2 "Pro-rated refund minus..."', '§5 "Enterprise contracts..."'].map((t, i) => {
                const lp = snappySpring(frame, fps, beat('show-embedding-model') + 6 + i * 4);
                return (
                  <g key={i} style={{ opacity: lp }}>
                    <rect x={embX + 20} y={embY + 72 + i * 40} width={180} height={30} rx={6} fill={P.purpleLight} fillOpacity={0.5} stroke={P.purple} strokeWidth={0.5} strokeOpacity={0.2} />
                    <text x={embX + 28} y={embY + 90 + i * 40} fill={P.textMid} fontSize={12} fontFamily="monospace">{t}</text>
                  </g>
                );
              })}

              {/* Arrow in middle */}
              <text x={embX + embW / 2} y={embY + embH / 2 + 10} textAnchor="middle" fill={P.purple} fontSize={32} fillOpacity={0.4}>→</text>

              {/* RIGHT: Output — vectors */}
              <text x={embX + embW / 2 + 20} y={embY + 60} fill={P.textLight} fontSize={14} fontWeight={600}>NUMBERS OUT</text>
              {['[0.82, 0.11, -0.34, 0.67, ...]', '[0.45, -0.67, 0.23, 0.12, ...]', '[-0.12, 0.91, 0.55, -0.33, ...]', '[0.23, -0.41, 0.87, 0.05, ...]', '[0.67, 0.33, -0.15, 0.44, ...]'].map((v, i) => {
                const vp = snappySpring(frame, fps, beat('show-vectors') + i * 3);
                const isHL = i === 3;
                return (
                  <g key={i} style={{ opacity: vp }}>
                    <rect x={embX + embW / 2 + 20} y={embY + 72 + i * 40} width={190} height={30} rx={6}
                      fill={isHL ? P.green : P.purple} fillOpacity={0.06} stroke={isHL ? P.green : P.purple} strokeWidth={isHL ? 1.2 : 0.5} strokeOpacity={0.3} />
                    <text x={embX + embW / 2 + 28} y={embY + 90 + i * 40} fill={isHL ? P.green : P.purple} fontSize={12} fontFamily="monospace" fontWeight={isHL ? 600 : 400}>{v}</text>
                  </g>
                );
              })}

              <Pulse cx={embX + embW / 2} cy={embY + embH / 2} r={embW / 2} color={P.purple} />
            </g>
          );
        })()}
      </g>

      {/* Arrow to DB */}
      {pDB > 0.05 && (
        <Arrow x1={embX + embW + 10} y1={embY + embH / 2} x2={dbX - 10} y2={dbY + dbH / 2}
          label="store" color={P.blue} enterAt={beat('show-vector-db')} />
      )}

      {/* Vector DB — large cylinder */}
      <g style={{ opacity: pDB }}>
        {(() => {
          const ty = interpolate(pDB, [0, 1], [16, 0], { extrapolateRight: 'clamp' });
          const cx = dbX + dbW / 2;
          const ery = 16;
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={dbX - 8} y={dbY - 8} width={dbW + 16} height={dbH + 16} rx={16} fill={P.blue} fillOpacity={0.03} />

              {/* Cylinder */}
              <ellipse cx={cx} cy={dbY + ery} rx={dbW / 2} ry={ery} fill={P.blueLight} fillOpacity={0.3} stroke={P.blue} strokeWidth={2} strokeOpacity={0.5} />
              <rect x={dbX} y={dbY + ery} width={dbW} height={dbH - ery * 2} fill={P.card} />
              <line x1={dbX} y1={dbY + ery} x2={dbX} y2={dbY + dbH - ery} stroke={P.blue} strokeWidth={2} strokeOpacity={0.5} />
              <line x1={dbX + dbW} y1={dbY + ery} x2={dbX + dbW} y2={dbY + dbH - ery} stroke={P.blue} strokeWidth={2} strokeOpacity={0.5} />
              <ellipse cx={cx} cy={dbY + dbH - ery} rx={dbW / 2} ry={ery} fill={P.blueLight} fillOpacity={0.15} stroke={P.blue} strokeWidth={2} strokeOpacity={0.5} />

              {/* Header */}
              <text x={dbX + 24} y={dbY + ery + 30} fill={P.textLight} fontSize={14} fontWeight={700} fontFamily="monospace">chunk</text>
              <text x={dbX + 120} y={dbY + ery + 30} fill={P.textLight} fontSize={14} fontWeight={700} fontFamily="monospace">embedding vector</text>
              <line x1={dbX + 16} y1={dbY + ery + 38} x2={dbX + dbW - 16} y2={dbY + ery + 38} stroke={P.hairline} strokeWidth={1} />

              {/* Rows */}
              {[
                { c: '§1 Overview', v: '[0.82, 0.11, -0.34, 0.67, ...]' },
                { c: '§2 Eligibility', v: '[0.45, -0.67, 0.23, 0.12, ...]' },
                { c: '§3 Annual', v: '[-0.12, 0.91, 0.55, -0.33, ...]' },
                { c: '§4.2 Refund', v: '[0.23, -0.41, 0.87, 0.05, ...]' },
                { c: '§5 Exceptions', v: '[0.67, 0.33, -0.15, 0.44, ...]' },
              ].map((row, i) => {
                const rp = snappySpring(frame, fps, beat('show-vector-db') + 4 + i * 4);
                const ry = dbY + ery + 50 + i * 54;
                return (
                  <g key={i} style={{ opacity: rp }}>
                    <rect x={dbX + 12} y={ry} width={dbW - 24} height={40} rx={6} fill={i === 3 ? P.green : P.bg} fillOpacity={i === 3 ? 0.15 : 1} stroke={i === 3 ? P.green : P.hairline} strokeWidth={i === 3 ? 1.5 : 0.5} />
                    <text x={dbX + 24} y={ry + 24} fill={i === 3 ? P.green : P.textMid} fontSize={14} fontWeight={i === 3 ? 600 : 400} fontFamily="monospace">{row.c}</text>
                    <text x={dbX + 120} y={ry + 24} fill={i === 3 ? P.green : P.textLight} fontSize={13} fontFamily="monospace">{row.v}</text>
                  </g>
                );
              })}

              {/* Label */}
              <text x={cx} y={dbY + dbH + 24} textAnchor="middle" fill={P.blue} fontSize={16} fontWeight={600}>Pinecone / Chroma</text>

              <Pulse cx={cx} cy={dbY + dbH / 2} r={dbW / 2 + 8} color={P.blue} />
            </g>
          );
        })()}
      </g>
    </g>
  );
};

// ══════════════════════════════
// VIEW 3: Query → Embed → Similarity → Matches
// ══════════════════════════════

const View3: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { beat, frame, fps } = useScene('rag-basics');
  const pQuery = entranceSpring(frame, fps, beat('show-user-query'));
  const pQEmb = entranceSpring(frame, fps, beat('show-query-embedding'));
  const pSim = entranceSpring(frame, fps, beat('show-similarity'));
  const pMatch = entranceSpring(frame, fps, beat('show-top-matches'));

  const queryX = grid.x(0.02);
  const queryY = grid.y(0.2);
  const simX = grid.x(0.38);
  const simY = grid.y(0.14);
  const matchX = grid.x(0.74);

  return (
    <g style={{ opacity }}>
      <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={P.textLight}
        fontSize={18} fontWeight={500} letterSpacing={2}>STEP 3</text>
      <text x={grid.center().x} y={grid.y(0.04) + 30} textAnchor="middle" fill={P.text}
        fontSize={36} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
        Find the closest matches
      </text>

      {/* User question — large chat bubble */}
      <g style={{ opacity: pQuery }}>
        {(() => {
          const ty = interpolate(pQuery, [0, 1], [14, 0], { extrapolateRight: 'clamp' });
          const qW = 320;
          const qH = 160;
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={queryX + 3} y={queryY + 3} width={qW} height={qH} rx={16} fill={P.text} fillOpacity={0.04} />
              <rect x={queryX} y={queryY} width={qW} height={qH} rx={16} fill={P.card} stroke={P.hairline} strokeWidth={1.5} />
              {/* Chat tail */}
              <polygon points={`${queryX + 24},${queryY + qH} ${queryX + 16},${queryY + qH + 14} ${queryX + 40},${queryY + qH}`} fill={P.card} stroke={P.hairline} strokeWidth={1.2} />
              {/* User avatar */}
              <circle cx={queryX + 32} cy={queryY + 32} r={16} fill={P.blueLight} stroke={P.blue} strokeWidth={1} strokeOpacity={0.3} />
              <text x={queryX + 32} y={queryY + 33} textAnchor="middle" dominantBaseline="central" fill={P.blue} fontSize={16} fontWeight={700}>U</text>
              <text x={queryX + 56} y={queryY + 36} fill={P.textMid} fontSize={14} fontWeight={600}>User asks:</text>
              <text x={queryX + 24} y={queryY + 72} fill={P.text} fontSize={20} fontWeight={500}>"What is the refund</text>
              <text x={queryX + 24} y={queryY + 98} fill={P.text} fontSize={20} fontWeight={500}>policy for annual plans?"</text>

              {/* Embed indicator below */}
              {pQEmb > 0.1 && (() => {
                const ep = snappySpring(frame, fps, beat('show-query-embedding'));
                return (
                  <g style={{ opacity: ep }}>
                    <rect x={queryX + 24} y={queryY + qH + 24} width={qW - 48} height={36} rx={8} fill={P.purpleLight} stroke={P.purple} strokeWidth={1} strokeOpacity={0.3} />
                    <text x={queryX + qW / 2} y={queryY + qH + 45} textAnchor="middle" fill={P.purple} fontSize={14} fontFamily="monospace" fontWeight={500}>[0.21, -0.39, 0.85, 0.02, ...]</text>
                  </g>
                );
              })()}
            </g>
          );
        })()}
      </g>

      {/* Arrow to similarity */}
      {pSim > 0.05 && (
        <Arrow x1={queryX + 328} y1={queryY + 80} x2={simX - 10} y2={simY + 160}
          label="compare" color={P.brand} enterAt={beat('show-similarity')} />
      )}

      {/* Similarity scores — large, readable */}
      <g style={{ opacity: pSim }}>
        <text x={simX} y={simY} fill={P.textLight} fontSize={14} fontWeight={700} letterSpacing={1}>COSINE SIMILARITY</text>
        {[
          { l: '§1 Overview', s: '0.61' },
          { l: '§2 Eligibility', s: '0.54' },
          { l: '§3 Annual plans', s: '0.78' },
          { l: '§4.2 Refund calculation', s: '0.94', best: true },
          { l: '§5 Exceptions', s: '0.42' },
        ].map((sc, i) => {
          const sp = snappySpring(frame, fps, beat('show-similarity') + 4 + i * 4);
          const ry = simY + 16 + i * 56;
          const isBest = (sc as any).best;
          return (
            <g key={i} style={{ opacity: sp }}>
              <rect x={simX} y={ry} width={300} height={44} rx={8}
                fill={isBest ? P.greenLight : P.card} stroke={isBest ? P.green : P.hairline} strokeWidth={isBest ? 2 : 1} />
              {isBest && <rect x={simX} y={ry} width={5} height={44} rx={2.5} fill={P.green} />}
              <text x={simX + 16} y={ry + 26} fill={isBest ? P.green : P.textMid} fontSize={16} fontWeight={isBest ? 600 : 400} fontFamily="monospace">{sc.l}</text>
              <text x={simX + 280} y={ry + 26} textAnchor="end" fill={isBest ? P.green : P.textLight} fontSize={20} fontWeight={isBest ? 700 : 400} fontFamily="monospace">{sc.s}</text>
            </g>
          );
        })}
      </g>

      {/* Arrow to matches */}
      {pMatch > 0.05 && (
        <Arrow x1={simX + 308} y1={simY + 160} x2={matchX - 10} y2={simY + 160}
          label="top-3" color={P.green} enterAt={beat('show-top-matches')} />
      )}

      {/* Top matches */}
      <g style={{ opacity: pMatch }}>
        <text x={matchX} y={simY} fill={P.green} fontSize={14} fontWeight={700} letterSpacing={1}>TOP MATCHES</text>
        {[
          { n: '§4.2', t: 'Refund calculation', s: '0.94', hl: true },
          { n: '§3', t: 'Annual plans', s: '0.78' },
          { n: '§1', t: 'Overview', s: '0.61' },
        ].map((m, i) => {
          const mp = bouncySpring(frame, fps, beat('show-top-matches') + i * 6);
          const ry = simY + 16 + i * 80;
          const isHL = (m as any).hl;
          return (
            <g key={i} style={{ opacity: mp }}>
              <rect x={matchX} y={ry} width={grid.x(0.96) - matchX} height={64} rx={10}
                fill={isHL ? P.greenLight : P.card} stroke={isHL ? P.green : P.hairline} strokeWidth={isHL ? 2 : 1} />
              {isHL && <rect x={matchX} y={ry} width={5} height={64} rx={2.5} fill={P.green} />}
              <text x={matchX + 16} y={ry + 24} fill={isHL ? P.green : P.textMid} fontSize={18} fontWeight={700}>{m.n}</text>
              <text x={matchX + 16} y={ry + 48} fill={P.textLight} fontSize={14}>{m.t}</text>
              <text x={matchX + grid.x(0.96) - matchX - 16} y={ry + 36} textAnchor="end" fill={isHL ? P.green : P.textLight} fontSize={20} fontFamily="monospace" fontWeight={isHL ? 700 : 400}>{m.s}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

// ══════════════════════════════
// VIEW 4: LLM → Answer
// ══════════════════════════════

const View4: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { beat, frame, fps } = useScene('rag-basics');
  const pLLM = entranceSpring(frame, fps, beat('show-llm'));
  const pAns = entranceSpring(frame, fps, beat('show-answer'));

  const llmX = grid.x(0.04);
  const llmY = grid.y(0.14);
  const llmW = 500;
  const llmH = 480;

  const ansX = grid.x(0.58);
  const ansY = grid.y(0.2);
  const ansW = grid.x(0.96) - ansX;

  return (
    <g style={{ opacity }}>
      <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={P.textLight}
        fontSize={18} fontWeight={500} letterSpacing={2}>STEP 4</text>
      <text x={grid.center().x} y={grid.y(0.04) + 30} textAnchor="middle" fill={P.text}
        fontSize={36} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
        LLM reads chunks, writes answer
      </text>

      {/* LLM block — large, showing internals */}
      <g style={{ opacity: pLLM }}>
        {(() => {
          const ty = interpolate(pLLM, [0, 1], [16, 0], { extrapolateRight: 'clamp' });
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={llmX - 8} y={llmY - 8} width={llmW + 16} height={llmH + 16} rx={20} fill={P.textMid} fillOpacity={0.02} />
              <rect x={llmX} y={llmY} width={llmW} height={llmH} rx={14} fill={P.card} stroke={P.textMid} strokeWidth={2} strokeOpacity={0.3} />
              <rect x={llmX} y={llmY} width={llmW} height={8} rx={4} fill={P.textMid} fillOpacity={0.12} />

              <text x={llmX + llmW / 2} y={llmY + 36} textAnchor="middle" fill={P.textMid} fontSize={20} fontWeight={700} letterSpacing={1}>LARGE LANGUAGE MODEL</text>

              {/* Context section — chunks fed in */}
              <text x={llmX + 24} y={llmY + 68} fill={P.textLight} fontSize={14} fontWeight={600}>CONTEXT (retrieved chunks)</text>
              {[
                { n: '§4.2', t: 'Pro-rated refund minus two months of service used. Annual plan holders...', hl: true },
                { n: '§3', t: 'Annual subscriptions are billed upfront for the full year period...' },
                { n: '§1', t: 'All purchases are subject to our refund terms and conditions...' },
              ].map((chunk, i) => {
                const cp = snappySpring(frame, fps, beat('show-llm') + 6 + i * 5);
                const cy = llmY + 80 + i * 68;
                return (
                  <g key={i} style={{ opacity: cp }}>
                    <rect x={llmX + 20} y={cy} width={llmW - 40} height={56} rx={8}
                      fill={chunk.hl ? P.greenLight : P.bg} stroke={chunk.hl ? P.green : P.hairline} strokeWidth={chunk.hl ? 1.5 : 0.8} />
                    <text x={llmX + 32} y={cy + 20} fill={chunk.hl ? P.green : P.textMid} fontSize={15} fontWeight={700}>{chunk.n}</text>
                    <text x={llmX + 32} y={cy + 42} fill={P.textLight} fontSize={13}>{chunk.t.slice(0, 55)}...</text>
                  </g>
                );
              })}

              {/* Processing indicator */}
              <text x={llmX + llmW / 2} y={llmY + 306} textAnchor="middle" fill={P.textLight} fontSize={24}>↓</text>

              {/* Question + Generate area */}
              <text x={llmX + 24} y={llmY + 340} fill={P.textLight} fontSize={14} fontWeight={600}>QUESTION + CONTEXT → GENERATES</text>
              <rect x={llmX + 20} y={llmY + 352} width={llmW - 40} height={100} rx={8} fill={P.bg} stroke={P.hairline} strokeWidth={0.8} />

              {/* Animated text generation */}
              {(() => {
                const genDelay = beat('show-llm') + 24;
                const gp = gentleSpring(frame, fps, genDelay);
                const fullText = '"Pro-rated refund minus two months of service used.';
                const visibleChars = Math.floor(gp * fullText.length);
                return (
                  <g style={{ opacity: gp > 0.01 ? 1 : 0 }}>
                    <text x={llmX + 36} y={llmY + 386} fill={P.text} fontSize={18} fontWeight={500}>{fullText.slice(0, visibleChars)}</text>
                    <text x={llmX + 36} y={llmY + 414} fill={P.text} fontSize={18} fontWeight={500}>
                      {visibleChars > fullText.length - 10 ? 'Based on Section 4.2 of the Refund Policy."' : ''}
                    </text>
                    {/* Blinking cursor */}
                    {visibleChars < fullText.length && (
                      <rect x={llmX + 36 + visibleChars * 9.5} y={llmY + 370} width={2} height={20} rx={1} fill={P.text}
                        fillOpacity={Math.sin(frame * 0.3) > 0 ? 0.8 : 0} />
                    )}
                  </g>
                );
              })()}
            </g>
          );
        })()}
      </g>

      {/* Arrow to answer */}
      {pAns > 0.05 && (
        <Arrow x1={llmX + llmW + 10} y1={llmY + llmH / 2} x2={ansX - 10} y2={ansY + 120}
          color={P.green} enterAt={beat('show-answer')} />
      )}

      {/* Answer card — large, prominent */}
      <g style={{ opacity: pAns }}>
        {(() => {
          const scale = interpolate(bouncySpring(frame, fps, beat('show-answer')), [0, 1], [0.9, 1], { extrapolateRight: 'clamp' });
          return (
            <g style={{ transform: `scale(${scale})`, transformOrigin: `${ansX + ansW / 2}px ${ansY + 120}px` }}>
              {/* Glow */}
              <rect x={ansX - 12} y={ansY - 12} width={ansW + 24} height={264} rx={20} fill={P.green} fillOpacity={0.04} />
              {/* Card */}
              <rect x={ansX} y={ansY} width={ansW} height={240} rx={14} fill={P.greenLight} stroke={P.green} strokeWidth={2} strokeOpacity={0.4} />
              <rect x={ansX} y={ansY} width={6} height={240} rx={3} fill={P.green} fillOpacity={0.6} />

              <text x={ansX + 24} y={ansY + 30} fill={P.green} fontSize={14} fontWeight={700} letterSpacing={1}>ANSWER</text>

              <text x={ansX + 24} y={ansY + 68} fill={P.text} fontSize={22} fontWeight={500}>"Pro-rated refund</text>
              <text x={ansX + 24} y={ansY + 98} fill={P.text} fontSize={22} fontWeight={500}>minus two months of</text>
              <text x={ansX + 24} y={ansY + 128} fill={P.text} fontSize={22} fontWeight={500}>service used."</text>

              <line x1={ansX + 24} y1={ansY + 150} x2={ansX + ansW - 24} y2={ansY + 150} stroke={P.green} strokeWidth={0.8} strokeOpacity={0.3} />

              <text x={ansX + 24} y={ansY + 176} fill={P.textLight} fontSize={14} fontFamily="monospace">source: §4.2 Refund Policy</text>
              <text x={ansX + 24} y={ansY + 200} fill={P.textLight} fontSize={14} fontFamily="monospace">confidence: grounded</text>

              {/* Checkmark */}
              <circle cx={ansX + ansW - 40} cy={ansY + 40} r={18} fill={P.green} fillOpacity={0.1} stroke={P.green} strokeWidth={1.5} />
              <polyline points={`${ansX + ansW - 48},${ansY + 40} ${ansX + ansW - 42},${ansY + 47} ${ansX + ansW - 32},${ansY + 33}`}
                fill="none" stroke={P.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })()}
      </g>
    </g>
  );
};

// ══════════════════════════════
// VIEW 5: Zoomed-out full pipeline
// ══════════════════════════════

const View5: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { beat, frame, fps } = useScene('rag-basics');
  const pSummary = entranceSpring(frame, fps, beat('show-summary'));

  const stageW = 170;
  const stageH = 180;
  const gapW = 24;
  const stageCount = 8;
  const totalW = stageCount * stageW + (stageCount - 1) * gapW;
  const startX = grid.center().x - totalW / 2;
  const pipeY = grid.y(0.18);
  const dividerAfter = 3;

  return (
    <g style={{ opacity }}>
      <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={P.textLight}
        fontSize={18} fontWeight={500} letterSpacing={2}>THE FULL PICTURE</text>
      <text x={grid.center().x} y={grid.y(0.04) + 34} textAnchor="middle" fill={P.text}
        fontSize={36} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
        Document in, answer out
      </text>

      {/* Lane labels */}
      <g style={{ opacity: pSummary }}>
        {(() => {
          const ingestEnd = startX + 4 * (stageW + gapW) - gapW / 2;
          const queryStart = ingestEnd + gapW;
          return (
            <g>
              <rect x={startX - 6} y={pipeY - 28} width={ingestEnd - startX + 12} height={20} rx={4} fill={P.brand} fillOpacity={0.06} stroke={P.brand} strokeWidth={0.5} strokeOpacity={0.2} />
              <text x={startX + (ingestEnd - startX) / 2} y={pipeY - 17} textAnchor="middle" dominantBaseline="central" fill={P.brand} fontSize={10} fontWeight={700} letterSpacing={1}>INGEST</text>
              <rect x={queryStart - 6} y={pipeY - 28} width={startX + totalW - queryStart + 12} height={20} rx={4} fill={P.green} fillOpacity={0.06} stroke={P.green} strokeWidth={0.5} strokeOpacity={0.2} />
              <text x={queryStart + (startX + totalW - queryStart) / 2} y={pipeY - 17} textAnchor="middle" dominantBaseline="central" fill={P.green} fontSize={10} fontWeight={700} letterSpacing={1}>QUERY + GENERATE</text>
            </g>
          );
        })()}
      </g>

      {/* 8 stage cards with mini illustrations */}
      {[
        { label: 'Document', color: P.brand, sub: 'Refund Policy',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 14}, ${pipeY + 36})`}>
              <rect x={0} y={0} width={50} height={65} rx={4} fill={P.card} stroke={P.brand} strokeWidth={1} strokeOpacity={0.4} />
              <path d="M 38 0 L 50 12 L 38 12 Z" fill={P.brand} fillOpacity={0.08} />
              <rect x={6} y={8} width={28} height={2.5} rx={1} fill={P.brand} fillOpacity={0.3} />
              {[0,1,2,3,4].map(j => <rect key={j} x={6} y={16+j*9} width={38-j%3*8} height={2} rx={1} fill={P.hairline} />)}
            </g>
          )},
        { label: 'Chunks', color: P.brand, sub: '5 sections',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 14}, ${pipeY + 36})`}>
              {[0,1,2,3,4].map(j => (
                <g key={j}>
                  <rect x={0} y={j*13} width={60} height={11} rx={3} fill={j===3 ? P.greenLight : P.card} stroke={j===3 ? P.green : P.hairline} strokeWidth={j===3 ? 1 : 0.5} />
                  <rect x={0} y={j*13} width={10} height={11} rx={3} fill={j===3 ? P.green : P.stroke} fillOpacity={0.1} />
                  <text x={5} y={j*13+7.5} textAnchor="middle" dominantBaseline="central" fill={P.textLight} fontSize={6} fontWeight={700}>{j+1}</text>
                </g>
              ))}
            </g>
          )},
        { label: 'Embed', color: P.purple, sub: 'text → numbers',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 14}, ${pipeY + 38})`}>
              <rect x={0} y={0} width={56} height={16} rx={3} fill={P.purpleLight} fillOpacity={0.5} stroke={P.purple} strokeWidth={0.5} strokeOpacity={0.2} />
              <text x={4} y={11} fill={P.textLight} fontSize={6} fontFamily="monospace">"refund..."</text>
              <text x={28} y={26} textAnchor="middle" fill={P.purple} fontSize={10}>↓</text>
              <rect x={0} y={32} width={56} height={16} rx={3} fill={P.purple} fillOpacity={0.06} stroke={P.purple} strokeWidth={0.5} strokeOpacity={0.2} />
              <text x={4} y={43} fill={P.purple} fontSize={6} fontFamily="monospace">[0.23, -0.41]</text>
            </g>
          )},
        { label: 'Vector DB', color: P.blue, sub: 'Pinecone',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 30}, ${pipeY + 40})`}>
              <ellipse cx={28} cy={4} rx={28} ry={5} fill="none" stroke={P.blue} strokeWidth={1} strokeOpacity={0.5} />
              <line x1={0} y1={4} x2={0} y2={38} stroke={P.blue} strokeWidth={1} strokeOpacity={0.5} />
              <line x1={56} y1={4} x2={56} y2={38} stroke={P.blue} strokeWidth={1} strokeOpacity={0.5} />
              <ellipse cx={28} cy={38} rx={28} ry={5} fill="none" stroke={P.blue} strokeWidth={1} strokeOpacity={0.5} />
              {[0,1,2].map(j => <rect key={j} x={6} y={12+j*9} width={44} height={5} rx={2} fill={P.blue} fillOpacity={0.08} />)}
            </g>
          )},
        { label: 'Query', color: P.textMid, sub: 'user question',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 14}, ${pipeY + 36})`}>
              <rect x={0} y={0} width={60} height={40} rx={8} fill={P.bg} stroke={P.hairline} strokeWidth={1} />
              <polygon points="10,40 6,48 18,40" fill={P.bg} stroke={P.hairline} strokeWidth={0.8} />
              <circle cx={14} cy={12} r={6} fill={P.blueLight} stroke={P.blue} strokeWidth={0.5} strokeOpacity={0.3} />
              <text x={14} y={13} textAnchor="middle" dominantBaseline="central" fill={P.blue} fontSize={7} fontWeight={700}>U</text>
              <rect x={6} y={24} width={48} height={2} rx={1} fill={P.hairline} />
              <rect x={6} y={30} width={36} height={2} rx={1} fill={P.hairline} />
            </g>
          )},
        { label: 'Match', color: P.green, sub: 'top-3 results',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 14}, ${pipeY + 36})`}>
              {[
                { s: '0.94', hl: true },
                { s: '0.78', hl: false },
                { s: '0.61', hl: false },
              ].map((m, j) => (
                <g key={j}>
                  <rect x={0} y={j*18} width={60} height={14} rx={3} fill={m.hl ? P.greenLight : P.card} stroke={m.hl ? P.green : P.hairline} strokeWidth={m.hl ? 1 : 0.5} />
                  <text x={4} y={j*18+10} fill={m.hl ? P.green : P.textLight} fontSize={7} fontFamily="monospace" fontWeight={m.hl ? 600 : 400}>§{m.hl ? '4.2' : j===1 ? '3' : '1'}</text>
                  <text x={56} y={j*18+10} textAnchor="end" fill={m.hl ? P.green : P.textLight} fontSize={7} fontFamily="monospace">{m.s}</text>
                </g>
              ))}
            </g>
          )},
        { label: 'LLM', color: P.textMid, sub: 'read + answer',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 14}, ${pipeY + 36})`}>
              <rect x={0} y={0} width={60} height={55} rx={4} fill={P.card} stroke={P.textMid} strokeWidth={0.8} strokeOpacity={0.3} />
              <rect x={0} y={0} width={60} height={4} rx={2} fill={P.textMid} fillOpacity={0.1} />
              {[0,1,2].map(j => (
                <rect key={j} x={4} y={10+j*12} width={52} height={8} rx={2} fill={P.greenLight} stroke={P.green} strokeWidth={0.3} strokeOpacity={0.3} />
              ))}
              <text x={30} y={48} textAnchor="middle" fill={P.textLight} fontSize={7}>↓ generates</text>
            </g>
          )},
        { label: 'Answer', color: P.green, sub: 'grounded',
          icon: (sx: number) => (
            <g transform={`translate(${sx + 14}, ${pipeY + 36})`}>
              <rect x={0} y={0} width={60} height={50} rx={6} fill={P.greenLight} stroke={P.green} strokeWidth={1} strokeOpacity={0.3} />
              <rect x={0} y={0} width={3} height={50} rx={1.5} fill={P.green} fillOpacity={0.5} />
              <text x={8} y={12} fill={P.green} fontSize={6} fontWeight={700}>ANSWER</text>
              <rect x={8} y={18} width={44} height={2} rx={1} fill={P.text} fillOpacity={0.2} />
              <rect x={8} y={24} width={38} height={2} rx={1} fill={P.text} fillOpacity={0.2} />
              <rect x={8} y={30} width={42} height={2} rx={1} fill={P.text} fillOpacity={0.2} />
              {/* Checkmark */}
              <circle cx={48} cy={42} r={6} fill={P.green} fillOpacity={0.1} stroke={P.green} strokeWidth={0.8} />
              <polyline points="44,42 47,45 52,39" fill="none" stroke={P.green} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )},
      ].map((s, i) => {
        const sx = startX + i * (stageW + gapW);
        const delay = beat('show-summary') + i * 3;
        const sp = snappySpring(frame, fps, delay);
        return (
          <g key={i} style={{ opacity: sp }}>
            {/* Card */}
            <rect x={sx - 3} y={pipeY - 3} width={stageW + 6} height={stageH + 6} rx={13} fill={s.color} fillOpacity={0.03} />
            <rect x={sx} y={pipeY} width={stageW} height={stageH} rx={10} fill={P.card} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.4} />
            <rect x={sx} y={pipeY} width={4} height={stageH} rx={2} fill={s.color} fillOpacity={0.5} />
            <circle cx={sx + stageW - 16} cy={pipeY + 14} r={10} fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} strokeOpacity={0.3} />
            <text x={sx + stageW - 16} y={pipeY + 15} textAnchor="middle" dominantBaseline="central" fill={s.color} fontSize={10} fontWeight={700}>{i + 1}</text>
            {/* Mini illustration */}
            {s.icon(sx)}
            {/* Label + sub at bottom */}
            <text x={sx + 14} y={pipeY + stageH - 30} fill={P.text} fontSize={15} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{s.label}</text>
            <text x={sx + 14} y={pipeY + stageH - 12} fill={P.textLight} fontSize={12} fontFamily="monospace">{s.sub}</text>
            {/* Arrow to next — perfectly horizontal */}
            {i < stageCount - 1 && (
              <g>
                <line x1={sx + stageW + 3} y1={pipeY + stageH / 2} x2={sx + stageW + gapW - 8} y2={pipeY + stageH / 2}
                  stroke={i === dividerAfter ? P.green : P.stroke} strokeWidth={1.5} strokeLinecap="round"
                  strokeDasharray={i === dividerAfter ? '5 3' : undefined} />
                <polygon points={`${sx + stageW + gapW - 3},${pipeY + stageH / 2} ${sx + stageW + gapW - 9},${pipeY + stageH / 2 - 3.5} ${sx + stageW + gapW - 9},${pipeY + stageH / 2 + 3.5}`}
                  fill={i === dividerAfter ? P.green : P.stroke} />
              </g>
            )}
          </g>
        );
      })}

      {/* Bottom text */}
      <text x={grid.center().x} y={grid.y(0.82)} textAnchor="middle" fill={P.text}
        fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}
        style={{ opacity: pSummary }}>
        Each step is independently improvable
      </text>
      <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={P.textLight}
        fontSize={FONT_SIZE.lg} fontWeight={400} fontFamily={TYPOGRAPHY.body.fontFamily}
        style={{ opacity: pSummary }}>
        The six modules we cover next make each one work better.
      </text>
    </g>
  );
};

// ══════════════════════════════
// MAIN SCENE — orchestrates views
// ══════════════════════════════

export const RagBasicsScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('rag-basics');

  const pTitle = progress('show-title');

  // View transition beats
  const embBeat = beat('show-embedding-model');
  const queryBeat = beat('show-user-query');
  const llmBeat = beat('show-llm');
  const summaryBeat = beat('show-summary');

  // Crossfade between 5 views
  const v1Out = morphSpring(frame, fps, embBeat - 8);
  const v2In = morphSpring(frame, fps, embBeat);
  const v2Out = morphSpring(frame, fps, queryBeat - 8);
  const v3In = morphSpring(frame, fps, queryBeat);
  const v3Out = morphSpring(frame, fps, llmBeat - 8);
  const v4In = morphSpring(frame, fps, llmBeat);
  const summaryProgress = progress('show-summary');
  const v4Out = summaryProgress;
  const v5In = summaryProgress;

  const v1Op = 1 - v1Out;
  const v2Op = v2In * (1 - v2Out);
  const v3Op = v3In * (1 - v3Out);
  const v4Op = v4In * (1 - v4Out);
  const v5Op = v5In;

  return (
    <g>
      <defs>
        <filter id="glow-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <Particles />

      {/* Title bar — fades out on View 5 */}
      <g style={{ opacity: pTitle * (1 - v5Op) }}>
        <text x={grid.center().x} y={grid.y(0.0)} textAnchor="middle" fill={P.text}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          How Basic RAG Works
        </text>
        {(() => {
          const lw = 220;
          const drawn = interpolate(pTitle, [0, 1], [lw, 0], { extrapolateRight: 'clamp' });
          return <line x1={grid.center().x - lw / 2} y1={grid.y(0.0) + 14} x2={grid.center().x + lw / 2} y2={grid.y(0.0) + 14}
            stroke={P.brand} strokeWidth={3} strokeLinecap="round" strokeDasharray={lw} strokeDashoffset={drawn} />;
        })()}
      </g>

      {/* 5 Views — only one visible at a time */}
      <View1 opacity={v1Op} />
      <View2 opacity={v2Op} />
      <View3 opacity={v3Op} />
      <View4 opacity={v4Op} />
      <View5 opacity={v5Op} />
    </g>
  );
};
