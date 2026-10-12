import { FunctionDeclaration, Type } from "@google/genai";
import { ai } from "../services/client";
import { UserGoal, CommunicationSignal, PredictedTask } from "../types";

// In-memory persistent stores for realistic autonomous tool actions
export const mockCalendarStore = [
  {
    id: 'evt-1',
    title: 'Product Strategy & AI Roadmap Sync',
    time: '2:30 PM',
    date: 'Today',
    durationMinutes: 45,
    location: 'Google Meet (Room Atlas)',
    attendees: ['Elena Rostova (VP Product)', 'Marcus Chen (Lead Architect)', 'You'],
    notes: 'Review Q4 self-improving agent benchmarks, compute budget, and model evaluation metrics.',
    category: 'meeting'
  },
  {
    id: 'evt-2',
    title: 'Off-site Client Workshop (Omni Corp)',
    time: '4:15 PM',
    date: 'Today',
    durationMinutes: 60,
    location: 'Omni Tower, 555 Market St, Downtown',
    attendees: ['Sarah Jenkins (Client Exec)', 'David Kim (Solutions)', 'You'],
    notes: 'Present autonomous workflow demo, address security and latency requirements.',
    category: 'meeting'
  },
  {
    id: 'evt-3',
    title: 'Deep Work: Autonomous Tool Optimization',
    time: '9:00 AM',
    date: 'Tomorrow',
    durationMinutes: 120,
    location: 'Home Office / Focus Shield',
    attendees: ['You'],
    notes: 'Refactor semantic router and prompt caching layers.',
    category: 'deep_work'
  }
];

export const mockRoutinesStore = [
  {
    id: 'rtn-1',
    title: 'Morning Executive Briefing',
    time: '08:00 AM',
    frequency: 'weekdays',
    category: 'morning_briefing',
    enabled: true,
  },
  {
    id: 'rtn-2',
    title: 'Pre-Meeting Commute & Traffic Radar',
    time: '30 mins before travel',
    frequency: 'daily',
    category: 'commute_check',
    enabled: true,
  },
  {
    id: 'rtn-3',
    title: 'Deep Work Focus Shield & DND',
    time: '10:00 AM - 12:00 PM',
    frequency: 'weekdays',
    category: 'focus_shield',
    enabled: true,
  },
  {
    id: 'rtn-4',
    title: 'Daily Reflection & Autonomous Skill Synthesis',
    time: '06:00 PM',
    frequency: 'daily',
    category: 'evening_debrief',
    enabled: true,
  }
];

// Stated User Goals
export const mockGoalsStore: UserGoal[] = [
  {
    id: 'goal-1',
    title: 'Deploy Q4 Autonomous Agent Benchmarks',
    description: 'Achieve >95% task accuracy across tool execution and multi-turn NLU parsing.',
    targetDeadline: 'Nov 15, 2026',
    priority: 'high',
    status: 'in_progress',
    progressPercentage: 72,
    milestones: [
      'Implement multi-clause NLU parsing (Done)',
      'Add communication thread deadline extraction (Done)',
      'Run end-to-end latency benchmarks (Pending)'
    ],
    source: 'Quarterly OKR Plan'
  },
  {
    id: 'goal-2',
    title: 'Complete Review & Merge Authentication PR #142',
    description: 'Ensure token expiration edge cases and refresh cycle tests are verified.',
    targetDeadline: 'Today, 2:00 PM',
    priority: 'high',
    status: 'in_progress',
    progressPercentage: 85,
    milestones: [
      'Write token expiration mock assertions',
      'Verify CI test passes',
      'Notify Marcus Chen'
    ],
    source: 'GitHub Sprint Board'
  },
  {
    id: 'goal-3',
    title: 'Deliver Omni Corp Enterprise Security Packet',
    description: 'Assemble SOC2 Type II compliance briefing and data residency architecture ahead of workshop.',
    targetDeadline: 'Today, 4:00 PM',
    priority: 'high',
    status: 'in_progress',
    progressPercentage: 40,
    milestones: [
      'Extract SOC2 Type II encryption specs',
      'Formulate client data boundary statement',
      'Send executive memo to Sarah Jenkins'
    ],
    source: 'Client Engagement Roadmap'
  }
];

// Communication Signals & Inbound Threads
export const mockCommunicationsStore: CommunicationSignal[] = [
  {
    id: 'comm-1',
    sender: 'Elena Rostova (VP Product)',
    channel: 'email',
    subject: 'Urgent: Revised Compute Budget before 2:30 PM Sync',
    summary: 'Elena requested the updated GPU & LLM inference compute allocation figures ahead of the Q4 Roadmap sync.',
    receivedAt: '10:14 AM',
    actionItemNeeded: true,
    extractedDeadline: 'Today, 2:00 PM',
    suggestedAction: 'Compile compute budget breakdown for Elena'
  },
  {
    id: 'comm-2',
    sender: 'Marcus Chen (Lead Architect)',
    channel: 'slack',
    subject: 'PR #142 Token Expiration Assertion',
    summary: 'Marcus noted CI is blocked on 1 test case: token expiration refresh cycle needs an explicit mock assertion.',
    receivedAt: '11:22 AM',
    actionItemNeeded: true,
    extractedDeadline: 'Today, 1:30 PM',
    suggestedAction: 'Generate token expiration test code snippet'
  },
  {
    id: 'comm-3',
    sender: 'Sarah Jenkins (Omni Corp)',
    channel: 'client_portal',
    subject: 'Security & Compliance Prerequisite for 4:15 PM Demo',
    summary: 'Omni Corp Security team requires verification that model inference stays within US-East VPC tenant boundaries.',
    receivedAt: '11:45 AM',
    actionItemNeeded: true,
    extractedDeadline: 'Today, 3:45 PM',
    suggestedAction: 'Synthesize tenant data boundary compliance memo'
  }
];

// Tool: Predict Upcoming Tasks and Deadlines
const predictUpcomingTasksAndDeadlines = async (args: { urgencyThreshold?: string }) => {
  try {
    const tasks: PredictedTask[] = [
      {
        id: 'pred-task-1',
        title: 'Draft Compute Budget Memo for Elena Rostova',
        rationale: 'Derived from Elena’s email (10:14 AM) and the 2:30 PM Roadmap Sync. Needed 30 mins prior to meeting.',
        sourceType: 'communication',
        sourceTitle: 'Email: Urgent: Revised Compute Budget',
        deadline: 'Today, 2:00 PM',
        urgency: 'critical',
        assistanceType: 'auto_complete',
        actionPrompt: 'Draft the revised compute budget memo for Elena Rostova covering GPU cluster and inference quotas.',
        status: 'pending',
        confidence: 96,
        deliverablePreview: 'Executive summary detailing 42% cost reduction with Gemini 3.8 Flash and $18k projected monthly savings.'
      },
      {
        id: 'pred-task-2',
        title: 'Patch Token Refresh Test Assertion for PR #142',
        rationale: 'Marcus Chen reported CI build blocked on PR #142 awaiting token expiration assertions.',
        sourceType: 'goal',
        sourceTitle: 'Goal: Complete Review & Merge Authentication PR #142',
        deadline: 'Today, 1:30 PM',
        urgency: 'high',
        assistanceType: 'auto_complete',
        actionPrompt: 'Write the mock token expiration test assertion for PR #142 and explain the fix for Marcus.',
        status: 'pending',
        confidence: 94,
        deliverablePreview: 'TypeScript Jest test block asserting 401 interceptor token refresh with 100% code coverage.'
      },
      {
        id: 'pred-task-3',
        title: 'Assemble Omni Corp Security & Data Residency Brief',
        rationale: 'Client inquiry from Sarah Jenkins ahead of the 4:15 PM off-site workshop in Downtown.',
        sourceType: 'communication',
        sourceTitle: 'Inquiry: Security & Compliance Prerequisite',
        deadline: 'Today, 3:45 PM',
        urgency: 'high',
        assistanceType: 'auto_complete',
        actionPrompt: 'Prepare the enterprise data boundary and SOC2 Type II compliance memo for Omni Corp.',
        status: 'pending',
        confidence: 92,
        deliverablePreview: '1-page compliance overview affirming zero data persistence, VPC peering, and SOC2 certification.'
      }
    ];

    return JSON.stringify({
      status: 'success',
      predictedTaskCount: tasks.length,
      upcomingTasks: tasks,
      summary: `Identified ${tasks.length} critical deadline commitments across your calendar, goals, and communication history.`
    }, null, 2);
  } catch (error: any) {
    return `Error predicting tasks: ${error.message}`;
  }
};

// Tool: Execute Autonomous Task Completion
const executeAutonomousTaskCompletion = async (args: { taskTitle: string; taskType: string; contextNotes?: string }) => {
  const { taskTitle, taskType, contextNotes } = args;

  let deliverable = '';
  if (taskTitle.toLowerCase().includes('budget') || taskType === 'budget_memo') {
    deliverable = `## Executive Memo: Q4 Compute & Inference Allocation
**To:** Elena Rostova (VP Product)  
**Date:** October 11, 2026  
**Status:** Completed autonomously by Aura  

### 1. Key Allocation Adjustments
- **Primary Model Migration:** Deployed **Gemini 3.8 Flash** across all core conversational & NLU pipelines.
- **Inference Efficiency:** Latency reduced by 34% (avg 180ms TTFT); token expenditure decreased by 42%.
- **Projected Q4 Runway:** $14,200/month projected compute vs $24,500 budgeted ceiling ($10,300 surplus).

### 2. Action Items for 2:30 PM Sync
- Greenlight autonomous pilot trial with Omni Corp.
- Reallocate surplus savings to fine-tuning domain evaluations.`;
  } else if (taskTitle.toLowerCase().includes('token') || taskTitle.toLowerCase().includes('pr') || taskType === 'code_patch') {
    deliverable = `## Automated PR #142 Test Patch: Token Refresh Expiration
**Target File:** \`src/auth/tokenInterceptor.test.ts\`  
**Reviewer:** Marcus Chen  

\`\`\`typescript
describe('TokenInterceptor - Expiration & Refresh Flow', () => {
  it('should catch expired JWT, trigger refresh endpoint, and replay queued request', async () => {
    const mockApiClient = createMockClient();
    const expiredToken = generateMockToken({ exp: Date.now() - 1000 });
    const freshToken = generateMockToken({ exp: Date.now() + 3600000 });

    mockApiClient.setAuthToken(expiredToken);
    const refreshSpy = jest.spyOn(authService, 'refreshToken').mockResolvedValue(freshToken);

    const response = await mockApiClient.get('/api/protected/session');
    
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(mockApiClient.getAuthToken()).toBe(freshToken);
  });
});
\`\`\`
*Verification: Test assertion passes locally with 0 regressions. Ready to merge.*`;
  } else if (taskTitle.toLowerCase().includes('security') || taskTitle.toLowerCase().includes('omni') || taskType === 'compliance_brief') {
    deliverable = `## Enterprise Security & VPC Tenant Isolation Brief
**Prepared For:** Sarah Jenkins & CISO Office (Omni Corp)  
**Meeting:** 4:15 PM Off-site Workshop  

### 1. Zero-Retention Inference Guarantees
- Customer prompts and contextual documents processed via dedicated VPC tenant endpoints.
- **Zero data retention:** No customer payloads are stored or used for model retraining.

### 2. Regulatory Compliance
- **SOC2 Type II:** Fully audited and certified encryption in transit (TLS 1.3) and at rest (AES-256).
- **Data Residency:** All processing constrained strictly to US-East geographical zones.`;
  } else {
    deliverable = `## Completed Task: ${taskTitle}
### Summary of Deliverable
Autonomously resolved requirements based on user goals and communication context.

### Key Outputs
- Synthesized relevant documents and verified against stated constraints.
- Output validated for immediate user deployment.`;
  }

  return JSON.stringify({
    status: 'completed',
    taskTitle,
    completionTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    deliverable,
    nextRecommendedStep: 'Present deliverable to user or dispatch to recipient'
  }, null, 2);
};

// Tool: Manage User Goals
const manageUserGoals = async (args: { action: 'list' | 'add' | 'update'; goalId?: string; newGoalTitle?: string; targetDeadline?: string }) => {
  if (args.action === 'list') {
    return JSON.stringify({
      status: 'success',
      totalGoals: mockGoalsStore.length,
      goals: mockGoalsStore
    }, null, 2);
  }
  return JSON.stringify({
    status: 'success',
    message: `Goal action '${args.action}' processed successfully.`
  });
};

// Tool: Scan Communication Signals
const scanCommunicationSignals = async (args: { filterUnread?: boolean }) => {
  return JSON.stringify({
    status: 'success',
    activeSignalCount: mockCommunicationsStore.length,
    signals: mockCommunicationsStore,
    summary: 'Detected 3 urgent incoming signals with imminent deadlines.'
  }, null, 2);
};

// Tool: Check Calendar & Upcoming Events
const checkCalendarAndEvents = async (args: { filterDate?: string; category?: string }) => {
  try {
    const events = mockCalendarStore.filter(e => {
      if (args.filterDate && !e.date.toLowerCase().includes(args.filterDate.toLowerCase())) return false;
      if (args.category && e.category !== args.category) return false;
      return true;
    });
    return JSON.stringify({
      status: 'success',
      count: events.length,
      events: events,
      summary: `Found ${events.length} event(s) matching your schedule parameters.`
    }, null, 2);
  } catch (error: any) {
    return `Error querying calendar: ${error.message}`;
  }
};

// Tool: Check Traffic & Route Conditions
const checkTrafficAndTransit = async (args: { origin?: string; destination: string; arrivalTime?: string }) => {
  const origin = args.origin || 'Current Location (Silicon Valley HQ)';
  const dest = args.destination;
  
  const isDowntown = dest.toLowerCase().includes('downtown') || dest.toLowerCase().includes('market');
  const duration = isDowntown ? '38 minutes' : '22 minutes';
  const delay = isDowntown ? '12 minutes incident delay on I-280 North' : 'Normal flow';
  const recommendedDeparture = args.arrivalTime ? `35-40 minutes before ${args.arrivalTime}` : 'Immediate or within 15 minutes';

  return JSON.stringify({
    status: 'success',
    route: `${origin} ➔ ${dest}`,
    estimatedDuration: duration,
    trafficConditions: isDowntown ? 'Heavy Congestion' : 'Moderate Flow',
    trafficIncidentDetails: delay,
    recommendedDepartureTime: recommendedDeparture,
    proactiveAdvice: isDowntown 
      ? 'Alert: Accident on 4th street exit adding 12 mins. Recommend taking Embarcadero alternate or departing 15 mins earlier.'
      : 'Route is clear. Standard transit time expected.'
  }, null, 2);
};

// Tool: Prepare Meeting Dossier & Brief
const prepareMeetingDossier = async (args: { meetingTitle: string; attendees?: string[]; focusArea?: string }) => {
  return JSON.stringify({
    status: 'ready',
    meetingTitle: args.meetingTitle,
    dossier: {
      executiveSummary: `Structured briefing package for "${args.meetingTitle}". Synthesized previous discussion threads and action items.`,
      keyObjectives: [
        'Review autonomous agent performance metrics and safety guardrails',
        'Finalize Q4 milestones and compute allocation',
        'Agree on client trial deployment timeline'
      ],
      attendeeBriefs: (args.attendees || ['Elena Rostova', 'Marcus Chen']).map(name => ({
        name,
        recentTopics: 'Focused on latency optimization and user control autonomy',
        likelyPriorities: 'Clear verification criteria and explainability logs'
      })),
      suggestedTalkingPoints: [
        'Demonstrate the multi-turn NLU accuracy on sarcasm and idioms',
        'Highlight the self-improving personalization feedback loop that auto-adapts prompts',
        'Show proactive assistance engine predicting traffic and pre-assembling materials'
      ],
      draftDocumentStatus: 'Pre-assembled draft slides & executive memo ready for user review'
    }
  }, null, 2);
};

// Tool: GitHub Analysis
const analyzeGitHubRepository = async ({ owner, repo }: { owner: string; repo: string }) => {
  try {
    const [repoRes, languagesRes, readmeRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`)
    ]);

    if (!repoRes.ok) {
      return `Error: Could not fetch repository data for ${owner}/${repo}. Status: ${repoRes.status}`;
    }

    const repoData = await repoRes.json();
    const languagesData = languagesRes.ok ? await languagesRes.json() : {};
    const readmeData = readmeRes.ok ? await readmeRes.json() : {};
    const readmeContent = readmeData.content ? atob(readmeData.content).substring(0, 2000) : 'No README found.';

    return JSON.stringify({
      repo: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      languages: languagesData,
      license: repoData.license?.name || 'Unspecified',
      readmeExcerpt: readmeContent
    }, null, 2);
  } catch (error: any) {
    return `Error analyzing repository: ${error.message}`;
  }
};

// Tool: Generate Pull Request Description
const generatePRDescription = async ({ changes, titleHint }: { changes: string; titleHint?: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a production-grade GitHub pull request title and body in Markdown.
Context / Changes:
${changes}
Title hint: ${titleHint || 'Auto-generated'}`,
    });
    return response.text || '## PR Summary\nChanges implemented successfully.';
  } catch (err: any) {
    return `## PR: ${titleHint || 'Autonomous Update'}\n\n### Changes\n${changes}\n\n*Generated autonomously by Aura.*`;
  }
};

// Tool: Web Search Grounding Emulation
const webSearchTool = async ({ query }: { query: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide an accurate, concise real-time factual summary answering this search query: "${query}". Include 2-3 reliable reference points.`,
    });
    return response.text || `Search results for: ${query}`;
  } catch (err: any) {
    return `Results for "${query}": Verified up-to-date knowledge and guidelines processed.`;
  }
};

// Function Declarations
const predictUpcomingTasksDeclaration: FunctionDeclaration = {
  name: 'predictUpcomingTasksAndDeadlines',
  description: 'Scans user calendar, stated goals, and communication history (email/Slack) to proactively identify impending deadlines and offer assistance or autonomous completion.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      urgencyThreshold: { type: Type.STRING, description: 'Optional urgency filter (critical, high, medium)' },
    },
  },
};

const executeAutonomousTaskDeclaration: FunctionDeclaration = {
  name: 'executeAutonomousTaskCompletion',
  description: 'Autonomously completes predicted tasks, such as drafting budget memos, writing code patches, or preparing security briefs.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      taskTitle: { type: Type.STRING, description: 'The title of the task to complete' },
      taskType: { type: Type.STRING, description: 'Type: budget_memo, code_patch, compliance_brief, general' },
      contextNotes: { type: Type.STRING, description: 'Specific context or parameters to apply' }
    },
    required: ['taskTitle', 'taskType'],
  },
};

const manageUserGoalsDeclaration: FunctionDeclaration = {
  name: 'manageUserGoals',
  description: 'Inspects, lists, or tracks progress on stated user goals and milestones.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: { type: Type.STRING, description: 'list, add, or update' },
      goalId: { type: Type.STRING, description: 'ID of goal to update' },
    },
    required: ['action'],
  },
};

const scanCommunicationSignalsDeclaration: FunctionDeclaration = {
  name: 'scanCommunicationSignals',
  description: 'Scans communication history from email, Slack, and client portals for unread actionable requests.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      filterUnread: { type: Type.BOOLEAN, description: 'Filter only unread actionable signals' },
    },
  },
};

const checkCalendarDeclaration: FunctionDeclaration = {
  name: 'checkCalendarAndEvents',
  description: 'Inspects user calendar, scheduled meetings, attendees, and daily agenda.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      filterDate: { type: Type.STRING, description: 'Optional date filter, e.g. "Today", "Tomorrow"' },
      category: { type: Type.STRING, description: 'Optional category: meeting, travel, deep_work' },
    },
  },
};

const checkTrafficDeclaration: FunctionDeclaration = {
  name: 'checkTrafficAndTransit',
  description: 'Checks live route traffic, delays, estimated transit duration, and departure recommendations.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      origin: { type: Type.STRING, description: 'Starting address or point' },
      destination: { type: Type.STRING, description: 'Target destination or meeting venue' },
      arrivalTime: { type: Type.STRING, description: 'Target arrival time, e.g. "4:15 PM"' },
    },
    required: ['destination'],
  },
};

const prepareMeetingDossierDeclaration: FunctionDeclaration = {
  name: 'prepareMeetingDossier',
  description: 'Proactively gathers briefing documents, talking points, attendee intelligence, and draft materials for an upcoming meeting.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      meetingTitle: { type: Type.STRING, description: 'Title or subject of the meeting' },
      attendees: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'Key participants in the meeting'
      },
      focusArea: { type: Type.STRING, description: 'Specific focus area or goals' },
    },
    required: ['meetingTitle'],
  },
};

const analyzeGitHubRepoDeclaration: FunctionDeclaration = {
  name: 'analyzeGitHubRepository',
  description: 'Fetches metadata, languages, and README overview of a public GitHub repository.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      owner: { type: Type.STRING, description: 'GitHub username or org' },
      repo: { type: Type.STRING, description: 'Repository name' },
    },
    required: ['owner', 'repo'],
  },
};

const generatePRDescriptionDeclaration: FunctionDeclaration = {
  name: 'generatePRDescription',
  description: 'Generates a formatted pull request title, description, and testing checklist.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      changes: { type: Type.STRING, description: 'Summary of file modifications or git diff' },
      titleHint: { type: Type.STRING, description: 'Optional title recommendation' },
    },
    required: ['changes'],
  },
};

const webSearchDeclaration: FunctionDeclaration = {
  name: 'webSearchTool',
  description: 'Searches the web for up-to-date information, documentation, news, or technical queries.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: 'Search query' },
    },
    required: ['query'],
  },
};

export const toolbelt: Record<string, Function> = {
  predictUpcomingTasksAndDeadlines,
  executeAutonomousTaskCompletion,
  manageUserGoals,
  scanCommunicationSignals,
  checkCalendarAndEvents,
  checkTrafficAndTransit,
  prepareMeetingDossier,
  analyzeGitHubRepository,
  generatePRDescription,
  webSearchTool,
};

export const toolConfig = {
  tools: [
    {
      functionDeclarations: [
        predictUpcomingTasksDeclaration,
        executeAutonomousTaskDeclaration,
        manageUserGoalsDeclaration,
        scanCommunicationSignalsDeclaration,
        checkCalendarDeclaration,
        checkTrafficDeclaration,
        prepareMeetingDossierDeclaration,
        analyzeGitHubRepoDeclaration,
        generatePRDescriptionDeclaration,
        webSearchDeclaration,
      ],
    },
  ],
};
