import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Input } from "@/components/ui/input";
import { useRows } from "@/lib/crud";
import type { Row } from "@/lib/resource";

export const Route = createFileRoute("/_authenticated/people-search")({
  head: () => ({
    meta: [
      { title: "People Search — AssetSphere AI" },
      { name: "description", content: "Directory search across staff and their assigned assets." },
      { property: "og:title", content: "People Search — AssetSphere AI" },
      { property: "og:description", content: "Directory search across staff and their assigned assets." },
    ],
  }),
  component: PeopleSearchPage,
});

function PeopleSearchPage() {
  const [q, setQ] = useState("");
  const assets = useRows("assets");
  const assignments = useRows("asset_assignments");
  const licences = useRows("software_licenses");

  const people = useMemo(() => {
    const map = new Map<
      string,
      { name: string; email: string | null; department: string | null; assets: Row[]; history: Row[] }
    >();
    const key = (name: unknown, email: unknown) =>
      String(email ?? name ?? "").toLowerCase() || null;

    (assets.data ?? []).forEach((a) => {
      const k = key(a["assigned_user_name"], a["assigned_user_email"]);
      if (!k) return;
      if (!map.has(k))
        map.set(k, {
          name: String(a["assigned_user_name"] ?? a["assigned_user_email"]),
          email: (a["assigned_user_email"] as string | null) ?? null,
          department: (a["department_name"] as string | null) ?? null,
          assets: [],
          history: [],
        });
      map.get(k)!.assets.push(a);
    });

    (assignments.data ?? []).forEach((r) => {
      const k = key(r["assigned_to_name"], r["assigned_to_email"]);
      if (!k) return;
      if (!map.has(k))
        map.set(k, {
          name: String(r["assigned_to_name"]),
          email: (r["assigned_to_email"] as string | null) ?? null,
          department: null,
          assets: [],
          history: [],
        });
      map.get(k)!.history.push(r);
    });

    const list = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        (p.email ?? "").toLowerCase().includes(needle) ||
        (p.department ?? "").toLowerCase().includes(needle) ||
        p.assets.some((a) => String(a["name"] ?? "").toLowerCase().includes(needle)),
    );
  }, [assets.data, assignments.data, q]);

  const licenceFor = (email: string | null) =>
    email
      ? (licences.data ?? []).filter((l) =>
          String(l["notes"] ?? "").toLowerCase().includes(email.toLowerCase()),
        ).length
      : 0;

  const isLoading = assets.isLoading || assignments.isLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="People Search"
        description="Find any person and see every asset they hold, plus their assignment history."
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, email, department or asset"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="glass-card flex items-center justify-center py-20">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : people.length === 0 ? (
        <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
          No people found. Assign assets to staff and they will appear here.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {people.map((p) => (
            <div key={p.name + (p.email ?? "")} className="glass-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.email ?? "No email"}
                    {p.department ? ` · ${p.department}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 text-xs">
                  <span className="rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                    {p.assets.length} assets
                  </span>
                  <span className="rounded-md bg-secondary px-2 py-1 font-medium">
                    {licenceFor(p.email)} licences
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                {p.assets.slice(0, 5).map((a) => (
                  <div key={String(a["id"])} className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm">{String(a["name"])}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {String(a["asset_tag"] ?? "")}
                      </span>
                      <StatusBadge value={a["lifecycle_status"]} className="px-1.5 py-0 text-[10px]" />
                    </div>
                  </div>
                ))}
                {p.assets.length > 5 && (
                  <p className="text-xs text-muted-foreground">+{p.assets.length - 5} more assets</p>
                )}
                {p.history.length > 0 && (
                  <p className="pt-1 text-xs text-muted-foreground">
                    {p.history.length} assignment record{p.history.length === 1 ? "" : "s"} on file
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
