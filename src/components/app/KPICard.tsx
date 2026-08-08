import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export type KPICardProps = {
  label: string;
  value: string | number;
  icon: string;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "destructive";
  /** When set the whole card links to this route. */
  to?: string;
};

const toneRing: Record<NonNullable<KPICardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export function KPICard({ label, value, icon, hint, tone = "primary", to }: KPICardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (to) {
      router.navigate({ to: to as any });
    }
  };

  return (
    <div
      onClick={handleClick}
      role={to ? "button" : undefined}
      tabIndex={to ? 0 : undefined}
      onKeyDown={(e) => {
        if (to && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          router.navigate({ to: to as any });
        }
      }}
      className={cn(
        "glass-card p-5 transition-all select-none relative z-10",
        to && "cursor-pointer hover:shadow-lg hover:border-primary active:scale-[0.98]",
      )}
    >
      <div className="flex items-start justify-between gap-3 pointer-events-none">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("flex size-10 items-center justify-center rounded-lg", toneRing[tone])}>
          <Icon name={icon} className="size-5" />
        </span>
      </div>
    </div>
  );
}
