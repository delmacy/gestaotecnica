import type { WorkspaceContext } from "@/platform/workspace";

export type ModuleStatus = "active" | "coming_soon" | "blocked";

export interface NavigationModule {
  href: string;
  label: string;
  iconName: string;
  status: ModuleStatus;
  moduleKey?: string;
}

const GROUP_A_ROUTES: Array<Omit<NavigationModule, "status">> = [
  { href: "/builder/commercial-map", label: "Commercial Map", iconName: "Map", moduleKey: "workspace" },
  { href: "/builder", label: "Dashboard / Home", iconName: "Home" },
  { href: "/builder/tasker", label: "Tasker", iconName: "ListTodo", moduleKey: "work-items" },
  { href: "/builder/capabilities", label: "Capabilities", iconName: "Bot", moduleKey: "registry" },
  { href: "/builder/form-builder", label: "Form Builder", iconName: "FormInput", moduleKey: "form-builder" },
  { href: "/builder/registry", label: "Registry", iconName: "Library", moduleKey: "registry" },
  { href: "/builder/process-mirroring", label: "Process Mirroring", iconName: "Search", moduleKey: "process-mirroring" },
  { href: "/builder/docs", label: "Docs", iconName: "FileText", moduleKey: "documents" },
  { href: "/builder/ui-contracts", label: "UI Contracts", iconName: "FileCode2" },
  { href: "/builder/settings", label: "Settings / Workspace", iconName: "Settings", moduleKey: "workspace" },
];

const FUTURE_ROUTES: Array<Omit<NavigationModule, "status"> & { fallbackStatus: ModuleStatus }> = [
  { href: "/builder/workflow-builder", label: "Workflow Builder", iconName: "Workflow", fallbackStatus: "coming_soon" },
  { href: "/builder/view-builder", label: "View Builder", iconName: "MonitorPlay", fallbackStatus: "coming_soon" },
  { href: "/builder/runtime", label: "Runtime", iconName: "Zap", fallbackStatus: "blocked" },
  { href: "/builder/integrations", label: "Integrations", iconName: "Plug", fallbackStatus: "coming_soon" },
  { href: "/builder/governance", label: "Governance", iconName: "ShieldAlert", fallbackStatus: "coming_soon" },
];

export function resolveNavigationInventory(context: WorkspaceContext): {
  activeModules: NavigationModule[];
  futureModules: NavigationModule[];
  environmentMode: "real" | "synthetic" | "demo";
} {
  const activeModules: NavigationModule[] = GROUP_A_ROUTES.map((route) => {
    // If the route doesn't require a specific moduleKey, or the moduleKey is enabled, it's active.
    // Dashboard and UI Contracts are always active as per contract.
    const isEnabled = !route.moduleKey || context.enabledModules.includes(route.moduleKey);
    return {
      ...route,
      status: (isEnabled ? "active" : "blocked") as ModuleStatus,
    };
  }).filter((route) => route.status === "active");

  const futureModules: NavigationModule[] = FUTURE_ROUTES.map((route) => ({
    href: route.href,
    label: route.label,
    iconName: route.iconName,
    status: route.fallbackStatus,
  }));

  return {
    activeModules,
    futureModules,
    environmentMode: context.environmentMode,
  };
}