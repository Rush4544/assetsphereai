import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { KPICard } from "@/components/app/KPICard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listManagedUsers, updateUserAccess } from "@/lib/admin-users.functions";
import { useLookup } from "@/lib/crud";
import { useCurrentUser } from "@/lib/auth";

type ManagedUser = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  job_title?: string | null;
  department?: string | null;
  organization_id?: string | null;
  organization_name?: string | null;
  status?: string;
  role: string;
};

const ROLES = ["user", "technician", "admin", "super_admin"];

export const Route = createFileRoute("/_authenticated/users-management")({
  head: () => ({
    meta: [
      { title: "Users — AssetSphere AI" },
      { name: "description", content: "Approve signups, assign organizations, roles and page permissions." },
      { property: "og:title", content: "Users — AssetSphere AI" },
      { property: "og:description", content: "Approve signups, assign organizations, roles and page permissions." },
    ],
  }),
  component: UsersManagementPage,
});

function UsersManagementPage() {
  const { data: me } = useCurrentUser();
  const qc = useQueryClient();
  const fetchUsers = useServerFn(listManagedUsers);
  const saveAccess = useServerFn(updateUserAccess);
  const [q, setQ] = useState("");
  const orgs = useLookup("organizations");

  const users = useQuery({
    queryKey: ["managed-users"],
    queryFn: () => fetchUsers(),
    enabled: !me?.previewOwner,
  });

  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof updateUserAccess>[0]) => saveAccess(input),
    onSuccess: () => {
      toast.success("User updated.");
      void qc.invalidateQueries({ queryKey: ["managed-users"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not update user."),
  });

  const rows = useMemo(() => {
    const list = (users.data?.users ?? []) as ManagedUser[];
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((u) =>
      [u.full_name, u.email, u.organization_name, u.department, u.role].some((v) =>
        String(v ?? "").toLowerCase().includes(needle),
      ),
    );
  }, [users.data, q]);

  const isSuper = users.data?.isSuper === true;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Approve new signups, assign organizations, set roles and suspend access."
      />

      {me?.previewOwner ? (
        <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
          Owner preview mode. Sign in with an administrator account to load and manage real users.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KPICard label="Total users" value={(users.data?.users ?? []).length} icon="Users" />
            <KPICard
              label="Pending approval"
              value={((users.data?.users ?? []) as ManagedUser[]).filter((u) => u.status === "pending").length}
              icon="Clock"
              tone="warning"
            />
            <KPICard
              label="Active"
              value={((users.data?.users ?? []) as ManagedUser[]).filter((u) => u.status === "active").length}
              icon="UserCheck"
              tone="success"
            />
            <KPICard
              label="Suspended"
              value={((users.data?.users ?? []) as ManagedUser[]).filter((u) => u.status === "suspended").length}
              icon="UserX"
              tone="destructive"
            />
          </div>

          <Input
            className="max-w-md"
            placeholder="Search users by name, email, company or role"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {users.isLoading ? (
            <div className="glass-card flex items-center justify-center py-20">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : users.isError ? (
            <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
              You need administrator access to manage users.
            </div>
          ) : rows.length === 0 ? (
            <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
              No users match your search.
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((u) => (
                <div key={u.id} className="glass-card flex flex-wrap items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{u.full_name ?? u.email ?? "Unnamed"}</p>
                      <StatusBadge value={u.status} className="px-1.5 py-0 text-[10px]" />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {u.email ?? "—"} · {u.organization_name ?? "No company"}
                      {u.job_title ? ` · ${u.job_title}` : ""}
                    </p>
                  </div>

                  <Select
                    value={u.role}
                    onValueChange={(role) =>
                      mutation.mutate({ data: { userId: u.id, role: role as ManagedUser["role"] & string } } as never)
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.filter((r) => r !== "super_admin" || isSuper).map((r) => (
                        <SelectItem key={r} value={r} className="capitalize">
                          {r.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {isSuper && (
                    <Select
                      value={u.organization_id ?? ""}
                      onValueChange={(organizationId) =>
                        mutation.mutate({ data: { userId: u.id, organizationId } } as never)
                      }
                    >
                      <SelectTrigger className="w-[190px]">
                        <SelectValue placeholder="Assign company" />
                      </SelectTrigger>
                      <SelectContent>
                        {(orgs.data ?? []).map((o) => (
                          <SelectItem key={o["id"] as string} value={o["id"] as string}>
                            {o["name"] as string}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex gap-2">
                    {u.status !== "active" ? (
                      <Button
                        size="sm"
                        onClick={() => mutation.mutate({ data: { userId: u.id, status: "active" } } as never)}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => mutation.mutate({ data: { userId: u.id, status: "suspended" } } as never)}
                      >
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
