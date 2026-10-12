import React from 'react';
import { CognitiveState } from '../types';
import { Brain, Cpu, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

interface AvatarProps {
  state: CognitiveState;
  size?: 'sm' | 'md' | 'lg';
  activeTool?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  state,
  size = 'md',
  activeTool,
  onClick,
}) => {
  const getColors = () => {
    switch (state) {
      case 'reasoning':
        return {
          glow: 'rgba(168, 85, 247, 0.45)',
          core: 'from-purple-600 via-indigo-500 to-pink-500',
          ring: 'border-purple-400',
          label: 'Reasoning & Planning',
          pulseSpeed: 'animate-spin',
        };
      case 'executing_tool':
        return {
          glow: 'rgba(245, 158, 11, 0.45)',
          core: 'from-amber-500 via-orange-500 to-yellow-400',
          ring: 'border-amber-400',
          label: activeTool ? `Executing: ${activeTool}` : 'Autonomous Tool Action',
          pulseSpeed: 'animate-pulse',
        };
      case 'perceiving':
        return {
          glow: 'rgba(56, 189, 248, 0.45)',
          core: 'from-sky-400 via-cyan-500 to-blue-600',
          ring: 'border-cyan-300',
          label: 'Parsing Deep NLU Syntax',
          pulseSpeed: 'animate-ping',
        };
      case 'synthesizing':
        return {
          glow: 'rgba(14, 165, 233, 0.45)',
          core: 'from-cyan-400 via-blue-500 to-indigo-600',
          ring: 'border-blue-400',
          label: 'Synthesizing Response',
          pulseSpeed: 'animate-pulse',
        };
      case 'adapting_learning':
        return {
          glow: 'rgba(16, 185, 129, 0.45)',
          core: 'from-emerald-400 via-teal-500 to-green-600',
          ring: 'border-emerald-400',
          label: 'Self-Improving Adaptation Loop',
          pulseSpeed: 'animate-bounce',
        };
      case 'listening':
        return {
          glow: 'rgba(99, 102, 241, 0.5)',
          core: 'from-blue-500 via-indigo-600 to-purple-600',
          ring: 'border-indigo-400',
          label: 'Listening & Transcribing',
          pulseSpeed: 'animate-pulse',
        };
      case 'idle':
      default:
        return {
          glow: 'rgba(59, 130, 246, 0.25)',
          core: 'from-blue-600 via-indigo-700 to-cyan-700',
          ring: 'border-blue-500/40',
          label: 'Cognitive Nexus Idle',
          pulseSpeed: '',
        };
    }
  };

  const config = getColors();

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }[size];

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer group select-none"
      title={`${config.label} (Click for telemetry)`}
    >
      {/* Outer ambient glow halo */}
      <div
        className={`absolute rounded-full transition-all duration-700 blur-xl ${
          size === 'lg' ? 'w-36 h-36' : size === 'md' ? 'w-20 h-20' : 'w-12 h-12'
        }`}
        style={{ backgroundColor: config.glow }}
      />

      {/* Orbiting particles ring */}
      <div
        className={`absolute rounded-full border border-dashed transition-all duration-1000 ${
          size === 'lg' ? 'w-28 h-28' : size === 'md' ? 'w-16 h-16' : 'w-10 h-10'
        } ${config.ring} ${state === 'reasoning' || state === 'executing_tool' ? 'animate-spin' : 'opacity-40 animate-none'}`}
        style={{ animationDuration: '8s' }}
      />

      {/* Main Core Orb */}
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-tr ${config.core} p-0.5 shadow-xl shadow-black/40 relative flex items-center justify-center transition-all duration-500 overflow-hidden group-hover:scale-105`}
      >
        {/* Hologram sweep shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent pointer-events-none rounded-full" />
        
        {/* Inner neural icon */}
        <div className="w-full h-full rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white">
          {state === 'reasoning' ? (
            <Brain className={`${iconSizes} text-purple-200 animate-pulse`} />
          ) : state === 'executing_tool' ? (
            <Cpu className={`${iconSizes} text-amber-200 animate-spin`} />
          ) : state === 'adapting_learning' ? (
            <Zap className={`${iconSizes} text-emerald-200 animate-bounce`} />
          ) : state === 'perceiving' ? (
            <Activity className={`${iconSizes} text-cyan-200 animate-pulse`} />
          ) : (
            <Sparkles className={`${iconSizes} text-blue-200`} />
          )}
        </div>
      </div>

      {/* Live State indicator badge */}
      {size !== 'sm' && (
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              state === 'idle' ? 'bg-blue-400' : state === 'adapting_learning' ? 'bg-emerald-400' : 'bg-cyan-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[#0c102d] ${
              state === 'idle'
                ? 'bg-blue-500'
                : state === 'executing_tool'
                ? 'bg-amber-500'
                : state === 'adapting_learning'
                ? 'bg-emerald-500'
                : 'bg-cyan-500'
            }`}
          />
        </span>
      )}
    </div>
  );
};

export default Avatar;
