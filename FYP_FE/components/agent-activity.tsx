'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { ChevronDown, ChevronRight, Loader2, CheckCircle2, Clock, Zap } from 'lucide-react';

interface AgentStatus {
  name: string;
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

const AGENT_ICONS: Record<string, string> = {
  get_Flights: '✈️',
  get_hotels: '🏨',
  get_weather: '🌤️',
  get_currency: '💱',
  get_locations: '📍',
};

export function AgentActivity() {
  const { messages } = useAppSelector((state) => state.chat);
  const [expanded, setExpanded] = useState(false);

  const lastAgentMsg = [...messages]
    .reverse()
    .find((m: any) => m.type === 'agent_status');

  if (!lastAgentMsg) return null;

  const agents: AgentStatus[] = lastAgentMsg.text?.agents || [];
  if (agents.length === 0) return null;

  const allDone = agents.every((a) => a.status === 'done');
  const doneCount = agents.filter((a) => a.status === 'done').length;
  const runningAgent = agents.find((a) => a.status === 'running');

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
      allDone
        ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10'
        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80'
    } shadow-sm`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {allDone ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : runningAgent ? (
            <Loader2 className="w-4 h-4 text-[hsl(var(--brand))] animate-spin" />
          ) : (
            <Zap className="w-4 h-4 text-[hsl(var(--brand))]" />
          )}
          <span className={`text-sm font-medium ${
            allDone
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-slate-700 dark:text-slate-200'
          }`}>
            {allDone
              ? `All ${agents.length} agents completed`
              : runningAgent
              ? `Running ${runningAgent.label}...`
              : `Preparing ${agents.length} agents`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 tabular-nums">{doneCount}/{agents.length}</span>
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3 grid grid-cols-5 gap-2">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg transition-colors ${
                agent.status === 'done'
                  ? 'bg-emerald-50 dark:bg-emerald-900/20'
                  : agent.status === 'running'
                  ? 'bg-[hsl(var(--brand))]/5'
                  : 'bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              <span className="text-base">{AGENT_ICONS[agent.name] || '⚡'}</span>
              <span className={`text-[10px] font-medium text-center leading-tight ${
                agent.status === 'done'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : agent.status === 'running'
                  ? 'text-[hsl(var(--brand))]'
                  : 'text-slate-400 dark:text-slate-500'
              }`}>
                {agent.label}
              </span>
              {agent.status === 'done' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : agent.status === 'running' ? (
                <Loader2 className="w-3 h-3 text-[hsl(var(--brand))] animate-spin" />
              ) : (
                <Clock className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
