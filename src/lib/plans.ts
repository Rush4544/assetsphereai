export type Plan = {
  id: "starter" | "growth" | "enterprise";
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  assets: string;
  highlight?: boolean;
  features: string[];
};

export const TRIAL_DAYS = 7;

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For single-site teams getting organised.",
    monthly: 49,
    yearly: 470,
    assets: "Up to 500 assets",
    features: [
      "Asset register, QR codes & documents",
      "Service requests and work orders",
      "Preventive maintenance plans",
      "Inventory & parts with low-stock alerts",
      "5 team members included",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For multi-site operations that need fleet and IoT.",
    monthly: 149,
    yearly: 1430,
    assets: "Up to 5,000 assets",
    highlight: true,
    features: [
      "Everything in Starter",
      "Fleet tracking, live map & geofencing",
      "RFID zones, readers & movement alerts",
      "IoT sensors with threshold monitoring",
      "Network discovery & software licences",
      "AI assistant and advanced reporting",
      "25 team members included",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For regulated, multi-entity organizations.",
    monthly: 399,
    yearly: 3830,
    assets: "Unlimited assets",
    features: [
      "Everything in Growth",
      "Unlimited sites, departments & users",
      "Automation rules & custom workflows",
      "API access and integration catalog",
      "SSO, granular roles & audit exports",
      "Dedicated onboarding and SLA",
    ],
  },
];

export function getPlan(id?: string | null): Plan {
  return plans.find((p) => p.id === id) ?? plans[1]!;
}