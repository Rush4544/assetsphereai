import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { rfidGatewaysConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rfid/gateways")({
  head: () => ({
    meta: [
      { title: "RFID Gateways — AssetSphere AI" },
      { name: "description", content: "Edge gateways aggregating reader traffic per site." },
      { property: "og:title", content: "RFID Gateways — AssetSphere AI" },
      { property: "og:description", content: "Edge gateways aggregating reader traffic per site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RfidGatewaysPage,
});

function RfidGatewaysPage() {
  return <ResourcePage config={rfidGatewaysConfig} />;
}
