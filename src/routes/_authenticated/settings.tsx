import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";
import { useRows } from "@/lib/crud";
import type { Row as DataRow } from "@/lib/resource";

const db = supabase as unknown as { from: (t: string) => any };

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AssetSphere AI" },
      { name: "description", content: "Organization profile, branding, billing and preferences." },
      { property: "og:title", content: "Settings — AssetSphere AI" },
      { property: "og:description", content: "Organization profile, branding, billing and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const qc = useQueryClient();
  const orgs = useRows("organizations");
  const canEditOrg = user?.role === "admin" || user?.role === "super_admin";

  const [profile, setProfile] = useState({ full_name: "", job_title: "", department: "" });
  const [org, setOrg] = useState({
    name: "",
    business_email: "",
    business_phone: "",
    website: "",
    address: "",
    city: "",
    province_state: "",
    country: "",
    industry: "",
  });

  useEffect(() => {
    if (!user?.profile) return;
    setProfile({
      full_name: user.profile.full_name ?? "",
      job_title: user.profile.job_title ?? "",
      department: user.profile.department ?? "",
    });
  }, [user?.profile]);

  const myOrg = (orgs.data ?? []).find(
    (o: DataRow) => String(o["id"]) === String(user?.profile?.organization_id ?? ""),
  );

  useEffect(() => {
    if (!myOrg) return;
    setOrg({
      name: String(myOrg["name"] ?? ""),
      business_email: String(myOrg["business_email"] ?? ""),
      business_phone: String(myOrg["business_phone"] ?? ""),
      website: String(myOrg["website"] ?? ""),
      address: String(myOrg["address"] ?? ""),
      city: String(myOrg["city"] ?? ""),
      province_state: String(myOrg["province_state"] ?? ""),
      country: String(myOrg["country"] ?? ""),
      industry: String(myOrg["industry"] ?? ""),
    });
  }, [myOrg]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { error } = await db.from("profiles").update(profile).eq("id", user?.userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved.");
      void qc.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not save profile."),
  });

  const saveOrg = useMutation({
    mutationFn: async () => {
      const { error } = await db.from("organizations").update(org).eq("id", myOrg?.["id"]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Company details saved.");
      void qc.invalidateQueries({ queryKey: ["rows", "organizations"] });
      void qc.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not save company."),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your profile, company details and subscription overview." />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">My profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="glass-card max-w-xl space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job title</Label>
              <Input
                id="job_title"
                value={profile.job_title}
                onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} readOnly disabled />
            </div>
            <Button
              onClick={() => saveProfile.mutate()}
              disabled={saveProfile.isPending || user?.previewOwner === true}
            >
              {saveProfile.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Save profile
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          {!myOrg ? (
            <div className="glass-card px-6 py-14 text-center text-sm text-muted-foreground">
              You are not linked to a company yet.
            </div>
          ) : (
            <div className="glass-card grid max-w-3xl gap-4 p-6 sm:grid-cols-2">
              {(
                [
                  ["name", "Company name"],
                  ["industry", "Industry"],
                  ["business_email", "Business email"],
                  ["business_phone", "Business phone"],
                  ["website", "Website"],
                  ["address", "Address"],
                  ["city", "City"],
                  ["province_state", "Province / State"],
                  ["country", "Country"],
                ] as Array<[keyof typeof org, string]>
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    value={org[key]}
                    disabled={!canEditOrg}
                    onChange={(e) => setOrg({ ...org, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <Button
                  onClick={() => saveOrg.mutate()}
                  disabled={!canEditOrg || saveOrg.isPending || user?.previewOwner === true}
                >
                  {saveOrg.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Save company
                </Button>
                {!canEditOrg && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Only administrators can edit company details.
                  </p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="plan" className="mt-6">
          <div className="glass-card max-w-xl space-y-3 p-6 text-sm">
            {!myOrg ? (
              <p className="text-muted-foreground">No company linked.</p>
            ) : (
              <>
                <Row label="Plan" value={String(myOrg["subscription_plan"] ?? "—")} />
                <Row label="Status" value={String(myOrg["subscription_status"] ?? "—")} />
                <Row label="Billing cycle" value={String(myOrg["billing_cycle"] ?? "—")} />
                <Row label="Trial ends" value={String(myOrg["trial_end_date"] ?? "—")} />
                <Row label="Asset limit" value={String(myOrg["max_assets"] ?? "—")} />
                <Row label="User limit" value={String(myOrg["max_users"] ?? "—")} />
                <Row
                  label="Storage"
                  value={`${String(myOrg["storage_used_mb"] ?? 0)} / ${String(myOrg["storage_limit_mb"] ?? 0)} MB`}
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
