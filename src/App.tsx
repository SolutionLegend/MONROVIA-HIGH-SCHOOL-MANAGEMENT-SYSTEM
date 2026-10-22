import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { SuperAdminNav } from './components/SuperAdminNav';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { DashboardView } from './views/DashboardView';
import { AttendanceView } from './views/AttendanceView';
import { GradesView } from './views/GradesView';
import { FinanceView } from './views/FinanceView';
import { ReportCardView } from './views/ReportCardView';
import { LoginView } from './views/LoginView';
import { ActivityLogsView } from './views/ActivityLogsView';
import { ParentPortalView } from './views/ParentPortalView';
import { ParentManagementModal } from './components/ParentManagementModal';
import { AddRecommendationModal } from './components/AddRecommendationModal';

const MainContent: React.FC = () => {
  const { currentTab, currentUser } = useSchool();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-200">
      {/* 
        Global Super Admin Navigation Bar:
        Sits at the very top of the screen (above the main school header).
        ONLY visible when the logged-in user has the role of 'super_admin'.
      */}
      {currentUser.role === 'super_admin' && <SuperAdminNav />}

      <Header />
      <OfflineBanner />

      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 py-4">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'attendance' && <AttendanceView />}
        {currentTab === 'grades' && <GradesView />}
        {currentTab === 'finance' && <FinanceView />}
        {currentTab === 'report-card' && <ReportCardView />}
        {currentTab === 'login' && <LoginView />}
        {currentTab === 'activity-logs' && <ActivityLogsView />}
        {currentTab === 'parent-portal' && <ParentPortalView />}
      </main>

      {/* Hide bottom nav on login view */}
      {currentTab !== 'login' && <BottomNav />}

      {/* Global Modals */}
      <ParentManagementModal />
      <AddRecommendationModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainContent />
    </SchoolProvider>
  );
}
