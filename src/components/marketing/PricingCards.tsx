import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { plans, TRIAL_DAYS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PricingCards({ cycle = "monthly" }: { cycle?: "monthly" | "yearly" }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.id}
          className={cn(
            "glass-card flex flex-col p-6",
            p.highlight && "ring-2 ring-primary",
          )}
        >
          {p.highlight ? (
            <span className="mb-3 self-start rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              Most popular
            </span>
          ) : null}
          <h3 className="text-lg font-semibold">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
          <p className="mt-5 flex items-end gap-1">
            <span className="text-3xl font-semibold">
              ${cycle === "monthly" ? p.monthly : Math.round(p.yearly / 12)}
            </span>
            <span className="pb-1 text-sm text-muted-foreground">/ month</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {cycle === "yearly" ? `$${p.yearly} billed yearly · ` : ""}
            {p.assets}
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-6 w-full"
            variant={p.highlight ? "default" : "outline"}
            asChild
          >
            <Link to="/auth" search={{ plan: p.id, cycle }}>
              Start {TRIAL_DAYS}-day free trial
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}