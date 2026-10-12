import React from 'react';
import { TaskPlan, TaskPlanStep } from '../types';
import { CheckCircle2, Circle, Clock, Loader2, PlayCircle, ShieldCheck, Zap } from 'lucide-react';

interface TaskPlannerProps {
  plan: TaskPlan;
  onExecuteStep?: (stepId: string) => void;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({ plan }) => {
  return (
    <div className="my-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 backdrop-blur-md text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Autonomous Action Plan</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[10px] font-mono capitalize">
          {plan.status}
        </span>
      </div>

      <div className="text-white/80 font-medium mb-1">
        Goal: <span className="text-white/95">{plan.goal}</span>
      </div>
      <div className="text-[11px] text-white/50 mb-3 italic">
        {plan.rationale}
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {plan.steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isRunning = step.status === 'in_progress';

          return (
            <div
              key={step.id || idx}
              className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-white/90'
                  : isRunning
                  ? 'bg-purple-900/30 border-purple-400 text-white shadow-md shadow-purple-900/30 animate-pulse'
                  : 'bg-white/[0.02] border-white/5 text-white/60'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isRunning ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-white/30" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white/90">
                    Step {step.stepNumber}: {step.title}
                  </span>
                  {step.toolRequired && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[9px] border border-blue-500/30">
                      Tool: {step.toolRequired}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/65 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskPlanner;
