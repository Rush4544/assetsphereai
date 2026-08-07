import { useMemo, useState } from "react";
import { Loader2, Plus, Search, Trash2 } from "lucide-react";

import { PageHeader } from "./PageHeader";
import { DataTable } from "./DataTable";
import { RecordDialog } from "./RecordDialog";
import { KPICard } from "./KPICard";
import { Icon } from "./icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { humanize, type ResourceConfig, type Row } from "@/lib/resource";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/crud";
import { useCurrentUser } from "@/lib/auth";

export function ResourcePage({ config }: { config: ResourceConfig }) {
  const { data: user } = useCurrentUser();
  const { data: rows = [], isLoading } = useRows(config.table, { orderBy: config.orderBy });
  const save = useSaveRow(config.table);
  const remove = useDeleteRow(config.table);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [editing, setEditing] = useState<Row | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);

  const canWrite = !config.readOnly && user?.role !== "user";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (config.statusField && status !== "all" && String(r[config.statusField] ?? "") !== status) {
        return false;
      }
      if (!q) return true;
      return config.searchFields.some((f) =>
        String(r[f] ?? "")
          .toLowerCase()
          .includes(q),
      );
    });
  }, [rows, query, status, config]);

  const kpis = config.kpis?.(rows) ?? [];

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function submit(values: Row) {
    const payload: Row & { id?: string } = { ...values };
    if (editing?.["id"]) {
      payload.id = String(editing["id"]);
    } else {
      payload["organization_id"] = user?.profile?.organization_id ?? null;
      payload["created_by_id"] = user?.userId ?? null;
    }
    save.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  }

  const columns = canWrite
    ? [
        ...config.columns,
        {
          name: "__actions",
          label: "",
          render: (row: Row) => (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              aria-label="Delete"
              onClick={(e) => {
                e.stopPropagation();
                setPendingDelete(row);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          ),
        },
      ]
    : config.columns;

  return (
    <div className="space-y-6">
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          canWrite ? (
            <Button onClick={openNew}>
              <Plus className="mr-2 size-4" />
              New {config.singular}
            </Button>
          ) : undefined
        }
      />

      {kpis.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <KPICard key={k.label} label={k.label} value={k.value} icon={k.icon ?? config.icon} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={`Search ${config.title.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {config.statusField && config.statusOptions?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {["all", ...config.statusOptions].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-xs transition-colors",
                  status === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s === "all" ? "All" : humanize(s)}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="glass-card flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name={config.icon} className="size-3.5" />
            {filtered.length} of {rows.length} {config.title.toLowerCase()}
          </div>
          <DataTable
            columns={columns}
            rows={filtered}
            onRowClick={
              canWrite
                ? (row) => {
                    setEditing(row);
                    setDialogOpen(true);
                  }
                : undefined
            }
            emptyMessage={
              rows.length === 0
                ? `No ${config.title.toLowerCase()} yet.${canWrite ? ` Use “New ${config.singular}” to add the first one.` : ""}`
                : "No records match your filters."
            }
          />
        </>
      )}

      <RecordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? `Edit ${config.singular}` : `New ${config.singular}`}
        description={config.description}
        fields={config.fields}
        initial={editing}
        saving={save.isPending}
        onSubmit={submit}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record from your organization's data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete?.["id"]) remove.mutate(String(pendingDelete["id"]));
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}