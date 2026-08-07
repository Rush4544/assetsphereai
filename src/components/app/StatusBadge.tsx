import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { humanize, toneFor } from "@/lib/resource";

const TONE = {
  success: "border-transparent bg-success/12 text-success",
  danger: "border-transparent bg-destructive/12 text-destructive",
  warning: "border-transparent bg-warning/15 text-warning-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
} as const;

export function StatusBadge({ value, className }: { value: unknown; className?: string }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <Badge variant="outline" className={cn("font-medium", TONE[toneFor(value)], className)}>
      {humanize(value)}
    </Badge>
  );
}