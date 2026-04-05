import { createUseScene } from '../../utils/scene';
import { getSection } from './script';
import { patchedSections } from './VoiceAgents';

export const C = {
  // Brand
  accent: '#C75B2A',
  accentLight: '#FFF3ED',
  accentMid: 'rgba(199, 91, 42, 0.12)',

  // Pipeline stages
  stt: '#2563eb',       // Speech-to-Text — blue
  sttLight: '#dbeafe',
  llm: '#7c3aed',       // LLM — purple
  llmLight: '#ede9fe',
  tts: '#0891b2',       // Text-to-Speech — teal
  ttsLight: '#ecfeff',

  // Semantic
  green: '#16a34a',
  greenLight: '#dcfce7',
  amber: '#d97706',
  amberLight: '#fef3c7',
  red: '#dc2626',
  redLight: '#fee2e2',

  // Data sources
  crm: '#0891b2',
  crmLight: '#ecfeff',
  playbook: '#d97706',
  playbookLight: '#fef3c7',
  catalog: '#16a34a',
  catalogLight: '#dcfce7',

  // Neutrals
  dark: '#1e293b',
  mid: '#475569',
  light: '#94a3b8',
  hairline: '#e2e8f0',
  cardFill: '#ffffff',

  // Code block
  codeBg: '#1e293b',
  codeGreen: '#4ade80',
  codeBlue: '#60a5fa',
  codeOrange: '#fb923c',
  codePurple: '#c084fc',
  codeGray: '#94a3b8',

  bg: '#f8fafc',
} as const;

/**
 * getSection that prefers audio-driven timing when available.
 * Falls back to the static script timing for preview without audio.
 */
const getSectionDynamic = (id: string) => {
  if (patchedSections.current) {
    const s = patchedSections.current.get(id);
    if (s) return s;
  }
  return getSection(id);
};

export const useScene = createUseScene(getSectionDynamic);
