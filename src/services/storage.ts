import { Lead } from '../types/crm';
import { INITIAL_LEADS } from '../data/seedLeads';

const STORAGE_KEY = 'leadflow_crm_leads_v1';

export function loadLeadsFromStorage(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_LEADS;
  } catch (err) {
    console.error('Failed to parse leads from localStorage', err);
    return INITIAL_LEADS;
  }
}

export function saveLeadsToStorage(leads: Lead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Failed to save leads to localStorage', err);
  }
}

export function resetLeadsToDefault(): Lead[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
  } catch (err) {
    console.error('Failed to reset leads in storage', err);
  }
  return INITIAL_LEADS;
}

export function exportLeadsToCsv(leads: Lead[]): void {
  const headers = [
    'ID',
    'Name',
    'Title',
    'Company',
    'Email',
    'Phone',
    'Value (USD)',
    'Stage',
    'Priority',
    'Source',
    'Expected Close Date',
    'Created Date',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.title.replace(/"/g, '""')}"`,
    `"${lead.company.replace(/"/g, '""')}"`,
    `"${lead.email.replace(/"/g, '""')}"`,
    `"${lead.phone.replace(/"/g, '""')}"`,
    lead.value,
    lead.stage,
    lead.priority,
    lead.source,
    lead.expectedCloseDate,
    lead.createdAt,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `leadflow_crm_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
