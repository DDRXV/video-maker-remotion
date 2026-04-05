---
name: video-maker
description: Creates animated tech explainer videos using Remotion. Triggers when user says "make a video", "create an explainer", "video about", "animate this concept", or describes a visual explanation they want as a video.
---

# Skill: Animated Video Maker

## 1. Core Directive

You create animated explainer videos using the Remotion-based system at `/Users/rajesh/experiments/video-maker`. Videos render as 1920x1080 MP4 at 30fps.

Visual style adapts to the brief. The user might want 3Blue1Brown dark backgrounds, ByteByteGo architecture diagrams, minimal whiteboard sketches, or something new. Ask, then adapt. The design system provides defaults — override them when the brief calls for it.

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
Build each scene with custom inline SVG illustrations specific to the video's content. Adapt visual style to the brief. See Section 5 for defaults and Section 6 for the toolkit available.

### Step 5: Wire Composition
Create the composition file that imports all scenes, maps them to `<Sequence>` blocks driven by script.ts timing, and wraps each in `SceneCanvas`.

### Step 6: Visual QA — Screenshot Every Scene
**Mandatory before showing the user.** Render still frames and review them.

1. For each scene, pick 2-3 key beat frames (mid-point and final beat).
2. Render stills:
   ```bash
   npx remotion still src/index.ts <CompositionId> /tmp/<scene>-<beat>.png --frame=<N>
   ```
3. Read each PNG and review it using the full Visual QA Review prompt in [references/visual-qa-review.md](references/visual-qa-review.md). This covers:
   - AI-slop color detection (no gradients, no neon blues, no saturated rainbow)
   - AI-ish text detection (no em dashes, no spanner verbs, no marketing-speak)
   - Scene detailing check (every card must show internal content, not just labels)
   - Layout and composition (canvas usage, balance, text overflow, alignment)
   - Video-specific readability (720p test, compression survival, contrast ratios)
   - Premium benchmark comparison (ByteByteGo, Notion, 3B1B, Stripe)

4. For each scene, output the structured review format from the reference doc (issues, verdict, priority fixes).

5. Fix all FAIL scenes, re-render, and re-review until all scenes pass.

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
morphSpring(frame, fps, delay)     // position/size transitions
focusSpring(frame, fps, delay)     // slow, gentle
pulse(frame, cycleDuration, min, max)  // ambient pulse
```

### SVG Filters (via SceneCanvas)
```
filter="url(#shadow-sm)"   filter="url(#shadow-md)"   filter="url(#glow-accent)"
```

## 5. Visual Design Defaults

These produce a clean, architectural look. Override for different briefs. See [references/visual-qa-review.md](references/visual-qa-review.md) for the full QA review criteria.

### Animation and Layout
- **One idea per beat.** Each beat reveals ONE new element.
- **Focus dimming.** Active element at opacity 1 + glow. Previously-revealed elements dim to 0.35.
- **Color zone halos.** 8-12% fill opacity rounded rects for visual grouping.
- **Motion has direction.** Pipelines left→right. Problems drop from above. Details slide up.
- **Floating particles.** 4-8 small circles at 0.05-0.15 opacity for ambient life.
- **Three-layer opacity.** Foreground 0.8-1.0, midground 0.3-0.6, background 0.05-0.15.
- **Wave stagger timing.** Groups of 2-3 together, pause, next group.

### Arrow and Connection Design (Critical for Premium Feel)

**Line style communicates meaning.** Use three tiers:

| Connection type | Line style | Width | Color | End marker |
|----------------|-----------|-------|-------|-----------|
| Primary data flow | Solid | 2px | Brand accent | Open chevron arrowhead |
| Reference/dependency | Dashed (8 4) | 1.5px | Element's own color, 60% opacity | None (line terminates) |
| Automation/background | Dotted (3 3) | 1.5px | Green, 60% opacity | Small filled dot (r=3-4) |

**Routing rules:**
- Never use auto-calculated curved or elbow arrows for complex layouts. Hand-draw paths with explicit coordinates.
- For branching (1-to-many): draw a vertical backbone with horizontal branches at exact card heights. Add junction dots (r=3.5, filled) at branch points.
- For straight connections at the same height: use a simple horizontal `<line>`. No curves, no elbows.
- For connections between rows: use clean L-shaped paths with only one 90-degree turn. The turn happens at the source or target node edge, never in the middle of empty space.
- Corner radius on turns: 20-24px minimum. Tight corners (8px) look kinky on video.
- Use `strokeLinecap="round"` on all lines.

**When to use FlowArrow component vs hand-drawn SVG:**
- FlowArrow is fine for simple straight or gently curved connections between two nearby elements.
- For anything involving branching, bus patterns, or precise routing: draw explicit `<line>` and `<path>` elements with exact coordinates. This gives pixel-perfect control that auto-routing cannot match.

**The test:** Would a system architect print this diagram and pin it on a wall? If the arrows look like they were auto-routed by a diagramming tool, redraw them by hand.

### Scene Detailing (Non-Negotiable)
Every card, box, or container shows what is inside it. Empty labeled boxes = instant fail. What "inside" means depends on the video's subject matter. A database card should show rows. A network card should show nodes. A code card should show lines of code. Figure out what belongs inside each element based on the concept being explained.

### Anti-AI-Slop Rules
- **No gradient fills.** Flat fills with opacity variation only.
- **No neon/electric blues** (#0066FF, #0099FF) as primary. They scream "Canva template."
- **No saturated rainbow sequences.** One brand accent + 2-3 muted supporting colors per scene.
- **Strokes over fills.** Outlined shapes = architectural. Filled shapes = clipart.
- **No em dashes** (—) on screen. Period.
- **No spanner verbs** in labels: leverage, robust, seamless, powerful, unlock, harness, streamline, delve, foster.
- **Labels are nouns**, not marketing phrases. "Self-Attention" not "Supercharged Attention."
- **Show data, not adjectives.** "(n, 4096) float32" beats "High-dimensional vectors."
- **Custom illustrations per video.** No generic reusable icon library. Build fresh each time.

## 6. Hard-Won UX Rules for Video

These come from real QA failures. They apply regardless of visual style.

**0. No colored fill overlays or summary pills.** Green/blue/colored filled rectangles with bold white or colored text inside are the #1 AI-slop tell. For summaries, overlays, and call-to-action beats: use a frosted backdrop (bg at 92% opacity) with typography-only treatment. For metrics, use stat rows with large numbers + small labels separated by thin divider lines. Stripe and Notion never use colored pills for key moments.

1. **Scale for video, not Retina.** YouTube compresses to ~4-5 Mbps. Most viewers watch at 720p on a laptop. Everything needs to be 30-50% larger than what looks right in your dev browser. Node radius 40-48, pill height 48-56.

2. **Contrast must survive compression.** Light strokes on near-white backgrounds vanish after encoding. Test: if you squint and it disappears, it will disappear on YouTube. Use `COLORS.dark` for anything that must be read.

3. **Cards > floating pills for 3+ siblings.** Group icon + label + description into card containers (60-80px tall, rounded corners). Prevents the "scattered puzzle pieces" look.

4. **Branching layouts need centered composition.** When one element branches to 3+ targets, keep source at x=0.12-0.15 and targets starting at x=0.38-0.42. Short curved paths, not long-distance wiring with a dead triangle in the middle.

5. **Equal visual weight for siblings.** Same stroke, same fill opacity, same font. Focus dimming is the ONLY differentiator.

6. **Summary text is not an afterthought.** FONT_SIZE.xl (32) in COLORS.dark at grid.y(0.84-0.88). Never below y=0.9.

7. **Feedback loop labels need pill badges.** Bare text on dashed arcs is invisible. Wrap in a rect with 10% fill + 1px stroke.

8. **Sub-item icons need 2x scale.** Mini icons below parent nodes default too small. Double them. Use FONT_SIZE.sm labels in COLORS.dark.

9. **Color zone halos at 8-12% opacity.** 4% is invisible on video.

10. **Module pill grid: min 280px wide, 48px tall.** 80-90px vertical gaps, 320-340px horizontal gaps.

11. **Text must never overlap or overflow its container.** Before placing text, calculate the total height of all elements in the scene. If a list has N items at H pixels each starting at Y, the bottom edge is Y + N*H. The summary text must start below that with at least 30px gap. If it doesn't fit, reduce the list (fewer items, smaller line height) rather than shrinking the summary text. Overlapping text is the most visible amateur mistake.

12. **Text inside cards must fit with 12px+ padding on each side.** If a description is too long for the card width, shorten the text. Do not widen the card beyond its siblings or break the layout grid. Short, punchy descriptions beat grammatically complete sentences. Estimate pixel width before placing: ~10px per character for monospace, ~8px for sans-serif at the given font size. **Monospace text is 20-30% wider than sans-serif at the same font size.** Use `FONT_SIZE.sm` (18px) max for monospace inside cards. Always test mono lines: count chars * 10 and compare to card inner width.

13. **No zoom effects.** Focus dimming and scene transitions handle emphasis and depth. Zoom breaks the viewer's spatial reference frame. If something needs emphasis, use focus dimming + glow halo. If you need to show internal detail, use scene transitions or internal card detail.

14. **Left accent stripes > colored header fills on cards.** A 6px rounded stripe on the left edge of a card is architectural. A full-width colored header band is PowerPoint. Use stripes with `fillOpacity` at 0.3 normally, 0.8 when focused.

15. **Metric/latency labels go inside cards, not below.** Floating pills or badges below cards waste vertical space and look like Canva annotations. Place numbers bottom-right inside the card in the stage's color with monospace font.

16. **Focus dimming must track beat firing order, not array index.** When highlighting one element in a group, find the most recently activated beat (highest `enterAt` among those with `progress > 0.5`). Do not check `array[i+1]` — array order and beat order are often different. When a summary beat fires, bring all elements back to 0.7 opacity so the full picture is visible.

17. **Label text uses `C.mid` (#475569), never `C.light` (#94a3b8).** Light gray vanishes after YouTube compression at 720p. Every text element that needs to be read must use `C.mid` or darker.

18. **Always `premountFor={30}` on `<Sequence>`.** Preloads the component 1 second before it appears. Without this, scenes flash blank for a frame on transition.

19. **CSS transitions and animation classes are forbidden.** They don't render during `remotion render`. All animation must be driven by `useCurrentFrame()` + `interpolate()` or `spring()`. No Tailwind animation classes. No CSS keyframes.

20. **Pill/badge width = charCount * 12 + 56 minimum.** Rounded corners eat into horizontal space. Text that fits a rectangle will clip at pill edges. Use `name.length * 12 + 56` for pill width at FONT_SIZE.md, with `rx={pillH/2}` for full-radius corners. Always center-align text with `textAnchor="middle"`. Pill height 40px minimum.

21. **Clamp interpolations.** Always pass `{ extrapolateRight: "clamp" }` when using `interpolate()`. Without it, values overshoot past the target range and cause visual glitches (opacity > 1, positions past bounds).

21. **Per-video style overrides.** Each video defines its own color palette in a `styles.ts` file alongside its script. Use `createUseScene(getSection)` from `utils/scene.ts` for a video-specific `useScene` hook. This keeps videos independent. Don't modify the global design tokens for a single video's palette.

## 7. File Structure

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
