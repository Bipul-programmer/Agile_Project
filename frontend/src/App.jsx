import React, { useState, useEffect, useCallback } from 'react';
import BackendStatusBar from './components/BackendStatusBar';
import ThreeScreenShowcase from './components/ThreeScreenShowcase';
import HomeScreen from './components/HomeScreen';
import ReportScreen from './components/ReportScreen';
import ItemDetailScreen from './components/ItemDetailScreen';
import ClaimModal from './components/ClaimModal';
import ContactSecurityModal from './components/ContactSecurityModal';
import ProfileDrawer from './components/ProfileDrawer';
import {
  getCategories,
  getItems,
  getItemById,
  createItem,
  claimItem,
  decideClaim,
  resolveItem,
  getLocalClaims,
} from './api/items';
import {
  checkBackendConnection,
  getStoredUser,
  setStoredUser,
} from './api/client';
import { loginUser } from './api/auth';
import { INITIAL_ITEMS } from './data/mockFallback';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState('showcase'); // 'showcase' | 'interactive' | 'desktop'
  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'report' | 'detail'
  const [isMobileScreen, setIsMobileScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobileScreen(window.innerWidth < 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Modals & Drawers
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isContactSecurityOpen, setIsContactSecurityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Data State
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(INITIAL_ITEMS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedKind, setSelectedKind] = useState('all');
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [myClaims, setMyClaims] = useState(getLocalClaims());

  // Status & Loaders
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  // Check backend health
  const checkHealth = useCallback(async () => {
    setIsCheckingBackend(true);
    const connected = await checkBackendConnection();
    setIsBackendConnected(connected);
    setIsCheckingBackend(false);
  }, []);

  // Fetch Categories
  const loadCategories = useCallback(async () => {
    const res = await getCategories();
    setCategories(res.data);
    if (res.isBackend) setIsBackendConnected(true);
  }, []);

  // Fetch Items
  const loadItems = useCallback(async () => {
    const res = await getItems({
      search: searchQuery,
      category: selectedCategory,
      kind: selectedKind,
    });
    setItems(res.items);
    if (res.isBackend) setIsBackendConnected(true);

    // Keep selectedItem updated
    if (selectedItem) {
      const found = res.items.find((i) => i.id === selectedItem.id);
      if (found) setSelectedItem(found);
    }
  }, [searchQuery, selectedCategory, selectedKind, selectedItem]);

  // Initial mount
  useEffect(() => {
    checkHealth();
    loadCategories();
    loadItems();
  }, []);

  // Trigger search / filters
  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems();
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedKind]);

  // Actions
  async function handleSubmitReport(formData, dataObj) {
    setIsSubmittingReport(true);
    try {
      const res = await createItem(formData);
      if (res?.item) {
        setItems((prev) => [res.item, ...prev.filter((i) => i.id !== res.item.id)]);
        setSelectedItem(res.item);
      }
      await loadItems();
      return res?.item;
    } finally {
      setIsSubmittingReport(false);
    }
  }

  async function handleVerifyItem(item) {
    setSelectedItem(item);
    setIsClaimModalOpen(true);
  }

  async function handleSubmitClaim(itemId, message) {
    setIsSubmittingClaim(true);
    try {
      const res = await claimItem(itemId, message);
      setMyClaims(getLocalClaims());
      return res.claim;
    } finally {
      setIsSubmittingClaim(false);
    }
  }

  async function handleResolveItem(itemId) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === Number(itemId) || String(i.id) === String(itemId)
          ? { ...i, status: 'resolved' }
          : i
      )
    );
    setSelectedItem((prev) =>
      prev && (prev.id === Number(itemId) || String(prev.id) === String(itemId))
        ? { ...prev, status: 'resolved' }
        : prev
    );
    await resolveItem(itemId);
    await loadItems();
  }

  async function handleDecideClaim(claimId, decision) {
    await decideClaim(claimId, decision);
    setMyClaims(getLocalClaims());
    await loadItems();
  }

  async function handleLogin(username, password) {
    const res = await loginUser(username, password);
    setCurrentUser(res.user);
    await checkHealth();
    await loadItems();
  }

  function handleSwitchUser(user) {
    setCurrentUser(user);
    setStoredUser(user);
  }

  return (
    <div className="min-h-screen bg-[#E8F2FD] flex flex-col font-sans">
      {/* Top Backend Status & View Mode Bar */}
      <BackendStatusBar
        isBackendConnected={isBackendConnected}
        onCheckConnection={checkHealth}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isChecking={isCheckingBackend}
      />

      {/* Main Viewport Container */}
      <main className={`flex-1 flex items-center justify-center ${isMobileScreen ? 'p-0 w-full' : 'p-2 sm:p-6'}`}>
        {/* On Mobile Screens: Native Fullscreen Edge-to-Edge Experience */}
        {isMobileScreen ? (
          <div className="w-full h-[calc(100dvh-38px)] max-w-md bg-white overflow-hidden relative flex flex-col">
            {activeScreen === 'home' && (
              <HomeScreen
                items={items}
                categories={categories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedKind={selectedKind}
                setSelectedKind={setSelectedKind}
                onSelectItem={(item) => {
                  setSelectedItem(item);
                  setActiveScreen('detail');
                }}
                onNavigateReport={() => setActiveScreen('report')}
                onOpenProfile={() => setIsProfileOpen(true)}
                currentUser={currentUser}
              />
            )}

            {activeScreen === 'report' && (
              <ReportScreen
                categories={categories}
                onBack={() => setActiveScreen('home')}
                onSubmitReport={handleSubmitReport}
                isSubmitting={isSubmittingReport}
              />
            )}

            {activeScreen === 'detail' && (
              <ItemDetailScreen
                item={selectedItem}
                onBack={() => setActiveScreen('home')}
                onVerifyItem={handleVerifyItem}
                onContactSecurity={() => setIsContactSecurityOpen(true)}
                onResolveItem={handleResolveItem}
                isReporter={selectedItem?.is_owner}
              />
            )}
          </div>
        ) : (
          /* Desktop Modes: Showcase, Interactive Phone Mockup, or Responsive Web */
          <>
            {/* MODE 1: Dribbble 3-Screen Side-by-Side Showcase (Matching Screenshot Exactly) */}
            {viewMode === 'showcase' && (
              <ThreeScreenShowcase
                items={items}
                categories={categories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedKind={selectedKind}
                setSelectedKind={setSelectedKind}
                selectedItem={selectedItem}
                onSelectItem={(item) => {
                  setSelectedItem(item);
                }}
                onNavigateReport={() => {
                  // Focus interactive mode on report
                  setViewMode('interactive');
                  setActiveScreen('report');
                }}
                onOpenProfile={() => setIsProfileOpen(true)}
                currentUser={currentUser}
                onSubmitReport={handleSubmitReport}
                isSubmittingReport={isSubmittingReport}
                onVerifyItem={handleVerifyItem}
                onContactSecurity={() => setIsContactSecurityOpen(true)}
                onResolveItem={handleResolveItem}
              />
            )}

            {/* MODE 2: Single Interactive iPhone Mobile Device */}
            {viewMode === 'interactive' && (
              <div className="w-[380px] h-[790px] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(30,64,175,0.25)] border-[8px] border-white overflow-hidden relative flex flex-col">
                {activeScreen === 'home' && (
                  <HomeScreen
                    items={items}
                    categories={categories}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedKind={selectedKind}
                    setSelectedKind={setSelectedKind}
                    onSelectItem={(item) => {
                      setSelectedItem(item);
                      setActiveScreen('detail');
                    }}
                    onNavigateReport={() => setActiveScreen('report')}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    currentUser={currentUser}
                  />
                )}

                {activeScreen === 'report' && (
                  <ReportScreen
                    categories={categories}
                    onBack={() => setActiveScreen('home')}
                    onSubmitReport={handleSubmitReport}
                    isSubmitting={isSubmittingReport}
                  />
                )}

                {activeScreen === 'detail' && (
                  <ItemDetailScreen
                    item={selectedItem}
                    onBack={() => setActiveScreen('home')}
                    onVerifyItem={handleVerifyItem}
                    onContactSecurity={() => setIsContactSecurityOpen(true)}
                    onResolveItem={handleResolveItem}
                    isReporter={selectedItem?.is_owner}
                  />
                )}
              </div>
            )}

            {/* MODE 3: Responsive Desktop / Tablet Layout */}
            {viewMode === 'desktop' && (
              <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <HomeScreen
                    items={items}
                    categories={categories}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedKind={selectedKind}
                    setSelectedKind={setSelectedKind}
                    onSelectItem={(item) => setSelectedItem(item)}
                    onNavigateReport={() => {
                      setViewMode('interactive');
                      setActiveScreen('report');
                    }}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    currentUser={currentUser}
                  />
                </div>
                <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-slate-200/80 md:pl-8">
                  <ItemDetailScreen
                    item={selectedItem}
                    onBack={() => {}}
                    onVerifyItem={handleVerifyItem}
                    onContactSecurity={() => setIsContactSecurityOpen(true)}
                    onResolveItem={handleResolveItem}
                    isReporter={selectedItem?.is_owner}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Drawers */}
      {isClaimModalOpen && (
        <ClaimModal
          item={selectedItem}
          onClose={() => setIsClaimModalOpen(false)}
          onSubmitClaim={handleSubmitClaim}
          isSubmitting={isSubmittingClaim}
        />
      )}

      {isContactSecurityOpen && (
        <ContactSecurityModal
          onClose={() => setIsContactSecurityOpen(false)}
        />
      )}

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        myItems={items.filter((i) => i.is_owner || i.reporter === currentUser.username)}
        myClaims={myClaims}
        onResolveItem={handleResolveItem}
        onDecideClaim={handleDecideClaim}
        onSwitchUser={handleSwitchUser}
        onLogin={handleLogin}
        isBackendConnected={isBackendConnected}
      />
    </div>
  );
}

