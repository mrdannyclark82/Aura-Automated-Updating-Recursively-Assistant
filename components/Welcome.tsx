import React from 'react';
import {
  Sparkles,
  Brain,
  Zap,
  Clock,
  ShieldCheck,
  Compass,
  ArrowRight,
  ListTodo,
  FileEdit,
  Bug,
  Cpu,
  Database,
} from 'lucide-react';
import Avatar from './Avatar';

interface WelcomeProps {
  onSelectPrompt: (prompt: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onSelectPrompt }) => {
  const promptExamples = [
    {
      intentLabel: 'research',
      icon: <Database className="w-4 h-4 text-cyan-400" />,
      title: 'Ground in Uploaded Memory',
      prompt: 'Check our uploaded Engineering Architecture Guidelines memory document and summarize our runtime specs, model engine strategy, and response standards.',
      badge: 'Memory Grounded',
    },
    {
      intentLabel: 'drafting',
      icon: <FileEdit className="w-4 h-4 text-purple-400" />,
      title: 'Draft Executive Compute Memo',
      prompt: 'Draft an executive compute budget memo for Elena Rostova using our BLUF communication SOP memory standards.',
      badge: 'Intent: drafting',
    },
    {
      intentLabel: 'debug',
      icon: <Bug className="w-4 h-4 text-amber-400" />,
      title: 'Debug Token Refresh Interceptor',
      prompt: 'Debug the Jest mock token refresh interceptor assertion for Marcus on PR #142 and propose a working code patch.',
      badge: 'Intent: debug',
    },
    {
      intentLabel: 'task_execution',
      icon: <ListTodo className="w-4 h-4 text-emerald-400" />,
      title: 'Proactive Task & Deadline Radar',
      prompt: 'Scan my calendar, communication signals, and stated goals. What deadlines are approaching today and can you assist?',
      badge: 'Intent: task',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[460px] text-center text-white/80 px-4 py-8 animate-fade-in max-w-2xl mx-auto">
      {/* Central Visual Cognitive Core */}
      <div className="mb-5">
        <Avatar state="idle" size="lg" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300">
        Aura Autonomous Assistant
      </h2>
      <p className="max-w-lg mb-6 text-sm text-white/60 leading-relaxed">
        State-of-the-art virtual assistant with proactive task prediction, goal & deadline radar, NLU intent classification, WebGPU Local Gemma fallback, and interactive Cognitive Performance analytics.
      </p>

      {/* Grid of Interactive Starter Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {promptExamples.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group flex flex-col justify-between text-left shadow-lg hover:shadow-cyan-950/40 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                  {item.icon}
                  {item.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/5 border border-white/10 text-white/60">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors line-clamp-2 leading-relaxed">
                "{item.prompt}"
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-end text-[11px] text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>Try prompt</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
