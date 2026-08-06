import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AssetSphere AI" },
      { name: "description", content: "Financial and operational reporting across the organization." },
      { property: "og:title", content: "Reports — AssetSphere AI" },
      { property: "og:description", content: "Financial and operational reporting across the organization." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return <ComingSoon title="Reports" description="Financial and operational reporting across the organization." icon="BarChart3" />;
}
