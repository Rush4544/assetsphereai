import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { rfidZonesConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rfid/zones")({
  head: () => ({
    meta: [
      { title: "RFID Zones — AssetSphere AI" },
      { name: "description", content: "Logical zones that group readers and control restricted areas." },
      { property: "og:title", content: "RFID Zones — AssetSphere AI" },
      { property: "og:description", content: "Logical zones that group readers and control restricted areas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RfidZonesPage,
});

function RfidZonesPage() {
  return <ResourcePage config={rfidZonesConfig} />;
}
