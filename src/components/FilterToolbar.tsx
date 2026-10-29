import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { LeadStage, Priority, LeadSource, STAGES, SOURCES, PRIORITIES } from '../types/crm';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStage: LeadStage | 'all';
  onStageChange: (stage: LeadStage | 'all') => void;
  selectedPriority: Priority | 'all';
  onPriorityChange: (priority: Priority | 'all') => void;
  selectedSource: LeadSource | 'all';
  onSourceChange: (source: LeadSource | 'all') => void;
  totalFilteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStage,
  onStageChange,
  selectedPriority,
  onPriorityChange,
  selectedSource,
  onSourceChange,
  totalFilteredCount,
  totalCount,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedStage !== 'all' ||
    selectedPriority !== 'all' ||
    selectedSource !== 'all';

  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 bg-slate-50/70">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by contact name, company or title..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* Stage Filter */}
        <select
          value={selectedStage}
          onChange={(e) => onStageChange(e.target.value as LeadStage | 'all')}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-slate-900 focus:outline-none"
        >
          <option value="all">All Stages</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-slate-900 focus:outline-none"
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value as LeadSource | 'all')}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-slate-900 focus:outline-none"
        >
          <option value="all">All Sources</option>
          {SOURCES.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>

        {/* Reset / Result Count */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 transition-colors"
          >
            <X className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}

        <div className="text-xs text-slate-400 font-mono tabular-nums pl-1">
          {totalFilteredCount} of {totalCount} leads
        </div>
      </div>
    </div>
  );
};
