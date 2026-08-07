import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { vehicleServiceConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/vehicle-service")({
  head: () => ({
    meta: [
      { title: "Vehicle Service Records — AssetSphere AI" },
      { name: "description", content: "Servicing, tire changes and repairs logged per vehicle." },
      { property: "og:title", content: "Vehicle Service Records — AssetSphere AI" },
      { property: "og:description", content: "Servicing, tire changes and repairs logged per vehicle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VehicleServicePage,
});

function VehicleServicePage() {
  return <ResourcePage config={vehicleServiceConfig} />;
}
