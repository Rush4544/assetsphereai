import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export type KPICardProps = {
  label: string;
  value: string | number;
  icon: string;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "destructive";
};

const toneRing: Record<NonNullable<KPICardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export function KPICard({ label, value, icon, hint, tone = "primary" }: KPICardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
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
