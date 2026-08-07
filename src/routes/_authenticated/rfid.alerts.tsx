import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { rfidAlertsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rfid/alerts")({
  head: () => ({
    meta: [
      { title: "RFID Alerts — AssetSphere AI" },
      { name: "description", content: "Unauthorised movement, zone breaches and tag health alerts." },
      { property: "og:title", content: "RFID Alerts — AssetSphere AI" },
      { property: "og:description", content: "Unauthorised movement, zone breaches and tag health alerts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RfidAlertsPage,
});

function RfidAlertsPage() {
  return <ResourcePage config={rfidAlertsConfig} />;
}
