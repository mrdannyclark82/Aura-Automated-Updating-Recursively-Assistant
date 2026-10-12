import React from 'react';
import { Message, Role, FeedbackRating, IntentCategory } from '../types';
import ReactMarkdown from 'react-markdown';
import FeedbackButtons from './FeedbackButtons';
import NLUView from './NLUView';
import Sources from './Sources';
import TaskPlanner from './TaskPlanner';
import { Avatar } from './Avatar';
import {
  User,
  Volume2,
  Sparkles,
  Clock,
  Compass,
  FileEdit,
  Bug,
  GitBranch,
  Zap,
  HelpCircle,
  Cpu,
} from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  onFeedbackSubmit: (messageId: string, feedback: FeedbackRating) => void;
  onSpeakText?: (text: string) => void;
  isAdapting?: boolean;
}

function getIntentBadgeStyle(intent?: IntentCategory) {
  switch (intent) {
    case 'research':
      return {
        badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
        icon: <Compass className="w-3 h-3 text-sky-400" />,
        label: 'Research & Analysis',
      };
    case 'drafting':
      return {
        badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
        icon: <FileEdit className="w-3 h-3 text-purple-400" />,
        label: 'Drafting & Synthesis',
      };
    case 'debug':
      return {
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
        icon: <Bug className="w-3 h-3 text-amber-400" />,
        label: 'Debugging & Code Inspection',
      };
    case 'planning':
      return {
        badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
        icon: <GitBranch className="w-3 h-3 text-blue-400" />,
        label: 'Strategic Planning',
      };
    case 'task_execution':
      return {
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
        icon: <Zap className="w-3 h-3 text-emerald-400" />,
        label: 'Autonomous Task Execution',
      };
    case 'inquiry':
      return {
        badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-400/30',
        icon: <HelpCircle className="w-3 h-3 text-pink-400" />,
        label: 'Conceptual Inquiry',
      };
    case 'general':
    default:
      return {
        badgeClass: 'bg-white/10 text-white/70 border-white/20',
        icon: <Sparkles className="w-3 h-3 text-cyan-400" />,
        label: 'General Interaction',
      };
  }
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onFeedbackSubmit,
  onSpeakText,
  isAdapting = false,
}) => {
  const isUser = message.role === Role.USER;
  const intentConfig = isUser && message.primaryIntent ? getIntentBadgeStyle(message.primaryIntent) : null;

  return (
    <div
      className={`flex w-full items-start gap-3 my-4 animate-fade-in ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Model Avatar icon */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <Avatar state="idle" size="sm" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-2xl ${isUser ? 'items-end' : 'items-start'} w-full`}>
        {/* NLU Intent Badge for User Messages */}
        {isUser && intentConfig && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-medium shadow-sm backdrop-blur-sm transition-all ${intentConfig.badgeClass}`}
            >
              {intentConfig.icon}
              <span>intent: {intentConfig.label}</span>
              {message.nlu?.confidence && (
                <span className="opacity-70 text-[9px]">• {message.nlu.confidence}% conf</span>
              )}
            </span>
            {message.complexityScore !== undefined && (
              <span className="text-[10px] font-mono text-white/40">
                complexity: {message.complexityScore}%
              </span>
            )}
          </div>
        )}

        {/* Proactive Origin pill */}
        {message.proactiveOrigin && (
          <span className="mb-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Proactive Autonomous Alert</span>
          </span>
        )}

        {/* Model Engine Tag for Model Messages */}
        {!isUser && message.modelUsed && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium ${
                message.modelUsed === 'gemma-local'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>
                {message.modelUsed === 'gemma-local'
                  ? 'Local Gemma 2B (WebGPU)'
                  : 'Cloud Gemini 3.8 Flash'}
              </span>
            </span>
            {message.latencyMs !== undefined && (
              <span className="text-[10px] font-mono text-white/40 tabular-nums">
                {message.latencyMs}ms
              </span>
            )}
          </div>
        )}

        {/* Memory Grounding Pill */}
        {message.memorySources && message.memorySources.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1 px-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono bg-purple-500/15 text-purple-300 border-purple-500/30">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>Grounded in Memory: {message.memorySources.join(', ')}</span>
            </span>
          </div>
        )}

        <div
          className={`p-4 rounded-2xl w-full shadow-lg transition-all ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-blue-900/30 border border-blue-400/20'
              : 'bg-[#12183b]/90 text-white/90 rounded-bl-none border border-white/10 shadow-black/40 backdrop-blur-md'
          }`}
        >
          {/* Main Message Content */}
          <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
            {message.text ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              !isUser && (
                <div className="flex items-center gap-2 text-white/60 text-xs py-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Synthesizing response & executing tools...</span>
                </div>
              )
            )}
          </div>

          {/* Autonomous Task Plan if present */}
          {message.plan && <TaskPlanner plan={message.plan} />}

          {/* Tool execution logs if any */}
          {message.toolsUsed && message.toolsUsed.length > 0 && (
            <Sources tools={message.toolsUsed} />
          )}

          {/* Speech & Feedback actions for Model messages */}
          {!isUser && message.text && (
            <div className="flex flex-col mt-2">
              <div className="flex items-center justify-between text-xs text-white/40 pt-1">
                <span className="text-[10px] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-white/30" />
                  {message.timestamp}
                </span>

                {onSpeakText && (
                  <button
                    onClick={() => onSpeakText(message.text)}
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Speak</span>
                  </button>
                )}
              </div>

              {/* Personalized Learning Feedback Buttons */}
              <FeedbackButtons
                messageId={message.id}
                existingFeedback={message.feedback}
                onFeedbackSubmit={onFeedbackSubmit}
                isAdapting={isAdapting}
              />
            </div>
          )}
        </div>

        {/* Deep NLU Analysis for user queries */}
        {isUser && message.nlu && (
          <div className="w-full max-w-xl">
            <NLUView nlu={message.nlu} />
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mt-1 shadow-md shadow-indigo-900/40">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
