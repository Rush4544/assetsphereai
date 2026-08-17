import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Row } from "./resource";
import { friendlyError } from "./errors";

// The generated Supabase types are exhaustive per-table; this framework is
// intentionally table-generic, so we go through a loosely typed accessor.
const db = supabase as unknown as {
  from: (table: string) => any;
};

export function useRows(
  table: string,
  opts?: {
    orderBy?: { column: string; ascending?: boolean } | undefined;
    limit?: number | undefined;
  },
) {
  return useQuery({
    queryKey: ["rows", table, opts?.orderBy?.column ?? null, opts?.limit ?? null],
    queryFn: async (): Promise<Row[]> => {
      let q = db.from(table).select("*");
      if (opts?.orderBy) {
        q = q.order(opts.orderBy.column, { ascending: opts.orderBy.ascending ?? false });
      } else {
        q = q.order("created_at", { ascending: false });
      }
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
}

/** Lightweight id/label list used by reference pickers. */
export function useLookup(table: string, labelColumn = "name") {
  return useQuery({
    queryKey: ["lookup", table, labelColumn],
    queryFn: async () => {
      const { data, error } = await db.from(table).select(`id, ${labelColumn}`).order(labelColumn);
      if (error) throw error;
      return (data ?? []) as Array<Record<string, string>>;
    },
    staleTime: 60_000,
  });
}

export function useSaveRow(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Row & { id?: string }) => {
      const { id, ...values } = payload;
      if (id) {
        const { error } = await db.from(table).update(values).eq("id", id);
        if (error) throw error;
        return id;
      }
      const { data, error } = await db.from(table).insert(values).select("id").single();
      if (error) throw error;
      return (data as { id: string }).id;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rows", table] });
      void qc.invalidateQueries({ queryKey: ["lookup", table] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Saved");
    },
    onError: (e: unknown) => toast.error(friendlyError(e, "save this record")),
  });
}

export function useDeleteRow(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rows", table] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Deleted");
    },
    onError: (e: unknown) => toast.error(friendlyError(e, "delete this record")),
  });
}