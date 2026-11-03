import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, BadgeCheck, MessageCircle, Phone, Send, Sparkles, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useVyzunSession } from "@/hooks/use-vyzun-session";
import { askVyzunAI } from "@/lib/companion.functions";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ChatComposer } from "./ChatComposer";
import { ActionDialog } from "./ActionDialog";
import { PaidActionSheet, type PaidAction } from "./PaidActionSheet";

const TASKS = [{ key: "hooks", label: "Video hooks" }, { key: "scripts", label: "Scripts" }, { key: "bio", label: "Bio" }, { key: "safety", label: "Brand safety" }] as const;
type Task = typeof TASKS[number]["key"];

/** Shared full-screen and sheet content. No fabricated threads or delivery states. */
export function MessagesView() {
  const { session } = useVyzunSession();
  const ask = useServerFn(askVyzunAI);
  const [active, setActive] = useState<string | null>(null);
  const [task, setTask] = useState<Task>("hooks");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ prompt: string; text: string }[]>([]);
  const [battle, setBattle] = useState(false);
  const [paid, setPaid] = useState<PaidAction | null>(null);
  const threads = useQuery({ queryKey: ["direct-chats", session?.user.id], enabled: !!session, retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase.from("chats").select("id,kind,last_message_at").order("last_message_at", { ascending: false }).limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });
  const messages = useQuery({ queryKey: ["direct-chat", session?.user.id, active], enabled: !!session && !!active && active !== "ai", retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase.from("chat_messages").select("id,body,sender_id,created_at").eq("chat_id", active ?? "").is("deleted_at", null).order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return (data ?? []).reverse();
    },
  });

  async function send() {
    const prompt = draft.trim();
    if (!prompt || busy) return;
    if (!session) { setNotice("Sign in to talk with VYZUN AI."); return; }
    setBusy(true); setNotice(null);
    try {
      const result = await ask({ data: { prompt, context: task } });
      if (result.ok) { setAnswers(items => [...items, { prompt, text: result.text }]); setDraft(""); }
      else setNotice(result.text);
    } catch { setNotice("VYZUN AI could not connect. Your prompt is still here."); }
    finally { setBusy(false); }
  }

  return <section className="space-y-4">
    {!active ? <>
      <Button variant="outline" onClick={() => { setActive("ai"); setNotice(null); }} className="h-auto w-full justify-start gap-3 border-magenta/60 p-4 text-left shadow-[var(--glow-neon)]">
        <span className="bg-gradient-secret grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
        <span className="min-w-0"><span className="flex items-center gap-2 font-semibold">✨ VYZUN AI <BadgeCheck className="h-4 w-4 text-cyan" /></span><span className="block text-xs text-muted-foreground">Verified Vibe Guide</span></span>
      </Button>
      {!session && <p className="text-sm text-muted-foreground">Sign in to see your private chats.</p>}
      {threads.isLoading && <div role="status" aria-label="Loading chats" className="h-16 animate-pulse rounded-xl bg-muted" />}
      {threads.isError && <div role="alert" className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Your chats couldn’t connect.</p><Button variant="outline" onClick={() => void threads.refetch()}>Retry</Button></div>}
      {session && threads.isSuccess && !threads.data?.length && <p className="py-6 text-center text-sm text-muted-foreground">No active chats yet.</p>}
      {threads.data?.map((thread, i) => <Button key={thread.id} variant="outline" onClick={() => setActive(thread.id)} className="h-auto w-full justify-start gap-3 p-4"><MessageCircle className="text-cyan" /><span>Private chat {i + 1}</span></Button>)}
    </> : <>
      <div className="flex items-center justify-between gap-3"><Button variant="ghost" size="sm" onClick={() => { setActive(null); setNotice(null); }}><ArrowLeft className="h-4 w-4" />All chats</Button><h2 className="text-sm font-semibold">{active === "ai" ? "VYZUN AI" : "Private chat"}</h2>{active !== "ai" && <div className="flex gap-1"><Button variant="outline" size="icon" aria-label="Audio call" onClick={() => setNotice("Calling is not connected yet. No call was placed.")}><Phone className="h-4 w-4" /></Button><Button variant="outline" size="icon" aria-label="Video call" onClick={() => setNotice("Video calling is not connected yet. No call was placed.")}><Video className="h-4 w-4" /></Button></div>}</div>
      {active === "ai" ? <>
        <div className="rounded-lg border border-magenta/30 bg-glass p-4"><p className="text-sm leading-relaxed">Hey, I’m VYZUN AI ✨ What’s your next vibe? Let’s create something that feels like you.</p><div className="mt-3 flex flex-wrap gap-2">{["Give me a fun icebreaker", "Write a viral Reel hook", "Help me refresh my bio"].map(prompt => <Button key={prompt} size="sm" variant="outline" className="h-auto whitespace-normal text-left text-xs" onClick={() => setDraft(prompt)}>{prompt}</Button>)}</div><div className="mt-3 flex gap-2"><Button asChild size="sm" variant="outline"><Link to="/">Scan Face Now</Link></Button><Button asChild size="sm" variant="outline"><Link to="/secrets" search={{ to: undefined }}>Open Secrets</Link></Button></div></div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="AI task">{TASKS.map(t => <Button key={t.key} size="sm" variant={task === t.key ? "default" : "outline"} onClick={() => setTask(t.key)}>{t.label}</Button>)}</div>
        <div className="min-h-40 space-y-4" aria-live="polite">{answers.map((answer, i) => <div key={i} className="space-y-2"><p className="ml-auto max-w-[90%] rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground">{answer.prompt}</p><p className="whitespace-pre-wrap rounded-xl border border-glass-border px-4 py-3 text-sm leading-relaxed">{answer.text}</p></div>)}{busy && <p role="status" className="animate-pulse text-sm text-cyan">VYZUN AI is thinking…</p>}</div>
        <form onSubmit={e => { e.preventDefault(); void send(); }} className="flex items-end gap-2"><textarea value={draft} onChange={e => setDraft(e.target.value)} maxLength={2000} rows={2} aria-label="Message VYZUN AI" placeholder="What are you creating?" className="min-w-0 flex-1 resize-none rounded-xl border border-glass-border bg-background px-3 py-2 text-sm" /><Button type="submit" aria-label="Send to VYZUN AI" disabled={busy || !draft.trim()} className="bg-gradient-secret h-11 w-11 shrink-0 p-0"><Send className="h-4 w-4" /></Button></form>
      </> : <>
        <div className="chat-ambience rounded-lg border border-cyan/30 p-3"><p className="text-xs font-semibold text-cyan">Aura Match · —</p><div className="mt-2 h-1 rounded-full bg-muted" /><p className="mt-2 text-[11px] text-muted-foreground">Compatibility needs both participants’ shared Aura Cards.</p></div>
        <Button variant="outline" className="h-auto w-full whitespace-normal border-magenta/40 py-3" onClick={() => setPaid({ title: "Instant Identity Unmask", price: "$4.99", description: "Identity is revealed only with both participants’ consent and verified payment. No verified mutual match is available." })}>$4.99 · Instant Identity Unmask</Button>
        {messages.isLoading && <p role="status" className="text-sm text-muted-foreground">Loading messages…</p>}
        {messages.isError && <p role="alert" className="text-sm text-destructive">Messages could not be loaded.</p>}
        {messages.data?.map(message => <p key={message.id} className={cn("max-w-[90%] whitespace-pre-wrap rounded-xl border border-glass-border px-4 py-3 text-sm", message.sender_id === session?.user.id && "ml-auto bg-primary text-primary-foreground")}>{message.body ?? "Media message"}</p>)}
        <ChatComposer onBattle={() => setBattle(true)} onLoot={() => setPaid({ title: "Secret Loot Box", price: "$1.99", description: "Self-destructing secrets require encrypted delivery, recipient consent and 24-hour expiry. Reward odds must be disclosed before any verified purchase. Delivery is not activated." })} />
      </>}
    </>}
    {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
    <ActionDialog title={battle ? "Aura Battle" : null} description="A holographic duel needs both participants’ shared Aura Cards and consent. No opponent score or match is available yet." onClose={() => setBattle(false)}><Button asChild className="bg-gradient-vyzun"><Link to="/">Create your Aura Card</Link></Button></ActionDialog>
    <PaidActionSheet action={paid} onClose={() => setPaid(null)} />
  </section>;
}