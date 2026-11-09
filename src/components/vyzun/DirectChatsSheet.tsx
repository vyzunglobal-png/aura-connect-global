import React from 'react';

export default function ChatTab() {
  return (
    <div className="p-4 bg-[#070614] text-white min-h-screen">
      <h2 className="text-lg font-bold mb-3 text-[#a855f7]">Cyber-Aura Vibe Inbox</h2>
      
      {/* Campus Vibe Radar */}
      <div className="flex gap-4 overflow-x-auto pb-3 mb-4">
        {['🔥 Hyper', '⚡ Mystic', '💫 Crush'].map((mood, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#7c3aed] to-[#db2777] p-[2px] shadow-[0_0_12px_rgba(168,85,247,0.6)]">
              <div className="w-full h-full rounded-[12px] bg-[#110c2a] flex items-center justify-center text-xs font-bold">
                {mood.split(' ')[0]}
              </div>
            </div>
            <span className="text-[10px] font-bold mt-1 text-slate-300">{mood.split(' ')[1]}</span>
          </div>
        ))}
      </div>

      {/* Chat Item with Aura Flame Streak */}
      <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
        <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#7c3aed] to-[#db2777] p-[2px] shadow-[0_0_10px_rgba(168,85,247,0.5)]">
          <div className="w-full h-full rounded-[12px] bg-[#110c2a] flex items-center justify-center font-bold">A</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">Aura Match</span>
            <span className="text-xs text-[#f97316] font-bold">🔥 14</span>
          </div>
          <p className="text-xs text-[#c084fc] mt-0.5">✨ Secret Drop Received</p>
        </div>
      </div>
    </div>
  );
}
