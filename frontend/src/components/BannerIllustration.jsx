import React from 'react';

export default function BannerIllustration() {
  return (
    <div className="relative w-32 h-28 flex items-center justify-center select-none pointer-events-none">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-blue-300/30 rounded-full blur-xl transform scale-90"></div>

      {/* Floating exclamation badge */}
      <div className="absolute top-1 right-2 z-20 bg-blue-400 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white/80 animate-bounce duration-1000">
        <span className="text-xs font-black">!</span>
      </div>

      {/* 3D Backpack Graphic */}
      <svg className="w-24 h-24 drop-shadow-lg z-10" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Backpack Body */}
        <defs>
          <linearGradient id="bpGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8EC5FC" />
            <stop offset="1" stopColor="#5B93E8" />
          </linearGradient>
          <linearGradient id="pocketGrad" x1="30" y1="60" x2="90" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A0D0FF" />
            <stop offset="1" stopColor="#6DA1ED" />
          </linearGradient>
          <linearGradient id="phoneGrad" x1="60" y1="30" x2="105" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#EEF4FF" />
          </linearGradient>
        </defs>

        {/* Top Handle */}
        <path d="M48 32 C48 22, 72 22, 72 32" stroke="#4D84DA" strokeWidth="5" strokeLinecap="round" />

        {/* Main Backpack Bag */}
        <rect x="28" y="30" width="64" height="66" rx="22" fill="url(#bpGrad)" />
        <rect x="28" y="30" width="64" height="66" rx="22" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Front Pocket */}
        <rect x="36" y="58" width="48" height="34" rx="12" fill="url(#pocketGrad)" />
        <rect x="36" y="58" width="48" height="34" rx="12" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Question Mark on Pocket */}
        <text x="60" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="bold" opacity="0.9" fontFamily="sans-serif">?</text>

        {/* Smartphone leaning on backpack */}
        <g transform="translate(62, 34) rotate(4)">
          <rect x="0" y="0" width="38" height="62" rx="8" fill="url(#phoneGrad)" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.15))" />
          <rect x="2" y="2" width="34" height="58" rx="6" fill="#F8FAFC" />
          {/* Phone Screen Cloud Upload Graphic */}
          <rect x="6" y="8" width="26" height="34" rx="4" fill="#3B82F6" opacity="0.85" />
          {/* Cloud icon */}
          <path d="M14 26 C12 26 11 24.5 11 23 C11 21.5 12.5 20.5 14 20.5 C14.5 18.5 16.5 17 19 17 C21.5 17 23.5 18.5 24 20.5 C25.5 20.5 27 21.5 27 23 C27 24.5 26 26 24 26 Z" fill="#FFFFFF" />
          {/* Arrow up */}
          <path d="M19 23 L19 28 M17 25 L19 23 L21 25" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Document / Card indicator lines */}
          <rect x="6" y="46" width="16" height="3" rx="1.5" fill="#CBD5E1" />
          <rect x="6" y="51" width="22" height="2.5" rx="1" fill="#E2E8F0" />
        </g>

        {/* Hanging ID badge card */}
        <g transform="translate(18, 64) rotate(-8)">
          <rect x="0" y="0" width="28" height="18" rx="3" fill="#FFFFFF" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          <rect x="3" y="3" width="7" height="8" rx="1.5" fill="#93C5FD" />
          <rect x="12" y="4" width="12" height="2" rx="1" fill="#CBD5E1" />
          <rect x="12" y="8" width="8" height="2" rx="1" fill="#E2E8F0" />
          <rect x="3" y="13" width="22" height="2" rx="1" fill="#3B82F6" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

