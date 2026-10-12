import { UploadedMemory } from '../types';

export const INITIAL_UPLOADED_MEMORIES: UploadedMemory[] = [
  {
    id: 'mem-1',
    title: 'Engineering Architecture & Tech Stack Guidelines',
    summary: 'Core technical guidelines: React 19, TypeScript strict mode, WebGPU client-side inference, and zero telemetry.',
    content: `# Engineering Architecture Guidelines
- Runtime: React 19 SPA with TypeScript strict typing and Vite bundler.
- AI Architecture: Dual-engine hybrid routing. Cloud Gemini 3.8 Flash for web research, autonomous tool executions, and deep NLU; Local Gemma 2B via WebGPU in-browser for 100% offline private execution.
- Styling: Tailwind CSS utility classes with dark obsidian/cyan neon aesthetic.
- State & Persistence: LocalStorage for persistent preferences, interaction patterns, and uploaded memory bank; no unauthorized external telemetry or tracking.
- Response Standards: Provide concise executive summaries followed by production-grade code snippets. Avoid placeholder TODOs.`,
    fileName: 'tech-stack-architecture-v2.md',
    fileSize: 1048,
    fileType: 'text/markdown',
    category: 'coding_guidelines',
    tags: ['architecture', 'react-19', 'typescript', 'webgpu', 'gemma'],
    tokenEstimate: 262,
    uploadedAt: 'Today, 08:30 AM',
    enabled: true,
  },
  {
    id: 'mem-2',
    title: 'Executive Communication Principles & Memo Format',
    summary: 'Communication standards: Bottom-line upfront (BLUF), pyramid structure, quantitative metrics, and latency/cost trade-offs.',
    content: `# Executive Communication Principles
1. Bottom-Line Upfront (BLUF): State the core finding, decision, or recommendation in the first two sentences.
2. Structure: Follow the Minto Pyramid Principle—Situation, Complication, Resolution, Next Steps.
3. Quantitative Focus: Never use vague terms like "faster" or "significantly better". State concrete figures (e.g., "-38% latency, +14% throughput, $1.2M savings").
4. Audience Context: When drafting memos for Elena Rostova (VP Product), emphasize enterprise roadmap impact and user adoption velocity.`,
    fileName: 'executive-communication-sop.txt',
    fileSize: 840,
    fileType: 'text/plain',
    category: 'sop_standards',
    tags: ['communication', 'executive-memo', 'elena-rostova', 'bluf'],
    tokenEstimate: 210,
    uploadedAt: 'Today, 09:12 AM',
    enabled: true,
  },
  {
    id: 'mem-3',
    title: 'Personal Workflow & Deep Work Schedule Constraints',
    summary: 'User schedule habits: Deep focus blocks 9:00 AM – 12:00 PM, Pacific Time (PST), async-first communication.',
    content: `# User Profile & Schedule Constraints
- Timezone: US Pacific (PST / UTC-8).
- Working Windows:
  * 08:30 AM – 09:00 AM: Morning executive briefing and calendar scan.
  * 09:00 AM – 12:00 PM: Deep Focus Block (Shield active: block all non-critical notifications, defer low-urgency chats).
  * 02:00 PM – 04:30 PM: Collaboration, PR reviews, and roadmap meetings.
- Communication Preferences: Async Slack or memo summaries over unscheduled calls.
- Stated Priority: Autonomous deadline radar must alert 45 minutes prior to critical stakeholder deadlines.`,
    fileName: 'user-profile-constraints.json',
    fileSize: 920,
    fileType: 'application/json',
    category: 'personal_bio',
    tags: ['profile', 'schedule', 'deep-work', 'timezone-pst'],
    tokenEstimate: 230,
    uploadedAt: 'Today, 09:45 AM',
    enabled: true,
  },
];
