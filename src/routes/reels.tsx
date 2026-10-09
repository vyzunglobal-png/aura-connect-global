import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ReelStudio } from "@/components/vyzun/ReelStudio";
import { ReelCommerce } from "@/components/vyzun/ReelCommerce";
import { PaidActionSheet, type PaidAction } from "@/components/vyzun/PaidActionSheet";
import { withSponsoredSlots } from "@/lib/reel-ad-engine";
import { useRef, useState } from "react";
import {
  BadgeCheck,
  Eye,
  Flame,
  Heart,
  Bookmark,
  MessageSquare,
  Music2,
  Plus,
  Share2,
  ShoppingBag,
  Megaphone,
} from "lucide-react";
import { useVyzun, type ReactionKey } from "@/lib/vyzun-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title: "VYZUN Reels — Vertical Video Feed" },
      {
        name: "description",
        content:
          "Watch full-screen vertical reels on VYZUN, vibe with creators and build your audience. Comedy, trending and more.",
      },
      { property: "og:title", content: "VYZUN Reels — Vertical Video Feed" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Full-screen vertical video, VYZUN reactions and creator discovery.",
      },
    ],
  }),
  component: ReelsPage,
});

const CATEGORIES = ["Vibing", "For You", "Campus Vibes", "Trending"] as const;

type Reel = {
  id: string;
  creator: string;
  verified: boolean;
  caption: string;
  hashtags: string[];
  views: string;
  audio: string;
  counts: Record<ReactionKey, number>;
};

const REELS: Reel[] = [
  {
    id: "r1",
    creator: "riyavibes",
    verified: true,
    caption: "POV: your aura score comes out higher than your crush's",
    hashtags: ["#vyzunaura", "#pov"],
    views: "412K",
    audio: "Original audio — riyavibes",
    counts: { vibe: 12400, curious: 2100, savage: 890, lol: 5400 },
  },
  {
    id: "r2",
    creator: "arjun.k",
    verified: false,
    caption: "Edited this in 20 minutes on a ₹8000 phone. No excuses.",
    hashtags: ["#creator", "#editing"],
    views: "96K",
    audio: "Original audio — arjun.k",
    counts: { vibe: 5100, curious: 640, savage: 2300, lol: 410 },
  },
  {
    id: "r3",
    creator: "midnight.tales",
    verified: true,
    caption: "Reading anonymous secrets out loud, part 12 👀",
    hashtags: ["#secrets", "#storytime"],
    views: "1.2M",
    audio: "Original audio — midnight.tales",
    counts: { vibe: 88000, curious: 31000, savage: 4200, lol: 9100 },
  },
  {
    id: "vyzun-create",
    creator: "VYZUN",
    verified: false,
    caption: "Your campus. Your story. Make your first original Reel.",
    hashtags: ["#vyzunaura", "#campusvibes"],
    views: "0",
    audio: "Create an original sound",
    counts: { vibe: 0, curious: 0, savage: 0, lol: 0 },
  },
];

function ReelsPage() {
  const { state, update } = useVyzun();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("For You");
  const [reactions, setReactions] = useState<Record<string, ReactionKey | null>>({});
  const [burst, setBurst] = useState<string | null>(null);
  const [pendingVibe, setPendingVibe] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [paid, setPaid] = useState<PaidAction | null>(null);

  function toggleVibeWith(creator: string) {
    const vibing = state.vibingWith.includes(creator);
    setPendingVibe(creator);
    window.setTimeout(() => {
      update((s) => ({
        vibingWith: vibing
          ? s.vibingWith.filter((c) => c !== creator)
          : [...s.vibingWith, creator],
        profile: { ...s.profile, vibing: vibing ? Math.max(0, s.profile.vibing - 1) : s.profile.vibing + 1 },
      }));
      setPendingVibe(null);
    }, 350);
  }

  return (
    <div className="fixed inset-0 bottom-0 flex flex-col bg-background">
      <div className="absolute inset-x-0 top-0 z-20 flex flex-wrap items-center gap-2 bg-gradient-to-b from-background/90 to-transparent px-4 pb-6 pt-4">
        <div className="grid w-full min-w-0 grid-cols-4 gap-1 sm:flex sm:w-auto sm:flex-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border border-glass-border px-1 py-1.5 text-[10px] sm:px-3.5 sm:text-xs tap active:tap-active",
              category === c && "bg-gradient-vyzun text-primary-foreground",
            )}
          >
            {c}
          </button>
        ))}
        </div>
        <Button
          onClick={() => setStudioOpen(true)}
          aria-label="Create Reel"
          className="ml-auto h-9 shrink-0 rounded-xl bg-gradient-vyzun px-3 text-xs text-primary-foreground shadow-[var(--glow-cyan)]"
        >
          <Plus className="h-5 w-5" /> Create Reel
        </Button>
      </div>

      <div
        ref={scroller}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain pb-24"
      >
        {withSponsoredSlots(REELS).map((item) => {
          if (item.kind === "ad") return <section key={`ad-${item.slot}`} data-sponsored-slot={item.slot} className="relative flex h-[calc(100dvh-4.5rem)] snap-start flex-col items-center justify-center gap-4 overflow-hidden bg-secondary px-6 pb-24 pt-24 text-center">
            <span className="rounded-full border border-gold/50 px-3 py-1 text-xs font-semibold text-gold">Sponsored</span>
            <Megaphone className="h-14 w-14 text-cyan" />
            <h2 className="font-display text-2xl font-bold">VYZUN for brands</h2>
            <p className="max-w-xs text-sm text-muted-foreground">Bring your next campaign to campus creators.</p>
            <Button className="h-auto whitespace-normal bg-gradient-vyzun py-3" onClick={() => setPaid({ title: "Native Reel Sponsorship", price: "Custom campaign quote", description: "Request a native sponsored video placement. This is a house promotion; external ad delivery and rewarded-ad payouts are not connected." })}>Explore sponsorship</Button>
            <span className="text-[11px] text-muted-foreground">House promotion · no cash reward</span>
          </section>;
          const reel = item.reel;
          const mine = reactions[reel.id] ?? null;
          const vibing = state.vibingWith.includes(reel.creator);
          const pending = pendingVibe === reel.creator;
          return (
            <section
              key={reel.id}
              className="relative flex h-[calc(100dvh-4.5rem)] w-full snap-start items-end overflow-hidden"
              onDoubleClick={() => {
                setReactions((r) => ({ ...r, [reel.id]: "vibe" }));
                setBurst(reel.id);
                window.setTimeout(() => setBurst(null), 600);
              }}
            >
              <div className="absolute inset-0 bg-gradient-vyzun opacity-25" />
              <div className="absolute inset-0 bg-background/50" />
              {burst === reel.id && (
                <span className="anim-pulse-neon absolute inset-0 m-auto grid h-24 w-24 place-items-center text-5xl">
                  ❤️
                </span>
              )}

              <div className="relative z-10 w-full p-5 pb-24">
                <div className="flex items-end gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-vyzun text-sm font-bold text-primary-foreground">
                        {reel.creator[0]?.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold">
                        @{reel.creator}
                        {reel.verified && <BadgeCheck className="h-4 w-4 text-cyan" />}
                      </span>
                      <button
                        onClick={() => toggleVibeWith(reel.creator)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold tap active:tap-active",
                          vibing
                            ? "border border-glass-border"
                            : "bg-gradient-vyzun text-primary-foreground",
                        )}
                      >
                        {pending ? (vibing ? "Unvibing" : "Vibing") : vibing ? "Vibing" : "+ Vibe With"}
                      </button>
                    </div>
                    <p className="mt-3 text-sm">{reel.caption}</p>
                    <p className="mt-1 text-xs text-cyan">{reel.hashtags.join(" ")}</p>
                    <Button variant="outline" onClick={() => setProductsOpen(true)} className="mt-3 h-auto max-w-full whitespace-normal border-cyan/40 bg-background/60 px-2 py-2 text-left text-[11px]"><ShoppingBag />Shop creator picks · Affiliate</Button>
                    <p className="mt-2 flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <Music2 className="anim-sweep h-3.5 w-3.5 shrink-0" /> {reel.audio} · {reel.views} views
                    </p>
                  </div>

                   <div className="flex w-11 shrink-0 flex-col items-center gap-3 drop-shadow-lg">
                    <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-cyan bg-gradient-vyzun text-sm font-bold text-primary-foreground">
                      {reel.creator[0]?.toUpperCase()}
                    </span>
                    <button
                      aria-label="Like"
                      onClick={() => setReactions((s) => ({ ...s, [reel.id]: s[reel.id] === "vibe" ? null : "vibe" }))}
                      className="flex flex-col items-center text-[10px] tap active:tap-active"
                    >
                      <Heart className={cn("h-6 w-6", mine === "vibe" && "fill-magenta text-magenta")} />
                      {(reel.counts.vibe + (mine === "vibe" ? 1 : 0)).toLocaleString()}
                    </button>
                    <span className="flex flex-col items-center text-[10px]" aria-label="Views">
                      <Eye className="h-6 w-6 text-cyan" />
                      {reel.views}
                    </span>
                    <button
                      aria-label="Fire reaction"
                      onClick={() => setReactions((s) => ({ ...s, [reel.id]: s[reel.id] === "savage" ? null : "savage" }))}
                      className="flex flex-col items-center text-[10px] tap active:tap-active"
                    >
                      <Flame className={cn("h-6 w-6", mine === "savage" && "fill-gold text-gold")} />
                      {(reel.counts.savage + (mine === "savage" ? 1 : 0)).toLocaleString()}
                    </button>
                    <button aria-label="Comments" className="tap active:tap-active">
                      <MessageSquare className="h-6 w-6" />
                    </button>
                    <button aria-label="Save" className="tap active:tap-active">
                      <Bookmark className="h-6 w-6" />
                    </button>
                    <button
                      aria-label="Share"
                      onClick={async () => {
                        const text = `Watch @${reel.creator} on VYZUN`;
                        if (navigator.share) await navigator.share({ text }).catch(() => {});
                        else await navigator.clipboard?.writeText(text);
                      }}
                      className="tap active:tap-active"
                    >
                      <Share2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <ReelStudio open={studioOpen} onClose={() => setStudioOpen(false)} />
      <ReelCommerce open={productsOpen} onClose={() => setProductsOpen(false)} />
      <PaidActionSheet action={paid} onClose={() => setPaid(null)} />

    </div>
  );
}
