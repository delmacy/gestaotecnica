import type { WorkspaceContext } from "@/platform/workspace";
import type { OriginContext } from "../origin-context/origin-context-contract";
import type { NextStepOutcome, NextStepResolution } from "./next-step-contract";

type ResolveNextStepArgs = {
  outcome: NextStepOutcome;
  moduleKey: string;
  entityId?: string;
  jobId?: string;
  workspaceContext: WorkspaceContext;
  originContext: OriginContext;
  hasDestinationAccess?: boolean;
};

export function resolveNextStep(args: ResolveNextStepArgs): NextStepResolution {
  const { outcome, moduleKey, entityId, jobId, workspaceContext, originContext, hasDestinationAccess = true } = args;

  const isDemo = workspaceContext.environmentMode === "demo";
  const listUrl = `/builder/${moduleKey}`;
  const detailUrl = entityId ? `/builder/${moduleKey}/detail/${entityId}` : listUrl;
  const safeOrigin = originContext.returnPath || listUrl;

  // Handle blocked destination access (e.g., user can create but not view details)
  if (!hasDestinationAccess) {
    return {
      destination: safeOrigin,
      label: "Action Successful",
      status: "blocked",
      message: "Submission successful. Pending administrator review."
    };
  }

  switch (outcome) {
    case "CREATE_ENTITY_SUCCESS":
      if (isDemo) {
        return {
          destination: listUrl,
          label: "Simulation Complete",
          status: "demo_simulation",
          message: "Entity created in Demo Mode."
        };
      }
      return {
        destination: detailUrl,
        label: "View New Entry",
        status: "normal"
      };

    case "PROCESS_ANALYSIS_SUCCESS":
      if (isDemo) {
        return {
          destination: `/builder/${moduleKey}/results/demo-job`,
          label: "Simulation Complete",
          status: "demo_simulation",
          message: "Analysis generated in Demo Mode."
        };
      }
      return {
        destination: jobId ? `/builder/${moduleKey}/results/${jobId}` : listUrl,
        label: "Analysis Ready - View Results",
        status: "normal"
      };

    case "UPDATE_ENTITY_SUCCESS":
      if (isDemo) {
        return {
          destination: detailUrl, // Remain on detail view for updates even in demo
          label: "Simulation Complete",
          status: "demo_simulation",
          message: "Entity updated in Demo Mode."
        };
      }
      return {
        destination: detailUrl,
        label: "Update Successful",
        status: "normal"
      };

    case "DELETE_ENTITY_SUCCESS":
      if (isDemo) {
        return {
          destination: safeOrigin, // Return to origin instead of list if origin is available
          label: "Simulation Complete",
          status: "demo_simulation",
          message: "Deletion restricted in Demo Mode."
        };
      }
      return {
        destination: listUrl,
        label: "Deletion Successful",
        status: "normal"
      };

    case "WORKFLOW_COMPLETED":
      return {
        destination: safeOrigin,
        label: "Workflow Completed",
        status: "normal"
      };

    default:
      return {
        destination: listUrl,
        label: "Action Completed",
        status: "normal"
      };
  }
}
