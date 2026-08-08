import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { assetTypesConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/asset-types")({
  head: () => ({
    meta: [
      { title: "Asset Types — AssetSphere AI" },
      { name: "description", content: "Define custom asset types and the fields each one captures." },
      { property: "og:title", content: "Asset Types — AssetSphere AI" },
      { property: "og:description", content: "Define custom asset types and the fields each one captures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssetTypesPage,
});

function AssetTypesPage() {
  return <ResourcePage config={assetTypesConfig} />;
}
