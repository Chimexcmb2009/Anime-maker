import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center justify-between gap-3 rounded-2xl bg-amber-500/90 text-slate-950 backdrop-blur-md px-4 py-2.5 text-xs font-semibold shadow-2xl border border-amber-400/40">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-bounce shrink-0" />
        <span>Offline Mode — Cached skits & offline sound synthesizer active</span>
      </div>
      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping shrink-0" />
    </div>
  );
};
