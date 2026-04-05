import { CANVAS } from '../../design-system/tokens';

const FPS = CANVAS.fps;

export interface Beat { label: string; atFraction: number; }
export interface ScriptSection {
  id: string;
  title: string;
  narration: string;
  beats: Beat[];
  startFrame: number;
  durationInFrames: number;
}

const sections: ScriptSection[] = [
  {
    id: 'why-rag', title: 'Why RAG Matters',
    narration: `Ask ChatGPT about your company's refund policy. It will confidently tell you "full refund within 60 days." Sounds right. Except your actual policy is pro-rated minus two months. The LLM doesn't know your data. It just guesses. So you add RAG. You embed your docs and search them. But basic RAG retrieves your pricing page instead of the refund policy. The user gets "Annual plans are 299 per year." Real information, wrong document. Production RAG routes the question to the right database, retrieves the exact policy clause, and returns the correct answer. That's the gap this video covers.`,
    startFrame: 0, durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-question', atFraction: 0.03 },
      { label: 'show-direct-llm', atFraction: 0.10 },
      { label: 'show-hallucination', atFraction: 0.18 },
      { label: 'show-basic-rag', atFraction: 0.32 },
      { label: 'show-wrong-doc', atFraction: 0.42 },
      { label: 'show-production-rag', atFraction: 0.58 },
      { label: 'show-correct-answer', atFraction: 0.70 },
      { label: 'show-gap-statement', atFraction: 0.85 },
    ],
  },
  {
    id: 'rag-basics', title: 'How Basic RAG Works',
    narration: `Before we improve RAG, let's see how basic RAG works. You start with your company documents. A refund policy, a product guide, whatever. You break each document into smaller pieces called chunks. Think of it like cutting a book into paragraphs. Each chunk gets converted into a list of numbers called an embedding. These numbers capture the meaning of the text. Similar ideas get similar numbers. All those embeddings get stored in a vector database like Pinecone or Chroma. Now a user asks a question. "What is the refund policy for annual plans?" That question also gets converted into an embedding using the same model. The database compares the question embedding against all stored embeddings and finds the closest matches. The top results, usually 3 to 5 chunks, get pulled out. Those chunks go into the LLM as context along with the original question. The LLM reads the chunks and writes a coherent answer based on what it found. That's basic RAG. Document in, chunks out, embeddings stored, question matched, answer generated. The six modules we cover next are all about making each of these steps work better.`,
    startFrame: 40 * FPS, durationInFrames: 70 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-document', atFraction: 0.05 },
      { label: 'show-chunks', atFraction: 0.12 },
      { label: 'show-embedding-model', atFraction: 0.20 },
      { label: 'show-vectors', atFraction: 0.28 },
      { label: 'show-vector-db', atFraction: 0.35 },
      { label: 'show-user-query', atFraction: 0.42 },
      { label: 'show-query-embedding', atFraction: 0.50 },
      { label: 'show-similarity', atFraction: 0.58 },
      { label: 'show-top-matches', atFraction: 0.65 },
      { label: 'show-llm', atFraction: 0.74 },
      { label: 'show-answer', atFraction: 0.82 },
      { label: 'show-summary', atFraction: 0.92 },
    ],
  },
  {
    id: 'hook', title: 'The Problem with Basic RAG',
    narration: `Most RAG tutorials show you the happy path. Take some docs, embed them, search, done. But production RAG is a different animal. Your retrieval misses relevant docs. Your chunks are the wrong size. Your users ask vague questions that don't match anything. This video covers the full production RAG architecture. Six modules that take you from "it works in a demo" to "it works at scale."`,
    startFrame: 110 * FPS, durationInFrames: 35 * FPS,
    beats: [
      { label: 'show-basic-flow', atFraction: 0.06 },
      { label: 'show-problems', atFraction: 0.35 },
      { label: 'show-six-modules', atFraction: 0.72 },
    ],
  },
  {
    id: 'overview', title: 'The Full Architecture',
    narration: `Here's the full picture. A question comes in on the left. Before it hits any database, it goes through routing and query translation. Then it gets sent to one or more data sources. Vector stores, relational databases, graph databases. The retrieved documents get ranked, filtered, and sometimes re-retrieved. Finally, the generation step produces an answer and can loop back to re-retrieve if the quality isn't good enough. Six modules, each solving a specific failure mode. Let's walk through each one.`,
    startFrame: 75 * FPS, durationInFrames: 45 * FPS,
    beats: [
      { label: 'show-question-in', atFraction: 0.04 },
      { label: 'show-routing', atFraction: 0.15 },
      { label: 'show-query-translation', atFraction: 0.24 },
      { label: 'show-data-sources', atFraction: 0.35 },
      { label: 'show-retrieval', atFraction: 0.48 },
      { label: 'show-generation', atFraction: 0.60 },
      { label: 'show-answer-out', atFraction: 0.70 },
      { label: 'highlight-six', atFraction: 0.84 },
    ],
  },
  {
    id: 'query-construction', title: 'Query Construction',
    narration: `Not all your data lives in a vector store. Take this example. A user asks "What was Q3 revenue for the enterprise segment?" That question needs a SQL query, not a similarity search. The LLM parses the intent, extracts the metric, the time period, and the segment. Then it generates the SQL. SELECT SUM amount FROM sales WHERE quarter equals Q3 2024 AND segment equals enterprise. The query hits your sales database. The matching rows come back. Total: 2.4 million. That's query construction. Turning natural language into the right query for the right database. Other approaches include Text-to-Cypher for graph databases and self-query retrievers for automatic metadata filtering.`,
    startFrame: 120 * FPS, durationInFrames: 50 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-question', atFraction: 0.08 },
      { label: 'show-parser', atFraction: 0.22 },
      { label: 'show-sql', atFraction: 0.38 },
      { label: 'show-database', atFraction: 0.52 },
      { label: 'show-result', atFraction: 0.66 },
      { label: 'show-others', atFraction: 0.82 },
      { label: 'show-summary', atFraction: 0.90 },
    ],
  },
  {
    id: 'query-translation', title: 'Query Translation',
    narration: `Your users ask vague questions. "How does authentication work?" That could mean anything. Multi-query fixes this. The LLM takes that vague question and generates three specific versions. "What authentication protocols does the API support?" "How do users log in and get session tokens?" "What is the OAuth 2.0 flow for third-party apps?" Each version retrieves different documents. The API reference. The login guide. The OAuth setup docs. You combine all three result sets. Now you have coverage that no single query could have achieved. Other approaches include RAG-Fusion for merging ranked results, decomposition for breaking complex questions into sub-questions, step-back for asking more general versions first, and HyDE for searching with hypothetical answers.`,
    startFrame: 170 * FPS, durationInFrames: 55 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-vague-question', atFraction: 0.06 },
      { label: 'show-rephraser', atFraction: 0.16 },
      { label: 'show-versions', atFraction: 0.28 },
      { label: 'show-retrieved-docs', atFraction: 0.46 },
      { label: 'show-combined', atFraction: 0.62 },
      { label: 'show-others', atFraction: 0.78 },
      { label: 'show-summary', atFraction: 0.90 },
    ],
  },
  {
    id: 'routing', title: 'Routing',
    narration: `Different questions need different databases. "What was last quarter's revenue?" That's financial data. It belongs in a SQL database. The LLM router sees the intent, classifies it as structured financial data, and routes it to the sales database. Now take a different question. "Explain our refund policy." That's a policy document. The router classifies it as unstructured text and sends it to the document store instead. Two questions, two completely different data sources. The router makes sure each one lands in the right place. Semantic routing is another approach. Instead of the LLM deciding, you embed the question and match it against pre-defined prompt templates.`,
    startFrame: 225 * FPS, durationInFrames: 45 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-example-a', atFraction: 0.08 },
      { label: 'show-router-a', atFraction: 0.22 },
      { label: 'show-route-a', atFraction: 0.34 },
      { label: 'show-example-b', atFraction: 0.48 },
      { label: 'show-router-b', atFraction: 0.58 },
      { label: 'show-route-b', atFraction: 0.68 },
      { label: 'show-others', atFraction: 0.82 },
      { label: 'show-summary', atFraction: 0.90 },
    ],
  },
  {
    id: 'indexing', title: 'Indexing',
    narration: `Chunk size makes or breaks your retrieval. Take a refund policy document. If you embed the whole page as one chunk, that's 2000 tokens. When someone searches "annual plan refund," the embedding matches loosely. Similarity score 0.61. The chunk has too much unrelated content diluting the match. Now split that same document into paragraph-level chunks. 300 tokens each. The same search query now hits Section 4.2 directly. Similarity score 0.94. Exact match. Same document, same question. The only difference is chunk size. Other indexing strategies include multi-representation indexing which stores both a summary and the full document, specialized embeddings fine-tuned for your domain, and RAPTOR which builds a tree of summaries at different abstraction levels.`,
    startFrame: 270 * FPS, durationInFrames: 60 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-document', atFraction: 0.06 },
      { label: 'show-big-chunk', atFraction: 0.16 },
      { label: 'show-big-search', atFraction: 0.28 },
      { label: 'show-small-chunks', atFraction: 0.42 },
      { label: 'show-small-search', atFraction: 0.56 },
      { label: 'show-comparison', atFraction: 0.68 },
      { label: 'show-others', atFraction: 0.82 },
      { label: 'show-summary', atFraction: 0.90 },
    ],
  },
  {
    id: 'retrieval', title: 'Retrieval',
    narration: `Vector similarity is not the same as relevance. A user asks "How to cancel an enterprise subscription." Vector search returns five documents. Pricing tiers, billing FAQ, support guide, cancellation policy, and onboarding docs. All scored by cosine similarity. The cancellation policy is ranked fourth at 0.83. It should be first. A re-ranker fixes this. It takes those five results and reorders them by actual relevance to the question. The cancellation policy jumps from number four to number one. The pricing page drops to four. Same documents, better ordering. That's the difference between finding a result and finding the right result. Other approaches include CRAG for evaluating retrieval quality and active retrieval for going back to search again when results are not good enough.`,
    startFrame: 330 * FPS, durationInFrames: 50 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-question', atFraction: 0.06 },
      { label: 'show-before', atFraction: 0.14 },
      { label: 'show-reranker', atFraction: 0.38 },
      { label: 'show-after', atFraction: 0.52 },
      { label: 'show-insight', atFraction: 0.68 },
      { label: 'show-others', atFraction: 0.82 },
      { label: 'show-summary', atFraction: 0.90 },
    ],
  },
  {
    id: 'generation', title: 'Generation',
    narration: `The LLM generates an answer. But how do you know it's grounded in the actual documents? Self-RAG adds a verification loop. Here's how it works. A user asks "What's the cancellation fee for annual plans?" The LLM generates "There is typically a 20 percent cancellation fee." Sounds reasonable. But the evaluation step checks that answer against the retrieved source document. The source says "pro-rated refund," not "cancellation fee." The answer is not grounded. So the system re-retrieves. This time it pulls the exact clause from the cancellation policy. The LLM generates again. "Pro-rated refund minus two months of service used." The evaluation step checks again. This time it matches the source. Grounded. Return the answer. Another approach is RRR, which rewrites the query, retrieves again, and reads the new results in a similar loop.`,
    startFrame: 380 * FPS, durationInFrames: 50 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.02 },
      { label: 'show-question', atFraction: 0.06 },
      { label: 'show-attempt-1', atFraction: 0.14 },
      { label: 'show-eval-1', atFraction: 0.28 },
      { label: 'show-fail', atFraction: 0.38 },
      { label: 'show-re-retrieve', atFraction: 0.48 },
      { label: 'show-attempt-2', atFraction: 0.58 },
      { label: 'show-eval-2', atFraction: 0.68 },
      { label: 'show-pass', atFraction: 0.76 },
      { label: 'show-others', atFraction: 0.86 },
      { label: 'show-summary', atFraction: 0.92 },
    ],
  },
  {
    id: 'full-picture', title: 'The Complete System',
    narration: `Here's the complete production RAG architecture. Question comes in. Routing sends it to the right place. Query translation optimizes the question. The right indexes get searched. Results get ranked and refined. The LLM generates an answer. And if the answer isn't good enough, the system loops back. Six modules, each independently improvable. Build it incrementally.`,
    startFrame: 430 * FPS, durationInFrames: 45 * FPS,
    beats: [
      { label: 'show-full-diagram', atFraction: 0.04 },
      { label: 'animate-flow', atFraction: 0.22 },
      { label: 'show-incremental', atFraction: 0.52 },
      { label: 'final-frame', atFraction: 0.84 },
    ],
  },
];

/** Apply audio-driven durations. Called from calculateMetadata. */
export function applyAudioDurations(audioDurations: number[]): ScriptSection[] {
  let startFrame = 0;
  return sections.map((sec, i) => {
    const durationInFrames = Math.ceil(audioDurations[i] * FPS) + Math.round(0.5 * FPS);
    const updated = { ...sec, startFrame, durationInFrames };
    startFrame += durationInFrames;
    return updated;
  });
}

export const script = sections;
export const sectionIds = sections.map(s => s.id);
export const totalDuration = sections.reduce((sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames), 0);
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(`Section "${id}" not found`); return s; };
