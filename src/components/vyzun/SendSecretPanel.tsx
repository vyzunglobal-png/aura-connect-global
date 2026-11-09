import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendModeratedSecret } from "@/lib/message-safety.functions";
import { Copy, Search, Send, Share2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { secretDropLink } from "@/lib/vyzun-links";
import { useVyzunSession } from "@/hooks/use-vyzun-session";

const schema = z.object({
  username: z.string().trim().min(2, "Enter a username").max(30).regex(/^@?[a-z0-9._]+$/i, "Invalid username"),
  body: z.string().trim().min(1, "Write a message").max(500, "Max 500 characters"),
});

export default function SecretsTab({ username = "vyzuner", initialTo = "" }: { username?: string; initialTo?: string }) {
  const { session, profile } = useVyzunSession();
  const handle = profile?.username ?? username;
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const link = origin ? secretDropLink(origin, handle) : "";
  const sendMessage = useServerFn(sendModeratedSecret);
  const [to, setTo] = useState(initialTo);
  useEffect(() => { if (initialTo) setTo(initialTo); }, [initialTo]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function copy() {
    try { 
      await navigator.clipboard.writeText(link || `https://vyzun.app/ask/@${handle}`); 
      setStatus("Link copied."); 
    } catch { 
      setStatus("Could not copy. Please try sharing instead."); 
    }
  }

  async function share() {
    const text = "Send me an anonymous secret on VYZUN 👻";
    const shareUrl = link || `https://vyzun.app/ask/@${handle}`;
    if (navigator.share) await navigator.share({ text, url: shareUrl }).catch(() => {});
    else await copy();
  }

  async function send() {
    const parsed = schema.safeParse({ username: to, body });
    if (!parsed.success) return setStatus(parsed.error.issues[0]?.message ?? "Check your message");
    if (!session) return setStatus("Sign in to send a secret.");
    setSending(true);
    setStatus(null);
    const name = parsed.data.username.replace(/^@/, "").toLowerCase();
    try {
      const result = await sendMessage({ data: { username: name, body: parsed.data.body } });
      setStatus(result.message);
      if (result.ok) { setTo(""); setBody(""); }
    } catch (e) { setStatus(e instanceof Error ? e.message : "Could not send safely. Please try again."); }
    finally { setSending(false); }
  }

  return (
    <div className="p-4 bg-[#070614] text-white min-h-screen space-y-4">
      <h1 className="text-xl font-extrabold mb-4">SECRETS</h1>
      
      {/* Anonymous Link Box with Side-by-Side Pill Buttons (As requested in your neon aesthetic) */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-pink-500/25 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
        <p className="text-xs text-slate-400 mb-1">Your anonymous VYZUN link</p>
        <p className="text-base font-extrabold text-[#ec4899] mb-4 truncate">vyzun.app/ask/@{handle}</p>

        <div className="flex gap-3">
          <button 
            onClick={copy}
            className="flex-1 py-3 px-4 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
          >
            <Copy className="w-4 h-4 text-[#a855f7]" /> Copy Link
          </button>
          <button 
            onClick={share}
            className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(236,72,153,0.5)] transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>
      </div>

      {/* Send a Secret Message Form Box */}
      <div className="glass-card p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <h2 className="font-semibold text-base mb-3">Send a Secret Message</h2>
        <label className="flex items-center gap-2 rounded-xl border border-glass-border px-3 py-2.5 bg-black/20">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Search username"
            aria-label="Search username"
            maxLength={31}
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-white"
          />
        </label>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">🔒 Protected by AI moderation. Bullying or hate speech is strictly prohibited.</p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Say it anonymously — but keep it kind."
          aria-label="Secret message"
          className="mt-2 w-full resize-none rounded-xl border border-glass-border bg-black/20 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground text-white"
        />
        <Button
          onClick={send}
          disabled={sending}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#ec4899] py-3 font-semibold text-primary-foreground shadow-[0_0_16px_rgba(236,72,153,0.5)] cursor-pointer disabled:opacity-60"
        >
          <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send Secret Message"}
        </Button>
        {status && <p aria-live="polite" className="mt-2 text-center text-xs text-slate-300">{status}</p>}
      </div>
    </div>
  );
}
