import { supabase } from "@/integrations/supabase/client";

export const ASSET_BUCKET = "asset-files";

/** Uploads a file to the private asset bucket and returns its storage path. */
export async function uploadFile(file: File, folder = "misc"): Promise<string> {
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
  const { error } = await supabase.storage.from(ASSET_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

/** Signed, temporary URL for a stored path (bucket is private). */
export async function signedUrl(path: string, expiresIn = 3600): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from(ASSET_BUCKET).createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}

export async function signedUrls(paths: string[]): Promise<Array<{ path: string; url: string | null }>> {
  return Promise.all(paths.map(async (p) => ({ path: p, url: await signedUrl(p) })));
}
