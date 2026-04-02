import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { COLORS, CANVAS } from '../../design-system/tokens';
import { script } from './script';
import { Background } from '../../components/Background';
import { SvgFilters } from '../../design-system/filters';
import { HookScene } from './scenes/hook';
import { OverviewScene } from './scenes/overview';
import { QueryConstructionScene } from './scenes/queryConstruction';
import { QueryTranslationScene } from './scenes/queryTranslation';
import { RoutingScene } from './scenes/routing';
import { IndexingScene } from './scenes/indexing';
import { RetrievalScene } from './scenes/retrieval';
import { GenerationScene } from './scenes/generation';
import { FullPictureScene } from './scenes/fullPicture';

const scenes = [
  { id: 'hook', Component: HookScene },
  { id: 'overview', Component: OverviewScene },
  { id: 'query-construction', Component: QueryConstructionScene },
  { id: 'query-translation', Component: QueryTranslationScene },
  { id: 'routing', Component: RoutingScene },
  { id: 'indexing', Component: IndexingScene },
  { id: 'retrieval', Component: RetrievalScene },
  { id: 'generation', Component: GenerationScene },
  { id: 'full-picture', Component: FullPictureScene },
];

const SceneCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <SvgFilters />
      <Background pattern="dots" opacity={0.06} />
      {children}
    </svg>
  </AbsoluteFill>
);

export const RAGExplainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.background, fontFamily: 'Inter, sans-serif' }}>
    {scenes.map(({ id, Component }) => {
      const section = script.find(s => s.id === id)!;
      return (
        <Sequence key={id} from={section.startFrame} durationInFrames={section.durationInFrames} name={section.title}>
          <SceneCanvas><Component /></SceneCanvas>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
