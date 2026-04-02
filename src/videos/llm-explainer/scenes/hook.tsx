import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { BBG, useScene } from '../styles';

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');

  const pPrompt = progress('show-prompt');
  const pResponse = progress('show-response');
  const pNoUnderstanding = progress('show-no-understanding');
  const pGpus = progress('show-gpus');
  const pCta = progress('show-cta');

  // Chat UI mockup
  const chatX = grid.x(0.15);
  const chatW = grid.x(0.7);
  const chatTop = grid.y(0.12);

  // Dim chat when GPUs appear
  const chatDim = interpolate(pGpus, [0, 1], [1, 0.2]);

  return (
    <g>
      {/* Chat container */}
      <g style={{ opacity: pPrompt * chatDim }}>
        <rect x={chatX} y={chatTop} width={chatW} height={grid.y(0.7)} rx={16}
          fill={BBG.cardFill} stroke={BBG.hairline} strokeWidth={2} />

        {/* Header bar */}
        <rect x={chatX} y={chatTop} width={chatW} height={50} rx={16} fill={BBG.blue} />
        <rect x={chatX} y={chatTop + 34} width={chatW} height={16} fill={BBG.blue} />
        <circle cx={chatX + 24} cy={chatTop + 25} r={6} fill="rgba(255,255,255,0.3)" />
        <circle cx={chatX + 42} cy={chatTop + 25} r={6} fill="rgba(255,255,255,0.3)" />
        <text x={chatX + chatW / 2} y={chatTop + 30} textAnchor="middle" fill="#fff"
          fontSize={FONT_SIZE.md} fontWeight={600} fontFamily={TYPOGRAPHY.label.fontFamily}>
          ChatGPT
        </text>

        {/* User prompt bubble */}
        <g style={{ opacity: pPrompt }}>
          {(() => {
            const bx = chatX + chatW - 380;
            const by = chatTop + 80;
            return (
              <g>
                <rect x={bx} y={by} width={340} height={56} rx={20} fill={BBG.blue} />
                <text x={bx + 170} y={by + 32} textAnchor="middle" fill="#fff"
                  fontSize={FONT_SIZE.sm} fontWeight={500} fontFamily={TYPOGRAPHY.label.fontFamily}>
                  How does a neural network learn?
                </text>
              </g>
            );
          })()}
        </g>

        {/* AI response bubble — typing then appearing */}
        <g style={{ opacity: pResponse }}>
          {(() => {
            const bx = chatX + 40;
            const by = chatTop + 160;
            const lines = [
              'A neural network learns through a process called',
              'backpropagation. During training, the network makes',
              'predictions, compares them to expected outputs, and',
              'adjusts its internal parameters to reduce errors...',
            ];
            const lineH = 28;
            return (
              <g>
                <rect x={bx} y={by} width={480} height={lines.length * lineH + 24} rx={20}
                  fill={BBG.blueLight} stroke={BBG.hairline} strokeWidth={1} />
                {lines.map((line, i) => {
                  const lp = entranceSpring(frame, fps, beat('show-response') + i * 4);
                  return (
                    <text key={i} x={bx + 20} y={by + 28 + i * lineH}
                      fill={BBG.dark} fontSize={FONT_SIZE.xs} fontFamily={TYPOGRAPHY.body.fontFamily}
                      style={{ opacity: lp }}>
                      {line}
                    </text>
                  );
                })}
              </g>
            );
          })()}
        </g>
      </g>

      {/* "No understanding" cross-out / reveal — dims when GPUs appear */}
      <g style={{ opacity: pNoUnderstanding * chatDim }}>
        {(() => {
          const cx = grid.center().x;
          const cy = grid.y(0.5);
          const lineW = interpolate(pNoUnderstanding, [0, 1], [0, 400]);
          return (
            <g>
              <rect x={cx - 310} y={cy - 40} width={620} height={80} rx={12}
                fill={BBG.cardFill} stroke={BBG.red} strokeWidth={2} />
              <text x={cx} y={cy + 8} textAnchor="middle" fill={BBG.dark}
                fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
                No understanding happening
              </text>
              <line x1={cx - lineW / 2} y1={cy} x2={cx + lineW / 2} y2={cy}
                stroke={BBG.red} strokeWidth={3} strokeLinecap="round" />
            </g>
          );
        })()}
      </g>

      {/* GPU visualization */}
      <g style={{ opacity: pGpus }}>
        <text x={grid.center().x} y={grid.y(0.18)} textAnchor="middle" fill={BBG.dark}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          A math problem across thousands of GPUs
        </text>

        {/* GPU grid — 4x3 of small rectangles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const gx = grid.x(0.2) + col * 160;
          const gy = grid.y(0.32) + row * 120;
          const delay = beat('show-gpus') + i * 2;
          const gp = entranceSpring(frame, fps, delay);
          const slideY = interpolate(gp, [0, 1], [20, 0]);
          return (
            <g key={i} style={{ opacity: gp, transform: `translateY(${slideY}px)` }}>
              <rect x={gx} y={gy} width={130} height={90} rx={8}
                fill={BBG.cardFill} stroke={BBG.accent} strokeWidth={1.5} />
              {/* chip lines */}
              <rect x={gx + 20} y={gy + 15} width={90} height={10} rx={2} fill={BBG.accentLight} />
              <rect x={gx + 20} y={gy + 32} width={70} height={10} rx={2} fill={BBG.accentLight} />
              <rect x={gx + 20} y={gy + 49} width={80} height={10} rx={2} fill={BBG.accentLight} />
              {/* small LED */}
              <circle cx={gx + 14} cy={gy + 20} r={4} fill={BBG.green} />
            </g>
          );
        })}

        {/* Data flow lines between GPUs */}
        {[0, 1, 2].map(row => (
          <g key={`flow-${row}`} style={{ opacity: pGpus * 0.4 }}>
            {[0, 1, 2].map(col => {
              const x1 = grid.x(0.2) + col * 160 + 130;
              const x2 = grid.x(0.2) + (col + 1) * 160;
              const y = grid.y(0.32) + row * 120 + 45;
              return (
                <line key={col} x1={x1} y1={y} x2={x2} y2={y}
                  stroke={BBG.accent} strokeWidth={1} strokeDasharray="4 3" />
              );
            })}
          </g>
        ))}
      </g>

      {/* CTA text */}
      <g style={{ opacity: pCta }}>
        <text x={grid.center().x} y={grid.y(0.88)} textAnchor="middle" fill={BBG.accent}
          fontSize={FONT_SIZE.xl} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Let me show you how.
        </text>
      </g>
    </g>
  );
};
