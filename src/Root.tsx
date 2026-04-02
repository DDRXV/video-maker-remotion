import React from 'react';
import { Composition } from 'remotion';
import { RAGExplainer } from './videos/rag-explainer/RAGExplainer';
import { totalDuration as ragDuration } from './videos/rag-explainer/script';
import { LLMExplainer } from './videos/llm-explainer/LLMExplainer';
import { totalDuration as llmDuration } from './videos/llm-explainer/script';
import { CANVAS } from './design-system/tokens';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="RAGExplainer" component={RAGExplainer} durationInFrames={ragDuration} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="LLMExplainer" component={LLMExplainer} durationInFrames={llmDuration} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} />
  </>
);
