import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DirectChatsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Direct Chats & Calls" className="fixed inset-0 z-50 flex items-end bg-background/60 backdrop-blur-sm">
      <div className="glass-card max-h-[85vh] w-full overflow-y-auto rounded-b-none p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] animate-in slide-in-from-bottom bg-[#070614] text-white">
        
        {/* Top Header with Close Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[#a855f7]">Cyber-Aura Vibe Inbox</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

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
    </div>
  );
}
