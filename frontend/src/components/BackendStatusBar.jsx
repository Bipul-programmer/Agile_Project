import React, { useState } from 'react';
import { Wifi, RefreshCw, Smartphone, Layers, Maximize2, Server, HelpCircle } from 'lucide-react';

export default function BackendStatusBar({
  isBackendConnected,
  onCheckConnection,
  viewMode,
  setViewMode,
  isChecking = false,
}) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 py-1.5 md:px-4 md:py-2.5 z-40 sticky top-0 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
        {/* Left: Backend Status indicator */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <span
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                isBackendConnected
                  ? 'bg-emerald-500 ring-4 ring-emerald-100 animate-pulse'
                  : 'bg-amber-500 ring-4 ring-amber-100'
              }`}
            ></span>
            <span className="font-bold text-[11px] md:text-xs text-slate-800">
              {isBackendConnected ? (
                <span className="text-emerald-700">Django API: Connected</span>
              ) : (
                <span className="text-amber-700">Demo Mode: Offline Ready</span>
              )}
            </span>
          </div>

          <button
            onClick={onCheckConnection}
            disabled={isChecking}
            className="flex items-center space-x-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition active:scale-95 text-[10px] md:text-[11px]"
            title="Ping http://localhost:8000/api/categories/"
          >
            <RefreshCw className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isChecking ? 'Checking...' : 'Check API'}</span>
          </button>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            title="Backend Integration Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: View Mode Toggle (Only shown on desktop / tablet screens >= 768px) */}
        <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl space-x-1 border border-slate-200/60">
          <button
            onClick={() => setViewMode('showcase')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition ${
              viewMode === 'showcase'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dribbble 3-Screen View</span>
          </button>

          <button
            onClick={() => setViewMode('interactive')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition ${
              viewMode === 'interactive'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Mobile</span>
          </button>

          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition ${
              viewMode === 'desktop'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Responsive Web</span>
          </button>
        </div>
      </div>

      {/* Backend Integration Info popup */}
      {showHelp && (
        <div className="max-w-7xl mx-auto mt-2 p-3 bg-blue-50/90 border border-blue-200 rounded-xl text-blue-950 text-xs flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              Backend Endpoints Integrated:
            </p>
            <p className="text-[11px] text-blue-800">
              • <code>GET /api/items/</code> (with search, category, and kind filter)<br />
              • <code>POST /api/items/</code> (multipart image upload + title, category, date, location)<br />
              • <code>POST /api/items/&#123;id&#125;/claim/</code> (submit verification & proof of ownership)<br />
              • <code>POST /api/claims/&#123;id&#125;/approve/</code> & <code>reject/</code><br />
              • <code>POST /api/items/&#123;id&#125;/resolve/</code><br />
              • <code>POST /api/auth/login/</code> & <code>register/</code> (DRF Token authentication)
            </p>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="text-blue-500 hover:text-blue-700 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

