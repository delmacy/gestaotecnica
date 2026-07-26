import { WorkspaceContext } from "@/platform/workspace";
import { OriginContext } from "../origin-context/origin-context-contract";
import { CancelBackAction, CancelBackResolution } from "./cancel-back-contract";

type ResolveCancelBackArgs = {
  action: CancelBackAction;
  isDirty: boolean;
  moduleKey: string;
  workspaceContext: WorkspaceContext;
  originContext: OriginContext;
};

export function resolveCancelBack(args: ResolveCancelBackArgs): CancelBackResolution {
  const { action, isDirty, moduleKey, workspaceContext, originContext } = args;

  // Apply State Handling Rules
  if (originContext.isBlocked) {
    return {
      destination: "/builder/dashboard",
      label: "Return to Dashboard",
      status: "blocked",
      requiresIntervention: false,
      message: "Access denied. Returning to dashboard."
    };
  }

  const isDemo = workspaceContext.environmentMode === "demo";
  const listUrl = `/builder/${moduleKey}`;
  const safeOrigin = originContext.returnPath || listUrl;
  const labelFromOrigin = originContext.returnLabel || "Return";

  let label = labelFromOrigin;
  let destination = safeOrigin;
  let status: CancelBackResolution["status"] = "normal";
  let requiresIntervention = false;
  let message = "";

  switch (action) {
    case "CANCEL":
      label = `Cancel and ${labelFromOrigin}`;
      if (isDirty) {
        requiresIntervention = true;
        message = "Unsaved Changes: Discard or Continue Editing?";
        label = "Discard and Return";
      }
      break;

    case "BACK":
      label = labelFromOrigin;
      if (isDirty) {
         requiresIntervention = true;
         message = "Unsaved Changes: Discard or Continue Editing?";
         label = "Discard and Return";
      }
      break;

    case "DISCARD":
      requiresIntervention = true;
      message = "Unsaved Changes: Discard or Continue Editing?";
      label = "Discard and Return";
      break;
  }

  if (isDemo && requiresIntervention) {
     status = "demo_restricted";
     // Demo mode still shows the intervention but acts purely structurally.
  }

  return {
    destination,
    label,
    status,
    requiresIntervention,
    message: message || undefined
  };
}
