import React from 'react';
import HomeScreen from './HomeScreen';
import ReportScreen from './ReportScreen';
import ItemDetailScreen from './ItemDetailScreen';

export default function ThreeScreenShowcase({
  items,
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedKind,
  setSelectedKind,
  selectedItem,
  onSelectItem,
  onNavigateReport,
  onOpenProfile,
  currentUser,
  onSubmitReport,
  isSubmittingReport,
  onVerifyItem,
  onContactSecurity,
  onResolveItem,
}) {
  // Use AirPods case or currently selected item for Screen 3
  const possibleMatchItem =
    selectedItem ||
    items.find((i) => i.title?.toLowerCase().includes('airpod')) ||
    items[0];

  return (
    <div className="w-full min-h-[calc(100vh-50px)] bg-[#E8F2FD] py-10 px-4 flex items-center justify-center overflow-x-auto">
      <div className="flex flex-row items-center justify-center gap-8 min-w-[1240px]">
        {/* Screen 1: Home / Feed */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Screen 1 • Feed & Discovery
          </div>
          <div className="w-[375px] h-[780px] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(30,64,175,0.22)] border-[8px] border-white overflow-hidden relative transition hover:shadow-[0_30px_70px_-10px_rgba(30,64,175,0.3)]">
            <HomeScreen
              items={items}
              categories={categories}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedKind={selectedKind}
              setSelectedKind={setSelectedKind}
              onSelectItem={onSelectItem}
              onNavigateReport={onNavigateReport}
              onOpenProfile={onOpenProfile}
              currentUser={currentUser}
            />
          </div>
        </div>

        {/* Screen 2: Report Item ! */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Screen 2 • Report Item !
          </div>
          <div className="w-[375px] h-[780px] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(30,64,175,0.22)] border-[8px] border-white overflow-hidden relative transition hover:shadow-[0_30px_70px_-10px_rgba(30,64,175,0.3)]">
            <ReportScreen
              categories={categories}
              onBack={() => {}}
              onSubmitReport={onSubmitReport}
              isSubmitting={isSubmittingReport}
            />
          </div>
        </div>

        {/* Screen 3: Possible Match / Verification */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Screen 3 • Possible Match & Claim
          </div>
          <div className="w-[375px] h-[780px] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(30,64,175,0.22)] border-[8px] border-white overflow-hidden relative transition hover:shadow-[0_30px_70px_-10px_rgba(30,64,175,0.3)]">
            <ItemDetailScreen
              item={possibleMatchItem}
              onBack={() => {}}
              onVerifyItem={onVerifyItem}
              onContactSecurity={onContactSecurity}
              onResolveItem={onResolveItem}
              isReporter={possibleMatchItem?.is_owner}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

