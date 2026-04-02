import React from 'react';
import { Composition } from 'remotion';
import { RAGExplainer } from './videos/rag-explainer/RAGExplainer';
import { totalDuration } from './videos/rag-explainer/script';
import { CANVAS } from './design-system/tokens';

export const RemotionRoot: React.FC = () => (
  <Composition id="RAGExplainer" component={RAGExplainer} durationInFrames={totalDuration} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} />
);
