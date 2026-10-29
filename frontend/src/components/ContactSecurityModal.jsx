import React from 'react';
import { X, ShieldCheck, Phone, MapPin, Mail, Clock } from 'lucide-react';

export default function ContactSecurityModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Campus Security Lodge
            </h3>
            <p className="text-xs text-slate-400">Oxford University Lost & Found</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-2xl">
            <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Physical Collection Desk</p>
              <p className="text-slate-500 text-[11px]">Main Gate Security Lodge, Broad Street Entrance</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-2xl">
            <Clock className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Desk Hours</p>
              <p className="text-slate-500 text-[11px]">Open 24/7 (ID Verification 08:00 - 20:00 Daily)</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-2xl">
            <Phone className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Direct Telephone</p>
              <p className="text-blue-600 font-semibold text-[11px]">+44 (0)1865 272944</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-2xl">
            <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Security Email</p>
              <p className="text-blue-600 font-semibold text-[11px]">lostandfound@security.ox.ac.uk</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-[11px] text-amber-800 leading-snug">
          Please bring your official Student University Card (Bodleian card) and any relevant purchase receipt or lock-screen PIN when collecting items.
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#3897F0] hover:bg-[#2585E5] text-white py-3 rounded-full font-bold text-xs shadow-md transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

