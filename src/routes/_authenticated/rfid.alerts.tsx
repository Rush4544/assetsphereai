import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/alerts")({
  head: () => ({
    meta: [
      { title: "RFID Alerts — AssetSphere AI" },
      { name: "description", content: "Unauthorised movement, offline readers and low batteries." },
      { property: "og:title", content: "RFID Alerts — AssetSphere AI" },
      { property: "og:description", content: "Unauthorised movement, offline readers and low batteries." },
    ],
  }),
  component: RfidAlertsPage,
});

function RfidAlertsPage() {
  return <ComingSoon title="RFID Alerts" description="Unauthorised movement, offline readers and low batteries." icon="BellRing" />;
}
