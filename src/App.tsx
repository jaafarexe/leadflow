import React, { useState, useEffect, useMemo } from 'react';
import { Lead, LeadStage, Priority, LeadSource } from './types/crm';
import {
  loadLeadsFromStorage,
  saveLeadsToStorage,
  resetLeadsToDefault,
  exportLeadsToCsv,
} from './services/storage';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterToolbar } from './components/FilterToolbar';
import { KanbanBoard } from './components/KanbanBoard';
import { ContactsTable } from './components/ContactsTable';
import { AnalyticsView } from './components/AnalyticsView';
import { LeadDetailModal } from './components/LeadDetailModal';
import { LeadFormModal } from './components/LeadFormModal';
import { Check, X } from 'lucide-react';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(() => loadLeadsFromStorage());
  const [currentTab, setCurrentTab] = useState<'pipeline' | 'contacts' | 'analytics'>('pipeline');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<LeadStage | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<LeadSource | 'all'>('all');

  // Modals & detail view state
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [defaultStageForNewLead, setDefaultStageForNewLead] = useState<LeadStage>('new');

  // Transient Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  // Sync with LocalStorage whenever leads change
  useEffect(() => {
    saveLeadsToStorage(leads);
  }, [leads]);

  // Derived selected lead from ID so edits immediately reflect in modal
  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find((l) => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Filtered leads based on search & filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesCompany = lead.company.toLowerCase().includes(query);
        const matchesTitle = (lead.title || '').toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        if (!matchesName && !matchesCompany && !matchesTitle && !matchesEmail) {
          return false;
        }
      }

      // Stage check
      if (selectedStage !== 'all' && lead.stage !== selectedStage) {
        return false;
      }

      // Priority check
      if (selectedPriority !== 'all' && lead.priority !== selectedPriority) {
        return false;
      }

      // Source check
      if (selectedSource !== 'all' && lead.source !== selectedSource) {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, selectedStage, selectedPriority, selectedSource]);

  // Handlers
  const handleMoveLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.id === leadId) {
          if (l.stage === newStage) return l;
          const oldStage = l.stage;
          const timestamp = new Date().toISOString();
          const activityDescription = `Stage changed from ${oldStage.toUpperCase()} to ${newStage.toUpperCase()}`;
          return {
            ...l,
            stage: newStage,
            updatedAt: timestamp,
            activities: [
              {
                id: `act-${Date.now()}`,
                type: 'stage_change',
                description: activityDescription,
                timestamp,
              },
              ...l.activities,
            ],
          };
        }
        return l;
      })
    );

    const targetLead = leads.find((l) => l.id === leadId);
    showToast(
      targetLead
        ? `"${targetLead.name}" moved to ${newStage.toUpperCase()}`
        : `Stage updated to ${newStage.toUpperCase()}`
    );
  };

  const handleSaveLead = (leadData: Partial<Lead>, initialNote?: string) => {
    const timestamp = new Date().toISOString();

    if (leadToEdit) {
      // Update existing lead
      setLeads((prevLeads) =>
        prevLeads.map((l) => {
          if (l.id === leadToEdit.id) {
            return {
              ...l,
              ...leadData,
              updatedAt: timestamp,
              activities: [
                {
                  id: `act-${Date.now()}`,
                  type: 'edited',
                  description: 'Lead profile information updated',
                  timestamp,
                },
                ...l.activities,
              ],
            };
          }
          return l;
        })
      );
      showToast(`Updated details for "${leadData.name || leadToEdit.name}"`);
    } else {
      // Create new lead
      const newId = `lead-${Date.now()}`;
      const newNotes = initialNote
        ? [
            {
              id: `note-${Date.now()}`,
              author: 'Current User',
              text: initialNote,
              createdAt: timestamp,
            },
          ]
        : [];

      const newLead: Lead = {
        id: newId,
        name: leadData.name || 'Untitled Lead',
        title: leadData.title || '',
        company: leadData.company || 'Unknown Co.',
        email: leadData.email || '',
        phone: leadData.phone || '',
        value: leadData.value || 0,
        stage: leadData.stage || defaultStageForNewLead,
        priority: leadData.priority || 'medium',
        source: leadData.source || 'Website',
        expectedCloseDate: leadData.expectedCloseDate || '',
        notes: newNotes,
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'created',
            description: `Lead created in ${leadData.stage || defaultStageForNewLead} stage`,
            timestamp,
          },
        ],
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      setLeads((prev) => [newLead, ...prev]);
      showToast(`New lead "${newLead.name}" added`);
    }

    setLeadToEdit(null);
  };

  const handleDeleteLead = (leadId: string) => {
    const leadToDelete = leads.find((l) => l.id === leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLeadId === leadId) {
      setSelectedLeadId(null);
    }
    showToast(`Lead "${leadToDelete?.name || ''}" deleted`);
  };

  const handleAddNote = (leadId: string, noteText: string) => {
    const timestamp = new Date().toISOString();
    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            updatedAt: timestamp,
            notes: [
              {
                id: `note-${Date.now()}`,
                author: 'Alex Mercer (You)',
                text: noteText,
                createdAt: timestamp,
              },
              ...l.notes,
            ],
            activities: [
              {
                id: `act-${Date.now()}`,
                type: 'note_added',
                description: `Note logged: "${noteText.slice(0, 40)}${
                  noteText.length > 40 ? '...' : ''
                }"`,
                timestamp,
              },
              ...l.activities,
            ],
          };
        }
        return l;
      })
    );
    showToast('Note added to timeline');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to restore the default sample leads? Any custom changes will be replaced.'
      )
    ) {
      const reset = resetLeadsToDefault();
      setLeads(reset);
      setSelectedLeadId(null);
      showToast('Sample CRM dataset restored');
    }
  };

  const handleExportCsv = () => {
    exportLeadsToCsv(leads);
    showToast(`Exported ${leads.length} leads to CSV`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStage('all');
    setSelectedPriority('all');
    setSelectedSource('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewLeadModal={() => {
          setLeadToEdit(null);
          setDefaultStageForNewLead('new');
          setIsFormModalOpen(true);
        }}
        onExportCsv={handleExportCsv}
        onResetData={handleResetData}
      />

      {/* KPI Stats Bar */}
      <StatsBar leads={leads} />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter & Search Toolbar (shown for Pipeline & Contacts tabs) */}
        {currentTab !== 'analytics' && (
          <div className="mb-6">
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedStage={selectedStage}
              onStageChange={setSelectedStage}
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
              totalFilteredCount={filteredLeads.length}
              totalCount={leads.length}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Tab 1: Pipeline Kanban View */}
        {currentTab === 'pipeline' && (
          <KanbanBoard
            leads={filteredLeads}
            onMoveLeadStage={handleMoveLeadStage}
            onSelectLead={(lead) => setSelectedLeadId(lead.id)}
            onOpenNewLeadWithStage={(stage) => {
              setLeadToEdit(null);
              setDefaultStageForNewLead(stage);
              setIsFormModalOpen(true);
            }}
          />
        )}

        {/* Tab 2: Contacts List View */}
        {currentTab === 'contacts' && (
          <ContactsTable
            leads={filteredLeads}
            onSelectLead={(lead) => setSelectedLeadId(lead.id)}
            onEditLead={(lead) => {
              setLeadToEdit(lead);
              setIsFormModalOpen(true);
            }}
            onDeleteLead={handleDeleteLead}
            onMoveLeadStage={handleMoveLeadStage}
            onOpenNewLead={() => {
              setLeadToEdit(null);
              setDefaultStageForNewLead('new');
              setIsFormModalOpen(true);
            }}
          />
        )}

        {/* Tab 3: Analytics View */}
        {currentTab === 'analytics' && (
          <AnalyticsView
            leads={leads}
            onSelectLead={(lead) => setSelectedLeadId(lead.id)}
          />
        )}
      </main>

      {/* Lead Detail Modal / Drawer */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLeadId(null)}
        onEditLead={(lead) => {
          setLeadToEdit(lead);
          setIsFormModalOpen(true);
        }}
        onDeleteLead={handleDeleteLead}
        onMoveLeadStage={handleMoveLeadStage}
        onAddNote={handleAddNote}
      />

      {/* Create / Edit Lead Modal */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setLeadToEdit(null);
        }}
        leadToEdit={leadToEdit}
        defaultStage={defaultStageForNewLead}
        onSaveLead={handleSaveLead}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
