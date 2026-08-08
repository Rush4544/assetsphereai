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
};

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