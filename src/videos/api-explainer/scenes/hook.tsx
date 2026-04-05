import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const HookScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('hook');
  const pApp = progress('show-app');
  const pNeeds = progress('show-needs');
  const pServices = progress('show-services');
  const pConn = progress('show-connections');
  const pLabel = progress('show-apis-label');

  const cx = grid.center().x;

  // Your App card (center)
  const appX = cx - 120;
  const appY = grid.y(0.30);
  const appW = 240;
  const appH = 160;

  // Three needs
  const needs = [
    { label: 'Store Data', icon: 'db' },
    { label: 'Accept Payments', icon: 'pay' },
    { label: 'Go Live', icon: 'deploy' },
  ];

  // Three services
  const services = [
    { name: 'Supabase', detail: 'Database', color: C.supabase, bg: C.supabaseLight, x: grid.x(0.04), y: grid.y(0.22) },
    { name: 'Stripe', detail: 'Payments', color: C.stripe, bg: C.stripeLight, x: grid.x(0.04), y: grid.y(0.48) },
    { name: 'Vercel', detail: 'Deployment', color: C.vercel, bg: C.vercelLight, x: grid.x(0.04), y: grid.y(0.74) },
  ];
  const svcW = 320;
  const svcH = 120;

  // App on right side
  const appRX = grid.x(0.62);
  const appRY = grid.y(0.28);
  const appRW = 360;
  const appRH = 400;

  return (
    <g>
      {/* "Your App" card — right side */}
      <g style={{ opacity: pApp }}>
        <rect x={appRX} y={appRY} width={appRW} height={appRH} rx={16}
          fill={C.cardFill} stroke={C.accent} strokeWidth={2.5} />
        <rect x={appRX} y={appRY + 8} width={8} height={appRH - 16} rx={4}
          fill={C.accent} fillOpacity={0.8} />
        <text x={appRX + 32} y={appRY + 40} dominantBaseline="central"
          fill={C.accent} fontSize={FONT_SIZE['2xl']} fontWeight={700}>
          Your App
        </text>

        {/* Needs list inside the card */}
        {needs.map((need, i) => {
          const np = entranceSpring(frame, fps, beat('show-needs') + i * 5);
          const ny = appRY + 80 + i * 90;
          return (
            <g key={i} style={{ opacity: pNeeds > 0 ? np : 0 }}>
              <rect x={appRX + 24} y={ny} width={appRW - 48} height={68} rx={10}
                fill={C.accentLight} fillOpacity={0.5} stroke={C.accent} strokeWidth={0.5} />
              <circle cx={appRX + 52} cy={ny + 34} r={6}
                fill={C.accent} fillOpacity={0.4} />
              <text x={appRX + 72} y={ny + 34} dominantBaseline="central"
                fill={C.dark} fontSize={FONT_SIZE.lg} fontWeight={600}>
                {need.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Service cards — left side */}
      {services.map((svc, i) => {
        const sp = entranceSpring(frame, fps, beat('show-services') + i * 5);
        const slideX = interpolate(sp, [0, 1], [-30, 0]);
        return (
          <g key={i} style={{ opacity: pServices > 0 ? sp : 0, transform: `translateX(${slideX}px)` }}>
            <rect x={svc.x} y={svc.y} width={svcW} height={svcH} rx={14}
              fill={C.cardFill} stroke={svc.color} strokeWidth={2} />
            <rect x={svc.x} y={svc.y + 8} width={6} height={svcH - 16} rx={3}
              fill={svc.color} fillOpacity={0.8} />
            <text x={svc.x + 24} y={svc.y + 38} dominantBaseline="central"
              fill={svc.color} fontSize={FONT_SIZE.xl} fontWeight={700}>
              {svc.name}
            </text>
            <text x={svc.x + 24} y={svc.y + 72} dominantBaseline="central"
              fill={C.mid} fontSize={FONT_SIZE.md} fontWeight={500}>
              {svc.detail}
            </text>
            {/* Service internal detail */}
            <text x={svc.x + svcW - 24} y={svc.y + 55} textAnchor="end"
              dominantBaseline="central" fill={svc.color} fontSize={FONT_SIZE.sm}
              fontWeight={600} fontFamily={TYPOGRAPHY.mono.fontFamily}>
              {i === 0 ? 'PostgreSQL' : i === 1 ? 'Checkout API' : 'CI/CD'}
            </text>
          </g>
        );
      })}

      {/* Connection arrows: services → app */}
      <g style={{ opacity: pConn }}>
        {services.map((svc, i) => {
          const ap = entranceSpring(frame, fps, beat('show-connections') + i * 4);
          const x1 = svc.x + svcW + 4;
          const y1 = svc.y + svcH / 2;
          const x2 = appRX - 4;
          const y2 = appRY + 80 + i * 90 + 34;
          const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          const offset = interpolate(ap, [0, 1], [len, 0]);
          return (
            <g key={`arr-${i}`} style={{ opacity: ap }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={svc.color} strokeWidth={2} strokeLinecap="round"
                strokeDasharray={`${len}`} strokeDashoffset={offset} />
              <polyline
                points={`${x2 - 10},${y2 - 7} ${x2},${y2} ${x2 - 10},${y2 + 7}`}
                fill="none" stroke={svc.color} strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" />
              {/* "API" label on connection */}
              {(() => {
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                return (
                  <g>
                    <rect x={mx - 24} y={my - 14} width={48} height={28} rx={6}
                      fill={C.cardFill} stroke={svc.color} strokeWidth={1} />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
                      fill={svc.color} fontSize={FONT_SIZE.xs} fontWeight={700}
                      fontFamily={TYPOGRAPHY.mono.fontFamily}>
                      API
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </g>

      {/* Bottom label */}
      <g style={{ opacity: pLabel }}>
        <text x={cx} y={grid.y(0.92)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Your code talks to other people's code. Through APIs.
        </text>
      </g>

      {/* Ambient particles */}
      {[...Array(6)].map((_, i) => {
        const px = 200 + i * 280 + Math.sin(frame * 0.02 + i * 1.4) * 18;
        const py = 100 + Math.sin(frame * 0.015 + i * 2.2) * 24;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.accent} fillOpacity={0.07 + Math.sin(frame * 0.03 + i) * 0.04} />
        );
      })}
    </g>
  );
};
