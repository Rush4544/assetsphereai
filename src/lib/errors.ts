/**
 * Turns a backend/postgrest error into a message that is safe and useful for a
 * business user, while keeping the technical detail in the console for debugging.
 */
export function friendlyError(error: unknown, action = "complete that action"): string {
  const raw = error as { code?: string; message?: string } | null;
  const code = raw?.code ?? "";
  const message = raw?.message ?? "";

  if (typeof console !== "undefined") console.error("[AssetSphere]", error);

  switch (code) {
    case "23505":
      return "A record with those details already exists.";
    case "23514":
      return "Some values are not valid. Please review the highlighted fields.";
    case "23503":
      return "This record is linked to other data. Remove or update the linked records first.";
    case "23502":
      return "A required field is missing. Please fill in every field marked with *.";
    case "42501":
      return "You do not have permission to do that in this organization.";
    case "PGRST301":
    case "401":
      return "Your session expired. Please sign in again.";
    default:
      break;
  }

  if (/duplicate key/i.test(message)) return "A record with those details already exists.";
  if (/row-level security|permission denied/i.test(message))
    return "You do not have permission to do that in this organization.";
  if (/failed to fetch|networkerror|network/i.test(message))
    return "Connection problem. Check your internet connection and try again.";

  return `Unable to ${action}. Please try again.`;
}
