import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  Network,
  Radio,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dashboard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AssetSphere AI — Enterprise Asset Intelligence Platform" },
      {
        name: "description",
        content:
          "Multi-tenant asset intelligence for IT, healthcare, municipalities and logistics: inventory, network discovery, RFID tracking, fleet geofencing, maintenance and licence compliance.",
      },
      { property: "og:title", content: "AssetSphere AI — Enterprise Asset Intelligence Platform" },
      {
        property: "og:description",
        content:
          "Track every asset, device, licence and vehicle across your organization with AI-powered insight.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Boxes, title: "Asset inventory", body: "Tags, serials, warranties, depreciation, photos and documents — with full lifecycle history." },
  { icon: Network, title: "Network discovery", body: "Agents scan your LAN, reconcile devices, and keep hostname, IP and online status current." },
  { icon: Radio, title: "RFID tracking", body: "Provider-agnostic readers, gateways and zones with unauthorised-movement alerting." },
  { icon: Truck, title: "Fleet & geofencing", body: "Live GPS, speed, mileage, tire seasons and circular geofences with entry/exit alerts." },
  { icon: Wrench, title: "Maintenance", body: "Preventive and corrective work orders, technician queues and calendar scheduling." },
  { icon: BarChart3, title: "Financial reporting", body: "Depreciation, cost centres, budget codes, insurance and replacement value roll-ups." },
];

const industries = ["IT departments", "Hospitals", "Municipalities", "Education", "Logistics", "Enterprise"];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Radio className="size-4" />
            </span>
            <span className="font-semibold">AssetSphere AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="gradient-hero relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Activity className="size-3" /> Multi-tenant asset intelligence
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Every asset, device and vehicle — <span className="text-gradient">under control</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/70">
              AssetSphere AI unifies inventory, network discovery, RFID zones, fleet geofencing,
              maintenance and licence compliance into one governed, audit-logged platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/auth">Start free trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link to="/auth">Sign in to workspace</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              {["Role-based access", "Row-level tenancy", "Audit logged"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="AssetSphere AI dashboard showing asset inventory, network topology and alerts"
              width={1600}
              height={1008}
              className="rounded-xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight">One platform, every asset class</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          Built for organizations that manage thousands of assets across many sites, departments and
          teams.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold">Trusted across regulated sectors</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tenant isolation, approval workflows and immutable audit trails as standard.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {industries.map((i) => (
                <li
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <Building2 className="size-3" /> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="glass-card flex flex-wrap items-center justify-between gap-6 p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold">Ready to see your estate clearly?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create an account and an administrator can approve you into your organization in
              seconds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-success" />
            <Button size="lg" asChild>
              <Link to="/auth">Create your account</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} AssetSphere AI</span>
          <span>Asset intelligence · Network discovery · RFID · Fleet</span>
        </div>
      </footer>
    </div>
  );
}
