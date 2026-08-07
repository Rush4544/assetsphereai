import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type ChatMessage = { role: "user" | "assistant"; content: string };

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { messages: ChatMessage[] }) => {
    if (!Array.isArray(input?.messages) || input.messages.length === 0) {
      throw new Error("A question is required.");
    }
    return { messages: input.messages.slice(-12) };
  })
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { reply: "The AI service is not configured yet." };

    const supabase = (context as { supabase: any }).supabase;
    const [assets, maintenance, licences, vehicles, tags] = await Promise.all([
      supabase.from("assets").select("name, category_name, lifecycle_status, condition, department_name, purchase_price, warranty_end").limit(200),
      supabase.from("maintenance_records").select("title, status, priority, scheduled_date, cost, asset_name").limit(100),
      supabase.from("software_licenses").select("software_name, total_seats, used_seats, expiration_date, compliance_status").limit(100),
      supabase.from("vehicles").select("name, license_plate, status, next_service_date, total_mileage_km").limit(100),
      supabase.from("rfid_tags").select("tag_id, asset_name, tag_status, battery_level_pct, last_detected_zone").limit(100),
    ]);

    const inventory = {
      assets: assets.data ?? [],
      maintenance: maintenance.data ?? [],
      software_licenses: licences.data ?? [],
      vehicles: vehicles.data ?? [],
      rfid_tags: tags.data ?? [],
    };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are the AssetSphere AI assistant. Answer questions about this organization's asset inventory " +
                "using ONLY the JSON data provided. Be concise, use plain language, and surface concrete numbers, " +
                "names and dates. If the data does not contain the answer, say so plainly.\n\nInventory JSON:\n" +
                JSON.stringify(inventory),
            },
            ...data.messages,
          ],
        }),
      });

      if (!res.ok) {
        if (res.status === 429) return { reply: "The AI service is rate limited right now. Please try again shortly." };
        if (res.status === 402) return { reply: "AI credits are exhausted. Top up to keep using the assistant." };
        return { reply: "The AI service is unavailable right now. Please try again." };
      }

      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      return { reply: json.choices?.[0]?.message?.content ?? "No answer returned." };
    } catch {
      return { reply: "The AI service could not be reached. Please try again." };
    }
  });