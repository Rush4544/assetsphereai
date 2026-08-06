import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — AssetSphere AI" },
      { name: "description", content: "Preventive and corrective maintenance records." },
      { property: "og:title", content: "Maintenance — AssetSphere AI" },
      { property: "og:description", content: "Preventive and corrective maintenance records." },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  return <ComingSoon title="Maintenance" description="Preventive and corrective maintenance records." icon="Wrench" />;
}
