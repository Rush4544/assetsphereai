import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/maintenance-calendar")({
  head: () => ({
    meta: [
      { title: "Maintenance Calendar — AssetSphere AI" },
      { name: "description", content: "Calendar view of scheduled maintenance and service work." },
      { property: "og:title", content: "Maintenance Calendar — AssetSphere AI" },
      { property: "og:description", content: "Calendar view of scheduled maintenance and service work." },
    ],
  }),
  component: MaintenanceCalendarPage,
});

function MaintenanceCalendarPage() {
  return <ComingSoon title="Maintenance Calendar" description="Calendar view of scheduled maintenance and service work." icon="CalendarDays" />;
}
