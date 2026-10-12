import React, { useState } from 'react';
import { NLUAnalysis } from '../types';
import {
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Layers,
  GitBranch,
  Smile,
  Compass,
  Link2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface NLUViewProps {
  nlu: NLUAnalysis;
}

export const NLUView: React.FC<NLUViewProps> = ({ nlu }) => {
  const [expanded, setExpanded] = useState(false);

  const hasIdioms = nlu.idioms && nlu.idioms.length > 0;
  const isSarcastic = nlu.sarcasm && nlu.sarcasm.detected;
  const hasSubClauses = nlu.syntax?.subordinateClauses && nlu.syntax.subordinateClauses.length > 0;
  const hasContingencies = nlu.syntax?.contingencies && nlu.syntax.contingencies.length > 0;
  const hasSubIntents = nlu.subIntents && nlu.subIntents.length > 0;
  const hasCoRefs = nlu.contextReferences && nlu.contextReferences.length > 0;
  const hasNuances = nlu.nuance;

  return (
    <div className="mt-2 text-xs border border-cyan-500/25 rounded-xl overflow-hidden bg-[#090e29]/80 backdrop-blur-md shadow-lg shadow-black/40">
      {/* Summary Header Pill */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2 flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-cyan-300 font-medium">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Advanced NLU</span>
          </span>

          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
            {nlu.intent} ({nlu.confidence}%)
          </span>

          {hasNuances && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Accuracy Guard: {100 - (nlu.nuance.misinterpretationRisk || 5)}%
            </span>
          )}

          {isSarcastic && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Sarcasm Polarity ({nlu.sarcasm.score}%)
            </span>
          )}

          {hasIdioms && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {nlu.idioms.length} Idiom Resolved
            </span>
          )}

          {hasContingencies && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-blue-400" />
              Contingency Branch
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-white/40 hover:text-white/80">
          <span className="text-[10px] hidden sm:inline">{expanded ? 'Collapse' : 'Deep NLU Tree'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Deep Dive Details */}
      {expanded && (
        <div className="p-3.5 border-t border-cyan-500/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-white/80 animate-fade-in bg-black/40">
          {/* Syntax & Sentence Structure */}
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-cyan-300 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Syntactic Structure & Clause Deconstruction
              </span>
              <span className="font-mono text-[10px] text-white/50">
                Complexity: {nlu.syntax?.complexityScore || 50}/100
              </span>
            </div>

            <div className="text-[11px] text-white/70 space-y-1.5">
              <div>
                <span className="text-white/40 font-mono text-[10px] uppercase">Type:</span>{' '}
                <span className="font-medium text-white/90 capitalize">{nlu.syntax?.sentenceType}</span>
              </div>
              {nlu.syntax?.mainClauses && (
                <div>
                  <span className="text-white/40 font-mono text-[10px] uppercase">Main Clause:</span>{' '}
                  <span className="italic text-white/85 font-mono text-[10px]">
                    "{nlu.syntax.mainClauses.join('; ')}"
                  </span>
                </div>
              )}
              {hasSubClauses && (
                <div>
                  <span className="text-white/40 font-mono text-[10px] uppercase">Subordinate Clauses:</span>
                  <ul className="list-disc list-inside text-[10px] text-white/70">
                    {nlu.syntax.subordinateClauses.map((sc, i) => (
                      <li key={i} className="font-mono">{sc}</li>
                    ))}
                  </ul>
                </div>
              )}
              {hasSubIntents && (
                <div>
                  <span className="text-white/40 font-mono text-[10px] uppercase">Sub-Intents Extracted:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {nlu.subIntents.map((si, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-200 text-[10px] font-mono border border-cyan-500/20">
                        {si}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {nlu.syntax?.temporalAnchors && nlu.syntax.temporalAnchors.length > 0 && (
                <div>
                  <span className="text-white/40 font-mono text-[10px] uppercase">Temporal Anchors:</span>
                  <span className="text-amber-300 font-mono text-[10px] ml-1">
                    {nlu.syntax.temporalAnchors.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contextual Nuance & Ambiguity Guard */}
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Contextual Nuance & Ambiguity Guard
              </span>
              <span className="font-mono text-[10px] text-emerald-400">
                Risk: {nlu.nuance?.misinterpretationRisk || 5}%
              </span>
            </div>

            <div className="text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white/40 font-mono text-[10px] uppercase">Latent Urgency:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  nlu.nuance?.latentUrgency === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : nlu.nuance?.latentUrgency === 'moderate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/10 text-emerald-300'
                }`}>
                  {nlu.nuance?.latentUrgency || 'moderate'}
                </span>
              </div>

              <div>
                <span className="text-white/40 font-mono text-[10px] uppercase">Emotional Tone:</span>{' '}
                <span className="text-white/80 italic text-[10px]">{nlu.nuance?.emotionalUndertone || nlu.sentiment.emotionalTone}</span>
              </div>

              {nlu.nuance?.implicitAssumptions && nlu.nuance.implicitAssumptions.length > 0 && (
                <div>
                  <span className="text-white/40 font-mono text-[10px] uppercase">Implicit Assumptions:</span>
                  <div className="text-[10px] text-white/60 space-y-0.5 mt-0.5">
                    {nlu.nuance.implicitAssumptions.map((ia, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                        <span>{ia}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nlu.nuance?.ambiguityResolved && nlu.nuance.ambiguityResolved.length > 0 && (
                <div>
                  <span className="text-white/40 font-mono text-[10px] uppercase">Disambiguated:</span>
                  <div className="text-[10px] text-cyan-300 font-mono">
                    {nlu.nuance.ambiguityResolved.join('; ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contingency Clause Branching Tree */}
          {hasContingencies && (
            <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 flex flex-col gap-1.5 md:col-span-2">
              <div className="flex items-center gap-1 text-blue-300 text-[11px] font-semibold">
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                Contingency Logic & Branching Tree
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {nlu.syntax.contingencies.map((ctg, idx) => (
                  <div key={idx} className="p-2 rounded bg-black/40 border border-blue-500/30 text-[10px] space-y-1">
                    <div className="flex items-center gap-1 text-amber-300 font-mono font-medium">
                      <span>Condition:</span>
                      <span className="text-white/90">"{ctg.condition}"</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-300 font-mono">
                      <span>Primary Action:</span>
                      <span className="text-white/80">{ctg.primaryAction}</span>
                    </div>
                    {ctg.fallbackAction && (
                      <div className="flex items-center gap-1 text-purple-300 font-mono">
                        <span>Fallback:</span>
                        <span className="text-white/80">{ctg.fallbackAction}</span>
                      </div>
                    )}
                    {ctg.temporalConstraint && (
                      <div className="text-white/40 font-mono text-[9px]">
                        Constraint: {ctg.temporalConstraint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Idiomatic Expressions & Figurative Pragmatics Resolver */}
          {hasIdioms && (
            <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 flex flex-col gap-1.5 md:col-span-2">
              <div className="flex items-center justify-between text-purple-300 text-[11px] font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Idiomatic Expressions & Pragmatic Intent Resolution
                </span>
                <span className="text-[10px] text-white/40 font-mono">Zero Literal Misinterpretation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {nlu.idioms.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-black/40 border border-purple-500/30 text-[10px] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-200 font-mono text-[11px]">
                        "{item.expression}"
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                        Idiom
                      </span>
                    </div>
                    <div className="text-white/50 text-[10px]">
                      <span className="text-white/35 font-mono">Literal:</span> {item.literalMeaning || 'Direct word-by-word meaning'}
                    </div>
                    <div className="text-cyan-300 text-[10px]">
                      <span className="text-white/35 font-mono">Semantic Intent:</span> {item.intendedMeaning}
                    </div>
                    <div className="text-emerald-300 font-medium text-[10px] pt-1 border-t border-white/5 flex items-start gap-1">
                      <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <span className="text-white/40 font-mono">Aura Pragmatic Action:</span> {item.pragmaticAction || item.intendedMeaning}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-turn Context & Co-reference Resolution */}
          {hasCoRefs && (
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1.5 md:col-span-2">
              <div className="flex items-center gap-1 text-blue-300 text-[11px] font-semibold">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                Multi-Turn Context & Co-Reference Resolution
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {nlu.contextReferences.map((ref, idx) => (
                  <div key={idx} className="px-2 py-1 rounded bg-blue-950/40 border border-blue-500/20 text-[10px] flex items-center gap-1.5 font-mono">
                    <span className="text-amber-300">"{ref.surfaceForm}"</span>
                    <span className="text-white/40">➔</span>
                    <span className="text-emerald-300 font-medium">"{ref.resolvedEntity}"</span>
                    <span className="text-white/30 text-[9px]">({ref.turnDistance} turn back)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NLUView;
