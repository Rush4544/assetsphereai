import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { warrantiesConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/warranties")({
  head: () => ({
    meta: [
      { title: "Warranties — AssetSphere AI" },
      { name: "description", content: "Warranty coverage windows and upcoming expiries across the estate." },
      { property: "og:title", content: "Warranties — AssetSphere AI" },
      { property: "og:description", content: "Warranty coverage windows and upcoming expiries across the estate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WarrantiesPage,
});

function WarrantiesPage() {
  return <ResourcePage config={warrantiesConfig} />;
}
