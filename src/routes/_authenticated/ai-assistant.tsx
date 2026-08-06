import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/app/ComingSoon";

export const Route = createFileRoute("/_authenticated/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — AssetSphere AI" },
      { name: "description", content: "Ask questions about your inventory and get AI insights." },
      { property: "og:title", content: "AI Assistant — AssetSphere AI" },
      { property: "og:description", content: "Ask questions about your inventory and get AI insights." },
    ],
  }),
  component: AiAssistantPage,
});

function AiAssistantPage() {
  return <ComingSoon title="AI Assistant" description="Ask questions about your inventory and get AI insights." icon="Sparkles" />;
}
