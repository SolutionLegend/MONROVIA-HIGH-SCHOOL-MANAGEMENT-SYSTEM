import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  GraduationCap,
  AlertCircle,
  FileText,
  User,
  Clock,
  CreditCard,
  Terminal,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useTactileFeedback } from '../hooks/useSoundFeedback';
import { ViewTab } from '../types';

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, stats, currentUser } = useSchool();
  const { tactileClick } = useTactileFeedback();

  // Role-customized navigation items
  let navItems: NavItem[] = [];

  if (currentUser.role === 'parent') {
    navItems = [
      {
        id: 'parent-portal',
        label: 'My Child',
        icon: User,
      },
      {
        id: 'grades',
        label: 'Grades',
        icon: GraduationCap,
      },
      {
        id: 'finance',
        label: 'Tuition',
        icon: CreditCard,
        badge: stats.outstandingLRD > 0 ? 1 : undefined,
        badgeColor: 'bg-red-500',
      },
      {
        id: 'report-card',
        label: 'Report Card',
        icon: FileText,
      },
      {
        id: 'dashboard',
        label: 'School Hub',
        icon: LayoutDashboard,
      },
    ];
  } else if (currentUser.role === 'super_admin') {
    navItems = [
      {
        id: 'dashboard',
        label: 'Global',
        icon: LayoutDashboard,
      },
      {
        id: 'activity-logs',
        label: 'Audit Logs',
        icon: Terminal,
      },
      {
        id: 'attendance',
        label: 'Attendance',
        icon: UserCheck,
      },
      {
        id: 'grades',
        label: 'Grades',
        icon: GraduationCap,
      },
      {
        id: 'finance',
        label: 'Debtors',
        icon: AlertCircle,
        badge: stats.totalDebtors,
        badgeColor: 'bg-red-500',
      },
    ];
  } else {
    // School Admin / Teacher
    navItems = [
      {
        id: 'dashboard',
        label: 'Home',
        icon: LayoutDashboard,
      },
      {
        id: 'attendance',
        label: 'Attendance',
        icon: UserCheck,
      },
      {
        id: 'grades',
        label: 'Grades',
        icon: GraduationCap,
      },
      {
        id: 'finance',
        label: 'Debtors',
        icon: AlertCircle,
        badge: stats.totalDebtors,
        badgeColor: 'bg-red-500',
      },
      {
        id: 'report-card',
        label: 'Reports',
        icon: FileText,
      },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 border-t border-slate-800 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] shadow-2xl print:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                tactileClick(isActive ? 'tap' : 'success');
                setCurrentTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 active:scale-90 touch-manipulation select-none min-h-[56px] ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active tactical glow background pill */}
              {isActive && (
                <span className="absolute inset-x-1.5 inset-y-1 bg-gradient-to-t from-blue-900/60 to-blue-700/30 rounded-xl border border-blue-500/40 -z-10" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-emerald-400' : 'text-slate-400'
                  }`}
                />

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full font-mono min-w-[16px] text-center border border-slate-900 shadow-sm ${
                      item.badgeColor || 'bg-red-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Tiny tactical active dot indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
