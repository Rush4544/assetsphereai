import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isOwnerPreview } from "./preview";

export type AppRole = "super_admin" | "admin" | "technician" | "user";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  department: string | null;
  job_title: string | null;
  organization_id: string | null;
  organization_name: string | null;
  status: "active" | "pending" | "suspended";
  page_permissions: Record<string, boolean>;
};

export type CurrentUser = {
  userId: string;
  email: string | null;
  profile: Profile | null;
  roles: AppRole[];
  role: AppRole;
  /** True when browsing the editor preview without a signed-in account. */
  previewOwner?: boolean;
};

const ROLE_RANK: AppRole[] = ["user", "technician", "admin", "super_admin"];

export function highestRole(roles: AppRole[]): AppRole {
  return roles.reduce<AppRole>(
    (best, r) => (ROLE_RANK.indexOf(r) > ROLE_RANK.indexOf(best) ? r : best),
    "user",
  );
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    if (!isOwnerPreview()) return null;
    return {
      userId: "preview-owner",
      email: "owner@preview",
      profile: {
        id: "preview-owner",
        email: "owner@preview",
        full_name: "Software Owner",
        avatar_url: null,
        department: null,
        job_title: "Owner",
        organization_id: null,
        organization_name: "Preview mode",
        status: "active",
        page_permissions: {},
      },
      roles: ["super_admin"],
      role: "super_admin",
      previewOwner: true,
    };
  }

  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  const roles = (roleRows ?? []).map((r) => r.role as AppRole);
  return {
    userId: user.id,
    email: user.email ?? null,
    profile: (profile as Profile | null) ?? null,
    roles: roles.length ? roles : ["user"],
    role: highestRole(roles.length ? roles : ["user"]),
  };
}

export function useCurrentUser() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    staleTime: 30_000,
  });
}
