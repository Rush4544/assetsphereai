import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Link2, Loader2, Radar, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";
import { useRows } from "@/lib/crud";
import { friendlyError } from "@/lib/errors";
import type { Row } from "@/lib/resource";
import { Button } from "@/components/ui/button";
import { DataTable } from "./DataTable";

/**
 * Discovery agent status. There is no scanning agent deployed yet, so we
 * surface an honest configuration state instead of faking scan results.
 */
const AGENT_CONFIGURED = false;

function identity(device: Row) {
  return {
    mac: String(device["mac_address"] ?? "").trim().toLowerCase(),
    serial: String(device["hostname"] ?? "").trim().toLowerCase(),
  };
}

export function NetworkDiscoveryPanel() {
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();
  const { data: devices = [], isLoading, isError, refetch } = useRows("network_devices");
  const { data: assets = [] } = useRows("assets");
  const [converting, setConverting] = useState<string | null>(null);

  const canWrite = user?.role !== "user";

  const unlinked = useMemo(
    () => devices.filter((d) => !d["linked_asset_id"]),
    [devices],
  );

  const convert = useMutation({
    mutationFn: async (device: Row) => {
      const { mac, serial } = identity(device);

      // Match an existing asset first so repeated scans never duplicate assets.
      const existing = assets.find((a) => {
        const aMac = String(a["mac_address"] ?? "").trim().toLowerCase();
        const aHost = String(a["hostname"] ?? "").trim().toLowerCase();
        return (mac && aMac === mac) || (serial && aHost === serial);
      });

      let assetId = existing ? String(existing["id"]) : null;

      if (!assetId) {
        const { data, error } = await supabase
          .from("assets")
          .insert({
            organization_id: user?.profile?.organization_id ?? null,
            created_by_id: user?.userId ?? null,
            name: String(device["hostname"] ?? device["ip_address"] ?? "Discovered device"),
            manufacturer: (device["manufacturer"] as string | null) ?? null,
            hostname: (device["hostname"] as string | null) ?? null,
            ip_address: (device["ip_address"] as string | null) ?? null,
            mac_address: (device["mac_address"] as string | null) ?? null,
            os: (device["os"] as string | null) ?? null,
            cpu: (device["cpu"] as string | null) ?? null,
            ram_gb: (device["ram_gb"] as number | null) ?? null,
            disk_gb: (device["disk_gb"] as number | null) ?? null,
            online_status: (device["online_status"] as string | null) ?? null,
            last_seen: (device["last_seen"] as string | null) ?? null,
            logged_in_user: (device["logged_in_user"] as string | null) ?? null,
            lifecycle_status: "deployed",
            condition: "good",
          })
          .select("id")
          .single();
        if (error) throw error;
        assetId = data.id;
      }

      const { error: linkError } = await supabase
        .from("network_devices")
        .update({ linked_asset_id: assetId })
        .eq("id", String(device["id"]));
      if (linkError) throw linkError;

      return { reused: !!existing };
    },
    onSuccess: ({ reused }) => {
      void qc.invalidateQueries({ queryKey: ["rows", "network_devices"] });
      void qc.invalidateQueries({ queryKey: ["rows", "assets"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(reused ? "Linked to the existing asset" : "Managed asset created");
    },
    onError: (e) => toast.error(friendlyError(e, "convert this device")),
    onSettled: () => setConverting(null),
  });

  return (
    <div className="space-y-4">
      <div className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {AGENT_CONFIGURED ? <ShieldCheck className="size-4" /> : <Radar className="size-4" />}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              {AGENT_CONFIGURED ? "Discovery agent connected" : "Discovery agent not configured"}
            </p>
            <p className="mt-1 max-w-xl text-xs text-muted-foreground">
              {AGENT_CONFIGURED
                ? "Scans run automatically and update the device list below."
                : "Scans require the AssetSphere discovery agent to be installed on a machine inside the network you are authorised to scan. Until then, devices can be added manually or imported, and reviewed and converted to assets here."}
            </p>
          </div>
        </div>
        <Button variant="outline" disabled title="Available once a discovery agent is connected">
          Run discovery
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Review discovered devices</h2>
            <p className="text-xs text-muted-foreground">
              Devices not yet linked to a managed asset. Matching uses MAC address and hostname, so
              converting the same device twice will not create duplicates.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {unlinked.length} unlinked of {devices.length} devices
          </p>
        </div>

        {isError ? (
          <div className="glass-card flex flex-col items-center gap-3 px-6 py-14 text-center">
            <AlertTriangle className="size-5 text-destructive" />
            <p className="text-sm">Unable to load discovered devices.</p>
            <Button variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="glass-card flex items-center justify-center py-16">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            rows={unlinked}
            emptyMessage={
              devices.length === 0
                ? "No devices discovered yet. Connect a discovery agent or import devices to get started."
                : "Every discovered device is already linked to a managed asset."
            }
            columns={[
              { name: "hostname", label: "Hostname", className: "font-medium" },
              { name: "ip_address", label: "IP", kind: "mono" },
              { name: "mac_address", label: "MAC", kind: "mono" },
              { name: "device_type", label: "Type", kind: "badge" },
              { name: "os", label: "OS" },
              { name: "last_seen", label: "Last seen", kind: "datetime" },
              { name: "online_status", label: "Status", kind: "badge" },
              ...(canWrite
                ? [
                    {
                      name: "__convert",
                      label: "",
                      render: (row: Row) => (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={converting === String(row["id"])}
                          onClick={() => {
                            setConverting(String(row["id"]));
                            convert.mutate(row);
                          }}
                        >
                          {converting === String(row["id"]) ? (
                            <Loader2 className="mr-2 size-3.5 animate-spin" />
                          ) : (
                            <Link2 className="mr-2 size-3.5" />
                          )}
                          Convert to asset
                        </Button>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        )}
      </div>
    </div>
  );
}
