import React, { useState, useMemo } from 'react';
import { CognitiveMetricPoint, IntentCategory } from '../types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Line,
  ComposedChart,
} from 'recharts';
import {
  Activity,
  Zap,
  Clock,
  TrendingUp,
  Cpu,
  Compass,
  FileEdit,
  Bug,
  GitBranch,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface CognitivePerformanceChartProps {
  metrics: CognitiveMetricPoint[];
}

const INTENT_COLORS: Record<IntentCategory, string> = {
  research: '#38bdf8', // sky-400
  drafting: '#c084fc', // purple-400
  debug: '#fbbf24',    // amber-400
  planning: '#60a5fa', // blue-400
  task_execution: '#34d399', // emerald-400
  inquiry: '#f472b6',  // pink-400
  general: '#94a3b8',  // slate-400
};

export const CognitivePerformanceChart: React.FC<CognitivePerformanceChartProps> = ({
  metrics,
}) => {
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string>('all');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('all');

  // Filtered metrics
  const filteredMetrics = useMemo(() => {
    return metrics.filter((m) => {
      const matchesIntent =
        selectedIntentFilter === 'all' || m.intent === selectedIntentFilter;
      const matchesModel =
        selectedModelFilter === 'all' || m.modelUsed === selectedModelFilter;
      return matchesIntent && matchesModel;
    });
  }, [metrics, selectedIntentFilter, selectedModelFilter]);

  // Summary statistics & linear regression
  const stats = useMemo(() => {
    if (filteredMetrics.length === 0) {
      return {
        avgLatency: 0,
        avgComplexity: 0,
        trendSlope: 0,
        minLatency: 0,
        maxLatency: 0,
        trendlinePoints: [] as { x: number; y: number }[],
      };
    }

    const n = filteredMetrics.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let minLat = Infinity;
    let maxLat = -Infinity;

    filteredMetrics.forEach((item) => {
      const x = item.complexityScore;
      const y = item.latencyMs;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
      if (y < minLat) minLat = y;
      if (y > maxLat) maxLat = y;
    });

    const avgComplexity = Math.round(sumX / n);
    const avgLatency = Math.round(sumY / n);

    const denom = n * sumXX - sumX * sumX;
    const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
    const intercept = (sumY - slope * sumX) / n;

    // Build trendline coordinates spanning x=10 to x=95
    const trendlinePoints = [
      { x: 10, y: Math.max(120, Math.round(slope * 10 + intercept)) },
      { x: 50, y: Math.max(120, Math.round(slope * 50 + intercept)) },
      { x: 95, y: Math.max(120, Math.round(slope * 95 + intercept)) },
    ];

    return {
      avgLatency,
      avgComplexity,
      trendSlope: Math.round(slope * 10) / 10,
      minLatency: minLat === Infinity ? 0 : minLat,
      maxLatency: maxLat === -Infinity ? 0 : maxLat,
      trendlinePoints,
    };
  }, [filteredMetrics]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono">
            <span>Avg Processing Time</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-300 mt-1 tabular-nums">
            {stats.avgLatency}
            <span className="text-xs font-normal text-white/40 ml-1">ms</span>
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">
            Range: {stats.minLatency} - {stats.maxLatency}ms
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono">
            <span>Avg Complexity</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-300 mt-1 tabular-nums">
            {stats.avgComplexity}
            <span className="text-xs font-normal text-white/40 ml-1">/ 100</span>
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">Syntactic & semantic load</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono">
            <span>Complexity Scaling</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-300 mt-1 tabular-nums">
            +{stats.trendSlope}
            <span className="text-xs font-normal text-white/40 ml-1">ms/pt</span>
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">Regression trend gradient</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-mono">
            <span>Interactions Tracked</span>
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 mt-1 tabular-nums">
            {filteredMetrics.length}
            <span className="text-xs font-normal text-white/40 ml-1">turns</span>
          </div>
          <div className="text-[10px] text-white/40 mt-0.5">Last 20 conversation cycles</div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/40 uppercase font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Intent:
          </span>
          {(['all', 'research', 'drafting', 'debug', 'planning', 'task_execution'] as const).map(
            (intent) => (
              <button
                key={intent}
                onClick={() => setSelectedIntentFilter(intent)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                  selectedIntentFilter === intent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {intent === 'all' ? 'All Intents' : intent.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/40 uppercase font-mono">Engine:</span>
          <button
            onClick={() => setSelectedModelFilter('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
              selectedModelFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedModelFilter('gemini-3.8-flash')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
              selectedModelFilter === 'gemini-3.8-flash'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Cloud Gemini
          </button>
          <button
            onClick={() => setSelectedModelFilter('gemma-local')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
              selectedModelFilter === 'gemma-local'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Local Gemma
          </button>
        </div>
      </div>

      {/* Main Scatter Chart Card */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col space-y-2">
        <div className="flex items-center justify-between pb-1">
          <div>
            <h4 className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
              <span>Cognitive Processing Latency vs Task Complexity</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                Scatter + Regression
              </span>
            </h4>
            <p className="text-[11px] text-white/50">
              Each point represents one conversation turn. Latency (ms) plotted against syntax and tool complexity (0–100).
            </p>
          </div>

          {/* Legend dots */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Research
            </span>
            <span className="flex items-center gap-1 text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> Drafting
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Debug
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Task
            </span>
          </div>
        </div>

        {filteredMetrics.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-white/40 text-xs">
            <Activity className="w-8 h-8 mb-2 opacity-30 animate-pulse" />
            <span>No interaction data matching filters yet.</span>
            <span className="text-[11px] opacity-70 mt-1">Send a message to populate performance telemetry.</span>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 25, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  type="number"
                  dataKey="complexityScore"
                  name="Task Complexity"
                  domain={[0, 100]}
                  unit="%"
                  stroke="#ffffff40"
                  tick={{ fontSize: 10, fill: '#ffffff60' }}
                  label={{
                    value: 'Task Complexity Score (0 - 100)',
                    position: 'insideBottom',
                    offset: -12,
                    fill: '#ffffff50',
                    fontSize: 10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="latencyMs"
                  name="Processing Latency"
                  unit="ms"
                  stroke="#ffffff40"
                  tick={{ fontSize: 10, fill: '#ffffff60' }}
                  label={{
                    value: 'Processing Time (ms)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#ffffff50',
                    fontSize: 10,
                  }}
                />
                <ZAxis range={[70, 70]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: '#38bdf880' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as CognitiveMetricPoint;
                      const color = INTENT_COLORS[data.intent] || '#38bdf8';
                      return (
                        <div className="p-3 bg-[#0c102e]/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl text-xs space-y-1.5 max-w-xs animate-fade-in">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1">
                            <span
                              className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border"
                              style={{
                                color,
                                borderColor: `${color}40`,
                                backgroundColor: `${color}15`,
                              }}
                            >
                              {data.intent}
                            </span>
                            <span className="text-[10px] text-white/40 font-mono">
                              {data.timestamp}
                            </span>
                          </div>

                          <p className="text-white/90 text-xs font-medium italic line-clamp-2">
                            "{data.querySnippet}"
                          </p>

                          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                            <div>
                              <span className="text-white/40 block text-[9px] uppercase">
                                Latency
                              </span>
                              <span className="text-cyan-300 font-bold tabular-nums">
                                {data.latencyMs} ms
                              </span>
                            </div>
                            <div>
                              <span className="text-white/40 block text-[9px] uppercase">
                                Complexity
                              </span>
                              <span className="text-emerald-300 font-bold tabular-nums">
                                {data.complexityScore} / 100
                              </span>
                            </div>
                          </div>

                          <div className="pt-1 border-t border-white/10 text-[10px] text-white/50 flex items-center justify-between">
                            <span>Engine:</span>
                            <span className="text-white/80 font-mono">
                              {data.modelUsed === 'gemma-local'
                                ? 'Local Gemma (WebGPU)'
                                : 'Gemini 3.8 Flash'}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Cognitive Turns" data={filteredMetrics}>
                  {filteredMetrics.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={INTENT_COLORS[entry.intent] || '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all hover:scale-125"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Telemetry Log Table */}
      <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white/80">Interaction Telemetry History</span>
          <span className="text-[10px] text-white/40 font-mono">Last 20 turns</span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {filteredMetrics.slice(-6).reverse().map((m) => (
            <div
              key={m.id}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 text-xs flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: INTENT_COLORS[m.intent] || '#38bdf8' }}
                />
                <span className="text-[11px] font-mono text-white/50 uppercase flex-shrink-0">
                  [{m.intent}]
                </span>
                <span className="text-white/80 truncate text-[11px]">
                  {m.querySnippet}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono flex-shrink-0">
                <span className="text-cyan-300 tabular-nums font-semibold">
                  {m.latencyMs}ms
                </span>
                <span className="text-emerald-300 tabular-nums">
                  {m.complexityScore}%
                </span>
                <span className="text-white/40">
                  {m.modelUsed === 'gemma-local' ? 'Gemma' : 'Gemini'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CognitivePerformanceChart;
