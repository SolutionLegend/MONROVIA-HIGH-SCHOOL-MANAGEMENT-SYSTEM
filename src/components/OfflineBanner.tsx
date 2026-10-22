import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500/90 text-slate-950 px-3.5 py-1.5 flex items-center justify-between text-xs font-medium border-b border-amber-600 print:hidden animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span className="font-semibold">Offline Mode Active:</span>
        <span className="text-slate-900 hidden xs:inline">Grades & attendance are saved locally to device.</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-[11px] bg-amber-600/40 px-2 py-0.5 rounded font-bold">
        <Database className="w-3 h-3" />
        <span>LOCAL CACHE</span>
      </div>
    </div>
  );
};
