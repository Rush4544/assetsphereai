import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { vehiclesConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicles — AssetSphere AI" },
      { name: "description", content: "Fleet register with drivers, telemetry, geofencing and service dates." },
      { property: "og:title", content: "Vehicles — AssetSphere AI" },
      { property: "og:description", content: "Fleet register with drivers, telemetry, geofencing and service dates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  return <ResourcePage config={vehiclesConfig} />;
}
