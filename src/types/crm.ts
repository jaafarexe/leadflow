export type LeadStage = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'proposal' 
  | 'negotiation' 
  | 'won' 
  | 'lost';

export type Priority = 'low' | 'medium' | 'high';

export type LeadSource = 
  | 'Website' 
  | 'LinkedIn' 
  | 'Referral' 
  | 'Outbound' 
  | 'Partner' 
  | 'Event';

export interface NoteItem {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'created' | 'stage_change' | 'note_added' | 'edited';
  description: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  stage: LeadStage;
  priority: Priority;
  source: LeadSource;
  expectedCloseDate: string;
  notes: NoteItem[];
  activities: ActivityItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StageConfig {
  id: LeadStage;
  label: string;
  description: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const STAGES: StageConfig[] = [
  {
    id: 'new',
    label: 'New',
    description: 'Inbound leads & newly discovered contacts',
    dotColor: 'bg-slate-400',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-800',
  },
  {
    id: 'contacted',
    label: 'Contacted',
    description: 'Initial outreach made or meeting booked',
    dotColor: 'bg-sky-500',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeText: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-900/60',
  },
  {
    id: 'qualified',
    label: 'Qualified',
    description: 'Budget, authority & requirements verified',
    dotColor: 'bg-indigo-500',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-900/60',
  },
  {
    id: 'proposal',
    label: 'Proposal',
    description: 'Formal quote or proposal submitted to client',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-900/60',
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    description: 'Terms, SLA, and pricing under active review',
    dotColor: 'bg-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-900/60',
  },
  {
    id: 'won',
    label: 'Won',
    description: 'Deal closed & contract signed',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-900/60',
  },
  {
    id: 'lost',
    label: 'Lost',
    description: 'Deal closed without agreement or deferred',
    dotColor: 'bg-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-200 dark:border-rose-900/60',
  },
];

export const SOURCES: LeadSource[] = [
  'Website',
  'LinkedIn',
  'Referral',
  'Outbound',
  'Partner',
  'Event',
];

export const PRIORITIES: { id: Priority; label: string; textClass: string }[] = [
  { id: 'high', label: 'High', textClass: 'text-rose-600 dark:text-rose-400 font-semibold' },
  { id: 'medium', label: 'Medium', textClass: 'text-amber-600 dark:text-amber-400' },
  { id: 'low', label: 'Low', textClass: 'text-slate-500 dark:text-slate-400' },
];
