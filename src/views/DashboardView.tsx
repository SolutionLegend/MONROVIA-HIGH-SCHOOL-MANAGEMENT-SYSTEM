import React, { useState } from 'react';
import {
  UserCheck,
  GraduationCap,
  AlertCircle,
  FileText,
  Users,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Clock,
  Sparkles,
  Building2,
  ShieldAlert,
  Server,
  Layers,
  ChevronRight,
  Globe,
  School,
  ExternalLink,
  UserPlus,
  BookOpen,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';

import { ParentPortalView } from './ParentPortalView';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    currentTenant,
    detailedSchools,
    switchTenant,
    globalMetrics,
    activityLogs,
    setCurrentTab,
    setSelectedClass,
    stats,
    students,
    setIsManageSchoolsOpen,
    parentAccounts,
    setIsAddParentModalOpen,
    setIsAddRecModalOpen,
  } = useSchool();
  const { tactileClick } = useTactileFeedback();

  // If logged in as parent, render Parent Portal immediately
  if (currentUser.role === 'parent') {
    return <ParentPortalView />;
  }

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Toggle for Super Admin to expand selected school operational details
  const [viewSchoolOperations, setViewSchoolOperations] = useState(false);

  // Top 3 urgent debtors in the selected tenant
  const topDebtors = [...students]
    .filter((s) => s.tuitionBalanceLRD > 0)
    .sort((a, b) => b.tuitionBalanceLRD - a.tuitionBalanceLRD)
    .slice(0, 3);

  const handleQuickAction = (tab: 'attendance' | 'grades' | 'finance' | 'report-card') => {
    tactileClick('tap');
    setCurrentTab(tab);
  };

  const handleWhatsAppAlert = (student: typeof students[0]) => {
    tactileClick('success');
    const cleanPhone = student.parentPhone.replace(/[^0-9]/g, '');
    const message = `Dear Mr./Mrs. ${student.parentName},\n\nThis is an official tuition balance notice from ${currentTenant.name}.\n\nStudent: ${student.name} (${student.grade})\nOutstanding Balance: ${student.tuitionBalanceLRD.toLocaleString()} LRD ($${student.tuitionBalanceUSD} USD)\n\nPlease remit payment via Lonestar Cell MTN MoMo (+231880123456) or Orange Money (+231770123456) to ensure prompt exam clearance.\n\nThank you,\nAdministration Office`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* =========================================================================
          SUPER ADMIN GLOBAL OVERVIEW (Rendered ONLY if role is 'super_admin')
          ========================================================================= */}
      {isSuperAdmin && (
        <div className="space-y-4">
          {/* Super Admin Global Command Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-black via-slate-950 to-red-950/80 border-2 border-red-600/70 p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                  <span>SUPER ADMIN COMMAND CENTER • MULTI-TENANT RBAC</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Global System Overview
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Cross-institutional oversight for all Republic of Liberia registered academies.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-red-950 border border-red-700 text-red-200">
                  Tenant #{currentUser.currentTenantId} Active
                </span>
              </div>
            </div>

            {/* Currently Selected Tenant Banner */}
            <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Currently Managing:{' '}
                  <strong className="text-white font-bold">{currentTenant.name}</strong> ({currentTenant.county})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsManageSchoolsOpen(true)}
                  className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 active:scale-95"
                >
                  <span>Switch School</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Global Overview Metrics Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Network Aggregate Metrics (All Schools)</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">Live Telemetry</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Total Schools: 3 */}
              <div className="rounded-xl bg-slate-900 border-2 border-red-900/60 p-3 shadow-md">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Schools</span>
                  <Building2 className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white tracking-tight">
                  {globalMetrics.totalSchools}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 font-medium">
                  3 active tenants
                </div>
              </div>

              {/* Total Students across all schools: 1,500 */}
              <div className="rounded-xl bg-slate-900 border-2 border-blue-900/60 p-3 shadow-md">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Students</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white tracking-tight">
                  {globalMetrics.totalStudentsAcrossAllSchools.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">
                  Across all 3 campuses
                </div>
              </div>

              {/* Total Revenue: $50,000 */}
              <div className="rounded-xl bg-slate-900 border-2 border-emerald-900/60 p-3 shadow-md">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg xs:text-xl font-black font-mono text-emerald-400 tracking-tight">
                  ${globalMetrics.totalRevenueUSD.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  ~9.75M LRD
                </div>
              </div>
            </div>
          </div>

          {/* School Network Comparison Cards */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Institutions in System Registry</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">Click to Switch Tenant</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {detailedSchools.map((s) => {
                const isSelected = s.id === currentUser.currentTenantId;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      tactileClick('success');
                      switchTenant(s.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-slate-800 border-2 border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-white">{s.name}</span>
                      {isSelected ? (
                        <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white font-mono text-[9px] font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">#{s.id}</span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 mt-0.5">{s.county}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-300">{s.totalStudents} students</span>
                      <span className="text-emerald-400 font-bold">${s.totalRevenueUSD.toLocaleString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Super Admin Activity Logs Spotlight Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-800/60 p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-600/40 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">System Activity &amp; Audit Logs</h4>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-red-900 text-red-200 border border-red-700">
                    {activityLogs.length} Events
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Track cross-tenant policy shifts, fee structure adjustments, and security delegations.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                tactileClick('tap');
                setCurrentTab('activity-logs');
              }}
              className="py-2.5 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-900/40 border border-red-400 shrink-0 active:scale-95 transition-all"
            >
              <span>View Activity Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Super Admin Toggle for Drilling down into Selected School's Operations */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-400" />
              <span>
                School Operations for <strong className="text-white">{currentTenant.name}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                tactileClick('tap');
                setViewSchoolOperations((prev) => !prev);
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs active:scale-95 transition-all"
            >
              {viewSchoolOperations ? 'Hide Operational View' : 'Show Operational View'}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCHOOL OPERATIONAL DASHBOARD
          Visible to 'teacher', 'admin', and also to 'super_admin' when toggled/always
          ========================================================================= */}
      {(!isSuperAdmin || viewSchoolOperations) && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* School Operational Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-900/60 p-4 shadow-lg relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentTenant.name.toUpperCase()} • 2025/2026</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  School Faculty Command Portal
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Rapid offline roll call, automated grade computation, and fee debt recovery.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block text-[11px] font-mono px-2 py-1 rounded-md bg-blue-950 border border-blue-800/80 text-blue-200">
                  Grade 10A Lead
                </span>
              </div>
            </div>

            {/* Quick Operational Notice */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Morning roll call in progress for {currentTenant.name}</span>
              </div>
              <button
                onClick={() => {
                  tactileClick('tap');
                  setCurrentTab('attendance');
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 active:scale-95"
              >
                Mark now <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* School-specific Stats Row */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Total Students */}
            <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-3 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Students</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">
                {stats.totalStudents}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                <span className="text-emerald-400 font-semibold">{currentTenant.name}</span> roster
              </div>
            </div>

            {/* Present Today */}
            <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-3 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Present</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                {stats.presentToday}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                <span className="text-emerald-400 font-mono font-semibold">{stats.attendanceRate}%</span> rate
              </div>
            </div>

            {/* Outstanding Tuition */}
            <div className="rounded-xl bg-slate-800/80 border border-slate-700/80 p-3 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Debt (LRD)</span>
                <DollarSign className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-lg xs:text-xl font-bold font-mono text-red-400 tracking-tight truncate">
                {stats.outstandingLRD.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                <span className="text-red-400 font-semibold">{stats.totalDebtors}</span> debtors
              </div>
            </div>
          </div>

          {/* Quick Action Grid (Big Tactile Buttons for Mobile Sunlight Use) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Classroom Quick Controls</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">1-Tap Fast Launch</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Action 1: Take Attendance */}
              <button
                onClick={() => handleQuickAction('attendance')}
                className="flex flex-col text-left p-3.5 rounded-2xl bg-gradient-to-br from-blue-900/90 to-blue-950 border-2 border-blue-600/70 hover:border-emerald-500 shadow-md active:scale-95 transition-all group min-h-[92px]"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-800/80 text-blue-200 border border-blue-600/50">
                    Roll Call
                  </span>
                </div>
                <span className="font-bold text-sm text-white leading-tight">Take Attendance</span>
                <span className="text-[11px] text-slate-300 mt-0.5">1-tap bulk present</span>
              </button>

              {/* Action 2: Enter Grades */}
              <button
                onClick={() => handleQuickAction('grades')}
                className="flex flex-col text-left p-3.5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-blue-500 shadow-md active:scale-95 transition-all group min-h-[92px]"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="p-2 rounded-xl bg-slate-700 text-emerald-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                    20/30/50%
                  </span>
                </div>
                <span className="font-bold text-sm text-white leading-tight">Enter Grades</span>
                <span className="text-[11px] text-slate-300 mt-0.5">Auto weighted formula</span>
              </button>

              {/* Action 3: View Debtors */}
              <button
                onClick={() => handleQuickAction('finance')}
                className="flex flex-col text-left p-3.5 rounded-2xl bg-gradient-to-br from-red-950/70 to-slate-900 border-2 border-red-900/60 hover:border-red-500 shadow-md active:scale-95 transition-all group min-h-[92px]"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="p-2 rounded-xl bg-red-600 text-white shadow-sm group-hover:bg-red-500 transition-colors">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-900/80 text-white border border-red-700">
                    {stats.totalDebtors} Unpaid
                  </span>
                </div>
                <span className="font-bold text-sm text-white leading-tight">View Debtors</span>
                <span className="text-[11px] text-red-200 mt-0.5">Instant WhatsApp notice</span>
              </button>

              {/* Action 4: Report Card */}
              <button
                onClick={() => handleQuickAction('report-card')}
                className="flex flex-col text-left p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border-2 border-emerald-900/60 hover:border-emerald-500 shadow-md active:scale-95 transition-all group min-h-[92px]"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                    Print/PDF
                  </span>
                </div>
                <span className="font-bold text-sm text-white leading-tight">Report Cards</span>
                <span className="text-[11px] text-emerald-200 mt-0.5">Print letterhead layout</span>
              </button>

              {/* Action 5: Parent Portal Experience & Admin Controls */}
              <div className="col-span-2 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-600/70 p-3.5 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">Parent Portal &amp; Guardian Network</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700">
                          {parentAccounts.length} Registered
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        School Admins can register parents, link them to Junior &amp; Senior High students, and dispatch routine guidance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      tactileClick('tap');
                      setIsAddParentModalOpen(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add / Link Parent</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileClick('tap');
                      setIsAddRecModalOpen(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>+ Add Advice Note</span>
                  </button>

                  <button
                    onClick={() => {
                      tactileClick('tap');
                      setCurrentTab('parent-portal');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
                  >
                    <School className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open Parent Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* High School Academic Structure (Junior High to Senior High: 10, 11, 12 Art & Science) */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-xs text-white">
                  High School Divisions &bull; Junior High to Senior High (Arts &amp; Science)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">9 Registered Classes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Junior High (7, 8, 9) */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wide">
                    🎓 Junior High
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-200 border border-blue-800">
                    Grades 7 - 9
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Foundational WAEC curriculum &amp; general sciences</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Grade 7', 'Grade 8', 'Grade 9'].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        tactileClick('tap');
                        setSelectedClass(cls);
                        setCurrentTab('attendance');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-mono text-[10px] font-semibold border border-slate-700 transition-colors"
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Senior High Arts (10, 11, 12 Arts) */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                    🎨 Senior High (Arts)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-200 border border-amber-800">
                    10, 11, 12 Arts
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Literature, Economics, Civics &amp; Geography</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Grade 10 Arts', 'Grade 11 Arts', 'Grade 12 Arts'].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        tactileClick('tap');
                        setSelectedClass(cls);
                        setCurrentTab('grades');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-amber-600 text-white font-mono text-[10px] font-semibold border border-slate-700 transition-colors"
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Senior High Science (10, 11, 12 Science) */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                    🔬 Senior High (Science)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-200 border border-emerald-800">
                    10, 11, 12 Science
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Advanced Math, Biology, Chemistry &amp; Physics</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Grade 10 Science', 'Grade 11 Science', 'Grade 12 Science'].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        tactileClick('tap');
                        setSelectedClass(cls);
                        setCurrentTab('grades');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-mono text-[10px] font-semibold border border-slate-700 transition-colors"
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Attendance Roll Summary */}
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs text-white">Attendance Roll Summary</h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {stats.presentToday}/{stats.totalStudents} ({stats.attendanceRate}%)
              </span>
            </div>

            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden flex my-2 border border-slate-600">
              <div
                style={{
                  width: `${stats.totalStudents > 0 ? (stats.presentToday / stats.totalStudents) * 100 : 0}%`,
                }}
                className="bg-emerald-500 h-full transition-all duration-300"
              />
              <div
                style={{
                  width: `${stats.totalStudents > 0 ? (stats.lateToday / stats.totalStudents) * 100 : 0}%`,
                }}
                className="bg-amber-400 h-full transition-all duration-300"
              />
              <div
                style={{
                  width: `${stats.totalStudents > 0 ? (stats.absentToday / stats.totalStudents) * 100 : 0}%`,
                }}
                className="bg-red-500 h-full transition-all duration-300"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Present ({stats.presentToday})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Late ({stats.lateToday})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Absent ({stats.absentToday})</span>
              </div>
            </div>
          </div>

          {/* Urgent Debtors Spotlight */}
          {topDebtors.length > 0 && (
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Tuition Debtors for {currentTenant.name}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Send WhatsApp reminder before exam cutoff
                  </p>
                </div>
                <button
                  onClick={() => {
                    tactileClick('tap');
                    setCurrentTab('finance');
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 active:scale-95"
                >
                  All Debtors ({stats.totalDebtors}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {topDebtors.map((debtor) => (
                  <div
                    key={debtor.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate">{debtor.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {debtor.grade}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <span>Parent: {debtor.parentName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="font-bold font-mono text-xs text-red-400">
                          {debtor.tuitionBalanceLRD.toLocaleString()} LRD
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          (${debtor.tuitionBalanceUSD} USD)
                        </div>
                      </div>

                      <button
                        onClick={() => handleWhatsAppAlert(debtor)}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-90 transition-all"
                        title="Send WhatsApp Balance Alert to Parent"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
