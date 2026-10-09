import { Bell, Crown, Gift, Megaphone, MapPin, Radio, Sparkles, Store } from "lucide-react";
import type { PaidAction } from "./PaidActionSheet";

const TRINKETS = [
  { emoji: "🌸", name: "Secret Vibe", price: "$0.10", x: 22, y: 30 },
  { emoji: "🔥", name: "Neon Flame", price: "$0.25", x: 70, y: 24 },
  { emoji: "👑", name: "Ghost Crown", price: "$0.50", x: 30, y: 66 },
  { emoji: "💎", name: "Aura Crystal", price: "$0.99", x: 76, y: 62 },
];

const STORES = [
  { name: "Campus Café", x: 54, y: 40 },
  { name: "Late Night Bites", x: 26, y: 48 },
];

export function CampusRadar({ onPay }: { onPay: (a: PaidAction) => void }) {
  return (
    <section className="space-y-3">
      <button
        onClick={() =>
          onPay({
            title: "Daily Clout Crown Auction",
            price: "$10 – $500",
            description: "Bid for today's top spot on your campus map. Highest bid at midnight wins the crown for 24 hours.",
          })
        }
        className="glass-card flex w-full items-center gap-3 px-4 py-3 text-left tap active:tap-active"
      >
        <Crown className="h-5 w-5 shrink-0 text-gold" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Daily Clout Crown Auction</span>
          <span className="text-xs text-muted-foreground">Bid $10 – $500 for campus priority</span>
        </span>
        <span className="rounded-full bg-gradient-gold px-2.5 py-1 text-[11px] font-bold text-background">BID</span>
      </button>

      <div className="relative h-[58vh] min-h-[420px] overflow-hidden rounded-3xl border border-glass-border bg-radar-grid">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="anim-radar-ping absolute left-1/2 top-1/2 h-[140%] w-[140%] rounded-full border border-cyan/40"
            style={{ animationDelay: `${i * 1.05}s` }}
          />
        ))}
        <span aria-hidden className="anim-sweep absolute inset-[-25%] rounded-full bg-radar-sweep" />
        <span aria-hidden className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[var(--glow-cyan)]" />

        <button
          onClick={() =>
            onPay({
              title: "Campus Takeover",
              price: "$199/hr",
              description: "Replace the campus banner and audio for one hour with your own message.",
            })
          }
          className="absolute left-3 top-3 flex w-[calc(55%-1rem)] items-center gap-1 rounded-xl border border-magenta/50 bg-background/70 px-2 py-1.5 text-[10px] font-semibold backdrop-blur-md tap active:tap-active"
        >
          <Radio className="h-3.5 w-3.5 text-magenta" /> Campus Takeover · $199/hr
        </button>

        <button
          onClick={() =>
            onPay({
              title: "VIP Aura Halo",
              price: "$4.99/mo",
              description: "A glowing halo around your pin on every campus map.",
            })
          }
          className="absolute right-3 top-3 flex w-[calc(45%-1rem)] items-center gap-1 rounded-xl border border-gold/50 bg-background/70 px-2 py-1.5 text-[10px] font-semibold backdrop-blur-md tap active:tap-active"
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" /> VIP Halo · $4.99/mo
        </button>

        {TRINKETS.map((t, i) => (
          <button
            key={t.name}
            onClick={() =>
              onPay({
                title: `Drop a ${t.name}`,
                price: t.price,
                description: "Leave this micro-drop on the map. Someone nearby finds it and sees your hint.",
              })
            }
            className="anim-float absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center tap active:tap-active"
            style={{ left: `${t.x}%`, top: `${t.y}%`, animationDelay: `${i * 0.6}s` }}
            aria-label={`${t.name}, ${t.price}`}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-glass-border bg-background/60 text-2xl shadow-[var(--glow-neon)] backdrop-blur-md">
              {t.emoji}
            </span>
            <span className="mt-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold">{t.price}</span>
          </button>
        ))}

        {STORES.map((s) => (
          <button
            key={s.name}
            onClick={() =>
              onPay({
                title: "Sponsored Store Pin",
                price: "$99/mo",
                description: `Local businesses like ${s.name} appear as glowing pins with a deal for students nearby.`,
              })
            }
            className="absolute flex max-w-[48%] -translate-x-1/2 -translate-y-1/2 flex-wrap items-center justify-center gap-1 rounded-xl border border-emerald/50 bg-background/75 px-2 py-1 text-[10px] font-semibold backdrop-blur-md tap active:tap-active"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <Store className="h-3 w-3 text-emerald" /> {s.name}
            <span className="text-muted-foreground">· Ad $99/mo</span>
          </button>
        ))}

        <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              onPay({ title: "Pin Yours", price: "$5", description: "Place your own glowing pin on the campus map for 24 hours." })
            }
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-vyzun py-2.5 text-sm font-semibold text-primary-foreground tap active:tap-active"
          >
            <MapPin className="h-4 w-4" /> Pin Yours · $5
          </button>
          <button
            onClick={() =>
              onPay({ title: "Mystery Loot Box", price: "$1.99", description: "Spin for a random animated trinket. Exact odds are shown before you pay." })
            }
            className="flex items-center justify-center gap-1.5 rounded-xl border border-glass-border bg-background/70 py-2.5 text-sm font-semibold backdrop-blur-md tap active:tap-active"
          >
            <Gift className="h-4 w-4 text-magenta" /> Loot Box · $1.99
          </button>
        </div>
      </div>

      <button
        onClick={() =>
          onPay({
            title: "Mega Blast",
            price: "$49.99",
            description: "Send one moderated message as a notification to up to 5,000 students on your campus who allow campus alerts.",
          })
        }
        className="glass-card flex w-full items-center gap-3 px-4 py-3 text-left tap active:tap-active"
      >
        <Megaphone className="h-5 w-5 shrink-0 text-cyan" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Mega Blast</span>
          <span className="text-xs text-muted-foreground">Reach 5,000 students instantly</span>
        </span>
        <span className="flex items-center gap-1 text-sm font-bold">
          <Bell className="h-3.5 w-3.5" /> $49.99
        </span>
      </button>
    </section>
  );
}
