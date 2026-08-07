import { Fragment } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { currency, fmtDate, fmtDateTime, type Column, type Row } from "@/lib/resource";
import { StatusBadge } from "./StatusBadge";

function cellValue(col: Column, row: Row) {
  if (col.render) return col.render(row);
  const v = row[col.name];
  switch (col.kind) {
    case "badge":
      return <StatusBadge value={v} />;
    case "currency":
      return currency(typeof v === "string" ? Number(v) : v);
    case "date":
      return fmtDate(v);
    case "datetime":
      return fmtDateTime(v);
    case "bool":
      return v ? "Yes" : "No";
    case "pct":
      return v === null || v === undefined ? "—" : `${Number(v)}%`;
    case "mono":
      return v ? <span className="font-mono text-xs">{String(v)}</span> : "—";
    default:
      return v === null || v === undefined || v === "" ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        String(v)
      );
  }
}

export function DataTable({
  columns,
  rows,
  onRowClick,
  emptyMessage = "No records yet.",
}: {
  columns: Column[];
  rows: Row[];
  onRowClick?: (row: Row) => void;
  emptyMessage?: string;
}) {
  return (
    <div className="glass-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((c) => (
              <TableHead key={c.name} className="whitespace-nowrap text-xs uppercase tracking-wide">
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-14 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <Fragment key={String(row["id"] ?? i)}>
                <TableRow
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((c) => (
                    <TableCell key={c.name} className={cn("whitespace-nowrap text-sm", c.className)}>
                      {cellValue(c, row)}
                    </TableCell>
                  ))}
                </TableRow>
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}