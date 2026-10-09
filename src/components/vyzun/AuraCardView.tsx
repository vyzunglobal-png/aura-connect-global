import { forwardRef } from "react";
import { BadgeCheck, Crown, Sparkles } from "lucide-react";
import type { AuraCard } from "@/lib/vyzun-store";
import { Logo, Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

const GAUGES = [
  { label: "Creativity", color: "var(--color-violet)" },
  { label: "Emotional Depth", color: "var(--color-cyan)" },
  { label: "Confidence", color: "var(--color-magenta)" },
  { label: "Positive Energy", color: "var(--color-emerald)" },
];
const PALETTE = ["var(--color-violet)", "var(--color-cyan)", "var(--color-magenta)", "var(--color-gold)"];

/** Stable per-card variation so each gauge differs but never changes on re-render. */
function seeded(id: string, i: number, score: number) {
  let h = 0;
  for (const ch of id + i) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return Math.max(40, Math.min(99, score - 12 + (h % 24)));
}

function Gauge({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
        <text x="22" y="26" textAnchor="middle" className="rotate-90 fill-foreground text-[11px] font-bold" transform="rotate(90 22 22)">{value}</text>
      </svg>
      <span className="text-center text-[9px] leading-tight text-muted-foreground">{label}</span>
    </div>
  );
}

export const AuraCardView = forwardRef<
  HTMLElement,
  { card: AuraCard; username: string; prime?: boolean; className?: string }
>(function AuraCardView({ card, username, prime, className }, ref) {
  const ultra = card.rarity === "Legendary" || card.rarity === "Mythic";
  const quote = card.lines[0] ?? card.headline;

  return (
    <article ref={ref} className={cn("chamfer relative mt-4 aspect-[9/16] w-full bg-gradient-to-br from-violet via-cyan to-violet p-[2px]", className)}>
      <div className="chamfer-inner h-full w-full bg-background p-[3px]">
        <div className="chamfer-inner relative h-full w-full overflow-hidden bg-gradient-to-br from-cyan/60 via-violet/40 to-cyan/60 p-[1px]">
          <div className="chamfer-inner relative flex h-full w-full flex-col bg-background px-5 py-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-vyzun opacity-20" />
            <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-violet/30 blur-3xl" />

            <header className="relative flex items-center justify-between">
              <p className="text-xs font-medium">@{username}</p>
              {prime && (
                <span className="flex items-center gap-1 rounded-full bg-gradient-vyzun px-2 py-0.5 text-[9px] font-semibold text-primary-foreground">
                  <BadgeCheck className="h-3 w-3" /> PRIME
                </span>
              )}
            </header>

            {/* crown + cosmic ring portrait */}
            <div className="relative mx-auto mt-3 flex flex-col items-center">
              <span className="z-10 -mb-3 flex items-center gap-1 rounded-full border border-gold/70 bg-background px-2.5 py-0.5 text-[9px] font-bold tracking-[0.2em] text-gold shadow-[0_0_14px_var(--color-gold)]">
                <Crown className="h-3 w-3" /> {ultra ? "ULTRA RARE" : card.rarity.toUpperCase()}
              </span>
              <div className="relative h-32 w-32">
                <div className="anim-spin-slow absolute -inset-2 rounded-full bg-[conic-gradient(var(--color-violet),var(--color-cyan),var(--color-magenta),var(--color-gold),var(--color-violet))] opacity-90 blur-[3px]" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="anim-pulse-neon absolute h-1 w-1 rounded-full bg-cyan" style={{ top: `${50 + 56 * Math.sin(i)}%`, left: `${50 + 56 * Math.cos(i)}%` }} />
                ))}
                <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-background">
                  {card.photo ? (
                    <img src={card.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-background">
                      <Sparkles className="h-10 w-10 text-cyan" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-vyzun opacity-20 mix-blend-screen" />
                </div>
              </div>
            </div>

            <div className="relative mt-3 text-center">
              <p className="font-display text-5xl font-bold leading-none">{card.score}%</p>
              <p className="text-gradient font-display text-xl font-semibold">{card.headline}</p>
              <p className="text-[10px] text-muted-foreground">Top {card.percentile}% aura percentile · entertainment reading</p>
            </div>

            <div className="relative mt-3 grid grid-cols-4 gap-1">
              {GAUGES.map((g, i) => <Gauge key={g.label} label={g.label} color={g.color} value={seeded(card.id, i, card.score)} />)}
            </div>

            <div className="relative mt-3 flex items-center justify-center gap-2">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Aura Palette</span>
              {PALETTE.map((c) => (
                <span key={c} className="h-5 w-5 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, white, ${c} 45%)`, boxShadow: `0 0 10px ${c}` }} />
              ))}
            </div>

            <blockquote className="relative mt-3 rounded-2xl border border-glass-border bg-foreground/5 px-3 py-2 text-center text-[12px] italic leading-snug backdrop-blur-md">
              “{quote}”
            </blockquote>

            <footer className="relative mt-auto flex items-center justify-between pt-3">
              <span className="text-xs font-semibold">Beat my Aura ➔ VYZUN</span>
              <span className="flex items-center gap-1.5">
                <Logo className="h-5 w-5" />
                <Wordmark className="text-sm" />
              </span>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
});
