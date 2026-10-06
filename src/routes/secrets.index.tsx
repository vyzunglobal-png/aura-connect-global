import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ImagePlus, MessageCircle, Phone, Radar, Video, X } from "lucide-react";
import { REACTIONS, useVyzun, type ReactionKey } from "@/lib/vyzun-store";
import { cn } from "@/lib/utils";
import { DirectChatsSheet } from "@/components/vyzun/DirectChatsSheet";
import { SecretCard } from "@/components/vyzun/SecretCard";
import { CampusRadar } from "@/components/vyzun/CampusRadar";
import { PaidActionSheet, type PaidAction } from "@/components/vyzun/PaidActionSheet";
import { SendSecretPanel } from "@/components/vyzun/SendSecretPanel";

export const Route = createFileRoute("/secrets/")({
  head: () => ({
    meta: [
      { title: "VYZUN Secrets — Anonymous Inbox, Vibe Feed & Campus Map" },
      {
        name: "description",
        content: "Get anonymous secrets, reply privately, post to the Vibe Feed and explore your campus radar map on VYZUN.",
      },
      { property: "og:title", content: "VYZUN Secrets — Anonymous Inbox, Vibe Feed & Campus Map" },
      {
        property: "og:description",
        content: "Anonymous secrets that burn in 24 hours, the Vibe Feed and a live campus radar.",
      },
    ],
  }),
  component: SecretsPage,
});

function SecretsPage() {
  const { state, update } = useVyzun();
  const [tab, setTab] = useState<"inbox" | "feed" | "map">("inbox");
  const [draft, setDraft] = useState("");
  const [anon, setAnon] = useState(true);
  const [chatsOpen, setChatsOpen] = useState(false);
  const [paid, setPaid] = useState<PaidAction | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function react(id: string, key: ReactionKey) {
    update((s) => ({
      feed: s.feed.map((p) => {
        if (p.id !== id) return p;
        const reactions = { ...p.reactions };
        if (p.mine) reactions[p.mine] = Math.max(0, reactions[p.mine] - 1);
        if (p.mine === key) return { ...p, reactions, mine: null };
        reactions[key] += 1;
        return { ...p, reactions, mine: key };
      }),
    }));
  }

  function pickImage(file: File | undefined) {
    setMediaError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMediaError("Please choose a photo.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setMediaError("Photo is larger than 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setMediaError("Could not read that photo.");
    reader.readAsDataURL(file);
  }

  function post() {
    const body = draft.trim();
    if (!body && !image) return;
    update((s) => ({
      feed: [
        {
          id: crypto.randomUUID(),
          author: anon ? "anon" : s.profile.username,
          anonymous: anon,
          body,
          image,
          createdAt: Date.now(),
          reactions: { vibe: 0, curious: 0, savage: 0, lol: 0 },
          mine: null,
        },
        ...s.feed,
      ],
    }));
    setDraft("");
    setImage(null);
    setMediaError(null);
    if (fileRef.current) fileRef.current.value = "";
  }


  return (
    <div className="pb-36">
      <header className="sticky top-0 z-30 bg-background/75 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            <span aria-hidden>👻 </span>SECRETS
          </h1>
          <button
            onClick={() => setTab("map")}
            aria-label="Open campus map"
            className={cn(
              "grid h-11 w-11 place-items-center rounded-2xl border border-glass-border bg-background/50 shadow-[var(--glow-cyan)] tap active:tap-active",
              tab === "map" && "bg-gradient-vyzun text-primary-foreground",
            )}
          >
            <Radar className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1 rounded-2xl border border-glass-border bg-background/40 p-1">
          {(
            [
              ["inbox", "Anonymous Inbox"],
              ["feed", "Vibe Feed"],
              ["map", "Campus Map"],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={cn(
                "rounded-xl py-2 text-xs font-semibold text-muted-foreground transition-colors",
                tab === t && "bg-gradient-vyzun text-primary-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5">
        {tab === "inbox" && (
          <section className="space-y-3">
            <SendSecretPanel username={state.profile.username} />
            {state.secrets.length === 0 && (
              <div className="glass-card p-6 text-center">
                <p className="text-sm text-muted-foreground">No secrets yet. Share your link to get anonymous notes.</p>
              </div>
            )}
            {state.secrets.map((m) => (
              <SecretCard
                key={m.id}
                message={m}
                onPay={setPaid}
                onReply={(text) =>
                  update((s) => ({ secrets: s.secrets.map((x) => (x.id === m.id ? { ...x, reply: text } : x)) }))
                }
                onDelete={() => update((s) => ({ secrets: s.secrets.filter((x) => x.id !== m.id) }))}
              />
            ))}
          </section>
        )}

        {tab === "map" && <CampusRadar onPay={setPaid} />}


        {tab === "feed" && (
          <section>
            <div className="glass-card p-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                placeholder="Share a secret, confession or vibe…"
                aria-label="New Vibe Feed post"
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />

              {image && (
                <div className="relative mt-2 overflow-hidden rounded-xl border border-glass-border">
                  <img src={image} alt="Attached photo preview" className="max-h-56 w-full object-cover" />
                  <button
                    onClick={() => {
                      setImage(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-glass-border bg-background/80 backdrop-blur tap active:tap-active"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {mediaError && <p className="mt-2 text-xs text-destructive">{mediaError}</p>}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickImage(e.target.files?.[0])}
              />

              <div className="mt-2 flex min-w-0 items-center gap-2">
                <button
                  onClick={() => setAnon((a) => !a)}
                  className={cn(
                    "min-w-0 truncate rounded-full border border-glass-border px-3 py-1.5 text-xs tap active:tap-active",
                    anon && "bg-gradient-vyzun text-primary-foreground",
                  )}
                >
                  {anon ? "Anonymous" : `@${state.profile.username}`}
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  aria-label="Attach photo"
                  title="Attach photo"
                  className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-glass-border text-cyan tap active:tap-active"
                >
                  <ImagePlus className="h-5 w-5" />
                </button>
                <button
                  onClick={post}
                  disabled={!draft.trim() && !image}
                  className="shrink-0 rounded-xl bg-gradient-vyzun px-4 py-2 text-sm font-semibold text-primary-foreground tap active:tap-active disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>


            <div className="mt-4 space-y-3">
              {state.feed.map((p) => (
                <article key={p.id} className="glass-card p-4">
                  <p className="text-xs text-muted-foreground">
                    {p.anonymous ? "Anonymous" : `@${p.author}`}
                  </p>
                  {p.body && <p className="mt-1.5 text-sm">{p.body}</p>}
                  {p.image && (
                    <img
                      src={p.image}
                      alt="Vibe Feed attachment"
                      loading="lazy"
                      className="mt-3 max-h-80 w-full rounded-xl border border-glass-border object-cover"
                    />
                  )}
                  <div className="mt-3 flex gap-2">
                    {REACTIONS.map((r) => (
                      <button
                        key={r.key}
                        onClick={() => react(p.id, r.key)}
                        aria-label={r.label}
                        className={cn(
                          "flex items-center gap-1 rounded-full border border-glass-border px-2.5 py-1 text-xs tap active:tap-active",
                          p.mine === r.key && "bg-gradient-vyzun text-primary-foreground",
                        )}
                      >
                        <span aria-hidden>{r.emoji}</span>
                        {p.reactions[r.key]}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <button
        onClick={() => setChatsOpen(true)}
        className="fixed inset-x-6 bottom-24 z-30 mx-auto flex max-w-sm items-center justify-center gap-3 rounded-2xl bg-gradient-vyzun py-3 font-semibold text-primary-foreground shadow-lg tap active:tap-active"
      >
        <MessageCircle className="h-4 w-4" /> Direct Chats &amp; Calls
        <span className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          <Video className="h-4 w-4" />
        </span>
      </button>

      <DirectChatsSheet open={chatsOpen} onClose={() => setChatsOpen(false)} />
    </div>
  );
}
