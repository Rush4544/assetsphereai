import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { useRows } from "@/lib/crud";
import { countWhere, fmtDateTime } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/rfid/settings")({
  head: () => ({
    meta: [
      { title: "RFID Settings — AssetSphere AI" },
      { name: "description", content: "Provider configuration and alert routing." },
      { property: "og:title", content: "RFID Settings — AssetSphere AI" },
      { property: "og:description", content: "Provider configuration and alert routing." },
    ],
  }),
  component: RfidSettingsPage,
});

function RfidSettingsPage() {
  const gateways = useRows("rfid_gateways");
  const readers = useRows("rfid_readers");
  const zones = useRows("rfid_zones");
  const alerts = useRows("rfid_alerts", { limit: 500 });

  const providers = [...new Set((gateways.data ?? []).map((g) => String(g["provider_type"] ?? "Unspecified")))];
  const channels = [
    ...new Set(
      (alerts.data ?? []).flatMap((a) =>
        Array.isArray(a["notification_channels"]) ? (a["notification_channels"] as string[]) : [],
      ),
    ),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="RFID Settings"
        description="Provider configuration, hardware health and alert routing for your RFID estate."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/rfid/onboarding">Request a deployment</Link>
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold">Providers in use</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {providers.length === 0 && (
              <p className="text-sm text-muted-foreground">No gateways registered yet.</p>
            )}
            {providers.map((p) => (
              <span key={p} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {p}
              </span>
            ))}
          </div>

          <h2 className="mt-6 text-sm font-semibold">Alert routing channels</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {channels.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No channels configured. Set notification channels on individual alerts.
              </p>
            )}
            {channels.map((c) => (
              <span key={c} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium capitalize">
                {c}
              </span>
            ))}
          </div>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Zones configured</dt>
              <dd className="font-medium">{(zones.data ?? []).length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Authorized-only zones</dt>
              <dd className="font-medium">{countWhere(zones.data ?? [], (z) => z["authorized_only"] === true)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Readers deployed</dt>
              <dd className="font-medium">{(readers.data ?? []).length}</dd>
            </div>
          </dl>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold">Gateway health</h2>
          <div className="mt-4 space-y-3">
            {(gateways.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add gateways under RFID Tracking → Gateways to monitor them here.
              </p>
            )}
            {(gateways.data ?? []).map((g) => (
              <div key={String(g["id"])} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{String(g["name"])}</p>
                  <StatusBadge value={g["gateway_status"]} className="px-1.5 py-0 text-[10px]" />
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {String(g["building_name"] ?? "—")} · {String(g["connected_reader_count"] ?? 0)} readers ·
                  firmware {String(g["firmware_version"] ?? "—")} · heartbeat {fmtDateTime(g["last_heartbeat"])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
