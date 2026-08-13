import { createServerFn } from "@tanstack/react-start";

/** Public list of joinable companies for the signup screen (id + name only). */
export const listPublicOrganizations = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select("id, name")
    .eq("status", "active")
    .order("name");
  if (error) return { organizations: [] as Array<{ id: string; name: string }> };
  return { organizations: (data ?? []) as Array<{ id: string; name: string }> };
});
