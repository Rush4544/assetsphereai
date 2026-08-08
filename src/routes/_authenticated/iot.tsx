import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { IotOverview } from "@/components/app/IotOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { iotDevicesConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/iot")({
  head: () => ({
    meta: [
      { title: "IoT & Sensors — AssetSphere AI" },
      { name: "description", content: "Live sensor readings, thresholds and condition monitoring across your assets." },
      { property: "og:title", content: "IoT & Sensors — AssetSphere AI" },
      { property: "og:description", content: "Live sensor readings, thresholds and condition monitoring across your assets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IotPage,
});

function IotPage() {
  const router = useRouter();
  const tab = useRouterState({ select: (s) => String((s.location.search as Record<string, unknown>)?.["tab"] ?? "overview") });
  return (
    <Tabs
      value={tab === "devices" ? "devices" : "overview"}
      onValueChange={(v) => router.navigate({ search: { tab: v } } as never)}
      className="space-y-6"
    >
      <TabsList>
        <TabsTrigger value="overview">Live overview</TabsTrigger>
        <TabsTrigger value="devices">Devices</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-0">
        <IotOverview />
      </TabsContent>
      <TabsContent value="devices" className="mt-0">
        <ResourcePage config={iotDevicesConfig} />
      </TabsContent>
    </Tabs>
  );
}