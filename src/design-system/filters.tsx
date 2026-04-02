import React from 'react';

export const SvgFilters: React.FC = () => (
  <defs>
    <filter id="shadow-sm" x="-5%" y="-5%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1c1917" floodOpacity="0.08" />
    </filter>
    <filter id="shadow-md" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1c1917" floodOpacity="0.12" />
    </filter>
    <filter id="glow-accent" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 0.36 0 0 0  0 0 0.16 0 0  0 0 0 0.4 0" result="glow" />
      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);
