import React, { useState } from 'react';
import { FeedbackRating } from '../types';
import { ThumbsUp, ThumbsDown, Star, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface FeedbackButtonsProps {
  messageId: string;
  existingFeedback?: FeedbackRating;
  onFeedbackSubmit: (messageId: string, feedback: FeedbackRating) => void;
  isAdapting?: boolean;
}

const POSITIVE_TAGS = ['Perfect Conciseness', 'Great Reasoning', 'Proactive Insight', 'Nuanced Tone', 'Code Quality'];
const CRITIQUE_TAGS = ['Too Verbose', 'Too Intrusive', 'Lacked Code Snippet', 'Too Formal', 'Missed Sarcasm', 'Need More Detail'];

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  messageId,
  existingFeedback,
  onFeedbackSubmit,
  isAdapting = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sentiment, setSentiment] = useState<'positive' | 'negative'>(existingFeedback?.rating || 'positive');
  const [stars, setStars] = useState<number>(existingFeedback?.stars || 5);
  const [selectedTags, setSelectedTags] = useState<string[]>(existingFeedback?.tags || []);
  const [correctionNote, setCorrectionNote] = useState<string>(existingFeedback?.correctionNote || '');
  const [submitted, setSubmitted] = useState<boolean>(!!existingFeedback);

  const handleQuickVote = (vote: 'positive' | 'negative') => {
    setSentiment(vote);
    const defaultStars = vote === 'positive' ? 5 : 2;
    setStars(defaultStars);
    setIsOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: FeedbackRating = {
      rating: sentiment,
      stars,
      tags: selectedTags,
      correctionNote: correctionNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    onFeedbackSubmit(messageId, payload);
    setSubmitted(true);
    setIsOpen(false);
  };

  return (
    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleQuickVote('positive')}
            className={`p-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1 ${
              submitted && sentiment === 'positive' ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/60'
            }`}
            title="Good response - refine future learning"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {submitted && sentiment === 'positive' && <span>{stars}★</span>}
          </button>
          <button
            onClick={() => handleQuickVote('negative')}
            className={`p-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1 ${
              submitted && sentiment === 'negative' ? 'text-rose-400 bg-rose-500/10' : 'text-white/60'
            }`}
            title="Needs improvement - teach Aura"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            {submitted && sentiment === 'negative' && <span>{stars}★</span>}
          </button>

          {submitted && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400/90 ml-1">
              <Check className="w-3 h-3" />
              <span>Learned</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 hover:text-white/90 transition-colors py-0.5 px-1.5 rounded bg-white/5 text-[11px]"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>{submitted ? 'Refine Learning' : 'Teach Aura'}</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded Teach Aura / Feedback Dialog */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-black/40 rounded-xl border border-white/15 flex flex-col gap-3 text-xs animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-white/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Personalized Learning Feedback
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setStars(val)}
                  className={`p-0.5 transition-colors ${
                    val <= stars ? 'text-amber-400' : 'text-white/20 hover:text-white/40'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div>
            <div className="text-[10px] text-white/50 mb-1 font-mono uppercase tracking-wider">
              {sentiment === 'positive' ? 'What worked well?' : 'What should Aura adapt?'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(sentiment === 'positive' ? POSITIVE_TAGS : CRITIQUE_TAGS).map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-0.5 rounded-full text-[11px] transition-all border ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-white/25'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explicit User Teaching Input */}
          <div>
            <label className="block text-[10px] text-white/50 mb-1 font-mono uppercase tracking-wider">
              Specific Rule or Instruction to Remember:
            </label>
            <input
              type="text"
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="e.g. In the future, prioritize bulleted executive summaries before code."
              className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 text-white/60 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdapting}
              className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-md shadow-cyan-900/40 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isAdapting ? 'Internalizing...' : 'Adapt & Save Rule'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FeedbackButtons;
