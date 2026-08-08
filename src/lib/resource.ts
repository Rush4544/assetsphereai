import type { ReactNode } from "react";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "select"
  | "switch"
  | "email"
  | "files";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
  /** Grouping tab inside the create/edit dialog. */
  group?: string;
  /** Reference another table for a picker: { table, labelColumn, mirrorTo } */
  ref?: { table: string; labelColumn?: string; mirrorTo?: string };
  /** For "files": accept attribute + storage folder. */
  accept?: string;
  folder?: string;
};

export type Column = {
  name: string;
  label: string;
  kind?: "text" | "badge" | "currency" | "date" | "datetime" | "bool" | "pct" | "mono";
  className?: string;
  render?: (row: Row) => ReactNode;
};

export type Row = Record<string, unknown>;

export type Kpi = {
  label: string;
  value: string | number;
  icon?: string;
  tone?: "primary" | "success" | "warning" | "destructive";
  /** Clicking the card navigates here. */
  to?: string;
  /** Filter applied to the destination list when the card is clicked. */
  filter?: KpiFilter | KpiFilter[];
  /** Tab to activate on the destination page (for tabbed modules). */
  tab?: string;
};

/** Serializable row predicate used to drive filtered list views from KPI cards. */
export type FilterOp =
  | "eq"
  | "neq"
  | "in"
  | "nin"
  | "truthy"
  | "falsy"
  | "set"
  | "unset"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "past"
  | "next_days"
  | "lte_field"
  | "outside_thresholds";

export type KpiFilter = {
  field: string;
  op?: FilterOp;
  value?: string | number | boolean | Array<string | number> | null;
};

const asArray = (f: KpiFilter | KpiFilter[] | undefined): KpiFilter[] =>
  !f ? [] : Array.isArray(f) ? f : [f];

const num = (v: unknown) => (v === null || v === undefined || v === "" ? NaN : Number(v));
const time = (v: unknown) => {
  if (!v) return NaN;
  const d = new Date(String(v));
  return d.getTime();
};

function matchesOne(row: Row, f: KpiFilter): boolean {
  const v = row[f.field];
  const op = f.op ?? "eq";
  switch (op) {
    case "eq":
      return String(v ?? "") === String(f.value ?? "");
    case "neq":
      return String(v ?? "") !== String(f.value ?? "");
    case "in":
      return (Array.isArray(f.value) ? f.value : [f.value]).map(String).includes(String(v ?? ""));
    case "nin":
      return !(Array.isArray(f.value) ? f.value : [f.value]).map(String).includes(String(v ?? ""));
    case "truthy":
      return !!v;
    case "falsy":
      return !v;
    case "set":
      return v !== null && v !== undefined && v !== "";
    case "unset":
      return v === null || v === undefined || v === "";
    case "lt":
      return !Number.isNaN(num(v)) && num(v) < num(f.value);
    case "lte":
      return !Number.isNaN(num(v)) && num(v) <= num(f.value);
    case "gt":
      return !Number.isNaN(num(v)) && num(v) > num(f.value);
    case "gte":
      return !Number.isNaN(num(v)) && num(v) >= num(f.value);
    case "past": {
      const t = time(v);
      return !Number.isNaN(t) && t < Date.now();
    }
    case "next_days": {
      const t = time(v);
      const days = Number(f.value ?? 30);
      return !Number.isNaN(t) && t >= Date.now() - 86_400_000 && t <= Date.now() + days * 86_400_000;
    }
    case "lte_field": {
      const other = num(row[String(f.value ?? "")]);
      return !Number.isNaN(other) && num(v ?? 0) <= other;
    }
    case "outside_thresholds": {
      const value = num(v);
      if (Number.isNaN(value)) return false;
      const min = num(row["min_threshold"]);
      const max = num(row["max_threshold"]);
      if (!Number.isNaN(min) && value < min) return true;
      if (!Number.isNaN(max) && value > max) return true;
      return false;
    }
    default:
      return true;
  }
}

export function matchesFilters(row: Row, filters: KpiFilter[]): boolean {
  return filters.every((f) => matchesOne(row, f));
}

/** Build the URL search params a KPI card should navigate with. */
export function kpiSearch(
  resourceKey: string,
  kpi: Kpi,
): Record<string, string> | undefined {
  const filters = asArray(kpi.filter);
  if (!filters.length && !kpi.tab) return undefined;
  const search: Record<string, string> = {};
  if (filters.length) {
    search["fk"] = resourceKey;
    search["f"] = JSON.stringify(filters);
    search["fl"] = kpi.label;
  }
  if (kpi.tab) search["tab"] = kpi.tab;
  return search;
}

export function parseFilters(raw: unknown): KpiFilter[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as KpiFilter[]) : [];
  } catch {
    return [];
  }
}

export type ResourceConfig = {
  key: string;
  table: string;
  title: string;
  singular: string;
  description: string;
  icon: string;
  columns: Column[];
  fields: Field[];
  searchFields: string[];
  /** Column used for the status filter chips. */
  statusField?: string;
  statusOptions?: string[];
  orderBy?: { column: string; ascending?: boolean };
  kpis?: (rows: Row[]) => Kpi[];
  readOnly?: boolean;
  /** When set, each row gets an "Open" link to this route with the row id. */
  detailRoute?: string;
};

export const currency = (n: unknown) =>
  typeof n === "number" && !Number.isNaN(n)
    ? new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(n)
    : "—";

export const sum = (rows: Row[], key: string) =>
  rows.reduce((t, r) => t + (typeof r[key] === "number" ? (r[key] as number) : 0), 0);

export const countWhere = (rows: Row[], fn: (r: Row) => boolean) => rows.filter(fn).length;

export function fmtDate(v: unknown) {
  if (!v) return "—";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-CA");
}

export function fmtDateTime(v: unknown) {
  if (!v) return "—";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });
}

const GREEN = ["active", "operational", "online", "completed", "resolved", "compliant", "good", "excellent", "paid", "fulfilled", "approved", "healthy", "in_use", "installed", "connected"];
const RED = ["inactive", "offline", "critical", "overdue", "expired", "non_compliant", "poor", "breach", "failed", "rejected", "retired", "damaged", "lost", "high", "urgent", "error", "unpaid", "suspended"];
const AMBER = ["pending", "scheduled", "in_progress", "warning", "maintenance", "degraded", "fair", "medium", "expiring_soon", "at_risk", "trial", "returned", "low"];

export function toneFor(value: unknown): "success" | "danger" | "warning" | "muted" {
  const v = String(value ?? "").toLowerCase().replace(/\s+/g, "_");
  if (GREEN.includes(v)) return "success";
  if (RED.includes(v)) return "danger";
  if (AMBER.includes(v)) return "warning";
  return "muted";
}

export const humanize = (v: unknown) =>
  String(v ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());