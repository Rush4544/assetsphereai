import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { useRows } from "@/lib/crud";
import { cn } from "@/lib/utils";
import type { Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/maintenance-calendar")({
  head: () => ({
    meta: [
      { title: "Maintenance Calendar — AssetSphere AI" },
      { name: "description", content: "Month view of every scheduled maintenance job and vehicle service." },
      { property: "og:title", content: "Maintenance Calendar — AssetSphere AI" },
      { property: "og:description", content: "Month view of scheduled maintenance across assets and fleet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const maintenance = useRows("maintenance_records");
  const service = useRows("vehicle_service_records");

  const events = useMemo(() => {
    const map = new Map<string, Array<{ title: string; status: unknown; kind: string }>>();
    const push = (r: Row, kind: string) => {
      const date = (r["scheduled_date"] ?? r["completed_date"]) as string | null;
      if (!date) return;
      const key = String(date).slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({
        title: String(r["title"] ?? r["asset_name"] ?? "Job"),
        status: r["status"],
        kind,
      });
    };
    (maintenance.data ?? []).forEach((r) => push(r, "Asset"));
    (service.data ?? []).forEach((r) => push(r, "Vehicle"));
    return map;
  }, [maintenance.data, service.data]);

  const first = cursor;
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i + 1)),
  ];
  const todayKey = new Date().toISOString().slice(0, 10);
  const isLoading = maintenance.isLoading || service.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Calendar"
        description="Month view of every scheduled maintenance job and vehicle service."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous month"
              onClick={() => setCursor(new Date(first.getFullYear(), first.getMonth() - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[160px] text-center text-sm font-medium">
              {first.toLocaleDateString("en-CA", { month: "long", year: "numeric" })}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next month"
              onClick={() => setCursor(new Date(first.getFullYear(), first.getMonth() + 1, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="glass-card flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-3">
          <div className="grid grid-cols-7 gap-2 pb-2">
            {DAYS.map((d) => (
              <div key={d} className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="min-h-[104px] rounded-lg bg-muted/30" />;
              const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
              const items = events.get(key) ?? [];
              return (
                <div
                  key={key}
                  className={cn(
                    "min-h-[104px] rounded-lg border border-border p-2",
                    key === todayKey && "border-primary/60 bg-primary/5",
                  )}
                >
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">{day.getDate()}</p>
                  <div className="space-y-1">
                    {items.slice(0, 3).map((e, idx) => (
                      <div key={idx} className="rounded bg-secondary px-1.5 py-1">
                        <p className="truncate text-[11px] font-medium">{e.title}</p>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">{e.kind}</span>
                          <StatusBadge value={e.status} className="px-1 py-0 text-[9px]" />
                        </div>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-[10px] text-muted-foreground">+{items.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}