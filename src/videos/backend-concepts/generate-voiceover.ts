/**
 * Generate voiceover audio files from script narration using OpenAI TTS.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx tsx src/videos/backend-concepts/generate-voiceover.ts
 *
 * Outputs MP3 files to public/voiceover/backend-concepts/{scene-id}.mp3
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { script } from './script';
import OpenAI from 'openai';

// Load .env.local if it exists
const envPath = resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^(\w+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

const VOICE = 'ash';
const MODEL = 'gpt-4o-mini-tts';
const OUTPUT_DIR = 'public/voiceover/backend-concepts';

const INSTRUCTIONS = 'Speak like a senior technical PM presenting to a smart audience. Confident, clear, and engaging. Moderate pace with slight emphasis on key technical terms. Conversational but authoritative. The tone of someone explaining concepts they use every day to a friend who is smart but new to backend architecture.';

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Set OPENAI_API_KEY environment variable.');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const section of script) {
    const outPath = `${OUTPUT_DIR}/${section.id}.mp3`;

    if (existsSync(outPath)) {
      console.log(`  skip  ${section.id} (already exists)`);
      continue;
    }

    console.log(`  gen   ${section.id} (${section.narration.length} chars)`);

    const response = await openai.audio.speech.create({
      model: MODEL,
      voice: VOICE,
      input: section.narration,
      instructions: INSTRUCTIONS,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(outPath, buffer);
    console.log(`  done  ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }

  console.log('\nAll voiceover files generated.');
}

main().catch((err) => {
  console.error('Generation failed:', err.message);
  process.exit(1);
});
