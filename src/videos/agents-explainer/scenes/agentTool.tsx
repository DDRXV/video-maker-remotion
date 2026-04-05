import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

const AnimLine: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color: string; enterAt: number; frame: number; fps: number;
  width?: number; dash?: string; opacity?: number;
}> = ({ x1, y1, x2, y2, color, enterAt, frame, fps, width = 1.8, dash, opacity: baseOp = 1 }) => {
  const p = entranceSpring(frame, fps, enterAt);
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const offset = dash ? 0 : interpolate(p, [0, 1], [len, 0]);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={width} strokeLinecap="round"
      strokeDasharray={dash || `${len}`} strokeDashoffset={offset}
      style={{ opacity: p * baseOp }} />
  );
};

const ChevronRight: React.FC<{ x: number; y: number; color: string; opacity: number }> = ({ x, y, color, opacity }) => (
  <polyline points={`${x - 10},${y - 7} ${x},${y} ${x - 10},${y + 7}`}
    fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    style={{ opacity }} />
);

const ChevronLeft: React.FC<{ x: number; y: number; color: string; opacity: number }> = ({ x, y, color, opacity }) => (
  <polyline points={`${x + 10},${y - 7} ${x},${y} ${x + 10},${y + 7}`}
    fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    style={{ opacity }} />
);

export const AgentToolScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('agent-tool');
  const pTitle = progress('show-title');
  const pMain = progress('show-main-agent');
  const pSpawn = progress('show-spawn');
  const pSub = progress('show-subagent-work');
  const pResult = progress('show-result-back');
  const pSummary = progress('show-summary');

  const mainX = grid.x(0.02);
  const mainY = grid.y(0.14);
  const mainW = 380;
  const mainH = 220;

  const subX = grid.x(0.52);
  const subY = grid.y(0.14);
  const subW = 420;
  const subH = 260;

  const mainCy = mainY + mainH / 2;
  const subCy = subY + subH / 2;

  // Subagent data lines that appear one by one
  const subagentLines = [
    { text: 'Jasper AI', detail: 'Product Hunt, 5K upvotes' },
    { text: 'Copy.ai', detail: 'AppSumo launch, $3.5M' },
    { text: 'Writesonic', detail: 'Beta waitlist, 40K signups' },
    { text: 'Rytr', detail: 'Freemium, 500K users Y1' },
    { text: 'Anyword', detail: 'Enterprise-first, Series B' },
  ];

  return (
    <g>
      {/* Section badge */}
      <g style={{ opacity: pTitle }}>
        <circle cx={grid.x(0.04)} cy={grid.y(0.04)} r={22} fill={C.accentLight} stroke={C.accent} strokeWidth={2} />
        <text x={grid.x(0.04)} y={grid.y(0.04)} textAnchor="middle" dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE.md} fontWeight={700}>3</text>
        <text x={grid.x(0.04) + 36} y={grid.y(0.04)} dominantBaseline="central" fill={C.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>The Agent Tool</text>
      </g>

      {/* Main Agent card */}
      <g style={{ opacity: pMain }}>
        <rect x={mainX} y={mainY} width={mainW} height={mainH} rx={16}
          fill={C.accentLight} stroke={C.accent} strokeWidth={2.5} />
        <text x={mainX + mainW / 2} y={mainY + 30} textAnchor="middle" fill={C.accent}
          fontSize={FONT_SIZE.lg} fontWeight={700}>Main Agent</text>

        {/* User prompt inside card */}
        <rect x={mainX + 16} y={mainY + 48} width={mainW - 32} height={56} rx={8}
          fill="white" stroke={C.hairline} strokeWidth={1} />
        <text x={mainX + 28} y={mainY + 70} fill={C.dark}
          fontSize={14} fontFamily={TYPOGRAPHY.mono.fontFamily}>
          "Plan the launch for our
        </text>
        <text x={mainX + 28} y={mainY + 90} fill={C.dark}
          fontSize={14} fontFamily={TYPOGRAPHY.mono.fontFamily}>
          new AI writing tool"
        </text>

        {/* Agent reasoning */}
        {(() => {
          const rp = entranceSpring(frame, fps, beat('show-main-agent') + 10);
          return (
            <g style={{ opacity: rp }}>
              <rect x={mainX + 16} y={mainY + 116} width={mainW - 32} height={36} rx={6}
                fill={C.accentMid} />
              <text x={mainX + 28} y={mainY + 139} fill={C.accent}
                fontSize={13} fontWeight={500} fontFamily={TYPOGRAPHY.mono.fontFamily}>
                Thinking: "This needs 4 workstreams"
              </text>
            </g>
          );
        })()}

        {/* Cursor blink */}
        {(() => {
          const blinkOn = Math.floor(frame / 15) % 2 === 0;
          return pMain > 0.5 && pResult < 0.5 ? (
            <rect x={mainX + 28} y={mainY + 164} width={8} height={16} rx={1}
              fill={C.accent} fillOpacity={blinkOn ? 0.6 : 0} />
          ) : null;
        })()}
      </g>

      {/* Spawn arrow: main -> subagent */}
      <g style={{ opacity: pSpawn }}>
        <AnimLine x1={mainX + mainW + 4} y1={mainCy - 18} x2={subX - 8} y2={subCy - 18}
          color={C.accent} enterAt={beat('show-spawn')} frame={frame} fps={fps} width={2} />
        <ChevronRight x={subX - 4} y={subCy - 18} color={C.accent}
          opacity={entranceSpring(frame, fps, beat('show-spawn'))} />

        {/* Spawn label with brief text */}
        {(() => {
          const midX = (mainX + mainW + subX) / 2;
          const labelY = mainCy - 58;
          return (
            <g>
              <rect x={midX - 120} y={labelY - 14} width={240} height={40} rx={8}
                fill={C.accentLight} stroke={C.accent} strokeWidth={1} />
              <text x={midX} y={labelY + 2} textAnchor="middle" fill={C.accent}
                fontSize={11} fontWeight={600}>spawn</text>
              <text x={midX} y={labelY + 18} textAnchor="middle" fill={C.mid}
                fontSize={10} fontFamily={TYPOGRAPHY.mono.fontFamily}>
                "Research top 5 competitor launches"
              </text>
            </g>
          );
        })()}
      </g>

      {/* Subagent card */}
      <g style={{ opacity: pSub }}>
        {(() => {
          const sp = entranceSpring(frame, fps, beat('show-subagent-work'));
          const slideX = interpolate(sp, [0, 1], [30, 0]);
          return (
            <g style={{ transform: `translateX(${slideX}px)` }}>
              <rect x={subX} y={subY} width={subW} height={subH} rx={16}
                fill={C.blueLight} stroke={C.blue} strokeWidth={2} />
              <text x={subX + subW / 2} y={subY + 30} textAnchor="middle" fill={C.blue}
                fontSize={FONT_SIZE.lg} fontWeight={700}>Subagent</text>
              <text x={subX + subW / 2} y={subY + 52} textAnchor="middle" fill={C.mid}
                fontSize={FONT_SIZE.sm}>Competitor Research</text>

              {/* Data lines appearing one by one */}
              {subagentLines.map((line, i) => {
                const lp = entranceSpring(frame, fps, beat('show-subagent-work') + 8 + i * 4);
                const rowY = subY + 72 + i * 34;
                return (
                  <g key={i} style={{ opacity: lp }}>
                    <rect x={subX + 16} y={rowY} width={subW - 32} height={28} rx={4}
                      fill="white" fillOpacity={0.7} stroke={C.blue} strokeWidth={0.5} />
                    <text x={subX + 28} y={rowY + 18} fill={C.dark}
                      fontSize={13} fontWeight={600} fontFamily={TYPOGRAPHY.mono.fontFamily}>
                      {line.text}
                    </text>
                    <text x={subX + 140} y={rowY + 18} fill={C.mid}
                      fontSize={12} fontFamily={TYPOGRAPHY.mono.fontFamily}>
                      {line.detail}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}
      </g>

      {/* Result arrow: subagent -> main */}
      <g style={{ opacity: pResult }}>
        <AnimLine x1={subX - 8} y1={subCy + 18} x2={mainX + mainW + 4} y2={mainCy + 18}
          color={C.green} enterAt={beat('show-result-back')} frame={frame} fps={fps} width={2} />
        <ChevronLeft x={mainX + mainW + 4} y={mainCy + 18} color={C.green}
          opacity={entranceSpring(frame, fps, beat('show-result-back'))} />

        {/* Result label with summary snippet */}
        {(() => {
          const midX = (mainX + mainW + subX) / 2;
          const labelY = mainCy + 44;
          return (
            <g>
              <rect x={midX - 140} y={labelY - 10} width={280} height={44} rx={8}
                fill={C.greenLight} stroke={C.green} strokeWidth={1} />
              <text x={midX} y={labelY + 6} textAnchor="middle" fill={C.green}
                fontSize={11} fontWeight={600}>result</text>
              <text x={midX} y={labelY + 24} textAnchor="middle" fill={C.mid}
                fontSize={10} fontFamily={TYPOGRAPHY.mono.fontFamily}>
                "Jasper: Product Hunt launch, 5K upvotes..."
              </text>
            </g>
          );
        })()}
      </g>

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={grid.center().x} y={grid.y(0.72)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The subagent read 30 articles.
        </text>
        <text x={grid.center().x} y={grid.y(0.80)} textAnchor="middle" fill={C.dark}
          fontSize={FONT_SIZE.xl} fontWeight={600} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          The main agent got 2 paragraphs.
        </text>
      </g>
    </g>
  );
};
