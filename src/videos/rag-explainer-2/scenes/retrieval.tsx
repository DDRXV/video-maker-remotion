import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * Retrieval — Hero: Re-ranking (before/after)
 *
 * 5 search results reordered: cancel-policy jumps from #4 to #1.
 * Two columns with crossover lines showing the swap.
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const MOD = C.retrieval;
const RIGHT = '#166534';
const ACCENT = '#92400e';

interface DocResult {
  file: string;
  snippet: string;
  score: string;
}

const beforeResults: DocResult[] = [
  { file: 'pricing-tiers.md', snippet: 'Enterprise plans start at...', score: '0.89' },
  { file: 'billing-faq.md', snippet: 'To update payment method...', score: '0.87' },
  { file: 'support-guide.md', snippet: 'Contact enterprise support...', score: '0.85' },
  { file: 'cancel-policy.md', snippet: 'To cancel, submit a request...', score: '0.83' },
  { file: 'onboarding.md', snippet: 'Enterprise setup requires...', score: '0.81' },
];

const afterOrder = [3, 1, 2, 0, 4]; // cancel-policy jumps to #1

/* ── Result card ── */
const ResultCard: React.FC<{
  x: number; y: number; w: number;
  rank: number; doc: DocResult;
  highlighted?: boolean;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, rank, doc, highlighted, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [8, 0], { extrapolateRight: 'clamp' });
  const border = highlighted ? RIGHT : SLATE_LIGHT;
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={w} height={56} rx={6} fill={highlighted ? '#f0fdf4' : C.white} stroke={border} strokeWidth={highlighted ? 1.5 : 1} />
      {/* Rank number */}
      <circle cx={x + 22} cy={y + 28} r={13} fill={highlighted ? RIGHT : SLATE_BG} fillOpacity={highlighted ? 0.15 : 1} stroke={highlighted ? RIGHT : SLATE_LIGHT} strokeWidth={1} />
      <text x={x + 22} y={y + 29} textAnchor="middle" dominantBaseline="central" fill={highlighted ? RIGHT : SLATE} fontSize={12} fontWeight={700}>#{rank}</text>
      {/* File name */}
      <text x={x + 44} y={y + 18} fill={highlighted ? RIGHT : SLATE} fontSize={12} fontWeight={600} fontFamily="monospace">{doc.file}</text>
      {/* Snippet */}
      <text x={x + 44} y={y + 36} fill={SLATE_MID} fontSize={11} fontWeight={400}>{doc.snippet}</text>
      {/* Score */}
      <text x={x + w - 12} y={y + 28} textAnchor="end" dominantBaseline="central" fill={SLATE_MID} fontSize={11} fontFamily="monospace">{doc.score}</text>
    </g>
  );
};

/* ── Others pills ── */
const OthersPills: React.FC<{
  x: number; y: number; items: string[];
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, items, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  let cx = x;
  return (
    <g style={{ opacity: p }}>
      <text x={cx} y={y + 13} fill={SLATE_MID} fontSize={FONT_SIZE.xs} fontWeight={500}>Also worth knowing:</text>
      {(() => { cx += 160; return null; })()}
      {items.map((item) => {
        const pw = item.length * 8 + 28;
        const px = cx;
        cx += pw + 10;
        return (
          <g key={item}>
            <rect x={px} y={y} width={pw} height={26} rx={13} fill={MOD} fillOpacity={0.06} stroke={MOD} strokeWidth={1} strokeOpacity={0.3} />
            <text x={px + pw / 2} y={y + 14} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={12} fontWeight={500}>{item}</text>
          </g>
        );
      })}
    </g>
  );
};

export const RetrievalScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('retrieval');

  const pTitle = progress('show-title');
  const pQuestion = progress('show-question');
  const pBefore = progress('show-before');
  const pReranker = progress('show-reranker');
  const pAfter = progress('show-after');
  const pInsight = progress('show-insight');
  const pOthers = progress('show-others');

  // Layout
  const leftX = grid.x(0.02);
  const rightX = grid.x(0.52);
  const colW = grid.x(0.44);
  const cardH = 56;
  const cardGap = 8;
  const listStartY = grid.y(0.22);

  // Dim left when right appears
  const leftOpacity = pAfter > 0.05 ? 0.4 : 1;

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.03)} cy={grid.y(0.03)} r={18} fill={MOD} fillOpacity={0.12} stroke={MOD} strokeWidth={1.5} />
        <text x={grid.x(0.03)} y={grid.y(0.03)} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={FONT_SIZE.md} fontWeight={700}>5</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03)} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Retrieval</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03) + 28} dominantBaseline="central" fill={SLATE_MID} fontSize={FONT_SIZE.sm}>Re-ranking</text>
      </g>

      {/* Search query */}
      <g style={{ opacity: pQuestion }}>
        <rect x={grid.x(0.15)} y={grid.y(0.11)} width={grid.x(0.7)} height={38} rx={19} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
        <text x={grid.center().x} y={grid.y(0.11) + 20} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={500}>"How to cancel an enterprise subscription"</text>
      </g>

      {/* Column headers */}
      <g style={{ opacity: pBefore }}>
        <text x={leftX + colW / 2} y={listStartY - 10} textAnchor="middle" fill={SLATE_MID} fontSize={12} fontWeight={700}>VECTOR SEARCH RESULTS</text>
      </g>
      <g style={{ opacity: pAfter }}>
        <text x={rightX + colW / 2} y={listStartY - 10} textAnchor="middle" fill={RIGHT} fontSize={12} fontWeight={700}>AFTER RE-RANKING</text>
      </g>

      {/* LEFT: Before re-ranking */}
      <g style={{ opacity: leftOpacity }}>
        {beforeResults.map((doc, i) => (
          <ResultCard key={i} x={leftX} y={listStartY + i * (cardH + cardGap)} w={colW}
            rank={i + 1} doc={doc} highlighted={i === 3}
            enterAt={beat('show-before') + i * 4} frame={frame} fps={fps} />
        ))}
      </g>

      {/* Re-ranker arrow between columns */}
      {pReranker > 0.05 && (
        <g style={{ opacity: pReranker }}>
          <rect x={grid.center().x - 40} y={grid.center().y - 18} width={80} height={36} rx={8} fill={C.white} stroke={MOD} strokeWidth={1.5} />
          <text x={grid.center().x} y={grid.center().y} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={12} fontWeight={700}>RE-RANK</text>
        </g>
      )}

      {/* RIGHT: After re-ranking */}
      {afterOrder.map((origIdx, newIdx) => {
        const doc = beforeResults[origIdx];
        const isHL = origIdx === 3; // cancel-policy
        return (
          <ResultCard key={`after-${newIdx}`} x={rightX} y={listStartY + newIdx * (cardH + cardGap)} w={colW}
            rank={newIdx + 1} doc={doc} highlighted={isHL}
            enterAt={beat('show-after') + newIdx * 4} frame={frame} fps={fps} />
        );
      })}

      {/* Crossover lines showing #4 → #1 and #1 → #4 */}
      {pAfter > 0.05 && (
        <g style={{ opacity: pAfter * 0.3 }}>
          {/* cancel-policy: left #4 → right #1 */}
          <line
            x1={leftX + colW} y1={listStartY + 3 * (cardH + cardGap) + cardH / 2}
            x2={rightX} y2={listStartY + 0 * (cardH + cardGap) + cardH / 2}
            stroke={RIGHT} strokeWidth={1.5} strokeLinecap="round" />
          {/* pricing: left #1 → right #4 */}
          <line
            x1={leftX + colW} y1={listStartY + 0 * (cardH + cardGap) + cardH / 2}
            x2={rightX} y2={listStartY + 3 * (cardH + cardGap) + cardH / 2}
            stroke={SLATE_LIGHT} strokeWidth={1} strokeLinecap="round" />
        </g>
      )}

      {/* Insight callout */}
      <g style={{ opacity: pInsight }}>
        {(() => {
          const iy = listStartY + 5 * (cardH + cardGap) + 8;
          const ty = interpolate(pInsight, [0, 1], [8, 0], { extrapolateRight: 'clamp' });
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={rightX} y={iy} width={colW} height={36} rx={8} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
              <text x={rightX + colW / 2} y={iy + 19} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={12} fontWeight={500}>vector similarity ≠ actual relevance</text>
            </g>
          );
        })()}
      </g>

      {/* Others strip */}
      <OthersPills x={grid.x(0.02)} y={grid.y(0.84)} items={['CRAG', 'Active Retrieval']}
        enterAt={beat('show-others')} frame={frame} fps={fps} />

      {/* Summary */}
      <TextBox
        x={grid.x(0.02)} y={grid.y(0.92)} maxWidth={grid.x(0.96)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={SLATE_MID}
        enterAt={beat('show-summary')} align="left"
      >
        Same documents, better ordering. That's the difference between finding a result and finding the right result.
      </TextBox>
    </g>
  );
};
