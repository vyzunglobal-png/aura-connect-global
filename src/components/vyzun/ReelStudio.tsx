import React from 'react';
import { Search, Plus, Play, RotateCw, Heart, Flame, MessageCircle, Swords, Share2, Music } from 'lucide-react';

export function ReelStudio() {
  return (
    <div className="relative w-full h-screen bg-[#070614] text-white flex flex-col justify-between overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute w-[220px] h-[220px] bg-[#9333ea] blur-[90px] top-[-40px] right-[-40px] opacity-60 pointer-events-none"></div>
      <div className="absolute w-[200px] h-[200px] bg-[#2563eb] blur-[90px] bottom-[100px] left-[-40px] opacity-50 pointer-events-none"></div>

      {/* Top Header & Category Tabs */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="w-9 h-9 rounded-full bg-white/10 border border-[#a855f7] flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]">
          <Search className="w-4 h-4 text-[#38bdf8]" />
        </div>
        <div className="flex gap-1.5 bg-black/40 p-1 rounded-full border border-white/10">
          <div className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            <Flame className="w-3 h-3" /> For You
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-1">
            ★ Vibe With
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300">
            Trending
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#9333ea] flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.6)]">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Center Reel Placeholder */}
      <div className="flex-1 relative z-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-[#ec4899] flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.6)] mb-3">
          <Play className="w-6 h-6 text-white ml-0.5" />
        </div>
        <p className="text-lg font-extrabold mb-1">Reels are on the way</p>
        <p className="text-xs text-slate-400 mb-3">Still connecting to live Reels.</p>
        <div className="flex items-center gap-1.5 text-[#38bdf8] text-xs font-bold cursor-pointer">
          <RotateCw className="w-3.5 h-3.5" /> Refresh
        </div>
      </div>

      {/* Right-Side Engagement Sidebar */}
      <div className="absolute right-3 bottom-24 z-10 flex flex-col gap-3.5 items-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ef4444] to-[#ec4899] flex items-center justify-center shadow-[0_0_14px_rgba(239,68,68,0.6)]">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-[11px] font-bold mt-1">12,400</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f97316] to-[#eab308] flex items-center justify-center shadow-[0_0_14px_rgba(249,115,22,0.6)]">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-bold mt-1">890</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center shadow-[0_0_14px_rgba(59,130,246,0.6)]">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-bold mt-1">245</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#6366f1] flex items-center justify-center shadow-[0_0_14px_rgba(168,85,247,0.6)]">
            <Swords className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-bold mt-1">120</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center shadow-[0_0_14px_rgba(6,182,212,0.6)]">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-bold mt-1">Share</span>
        </div>
      </div>

      {/* Bottom Creator Info & Chokotha DP */}
      <div className="relative z-10 p-4 mb-12">
        <div className="flex items-center gap-2.5 mb-2">
          {/* Signature Chokotha DP */}
          <div className="w-[52px] h-[52px] rounded-[16px] bg-gradient-to-br from-[#7c3aed] to-[#db2777] p-[2.5px] shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            <div className="w-full h-full rounded-[14px] bg-[#110c2a] flex items-center justify-center font-extrabold text-white">V</div>
          </div>
          <span className="font-bold text-sm">@creator</span>
          <button className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white font-bold text-xs rounded-full px-4 py-2 shadow-[0_0_16px_rgba(236,72,153,0.5)]">
            ✨ Vibe With
          </button>
        </div>
        <p className="text-xs mb-1 text-slate-200">Caption appears here</p>
        <p className="text-xs font-bold text-[#38bdf8] mb-2">#vyzunaura #pov</p>
        <div className="inline-flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full text-[11px] border border-white/10">
          <Music className="w-3 h-3 text-[#a855f7]" /> Original audio
        </div>
      </div>
    </div>
  );
}
