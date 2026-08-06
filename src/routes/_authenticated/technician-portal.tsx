import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/technician-portal")({
  head: () => ({
    meta: [
      { title: "Technician Portal — AssetSphere AI" },
      { name: "description", content: "Task queue and field workflow for technicians." },
      { property: "og:title", content: "Technician Portal — AssetSphere AI" },
      { property: "og:description", content: "Task queue and field workflow for technicians." },
    ],
  }),
  component: TechnicianPortalPage,
});

function TechnicianPortalPage() {
  return <ComingSoon title="Technician Portal" description="Task queue and field workflow for technicians." icon="HardHat" />;
}
