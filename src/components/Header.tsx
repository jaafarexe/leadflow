import React from 'react';
import { Plus, Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentTab: 'pipeline' | 'contacts' | 'analytics';
  onSelectTab: (tab: 'pipeline' | 'contacts' | 'analytics') => void;
  onOpenNewLeadModal: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewLeadModal,
  onExportCsv,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
            <span className="font-bold text-sm tracking-tight">LF</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            LeadFlow CRM
          </span>
        </div>

        {/* Zone 2: Navigation Links (1-2 word single-line controls) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('pipeline')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'pipeline'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Pipeline
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('contacts')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'contacts'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Contacts
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('analytics')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'analytics'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Analytics
          </button>
        </nav>

        {/* Zone 3: Primary action & quick utility controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportCsv}
            title="Export leads to CSV"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onResetData}
            title="Reset to sample data"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewLeadModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <Plus className="h-4 w-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>
    </header>
  );
};
