import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { CANVAS } from '../design-system/tokens';
import { Background } from './Background';
import { SvgFilters } from '../design-system/filters';
import { MavenCTA } from './MavenCTA';

interface MavenCTASceneProps {
  variant: 'mid' | 'end';
}

/**
 * Self-contained CTA scene with its own SceneCanvas and audio.
 * Drop this into a Sequence — no need to wrap in SceneCanvas externally.
 */
export const MavenCTAScene: React.FC<MavenCTASceneProps> = ({ variant }) => (
  <AbsoluteFill>
    <svg
      viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      <SvgFilters />
      <Background pattern="dots" opacity={0.04} />
      <MavenCTA variant={variant} />
    </svg>
    <Audio src={staticFile(`voiceover/cta/${variant === 'mid' ? 'mid-cta' : 'end-cta'}.mp3`)} />
  </AbsoluteFill>
);
