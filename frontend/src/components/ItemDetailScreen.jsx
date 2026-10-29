import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  MapPin,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
  Share2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import StatusBar from './StatusBar';

export default function ItemDetailScreen({
  item,
  onBack,
  onVerifyItem,
  onContactSecurity,
  onResolveItem,
  isReporter = false,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  if (!item) return null;

  // Formatting date for Screen 3
  const relativeDate = item.title?.toLowerCase().includes('airpod')
    ? '2 days ago'
    : item.date_occurred || '2 days ago';

  // Match criteria list
  const matchCriteria = item.match_criteria || [
    { label: 'Same category', matched: true },
    { label: 'Similar location', matched: true },
    { label: 'Similar time', matched: true },
  ];

  const matchScore = item.match_percentage || 98;
  const isResolved = item.status === 'resolved';

  return (
    <div className="relative flex flex-col h-full w-full bg-white overflow-hidden text-slate-800 select-none">
      {/* iOS Status Bar */}
      <StatusBar time="9:41" />

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 md:py-3 relative z-20">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-90 transition"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {isResolved ? 'Resolved item' : 'Possible match'}
        </h1>

        {/* 3-dots Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-90 transition"
            aria-label="Options"
          >
            <MoreVertical className="w-4 h-4 stroke-[2.5]" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setShowMenu(false);
                  alert('Item link copied to clipboard!');
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Share item</span>
              </button>
              {!isResolved && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onResolveItem?.(item.id);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 text-emerald-600 font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Mark as Given to Owner</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-1 pb-10 space-y-4">
        {/* Large Image Card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] aspect-[1.25/1]">
          <img
            src={
              item.image ||
              (item.title?.toLowerCase().includes('bottle')
                ? 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80'
                : item.title?.toLowerCase().includes('wallet')
                ? 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80')
            }
            alt={item.title}
            className="w-full h-full object-cover"
          />

          {/* Carousel Pagination Dots */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center space-x-1.5">
            <span
              onClick={() => setActiveSlide(0)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeSlide === 0 ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-300'
              }`}
            ></span>
            <span
              onClick={() => setActiveSlide(1)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeSlide === 1 ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-300'
              }`}
            ></span>
            <span
              onClick={() => setActiveSlide(2)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeSlide === 2 ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-300'
              }`}
            ></span>
          </div>

          {/* Green Match Badge on Bottom Right */}
          <div className="absolute bottom-3 right-3 bg-[#22C55E] text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
            {matchScore}%
          </div>

          {/* Given to Owner Overlay Badge */}
          {isResolved && (
            <div className="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-sm text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 ring-2 ring-white/60 animate-fade-in">
              <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              <span>GIVEN TO OWNER</span>
            </div>
          )}
        </div>

        {/* Celebratory Banner if Resolved */}
        {isResolved && (
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-3.5 flex items-center space-x-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                <span>Item Given to Owner</span>
                <span className="bg-emerald-200 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  VERIFIED
                </span>
              </h4>
              <p className="text-[11px] text-emerald-700 leading-snug mt-0.5">
                This item has been safely identified and returned to its rightful owner.
              </p>
            </div>
          </div>
        )}

        {/* Title and Time Row */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {item.title}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {relativeDate}
            </span>
          </div>

          {/* Location Row */}
          <div className="flex items-center text-xs text-slate-500 font-medium mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 stroke-[2]" />
            <span>{item.location || 'Main gate'}</span>
          </div>
        </div>

        {/* Checklist / Match Criteria */}
        <div className="space-y-2.5 pt-1">
          {matchCriteria.map((criterion, index) => (
            <div key={index} className="flex items-center space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-[#3897F0] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-white stroke-[3.5]" />
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {criterion.label}
              </span>
            </div>
          ))}
        </div>

        {/* Verified by Campus Security Badge */}
        <div className="rounded-2xl border border-sky-300 bg-sky-50/70 p-3 flex items-center justify-center space-x-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
          <span className="text-xs font-bold text-slate-800">
            Verified by campus security
          </span>
        </div>

        {/* Ownership Notice */}
        <p className="text-[11px] text-slate-400 leading-snug">
          {isResolved
            ? 'This case is marked resolved and closed.'
            : 'Some details are hidden until you verify ownership.'}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {isResolved ? (
            <div className="w-full bg-emerald-500 text-white py-3.5 rounded-full font-extrabold text-xs shadow-md shadow-emerald-500/20 text-center flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Given to Owner (Case Closed)</span>
            </div>
          ) : (
            <>
              {/* Verify my item (Primary Blue Button) */}
              <button
                onClick={() => onVerifyItem(item)}
                className="w-full bg-[#3897F0] hover:bg-[#2585E5] active:scale-[0.98] text-white py-3.5 rounded-full font-bold text-xs shadow-[0_6px_20px_rgba(56,151,240,0.35)] transition"
              >
                Verify my item
              </button>

              {/* Quick Mark as Given to Owner */}
              <button
                onClick={() => onResolveItem?.(item.id)}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-full font-bold text-xs border border-emerald-200 transition flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Mark as Given to Owner</span>
              </button>

              {/* Contact security (Secondary Outline Button) */}
              <button
                onClick={onContactSecurity}
                className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 py-2.5 rounded-full font-bold text-xs border border-slate-700/80 transition"
              >
                Contact security
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

