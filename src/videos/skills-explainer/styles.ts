import { createUseScene } from '../../utils/scene';
import { getSection } from './script';

// Codepup orange brand palette
export const C = {
  accent: '#C75B2A',
  accentLight: '#FFF3ED',
  accentMid: 'rgba(199, 91, 42, 0.12)',
  blue: '#2563eb',
  blueLight: '#dbeafe',
  green: '#16a34a',
  greenLight: '#dcfce7',
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
  teal: '#0891b2',
  tealLight: '#ecfeff',
  amber: '#d97706',
  amberLight: '#fef3c7',
  dark: '#1e293b',
  mid: '#475569',
  light: '#94a3b8',
  hairline: '#e2e8f0',
  cardFill: '#ffffff',
  codeBg: '#1e293b',
  codeGreen: '#4ade80',
  codeBlue: '#60a5fa',
  codeOrange: '#fb923c',
  codePurple: '#c084fc',
  codeGray: '#94a3b8',
  bg: '#f8fafc',
} as const;

export const useScene = createUseScene(getSection);
