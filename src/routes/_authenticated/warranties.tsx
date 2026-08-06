import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/warranties")({
  head: () => ({
    meta: [
      { title: "Warranties — AssetSphere AI" },
      { name: "description", content: "Warranty coverage and expiry tracking." },
      { property: "og:title", content: "Warranties — AssetSphere AI" },
      { property: "og:description", content: "Warranty coverage and expiry tracking." },
    ],
  }),
  component: WarrantiesPage,
});

function WarrantiesPage() {
  return <ComingSoon title="Warranties" description="Warranty coverage and expiry tracking." icon="ShieldCheck" />;
}
