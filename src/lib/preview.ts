/**
 * Owner preview access.
 *
 * In the Lovable editor preview (and local dev) the software owner can browse
 * every page without signing in. On the published site this always returns
 * false, so real visitors must sign in as normal.
 */
export function isOwnerPreview(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host.startsWith("id-preview--") || host.endsWith(".lovableproject.com");
}