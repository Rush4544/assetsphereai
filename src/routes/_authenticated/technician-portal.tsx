import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { KPICard } from "@/components/app/KPICard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { useRows, useSaveRow } from "@/lib/crud";
import { useCurrentUser } from "@/lib/auth";
import { fmtDate, type Row } from "@/lib/resource";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/technician-portal")({
  head: () => ({
    meta: [
      { title: "Technician Portal — AssetSphere AI" },
      { name: "description", content: "Task queue and field workflow for technicians." },
      { property: "og:title", content: "Technician Portal — AssetSphere AI" },
      { property: "og:description", content: "Task queue and field workflow for technicians." },
    ],
  }),
  component: TechnicianPortalPage,
});

function TechnicianPortalPage() {
  const { data: user } = useCurrentUser();
  const [scope, setScope] = useState<"mine" | "all">("mine");
  const maintenance = useRows("maintenance_records", { orderBy: { column: "scheduled_date", ascending: true } });
  const service = useRows("vehicle_service_records", { orderBy: { column: "scheduled_date", ascending: true } });
  const saveMaintenance = useSaveRow("maintenance_records");
  const saveService = useSaveRow("vehicle_service_records");

  const me = (user?.profile?.full_name ?? "").toLowerCase();

  const jobs = useMemo(() => {
    const all: Array<Row & { __kind: "maintenance" | "service" }> = [
      ...(maintenance.data ?? []).map((r) => ({ ...r, __kind: "maintenance" as const })),
      ...(service.data ?? []).map((r) => ({ ...r, __kind: "service" as const })),
    ];
    const open = all.filter((r) => String(r["status"] ?? "") !== "completed");
    if (scope === "all" || !me) return open;
    return open.filter((r) => String(r["technician_name"] ?? "").toLowerCase() === me);
  }, [maintenance.data, service.data, scope, me]);

  const today = new Date().toISOString().slice(0, 10);
  const overdue = jobs.filter((j) => {
    const d = j["scheduled_date"] as string | null;
    return d ? String(d).slice(0, 10) < today : false;
  }).length;
  const dueToday = jobs.filter((j) => String(j["scheduled_date"] ?? "").slice(0, 10) === today).length;
  const urgent = jobs.filter((j) => ["high", "critical", "urgent"].includes(String(j["priority"] ?? ""))).length;

  function advance(job: Row & { __kind: "maintenance" | "service" }, status: string) {
    const payload: Row & { id?: string } = {
      id: String(job["id"]),
      status,
      ...(status === "completed" ? { completed_date: today } : {}),
    };
    if (job.__kind === "maintenance") saveMaintenance.mutate(payload);
    else saveService.mutate(payload);
  }

  const isLoading = maintenance.isLoading || service.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technician Portal"
        description="Your open work queue across assets and fleet, with one-tap status updates."
        actions={
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {(["mine", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  scope === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s === "mine" ? "My jobs" : "All open jobs"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Open jobs" value={jobs.length} icon="ClipboardList" />
        <KPICard label="Due today" value={dueToday} icon="CalendarClock" tone="warning" />
        <KPICard label="Overdue" value={overdue} icon="AlertTriangle" tone="destructive" />
        <KPICard label="High priority" value={urgent} icon="Flame" tone="warning" />
      </div>

      {isLoading ? (
        <div className="glass-card flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
          Nothing in the queue. {scope === "mine" ? "Switch to all open jobs to see unassigned work." : "All caught up."}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={String(job["id"])} className="glass-card flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{String(job["title"] ?? "Job")}</p>
                  <StatusBadge value={job["status"]} className="px-1.5 py-0 text-[10px]" />
                  <StatusBadge value={job["priority"]} className="px-1.5 py-0 text-[10px]" />
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {job.__kind === "maintenance" ? "Asset" : "Vehicle"}:{" "}
                  {String(job["asset_name"] ?? job["vehicle_name"] ?? "—")} · Scheduled{" "}
                  {fmtDate(job["scheduled_date"])} · Tech {String(job["technician_name"] ?? "unassigned")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => advance(job, "in_progress")}>
                  Start
                </Button>
                <Button size="sm" onClick={() => advance(job, "completed")}>
                  Complete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
