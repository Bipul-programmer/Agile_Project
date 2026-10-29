import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  KeyRound,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function ProfileDrawer({
  isOpen,
  onClose,
  currentUser,
  myItems = [],
  myClaims = [],
  onResolveItem,
  onDecideClaim,
  onSwitchUser,
  onLogin,
  isBackendConnected,
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'items' | 'claims' | 'auth'
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setAuthError('');
    try {
      await onLogin(authUsername, authPassword);
      setActiveTab('profile');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{currentUser?.username || 'Lisbon'}</h3>
              <p className="text-xs text-slate-400">{currentUser?.university || 'oxford university'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 mr-4 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-3 mr-4 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'items'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>My Posts</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">
              {myItems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`py-3 mr-4 border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'claims'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>Claims</span>
            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">
              {myClaims.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'auth'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs no-scrollbar">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" /> Email
                  </span>
                  <span className="font-semibold text-slate-800">{currentUser?.email || 'lisbon@oxford.ac.uk'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-500" /> Campus
                  </span>
                  <span className="font-semibold text-slate-800">{currentUser?.university || 'Oxford University'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Status
                  </span>
                  <span className="font-semibold text-emerald-600">Student Verified</span>
                </div>
              </div>

              {/* Fast Account Switcher for Testing */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Switch Account</p>
                <button
                  onClick={() =>
                    onSwitchUser({
                      id: 1,
                      username: 'Lisbon',
                      email: 'lisbon@oxford.ac.uk',
                      university: 'oxford university',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                    })
                  }
                  className="w-full p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between hover:bg-blue-100/70 transition"
                >
                  <div className="text-left">
                    <p className="font-bold text-blue-900">Lisbon (Oxford Student)</p>
                    <p className="text-[11px] text-blue-600">Primary student profile from design</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                </button>

                <button
                  onClick={() =>
                    onSwitchUser({
                      id: 2,
                      username: 'security_officer',
                      email: 'security@oxford.ac.uk',
                      university: 'Campus Security Lodge',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    })
                  }
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-800">Campus Security Officer</p>
                    <p className="text-[11px] text-slate-400">Reporter of AirPods case</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-3">
              {myItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>You haven't reported any items yet.</p>
                </div>
              ) : (
                myItems.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          item.status === 'resolved'
                            ? 'bg-slate-200 text-slate-600'
                            : item.status === 'claimed'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.location} • {item.date_occurred}</p>
                    {item.status !== 'resolved' && (
                      <button
                        onClick={() => onResolveItem(item.id)}
                        className="w-full py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="space-y-3">
              {myClaims.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No claims submitted or received yet.</p>
                </div>
              ) : (
                myClaims.map((claim) => (
                  <div key={claim.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">{claim.item_title || 'Item claim'}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : claim.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                      "{claim.message}"
                    </p>
                    {claim.contact_email && (
                      <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Contact: {claim.contact_email}</span>
                      </div>
                    )}
                    {claim.status === 'pending' && onDecideClaim && (
                      <div className="flex space-x-2 pt-1">
                        <button
                          onClick={() => onDecideClaim(claim.id, 'approve')}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onDecideClaim(claim.id, 'reject')}
                          className="flex-1 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'auth' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <p className="text-slate-500">
                Log in with your Django backend account credentials to fetch live data from the database.
              </p>
              <div>
                <label className="text-[11px] font-bold text-slate-700">Username</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="e.g. lisbon or admin"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {authError && <p className="text-xs text-red-500">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#3897F0] hover:bg-blue-600 text-white font-bold transition shadow-sm"
              >
                Sign In to Django API
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-400 text-center">
          Oxford Campus Lost & Found System v1.0
        </div>
      </div>
    </div>
  );
}

