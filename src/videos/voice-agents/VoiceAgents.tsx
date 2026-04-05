import React from 'react';
import { AbsoluteFill, Sequence, staticFile, CalculateMetadataFunction } from 'remotion';
import { Audio } from '@remotion/media';
import { CANVAS } from '../../design-system/tokens';
import { script, sectionIds, applyAudioDurations, ScriptSection } from './script';
import { Background } from '../../components/Background';
import { SvgFilters } from '../../design-system/filters';
import { C } from './styles';
import { getAudioDuration } from '../../utils/audio-duration';
import { Watermark } from '../../components/Watermark';
import { MavenCTAScene } from '../../components/MavenCTAScene';
import { withCTASections, CTA_TOTAL_FRAMES } from '../../utils/withCTA';
import { HookScene } from './scenes/hook';
import { RevealScene } from './scenes/reveal';
import { PipelineScene } from './scenes/pipeline';
import { ContextScene } from './scenes/context';
import { LatencyScene } from './scenes/latency';
import { TurnTakingScene } from './scenes/turnTaking';
import { UseCasesScene } from './scenes/useCases';
import { StackScene } from './scenes/stack';

const sceneComponents: Record<string, React.FC> = {
  'hook': HookScene,
  'reveal': RevealScene,
  'pipeline': PipelineScene,
  'context': ContextScene,
  'latency': LatencyScene,
  'turn-taking': TurnTakingScene,
  'use-cases': UseCasesScene,
  'stack': StackScene,
};

export interface VoiceAgentsProps {
  sections: ScriptSection[];
  hasAudio: boolean;
}

const SceneCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <SvgFilters />
      <Background pattern="dots" opacity={0.04} />
      {children}
      <Watermark />
    </svg>
  </AbsoluteFill>
);

export const voiceAgentsCalculateMetadata: CalculateMetadataFunction<VoiceAgentsProps> = async () => {
  try {
    const durations = await Promise.all(
      sectionIds.map((id) =>
        getAudioDuration(staticFile(`voiceover/voice-agents/${id}.mp3`))
      )
    );
    const sections = applyAudioDurations(durations);
    const totalDuration = sections.reduce(
      (sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames),
      0
    );
    return {
      durationInFrames: totalDuration + CTA_TOTAL_FRAMES,
      props: { sections, hasAudio: true },
    };
  } catch {
    return {
      props: { sections: script, hasAudio: false },
    };
  }
};

export const VoiceAgents: React.FC<VoiceAgentsProps> = ({ sections, hasAudio }) => {
  const sectionMap = new Map(sections.map((s) => [s.id, s]));
  patchedSections.current = sectionMap;

  const allSections = withCTASections(sections);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: 'Inter, sans-serif' }}>
      {allSections.map(({ id, startFrame, durationInFrames, title }) => {
        if (id === 'mid-cta' || id === 'end-cta') {
          return (
            <Sequence key={id} from={startFrame} durationInFrames={durationInFrames} name={title}>
              <MavenCTAScene variant={id === 'mid-cta' ? 'mid' : 'end'} />
            </Sequence>
          );
        }
        const Component = sceneComponents[id];
        if (!Component) return null;
        return (
          <Sequence
            key={id}
            from={startFrame}
            durationInFrames={durationInFrames}
            name={title}
            premountFor={30}
          >
            <SceneCanvas><Component /></SceneCanvas>
            {hasAudio && (
              <Audio src={staticFile(`voiceover/voice-agents/${id}.mp3`)} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const patchedSections = { current: null as Map<string, ScriptSection> | null };
