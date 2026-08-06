import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/assets")({
  head: () => ({
    meta: [
      { title: "Assets — AssetSphere AI" },
      { name: "description", content: "Full asset inventory with QR codes, financials and lifecycle tracking." },
      { property: "og:title", content: "Assets — AssetSphere AI" },
      { property: "og:description", content: "Full asset inventory with QR codes, financials and lifecycle tracking." },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  return <ComingSoon title="Assets" description="Full asset inventory with QR codes, financials and lifecycle tracking." icon="Boxes" />;
}
