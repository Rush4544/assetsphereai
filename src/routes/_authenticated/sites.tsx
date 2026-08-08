import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { sitesConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/sites")({
  head: () => ({
    meta: [
      { title: "Sites — AssetSphere AI" },
      { name: "description", content: "Campuses, warehouses, yards and outdoor areas across your organization." },
      { property: "og:title", content: "Sites — AssetSphere AI" },
      { property: "og:description", content: "Campuses, warehouses, yards and outdoor areas across your organization." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SitesPage,
});

function SitesPage() {
  return <ResourcePage config={sitesConfig} />;
}
