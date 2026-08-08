import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { allNavItems, canSee } from "@/lib/nav";
import type { CurrentUser } from "@/lib/auth";

type Hit = { id: string; label: string; sub: string; to: string; params?: Record<string, string> };

const db = supabase as unknown as { from: (t: string) => any };

/** Global search across pages, assets, work orders, requests, inventory and vehicles (⌘K / Ctrl+K). */
export function CommandPalette({ user }: { user: CurrentUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pages = useMemo(
    () =>
      allNavItems.filter((item) =>
        canSee(item, user.role, user.profile?.page_permissions) &&
        item.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, user],
  );

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        const like = `%${q}%`;
        const [assets, workOrders, requests, inventory, vehicles] = await Promise.all([
          db.from("assets").select("id, name, asset_tag, category_name").ilike("name", like).limit(5),
          db.from("work_orders").select("id, title, status").ilike("title", like).limit(5),
          db.from("service_requests").select("id, title, status").ilike("title", like).limit(5),
          db.from("inventory_items").select("id, name, sku").ilike("name", like).limit(5),
          db.from("vehicles").select("id, name, license_plate").ilike("name", like).limit(5),
        ]);
        if (cancelled) return;
        const next: Hit[] = [
          ...((assets.data ?? []) as any[]).map((r) => ({
            id: `asset-${r.id}`,
            label: String(r.name),
            sub: `Asset · ${r.asset_tag ?? r.category_name ?? ""}`,
            to: "/assets/$id",
            params: { id: String(r.id) },
          })),
          ...((workOrders.data ?? []) as any[]).map((r) => ({
            id: `wo-${r.id}`,
            label: String(r.title),
            sub: `Work order · ${r.status}`,
            to: "/work-orders",
          })),
          ...((requests.data ?? []) as any[]).map((r) => ({
            id: `sr-${r.id}`,
            label: String(r.title),
            sub: `Service request · ${r.status}`,
            to: "/service-requests",
          })),
          ...((inventory.data ?? []) as any[]).map((r) => ({
            id: `inv-${r.id}`,
            label: String(r.name),
            sub: `Inventory · ${r.sku ?? ""}`,
            to: "/inventory",
          })),
          ...((vehicles.data ?? []) as any[]).map((r) => ({
            id: `veh-${r.id}`,
            label: String(r.name),
            sub: `Vehicle · ${r.license_plate ?? ""}`,
            to: "/vehicles",
          })),
        ];
        setHits(next);
      })();
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function go(to: string, params?: Record<string, string>) {
    setOpen(false);
    setQuery("");
    void navigate(params ? ({ to, params } as never) : ({ to } as never));
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search assets, work orders, requests, parts, pages…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No matches found.</CommandEmpty>
        {pages.length > 0 && (
          <CommandGroup heading="Pages">
            {pages.slice(0, 8).map((p) => (
              <CommandItem key={p.key} value={`page-${p.label}`} onSelect={() => go(p.url)}>
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {hits.length > 0 && (
          <CommandGroup heading="Records">
            {hits.map((h) => (
              <CommandItem key={h.id} value={h.id} onSelect={() => go(h.to, h.params)}>
                <span className="truncate">{h.label}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{h.sub}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}