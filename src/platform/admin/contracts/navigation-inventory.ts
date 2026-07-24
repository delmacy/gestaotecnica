export type ModuleStatus = "active" | "coming_soon" | "blocked";

export interface NavigationModule {
  href: string;
  label: string;
  iconName: string;
  status: ModuleStatus;
  moduleKey?: string;
}

const ADMIN_ROUTES: Array<Omit<NavigationModule, "status">> = [
  { href: "/admin", label: "Admin Dashboard", iconName: "LayoutDashboard" },
  { href: "/admin/organizations", label: "Organizations", iconName: "Building" },
  { href: "/admin/workspaces", label: "Workspaces", iconName: "Briefcase" },
  { href: "/admin/users", label: "Users", iconName: "Users" },
  { href: "/admin/permissions", label: "Roles & Permissions", iconName: "Shield" },
];

export function resolveAdminNavigationInventory(): {
  activeModules: NavigationModule[];
} {
  const activeModules: NavigationModule[] = ADMIN_ROUTES.map((route) => ({
    ...route,
    status: "active" as ModuleStatus,
  }));

  return {
    activeModules,
  };
}
