import { s } from '../../design-system/tokens';

export interface Beat { label: string; atFrame: number; }
export interface ScriptSection { id: string; title: string; narration: string; startFrame: number; durationInFrames: number; beats: Beat[]; }

const sections: ScriptSection[] = [
  {
    id: 'hook', title: 'The Problem with Basic RAG',
    narration: `Most RAG tutorials show you the happy path. Take some docs, embed them, search, done. But production RAG is a different animal. Your retrieval misses relevant docs. Your chunks are the wrong size. Your users ask vague questions that don't match anything. This video covers the full production RAG architecture — six modules that take you from "it works in a demo" to "it works at scale."`,
    startFrame: 0, durationInFrames: s(35),
    beats: [{ label: 'show-basic-flow', atFrame: s(2) }, { label: 'show-problems', atFrame: s(12) }, { label: 'show-six-modules', atFrame: s(25) }],
  },
  {
    id: 'overview', title: 'The Full Architecture',
    narration: `Here's the full picture. A question comes in on the left. Before it hits any database, it goes through routing and query translation. Then it gets sent to one or more data sources — vector stores, relational databases, graph databases. The retrieved documents get ranked, filtered, and sometimes re-retrieved. Finally, the generation step produces an answer and can loop back to re-retrieve if the quality isn't good enough. Six modules, each solving a specific failure mode. Let's walk through each one.`,
    startFrame: s(35), durationInFrames: s(45),
    beats: [{ label: 'show-question-in', atFrame: s(2) }, { label: 'show-routing', atFrame: s(8) }, { label: 'show-query-translation', atFrame: s(12) }, { label: 'show-data-sources', atFrame: s(16) }, { label: 'show-retrieval', atFrame: s(22) }, { label: 'show-generation', atFrame: s(28) }, { label: 'show-answer-out', atFrame: s(32) }, { label: 'highlight-six', atFrame: s(38) }],
  },
  {
    id: 'query-construction', title: 'Query Construction',
    narration: `The first module is query construction. Not all data lives in a vector store. Some questions need SQL queries against a relational database. Others need Cypher queries for a graph database. Text-to-SQL converts natural language into SQL. Text-to-Cypher does the same for graph queries. And self-query retrievers automatically generate metadata filters. This matters because real production data lives across multiple systems.`,
    startFrame: s(80), durationInFrames: s(50),
    beats: [{ label: 'show-title', atFrame: s(1) }, { label: 'show-relational', atFrame: s(6) }, { label: 'show-graphdb', atFrame: s(14) }, { label: 'show-vectordb', atFrame: s(22) }, { label: 'show-self-query', atFrame: s(30) }, { label: 'show-summary', atFrame: s(42) }],
  },
  {
    id: 'query-translation', title: 'Query Translation',
    narration: `Query translation is about re-phrasing the question to get better retrieval results. Multi-query generates multiple versions of the question. RAG-Fusion merges results using reciprocal rank fusion. Decomposition breaks a complex question into sub-questions. Step-back asks a more general version first. And HyDE generates a hypothetical answer, then searches for documents similar to that answer. Each technique solves a different retrieval failure mode.`,
    startFrame: s(130), durationInFrames: s(55),
    beats: [{ label: 'show-title', atFrame: s(1) }, { label: 'show-input-question', atFrame: s(4) }, { label: 'show-multi-query', atFrame: s(12) }, { label: 'show-rag-fusion', atFrame: s(18) }, { label: 'show-decomposition', atFrame: s(24) }, { label: 'show-stepback', atFrame: s(30) }, { label: 'show-hyde', atFrame: s(36) }, { label: 'show-summary', atFrame: s(46) }],
  },
  {
    id: 'routing', title: 'Routing',
    narration: `Routing decides where to send the question. Logical routing uses the LLM itself to pick the right data source. Semantic routing embeds the question and compares it against pre-defined prompt templates. In production, you often need both.`,
    startFrame: s(185), durationInFrames: s(45),
    beats: [{ label: 'show-title', atFrame: s(1) }, { label: 'show-question-in', atFrame: s(4) }, { label: 'show-logical', atFrame: s(8) }, { label: 'show-semantic', atFrame: s(18) }, { label: 'show-combined', atFrame: s(32) }, { label: 'show-summary', atFrame: s(38) }],
  },
  {
    id: 'indexing', title: 'Indexing',
    narration: `Indexing is how you prepare your data for retrieval. Chunk optimization means choosing the right chunk size. Multi-representation indexing stores both a summary and the full document. Specialized embeddings mean fine-tuning your embedding model for your domain. And hierarchical indexing — that's RAPTOR — creates a tree of summaries at different abstraction levels.`,
    startFrame: s(230), durationInFrames: s(60),
    beats: [{ label: 'show-title', atFrame: s(1) }, { label: 'show-chunk-opt', atFrame: s(4) }, { label: 'show-multi-rep', atFrame: s(16) }, { label: 'show-specialized', atFrame: s(28) }, { label: 'show-hierarchical', atFrame: s(38) }, { label: 'show-summary', atFrame: s(52) }],
  },
  {
    id: 'retrieval', title: 'Retrieval',
    narration: `After you retrieve documents, you need to rank and refine them. Ranking uses models like Re-Rank or RankGPT to sort results by actual relevance. CRAG evaluates whether retrieved documents are relevant. If they're not, it triggers active retrieval — going back to search again, sometimes using different sources. This feedback loop is what separates production RAG from demos.`,
    startFrame: s(290), durationInFrames: s(50),
    beats: [{ label: 'show-title', atFrame: s(1) }, { label: 'show-ranking', atFrame: s(4) }, { label: 'show-rerank-tools', atFrame: s(10) }, { label: 'show-refinement', atFrame: s(18) }, { label: 'show-crag', atFrame: s(24) }, { label: 'show-active-retrieval', atFrame: s(32) }, { label: 'show-feedback-loop', atFrame: s(40) }],
  },
  {
    id: 'generation', title: 'Generation',
    narration: `The final module is generation. Self-RAG adds self-reflection. The model generates an answer, then evaluates its own output. RRR takes a different approach — it rewrites the query based on initial generation, retrieves again, and reads the new results. The system doesn't just answer once — it checks its own work.`,
    startFrame: s(340), durationInFrames: s(45),
    beats: [{ label: 'show-title', atFrame: s(1) }, { label: 'show-self-rag', atFrame: s(5) }, { label: 'show-evaluation', atFrame: s(14) }, { label: 'show-rrr', atFrame: s(22) }, { label: 'show-loop-back', atFrame: s(30) }, { label: 'show-summary', atFrame: s(38) }],
  },
  {
    id: 'full-picture', title: 'The Complete System',
    narration: `Here's the complete production RAG architecture. Question comes in. Routing sends it to the right place. Query translation optimizes the question. The right indexes get searched. Results get ranked and refined. The LLM generates an answer. And if the answer isn't good enough, the system loops back. Six modules, each independently improvable. Build it incrementally.`,
    startFrame: s(385), durationInFrames: s(45),
    beats: [{ label: 'show-full-diagram', atFrame: s(2) }, { label: 'animate-flow', atFrame: s(10) }, { label: 'show-incremental', atFrame: s(28) }, { label: 'final-frame', atFrame: s(38) }],
  },
];

export const script = sections;
export const totalDuration = sections.reduce((sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames), 0);
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(`Section "${id}" not found`); return s; };
export const getBeat = (sectionId: string, beatLabel: string): number => { const sec = getSection(sectionId); const b = sec.beats.find(b => b.label === beatLabel); if (!b) throw new Error(`Beat "${beatLabel}" not found`); return sec.startFrame + b.atFrame; };
