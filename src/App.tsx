import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { SummaryBanner } from './components/SummaryBanner';
import { DashboardView } from './components/DashboardView';
import { CasesTableView } from './components/CasesTableView';
import { WhatsAppChatSimulator } from './components/WhatsAppChatSimulator';
import { CallCenterView } from './components/CallCenterView';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { UploadView } from './components/UploadView';
import { SettingsView } from './components/SettingsView';
import { PersonalTerminal } from './components/PersonalTerminal';
import { CalendarTimelineReconciler } from './components/CalendarTimelineReconciler';
import { ApprovalsDesk } from './components/ApprovalsDesk';
import { LiveTeamRadar } from './components/LiveTeamRadar';
import { RegularizationModal } from './components/RegularizationModal';
import { Clock, ShieldCheck, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [punchSubTab, setPunchSubTab] = useState<'terminal' | 'approvals' | 'radar'>('terminal');

  const [regularizationModalOpen, setRegularizationModalOpen] = useState(false);
  const [modalPresetDate, setModalPresetDate] = useState<string | undefined>();
  const [modalPresetCalendarId, setModalPresetCalendarId] = useState<string | undefined>();

  const { setSelectedCaseId } = useAttendance();

  const handleOpenRegularizationModal = (presetDate?: string, calendarEventId?: string) => {
    setModalPresetDate(presetDate);
    setModalPresetCalendarId(calendarEventId);
    setRegularizationModalOpen(true);
  };

  const handleCloseRegularizationModal = () => {
    setRegularizationModalOpen(false);
    setModalPresetDate(undefined);
    setModalPresetCalendarId(undefined);
  };

  const handleOpenWhatsAppForCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('whatsapp');
  };

  const handleOpenCallCenterForCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('callcenter');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#0E1E28]">
      {/* Dark Naval Sidebar with Talent Carriage Logo & Brand */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Summary Banner */}
        <SummaryBanner />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView setActiveTab={setActiveTab} />
          )}

          {activeTab === 'cases' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Follow-up Attendance Cases
                </h2>
                <p className="text-xs text-slate-500">
                  Detailed register of all identified absentees, employee replies, and next actions.
                </p>
              </div>
              <CasesTableView
                onOpenWhatsApp={handleOpenWhatsAppForCase}
                onOpenCallCenter={handleOpenCallCenterForCase}
              />
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  WhatsApp Follow-up Agent & Simulator
                </h2>
                <p className="text-xs text-slate-500">
                  Interactive real-time chat interface. Test the 4 template button options, AI natural language classification, and 2-day reminder escalation.
                </p>
              </div>
              <WhatsAppChatSimulator
                onNavigateToCallCenter={() => setActiveTab('callcenter')}
              />
            </div>
          )}

          {activeTab === 'callcenter' && <CallCenterView />}

          {activeTab === 'manager_approvals' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Manager Approvals & Escalation Desk
                </h2>
                <p className="text-xs text-slate-500">
                  Manage incoming attendance regularizations and leave approvals escalated via automated WhatsApp and Plivo voice calls.
                </p>
              </div>
              <ApprovalsDesk />
            </div>
          )}

          {activeTab === 'workflow' && <WorkflowVisualizer />}

          {activeTab === 'upload' && (
            <UploadView onSuccessNavigate={() => setActiveTab('cases')} />
          )}

          {activeTab === 'punch_terminal' && (
            <div className="space-y-6">
              {/* Secondary Navigation for Punch & Presence */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Punch Terminal & Calendar Reconciler
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time biometric check-in simulator, Google Calendar meeting matcher, and manager approvals.
                  </p>
                </div>

                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setPunchSubTab('terminal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      punchSubTab === 'terminal'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Employee Punch
                  </button>
                  <button
                    onClick={() => setPunchSubTab('approvals')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      punchSubTab === 'approvals'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Manager Approvals
                  </button>
                  <button
                    onClick={() => setPunchSubTab('radar')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      punchSubTab === 'radar'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Team Radar
                  </button>
                </div>
              </div>

              {punchSubTab === 'terminal' && (
                <div className="space-y-6">
                  <PersonalTerminal
                    onOpenRegularizationModal={handleOpenRegularizationModal}
                  />
                  <CalendarTimelineReconciler
                    onOpenRegularizationModal={handleOpenRegularizationModal}
                  />
                </div>
              )}

              {punchSubTab === 'approvals' && <ApprovalsDesk />}

              {punchSubTab === 'radar' && <LiveTeamRadar />}
            </div>
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>

        {/* Regularization Modal */}
        <RegularizationModal
          isOpen={regularizationModalOpen}
          onClose={handleCloseRegularizationModal}
          presetDate={modalPresetDate}
          presetCalendarEventId={modalPresetCalendarId}
        />

        {/* Bottom App Footer */}
        <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">Talent Carriage</span>
              <span className="text-slate-400">·</span>
              <span>AI Attendance Follow-up Command Center</span>
              <span className="text-slate-400">·</span>
              <span className="font-medium text-slate-600">DPOD Lifestyle</span>
            </div>

            <div className="flex items-center space-x-4 text-[11px]">
              <span className="flex items-center text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                Automation Engine: Operational
              </span>
              <span className="flex items-center text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Workflow v2.0
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <AppContent />
    </AttendanceProvider>
  );
}
