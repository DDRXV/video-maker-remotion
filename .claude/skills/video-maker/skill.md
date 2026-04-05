---
name: video-maker
description: Creates animated tech explainer videos using Remotion. Triggers when user says "make a video", "create an explainer", "video about", "animate this concept", or describes a visual explanation they want as a video.
---

# Skill: Animated Video Maker

## 1. Core Directive

You create animated explainer videos using the Remotion-based system at `/Users/rajesh/experiments/video-maker`. Videos render as 1920x1080 MP4 at 30fps.

Visual style adapts to the brief. The user might want 3Blue1Brown dark backgrounds, ByteByteGo architecture diagrams, minimal whiteboard sketches, or something new. Ask, then adapt. The design system provides defaults — override them when the brief calls for it.

**Quality bar:** Reference `/Users/rajesh/experiments/ai-solutions-nextjs/public/` for the standard of SVG illustration quality. Study those files before building scenes. Every scene should score 90+ on a motion design rubric.

## 2. Workflow — Always Follow This Order

### Step 1: Ask Questions
Before writing any code, ask:
- What concept are you explaining?
- Who is the audience?
- How long? (1-2 min, 5-10 min, 15+ min)
- How deep? (pure concept, concept + architecture, concept + code)
- Do you have a script already?
- Any reference videos, images, or style preferences? (e.g., "3B1B style", "dark mode", "whiteboard", "corporate clean")
- Distribution? (YouTube, LinkedIn, course material, internal)

### Step 2: Draft Narration Script
Write the full narration in the user's voice (see CLAUDE.md writing rules). Structure it as sections with clear beats. Share for review before building.

**Hero technique pattern:** For educational videos covering multiple techniques in a category, pick the ONE most commonly used technique per scene. Spend 70% of the narration on that technique with a concrete, real-world example. Mention others briefly at the end ("Other approaches include X, Y, Z").

### Step 3: Create script.ts
Convert approved narration into `script.ts`:
- ScriptSection for each scene (id, title, narration, beats)
- Beats use `atFraction` (0-1 proportional position within scene) so timing scales with actual audio duration
- Fallback `startFrame` and `durationInFrames` for preview without audio

### Step 3.5: Generate Voiceover
**Mandatory for every video.** See [references/voiceover-generation.md](references/voiceover-generation.md) for full details.

1. Create `generate-voiceover.ts` in the video directory (copy pattern from `src/videos/voice-agents/generate-voiceover.ts`)
2. Run: `npx tsx src/videos/{video-name}/generate-voiceover.ts`
3. Audio files go to `public/voiceover/{video-name}/{scene-id}.mp3`
4. Wire `<Audio>` components in the composition and add `calculateMetadata` to dynamically size the video to match audio length
5. The script skips existing files — delete a specific MP3 to regenerate just that scene

**TTS Config:**
- Model: `gpt-4o-mini-tts` (supports `instructions` for style control)
- Voice: `ash` (casual, energetic male)
- Instructions: `Speak like a senior technical PM presenting to a smart audience. Confident, clear, and engaging. Moderate pace with slight emphasis on key technical terms. Conversational but authoritative.`

**Narration rules:** No stage directions in the text (`Pause`, `Emphasize`). Write spoken words only. The `instructions` parameter handles delivery style.

### Step 4: Build Scenes
Build each scene with custom inline SVG illustrations specific to the video's content. Adapt visual style to the brief. See Sections 5, 6, and 7 for the design rules.

### Step 5: Wire Composition
Create the composition file that imports all scenes, maps them to `<Sequence>` blocks driven by script.ts timing, and wraps each in `SceneCanvas`.

### Step 6: Visual QA — Screenshot Every Beat
**Mandatory before showing the user.** Render still frames at EVERY beat of EVERY scene and review them.

1. **Render ALL beats, not just 2-3.** For each scene, render a still at every beat frame:
   ```bash
   # Calculate frame: sceneStartFrame + atFraction * sceneDuration
   # With audio, use calculateMetadata durations. Without, use static durations.
   for f in <frame1> <frame2> ...; do
     npx remotion still src/index.ts <CompositionId> /tmp/<scene>-${f}.png --frame=${f} 2>&1 | tail -1
   done
   ```

2. **Read EVERY screenshot** and check for these specific issues:

   **Text overflow (most common failure):**
   - Does any text extend past its container border?
   - Do labels overlap scores or other text?
   - Is monospace text wider than expected? (monospace is 20-30% wider than sans-serif)
   - Calculate: `charCount * fontSize * 0.6` for monospace, compare to container width - 24px

   **Arrow alignment:**
   - Are arrows between same-height elements perfectly horizontal? (both Y coords identical)
   - Are diagonal arrows only used when elements are at genuinely different Y positions?
   - Are arrows inside the same transform group as their connected elements?

   **Shape authenticity:**
   - Is every element shaped like what it represents? (No generic circles)
   - Does every container show what's inside it? (No empty labeled boxes)

   **Readability at 720p:**
   - Is any text below 14px? (12px absolute minimum for monospace code only)
   - Will light-colored text survive YouTube compression?
   - Are more than 5 elements competing for attention?

   **View transitions (for multi-view scenes):**
   - Does the crossfade between views actually work at the transition frame?
   - Is the recap/zoomed-out view rendering correctly at the end?

3. **Fix ALL issues found**, re-render the affected frames, re-verify.

4. **Do not show the user until all beats pass.** Every frame they might pause on must look correct.

**Scene detailing rule (critical):** Every card, box, or container must show what is inside it. What "inside" looks like depends on the concept. Figure it out from the subject matter. Empty labeled boxes are the #1 sign of generic AI output.

### Step 7: Preview & Iterate
Run `npm run preview` and iterate with user feedback.

## 3. Component Library

Utility components in `/Users/rajesh/experiments/video-maker/src/components/`. These are style-agnostic helpers — they take color/size props and work with any visual style.

| Component | What it does |
|-----------|-------------|
| `TextBox` | SVG multi-line text with word wrapping (SVG has no native wrap) |
| `FlowArrow` | Curved bezier arrow with draw-on animation |
| `DashFlow` | Animated flowing dashes along a path |
| `LabelBadge` | Pill-shaped label with entrance animation |
| `AnimatedCard` | Rounded card container with header and shadow |
| `Background` | Subtle dot grid or clean background |
| `ChatBubble` | Chat message bubble with sender alignment, label, word wrap |
| `WaveformBar` | Animated audio waveform visualization with oscillating bars |
| `LatencySegment` | Horizontal bar showing a latency budget allocation with animated fill |

**Important:** These are layout helpers, not illustration components. The visual quality comes from custom inline SVG you build per-scene, not from these components.

## 4. Design System (Defaults — Override When Needed)

The current tokens define a warm, light-background style. For dark-mode or other styles, modify `tokens.ts` or override inline per-video.

### Current Token Values
```
COLORS: accent #C75B2A, dark #1c1917, mediumStroke #57534e,
        lightStroke #78716c, hairline #d6d3d1, cardFill #FDFBF8,
        background #FDFBF8, success #16a34a, error #dc2626

FONT_SIZE: xs 15, sm 18, md 22, lg 26, xl 32, 2xl 42, 3xl 60
  (calibrated for 1080p video. Nothing below xs is readable after compression.)

CONCEPT_COLORS: user #C75B2A, retrieval #2563eb, embedding #059669,
                vectordb #7c3aed, llm #0891b2, document #78716c, response #16a34a

MODULE_COLORS: queryConstruction #eab308, queryTranslation #f43f5e,
               routing #f97316, indexing #3b82f6, retrieval #22c55e, generation #a855f7
```

### Layout
```ts
grid.x(0.5)       // 50% of usable width (after 80px margins)
grid.y(0.3)       // 30% of usable height
grid.center()     // { x: 960, y: 540 }
grid.distributeX(count, row, rowSpan)  // evenly space N items
```

### Animations
```ts
entranceSpring(frame, fps, delay)  // organic entrance
exitSpring(frame, fps, delay)      // exit
morphSpring(frame, fps, delay)     // position/size transitions (crossfades)
focusSpring(frame, fps, delay)     // slow, gentle
pulse(frame, cycleDuration, min, max)  // ambient pulse

// Custom springs for variety:
spring({ frame, fps, config: { damping: 18, stiffness: 220, mass: 0.6 } })  // snappy
spring({ frame, fps, config: { damping: 8, stiffness: 140, mass: 0.8 } })   // bouncy
spring({ frame, fps, config: { damping: 200 } })                             // smooth, no bounce
```

### SVG Filters (via SceneCanvas or inline defs)
```xml
<!-- Glow effect — use on focused/active elements -->
<filter id="glow-soft" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
</filter>
```

## 5. Premium Illustration Standards (Non-Negotiable)

These rules are what separate a 90+ score from a 40. Study the SVGs in `/Users/rajesh/experiments/ai-solutions-nextjs/public/` for reference.

### Shapes Match Function (No Generic Circles)
Every shape must look like what it represents. A generic circle with a label inside is the #1 AI-slop tell.

| Element | Shape | NOT this |
|---------|-------|----------|
| Document | Page with corner fold, visible text lines | Circle with "Doc" label |
| Database | Cylinder with data rows visible inside | Circle with DB icon |
| LLM/Model | Transformer block showing input→output | Circle with brain icon |
| User query | Chat bubble with tail | Circle with "Q" |
| Code | Dark rect with line numbers + syntax | Label saying "SQL" |
| Chunk | Torn-edge card with numbered gutter | Small rectangle |
| Embedding | Number array in monospace `[0.23, -0.41, ...]` | Label saying "vector" |

### Full-Canvas Views (3-5 Elements Max)
**Never cram the entire pipeline into one view.** Split complex scenes into sub-views that crossfade:
- Each view uses the full 1920x1080 canvas
- Maximum 3-5 elements visible at once
- Active element is HERO sized (fills 30-50% of canvas)
- Use `morphSpring` for crossfade transitions between views
- Each view gets a STEP label ("STEP 1", "STEP 2") and a plain-language subtitle

```tsx
// Crossfade pattern:
const v1Out = morphSpring(frame, fps, nextViewBeat - 8);
const v2In = morphSpring(frame, fps, nextViewBeat);
const v1Op = 1 - v1Out;
const v2Op = v2In;

<View1 opacity={v1Op} />
<View2 opacity={v2Op} />
```

### Text Overflow Prevention
**Before placing ANY text element, calculate whether it fits:**

1. **Measure text width:** `charCount * charWidth` where charWidth is:
   - Sans-serif: `fontSize * 0.52` per character
   - Monospace: `fontSize * 0.6` per character
   - Bold: multiply by 1.08

2. **Compare to container:** `textWidth` must be < `containerWidth - (2 * padding)` where padding is minimum 12px per side.

3. **If text overflows:**
   - Shorten the text (preferred)
   - Split into two lines using `<tspan>` or multiple `<text>` elements
   - NEVER shrink font below 14px for readable content
   - NEVER let text extend past its container border

4. **Multi-line text:** Use `TextBox` component which handles wrapping. For custom layouts, calculate: `totalHeight = lineCount * fontSize * 1.4`. Ensure `startY + totalHeight + 30` < next element's Y position.

5. **Canvas boundary check:** No element's right edge should exceed `grid.x(0.96)`. No element's bottom edge should exceed `grid.y(0.92)` (leave room for summary text).

### Minimum Font Sizes for Video
| Usage | Minimum | Recommended |
|-------|---------|-------------|
| Body text (must be read) | 14px | 16-20px |
| Labels and titles | 16px | 18-24px |
| Scene titles | 28px | 32-42px |
| Monospace/code | 12px | 13-16px |
| Step numbers/badges | 14px | 16px |
| Summary text | 26px (FONT_SIZE.lg) | 32px (FONT_SIZE.xl) |
| Anything below 12px | FORBIDDEN | — |

### Layered Depth (4 Layers)

Every scene must have at least 3 of these 4 layers:

1. **Background particles** (opacity 0.08-0.15): 5-7 small circles with frame-based oscillation for ambient life. Use `oscillate(frame, cycle, amplitude, phase)`.

2. **Structural guides** (opacity 0.08-0.12): Dashed rotating rings around active elements. Use `strokeDasharray="12 8"` with frame-based rotation.

3. **Primary content** (opacity 0.7-1.0): The actual illustration elements. Purpose-built shapes with visible internal detail.

4. **Animated overlays** (opacity 0.15-0.35): Pulsing rings on active elements, traveling dots along flow paths, glow halos.

```tsx
// Floating particle pattern:
const oscillate = (frame: number, cycle: number, amp: number, phase = 0) =>
  Math.sin(((frame + phase) / cycle) * Math.PI * 2) * amp;

// Pulsing ring pattern:
const t = (frame % 50) / 50;
<circle cx={cx} cy={cy} r={baseR + t * 24} fill="none" stroke={color}
  strokeWidth={1.5} strokeOpacity={(1 - t) * 0.3} />

// Dashed orbit pattern:
const rot = (frame * 0.5) % 360;
<circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
  strokeDasharray="12 8" strokeOpacity={0.12}
  style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px` }} />
```

### Animation Variety (3 Curves Minimum)
Using the same spring for everything = monotone. Use at least 3 different curves per scene:

| Purpose | Config | Feel |
|---------|--------|------|
| Reveals | `{ damping: 18, stiffness: 220, mass: 0.6 }` | Snappy, precise |
| Emphasis/arrival | `{ damping: 8, stiffness: 140, mass: 0.8 }` | Bouncy, attention-grabbing |
| Ambient/crossfade | `morphSpring` / `gentleSpring` | Slow, smooth |
| Text generation | `gentleSpring` mapped to character count | Typewriter effect |

### Traveling Dots on Flow Arrows
Data flow should be visible. Add traveling dots along arrows:
```tsx
const dotCycle = 45;
const dotT = ((frame - enterAt) % dotCycle) / dotCycle;
<circle cx={x1 + (x2 - x1) * dotT} cy={y1 + (y2 - y1) * dotT}
  r={4} fill={brandColor} fillOpacity={0.7} />
```

### Glow Halos on Active Elements
When an element becomes the focus, add a soft glow halo behind it:
```tsx
{active && <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20}
  rx={16} fill={accentColor} fillOpacity={0.04} />}
```

### Show Transformations Happening
Don't label a transformation — SHOW it. Examples:
- **Embedding:** Show text characters on the left, number arrays on the right, with an arrow between them. Not a box labeled "Embedding Model."
- **LLM generation:** Show chunks flowing in at the top, a typing cursor generating text at the bottom. Not a box labeled "LLM."
- **Chunking:** Show a document literally splitting apart with scissors icon. Not an arrow labeled "split."
- **Re-ranking:** Show documents physically swapping positions with crossover lines. Not two lists side by side.

## 6. Visual Design Defaults

### Animation and Layout
- **One idea per beat.** Each beat reveals ONE new element.
- **Focus dimming.** Active element at opacity 1 + glow. Previously-revealed elements dim to 0.25-0.35.
- **Motion has direction.** Pipelines left→right. Problems drop from above. Details slide up.
- **Three-layer opacity.** Foreground 0.8-1.0, midground 0.3-0.6, background 0.05-0.15.
- **Wave stagger timing.** Groups of 2-3 together, pause, next group.

### Arrow and Connection Design

**Line style communicates meaning:**

| Connection type | Line style | Width | Color | End marker |
|----------------|-----------|-------|-------|-----------|
| Primary data flow | Solid | 2px | Brand accent | Open chevron arrowhead |
| Reference/dependency | Dashed (8 4) | 1.5px | Element's own color, 60% opacity | None |
| Automation/background | Dotted (3 3) | 1.5px | Accent, 60% opacity | Small filled dot |

**Routing rules:**
- Hand-draw paths with explicit coordinates for complex layouts.
- For branching (1-to-many): vertical backbone with horizontal branches + junction dots (r=3.5).
- Corner radius on turns: 20-24px minimum.
- Use `strokeLinecap="round"` on all lines.
- Add traveling dots on primary flow arrows.

**Arrow-to-block gap (critical):**
- Minimum 28-32px gap between pipeline blocks. Arrows need room to breathe.
- Arrow start: `blockRightEdge + 6`. Arrow end: `nextBlockLeftEdge - 6`. This prevents arrows overlapping block borders.
- Use simple `<line>` + `<polygon>` arrowhead for horizontal connections. Don't use FlowArrow or DashFlow components for pipeline connections — they add curves and overlapping lines.
- Self-correction loops: use clean L-shaped `<path>` with `Q` curves for corners (radius 12-14px). Push loop bottom at least 40px below block bottom edge.

**Never use DashFlow across a pipeline.** DashFlow draws a continuous dashed line from start to end — it passes straight through blocks in between. For pipeline flow animation, use staggered block entrances instead.

**SVG image preserveAspectRatio:**
- Use `preserveAspectRatio="xMinYMin meet"` to show full image without cropping.
- Never use `"xMidYMid slice"` for screenshots or reference images — it crops edges.
- Size the container to match the image's aspect ratio so no letterboxing occurs.

### Anti-AI-Slop Rules
- **No gradient fills.** Flat fills with opacity variation only.
- **No neon/electric blues** (#0066FF, #0099FF) as primary.
- **No saturated rainbow sequences.** One brand accent + 2-3 muted supporting colors per scene.
- **Strokes over fills.** Outlined shapes = architectural. Filled shapes = clipart.
- **No em dashes** (—) on screen.
- **No spanner verbs** in labels: leverage, robust, seamless, powerful, unlock, harness, streamline, delve, foster.
- **Labels are nouns**, not marketing phrases.
- **Show data, not adjectives.** `[0.23, -0.41, 0.87]` beats "High-dimensional vectors."
- **No generic circles.** Every shape matches its function.
- **Custom illustrations per video.** No generic reusable icon library. Build fresh each time.

### Color Palette Rules
- Use 5-6 colors maximum from a cohesive palette. Not traffic lights.
- Muted tones: `#991b1b` (red-800) not `#dc2626` (red-600). `#166534` (green-800) not `#16a34a` (green-600).
- Accent colors at low opacity (0.04-0.12) for backgrounds, full opacity only for small marks (verdict icons, accent stripes).
- Active elements get a glow halo at 0.03-0.06 opacity.
- Inactive/dimmed elements at 0.25-0.35 opacity, not 0.5.

### "Also Worth Knowing" Pattern
When a scene covers a hero technique and mentions alternatives:
- Hero technique gets 70% of canvas with rich illustration
- Alternatives shown as a simple pill strip at the bottom: `Also worth knowing: [pill] [pill] [pill]`
- Pills: `name.length * 8 + 28` width, 26px height, `rx={13}`, module color at 0.06 fillOpacity + 0.3 strokeOpacity

## 7. Hard-Won UX Rules for Video

These come from real QA failures. They apply regardless of visual style.

**0. No colored fill overlays or summary pills.** Green/blue/colored filled rectangles with bold white or colored text inside are the #1 AI-slop tell. For summaries, overlays, and call-to-action beats: use a frosted backdrop (bg at 92% opacity) with typography-only treatment.

1. **Scale for video, not Retina.** YouTube compresses to ~4-5 Mbps. Most viewers watch at 720p. Everything needs to be 30-50% larger than what looks right in your dev browser.

2. **Contrast must survive compression.** Light strokes on near-white backgrounds vanish after encoding. Use `COLORS.dark` or equivalent for anything that must be read.

3. **Cards > floating pills for 3+ siblings.** Group icon + label + description into card containers (60-80px tall, rounded corners).

4. **Branching layouts need centered composition.** Source at x=0.12-0.15, targets starting at x=0.38-0.42.

5. **Equal visual weight for siblings.** Same stroke, same fill opacity, same font.

6. **Summary text at FONT_SIZE.xl (32) in COLORS.dark at grid.y(0.84-0.92).** Never below y=0.92.

7. **Feedback loop labels need pill badges.** Bare text on dashed arcs is invisible.

8. **Always `premountFor={30}` on `<Sequence>`.** Prevents blank frame flashes on transitions.

9. **CSS transitions and animation classes are FORBIDDEN.** They don't render during `remotion render`. All animation must use `useCurrentFrame()` + `interpolate()` or `spring()`. No Tailwind animation classes. No CSS keyframes. No SVG `<animate>` tags.

10. **Clamp interpolations.** Always pass `{ extrapolateRight: "clamp" }` when using `interpolate()`. Without it, values overshoot past the target range.

11. **Per-video style overrides.** Each video defines its own color palette in a `styles.ts` file alongside its script. Use `createUseScene(getSection)` from `utils/scene.ts` for a video-specific `useScene` hook.

12. **AnimatedCard clipPath fix.** The clipPath rect in AnimatedCard must use local coordinates `(0, -headerHeight)` relative to the children group transform, not absolute `(x, y)` coordinates. This was a bug fix — don't revert it.

13. **Pill/badge width = charCount * 12 + 56 minimum.** Text that fits a rectangle will clip at pill edges.

14. **Text must never overlap or overflow its container.** Calculate total element heights before placing. If elements don't fit, reduce content — never shrink text below minimums.

15. **Left accent stripes > colored header fills on cards.** A 4-6px rounded stripe on the left edge is architectural. Full-width colored header band is PowerPoint.

## 8. File Structure

```
src/videos/{video-name}/
├── {VideoName}.tsx           # Main composition (with calculateMetadata + Audio)
├── styles.ts                 # Video-specific color palette + useScene hook
├── script.ts                 # Narration + proportional beats
├── generate-voiceover.ts     # TTS generation script (run manually)
└── scenes/
    ├── sceneName.tsx          # One file per scene
    └── ...

public/voiceover/{video-name}/
├── {scene-id}.mp3            # Generated audio (one per scene)
└── ...
```

Register in `src/Root.tsx` as a new `<Composition>`.

Commands:
- `npm run preview` — live preview in browser
- `npx tsx src/videos/{video-name}/generate-voiceover.ts` — generate voiceover audio
- `npx remotion render src/index.ts <CompositionId> out/<name>.mp4` — export
