import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CANVAS } from '../../design-system/tokens';
import { script } from './script';
import { Background } from '../../components/Background';
import { SvgFilters } from '../../design-system/filters';
import { BBG } from './styles';
import { HookScene } from './scenes/hook';
import { NumbersScene } from './scenes/numbers';
import { TokenizationScene } from './scenes/tokenization';
import { EmbeddingScene } from './scenes/embedding';
import { TransformerScene } from './scenes/transformer';
import { AttentionScene } from './scenes/attention';
import { GenerationScene } from './scenes/generation';
import { FullPictureScene } from './scenes/fullPicture';

const scenes = [
  { id: 'hook', Component: HookScene },
  { id: 'numbers', Component: NumbersScene },
  { id: 'tokenization', Component: TokenizationScene },
  { id: 'embedding', Component: EmbeddingScene },
  { id: 'transformer', Component: TransformerScene },
  { id: 'attention', Component: AttentionScene },
  { id: 'generation', Component: GenerationScene },
  { id: 'full-picture', Component: FullPictureScene },
];

const SceneCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <SvgFilters />
      <Background pattern="dots" opacity={0.04} />
      {children}
    </svg>
  </AbsoluteFill>
);

export const LLMExplainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BBG.bg, fontFamily: 'Inter, sans-serif' }}>
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
