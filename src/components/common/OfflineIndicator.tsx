import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-zinc-900/95 border border-pink-500/50 px-4 py-2 text-xs font-medium text-pink-300 shadow-xl backdrop-blur-md animate-bounce">
      <WifiOff className="w-3.5 h-3.5 text-pink-400" />
      <span>Offline Mode — Using cached data</span>
    </div>
  );
};
