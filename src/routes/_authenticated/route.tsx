import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";
import { isOwnerPreview } from "@/lib/preview";
import { AppSidebar } from "@/components/app/AppSidebar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { PendingApproval } from "@/components/app/PendingApproval";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      if (isOwnerPreview()) return { user: null };
      throw redirect({ to: "/auth" });
    }
    return { user: data.user };
  },
  component: AppLayout,
});

function AppLayout() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user.profile?.status !== "active" && user.role !== "super_admin") {
    return <PendingApproval email={user.email} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar user={user} />
      <CommandPalette user={user} />
      <main className="min-w-0 flex-1 px-6 py-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
