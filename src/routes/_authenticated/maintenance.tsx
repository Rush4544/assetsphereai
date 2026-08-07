import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { maintenanceConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — AssetSphere AI" },
      { name: "description", content: "Preventive and corrective maintenance across every asset." },
      { property: "og:title", content: "Maintenance — AssetSphere AI" },
      { property: "og:description", content: "Preventive and corrective maintenance across every asset." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  return <ResourcePage config={maintenanceConfig} />;
}
