/**
 * Video scaffold generator — creates a complete video directory with premium patterns.
 *
 * Usage:
 *   npx tsx scripts/new-video.ts "My Topic" --scenes 6
 *   npx tsx scripts/new-video.ts "API Gateway" --scenes 4
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);
const title = args.find(a => !a.startsWith('--')) || '';
const scenesArg = args.find(a => a.startsWith('--scenes='));
const sceneCount = scenesArg ? parseInt(scenesArg.split('=')[1]) : 6;

if (!title) {
  console.error('Usage: npx tsx scripts/new-video.ts "Video Title" --scenes=6');
  process.exit(1);
}

// Derive names
const kebab = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const pascal = title.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
const dir = resolve('src/videos', kebab);

if (existsSync(dir)) {
  console.error(`Directory already exists: ${dir}`);
  process.exit(1);
}

console.log(`Creating video: "${title}"`);
console.log(`  Directory: src/videos/${kebab}/`);
console.log(`  Component: ${pascal}`);
console.log(`  Scenes: ${sceneCount}`);

mkdirSync(resolve(dir, 'scenes'), { recursive: true });

// Generate scene IDs
const sceneIds = Array.from({ length: sceneCount }, (_, i) => {
  if (i === 0) return 'intro';
  if (i === sceneCount - 1) return 'recap';
  return `scene-${String(i).padStart(2, '0')}`;
});

// ── script.ts ──
const scriptContent = `import { CANVAS } from '../../design-system/tokens';

const FPS = CANVAS.fps;

export interface Beat { label: string; atFraction: number; }
export interface ScriptSection {
  id: string;
  title: string;
  narration: string;
  beats: Beat[];
  startFrame: number;
  durationInFrames: number;
}

const sections: ScriptSection[] = [
${sceneIds.map((id, i) => `  {
    id: '${id}', title: 'TODO: ${id}',
    narration: 'TODO: Write narration for this scene.',
    startFrame: ${i * 40} * FPS, durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-content', atFraction: 0.15 },
      { label: 'show-detail', atFraction: 0.45 },
      { label: 'show-summary', atFraction: 0.85 },
    ],
  },`).join('\n')}
];

/** Apply audio-driven durations. Called from calculateMetadata. */
export function applyAudioDurations(audioDurations: number[]): ScriptSection[] {
  let startFrame = 0;
  return sections.map((sec, i) => {
    const durationInFrames = Math.ceil(audioDurations[i] * FPS) + Math.round(0.5 * FPS);
    const updated = { ...sec, startFrame, durationInFrames };
    startFrame += durationInFrames;
    return updated;
  });
}

export const script = sections;
export const sectionIds = sections.map(s => s.id);
export const totalDuration = sections.reduce((sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames), 0);
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(\`Section "\${id}" not found\`); return s; };
`;
writeFileSync(resolve(dir, 'script.ts'), scriptContent);

// ── styles.ts ──
const stylesContent = `import { createUseScene } from '../../utils/scene';
import { getSection } from './script';
import { patchedSections } from './${pascal}';

/**
 * Video-specific palette. Muted, professional tones.
 * Customize these for your video's visual identity.
 */
export const C = {
  // Primary accent
  brand: '#C75B2A',
  brandLight: '#D4A574',

  // Concept colors (customize per video)
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#166534',
  warning: '#92400e',
  error: '#991b1b',

  // Neutrals
  text: '#1c1917',
  textMid: '#57534e',
  textLight: '#78716c',
  stroke: '#a8a29e',
  hairline: '#d6d3d1',
  card: '#FFFFFF',
  bg: '#FDFBF8',
} as const;

const getSectionDynamic = (id: string) => {
  if (patchedSections.current) {
    const s = patchedSections.current.get(id);
    if (s) return s;
  }
  return getSection(id);
};

export const useScene = createUseScene(getSectionDynamic);
`;
writeFileSync(resolve(dir, 'styles.ts'), stylesContent);

// ── Composition file ──
const compContent = `import React from 'react';
import { AbsoluteFill, Sequence, staticFile, CalculateMetadataFunction } from 'remotion';
import { Audio } from '@remotion/media';
import { CANVAS } from '../../design-system/tokens';
import { script, sectionIds, applyAudioDurations, ScriptSection } from './script';
import { Background } from '../../components/Background';
import { SvgFilters } from '../../design-system/filters';
import { C } from './styles';
import { getAudioDuration } from '../../utils/audio-duration';
import { Watermark } from '../../components/Watermark';
import { MavenCTAScene } from '../../components/MavenCTAScene';
import { withCTASections, CTA_TOTAL_FRAMES } from '../../utils/withCTA';
${sceneIds.map((id, i) => {
  const compName = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Scene';
  const fileName = id.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return `import { ${compName} } from './scenes/${fileName}';`;
}).join('\n')}

const sceneComponents: Record<string, React.FC> = {
${sceneIds.map(id => {
  const compName = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Scene';
  return `  '${id}': ${compName},`;
}).join('\n')}
};

export interface ${pascal}Props {
  sections: ScriptSection[];
  hasAudio: boolean;
}

const SceneCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={\`0 0 \${CANVAS.width} \${CANVAS.height}\`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <SvgFilters />
      <Background pattern="dots" opacity={0.03} />
      {children}
      <Watermark />
    </svg>
  </AbsoluteFill>
);

export const ${kebab.replace(/-(\w)/g, (_, c) => c.toUpperCase())}CalculateMetadata: CalculateMetadataFunction<${pascal}Props> = async () => {
  try {
    const durations = await Promise.all(
      sectionIds.map((id) =>
        getAudioDuration(staticFile(\`voiceover/${kebab}/\${id}.mp3\`))
      )
    );
    const sections = applyAudioDurations(durations);
    const totalDuration = sections.reduce(
      (sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames),
      0
    );
    return {
      durationInFrames: totalDuration + CTA_TOTAL_FRAMES,
      props: { sections, hasAudio: true },
    };
  } catch {
    return {
      props: { sections: script, hasAudio: false },
    };
  }
};

export const ${pascal}: React.FC<${pascal}Props> = ({ sections, hasAudio }) => {
  const sectionMap = new Map(sections.map((s) => [s.id, s]));
  patchedSections.current = sectionMap;

  const allSections = withCTASections(sections);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: 'Inter, sans-serif' }}>
      {allSections.map(({ id, startFrame, durationInFrames, title }) => {
        if (id === 'mid-cta' || id === 'end-cta') {
          return (
            <Sequence key={id} from={startFrame} durationInFrames={durationInFrames} name={title}>
              <MavenCTAScene variant={id === 'mid-cta' ? 'mid' : 'end'} />
            </Sequence>
          );
        }
        const Component = sceneComponents[id];
        if (!Component) return null;
        return (
          <Sequence
            key={id}
            from={startFrame}
            durationInFrames={durationInFrames}
            name={title}
            premountFor={30}
          >
            <SceneCanvas><Component /></SceneCanvas>
            {hasAudio && (
              <Audio src={staticFile(\`voiceover/${kebab}/\${id}.mp3\`)} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const patchedSections = { current: null as Map<string, ScriptSection> | null };
`;
writeFileSync(resolve(dir, `${pascal}.tsx`), compContent);

// ── generate-voiceover.ts ──
const voiceoverContent = `/**
 * Generate voiceover audio files from script narration using OpenAI TTS.
 *
 * Usage:
 *   npx tsx src/videos/${kebab}/generate-voiceover.ts
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { script } from './script';
import OpenAI from 'openai';

const envPath = resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\\n')) {
    const match = line.match(/^(\\w+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

const VOICE = 'ash';
const MODEL = 'gpt-4o-mini-tts';
const OUTPUT_DIR = 'public/voiceover/${kebab}';
const INSTRUCTIONS = 'Speak like a senior technical PM presenting to a smart audience. Confident, clear, and engaging. Moderate pace with slight emphasis on key technical terms. Conversational but authoritative.';

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { console.error('Set OPENAI_API_KEY environment variable.'); process.exit(1); }

  const openai = new OpenAI({ apiKey });
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const section of script) {
    const outPath = \`\${OUTPUT_DIR}/\${section.id}.mp3\`;
    if (existsSync(outPath)) { console.log(\`  skip  \${section.id} (already exists)\`); continue; }
    console.log(\`  gen   \${section.id} (\${section.narration.length} chars)\`);
    const response = await openai.audio.speech.create({
      model: MODEL, voice: VOICE, input: section.narration,
      instructions: INSTRUCTIONS, response_format: 'mp3',
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(outPath, buffer);
    console.log(\`  done  \${outPath} (\${(buffer.length / 1024).toFixed(0)} KB)\`);
  }
  console.log('\\nAll voiceover files generated.');
}

main().catch((err) => { console.error('Generation failed:', err.message); process.exit(1); });
`;
writeFileSync(resolve(dir, 'generate-voiceover.ts'), voiceoverContent);

// ── Scene stubs ──
sceneIds.forEach((id) => {
  const compName = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Scene';
  const fileName = id.replace(/-(\w)/g, (_, c) => c.toUpperCase());

  const sceneContent = `import React from 'react';
import { useScene, C } from '../styles';
import { grid } from '../../../utils/layout';
import { FONT_SIZE, TYPOGRAPHY } from '../../../design-system/tokens';
import { TextBox } from '../../../components/TextBox';
import { FloatingParticles, PulseRing, DashedOrbit, GlowHalo } from '../../../scene-templates';

/**
 * ${compName} — TODO: describe this scene.
 *
 * Premium checklist:
 * - [ ] Shapes match function (no circles)
 * - [ ] 3-5 elements max visible at once
 * - [ ] All text >= 14px (12px for monospace only)
 * - [ ] All arrows horizontal between same-height elements
 * - [ ] Text fits within containers (calculated pixel width)
 * - [ ] Floating particles in background
 * - [ ] Pulsing ring on active element
 * - [ ] 3 animation curves used (snappy, bouncy, gentle)
 */

export const ${compName}: React.FC = () => {
  const { beat, progress, frame, fps } = useScene('${id}');

  const pTitle = progress('show-title');
  const pContent = progress('show-content');
  const pDetail = progress('show-detail');
  const pSummary = progress('show-summary');

  return (
    <g>
      <FloatingParticles color={C.brand} />

      {/* TODO: Build scene content here */}
      <g style={{ opacity: pTitle }}>
        <text x={grid.center().x} y={grid.y(0.04)} textAnchor="middle" fill={C.text}
          fontSize={FONT_SIZE['2xl']} fontWeight={700} fontFamily={TYPOGRAPHY.heading.fontFamily}>
          TODO: ${id}
        </text>
      </g>

      <TextBox
        x={grid.x(0.06)} y={grid.y(0.92)} maxWidth={grid.x(0.88)}
        fontSize={FONT_SIZE.xl} fontWeight={600} color={C.textMid}
        enterAt={beat('show-summary')} align="center">
        TODO: Summary text for this scene.
      </TextBox>
    </g>
  );
};
`;
  writeFileSync(resolve(dir, 'scenes', `${fileName}.tsx`), sceneContent);
});

console.log(`\n✓ Scaffold created at src/videos/${kebab}/`);
console.log(`\nNext steps:`);
console.log(`  1. Edit script.ts — write narration + beat structure`);
console.log(`  2. Build scenes in scenes/ — use scene-templates components`);
console.log(`  3. Register in src/Root.tsx`);
console.log(`  4. Run: npx tsx src/videos/${kebab}/generate-voiceover.ts`);
console.log(`  5. Run: npx tsx scripts/validate-video.ts ${pascal}`);
console.log(`  6. Preview: npx remotion preview`);
`;
writeFileSync(resolve('scripts', 'new-video.ts'), scriptContent);
// Wait, that's wrong. The whole thing above IS the script. Let me fix.
`;

// The script content is already in this file — it executes directly.
console.log(`\n✓ Scaffold created at src/videos/${kebab}/`);
console.log(`\nNext steps:`);
console.log(`  1. Edit script.ts — write narration + beat structure`);
console.log(`  2. Build scenes in scenes/ — use scene-templates components`);
console.log(`  3. Register in src/Root.tsx`);
console.log(`  4. Run: npx tsx src/videos/${kebab}/generate-voiceover.ts`);
console.log(`  5. Preview: npx remotion preview`);
