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
import { WhyRagScene } from './scenes/whyRag';
import { HookScene } from './scenes/hook';
import { OverviewScene } from './scenes/overview';
import { RagBasicsScene } from './scenes/ragBasics';
import { QueryConstructionScene } from './scenes/queryConstruction';
import { QueryTranslationScene } from './scenes/queryTranslation';
import { RoutingScene } from './scenes/routing';
import { IndexingScene } from './scenes/indexing';
import { RetrievalScene } from './scenes/retrieval';
import { GenerationScene } from './scenes/generation';
import { FullPictureScene } from './scenes/fullPicture';

const sceneComponents: Record<string, React.FC> = {
  'why-rag': WhyRagScene,
  'hook': HookScene,
  'overview': OverviewScene,
  'rag-basics': RagBasicsScene,
  'query-construction': QueryConstructionScene,
  'query-translation': QueryTranslationScene,
  'routing': RoutingScene,
  'indexing': IndexingScene,
  'retrieval': RetrievalScene,
  'generation': GenerationScene,
  'full-picture': FullPictureScene,
};

export interface RAGExplainer2Props {
  sections: ScriptSection[];
  hasAudio: boolean;
}

const SceneCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <SvgFilters />
      <Background pattern="dots" opacity={0.03} />
      {children}
      <Watermark />
    </svg>
  </AbsoluteFill>
);

export const ragExplainer2CalculateMetadata: CalculateMetadataFunction<RAGExplainer2Props> = async () => {
  try {
    const durations = await Promise.all(
      sectionIds.map((id) =>
        getAudioDuration(staticFile(`voiceover/rag-explainer-2/${id}.mp3`))
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

export const RAGExplainer2: React.FC<RAGExplainer2Props> = ({ sections, hasAudio }) => {
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
              <Audio src={staticFile(`voiceover/rag-explainer-2/${id}.mp3`)} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const patchedSections = { current: null as Map<string, ScriptSection> | null };
