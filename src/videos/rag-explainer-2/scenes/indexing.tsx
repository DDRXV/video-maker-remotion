import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * Indexing — Hero: Chunk Optimization (before/after)
 *
 * Same "Refund Policy" document, same search query.
 * Left: one big chunk → sim 0.61 (vague match)
 * Right: paragraph chunks → sim 0.94 (exact match)
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const MOD = C.indexing;
const WRONG = '#991b1b';
const WRONG_BG = '#fef2f2';
const RIGHT = '#166534';
const RIGHT_BG = '#f0fdf4';

/* ── Document visualization with text lines ── */
const DocVis: React.FC<{
  x: number; y: number; w: number; h: number;
  chunkBorders?: number[]; // y-offsets where chunk splits occur
  highlightChunk?: number; // which chunk index to highlight
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, chunkBorders = [], highlightChunk, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const lineCount = 16;
  const lineGap = (h - 24) / lineCount;

  // Calculate chunk regions
  const allBorders = [0, ...chunkBorders.map(b => b), h];
  const chunks = allBorders.slice(0, -1).map((start, i) => ({
    y: y + start,
    h: allBorders[i + 1] - start,
  }));

  return (
    <g style={{ opacity: p }}>
      {/* Page */}
      <rect x={x} y={y} width={w} height={h} rx={6} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
      {/* Title bar */}
      <rect x={x + 8} y={y + 8} width={w * 0.6} height={4} rx={2} fill={SLATE_MID} fillOpacity={0.3} />
      {/* Text lines */}
      {Array.from({ length: lineCount }).map((_, i) => (
        <rect key={i} x={x + 8} y={y + 20 + i * lineGap} width={w - 16 - (i % 4) * 10} height={3} rx={1.5} fill={SLATE_LIGHT} fillOpacity={0.6} />
      ))}
      {/* Chunk borders */}
      {chunkBorders.map((border, i) => (
        <line key={i} x1={x - 4} y1={y + border} x2={x + w + 4} y2={y + border} stroke={MOD} strokeWidth={1} strokeDasharray="4 3" />
      ))}
      {/* Highlight chunk */}
      {highlightChunk !== undefined && chunks[highlightChunk] && (
        <rect x={x - 2} y={chunks[highlightChunk].y} width={w + 4} height={chunks[highlightChunk].h}
          rx={4} fill={RIGHT} fillOpacity={0.06} stroke={RIGHT} strokeWidth={1.5} strokeOpacity={0.4} />
      )}
    </g>
  );
};

/* ── Score badge ── */
const ScoreBadge: React.FC<{
  x: number; y: number; score: string; label: string;
  color: string; bgColor: string;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, score, label, color, bgColor, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [8, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={180} height={54} rx={8} fill={bgColor} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
      <rect x={x} y={y} width={4} height={54} rx={2} fill={color} fillOpacity={0.5} />
      <text x={x + 16} y={y + 14} fill={SLATE_MID} fontSize={10} fontWeight={600}>SIMILARITY</text>
      <text x={x + 16} y={y + 38} fill={color} fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily="monospace">{score}</text>
      <text x={x + 80} y={y + 38} dominantBaseline="central" fill={color} fontSize={12} fontWeight={500}>{label}</text>
    </g>
  );
};

/* ── Others pill strip ── */
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

export const IndexingScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('indexing');

  const pTitle = progress('show-title');
  const pDoc = progress('show-document');
  const pBig = progress('show-big-chunk');
  const pBigSearch = progress('show-big-search');
  const pSmall = progress('show-small-chunks');
  const pSmallSearch = progress('show-small-search');
  const pCompare = progress('show-comparison');
  const pOthers = progress('show-others');

  // Layout: two halves
  const leftX = grid.x(0.02);
  const rightX = grid.x(0.52);
  const halfW = grid.x(0.44);
  const docW = 180;
  const docH = 280;
  const docY = grid.y(0.2);

  // Dim left when right appears
  const leftOpacity = pSmall > 0.05 ? (pCompare > 0.05 ? 0.7 : 0.4) : 1;
  const rightOpacity = pSmall > 0.05 ? 1 : 0;

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.03)} cy={grid.y(0.03)} r={18} fill={MOD} fillOpacity={0.12} stroke={MOD} strokeWidth={1.5} />
        <text x={grid.x(0.03)} y={grid.y(0.03)} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={FONT_SIZE.md} fontWeight={700}>4</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03)} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Indexing</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03) + 28} dominantBaseline="central" fill={SLATE_MID} fontSize={FONT_SIZE.sm}>Chunk Optimization</text>
      </g>

      {/* Search query (shared) */}
      <g style={{ opacity: pBigSearch > 0.05 ? 1 : 0 }}>
        <rect x={grid.x(0.28)} y={grid.y(0.11)} width={grid.x(0.44)} height={34} rx={17} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
        <text x={grid.center().x} y={grid.y(0.11) + 18} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={500}>Search: "annual plan refund"</text>
      </g>

      {/* ── LEFT: Too large ── */}
      <g style={{ opacity: leftOpacity }}>
        <text x={leftX + halfW / 2} y={docY - 8} textAnchor="middle" fill={WRONG} fontSize={FONT_SIZE.sm} fontWeight={600} style={{ opacity: pBig }}>Too large</text>

        {/* Single chunk doc */}
        <DocVis x={leftX + halfW / 2 - docW / 2} y={docY} w={docW} h={docH}
          enterAt={beat('show-document')} frame={frame} fps={fps} />

        {/* Chunk label */}
        {pBig > 0.05 && (
          <g style={{ opacity: pBig }}>
            <rect x={leftX + halfW / 2 + docW / 2 + 12} y={docY + 10} width={130} height={24} rx={6} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
            <text x={leftX + halfW / 2 + docW / 2 + 77} y={docY + 23} textAnchor="middle" dominantBaseline="central" fill={SLATE_MID} fontSize={11} fontFamily="monospace">chunk: 2000 tok</text>
            <text x={leftX + halfW / 2 + docW / 2 + 77} y={docY + 46} textAnchor="middle" fill={SLATE_MID} fontSize={10}>entire page = 1 chunk</text>
          </g>
        )}

        {/* Score */}
        <ScoreBadge x={leftX + halfW / 2 - 90} y={docY + docH + 20}
          score="0.61" label="vague match" color={WRONG} bgColor={WRONG_BG}
          enterAt={beat('show-big-search')} frame={frame} fps={fps} />
      </g>

      {/* ── VS divider ── */}
      {pSmall > 0.05 && (
        <g style={{ opacity: pSmall }}>
          <line x1={grid.center().x} y1={docY - 16} x2={grid.center().x} y2={docY + docH + 80} stroke={SLATE_LIGHT} strokeWidth={1} strokeDasharray="4 3" />
          <rect x={grid.center().x - 18} y={grid.center().y - 14} width={36} height={28} rx={14} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
          <text x={grid.center().x} y={grid.center().y} textAnchor="middle" dominantBaseline="central" fill={SLATE_MID} fontSize={12} fontWeight={700}>vs</text>
        </g>
      )}

      {/* ── RIGHT: Right-sized ── */}
      <g style={{ opacity: rightOpacity }}>
        <text x={rightX + halfW / 2} y={docY - 8} textAnchor="middle" fill={RIGHT} fontSize={FONT_SIZE.sm} fontWeight={600} style={{ opacity: pSmall }}>Right-sized</text>

        {/* Chunked doc */}
        <DocVis x={rightX + halfW / 2 - docW / 2} y={docY} w={docW} h={docH}
          chunkBorders={[56, 112, 168, 224]}
          highlightChunk={2}
          enterAt={beat('show-small-chunks')} frame={frame} fps={fps} />

        {/* Chunk label */}
        {pSmall > 0.05 && (
          <g style={{ opacity: pSmall }}>
            <rect x={rightX + halfW / 2 + docW / 2 + 12} y={docY + 10} width={130} height={24} rx={6} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
            <text x={rightX + halfW / 2 + docW / 2 + 77} y={docY + 23} textAnchor="middle" dominantBaseline="central" fill={SLATE_MID} fontSize={11} fontFamily="monospace">chunk: 300 tok</text>
            <text x={rightX + halfW / 2 + docW / 2 + 77} y={docY + 46} textAnchor="middle" fill={SLATE_MID} fontSize={10}>5 paragraph chunks</text>
            {/* Arrow pointing to highlighted chunk */}
            <line x1={rightX + halfW / 2 + docW / 2 + 12} y1={docY + 140}
              x2={rightX + halfW / 2 + docW / 2 + 4} y2={docY + 140}
              stroke={RIGHT} strokeWidth={1.5} strokeLinecap="round" />
            <text x={rightX + halfW / 2 + docW / 2 + 16} y={docY + 136} fill={RIGHT} fontSize={10} fontWeight={600}>§ 4.2</text>
          </g>
        )}

        {/* Score */}
        <ScoreBadge x={rightX + halfW / 2 - 90} y={docY + docH + 20}
          score="0.94" label="exact match" color={RIGHT} bgColor={RIGHT_BG}
          enterAt={beat('show-small-search')} frame={frame} fps={fps} />
      </g>

      {/* Others strip */}
      <OthersPills x={grid.x(0.02)} y={grid.y(0.84)} items={['Multi-Representation', 'Specialized Embeddings', 'RAPTOR']}
        enterAt={beat('show-others')} frame={frame} fps={fps} />

      {/* Summary */}
      <TextBox
        x={grid.x(0.02)} y={grid.y(0.92)} maxWidth={grid.x(0.96)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={SLATE_MID}
        enterAt={beat('show-summary')} align="left"
      >
        Same document, same question. The only difference is chunk size.
      </TextBox>
    </g>
  );
};
