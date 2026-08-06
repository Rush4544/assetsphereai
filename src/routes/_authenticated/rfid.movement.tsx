import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/movement")({
  head: () => ({
    meta: [
      { title: "RFID Movement History — AssetSphere AI" },
      { name: "description", content: "Detection log with entry, exit and transit events." },
      { property: "og:title", content: "RFID Movement History — AssetSphere AI" },
      { property: "og:description", content: "Detection log with entry, exit and transit events." },
    ],
  }),
  component: RfidMovementPage,
});

function RfidMovementPage() {
  return <ComingSoon title="RFID Movement History" description="Detection log with entry, exit and transit events." icon="History" />;
}
