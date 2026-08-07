import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { buildingsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/buildings")({
  head: () => ({
    meta: [
      { title: "Buildings — AssetSphere AI" },
      { name: "description", content: "Sites and buildings that hold your assets." },
      { property: "og:title", content: "Buildings — AssetSphere AI" },
      { property: "og:description", content: "Sites and buildings that hold your assets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildingsPage,
});

function BuildingsPage() {
  return <ResourcePage config={buildingsConfig} />;
}
