import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/dashboard")({
  head: () => ({
    meta: [
      { title: "RFID Dashboard — AssetSphere AI" },
      { name: "description", content: "Tag, reader and zone health at a glance." },
      { property: "og:title", content: "RFID Dashboard — AssetSphere AI" },
      { property: "og:description", content: "Tag, reader and zone health at a glance." },
    ],
  }),
  component: RfidDashboardPage,
});

function RfidDashboardPage() {
  return <ComingSoon title="RFID Dashboard" description="Tag, reader and zone health at a glance." icon="Radio" />;
}
