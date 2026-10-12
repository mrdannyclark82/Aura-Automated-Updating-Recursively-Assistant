import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Message,
  Role,
  CognitiveState,
  CalendarEvent,
  RoutineItem,
  UserGoal,
  CommunicationSignal,
  PredictedTask,
  ProactiveSuggestion,
  ProactiveSettings,
  LearnedPreference,
  InteractionPattern,
  FeedbackRating,
  ToolExecutionRecord,
  CognitiveMetricPoint,
  IntentCategory,
  UploadedMemory,
} from './types';
import { INITIAL_UPLOADED_MEMORIES } from './services/initialMemories';
import ChatHistory from './components/ChatHistory';
import UserInput from './components/UserInput';
import Welcome from './components/Welcome';
import Avatar from './components/Avatar';
import ProactiveEnginePanel from './components/ProactiveEnginePanel';
import LearningDashboard from './components/LearningDashboard';
import SettingsModal from './components/SettingsModal';
import SystemPromptDisplay from './components/SystemPromptDisplay';
import PWAInstallBanner from './components/PWAInstallBanner';
import OfflineIndicator from './components/OfflineIndicator';
import {
  sendMessageStream,
  analyzeNLU,
  generateProactiveSuggestions,
  analyzeFeedbackAndAdapt,
  analyzeInteractionPatterns,
  planAutonomousTask,
} from './services/geminiService';
import { sendLocalGemmaStream, checkWebGpuSupport } from './services/localGemmaService';
import {
  mockCalendarStore,
  mockRoutinesStore,
  mockGoalsStore,
  mockCommunicationsStore,
} from './tools/toolbelt';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useOnlineStatus } from './hooks/usePWAInstall';
import {
  Zap,
  Brain,
  Sliders,
  Sparkles,
  ShieldAlert,
  Volume2,
  VolumeX,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  CheckCircle,
  ListTodo,
  Target,
  Cpu,
  WifiOff,
} from 'lucide-react';

const INITIAL_PREFERENCES: LearnedPreference[] = [
  {
    id: 'pref-init-1',
    rule: 'Prioritize structured bulleted summaries before exhaustive technical breakdowns.',
    category: 'formatting',
    source: 'Default Self-Improvement Seed',
    confidence: 95,
    enabled: true,
    updatedAt: 'Initial',
  },
  {
    id: 'pref-init-2',
    rule: 'When discussing scheduled meetings, automatically check attendee context and transit times.',
    category: 'proactivity',
    source: 'Executive Assistant Heuristic',
    confidence: 90,
    enabled: true,
    updatedAt: 'Initial',
  },
  {
    id: 'pref-init-3',
    rule: 'Interpret sarcastic remarks empathetically and address underlying pain points directly.',
    category: 'tone',
    source: 'Affective Computing Baseline',
    confidence: 92,
    enabled: true,
    updatedAt: 'Initial',
  },
  {
    id: 'pref-init-4',
    rule: 'When impending deadlines or unfulfilled requests are detected, proactively offer deliverable completion.',
    category: 'task_management',
    source: 'Proactive Task Engine Seed',
    confidence: 94,
    enabled: true,
    updatedAt: 'Initial',
  },
];

const INITIAL_PATTERNS: InteractionPattern[] = [
  {
    id: 'pat-1',
    patternType: 'response_density',
    title: 'High-Density Executive Specifications',
    description: 'You frequently prioritize immediate typed code solutions, concise architectural tradeoffs, and minimal conversational filler.',
    detectedFrequency: 6,
    tailoredAdaptation: 'Lead with complete typed TypeScript implementation; format explanations with terse bullet points.',
    confidence: 96,
    enabled: true,
  },
  {
    id: 'pat-2',
    patternType: 'proactivity_style',
    title: 'Autonomous Deliverable Completion',
    description: 'You frequently accept pre-assembled draft documents and test patches when deadlines or communication commitments approach.',
    detectedFrequency: 5,
    tailoredAdaptation: 'Pre-compile executive memos, test patches, and compliance briefs 45 mins before stated deadlines.',
    confidence: 93,
    enabled: true,
  },
  {
    id: 'pat-3',
    patternType: 'meeting_lead_time',
    title: 'Proactive Transit & Attendee Primes',
    description: 'You prefer route alerts and participant background dossiers well ahead of scheduled meetings.',
    detectedFrequency: 4,
    tailoredAdaptation: 'Check I-280 traffic incidents and synthesize participant agendas 40 mins before calendar events.',
    confidence: 91,
    enabled: true,
  },
];

const INITIAL_PREDICTED_TASKS: PredictedTask[] = [
  {
    id: 'pred-task-1',
    title: 'Draft Q4 Compute Budget Memo for Elena Rostova',
    rationale: 'Derived from Elena’s email (10:14 AM) requesting updated GPU & inference budget numbers before the 2:30 PM sync.',
    sourceType: 'communication',
    sourceTitle: 'Email: Urgent: Revised Compute Budget • Due 2:00 PM',
    deadline: 'Today, 2:00 PM',
    urgency: 'critical',
    assistanceType: 'auto_complete',
    actionPrompt: 'Autonomously execute and draft the revised Q4 compute budget memo for Elena Rostova with GPU quotas and cost savings.',
    status: 'pending',
    confidence: 96,
    deliverablePreview: 'Executive summary detailing 42% cost reduction with Gemini 3.8 Flash and $10.3k monthly compute surplus.'
  },
  {
    id: 'pred-task-2',
    title: 'Patch Token Refresh Test Assertion for PR #142',
    rationale: 'Marcus Chen noted CI is blocked awaiting mock token expiration test assertion to unblock merge.',
    sourceType: 'goal',
    sourceTitle: 'Goal: Complete Review & Merge Authentication PR #142',
    deadline: 'Today, 1:30 PM',
    urgency: 'high',
    assistanceType: 'auto_complete',
    actionPrompt: 'Write the mock token expiration test assertion code patch for PR #142 and explain the solution for Marcus Chen.',
    status: 'pending',
    confidence: 94,
    deliverablePreview: 'TypeScript Jest test block asserting 401 interceptor token refresh with 100% code coverage.'
  },
  {
    id: 'pred-task-3',
    title: 'Assemble Omni Corp Security & Data Residency Brief',
    rationale: 'Inquiry from Sarah Jenkins ahead of the 4:15 PM off-site workshop in Downtown.',
    sourceType: 'communication',
    sourceTitle: 'Client Inquiry: Security & Compliance Prerequisite',
    deadline: 'Today, 3:45 PM',
    urgency: 'high',
    assistanceType: 'auto_complete',
    actionPrompt: 'Prepare the enterprise data boundary and SOC2 Type II compliance memo for Omni Corp.',
    status: 'pending',
    confidence: 92,
    deliverablePreview: '1-page compliance overview affirming zero data persistence, VPC peering, and SOC2 certification.'
  }
];

const INITIAL_SETTINGS: ProactiveSettings = {
  intrusiveness: 'balanced',
  autoPrepareMeetingDocs: true,
  autoCheckTraffic: true,
  autoPredictDeadlines: true,
  routineAlerts: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00',
  },
};

const INITIAL_COGNITIVE_METRICS: CognitiveMetricPoint[] = [
  {
    id: 'cm-1',
    interactionIndex: 1,
    querySnippet: 'Draft executive compute budget memo for Elena Rostova',
    intent: 'drafting',
    complexityScore: 78,
    latencyMs: 940,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '09:15 AM',
  },
  {
    id: 'cm-2',
    interactionIndex: 2,
    querySnippet: 'Debug Jest token refresh interceptor mock assertion',
    intent: 'debug',
    complexityScore: 82,
    latencyMs: 1050,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '09:22 AM',
  },
  {
    id: 'cm-3',
    interactionIndex: 3,
    querySnippet: 'Research WebGPU tensor latency vs wasm SIMD execution',
    intent: 'research',
    complexityScore: 68,
    latencyMs: 760,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '09:40 AM',
  },
  {
    id: 'cm-4',
    interactionIndex: 4,
    querySnippet: 'What is our current SOC2 data residency compliance posture?',
    intent: 'inquiry',
    complexityScore: 42,
    latencyMs: 480,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '10:05 AM',
  },
  {
    id: 'cm-5',
    interactionIndex: 5,
    querySnippet: 'Plan roadmap for Q1 enterprise migration sprint',
    intent: 'planning',
    complexityScore: 74,
    latencyMs: 910,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '10:18 AM',
  },
  {
    id: 'cm-6',
    interactionIndex: 6,
    querySnippet: 'Autonomously execute meeting dossier for Product Strategy Sync',
    intent: 'task_execution',
    complexityScore: 88,
    latencyMs: 1180,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '10:35 AM',
  },
  {
    id: 'cm-7',
    interactionIndex: 7,
    querySnippet: 'Offline inference quick check for auth token format',
    intent: 'debug',
    complexityScore: 35,
    latencyMs: 310,
    modelUsed: 'gemma-local',
    timestamp: '11:02 AM',
  },
  {
    id: 'cm-8',
    interactionIndex: 8,
    querySnippet: 'Draft concise Slack reminder to Marcus on PR review',
    intent: 'drafting',
    complexityScore: 48,
    latencyMs: 560,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '11:15 AM',
  },
  {
    id: 'cm-9',
    interactionIndex: 9,
    querySnippet: 'Investigate I-280 traffic delay incident for Omni workshop',
    intent: 'research',
    complexityScore: 54,
    latencyMs: 620,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '11:42 AM',
  },
  {
    id: 'cm-10',
    interactionIndex: 10,
    querySnippet: 'Quick local test prompt for client cache consistency',
    intent: 'debug',
    complexityScore: 28,
    latencyMs: 270,
    modelUsed: 'gemma-local',
    timestamp: '12:10 PM',
  },
  {
    id: 'cm-11',
    interactionIndex: 11,
    querySnippet: 'Synthesize multi-turn co-reference across prior agenda items',
    intent: 'research',
    complexityScore: 84,
    latencyMs: 1040,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '12:30 PM',
  },
  {
    id: 'cm-12',
    interactionIndex: 12,
    querySnippet: 'Draft summary bullets of quarterly infrastructure savings',
    intent: 'drafting',
    complexityScore: 62,
    latencyMs: 720,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '01:05 PM',
  },
  {
    id: 'cm-13',
    interactionIndex: 13,
    querySnippet: 'Why does Vite service worker require registration in autoUpdate?',
    intent: 'inquiry',
    complexityScore: 38,
    latencyMs: 440,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '01:25 PM',
  },
  {
    id: 'cm-14',
    interactionIndex: 14,
    querySnippet: 'Autonomous task execution: Scan communication signals for deadlines',
    intent: 'task_execution',
    complexityScore: 92,
    latencyMs: 1250,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '01:45 PM',
  },
  {
    id: 'cm-15',
    interactionIndex: 15,
    querySnippet: 'Local Gemma test prompt: Evaluate quick conditional logic',
    intent: 'debug',
    complexityScore: 40,
    latencyMs: 340,
    modelUsed: 'gemma-local',
    timestamp: '02:00 PM',
  },
  {
    id: 'cm-16',
    interactionIndex: 16,
    querySnippet: 'Deconstruct sarcasm in user prompt regarding sprint review cadence',
    intent: 'research',
    complexityScore: 72,
    latencyMs: 880,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '02:15 PM',
  },
  {
    id: 'cm-17',
    interactionIndex: 17,
    querySnippet: 'Plan contingency actions if transit delay exceeds 20 minutes',
    intent: 'planning',
    complexityScore: 65,
    latencyMs: 810,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '02:30 PM',
  },
  {
    id: 'cm-18',
    interactionIndex: 18,
    querySnippet: 'Autonomous task: Patch token refresh handler in PR #142',
    intent: 'task_execution',
    complexityScore: 86,
    latencyMs: 1140,
    modelUsed: 'gemini-3.8-flash',
    timestamp: '02:45 PM',
  },
];

function classifyUserIntent(text: string, parsedIntent?: string): IntentCategory {
  const combined = `${text} ${parsedIntent || ''}`.toLowerCase();
  if (
    combined.includes('debug') ||
    combined.includes('bug') ||
    combined.includes('fix') ||
    combined.includes('error') ||
    combined.includes('test') ||
    combined.includes('patch') ||
    combined.includes('trace') ||
    combined.includes('stack trace') ||
    combined.includes('exception')
  ) {
    return 'debug';
  }
  if (
    combined.includes('draft') ||
    combined.includes('write') ||
    combined.includes('memo') ||
    combined.includes('compose') ||
    combined.includes('email') ||
    combined.includes('letter') ||
    combined.includes('proposal')
  ) {
    return 'drafting';
  }
  if (
    combined.includes('research') ||
    combined.includes('investigate') ||
    combined.includes('analyze') ||
    combined.includes('compare') ||
    combined.includes('benchmark') ||
    combined.includes('evaluate') ||
    combined.includes('explore')
  ) {
    return 'research';
  }
  if (
    combined.includes('plan') ||
    combined.includes('roadmap') ||
    combined.includes('strategy') ||
    combined.includes('schedule') ||
    combined.includes('timeline') ||
    combined.includes('milestone')
  ) {
    return 'planning';
  }
  if (
    combined.includes('execute') ||
    combined.includes('complete deliverable') ||
    combined.includes('run task') ||
    combined.includes('automate') ||
    combined.includes('deliver morning') ||
    combined.includes('prepare dossier')
  ) {
    return 'task_execution';
  }
  if (
    combined.includes('what') ||
    combined.includes('why') ||
    combined.includes('how') ||
    combined.includes('who') ||
    combined.includes('when') ||
    combined.includes('explain') ||
    combined.includes('tell me') ||
    combined.includes('?')
  ) {
    return 'inquiry';
  }
  return 'general';
}

function computeComplexityScore(text: string, nluScore?: number): number {
  if (typeof nluScore === 'number' && nluScore > 0) {
    return Math.min(100, Math.max(10, nluScore));
  }
  let score = 25;
  if (text.length > 50) score += 18;
  if (text.length > 110) score += 20;
  if (/if|unless|otherwise|contingency|condition/i.test(text)) score += 18;
  if (/mock|jwt|token|latency|webgpu|transcription|regression/i.test(text)) score += 14;
  if (/[;,:\-]/.test(text)) score += 8;
  return Math.min(98, Math.max(15, score));
}

const App: React.FC = () => {
  // Persistent State
  const [messages, setMessages] = useLocalStorage<Message[]>('aura_messages', []);
  const [learnedPreferences, setLearnedPreferences] = useLocalStorage<LearnedPreference[]>(
    'aura_learned_preferences',
    INITIAL_PREFERENCES
  );
  const [interactionPatterns, setInteractionPatterns] = useLocalStorage<InteractionPattern[]>(
    'aura_interaction_patterns',
    INITIAL_PATTERNS
  );
  const [userGoals, setUserGoals] = useLocalStorage<UserGoal[]>(
    'aura_user_goals',
    mockGoalsStore
  );
  const [communicationSignals, setCommunicationSignals] = useLocalStorage<CommunicationSignal[]>(
    'aura_communication_signals',
    mockCommunicationsStore
  );
  const [proactiveSettings, setProactiveSettings] = useLocalStorage<ProactiveSettings>(
    'aura_proactive_settings',
    INITIAL_SETTINGS
  );
  const [voiceEnabled, setVoiceEnabled] = useLocalStorage<boolean>('aura_voice_enabled', false);
  const [modelEngine, setModelEngine] = useLocalStorage<'gemini-3.8-flash' | 'gemma-local'>(
    'aura_model_engine',
    'gemini-3.8-flash'
  );
  const [cognitiveMetrics, setCognitiveMetrics] = useLocalStorage<CognitiveMetricPoint[]>(
    'aura_cognitive_metrics',
    INITIAL_COGNITIVE_METRICS
  );
  const [uploadedMemories, setUploadedMemories] = useLocalStorage<UploadedMemory[]>(
    'aura_uploaded_memories',
    INITIAL_UPLOADED_MEMORIES
  );

  // Network Connectivity
  const isOnline = useOnlineStatus();

  // In-memory Runtime State
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>('idle');
  const [activeTool, setActiveTool] = useState<string | undefined>(undefined);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'none' | 'proactive' | 'learning'>('none');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Proactive Task Context & Deadlines
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockCalendarStore as CalendarEvent[]);
  const [routines, setRoutines] = useState<RoutineItem[]>(mockRoutinesStore as RoutineItem[]);
  const [predictedTasks, setPredictedTasks] = useState<PredictedTask[]>(INITIAL_PREDICTED_TASKS);
  const [proactiveSuggestions, setProactiveSuggestions] = useState<ProactiveSuggestion[]>([]);

  // Trigger Toast Notification
  const triggerToast = useCallback((text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  // Offline awareness notification
  useEffect(() => {
    if (!isOnline && modelEngine === 'gemini-3.8-flash') {
      triggerToast('Offline mode detected: switched to Local Gemma (WebGPU).');
    }
  }, [isOnline, modelEngine, triggerToast]);

  // Proactive Engine: Periodic Assessment with Goals & Comms
  useEffect(() => {
    let isMounted = true;
    const evaluateProactivity = async () => {
      try {
        const predictions = await generateProactiveSuggestions(
          calendarEvents,
          routines,
          userGoals,
          communicationSignals,
          learnedPreferences,
          proactiveSettings
        );
        if (isMounted && predictions.length > 0) {
          setProactiveSuggestions(predictions);
        }
      } catch (err) {
        console.error('Proactive evaluation error:', err);
      }
    };

    evaluateProactivity();
    const interval = setInterval(evaluateProactivity, 90000); // Check every 90 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [calendarEvents, routines, userGoals, communicationSignals, proactiveSettings, learnedPreferences]);

  // Periodic Pattern Analyzer over conversational turns
  useEffect(() => {
    if (messages.length >= 4 && messages.length % 4 === 0) {
      const runPatternAnalysis = async () => {
        try {
          const interactionPairs: { user: string; model: string }[] = [];
          for (let i = 0; i < messages.length - 1; i += 2) {
            if (messages[i].role === Role.USER && messages[i + 1]?.role === Role.MODEL) {
              interactionPairs.push({ user: messages[i].text, model: messages[i + 1].text });
            }
          }
          if (interactionPairs.length >= 2) {
            const detected = await analyzeInteractionPatterns(interactionPairs, interactionPatterns);
            if (detected.length > 0) {
              setInteractionPatterns((prev) => {
                const existingTitles = new Set(prev.map((p) => p.title));
                const newUniques = detected.filter((d) => !existingTitles.has(d.title));
                return newUniques.length > 0 ? [...newUniques, ...prev] : prev;
              });
            }
          }
        } catch (err) {
          console.error('Pattern learning loop error:', err);
        }
      };
      runPatternAnalysis();
    }
  }, [messages.length, interactionPatterns, setInteractionPatterns]);

  // Audio Text-to-Speech handler
  const handleSpeakText = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`[\]()]/g, '').slice(0, 350);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  // Primary Message Sender with Upgraded NLU, Intent Badging & Local Gemma Engine
  const handleSendMessage = useCallback(
    async (userText: string, proactiveFlag: boolean = false) => {
      if (isStreaming) return;
      setIsStreaming(true);
      setCognitiveState('perceiving');

      const startTime = performance.now();
      const userMsgId = Date.now().toString();
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Determine active engine (force local Gemma if offline)
      const activeEngine: 'gemini-3.8-flash' | 'gemma-local' =
        !isOnline ? 'gemma-local' : modelEngine;

      // 1. Initiate SOTA Deep NLU Analysis in parallel
      const recentHistoryTuples = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      let nluData;
      if (activeEngine === 'gemini-3.8-flash' && isOnline) {
        try {
          nluData = await analyzeNLU(userText, recentHistoryTuples);
        } catch (err) {
          console.error('NLU parsing failed:', err);
        }
      }

      // Classify intent and compute complexity score
      const primaryIntent = classifyUserIntent(userText, nluData?.intent);
      const complexityScore = computeComplexityScore(userText, nluData?.syntax?.complexityScore);

      // Add user message with parsed NLU data & Intent Badge
      const userMessage: Message = {
        id: userMsgId,
        role: Role.USER,
        text: userText,
        timestamp,
        nlu: nluData,
        primaryIntent,
        complexityScore,
        modelUsed: activeEngine,
        proactiveOrigin: proactiveFlag,
      };

      setMessages((prev) => [...prev, userMessage]);

      // 2. Prepare Model Message placeholder & detect grounding memory matches
      const matchedMemories = uploadedMemories
        .filter((m) => m.enabled)
        .filter((m) => {
          const lower = userText.toLowerCase();
          return (
            lower.includes(m.title.toLowerCase()) ||
            m.tags.some((t) => lower.includes(t.toLowerCase())) ||
            (m.fileName && lower.includes(m.fileName.toLowerCase())) ||
            lower.includes('architecture') ||
            lower.includes('guideline') ||
            lower.includes('spec') ||
            lower.includes('memory') ||
            lower.includes('document') ||
            lower.includes('sop') ||
            lower.includes('memo')
          );
        })
        .map((m) => m.title);

      const modelMsgId = (Date.now() + 1).toString();
      const modelPlaceholder: Message = {
        id: modelMsgId,
        role: Role.MODEL,
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolsUsed: [],
        modelUsed: activeEngine,
        memorySources: matchedMemories.length > 0 ? matchedMemories : undefined,
      };

      setMessages((prev) => [...prev, modelPlaceholder]);

      // 3. Autonomous Task Planner check for complex multi-clause requests (when cloud Gemini is active)
      if (
        activeEngine === 'gemini-3.8-flash' &&
        isOnline &&
        (userText.length > 70 || (nluData && nluData.syntax.complexityScore > 65))
      ) {
        planAutonomousTask(userText).then((plan) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === modelMsgId ? { ...m, plan } : m))
          );
        });
      }

      setCognitiveState('reasoning');

      try {
        let accumulatedText = '';

        if (activeEngine === 'gemma-local') {
          // Client-side WebGPU Gemma execution with uploaded memories grounding
          setCognitiveState('synthesizing');
          const localStream = sendLocalGemmaStream(
            userText,
            'You are Aura with on-device WebGPU Gemma model runtime.',
            recentHistoryTuples,
            uploadedMemories
          );

          for await (const chunk of localStream) {
            accumulatedText += chunk.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === modelMsgId ? { ...m, text: accumulatedText } : m
              )
            );
          }
        } else {
          // Cloud Gemini 3.8 Flash execution with autonomous tools & grounding memories
          const conversationHistory = messages
            .filter((m) => m.text && m.text.trim().length > 0 && (m.role === Role.USER || m.role === Role.MODEL))
            .map((m) => ({
              role: m.role === Role.USER ? 'user' : 'model',
              parts: [{ text: m.text.trim() }],
            }));

          const toolsUsedAccumulator: ToolExecutionRecord[] = [];

          const stream = sendMessageStream(
            conversationHistory,
            userText,
            learnedPreferences,
            interactionPatterns,
            userGoals,
            uploadedMemories,
            (toolRecord) => {
              setCognitiveState('executing_tool');
              setActiveTool(toolRecord.toolName);
              toolsUsedAccumulator.push(toolRecord);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === modelMsgId ? { ...m, toolsUsed: [...toolsUsedAccumulator] } : m
                )
              );
            }
          );

          for await (const chunk of stream) {
            if (chunk.text) {
              setCognitiveState('synthesizing');
              accumulatedText += chunk.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === modelMsgId ? { ...m, text: accumulatedText } : m
                )
              );
            }
          }
        }

        // Compute total processing latency
        const latencyMs = Math.round(performance.now() - startTime);

        // Update messages with measured latency
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === modelMsgId) {
              return { ...m, latencyMs };
            }
            if (m.id === userMsgId) {
              return { ...m, latencyMs };
            }
            return m;
          })
        );

        // Record telemetry point in Cognitive Performance Tracker (last 20 interactions)
        setCognitiveMetrics((prev) => {
          const newMetric: CognitiveMetricPoint = {
            id: `cm-${Date.now()}`,
            interactionIndex: prev.length + 1,
            querySnippet: userText.slice(0, 70),
            intent: primaryIntent,
            complexityScore,
            latencyMs,
            modelUsed: activeEngine,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return [...prev.slice(-19), newMetric];
        });

        // Voice output if enabled
        if (voiceEnabled && accumulatedText) {
          handleSpeakText(accumulatedText);
        }
      } catch (error: any) {
        console.warn('Cloud Gemini stream encountered issue, executing Local Gemma on-device fallback:', error);
        try {
          setCognitiveState('synthesizing');
          let fallbackText = '';
          const fallbackStream = sendLocalGemmaStream(
            userText,
            'You are Aura with on-device WebGPU Gemma model runtime.',
            recentHistoryTuples,
            uploadedMemories
          );
          for await (const chunk of fallbackStream) {
            fallbackText += chunk.text;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === modelMsgId ? { ...m, text: fallbackText, modelUsed: 'gemma-local' } : m
              )
            );
          }
        } catch (localErr) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === modelMsgId
                ? {
                    ...m,
                    text: 'I apologize, an unexpected reasoning error occurred. Please check your network connection or try rephrasing.',
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        setActiveTool(undefined);
        setCognitiveState('idle');
      }
    },
    [
      messages,
      isStreaming,
      learnedPreferences,
      interactionPatterns,
      userGoals,
      voiceEnabled,
      modelEngine,
      isOnline,
      handleSpeakText,
      setMessages,
      setCognitiveMetrics,
    ]
  );

  // Personalized Learning: Feedback Submission & Reflection Loop
  const handleFeedbackSubmit = useCallback(
    async (messageId: string, feedback: FeedbackRating) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, feedback } : m))
      );

      const msgIndex = messages.findIndex((m) => m.id === messageId);
      const modelMessage = messages[msgIndex];
      const precedingUserMsg = msgIndex > 0 ? messages[msgIndex - 1] : null;

      if (!modelMessage || !precedingUserMsg) return;

      setIsAdapting(true);
      setCognitiveState('adapting_learning');

      try {
        const { newRules, adaptationSummary } = await analyzeFeedbackAndAdapt(
          precedingUserMsg.text,
          modelMessage.text,
          feedback,
          learnedPreferences
        );

        if (newRules && newRules.length > 0) {
          setLearnedPreferences((prev) => [...newRules, ...prev]);
          triggerToast(`Aura Self-Improved: ${adaptationSummary}`);
        }
      } catch (err) {
        console.error('Error synthesizing adaptation rule:', err);
      } finally {
        setIsAdapting(false);
        setCognitiveState('idle');
      }
    },
    [messages, learnedPreferences, setMessages, setLearnedPreferences, triggerToast]
  );

  // Proactive Task Actions
  const handleAutoCompleteTask = useCallback(
    (task: PredictedTask) => {
      setPredictedTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: 'completed' } : t))
      );
      handleSendMessage(task.actionPrompt, true);
      triggerToast(`Autonomously Completing Deliverable: ${task.title}`);
    },
    [handleSendMessage, triggerToast]
  );

  const handleAssistTask = useCallback(
    (task: PredictedTask) => {
      setPredictedTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: 'in_progress' } : t))
      );
      handleSendMessage(`Assist me step-by-step with: ${task.title}. Provide the necessary context, requirements, and next actions.`, true);
      triggerToast(`Initiating Task Assistance: ${task.title}`);
    },
    [handleSendMessage, triggerToast]
  );

  const handleDismissTask = useCallback((id: string) => {
    setPredictedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'dismissed' } : t))
    );
  }, []);

  const handleExecuteProactiveSuggestion = useCallback(
    (suggestion: ProactiveSuggestion) => {
      setProactiveSuggestions((prev) =>
        prev.map((s) => (s.id === suggestion.id ? { ...s, status: 'accepted' } : s))
      );
      handleSendMessage(suggestion.promptToExecute, true);
      triggerToast(`Executing Proactive Action: ${suggestion.title}`);
    },
    [handleSendMessage, triggerToast]
  );

  const handleDismissProactiveSuggestion = useCallback((id: string) => {
    setProactiveSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'dismissed' } : s))
    );
  }, []);

  const handleSimulateTrigger = useCallback(
    (type: 'meeting_soon' | 'morning_routine' | 'traffic_incident' | 'deadline_approaching') => {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (type === 'deadline_approaching') {
        const newTask: PredictedTask = {
          id: `sim-task-${Date.now()}`,
          title: 'Immediate Deadline: Elena’s Q4 Compute Budget Memo',
          rationale: 'Elena Rostova’s email deadline is approaching in 45 minutes before the 2:30 PM roadmap sync.',
          sourceType: 'communication',
          sourceTitle: 'Email from Elena Rostova • Due 2:00 PM',
          deadline: 'Today, 2:00 PM',
          urgency: 'critical',
          assistanceType: 'auto_complete',
          actionPrompt: 'Autonomously execute and draft the revised Q4 compute budget memo for Elena Rostova with GPU quotas and cost savings.',
          status: 'pending',
          confidence: 98,
          deliverablePreview: 'Detailed Q4 budget allocation memo ready to dispatch to Elena.'
        };
        setPredictedTasks((prev) => [newTask, ...prev]);
        setActiveSidebar('proactive');
        triggerToast(`Deadline Alert Triggered: ${newTask.title}`);
        return;
      }

      let newSuggestion: ProactiveSuggestion;
      if (type === 'meeting_soon') {
        newSuggestion = {
          id: `sim-${Date.now()}`,
          title: 'Upcoming Sync: Product Strategy & AI Roadmap',
          triggerEvent: 'Meeting in 15 mins (2:30 PM) with Elena Rostova',
          predictedNeed: 'Proactively synthesized attendee brief, discussion topics, and roadmap benchmarks.',
          actionText: 'Review Meeting Dossier',
          promptToExecute:
            'Prepare and present the meeting briefing dossier for the 2:30 PM Product Strategy & AI Roadmap Sync with Elena and Marcus.',
          urgency: 'high',
          category: 'meeting_prep',
          status: 'pending',
          confidence: 96,
          timestamp: nowStr,
        };
      } else if (type === 'traffic_incident') {
        newSuggestion = {
          id: `sim-${Date.now()}`,
          title: 'Traffic Incident Alert: I-280 Northbound',
          triggerEvent: 'Off-site workshop at Omni Corp (4:15 PM)',
          predictedNeed: 'Severe congestion adding 14 mins delay. Recommended departure: 3:35 PM via alternate Embarcadero route.',
          actionText: 'Check Alternate Transit Route',
          promptToExecute:
            'Check current live traffic and alternate departure routes to Omni Tower Downtown for 4:15 PM arrival.',
          urgency: 'high',
          category: 'traffic_commute',
          status: 'pending',
          confidence: 93,
          timestamp: nowStr,
        };
      } else {
        newSuggestion = {
          id: `sim-${Date.now()}`,
          title: 'Morning Executive Briefing Ready',
          triggerEvent: 'Daily Routine Trigger (8:00 AM)',
          predictedNeed: 'Today features 2 major meetings, 1 deep work focus window, and 4 pending PR reviews.',
          actionText: 'Deliver Morning Briefing',
          promptToExecute: 'Deliver my full morning executive briefing, agenda breakdown, and prioritized action items.',
          urgency: 'medium',
          category: 'routine_habit',
          status: 'pending',
          confidence: 95,
          timestamp: nowStr,
        };
      }

      setProactiveSuggestions((prev) => [newSuggestion, ...prev]);
      setActiveSidebar('proactive');
      triggerToast(`Simulated Event Triggered: ${newSuggestion.title}`);
    },
    [triggerToast]
  );

  // Preference & Pattern Helpers
  const handleTogglePreference = useCallback(
    (id: string) => {
      setLearnedPreferences((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
      );
    },
    [setLearnedPreferences]
  );

  const handleDeletePreference = useCallback(
    (id: string) => {
      setLearnedPreferences((prev) => prev.filter((p) => p.id !== id));
      triggerToast('Learned heuristic rule removed.');
    },
    [setLearnedPreferences, triggerToast]
  );

  const handleAddPreference = useCallback(
    (rule: string, category: LearnedPreference['category']) => {
      const newPref: LearnedPreference = {
        id: `pref-manual-${Date.now()}`,
        rule,
        category,
        source: 'User Explicit Configuration',
        confidence: 99,
        enabled: true,
        updatedAt: 'Just now',
      };
      setLearnedPreferences((prev) => [newPref, ...prev]);
      triggerToast('Custom heuristic rule added to cognitive memory.');
    },
    [setLearnedPreferences, triggerToast]
  );

  const handleTogglePattern = useCallback(
    (id: string) => {
      setInteractionPatterns((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
      );
    },
    [setInteractionPatterns]
  );

  // Uploaded Memory Action Handlers
  const handleToggleMemory = useCallback(
    (id: string) => {
      setUploadedMemories((prev) =>
        prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
      );
    },
    [setUploadedMemories]
  );

  const handleDeleteMemory = useCallback(
    (id: string) => {
      setUploadedMemories((prev) => prev.filter((m) => m.id !== id));
      triggerToast('Uploaded memory document removed from bank.');
    },
    [setUploadedMemories, triggerToast]
  );

  const handleAddMemory = useCallback(
    (newMem: Omit<UploadedMemory, 'id' | 'uploadedAt'>) => {
      const memoryItem: UploadedMemory = {
        ...newMem,
        id: `mem-${Date.now()}`,
        uploadedAt: 'Just now',
      };
      setUploadedMemories((prev) => [memoryItem, ...prev]);
      triggerToast(`Indexed "${newMem.title}" into Aura's Memory Bank!`);
    },
    [setUploadedMemories, triggerToast]
  );

  // Metrics calculation
  const totalFeedbackCount = messages.filter((m) => m.feedback).length;
  const feedbackSum = messages.reduce((acc, m) => acc + (m.feedback?.stars || 0), 0);
  const averageRating = totalFeedbackCount > 0 ? feedbackSum / totalFeedbackCount : 4.9;
  const pendingTaskCount = predictedTasks.filter((t) => t.status === 'pending').length;
  const pendingProactiveCount = proactiveSuggestions.filter((s) => s.status === 'pending').length;
  const totalActionableRadarCount = pendingTaskCount + pendingProactiveCount;

  return (
    <div className="w-full h-screen flex flex-col bg-[#070a1e] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30">
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[110px]" />
      </div>

      {/* PWA Ambient Install Banner & Offline Mode Indicator */}
      <PWAInstallBanner />
      <OfflineIndicator />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 text-xs shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="w-full h-16 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between backdrop-blur-xl bg-[#090d29]/80 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Avatar
            state={cognitiveState}
            size="sm"
            activeTool={activeTool}
            onClick={() => setActiveSidebar(activeSidebar === 'proactive' ? 'none' : 'proactive')}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Aura
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                  Autonomous AI
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/50 font-mono">
              <span className="capitalize text-cyan-400 font-semibold">{cognitiveState.replace('_', ' ')}</span>
              {activeTool && <span>• {activeTool}</span>}
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Model Engine Selector: Cloud Gemini vs Local Gemma (WebGPU) */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => {
                setModelEngine('gemini-3.8-flash');
                triggerToast('Active engine: Cloud Gemini 3.8 Flash (Full Toolbelt).');
              }}
              disabled={!isOnline}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-mono text-[11px] ${
                modelEngine === 'gemini-3.8-flash' && isOnline
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white'
              } ${!isOnline ? 'opacity-30 cursor-not-allowed' : ''}`}
              title={!isOnline ? 'Offline: Cloud disabled' : 'Switch to Cloud Gemini 3.8 Flash'}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Gemini 3.8</span>
              <span className="md:hidden">Cloud</span>
            </button>

            <button
              onClick={() => {
                setModelEngine('gemma-local');
                triggerToast('Active engine: Local Gemma 2B (WebGPU In-Browser).');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-mono text-[11px] ${
                modelEngine === 'gemma-local' || !isOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white'
              }`}
              title="Switch to Local Gemma 2B (On-Device WebGPU)"
            >
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">Local Gemma (WebGPU)</span>
              <span className="md:hidden">Gemma</span>
              {!isOnline && (
                <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300">Offline</span>
              )}
            </button>
          </div>

          {/* Proactive Task Radar Button with Badge */}
          <button
            onClick={() => setActiveSidebar(activeSidebar === 'proactive' ? 'none' : 'proactive')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSidebar === 'proactive'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-950/40'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Task Radar</span>
            {totalActionableRadarCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                {totalActionableRadarCount}
              </span>
            )}
          </button>

          {/* Personalized Learning Button with Pattern Count */}
          <button
            onClick={() => setActiveSidebar(activeSidebar === 'learning' ? 'none' : 'learning')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSidebar === 'learning'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Memory & Learning</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
              {uploadedMemories.length} docs
            </span>
          </button>

          {/* Voice Speech Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              voiceEnabled
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-900/40'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title={voiceEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* New Chat / Reset Messages */}
          <button
            onClick={() => {
              if (messages.length > 0) {
                setMessages([]);
                triggerToast('Started a fresh conversation session.');
              }
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Start New Chat Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="System Configuration"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden relative max-w-7xl mx-auto w-full">
        {/* Left / Center Chat Column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Top Bar for Dynamic System Prompt Inspection */}
          <div className="px-4 py-1 border-b border-white/5 bg-black/20 flex-shrink-0">
            <SystemPromptDisplay
              preferences={learnedPreferences}
              patterns={interactionPatterns}
              goals={userGoals}
              memories={uploadedMemories}
            />
          </div>

          {/* Chat Stream Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {messages.length === 0 ? (
              <Welcome onSelectPrompt={(prompt) => handleSendMessage(prompt)} />
            ) : (
              <div className="max-w-3xl mx-auto">
                <ChatHistory
                  messages={messages}
                  onFeedbackSubmit={handleFeedbackSubmit}
                  onSpeakText={handleSpeakText}
                  isAdapting={isAdapting}
                />
              </div>
            )}
          </div>

          {/* Input Box at bottom */}
          <div className="flex-shrink-0 w-full">
            <UserInput
              onSendMessage={(text) => handleSendMessage(text)}
              isStreaming={isStreaming || isAdapting}
              onQuickUploadMemory={handleAddMemory}
              onOpenMemoryBank={() => setActiveSidebar('learning')}
            />
          </div>
        </div>

        {/* Sliding / Toggling Drawer Panels for Proactive Engine & Learning */}
        {activeSidebar !== 'none' && (
          <aside className="w-full sm:w-[480px] md:w-[520px] h-full border-l border-white/10 bg-[#090d28]/95 backdrop-blur-2xl z-30 flex flex-col shadow-2xl animate-fade-in">
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/30">
              <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                {activeSidebar === 'proactive' ? 'Task & Deadline Radar' : 'Personalization & Memory Bank'}
              </span>
              <button
                onClick={() => setActiveSidebar('none')}
                className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-2">
              {activeSidebar === 'proactive' ? (
                <ProactiveEnginePanel
                  events={calendarEvents}
                  routines={routines}
                  goals={userGoals}
                  communications={communicationSignals}
                  predictedTasks={predictedTasks}
                  suggestions={proactiveSuggestions}
                  settings={proactiveSettings}
                  preferences={learnedPreferences}
                  onExecuteSuggestion={handleExecuteProactiveSuggestion}
                  onDismissSuggestion={handleDismissProactiveSuggestion}
                  onAutoCompleteTask={handleAutoCompleteTask}
                  onAssistTask={handleAssistTask}
                  onDismissTask={handleDismissTask}
                  onUpdateSettings={setProactiveSettings}
                  onSimulateTrigger={handleSimulateTrigger}
                />
              ) : (
                <LearningDashboard
                  preferences={learnedPreferences}
                  patterns={interactionPatterns}
                  metrics={cognitiveMetrics}
                  memories={uploadedMemories}
                  onTogglePreference={handleTogglePreference}
                  onDeletePreference={handleDeletePreference}
                  onAddPreference={handleAddPreference}
                  onTogglePattern={handleTogglePattern}
                  onToggleMemory={handleToggleMemory}
                  onDeleteMemory={handleDeleteMemory}
                  onAddMemory={handleAddMemory}
                  totalFeedbackCount={totalFeedbackCount}
                  averageRating={averageRating}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={proactiveSettings}
        onUpdateSettings={setProactiveSettings}
        onClearHistory={() => setMessages([])}
        onResetPreferences={() => {
          setLearnedPreferences(INITIAL_PREFERENCES);
          setInteractionPatterns(INITIAL_PATTERNS);
          setCognitiveMetrics(INITIAL_COGNITIVE_METRICS);
          setUploadedMemories(INITIAL_UPLOADED_MEMORIES);
          triggerToast('Reset to default learning rules, memory bank, and telemetry.');
        }}
        voiceEnabled={voiceEnabled}
        onToggleVoice={setVoiceEnabled}
      />
    </div>
  );
};

export default App;
