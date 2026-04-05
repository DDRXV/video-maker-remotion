import { createUseScene } from '../../utils/scene';
import { getSection } from './script';
import { patchedSections } from './RAGExplainer2';

/**
 * ByteByteGo-inspired palette.
 * Clean white background, structured blue primary, warm accents.
 */
export const C = {
  // Primary blue (ByteByteGo signature)
  blue: '#2563eb',
  blueLight: '#dbeafe',
  blueMid: 'rgba(37, 99, 235, 0.12)',

  // Module colors — muted, architectural
  queryConstruction: '#ca8a04',  // warm gold
  queryTranslation: '#e11d48',   // rose
  routing: '#ea580c',            // warm orange
  indexing: '#2563eb',           // blue
  retrieval: '#059669',          // emerald
  generation: '#7c3aed',        // purple

  // Semantic
  success: '#059669',
  error: '#dc2626',
  warning: '#d97706',

  // Neutrals — ByteByteGo uses dark navys and clean grays
  dark: '#0f172a',       // slate-900
  mid: '#475569',        // slate-600
  light: '#94a3b8',      // slate-400 (labels only, never body text)
  hairline: '#e2e8f0',   // slate-200
  cardFill: '#ffffff',
  cardStroke: '#cbd5e1',  // slate-300

  bg: '#f8fafc',          // slate-50
  white: '#ffffff',
} as const;

const getSectionDynamic = (id: string) => {
  if (patchedSections.current) {
    const s = patchedSections.current.get(id);
    if (s) return s;
  }
  return getSection(id);
};

export const useScene = createUseScene(getSectionDynamic);
