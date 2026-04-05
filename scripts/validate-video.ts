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

    // 2d. Text overflow detection — estimate monospace text vs container width
    lines.forEach((line, i) => {
      // Look for monospace text inside containers: text + fontFamily="monospace" near a width
      if (line.includes('fontFamily="monospace"') || line.includes("fontFamily={'monospace'}") || line.includes('fontFamily="mono"')) {
        const textMatch = line.match(/>\{?['"`]([^'"}`]+)['"`]\}?</);
        const sizeMatch = line.match(/fontSize[=:{]\s*(\d+)/);
        if (textMatch && sizeMatch) {
          const text = textMatch[1];
          const fontSize = parseInt(sizeMatch[1]);
          const estimatedWidth = text.length * fontSize * 0.6;
          if (estimatedWidth > 400) {
            addIssue(scenePath, 'warn', `Monospace text "${text.slice(0, 30)}..." (~${Math.round(estimatedWidth)}px) may overflow container on line ${i + 1}`, i + 1);
          }
        }
      }
    });

    // 2e. Diagonal arrow detection — only on Arrow/FlowLine/FlowArrow components
    lines.forEach((line, i) => {
      // Only check lines that invoke Arrow, FlowLine, or FlowArrow components
      if (/<(Arrow|FlowLine|FlowArrow)\s/.test(line) || /<(Arrow|FlowLine|FlowArrow)\s/.test(lines[i - 1] || '')) {
        const arrowMatch = line.match(/y1[=:{]\s*\{?([^}>,]+)\}?\s.*y2[=:{]\s*\{?([^}>,]+)\}?/);
        if (arrowMatch) {
          const y1 = arrowMatch[1].trim();
          const y2 = arrowMatch[2].trim();
          if (y1 !== y2 && !line.includes('curved') && !line.includes('// diagonal-ok')) {
            addIssue(scenePath, 'warn', `Diagonal arrow: y1=${y1} vs y2=${y2} on line ${i + 1}. Use same Y for horizontal.`, i + 1);
          }
        }
      }
    });

    // 2f. Generic circle detection — flag circles that look like placeholders
    lines.forEach((line, i) => {
      if (line.includes('<circle') && (line.includes('label') || line.includes('icon'))) {
        const nextLine = lines[i + 1] || '';
        // If circle has a text label right after it (placeholder pattern), flag
        if (nextLine.includes('<text') && nextLine.includes('textAnchor="middle"')) {
          addIssue(scenePath, 'warn', `Possible generic circle placeholder on line ${i + 1}. Use purpose-built shapes.`, i + 1);
        }
      }
    });

    // 2g. Element density — count distinct visual elements
    const rectCount = (content.match(/<rect\s/g) || []).length;
    const textCount = (content.match(/<text\s/g) || []).length;
    const circleCount = (content.match(/<circle\s/g) || []).length;
    const totalElements = rectCount + textCount + circleCount;
    // Check if scene uses sub-views (View1, View2 pattern) — higher density is OK
    const hasSubViews = content.includes('opacity={v1Op}') || content.includes('View1') || content.includes('view1');
    if (totalElements > 80 && !hasSubViews) {
      addIssue(scenePath, 'warn', `High element count (${totalElements} rects+text+circles). Consider splitting into sub-views.`);
    }

    // 2h. DashFlow across pipelines — banned pattern
    if (content.includes('DashFlow') && content.includes('Pipeline') || content.includes('fullPicture') || content.includes('full-picture')) {
      if (content.includes('<DashFlow')) {
        addIssue(scenePath, 'warn', 'DashFlow used in pipeline scene — DashFlow draws a continuous line through blocks. Use staggered entrances instead.');
      }
    }

    // 2i. Image preserveAspectRatio — flag "slice" which crops
    lines.forEach((line, i) => {
      if (line.includes('preserveAspectRatio') && line.includes('slice')) {
        addIssue(scenePath, 'warn', `preserveAspectRatio="slice" on line ${i + 1} crops image edges. Use "xMinYMin meet" to show full image.`, i + 1);
      }
    });

    // 2j. Pipeline gap check — flag small gaps between blocks
    lines.forEach((line, i) => {
      const gapMatch = line.match(/\bgap\s*=\s*(\d+)/);
      if (gapMatch) {
        const gapVal = parseInt(gapMatch[1]);
        if (gapVal < 24 && (content.includes('pipeline') || content.includes('Pipeline') || content.includes('blockW') || content.includes('blockCount'))) {
          addIssue(scenePath, 'warn', `Pipeline gap=${gapVal}px on line ${i + 1} — minimum 28px to prevent arrow overlap with blocks.`, i + 1);
        }
      }
    });

    // 2k. Canvas boundary — check for hardcoded coordinates past margins
    lines.forEach((line, i) => {
      // Check for x coordinates > 1840 (CANVAS.width - margin)
      const xMatch = line.match(/\bx[=:{]\s*\{?\s*(\d{4,})\s*\}?/);
      if (xMatch && parseInt(xMatch[1]) > 1840) {
        addIssue(scenePath, 'warn', `x=${xMatch[1]} exceeds right margin (1840) on line ${i + 1}`, i + 1);
      }
      // Check for y coordinates > 980 (CANVAS.height - 100 for summary)
      const yMatch = line.match(/\by[=:{]\s*\{?\s*(\d{3,})\s*\}?/);
      if (yMatch && parseInt(yMatch[1]) > 980) {
        addIssue(scenePath, 'warn', `y=${yMatch[1]} exceeds bottom safe area (980) on line ${i + 1}`, i + 1);
      }
    });
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
