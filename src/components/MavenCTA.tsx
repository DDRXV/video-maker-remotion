import React from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, interpolate } from 'remotion';
import { entranceSpring } from '../design-system/easing';
import { COLORS, FONT_SIZE, CANVAS } from '../design-system/tokens';
import { grid } from '../utils/layout';

interface MavenCTAProps {
  variant: 'mid' | 'end';
}

export const MavenCTA: React.FC<MavenCTAProps> = ({ variant }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isMid = variant === 'mid';

  // Animation springs
  const cardP = entranceSpring(frame, fps, 4);
  const screenshotP = entranceSpring(frame, fps, 10);
  const textP = entranceSpring(frame, fps, 16);
  const qrP = entranceSpring(frame, fps, 22);
  const urlP = entranceSpring(frame, fps, 28);

  // Gentle float for QR code
  const qrFloat = interpolate(frame % 90, [0, 45, 90], [0, -4, 0]);

  // Layout
  const cx = CANVAS.width / 2;
  const cy = CANVAS.height / 2;

  // Card dimensions
  const cardW = 1680;
  const cardH = 820;
  const cardX = cx - cardW / 2;
  const cardY = cy - cardH / 2 + 20;

  // Screenshot area (left side) — wide enough to show full image
  const ssW = 780;
  const ssH = 520;
  const ssX = cardX + 40;
  const ssY = cardY + (cardH - ssH) / 2;

  // Right side content
  const rightX = ssX + ssW + 60;
  const rightCx = rightX + (cardW - ssW - 180) / 2;

  // QR code — large and prominent, right below the FREE badge
  const qrSize = isMid ? 300 : 340;
  const qrX = rightCx - qrSize / 2;
  const qrY = cardY + 260;

  const headline = isMid
    ? 'Want to learn this live?'
    : 'Join the next free session';

  const subhead = 'Every Friday, 12 PM EDT';

  return (
    <g>
      {/* ── Accent glow behind card ── */}
      <rect
        x={cardX - 4}
        y={cardY - 4}
        width={cardW + 8}
        height={cardH + 8}
        rx={20}
        fill="none"
        stroke={COLORS.accent}
        strokeWidth={2}
        strokeOpacity={0.15 * cardP}
      />

      {/* ── Main card ── */}
      <g style={{ opacity: cardP }}>
        <rect
          x={cardX}
          y={cardY}
          width={cardW}
          height={cardH}
          rx={16}
          fill={COLORS.cardFill}
          stroke={COLORS.hairline}
          strokeWidth={1.5}
        />

        {/* Subtle accent bar at top */}
        <rect
          x={cardX}
          y={cardY}
          width={cardW}
          height={6}
          rx={3}
          fill={COLORS.accent}
          fillOpacity={0.7}
        />
      </g>

      {/* ── Maven screenshot ── */}
      <g style={{ opacity: screenshotP }}>
        <defs>
          <clipPath id="ss-clip">
            <rect x={ssX} y={ssY} width={ssW} height={ssH} rx={12} />
          </clipPath>
        </defs>
        {/* Shadow */}
        <rect
          x={ssX + 3}
          y={ssY + 3}
          width={ssW}
          height={ssH}
          rx={12}
          fill="#000"
          fillOpacity={0.06}
        />
        {/* Border */}
        <rect
          x={ssX}
          y={ssY}
          width={ssW}
          height={ssH}
          rx={12}
          fill="none"
          stroke={COLORS.hairline}
          strokeWidth={1.5}
        />
        <image
          href={staticFile('maven-screenshot.png')}
          x={ssX}
          y={ssY}
          width={ssW}
          height={ssH}
          clipPath="url(#ss-clip)"
          preserveAspectRatio="xMinYMin meet"
        />
      </g>

      {/* ── Headline ── */}
      <g style={{ opacity: textP }}>
        <text
          x={rightCx}
          y={cardY + 120}
          textAnchor="middle"
          fill={COLORS.dark}
          fontSize={isMid ? FONT_SIZE['2xl'] : FONT_SIZE['3xl']}
          fontWeight={700}
          fontFamily="Inter, sans-serif"
        >
          {headline}
        </text>

        {/* Accent underline */}
        {(() => {
          const lineW = isMid ? 280 : 360;
          const lineX = rightCx - lineW / 2;
          const lineY = cardY + 134;
          const drawn = interpolate(textP, [0, 1], [lineW, 0]);
          return (
            <line
              x1={lineX}
              y1={lineY}
              x2={lineX + lineW}
              y2={lineY}
              stroke={COLORS.accent}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={lineW}
              strokeDashoffset={drawn}
            />
          );
        })()}

        {/* Subheadline */}
        <text
          x={rightCx}
          y={cardY + 185}
          textAnchor="middle"
          fill={COLORS.lightStroke}
          fontSize={FONT_SIZE.lg}
          fontWeight={500}
          fontFamily="Inter, sans-serif"
        >
          {subhead}
        </text>

        {/* Free badge */}
        {(() => {
          const badgeW = 100;
          const badgeH = 36;
          const badgeX = rightCx - badgeW / 2;
          const badgeY = cardY + 205;
          return (
            <g>
              <rect
                x={badgeX}
                y={badgeY}
                width={badgeW}
                height={badgeH}
                rx={badgeH / 2}
                fill={COLORS.accent}
                fillOpacity={0.1}
                stroke={COLORS.accent}
                strokeWidth={1.5}
              />
              <text
                x={rightCx}
                y={badgeY + badgeH / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={COLORS.accent}
                fontSize={FONT_SIZE.sm}
                fontWeight={700}
                fontFamily="Inter, sans-serif"
              >
                FREE
              </text>
            </g>
          );
        })()}
      </g>

      {/* ── QR Code ── */}
      <g
        style={{
          opacity: qrP,
          transform: `translateY(${qrFloat}px)`,
        }}
      >
        <defs>
          <clipPath id="qr-clip">
            <rect x={qrX} y={qrY} width={qrSize} height={qrSize} rx={12} />
          </clipPath>
        </defs>
        <rect
          x={qrX - 8}
          y={qrY - 8}
          width={qrSize + 16}
          height={qrSize + 16}
          rx={16}
          fill={COLORS.white}
          stroke={COLORS.hairline}
          strokeWidth={1.5}
        />
        <image
          href={staticFile('maven-qr.png')}
          x={qrX}
          y={qrY}
          width={qrSize}
          height={qrSize}
          clipPath="url(#qr-clip)"
          preserveAspectRatio="xMidYMid meet"
        />
        <text
          x={qrX + qrSize / 2}
          y={qrY + qrSize + 30}
          textAnchor="middle"
          fill={COLORS.lightStroke}
          fontSize={FONT_SIZE.xs}
          fontWeight={500}
          fontFamily="Inter, sans-serif"
        >
          Scan to join
        </text>
      </g>

      {/* ── URL — right below "Scan to join" ── */}
      <g style={{ opacity: urlP }}>
        <text
          x={qrX + qrSize / 2}
          y={qrY + qrSize + 54}
          textAnchor="middle"
          fill={COLORS.accent}
          fontSize={FONT_SIZE.md}
          fontWeight={600}
          fontFamily="Inter, sans-serif"
          letterSpacing={0.5}
        >
          maven.com/rajeshpeko
        </text>
      </g>
    </g>
  );
};
