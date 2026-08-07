import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Role = "super_admin" | "admin" | "technician" | "user";

async function assertAdmin(context: {
  supabase: { rpc: (fn: string) => Promise<{ data: unknown }> };
}) {
  const { data: isSuper } = await context.supabase.rpc("is_super_admin");
  const { data: isOrgAdmin } = await context.supabase.rpc("is_org_admin");
  if (isSuper !== true && isOrgAdmin !== true) throw new Error("Forbidden");
  return { isSuper: isSuper === true };
}

/** Approve, suspend, move organizations or change page permissions for a user. */
export const updateUserAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      userId: string;
      status?: "active" | "pending" | "suspended";
      organizationId?: string | null;
      role?: Role;
      pagePermissions?: Record<string, boolean>;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { isSuper } = await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Only a super admin may grant the super_admin role.
    if (data.role === "super_admin" && !isSuper) throw new Error("Forbidden");

    const { data: actorProfile } = await (context as { supabase: any }).supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", (context as { userId: string }).userId)
      .maybeSingle();

    const { data: target, error: targetError } = await supabaseAdmin
      .from("profiles")
      .select("id, organization_id")
      .eq("id", data.userId)
      .maybeSingle();
    if (targetError) throw targetError;
    if (!target) throw new Error("User not found");

    // Org admins may only manage users inside their own organization.
    if (!isSuper) {
      const actorOrg = (actorProfile as { organization_id: string | null } | null)?.organization_id ?? null;
      const targetOrg = (target as { organization_id: string | null }).organization_id;
      if (!actorOrg || (targetOrg !== null && targetOrg !== actorOrg)) throw new Error("Forbidden");
      if (data.organizationId !== undefined && data.organizationId !== actorOrg) throw new Error("Forbidden");
    }

    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch["status"] = data.status;
    if (data.pagePermissions !== undefined) patch["page_permissions"] = data.pagePermissions;
    if (data.organizationId !== undefined) {
      patch["organization_id"] = data.organizationId;
      if (data.organizationId) {
        const { data: org } = await supabaseAdmin
          .from("organizations")
          .select("name")
          .eq("id", data.organizationId)
          .maybeSingle();
        patch["organization_name"] = (org as { name: string } | null)?.name ?? null;
      } else {
        patch["organization_name"] = null;
      }
    }

    if (Object.keys(patch).length > 0) {
      const { error } = await (supabaseAdmin as unknown as {
        from: (t: string) => any;
      })
        .from("profiles")
        .update(patch)
        .eq("id", data.userId);
      if (error) throw error;
    }

    if (data.role) {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: data.userId, role: data.role });
      if (error) throw error;
    }

    return { ok: true };
  });

/** Users visible to the caller: own organization for admins, everyone for super admins. */
export const listManagedUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { isSuper } = await assertAdmin(context as never);

    let query = supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, job_title, department, organization_id, organization_name, status, page_permissions")
      .order("created_at", { ascending: false });

    if (!isSuper) {
      const { data: actor } = await (context as { supabase: any }).supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", (context as { userId: string }).userId)
        .maybeSingle();
      const org = (actor as { organization_id: string | null } | null)?.organization_id ?? null;
      if (!org) return { users: [], isSuper };
      query = query.eq("organization_id", org);
    }

    const { data: profiles, error } = await query;
    if (error) throw error;

    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const roleMap = new Map<string, string>();
    ((roles ?? []) as Array<{ user_id: string; role: string }>).forEach((r) => {
      roleMap.set(r.user_id, r.role);
    });

    return {
      isSuper,
      users: ((profiles ?? []) as Array<Record<string, unknown>>).map((p) => ({
        ...p,
        role: roleMap.get(String(p["id"])) ?? "user",
      })),
    };
  });