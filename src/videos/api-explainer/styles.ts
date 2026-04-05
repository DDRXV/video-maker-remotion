import { createUseScene } from '../../utils/scene';
import { getSection } from './script';
import { patchedSections } from './APIExplainer';

export const C = {
  // Brand
  accent: '#C75B2A',
  accentLight: '#FFF3ED',
  accentMid: 'rgba(199, 91, 42, 0.12)',

  // Services
  supabase: '#3ECF8E',
  supabaseLight: '#ecfdf5',
  stripe: '#635BFF',
  stripeLight: '#eef2ff',
  vercel: '#171717',
  vercelLight: '#f5f5f5',

  // Technical
  api: '#2563eb',
  apiLight: '#dbeafe',
  sdk: '#7c3aed',
  sdkLight: '#ede9fe',
  http: '#d97706',
  httpLight: '#fef3c7',

  // Semantic
  green: '#16a34a',
  greenLight: '#dcfce7',
  amber: '#d97706',
  amberLight: '#fef3c7',
  red: '#dc2626',
  redLight: '#fee2e2',

  // Neutrals
  dark: '#1e293b',
  mid: '#475569',
  light: '#94a3b8',
  hairline: '#e2e8f0',
  cardFill: '#ffffff',

  // Code
  codeBg: '#1e293b',
  codeGreen: '#4ade80',
  codeBlue: '#60a5fa',
  codeOrange: '#fb923c',
  codePurple: '#c084fc',
  codeGray: '#94a3b8',

  bg: '#f8fafc',
} as const;

const getSectionDynamic = (id: string) => {
  if (patchedSections.current) {
    const s = patchedSections.current.get(id);
    if (s) return s;
  }
  return getSection(id);
};

export const useScene = createUseScene(getSectionDynamic);
