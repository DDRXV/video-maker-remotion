import { s } from '../../design-system/tokens';

export interface Beat { label: string; atFrame: number; }
export interface ScriptSection { id: string; title: string; narration: string; startFrame: number; durationInFrames: number; beats: Beat[]; }

const sections: ScriptSection[] = [
  {
    id: 'hook', title: 'The Magic Moment',
    narration: `You type a question into ChatGPT. Two seconds later, you get a coherent, multi-paragraph answer. It feels like talking to someone who has read the entire internet. But there is no understanding happening here. No reasoning in the way you and I reason. What is actually happening in those two seconds is a math problem running across thousands of GPUs. Let me show you how.`,
    startFrame: 0, durationInFrames: s(38),
    beats: [
      { label: 'show-prompt', atFrame: s(1) },
      { label: 'show-response', atFrame: s(6) },
      { label: 'show-no-understanding', atFrame: s(16) },
      { label: 'show-gpus', atFrame: s(26) },
      { label: 'show-cta', atFrame: s(32) },
    ],
  },
  {
    id: 'numbers', title: 'Surprising Numbers',
    narration: `Before we get into the how, some numbers that put this in perspective. GPT-4 has roughly 1.8 trillion parameters. The training data is estimated at 13 trillion tokens. A single training run costs over $100 million in compute. And after all of that, what the model actually does is predict the next word.`,
    startFrame: s(38), durationInFrames: s(40),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-params', atFrame: s(4) },
      { label: 'show-tokens', atFrame: s(12) },
      { label: 'show-cost', atFrame: s(20) },
      { label: 'show-punchline', atFrame: s(28) },
    ],
  },
  {
    id: 'tokenization', title: 'Tokenization',
    narration: `The journey starts before the model even sees your prompt. Your text gets broken into tokens. Not words. Tokens. "ChatGPT is amazing" becomes five tokens. Common words stay whole. Rare words get split into pieces. Each token maps to an ID in a vocabulary of about 100,000 entries. Your prompt is now a list of integers.`,
    startFrame: s(78), durationInFrames: s(40),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-input-text', atFrame: s(4) },
      { label: 'show-split', atFrame: s(10) },
      { label: 'show-ids', atFrame: s(20) },
      { label: 'show-vocab', atFrame: s(28) },
      { label: 'show-output', atFrame: s(34) },
    ],
  },
  {
    id: 'embedding', title: 'The Embedding Layer',
    narration: `Each token ID gets converted into a vector. A list of numbers, typically 4,096 dimensions. This is the embedding layer. Two tokens that mean similar things end up as vectors that point in similar directions. "King" and "Queen" are close. "King" and "Banana" are far apart. These vectors are the model's internal language.`,
    startFrame: s(118), durationInFrames: s(38),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-token-to-vector', atFrame: s(4) },
      { label: 'show-dimensions', atFrame: s(10) },
      { label: 'show-similar', atFrame: s(18) },
      { label: 'show-distant', atFrame: s(26) },
      { label: 'show-summary', atFrame: s(32) },
    ],
  },
  {
    id: 'transformer', title: 'The Transformer Block',
    narration: `This is where the real work happens. A transformer block has two main parts. Self-attention and a feed-forward network. Self-attention lets each token look at every other token and ask: how relevant are you to me? The feed-forward network processes each token independently, adding learned knowledge. A typical LLM stacks 80 to 120 of these blocks in sequence.`,
    startFrame: s(156), durationInFrames: s(45),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-block', atFrame: s(4) },
      { label: 'show-attention', atFrame: s(10) },
      { label: 'show-ffn', atFrame: s(20) },
      { label: 'show-stack', atFrame: s(30) },
      { label: 'show-summary', atFrame: s(38) },
    ],
  },
  {
    id: 'attention', title: 'Attention In Detail',
    narration: `Zoom into self-attention. Each token gets transformed into three vectors: Query, Key, and Value. The Query is what you are looking for. The Key is what each token advertises about itself. The Value is what it actually contains. You multiply Query times Key to get attention scores. Multi-head attention runs this multiple times in parallel, each head learning different patterns.`,
    startFrame: s(201), durationInFrames: s(48),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-qkv', atFrame: s(4) },
      { label: 'show-query-key', atFrame: s(12) },
      { label: 'show-scores', atFrame: s(20) },
      { label: 'show-weighted-sum', atFrame: s(28) },
      { label: 'show-multihead', atFrame: s(36) },
      { label: 'show-summary', atFrame: s(42) },
    ],
  },
  {
    id: 'generation', title: 'Generating Output',
    narration: `After all transformer blocks, the final vector gets projected back into vocabulary space. You get a probability distribution over 100,000 tokens. The model picks one. That token gets appended to the input, and the whole process repeats. This is autoregressive generation. The KV cache stores intermediate results so it does not recompute from scratch each time.`,
    startFrame: s(249), durationInFrames: s(45),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-final-vector', atFrame: s(4) },
      { label: 'show-probabilities', atFrame: s(12) },
      { label: 'show-pick-token', atFrame: s(18) },
      { label: 'show-loop', atFrame: s(24) },
      { label: 'show-kv-cache', atFrame: s(32) },
      { label: 'show-summary', atFrame: s(38) },
    ],
  },
  {
    id: 'full-picture', title: 'The Full Picture',
    narration: `Here is the complete pipeline. Text comes in. Tokenizer converts it to IDs. Embedding layer maps IDs to vectors. 80+ transformer blocks process them. Final layer projects back to token probabilities. One token comes out. Loop until done. Billions of parameters, trained on trillions of tokens, doing one simple thing: predicting what comes next.`,
    startFrame: s(294), durationInFrames: s(45),
    beats: [
      { label: 'show-pipeline', atFrame: s(2) },
      { label: 'show-tokenizer', atFrame: s(6) },
      { label: 'show-embedding', atFrame: s(10) },
      { label: 'show-transformers', atFrame: s(14) },
      { label: 'show-output', atFrame: s(18) },
      { label: 'show-loop', atFrame: s(24) },
      { label: 'show-final', atFrame: s(34) },
    ],
  },
];

export const script = sections;
export const totalDuration = sections.reduce((sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames), 0);
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(`Section "${id}" not found`); return s; };
export const getBeat = (sectionId: string, beatLabel: string): number => { const sec = getSection(sectionId); const b = sec.beats.find(b => b.label === beatLabel); if (!b) throw new Error(`Beat "${beatLabel}" not found`); return sec.startFrame + b.atFrame; };
