import { Link, useNavigate } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen, Radio } from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { CurrentUser } from "@/lib/auth";
import { adminNav, canSee, mainNav, rfidNav, superAdminNav, toolsNav, type NavItem } from "@/lib/nav";
import { Icon } from "./icon";
import { Button } from "@/components/ui/button";

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <Link
      to={item.url as LinkProps["to"]}
      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground font-medium" }}
      title={item.label}
    >
      <Icon name={item.icon} className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function Section({
  title,
  items,
  collapsed,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-5">
      {!collapsed && (
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          {title}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink key={item.key} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

export function AppSidebar({ user }: { user: CurrentUser }) {
  const [collapsed, setCollapsed] = useState(false);
  const [rfidOpen, setRfidOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const perms = user.profile?.page_permissions ?? {};
  const visible = (items: NavItem[]) => items.filter((i) => canSee(i, user.role, perms));
  const rfidItems = visible(rfidNav);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all",
        collapsed ? "w-[68px]" : "w-64",
      )}
    >
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Radio className="size-4" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">AssetSphere AI</p>
            <p className="truncate text-[11px] text-sidebar-foreground/50">
              {user.profile?.organization_name ?? "Asset Intelligence"}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <Section title="Main" items={visible(mainNav)} collapsed={collapsed} />

        {rfidItems.length > 0 && (
          <div className="mt-5">
            <button
              onClick={() => setRfidOpen((v) => !v)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Radio className="size-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">RFID Tracking</span>
                  <ChevronDown className={cn("size-4 transition-transform", rfidOpen && "rotate-180")} />
                </>
              )}
            </button>
            {rfidOpen && (
              <div className="mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2">
                {rfidItems.map((item) => (
                  <NavLink key={item.key} item={item} collapsed={collapsed} />
                ))}
              </div>
            )}
          </div>
        )}

        <Section title="Tools" items={visible(toolsNav)} collapsed={collapsed} />
        <Section title="Administration" items={visible(adminNav)} collapsed={collapsed} />
        <Section title="Super Admin" items={visible(superAdminNav)} collapsed={collapsed} />
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="mb-3 px-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.profile?.full_name ?? user.email}
            </p>
            <p className="truncate text-[11px] capitalize text-sidebar-foreground/50">
              {user.role.replace("_", " ")}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={signOut}
          >
            <LogOut className="size-4" />
            {!collapsed && <span className="ml-2">Sign out</span>}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>
      </div>
    </aside>
  );
}
