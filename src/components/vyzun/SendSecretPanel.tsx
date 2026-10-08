import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendModeratedSecret } from "@/lib/message-safety.functions";
import { Copy, Search, Send, Share2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useVyzunSession } from "@/hooks/use-vyzun-session";

const schema = z.object({
  username: z.string().trim().min(2, "Enter a username").max(30).regex(/^@?[a-z0-9._]+$/i, "Invalid username"),
  body: z.string().trim().min(1, "Write a message").max(500, "Max 500 characters"),
});

export function SendSecretPanel({ username, initialTo = "" }: { username: string; initialTo?: string }) {
  const { session, profile } = useVyzunSession();
  const handle = profile?.username ?? username;
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const link = `${origin}/secrets?to=${encodeURIComponent(handle)}`;
  const sendMessage = useServerFn(sendModeratedSecret);
  const [to, setTo] = useState(initialTo);
  useEffect(() => { if (initialTo) setTo(initialTo); }, [initialTo]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function copy() {
    try { await navigator.clipboard.writeText(link); setStatus("Link copied."); } catch { setStatus("Could not copy. Please try sharing instead."); }
  }
  async function share() {
    const text = "Send me an anonymous secret on VYZUN 👻";
    if (navigator.share) await navigator.share({ text, url: link }).catch(() => {});
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
    <div className="space-y-3">
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">Your anonymous VYZUN link</p>
        <p className="mt-1 truncate font-semibold text-cyan">{link}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={copy} className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan/60 py-2.5 text-sm font-semibold shadow-[var(--glow-cyan)] tap active:tap-active">
            <Copy className="h-4 w-4" /> Copy Link
          </button>
          <button onClick={share} className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-vyzun py-2.5 text-sm font-semibold text-primary-foreground tap active:tap-active">
            <Share2 className="h-4 w-4" /> Share Link
          </button>
        </div>
      </div>

      <div className="glass-card p-4">
        <h2 className="font-semibold">Send a Secret Message</h2>
        <label className="mt-3 flex items-center gap-2 rounded-xl border border-glass-border px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Search username"
            aria-label="Search username"
            maxLength={31}
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">🔒 Protected by AI moderation. Bullying or hate speech is strictly prohibited.</p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Say it anonymously — but keep it kind."
          aria-label="Secret message"
          className="mt-2 w-full resize-none rounded-xl border border-glass-border bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={send}
          disabled={sending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground shadow-[var(--glow-cyan)] tap active:tap-active disabled:opacity-60"
        >
          <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send Secret Message"}
        </button>
        {status && <p aria-live="polite" className="mt-2 text-center text-xs text-muted-foreground">{status}</p>}
      </div>
    </div>
  );
}
