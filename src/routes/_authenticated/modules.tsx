import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Icon } from "@/components/app/icon";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/modules")({
  head: () => ({
    meta: [
      { title: "Modules — AssetSphere AI" },
      { name: "description", content: "Turn platform modules on or off and pick an industry template for your organization." },
      { property: "og:title", content: "Modules — AssetSphere AI" },
      { property: "og:description", content: "Turn platform modules on or off and pick an industry template for your organization." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModulesPage,
});

const MODULES = [
  { key: "asset_registry", label: "Asset Registry", icon: "Boxes", blurb: "Universal asset records, hierarchies and lifecycle." },
  { key: "cmms", label: "Maintenance (CMMS)", icon: "Wrench", blurb: "Work orders, PM plans and technician workflows." },
  { key: "service_desk", label: "Service Desk", icon: "Inbox", blurb: "Request intake, triage and SLA tracking." },
  { key: "inventory", label: "Inventory & Parts", icon: "PackageSearch", blurb: "Stock levels, reorder points and movements." },
  { key: "fleet", label: "Fleet & Vehicles", icon: "Truck", blurb: "Vehicles, GPS, geofences and service history." },
  { key: "it_assets", label: "IT Assets", icon: "Network", blurb: "Network discovery, software licences and devices." },
  { key: "rfid", label: "RFID Tracking", icon: "Radio", blurb: "Tags, readers, zones and movement history." },
  { key: "iot", label: "IoT & Sensors", icon: "Activity", blurb: "Telemetry, thresholds and condition monitoring." },
  { key: "facilities", label: "Facilities & Space", icon: "Building", blurb: "Sites, buildings, rooms and floor plans." },
  { key: "workforce", label: "Workforce", icon: "Users", blurb: "People, crews, assignments and permissions." },
  { key: "automation", label: "Automation & Workflows", icon: "Workflow", blurb: "No-code rules, approvals and escalations." },
  { key: "analytics", label: "Analytics & AI", icon: "BarChart3", blurb: "Reports, forecasts and the AI assistant." },
];

const TEMPLATES = [
  "general",
  "healthcare",
  "education",
  "manufacturing",
  "municipal",
  "property_management",
  "construction",
  "logistics",
  "hospitality",
  "retail",
  "energy_utilities",
  "government",
];

function ModulesPage() {
  const { data: user } = useCurrentUser();
  const orgId = user?.profile?.organization_id ?? null;
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [template, setTemplate] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    void (async () => {
      const { data } = await supabase
        .from("organizations")
        .select("enabled_modules, industry_template")
        .eq("id", orgId)
        .maybeSingle();
      const flags = (data?.enabled_modules ?? {}) as Record<string, boolean>;
      setEnabled(
        Object.fromEntries(MODULES.map((m) => [m.key, flags[m.key] ?? true])),
      );
      setTemplate(String(data?.industry_template ?? "general"));
      setLoading(false);
    })();
  }, [orgId]);

  async function save() {
    if (!orgId) return;
    setSaving(true);
    const { error } = await supabase
      .from("organizations")
      .update({ enabled_modules: enabled, industry_template: template })
      .eq("id", orgId);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Modules updated");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modules & Industry Template"
        description="AssetSphere is modular: enable only what your industry needs. Everything stays in one platform and one database."
        actions={
          <Button onClick={() => void save()} disabled={!orgId || saving}>
            {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Save changes
          </Button>
        }
      />

      {!orgId && (
        <p className="glass-card p-5 text-sm text-muted-foreground">
          Module settings apply to a specific organization. Sign in with an organization account to change them.
        </p>
      )}

      <div className="glass-card max-w-md space-y-2 p-5">
        <Label>Industry template</Label>
        <Select value={template} onValueChange={setTemplate}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATES.map((t) => (
              <SelectItem key={t} value={t}>
                {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Templates preset terminology, asset types and default maintenance plans for your sector.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((m) => (
            <article key={m.key} className="glass-card flex items-start gap-3 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name={m.icon} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{m.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.blurb}</p>
              </div>
              <Switch
                checked={enabled[m.key] ?? true}
                onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [m.key]: v }))}
                aria-label={`Enable ${m.label}`}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}