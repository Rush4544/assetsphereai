import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { distributionConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/distribution")({
  head: () => ({
    meta: [
      { title: "Distribution — AssetSphere AI" },
      { name: "description", content: "Equipment requests, approvals and fulfilment." },
      { property: "og:title", content: "Distribution — AssetSphere AI" },
      { property: "og:description", content: "Equipment requests, approvals and fulfilment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DistributionPage,
});

function DistributionPage() {
  return <ResourcePage config={distributionConfig} />;
}
