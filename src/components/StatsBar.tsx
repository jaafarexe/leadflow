import React from 'react';
import { Lead } from '../types/crm';
import { formatCurrency } from '../utils/formatters';

interface StatsBarProps {
  leads: Lead[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ leads }) => {
  const totalLeads = leads.length;

  // Active pipeline stages (excluding won and lost)
  const activeStages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation'];
  const activeLeads = leads.filter((l) => activeStages.includes(l.stage));
  const pipelineValue = activeLeads.reduce((acc, curr) => acc + curr.value, 0);

  const wonLeads = leads.filter((l) => l.stage === 'won');
  const wonCount = wonLeads.length;
  const wonRevenue = wonLeads.reduce((acc, curr) => acc + curr.value, 0);

  const lostLeads = leads.filter((l) => l.stage === 'lost');
  const closedCount = wonCount + lostLeads.length;
  const winRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;

  const avgDealSize = totalLeads > 0 ? Math.round(leads.reduce((sum, l) => sum + l.value, 0) / totalLeads) : 0;

  return (
    <section aria-label="Pipeline KPI Summary" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          {/* Metric 1: Total Leads */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Leads
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {totalLeads}
              </span>
              <span className="text-xs text-slate-500">
                ({activeLeads.length} active)
              </span>
            </div>
          </div>

          {/* Metric 2: Active Pipeline Value */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Pipeline Value
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {formatCurrency(pipelineValue)}
              </span>
            </div>
          </div>

          {/* Metric 3: Deals Won & Won Revenue */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Deals Won
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
                {wonCount}
              </span>
              <span className="text-xs font-mono tabular-nums text-slate-600">
                · {formatCurrency(wonRevenue)}
              </span>
            </div>
          </div>

          {/* Metric 4: Win Rate & Avg Deal Size */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Win Rate & Avg Deal
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {winRate}%
              </span>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                · avg {formatCurrency(avgDealSize)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
