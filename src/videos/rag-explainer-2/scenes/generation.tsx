import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { TextBox } from '../../../components/TextBox';

/**
 * Generation — Hero: Self-RAG (generate → evaluate → loop)
 *
 * Attempt 1: generates "20% cancellation fee" → fails grounding check
 * Re-retrieve → pulls exact clause
 * Attempt 2: generates "pro-rated refund minus 2 months" → passes
 *
 * Two rows showing the loop visually.
 */

const SLATE = '#334155';
const SLATE_MID = '#64748b';
const SLATE_LIGHT = '#cbd5e1';
const SLATE_BG = '#f1f5f9';
const MOD = C.generation;
const WRONG = '#991b1b';
const WRONG_BG = '#fef2f2';
const RIGHT = '#166534';
const RIGHT_BG = '#f0fdf4';

/* ── Step box ── */
const StepBox: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; detail?: string; detail2?: string;
  accentColor?: string; accentBg?: string;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, w, h, label, detail, detail2, accentColor = SLATE_MID, accentBg, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const ty = interpolate(p, [0, 1], [10, 0], { extrapolateRight: 'clamp' });
  return (
    <g style={{ opacity: p, transform: `translateY(${ty}px)` }}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={accentBg || C.white} stroke={accentColor} strokeWidth={1.2} strokeOpacity={0.4} />
      <rect x={x} y={y} width={4} height={h} rx={2} fill={accentColor} fillOpacity={0.5} />
      <text x={x + 14} y={y + 16} fill={accentColor} fontSize={10} fontWeight={700} fontFamily={TYPOGRAPHY.label.fontFamily}>{label}</text>
      {detail && <text x={x + 14} y={y + 34} fill={SLATE} fontSize={13} fontWeight={400} fontFamily={TYPOGRAPHY.body.fontFamily}>{detail}</text>}
      {detail2 && <text x={x + 14} y={y + 52} fill={SLATE_MID} fontSize={11} fontFamily="monospace">{detail2}</text>}
    </g>
  );
};

/* ── Arrow connector ── */
const Arrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color?: string; dashed?: boolean;
  enterAt: number; frame: number; fps: number;
}> = ({ x1, y1, x2, y2, color = SLATE_LIGHT, dashed, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  return (
    <g style={{ opacity: p * 0.6 }}>
      <line x1={x1} y1={y1} x2={x2 - 8} y2={y2} stroke={color} strokeWidth={1.5} strokeLinecap="round"
        strokeDasharray={dashed ? '4 3' : undefined} />
      <polygon points={`${x2},${y2} ${x2 - 7},${y2 - 4} ${x2 - 7},${y2 + 4}`} fill={color} />
    </g>
  );
};

/* ── Verdict badge ── */
const Verdict: React.FC<{
  x: number; y: number;
  pass: boolean; reason: string;
  enterAt: number; frame: number; fps: number;
}> = ({ x, y, pass, reason, enterAt, frame, fps }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const color = pass ? RIGHT : WRONG;
  const bg = pass ? RIGHT_BG : WRONG_BG;
  const w = reason.length * 7.5 + 50;
  return (
    <g style={{ opacity: p }}>
      <rect x={x} y={y} width={w} height={28} rx={14} fill={bg} stroke={color} strokeWidth={1} strokeOpacity={0.3} />
      {pass ? (
        <polyline points={`${x + 12},${y + 14} ${x + 17},${y + 19} ${x + 24},${y + 10}`}
          fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <g>
          <line x1={x + 12} y1={y + 10} x2={x + 22} y2={y + 20} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <line x1={x + 22} y1={y + 10} x2={x + 12} y2={y + 20} stroke={color} strokeWidth={2} strokeLinecap="round" />
        </g>
      )}
      <text x={x + 32} y={y + 15} dominantBaseline="central" fill={color} fontSize={12} fontWeight={500}>{reason}</text>
    </g>
  );
};

export const GenerationScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('generation');

  const pTitle = progress('show-title');
  const pQuestion = progress('show-question');
  const pAttempt1 = progress('show-attempt-1');
  const pEval1 = progress('show-eval-1');
  const pFail = progress('show-fail');
  const pReRetrieve = progress('show-re-retrieve');
  const pAttempt2 = progress('show-attempt-2');
  const pEval2 = progress('show-eval-2');
  const pPass = progress('show-pass');
  const pOthers = progress('show-others');

  // Layout
  const row1Y = grid.y(0.18);
  const row2Y = grid.y(0.52);
  const boxH = 64;
  const stepW = 280;
  const evalW = 200;

  const s1X = grid.x(0.02);
  const s2X = grid.x(0.36);
  const s3X = grid.x(0.66);

  // Dim row 1 when row 2 appears
  const row1Opacity = pAttempt2 > 0.05 ? 0.3 : 1;

  return (
    <g>
      {/* Module badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.03)} cy={grid.y(0.03)} r={18} fill={MOD} fillOpacity={0.12} stroke={MOD} strokeWidth={1.5} />
        <text x={grid.x(0.03)} y={grid.y(0.03)} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={FONT_SIZE.md} fontWeight={700}>6</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03)} dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>Generation</text>
        <text x={grid.x(0.03) + 30} y={grid.y(0.03) + 28} dominantBaseline="central" fill={SLATE_MID} fontSize={FONT_SIZE.sm}>Self-RAG</text>
      </g>

      {/* Question */}
      <g style={{ opacity: pQuestion }}>
        <rect x={grid.x(0.12)} y={grid.y(0.1)} width={grid.x(0.76)} height={38} rx={19} fill={SLATE_BG} stroke={SLATE_LIGHT} strokeWidth={1} />
        <text x={grid.center().x} y={grid.y(0.1) + 20} textAnchor="middle" dominantBaseline="central" fill={SLATE} fontSize={FONT_SIZE.sm} fontWeight={500}>"What's the cancellation fee for annual plans?"</text>
      </g>

      {/* ── ROW 1: Attempt 1 (fails) ── */}
      <g style={{ opacity: row1Opacity }}>
        <text x={s1X} y={row1Y - 10} fill={SLATE_MID} fontSize={11} fontWeight={600} style={{ opacity: pAttempt1 }}>ATTEMPT 1</text>

        <StepBox x={s1X} y={row1Y} w={stepW} h={boxH}
          label="GENERATE" detail='"There is typically a 20%' detail2='cancellation fee"'
          accentColor={MOD} enterAt={beat('show-attempt-1')} frame={frame} fps={fps} />

        <Arrow x1={s1X + stepW} y1={row1Y + boxH / 2} x2={s2X} y2={row1Y + boxH / 2}
          enterAt={beat('show-eval-1')} frame={frame} fps={fps} />

        <StepBox x={s2X} y={row1Y} w={evalW} h={boxH}
          label="EVALUATE" detail="Check against source docs"
          accentColor={SLATE_MID} enterAt={beat('show-eval-1')} frame={frame} fps={fps} />

        <Verdict x={s2X} y={row1Y + boxH + 10}
          pass={false} reason='not grounded — source says "pro-rated refund"'
          enterAt={beat('show-fail')} frame={frame} fps={fps} />
      </g>

      {/* Loop-back arrow from eval to re-retrieve */}
      {pReRetrieve > 0.05 && (
        <g style={{ opacity: pReRetrieve * 0.5 }}>
          <path
            d={`M ${s2X + evalW / 2} ${row1Y + boxH + 42} C ${s2X + evalW / 2} ${row1Y + boxH + 80}, ${s1X + stepW / 2} ${row2Y - 40}, ${s1X + stepW / 2} ${row2Y - 8}`}
            fill="none" stroke={MOD} strokeWidth={1.5} strokeDasharray="6 4" strokeLinecap="round" />
          <polygon points={`${s1X + stepW / 2},${row2Y - 4} ${s1X + stepW / 2 - 5},${row2Y - 12} ${s1X + stepW / 2 + 5},${row2Y - 12}`} fill={MOD} fillOpacity={0.5} />
          <text x={(s2X + evalW / 2 + s1X + stepW / 2) / 2} y={row2Y - 30} textAnchor="middle" fill={MOD} fontSize={11} fontWeight={500} fontFamily="monospace">re-retrieve</text>
        </g>
      )}

      {/* ── ROW 2: Attempt 2 (passes) ── */}
      <text x={s1X} y={row2Y - 10} fill={SLATE_MID} fontSize={11} fontWeight={600} style={{ opacity: pAttempt2 }}>ATTEMPT 2</text>

      <StepBox x={s1X} y={row2Y} w={stepW} h={boxH}
        label="RE-RETRIEVE" detail="cancel-policy.md § 3.1" detail2='"Pro-rated refund minus 2 months"'
        accentColor={MOD} accentBg={SLATE_BG} enterAt={beat('show-re-retrieve')} frame={frame} fps={fps} />

      <Arrow x1={s1X + stepW} y1={row2Y + boxH / 2} x2={s2X} y2={row2Y + boxH / 2}
        enterAt={beat('show-attempt-2')} frame={frame} fps={fps} />

      <StepBox x={s2X} y={row2Y} w={stepW} h={boxH}
        label="GENERATE" detail='"Pro-rated refund minus 2 months' detail2='of service used"'
        accentColor={MOD} enterAt={beat('show-attempt-2')} frame={frame} fps={fps} />

      <Arrow x1={s2X + stepW} y1={row2Y + boxH / 2} x2={s3X} y2={row2Y + boxH / 2}
        enterAt={beat('show-eval-2')} frame={frame} fps={fps} />

      <StepBox x={s3X} y={row2Y} w={evalW} h={boxH}
        label="EVALUATE" detail="Check against source docs"
        accentColor={SLATE_MID} enterAt={beat('show-eval-2')} frame={frame} fps={fps} />

      <Verdict x={s3X} y={row2Y + boxH + 10}
        pass={true} reason="grounded in source"
        enterAt={beat('show-pass')} frame={frame} fps={fps} />

      {/* Return answer arrow */}
      {pPass > 0.05 && (
        <g style={{ opacity: pPass }}>
          <rect x={s3X + evalW + 20} y={row2Y + 10} width={grid.x(0.96) - s3X - evalW - 20} height={boxH - 20} rx={8}
            fill={RIGHT_BG} stroke={RIGHT} strokeWidth={1} strokeOpacity={0.3} />
          <text x={s3X + evalW + 30} y={row2Y + boxH / 2 + 1} dominantBaseline="central" fill={RIGHT} fontSize={12} fontWeight={600}>→ Return</text>
        </g>
      )}

      {/* Others strip */}
      <g style={{ opacity: pOthers }}>
        <text x={grid.x(0.02)} y={grid.y(0.84) + 13} fill={SLATE_MID} fontSize={FONT_SIZE.xs} fontWeight={500}>Also worth knowing:</text>
        <rect x={grid.x(0.02) + 160} y={grid.y(0.84)} width={200} height={26} rx={13} fill={MOD} fillOpacity={0.06} stroke={MOD} strokeWidth={1} strokeOpacity={0.3} />
        <text x={grid.x(0.02) + 260} y={grid.y(0.84) + 14} textAnchor="middle" dominantBaseline="central" fill={MOD} fontSize={12} fontWeight={500}>RRR (Rewrite, Retrieve, Read)</text>
      </g>

      {/* Summary */}
      <TextBox
        x={grid.x(0.02)} y={grid.y(0.92)} maxWidth={grid.x(0.96)}
        fontSize={FONT_SIZE.lg} fontWeight={500} color={SLATE_MID}
        enterAt={beat('show-summary')} align="left"
      >
        The system doesn't just answer once. It checks its own work.
      </TextBox>
    </g>
  );
};
