import { createFileRoute, useRouter, useRouterState } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { WorkOrderBoard } from "@/components/app/WorkOrderBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workOrdersConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/work-orders")({
  head: () => ({
    meta: [
      { title: "Work Orders — AssetSphere AI" },
      { name: "description", content: "Corrective, preventive and emergency work with labour, parts, costs and sign-off." },
      { property: "og:title", content: "Work Orders — AssetSphere AI" },
      { property: "og:description", content: "Corrective, preventive and emergency work with labour, parts, costs and sign-off." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkOrdersPage,
});

function WorkOrdersPage() {
  const router = useRouter();
  const tab = useRouterState({ select: (s) => String((s.location.search as Record<string, unknown>)?.["tab"] ?? "board") });
  return (
    <Tabs
      value={tab === "table" ? "table" : "board"}
      onValueChange={(v) => router.navigate({ search: { tab: v } } as never)}
      className="space-y-6"
    >
      <TabsList>
        <TabsTrigger value="board">Board</TabsTrigger>
        <TabsTrigger value="table">Table</TabsTrigger>
      </TabsList>
      <TabsContent value="board" className="mt-0">
        <WorkOrderBoard />
      </TabsContent>
      <TabsContent value="table" className="mt-0">
        <ResourcePage config={workOrdersConfig} />
      </TabsContent>
    </Tabs>
  );
}