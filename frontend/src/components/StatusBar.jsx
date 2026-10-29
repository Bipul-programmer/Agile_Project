import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export default function StatusBar({ time = '9:41' }) {
  return (
    <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 text-slate-800 select-none text-xs font-semibold">
      <span className="status-bar-time tracking-tight">{time}</span>
      <div className="flex items-center space-x-1.5">
        {/* Cellular 4 bars */}
        <div className="flex items-end space-x-[2px] h-3">
          <div className="w-[3px] h-1.5 bg-slate-800 rounded-sm"></div>
          <div className="w-[3px] h-2 bg-slate-800 rounded-sm"></div>
          <div className="w-[3px] h-2.5 bg-slate-800 rounded-sm"></div>
          <div className="w-[3px] h-3 bg-slate-800 rounded-sm"></div>
        </div>
        <Wifi className="w-3.5 h-3.5 text-slate-800 stroke-[2.5]" />
        <div className="flex items-center pl-0.5">
          <div className="w-5 h-2.5 border-[1.5px] border-slate-800 rounded-[4px] p-[1px] flex items-center">
            <div className="h-full w-3.5 bg-slate-800 rounded-[1.5px]"></div>
          </div>
          <div className="w-[1.5px] h-1 bg-slate-800 rounded-r-sm"></div>
        </div>
      </div>
    </div>
  );
}

