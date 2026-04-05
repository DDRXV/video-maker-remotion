import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import OpenAI from 'openai';

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
const OUTPUT_DIR = 'public/voiceover/cta';
const INSTRUCTIONS = 'Speak like a friendly founder inviting people to a free session. Warm, genuine, not salesy. Quick and conversational.';

const clips = [
  {
    id: 'mid-cta',
    narration: `If you want to learn how to do this yourself, I run free live sessions every Friday at noon Eastern. Scan the QR code on screen to join. Would love to see you there.`,
  },
  {
    id: 'end-cta',
    narration: `That's the full picture. If you want to go deeper, join my free live session this Friday at noon Eastern on Maven. I walk through this hands-on, answer questions, and show you how to build it yourself. Scan the QR code to join. See you Friday.`,
  },
];

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { console.error('Set OPENAI_API_KEY environment variable.'); process.exit(1); }

  const openai = new OpenAI({ apiKey });
  if (!existsSync(OUTPUT_DIR)) { mkdirSync(OUTPUT_DIR, { recursive: true }); }

  for (const clip of clips) {
    const outPath = `${OUTPUT_DIR}/${clip.id}.mp3`;
    if (existsSync(outPath)) { console.log(`  skip  ${clip.id} (already exists)`); continue; }
    console.log(`  gen   ${clip.id} (${clip.narration.length} chars)`);

    const response = await openai.audio.speech.create({
      model: MODEL, voice: VOICE, input: clip.narration,
      instructions: INSTRUCTIONS, response_format: 'mp3',
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(outPath, buffer);
    console.log(`  done  ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }
  console.log('\nCTA voiceover files generated.');
}

main().catch((err) => { console.error('Generation failed:', err.message); process.exit(1); });
