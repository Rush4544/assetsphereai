import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, CreditCard, Loader2, Radio } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { listPublicOrganizations } from "@/lib/organizations.functions";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPlan, plans, TRIAL_DAYS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { plan?: string | undefined; cycle?: "monthly" | "yearly" | undefined } => ({
    plan: typeof search["plan"] === "string" ? (search["plan"] as string) : undefined,
    cycle: search["cycle"] === "yearly" ? "yearly" : search["cycle"] === "monthly" ? "monthly" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — AssetSphere AI" },
      {
        name: "description",
        content:
          "Sign in or create your AssetSphere AI account to manage assets, maintenance, licences and RFID tracking.",
      },
      { property: "og:title", content: "Sign in — AssetSphere AI" },
      { property: "og:description", content: "Access your organization's asset intelligence platform." },
    ],
  }),
  component: AuthPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState(search.plan ? "signup" : "signin");
  const [planId, setPlanId] = useState<string>(search.plan ?? "growth");
  const [cycle, setCycle] = useState<"monthly" | "yearly">(search.cycle ?? "monthly");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgMode, setOrgMode] = useState<"join" | "create">("join");
  const [orgId, setOrgId] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const fetchOrgs = useServerFn(listPublicOrganizations);
  const orgs = useQuery({
    queryKey: ["public-organizations"],
    queryFn: async () => (await fetchOrgs()).organizations,
    staleTime: 60_000,
  });

  const noOrgs = (orgs.data?.length ?? 0) === 0;
  const mustCreate = orgMode === "create" || (noOrgs && !orgs.isLoading);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (mustCreate) {
      if (!newOrgName.trim()) {
        toast.error("Enter a company name.");
        return;
      }
    } else if (!orgId) {
      toast.error("Choose the company you belong to.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: mustCreate
          ? { full_name: fullName, new_organization_name: newOrgName.trim(), plan: planId, billing_cycle: cycle }
          : { full_name: fullName, organization_id: orgId, plan: planId, billing_cycle: cycle },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    setSent(true);
    toast.success("Check your email to confirm your account.");
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  async function forgotPassword() {
    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset email sent.");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="gradient-hero hidden flex-col justify-between p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2 text-hero-foreground">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Radio className="size-5" />
          </span>
          <span className="text-lg font-semibold">AssetSphere AI</span>
        </Link>
        <div className="max-w-md text-hero-foreground">
          <h2 className="text-3xl font-semibold leading-tight">
            Enterprise asset intelligence for every site, device and vehicle.
          </h2>
          <p className="mt-4 text-sm text-hero-muted">
            Assets, maintenance, inventory, fleet, RFID, IoT and AI analytics in one platform. Start with a 7-day free trial. Network discovery, RFID zones, fleet geofencing,
            maintenance scheduling and financial depreciation — in one platform.
          </p>
        </div>
        <p className="text-xs text-hero-muted">Multi-tenant · Role based access · Audit logged</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Radio className="size-5" />
              </span>
              <span className="text-lg font-semibold">AssetSphere AI</span>
            </Link>
          </div>

          {sent ? (
            <div className="glass-card p-6 text-center">
              <h1 className="text-lg font-semibold">Confirm your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium">{email}</span>. After
                confirming, an administrator will assign you to an organization and activate your
                access.
              </p>
              <Button variant="outline" className="mt-5 w-full" onClick={() => setSent(false)}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <Tabs value={mode} onValueChange={setMode}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <h1 className="text-xl font-semibold">Welcome back</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to your organization workspace.
                </p>
                <form className="mt-6 space-y-4" onSubmit={signIn}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Sign in
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={forgotPassword}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  Forgot your password?
                </button>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <h1 className="text-xl font-semibold">Create your account</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mustCreate
                    ? "You will become the administrator of the company you create."
                    : "Joining an existing company keeps your account pending until an administrator approves it."}
                </p>
                <form className="mt-6 space-y-4" onSubmit={signUp}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Choose your plan</Label>
                      <div className="inline-flex rounded-full border border-border p-0.5 text-[11px]">
                        {(["monthly", "yearly"] as const).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCycle(c)}
                            className={cn(
                              "rounded-full px-2 py-0.5 capitalize",
                              cycle === c ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                            )}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {plans.map((p) => {
                        const selected = planId === p.id;
                        const price = cycle === "monthly" ? p.monthly : Math.round(p.yearly / 12);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setPlanId(p.id)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
                              selected ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                            )}
                          >
                            <span>
                              <span className="flex items-center gap-2 text-sm font-medium">
                                {p.name}
                                {selected && <Check className="size-3.5 text-primary" />}
                              </span>
                              <span className="text-xs text-muted-foreground">{p.assets}</span>
                            </span>
                            <span className="text-sm font-semibold">
                              ${price}
                              <span className="text-xs font-normal text-muted-foreground">/mo</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    {noOrgs && !orgs.isLoading ? (
                      <>
                        <Input
                          id="company"
                          placeholder="Your company name"
                          value={newOrgName}
                          onChange={(e) => setNewOrgName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          No companies exist yet — the first account creates one.
                        </p>
                      </>
                    ) : orgMode === "join" ? (
                      <>
                        <Select value={orgId} onValueChange={setOrgId}>
                          <SelectTrigger id="company">
                            <SelectValue placeholder={orgs.isLoading ? "Loading companies…" : "Select your company"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(orgs.data ?? []).map((o) => (
                              <SelectItem key={o.id} value={o.id}>
                                {o.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline"
                          onClick={() => setOrgMode("create")}
                        >
                          My company isn&apos;t listed — create a new one
                        </button>
                      </>
                    ) : (
                      <>
                        <Input
                          id="company"
                          placeholder="New company name"
                          value={newOrgName}
                          onChange={(e) => setNewOrgName(e.target.value)}
                        />
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline"
                          onClick={() => setOrgMode("join")}
                        >
                          Join an existing company instead
                        </button>
                      </>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Work email</Label>
                    <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Start {TRIAL_DAYS}-day free trial
                  </Button>
                  <p className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CreditCard className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      After you confirm your email you'll add a card to activate the{" "}
                      {getPlan(planId).name} plan. Nothing is charged for {TRIAL_DAYS} days; after the
                      trial ${cycle === "monthly" ? getPlan(planId).monthly : getPlan(planId).yearly} is
                      billed {cycle} automatically until you cancel.
                    </span>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {!sent && (
            <>
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <Button variant="outline" className="w-full" onClick={google}>
                <GoogleIcon />
                <span className="ml-2">Continue with Google</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
