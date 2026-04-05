import { useCurrentFrame, useVideoConfig } from 'remotion';
import { entranceSpring } from '../design-system/easing';

interface BeatLegacy { label: string; atFrame: number; }
interface BeatProportional { label: string; atFraction: number; }
type BeatAny = BeatLegacy | BeatProportional;

interface ScriptSection {
  id: string;
  title: string;
  narration: string;
  startFrame: number;
  durationInFrames: number;
  beats: BeatAny[];
}

type GetSection = (id: string) => ScriptSection;

function resolveBeatFrame(b: BeatAny, sectionDuration: number): number {
  if ('atFrame' in b) return b.atFrame;
  return Math.round(b.atFraction * sectionDuration);
}

export function createUseScene(getSection: GetSection) {
  return function useScene(sectionId: string) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const section = getSection(sectionId);

    const beat = (label: string): number => {
      const b = section.beats.find((b) => b.label === label);
      if (!b) { console.warn(`Beat "${label}" not found in "${sectionId}"`); return 0; }
      return resolveBeatFrame(b, section.durationInFrames);
    };

    const progress = (label: string): number => entranceSpring(frame, fps, beat(label));

    return { beat, progress, frame, fps, section };
  };
}

// Legacy export for existing RAG explainer
import { getSection as ragGetSection } from '../videos/rag-explainer/script';
export const useScene = createUseScene(ragGetSection);
