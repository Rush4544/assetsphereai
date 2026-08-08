import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { useRows, useSaveRow } from "@/lib/crud";
import { currency, fmtDate, humanize, type Row } from "@/lib/resource";
import { WO_STATUS } from "@/lib/resources.universal";

const LANES = WO_STATUS.filter((s) => s !== "cancelled");

/** Kanban board over work_orders; moving a card writes the new status. */
export function WorkOrderBoard() {
  const { data, isLoading } = useRows("work_orders", { limit: 500 });
  const save = useSaveRow("work_orders");

  const lanes = useMemo(() => {
    const map = new Map<string, Row[]>(LANES.map((l) => [l, []]));
    for (const row of data ?? []) {
      const status = String(row["status"] ?? "open");
      (map.get(status) ?? map.get("open"))?.push(row);
    }
    return map;
  }, [data]);

  function move(row: Row, direction: 1 | -1) {
    const idx = LANES.indexOf(String(row["status"]));
    const next = LANES[Math.min(LANES.length - 1, Math.max(0, idx + direction))];
    if (!next || next === row["status"]) return;
    const patch: Row & { id: string } = { id: String(row["id"]), status: next };
    if (next === "completed") patch["completed_date"] = new Date().toISOString().slice(0, 10);
    save.mutate(patch, {
      onSuccess: () => toast.success(`Moved to ${humanize(next)}`),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Order Board"
        description="Drag-free kanban: move work across open, assigned, in progress, on hold and completed."
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {LANES.map((lane) => {
            const rows = lanes.get(lane) ?? [];
            return (
              <section key={lane} className="glass-card flex flex-col gap-3 p-4">
                <header className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{humanize(lane)}</h2>
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">{rows.length}</span>
                </header>
                <div className="space-y-3">
                  {rows.length === 0 && <p className="text-xs text-muted-foreground">Nothing here.</p>}
                  {rows.map((row) => (
                    <article key={String(row["id"])} className="rounded-lg border border-border bg-card p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">{String(row["title"])}</p>
                        <StatusBadge value={row["priority"]} className="px-1.5 py-0 text-[10px]" />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {String(row["asset_name"] ?? row["vehicle_name"] ?? "Unassigned asset")} ·{" "}
                        {humanize(row["work_type"])}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {String(row["assigned_to_name"] ?? "Unassigned")} · due {fmtDate(row["due_date"])} ·{" "}
                        {currency(row["total_cost"])}
                      </p>
                      <div className="mt-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => move(row, -1)}
                          disabled={LANES.indexOf(lane) === 0}
                        >
                          Back
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => move(row, 1)}
                          disabled={LANES.indexOf(lane) === LANES.length - 1}
                        >
                          Advance
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}