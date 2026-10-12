import React, { useState } from 'react';
import { LearnedPreference, InteractionPattern, UserGoal, UploadedMemory } from '../types';
import { buildSystemInstruction } from '../services/geminiService';
import { Code, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface SystemPromptDisplayProps {
  preferences: LearnedPreference[];
  patterns?: InteractionPattern[];
  goals?: UserGoal[];
  memories?: UploadedMemory[];
}

export const SystemPromptDisplay: React.FC<SystemPromptDisplayProps> = ({
  preferences,
  patterns = [],
  goals = [],
  memories = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptText = buildSystemInstruction(preferences, patterns, goals, memories);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs text-white/50 hover:text-white/80 py-1.5 flex items-center justify-center gap-1.5 transition-colors font-mono"
      >
        {isOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        <span>{isOpen ? 'Hide Cognitive System Prompt' : 'Inspect Dynamic System Instructions & Learned Injections'}</span>
      </button>

      {isOpen && (
        <div className="mt-2 p-3 bg-black/60 border border-white/10 rounded-xl text-left text-xs text-white/70 animate-fade-in relative font-mono">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Code className="w-3.5 h-3.5" />
              Dynamic System Instructions with Active Injections
            </span>
            <button
              onClick={handleCopy}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed text-white/80">
            {promptText}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SystemPromptDisplay;
