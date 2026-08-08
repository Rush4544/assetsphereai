import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";

import { FileGallery } from "@/components/app/FileField";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { currency, fmtDate, humanize, type Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/assets_/$id")({
  head: () => ({
    meta: [
      { title: "Asset Detail — AssetSphere AI" },
      { name: "description", content: "Complete asset record: financials, location, components, work history, sensors and files." },
      { property: "og:title", content: "Asset Detail — AssetSphere AI" },
      { property: "og:description", content: "Complete asset record: financials, location, components, work history, sensors and files." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssetDetailPage,
});

const db = supabase as unknown as { from: (t: string) => any };

function useAsset(id: string) {
  return useQuery({
    queryKey: ["asset-detail", id],
    queryFn: async () => {
      const [asset, children, workOrders, requests, devices, docs, maintenance] = await Promise.all([
        db.from("assets").select("*").eq("id", id).maybeSingle(),
        db.from("assets").select("id, name, asset_tag, lifecycle_status").eq("parent_asset_id", id),
        db.from("work_orders").select("*").eq("asset_id", id).order("created_at", { ascending: false }),
        db.from("service_requests").select("*").eq("asset_id", id).order("created_at", { ascending: false }),
        db.from("iot_devices").select("*").eq("asset_id", id),
        db.from("documents").select("*").eq("entity_id", id),
        db.from("maintenance_records").select("*").eq("asset_id", id).order("created_at", { ascending: false }),
      ]);
      return {
        asset: (asset.data ?? null) as Row | null,
        children: (children.data ?? []) as Row[],
        workOrders: (workOrders.data ?? []) as Row[],
        requests: (requests.data ?? []) as Row[],
        devices: (devices.data ?? []) as Row[],
        docs: (docs.data ?? []) as Row[],
        maintenance: (maintenance.data ?? []) as Row[],
      };
    },
  });
}

function Facts({ items }: { items: Array<[string, unknown]> }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-border p-3">
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
          <dd className="mt-0.5 text-sm font-medium">
            {value === null || value === undefined || value === "" ? "—" : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function AssetDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading } = useAsset(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    );
  }

  const asset = data?.asset;
  if (!asset) {
    return (
      <div className="glass-card p-6">
        <p className="text-sm text-muted-foreground">This asset could not be found.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/assets">Back to assets</Link>
        </Button>
      </div>
    );
  }

  const photos = [
    ...(Array.isArray(asset["photo_urls"]) ? (asset["photo_urls"] as string[]) : []),
    ...(Array.isArray(asset["receipt_urls"]) ? (asset["receipt_urls"] as string[]) : []),
    ...(Array.isArray(asset["document_urls"]) ? (asset["document_urls"] as string[]) : []),
  ];

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/assets">
          <ArrowLeft className="mr-1 size-4" /> All assets
        </Link>
      </Button>

      <PageHeader
        title={String(asset["name"])}
        description={`${String(asset["asset_tag"] ?? "No tag")} · ${String(asset["category_name"] ?? "Uncategorised")} · ${humanize(asset["lifecycle_status"])}`}
        actions={<StatusBadge value={asset["condition"]} />}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="components">Components ({data?.children.length ?? 0})</TabsTrigger>
          <TabsTrigger value="work">Work history ({(data?.workOrders.length ?? 0) + (data?.maintenance.length ?? 0)})</TabsTrigger>
          <TabsTrigger value="sensors">Sensors ({data?.devices.length ?? 0})</TabsTrigger>
          <TabsTrigger value="files">Files ({photos.length + (data?.docs.length ?? 0)})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-4">
          <Facts
            items={[
              ["Asset type", asset["asset_type_name"]],
              ["Asset class", asset["asset_class"]],
              ["Criticality", humanize(asset["criticality"])],
              ["Manufacturer", asset["manufacturer"]],
              ["Model", asset["model"]],
              ["Serial number", asset["serial_number"]],
              ["Barcode", asset["barcode"]],
              ["QR code", asset["qr_code"]],
              ["Parent asset", asset["parent_asset_name"]],
              ["Installed", fmtDate(asset["installation_date"])],
              ["Meter", asset["meter_reading"] ? `${asset["meter_reading"]} ${String(asset["meter_unit"] ?? "")}` : null],
              ["Assigned to", asset["assigned_user_name"]],
              ["Department", asset["department_name"]],
              ["Site", asset["site_name"]],
              ["Building", asset["building_name"]],
              ["Room", asset["room_name"]],
              ["Next maintenance", fmtDate(asset["next_maintenance_date"])],
            ]}
          />
          {asset["notes"] ? (
            <div className="glass-card p-4">
              <h2 className="text-sm font-semibold">Notes</h2>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{String(asset["notes"])}</p>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="financials" className="mt-0">
          <Facts
            items={[
              ["Purchase price", currency(asset["purchase_price"])],
              ["Current value", currency(asset["current_value"])],
              ["Replacement cost", currency(asset["replacement_cost"])],
              ["Insurance value", currency(asset["insurance_value"])],
              ["Depreciation", humanize(asset["depreciation_method"])],
              ["Useful life (years)", asset["useful_life_years"]],
              ["Residual value", currency(asset["residual_value"])],
              ["Purchase date", fmtDate(asset["purchase_date"])],
              ["Warranty", `${fmtDate(asset["warranty_start"])} → ${fmtDate(asset["warranty_end"])}`],
              ["Vendor", asset["vendor_name"]],
              ["Purchase order", asset["purchase_order_number"]],
              ["Invoice", asset["invoice_number"]],
              ["Cost centre", asset["cost_centre"]],
              ["Budget code", asset["budget_code"]],
              ["Funding source", asset["funding_source"]],
            ]}
          />
        </TabsContent>

        <TabsContent value="components" className="mt-0 space-y-2">
          {(data?.children ?? []).length === 0 && (
            <p className="glass-card p-5 text-sm text-muted-foreground">
              No child components. Set this asset as the parent on another asset to build a hierarchy.
            </p>
          )}
          {(data?.children ?? []).map((c) => (
            <Link
              key={String(c["id"])}
              to="/assets/$id"
              params={{ id: String(c["id"]) }}
              className="glass-card flex items-center justify-between p-4 hover:shadow-lg"
            >
              <span className="text-sm font-medium">{String(c["name"])}</span>
              <StatusBadge value={c["lifecycle_status"]} className="px-1.5 py-0 text-[10px]" />
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="work" className="mt-0 space-y-2">
          {[...(data?.workOrders ?? []), ...(data?.maintenance ?? [])].length === 0 && (
            <p className="glass-card p-5 text-sm text-muted-foreground">No work recorded against this asset yet.</p>
          )}
          {(data?.workOrders ?? []).map((w) => (
            <div key={String(w["id"])} className="glass-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{String(w["title"])}</p>
                <StatusBadge value={w["status"]} className="px-1.5 py-0 text-[10px]" />
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {humanize(w["work_type"])} · {String(w["assigned_to_name"] ?? "Unassigned")} · due{" "}
                {fmtDate(w["due_date"])} · {currency(w["total_cost"])}
              </p>
            </div>
          ))}
          {(data?.maintenance ?? []).map((m) => (
            <div key={String(m["id"])} className="glass-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{String(m["title"])}</p>
                <StatusBadge value={m["status"]} className="px-1.5 py-0 text-[10px]" />
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {humanize(m["maintenance_type"])} · {String(m["technician_name"] ?? "—")} ·{" "}
                {fmtDate(m["scheduled_date"])} · {currency(m["cost"])}
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="sensors" className="mt-0 space-y-2">
          {(data?.devices ?? []).length === 0 && (
            <p className="glass-card p-5 text-sm text-muted-foreground">
              No sensors linked. Add an IoT device and set this asset as its target.
            </p>
          )}
          {(data?.devices ?? []).map((d) => (
            <div key={String(d["id"])} className="glass-card flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{String(d["name"])}</p>
                <p className="text-[11px] text-muted-foreground">
                  {humanize(d["metric"])} · thresholds {String(d["min_threshold"] ?? "—")} –{" "}
                  {String(d["max_threshold"] ?? "—")}
                </p>
              </div>
              <p className="text-lg font-semibold">
                {String(d["current_value"] ?? "—")} <span className="text-xs font-normal">{String(d["unit"] ?? "")}</span>
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="files" className="mt-0 space-y-4">
          <FileGallery paths={photos} />
          {(data?.docs ?? []).map((doc) => (
            <div key={String(doc["id"])} className="glass-card p-4 text-sm">
              <p className="font-medium">{String(doc["title"])}</p>
              <p className="text-[11px] text-muted-foreground">{humanize(doc["doc_type"])}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}