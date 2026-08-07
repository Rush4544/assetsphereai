import type { AppRole } from "./auth";

export type NavItem = {
  key: string;
  label: string;
  url: string;
  icon: string;
  roles: AppRole[];
};

export const mainNav: NavItem[] = [
  { key: "dashboard", label: "Dashboard", url: "/dashboard", icon: "LayoutDashboard", roles: ["user", "technician", "admin", "super_admin"] },
  { key: "assets", label: "Assets", url: "/assets", icon: "Boxes", roles: ["user", "technician", "admin", "super_admin"] },
  { key: "network", label: "Network Discovery", url: "/network", icon: "Network", roles: ["technician", "admin", "super_admin"] },
  { key: "floor-plan", label: "Floor Plan", url: "/floor-plan", icon: "Map", roles: ["technician", "admin", "super_admin"] },
  { key: "vehicles", label: "Vehicles", url: "/vehicles", icon: "Truck", roles: ["technician", "admin", "super_admin"] },
  { key: "vehicle-service", label: "Vehicle Service", url: "/vehicle-service", icon: "Wrench", roles: ["technician", "admin", "super_admin"] },
  { key: "geofences", label: "Geofences", url: "/geofences", icon: "MapPinned", roles: ["technician", "admin", "super_admin"] },
  { key: "maintenance", label: "Maintenance", url: "/maintenance", icon: "Wrench", roles: ["technician", "admin", "super_admin"] },
  { key: "maintenance-calendar", label: "Maintenance Calendar", url: "/maintenance-calendar", icon: "CalendarDays", roles: ["technician", "admin", "super_admin"] },
  { key: "distribution", label: "Distribution", url: "/distribution", icon: "PackageCheck", roles: ["technician", "admin", "super_admin"] },
  { key: "software", label: "Software", url: "/software", icon: "AppWindow", roles: ["technician", "admin", "super_admin"] },
  { key: "assignments", label: "Assignments", url: "/assignments", icon: "UserCheck", roles: ["technician", "admin", "super_admin"] },
  { key: "warranties", label: "Warranties", url: "/warranties", icon: "ShieldCheck", roles: ["technician", "admin", "super_admin"] },
  { key: "reports", label: "Reports", url: "/reports", icon: "BarChart3", roles: ["admin", "super_admin"] },
];

export const rfidNav: NavItem[] = [
  { key: "rfid-dashboard", label: "RFID Dashboard", url: "/rfid/dashboard", icon: "Radio", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-assets", label: "Tagged Assets", url: "/rfid/assets", icon: "Tags", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-readers", label: "Readers", url: "/rfid/readers", icon: "ScanLine", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-zones", label: "Zones", url: "/rfid/zones", icon: "LayoutGrid", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-gateways", label: "Gateways", url: "/rfid/gateways", icon: "Router", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-live", label: "Live Tracking", url: "/rfid/live", icon: "Activity", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-movement", label: "Movement History", url: "/rfid/movement", icon: "History", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-alerts", label: "Alerts", url: "/rfid/alerts", icon: "BellRing", roles: ["technician", "admin", "super_admin"] },
  { key: "rfid-reports", label: "RFID Reports", url: "/rfid/reports", icon: "FileBarChart", roles: ["admin", "super_admin"] },
  { key: "rfid-settings", label: "RFID Settings", url: "/rfid/settings", icon: "Settings2", roles: ["admin", "super_admin"] },
  { key: "rfid-onboarding", label: "Onboarding", url: "/rfid/onboarding", icon: "Rocket", roles: ["admin", "super_admin"] },
];

export const toolsNav: NavItem[] = [
  { key: "ai-assistant", label: "AI Assistant", url: "/ai-assistant", icon: "Sparkles", roles: ["user", "technician", "admin", "super_admin"] },
  { key: "people-search", label: "People Search", url: "/people-search", icon: "Search", roles: ["user", "technician", "admin", "super_admin"] },
  { key: "technician-portal", label: "Technician Portal", url: "/technician-portal", icon: "HardHat", roles: ["technician", "admin", "super_admin"] },
  { key: "api-docs", label: "API Docs", url: "/api-docs", icon: "Code2", roles: ["admin", "super_admin"] },
];

export const adminNav: NavItem[] = [
  { key: "departments", label: "Departments", url: "/departments", icon: "Building2", roles: ["admin", "super_admin"] },
  { key: "buildings", label: "Buildings", url: "/buildings", icon: "Building", roles: ["admin", "super_admin"] },
  { key: "rooms", label: "Rooms", url: "/rooms", icon: "DoorOpen", roles: ["admin", "super_admin"] },
  { key: "asset-categories", label: "Asset Categories", url: "/asset-categories", icon: "FolderTree", roles: ["admin", "super_admin"] },
  { key: "vendors", label: "Vendors", url: "/vendors", icon: "Handshake", roles: ["admin", "super_admin"] },
  { key: "users-management", label: "Users", url: "/users-management", icon: "Users", roles: ["admin", "super_admin"] },
  { key: "audit-log", label: "Audit Log", url: "/audit-log", icon: "ScrollText", roles: ["admin", "super_admin"] },
  { key: "settings", label: "Settings", url: "/settings", icon: "Settings", roles: ["admin", "super_admin"] },
];

export const superAdminNav: NavItem[] = [
  { key: "organizations", label: "Organizations", url: "/organizations", icon: "Landmark", roles: ["super_admin"] },
  { key: "invoices", label: "Invoices", url: "/invoices", icon: "Receipt", roles: ["super_admin"] },
  { key: "super-admin", label: "Super Admin Portal", url: "/super-admin", icon: "Crown", roles: ["super_admin"] },
];

export const allNavItems = [...mainNav, ...rfidNav, ...toolsNav, ...adminNav, ...superAdminNav];

/** Default page permissions per role, mirroring the original AppSidebar defaults. */
export function defaultPermissions(role: AppRole): Record<string, boolean> {
  return Object.fromEntries(allNavItems.map((i) => [i.key, i.roles.includes(role)]));
}

export function canSee(item: NavItem, role: AppRole, permissions?: Record<string, boolean>) {
  if (role === "super_admin") return true;
  const override = permissions?.[item.key];
  if (typeof override === "boolean") return override && item.roles.includes(role);
  return item.roles.includes(role);
}
