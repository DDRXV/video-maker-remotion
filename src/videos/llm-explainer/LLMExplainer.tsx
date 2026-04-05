import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CANVAS } from '../../design-system/tokens';
import { script } from './script';
import { Background } from '../../components/Background';
import { SvgFilters } from '../../design-system/filters';
import { BBG } from './styles';
import { MavenCTAScene } from '../../components/MavenCTAScene';
import { withCTASections } from '../../utils/withCTA';
import { HookScene } from './scenes/hook';
import { NumbersScene } from './scenes/numbers';
import { TokenizationScene } from './scenes/tokenization';
import { EmbeddingScene } from './scenes/embedding';
import { TransformerScene } from './scenes/transformer';
import { AttentionScene } from './scenes/attention';
import { GenerationScene } from './scenes/generation';
import { FullPictureScene } from './scenes/fullPicture';

const sceneComponents: Record<string, React.FC> = {
  'hook': HookScene,
  'numbers': NumbersScene,
  'tokenization': TokenizationScene,
  'embedding': EmbeddingScene,
  'transformer': TransformerScene,
  'attention': AttentionScene,
  'generation': GenerationScene,
  'full-picture': FullPictureScene,
};

const SceneCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <SvgFilters />
      <Background pattern="dots" opacity={0.04} />
      {children}
    </svg>
  </AbsoluteFill>
);

const allSections = withCTASections(script);

export const LLMExplainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BBG.bg, fontFamily: 'Inter, sans-serif' }}>
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
        <Sequence key={id} from={startFrame} durationInFrames={durationInFrames} name={title}>
          <SceneCanvas><Component /></SceneCanvas>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
