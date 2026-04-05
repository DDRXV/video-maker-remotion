import { s } from '../../design-system/tokens';

export interface Beat { label: string; atFrame: number; }
export interface ScriptSection { id: string; title: string; narration: string; startFrame: number; durationInFrames: number; beats: Beat[]; }

const sections: ScriptSection[] = [
  {
    id: 'hook', title: 'The Magic Moment',
    narration: `I typed "Plan the launch for our new AI writing tool." One prompt. Claude spawned four agents. One researched competitors. One drafted a press release. One built a 6-week timeline. One wrote landing page copy. All four ran at the same time. Fifteen seconds later, I had a complete launch plan. This is multi-agent orchestration.`,
    startFrame: 0, durationInFrames: s(38),
    beats: [
      { label: 'show-prompt', atFrame: s(1) },
      { label: 'show-agents-spawn', atFrame: s(6) },
      { label: 'show-parallel-bars', atFrame: s(12) },
      { label: 'show-results', atFrame: s(22) },
      { label: 'show-punchline', atFrame: s(30) },
    ],
  },
  {
    id: 'sequential-problem', title: 'The Sequential Bottleneck',
    narration: `Without agents, Claude works like a single thread. It researches competitors, waits, then drafts the press release, waits, then builds the timeline. Every task blocks the next one. Four independent tasks done one by one. The bottleneck is not intelligence. It is the sequential execution model.`,
    startFrame: s(38), durationInFrames: s(35),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-single-thread', atFrame: s(4) },
      { label: 'show-blocking', atFrame: s(12) },
      { label: 'show-timeline', atFrame: s(20) },
      { label: 'show-bottleneck', atFrame: s(28) },
    ],
  },
  {
    id: 'agent-tool', title: 'The Agent Tool',
    narration: `The Agent tool changes this. Claude reads your prompt and decides it needs competitor research. It spawns a subagent with a specific brief: "Research the top 5 competitor launches in AI writing tools." That subagent gets its own workspace. It searches, reads articles, compiles data. When it finishes, it sends back a two-paragraph summary. The main agent never sees the 30 articles the subagent read. It just gets the answer.`,
    startFrame: s(73), durationInFrames: s(42),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-main-agent', atFrame: s(4) },
      { label: 'show-spawn', atFrame: s(10) },
      { label: 'show-subagent-work', atFrame: s(18) },
      { label: 'show-result-back', atFrame: s(28) },
      { label: 'show-summary', atFrame: s(36) },
    ],
  },
  {
    id: 'agent-types', title: 'Agent Types',
    narration: `Not all agents are the same. Claude Code has specialized agent types. Explore agents are fast and focused on searching. Plan agents design strategies. Security agents review for vulnerabilities. General-purpose agents handle anything. Each type has access to different tools. You pick the type that matches the job.`,
    startFrame: s(115), durationInFrames: s(42),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-explore', atFrame: s(4) },
      { label: 'show-plan', atFrame: s(12) },
      { label: 'show-security', atFrame: s(20) },
      { label: 'show-general', atFrame: s(28) },
      { label: 'show-summary', atFrame: s(36) },
    ],
  },
  {
    id: 'parallel', title: 'Parallel Execution',
    narration: `Here is what happens with our launch plan. Claude sends all four agent requests in a single message. Competitor research, press release, timeline, and landing page copy all start at the same time. They run in parallel. The main agent does not wait for the competitor research to finish before starting the press release. Fifteen seconds of wall time instead of sixty.`,
    startFrame: s(157), durationInFrames: s(40),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-single-message', atFrame: s(4) },
      { label: 'show-four-agents', atFrame: s(10) },
      { label: 'show-running', atFrame: s(18) },
      { label: 'show-all-done', atFrame: s(28) },
      { label: 'show-summary', atFrame: s(34) },
    ],
  },
  {
    id: 'context', title: 'Context Isolation',
    narration: `Each subagent starts with a clean slate. The competitor research agent gets briefed: "Research top 5 competitor launches." It reads 30 articles, visits competitor sites, compiles notes. All of that stays inside its own context. When it finishes, only a two-paragraph summary crosses back to the main agent. The main agent's context stays clean. Just the prompt and four concise results.`,
    startFrame: s(197), durationInFrames: s(40),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-main-context', atFrame: s(4) },
      { label: 'show-subagent-context', atFrame: s(12) },
      { label: 'show-isolation', atFrame: s(20) },
      { label: 'show-result-slim', atFrame: s(28) },
      { label: 'show-summary', atFrame: s(34) },
    ],
  },
  {
    id: 'orchestration', title: 'The Orchestration Pattern',
    narration: `The main agent is the orchestrator. It reads the launch request, breaks it into four independent workstreams, spawns an agent for each, collects the results, and synthesizes them into one coherent launch plan. It is like a PM who assigns work to four specialists and reviews their output. The main agent plans, delegates, and synthesizes.`,
    startFrame: s(237), durationInFrames: s(38),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-understand', atFrame: s(4) },
      { label: 'show-break-down', atFrame: s(10) },
      { label: 'show-delegate', atFrame: s(16) },
      { label: 'show-collect', atFrame: s(24) },
      { label: 'show-synthesize', atFrame: s(30) },
    ],
  },
  {
    id: 'full-picture', title: 'The Complete System',
    narration: `Here is the full system. You type "Plan my product launch." The orchestrator identifies four workstreams. Four agents run in parallel: competitor research, press release, timeline, landing page copy. Each works in its own context. Results flow back. The orchestrator synthesizes them into a complete launch plan. One prompt in. One deliverable out. Four specialists working behind the scenes.`,
    startFrame: s(275), durationInFrames: s(42),
    beats: [
      { label: 'show-user', atFrame: s(2) },
      { label: 'show-orchestrator', atFrame: s(6) },
      { label: 'show-agents', atFrame: s(12) },
      { label: 'show-results-back', atFrame: s(22) },
      { label: 'show-response', atFrame: s(30) },
      { label: 'show-final', atFrame: s(36) },
    ],
  },
];

export const script = sections;
export const totalDuration = sections.reduce((sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames), 0);
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(`Section "${id}" not found`); return s; };
