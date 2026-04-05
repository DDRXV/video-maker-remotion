import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * Query Construction — Hero: Text-to-SQL
 *
 * Example: "What was Q3 revenue for enterprise?" → LLM parses intent →
 * generates SQL → hits sales DB → result: $2.4M
 *
 * Left-to-right flow with rich detail at every stage.
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const MOD = C.queryConstruction;
const ACCENT = '#92400e'; // amber-800, muted warm accent for highlights

/* ── Data table with column headers and rows ── */
const DataTable: React.FC<{
  x: number; y: number; w: number;
  headers: string[]; rows: string[][]; highlightRows?: number[];
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, headers, rows, highlightRows = [], enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const colW = w / headers.length;
  const rowH = 24;
  const headerH = 28;
  const tableH = headerH + rows.length * rowH + 4;
  return (
    <g style={{ opacity: p }}>
      {/* Table outline */}
      <rect x={x} y={y} width={w} height={tableH} rx={6} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
      {/* Header row */}
      <rect x={x} y={y} width={w} height={headerH} rx={6} fill={SLATE_BG} />
      <rect x={x} y={y + headerH - 6} width={w} height={6} fill={SLATE_BG} />
      {headers.map((h, i) => (
        <text key={i} x={x + i * colW + colW / 2} y={y + headerH / 2 + 1} textAnchor="middle" dominantBaseline="central"
          fill={SLATE} fontSize={12} fontWeight={700} fontFamily="monospace">{h}</text>
      ))}
      {/* Separator */}
      <line x1={x} y1={y + headerH} x2={x + w} y2={y + headerH} stroke={SLATE_LIGHT} strokeWidth={1} />
      {/* Data rows */}
      {rows.map((row, ri) => {
        const ry = y + headerH + ri * rowH + 4;
        const isHL = highlightRows.includes(ri);
        return (
          <g key={ri}>
            {isHL && <rect x={x + 2} y={ry - 2} width={w - 4} height={rowH} rx={3} fill={ACCENT} fillOpacity={0.08} />}
            {row.map((cell, ci) => (
              <text key={ci} x={x + ci * colW + colW / 2} y={ry + rowH / 2 - 2} textAnchor="middle" dominantBaseline="central"
                fill={isHL ? ACCENT : SLATE_MID} fontSize={12} fontWeight={isHL ? 600 : 400} fontFamily="monospace">{cell}</text>
            ))}
          </g>
        );
      })}
      {/* Column separators */}
      {headers.slice(0, -1).map((_, i) => (
        <line key={i} x1={x + (i + 1) * colW} y1={y + 4} x2={x + (i + 1) * colW} y2={y + tableH - 4} stroke={SLATE_LIGHT} strokeWidth={0.5} strokeOpacity={0.5} />
      ))}
    </g>
  );
};

/* ── Code block (monospace with line numbers) ── */
const CodeBlock: React.FC<{
  x: number; y: number; w: number; lines: string[];
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, lines, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const lineH = 20;
  const padY = 10;
  const h = lines.length * lineH + padY * 2;
  return (
    <g style={{ opacity: p }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#1e293b" />
      {/* Line number gutter */}
      <rect x={x} y={y} width={28} height={h} rx={6} fill="#0f172a" />
      <rect x={x + 22} y={y} width={6} height={h} fill="#0f172a" />
      {lines.map((line, i) => (
        <g key={i}>
          <text x={x + 14} y={y + padY + i * lineH + 14} textAnchor="middle" fill="#475569" fontSize={11} fontFamily="monospace">{i + 1}</text>
          <text x={x + 36} y={y + padY + i * lineH + 14} fill="#e2e8f0" fontSize={12} fontFamily="monospace">{line}</text>
        </g>
      ))}
    </g>
  );
};

/* ── Intent extraction tag ── */
const IntentTag: React.FC<{
  x: number; y: number; label: string; value: string;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, label, value, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const labelW = label.length * 8 + 12;
  const valueW = value.length * 8 + 16;
  return (
    <g style={{ opacity: p }}>
      <rect x={x} y={y} width={labelW} height={22} rx={4} fill={SLATE} />
      <text x={x + labelW / 2} y={y + 12} textAnchor="middle" dominantBaseline="central" fill={C.white} fontSize={11} fontWeight={600} fontFamily="monospace">{label}</text>
      <rect x={x + labelW} y={y} width={valueW} height={22} rx={4} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
      <text x={x + labelW + valueW / 2} y={y + 12} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={11} fontWeight={500} fontFamily="monospace">{value}</text>
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
      <text x={cx} y={y + 13} fill={SLATE_MID} fontSize={FONT_SIZE.xs} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>Also worth knowing:</text>
      {(() => { cx += 160; return null; })()}
      {items.map((item, i) => {
        const pw = item.length * 9 + 28;
        const px = cx;
        cx += pw + 10;
        return (
          <g key={item}>
            <rect x={px} y={y} width={pw} height={26} rx={13} fill={MOD} fillOpacity={0.08} stroke={MOD} strokeWidth={1} strokeOpacity={0.3} />
            <text x={px + pw / 2} y={y + 14} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={12} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>{item}</text>
          </g>
        );
      })}
    </g>
  );
};

/* ── Main scene ── */
export const QueryConstructionScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('query-construction');

  const pTitle = progress('show-title');
  const pQuestion = progress('show-question');
  const pParser = progress('show-parser');
  const pSQL = progress('show-sql');
  const pDatabase = progress('show-database');
  const pResult = progress('show-result');
  const pOthers = progress('show-others');
  const pSummary = progress('show-summary');

  // Layout zones
  const questionX = grid.x(0.02);
  const questionY = grid.y(0.16);
  const parserX = grid.x(0.02);
  const parserY = grid.y(0.34);
  const sqlX = grid.x(0.02);
  const sqlY = grid.y(0.54);
  const tableX = grid.x(0.48);
  const tableY = grid.y(0.16);
  const resultX = grid.x(0.48);
  const resultY = grid.y(0.62);

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.03)} cy={grid.y(0.03)} r={18} fill={MOD} fillOpacity={0.12} stroke={MOD} strokeWidth={1.5} />
        <text x={grid.x(0.03)} y={grid.y(0.03)} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={FONT_SIZE.md} fontWeight={700}>1</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03)} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Query Construction</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03) + 28} dominantBaseline="central" fill={SLATE_MID} fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.body.fontFamily}>Text-to-SQL</text>
      </g>

      {/* ── Question bubble ── */}
      <g style={{ opacity: pQuestion }}>
        {(() => {
          const tx = interpolate(pQuestion, [0, 1], [-20, 0], { extrapolateRight: 'clamp' });
          return (
            <g style={{ transform: `translateX(${tx}px)` }}>
              <rect x={questionX} y={questionY} width={grid.x(0.42)} height={50} rx={10} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.2} />
              <text x={questionX + 16} y={questionY + 20} fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>USER QUESTION</text>
              <text x={questionX + 16} y={questionY + 40} fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={500} fontFamily={TYPOGRAPHY.body.fontFamily}>"What was Q3 revenue for enterprise?"</text>
            </g>
          );
        })()}
      </g>

      {/* ── Arrow from question to parser ── */}
      {pParser > 0.05 && (
        <g style={{ opacity: pParser }}>
          <line x1={questionX + grid.x(0.21)} y1={questionY + 50} x2={questionX + grid.x(0.21)} y2={parserY - 6} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinecap="round" />
          <polygon points={`${questionX + grid.x(0.21)},${parserY} ${questionX + grid.x(0.21) - 5},${parserY - 8} ${questionX + grid.x(0.21) + 5},${parserY - 8}`} fill={SLATE_LIGHT} />
        </g>
      )}

      {/* ── LLM Parser box with intent extraction ── */}
      <g style={{ opacity: pParser }}>
        {(() => {
          const pw = grid.x(0.42);
          const ph = 110;
          const ty = interpolate(pParser, [0, 1], [12, 0], { extrapolateRight: 'clamp' });
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={parserX} y={parserY} width={pw} height={ph} rx={8} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
              <rect x={parserX} y={parserY} width={4} height={ph} rx={2} fill={MOD} fillOpacity={0.5} />
              <text x={parserX + 16} y={parserY + 18} fill={MOD} fontSize={12} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>LLM PARSER</text>
              <text x={parserX + 100} y={parserY + 18} fill={SLATE_MID} fontSize={11} fontFamily="monospace">intent extraction</text>

              {/* Intent tags */}
              <IntentTag x={parserX + 16} y={parserY + 32} label="metric" value="revenue" enterAt={beat('show-parser') + 4} frame={frame} fps={fps} />
              <IntentTag x={parserX + 16} y={parserY + 58} label="period" value="Q3 2024" enterAt={beat('show-parser') + 8} frame={frame} fps={fps} />
              <IntentTag x={parserX + 16} y={parserY + 84} label="segment" value="enterprise" enterAt={beat('show-parser') + 12} frame={frame} fps={fps} />

              {/* Right side: arrow indicator */}
              <text x={parserX + pw - 20} y={parserY + ph / 2} textAnchor="end" dominantBaseline="central" fill={SLATE_LIGHT} fontSize={20}>↓</text>
            </g>
          );
        })()}
      </g>

      {/* ── Arrow from parser to SQL ── */}
      {pSQL > 0.05 && (
        <g style={{ opacity: pSQL }}>
          <line x1={questionX + grid.x(0.21)} y1={parserY + 110} x2={questionX + grid.x(0.21)} y2={sqlY - 6} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinecap="round" />
          <polygon points={`${questionX + grid.x(0.21)},${sqlY} ${questionX + grid.x(0.21) - 5},${sqlY - 8} ${questionX + grid.x(0.21) + 5},${sqlY - 8}`} fill={SLATE_LIGHT} />
        </g>
      )}

      {/* ── Generated SQL code block ── */}
      <g style={{ opacity: pSQL }}>
        <text x={sqlX + 4} y={sqlY - 6} fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>GENERATED SQL</text>
        <CodeBlock x={sqlX} y={sqlY} w={grid.x(0.42)}
          lines={[
            'SELECT SUM(amount)',
            '  FROM sales',
            "  WHERE quarter = 'Q3-2024'",
            "  AND segment = 'enterprise'",
          ]}
          enterAt={beat('show-sql')} frame={frame} fps={fps} />
      </g>

      {/* ── Arrow from SQL to database (horizontal) ── */}
      {pDatabase > 0.05 && (
        <g style={{ opacity: pDatabase }}>
          <line x1={grid.x(0.44) + 4} y1={sqlY + 50} x2={tableX - 8} y2={tableY + 60} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 3" />
        </g>
      )}

      {/* ── Sales database table ── */}
      <g style={{ opacity: pDatabase }}>
        <text x={tableX + 4} y={tableY - 6} fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>SALES DATABASE</text>
        <DataTable x={tableX} y={tableY} w={grid.x(0.48)}
          headers={['date', 'segment', 'amount', 'quarter']}
          rows={[
            ['2024-07-15', 'enterprise', '$890K', 'Q3-2024'],
            ['2024-08-02', 'startup', '$120K', 'Q3-2024'],
            ['2024-08-19', 'enterprise', '$1.1M', 'Q3-2024'],
            ['2024-09-03', 'mid-market', '$340K', 'Q3-2024'],
            ['2024-09-28', 'enterprise', '$410K', 'Q3-2024'],
          ]}
          highlightRows={[0, 2, 4]}
          enterAt={beat('show-database')} frame={frame} fps={fps} />
      </g>

      {/* ── Result card ── */}
      <g style={{ opacity: pResult }}>
        {(() => {
          const ty = interpolate(pResult, [0, 1], [10, 0], { extrapolateRight: 'clamp' });
          const rw = grid.x(0.48);
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={resultX} y={resultY} width={rw} height={80} rx={8} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
              <rect x={resultX} y={resultY} width={4} height={80} rx={2} fill="#166534" fillOpacity={0.5} />
              <text x={resultX + 16} y={resultY + 18} fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>QUERY RESULT</text>
              <text x={resultX + 16} y={resultY + 48} fill={SLATE} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>$2.4M</text>
              <text x={resultX + 120} y={resultY + 48} fill={SLATE_MID} fontSize={FONT_SIZE.sm} fontFamily="monospace">3 rows matched</text>
              <text x={resultX + 16} y={resultY + 70} fill={SLATE_MID} fontSize={11} fontFamily="monospace">Q3-2024 enterprise revenue</text>
            </g>
          );
        })()}
      </g>

      {/* ── Others strip ── */}
      <OthersPills x={grid.x(0.02)} y={grid.y(0.84)} items={['Text-to-Cypher', 'Self-Query Retrievers']}
        enterAt={beat('show-others')} frame={frame} fps={fps} />

      {/* ── Summary ── */}
      <TextBox
        x={grid.x(0.02)} y={grid.y(0.92)} maxWidth={grid.x(0.96)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={SLATE_MID}
        enterAt={beat('show-summary')} align="left"
      >
        Not all data lives in a vector store. Query construction turns questions into the right query for the right database.
      </TextBox>
    </g>
  );
};
