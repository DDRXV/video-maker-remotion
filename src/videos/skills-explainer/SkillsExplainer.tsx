import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CANVAS } from '../../design-system/tokens';
import { script } from './script';
import { Background } from '../../components/Background';
import { SvgFilters } from '../../design-system/filters';
import { C } from './styles';
import { HookScene } from './scenes/hook';
import { WhatIsSkillScene } from './scenes/whatIsSkill';
import { SkillFileScene } from './scenes/skillFile';
import { FolderStructureScene } from './scenes/folderStructure';
import { DeepPromptsScene } from './scenes/deepPrompts';
import { ScriptsScene } from './scenes/scripts';
import { BrandScene } from './scenes/brand';
import { ActivationScene } from './scenes/activation';
import { FullPictureScene } from './scenes/fullPicture';

const scenes = [
  { id: 'hook', Component: HookScene },
  { id: 'what-is-skill', Component: WhatIsSkillScene },
  { id: 'skill-file', Component: SkillFileScene },
  { id: 'folder-structure', Component: FolderStructureScene },
  { id: 'deep-prompts', Component: DeepPromptsScene },
  { id: 'scripts', Component: ScriptsScene },
  { id: 'brand', Component: BrandScene },
  { id: 'activation', Component: ActivationScene },
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

export const SkillsExplainer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: 'Inter, sans-serif' }}>
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
