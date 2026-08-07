import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { networkConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/network")({
  head: () => ({
    meta: [
      { title: "Network Discovery — AssetSphere AI" },
      { name: "description", content: "Discovered endpoints, their hardware profile and live connectivity." },
      { property: "og:title", content: "Network Discovery — AssetSphere AI" },
      { property: "og:description", content: "Discovered endpoints, their hardware profile and live connectivity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  return <ResourcePage config={networkConfig} />;
}
