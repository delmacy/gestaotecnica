import type { AccessProfile } from "@/modules/auth/access-profiles";

export type NavigationLevel = "platform" | "organization" | "workspace-builder" | "operation";

export type NavigationSelection = {
  organizationId?: string;
  workspaceId?: string;
};

export function resolveNavigationLevel(
  profile: AccessProfile,
  selection: NavigationSelection,
): NavigationLevel {
  if (profile === "operador") return "operation";
  if (profile === "admin") return selection.workspaceId ? "operation" : "organization";
  if (selection.workspaceId && selection.organizationId) return "workspace-builder";
  if (selection.organizationId) return "organization";
  return "platform";
}

export function getVisibleNavigationModes(level: NavigationLevel) {
  switch (level) {
    case "platform": return ["platform"] as const;
    case "organization": return ["organization"] as const;
    case "workspace-builder": return ["workspaceBuilder", "workspace", "workspaceGovernance"] as const;
    case "operation": return ["workspace"] as const;
  }
}
