import { PageHeader } from "./PageHeader";
import { Icon } from "./icon";

export function ComingSoon({
  title,
  description,
  icon = "Construction",
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="glass-card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name={icon} className="size-6" />
        </span>
        <p className="text-base font-medium">This module is next in line</p>
        <p className="max-w-md text-sm text-muted-foreground">
          The data model, permissions and navigation for {title.toLowerCase()} are already in place.
          The full screen will be built out in the next migration step.
        </p>
      </div>
    </div>
  );
}
