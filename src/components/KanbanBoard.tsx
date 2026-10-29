import React, { useState } from 'react';
import { Lead, LeadStage, STAGES } from '../types/crm';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Building2, ChevronRight, Plus } from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  onMoveLeadStage: (leadId: string, newStage: LeadStage) => void;
  onSelectLead: (lead: Lead) => void;
  onOpenNewLeadWithStage?: (stage: LeadStage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onMoveLeadStage,
  onSelectLead,
  onOpenNewLeadWithStage,
}) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);
  const [mobileActiveStage, setMobileActiveStage] = useState<LeadStage>('new');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stageId: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, stageId: LeadStage) => {
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      onMoveLeadStage(leadId, targetStage);
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  // Stage advance helper for quick action
  const getNextStage = (currentStage: LeadStage): LeadStage | null => {
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
    if (currentIndex >= 0 && currentIndex < STAGES.length - 2) {
      // Won is index 5, Lost is index 6. Progress sequentially until negotiation -> won
      return STAGES[currentIndex + 1].id;
    }
    if (currentStage === 'negotiation') {
      return 'won';
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Stage Selector Tabs (Hidden on Desktop) */}
      <div className="flex xl:hidden overflow-x-auto pb-2 gap-1 border-b border-slate-200 no-scrollbar">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.value, 0);
          const isActive = mobileActiveStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setMobileActiveStage(stage.id)}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{stage.label}</span>
              <span
                className={`font-mono tabular-nums text-xs ${
                  isActive ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                ({stageLeads.length})
              </span>
              <span
                className={`font-mono tabular-nums text-xs ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {formatCurrency(stageTotal)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-3 items-start min-h-[600px]">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage.id);
          const totalValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
          const isOver = dragOverStage === stage.id;
          const isHiddenOnMobile = mobileActiveStage !== stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`flex flex-col rounded-xl border bg-slate-100/70 p-2.5 transition-colors duration-150 min-h-[480px] ${
                isOver
                  ? 'border-slate-900/50 bg-slate-200/80 ring-2 ring-slate-900/10'
                  : 'border-slate-200/80'
              } ${isHiddenOnMobile ? 'hidden xl:flex' : 'flex'}`}
            >
              {/* Column Header */}
              <div className="mb-2.5 flex items-center justify-between px-1.5 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    {stage.label}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="font-mono text-xs tabular-nums font-semibold text-slate-700">
                  {formatCurrency(totalValue)}
                </div>
              </div>

              {/* Quick Add Button on Column */}
              {onOpenNewLeadWithStage && (
                <button
                  type="button"
                  onClick={() => onOpenNewLeadWithStage(stage.id)}
                  className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white/50 py-1.5 text-xs text-slate-500 hover:border-slate-400 hover:bg-white hover:text-slate-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add to {stage.label}</span>
                </button>
              )}

              {/* Cards List in Stage */}
              <div className="flex flex-1 flex-col gap-2">
                {stageLeads.length === 0 ? (
                  <div
                    className={`flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 text-center ${
                      isOver
                        ? 'border-slate-400 bg-white/70 text-slate-700'
                        : 'border-slate-300/80 text-slate-400'
                    }`}
                  >
                    <span className="text-xs">
                      {isOver ? 'Drop lead here' : 'No leads in stage'}
                    </span>
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const isDragging = draggedLeadId === lead.id;
                    const nextStage = getNextStage(lead.stage);

                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectLead(lead)}
                        className={`group relative cursor-grab active:cursor-grabbing rounded-lg border border-slate-200 bg-white p-3 shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all duration-150 ${
                          isDragging ? 'opacity-40 scale-95 border-dashed border-slate-500' : ''
                        }`}
                      >
                        {/* Company & Deal Value */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {lead.name}
                          </span>
                          <span className="font-mono text-xs font-bold tabular-nums text-slate-900 shrink-0">
                            {formatCurrency(lead.value)}
                          </span>
                        </div>

                        {/* Title & Company */}
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                          <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate">{lead.company}</span>
                        </div>

                        {/* Metadata row (No pills, clean unboxed typographic separators) */}
                        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className={`capitalize ${
                                lead.priority === 'high'
                                  ? 'text-rose-600 font-semibold'
                                  : lead.priority === 'medium'
                                  ? 'text-amber-600'
                                  : 'text-slate-500'
                              }`}
                            >
                              {lead.priority}
                            </span>
                            <span aria-hidden="true" className="text-slate-300">
                              ·
                            </span>
                            <span className="truncate">{lead.source}</span>
                          </div>

                          {/* Quick advance button */}
                          {nextStage && (
                            <button
                              type="button"
                              title={`Advance to ${nextStage}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveLeadStage(lead.id, nextStage);
                              }}
                              className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                              <span>Next</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {/* Expected Close Date */}
                        {lead.expectedCloseDate && (
                          <div className="mt-1 text-[11px] text-slate-400 font-mono tabular-nums">
                            Target: {formatDate(lead.expectedCloseDate)}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
