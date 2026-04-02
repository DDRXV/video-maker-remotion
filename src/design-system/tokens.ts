export const COLORS = {
  accent: '#C75B2A',
  accentLight: 'rgba(199, 91, 42, 0.06)',
  dark: '#1c1917',
  mediumStroke: '#57534e',
  lightStroke: '#78716c',
  hairline: '#d6d3d1',
  cardFill: '#FDFBF8',
  white: '#FFFFFF',
  background: '#FDFBF8',
  success: '#16a34a',
  error: '#dc2626',
} as const;

export const TYPOGRAPHY = {
  heading: { fontFamily: 'Inter, sans-serif', fontWeight: 700 as const, fontSize: 48 },
  subheading: { fontFamily: 'Inter, sans-serif', fontWeight: 600 as const, fontSize: 32 },
  body: { fontFamily: 'Inter, sans-serif', fontWeight: 400 as const, fontSize: 24 },
  label: { fontFamily: 'Inter, sans-serif', fontWeight: 500 as const, fontSize: 18 },
  badge: { fontFamily: 'Inter, sans-serif', fontWeight: 600 as const, fontSize: 16 },
  mono: { fontFamily: 'monospace', fontWeight: 400 as const, fontSize: 18 },
} as const;

export const CANVAS = {
  width: 1920,
  height: 1080,
  fps: 30,
  margin: 80,
  cardPadding: 24,
  cardRadius: 12,
} as const;

export const s = (seconds: number) => Math.round(seconds * CANVAS.fps);

export const CONCEPT_COLORS = {
  user: '#C75B2A',
  retrieval: '#2563eb',
  embedding: '#059669',
  vectordb: '#7c3aed',
  llm: '#0891b2',
  document: '#78716c',
  response: '#16a34a',
} as const;

export const MODULE_COLORS = {
  queryConstruction: '#eab308',
  queryTranslation: '#f43f5e',
  routing: '#f97316',
  indexing: '#3b82f6',
  retrieval: '#22c55e',
  generation: '#a855f7',
} as const;

export const FONT_SIZE = {
  xs: 15, sm: 18, md: 22, lg: 26, xl: 32, '2xl': 42, '3xl': 60,
} as const;
