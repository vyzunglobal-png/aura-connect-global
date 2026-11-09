import React from 'react';
import { QrCode, Shield, Zap, Clapperboard, Wallet, Download } from 'lucide-react';

export default function SettingsHub() {
  return (
    <div className="p-4 bg-[#070614] text-white min-h-screen">
      {/* 3D Hologram QR Card Preview */}
      <div className="max-w-xs mx-auto p-5 rounded-2xl bg-white/[0.03] border-2 border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.4)] flex flex-col items-center mb-6">
        <div className="flex items-center gap-3 w-full mb-4">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#7c3aed] to-[#db2777] p-[2px]">
            <div className="w-full h-full rounded-[10px] bg-[#110c2a] flex items-center justify-center font-bold">V</div>
          </div>
          <div>
            <p className="text-xs font-extrabold">Vyzun Creator</p>
            <p className="text-[10px] text-[#ec4899] font-bold">@vyzuner</p>
          </div>
        </div>

        <div className="w-36 h-36 rounded-xl bg-black border-2 border-dashed border-[#38bdf8] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)] mb-4">
          <QrCode className="w-24 h-24 text-white" />
        </div>

        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#ec4899] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_14px_rgba(236,72,153,0.5)]">
          <Download className="w-3.5 h-3.5" /> DOWNLOAD 3D POSTER
        </button>
      </div>

      {/* Advanced Cyber Settings Grid */}
      <h3 className="text-sm font-bold text-[#ec4899] uppercase tracking-wider mb-3">Advanced Cyber Settings</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
          <Shield className="w-4 h-4 text-[#38bdf8] mb-1.5" />
          <h4 className="text-xs font-bold mb-1">Ultra Privacy</h4>
          <p className="text-[10px] text-slate-400">Ghost Mode & Biometric Lock enabled.</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
          <Zap className="w-4 h-4 text-[#a855f7] mb-1.5" />
          <h4 className="text-xs font-bold mb-1">3D Aura Engine</h4>
          <p className="text-[10px] text-slate-400">Daily 8 AM Vibe notifications active.</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
          <Clapperboard className="w-4 h-4 text-[#ec4899] mb-1.5" />
          <h4 className="text-xs font-bold mb-1">Media Downloads</h4>
          <p className="text-[10px] text-slate-400">Direct 1080p Gallery Reel saving.</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
          <Wallet className="w-4 h-4 text-[#f59e0b] mb-1.5" />
          <h4 className="text-xs font-bold mb-1">Clout Wallet</h4>
          <p className="text-[10px] text-slate-400">Campus bids & auction earnings status.</p>
        </div>
      </div>
    </div>
  );
}
