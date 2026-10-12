export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export type CognitiveState = 
  | 'idle' 
  | 'listening' 
  | 'perceiving' 
  | 'reasoning' 
  | 'executing_tool' 
  | 'synthesizing' 
  | 'adapting_learning';

export interface IdiomaticMatch {
  expression: string;
  literalMeaning: string;
  intendedMeaning: string;
  contextUsage: string;
  pragmaticAction: string; // What the AI should actually do based on this idiom
}

export interface SarcasmAnalysis {
  detected: boolean;
  score: number; // 0 - 100
  polarityInversion: boolean;
  cues: string[];
  explanation: string;
}

export interface ContingencyClause {
  condition: string;
  primaryAction: string;
  fallbackAction?: string;
  temporalConstraint?: string;
}

export interface SyntaxAnalysis {
  sentenceType: 'simple' | 'compound' | 'complex' | 'compound-complex';
  complexityScore: number; // 0 - 100
  mainClauses: string[];
  subordinateClauses: string[];
  contingencies: ContingencyClause[];
  conditionalConstraints: string[];
  temporalAnchors: string[];
}

export interface ContextReference {
  surfaceForm: string; // e.g., "it", "the proposal", "the latter"
  resolvedEntity: string;
  turnDistance: number;
}

export interface ContextualNuance {
  implicitAssumptions: string[];
  latentUrgency: 'low' | 'moderate' | 'critical';
  emotionalUndertone: string;
  ambiguityResolved: string[];
  misinterpretationRisk: number; // 0 - 100% (lower is safer)
}

export interface EntitySlot {
  name: string;
  category: 'datetime' | 'person' | 'location' | 'action' | 'metric' | 'tool' | 'goal' | 'other';
  value: string;
}

export interface NLUAnalysis {
  intent: string;
  subIntents: string[];
  confidence: number;
  syntax: SyntaxAnalysis;
  idioms: IdiomaticMatch[];
  sarcasm: SarcasmAnalysis;
  sentiment: {
    label: 'positive' | 'neutral' | 'negative' | 'mixed';
    intensity: number; // 0 - 100
    emotionalTone: string;
  };
  nuance: ContextualNuance;
  entities: EntitySlot[];
  contextReferences: ContextReference[];
}

export interface TaskPlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  toolRequired?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  resultSummary?: string;
}

export interface TaskPlan {
  id: string;
  goal: string;
  rationale: string;
  steps: TaskPlanStep[];
  status: 'planning' | 'executing' | 'completed' | 'failed';
}

export interface FeedbackRating {
  rating: 'positive' | 'negative';
  stars: number; // 1 to 5
  tags: string[];
  correctionNote?: string;
  createdAt: string;
}

export interface ToolExecutionRecord {
  toolName: string;
  inputArgs: Record<string, any>;
  outputSnippet: string;
  durationMs?: number;
  timestamp: string;
}

export type IntentCategory = 
  | 'research' 
  | 'drafting' 
  | 'debug' 
  | 'planning' 
  | 'task_execution' 
  | 'inquiry' 
  | 'general';

export interface CognitiveMetricPoint {
  id: string;
  interactionIndex: number;
  querySnippet: string;
  intent: IntentCategory;
  complexityScore: number; // 0 - 100
  latencyMs: number;
  modelUsed: 'gemini-3.8-flash' | 'gemma-local';
  timestamp: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
  nlu?: NLUAnalysis;
  primaryIntent?: IntentCategory;
  latencyMs?: number;
  complexityScore?: number;
  modelUsed?: 'gemini-3.8-flash' | 'gemma-local';
  plan?: TaskPlan;
  feedback?: FeedbackRating;
  toolsUsed?: ToolExecutionRecord[];
  proactiveOrigin?: boolean;
  memorySources?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string; // e.g. "10:30 AM"
  date: string; // e.g. "Today" or "Tomorrow"
  durationMinutes: number;
  location?: string;
  attendees?: string[];
  notes?: string;
  category: 'meeting' | 'travel' | 'deep_work' | 'personal';
}

export interface RoutineItem {
  id: string;
  title: string;
  time: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  category: 'morning_briefing' | 'commute_check' | 'focus_shield' | 'evening_debrief';
  enabled: boolean;
  lastRun?: string;
}

// User Stated Goals for Proactive Task Tracking
export interface UserGoal {
  id: string;
  title: string;
  description: string;
  targetDeadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'in_progress' | 'completed' | 'blocked';
  progressPercentage: number;
  milestones: string[];
  source: string;
}

// Communication Thread Signals (Emails, Slack, Inquiries)
export interface CommunicationSignal {
  id: string;
  sender: string;
  channel: 'email' | 'slack' | 'calendar_invite' | 'client_portal';
  subject: string;
  summary: string;
  receivedAt: string;
  actionItemNeeded: boolean;
  extractedDeadline?: string;
  suggestedAction: string;
}

// Proactive Task Prediction & Auto-Assistance
export interface PredictedTask {
  id: string;
  title: string;
  rationale: string;
  sourceType: 'calendar' | 'goal' | 'communication' | 'routine';
  sourceTitle: string;
  deadline: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  assistanceType: 'assist' | 'auto_complete';
  actionPrompt: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  confidence: number;
  deliverablePreview?: string;
}

export interface ProactiveSuggestion {
  id: string;
  title: string;
  triggerEvent: string;
  predictedNeed: string;
  actionText: string;
  promptToExecute: string;
  urgency: 'low' | 'medium' | 'high';
  category: 'meeting_prep' | 'traffic_commute' | 'routine_habit' | 'wellness_focus' | 'proactive_code' | 'task_deadline';
  status: 'pending' | 'accepted' | 'dismissed' | 'snoozed';
  confidence: number;
  timestamp: string;
}

export interface LearnedPreference {
  id: string;
  rule: string;
  category: 'formatting' | 'tone' | 'proactivity' | 'domain_knowledge' | 'schedule' | 'task_management';
  source: string;
  confidence: number; // 0 - 100
  enabled: boolean;
  updatedAt: string;
}

// User Interaction Pattern
export interface InteractionPattern {
  id: string;
  patternType: 'response_density' | 'code_preference' | 'meeting_lead_time' | 'query_timing' | 'proactivity_style';
  title: string;
  description: string;
  detectedFrequency: number;
  tailoredAdaptation: string;
  confidence: number; // 0 - 100
  enabled: boolean;
}

export interface ProactiveSettings {
  intrusiveness: 'subtle' | 'balanced' | 'assertive';
  autoPrepareMeetingDocs: boolean;
  autoCheckTraffic: boolean;
  autoPredictDeadlines: boolean;
  routineAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface Transcription {
  role: Role;
  text: string;
}

export type MemoryCategory = 
  | 'domain_knowledge'
  | 'coding_guidelines'
  | 'project_context'
  | 'personal_bio'
  | 'sop_standards'
  | 'reference_doc';

export interface UploadedMemory {
  id: string;
  title: string;
  content: string;
  summary: string;
  fileName?: string;
  fileSize?: number; // bytes
  fileType?: string; // mime or extension
  category: MemoryCategory;
  tags: string[];
  tokenEstimate: number;
  uploadedAt: string;
  enabled: boolean;
}
