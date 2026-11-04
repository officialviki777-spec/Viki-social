import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface AndroidStatusBarProps {
  isDark?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ isDark = true }) => {
  const [time, setTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full h-8 px-6 flex items-center justify-between text-xs font-semibold select-none z-50 transition-colors ${
        isDark ? 'bg-zinc-950 text-zinc-300' : 'bg-white text-zinc-800'
      }`}
    >
      {/* Time */}
      <span className="tracking-tight font-medium text-[13px]">{time}</span>

      {/* Central Camera Punch Hole cutout representation */}
      <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-800/80 shadow-inner flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-zinc-950" />
      </div>

      {/* Android System Icons */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-tighter opacity-90">5G</span>
        <Wifi className="w-3.5 h-3.5 opacity-90" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono tabular-nums opacity-90">94%</span>
          <Battery className="w-4 h-4 opacity-90 fill-current" />
        </div>
      </div>
    </div>
  );
};
