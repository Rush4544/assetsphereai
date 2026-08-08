import { useEffect, useState } from "react";
import { Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signedUrls, uploadFile } from "@/lib/storage";

/**
 * Upload control used for asset photos, receipts, purchase orders and other
 * documents. Values are storage paths in the private asset bucket; previews use
 * short-lived signed URLs.
 */
export function FileField({
  value,
  onChange,
  folder = "misc",
  accept = "image/*,application/pdf",
  label,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  folder?: string;
  accept?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [previews, setPreviews] = useState<Array<{ path: string; url: string | null }>>([]);

  useEffect(() => {
    let cancelled = false;
    if (value.length === 0) {
      setPreviews([]);
      return;
    }
    void signedUrls(value).then((r) => {
      if (!cancelled) setPreviews(r);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const paths: string[] = [];
      for (const file of Array.from(files)) paths.push(await uploadFile(file, folder));
      onChange([...value, ...paths]);
      toast.success(`${paths.length} file${paths.length > 1 ? "s" : ""} uploaded`);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Upload failed — sign in to upload files to your organization.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Paperclip className="size-3.5" />}
          {label ?? "Upload files"}
          <input
            type="file"
            multiple
            accept={accept}
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </label>
        <span className="text-xs text-muted-foreground">{value.length} attached</span>
      </div>

      {previews.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previews.map((p) => {
            const isImage = /\.(png|jpe?g|gif|webp|avif)$/i.test(p.path);
            return (
              <li key={p.path} className="relative overflow-hidden rounded-md border border-border">
                {isImage && p.url ? (
                  <img src={p.url} alt={p.path.split("/").pop() ?? "attachment"} className="h-24 w-full object-cover" loading="lazy" />
                ) : (
                  <a
                    href={p.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-24 items-center justify-center px-2 text-center text-[11px] text-muted-foreground"
                  >
                    {p.path.split("/").pop()}
                  </a>
                )}
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => onChange(value.filter((v) => v !== p.path))}
                  className="absolute right-1 top-1 rounded bg-background/90 p-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Read-only gallery for stored paths. */
export function FileGallery({ paths }: { paths: string[] }) {
  const [previews, setPreviews] = useState<Array<{ path: string; url: string | null }>>([]);
  useEffect(() => {
    if (paths.length === 0) return;
    void signedUrls(paths).then(setPreviews);
  }, [paths]);

  if (paths.length === 0) return <p className="text-sm text-muted-foreground">No files attached.</p>;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {previews.map((p) => {
        const isImage = /\.(png|jpe?g|gif|webp|avif)$/i.test(p.path);
        return (
          <li key={p.path} className="overflow-hidden rounded-lg border border-border">
            <a href={p.url ?? "#"} target="_blank" rel="noreferrer">
              {isImage && p.url ? (
                <img src={p.url} alt={p.path.split("/").pop() ?? "attachment"} className="h-28 w-full object-cover" loading="lazy" />
              ) : (
                <span className="flex h-28 items-center justify-center px-2 text-center text-[11px] text-muted-foreground">
                  {p.path.split("/").pop()}
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}