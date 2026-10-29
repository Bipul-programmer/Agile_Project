import React, { useState } from 'react';
import { Search, MapPin, ChevronRight, Menu, Home, Plus, User, X, Check } from 'lucide-react';
import StatusBar from './StatusBar';
import BannerIllustration from './BannerIllustration';

export default function HomeScreen({
  items = [],
  categories = [],
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedKind,
  setSelectedKind,
  onSelectItem,
  onNavigateReport,
  onOpenProfile,
  currentUser,
}) {
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Format date helper matching "2 days ago", "Yesterday, 4:15 PM"
  function formatRelativeDate(item) {
    if (!item.date_occurred && !item.created_at) return 'Just now';
    const dateStr = item.date_occurred || item.created_at;
    const itemDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Just now';
    if (diffDays === 1) return 'Yesterday, 4:15 PM';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getItemImage(item) {
    if (item?.image) return item.image;
    const t = item?.title?.toLowerCase() || '';
    if (t.includes('bottle')) {
      return 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80';
    }
    if (t.includes('wallet')) {
      return 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80';
    }
    if (t.includes('key')) {
      return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80';
  }

  const itemsToDisplay = items && items.length > 0 ? items : [];
  const displayedItems = showAllPosts ? itemsToDisplay : itemsToDisplay.slice(0, 5);

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-b from-[#D8EBFC] via-[#EDF5FD] to-white overflow-hidden text-slate-800 select-none">
      {/* iOS Status Bar */}
      <StatusBar time="9:41" />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 md:pt-2 pb-28 space-y-4 sm:space-y-5">
        {/* Top Header: Profile + Hamburger Menu */}
        <div className="flex items-center justify-between pt-1">
          <div
            onClick={onOpenProfile}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-blue-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition leading-tight">
                {currentUser?.username || 'Lisbon'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentUser?.university || 'oxford university'}
              </p>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-slate-700 stroke-[2.2]" />
          </button>
        </div>

        {/* Hero Headline */}
        <div className="pt-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
            Lost something?
            <br />
            <span className="text-slate-800 font-bold">We'll help bring it back</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-white rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100/80 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition">
            <Search className="w-4 h-4 text-slate-700 stroke-[2.5] mr-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lost or found items..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Kind Filter Chips (All, Found, Lost) */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'found', label: 'Found Items' },
            { id: 'lost', label: 'Lost Items' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedKind(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedKind === tab.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/60'
                }`}
            >
              {tab.label}
            </button>
          ))}
          {categories.length > 0 && selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center space-x-1"
            >
              <span>Category filter</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Blue Gradient Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3897F0] via-[#2F80ED] to-[#1D6BD6] p-5 text-white shadow-[0_10px_25px_rgba(47,128,237,0.25)]">
          {/* Subtle Background Glow Circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-8 left-16 w-24 h-24 bg-blue-400/20 rounded-full blur-lg pointer-events-none"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-2 max-w-[170px]">
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                Lost any item?
              </h3>
              <p className="text-[11px] text-blue-100/90 leading-snug">
                Report it and we'll look for a match
              </p>
              <div className="pt-1">
                <button
                  onClick={onNavigateReport}
                  className="bg-white text-[#2F80ED] hover:bg-blue-50 active:scale-95 px-4 py-2 rounded-full text-xs font-bold shadow-sm transition inline-block cursor-pointer"
                >
                  Report now
                </button>
              </div>
            </div>

            {/* 3D Illustration matching the Dribbble shot */}
            <BannerIllustration />
          </div>
        </div>

        {/* Recent Posts Section Header */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent posts
            </h2>
            <button
              onClick={() => setShowAllPosts(!showAllPosts)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              {showAllPosts ? 'show less' : 'view all'}
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-3">
            {displayedItems.length > 0 && displayedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`rounded-2xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border transition flex items-center justify-between cursor-pointer group active:scale-[0.99] ${
                  item.status === 'resolved'
                    ? 'bg-emerald-50/30 border-emerald-200/80 hover:border-emerald-300'
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                {/* Left Thumbnail Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={getItemImage(item)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {item.status === 'resolved' ? (
                    <div className="absolute top-1 left-1 bg-emerald-600 text-white p-0.5 rounded-full shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                    </div>
                  ) : item.match_percentage ? (
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1 rounded">
                      {item.match_percentage}%
                    </div>
                  ) : null}
                </div>

                {/* Middle Details */}
                <div className="flex-1 px-3.5 min-w-0">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">
                      <span className="capitalize text-slate-700">
                        {item.kind === 'found' ? 'Found' : 'Lost'}
                      </span>{' '}
                      - {item.title}
                    </h4>
                  </div>

                  {item.status === 'resolved' ? (
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                        <span>Given to Owner</span>
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {formatRelativeDate(item)}
                      </p>
                      <div className="flex items-center text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                        <span className="truncate">{item.location || 'Campus'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Chevron */}
                <div className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition shrink-0 pl-1">
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            ))
            }
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar (Pill design matching screenshot) */}
      <div className="absolute bottom-3 sm:bottom-5 inset-x-0 flex justify-center pointer-events-none z-30 pb-safe">
        <div className="pointer-events-auto bg-[#D8E6F5]/90 backdrop-blur-md rounded-full px-5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-white/60 flex items-center space-x-7">
          {/* Home Tab (Active pill indicator) */}
          <button
            className="flex items-center justify-center bg-white shadow-sm w-9 h-9 rounded-full text-slate-900 transition"
            aria-label="Home"
          >
            <Home className="w-4 h-4 text-slate-800 stroke-[2.5]" />
          </button>

          {/* Plus / Add Report Button */}
          <button
            onClick={onNavigateReport}
            className="flex items-center justify-center text-slate-600 hover:text-blue-600 w-8 h-8 rounded-full transition active:scale-90"
            aria-label="Report item"
          >
            <Plus className="w-5 h-5 text-slate-700 stroke-[2.4]" />
          </button>

          {/* Profile / Account Tab */}
          <button
            onClick={onOpenProfile}
            className="flex items-center justify-center text-slate-600 hover:text-blue-600 w-8 h-8 rounded-full transition active:scale-90"
            aria-label="Profile"
          >
            <User className="w-4 h-4 text-slate-700 stroke-[2.4]" />
          </button>
        </div>
      </div>
    </div>
  );
}
