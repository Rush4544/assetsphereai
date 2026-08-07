import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { rfidTagsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rfid/assets")({
  head: () => ({
    meta: [
      { title: "Tagged Assets — AssetSphere AI" },
      { name: "description", content: "RFID tags bonded to assets, with battery and last-seen telemetry." },
      { property: "og:title", content: "Tagged Assets — AssetSphere AI" },
      { property: "og:description", content: "RFID tags bonded to assets, with battery and last-seen telemetry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RfidAssetsPage,
});

function RfidAssetsPage() {
  return <ResourcePage config={rfidTagsConfig} />;
}
