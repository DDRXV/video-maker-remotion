import React from 'react';
import { Composition } from 'remotion';
import { RAGExplainer } from './videos/rag-explainer/RAGExplainer';
import { totalDuration as ragDuration } from './videos/rag-explainer/script';
import { LLMExplainer } from './videos/llm-explainer/LLMExplainer';
import { totalDuration as llmDuration } from './videos/llm-explainer/script';
import { SkillsExplainer } from './videos/skills-explainer/SkillsExplainer';
import { totalDuration as skillsDuration } from './videos/skills-explainer/script';
import { AgentsExplainer } from './videos/agents-explainer/AgentsExplainer';
import { totalDuration as agentsDuration } from './videos/agents-explainer/script';
import { BrandGuidelines, brandGuidelinesCalculateMetadata, BrandGuidelinesProps } from './videos/brand-guidelines/BrandGuidelines';
import { script as brandScript, totalDuration as brandDuration } from './videos/brand-guidelines/script';
import { VoiceAgents, voiceAgentsCalculateMetadata, VoiceAgentsProps } from './videos/voice-agents/VoiceAgents';
import { script as voiceScript, totalDuration as voiceDuration } from './videos/voice-agents/script';
import { APIExplainer, apiExplainerCalculateMetadata, APIExplainerProps } from './videos/api-explainer/APIExplainer';
import { script as apiScript, totalDuration as apiDuration } from './videos/api-explainer/script';
import { BackendConcepts, backendConceptsCalculateMetadata, BackendConceptsProps } from './videos/backend-concepts/BackendConcepts';
import { script as backendScript, totalDuration as backendDuration } from './videos/backend-concepts/script';
import { RAGExplainer2, ragExplainer2CalculateMetadata, RAGExplainer2Props } from './videos/rag-explainer-2/RAGExplainer2';
import { script as rag2Script, totalDuration as rag2Duration } from './videos/rag-explainer-2/script';
import { CANVAS } from './design-system/tokens';
import { CTA_TOTAL_FRAMES } from './utils/withCTA';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="RAGExplainer" component={RAGExplainer} durationInFrames={ragDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="LLMExplainer" component={LLMExplainer} durationInFrames={llmDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="SkillsExplainer" component={SkillsExplainer} durationInFrames={skillsDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} />
    <Composition id="AgentsExplainer" component={AgentsExplainer} durationInFrames={agentsDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} />
    <Composition<BrandGuidelinesProps> id="BrandGuidelines" component={BrandGuidelines} durationInFrames={brandDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} calculateMetadata={brandGuidelinesCalculateMetadata} defaultProps={{ sections: brandScript, hasAudio: false }} />
    <Composition<VoiceAgentsProps> id="VoiceAgents" component={VoiceAgents} durationInFrames={voiceDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} calculateMetadata={voiceAgentsCalculateMetadata} defaultProps={{ sections: voiceScript, hasAudio: false }} />
    <Composition<APIExplainerProps> id="APIExplainer" component={APIExplainer} durationInFrames={apiDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} calculateMetadata={apiExplainerCalculateMetadata} defaultProps={{ sections: apiScript, hasAudio: false }} />
    <Composition<BackendConceptsProps> id="BackendConcepts" component={BackendConcepts} durationInFrames={backendDuration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} calculateMetadata={backendConceptsCalculateMetadata} defaultProps={{ sections: backendScript, hasAudio: false }} />
    <Composition<RAGExplainer2Props> id="RAGExplainer2" component={RAGExplainer2} durationInFrames={rag2Duration + CTA_TOTAL_FRAMES} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height} calculateMetadata={ragExplainer2CalculateMetadata} defaultProps={{ sections: rag2Script, hasAudio: false }} />
  </>
);
