import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useRows } from "@/lib/crud";
import { fmtDateTime, type Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/rfid/live")({
  head: () => ({
    meta: [
      { title: "RFID Live Tracking — AssetSphere AI" },
      { name: "description", content: "Real-time tag movement across your sites." },
      { property: "og:title", content: "RFID Live Tracking — AssetSphere AI" },
      { property: "og:description", content: "Real-time tag movement across your sites." },
    ],
  }),
  component: RfidLivePage,
});

function RfidLivePage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const detections = useRows("rfid_detections", { orderBy: { column: "detection_time" }, limit: 100 });
  const zones = useRows("rfid_zones");

  useEffect(() => {
    const channel = supabase
      .channel("rfid-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "rfid_detections" }, () => {
        qc.invalidateQueries({ queryKey: ["rows", "rfid_detections"] });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = detections.data ?? [];
    if (!needle) return list;
    return list.filter((r) =>
      ["tag_id", "asset_name", "zone_name", "reader_name", "assigned_user"].some((k) =>
        String(r[k] ?? "").toLowerCase().includes(needle),
      ),
    );
  }, [detections.data, q]);

  const occupancy = useMemo(() => {
    const latest = new Map<string, Row>();
    (detections.data ?? []).forEach((d) => {
      const tag = String(d["tag_id"]);
      if (!latest.has(tag)) latest.set(tag, d);
    });
    const map = new Map<string, number>();
    [...latest.values()].forEach((d) => {
      if (String(d["direction"] ?? "") === "exit") return;
      const z = String(d["zone_name"] ?? "Unknown");
      map.set(z, (map.get(z) ?? 0) + 1);
    });
    return (zones.data ?? []).map((z) => ({
      name: String(z["name"]),
      building: String(z["building_name"] ?? "—"),
      restricted: z["restricted"] === true,
      count: map.get(String(z["name"])) ?? 0,
    }));
  }, [detections.data, zones.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="RFID Live Tracking"
        description="Live tag movement stream with current zone occupancy. Updates automatically as readers report."
        actions={
          <span className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
            <span className="size-2 animate-pulse rounded-full bg-success" /> Live
          </span>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <Input placeholder="Filter by tag, asset, zone or reader" value={q} onChange={(e) => setQ(e.target.value)} />
          {detections.isLoading ? (
            <div className="glass-card flex items-center justify-center py-20">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : rows.length === 0 ? (
            <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
              No detections yet. Readers will populate this stream as tags move.
            </div>
          ) : (
            <div className="glass-card divide-y divide-border">
              {rows.map((d) => (
                <div key={String(d["id"])} className="flex items-center gap-3 p-3">
                  <span
                    className={
                      String(d["direction"]) === "exit"
                        ? "flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
                        : "flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success"
                    }
                  >
                    {String(d["direction"]) === "exit" ? (
                      <ArrowUpRight className="size-4" />
                    ) : (
                      <ArrowDownLeft className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {String(d["asset_name"] ?? d["tag_id"])}
                      </p>
                      <StatusBadge value={d["movement_status"]} className="px-1.5 py-0 text-[10px]" />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {String(d["previous_zone"] ?? "—")} → {String(d["zone_name"] ?? "—")} ·{" "}
                      {String(d["reader_name"] ?? "—")} · {fmtDateTime(d["detection_time"])}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {String(d["tag_id"])}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card h-fit p-5">
          <h2 className="text-sm font-semibold">Zone occupancy</h2>
          <div className="mt-4 space-y-3">
            {occupancy.length === 0 && <p className="text-sm text-muted-foreground">No zones configured.</p>}
            {occupancy.map((z) => (
              <div key={z.name} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm">{z.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{z.building}</p>
                </div>
                <span
                  className={
                    z.restricted
                      ? "rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive"
                      : "rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  }
                >
                  {z.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
