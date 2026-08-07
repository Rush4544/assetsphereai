import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { vendorsConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/vendors")({
  head: () => ({
    meta: [
      { title: "Vendors — AssetSphere AI" },
      { name: "description", content: "Suppliers, service partners and their contract windows." },
      { property: "og:title", content: "Vendors — AssetSphere AI" },
      { property: "og:description", content: "Suppliers, service partners and their contract windows." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VendorsPage,
});

function VendorsPage() {
  return <ResourcePage config={vendorsConfig} />;
}
