import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { maintenancePlansConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/maintenance-plans")({
  head: () => ({
    meta: [
      { title: "Maintenance Plans — AssetSphere AI" },
      { name: "description", content: "Recurring preventive maintenance by calendar, mileage, hours, cycles or sensors." },
      { property: "og:title", content: "Maintenance Plans — AssetSphere AI" },
      { property: "og:description", content: "Recurring preventive maintenance by calendar, mileage, hours, cycles or sensors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaintenancePlansPage,
});

function MaintenancePlansPage() {
  return <ResourcePage config={maintenancePlansConfig} />;
}
