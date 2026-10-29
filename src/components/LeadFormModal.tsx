import React, { useState, useEffect } from 'react';
import { Lead, LeadStage, Priority, LeadSource, STAGES, SOURCES, PRIORITIES } from '../types/crm';
import { X, Check } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit: Lead | null;
  defaultStage?: LeadStage;
  onSaveLead: (leadData: Partial<Lead>, initialNote?: string) => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  leadToEdit,
  defaultStage = 'new',
  onSaveLead,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [value, setValue] = useState('25000');
  const [stage, setStage] = useState<LeadStage>(defaultStage);
  const [priority, setPriority] = useState<Priority>('medium');
  const [source, setSource] = useState<LeadSource>('Website');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [initialNote, setInitialNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name);
      setTitle(leadToEdit.title || '');
      setCompany(leadToEdit.company);
      setEmail(leadToEdit.email);
      setPhone(leadToEdit.phone || '');
      setValue(leadToEdit.value.toString());
      setStage(leadToEdit.stage);
      setPriority(leadToEdit.priority);
      setSource(leadToEdit.source);
      setExpectedCloseDate(leadToEdit.expectedCloseDate || '');
      setInitialNote('');
    } else {
      setName('');
      setTitle('');
      setCompany('');
      setEmail('');
      setPhone('');
      setValue('25000');
      setStage(defaultStage);
      setPriority('medium');
      setSource('Website');
      // Default expected close 30 days from now
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setExpectedCloseDate(d.toISOString().slice(0, 10));
      setInitialNote('');
    }
    setErrors({});
  }, [leadToEdit, defaultStage, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Contact name is required';
    if (!company.trim()) newErrors.company = 'Company name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      newErrors.value = 'Value must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSaveLead(
      {
        name: name.trim(),
        title: title.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        value: Number(value),
        stage,
        priority,
        source,
        expectedCloseDate,
      },
      initialNote.trim() || undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {leadToEdit ? 'Edit Sales Lead' : 'Create New Sales Lead'}
            </h2>
            <p className="text-xs text-slate-500">
              {leadToEdit
                ? 'Update contact info, deal value, or pipeline stage.'
                : 'Enter details for your new prospective client or deal.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Contact Name & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.name
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
                }`}
              />
              {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VP of Engineering"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Company & Deal Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acrobatix Robotics"
                className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.company
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
                }`}
              />
              {errors.company && <p className="mt-1 text-[11px] text-rose-500">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deal Value ($ USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={`w-full rounded-lg border pl-7 pr-3 py-2 text-xs font-mono tabular-nums text-slate-900 focus:outline-none focus:ring-1 ${
                    errors.value
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
                  }`}
                />
              </div>
              {errors.value && <p className="mt-1 text-[11px] text-rose-500">{errors.value}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sjenkins@company.com"
                className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900'
                }`}
              />
              {errors.email && <p className="mt-1 text-[11px] text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Pipeline Stage & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} Priority
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source & Expected Close Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
              >
                {SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Close Date
              </label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Initial Note (only when creating new lead) */}
          {!leadToEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Notes / Context (optional)
              </label>
              <textarea
                rows={3}
                value={initialNote}
                onChange={(e) => setInitialNote(e.target.value)}
                placeholder="e.g. Discussed requirements during discovery call. Looking to deploy by end of quarter."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
              />
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Check className="h-4 w-4" />
              <span>{leadToEdit ? 'Save Changes' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
