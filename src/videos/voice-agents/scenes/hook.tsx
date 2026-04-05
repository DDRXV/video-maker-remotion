import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring, pulse } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';
import { ChatBubble } from '../../../components/ChatBubble';
import { WaveformBar } from '../../../components/WaveformBar';

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');
  const pRing = progress('show-phone-ring');
  const pIntro = progress('show-agent-intro');
  const pObjection = progress('show-customer-objection');
  const pLookup = progress('show-agent-crm-lookup');
  const pResponse = progress('show-agent-response');
  const pClose = progress('show-customer-close');
  const pDeal = progress('show-deal-closed');

  const dealDim = interpolate(pDeal, [0, 1], [1, 0.15]);

  // Phone UI frame
  const phoneX = grid.x(0.12);
  const phoneY = grid.y(0.02);
  const phoneW = 680;
  const phoneH = 820;

  // Call metadata panel (right side)
  const metaX = grid.x(0.58);
  const metaY = grid.y(0.08);

  return (
    <g>
      {/* Phone call UI container */}
      <g style={{ opacity: pRing * dealDim }}>
        <rect x={phoneX} y={phoneY} width={phoneW} height={phoneH} rx={20}
          fill={C.cardFill} stroke={C.hairline} strokeWidth={2} />
        {/* Call header bar */}
        <rect x={phoneX} y={phoneY} width={phoneW} height={64} rx={20}
          fill={C.dark} />
        <rect x={phoneX} y={phoneY + 44} width={phoneW} height={20}
          fill={C.dark} />
        <circle cx={phoneX + 32} cy={phoneY + 32} r={8} fill={C.green} fillOpacity={pulse(frame, 40, 0.5, 1)} />
        <text x={phoneX + 50} y={phoneY + 32} dominantBaseline="central"
          fill="#ffffff" fontSize={FONT_SIZE.md} fontWeight={600}>
          Active Call  00:{Math.min(90, Math.floor(frame / 2)).toString().padStart(2, '0')}
        </text>
        <text x={phoneX + phoneW - 24} y={phoneY + 32} dominantBaseline="central"
          textAnchor="end" fill={C.codeGray} fontSize={FONT_SIZE.sm}>
          +1 (415) 555-0142
        </text>

        {/* Waveform visualization */}
        <WaveformBar
          x={phoneX + 24} y={phoneY + 78} width={phoneW - 48} height={40}
          color={C.accent} enterAt={beat('show-phone-ring') + 8}
          frame={frame} fps={fps} barCount={32}
          active={pDeal < 0.5}
        />
      </g>

      {/* Chat transcript area */}
      <g style={{ opacity: dealDim }}>
        {/* Agent intro */}
        <ChatBubble
          x={phoneX + 24} y={phoneY + 140}
          text="Hi, this is Sarah from Acme. I saw you were looking at our enterprise plan."
          sender="left" color={C.accent} bgColor={C.accentLight}
          enterAt={beat('show-agent-intro')} frame={frame} fps={fps}
          maxWidth={480} fontSize={FONT_SIZE.md}
          label="Sarah" labelColor={C.accent}
        />

        {/* Customer objection */}
        <ChatBubble
          x={phoneX + phoneW - 24} y={phoneY + 240}
          text="Yeah, but the pricing feels steep for what we need."
          sender="right" color={C.mid} bgColor="#f1f5f9"
          enterAt={beat('show-customer-objection')} frame={frame} fps={fps}
          maxWidth={440} fontSize={FONT_SIZE.md}
          label="Customer" labelColor={C.mid}
        />

        {/* CRM lookup indicator */}
        {(() => {
          const lp = entranceSpring(frame, fps, beat('show-agent-crm-lookup'));
          return (
            <g style={{ opacity: lp }}>
              <rect x={phoneX + 24} y={phoneY + 340} width={280} height={36} rx={18}
                fill={C.sttLight} stroke={C.stt} strokeWidth={1} />
              <circle cx={phoneX + 44} cy={phoneY + 358} r={6}
                fill={C.stt} fillOpacity={pulse(frame, 30, 0.4, 1)} />
              <text x={phoneX + 60} y={phoneY + 358} dominantBaseline="central"
                fill={C.stt} fontSize={FONT_SIZE.xs} fontWeight={600} fontFamily={TYPOGRAPHY.mono.fontFamily}>
                Pulling CRM data...
              </text>
            </g>
          );
        })()}

        {/* Agent data-driven response */}
        <ChatBubble
          x={phoneX + 24} y={phoneY + 396}
          text="You're spending $4,200/mo on three separate tools. Our annual plan replaces all three at $2,800/mo."
          sender="left" color={C.accent} bgColor={C.accentLight}
          enterAt={beat('show-agent-response')} frame={frame} fps={fps}
          maxWidth={520} fontSize={FONT_SIZE.md}
          label="Sarah" labelColor={C.accent}
        />

        {/* Customer closes */}
        <ChatBubble
          x={phoneX + phoneW - 24} y={phoneY + 530}
          text="OK, that makes sense. Let's go with the annual plan."
          sender="right" color={C.mid} bgColor="#f1f5f9"
          enterAt={beat('show-customer-close')} frame={frame} fps={fps}
          maxWidth={440} fontSize={FONT_SIZE.md}
          label="Customer" labelColor={C.mid}
        />
      </g>

      {/* Right side: call metadata */}
      <g style={{ opacity: pLookup * dealDim }}>
        {(() => {
          const mp = entranceSpring(frame, fps, beat('show-agent-crm-lookup') + 4);
          const rows = [
            { label: 'Account', value: 'TechCorp Inc.' },
            { label: 'Current Spend', value: '$4,200/mo' },
            { label: 'Tools', value: 'Slack, Zoom, Notion' },
            { label: 'Renewal', value: 'Apr 15, 2026' },
            { label: 'Deal Stage', value: 'Negotiation' },
          ];
          return (
            <g style={{ opacity: mp }}>
              <rect x={metaX} y={metaY} width={360} height={280} rx={14}
                fill={C.cardFill} stroke={C.stt} strokeWidth={1.5} />
              <rect x={metaX} y={metaY} width={360} height={48} rx={14}
                fill={C.sttLight} />
              <rect x={metaX} y={metaY + 28} width={360} height={20}
                fill={C.sttLight} />
              <text x={metaX + 20} y={metaY + 28} dominantBaseline="central"
                fill={C.stt} fontSize={FONT_SIZE.md} fontWeight={700}>
                CRM Lookup
              </text>
              {rows.map((row, i) => {
                const rp = entranceSpring(frame, fps, beat('show-agent-crm-lookup') + 8 + i * 3);
                const ry = metaY + 64 + i * 40;
                return (
                  <g key={i} style={{ opacity: rp }}>
                    <text x={metaX + 20} y={ry + 10} dominantBaseline="central"
                      fill={C.mid} fontSize={FONT_SIZE.sm} fontWeight={500}>
                      {row.label}
                    </text>
                    <text x={metaX + 340} y={ry + 10} dominantBaseline="central"
                      textAnchor="end" fill={C.dark} fontSize={FONT_SIZE.md} fontWeight={600}>
                      {row.value}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })()}
      </g>

      {/* Deal closed overlay — full canvas takeover */}
      <g style={{ opacity: pDeal }}>
        {/* Frosted backdrop */}
        <rect x={0} y={0} width={1920} height={1080}
          fill={C.bg} fillOpacity={0.92} />

        {/* Minimal check circle */}
        {(() => {
          const cx = grid.center().x;
          const cy = grid.y(0.30);
          const r = 44;
          const checkPath = `M${cx - 16},${cy + 2} L${cx - 4},${cy + 14} L${cx + 18},${cy - 10}`;
          return (
            <g>
              <circle cx={cx} cy={cy} r={r}
                fill="none" stroke={C.green} strokeWidth={2.5} />
              <path d={checkPath} fill="none" stroke={C.green}
                strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })()}

        <text x={grid.center().x} y={grid.y(0.44)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['3xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Deal closed
        </text>

        {/* Stats row */}
        {(() => {
          const stats = [
            { value: '90s', label: 'Call duration' },
            { value: '$2,800', label: 'Monthly contract' },
            { value: '1', label: 'Phone call' },
          ];
          const statW = 280;
          const totalW = stats.length * statW;
          const startX = grid.center().x - totalW / 2;
          const sy = grid.y(0.56);
          return stats.map((stat, i) => {
            const sx = startX + i * statW;
            return (
              <g key={i}>
                <text x={sx + statW / 2} y={sy} textAnchor="middle"
                  fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}>
                  {stat.value}
                </text>
                <text x={sx + statW / 2} y={sy + 36} textAnchor="middle"
                  fill={C.mid} fontSize={FONT_SIZE.md} fontWeight={500}>
                  {stat.label}
                </text>
              </g>
            );
          });
        })()}

        {/* Thin divider line between stats */}
        {[1, 2].map(i => {
          const statW = 280;
          const startX = grid.center().x - (3 * statW) / 2;
          const lx = startX + i * statW;
          return (
            <line key={`div-${i}`} x1={lx} y1={grid.y(0.53)} x2={lx} y2={grid.y(0.62)}
              stroke={C.hairline} strokeWidth={1} />
          );
        })}
      </g>

      {/* Ambient particles */}
      {[...Array(5)].map((_, i) => {
        const px = 300 + i * 300 + Math.sin(frame * 0.02 + i * 1.3) * 18;
        const py = 120 + Math.sin(frame * 0.016 + i * 2.1) * 24;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.06 + Math.sin(frame * 0.025 + i) * 0.04} />
        );
      })}
    </g>
  );
};
