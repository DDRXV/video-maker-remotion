import { createUseScene } from '../../utils/scene';
import { getSection } from './script';
import { patchedSections } from './BrandGuidelines';

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

  // "generic AI" colors for the anti-pattern demos
  aiBlue: '#0066FF',
  aiGradientStart: '#667eea',
  aiGradientEnd: '#764ba2',
  aiNeon: '#00d4ff',

  dark: '#1c1917',
  mid: '#57534e',
  light: '#78716c',
  hairline: '#d6d3d1',
  cardFill: '#FDFBF8',
  white: '#ffffff',

  codeBg: '#1e293b',
  codeGreen: '#4ade80',
  codeBlue: '#60a5fa',
  codeOrange: '#fb923c',
  codePurple: '#c084fc',
  codeGray: '#94a3b8',

  bg: '#FDFBF8',
  error: '#dc2626',
} as const;

const getSectionDynamic = (id: string) => {
  if (patchedSections.current) {
    const s = patchedSections.current.get(id);
    if (s) return s;
  }
  return getSection(id);
};

export const useScene = createUseScene(getSectionDynamic);
