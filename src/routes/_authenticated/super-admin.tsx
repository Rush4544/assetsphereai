import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { KPICard } from "@/components/app/KPICard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { useRows } from "@/lib/crud";
import { countWhere, currency, sum, type Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/super-admin")({
  head: () => ({
    meta: [
      { title: "Super Admin Portal — AssetSphere AI" },
      { name: "description", content: "Platform-wide administration and diagnostics." },
      { property: "og:title", content: "Super Admin Portal — AssetSphere AI" },
      { property: "og:description", content: "Platform-wide administration and diagnostics." },
    ],
  }),
  component: SuperAdminPage,
});

function SuperAdminPage() {
  const orgs = useRows("organizations");
  const assets = useRows("assets");
  const invoices = useRows("invoices");
  const deployments = useRows("rfid_deployment_requests");
  const audit = useRows("audit_logs", { limit: 12 });

  const orgRows = orgs.data ?? [];

  const perOrg = useMemo(() => {
    const counts = new Map<string, number>();
    (assets.data ?? []).forEach((a: Row) => {
      const k = String(a["organization_id"] ?? "");
      counts.set(k, (counts.get(k) ?? 0) + 1);
    });
    return orgRows.map((o) => ({
      id: String(o["id"]),
      name: String(o["name"]),
      plan: String(o["subscription_plan"] ?? "—"),
      status: o["subscription_status"],
      assets: counts.get(String(o["id"])) ?? 0,
      maxAssets: Number(o["max_assets"] ?? 0),
    }));
  }, [orgRows, assets.data]);

  const isLoading = orgs.isLoading || assets.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Portal"
        description="Platform-wide tenant health, billing and deployment pipeline."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/organizations">Organizations</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/users-management">Manage users</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Tenants" value={orgRows.length} icon="Landmark" />
        <KPICard
          label="Active subscriptions"
          value={countWhere(orgRows, (o) => o["subscription_status"] === "active")}
          icon="BadgeCheck"
          tone="success"
        />
        <KPICard label="Assets platform-wide" value={(assets.data ?? []).length} icon="Boxes" />
        <KPICard
          label="Invoiced total"
          value={currency(sum(invoices.data ?? [], "total"))}
          icon="Receipt"
          tone="warning"
        />
      </div>

      {isLoading ? (
        <div className="glass-card flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold">Tenant usage</h2>
            <div className="mt-4 space-y-3">
              {perOrg.length === 0 && <p className="text-sm text-muted-foreground">No tenants yet.</p>}
              {perOrg.map((o) => (
                <div key={o.id}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium">{o.name}</span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="capitalize">{o.plan}</span>
                      <StatusBadge value={o.status} className="px-1.5 py-0 text-[10px]" />
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${o.maxAssets ? Math.min(100, (o.assets / o.maxAssets) * 100) : o.assets ? 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {o.assets} assets{o.maxAssets ? ` of ${o.maxAssets} allowed` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold">RFID deployment pipeline</h2>
            <div className="mt-4 space-y-3">
              {(deployments.data ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No deployment requests submitted.</p>
              )}
              {(deployments.data ?? []).slice(0, 8).map((d) => (
                <div key={String(d["id"])} className="border-b border-border pb-2 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{String(d["company_name"])}</p>
                    <StatusBadge value={d["request_status"]} className="px-1.5 py-0 text-[10px]" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {String(d["contact_person"])} · {String(d["estimated_assets"] ?? 0)} assets ·{" "}
                    {String(d["number_of_buildings"] ?? 0)} buildings
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 xl:col-span-2">
            <h2 className="text-sm font-semibold">Recent platform activity</h2>
            <div className="mt-4 space-y-2">
              {(audit.data ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No audit entries yet.</p>
              )}
              {(audit.data ?? []).map((a) => (
                <div key={String(a["id"])} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">
                      {String(a["action"])} · {String(a["entity_type"] ?? "")} {String(a["entity_name"] ?? "")}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {String(a["user_name"] ?? a["user_email"] ?? "system")}
                    </p>
                  </div>
                  <StatusBadge value={a["severity"]} className="shrink-0 px-1.5 py-0 text-[10px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
