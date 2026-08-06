import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/live")({
  head: () => ({
    meta: [
      { title: "RFID Live Tracking — AssetSphere AI" },
      { name: "description", content: "Real-time tag movement across your sites." },
      { property: "og:title", content: "RFID Live Tracking — AssetSphere AI" },
      { property: "og:description", content: "Real-time tag movement across your sites." },
    ],
  }),
  component: RfidLivePage,
});

function RfidLivePage() {
  return <ComingSoon title="RFID Live Tracking" description="Real-time tag movement across your sites." icon="Activity" />;
}
