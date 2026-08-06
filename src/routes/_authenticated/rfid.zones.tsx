import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/zones")({
  head: () => ({
    meta: [
      { title: "RFID Zones — AssetSphere AI" },
      { name: "description", content: "Zones, restrictions and authorised areas." },
      { property: "og:title", content: "RFID Zones — AssetSphere AI" },
      { property: "og:description", content: "Zones, restrictions and authorised areas." },
    ],
  }),
  component: RfidZonesPage,
});

function RfidZonesPage() {
  return <ComingSoon title="RFID Zones" description="Zones, restrictions and authorised areas." icon="LayoutGrid" />;
}
