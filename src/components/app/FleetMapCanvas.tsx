import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Gauge, Fuel, Radio, Truck } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useRows } from "@/lib/crud";
import { fmtDateTime, humanize, type Row } from "@/lib/resource";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Vehicle = Row & { id: string };

const num = (v: unknown) => (typeof v === "number" ? v : v === null || v === undefined ? null : Number(v));

function markerColor(v: Vehicle) {
  if (v["geofence_breach"]) return "#dc2626";
  if (v["status"] === "in_maintenance") return "#f59e0b";
  if (v["status"] === "retired" || v["status"] === "stolen") return "#64748b";
  return (num(v["current_speed_kmh"]) ?? 0) > 0 ? "#16a34a" : "#2563eb";
}

function vehicleIcon(v: Vehicle) {
  const color = markerColor(v);
  const heading = num(v["heading"]) ?? 0;
  return L.divIcon({
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `<div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;width:30px;height:30px;border-radius:9999px;background:${color};opacity:.22"></div>
      <div style="position:relative;width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.45)"></div>
      <div style="position:absolute;transform:rotate(${heading}deg) translateY(-15px);width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:8px solid ${color}"></div>
    </div>`,
  });
}

/** Advance a coordinate a small distance along a heading. */
function step(lat: number, lng: number, heading: number, km: number) {
  const rad = (heading * Math.PI) / 180;
  return {
    lat: lat + (km / 110.574) * Math.cos(rad),
    lng: lng + (km / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(rad),
  };
}

export default function FleetMapCanvas({ focusGeofences = false }: { focusGeofences?: boolean }) {
  const { data: dbVehicles = [] } = useRows("vehicles", { orderBy: { column: "name", ascending: true } });
  const { data: fences = [] } = useRows("geofences", { orderBy: { column: "name", ascending: true } });

  const [live, setLive] = useState<Vehicle[]>([]);
  const [demo, setDemo] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLive(dbVehicles.filter((v) => num(v["gps_lat"]) !== null && num(v["gps_lng"]) !== null) as Vehicle[]);
  }, [dbVehicles]);

  // Realtime GPS updates from the database.
  useEffect(() => {
    const channel = supabase
      .channel("fleet-map-vehicles")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "vehicles" }, (payload) => {
        const next = payload.new as Vehicle;
        setLive((prev) => prev.map((v) => (v.id === next.id ? { ...v, ...next } : v)));
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Simulated motion for prototype demos.
  useEffect(() => {
    if (!demo) {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      return;
    }
    timer.current = setInterval(() => {
      setLive((prev) =>
        prev.map((v) => {
          if (v["status"] !== "active") return v;
          const lat = num(v["gps_lat"]);
          const lng = num(v["gps_lng"]);
          if (lat === null || lng === null) return v;
          const speed = Math.max(20, num(v["current_speed_kmh"]) ?? 40);
          const heading = ((num(v["heading"]) ?? 0) + (Math.random() * 24 - 12) + 360) % 360;
          const moved = step(lat, lng, heading, (speed / 3600) * 3);
          return {
            ...v,
            gps_lat: moved.lat,
            gps_lng: moved.lng,
            heading: Math.round(heading),
            current_speed_kmh: Math.round(speed + (Math.random() * 8 - 4)),
            last_gps_update: new Date().toISOString(),
          };
        }),
      );
    }, 3000);
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [demo]);

  const center = useMemo<[number, number]>(() => {
    const pts = live
      .map((v) => [num(v["gps_lat"]), num(v["gps_lng"])] as [number | null, number | null])
      .filter((p): p is [number, number] => p[0] !== null && p[1] !== null);
    if (!pts.length) return [43.6532, -79.3832];
    return [
      pts.reduce((t, p) => t + p[0], 0) / pts.length,
      pts.reduce((t, p) => t + p[1], 0) / pts.length,
    ];
  }, [live]);

  const moving = live.filter((v) => (num(v["current_speed_kmh"]) ?? 0) > 0).length;
  const breaches = live.filter((v) => !!v["geofence_breach"]).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="size-3.5" /> {live.length} tracked
          <span className="text-border">|</span>
          <Gauge className="size-3.5" /> {moving} moving
          <span className="text-border">|</span>
          <Radio className="size-3.5 text-primary" /> {fences.length} geofences
          {breaches > 0 && (
            <>
              <span className="text-border">|</span>
              <span className="font-medium text-destructive">{breaches} breach{breaches > 1 ? "es" : ""}</span>
            </>
          )}
        </div>
        <Button
          size="sm"
          variant={demo ? "default" : "outline"}
          className="ml-auto"
          onClick={() => setDemo((d) => !d)}
        >
          {demo ? "Stop demo motion" : "Start demo motion"}
        </Button>
      </div>

      <div className="glass-card overflow-hidden p-0">
        <MapContainer
          center={center}
          zoom={focusGeofences ? 8 : 9}
          scrollWheelZoom
          style={{ height: "620px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {fences.map((f) => {
            const lat = num(f["center_lat"]);
            const lng = num(f["center_lng"]);
            if (lat === null || lng === null) return null;
            const color = (f["color"] as string) || "#2563eb";
            return (
              <Circle
                key={String(f["id"])}
                center={[lat, lng]}
                radius={num(f["radius_meters"]) ?? 500}
                pathOptions={{ color, fillColor: color, fillOpacity: f["active"] ? 0.1 : 0.03, weight: 2, dashArray: f["active"] ? undefined : "6 6" }}
              >
                <Tooltip sticky>
                  <span className="font-medium">{String(f["name"])}</span>
                  <br />
                  {num(f["radius_meters"])} m radius
                  {f["speed_limit_kmh"] ? ` · ${num(f["speed_limit_kmh"])} km/h limit` : ""}
                </Tooltip>
              </Circle>
            );
          })}

          {live.map((v) => {
            const lat = num(v["gps_lat"]);
            const lng = num(v["gps_lng"]);
            if (lat === null || lng === null) return null;
            return (
              <Marker key={v.id} position={[lat, lng]} icon={vehicleIcon(v)}>
                <Popup>
                  <div className="min-w-[210px] space-y-1 text-xs">
                    <div className="text-sm font-semibold">{String(v["name"])}</div>
                    <div className="text-muted-foreground">
                      {String(v["make"] ?? "")} {String(v["model"] ?? "")} · {String(v["license_plate"] ?? "—")}
                    </div>
                    <div className="pt-1">Driver: {String(v["driver_name"] ?? "Unassigned")}</div>
                    <div className="flex items-center gap-1">
                      <Gauge className="size-3" /> {num(v["current_speed_kmh"]) ?? 0} km/h · heading {num(v["heading"]) ?? 0}°
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="size-3" /> Fuel {num(v["fuel_level_pct"]) ?? 0}% · Odo{" "}
                      {(num(v["total_mileage_km"]) ?? 0).toLocaleString("en-CA")} km
                    </div>
                    <div>Geofence: {String(v["geofence_name"] ?? "—")}</div>
                    <div className={cn(v["geofence_breach"] ? "font-medium text-destructive" : "text-muted-foreground")}>
                      {v["geofence_breach"] ? "Outside assigned geofence" : humanize(v["status"])}
                    </div>
                    <div className="text-muted-foreground">Updated {fmtDateTime(v["last_gps_update"])}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}