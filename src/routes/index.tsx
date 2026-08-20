import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  Boxes,
  BarChart3,
  Bot,
  Building2,
  CalendarClock,
  CheckCircle2,
  Cpu,
  FileText,
  GraduationCap,
  HeartPulse,
  Landmark,
  Lock,
  Mail,
  MapPinned,
  PackageSearch,
  Phone,
  Radio,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardMock } from "@/components/marketing/DashboardMock";
import { PricingCards } from "@/components/marketing/PricingCards";
import { TRIAL_DAYS } from "@/lib/plans";
import HeroSphere from "@/components/HeroSphere";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AssetSphere AI — All-in-One Asset, Maintenance & Fleet Platform" },
      {
        name: "description",
        content:
          "AssetSphere AI unifies asset management, CMMS maintenance, inventory, fleet tracking, RFID, IoT sensors and AI analytics in one multi-tenant platform. 7-day free trial.",
      },
      { property: "og:title", content: "AssetSphere AI — All-in-One Asset Operations Platform" },
      {
        property: "og:description",
        content:
          "Know every asset. Control every cost. Assets, maintenance, inventory, fleet, RFID, IoT and AI in one system.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

/* ------------------------------------------------------------------ */
/* Scroll-reveal wrapper — fades + rises content in as it enters view  */
/* ------------------------------------------------------------------ */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Shared hover-lift treatment layered onto the existing glass-card utility.
const cardHover = "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg";

const features = [
  {
    icon: Boxes,
    title: "Complete asset registry",
    body: "Every asset with tags, QR codes, serials, warranties, photos, documents, depreciation and full lifecycle history.",
  },
  {
    icon: Wrench,
    title: "Maintenance & CMMS",
    body: "Service requests, work orders, technician queues, SLA tracking and a shared maintenance calendar.",
  },
  {
    icon: CalendarClock,
    title: "Preventive plans",
    body: "Time or meter-based maintenance plans that auto-generate work orders before failures happen.",
  },
  {
    icon: PackageSearch,
    title: "Inventory & parts",
    body: "Stock levels, reorder points, movements and low-stock alerts tied to the work orders that consume them.",
  },
  {
    icon: Truck,
    title: "Fleet & geofencing",
    body: "Live GPS map, mileage, fuel, tire seasons, service intervals and circular geofences with entry/exit alerts.",
  },
  {
    icon: ScanLine,
    title: "RFID & barcode tracking",
    body: "Readers, gateways and zones with real-time detections and unauthorised-movement alerting.",
  },
  {
    icon: Cpu,
    title: "IoT sensor monitoring",
    body: "Temperature, humidity, vibration and power sensors with thresholds, breach alerts and battery health.",
  },
  {
    icon: Users,
    title: "People & workforce",
    body: "Roles, departments, assignments, technician portals and a searchable people directory.",
  },
  {
    icon: Workflow,
    title: "Automation & workflows",
    body: "Rule-based triggers for approvals, escalations, reassignment and notifications.",
  },
  {
    icon: BarChart3,
    title: "Analytics & reporting",
    body: "Cost centres, depreciation, downtime, spend by department and exportable CSV reports.",
  },
  {
    icon: FileText,
    title: "Documents & compliance",
    body: "Contracts, warranties, licences, invoices and certificates stored against the right record.",
  },
  {
    icon: Zap,
    title: "Integrations & API",
    body: "REST API, CSV import/export and a catalog of finance, ITSM and ERP connectors.",
  },
];

const reasons = [
  {
    icon: Activity,
    title: "Less downtime",
    body: "Preventive plans and IoT thresholds catch failures before they stop your operation.",
  },
  {
    icon: BarChart3,
    title: "Lower total cost",
    body: "See true cost per asset — parts, labour, service and depreciation in one number.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready",
    body: "Immutable audit trails, approvals and role-based access for regulated sectors.",
  },
  {
    icon: Sparkles,
    title: "Live in days",
    body: "Import your spreadsheet, pick an industry template and go — no long implementation.",
  },
];

const industries = [
  { icon: Cpu, label: "IT & Technology" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: Landmark, label: "Municipalities" },
  { icon: Building2, label: "Manufacturing" },
  { icon: GraduationCap, label: "Education" },
  { icon: Truck, label: "Logistics & Fleet" },
];

const testimonials = [
  {
    quote: "We replaced three spreadsheets and a legacy CMMS in a week. Work order turnaround dropped by 40%.",
    name: "Dana Whitfield",
    role: "Facilities Director, regional health network",
  },
  {
    quote: "The fleet map and geofence alerts alone paid for the platform. We finally know where every unit is.",
    name: "Marcus Lee",
    role: "Fleet Manager, municipal services",
  },
  {
    quote: "RFID zones plus asset history gave us a clean audit with zero scrambling.",
    name: "Priya Raman",
    role: "IT Asset Manager, manufacturing",
  },
  {
    quote: "Asking the AI assistant what's overdue is faster than any report I used to build.",
    name: "Owen Clarke",
    role: "Maintenance Supervisor, education",
  },
];

const faqs = [
  {
    q: `How does the ${TRIAL_DAYS}-day free trial work?`,
    a: `You pick a plan and add a card at signup. Nothing is charged for ${TRIAL_DAYS} days — cancel before the trial ends and you pay nothing. After the trial your card is charged automatically on the plan you selected.`,
  },
  {
    q: "Can I change or cancel my plan later?",
    a: "Yes. Upgrade, downgrade or cancel at any time from Settings → Billing. Changes are prorated on your next invoice.",
  },
  {
    q: "How is my company's data separated?",
    a: "Every record carries an organization ID and is enforced by row-level security, so your team only ever sees your own organization's data.",
  },
  {
    q: "Do you support RFID and IoT hardware we already own?",
    a: "AssetSphere is provider-agnostic. Readers, gateways and sensors are configured per zone, and data can be pushed through our API.",
  },
  {
    q: "Can we import our existing asset list?",
    a: "Yes — the CSV importer maps your columns to assets, locations, vehicles, inventory and more, with type conversion handled for you.",
  },
  {
    q: "Is there an API?",
    a: "Every module is available over a REST API with token authentication, plus webhooks for automation rules.",
  },
  {
    q: "What support is included?",
    a: "Email support on Starter, priority support on Growth, and dedicated onboarding with an SLA on Enterprise.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Radio className="size-4" />
            </span>
            <span className="font-semibold">AssetSphere AI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#why" className="hover:text-foreground">
              Why us
            </a>
            <a href="#pricing" className="hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
            <a href="#contact" className="hover:text-foreground">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/auth" search={{ plan: "growth", cycle: "monthly" }}>
                Start free trial
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="gradient-hero relative overflow-hidden border-b border-border">
        <HeroSphere className="pointer-events-none absolute inset-y-0 right-0 w-[60%] opacity-70" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-hero-line px-3 py-1 text-xs text-hero-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <Sparkles className="size-3 text-primary" /> All-in-one asset operations platform
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-hero-foreground sm:text-5xl">
              Know every asset.
              <br />
              <span className="text-gradient">Control every cost.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-hero-muted">
              AssetSphere AI is one system for assets, maintenance, people, locations, inventory, fleet, software, IoT,
              RFID, workflows and AI analytics — built for every industry.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="transition-transform hover:scale-[1.03]">
                <Link to="/auth" search={{ plan: "growth", cycle: "monthly" }}>
                  Start {TRIAL_DAYS}-day free trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-[1.03]">
                <a href="#pricing">View pricing</a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-hero-muted">
              {["No setup fees", "Cancel anytime", "Card charged after trial"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <DashboardMock />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-primary">Capabilities</p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
            Everything you need to manage your operation
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Twelve deeply connected modules replace the spreadsheets, point tools and legacy systems your teams juggle
            today.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className={`glass-card h-full p-6 ${cardHover}`}>
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-alt border-y border-border">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <Reveal>
            <p className="text-center text-xs font-medium uppercase tracking-widest text-primary">AI assistant</p>
            <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
              Ask anything. Get answers instantly.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
              The built-in assistant reads your live asset, maintenance and fleet data and answers in plain language.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="glass-card mt-10 space-y-4 p-6">
              <div className="flex justify-end">
                <p className="max-w-sm rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  Which assets are overdue for maintenance and what will it cost?
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-4 animate-pulse" />
                </span>
                <p className="max-w-lg rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  14 assets are overdue — 6 HVAC units, 5 vehicles and 3 medical devices. Estimated labour and parts
                  total $18,420. The highest-risk item is Chiller CH-02 at Northbridge Plant, 22 days overdue.
                </p>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Answers are scoped to your organization's data and permissions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-primary">Why us</p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">Why teams choose AssetSphere</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={(i % 2) * 100}>
              <div className={`glass-card flex h-full gap-4 p-6 ${cardHover}`}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <r.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold">{r.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{r.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-alt border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold tracking-tight">One platform for every industry</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((i, idx) => (
              <Reveal key={i.label} delay={(idx % 6) * 60}>
                <div className={`glass-card flex h-full flex-col items-center gap-3 p-5 text-center ${cardHover}`}>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <i.icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium">{i.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="glass-card grid gap-8 p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Security</p>
              <h2 className="mt-3 text-2xl font-semibold">Security that scales with your business</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Multi-tenant isolation, row-level security, granular roles and immutable audit logs are standard on
                every plan — not an upgrade.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Row-level security on every table, scoped by organization",
                  "Four built-in roles plus per-module permissions",
                  "Immutable audit log of every create, update and delete",
                  "Encrypted document storage with signed, expiring links",
                ].map((s) => (
                  <li key={s} className="flex gap-2">
                    <Lock className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, k: "Tenant isolation", v: "Enforced in the database" },
                { icon: Users, k: "Roles", v: "Owner, admin, technician, user" },
                { icon: Activity, k: "Audit trail", v: "Every change, forever" },
                { icon: MapPinned, k: "Data residency", v: "Regional hosting options" },
              ].map((b) => (
                <div
                  key={b.k}
                  className="rounded-lg border border-border p-4 transition-colors duration-300 hover:border-primary/40 hover:bg-primary/5"
                >
                  <b.icon className="size-4 text-primary" />
                  <p className="mt-2 text-sm font-medium">{b.k}</p>
                  <p className="text-xs text-muted-foreground">{b.v}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-alt border-y border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold tracking-tight">
              Trusted by operations teams everywhere
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={(i % 2) * 100}>
                <div className={`glass-card h-full p-6 ${cardHover}`}>
                  <div className="flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">"{t.quote}"</p>
                  <div className="mt-5">
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight">
            Simple plans, {TRIAL_DAYS} days free
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Choose a plan at signup and add your card. We don't charge anything for {TRIAL_DAYS} days — after that your
            subscription renews automatically until you cancel.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12">
            <PricingCards />
          </div>
        </Reveal>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prices in USD, excluding tax. Yearly billing saves roughly 20%.
        </p>
      </section>

      <section id="faq" className="section-alt border-y border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
          </Reveal>
          <Reveal delay={100}>
            <Accordion type="single" collapsible className="mt-10">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="glass-card flex flex-wrap items-center justify-between gap-6 p-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold">Start managing your assets today</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your company workspace in minutes, invite your team and import your existing asset list.{" "}
                {TRIAL_DAYS} days free, cancel anytime.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="lg" asChild className="transition-transform hover:scale-[1.03]">
                <Link to="/auth" search={{ plan: "growth", cycle: "monthly" }}>
                  Start free trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-[1.03]">
                <a href="#contact">Talk to sales</a>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="section-alt border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Contact</p>
              <h2 className="mt-3 text-2xl font-semibold">Get in touch</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Questions about migration, hardware or enterprise rollout? Our team will get back to you within one
                business day.
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-primary" />
                  <span className="text-muted-foreground">sales@assetsphere.ai</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-primary" />
                  <span className="text-muted-foreground">+1 (555) 018-4420</span>
                </li>
                <li className="flex items-center gap-3">
                  <Building2 className="size-4 text-primary" />
                  <span className="text-muted-foreground">Ontario, Canada · Remote-first team</span>
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <form
              className="glass-card space-y-4 p-6"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "mailto:sales@assetsphere.ai";
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email">Work email</Label>
                  <Input id="c-email" type="email" required maxLength={255} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-company">Company</Label>
                <Input id="c-company" maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-msg">How can we help?</Label>
                <Textarea id="c-msg" rows={4} maxLength={1000} />
              </div>
              <Button type="submit" className="w-full transition-transform hover:scale-[1.01]">
                Send message
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Radio className="size-4" />
              </span>
              <span className="font-semibold">AssetSphere AI</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              One platform for assets, maintenance, inventory, fleet, RFID, IoT and AI analytics.
            </p>
            <ThemeToggle className="mt-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#why" className="hover:text-foreground">
                  Why AssetSphere
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#contact" className="hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/auth" className="hover:text-foreground">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/auth" search={{ plan: "growth", cycle: "monthly" }} className="hover:text-foreground">
                  Start free trial
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} AssetSphere AI. All rights reserved.</span>
            <span>Assets · Maintenance · Inventory · Fleet · RFID · IoT · AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
