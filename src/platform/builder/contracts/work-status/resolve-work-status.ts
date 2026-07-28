import { WorkspaceContext } from "@/platform/workspace/workspace-context";
import { OriginContext } from "../origin-context/origin-context-contract";
import { WorkStatusResolution, WorkState } from "./work-status-contract";

type ResolveWorkStatusArgs = {
  workId?: string;
  moduleKey: string;
  workspaceContext: WorkspaceContext;
  originContext: OriginContext;
  isWorkEmpty?: boolean;
};

export function resolveWorkStatus(args: ResolveWorkStatusArgs): WorkStatusResolution {
  const { workId, moduleKey, workspaceContext, originContext, isWorkEmpty } = args;

  // Apply State Handling Rules
  if (originContext.isBlocked) {
    return {
      destination: originContext.returnPath || "/builder/dashboard",
      status: "blocked",
      message: "Access Restricted: You do not have permission to create or view this work."
    };
  }

  const isDemo = workspaceContext.environmentMode === "demo";
  const isSynthetic = workspaceContext.environmentMode === "synthetic";

  let status: WorkState = "real";
  if (isDemo) status = "demo";
  if (isSynthetic) status = "synthetic";

  if (isWorkEmpty || !workId) {
     status = "empty";
     return {
        destination: originContext.returnPath || `/builder/${moduleKey}`,
        status,
        message: "No data was created. Please try again."
     };
  }

  let message = "Work created successfully.";
  if (isDemo) {
      message = "Demo mode: Work created locally.";
  }

  return {
    destination: `/${moduleKey}/${workId}`,
    status,
    message
  };
}
