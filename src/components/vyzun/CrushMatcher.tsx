import { useState } from "react";
import { HeartHandshake, Lock, Zap, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVyzunSession } from "@/hooks/use-vyzun-session";
import { PaidActionSheet, type PaidAction } from "@/components/vyzun/PaidActionSheet";

/**
 * Double-blind crush. Picks are never revealed to the other person; the paid
 * reveal only works on a server-confirmed mutual match.
 */
export function CrushMatcher() {
  const { isAuthenticated } = useVyzunSession();
  const [paid, setPaid] = useState<PaidAction | null>(null);

  return (
    <section className="glass-card mt-8 p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <HeartHandshake className="h-5 w-5 shrink-0 text-magenta" /> Double-Blind Crush
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Pick anonymously. They only ever learn if you both pick each other.
      </p>

      <p className="mt-4 flex items-center gap-2 rounded-xl border border-glass-border px-4 py-3 text-sm">
        <Lock className="h-4 w-4 shrink-0 text-cyan" />
        {isAuthenticated ? "Your private pick is sealed and waiting." : "Sign in to seal a private pick."}
      </p>

      <button
        onClick={() =>
          setPaid({
            title: "Reveal Identity & Instant Chat",
            price: "$4.99",
            description: "See who it is and open a private chat — only if you both picked each other.",
          })
        }
        className="mt-4 w-full rounded-xl bg-gradient-vyzun py-3 text-sm font-semibold text-primary-foreground shadow-[var(--glow-cyan)] tap active:tap-active"
      >
        $4.99 · Reveal Identity &amp; Instant Chat
      </button>
      <button
        onClick={() =>
          setPaid({
            title: "Boost Campus Aura Points",
            price: "$2.99",
            description: "Add a boost to your campus Aura points for 24 hours.",
          })
        }
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan/60 bg-background/50 py-3 text-sm font-semibold backdrop-blur-md tap active:tap-active"
      >
        <Zap className="h-4 w-4 text-cyan" /> $2.99 · Boost Campus Aura Points
      </button>
      <Button variant="outline" onClick={() => setPaid({ title: "Inter-Campus Battle Pass", price: "$1.99", description: "Join an inter-campus Aura event. Participation activates only after verified payment; no global individual leaderboard." })}
        className="mt-3 h-auto w-full whitespace-normal border-gold/50 py-3 text-sm">
        <Swords className="text-gold" /> $1.99 · Join Inter-Campus Battle Pass
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Reveal works only when both people picked each other.
      </p>
      <PaidActionSheet action={paid} onClose={() => setPaid(null)} />
    </section>
  );
}
