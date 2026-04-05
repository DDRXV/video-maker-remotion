# Voiceover Generation

## Overview
Every video gets AI-generated voiceover from the narration in `script.ts`. Audio drives video timing — scene durations adapt to actual narration length.

## TTS Config

- **Model:** `gpt-4o-mini-tts` (supports `instructions` parameter for style control)
- **Voice:** `ash` (casual, energetic male — best for tech explainers)
- **Instructions:** `Speak like a senior technical PM presenting to a smart audience. Confident, clear, and engaging. Moderate pace with slight emphasis on key technical terms. Conversational but authoritative. The tone of someone who has built this system and is walking you through how it actually works.`
- **Format:** MP3
- **API key:** Stored in `.env.local` as `OPENAI_API_KEY`

## How It Works

### 1. Script narration
Each `ScriptSection` in `script.ts` has a `narration` field. This is the exact text sent to TTS. Write it as spoken words only. No stage directions like "Pause" or "Emphasize this." The `instructions` parameter handles delivery style.

### 2. Generate audio
Each video has a `generate-voiceover.ts` script. Copy the pattern from `src/videos/voice-agents/generate-voiceover.ts`:

```ts
const response = await openai.audio.speech.create({
  model: 'gpt-4o-mini-tts',
  voice: 'ash',
  input: section.narration,
  instructions: INSTRUCTIONS,
  response_format: 'mp3',
});
```

Run with:
```bash
npx tsx src/videos/{video-name}/generate-voiceover.ts
```

Output goes to `public/voiceover/{video-name}/{scene-id}.mp3`. The script skips existing files — delete a specific MP3 to regenerate just that scene.

### 3. Audio drives timing
Beats in `script.ts` use `atFraction` (0-1) instead of absolute frames. The composition's `calculateMetadata` function measures each MP3's duration and computes scene frame counts. Beats scale proportionally.

### 4. Wiring in the composition
```tsx
import { Audio } from '@remotion/media';
import { staticFile } from 'remotion';

// Inside each <Sequence>:
<Audio src={staticFile(`voiceover/{video-name}/${id}.mp3`)} />
```

Use `calculateMetadata` on the `<Composition>` to dynamically set `durationInFrames` from audio lengths. Fall back to static timing if audio files don't exist yet (for preview during development).

## Narration Writing Rules

- Write as spoken words. First person, short sentences.
- No stage directions (`Pause`, `Emphasize`, `Slowly`). The TTS `instructions` handle delivery.
- No em dashes. Use periods.
- Numbers: write `$4,200` not `four thousand two hundred dollars`. TTS handles currency naturally.
- Abbreviations: write `STT` and `TTS` — the voice pronounces them as letter sequences.
- No marketing language. Concrete nouns and specific data.

## Regenerating Audio

To regenerate a single scene:
```bash
rm public/voiceover/{video-name}/{scene-id}.mp3
npx tsx src/videos/{video-name}/generate-voiceover.ts
```

To regenerate all scenes:
```bash
rm public/voiceover/{video-name}/*.mp3
npx tsx src/videos/{video-name}/generate-voiceover.ts
```

## Dependencies
- `openai` npm package
- `@remotion/media` (for `<Audio>` component)
- `mediabunny` (for `getAudioDuration` in calculateMetadata — comes with Remotion)
