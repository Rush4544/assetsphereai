import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/import")({
  head: () => ({
    meta: [
      { title: "Import Data — AssetSphere AI" },
      { name: "description", content: "Bulk import assets, inventory, work orders and more from CSV or spreadsheets." },
      { property: "og:title", content: "Import Data — AssetSphere AI" },
      { property: "og:description", content: "Bulk import assets, inventory, work orders and more from CSV or spreadsheets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImportPage,
});

const TARGETS = [
  { table: "assets", label: "Assets", sample: "name,asset_tag,manufacturer,model,serial_number,purchase_price,lifecycle_status" },
  { table: "inventory_items", label: "Inventory items", sample: "name,sku,item_type,quantity_on_hand,reorder_point,unit_cost" },
  { table: "work_orders", label: "Work orders", sample: "title,work_type,priority,status,assigned_to_name,due_date" },
  { table: "service_requests", label: "Service requests", sample: "title,category,priority,status,requester_name" },
  { table: "vehicles", label: "Vehicles", sample: "name,license_plate,make,model,year,vehicle_type" },
  { table: "buildings", label: "Buildings", sample: "name,address,city,floors" },
  { table: "sites", label: "Sites", sample: "name,site_type,city,gps_lat,gps_lng" },
  { table: "vendors", label: "Vendors", sample: "name,contact_name,email,phone,vendor_type" },
];

const NUMERIC = /^-?\d+(\.\d+)?$/;

function parseCsv(text: string): Array<Record<string, unknown>> {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else quoted = !quoted;
      } else if (ch === "," && !quoted) {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out.map((v) => v.trim());
  };
  const headers = split(lines[0]!);
  return lines.slice(1).map((line) => {
    const cells = split(line);
    const row: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      const raw = cells[i] ?? "";
      if (!h || raw === "") return;
      if (raw === "true" || raw === "false") row[h] = raw === "true";
      else if (NUMERIC.test(raw)) row[h] = Number(raw);
      else row[h] = raw;
    });
    return row;
  });
}

function ImportPage() {
  const [table, setTable] = useState(TARGETS[0]!.table);
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const target = TARGETS.find((t) => t.table === table)!;

  async function run() {
    const rows = parseCsv(csv);
    if (rows.length === 0) {
      toast.error("Add a header row and at least one data row.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const db = supabase as unknown as { from: (t: string) => { insert: (r: unknown) => Promise<{ error: unknown }> } };
      const { error } = await db.from(table).insert(rows);
      if (error) throw error;
      setResult(`Imported ${rows.length} row${rows.length > 1 ? "s" : ""} into ${target.label}.`);
      setCsv("");
      toast.success("Import complete");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Import failed";
      setResult(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Data"
        description="Paste CSV exported from your spreadsheet or previous system. Columns are matched to field names, numbers and true/false are converted automatically."
      />

      <div className="glass-card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Import into</Label>
            <Select value={table} onValueChange={setTable}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TARGETS.map((t) => (
                  <SelectItem key={t.table} value={t.table}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Suggested header row</Label>
            <code className="block truncate rounded-md bg-secondary px-3 py-2 text-xs">{target.sample}</code>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv">CSV data</Label>
          <Textarea
            id="csv"
            rows={12}
            value={csv}
            placeholder={`${target.sample}\n…`}
            onChange={(e) => setCsv(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => void run()} disabled={busy}>
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
            Import rows
          </Button>
          <label className="cursor-pointer text-xs font-medium text-primary underline">
            or choose a .csv file
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) setCsv(await file.text());
              }}
            />
          </label>
        </div>

        {result && <p className="text-sm text-muted-foreground">{result}</p>}
      </div>
    </div>
  );
}