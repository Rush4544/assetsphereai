import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { NetworkDiscoveryPanel } from "@/components/app/NetworkDiscovery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { networkConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/network")({
  head: () => ({
    meta: [
      { title: "Network Discovery — AssetSphere AI" },
      { name: "description", content: "Discovered endpoints, their hardware profile and live connectivity." },
      { property: "og:title", content: "Network Discovery — AssetSphere AI" },
      { property: "og:description", content: "Discovered endpoints, their hardware profile and live connectivity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  return (
    <Tabs defaultValue="discovery" className="space-y-6">
      <TabsList>
        <TabsTrigger value="discovery">Discovery</TabsTrigger>
        <TabsTrigger value="devices">All devices</TabsTrigger>
      </TabsList>
      <TabsContent value="discovery">
        <NetworkDiscoveryPanel />
      </TabsContent>
      <TabsContent value="devices">
        <ResourcePage config={networkConfig} />
      </TabsContent>
    </Tabs>
  );
}
