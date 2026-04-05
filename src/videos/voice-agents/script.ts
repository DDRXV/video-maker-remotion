import { CANVAS } from '../../design-system/tokens';

const FPS = CANVAS.fps;

export interface Beat { label: string; atFraction: number; }
export interface ScriptSection {
  id: string;
  title: string;
  narration: string;
  beats: Beat[];
  // These are set at runtime by calculateMetadata when audio is available,
  // or use fallback defaults for preview without audio.
  startFrame: number;
  durationInFrames: number;
}

/**
 * Beat fractions: position within the scene as 0-1.
 * At runtime, atFrame = atFraction * section.durationInFrames.
 */
const sections: ScriptSection[] = [
  {
    id: 'hook', title: 'The Sales Call',
    narration: `A customer picks up the phone. "Hi, this is Sarah from Acme. I saw you were looking at our enterprise plan." The customer says, "Yeah, but the pricing feels steep for what we need." Sarah pulls up their account. "You're currently spending $4,200 a month on three separate tools. Our annual plan replaces all three at $2,800." The customer thinks for a second. "OK, that actually makes sense. Let's do the annual plan." Deal closed in 90 seconds.`,
    startFrame: 0, durationInFrames: 28 * FPS,
    beats: [
      { label: 'show-phone-ring', atFraction: 0.04 },
      { label: 'show-agent-intro', atFraction: 0.14 },
      { label: 'show-customer-objection', atFraction: 0.29 },
      { label: 'show-agent-crm-lookup', atFraction: 0.43 },
      { label: 'show-agent-response', atFraction: 0.57 },
      { label: 'show-customer-close', atFraction: 0.75 },
      { label: 'show-deal-closed', atFraction: 0.86 },
    ],
  },
  {
    id: 'reveal', title: 'The Reveal',
    narration: `Sarah is not a person. She is a voice agent. Trained on Acme's sales playbook. Connected to their CRM. She knew the customer's current stack, their spend, their contract renewal date. She runs 500 calls at the same time. No breaks. No bad days.`,
    startFrame: 28 * FPS, durationInFrames: 18 * FPS,
    beats: [
      { label: 'show-not-human', atFraction: 0.06 },
      { label: 'show-ai-badge', atFraction: 0.22 },
      { label: 'show-trained', atFraction: 0.39 },
      { label: 'show-connected', atFraction: 0.56 },
      { label: 'show-scale', atFraction: 0.72 },
    ],
  },
  {
    id: 'pipeline', title: 'The Real-Time Pipeline',
    narration: `Here is how it works. The customer speaks. Speech-to-text converts audio to text in 100 milliseconds. The LLM reads the transcript, checks the knowledge base, and generates a response in 200 milliseconds. Text-to-speech converts that response back to audio in 150 milliseconds. Total round trip: under 500 milliseconds. The customer hears a reply before they notice any pause.`,
    startFrame: 46 * FPS, durationInFrames: 28 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-customer-speaks', atFraction: 0.11 },
      { label: 'show-stt', atFraction: 0.25 },
      { label: 'show-llm', atFraction: 0.43 },
      { label: 'show-tts', atFraction: 0.61 },
      { label: 'show-total', atFraction: 0.79 },
    ],
  },
  {
    id: 'context', title: 'Your Org\'s Context',
    narration: `The LLM alone is not enough. What makes this agent sound like your best rep is the context layer. Product catalog with pricing and feature comparisons. CRM data: customer history, deal stage, past objections. Sales playbook: objection handling scripts, closing techniques, escalation rules. All of this gets injected into the LLM's context window before every response.`,
    startFrame: 74 * FPS, durationInFrames: 24 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-llm-core', atFraction: 0.13 },
      { label: 'show-product-catalog', atFraction: 0.25 },
      { label: 'show-crm-data', atFraction: 0.42 },
      { label: 'show-playbook', atFraction: 0.58 },
      { label: 'show-injection-arrows', atFraction: 0.75 },
      { label: 'show-summary', atFraction: 0.88 },
    ],
  },
  {
    id: 'latency', title: 'The Latency Budget',
    narration: `The hard constraint is latency. In a phone call, anything over 500 milliseconds feels unnatural. So every component is optimized for speed. Streaming STT: transcribe as the customer speaks, don't wait for the full sentence. Chunked TTS: start speaking the first sentence while the LLM generates the second. Interruption detection: if the customer starts talking, stop playback immediately.`,
    startFrame: 98 * FPS, durationInFrames: 22 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.05 },
      { label: 'show-budget-bar', atFraction: 0.14 },
      { label: 'show-stt-chunk', atFraction: 0.32 },
      { label: 'show-llm-stream', atFraction: 0.50 },
      { label: 'show-tts-chunk', atFraction: 0.68 },
      { label: 'show-total-fit', atFraction: 0.86 },
    ],
  },
  {
    id: 'turn-taking', title: 'Turn-Taking and Interruptions',
    narration: `The hardest problem is knowing when someone is done talking. Voice Activity Detection listens for silence. Endpointing algorithms distinguish a pause from a full stop. Barge-in handling lets the customer interrupt mid-sentence and the agent stops immediately. This is what separates a voice agent from an IVR menu.`,
    startFrame: 120 * FPS, durationInFrames: 22 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.05 },
      { label: 'show-waveform', atFraction: 0.14 },
      { label: 'show-vad', atFraction: 0.27 },
      { label: 'show-endpointing', atFraction: 0.45 },
      { label: 'show-bargein', atFraction: 0.64 },
      { label: 'show-summary', atFraction: 0.82 },
    ],
  },
  {
    id: 'use-cases', title: 'Beyond Sales',
    narration: `The same pipeline works for any conversation. Customer support: troubleshoot issues using your docs. Appointment scheduling: book meetings checking calendar availability. Lead qualification: ask the right questions and score leads. Collections: negotiate payment plans with empathy. Same architecture. Different knowledge base.`,
    startFrame: 142 * FPS, durationInFrames: 18 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.06 },
      { label: 'show-support', atFraction: 0.17 },
      { label: 'show-scheduling', atFraction: 0.33 },
      { label: 'show-qualification', atFraction: 0.50 },
      { label: 'show-collections', atFraction: 0.67 },
      { label: 'show-summary', atFraction: 0.83 },
    ],
  },
  {
    id: 'stack', title: 'The PM\'s Stack',
    narration: `Five layers in this stack. Speech-to-text converts raw audio into text. You need streaming support and low latency here. The LLM is the brain. It reads context, reasons about what to say, and generates the response. Text-to-speech turns that response back into natural sounding audio. Voice cloning lets you match your brand's tone. The orchestrator ties it all together. It manages state, handles turn-taking, and routes between the other layers. And telephony connects everything to actual phone lines. Each layer is a separate decision. Pick based on latency budget and accuracy needs.`,
    startFrame: 160 * FPS, durationInFrames: 22 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.05 },
      { label: 'show-stt-layer', atFraction: 0.14 },
      { label: 'show-llm-layer', atFraction: 0.27 },
      { label: 'show-tts-layer', atFraction: 0.41 },
      { label: 'show-orchestrator-layer', atFraction: 0.55 },
      { label: 'show-telephony-layer', atFraction: 0.68 },
      { label: 'show-summary', atFraction: 0.86 },
    ],
  },
];

/** Apply audio-driven durations. Called from calculateMetadata. */
export function applyAudioDurations(audioDurations: number[]): ScriptSection[] {
  let startFrame = 0;
  return sections.map((sec, i) => {
    const durationInFrames = Math.ceil(audioDurations[i] * FPS) + Math.round(0.5 * FPS); // +0.5s padding
    const updated = { ...sec, startFrame, durationInFrames };
    startFrame += durationInFrames;
    return updated;
  });
}

export const script = sections;
export const sectionIds = sections.map(s => s.id);
export const totalDuration = sections.reduce((sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames), 0);
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(`Section "${id}" not found`); return s; };
