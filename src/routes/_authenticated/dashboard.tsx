import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowUpRight, Loader2, Sparkles } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";
import { kpiSearch } from "@/lib/resource";
import { KPICard } from "@/components/app/KPICard";
import { PageHeader } from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AssetSphere AI" },
      {
        name: "description",
        content:
          "Live asset intelligence overview: inventory value, lifecycle status, maintenance load, licence compliance and expiry alerts.",
      },
      { property: "og:title", content: "Dashboard — AssetSphere AI" },
      {
        property: "og:description",
        content: "Live asset intelligence overview for your organization.",
      },
    ],
  }),
  component: Dashboard,
});

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const currency = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const soon = new Date();
      soon.setDate(soon.getDate() + 30);
      const soonISO = soon.toISOString().slice(0, 10);
      const today = new Date().toISOString().slice(0, 10);

      const [assets, maintenance, licenses, distribution, vehicles, devices, alerts] = await Promise.all([
        supabase
          .from("assets")
          .select(
            "id, name, asset_tag, category_name, lifecycle_status, condition, purchase_price, current_value, warranty_end, assigned_user_name, created_at",
          ),
        supabase.from("maintenance_records").select("id, title, status, priority, scheduled_date, asset_name"),
        supabase
          .from("software_licenses")
          .select("id, software_name, compliance_status, expiration_date, total_seats, used_seats"),
        supabase.from("distribution_requests").select("id, status, priority, asset_name, assigned_to_name"),
        supabase.from("vehicles").select("id, status, geofence_breach"),
        supabase.from("network_devices").select("id, online_status"),
        supabase
          .from("rfid_alerts")
          .select("id, message, severity, detected_at, status")
          .eq("status", "active")
          .order("detected_at", { ascending: false })
          .limit(5),
      ]);

      return {
        assets: assets.data ?? [],
        maintenance: maintenance.data ?? [],
        licenses: licenses.data ?? [],
        distribution: distribution.data ?? [],
        vehicles: vehicles.data ?? [],
        devices: devices.data ?? [],
        rfidAlerts: alerts.data ?? [],
        soonISO,
        today,
      };
    },
  });
}

function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const { assets, maintenance, licenses, distribution, vehicles, devices, rfidAlerts, soonISO, today } = data;

  const totalValue = assets.reduce((sum, a) => sum + Number(a.current_value ?? a.purchase_price ?? 0), 0);
  const deployed = assets.filter((a) => a.lifecycle_status === "deployed").length;
  const inMaintenance = assets.filter((a) => a.lifecycle_status === "in_maintenance").length;
  const openMaintenance = maintenance.filter((m) => m.status === "scheduled" || m.status === "in_progress");
  const overdue = openMaintenance.filter((m) => m.scheduled_date && m.scheduled_date < today);
  const expiringWarranties = assets.filter(
    (a) => a.warranty_end && a.warranty_end >= today && a.warranty_end <= soonISO,
  );
  const expiringLicenses = licenses.filter(
    (l) => l.expiration_date && l.expiration_date >= today && l.expiration_date <= soonISO,
  );
  const nonCompliant = licenses.filter((l) => l.compliance_status === "non_compliant").length;
  const pendingRequests = distribution.filter((d) => d.status === "pending").length;
  const onlineDevices = devices.filter((d) => d.online_status === "online").length;
  const breaches = vehicles.filter((v) => v.geofence_breach).length;

  const lifecycleData = Object.entries(
    assets.reduce<Record<string, number>>((acc, a) => {
      const key = (a.lifecycle_status ?? "new").replace("_", " ");
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([status, count]) => ({ status, count }));

  const categoryData = Object.entries(
    assets.reduce<Record<string, number>>((acc, a) => {
      const key = a.category_name ?? "Uncategorised";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const alerts: Array<{
    id: string;
    severity: "info" | "warning" | "critical";
    message: string;
    to: string;
    search?: Record<string, string> | undefined;
  }> = [
    ...expiringWarranties.slice(0, 4).map((a) => ({
      id: `w-${a.id}`,
      severity: "warning" as const,
      message: `Warranty for ${a.name} expires ${a.warranty_end}`,
      to: "/warranties",
      search: kpiSearch("warranties", {
        label: "Expiring warranties",
        value: 0,
        filter: { field: "warranty_end", op: "next_days", value: 30 },
      }),
    })),
    ...expiringLicenses.slice(0, 3).map((l) => ({
      id: `l-${l.id}`,
      severity: "warning" as const,
      message: `Licence ${l.software_name} expires ${l.expiration_date}`,
      to: "/software",
      search: kpiSearch("software", {
        label: "Expiring (30d)",
        value: 0,
        filter: { field: "expiration_date", op: "next_days", value: 30 },
      }),
    })),
    ...overdue.slice(0, 3).map((m) => ({
      id: `m-${m.id}`,
      severity: "critical" as const,
      message: `Overdue maintenance: ${m.title}${m.asset_name ? ` (${m.asset_name})` : ""}`,
      to: "/maintenance",
      search: kpiSearch("maintenance", {
        label: "Overdue",
        value: 0,
        filter: [
          { field: "status", op: "nin", value: ["completed", "cancelled"] },
          { field: "scheduled_date", op: "past" },
        ],
      }),
    })),
    ...rfidAlerts.map((a) => ({
      id: `r-${a.id}`,
      severity: (a.severity ?? "info") as "info" | "warning" | "critical",
      message: a.message,
      to: "/rfid/alerts",
      search: kpiSearch("rfid-alerts", {
        label: "Open alerts",
        value: 0,
        filter: { field: "status", op: "eq", value: "active" },
      }),
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back${user?.profile?.full_name ? `, ${user.profile.full_name.split(" ")[0]}` : ""}`}
        description={
          user?.profile?.organization_name
            ? `Asset intelligence overview for ${user.profile.organization_name}`
            : "Asset intelligence overview for your organization"
        }
        actions={
          <Button asChild>
            <Link to="/ai-assistant">
              <Sparkles className="mr-2 size-4" /> Ask the AI assistant
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Total assets" value={assets.length} icon="Boxes" hint={`${deployed} deployed`} to="/assets" />
        <KPICard
          label="Inventory value"
          value={currency(totalValue)}
          icon="Wallet"
          tone="success"
          hint="Current book value"
          to="/inventory"
          search={kpiSearch("inventory", { label: "Inventory value", value: 0, tab: "items" })}
        />
        <KPICard
          label="Open maintenance"
          value={openMaintenance.length}
          icon="Wrench"
          tone={overdue.length ? "destructive" : "warning"}
          hint={`${overdue.length} overdue · ${inMaintenance} assets in service`}
          to="/maintenance"
          search={kpiSearch("maintenance", {
            label: "Open maintenance",
            value: 0,
            filter: { field: "status", op: "in", value: ["scheduled", "in_progress"] },
          })}
        />
        <KPICard
          label="Licence compliance"
          value={`${licenses.length - nonCompliant}/${licenses.length}`}
          icon="ShieldCheck"
          tone={nonCompliant ? "destructive" : "success"}
          hint={`${expiringLicenses.length} expiring in 30 days`}
          to="/software"
          search={kpiSearch("software", {
            label: "Non-compliant licences",
            value: 0,
            filter: { field: "compliance_status", op: "eq", value: "non_compliant" },
          })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Pending requests"
          value={pendingRequests}
          icon="PackageCheck"
          tone="warning"
          to="/service-requests"
          search={kpiSearch("service-requests", {
            label: "Open requests",
            value: 0,
            filter: { field: "status", op: "nin", value: ["resolved", "closed", "rejected"] },
          })}
        />
        <KPICard
          label="Devices online"
          value={`${onlineDevices}/${devices.length}`}
          icon="Network"
          to="/network"
          search={kpiSearch("network", {
            label: "Online devices",
            value: 0,
            filter: { field: "online_status", op: "eq", value: "online" },
          })}
        />
        <KPICard
          label="Fleet vehicles"
          value={vehicles.length}
          icon="Truck"
          hint={`${breaches} geofence breaches`}
          tone={breaches ? "destructive" : "primary"}
          to="/vehicles"
          {...(breaches
            ? {
                search: kpiSearch("vehicles", {
                  label: "Geofence breaches",
                  value: 0,
                  filter: { field: "geofence_breach", op: "truthy" },
                }),
              }
            : {})}
        />
        <KPICard
          label="Warranties expiring"
          value={expiringWarranties.length}
          icon="ShieldAlert"
          tone="warning"
          hint="Next 30 days"
          to="/warranties"
          search={kpiSearch("warranties", {
            label: "Expiring warranties",
            value: 0,
            filter: { field: "warranty_end", op: "next_days", value: 30 },
          })}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Assets by Lifecycle Status Chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Assets by lifecycle status</h2>
            <Link to="/assets" className="inline-flex items-center text-xs text-primary hover:underline">
              View assets <ArrowUpRight className="ml-1 size-3" />
            </Link>
          </div>
          <div className="mt-4 h-64 cursor-pointer">
            {lifecycleData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lifecycleData}
                  onClick={(entry) => {
                    const label: string | undefined = entry?.activePayload?.[0]?.payload?.status;
                    const status = label ? label.replace(/ /g, "_") : null;
                    navigate({
                      to: "/assets",
                      search: status
                        ? kpiSearch("assets", {
                            label: `Lifecycle: ${label}`,
                            value: 0,
                            filter: { field: "lifecycle_status", op: "eq", value: status },
                          })
                        : {},
                    } as never);
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="status" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart label="No assets recorded yet" />
            )}
          </div>
        </div>

        {/* Top Categories Pie Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Top categories</h2>
            <Link to="/asset-categories" className="inline-flex items-center text-xs text-primary hover:underline">
              Categories <ArrowUpRight className="ml-1 size-3" />
            </Link>
          </div>
          <div className="mt-4 h-64 cursor-pointer">
            {categoryData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart
                  onClick={(entry) => {
                    const name: string | undefined = (entry as { activePayload?: Array<{ name?: string }> })
                      ?.activePayload?.[0]?.name;
                    navigate({
                      to: "/assets",
                      search: name
                        ? kpiSearch("assets", {
                            label: `Category: ${name}`,
                            value: 0,
                            filter: { field: "category_name", op: "eq", value: name },
                          })
                        : {},
                    } as never);
                  }}
                >
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart label="No categories yet" />
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Alerts & Expiries List */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Alerts &amp; expiries</h2>
            <Badge variant="secondary">{alerts.length}</Badge>
          </div>
          <ul className="mt-4 space-y-2">
            {alerts.length ? (
              alerts.slice(0, 8).map((a) => (
                <li
                  key={a.id}
                  onClick={() => navigate({ to: a.to, search: a.search ?? {} } as never)}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50 cursor-pointer"
                >
                  <AlertTriangle
                    className={
                      a.severity === "critical"
                        ? "mt-0.5 size-4 shrink-0 text-destructive"
                        : a.severity === "warning"
                          ? "mt-0.5 size-4 shrink-0 text-warning"
                          : "mt-0.5 size-4 shrink-0 text-muted-foreground"
                    }
                  />
                  <span className="text-sm font-medium">{a.message}</span>
                </li>
              ))
            ) : (
              <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Nothing needs attention right now.
              </li>
            )}
          </ul>
        </div>

        {/* Recently Added Assets List */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recently added assets</h2>
            <Link to="/assets" className="inline-flex items-center text-xs text-primary hover:underline">
              View all <ArrowUpRight className="ml-1 size-3" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {assets.length ? (
              [...assets]
                .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                .slice(0, 6)
                .map((a) => (
                  <li
                    key={a.id}
                    onClick={() => navigate({ to: "/assets/$id", params: { id: a.id } } as never)}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-accent/50 cursor-pointer px-2 rounded-md"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[a.asset_tag, a.category_name, a.assigned_user_name].filter(Boolean).join(" · ") ||
                          "No details"}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {(a.lifecycle_status ?? "new").replace("_", " ")}
                    </Badge>
                  </li>
                ))
            ) : (
              <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No assets yet — add your first asset to populate the dashboard.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      {label}
    </div>
  );
}
