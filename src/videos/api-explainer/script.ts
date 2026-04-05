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
    id: 'hook', title: 'The Hook',
    narration: `You're building an app. It needs to store user data, accept payments, and go live on the internet. You could build all of that from scratch. Or you could plug into services that already do it. Supabase for your database. Stripe for payments. Vercel to deploy. Every modern app is built this way. Your code talks to other people's code. The way they talk to each other is through APIs.`,
    startFrame: 0, durationInFrames: 30 * FPS,
    beats: [
      { label: 'show-app', atFraction: 0.04 },
      { label: 'show-needs', atFraction: 0.15 },
      { label: 'show-services', atFraction: 0.35 },
      { label: 'show-connections', atFraction: 0.55 },
      { label: 'show-apis-label', atFraction: 0.80 },
    ],
  },
  {
    id: 'what-is-api', title: 'What is an API',
    narration: `API stands for Application Programming Interface. Forget the jargon. Here is what it actually means. Your app sends a message to a service. The service does the work. The service sends back a result. That is it. Three steps. Your app says to Stripe, "Charge this card $49 for the Pro plan." Stripe processes the payment, talks to the bank, and sends back a response: "Payment successful. Receipt ID 4829." Your app never touches the bank. It never handles card numbers. It just asked Stripe to do the job.`,
    startFrame: 30 * FPS, durationInFrames: 35 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-three-steps', atFraction: 0.14 },
      { label: 'show-request', atFraction: 0.28 },
      { label: 'show-processing', atFraction: 0.45 },
      { label: 'show-response', atFraction: 0.60 },
      { label: 'show-summary', atFraction: 0.82 },
    ],
  },
  {
    id: 'what-is-sdk', title: 'What is an SDK',
    narration: `An API is the raw interface. You could write the HTTP request yourself. Set the URL, the headers, the authentication token, the request body. It works, but it is tedious. An SDK wraps all of that into simple functions. Instead of building the HTTP request by hand, you write stripe.charges.create and pass the amount. Three lines instead of fifteen. The SDK handles authentication, error formatting, retries. Same result, less work. That is why every service ships an SDK.`,
    startFrame: 65 * FPS, durationInFrames: 30 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-raw-api', atFraction: 0.14 },
      { label: 'show-sdk-version', atFraction: 0.42 },
      { label: 'show-comparison', atFraction: 0.65 },
      { label: 'show-summary', atFraction: 0.85 },
    ],
  },
  {
    id: 'supabase', title: 'Database — Supabase',
    narration: `Your app needs to remember things. User accounts, saved preferences, order history. That is what a database does. Supabase gives you a hosted Postgres database with an API on top. You do not set up servers. You do not manage backups. You sign up, create a table called users, and start reading and writing data. Your app calls supabase.from('users').select() and gets back a list of every user. It calls supabase.from('users').insert() with a name and email, and a new row appears. The data lives on Supabase's servers. Your app just reads and writes through the API.`,
    startFrame: 95 * FPS, durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-needs', atFraction: 0.10 },
      { label: 'show-supabase-card', atFraction: 0.22 },
      { label: 'show-select', atFraction: 0.40 },
      { label: 'show-insert', atFraction: 0.58 },
      { label: 'show-table-result', atFraction: 0.72 },
      { label: 'show-summary', atFraction: 0.88 },
    ],
  },
  {
    id: 'stripe', title: 'Payments — Stripe',
    narration: `Your app needs to collect money. Stripe handles the entire payment flow. Your app creates a checkout session with the product name, price, and a redirect URL. Stripe returns a checkout page URL. You send the customer there. They enter their card details on Stripe's page, not yours. You never see the card number. When payment completes, Stripe redirects the customer back to your app and sends a webhook notification: payment succeeded. One API call to create the session. One webhook to confirm. Stripe handles PCI compliance, fraud detection, receipts, and refunds.`,
    startFrame: 135 * FPS, durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-app-request', atFraction: 0.10 },
      { label: 'show-checkout-url', atFraction: 0.25 },
      { label: 'show-customer-pays', atFraction: 0.40 },
      { label: 'show-webhook', atFraction: 0.58 },
      { label: 'show-stripe-handles', atFraction: 0.75 },
      { label: 'show-summary', atFraction: 0.90 },
    ],
  },
  {
    id: 'vercel', title: 'Deployment — Vercel',
    narration: `Your code runs on your laptop. Nobody else can see it. You need it live on the internet. Vercel connects to your GitHub repository. You push your code. Vercel detects the change, builds the app, and deploys it to servers around the world. Thirty seconds later, your app is live at yourapp.vercel.app. Every time you push new code, it redeploys automatically. No server configuration. No SSH. No DevOps team. Push code, it is live.`,
    startFrame: 175 * FPS, durationInFrames: 35 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-laptop', atFraction: 0.12 },
      { label: 'show-github', atFraction: 0.28 },
      { label: 'show-vercel-build', atFraction: 0.45 },
      { label: 'show-live', atFraction: 0.65 },
      { label: 'show-summary', atFraction: 0.85 },
    ],
  },
  {
    id: 'pattern', title: 'Four Ways to Connect',
    narration: `Four ways to connect your app to any service. Raw API gives you full control. You build every request by hand. SDK is the practical choice. Three lines of code instead of fifteen. CLI handles ops and deployment. You run commands from the terminal, not from your app. And MCP is the newest layer. AI tools connect to services directly on your behalf. These four methods work across every category. Databases, payments, deployment, authentication, email, SMS. And now AI services too. Text generation, image generation, video generation, web fetching. Each category has two or three solid options. The method you use to connect is always one of these four.`,
    startFrame: 210 * FPS, durationInFrames: 40 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.03 },
      { label: 'show-four-types', atFraction: 0.08 },
      { label: 'show-services-grid', atFraction: 0.40 },
      { label: 'show-summary', atFraction: 0.88 },
    ],
  },
  {
    id: 'chart', title: 'The Positioning Chart',
    narration: `Here is how they compare. On the vertical axis: flexibility. On the horizontal: speed to build. Raw API gives you full control but takes the longest. CLI is fast for deployment tasks but limited in scope. MCP is the fastest path because AI handles the wiring, but you are bounded by what the tool exposes. And SDK sits in the sweet spot. Fast enough to ship in a day. Flexible enough to do what you need. For ninety percent of integrations, SDK is the answer.`,
    startFrame: 250 * FPS, durationInFrames: 30 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-axes', atFraction: 0.10 },
      { label: 'show-api-dot', atFraction: 0.22 },
      { label: 'show-cli-dot', atFraction: 0.36 },
      { label: 'show-mcp-dot', atFraction: 0.50 },
      { label: 'show-sdk-dot', atFraction: 0.64 },
      { label: 'show-summary', atFraction: 0.85 },
    ],
  },
  {
    id: 'pm-takeaway', title: 'What Changes for You',
    narration: `Here is what changes for you as a PM. You are not just defining requirements for an engineering team anymore. Tools like CodePup AI and Claude Code let you build integrations directly. A Stripe checkout? You describe what you want, the AI writes the SDK calls. A Supabase query? Same thing. The plumbing is standard. The AI knows how to wire it. Your job is still to pick the right service and define what the integration should do. But now you can build it yourself. That is the shift.`,
    startFrame: 280 * FPS, durationInFrames: 30 * FPS,
    beats: [
      { label: 'show-title', atFraction: 0.04 },
      { label: 'show-build-yourself', atFraction: 0.14 },
      { label: 'show-ai-tools', atFraction: 0.38 },
      { label: 'show-your-job', atFraction: 0.62 },
      { label: 'show-closing', atFraction: 0.85 },
    ],
  },
];

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
