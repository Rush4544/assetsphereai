import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { categoriesConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/asset-categories")({
  head: () => ({
    meta: [
      { title: "Asset Categories — AssetSphere AI" },
      { name: "description", content: "Category tree, sector defaults, lifecycle years and depreciation methods." },
      { property: "og:title", content: "Asset Categories — AssetSphere AI" },
      { property: "og:description", content: "Category tree, sector defaults, lifecycle years and depreciation methods." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssetCategoriesPage,
});

function AssetCategoriesPage() {
  return <ResourcePage config={categoriesConfig} />;
}
