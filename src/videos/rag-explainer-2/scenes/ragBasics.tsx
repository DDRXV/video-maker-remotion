import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * RAG Basics — How basic RAG works, for a business audience.
 *
 * Two horizontal lanes:
 *   TOP (Ingest): Document → split into chunks → embedding model → vectors → stored in vector DB
 *   BOTTOM (Query): User question → embedding → compare → top matches → LLM → answer
 *
 * Everything shows REAL DATA — actual text snippets, actual numbers, actual flow.
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const BLUE = '#2563eb';
const BLUE_BG = '#eff6ff';
const GREEN = '#166534';
const GREEN_BG = '#f0fdf4';
const PURPLE = '#7c3aed';
const PURPLE_BG = '#f5f3ff';

/* ── Document page with visible text ── */
const DocPage: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; textLines: string[];
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, title, textLines, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [10, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x + 1} y={y + 1} width={w} height={h} rx={6} fill={SLATE} fillOpacity={0.03} />
      <rect x={x} y={y} width={w} height={h} rx={6} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
      {/* Corner fold */}
      <path d={`M ${x + w - 14} ${y} L ${x + w} ${y + 14} L ${x + w - 14} ${y + 14} Z`} fill={SLATE_LIGHT} fillOpacity={0.3} />
      {/* Title */}
      <text x={x + 10} y={y + 18} fill={SLATE} fontSize={11} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{title}</text>
      <line x1={x + 8} y1={y + 24} x2={x + w - 8} y2={y + 24} stroke={SLATE_LIGHT} strokeWidth={0.8} />
      {/* Readable text lines */}
      {textLines.map((line, i) => (
        <text key={i} x={x + 10} y={y + 38 + i * 16} fill={SLATE_MID} fontSize={10} fontFamily={TYPOGRAPHY.body.fontFamily}>{line}</text>
      ))}
    </g>
  );
};

/* ── Chunk card — a piece of text with a number ── */
const ChunkCard: React.FC<{
  x: number; y: number; w: number; h: number;
  num: number; text: string; highlighted?: boolean;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, num, text, highlighted, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const tx = interpolate(p, [0, 1], [12, 0]);
  const border = highlighted ? GREEN : SLATE_LIGHT;
  const bg = highlighted ? GREEN_BG : C.white;
  return (
    <g style={{ opacity: p, transform: `translateX(${tx}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={bg} stroke={border} strokeWidth={highlighted ? 1.5 : 1} />
      {/* Chunk number */}
      <circle cx={x + 14} cy={y + 14} r={9} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={0.8} />
      <text x={x + 14} y={y + 15} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={9} fontWeight={700}>{num}</text>
      {/* Text snippet */}
      <text x={x + 28} y={y + 16} fill={SLATE_MID} fontSize={9} fontFamily={TYPOGRAPHY.body.fontFamily}>{text}</text>
      {/* Fake text lines below */}
      <rect x={x + 6} y={y + 26} width={w - 12} height={2} rx={1} fill={SLATE_LIGHT} fillOpacity={0.5} />
      {h > 40 && <rect x={x + 6} y={y + 32} width={w - 20} height={2} rx={1} fill={SLATE_LIGHT} fillOpacity={0.4} />}
    </g>
  );
};

/* ── Embedding vector — shows actual numbers ── */
const EmbeddingVector: React.FC<{
  x: number; y: number; values: string;
  color?: string; enterAt: number; frame: number; fps: number;
}> = ({ x, y, values, color = PURPLE, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  return (
    <g style={{ opacity: p }}>
      <rect x={x} y={y} width={values.length * 6.5 + 16} height={22} rx={4} fill={color} fillOpacity={0.06} stroke={color} strokeWidth={0.8} strokeOpacity={0.3} />
      <text x={x + 8} y={y + 13} dominantBaseline="central" fill={color} fontSize={10} fontFamily="monospace" fontWeight={500}>{values}</text>
    </g>
  );
};

/* ── Arrow with optional label ── */
const FlowArrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  label?: string; color?: string; dashed?: boolean;
  enterAt: number; frame: number; fps: number;
}> = ({ x1, y1, x2, y2, label, color = SLATE_LIGHT, dashed, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const isHoriz = Math.abs(y2 - y1) < 10;
  return (
    <g style={{ opacity: p * 0.7 }}>
      <line x1={x1} y1={y1} x2={isHoriz ? x2 - 8 : x2} y2={isHoriz ? y2 : y2 - 8}
        stroke={color} strokeWidth={1.5} strokeLinecap="round"
        strokeDasharray={dashed ? '4 3' : undefined} />
      {isHoriz ? (
        <polygon points={`${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`} fill={color} />
      ) : (
        <polygon points={`${x2},${y2} ${x2 - 4},${y2 - 7} ${x2 + 4},${y2 - 7}`} fill={color} />
      )}
      {label && (
        <text x={(x1 + x2) / 2} y={isHoriz ? y1 - 8 : (y1 + y2) / 2 - 6}
          textAnchor="middle" fill={SLATE_MID} fontSize={9} fontWeight={500} fontFamily="monospace">{label}</text>
      )}
    </g>
  );
};

/* ── Process box ── */
const ProcessBox: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; sublabel?: string;
  accentColor?: string; accentBg?: string;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, label, sublabel, accentColor = SLATE_MID, accentBg, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [8, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={accentBg || C.white} stroke={accentColor} strokeWidth={1.2} strokeOpacity={0.4} />
      <rect x={x} y={y} width={4} height={h} rx={2} fill={accentColor} fillOpacity={0.5} />
      <text x={x + w / 2} y={y + (sublabel ? h / 2 - 6 : h / 2 + 1)} textAnchor="middle" dominantBaseline="central"
        fill={accentColor} fontSize={12} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" dominantBaseline="central"
          fill={SLATE_MID} fontSize={10} fontFamily="monospace">{sublabel}</text>
      )}
    </g>
  );
};

/* ── Vector DB cylinder with embedding rows ── */
const VectorDB: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; rows: { chunk: string; vec: string }[];
  highlightRow?: number;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, label, rows, highlightRow, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [10, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      {/* Cylinder */}
      <ellipse cx={x + w / 2} cy={y + 10} rx={w / 2} ry={10} fill={SLATE_BG} stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.5} />
      <rect x={x} y={y + 10} width={w} height={h - 20} fill={C.white} stroke="none" />
      <line x1={x} y1={y + 10} x2={x} y2={y + h - 10} stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.5} />
      <line x1={x + w} y1={y + 10} x2={x + w} y2={y + h - 10} stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.5} />
      <ellipse cx={x + w / 2} cy={y + h - 10} rx={w / 2} ry={10} fill={SLATE_BG} stroke={BLUE} strokeWidth={1.5} strokeOpacity={0.5} />

      {/* Column headers */}
      <text x={x + 12} y={y + 28} fill={SLATE_MID} fontSize={8} fontWeight={700} fontFamily="monospace">chunk</text>
      <text x={x + 70} y={y + 28} fill={SLATE_MID} fontSize={8} fontWeight={700} fontFamily="monospace">embedding</text>

      {/* Data rows */}
      {rows.map((row, i) => {
        const ry = y + 38 + i * 20;
        const isHL = highlightRow === i;
        return (
          <g key={i}>
            {isHL && <rect x={x + 4} y={ry - 4} width={w - 8} height={18} rx={3} fill={GREEN} fillOpacity={0.08} />}
            <text x={x + 12} y={ry + 8} fill={isHL ? GREEN : SLATE_MID} fontSize={9} fontFamily="monospace" fontWeight={isHL ? 600 : 400}>{row.chunk}</text>
            <text x={x + 70} y={ry + 8} fill={isHL ? GREEN : SLATE_LIGHT} fontSize={9} fontFamily="monospace">{row.vec}</text>
          </g>
        );
      })}

      {/* Label */}
      <text x={x + w / 2} y={y + h + 14} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
    </g>
  );
};

/* ── Similarity comparison visual ── */
const SimilarityCompare: React.FC<{
  x: number; y: number;
  queryVec: string; storedVecs: { label: string; score: string; best?: boolean }[];
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, queryVec, storedVecs, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  return (
    <g style={{ opacity: p }}>
      {/* Query vector */}
      <text x={x} y={y - 4} fill={SLATE_MID} fontSize={9} fontWeight={600}>QUERY VECTOR</text>
      <rect x={x} y={y} width={160} height={20} rx={4} fill={PURPLE} fillOpacity={0.06} stroke={PURPLE} strokeWidth={0.8} strokeOpacity={0.3} />
      <text x={x + 8} y={y + 12} dominantBaseline="central" fill={PURPLE} fontSize={9} fontFamily="monospace">{queryVec}</text>

      {/* Comparison lines to stored vectors */}
      {storedVecs.map((sv, i) => {
        const sy = y + 36 + i * 26;
        const sp = entranceSpring(frame, fps, enterAt + 4 + i * 4);
        const color = sv.best ? GREEN : SLATE_MID;
        return (
          <g key={i} style={{ opacity: sp }}>
            <line x1={x + 80} y1={y + 20} x2={x + 20} y2={sy} stroke={SLATE_LIGHT} strokeWidth={0.8} strokeDasharray="2 2" />
            <rect x={x} y={sy} width={120} height={20} rx={4} fill={sv.best ? GREEN_BG : SLATE_BG} stroke={sv.best ? GREEN : SLATE_LIGHT} strokeWidth={sv.best ? 1 : 0.8} />
            <text x={x + 6} y={sy + 12} dominantBaseline="central" fill={color} fontSize={9} fontFamily="monospace">{sv.label}</text>
            {/* Score */}
            <text x={x + 130} y={sy + 12} dominantBaseline="central" fill={color} fontSize={10} fontWeight={sv.best ? 700 : 400} fontFamily="monospace">{sv.score}</text>
          </g>
        );
      })}
    </g>
  );
};

/* ── Main scene ── */
export const RagBasicsScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('rag-basics');

  const pTitle = progress('show-title');
  const pDoc = progress('show-document');
  const pChunks = progress('show-chunks');
  const pEmbModel = progress('show-embedding-model');
  const pVectors = progress('show-vectors');
  const pVectorDB = progress('show-vector-db');
  const pUserQuery = progress('show-user-query');
  const pQueryEmb = progress('show-query-embedding');
  const pSimilarity = progress('show-similarity');
  const pMatches = progress('show-top-matches');
  const pLLM = progress('show-llm');
  const pAnswer = progress('show-answer');

  // Layout: Two lanes
  const laneLabel = 60;
  const topLaneY = grid.y(0.12);
  const bottomLaneY = grid.y(0.56);

  // Ingest lane positions
  const docX = grid.x(0.0);
  const chunksX = grid.x(0.16);
  const embModelX = grid.x(0.42);
  const vectorsX = grid.x(0.56);
  const dbX = grid.x(0.72);

  // Query lane positions
  const queryX = grid.x(0.0);
  const qEmbX = grid.x(0.16);
  const simX = grid.x(0.34);
  const matchX = grid.x(0.56);
  const llmX = grid.x(0.72);
  const answerX = grid.x(0.88);

  const chunks = [
    { num: 1, text: 'Section 1: Overview...' },
    { num: 2, text: 'Section 2: Eligibility...' },
    { num: 3, text: 'Section 3: Annual plans...' },
    { num: 4, text: 'Section 4.2: Refund calc...' },
    { num: 5, text: 'Section 5: Exceptions...' },
  ];

  const chunkH = 42;
  const chunkW = 170;
  const chunkGap = 4;

  // Dim ingest lane when query lane appears
  const ingestOpacity = pUserQuery > 0.05 ? 0.3 : 1;

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.03)} textAnchor="middle" fill={SLATE}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          How Basic RAG Works
        </text>
      </g>

      {/* ═══ TOP LANE: Ingest ═══ */}
      <g style={{ opacity: ingestOpacity }}>
        {/* Lane label */}
        <g style={{ opacity: pDoc }}>
          <rect x={grid.x(0.0)} y={topLaneY - 24} width={70} height={20} rx={4} fill={BLUE_BG} stroke={BLUE} strokeWidth={0.8} strokeOpacity={0.3} />
          <text x={grid.x(0.0) + 35} y={topLaneY - 13} textAnchor="middle" dominantBaseline="central" fill={BLUE} fontSize={10} fontWeight={700}>INGEST</text>
        </g>

        {/* 1. Document */}
        <DocPage x={docX} y={topLaneY} w={120} h={230}
          title="Refund Policy"
          textLines={[
            'Section 1: Overview',
            'All purchases are subject',
            'to our refund terms...',
            '',
            'Section 2: Eligibility',
            'Monthly plans may be...',
            '',
            'Section 3: Annual plans',
            'Annual subscriptions are...',
            '',
            'Section 4.2: Refund calc',
            'Pro-rated refund minus...',
          ]}
          enterAt={beat('show-document')} frame={frame} fps={fps} />

        {/* Scissors / split indicator */}
        {pChunks > 0.05 && (
          <FlowArrow x1={docX + 124} y1={topLaneY + 115} x2={chunksX - 4} y2={topLaneY + 115}
            label="split" enterAt={beat('show-chunks')} frame={frame} fps={fps} />
        )}

        {/* 2. Chunks */}
        {chunks.map((c, i) => (
          <ChunkCard key={i} x={chunksX} y={topLaneY + i * (chunkH + chunkGap)} w={chunkW} h={chunkH}
            num={c.num} text={c.text} highlighted={i === 3}
            enterAt={beat('show-chunks') + i * 3} frame={frame} fps={fps} />
        ))}

        {/* Arrow to embedding model */}
        {pEmbModel > 0.05 && (
          <FlowArrow x1={chunksX + chunkW + 4} y1={topLaneY + 115} x2={embModelX - 4} y2={topLaneY + 115}
            enterAt={beat('show-embedding-model')} frame={frame} fps={fps} />
        )}

        {/* 3. Embedding Model */}
        <ProcessBox x={embModelX} y={topLaneY + 60} w={110} h={110}
          label="Embedding" sublabel="text → numbers"
          accentColor={PURPLE} accentBg={PURPLE_BG}
          enterAt={beat('show-embedding-model')} frame={frame} fps={fps} />

        {/* Show what happens inside: text becoming numbers */}
        {(() => {
          const ip = entranceSpring(frame, fps, beat('show-embedding-model') + 8);
          return (
            <g style={{ opacity: ip }}>
              <text x={embModelX + 14} y={topLaneY + 110} fill={SLATE_MID} fontSize={9} fontFamily="monospace">"Refund calc..."</text>
              <text x={embModelX + 55} y={topLaneY + 124} textAnchor="middle" fill={PURPLE} fontSize={10}>↓</text>
              <text x={embModelX + 14} y={topLaneY + 140} fill={PURPLE} fontSize={9} fontFamily="monospace">[0.23, -0.41, ...]</text>
            </g>
          );
        })()}

        {/* Arrow to vectors */}
        {pVectors > 0.05 && (
          <FlowArrow x1={embModelX + 114} y1={topLaneY + 115} x2={vectorsX - 4} y2={topLaneY + 115}
            enterAt={beat('show-vectors')} frame={frame} fps={fps} />
        )}

        {/* 4. Vectors */}
        {pVectors > 0.05 && (
          <g>
            {chunks.map((c, i) => {
              const vecs = ['[0.82, 0.11, -0.34, ...]', '[0.45, -0.67, 0.23, ...]', '[-0.12, 0.91, 0.55, ...]', '[0.23, -0.41, 0.87, ...]', '[0.67, 0.33, -0.15, ...]'];
              return (
                <EmbeddingVector key={i}
                  x={vectorsX} y={topLaneY + i * (chunkH + chunkGap) + 10}
                  values={vecs[i]} color={i === 3 ? GREEN : PURPLE}
                  enterAt={beat('show-vectors') + i * 2} frame={frame} fps={fps} />
              );
            })}
          </g>
        )}

        {/* Arrow to vector DB */}
        {pVectorDB > 0.05 && (
          <FlowArrow x1={vectorsX + 158} y1={topLaneY + 115} x2={dbX - 4} y2={topLaneY + 115}
            label="store" enterAt={beat('show-vector-db')} frame={frame} fps={fps} />
        )}

        {/* 5. Vector DB */}
        <VectorDB x={dbX} y={topLaneY} w={grid.x(0.96) - dbX} h={230}
          label="Pinecone / Chroma"
          rows={[
            { chunk: '§1', vec: '[0.82, 0.11, ...]' },
            { chunk: '§2', vec: '[0.45, -0.67, ...]' },
            { chunk: '§3', vec: '[-0.12, 0.91, ...]' },
            { chunk: '§4.2', vec: '[0.23, -0.41, ...]' },
            { chunk: '§5', vec: '[0.67, 0.33, ...]' },
          ]}
          highlightRow={pMatches > 0.05 ? 3 : undefined}
          enterAt={beat('show-vector-db')} frame={frame} fps={fps} />
      </g>

      {/* ═══ BOTTOM LANE: Query ═══ */}

      {/* Lane label */}
      <g style={{ opacity: pUserQuery }}>
        <rect x={grid.x(0.0)} y={bottomLaneY - 24} width={70} height={20} rx={4} fill={GREEN_BG} stroke={GREEN} strokeWidth={0.8} strokeOpacity={0.3} />
        <text x={grid.x(0.0) + 35} y={bottomLaneY - 13} textAnchor="middle" dominantBaseline="central" fill={GREEN} fontSize={10} fontWeight={700}>QUERY</text>
      </g>

      {/* 6. User question */}
      <g style={{ opacity: pUserQuery }}>
        {(() => {
          const ty = interpolate(pUserQuery, [0, 1], [10, 0]);
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={queryX} y={bottomLaneY} width={grid.x(0.14)} height={70} rx={8} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.2} />
              {/* User avatar */}
              <circle cx={queryX + 20} cy={bottomLaneY + 18} r={10} fill={BLUE_BG} stroke={BLUE} strokeWidth={0.8} strokeOpacity={0.3} />
              <text x={queryX + 20} y={bottomLaneY + 19} textAnchor="middle" dominantBaseline="central" fill={BLUE} fontSize={10} fontWeight={700}>U</text>
              <text x={queryX + 36} y={bottomLaneY + 20} fill={SLATE_MID} fontSize={9} fontWeight={600}>USER</text>
              <text x={queryX + 8} y={bottomLaneY + 42} fill={SLATE} fontSize={10} fontWeight={500}>"What is the refund</text>
              <text x={queryX + 8} y={bottomLaneY + 56} fill={SLATE} fontSize={10} fontWeight={500}>policy for annual plans?"</text>
            </g>
          );
        })()}
      </g>

      {/* Arrow to embedding */}
      {pQueryEmb > 0.05 && (
        <FlowArrow x1={queryX + grid.x(0.14) + 4} y1={bottomLaneY + 35} x2={qEmbX - 4} y2={bottomLaneY + 35}
          enterAt={beat('show-query-embedding')} frame={frame} fps={fps} />
      )}

      {/* 7. Query embedding */}
      <ProcessBox x={qEmbX} y={bottomLaneY + 4} w={grid.x(0.15)} h={62}
        label="Embed Query" sublabel="same model"
        accentColor={PURPLE} accentBg={PURPLE_BG}
        enterAt={beat('show-query-embedding')} frame={frame} fps={fps} />

      {pQueryEmb > 0.05 && (() => {
        const ep = entranceSpring(frame, fps, beat('show-query-embedding') + 8);
        return (
          <g style={{ opacity: ep }}>
            <EmbeddingVector x={qEmbX + 8} y={bottomLaneY + 46} values="[0.21, -0.39, 0.85, ...]" color={PURPLE}
              enterAt={beat('show-query-embedding') + 8} frame={frame} fps={fps} />
          </g>
        );
      })()}

      {/* Arrow to similarity */}
      {pSimilarity > 0.05 && (
        <FlowArrow x1={qEmbX + grid.x(0.15) + 4} y1={bottomLaneY + 35} x2={simX - 4} y2={bottomLaneY + 35}
          label="compare" enterAt={beat('show-similarity')} frame={frame} fps={fps} />
      )}

      {/* 8. Similarity comparison */}
      {pSimilarity > 0.05 && (
        <SimilarityCompare x={simX} y={bottomLaneY}
          queryVec="[0.21, -0.39, 0.85, ...]"
          storedVecs={[
            { label: '§1 overview', score: '0.61' },
            { label: '§2 eligibility', score: '0.54' },
            { label: '§3 annual', score: '0.78' },
            { label: '§4.2 refund', score: '0.94', best: true },
            { label: '§5 exceptions', score: '0.42' },
          ]}
          enterAt={beat('show-similarity')} frame={frame} fps={fps} />
      )}

      {/* Arrow to matches */}
      {pMatches > 0.05 && (
        <FlowArrow x1={simX + 170} y1={bottomLaneY + 35} x2={matchX - 4} y2={bottomLaneY + 35}
          label="top-3" enterAt={beat('show-top-matches')} frame={frame} fps={fps} />
      )}

      {/* 9. Top matches */}
      {pMatches > 0.05 && (
        <g>
          {[
            { num: 4, text: '§4.2 Refund calculation', score: '0.94' },
            { num: 3, text: '§3 Annual plan terms', score: '0.78' },
            { num: 1, text: '§1 Policy overview', score: '0.61' },
          ].map((m, i) => {
            const mp = entranceSpring(frame, fps, beat('show-top-matches') + i * 4);
            return (
              <g key={i} style={{ opacity: mp }}>
                <ChunkCard x={matchX} y={bottomLaneY + i * 48} w={grid.x(0.14)} h={42}
                  num={m.num} text={m.text} highlighted={i === 0}
                  enterAt={beat('show-top-matches') + i * 4} frame={frame} fps={fps} />
              </g>
            );
          })}
        </g>
      )}

      {/* Arrow to LLM */}
      {pLLM > 0.05 && (
        <FlowArrow x1={matchX + grid.x(0.14) + 4} y1={bottomLaneY + 35} x2={llmX - 4} y2={bottomLaneY + 35}
          enterAt={beat('show-llm')} frame={frame} fps={fps} />
      )}

      {/* 10. LLM */}
      <ProcessBox x={llmX} y={bottomLaneY + 4} w={grid.x(0.14)} h={130}
        label="LLM" sublabel="read chunks + answer"
        accentColor={SLATE} accentBg={SLATE_BG}
        enterAt={beat('show-llm')} frame={frame} fps={fps} />

      {/* Inside LLM: show it reading chunks */}
      {(() => {
        const lp = entranceSpring(frame, fps, beat('show-llm') + 8);
        return (
          <g style={{ opacity: lp }}>
            <text x={llmX + 14} y={bottomLaneY + 60} fill={SLATE_MID} fontSize={9}>reads §4.2 + §3 + §1</text>
            <text x={llmX + grid.x(0.07)} y={bottomLaneY + 78} textAnchor="middle" fill={SLATE} fontSize={12}>↓</text>
            <text x={llmX + 14} y={bottomLaneY + 96} fill={SLATE_MID} fontSize={9}>synthesizes answer</text>
            <rect x={llmX + 8} y={bottomLaneY + 104} width={grid.x(0.14) - 16} height={20} rx={4} fill={GREEN_BG} stroke={GREEN} strokeWidth={0.8} strokeOpacity={0.3} />
            <text x={llmX + 14} y={bottomLaneY + 116} fill={GREEN} fontSize={9} fontFamily="monospace" fontWeight={500}>generating...</text>
          </g>
        );
      })()}

      {/* Arrow to answer */}
      {pAnswer > 0.05 && (
        <FlowArrow x1={llmX + grid.x(0.14) + 4} y1={bottomLaneY + 35} x2={answerX - 4} y2={bottomLaneY + 35}
          enterAt={beat('show-answer')} frame={frame} fps={fps} />
      )}

      {/* 11. Answer */}
      <g style={{ opacity: pAnswer }}>
        {(() => {
          const ty = interpolate(pAnswer, [0, 1], [10, 0]);
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={answerX} y={bottomLaneY} width={grid.x(0.96) - answerX} height={100} rx={8}
                fill={GREEN_BG} stroke={GREEN} strokeWidth={1.2} strokeOpacity={0.3} />
              <rect x={answerX} y={bottomLaneY} width={4} height={100} rx={2} fill={GREEN} fillOpacity={0.5} />
              <text x={answerX + 14} y={bottomLaneY + 16} fill={GREEN} fontSize={10} fontWeight={700}>ANSWER</text>
              <text x={answerX + 14} y={bottomLaneY + 38} fill={SLATE} fontSize={12} fontWeight={500}>"Pro-rated refund</text>
              <text x={answerX + 14} y={bottomLaneY + 56} fill={SLATE} fontSize={12} fontWeight={500}>minus 2 months of</text>
              <text x={answerX + 14} y={bottomLaneY + 74} fill={SLATE} fontSize={12} fontWeight={500}>service used."</text>
              <text x={answerX + 14} y={bottomLaneY + 92} fill={SLATE_MID} fontSize={9} fontFamily="monospace">source: §4.2</text>
            </g>
          );
        })()}
      </g>

      {/* Summary */}
      <TextBox
        x={grid.x(0.02)} y={grid.y(0.92)} maxWidth={grid.x(0.96)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={SLATE_MID}
        enterAt={beat('show-summary')} align="center"
      >
        That's basic RAG. The six modules we cover next make each of these steps work better.
      </TextBox>
    </g>
  );
};
