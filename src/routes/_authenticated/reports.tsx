import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download, Loader2 } from "lucide-react";
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

import { PageHeader } from "@/components/app/PageHeader";
import { KPICard } from "@/components/app/KPICard";
import { Button } from "@/components/ui/button";
import { useRows } from "@/lib/crud";
import { currency, sum, type Row } from "@/lib/resource";

const PALETTE = ["hsl(221 83% 53%)", "hsl(160 84% 39%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(262 83% 58%)", "hsl(199 89% 48%)"];

function groupCount(rows: Row[], key: string, fallback = "Unspecified") {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const k = String(r[key] ?? fallback) || fallback;
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function groupSum(rows: Row[], key: string, valueKey: string, fallback = "Unspecified") {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const k = String(r[key] ?? fallback) || fallback;
    const v = typeof r[valueKey] === "number" ? (r[valueKey] as number) : 0;
    map.set(k, (map.get(k) ?? 0) + v);
  });
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function toCsv(rows: Row[]) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0] as object);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => escape(r[c])).join(","))].join("\n");
}

function download(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AssetSphere AI" },
      { name: "description", content: "Financial and operational reporting across the organization." },
      { property: "og:title", content: "Reports — AssetSphere AI" },
      { property: "og:description", content: "Financial and operational reporting across the organization." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const assets = useRows("assets");
  const maintenance = useRows("maintenance_records");
  const licences = useRows("software_licenses");
  const vehicles = useRows("vehicles");

  const rows = assets.data ?? [];
  const byCategory = useMemo(() => groupCount(rows, "category_name"), [rows]);
  const valueByDepartment = useMemo(() => groupSum(rows, "department_name", "purchase_price"), [rows]);
  const byCondition = useMemo(() => groupCount(rows, "condition"), [rows]);
  const maintenanceCost = useMemo(
    () => groupSum(maintenance.data ?? [], "maintenance_type", "cost"),
    [maintenance.data],
  );

  const isLoading = assets.isLoading || maintenance.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Financial and operational reporting across assets, maintenance, licences and fleet."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => download("assets.csv", toCsv(rows))}>
              <Download className="mr-2 size-4" /> Assets CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => download("maintenance.csv", toCsv(maintenance.data ?? []))}>
              <Download className="mr-2 size-4" /> Maintenance CSV
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Total asset value" value={currency(sum(rows, "purchase_price"))} icon="Wallet" />
        <KPICard label="Current book value" value={currency(sum(rows, "current_value"))} icon="TrendingDown" tone="warning" />
        <KPICard label="Maintenance spend" value={currency(sum(maintenance.data ?? [], "cost"))} icon="Wrench" tone="destructive" />
        <KPICard label="Licence spend" value={currency(sum(licences.data ?? [], "total_cost"))} icon="KeyRound" tone="success" />
      </div>

      {isLoading ? (
        <div className="glass-card flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold">Assets by category</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(215 20% 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(221 83% 53%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold">Purchase value by department</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={valueByDepartment} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(215 20% 90%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => currency(Number(v))} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(160 84% 39%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold">Condition mix</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCondition} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                    {byCondition.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold">Maintenance cost by type</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceCost}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(215 20% 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => currency(Number(v))} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(38 92% 50%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-5 xl:col-span-2">
            <h2 className="text-sm font-semibold">Fleet summary</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Vehicles</p>
                <p className="text-2xl font-semibold">{(vehicles.data ?? []).length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total mileage (km)</p>
                <p className="text-2xl font-semibold">
                  {sum(vehicles.data ?? [], "total_mileage_km").toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fleet purchase value</p>
                <p className="text-2xl font-semibold">{currency(sum(vehicles.data ?? [], "purchase_price"))}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
