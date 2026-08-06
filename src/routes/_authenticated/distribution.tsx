import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/distribution")({
  head: () => ({
    meta: [
      { title: "Asset Distribution — AssetSphere AI" },
      { name: "description", content: "Request, approve, distribute and return equipment." },
      { property: "og:title", content: "Asset Distribution — AssetSphere AI" },
      { property: "og:description", content: "Request, approve, distribute and return equipment." },
    ],
  }),
  component: DistributionPage,
});

function DistributionPage() {
  return <ComingSoon title="Asset Distribution" description="Request, approve, distribute and return equipment." icon="PackageCheck" />;
}
