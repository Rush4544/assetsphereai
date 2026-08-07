import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { rfidDetectionsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rfid/movement")({
  head: () => ({
    meta: [
      { title: "Movement History — AssetSphere AI" },
      { name: "description", content: "Every tag read, with direction of travel and zone transitions." },
      { property: "og:title", content: "Movement History — AssetSphere AI" },
      { property: "og:description", content: "Every tag read, with direction of travel and zone transitions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RfidMovementPage,
});

function RfidMovementPage() {
  return <ResourcePage config={rfidDetectionsConfig} />;
}
