import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/rfid/reports")({
  head: () => ({
    meta: [
      { title: "RFID Reports — AssetSphere AI" },
      { name: "description", content: "Analytics for detections, dwell time and coverage." },
      { property: "og:title", content: "RFID Reports — AssetSphere AI" },
      { property: "og:description", content: "Analytics for detections, dwell time and coverage." },
    ],
  }),
  component: RfidReportsPage,
});

function RfidReportsPage() {
  return <ComingSoon title="RFID Reports" description="Analytics for detections, dwell time and coverage." icon="FileBarChart" />;
}
