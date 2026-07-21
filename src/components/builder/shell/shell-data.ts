import {
  Home,
  ListTodo,
  Bot,
  Library,
  Search,
  FileText,
  FileCode2,
  Settings,
  Workflow,
  FormInput,
  MonitorPlay,
  Zap,
  Plug,
  Network,
  ShieldAlert,
  GraduationCap
} from "lucide-react";

export const MOCK_USER = {
  name: "Builder Architect",
  role: "Platform Admin"
};

export const MOCK_WORKSPACES = [
  { id: "ws-1", name: "Alpha Tenant" },
  { id: "ws-2", name: "Beta Client" },
  { id: "ws-3", name: "Demo Workspace" }
];

export const CURRENT_WORKSPACE = MOCK_WORKSPACES[2];

import type { WorkspaceContext } from "@/platform/workspace";
import type { BuilderModule } from "./shell-utils";

export const ACTIVE_MODULES = [
  { href: "/builder", label: "Dashboard / Home", icon: Home, status: "active" },
  { href: "/builder/tasker", label: "Tasker", icon: ListTodo, status: "active" },
  { href: "/builder/capabilities", label: "Capabilities", icon: Bot, status: "active" },
  { href: "/builder/form-builder", label: "Form Builder", icon: FormInput, status: "active" },
  { href: "/builder/registry", label: "Registry", icon: Library, status: "active" },
  { href: "/builder/process-mirroring", label: "Process Mirroring", icon: Search, status: "active" },
  { href: "/builder/docs", label: "Docs", icon: FileText, status: "active" },
  { href: "/builder/ui-contracts", label: "UI Contracts", icon: FileCode2, status: "active" },
  { href: "/builder/settings", label: "Settings / Workspace", icon: Settings, status: "active" },
];

const persistedSurfaceMap: Record<string, BuilderModule> = {
  "governance-matrix": { href: "/builder/governance-matrix", label: "Governance Matrix", icon: ShieldAlert, status: "active" },
  "operator-guide": { href: "/builder/operator-guide", label: "Operator Guide", icon: GraduationCap, status: "active" },
  "enterprise-map": { href: "/builder/enterprise-map", label: "Enterprise Map", icon: Network, status: "active" },
};

export function buildActiveModules(enabledModuleKeys?: string[]): BuilderModule[] {
  const baseModules = [...ACTIVE_MODULES];

  if (!enabledModuleKeys) {
    return baseModules;
  }

  const persistedModules = enabledModuleKeys
    .map(key => persistedSurfaceMap[key])
    .filter(Boolean);

  return [...baseModules, ...persistedModules];
}

export const FUTURE_MODULES = [
  { href: "#", label: "Workflow Builder", icon: Workflow, status: "coming_soon" },
  { href: "#", label: "View Builder", icon: MonitorPlay, status: "coming_soon" },
  { href: "#", label: "Runtime", icon: Zap, status: "blocked" },
  { href: "#", label: "Integrations", icon: Plug, status: "coming_soon" },
  { href: "#", label: "Governance", icon: ShieldAlert, status: "coming_soon" },
];
