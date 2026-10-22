import React, { useState } from 'react';
import {
  ShieldAlert,
  UserCheck,
  GraduationCap,
  School,
  Lock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { UserRole } from '../types';
import { SCHOOL_NAME } from '../mockData';

export const LoginView: React.FC = () => {
  const { login, currentUser } = useSchool();
  const { tactileClick } = useTactileFeedback();

  const [selectedChildForParentLogin, setSelectedChildForParentLogin] = useState('STD-1001');

  const handleRoleLogin = (role: UserRole) => {
    tactileClick(role === 'super_admin' ? 'alert' : 'success');
    login(role, 1, role === 'parent' ? selectedChildForParentLogin : undefined);
  };

  const parentOptions = [
    { id: 'STD-1001', name: 'Jeremiah Kollie', child: 'Emmanuel Kollie (Grade 10 Science)' },
    { id: 'STD-0701', name: 'Fatu Kromah', child: 'Musu Kromah (Grade 7 - Junior High)' },
    { id: 'STD-1004', name: 'Solomon Teah', child: 'Blessing Teah (Grade 10 Arts)' },
    { id: 'STD-1015', name: 'Joseph Boakai Sr.', child: 'Joseph Boakai Jr. (Grade 11 Science)' },
    { id: 'STD-1016', name: 'William Tubman', child: 'Comfort Tubman (Grade 12 Arts)' },
  ];

  return (
    <div className="max-w-md mx-auto py-8 px-2 space-y-6 animate-in fade-in duration-200">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 via-slate-900 to-black border-2 border-blue-500/50 flex items-center justify-center mx-auto shadow-xl">
          <School className="w-9 h-9 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold font-display text-white tracking-tight">
          {SCHOOL_NAME}
        </h2>
        <p className="text-xs text-slate-400">
          Liberia National High School SMS &bull; Junior to Senior High RBAC
        </p>
      </div>

      {/* Role Testing Card */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lock className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Select Authentication Profile</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Select a role below to simulate Role-Based Access Control (RBAC). The <strong className="text-red-400">Global Super Admin Navbar</strong> will only appear for the Super Admin role.
        </p>

        {/* Action Button 1: Login as Super Admin */}
        <button
          onClick={() => handleRoleLogin('super_admin')}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-red-950 via-slate-900 to-black hover:from-red-900 hover:to-slate-800 border-2 border-red-600/80 text-left shadow-lg active:scale-95 transition-all group min-h-[64px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-600 text-white shadow-md shadow-red-600/40 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">Login as Super Admin</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-bold">
                    SYSTEM CONTROL
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Full multi-tenant school switcher &amp; global audit logs
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Action Button 2: Login as School Admin */}
        <button
          onClick={() => handleRoleLogin('admin')}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-black hover:from-blue-900 hover:to-slate-800 border-2 border-blue-600/80 text-left shadow-lg active:scale-95 transition-all group min-h-[64px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/40 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">Login as School Admin</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-600 text-white font-bold">
                    PRINCIPAL
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Add parents, view debtors, manage attendance &amp; high school streams
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Action Button 3: Login as Teacher */}
        <button
          onClick={() => handleRoleLogin('teacher')}
          className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left active:scale-95 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white">Login as Classroom Teacher</span>
                <p className="text-[11px] text-slate-400">
                  Fast attendance &amp; gradebook entry (Junior to Senior High)
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Action Button 4: Login as Parent (with child selection) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-black border-2 border-emerald-600/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-600/40">
                <School className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white">Login as Parent</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                    PARENT PORTAL
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Track child routine, timetable, WAEC prep &amp; teacher advice
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                Select Child to Track:
              </label>
              <select
                value={selectedChildForParentLogin}
                onChange={(e) => setSelectedChildForParentLogin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
              >
                {parentOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.child} &bull; {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleRoleLogin('parent')}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/40 active:scale-95 transition-all self-end sm:self-auto"
            >
              <span>Access Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Current session info */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
        Active Session: <strong className="text-white">{currentUser.name}</strong> &bull; Role:{' '}
        <span className="font-mono text-emerald-400 font-bold uppercase">{currentUser.role}</span>
      </div>
    </div>
  );
};
