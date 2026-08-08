import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { documentsConfig } from "@/lib/resources.universal";

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => ({
    meta: [
      { title: "Documents — AssetSphere AI" },
      { name: "description", content: "Contracts, manuals, receipts, warranties and inspection reports." },
      { property: "og:title", content: "Documents — AssetSphere AI" },
      { property: "og:description", content: "Contracts, manuals, receipts, warranties and inspection reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  return <ResourcePage config={documentsConfig} />;
}
