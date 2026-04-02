import { useCurrentFrame, useVideoConfig } from 'remotion';
import { entranceSpring } from '../design-system/easing';
import { getSection } from '../videos/rag-explainer/script';

export function useScene(sectionId: string) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const section = getSection(sectionId);

  const beat = (label: string): number => {
    const b = section.beats.find((b) => b.label === label);
    if (!b) { console.warn(`Beat "${label}" not found in "${sectionId}"`); return 0; }
    return b.atFrame;
  };

  const progress = (label: string): number => entranceSpring(frame, fps, beat(label));

  return { beat, progress, frame, fps, section };
}
