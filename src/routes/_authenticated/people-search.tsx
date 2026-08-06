import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/people-search")({
  head: () => ({
    meta: [
      { title: "People Search — AssetSphere AI" },
      { name: "description", content: "Directory search across staff and their assigned assets." },
      { property: "og:title", content: "People Search — AssetSphere AI" },
      { property: "og:description", content: "Directory search across staff and their assigned assets." },
    ],
  }),
  component: PeopleSearchPage,
});

function PeopleSearchPage() {
  return <ComingSoon title="People Search" description="Directory search across staff and their assigned assets." icon="Search" />;
}
