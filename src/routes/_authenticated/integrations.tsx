import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Icon } from "@/components/app/icon";
import { Button } from "@/components/ui/button";
import { useRows, useSaveRow } from "@/lib/crud";
import { fmtDateTime, type Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — AssetSphere AI" },
      { name: "description", content: "Connect accounting, HR, identity, IoT, ERP and communication systems to AssetSphere." },
      { property: "og:title", content: "Integrations — AssetSphere AI" },
      { property: "og:description", content: "Connect accounting, HR, identity, IoT, ERP and communication systems to AssetSphere." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntegrationsPage,
});

type Catalog = { key: string; name: string; category: string; icon: string; blurb: string };

const CATALOG: Catalog[] = [
  { key: "quickbooks", name: "QuickBooks", category: "Accounting", icon: "Calculator", blurb: "Sync asset purchases, depreciation and invoices." },
  { key: "xero", name: "Xero", category: "Accounting", icon: "Receipt", blurb: "Push purchase orders and maintenance spend." },
  { key: "sap", name: "SAP", category: "ERP", icon: "Database", blurb: "Two-way asset master and cost centre sync." },
  { key: "oracle", name: "Oracle ERP", category: "ERP", icon: "Server", blurb: "Financial postings for capital assets." },
  { key: "bamboohr", name: "BambooHR", category: "HR", icon: "Users", blurb: "Employee directory for assignments and onboarding." },
  { key: "workday", name: "Workday", category: "HR", icon: "UserCog", blurb: "Departments, cost centres and staff changes." },
  { key: "azure-ad", name: "Microsoft Entra ID", category: "Identity", icon: "ShieldCheck", blurb: "SSO and automatic user provisioning." },
  { key: "google-workspace", name: "Google Workspace", category: "Identity", icon: "Mail", blurb: "SSO plus calendar for maintenance schedules." },
  { key: "slack", name: "Slack", category: "Communication", icon: "MessageSquare", blurb: "Route alerts and work order updates to channels." },
  { key: "teams", name: "Microsoft Teams", category: "Communication", icon: "MessagesSquare", blurb: "Approvals and alerts inside Teams." },
  { key: "twilio", name: "Twilio SMS", category: "Communication", icon: "Smartphone", blurb: "SMS alerts for urgent work and geofence breaches." },
  { key: "mqtt", name: "MQTT Broker", category: "IoT", blurb: "Ingest sensor telemetry into IoT devices.", icon: "Radio" },
  { key: "zapier", name: "Zapier", category: "Automation", icon: "Zap", blurb: "Trigger 5,000+ apps from AssetSphere events." },
  { key: "webhooks", name: "Outbound Webhooks", category: "Automation", icon: "Webhook", blurb: "POST every event to your own endpoint." },
  { key: "stripe", name: "Stripe", category: "Billing", icon: "CreditCard", blurb: "Subscription billing for tenant plans." },
  { key: "gis", name: "GIS / Esri", category: "Mapping", icon: "Map", blurb: "Map linear and municipal assets to layers." },
];

function IntegrationsPage() {
  const { data } = useRows("integrations", { limit: 200 });
  const save = useSaveRow("integrations");

  const byKey = useMemo(() => {
    const map = new Map<string, Row>();
    for (const r of data ?? []) map.set(String(r["provider_key"]), r);
    return map;
  }, [data]);

  const categories = [...new Set(CATALOG.map((c) => c.category))];

  function request(item: Catalog) {
    const existing = byKey.get(item.key);
    save.mutate(
      {
        ...(existing ? { id: String(existing["id"]) } : {}),
        provider_key: item.key,
        provider_name: item.name,
        category: item.category,
        connection_status: "configuration_required",
        availability: "available",
      },
      { onSuccess: () => toast.success(`${item.name} marked for configuration`) },
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Integrations"
        description="Connect the systems your organization already runs. Mark an integration for configuration and an admin can finish the setup."
      />

      {categories.map((cat) => (
        <section key={cat} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{cat}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CATALOG.filter((c) => c.category === cat).map((item) => {
              const row = byKey.get(item.key);
              const status = String(row?.["connection_status"] ?? "not_connected");
              return (
                <article key={item.key} className="glass-card flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={item.icon} className="size-5" />
                    </span>
                    <StatusBadge value={status} className="px-1.5 py-0 text-[10px]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.blurb}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {row?.["last_sync_at"] ? `Last sync ${fmtDateTime(row["last_sync_at"])}` : "Never synced"}
                  </p>
                  <Button size="sm" variant="outline" className="mt-auto" onClick={() => request(item)}>
                    {status === "not_connected" ? "Request setup" : "Update status"}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}