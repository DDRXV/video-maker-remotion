import { createUseScene } from '../../utils/scene';
import { getSection } from './script';
import { patchedSections } from './BackendConcepts';

export const C = {
  // Brand
  accent: '#C75B2A',
  accentLight: '#FFF3ED',
  accentMid: 'rgba(199, 91, 42, 0.12)',

  // Concept colors
  sync: '#2563eb',        // blue
  syncLight: '#dbeafe',
  async: '#16a34a',       // green
  asyncLight: '#dcfce7',
  race: '#dc2626',        // red
  raceLight: '#fee2e2',
  idempotent: '#7c3aed',  // purple
  idempotentLight: '#ede9fe',
  fault: '#0891b2',       // teal
  faultLight: '#ecfeff',

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
