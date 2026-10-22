import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  Check,
  Server,
  Layers,
  Database,
  X,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';

export const SuperAdminNav: React.FC = () => {
  const {
    currentUser,
    schools,
    switchTenant,
    logout,
    detailedSchools,
    currentTenant,
    isManageSchoolsOpen,
    setIsManageSchoolsOpen,
    isSystemSettingsOpen,
    setIsSystemSettingsOpen,
    setCurrentTab,
  } = useSchool();

  const { tactileClick } = useTactileFeedback();
  const [tenantToast, setTenantToast] = useState<string | null>(null);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    tactileClick('success');
    switchTenant(selectedId);
    const schoolName = schools.find((s) => s.id === selectedId)?.name || 'School';
    setTenantToast(`Switched active tenant to: ${schoolName}`);
    setTimeout(() => setTenantToast(null), 3000);
  };

  const handleLogout = () => {
    tactileClick('alert');
    logout();
  };

  return (
    <>
      {/* Sticky Super Admin Top Navbar */}
      <nav
        className="sticky top-0 z-50 bg-black/95 text-white border-b-2 border-red-900/80 shadow-2xl backdrop-blur-xl px-3 py-2 transition-all font-sans print:hidden"
        role="navigation"
        aria-label="Super Admin Control Bar"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Brand & Super Admin Badge on Left */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-display font-extrabold text-xs sm:text-sm tracking-wide text-white">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500 animate-pulse shadow-sm shadow-red-500/80" />
              <span>System Control (Super Admin)</span>
            </div>

            {/* Role Badge: Small red badge saying "SUPER ADMIN" */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600/90 text-[10px] font-black font-mono tracking-wider text-white border border-red-500 shadow-sm shadow-red-600/40">
              <ShieldAlert className="w-3 h-3 text-white" />
              SUPER ADMIN
            </span>
          </div>

          {/* Center: Fast Tenant Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 hover:border-slate-500 rounded-xl px-2.5 py-1 transition-all">
            <Building2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <label htmlFor="tenant-switcher" className="text-[10px] font-mono uppercase text-slate-400 hidden xs:inline">
              Tenant:
            </label>
            <div className="relative">
              <select
                id="tenant-switcher"
                value={currentUser.currentTenantId}
                onChange={handleSchoolChange}
                className="bg-transparent text-xs font-bold text-white pr-6 pl-1 py-0.5 focus:outline-none cursor-pointer appearance-none font-mono"
              >
                {schools.map((school) => (
                  <option key={school.id} value={school.id} className="bg-slate-950 text-white py-1">
                    {school.name} (ID: {school.id})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right: Quick Links & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Link 1: Activity Logs */}
            <button
              onClick={() => {
                tactileClick('tap');
                setCurrentTab('activity-logs');
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 active:scale-95 transition-all flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Activity Logs</span>
            </button>

            {/* Quick Link 2: Manage Schools */}
            <button
              onClick={() => {
                tactileClick('tap');
                setIsManageSchoolsOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 active:scale-95 transition-all flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Manage Schools</span>
            </button>

            {/* Quick Link 3: System Settings */}
            <button
              onClick={() => {
                tactileClick('tap');
                setIsSystemSettingsOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 active:scale-95 transition-all flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">System Settings</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800/80 text-red-200 hover:text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5"
              title="Logout / Switch User"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Tenant Switcher Notification Toast */}
      {tenantToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-emerald-500 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-150">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{tenantToast}</span>
        </div>
      )}

      {/* Manage Schools Modal */}
      {isManageSchoolsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Multi-Tenant School Directory</h3>
                  <p className="text-xs text-slate-400">All registered institutional tenants</p>
                </div>
              </div>
              <button
                onClick={() => setIsManageSchoolsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {detailedSchools.map((school) => {
                const isActive = currentUser.currentTenantId === school.id;
                return (
                  <div
                    key={school.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-slate-800/90 border-blue-500 shadow-md'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{school.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            Tenant #{school.id}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold font-mono px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{school.county} • Principal: {school.principal}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400 block">
                          ${school.totalRevenueUSD.toLocaleString()} USD
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {school.totalStudents} students
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 italic">&ldquo;{school.motto}&rdquo;</span>
                      {!isActive && (
                        <button
                          onClick={() => {
                            switchTenant(school.id);
                            setIsManageSchoolsOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                        >
                          Switch to this School
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsManageSchoolsOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
            >
              Close Directory
            </button>
          </div>
        </div>
      )}

      {/* System Settings Modal */}
      {isSystemSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Super Admin System Settings</h3>
                  <p className="text-xs text-slate-400">Global multi-tenant configuration</p>
                </div>
              </div>
              <button
                onClick={() => setIsSystemSettingsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">System Kernel:</span>
                  <span className="font-mono text-emerald-400 font-bold">FastAPI / Node v22.23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="font-mono text-white">Multi-Tenant PostgreSQL Partitioned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Active Tenant ID:</span>
                  <span className="font-mono text-red-400 font-bold">#{currentUser.currentTenantId} ({currentTenant.name})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">RBAC Enforcement:</span>
                  <span className="font-mono text-emerald-400 font-bold">STRICT_ACTIVE</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">Security & Audit Log:</p>
                <p>• Super Admin audit logging is active for all tenant switches.</p>
                <p>• Offline PWA sync buffer holds local changes until server link verification.</p>
              </div>
            </div>

            <button
              onClick={() => setIsSystemSettingsOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
