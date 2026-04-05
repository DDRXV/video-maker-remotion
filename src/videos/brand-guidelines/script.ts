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
    id: 'hook',
    title: 'The Problem',
    narration: `Every PM I know has the same complaint about AI-built prototypes. They all look the same. Blue gradients, rounded cards, that same sans-serif font. You build three different apps and they could be from the same company. I built Codepup AI almost entirely with Claude Code. The website, the app, the internal tools. They all look like the same product. Same orange, same spacing, same card style. Here's how I did it.`,
    startFrame: 0,
    durationInFrames: 25 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-app1', atFraction: 0.12 },
      { label: 'show-app2', atFraction: 0.20 },
      { label: 'show-app3', atFraction: 0.28 },
      { label: 'show-sameness', atFraction: 0.40 },
      { label: 'show-codepup', atFraction: 0.56 },
      { label: 'show-consistency', atFraction: 0.72 },
      { label: 'show-teaser', atFraction: 0.88 },
    ],
  },
  {
    id: 'default-look',
    title: 'The Default AI Look',
    narration: `When you give Claude a prompt like "build me a landing page for a pet food startup," you get the same output every time. A hero with a gradient background. Blue CTA buttons. Generic stock-photo layout. It looks like every other AI prototype. The reason is simple. Claude has seen millions of websites. It averages them out. You get the mean of the internet. Not your brand.`,
    startFrame: 25 * FPS,
    durationInFrames: 30 * FPS,
    beats: [
      { label: 'show-prompt', atFraction: 0.03 },
      { label: 'show-generic-output', atFraction: 0.17 },
      { label: 'show-hero', atFraction: 0.23 },
      { label: 'show-buttons', atFraction: 0.30 },
      { label: 'show-layout', atFraction: 0.37 },
      { label: 'show-reason', atFraction: 0.53 },
      { label: 'show-millions', atFraction: 0.63 },
      { label: 'show-mean', atFraction: 0.77 },
    ],
  },
  {
    id: 'the-fix',
    title: 'The Fix - CLAUDE.md',
    narration: `The fix is a file called CLAUDE.md. It sits at the root of your project. Claude reads it before every conversation. Think of it as a persistent brief that never gets lost. Whatever you put in this file, Claude follows on every file it touches. So the question is: what goes in it?`,
    startFrame: 55 * FPS,
    durationInFrames: 30 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-file', atFraction: 0.13 },
      { label: 'show-project-tree', atFraction: 0.23 },
      { label: 'show-reads-every-time', atFraction: 0.40 },
      { label: 'show-persistent-brief', atFraction: 0.53 },
      { label: 'show-follows-rules', atFraction: 0.67 },
      { label: 'show-question', atFraction: 0.83 },
    ],
  },
  {
    id: 'three-ways',
    title: 'Three Ways to Create Design Tokens',
    narration: `You need Claude to generate a design-tokens.md file. Three ways to feed it your brand. One: screenshot your existing website or Figma board. Drop it into Claude and say "create a design-tokens.md from this." Two: export tokens from Figma as JSON or CSS variables. Paste them in and ask Claude to convert to a design-tokens.md. Three: ask your UX designer to share their existing token file. The fastest path for most PMs is option one. Screenshot, paste, done. Claude generates the full token file for you.`,
    startFrame: 85 * FPS,
    durationInFrames: 50 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-goal', atFraction: 0.08 },
      { label: 'show-method1', atFraction: 0.16 },
      { label: 'show-screenshot', atFraction: 0.22 },
      { label: 'show-method2', atFraction: 0.36 },
      { label: 'show-figma', atFraction: 0.42 },
      { label: 'show-method3', atFraction: 0.52 },
      { label: 'show-designer', atFraction: 0.58 },
      { label: 'show-fastest', atFraction: 0.68 },
      { label: 'show-claude-generates', atFraction: 0.76 },
      { label: 'show-output-file', atFraction: 0.84 },
    ],
  },
  {
    id: 'color-tokens',
    title: 'Color Tokens',
    narration: `First section: colors. Not "use orange." Actual hex values. Primary accent: #C75B2A. Background: #FDFBF8. Card fill: white. Text: #1c1917 for headings, #57534e for body. Claude extracts these from your screenshot and maps them to semantic roles. Accent, background, surface, text-primary, text-secondary. Every component it builds pulls from these values.`,
    startFrame: 135 * FPS,
    durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-file-header', atFraction: 0.08 },
      { label: 'show-accent', atFraction: 0.15 },
      { label: 'show-background', atFraction: 0.23 },
      { label: 'show-text-colors', atFraction: 0.30 },
      { label: 'show-swatches', atFraction: 0.40 },
      { label: 'show-semantic', atFraction: 0.55 },
      { label: 'show-components-use', atFraction: 0.75 },
    ],
  },
  {
    id: 'component-rules',
    title: 'Component Rules',
    narration: `Second section: component rules. Buttons are 48px tall, 12px radius, solid fill on primary, outline on secondary. Cards have 24px padding, 12px border radius, subtle shadow. Claude codes these as defaults. Every button, every card, every input it builds follows the same spec. You stop re-prompting "make the buttons match."`,
    startFrame: 175 * FPS,
    durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-section-header', atFraction: 0.08 },
      { label: 'show-button-spec', atFraction: 0.15 },
      { label: 'show-button-examples', atFraction: 0.25 },
      { label: 'show-card-spec', atFraction: 0.38 },
      { label: 'show-card-example', atFraction: 0.48 },
      { label: 'show-input-spec', atFraction: 0.58 },
      { label: 'show-consistency', atFraction: 0.75 },
      { label: 'show-no-reprompt', atFraction: 0.88 },
    ],
  },
  {
    id: 'constraints',
    title: 'Design Constraints',
    narration: `Third section: the "never do" list. No gradient fills. No neon blues. No heavy box shadows. No rounded-full buttons. No hero sections with centered text over a dark overlay. These negative constraints do more work than the positive ones. They block the defaults Claude falls back on when it's unsure. Every banned pattern is one less way your prototype can look generic.`,
    startFrame: 215 * FPS,
    durationInFrames: 45 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-header', atFraction: 0.07 },
      { label: 'show-no-gradients', atFraction: 0.13 },
      { label: 'show-no-neon', atFraction: 0.20 },
      { label: 'show-no-shadows', atFraction: 0.27 },
      { label: 'show-no-rounded', atFraction: 0.33 },
      { label: 'show-no-hero', atFraction: 0.40 },
      { label: 'show-crosses', atFraction: 0.47 },
      { label: 'show-insight', atFraction: 0.58 },
      { label: 'show-blocks-defaults', atFraction: 0.67 },
      { label: 'show-summary', atFraction: 0.80 },
    ],
  },
  {
    id: 'before-after',
    title: 'Before and After',
    narration: `Here's what changes. Without CLAUDE.md, every prototype looks like a default template. With it, every screen Claude builds looks like it belongs to your product. Same colors. Same spacing. Same component library. No extra prompting needed. Your brand guidelines are not a nice-to-have. They are the instruction set. Put them in CLAUDE.md and Claude follows them every time.`,
    startFrame: 260 * FPS,
    durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-without', atFraction: 0.10 },
      { label: 'show-without-screens', atFraction: 0.18 },
      { label: 'show-with', atFraction: 0.33 },
      { label: 'show-with-screens', atFraction: 0.40 },
      { label: 'show-same-brand', atFraction: 0.55 },
      { label: 'show-closing', atFraction: 0.70 },
      { label: 'show-final', atFraction: 0.83 },
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
export const getSection = (id: string) => {
  const s = sections.find(sec => sec.id === id);
  if (!s) throw new Error(`Section "${id}" not found`);
  return s;
};
