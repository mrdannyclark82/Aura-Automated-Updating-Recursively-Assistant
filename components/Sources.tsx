import React, { useState } from 'react';
import { ToolExecutionRecord } from '../types';
import { Terminal, ChevronDown, ChevronUp, Cpu, CheckCircle } from 'lucide-react';

interface SourcesProps {
  tools: ToolExecutionRecord[];
}

export const Sources: React.FC<SourcesProps> = ({ tools }) => {
  const [expanded, setExpanded] = useState(false);

  if (!tools || tools.length === 0) return null;

  return (
    <div className="mt-2 text-xs border border-white/10 rounded-xl overflow-hidden bg-black/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-1.5 flex items-center justify-between text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300/90">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span>Autonomous Tool Invocations ({tools.length})</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <span>{expanded ? 'Hide Logs' : 'View Operations'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      {expanded && (
        <div className="p-3 border-t border-white/10 space-y-2 bg-black/50 font-mono text-[11px]">
          {tools.map((t, idx) => (
            <div key={idx} className="p-2 rounded bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-cyan-300">
                <span className="font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {t.toolName}
                </span>
                <span className="text-[10px] text-white/40">{t.durationMs ? `${t.durationMs}ms` : t.timestamp}</span>
              </div>
              <div className="text-[10px] text-white/50">
                <span className="text-white/30">Args:</span> {JSON.stringify(t.inputArgs)}
              </div>
              <pre className="text-[10px] text-white/70 overflow-x-auto whitespace-pre-wrap max-h-24 bg-black/40 p-1.5 rounded">
                {t.outputSnippet}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sources;
