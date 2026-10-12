import React from 'react';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { WifiOff, Cpu, HardDrive } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex items-center gap-2.5 rounded-xl bg-amber-950/90 border border-amber-500/50 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-400" />
      <div>
        <span className="font-semibold block text-[11px] text-white">Offline Mode Active</span>
        <span className="text-[10px] text-amber-300/80">Using cached interactions & Local Gemma WebGPU</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
