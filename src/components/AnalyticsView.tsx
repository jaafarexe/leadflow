import React from 'react';
import { Lead, STAGES, SOURCES } from '../types/crm';
import { formatCurrency, getStageConfig } from '../utils/formatters';
import { Trophy, Target, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';

interface AnalyticsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ leads, onSelectLead }) => {
  const totalLeads = leads.length;
  const totalValueAll = leads.reduce((sum, l) => sum + l.value, 0);

  const wonLeads = leads.filter((l) => l.stage === 'won');
  const wonValue = wonLeads.reduce((sum, l) => sum + l.value, 0);

  const lostLeads = leads.filter((l) => l.stage === 'lost');
  const lostValue = lostLeads.reduce((sum, l) => sum + l.value, 0);

  const activeLeads = leads.filter((l) => !['won', 'lost'].includes(l.stage));
  const activeValue = activeLeads.reduce((sum, l) => sum + l.value, 0);

  const closedCount = wonLeads.length + lostLeads.length;
  const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

  // Source breakdown
  const sourceStats = SOURCES.map((src) => {
    const matching = leads.filter((l) => l.source === src);
    const value = matching.reduce((sum, l) => sum + l.value, 0);
    return {
      source: src,
      count: matching.length,
      value,
      percentage: totalValueAll > 0 ? Math.round((value / totalValueAll) * 100) : 0,
    };
  }).sort((a, b) => b.value - a.value);

  // Top 5 active deals
  const topActiveDeals = [...activeLeads].sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Pipeline Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Pipeline
            </span>
            <Target className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {formatCurrency(activeValue)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Across {activeLeads.length} deals in negotiation, proposal & qualification
          </div>
        </div>

        {/* Closed Won Revenue Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Closed Won Revenue
            </span>
            <Trophy className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            {formatCurrency(wonValue)}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>{wonLeads.length} deals closed</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-emerald-700">{winRate}% win rate</span>
          </div>
        </div>

        {/* Closed Lost Revenue Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Closed Lost
            </span>
            <XCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-800 font-mono tabular-nums">
            {formatCurrency(lostValue)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {lostLeads.length} deals postponed or lost
          </div>
        </div>
      </div>

      {/* Stage Breakdown & Distribution */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Pipeline Stage Distribution</h3>
        <p className="text-xs text-slate-500 mb-5">
          Volume and dollar value allocation across the seven pipeline milestones.
        </p>

        <div className="space-y-4">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage.id);
            const stageVal = stageLeads.reduce((sum, l) => sum + l.value, 0);
            const percentage = totalValueAll > 0 ? (stageVal / totalValueAll) * 100 : 0;

            return (
              <div key={stage.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <span className={`h-2.5 w-2.5 rounded-full ${stage.dotColor}`} />
                    <span>{stage.label}</span>
                    <span className="text-slate-400 font-mono tabular-nums">
                      ({stageLeads.length} {stageLeads.length === 1 ? 'deal' : 'deals'})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="text-slate-500 text-[11px]">{percentage.toFixed(1)}%</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(stageVal)}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.dotColor} transition-all duration-300`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Top Active Deals & Channel Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Active Deals */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Highest Value Active Deals</h3>
          <p className="text-xs text-slate-500 mb-4">
            Priority high-ticket opportunities currently in pipeline.
          </p>

          <div className="divide-y divide-slate-100">
            {topActiveDeals.map((lead) => {
              const stageConfig = getStageConfig(lead.stage);

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
                >
                  <div className="overflow-hidden">
                    <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{lead.company}</span>
                      <ArrowUpRight className="h-3 w-3 text-slate-400" />
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {lead.name} · {lead.title}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold tabular-nums text-slate-900">
                      {formatCurrency(lead.value)}
                    </div>
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${stageConfig.badgeBg} ${stageConfig.badgeText}`}
                    >
                      {stageConfig.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Generation Sources */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Leads by Acquisition Source</h3>
          <p className="text-xs text-slate-500 mb-4">
            Total pipeline revenue attributed to each acquisition channel.
          </p>

          <div className="space-y-3">
            {sourceStats.map((item) => (
              <div key={item.source} className="flex items-center justify-between text-xs py-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">{item.source}</span>
                  <span className="text-slate-400 font-mono tabular-nums">
                    ({item.count})
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span className="text-slate-500 text-[11px]">{item.percentage}%</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
