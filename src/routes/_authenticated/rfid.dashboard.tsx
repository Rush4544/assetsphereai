import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { PageHeader } from "@/components/app/PageHeader";
import { KPICard } from "@/components/app/KPICard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { useRows } from "@/lib/crud";
import { countWhere, fmtDateTime, type Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/rfid/dashboard")({
  head: () => ({
    meta: [
      { title: "RFID Dashboard — AssetSphere AI" },
      { name: "description", content: "Tag, reader and zone health at a glance." },
      { property: "og:title", content: "RFID Dashboard — AssetSphere AI" },
      { property: "og:description", content: "Tag, reader and zone health at a glance." },
    ],
  }),
  component: RfidDashboardPage,
});

function RfidDashboardPage() {
  const tags = useRows("rfid_tags");
  const readers = useRows("rfid_readers");
  const zones = useRows("rfid_zones");
  const gateways = useRows("rfid_gateways");
  const alerts = useRows("rfid_alerts", { limit: 8 });
  const detections = useRows("rfid_detections", { orderBy: { column: "detection_time" }, limit: 200 });

  const tagRows = tags.data ?? [];
  const readerRows = readers.data ?? [];

  const zoneCounts = useMemo(() => {
    const map = new Map<string, number>();
    (detections.data ?? []).forEach((d: Row) => {
      const z = String(d["zone_name"] ?? "Unknown");
      map.set(z, (map.get(z) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [detections.data]);

  return (
    <div className="space-y-6">
      <PageHeader title="RFID Dashboard" description="Tag, reader, gateway and zone health at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Active tags" value={countWhere(tagRows, (r) => r["tag_status"] === "active")} icon="Tag" hint={`${tagRows.length} total`} />
        <KPICard
          label="Readers online"
          value={countWhere(readerRows, (r) => r["reader_status"] === "online")}
          icon="Radio"
          tone="success"
          hint={`${readerRows.length} deployed`}
        />
        <KPICard
          label="Low battery tags"
          value={countWhere(tagRows, (r) => typeof r["battery_level_pct"] === "number" && (r["battery_level_pct"] as number) < 20)}
          icon="BatteryLow"
          tone="warning"
        />
        <KPICard
          label="Unacknowledged alerts"
          value={countWhere(alerts.data ?? [], (r) => r["acknowledged"] !== true)}
          icon="BellRing"
          tone="destructive"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold">Detections by zone</h2>
          <div className="mt-4 space-y-3">
            {zoneCounts.length === 0 && <p className="text-sm text-muted-foreground">No detections recorded yet.</p>}
            {zoneCounts.map(([zone, count]) => {
              const max = zoneCounts[0]?.[1] ?? 1;
              return (
                <div key={zone}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate">{zone}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold">Infrastructure</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Zones</dt>
              <dd className="font-medium">{(zones.data ?? []).length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Restricted zones</dt>
              <dd className="font-medium">{countWhere(zones.data ?? [], (r) => r["restricted"] === true)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Gateways</dt>
              <dd className="font-medium">{(gateways.data ?? []).length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Gateways online</dt>
              <dd className="font-medium">
                {countWhere(gateways.data ?? [], (r) => r["gateway_status"] === "online")}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Readers in fault</dt>
              <dd className="font-medium">
                {countWhere(readerRows, (r) => r["reader_health"] !== "healthy")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold">Latest alerts</h2>
          <div className="mt-4 space-y-3">
            {(alerts.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No alerts raised.</p>
            )}
            {(alerts.data ?? []).map((a) => (
              <div key={String(a["id"])} className="border-b border-border pb-2 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium">{String(a["message"])}</p>
                  <StatusBadge value={a["severity"]} className="px-1.5 py-0 text-[10px]" />
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {String(a["zone_name"] ?? a["reader_name"] ?? "—")} · {fmtDateTime(a["detected_at"])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
