import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAssistant } from "@/lib/assistant.functions";
import { useCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Which assets have warranties expiring in the next 90 days?",
  "What maintenance is overdue right now?",
  "Which software licences are over-allocated?",
  "Which vehicles are due for service?",
];

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
  const { data: user } = useCurrentUser();
  const ask = useServerFn(askAssistant);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const mutation = useMutation({
    mutationFn: (next: ChatMessage[]) => ask({ data: { messages: next } }),
    onSuccess: (res) => {
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    },
    onError: () => {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong reaching the assistant. Please try again." },
      ]);
    },
  });

  function send(text: string) {
    const question = text.trim();
    if (!question || mutation.isPending) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="Ask questions in plain language about your assets, maintenance, licences, fleet and RFID tags."
      />

      {user?.previewOwner ? (
        <div className="glass-card px-6 py-16 text-center text-sm text-muted-foreground">
          Owner preview mode. Sign in to let the assistant read your company data.
        </div>
      ) : (
        <div className="glass-card flex h-[calc(100vh-260px)] min-h-[420px] flex-col p-4">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-6" />
                </span>
                <p className="text-sm text-muted-foreground">
                  Ask anything about your inventory. Try one of these:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {mutation.isPending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          <form
            className="mt-4 flex gap-2 border-t border-border pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              placeholder="Ask about assets, maintenance, licences, vehicles or tags…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" disabled={mutation.isPending || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
