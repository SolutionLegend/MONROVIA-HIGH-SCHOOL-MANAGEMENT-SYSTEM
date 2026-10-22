import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Download,
  Wifi,
  WifiOff,
  Shield,
  HelpCircle,
  X,
  School,
  Share2,
  UserCircle,
  ShieldAlert,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTactileFeedback } from '../hooks/useSoundFeedback';

export const Header: React.FC = () => {
  const {
    highContrast,
    setHighContrast,
    currentTenant,
    currentUser,
    setCurrentTab,
  } = useSchool();
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { tactileClick } = useTactileFeedback();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const todayFormatted = new Intl.DateTimeFormat('en-LR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const handleInstallClick = () => {
    tactileClick('tap');
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Tenant & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-slate-900 flex items-center justify-center border border-blue-500/40 shadow-sm shrink-0">
              <School className="w-5 h-5 text-emerald-400" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm tracking-tight text-white truncate font-display">
                  {currentTenant.name}
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-900/70 text-blue-300 border border-blue-700/50 hidden sm:inline-block">
                  PWA SMS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 truncate">
                <span>{todayFormatted}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-mono">1st Term</span>
              </p>
            </div>
          </div>

          {/* Tactical Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* User Profile / Role Indicator (Click to Switch Role) */}
            <button
              onClick={() => {
                tactileClick('tap');
                setCurrentTab('login');
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-semibold active:scale-95 transition-all ${
                currentUser.role === 'super_admin'
                  ? 'bg-red-950/70 border-red-700 text-red-200'
                  : currentUser.role === 'admin'
                  ? 'bg-blue-950/70 border-blue-700 text-blue-200'
                  : 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
              }`}
              title="Click to Switch Role / Profile"
            >
              {currentUser.role === 'super_admin' ? (
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <UserCircle className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span className="hidden sm:inline font-mono uppercase text-[10px] font-bold">
                {currentUser.role === 'super_admin'
                  ? 'Super Admin'
                  : currentUser.role === 'admin'
                  ? 'School Admin'
                  : currentUser.role === 'parent'
                  ? 'Parent'
                  : 'Teacher'}
              </span>
            </button>

            {/* Online/Offline Status Indicator */}
            <div
              className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg border ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : 'bg-amber-950/60 text-amber-300 border-amber-800/80 animate-pulse'
              }`}
              title={isOnline ? 'Online - Cloud Sync Active' : 'Offline - Local Storage Mode'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden xs:inline">{isOnline ? 'SYNC' : 'LOCAL'}</span>
            </div>

            {/* Sunlight High Contrast Mode Toggle */}
            <button
              onClick={() => {
                tactileClick('tap');
                setHighContrast((prev) => !prev);
              }}
              title={highContrast ? 'Switch to Dark Mode' : 'Sunlight High Contrast Mode (Outdoors)'}
              className={`p-2 rounded-lg border transition-all active:scale-95 ${
                highContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              aria-label="Toggle sunlight high contrast"
            >
              {highContrast ? <Sun className="w-4 h-4 fill-current" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* In-App PWA Install Button */}
            {!isInstalled && (isInstallable || isIOS) && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide border border-emerald-400 shadow-sm active:scale-95 transition-all"
                title="Install Progressive Web App on Phone"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}

            {/* Help / Tactical Info */}
            <button
              onClick={() => {
                tactileClick('tap');
                setShowInfoModal(true);
              }}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700 active:scale-95 transition-all"
              title="System Information & Tactical Tips"
              aria-label="App info"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* iOS Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-400">Run offline as a native app</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari browser.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-emerald-400">Add to Home Screen</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>Open {currentTenant.name} SMS from your phone screen. Works fully offline!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 active:scale-95 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Info & Tactical Guide Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">{currentTenant.name} SMS Tactical PWA</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                <p className="font-semibold text-white mb-1">⚡ Built for Liberian Schools & Low Bandwidth</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Optimized for budget Android devices under bright sunlight. Zero heavy assets, offline caching, and instant local storage persistence.
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <p className="font-bold text-slate-200">Key Features:</p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                  <li><strong className="text-emerald-400">Fast Attendance:</strong> One-tap &quot;Mark All Present&quot; so teachers only toggle the 2-3 absent students.</li>
                  <li><strong className="text-emerald-400">Auto Gradebook:</strong> Instant calculations: Quiz (20%), Test (30%), Exam (50%) with pass/fail badges.</li>
                  <li><strong className="text-emerald-400">Tuition Debtors & WhatsApp:</strong> One-tap WhatsApp link pre-filled with student balance and Mobile Money payment numbers.</li>
                  <li><strong className="text-emerald-400">Official Report Cards:</strong> Printable single-page report card ready for saving to PDF or physical printer.</li>
                  <li><strong className="text-red-400">Super Admin Top Bar:</strong> Global tenant switcher &amp; network oversight when logged in as super_admin.</li>
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/60 text-[10px] text-blue-300 font-mono">
                Active Tenant: {currentTenant.name} • {currentTenant.county} • User: {currentUser.name} ({currentUser.role})
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
