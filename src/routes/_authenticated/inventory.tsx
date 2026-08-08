import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inventoryConfig, inventoryTxConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory & Parts — AssetSphere AI" },
      { name: "description", content: "Parts, materials and consumables with stock levels, reorder points and movements." },
      { property: "og:title", content: "Inventory & Parts — AssetSphere AI" },
      { property: "og:description", content: "Parts, materials and consumables with stock levels, reorder points and movements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const router = useRouter();
  const tab = useRouterState({ select: (s) => String((s.location.search as Record<string, unknown>)?.["tab"] ?? "items") });
  return (
    <Tabs
      value={tab === "movements" ? "movements" : "items"}
      onValueChange={(v) => router.navigate({ search: { tab: v } } as never)}
      className="space-y-6"
    >
      <TabsList>
        <TabsTrigger value="items">Items</TabsTrigger>
        <TabsTrigger value="movements">Stock movements</TabsTrigger>
      </TabsList>
      <TabsContent value="items" className="mt-0">
        <ResourcePage config={inventoryConfig} />
      </TabsContent>
      <TabsContent value="movements" className="mt-0">
        <ResourcePage config={inventoryTxConfig} />
      </TabsContent>
    </Tabs>
  );
}