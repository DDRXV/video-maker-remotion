import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * "Why RAG?" — Three-column visual story with rich illustrations.
 * Muted two-tone palette: slate for everything, dark red/green only for verdict marks.
 */

// Muted palette — no traffic lights
const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const WRONG = '#991b1b';     // red-800, very muted
const RIGHT = '#166534';     // green-800, very muted
const WRONG_BG = '#fef2f2';  // red-50
const RIGHT_BG = '#f0fdf4';  // green-50

/* ── Chat message bubble ── */
const ChatMsg: React.FC<{
  x: number; y: number; w: number;
  text: string; sender: 'user' | 'system';
  enterAt: number; frame: number; fps: number;
  strikethrough?: boolean;
}> = ({ x, y, w, text, sender, enterAt, frame, fps, strikethrough }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const isUser = sender === 'user';
  const charW = FONT_SIZE.sm * 0.52;
  const maxChars = Math.floor((w - 28) / charW);
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word;
    if (test.length > maxChars && cur) { lines.push(cur); cur = word; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  const actualH = Math.max(44, lines.length * 22 + 20);

  return (
    <g style={{ opacity: p }}>
      <text x={isUser ? x : x + w} y={y - 6} textAnchor={isUser ? 'start' : 'end'}
        fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>
        {isUser ? 'User' : 'LLM'}
      </text>
      <rect x={x} y={y} width={w} height={actualH} rx={10} fill={isUser ? SLATE_BG : C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
      {lines.map((line, i) => (
        <text key={i} x={x + 14} y={y + 18 + i * 22} fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={400} fontFamily={TYPOGRAPHY.body.fontFamily}>{line}</text>
      ))}
      {strikethrough && (
        <line x1={x + 10} y1={y + actualH / 2} x2={x + w - 10} y2={y + actualH / 2} stroke={WRONG} strokeWidth={2} strokeLinecap="round" style={{ opacity: p }} />
      )}
    </g>
  );
};

/* ── Confidence meter ── */
const ConfidenceMeter: React.FC<{
  x: number; y: number; w: number; value: number; label: string;
  fillColor: string; enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, value, label, fillColor, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const barH = 12;
  const fillW = interpolate(p, [0, 1], [0, w * value], { extrapolateRight: 'clamp' });
  return (
    <g style={{ opacity: p }}>
      <text x={x} y={y - 4} fill={SLATE_MID} fontSize={11} fontWeight={500} fontFamily="monospace">{label}</text>
      <rect x={x} y={y} width={w} height={barH} rx={barH / 2} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={0.8} />
      <rect x={x} y={y} width={fillW} height={barH} rx={barH / 2} fill={fillColor} fillOpacity={0.6} />
      <text x={x + w + 8} y={y + 10} fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily="monospace">{Math.round(value * 100)}%</text>
    </g>
  );
};

/* ── Document mini-page ── */
const DocPage: React.FC<{
  x: number; y: number; w: number; h: number;
  title: string; lineCount: number;
  highlighted?: boolean; highlightColor?: string;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, title, lineCount, highlighted, highlightColor = SLATE_MID, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [8, 0], { extrapolateRight: 'clamp' });
  const stroke = highlighted ? highlightColor : SLATE_LIGHT;
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x + 1} y={y + 1} width={w} height={h} rx={4} fill={SLATE} fillOpacity={0.03} />
      <rect x={x} y={y} width={w} height={h} rx={4} fill={C.white} stroke={stroke} strokeWidth={highlighted ? 1.5 : 1} />
      <path d={`M ${x + w - 10} ${y} L ${x + w} ${y + 10} L ${x + w - 10} ${y + 10} Z`} fill={stroke} fillOpacity={0.2} />
      <rect x={x + 6} y={y + 6} width={w * 0.5} height={3.5} rx={1.5} fill={highlighted ? highlightColor : SLATE_MID} fillOpacity={0.4} />
      {Array.from({ length: lineCount }).map((_, i) => (
        <rect key={i} x={x + 6} y={y + 16 + i * 8} width={w - 12 - (i % 3) * 8} height={2.5} rx={1} fill={SLATE_LIGHT} fillOpacity={0.7} />
      ))}
      <text x={x + w / 2} y={y + h + 12} textAnchor="middle" fill={highlighted ? highlightColor : SLATE_MID} fontSize={10} fontWeight={500} fontFamily="monospace">{title}</text>
    </g>
  );
};

/* ── Search funnel ── */
const SearchFunnel: React.FC<{
  x: number; y: number; enterAt: number; frame: number; fps: number;
}> = ({ x, y, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  return (
    <g style={{ opacity: p }}>
      <path d={`M ${x - 26} ${y} L ${x + 26} ${y} L ${x + 8} ${y + 24} L ${x + 8} ${y + 34} L ${x - 8} ${y + 34} L ${x - 8} ${y + 24} Z`}
        fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={x} cy={y + 10} r={6} fill="none" stroke={SLATE_MID} strokeWidth={1.2} />
      <line x1={x + 4} y1={y + 14} x2={x + 8} y2={y + 18} stroke={SLATE_MID} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  );
};

/* ── Routing pipeline ── */
const RoutingPipeline: React.FC<{
  x: number; y: number; w: number;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const stages = ['Route', 'Match', 'Extract'];
  const stageW = (w - 16) / 3;
  const stageH = 26;
  return (
    <g style={{ opacity: p }}>
      {stages.map((s, i) => {
        const sx = x + i * (stageW + 8);
        const sp = entranceSpring(frame, fps, enterAt + i * 6);
        return (
          <g key={s} style={{ opacity: sp }}>
            <rect x={sx} y={y} width={stageW} height={stageH} rx={6} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.2} />
            <text x={sx + stageW / 2} y={y + stageH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={11} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>{s}</text>
            {i < 2 && (
              <line x1={sx + stageW + 1} y1={y + stageH / 2} x2={sx + stageW + 7} y2={y + stageH / 2} stroke={SLATE_LIGHT} strokeWidth={1} strokeLinecap="round" />
            )}
          </g>
        );
      })}
    </g>
  );
};

/* ── Database with data rows ── */
const DatabaseWithRows: React.FC<{
  x: number; y: number; label: string; rowCount: number;
  highlighted?: boolean; highlightRow?: number;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, label, rowCount, highlighted, highlightRow, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const dbW = 72;
  const dbH = 52;
  const ty = interpolate(p, [0, 1], [8, 0], { extrapolateRight: 'clamp' });
  const stroke = highlighted ? RIGHT : SLATE_LIGHT;
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <ellipse cx={x + dbW / 2} cy={y + 7} rx={dbW / 2} ry={7} fill="none" stroke={stroke} strokeWidth={1.5} />
      <rect x={x} y={y + 7} width={dbW} height={dbH - 14} fill={C.white} stroke="none" />
      <line x1={x} y1={y + 7} x2={x} y2={y + dbH - 7} stroke={stroke} strokeWidth={1.5} />
      <line x1={x + dbW} y1={y + 7} x2={x + dbW} y2={y + dbH - 7} stroke={stroke} strokeWidth={1.5} />
      <ellipse cx={x + dbW / 2} cy={y + dbH - 7} rx={dbW / 2} ry={7} fill="none" stroke={stroke} strokeWidth={1.5} />
      {Array.from({ length: rowCount }).map((_, i) => {
        const rowY = y + 18 + i * 10;
        const isHL = highlightRow === i;
        return (
          <rect key={i} x={x + 6} y={rowY} width={dbW - 12} height={6} rx={2}
            fill={isHL ? RIGHT : SLATE_LIGHT} fillOpacity={isHL ? 0.35 : 0.6} />
        );
      })}
      <text x={x + dbW / 2} y={y + dbH + 12} textAnchor="middle" fill={highlighted ? RIGHT : SLATE_MID} fontSize={10} fontWeight={highlighted ? 600 : 500} fontFamily="monospace">{label}</text>
    </g>
  );
};

/* ── Column header ── */
const ColHeader: React.FC<{
  x: number; y: number; w: number; h: number;
  num: number; title: string; opacity: number;
}> = ({ x, y, w, h, num, title, opacity: op }) => (
  <g style={{ opacity: op }}>
    <rect x={x} y={y} width={w} height={h} rx={12} fill={C.white} stroke={SLATE_LIGHT} strokeWidth={1.2} />
    <rect x={x} y={y} width={4} height={h} rx={2} fill={SLATE_MID} fillOpacity={0.4} />
    <circle cx={x + 24} cy={y + 24} r={13} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.2} />
    <text x={x + 24} y={y + 25} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE.xs} fontWeight={700}>{num}</text>
    <text x={x + 46} y={y + 27} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE.md} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{title}</text>
  </g>
);

/* ── Main scene ── */

export const WhyRagScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('why-rag');

  const pQ = progress('show-question');
  const pLLM = progress('show-direct-llm');
  const pHall = progress('show-hallucination');
  const pBasic = progress('show-basic-rag');
  const pWrong = progress('show-wrong-doc');
  const pProd = progress('show-production-rag');
  const pCorrect = progress('show-correct-answer');
  const pGap = progress('show-gap-statement');

  const colW = 470;
  const colGap = 30;
  const totalW = colW * 3 + colGap * 2;
  const startX = grid.center().x - totalW / 2;
  const colTopY = grid.y(0.12);
  const colH = 550;

  const col1X = startX;
  const col2X = startX + colW + colGap;
  const col3X = startX + 2 * (colW + colGap);

  return (
    <g>
      {/* Title + question */}
      <g style={{ opacity: pQ }}>
        <text x={grid.center().x} y={grid.y(0.02)} textAnchor="middle" fill={SLATE}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Same question, three systems
        </text>
        <rect x={grid.x(0.1)} y={grid.y(0.065)} width={grid.x(0.8)} height={42} rx={21} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1.2} />
        <text x={grid.center().x} y={grid.y(0.065) + 22} textAnchor="middle" dominantBaseline="central"
          fill={SLATE} fontSize={FONT_SIZE.md} fontWeight={500} fontFamily={TYPOGRAPHY.body.fontFamily}>
          "What's your refund policy for annual plans?"
        </text>
      </g>

      {/* ═══ COLUMN 1: Direct LLM ═══ */}
      <ColHeader x={col1X} y={colTopY} w={colW} h={colH} num={1} title="Direct LLM" opacity={pLLM} />

      <g style={{ opacity: pLLM }}>
        <ChatMsg x={col1X + 16} y={colTopY + 52} w={colW - 32}
          text="What's your refund policy for annual plans?" sender="user"
          enterAt={beat('show-direct-llm')} frame={frame} fps={fps} />

        {/* LLM thinking */}
        {(() => {
          const tp = entranceSpring(frame, fps, beat('show-direct-llm') + 10);
          return (
            <g style={{ opacity: tp }}>
              <rect x={col1X + 20} y={colTopY + 126} width={colW - 40} height={24} rx={6} fill={SLATE_BG} />
              <text x={col1X + colW / 2} y={colTopY + 139} textAnchor="middle" dominantBaseline="central" fill={SLATE_MID} fontSize={11} fontFamily="monospace">generating from parameters only...</text>
            </g>
          );
        })()}
      </g>

      <g style={{ opacity: pHall }}>
        <ChatMsg x={col1X + 16} y={colTopY + 166} w={colW - 32}
          text='"Full refund within 60 days of purchase."' sender="system"
          enterAt={beat('show-hallucination')} frame={frame} fps={fps}
          strikethrough={true} />

        <ConfidenceMeter x={col1X + 24} y={colTopY + 268} w={180}
          value={0.94} label="confidence" fillColor={SLATE_MID}
          enterAt={beat('show-hallucination') + 8} frame={frame} fps={fps} />
        <ConfidenceMeter x={col1X + 24} y={colTopY + 300} w={180}
          value={0.0} label="accuracy" fillColor={SLATE_LIGHT}
          enterAt={beat('show-hallucination') + 12} frame={frame} fps={fps} />

        {/* Verdict */}
        {(() => {
          const vp = entranceSpring(frame, fps, beat('show-hallucination') + 16);
          return (
            <g style={{ opacity: vp }}>
              <rect x={col1X + 16} y={colTopY + 340} width={colW - 32} height={40} rx={8} fill={WRONG_BG} stroke={WRONG} strokeWidth={1} strokeOpacity={0.3} />
              <line x1={col1X + 30} y1={colTopY + 354} x2={col1X + 40} y2={colTopY + 364} stroke={WRONG} strokeWidth={2} strokeLinecap="round" />
              <line x1={col1X + 40} y1={colTopY + 354} x2={col1X + 30} y2={colTopY + 364} stroke={WRONG} strokeWidth={2} strokeLinecap="round" />
              <text x={col1X + 52} y={colTopY + 362} dominantBaseline="central" fill={WRONG} fontSize={FONT_SIZE.sm} fontWeight={500}>Hallucinated. No source.</text>
            </g>
          );
        })()}
      </g>

      {/* ═══ COLUMN 2: Basic RAG ═══ */}
      <ColHeader x={col2X} y={colTopY} w={colW} h={colH} num={2} title="Basic RAG" opacity={pBasic} />

      <g style={{ opacity: pBasic }}>
        {/* Document pages */}
        <DocPage x={col2X + 16} y={colTopY + 54} w={64} h={60} title="pricing" lineCount={4}
          highlighted={true} highlightColor={WRONG}
          enterAt={beat('show-basic-rag')} frame={frame} fps={fps} />
        <DocPage x={col2X + 96} y={colTopY + 54} w={64} h={60} title="faq" lineCount={4}
          enterAt={beat('show-basic-rag') + 4} frame={frame} fps={fps} />
        <DocPage x={col2X + 176} y={colTopY + 54} w={64} h={60} title="terms" lineCount={4}
          enterAt={beat('show-basic-rag') + 8} frame={frame} fps={fps} />
        <DocPage x={col2X + 256} y={colTopY + 54} w={64} h={60} title="refund" lineCount={4}
          enterAt={beat('show-basic-rag') + 12} frame={frame} fps={fps} />

        {/* Search funnel */}
        <SearchFunnel x={col2X + colW / 2} y={colTopY + 148}
          enterAt={beat('show-basic-rag') + 16} frame={frame} fps={fps} />

        {/* Arrow down */}
        {(() => {
          const ap = entranceSpring(frame, fps, beat('show-basic-rag') + 20);
          return (
            <g style={{ opacity: ap }}>
              <line x1={col2X + colW / 2} y1={colTopY + 186} x2={col2X + colW / 2} y2={colTopY + 210} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinecap="round" />
              <polygon points={`${col2X + colW / 2},${colTopY + 214} ${col2X + colW / 2 - 5},${colTopY + 206} ${col2X + colW / 2 + 5},${colTopY + 206}`} fill={SLATE_LIGHT} />
            </g>
          );
        })()}
      </g>

      {/* Wrong doc retrieved */}
      <g style={{ opacity: pWrong }}>
        <rect x={col2X + 16} y={colTopY + 222} width={colW - 32} height={66} rx={8} fill={WRONG_BG} stroke={WRONG} strokeWidth={1} strokeOpacity={0.25} />
        <rect x={col2X + 16} y={colTopY + 222} width={4} height={66} rx={2} fill={WRONG} fillOpacity={0.4} />
        <text x={col2X + 30} y={colTopY + 242} fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily="monospace">retrieved: pricing-page.md</text>
        <text x={col2X + 30} y={colTopY + 264} fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={400}>"Annual plans are $299/year"</text>
        <text x={col2X + 30} y={colTopY + 280} fill={SLATE_MID} fontSize={10} fontFamily="monospace">similarity: 0.82</text>

        {/* Answer from wrong doc */}
        {(() => {
          const wp = entranceSpring(frame, fps, beat('show-wrong-doc') + 10);
          return (
            <g style={{ opacity: wp }}>
              <rect x={col2X + 16} y={colTopY + 306} width={colW - 32} height={40} rx={8} fill={WRONG_BG} stroke={WRONG} strokeWidth={1} strokeOpacity={0.3} />
              <line x1={col2X + 30} y1={colTopY + 320} x2={col2X + 40} y2={colTopY + 330} stroke={WRONG} strokeWidth={2} strokeLinecap="round" />
              <line x1={col2X + 40} y1={colTopY + 320} x2={col2X + 30} y2={colTopY + 330} stroke={WRONG} strokeWidth={2} strokeLinecap="round" />
              <text x={col2X + 52} y={colTopY + 328} dominantBaseline="central" fill={WRONG} fontSize={FONT_SIZE.sm} fontWeight={500}>Right data, wrong document.</text>
            </g>
          );
        })()}
      </g>

      {/* ═══ COLUMN 3: Production RAG ═══ */}
      <ColHeader x={col3X} y={colTopY} w={colW} h={colH} num={3} title="Production RAG" opacity={pProd} />

      <g style={{ opacity: pProd }}>
        {/* Routing pipeline */}
        <RoutingPipeline x={col3X + 16} y={colTopY + 56} w={colW - 32}
          enterAt={beat('show-production-rag')} frame={frame} fps={fps} />

        {/* Arrow down */}
        {(() => {
          const ap = entranceSpring(frame, fps, beat('show-production-rag') + 20);
          return (
            <g style={{ opacity: ap }}>
              <line x1={col3X + colW / 2} y1={colTopY + 88} x2={col3X + colW / 2} y2={colTopY + 110} stroke={SLATE_LIGHT} strokeWidth={1.5} strokeLinecap="round" />
              <polygon points={`${col3X + colW / 2},${colTopY + 114} ${col3X + colW / 2 - 5},${colTopY + 106} ${col3X + colW / 2 + 5},${colTopY + 106}`} fill={SLATE_LIGHT} />
            </g>
          );
        })()}

        {/* Three databases */}
        <DatabaseWithRows x={col3X + 24} y={colTopY + 120} label="vector" rowCount={3}
          enterAt={beat('show-production-rag') + 14} frame={frame} fps={fps} />
        <DatabaseWithRows x={col3X + 124} y={colTopY + 120} label="sql" rowCount={3}
          enterAt={beat('show-production-rag') + 18} frame={frame} fps={fps} />
        <DatabaseWithRows x={col3X + 224} y={colTopY + 120} label="policy" rowCount={3}
          highlighted={true} highlightRow={1}
          enterAt={beat('show-production-rag') + 22} frame={frame} fps={fps} />

        {/* Connection from policy DB */}
        {(() => {
          const cp = entranceSpring(frame, fps, beat('show-correct-answer'));
          return (
            <g style={{ opacity: cp }}>
              <line x1={col3X + 260} y1={colTopY + 200} x2={col3X + colW / 2} y2={colTopY + 226}
                stroke={RIGHT} strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.4} strokeLinecap="round" />
            </g>
          );
        })()}
      </g>

      {/* Correct doc */}
      <g style={{ opacity: pCorrect }}>
        <rect x={col3X + 16} y={colTopY + 234} width={colW - 32} height={66} rx={8} fill={RIGHT_BG} stroke={RIGHT} strokeWidth={1} strokeOpacity={0.25} />
        <rect x={col3X + 16} y={colTopY + 234} width={4} height={66} rx={2} fill={RIGHT} fillOpacity={0.4} />
        <text x={col3X + 30} y={colTopY + 254} fill={SLATE_MID} fontSize={11} fontWeight={600} fontFamily="monospace">retrieved: refund-policy.md § 4.2</text>
        <text x={col3X + 30} y={colTopY + 276} fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={400}>"Pro-rated refund minus 2 months"</text>
        <text x={col3X + 30} y={colTopY + 292} fill={SLATE_MID} fontSize={10} fontFamily="monospace">exact match via policy DB</text>

        {/* Correct verdict */}
        {(() => {
          const cp = entranceSpring(frame, fps, beat('show-correct-answer') + 10);
          return (
            <g style={{ opacity: cp }}>
              <rect x={col3X + 16} y={colTopY + 318} width={colW - 32} height={40} rx={8} fill={RIGHT_BG} stroke={RIGHT} strokeWidth={1} strokeOpacity={0.3} />
              <polyline points={`${col3X + 28},${colTopY + 338} ${col3X + 36},${colTopY + 346} ${col3X + 48},${colTopY + 330}`}
                fill="none" stroke={RIGHT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <text x={col3X + 56} y={colTopY + 340} dominantBaseline="central" fill={RIGHT} fontSize={FONT_SIZE.sm} fontWeight={500}>Correct. From the right source.</text>
            </g>
          );
        })()}
      </g>

      {/* Bottom statement */}
      <TextBox
        x={grid.x(0.08)} y={grid.y(0.9)} maxWidth={grid.x(0.84)}
        fontSize={FONT_SIZE.xl} fontWeight={600} color={SLATE}
        enterAt={beat('show-gap-statement')} align="center"
      >
        Same question. Three systems. Only one gets it right.
      </TextBox>
    </g>
  );
};
