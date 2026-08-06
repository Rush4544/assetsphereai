import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/vendors")({
  head: () => ({
    meta: [
      { title: "Vendors — AssetSphere AI" },
      { name: "description", content: "Suppliers, contracts and renewal dates." },
      { property: "og:title", content: "Vendors — AssetSphere AI" },
      { property: "og:description", content: "Suppliers, contracts and renewal dates." },
    ],
  }),
  component: VendorsPage,
});

function VendorsPage() {
  return <ComingSoon title="Vendors" description="Suppliers, contracts and renewal dates." icon="Handshake" />;
}
