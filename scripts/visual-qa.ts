/**
 * Visual QA automation — renders every beat and reports issues.
 *
 * Usage:
 *   npx tsx scripts/visual-qa.ts RAGExplainer2
 *
 * Renders a still frame at each beat of each scene,
 * then opens all frames for manual review.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';

const compositionId = process.argv[2];
if (!compositionId) {
  console.error('Usage: npx tsx scripts/visual-qa.ts <CompositionId>');
  console.error('Example: npx tsx scripts/visual-qa.ts RAGExplainer2');
  process.exit(1);
}

// Find the video directory by scanning for the composition
const videosDir = resolve('src/videos');
const { readdirSync } = require('fs');
let videoDir = '';
let scriptPath = '';

for (const d of readdirSync(videosDir)) {
  const dir = join(videosDir, d);
  const files = existsSync(dir) ? readdirSync(dir) : [];
  for (const f of files) {
    if (f.endsWith('.tsx') && !f.includes('generate') && !f.includes('styles')) {
      const content = readFileSync(join(dir, f), 'utf-8');
      if (content.includes(`${compositionId}Props`) || f.replace('.tsx', '') === compositionId) {
        videoDir = dir;
        scriptPath = join(dir, 'script.ts');
        break;
      }
    }
  }
  if (videoDir) break;
}

if (!videoDir || !existsSync(scriptPath)) {
  console.error(`Could not find video directory for composition: ${compositionId}`);
  process.exit(1);
}

console.log(`Video directory: ${videoDir}`);
console.log(`Script: ${scriptPath}`);

// Parse script to extract section IDs and beat timings
const scriptContent = readFileSync(scriptPath, 'utf-8');

// Extract sections with their durations and beats
interface ParsedSection {
  id: string;
  durationFrames: number;
  beats: { label: string; fraction: number }[];
}

const sections: ParsedSection[] = [];
const sectionBlocks = scriptContent.split(/\{\s*\n?\s*id:\s*'/);

for (const block of sectionBlocks.slice(1)) {
  const idMatch = block.match(/^([^']+)/);
  const durMatch = block.match(/durationInFrames:\s*(\d+)\s*\*\s*FPS/);
  if (!idMatch || !durMatch) continue;

  const id = idMatch[1];
  const durationFrames = parseInt(durMatch[1]) * 30; // FPS = 30

  const beats: { label: string; fraction: number }[] = [];
  const beatMatches = block.matchAll(/label:\s*'([^']+)'.*?atFraction:\s*([\d.]+)/gs);
  for (const bm of beatMatches) {
    beats.push({ label: bm[1], fraction: parseFloat(bm[2]) });
  }

  sections.push({ id, durationFrames, beats });
}

console.log(`\nFound ${sections.length} sections with ${sections.reduce((s, sec) => s + sec.beats.length, 0)} total beats\n`);

// Calculate global frame for each beat
// Note: CTA insertion shifts frames, but for static timing we just sum durations
const outDir = resolve('/tmp', `visual-qa-${compositionId}`);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

let currentStart = 0;
const framesToRender: { frame: number; section: string; beat: string; path: string }[] = [];

for (const section of sections) {
  for (const beat of section.beats) {
    const localFrame = Math.round(beat.fraction * section.durationFrames);
    const globalFrame = currentStart + localFrame;
    const fileName = `${section.id}--${beat.label}--f${globalFrame}.png`;
    framesToRender.push({
      frame: globalFrame,
      section: section.id,
      beat: beat.label,
      path: join(outDir, fileName),
    });
  }
  currentStart += section.durationFrames;
}

console.log(`Rendering ${framesToRender.length} frames to ${outDir}/\n`);

// Render each frame
let rendered = 0;
let failed = 0;

for (const { frame, section, beat, path } of framesToRender) {
  try {
    const cmd = `npx remotion still src/index.ts ${compositionId} "${path}" --frame=${frame} 2>&1`;
    const output = execSync(cmd, { timeout: 60000 }).toString();
    const success = output.includes(path) || output.includes('Rendered');
    if (success) {
      rendered++;
      process.stdout.write(`  ✓ ${section}/${beat} (frame ${frame})\n`);
    } else {
      failed++;
      process.stdout.write(`  ✗ ${section}/${beat} (frame ${frame}) — render failed\n`);
    }
  } catch (e) {
    failed++;
    process.stdout.write(`  ✗ ${section}/${beat} (frame ${frame}) — error\n`);
  }
}

console.log(`\n══════════════════════════════`);
console.log(`Rendered: ${rendered}/${framesToRender.length}`);
if (failed > 0) console.log(`Failed: ${failed}`);
console.log(`\nScreenshots saved to: ${outDir}/`);
console.log(`\nTo review, open in Finder:`);
console.log(`  open ${outDir}`);

// Try to open the directory
try {
  execSync(`open "${outDir}"`);
} catch {}
