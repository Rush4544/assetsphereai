import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicles — AssetSphere AI" },
      { name: "description", content: "Fleet management with live GPS, geofences and service scheduling." },
      { property: "og:title", content: "Vehicles — AssetSphere AI" },
      { property: "og:description", content: "Fleet management with live GPS, geofences and service scheduling." },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  return <ComingSoon title="Vehicles" description="Fleet management with live GPS, geofences and service scheduling." icon="Truck" />;
}
