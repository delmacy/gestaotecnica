import type { WorkspaceContext } from "@/platform/workspace";
import type { PrimaryActionIntent, PrimaryActionContext } from "./primary-action-contract";

export function resolvePrimaryAction(
  context: WorkspaceContext,
  actionContext: PrimaryActionContext
): PrimaryActionIntent {
  const isDemo = context.environmentMode === "demo";
  const hasModule = context.enabledModules.includes(actionContext.moduleKey);

  let state: "active" | "blocked" | "hidden" = "active";
  let tooltipMessage: string | undefined;

  // Global demo restriction (destructive actions would need specific mapping, assuming block all creation in demo for safe fallback if not defined)
  // But standard says demo state non-destructive works. So we'll refine this.

  if (!hasModule) {
    state = "blocked";
    tooltipMessage = "Module not enabled in current workspace.";
  } else if (isDemo && actionContext.moduleKey !== "registry") {
    // Example: Block things in demo except specific safe zones. Let's make a generic demo block for primary mutation actions
    // To match the contract: "Primary actions that result in destructive mutations... are disabled or intercepted"
    state = "blocked";
    tooltipMessage = "Action restricted in Demo Mode";
  }

  // Hardcode intent based on module to fulfill "commercial/product oriented" language
  let label = "Create";
  let href = "/builder/" + actionContext.moduleKey + "/new";

  switch (actionContext.moduleKey) {
    case "work-items":
      label = "Log New Task";
      href = "/builder/tasker/new";
      break;
    case "registry":
      label = "Define Capability";
      href = "/builder/capabilities/new";
      break;
    case "process-mirroring":
      label = "Start Analysis";
      href = "/builder/process-mirroring/new";
      // Start Analysis is non-destructive, should work in demo
      if (isDemo && state === "blocked") {
        state = "active";
        tooltipMessage = undefined;
      }
      break;
    case "form-builder":
      label = "Create Form";
      href = "/builder/form-builder/new";
      break;
    default:
      label = "Create";
      break;
  }

  // Synthetic mode: same as real data, but context has environmentMode: 'synthetic'
  // No special overriding needed for synthetic vs real for the action's availability.

  return {
    id: `primary-action-${actionContext.moduleKey}`,
    label,
    state,
    tooltipMessage,
    href,
  };
}
