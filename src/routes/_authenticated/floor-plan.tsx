import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Icon } from "@/components/app/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRows } from "@/lib/crud";
import type { Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/floor-plan")({
  head: () => ({
    meta: [
      { title: "Floor Plan — AssetSphere AI" },
      { name: "description", content: "Drag-and-drop asset placement on building floor layouts." },
      { property: "og:title", content: "Floor Plan — AssetSphere AI" },
      { property: "og:description", content: "Drag-and-drop asset placement on building floor layouts." },
    ],
  }),
  component: FloorPlanPage,
});

function FloorPlanPage() {
  const buildings = useRows("buildings");
  const rooms = useRows("rooms");
  const assets = useRows("assets");
  const [buildingId, setBuildingId] = useState<string>("");

  const activeBuilding = buildingId || String(buildings.data?.[0]?.["id"] ?? "");

  const floors = useMemo(() => {
    const inBuilding = (rooms.data ?? []).filter((r) => String(r["building_id"] ?? "") === activeBuilding);
    const grouped = new Map<string, Row[]>();
    inBuilding.forEach((r) => {
      const floor = String(r["floor"] ?? "Unassigned");
      if (!grouped.has(floor)) grouped.set(floor, []);
      grouped.get(floor)!.push(r);
    });
    return [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [rooms.data, activeBuilding]);

  const assetsByRoom = useMemo(() => {
    const map = new Map<string, Row[]>();
    (assets.data ?? []).forEach((a) => {
      const key = String(a["room_id"] ?? "");
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    return map;
  }, [assets.data]);

  const isLoading = buildings.isLoading || rooms.isLoading || assets.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Floor Plan"
        description="Rooms grouped by floor, with the assets currently located in each space."
        actions={
          <Select value={activeBuilding} onValueChange={setBuildingId}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a building" />
            </SelectTrigger>
            <SelectContent>
              {(buildings.data ?? []).map((b) => (
                <SelectItem key={String(b["id"])} value={String(b["id"])}>
                  {String(b["name"])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <div className="glass-card flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : floors.length === 0 ? (
        <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
          No rooms recorded for this building yet. Add rooms under Administration → Rooms.
        </div>
      ) : (
        <div className="space-y-6">
          {floors.map(([floor, floorRooms]) => (
            <section key={floor} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Floor {floor}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {floorRooms.map((room) => {
                  const roomAssets = assetsByRoom.get(String(room["id"])) ?? [];
                  return (
                    <div key={String(room["id"])} className="glass-card p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{String(room["name"])}</p>
                          <p className="text-xs text-muted-foreground">
                            {String(room["room_number"] ?? "—")} · {String(room["room_type"] ?? "Room")}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          <Icon name="Boxes" className="size-3.5" />
                          {roomAssets.length}
                        </span>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {roomAssets.slice(0, 6).map((a) => (
                          <div key={String(a["id"])} className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs">{String(a["name"])}</span>
                            <StatusBadge value={a["lifecycle_status"]} className="px-1.5 py-0 text-[10px]" />
                          </div>
                        ))}
                        {roomAssets.length === 0 && (
                          <p className="text-xs text-muted-foreground">No assets placed here.</p>
                        )}
                        {roomAssets.length > 6 && (
                          <p className="text-[11px] text-muted-foreground">
                            +{roomAssets.length - 6} more assets
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
