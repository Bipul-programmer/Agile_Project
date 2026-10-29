import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ClaimModal({ item, onClose, onSubmitClaim, isSubmitting = false }) {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!item) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Please enter proof of ownership details.');
      return;
    }
    setErrorMsg('');
    try {
      await onSubmitClaim(item.id, message.trim());
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit claim.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Claim Submitted!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your proof of ownership has been sent to campus security and the reporter. You will be notified once verified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  Verify Ownership
                </span>
                <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                <p className="text-[11px] text-slate-400">{item.location}</p>
              </div>
            </div>

            <div className="bg-blue-50/70 rounded-2xl p-3 border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <div className="flex items-center space-x-1.5 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Security Verification Requirement</span>
              </div>
              Please describe unique details (scratches, serial number, lock code, exact case color, or contents) to prove this belongs to you.
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Proof of ownership details <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., White AirPods Pro case with small scratch near charging port. My initials LH are inside..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
            )}

            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-full text-xs font-bold text-white bg-[#3897F0] hover:bg-[#2585E5] shadow-md shadow-blue-500/20 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

