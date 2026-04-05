/**
 * Pre-render validation — catches structural bugs before rendering.
 *
 * Usage:
 *   npx tsx scripts/validate-video.ts RAGExplainer2
 *   npx tsx scripts/validate-video.ts   (validates all videos)
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const videosDir = resolve('src/videos');
const target = process.argv[2]; // optional: specific video composition name

interface Issue {
  file: string;
  line?: number;
  severity: 'error' | 'warn';
  message: string;
}

const issues: Issue[] = [];

function addIssue(file: string, severity: 'error' | 'warn', message: string, line?: number) {
  issues.push({ file, severity, message, line });
}

function validateVideoDir(dirName: string) {
  const dir = join(videosDir, dirName);
  if (!existsSync(dir)) return;

  console.log(`\n── Validating: ${dirName} ──`);

  // 1. Check script.ts exists
  const scriptPath = join(dir, 'script.ts');
  if (!existsSync(scriptPath)) {
    addIssue(scriptPath, 'error', 'script.ts not found');
    return;
  }

  const scriptContent = readFileSync(scriptPath, 'utf-8');

  // 1a. Check beat fractions
  const beatMatches = scriptContent.matchAll(/atFraction:\s*([\d.]+)/g);
  for (const m of beatMatches) {
    const frac = parseFloat(m[1]);
    if (frac > 0.95) {
      addIssue(scriptPath, 'warn', `Beat at fraction ${frac} is very late — may not have time to render before scene ends`);
    }
  }

  // 1b. Check for duplicate section IDs
  const idMatches = [...scriptContent.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
  const duplicates = idMatches.filter((id, i) => idMatches.indexOf(id) !== i);
  if (duplicates.length > 0) {
    addIssue(scriptPath, 'error', `Duplicate section IDs: ${duplicates.join(', ')}`);
  }

  // 1c. Check sections have at least 2 beats
  const sectionBlocks = scriptContent.split(/\{\s*id:/);
  for (const block of sectionBlocks.slice(1)) {
    const idMatch = block.match(/^'([^']+)'/);
    const beatCount = (block.match(/atFraction/g) || []).length;
    if (idMatch && beatCount < 2) {
      addIssue(scriptPath, 'warn', `Section '${idMatch[1]}' has only ${beatCount} beat(s) — needs at least 2`);
    }
  }

  // 1d. Check narration length vs duration
  const narrationMatches = [...scriptContent.matchAll(/narration:\s*`([^`]+)`/g)];
  const durationMatches = [...scriptContent.matchAll(/durationInFrames:\s*(\d+)\s*\*\s*FPS/g)];
  narrationMatches.forEach((nm, i) => {
    const wordCount = nm[1].split(/\s+/).length;
    const durationSec = durationMatches[i] ? parseInt(durationMatches[i][1]) : 0;
    if (durationSec > 0) {
      const expectedSec = wordCount / 2.5; // ~150 words/min
      if (expectedSec > durationSec * 1.3) {
        addIssue(scriptPath, 'warn', `Section ${i}: narration (${wordCount} words, ~${Math.round(expectedSec)}s) may exceed duration (${durationSec}s)`);
      }
    }
  });

  // 2. Check scene files
  const scenesDir = join(dir, 'scenes');
  if (!existsSync(scenesDir)) {
    addIssue(scenesDir, 'error', 'scenes/ directory not found');
    return;
  }

  const sceneFiles = readdirSync(scenesDir).filter(f => f.endsWith('.tsx'));
  for (const sceneFile of sceneFiles) {
    if (sceneFile.startsWith('_')) continue; // skip templates
    const scenePath = join(scenesDir, sceneFile);
    const content = readFileSync(scenePath, 'utf-8');
    const lines = content.split('\n');

    // 2a. Font size check — flag anything < 14 (allow 12 for monospace, 10-11 for labels inside mini-illustrations)
    lines.forEach((line, i) => {
      const fontMatch = line.match(/fontSize[=:{]\s*(\d+)/);
      if (fontMatch) {
        const size = parseInt(fontMatch[1]);
        if (size < 12) {
          // Check if it's inside a mini-illustration (View 5, icon, etc.) — allow down to 6
          const isMiniIllustration = line.includes('icon') || line.includes('mini') || line.includes('View5');
          if (!isMiniIllustration) {
            addIssue(scenePath, 'warn', `Font size ${size}px on line ${i + 1} — minimum 12px for readability`, i + 1);
          }
        }
      }
    });

    // 2b. Check for extrapolateRight clamp on interpolate
    lines.forEach((line, i) => {
      if (line.includes('interpolate(') && !line.includes('clamp') && !line.includes('oscillate') && !line.includes('// no-clamp')) {
        // Only flag if the interpolate has output range (not just a variable)
        if (line.includes('[') && line.includes(']')) {
          addIssue(scenePath, 'warn', `interpolate() without extrapolateRight:"clamp" on line ${i + 1}`, i + 1);
        }
      }
    });

    // 2c. Check for premountFor on Sequence
    if (content.includes('<Sequence') && !content.includes('premountFor')) {
      addIssue(scenePath, 'warn', 'Sequence without premountFor={30} — may cause blank frame flash');
    }
  }

  // 3. Check composition file exists
  const compFiles = readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.includes('generate') && !f.includes('styles'));
  if (compFiles.length === 0) {
    addIssue(dir, 'error', 'No composition .tsx file found');
  } else {
    const compPath = join(dir, compFiles[0]);
    const compContent = readFileSync(compPath, 'utf-8');

    // 3a. Check premountFor on all Sequences
    const seqCount = (compContent.match(/<Sequence/g) || []).length;
    const premountCount = (compContent.match(/premountFor/g) || []).length;
    if (seqCount > 0 && premountCount < seqCount / 2) {
      addIssue(compPath, 'warn', `Only ${premountCount}/${seqCount} Sequences have premountFor`);
    }

    // 3b. Check all section IDs are in sceneComponents
    for (const id of idMatches) {
      if (!compContent.includes(`'${id}'`)) {
        addIssue(compPath, 'error', `Section '${id}' from script.ts not found in sceneComponents`);
      }
    }
  }

  // 4. Check styles.ts exists
  if (!existsSync(join(dir, 'styles.ts'))) {
    addIssue(dir, 'warn', 'No styles.ts found — video should define its own color palette');
  }
}

// Run validation
const videoDirs = target
  ? [target.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')] // PascalCase → kebab-case
  : readdirSync(videosDir).filter(d => existsSync(join(videosDir, d, 'script.ts')));

// Also try the exact target name as a directory
if (target && !existsSync(join(videosDir, videoDirs[0]))) {
  // Try finding directory by composition name
  const allDirs = readdirSync(videosDir);
  for (const d of allDirs) {
    const files = existsSync(join(videosDir, d)) ? readdirSync(join(videosDir, d)) : [];
    if (files.some(f => f.includes(target))) {
      videoDirs[0] = d;
      break;
    }
  }
}

for (const dir of videoDirs) {
  validateVideoDir(dir);
}

// Report
console.log('\n══════════════════════════════');
const errors = issues.filter(i => i.severity === 'error');
const warnings = issues.filter(i => i.severity === 'warn');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✓ All checks passed!');
} else {
  if (errors.length > 0) {
    console.log(`\n✗ ${errors.length} ERROR(S):`);
    errors.forEach(e => console.log(`  ${e.file}${e.line ? `:${e.line}` : ''} — ${e.message}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠ ${warnings.length} WARNING(S):`);
    warnings.forEach(w => console.log(`  ${w.file}${w.line ? `:${w.line}` : ''} — ${w.message}`));
  }
}

process.exit(errors.length > 0 ? 1 : 0);
