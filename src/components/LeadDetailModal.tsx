import React, { useState } from 'react';
import { Lead, LeadStage, STAGES } from '../types/crm';
import { formatCurrency, formatDate, formatRelativeTime, getStageConfig } from '../utils/formatters';
import {
  X,
  Building2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Tag,
  Copy,
  Check,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  Send,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onMoveLeadStage: (leadId: string, newStage: LeadStage) => void;
  onAddNote: (leadId: string, noteText: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onEditLead,
  onDeleteLead,
  onMoveLeadStage,
  onAddNote,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!lead) return null;

  const currentStageConfig = getStageConfig(lead.stage);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 1800);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(lead.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {lead.name}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${currentStageConfig.badgeBg} ${currentStageConfig.badgeText} border ${currentStageConfig.borderColor}`}
                >
                  {currentStageConfig.label}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                <span className="font-medium">{lead.title || 'Lead Contact'}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-slate-800 font-semibold">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {lead.company}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xl font-bold tabular-nums text-slate-900">
                {formatCurrency(lead.value)}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Interactive Pipeline Stage Stepper */}
          <div className="mt-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Pipeline Progress (Click to update stage)
            </div>
            <div className="grid grid-cols-7 gap-1">
              {STAGES.map((stage) => {
                const isCurrent = lead.stage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => onMoveLeadStage(lead.id, stage.id)}
                    className={`group flex flex-col items-center justify-center rounded-lg border py-1.5 px-1 text-center transition-all ${
                      isCurrent
                        ? `${stage.badgeBg} ${stage.borderColor} ${stage.badgeText} ring-2 ring-slate-900/10 font-bold`
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-[11px] truncate w-full">{stage.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Quick Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-white">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="rounded-md bg-slate-100 p-2 text-slate-600 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] text-slate-400 font-medium">Email</div>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-xs font-medium text-slate-900 hover:underline truncate block"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(lead.email, 'email')}
                title="Copy Email"
                className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                {copiedField === 'email' ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-white">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="rounded-md bg-slate-100 p-2 text-slate-600 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] text-slate-400 font-medium">Phone</div>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-xs font-medium text-slate-900 hover:underline truncate block"
                  >
                    {lead.phone || 'No phone recorded'}
                  </a>
                </div>
              </div>
              {lead.phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(lead.phone, 'phone')}
                  title="Copy Phone"
                  className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  {copiedField === 'phone' ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>

            {/* Expected Close Date */}
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 bg-white">
              <div className="rounded-md bg-slate-100 p-2 text-slate-600 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Expected Close</div>
                <div className="text-xs font-mono font-medium text-slate-900 tabular-nums">
                  {formatDate(lead.expectedCloseDate)}
                </div>
              </div>
            </div>

            {/* Priority & Source */}
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 bg-white">
              <div className="rounded-md bg-slate-100 p-2 text-slate-600 shrink-0">
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Priority & Source</div>
                <div className="text-xs text-slate-800">
                  <span
                    className={`font-semibold capitalize ${
                      lead.priority === 'high'
                        ? 'text-rose-600'
                        : lead.priority === 'medium'
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {lead.priority} Priority
                  </span>
                  {' '}· {lead.source}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                Notes & Activity ({lead.notes.length})
              </h3>
            </div>

            {/* Add Note Input Form */}
            <form onSubmit={handleNoteSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add a call note, follow-up item or meeting summary..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-20 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 flex items-center gap-1 transition-colors"
                >
                  <Send className="h-3 w-3" />
                  <span>Add</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            {lead.notes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                No notes added yet. Add a quick note above to log outreach or call updates.
              </div>
            ) : (
              <div className="space-y-2.5">
                {lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{note.author}</span>
                      <span className="text-[11px] font-mono tabular-nums">
                        {formatRelativeTime(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          {lead.activities && lead.activities.length > 0 && (
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-3">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                History & Stage Transitions
              </h3>
              <div className="space-y-2 border-l border-slate-200 ml-2 pl-4">
                {lead.activities.map((act) => (
                  <div key={act.id} className="relative text-xs">
                    <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-slate-300 border border-white" />
                    <div className="text-slate-800">{act.description}</div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-400">
                      {formatDate(act.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete lead "${lead.name}"?`)) {
                onDeleteLead(lead.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Lead</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditLead(lead);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
