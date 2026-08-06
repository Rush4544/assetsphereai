import { Button } from "@/components/ui/button";
import { Clock, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

export function PendingApproval({ email }: { email?: string | null }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-card max-w-md p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
          <Clock className="size-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Waiting for approval</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account{email ? ` (${email})` : ""} has been created and is pending review. An
          administrator must assign you to an organization and activate your access before you can
          use AssetSphere AI.
        </p>
        <Button variant="outline" className="mt-6" onClick={signOut}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}
