import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { serviceRequestsConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/service-requests")({
  head: () => ({
    meta: [
      { title: "Service Requests — AssetSphere AI" },
      { name: "description", content: "Intake and triage requests from staff, customers, technicians and IoT alerts." },
      { property: "og:title", content: "Service Requests — AssetSphere AI" },
      { property: "og:description", content: "Intake and triage requests from staff, customers, technicians and IoT alerts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServiceRequestsPage,
});

function ServiceRequestsPage() {
  return <ResourcePage config={serviceRequestsConfig} />;
}
