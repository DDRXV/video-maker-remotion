import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * Query Translation — Hero: Multi-Query
 *
 * "How does authentication work?" (vague) →
 * LLM generates 3 specific versions →
 * each retrieves a different doc →
 * combined results = better coverage
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const MOD = C.queryTranslation;

/* ── Document mini-page ── */
const DocPage: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; lines: number;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, title, lines, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [8, 0]);
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x + 1} y={y + 1} width={w} height={h} rx={4} fill={SLATE} fillOpacity={0.03} />
      <rect x={x} y={y} width={w} height={h} rx={4} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1} />
      <path d={`M ${x + w - 10} ${y} L ${x + w} ${y + 10} L ${x + w - 10} ${y + 10} Z`} fill={SLATE_LIGHT} fillOpacity={0.3} />
      <rect x={x + 6} y={y + 6} width={w * 0.5} height={3} rx={1.5} fill={SLATE_MID} fillOpacity={0.4} />
      {Array.from({ length: lines }).map((_, i) => (
        <rect key={i} x={x + 6} y={y + 14 + i * 7} width={w - 12 - (i % 3) * 8} height={2.5} rx={1} fill={SLATE_LIGHT} fillOpacity={0.7} />
      ))}
      <text x={x + w / 2} y={y + h + 13} textAnchor="middle" fill={SLATE_MID} fontSize={10} fontWeight={500} fontFamily="monospace">{title}</text>
    </g>
  );
};

/* ── Query version card ── */
const QueryVersion: React.FC<{
  x: number; y: number; w: number;
  num: number; text: string;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, num, text, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const tx = interpolate(p, [0, 1], [20, 0]);
  return (
    <g style={{ opacity: p, transform: `translateX(${tx}px)` }}>
      <rect x={x} y={y} width={w} height={50} rx={8} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
      <circle cx={x + 22} cy={y + 25} r={12} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
      <text x={x + 22} y={y + 26} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={12} fontWeight={700}>{num}</text>
      <text x={x + 42} y={y + 26} dominantBaseline="central" fill={SLATE} fontSize={13} fontWeight={400} fontFamily={TYPOGRAPHY.body.fontFamily}>{text}</text>
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

export const QueryTranslationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('query-translation');

  const pTitle = progress('show-title');
  const pVague = progress('show-vague-question');
  const pRephraser = progress('show-rephraser');
  const pVersions = progress('show-versions');
  const pDocs = progress('show-retrieved-docs');
  const pCombined = progress('show-combined');
  const pOthers = progress('show-others');

  // Layout
  const leftX = grid.x(0.02);
  const centerX = grid.x(0.28);
  const rightX = grid.x(0.68);
  const queryW = grid.x(0.38);
  const docW = 80;
  const docH = 64;

  const versions = [
    { text: '"What auth protocols does the API support?"', doc: 'api-auth.md' },
    { text: '"How do users log in and get session tokens?"', doc: 'login-flow.md' },
    { text: '"What is the OAuth 2.0 flow for third-party apps?"', doc: 'oauth-setup.md' },
  ];

  const versionY = (i: number) => grid.y(0.24) + i * 74;

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.03)} cy={grid.y(0.03)} r={18} fill={MOD} fillOpacity={0.12} stroke={MOD} strokeWidth={1.5} />
        <text x={grid.x(0.03)} y={grid.y(0.03)} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={FONT_SIZE.md} fontWeight={700}>2</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03)} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Query Translation</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03) + 28} dominantBaseline="central" fill={SLATE_MID} fontSize={FONT_SIZE.sm}>Multi-Query</text>
      </g>

      {/* Vague question */}
      <g style={{ opacity: pVague }}>
        <rect x={leftX} y={grid.y(0.14)} width={grid.x(0.22)} height={54} rx={10} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.2} />
        <text x={leftX + 12} y={grid.y(0.14) + 16} fill={SLATE_MID} fontSize={10} fontWeight={600}>USER QUESTION</text>
        <text x={leftX + 12} y={grid.y(0.14) + 36} fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={500}>"How does authentication work?"</text>
        {/* Vague label */}
        <rect x={leftX + grid.x(0.22) - 52} y={grid.y(0.14) - 10} width={48} height={20} rx={10} fill={'#fef3c7'} stroke={'#d97706'} strokeWidth={1} strokeOpacity={0.4} />
        <text x={leftX + grid.x(0.22) - 28} y={grid.y(0.14)} textAnchor="middle" dominantBaseline="central" fill={'#92400e'} fontSize={10} fontWeight={600}>vague</text>
      </g>

      {/* Rephraser box */}
      <g style={{ opacity: pRephraser }}>
        {(() => {
          const bx = leftX;
          const by = grid.y(0.14) + 70;
          const bw = grid.x(0.22);
          const bh = 40;
          return (
            <g>
              <line x1={leftX + bw / 2} y1={grid.y(0.14) + 54} x2={leftX + bw / 2} y2={by - 2} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinecap="round" />
              <rect x={bx} y={by} width={bw} height={bh} rx={8} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
              <rect x={bx} y={by} width={4} height={bh} rx={2} fill={MOD} fillOpacity={0.5} />
              <text x={bx + 16} y={by + bh / 2 + 1} dominantBaseline="central" fill={MOD} fontSize={12} fontWeight={700}>LLM REPHRASE</text>
              <text x={bx + bw - 12} y={by + bh / 2 + 1} textAnchor="end" dominantBaseline="central" fill={SLATE_MID} fontSize={11} fontFamily="monospace">→ 3 versions</text>
            </g>
          );
        })()}
      </g>

      {/* Three query versions */}
      {versions.map((v, i) => (
        <g key={i}>
          {/* Connection line from rephraser to version */}
          {pVersions > 0.05 && (
            <g style={{ opacity: pVersions * 0.4 }}>
              <line x1={leftX + grid.x(0.22)} y1={grid.y(0.14) + 90 + 20}
                x2={centerX} y2={versionY(i) + 25}
                stroke={SLATE_LIGHT} strokeWidth={1} strokeLinecap="round" />
            </g>
          )}

          <QueryVersion x={centerX} y={versionY(i)} w={queryW}
            num={i + 1} text={v.text}
            enterAt={beat('show-versions') + i * 8} frame={frame} fps={fps} />

          {/* Connection to doc */}
          {pDocs > 0.05 && (
            <g style={{ opacity: entranceSpring(frame, fps, beat('show-retrieved-docs') + i * 6) * 0.4 }}>
              <line x1={centerX + queryW} y1={versionY(i) + 25}
                x2={rightX} y2={versionY(i) + 25}
                stroke={SLATE_LIGHT} strokeWidth={1} strokeDasharray="4 3" strokeLinecap="round" />
            </g>
          )}

          {/* Retrieved doc */}
          <DocPage x={rightX} y={versionY(i) - 2} w={docW} h={docH}
            title={v.doc} lines={5}
            enterAt={beat('show-retrieved-docs') + i * 6} frame={frame} fps={fps} />
        </g>
      ))}

      {/* Combined results */}
      <g style={{ opacity: pCombined }}>
        {(() => {
          const cy = versionY(2) + 86;
          const cw = grid.x(0.92);
          const ty = interpolate(pCombined, [0, 1], [10, 0]);
          return (
            <g style={{ transform: `translateY(${ty}px)` }}>
              <rect x={grid.x(0.04)} y={cy} width={cw} height={50} rx={8} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
              <rect x={grid.x(0.04)} y={cy} width={4} height={50} rx={2} fill={'#166534'} fillOpacity={0.4} />
              <text x={grid.x(0.04) + 16} y={cy + 18} fill={SLATE_MID} fontSize={11} fontWeight={600}>COMBINED RESULTS</text>
              {/* 3 mini doc icons */}
              {versions.map((v, i) => {
                const dx = grid.x(0.04) + 16 + i * 110;
                return (
                  <g key={i}>
                    <rect x={dx} y={cy + 28} width={8} height={10} rx={1.5} fill={SLATE_LIGHT} />
                    <text x={dx + 14} y={cy + 36} dominantBaseline="central" fill={SLATE_MID} fontSize={10} fontFamily="monospace">{v.doc}</text>
                  </g>
                );
              })}
              <text x={grid.x(0.04) + cw - 16} y={cy + 36} textAnchor="end" dominantBaseline="central" fill={'#166534'} fontSize={12} fontWeight={600}>better coverage than any single query</text>
            </g>
          );
        })()}
      </g>

      {/* Others strip */}
      <OthersPills x={grid.x(0.02)} y={grid.y(0.84)} items={['RAG-Fusion', 'Decomposition', 'Step-Back', 'HyDE']}
        enterAt={beat('show-others')} frame={frame} fps={fps} />

      {/* Summary */}
      <TextBox
        x={grid.x(0.02)} y={grid.y(0.92)} maxWidth={grid.x(0.96)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={SLATE_MID}
        enterAt={beat('show-summary')} align="left"
      >
        Vague questions retrieve nothing useful. Multi-query turns one bad question into three good ones.
      </TextBox>
    </g>
  );
};
