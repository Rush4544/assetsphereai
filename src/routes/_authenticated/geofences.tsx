import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { geofencesConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/geofences")({
  head: () => ({
    meta: [
      { title: "Geofences — AssetSphere AI" },
      { name: "description", content: "Virtual perimeters with entry/exit alerting for the fleet." },
      { property: "og:title", content: "Geofences — AssetSphere AI" },
      { property: "og:description", content: "Virtual perimeters with entry/exit alerting for the fleet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GeofencesPage,
});

function GeofencesPage() {
  return <ResourcePage config={geofencesConfig} />;
}
