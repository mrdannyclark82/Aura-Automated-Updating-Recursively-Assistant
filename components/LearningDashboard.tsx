import React, { useState } from 'react';
import { LearnedPreference, InteractionPattern, FeedbackRating, CognitiveMetricPoint, UploadedMemory } from '../types';
import { CognitivePerformanceChart } from './CognitivePerformanceChart';
import { MemoryBankView } from './MemoryBankView';
import {
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Shield,
  Layers,
  Award,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Activity,
  LineChart,
  Database,
} from 'lucide-react';

interface LearningDashboardProps {
  preferences: LearnedPreference[];
  patterns: InteractionPattern[];
  metrics?: CognitiveMetricPoint[];
  memories?: UploadedMemory[];
  onTogglePreference: (id: string) => void;
  onDeletePreference: (id: string) => void;
  onAddPreference: (rule: string, category: LearnedPreference['category']) => void;
  onTogglePattern: (id: string) => void;
  onToggleMemory?: (id: string) => void;
  onDeleteMemory?: (id: string) => void;
  onAddMemory?: (memory: Omit<UploadedMemory, 'id' | 'uploadedAt'>) => void;
  totalFeedbackCount: number;
  averageRating: number;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  preferences,
  patterns,
  metrics = [],
  memories = [],
  onTogglePreference,
  onDeletePreference,
  onAddPreference,
  onTogglePattern,
  onToggleMemory = () => {},
  onDeleteMemory = () => {},
  onAddMemory = () => {},
  totalFeedbackCount,
  averageRating,
}) => {
  const [activeTab, setActiveTab] = useState<'memories' | 'patterns' | 'rules' | 'performance'>('memories');
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<LearnedPreference['category']>('formatting');
  const [isAdding, setIsAdding] = useState(false);

  const activeRulesCount = preferences.filter((p) => p.enabled).length;
  const activePatternsCount = patterns.filter((p) => p.enabled).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRuleText.trim()) {
      onAddPreference(newRuleText.trim(), newRuleCategory);
      setNewRuleText('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e27]/95 text-white rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
              Personalized Learning Hub
            </h2>
            <p className="text-[11px] text-white/50">Patterns, heuristic rules & cognitive performance telemetry</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Teach Heuristic</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 p-4 border-b border-white/10 bg-black/20 text-center">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-[10px] text-white/50 uppercase font-mono">Tailored Patterns</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {activePatternsCount} <span className="text-xs text-white/40">/ {patterns.length}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-[10px] text-white/50 uppercase font-mono">Learned Rules</div>
          <div className="text-lg font-bold text-cyan-400 mt-0.5">
            {activeRulesCount} <span className="text-xs text-white/40">/ {preferences.length}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-[10px] text-white/50 uppercase font-mono">Adaptation Accuracy</div>
          <div className="text-lg font-bold text-purple-400 mt-0.5 flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>98.6%</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 pt-3 flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('memories')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'memories'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
              : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Memory Bank</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-cyan-200 text-[9px] font-mono">
            {memories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'patterns'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
              : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Interaction Patterns</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Synthesized Rules ({preferences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'performance'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
              : 'text-white/60 hover:text-white bg-white/5 border border-white/10'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>Cognitive Performance</span>
          {metrics.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-200 text-[9px] font-mono">
              {metrics.length}
            </span>
          )}
        </button>
      </div>

      {/* Body / List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Add Heuristic Form */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="p-3.5 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Explicitly Teach Aura a Rule
              </span>
              <span className="text-[10px] text-white/50 font-mono">System Injection</span>
            </div>

            <div>
              <input
                type="text"
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                placeholder="e.g. In technical explanations, always provide an architectural comparison table."
                className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-white/50">Category:</span>
                <select
                  value={newRuleCategory}
                  onChange={(e) => setNewRuleCategory(e.target.value as any)}
                  className="bg-black/60 border border-white/15 rounded text-xs text-white px-2 py-1 focus:outline-none"
                >
                  <option value="formatting">Formatting</option>
                  <option value="tone">Tone</option>
                  <option value="proactivity">Proactivity</option>
                  <option value="task_management">Task Management</option>
                  <option value="domain_knowledge">Domain Knowledge</option>
                  <option value="schedule">Schedule</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded text-xs transition-colors"
                >
                  Save Heuristic
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 0: UPLOADED MEMORY BANK */}
        {activeTab === 'memories' && (
          <div className="h-full">
            <MemoryBankView
              memories={memories}
              onToggleMemory={onToggleMemory}
              onDeleteMemory={onDeleteMemory}
              onAddMemory={onAddMemory}
            />
          </div>
        )}

        {/* TAB 1: INTERACTION PATTERNS */}
        {activeTab === 'patterns' && (
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider flex items-center justify-between">
              <span>Recognized Behavioral & Interaction Patterns</span>
              <span>Autonomous Adaptation</span>
            </div>

            {patterns.map((pat) => (
              <div
                key={pat.id}
                className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-2.5 ${
                  pat.enabled
                    ? 'bg-white/[0.04] border-emerald-500/30 shadow-md shadow-emerald-950/20'
                    : 'bg-white/[0.01] border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                        {pat.patternType}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        Observed {pat.detectedFrequency}x • {pat.confidence}% Confidence
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white/95">{pat.title}</h4>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">{pat.description}</p>
                  </div>

                  <button
                    onClick={() => onTogglePattern(pat.id)}
                    className={`p-1 transition-colors flex-shrink-0 ${
                      pat.enabled ? 'text-emerald-400' : 'text-white/30'
                    }`}
                    title={pat.enabled ? 'Active (Click to disable)' : 'Disabled'}
                  >
                    {pat.enabled ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Tailored Action Banner */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/20 text-[11px] text-emerald-300/95 flex items-start gap-1.5 leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/40 font-mono text-[10px] uppercase block">
                      Aura's Tailored Adaptation:
                    </span>
                    {pat.tailoredAdaptation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: SYNTHESIZED RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider flex items-center justify-between">
              <span>Synthesized Heuristic Rules</span>
              <span>Feedback Loop Ingest</span>
            </div>

            {preferences.map((pref) => (
              <div
                key={pref.id}
                className={`p-3 rounded-xl border transition-all text-xs flex flex-col gap-2 ${
                  pref.enabled
                    ? 'bg-white/[0.03] border-white/10 hover:border-cyan-500/30'
                    : 'bg-white/[0.01] border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                        {pref.category}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        Confidence: {pref.confidence}%
                      </span>
                    </div>
                    <p className="text-white/90 font-medium leading-relaxed">{pref.rule}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onTogglePreference(pref.id)}
                      className={`p-1 transition-colors ${
                        pref.enabled ? 'text-cyan-400' : 'text-white/30'
                      }`}
                    >
                      {pref.enabled ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeletePreference(pref.id)}
                      className="p-1 text-white/30 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5 font-mono">
                  <span className="truncate max-w-[240px]">Source: {pref.source}</span>
                  <span>Updated: {pref.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: COGNITIVE PERFORMANCE TELEMETRY */}
        {activeTab === 'performance' && (
          <div className="h-full">
            <CognitivePerformanceChart metrics={metrics} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningDashboard;
