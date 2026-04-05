import React from 'react';
import { interpolate } from 'remotion';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';

const terms = [
  { term: '"Handle this asynchronously"', color: C.sync },
  { term: '"Prevent any race conditions"', color: C.race },
  { term: '"Make this endpoint idempotent"', color: C.idempotent },
  { term: '"Add graceful degradation"', color: C.fault },
];

export const OutroScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('outro');

  const pTitle = progress('show-title');
  const pTerms = progress('show-terms');
  const pPrompt = progress('show-prompt-example');
  const pBrand = progress('show-branding');

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text
          x={grid.center().x} y={grid.y(0.12)}
          textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontFamily="Inter, sans-serif" fontWeight={700}
        >
          Use these in your next prompt
        </text>
        {/* Accent underline */}
        {(() => {
          const lineW = 320;
          const lineX = grid.center().x - lineW / 2;
          const lineY = grid.y(0.12) + 16;
          const drawn = interpolate(pTitle, [0, 1], [lineW, 0], { extrapolateRight: 'clamp' });
          return (
            <line
              x1={lineX} y1={lineY} x2={lineX + lineW} y2={lineY}
              stroke={C.accent} strokeWidth={3} strokeLinecap="round"
              strokeDasharray={lineW} strokeDashoffset={drawn}
            />
          );
        })()}
      </g>

      {/* Term pills - stacked vertically */}
      {terms.map((t, i) => {
        const delay = beat('show-terms') + i * 5;
        const tp = entranceSpring(frame, fps, delay);
        const slideX = interpolate(tp, [0, 1], [-30, 0], { extrapolateRight: 'clamp' });
        const pillW = t.term.length * 12 + 56;
        const pillH = 52;
        const py = grid.y(0.24) + i * 68;
        const px = grid.center().x - pillW / 2;

        return (
          <g key={i} style={{ opacity: tp, transform: `translateX(${slideX}px)` }}>
            <rect
              x={px} y={py} width={pillW} height={pillH} rx={pillH / 2}
              fill={t.color} fillOpacity={0.08}
              stroke={t.color} strokeWidth={1.5}
            />
            <text
              x={grid.center().x} y={py + pillH / 2}
              textAnchor="middle" dominantBaseline="central"
              fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={500}
              fontFamily="Inter, sans-serif"
            >
              {t.term}
            </text>
          </g>
        );
      })}

      {/* Prompt example */}
      <g style={{ opacity: pPrompt }}>
        <rect
          x={grid.center().x - 310} y={grid.y(0.66)}
          width={620} height={52} rx={12}
          fill={C.accent} fillOpacity={0.06}
          stroke={C.accent} strokeWidth={1.5}
        />
        <text
          x={grid.center().x} y={grid.y(0.66) + 26}
          textAnchor="middle" dominantBaseline="central"
          fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={500}
          fontFamily="Inter, sans-serif"
        >
          Speak the same language as the system you are building
        </text>
      </g>

      {/* Branding */}
      <g style={{ opacity: pBrand }}>
        <text
          x={grid.center().x} y={grid.y(0.84)}
          textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.xl} fontWeight={700}
          fontFamily="Inter, sans-serif"
        >
          Codepup AI
        </text>
        <text
          x={grid.center().x} y={grid.y(0.84) + 32}
          textAnchor="middle" fill={C.mid}
          fontSize={FONT_SIZE.sm} fontWeight={500}
          fontFamily="Inter, sans-serif"
        >
          By Rajesh Pentakota
        </text>
      </g>
    </g>
  );
};
