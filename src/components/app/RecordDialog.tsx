import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { humanize, type Field, type Row } from "@/lib/resource";
import { useLookup } from "@/lib/crud";
import { FileField } from "./FileField";

function RefField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: string | null, label: string | null) => void;
}) {
  const labelColumn = field.ref?.labelColumn ?? "name";
  const { data = [] } = useLookup(field.ref!.table, labelColumn);
  return (
    <Select
      value={value ? String(value) : ""}
      onValueChange={(v) => {
        const hit = data.find((d) => d["id"] === v);
        onChange(v || null, hit ? (hit[labelColumn] ?? null) : null);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {data.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">Nothing to pick yet</div>
        ) : (
          data.map((d) => (
            <SelectItem key={d["id"]} value={d["id"]!}>
              {d[labelColumn] || "Untitled"}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export function RecordDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initial,
  saving,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string | undefined;
  fields: Field[];
  initial?: Row | null | undefined;
  saving?: boolean | undefined;
  onSubmit: (values: Row) => void;
}) {
  const [values, setValues] = useState<Row>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const next: Row = {};
    for (const f of fields) {
      if (f.type === "files") {
        const v = initial?.[f.name];
        next[f.name] = Array.isArray(v) ? (v as string[]) : v ? [String(v)] : [];
      } else {
        next[f.name] = initial?.[f.name] ?? (f.type === "switch" ? false : "");
      }
    }
    setValues(next);
    setErrors({});
  }, [open, initial, fields]);

  const groups = useMemo(() => {
    const map = new Map<string, Field[]>();
    for (const f of fields) {
      const g = f.group ?? "Details";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(f);
    }
    return [...map.entries()];
  }, [fields]);

  const set = (name: string, v: unknown) => {
    setValues((p) => ({ ...p, [name]: v }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    const nextErrors: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.name];
      const empty =
        v === "" || v === null || v === undefined || (Array.isArray(v) && v.length === 0);
      if (f.required && f.type !== "switch" && empty) {
        nextErrors[f.name] = `${f.label} is required`;
        continue;
      }
      if (!empty && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) {
        nextErrors[f.name] = "Enter a valid email address";
      }
      if (!empty && (f.type === "number" || f.type === "currency") && Number.isNaN(Number(v))) {
        nextErrors[f.name] = "Enter a number";
      }
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload: Row = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === "switch") payload[f.name] = Boolean(v);
      else if (f.type === "files") {
        const list = Array.isArray(v) ? (v as string[]) : [];
        // Columns named *_url hold a single path; *_urls hold an array.
        payload[f.name] = f.name.endsWith("_urls") ? list : (list[0] ?? null);
      }
      else if (f.type === "number" || f.type === "currency")
        payload[f.name] = v === "" || v === null || v === undefined ? null : Number(v);
      else payload[f.name] = v === "" ? null : v;
    }
    onSubmit(payload);
  }

  const renderField = (f: Field) => (
    <div
      key={f.name}
      className={f.type === "textarea" || f.type === "files" ? "sm:col-span-2 space-y-2" : "space-y-2"}
    >
      <Label htmlFor={f.name}>
        {f.label}
        {f.required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>

      {f.ref ? (
        <RefField
          field={f}
          value={values[f.name]}
          onChange={(id, label) =>
            setValues((p) => ({
              ...p,
              [f.name]: id,
              ...(f.ref?.mirrorTo ? { [f.ref.mirrorTo]: label } : {}),
            }))
          }
        />
      ) : f.type === "select" ? (
        <Select value={values[f.name] ? String(values[f.name]) : ""} onValueChange={(v) => set(f.name, v)}>
          <SelectTrigger id={f.name}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {(f.options ?? []).map((o) => (
              <SelectItem key={o} value={o}>
                {humanize(o)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : f.type === "textarea" ? (
        <Textarea
          id={f.name}
          rows={3}
          value={String(values[f.name] ?? "")}
          onChange={(e) => set(f.name, e.target.value)}
        />
      ) : f.type === "files" ? (
        <FileField
          value={Array.isArray(values[f.name]) ? (values[f.name] as string[]) : []}
          onChange={(next) => set(f.name, next)}
          folder={f.folder ?? "uploads"}
          {...(f.accept ? { accept: f.accept } : {})}
        />
      ) : f.type === "switch" ? (
        <div className="flex h-9 items-center">
          <Switch
            id={f.name}
            checked={Boolean(values[f.name])}
            onCheckedChange={(v) => set(f.name, v)}
          />
        </div>
      ) : (
          <Input
          id={f.name}
            aria-invalid={errors[f.name] ? true : undefined}
          type={
            f.type === "number" || f.type === "currency"
              ? "number"
              : f.type === "date"
                ? "date"
                : f.type === "datetime"
                  ? "datetime-local"
                  : f.type === "email"
                    ? "email"
                    : "text"
          }
          step={f.type === "currency" ? "0.01" : undefined}
          value={String(values[f.name] ?? "")}
          onChange={(e) => set(f.name, e.target.value)}
        />
      )}
      {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
      {errors[f.name] && <p className="text-xs font-medium text-destructive">{errors[f.name]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          {groups.length > 1 ? (
            <Tabs defaultValue={groups[0]![0]}>
              <TabsList className="flex w-full flex-wrap">
                {groups.map(([g]) => (
                  <TabsTrigger key={g} value={g}>
                    {g}
                  </TabsTrigger>
                ))}
              </TabsList>
              {groups.map(([g, gf]) => (
                <TabsContent key={g} value={g} className="mt-4 grid gap-4 sm:grid-cols-2">
                  {gf.map(renderField)}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">{fields.map(renderField)}</div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}