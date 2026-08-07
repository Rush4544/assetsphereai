import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/components/app/ResourcePage";
import { invoicesConfig } from "@/lib/resources";

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — AssetSphere AI" },
      { name: "description", content: "Subscription billing history across tenants." },
      { property: "og:title", content: "Invoices — AssetSphere AI" },
      { property: "og:description", content: "Subscription billing history across tenants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvoicesPage,
});

function InvoicesPage() {
  return <ResourcePage config={invoicesConfig} />;
}
