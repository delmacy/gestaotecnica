import { WorkspaceContext } from "@/platform/workspace/workspace-context";
import { OriginContext } from "../origin-context/origin-context-contract";
import { JourneyAction, JourneyResolution, JourneyState } from "./journey-logic-contract";

type ResolveJourneyLogicArgs = {
  action: JourneyAction;
  journeyId: string;
  currentStepId?: string;
  nextStepId?: string;
  moduleKey: string;
  isJourneyEmpty?: boolean;
  workspaceContext: WorkspaceContext;
  originContext: OriginContext;
};

export function resolveJourneyLogic(args: ResolveJourneyLogicArgs): JourneyResolution {
  const { action, journeyId, currentStepId, nextStepId, moduleKey, isJourneyEmpty, workspaceContext, originContext } = args;

  // Apply State Handling Rules
  if (originContext.isBlocked) {
    return {
      destination: originContext.returnPath || "/builder/dashboard",
      label: "Access Restricted",
      status: "blocked",
      commitState: false,
      clearState: true,
      message: "Access Restricted: You do not have permission to view or continue this workflow."
    };
  }

  const isDemo = workspaceContext.environmentMode === "demo";
  const isSynthetic = workspaceContext.environmentMode === "synthetic";

  let status: JourneyState = "real";
  if (isDemo) status = "demo";
  if (isSynthetic) status = "synthetic";

  if (isJourneyEmpty && action === "START") {
     status = "empty";
     return {
        destination: `/builder/${moduleKey}/journey/${journeyId}/step/1`,
        label: "Start setup",
        status,
        commitState: false,
        clearState: false,
        message: "Welcome! Let's get started with your setup. Please provide the required information to begin."
     };
  }

  const listUrl = `/builder/${moduleKey}`;
  const safeOrigin = originContext.returnPath || listUrl;

  let label = "Continuing your setup";
  let destination = "";
  let commitState = false;
  let clearState = false;
  let message = "";

  switch (action) {
    case "START":
      destination = `/builder/${moduleKey}/journey/${journeyId}/step/1`;
      label = "Starting setup";
      break;

    case "NEXT_STEP":
      destination = `/builder/${moduleKey}/journey/${journeyId}/step/${nextStepId || (parseInt(currentStepId || "1") + 1)}`;
      label = "Continuing your setup";
      commitState = true;
      break;

    case "PREVIOUS_STEP":
      destination = `/builder/${moduleKey}/journey/${journeyId}/step/${nextStepId || (parseInt(currentStepId || "2") - 1)}`;
      label = "Back to Previous Step";
      break;

    case "SAVE_DRAFT":
      destination = safeOrigin;
      label = "Saving progress";
      commitState = true;
      message = "Draft saved successfully. You can return to finish later.";
      if (isDemo) {
          message = "Demo mode: Draft saved locally.";
      }
      break;

    case "COMPLETE":
      destination = `/builder/${moduleKey}/detail/${journeyId}`;
      label = "Setup completed";
      commitState = true;
      clearState = true; // Clear draft state since it's now completed
      message = "Setup completed successfully!";
      if (isDemo) {
          message = "Demo mode: Setup complete simulation.";
      }
      break;

    case "DISCARD":
      destination = safeOrigin;
      label = "Cancel Setup";
      clearState = true;
      break;
  }

  return {
    destination,
    label,
    status,
    commitState,
    clearState,
    message: message || undefined
  };
}
