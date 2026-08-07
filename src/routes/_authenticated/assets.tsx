import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { assetsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/assets")({
  head: () => ({
    meta: [
      { title: "Assets — AssetSphere AI" },
      { name: "description", content: "Full asset inventory with financials, lifecycle, location and technical detail." },
      { property: "og:title", content: "Assets — AssetSphere AI" },
      { property: "og:description", content: "Full asset inventory with financials, lifecycle, location and technical detail." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  return <ResourcePage config={assetsConfig} />;
}
