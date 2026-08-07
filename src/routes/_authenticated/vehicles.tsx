import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { FleetMap } from "@/components/app/FleetMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return (
    <Tabs defaultValue="table" className="space-y-6">
      <TabsList>
        <TabsTrigger value="table">Fleet register</TabsTrigger>
        <TabsTrigger value="map">Live map</TabsTrigger>
      </TabsList>
      <TabsContent value="table" className="mt-0">
        <ResourcePage config={vehiclesConfig} />
      </TabsContent>
      <TabsContent value="map" className="mt-0">
        <FleetMap />
      </TabsContent>
    </Tabs>
  );
}
