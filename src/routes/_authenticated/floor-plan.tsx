import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/floor-plan")({
  head: () => ({
    meta: [
      { title: "Floor Plan — AssetSphere AI" },
      { name: "description", content: "Drag-and-drop asset placement on building floor layouts." },
      { property: "og:title", content: "Floor Plan — AssetSphere AI" },
      { property: "og:description", content: "Drag-and-drop asset placement on building floor layouts." },
    ],
  }),
  component: FloorPlanPage,
});

function FloorPlanPage() {
  return <ComingSoon title="Floor Plan" description="Drag-and-drop asset placement on building floor layouts." icon="Map" />;
}
