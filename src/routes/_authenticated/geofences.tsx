import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { FleetMap } from "@/components/app/FleetMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return (
    <Tabs defaultValue="map" className="space-y-6">
      <TabsList>
        <TabsTrigger value="map">Live tracking</TabsTrigger>
        <TabsTrigger value="table">Geofence list</TabsTrigger>
      </TabsList>
      <TabsContent value="map" className="mt-0">
        <FleetMap focusGeofences />
      </TabsContent>
      <TabsContent value="table" className="mt-0">
        <ResourcePage config={geofencesConfig} />
      </TabsContent>
    </Tabs>
  );
}
