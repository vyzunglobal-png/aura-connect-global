import { useEffect, useState } from "react";
import { Flame, Send, Share2, ShieldCheck, Trash2 } from "lucide-react";
import { SuspenseReveals } from "./SuspenseReveals";
import { MessageSafetyMenu } from "./MessageSafetyMenu";
import type { SecretMessage } from "@/lib/vyzun-store";
import type { PaidAction } from "./PaidActionSheet";

const DAY = 24 * 60 * 60 * 1000;

const TIERS: { price: string; title: string; unlocks: string }[] = [
  { price: "$0.99", title: "Tier 1 Hint", unlocks: "Their major & zodiac sign" },
  { price: "$2.99", title: "Tier 2 Hint", unlocks: "Mutual friends count & Instagram teaser" },
  {
    price: "$9.99",
    title: "Tier 3 Hint",
    unlocks: "Approximate location (same campus or nearby building), a blurred photo teaser and a chat invite they can accept",
  },
];

function useCountdown(createdAt: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return { left: DAY, label: "--:--:--" };
  const left = Math.max(0, createdAt + DAY - now);
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return { left, label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` };
}

export function SecretCard({
  message,
  onReply,
  onDelete,
  onPay,
}: {
  message: SecretMessage;
  onReply: (text: string) => void;
  onDelete: () => void;
  onPay: (a: PaidAction) => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { left, label } = useCountdown(message.createdAt);

  useEffect(() => {
    if (left === 0) onDelete();
  }, [left, onDelete]);

  async function share() {
    const url = `${window.location.origin}/secrets`;
    const text = `Someone sent me a secret on VYZUN 👻 Send me yours:`;
    if (navigator.share) await navigator.share({ text, url }).catch(() => {});
    else await navigator.clipboard?.writeText(`${text} ${url}`);
  }

  return (
    <article className="glass-card p-4">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-destructive" aria-label="Time until this secret burns">
          <Flame className="h-3.5 w-3.5" /> Burns in {label}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald" /> Private
          <MessageSafetyMenu id={message.id} onBlocked={onDelete} />
        </span>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed">{message.body}</p>
      <p className="mt-2 text-xs text-muted-foreground">Hint: {message.hint}</p>

      <SuspenseReveals onPay={onPay} />

      {message.reply && (
        <p className="mt-3 rounded-xl bg-gradient-vyzun px-3 py-2 text-sm text-primary-foreground">You: {message.reply}</p>
      )}

      {chatOpen && (
        <div className="mt-3 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 500))}
            placeholder="Reply privately…"
            aria-label="Private reply"
            autoFocus
            className="w-full rounded-xl border border-glass-border bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={() => {
              const text = draft.trim();
              if (!text) return;
              onReply(text);
              setDraft("");
              setChatOpen(false);
            }}
            aria-label="Send reply"
            className="shrink-0 rounded-xl bg-gradient-vyzun px-3 text-primary-foreground tap active:tap-active"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        {!chatOpen && (
          <button onClick={() => setChatOpen(true)} className="font-semibold text-foreground tap active:tap-active">
            Reply
          </button>
        )}
        <button onClick={share} className="flex items-center gap-1 tap active:tap-active">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        <button onClick={onDelete} className="ml-auto flex items-center gap-1 tap active:tap-active">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </article>
  );
}
