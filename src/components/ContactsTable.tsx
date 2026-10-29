import React, { useState, useMemo } from 'react';
import { Lead, LeadStage, STAGES } from '../types/crm';
import { formatCurrency, formatDate, getStageConfig } from '../utils/formatters';
import {
  ArrowUpDown,
  Mail,
  Phone,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface ContactsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onMoveLeadStage: (leadId: string, newStage: LeadStage) => void;
  onOpenNewLead: () => void;
}

type SortField = 'name' | 'company' | 'value' | 'stage' | 'createdAt' | 'expectedCloseDate';
type SortOrder = 'asc' | 'desc';

export const ContactsTable: React.FC<ContactsTableProps> = ({
  leads,
  onSelectLead,
  onEditLead,
  onDeleteLead,
  onMoveLeadStage,
  onOpenNewLead,
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'value') {
        comparison = a.value - b.value;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'company') {
        comparison = a.company.localeCompare(b.company);
      } else if (sortField === 'stage') {
        comparison = a.stage.localeCompare(b.stage);
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'expectedCloseDate') {
        comparison =
          new Date(a.expectedCloseDate || 0).getTime() - new Date(b.expectedCloseDate || 0).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [leads, sortField, sortOrder]);

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center">
        <div className="rounded-full bg-slate-100 p-3 text-slate-500 mb-3">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No leads match your criteria</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Try clearing your filters or create a new sales lead to start tracking deals in your pipeline.
        </p>
        <button
          type="button"
          onClick={onOpenNewLead}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add First Lead</span>
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-medium">
              <th scope="col" className="py-3 pl-4 pr-3">
                <button
                  type="button"
                  onClick={() => handleSort('name')}
                  className="group inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                >
                  Contact & Title
                  <ArrowUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700" />
                </button>
              </th>
              <th scope="col" className="py-3 px-3">
                <button
                  type="button"
                  onClick={() => handleSort('company')}
                  className="group inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                >
                  Company
                  <ArrowUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700" />
                </button>
              </th>
              <th scope="col" className="py-3 px-3 text-right">
                <button
                  type="button"
                  onClick={() => handleSort('value')}
                  className="group inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 ml-auto"
                >
                  Deal Value
                  <ArrowUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700" />
                </button>
              </th>
              <th scope="col" className="py-3 px-3">
                <button
                  type="button"
                  onClick={() => handleSort('stage')}
                  className="group inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                >
                  Pipeline Stage
                  <ArrowUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700" />
                </button>
              </th>
              <th scope="col" className="py-3 px-3 hidden md:table-cell">
                Contact Info
              </th>
              <th scope="col" className="py-3 px-3 hidden lg:table-cell">
                Source
              </th>
              <th scope="col" className="py-3 px-3 hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => handleSort('expectedCloseDate')}
                  className="group inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                >
                  Target Close
                  <ArrowUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700" />
                </button>
              </th>
              <th scope="col" className="py-3 pr-4 pl-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedLeads.map((lead) => {
              const stageConfig = getStageConfig(lead.stage);

              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="group cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  {/* Contact Name & Title */}
                  <td className="py-3 pl-4 pr-3">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lead.name}
                    </div>
                    <div className="text-slate-500 text-[11px] truncate max-w-[180px]">
                      {lead.title || 'Lead Contact'}
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{lead.company}</div>
                    <div className="text-[11px] text-slate-500 capitalize">
                      Priority:{' '}
                      <span
                        className={
                          lead.priority === 'high'
                            ? 'text-rose-600 font-semibold'
                            : lead.priority === 'medium'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }
                      >
                        {lead.priority}
                      </span>
                    </div>
                  </td>

                  {/* Deal Value (Right-aligned, tabular figures) */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {formatCurrency(lead.value)}
                    </span>
                  </td>

                  {/* Stage Dropdown (Direct in row) */}
                  <td
                    className="py-3 px-3"
                    onClick={(e) => e.stopPropagation()} // Prevent opening details when changing stage
                  >
                    <select
                      value={lead.stage}
                      onChange={(e) => onMoveLeadStage(lead.id, e.target.value as LeadStage)}
                      className={`rounded border px-2 py-1 text-xs font-medium cursor-pointer transition-colors ${stageConfig.badgeBg} ${stageConfig.badgeText} ${stageConfig.borderColor}`}
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id} className="bg-white text-slate-800">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Contact Info (Quick email & phone links) */}
                  <td
                    className="py-3 px-3 hidden md:table-cell"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 text-slate-500">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          title={`Email ${lead.email}`}
                          className="hover:text-slate-900 transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          title={`Call ${lead.phone}`}
                          className="hover:text-slate-900 transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {lead.email}
                      </span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-3 hidden lg:table-cell text-slate-600">
                    {lead.source}
                  </td>

                  {/* Expected Close Date */}
                  <td className="py-3 px-3 hidden sm:table-cell font-mono tabular-nums text-slate-600 text-[11px]">
                    {formatDate(lead.expectedCloseDate)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3 pr-4 pl-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onSelectLead(lead)}
                        title="View Lead Details"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditLead(lead)}
                        title="Edit Lead"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete lead "${lead.name}" (${lead.company})?`)) {
                            onDeleteLead(lead.id);
                          }
                        }}
                        title="Delete Lead"
                        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
