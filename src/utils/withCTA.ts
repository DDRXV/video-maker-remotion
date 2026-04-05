import { s } from '../design-system/tokens';

interface Section {
  id: string;
  title: string;
  narration: string;
  startFrame: number;
  durationInFrames: number;
  beats: unknown[];
}

const MID_CTA_DURATION = s(14);
const END_CTA_DURATION = s(24);

/** Total frames added by CTA inserts — add this to composition durationInFrames */
export const CTA_TOTAL_FRAMES = MID_CTA_DURATION + END_CTA_DURATION;

/**
 * Takes the original script sections and returns a new array with:
 * - A mid-CTA inserted after the middle scene
 * - An end-CTA appended after the last scene
 * All startFrames are recalculated to account for the insertions.
 */
export function withCTASections<T extends Section>(sections: T[]): (T | Section)[] {
  const midIndex = Math.ceil(sections.length / 2); // insert after this many scenes

  const result: (T | Section)[] = [];
  let currentFrame = 0;

  for (let i = 0; i < sections.length; i++) {
    result.push({ ...sections[i], startFrame: currentFrame });
    currentFrame += sections[i].durationInFrames;

    if (i === midIndex - 1) {
      result.push({
        id: 'mid-cta',
        title: 'Maven Lightning Sessions',
        narration: '',
        startFrame: currentFrame,
        durationInFrames: MID_CTA_DURATION,
        beats: [],
      });
      currentFrame += MID_CTA_DURATION;
    }
  }

  result.push({
    id: 'end-cta',
    title: 'Join Free Live Sessions',
    narration: '',
    startFrame: currentFrame,
    durationInFrames: END_CTA_DURATION,
    beats: [],
  });

  return result;
}
