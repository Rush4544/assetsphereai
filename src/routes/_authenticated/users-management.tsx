import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/users-management")({
  head: () => ({
    meta: [
      { title: "Users — AssetSphere AI" },
      { name: "description", content: "Approve signups, assign organizations, roles and page permissions." },
      { property: "og:title", content: "Users — AssetSphere AI" },
      { property: "og:description", content: "Approve signups, assign organizations, roles and page permissions." },
    ],
  }),
  component: UsersManagementPage,
});

function UsersManagementPage() {
  return <ComingSoon title="Users" description="Approve signups, assign organizations, roles and page permissions." icon="Users" />;
}
