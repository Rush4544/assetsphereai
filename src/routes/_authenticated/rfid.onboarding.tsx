import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/onboarding")({
  head: () => ({
    meta: [
      { title: "RFID Onboarding — AssetSphere AI" },
      { name: "description", content: "Guided setup and professional installation requests." },
      { property: "og:title", content: "RFID Onboarding — AssetSphere AI" },
      { property: "og:description", content: "Guided setup and professional installation requests." },
    ],
  }),
  component: RfidOnboardingPage,
});

function RfidOnboardingPage() {
  return <ComingSoon title="RFID Onboarding" description="Guided setup and professional installation requests." icon="Rocket" />;
}
