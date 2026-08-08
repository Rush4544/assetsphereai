import { Loader2 } from "lucide-react";

import { KPICard } from "@/components/app/KPICard";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { useRows } from "@/lib/crud";
import { countWhere, fmtDateTime, humanize, kpiSearch, type Row } from "@/lib/resource";

function breached(row: Row) {
  const v = row["current_value"];
  if (typeof v !== "number") return false;
  const min = row["min_threshold"];
  const max = row["max_threshold"];
  if (typeof min === "number" && v < min) return true;
  if (typeof max === "number" && v > max) return true;
  return false;
}

/** Condition-monitoring overview: readings vs thresholds, battery and connectivity. */
export function IotOverview() {
  const { data, isLoading } = useRows("iot_devices", { limit: 300 });
  const devices = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="IoT & Condition Monitoring"
        description="Sensor readings against thresholds, battery health and gateway connectivity in one view."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Devices"
          value={devices.length}
          icon="Radio"
          search={kpiSearch("iot", { label: "Devices", value: 0, tab: "devices" })}
        />
        <KPICard
          label="Connected"
          value={countWhere(devices, (d) => d["device_status"] === "connected")}
          icon="Wifi"
          tone="success"
          search={kpiSearch("iot", {
            label: "Connected",
            value: 0,
            tab: "devices",
            filter: { field: "device_status", op: "eq", value: "connected" },
          })}
        />
        <KPICard
          label="Threshold breaches"
          value={countWhere(devices, breached)}
          icon="TriangleAlert"
          tone="destructive"
          search={kpiSearch("iot", {
            label: "Threshold breaches",
            value: 0,
            tab: "devices",
            filter: { field: "current_value", op: "outside_thresholds" },
          })}
        />
        <KPICard
          label="Low battery"
          value={countWhere(devices, (d) => typeof d["battery_level_pct"] === "number" && (d["battery_level_pct"] as number) < 20)}
          icon="BatteryLow"
          tone="warning"
          search={kpiSearch("iot", {
            label: "Low battery",
            value: 0,
            tab: "devices",
            filter: { field: "battery_level_pct", op: "lt", value: 20 },
          })}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : devices.length === 0 ? (
        <p className="glass-card p-6 text-sm text-muted-foreground">
          No IoT devices yet. Add sensors, meters or trackers from the Devices tab and link them to assets.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((d) => {
            const battery = typeof d["battery_level_pct"] === "number" ? (d["battery_level_pct"] as number) : null;
            return (
              <article
                key={String(d["id"])}
                className={`glass-card p-4 ${breached(d) ? "ring-1 ring-destructive/50" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{String(d["name"])}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {humanize(d["metric"])} · {String(d["asset_name"] ?? "Unlinked")} ·{" "}
                      {String(d["building_name"] ?? d["site_name"] ?? "—")}
                    </p>
                  </div>
                  <StatusBadge value={d["device_status"]} className="px-1.5 py-0 text-[10px]" />
                </div>

                <p className="mt-3 text-2xl font-semibold tracking-tight">
                  {d["current_value"] === null || d["current_value"] === undefined ? "—" : String(d["current_value"])}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{String(d["unit"] ?? "")}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Thresholds {String(d["min_threshold"] ?? "—")} – {String(d["max_threshold"] ?? "—")} · last reading{" "}
                  {fmtDateTime(d["last_reading_at"])}
                </p>

                {battery !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Battery</span>
                      <span>{battery}%</span>
                    </div>
                    <Progress value={battery} className="mt-1 h-1.5" />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}