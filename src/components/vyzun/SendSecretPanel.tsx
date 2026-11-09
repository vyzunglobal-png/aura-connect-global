import React from 'react';
import { Copy, Share2 } from 'lucide-react';

export default function SecretsTab() {
  return (
    <div className="p-4 bg-[#070614] text-white min-h-screen">
      <h1 className="text-xl font-extrabold mb-4">SECRETS</h1>
      
      {/* Anonymous Link Box with Side-by-Side Pill Buttons */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-pink-500/20 backdrop-blur-md mb-6">
        <p className="text-xs text-slate-400 mb-1">Your anonymous VYZUN link</p>
        <p className="text-base font-extrabold text-[#ec4899] mb-4">vyzun.app/ask/@vyzuner</p>

        <div className="flex gap-3">
          <button className="flex-1 py-3 px-4 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
            <Copy className="w-4 h-4 text-[#a855f7]" /> Copy Link
          </button>
          <button className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(236,72,153,0.5)] transition-all">
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
