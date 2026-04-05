import { CANVAS } from '../../design-system/tokens';

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
  {
    id: 'intro', title: 'Why PMs Need Backend Vocabulary',
    narration: `You don't need to write backend code. But you need to understand how backend systems behave. Because that understanding is what makes your Claude Code prompts actually work in production, not just in demos. Here are four concepts that will change how you build and how you talk about systems.`,
    startFrame: 0, durationInFrames: 20 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.05 },
      { label: 'show-subtitle', atFraction: 0.25 },
      { label: 'show-concepts-preview', atFraction: 0.55 },
    ],
  },
  {
    id: 'sync-async', title: 'Synchronous vs Asynchronous',
    narration: `Picture a coffee shop. A synchronous barista takes your order, makes your coffee, hands it to you, then takes the next person's order. Everyone waits. An async barista takes your order, gives you a number, and starts helping the next person while your coffee is being made. In your app, when a user clicks Generate and you call OpenAI, that takes 3 to 5 seconds. If you do that synchronously, the whole UI freezes. Nothing responds. The fix is simple. Make the call async. Show a loading state immediately. Let the user keep interacting. Update the screen when the response arrives.`,
    startFrame: 20 * FPS, durationInFrames: 35 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-sync-barista', atFraction: 0.08 },
      { label: 'show-sync-queue', atFraction: 0.18 },
      { label: 'show-async-barista', atFraction: 0.30 },
      { label: 'show-async-parallel', atFraction: 0.40 },
      { label: 'show-app-sync', atFraction: 0.55 },
      { label: 'show-app-frozen', atFraction: 0.65 },
      { label: 'show-app-async', atFraction: 0.75 },
      { label: 'show-app-responsive', atFraction: 0.88 },
    ],
  },
  {
    id: 'race-conditions', title: 'Concurrency and Race Conditions',
    narration: `Two users open your app at the same second. Both click Claim This Spot on the last available slot. Your backend reads the database, sees one spot left, and confirms both. But there was only one spot. Now you have a double booking. That is a race condition. You don't need to write the fix. But you need to spot this pattern in your specs. Any time a user action reads a value and then updates it, ask your engineer one question. What happens if two users do this at the same time? The fix is an atomic transaction. The read and the write happen as one indivisible operation.`,
    startFrame: 55 * FPS, durationInFrames: 35 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-two-users', atFraction: 0.08 },
      { label: 'show-database', atFraction: 0.18 },
      { label: 'show-both-read', atFraction: 0.28 },
      { label: 'show-both-confirm', atFraction: 0.38 },
      { label: 'show-bug', atFraction: 0.48 },
      { label: 'show-question', atFraction: 0.62 },
      { label: 'show-atomic-fix', atFraction: 0.78 },
      { label: 'show-summary', atFraction: 0.90 },
    ],
  },
  {
    id: 'idempotency', title: 'Idempotency',
    narration: `A user submits a form. Their internet cuts out for half a second. Did the request go through? They don't know, so they click again. If your API is not idempotent, you now have two records for the same submission. If it is idempotent, the second request returns the same result without creating a duplicate. The standard fix is an idempotency key. A unique ID generated on the frontend, sent with every request. The backend checks if it already processed that key. If yes, it returns the cached result. Stripe uses this pattern for every payment call.`,
    startFrame: 90 * FPS, durationInFrames: 35 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-user-submit', atFraction: 0.08 },
      { label: 'show-network-cut', atFraction: 0.18 },
      { label: 'show-double-click', atFraction: 0.28 },
      { label: 'show-duplicate-records', atFraction: 0.38 },
      { label: 'show-idempotent-result', atFraction: 0.48 },
      { label: 'show-key-flow', atFraction: 0.60 },
      { label: 'show-backend-check', atFraction: 0.72 },
      { label: 'show-stripe-reference', atFraction: 0.88 },
    ],
  },
  {
    id: 'fault-tolerance', title: 'Fault Tolerance',
    narration: `Your app calls OpenAI and the API is down. What does the user see? If you haven't thought about this, they see a blank screen or a raw error code. That is your fault, not the engineer's. Every feature you spec needs three states. The happy path where everything works. The loading state where we're waiting. And the error state where something failed. If you define all three, engineers build all three. Retry the call up to three times. If it still fails, show a friendly message and keep the rest of the page working. Never let one dependency take down the whole experience.`,
    startFrame: 125 * FPS, durationInFrames: 35 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-api-call', atFraction: 0.08 },
      { label: 'show-api-down', atFraction: 0.18 },
      { label: 'show-blank-screen', atFraction: 0.26 },
      { label: 'show-three-states', atFraction: 0.38 },
      { label: 'show-happy', atFraction: 0.46 },
      { label: 'show-loading', atFraction: 0.54 },
      { label: 'show-error', atFraction: 0.62 },
      { label: 'show-retry-cascade', atFraction: 0.72 },
      { label: 'show-graceful-message', atFraction: 0.85 },
    ],
  },
  {
    id: 'outro', title: 'Use These in Your Next Prompt',
    narration: `Next time you're in Claude Code, try using one of these terms in your prompt. Tell it to handle something asynchronously, or make an endpoint idempotent, or add graceful degradation. You'll notice the output gets significantly better when you speak the same language as the system.`,
    startFrame: 160 * FPS, durationInFrames: 15 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.07 },
      { label: 'show-terms', atFraction: 0.25 },
      { label: 'show-prompt-example', atFraction: 0.50 },
      { label: 'show-branding', atFraction: 0.75 },
    ],
  },
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
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(`Section "${id}" not found`); return s; };
