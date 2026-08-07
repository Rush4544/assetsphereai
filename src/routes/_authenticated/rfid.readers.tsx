import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { rfidReadersConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/rfid/readers")({
  head: () => ({
    meta: [
      { title: "RFID Readers — AssetSphere AI" },
      { name: "description", content: "Fixed and handheld readers, their health and heartbeat." },
      { property: "og:title", content: "RFID Readers — AssetSphere AI" },
      { property: "og:description", content: "Fixed and handheld readers, their health and heartbeat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RfidReadersPage,
});

function RfidReadersPage() {
  return <ResourcePage config={rfidReadersConfig} />;
}
