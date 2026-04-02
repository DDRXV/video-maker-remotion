import { s } from '../../design-system/tokens';

export interface Beat { label: string; atFrame: number; }
export interface ScriptSection { id: string; title: string; narration: string; startFrame: number; durationInFrames: number; beats: Beat[]; }

const sections: ScriptSection[] = [
  {
    id: 'hook', title: 'The Magic Moment',
    narration: `I type "/prd" into Claude Code. I give it a one-line feature description. Five minutes later, I have a 12-page PRD. Problem statement, user stories, analytics events, architecture diagram, user flow in mermaid, and a branded PDF export. All matching my company's doc format. One slash command. This is what Claude Code Skills do.`,
    startFrame: 0, durationInFrames: s(38),
    beats: [
      { label: 'show-terminal', atFrame: s(1) },
      { label: 'show-command', atFrame: s(4) },
      { label: 'show-output-stack', atFrame: s(10) },
      { label: 'show-pdf', atFrame: s(22) },
      { label: 'show-punchline', atFrame: s(30) },
    ],
  },
  {
    id: 'what-is-skill', title: 'What Is a Skill?',
    narration: `A skill is a markdown file that teaches Claude how to do a specific job. It lives in ~/.claude/skills/your-skill/. When you type a slash command or describe something that matches the skill's trigger, Claude loads that file and follows its instructions. Think of it as a reusable expert prompt. Two parts: YAML frontmatter for the trigger, and the body with step-by-step instructions in plain English.`,
    startFrame: s(38), durationInFrames: s(38),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-md-file', atFrame: s(4) },
      { label: 'show-path', atFrame: s(10) },
      { label: 'show-trigger', atFrame: s(16) },
      { label: 'show-frontmatter', atFrame: s(22) },
      { label: 'show-body', atFrame: s(28) },
    ],
  },
  {
    id: 'skill-file', title: 'The Skill File',
    narration: `The skill.md is the control center. It defines the workflow: what questions to ask, what steps to follow, what quality checks to run. But it stays high-level. Instead of containing every detail, it references deeper files. "For analytics, follow analytics/events-framework.md." "For architecture, use architecture/diagram-standards.md." "Export using scripts/export-pdf.sh." The skill.md orchestrates. The referenced files carry the expertise.`,
    startFrame: s(76), durationInFrames: s(42),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-skillmd', atFrame: s(4) },
      { label: 'show-steps', atFrame: s(10) },
      { label: 'show-ref-analytics', atFrame: s(18) },
      { label: 'show-ref-arch', atFrame: s(24) },
      { label: 'show-ref-scripts', atFrame: s(30) },
      { label: 'show-summary', atFrame: s(36) },
    ],
  },
  {
    id: 'folder-structure', title: 'The Folder Structure',
    narration: `Here is what a real skill folder looks like. At the root: skill.md. Then organized sub-folders. An analytics folder with prompts for events, metrics, and dashboards. An architecture folder with diagram standards. A use-cases folder for user stories. A brand folder with color palettes and formatting rules. A scripts folder for PDF export and diagram generation. Each folder is a domain of expertise that skill.md can pull from.`,
    startFrame: s(118), durationInFrames: s(42),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-root', atFrame: s(4) },
      { label: 'show-analytics', atFrame: s(10) },
      { label: 'show-architecture', atFrame: s(16) },
      { label: 'show-usecases', atFrame: s(22) },
      { label: 'show-brand', atFrame: s(26) },
      { label: 'show-scripts', atFrame: s(30) },
      { label: 'show-summary', atFrame: s(36) },
    ],
  },
  {
    id: 'deep-prompts', title: 'Deep Prompt Folders',
    narration: `Each folder contains specialized prompts. The analytics folder has events-framework.md that defines how to structure tracking events: event name, trigger, properties, and the funnel it belongs to. The architecture folder has diagram-standards.md specifying mermaid syntax, diagram types, and labeling conventions. These encode your team's specific standards. When Claude follows them, the output matches what your senior PM would produce.`,
    startFrame: s(160), durationInFrames: s(40),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-analytics-open', atFrame: s(4) },
      { label: 'show-events-content', atFrame: s(10) },
      { label: 'show-arch-open', atFrame: s(20) },
      { label: 'show-diagram-content', atFrame: s(26) },
      { label: 'show-summary', atFrame: s(34) },
    ],
  },
  {
    id: 'scripts', title: 'Scripts and Automation',
    narration: `The scripts folder handles post-processing. Your PRD comes out as markdown. A script converts it to a branded PDF with your logo and colors. Another generates mermaid diagrams as PNG. Another pushes to Notion or Confluence. Claude runs these as part of the workflow. The output is not just markdown. It is a finished deliverable.`,
    startFrame: s(200), durationInFrames: s(38),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-md-input', atFrame: s(4) },
      { label: 'show-pdf-script', atFrame: s(10) },
      { label: 'show-mermaid-script', atFrame: s(18) },
      { label: 'show-deploy-script', atFrame: s(24) },
      { label: 'show-output', atFrame: s(30) },
    ],
  },
  {
    id: 'brand', title: 'Brand Guidelines',
    narration: `The brand folder ensures consistent visual output. Color palette, font choices, heading styles, doc formatting. When Claude creates mermaid diagrams, the brand file specifies node colors. When the PDF exports, it applies your logo and margins. Every output looks like it came from your company.`,
    startFrame: s(238), durationInFrames: s(35),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-brand-file', atFrame: s(4) },
      { label: 'show-colors', atFrame: s(10) },
      { label: 'show-typography', atFrame: s(16) },
      { label: 'show-applied', atFrame: s(22) },
      { label: 'show-summary', atFrame: s(28) },
    ],
  },
  {
    id: 'activation', title: 'How Activation Works',
    narration: `When you type in Claude Code, it checks your message against all installed skill descriptions. If your message matches, Claude loads skill.md into context. As it works through steps, it reads referenced files on demand. It does not load everything at once. It pulls in analytics/events-framework.md only when it reaches the analytics step. The skill is the plan. The reference files are the expertise. Claude orchestrates both.`,
    startFrame: s(273), durationInFrames: s(40),
    beats: [
      { label: 'show-title', atFrame: s(1) },
      { label: 'show-user-input', atFrame: s(4) },
      { label: 'show-match', atFrame: s(10) },
      { label: 'show-load-skill', atFrame: s(16) },
      { label: 'show-on-demand', atFrame: s(22) },
      { label: 'show-execute', atFrame: s(30) },
      { label: 'show-summary', atFrame: s(34) },
    ],
  },
  {
    id: 'full-picture', title: 'The Complete System',
    narration: `Here is the full picture. skill.md at the center. Domain folders around it: analytics, architecture, use-cases, brand. Scripts for automation. Claude activates on trigger, follows the plan, pulls in deep prompts as needed, runs scripts for export, and delivers a finished product. Build the skill once. Use it on every project.`,
    startFrame: s(313), durationInFrames: s(40),
    beats: [
      { label: 'show-center', atFrame: s(2) },
      { label: 'show-domains', atFrame: s(8) },
      { label: 'show-scripts', atFrame: s(14) },
      { label: 'show-flow', atFrame: s(20) },
      { label: 'show-output', atFrame: s(28) },
      { label: 'show-final', atFrame: s(34) },
    ],
  },
];

export const script = sections;
export const totalDuration = sections.reduce((sum, sec) => Math.max(sum, sec.startFrame + sec.durationInFrames), 0);
export const getSection = (id: string) => { const s = sections.find(sec => sec.id === id); if (!s) throw new Error(`Section "${id}" not found`); return s; };
