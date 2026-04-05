import React from 'react';
import { interpolate } from 'remotion';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { entranceSpring } from '../../../design-system/easing';
import { grid } from '../../../utils/layout';
import { C, useScene } from '../styles';

export const SupabaseScene: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('supabase');
  const pTitle = progress('show-title');
  const pNeeds = progress('show-needs');
  const pCard = progress('show-supabase-card');
  const pSelect = progress('show-select');
  const pInsert = progress('show-insert');
  const pTable = progress('show-table-result');
  const pSummary = progress('show-summary');

  const cx = grid.center().x;

  // Left: code panel
  const codeX = grid.x(0.02);
  const codeY = grid.y(0.14);
  const codeW = 680;
  const codeH = 480;

  // Right: table result
  const tableX = grid.x(0.52);
  const tableY = grid.y(0.14);
  const tableW = 640;

  const users = [
    { id: '1', name: 'Sarah Chen', email: 'sarah@acme.co', plan: 'Pro' },
    { id: '2', name: 'Jake Miller', email: 'jake@startup.io', plan: 'Free' },
    { id: '3', name: 'Ana Ruiz', email: 'ana@corp.com', plan: 'Team' },
  ];

  return (
    <g>
      {/* Title */}
      <g style={{ opacity: pTitle }}>
        <text x={cx} y={grid.y(0.03)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE['2xl']} fontWeight={700}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Database: Supabase
        </text>
      </g>

      {/* What your app needs to remember */}
      <g style={{ opacity: pNeeds }}>
        {['User accounts', 'Saved preferences', 'Order history'].map((item, i) => {
          const np = entranceSpring(frame, fps, beat('show-needs') + i * 3);
          return (
            <g key={i} style={{ opacity: np }}>
              <circle cx={grid.x(0.04) + i * 220} cy={grid.y(0.10)} r={5}
                fill={C.supabase} fillOpacity={0.5} />
              <text x={grid.x(0.04) + i * 220 + 14} y={grid.y(0.10)}
                dominantBaseline="central" fill={C.mid} fontSize={FONT_SIZE.md}>
                {item}
              </text>
            </g>
          );
        })}
      </g>

      {/* Code panel — dark bg */}
      <g style={{ opacity: pCard }}>
        <rect x={codeX} y={codeY} width={codeW} height={codeH} rx={16}
          fill={C.codeBg} stroke={C.supabase} strokeWidth={2} />
        <rect x={codeX} y={codeY + 8} width={6} height={codeH - 16} rx={3}
          fill={C.supabase} fillOpacity={0.8} />
        <text x={codeX + 28} y={codeY + 34} dominantBaseline="central"
          fill={C.supabase} fontSize={FONT_SIZE.lg} fontWeight={700}>
          Supabase SDK
        </text>
      </g>

      {/* SELECT query */}
      <g style={{ opacity: pSelect }}>
        {(() => {
          const lines = [
            { text: '// Read all users', color: C.codeGray },
            { text: 'const { data } = await supabase', color: C.codeGreen },
            { text: '  .from("users")', color: C.codeGreen },
            { text: '  .select("*");', color: C.codeGreen },
          ];
          return lines.map((line, i) => {
            const lp = entranceSpring(frame, fps, beat('show-select') + i * 3);
            return (
              <text key={`sel-${i}`} x={codeX + 28} y={codeY + 72 + i * 32}
                dominantBaseline="central" fill={line.color}
                fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.mono.fontFamily}
                style={{ opacity: lp }}>
                {line.text}
              </text>
            );
          });
        })()}
      </g>

      {/* INSERT query */}
      <g style={{ opacity: pInsert }}>
        {(() => {
          const lines = [
            { text: '// Add a new user', color: C.codeGray },
            { text: 'await supabase', color: C.codeOrange },
            { text: '  .from("users")', color: C.codeOrange },
            { text: '  .insert({', color: C.codeOrange },
            { text: '    name: "Ana Ruiz",', color: C.codePurple },
            { text: '    email: "ana@corp.com",', color: C.codePurple },
            { text: '    plan: "Team"', color: C.codePurple },
            { text: '  });', color: C.codeOrange },
          ];
          const baseY = codeY + 210;
          return lines.map((line, i) => {
            const lp = entranceSpring(frame, fps, beat('show-insert') + i * 2);
            return (
              <text key={`ins-${i}`} x={codeX + 28} y={baseY + i * 32}
                dominantBaseline="central" fill={line.color}
                fontSize={FONT_SIZE.sm} fontFamily={TYPOGRAPHY.mono.fontFamily}
                style={{ opacity: lp }}>
                {line.text}
              </text>
            );
          });
        })()}
      </g>

      {/* Table result — right side */}
      <g style={{ opacity: pTable }}>
        {(() => {
          const tp = entranceSpring(frame, fps, beat('show-table-result'));
          const slideX = interpolate(tp, [0, 1], [20, 0]);
          const rowH = 52;
          const headerH = 48;
          const tableH = headerH + users.length * rowH + 16;
          const cols = [
            { label: 'id', w: 60 },
            { label: 'name', w: 200 },
            { label: 'email', w: 220 },
            { label: 'plan', w: 100 },
          ];

          return (
            <g style={{ opacity: tp, transform: `translateX(${slideX}px)` }}>
              <rect x={tableX} y={tableY} width={tableW} height={tableH} rx={14}
                fill={C.cardFill} stroke={C.supabase} strokeWidth={2} />
              <rect x={tableX} y={tableY + 8} width={6} height={tableH - 16} rx={3}
                fill={C.supabase} fillOpacity={0.8} />

              {/* Table header label */}
              <text x={tableX + 28} y={tableY + 28} dominantBaseline="central"
                fill={C.supabase} fontSize={FONT_SIZE.lg} fontWeight={700}>
                users
              </text>
              <text x={tableX + tableW - 20} y={tableY + 28} textAnchor="end"
                dominantBaseline="central" fill={C.mid} fontSize={FONT_SIZE.sm}
                fontFamily={TYPOGRAPHY.mono.fontFamily}>
                3 rows
              </text>

              {/* Column headers */}
              {(() => {
                let colX = tableX + 24;
                return cols.map((col, ci) => {
                  const x = colX;
                  colX += col.w;
                  return (
                    <text key={`h-${ci}`} x={x} y={tableY + headerH + 20}
                      dominantBaseline="central" fill={C.mid}
                      fontSize={FONT_SIZE.xs} fontWeight={600}
                      fontFamily={TYPOGRAPHY.mono.fontFamily}>
                      {col.label}
                    </text>
                  );
                });
              })()}

              {/* Separator */}
              <line x1={tableX + 18} y1={tableY + headerH + 36}
                x2={tableX + tableW - 18} y2={tableY + headerH + 36}
                stroke={C.hairline} strokeWidth={1} />

              {/* Data rows */}
              {users.map((user, ri) => {
                const rp = entranceSpring(frame, fps, beat('show-table-result') + 6 + ri * 4);
                const ry = tableY + headerH + 44 + ri * rowH;
                let colX = tableX + 24;
                const vals = [user.id, user.name, user.email, user.plan];
                // Highlight last row if it's the inserted one
                const isNew = ri === 2 && pInsert > 0.5;
                return (
                  <g key={ri} style={{ opacity: rp }}>
                    {isNew && (
                      <rect x={tableX + 14} y={ry - 6} width={tableW - 28} height={rowH - 4} rx={6}
                        fill={C.supabaseLight} stroke={C.supabase} strokeWidth={0.5} />
                    )}
                    {vals.map((val, ci) => {
                      const x = colX;
                      colX += cols[ci].w;
                      return (
                        <text key={`r${ri}-c${ci}`} x={x} y={ry + 18}
                          dominantBaseline="central"
                          fill={isNew && ci > 0 ? C.supabase : C.dark}
                          fontSize={FONT_SIZE.sm} fontWeight={isNew ? 600 : 400}
                          fontFamily={TYPOGRAPHY.mono.fontFamily}>
                          {val}
                        </text>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          );
        })()}
      </g>

      {/* Arrow: code → table */}
      {(() => {
        const ap = pTable;
        const x1 = codeX + codeW + 8;
        const y1 = codeY + codeH / 2;
        const x2 = tableX - 8;
        const y2 = tableY + 120;
        const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const offset = interpolate(ap, [0, 1], [len, 0]);
        return (
          <g style={{ opacity: ap }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={C.supabase} strokeWidth={2} strokeLinecap="round"
              strokeDasharray={`${len}`} strokeDashoffset={offset} />
            <polyline points={`${x2 - 10},${y2 - 7} ${x2},${y2} ${x2 - 10},${y2 + 7}`}
              fill="none" stroke={C.supabase} strokeWidth={2} strokeLinecap="round" />
          </g>
        );
      })()}

      {/* Summary */}
      <g style={{ opacity: pSummary }}>
        <text x={cx} y={grid.y(0.90)} textAnchor="middle"
          fill={C.dark} fontSize={FONT_SIZE.xl} fontWeight={600}
          fontFamily={TYPOGRAPHY.heading.fontFamily}>
          Your app reads and writes. Supabase stores and serves.
        </text>
      </g>

      {/* Particles */}
      {[...Array(5)].map((_, i) => {
        const px = 240 + i * 310 + Math.sin(frame * 0.02 + i * 1.4) * 16;
        const py = 95 + Math.sin(frame * 0.016 + i * 2.2) * 20;
        return (
          <circle key={`p-${i}`} cx={px} cy={py} r={4}
            fill={C.supabase} fillOpacity={0.06 + Math.sin(frame * 0.028 + i) * 0.04} />
        );
      })}
    </g>
  );
};
