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
  const handleClick = () => {
    if (to) {
      window.location.href = to;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "glass-card p-5 transition-all select-none",
        to && "cursor-pointer hover:shadow-lg hover:border-primary active:scale-[0.98]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("flex size-10 items-center justify-center rounded-lg pointer-events-none", toneRing[tone])}>
          <Icon name={icon} className="size-5" />
        </span>
      </div>
    </div>
  );
}
