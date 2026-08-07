import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { rfidOnboardingConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rfid/onboarding")({
  head: () => ({
    meta: [
      { title: "RFID Onboarding — AssetSphere AI" },
      { name: "description", content: "Requests to roll out RFID hardware across sites." },
      { property: "og:title", content: "RFID Onboarding — AssetSphere AI" },
      { property: "og:description", content: "Requests to roll out RFID hardware across sites." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RfidOnboardingPage,
});

function RfidOnboardingPage() {
  return <ResourcePage config={rfidOnboardingConfig} />;
}
