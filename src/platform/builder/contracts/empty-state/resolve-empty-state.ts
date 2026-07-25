import type { WorkspaceContext } from "@/platform/workspace";
import type { EmptyStateContext, ViewStateOutcome, ViewState } from "./empty-state-contract";

export function resolveViewState(
  context: WorkspaceContext,
  stateContext: EmptyStateContext
): ViewStateOutcome {
  const isModuleEnabled = context.enabledModules.includes(stateContext.moduleKey);
  const isDemoOrSynthetic = context.environmentMode === "demo" || context.environmentMode === "synthetic";

  if (!isModuleEnabled) {
    return {
      state: "blocked",
      title: "Module Unavailable",
      description: "This configuration requires additional privileges or is not enabled for your workspace. Contact your administrator to request access.",
      isActionAllowed: false
    };
  }

  if (isDemoOrSynthetic && !stateContext.hasData) {
    return {
      state: context.environmentMode as ViewState,
      title: "Explore " + stateContext.moduleKey.replace("-", " "),
      description: "You are exploring the Demo environment. Changes made here will not affect your production workspace.",
      isActionAllowed: false
    };
  }

  if (!stateContext.hasData) {
    let title = "Get Started";
    let description = "Streamline your operations. Create your first record.";
    let actionLabel = "Create";
    let actionHref = `/builder/${stateContext.moduleKey}/new`;

    if (stateContext.moduleKey === "registry") {
      title = "Define Capabilities";
      description = "Streamline your operations. Define your first business capability.";
      actionLabel = "Create Capability";
      actionHref = "/builder/capabilities/new";
    } else if (stateContext.moduleKey === "work-items") {
      title = "Manage Work Items";
      description = "Track and execute tasks efficiently. Log your first work item.";
      actionLabel = "Log New Task";
      actionHref = "/builder/tasker/new";
    }

    return {
      state: "empty",
      title,
      description,
      primaryActionLabel: actionLabel,
      primaryActionHref: actionHref,
      isActionAllowed: true
    };
  }

  return {
    state: "real",
    title: "",
    description: "",
    isActionAllowed: true
  };
}
