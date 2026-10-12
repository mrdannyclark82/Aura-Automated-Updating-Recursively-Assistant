import React from 'react';
import { ProactiveSettings, LearnedPreference } from '../types';
import { X, Sliders, Shield, Volume2, Trash2, Cpu, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProactiveSettings;
  onUpdateSettings: (newSettings: ProactiveSettings) => void;
  onClearHistory: () => void;
  onResetPreferences: () => void;
  voiceEnabled: boolean;
  onToggleVoice: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearHistory,
  onResetPreferences,
  voiceEnabled,
  onToggleVoice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0c102d] border border-white/15 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm">Aura Configuration & Autonomous Engine</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* AI Model Architecture */}
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-semibold text-white/90">Cognitive Neural Engine</div>
                <div className="text-[11px] text-white/50">Gemini 3.8 Flash • SOTA Latency & Reasoning</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              ACTIVE
            </span>
          </div>

          {/* Voice Response */}
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="font-semibold text-white/90">Voice Speech Synthesis</div>
                <div className="text-[11px] text-white/50">Speak responses autonomously upon completion</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => onToggleVoice(e.target.checked)}
              className="rounded text-cyan-500 focus:ring-0 w-4 h-4"
            />
          </div>

          {/* Proactive Intrusiveness */}
          <div className="space-y-2">
            <label className="font-semibold text-cyan-300 block">Proactive Suggestions Intrusiveness</label>
            <div className="grid grid-cols-3 gap-2">
              {(['subtle', 'balanced', 'assertive'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onUpdateSettings({ ...settings, intrusiveness: lvl })}
                  className={`py-2 px-2 rounded-lg border text-center capitalize font-medium ${
                    settings.intrusiveness === lvl
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Dangerous / Reset Actions */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="font-semibold text-white/80">Memory & Storage Management</div>
            <div className="flex items-center justify-between py-1">
              <span className="text-white/60">Reset conversation history</span>
              <button
                onClick={onClearHistory}
                className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Chat</span>
              </button>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-white/60">Reset learned personalization rules</span>
              <button
                onClick={onResetPreferences}
                className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Rules</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
