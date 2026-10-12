import React, { useState } from 'react';
import {
  CalendarEvent,
  RoutineItem,
  ProactiveSuggestion,
  ProactiveSettings,
  LearnedPreference,
  UserGoal,
  CommunicationSignal,
  PredictedTask,
} from '../types';
import {
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Sparkles,
  Shield,
  Zap,
  Check,
  X,
  Play,
  Settings,
  Sliders,
  Bell,
  ArrowRight,
  TrendingUp,
  Target,
  Mail,
  MessageSquare,
  CheckCircle2,
  FileText,
  Code2,
  Lock,
  ListTodo,
} from 'lucide-react';

interface ProactiveEnginePanelProps {
  events: CalendarEvent[];
  routines: RoutineItem[];
  goals: UserGoal[];
  communications: CommunicationSignal[];
  predictedTasks: PredictedTask[];
  suggestions: ProactiveSuggestion[];
  settings: ProactiveSettings;
  preferences: LearnedPreference[];
  onExecuteSuggestion: (suggestion: ProactiveSuggestion) => void;
  onDismissSuggestion: (id: string) => void;
  onAutoCompleteTask: (task: PredictedTask) => void;
  onAssistTask: (task: PredictedTask) => void;
  onDismissTask: (id: string) => void;
  onUpdateSettings: (newSettings: ProactiveSettings) => void;
  onSimulateTrigger: (type: 'meeting_soon' | 'morning_routine' | 'traffic_incident' | 'deadline_approaching') => void;
  isGenerating?: boolean;
}

export const ProactiveEnginePanel: React.FC<ProactiveEnginePanelProps> = ({
  events,
  routines,
  goals,
  communications,
  predictedTasks,
  suggestions,
  settings,
  preferences,
  onExecuteSuggestion,
  onDismissSuggestion,
  onAutoCompleteTask,
  onAssistTask,
  onDismissTask,
  onUpdateSettings,
  onSimulateTrigger,
  isGenerating = false,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'suggestions' | 'context' | 'settings'>('tasks');

  const pendingTasks = predictedTasks.filter((t) => t.status === 'pending');
  const pendingSuggestions = suggestions.filter((s) => s.status === 'pending');

  return (
    <div className="flex flex-col h-full bg-[#0a0e27]/95 text-white rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
              Proactive Task Radar
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </h2>
            <p className="text-[11px] text-white/50">Predictive deadlines & autonomous task completion</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs font-medium">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ListTodo className="w-3 h-3" />
            <span>Tasks</span>
            {pendingTasks.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[10px] font-bold rounded-full">
                {pendingTasks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'suggestions'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Radar</span>
            {pendingSuggestions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-cyan-500 text-black text-[10px] font-bold rounded-full">
                {pendingSuggestions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'context'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Target className="w-3 h-3" />
            <span>Goals</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: PREDICTED TASKS & AUTONOMOUS COMPLETION */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-white/50 uppercase font-mono">Predicted Needs</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{pendingTasks.length} Active</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-white/50 uppercase font-mono">Stated Goals</div>
                <div className="text-base font-bold text-cyan-400 mt-0.5">{goals.length} Tracked</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] text-white/50 uppercase font-mono">Unread Signals</div>
                <div className="text-base font-bold text-purple-400 mt-0.5">{communications.length} Inbound</div>
              </div>
            </div>

            {/* Simulation Triggers Bar */}
            <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10">
              <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Simulate Context Triggers</span>
                <span className="text-[10px] text-white/40">Test deadline prediction</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSimulateTrigger('deadline_approaching')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Elena's Budget Deadline (2 PM)</span>
                </button>
                <button
                  onClick={() => onSimulateTrigger('meeting_soon')}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Target className="w-3 h-3 text-cyan-400" />
                  <span>PR #142 Test Patch Need</span>
                </button>
                <button
                  onClick={() => onSimulateTrigger('traffic_incident')}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span>Omni Corp Security Prereq</span>
                </button>
              </div>
            </div>

            {/* List of Predicted Tasks */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider flex items-center justify-between">
                <span>Predicted Upcoming Tasks & Deliverables</span>
                <span>Proactive Offer</span>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="text-center py-8 px-4 bg-white/[0.02] rounded-xl border border-white/5 text-xs text-white/50">
                  All predicted tasks completed or cleared. Aura continues monitoring your communication signals and stated goals.
                </div>
              ) : (
                pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                      task.urgency === 'critical'
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/20'
                        : 'bg-white/[0.04] border-cyan-500/30 shadow-md shadow-black/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                            task.urgency === 'critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {task.urgency} Urgency
                        </span>
                        <span className="text-[11px] text-amber-300/90 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.deadline}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400">
                        {task.confidence}% Match
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white/95 mb-1">{task.title}</h4>
                    
                    <div className="text-[11px] text-white/50 mb-2 font-mono flex items-center gap-1.5">
                      <span className="text-white/35">Origin:</span>
                      <span className="text-cyan-300/80 truncate">{task.sourceTitle}</span>
                    </div>

                    <p className="text-xs text-white/70 mb-2.5 bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                      {task.rationale}
                    </p>

                    {task.deliverablePreview && (
                      <div className="text-[11px] text-emerald-300/90 mb-3 bg-emerald-950/20 border border-emerald-500/20 p-2 rounded-lg font-mono">
                        <span className="text-white/40 block text-[10px] uppercase">Deliverable Preview:</span>
                        {task.deliverablePreview}
                      </div>
                    )}

                    {/* Dual Action Buttons: Auto-Complete vs Assist */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onDismissTask(task.id)}
                        className="text-white/40 hover:text-white/80 text-xs px-2.5 py-1 rounded hover:bg-white/5 transition-colors"
                      >
                        Dismiss
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAssistTask(task)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1 border border-white/10 transition-colors"
                        >
                          <span>Assist Me</span>
                        </button>

                        <button
                          onClick={() => onAutoCompleteTask(task)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Auto-Complete Task</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROACTIVE SUGGESTIONS (CALENDAR & RADAR) */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {pendingSuggestions.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white/[0.02] rounded-xl border border-white/5">
                <Shield className="w-10 h-10 text-cyan-400/50 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-white/80">Proactive Radar Vigilant</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
                  Aura is actively monitoring your schedule and routines.
                </p>
                <button
                  onClick={() => onSimulateTrigger('meeting_soon')}
                  className="mt-4 px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors"
                >
                  Trigger Sample Prediction
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSuggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="p-4 rounded-xl bg-white/[0.04] border border-cyan-500/30 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {sug.category}
                      </span>
                      <span className="font-mono text-cyan-400 text-[11px]">{sug.confidence}% Conf</span>
                    </div>
                    <div className="font-semibold text-white/95 text-sm">{sug.title}</div>
                    <div className="text-cyan-300 font-mono text-[11px]">Trigger: {sug.triggerEvent}</div>
                    <div className="text-white/70 bg-black/30 p-2.5 rounded-lg">{sug.predictedNeed}</div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onDismissSuggestion(sug.id)}
                        className="text-white/40 hover:text-white text-xs"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => onExecuteSuggestion(sug)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1"
                      >
                        <span>{sug.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STATED GOALS & COMMUNICATION SIGNALS */}
        {activeTab === 'context' && (
          <div className="space-y-4">
            {/* Stated Goals Section */}
            <div>
              <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-2.5">
                <Target className="w-3.5 h-3.5" />
                <span>Stated User Goals & Progress</span>
              </div>
              <div className="space-y-2.5">
                {goals.map((g) => (
                  <div key={g.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white/95">{g.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                        Target: {g.targetDeadline}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/60">{g.description}</p>
                    {/* Progress bar */}
                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${g.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/40 font-mono pt-1">
                      <span>Progress: {g.progressPercentage}%</span>
                      <span>{g.milestones.length} Milestones</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Signals Section */}
            <div>
              <div className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 mb-2.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Inbound Communication Signals</span>
              </div>
              <div className="space-y-2">
                {communications.map((comm) => (
                  <div key={comm.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white/90">{comm.sender}</span>
                      <span className="text-[10px] text-white/40 font-mono">{comm.receivedAt}</span>
                    </div>
                    <div className="text-[11px] text-cyan-300 font-medium">{comm.subject}</div>
                    <p className="text-[11px] text-white/60">{comm.summary}</p>
                    {comm.extractedDeadline && (
                      <div className="text-[10px] text-amber-300 font-mono mt-1">
                        Deadline: {comm.extractedDeadline}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTRUSIVENESS SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 space-y-3">
              <label className="block text-xs font-semibold text-cyan-300">
                Proactivity Intrusiveness Threshold
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['subtle', 'balanced', 'assertive'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => onUpdateSettings({ ...settings, intrusiveness: level })}
                    className={`py-2 px-2.5 rounded-lg border text-center transition-all capitalize font-medium ${
                      settings.intrusiveness === level
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 space-y-2.5">
              <div className="font-semibold text-white/90 text-xs">Proactive Task Management Permissions</div>
              
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-white/70">Predict upcoming deadlines from email & Slack</span>
                <input
                  type="checkbox"
                  checked={settings.autoPredictDeadlines}
                  onChange={(e) => onUpdateSettings({ ...settings, autoPredictDeadlines: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-white/70">Auto-prepare meeting dossiers & briefing memos</span>
                <input
                  type="checkbox"
                  checked={settings.autoPrepareMeetingDocs}
                  onChange={(e) => onUpdateSettings({ ...settings, autoPrepareMeetingDocs: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-white/70">Auto-check traffic radar & commute</span>
                <input
                  type="checkbox"
                  checked={settings.autoCheckTraffic}
                  onChange={(e) => onUpdateSettings({ ...settings, autoCheckTraffic: e.target.checked })}
                  className="rounded text-cyan-500 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProactiveEnginePanel;
