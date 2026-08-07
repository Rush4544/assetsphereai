import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/app/PageHeader";
import { KPICard } from "@/components/app/KPICard";
import { Button } from "@/components/ui/button";
import { useRows } from "@/lib/crud";
import { countWhere, type Row } from "@/lib/resource";

function csv(rows: Row[]) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0] as object);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export const Route = createFileRoute("/_authenticated/rfid/reports")({
  head: () => ({
    meta: [
      { title: "RFID Reports — AssetSphere AI" },
      { name: "description", content: "Analytics for detections, dwell time and coverage." },
      { property: "og:title", content: "RFID Reports — AssetSphere AI" },
      { property: "og:description", content: "Analytics for detections, dwell time and coverage." },
    ],
  }),
  component: RfidReportsPage,
});

function RfidReportsPage() {
  const detections = useRows("rfid_detections", { orderBy: { column: "detection_time" }, limit: 1000 });
  const alerts = useRows("rfid_alerts", { limit: 1000 });
  const tags = useRows("rfid_tags");

  const perDay = useMemo(() => {
    const map = new Map<string, number>();
    (detections.data ?? []).forEach((d) => {
      const t = d["detection_time"] ?? d["created_at"];
      if (!t) return;
      const key = String(t).slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-30).map(([name, value]) => ({ name, value }));
  }, [detections.data]);

  const alertsByType = useMemo(() => {
    const map = new Map<string, number>();
    (alerts.data ?? []).forEach((a) => {
      const k = String(a["alert_type"] ?? "other");
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [alerts.data]);

  const topAssets = useMemo(() => {
    const map = new Map<string, number>();
    (detections.data ?? []).forEach((d) => {
      const k = String(d["asset_name"] ?? d["tag_id"] ?? "Unknown");
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [detections.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="RFID Reports"
        description="Detection volume, alert breakdown and the most-moved assets across your sites."
        actions={
          <Button variant="outline" size="sm" onClick={() => {
            const blob = new Blob([csv(detections.data ?? [])], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "rfid-detections.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}>
            <Download className="mr-2 size-4" /> Export detections
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Detections" value={(detections.data ?? []).length} icon="Activity" />
        <KPICard label="Tags tracked" value={(tags.data ?? []).length} icon="Tag" tone="success" />
        <KPICard label="Alerts raised" value={(alerts.data ?? []).length} icon="BellRing" tone="warning" />
        <KPICard
          label="Open alerts"
          value={countWhere(alerts.data ?? [], (r) => r["acknowledged"] !== true)}
          icon="AlertTriangle"
          tone="destructive"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold">Detections per day</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(215 20% 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(221 83% 53%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold">Alerts by type</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertsByType}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(215 20% 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(38 92% 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 xl:col-span-2">
          <h2 className="text-sm font-semibold">Most-moved assets</h2>
          <div className="mt-4 space-y-2">
            {topAssets.length === 0 && <p className="text-sm text-muted-foreground">No movement recorded yet.</p>}
            {topAssets.map(([name, count]) => {
              const max = topAssets[0]?.[1] ?? 1;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate">{name}</span>
                    <span className="text-muted-foreground">{count} detections</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
