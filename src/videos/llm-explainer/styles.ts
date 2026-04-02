import { createUseScene } from '../../utils/scene';
import { getSection } from './script';

// Codepup-branded palette — orange accent on white, ByteByteGo layout style
export const BBG = {
  // Primary brand
  accent: '#C75B2A',
  accentLight: '#FFF3ED',
  accentMid: 'rgba(199, 91, 42, 0.15)',
  // Secondary colors for differentiation
  blue: '#2563eb',
  blueLight: '#dbeafe',
  green: '#16a34a',
  greenLight: '#dcfce7',
  orange: '#ea580c',
  orangeLight: '#fff7ed',
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
  red: '#dc2626',
  redLight: '#fee2e2',
  teal: '#0891b2',
  tealLight: '#ecfeff',
  // Neutrals
  dark: '#1e293b',
  mid: '#475569',
  light: '#94a3b8',
  hairline: '#e2e8f0',
  cardFill: '#ffffff',
  bg: '#f8fafc',
} as const;

export const useScene = createUseScene(getSection);
