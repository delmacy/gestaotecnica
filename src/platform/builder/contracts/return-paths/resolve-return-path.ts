import { WorkspaceContext } from "@/platform/workspace";
import { OriginContext } from "../origin-context/origin-context-contract";
import { ActionOutcome, ReturnPathResolution } from "./return-paths-contract";

type ResolveReturnPathArgs = {
  outcome: ActionOutcome;
  moduleKey: string;
  entityId?: string;
  workspaceContext: WorkspaceContext;
  originContext: OriginContext;
};

export function resolveReturnPath(args: ResolveReturnPathArgs): ReturnPathResolution {
  const { outcome, moduleKey, entityId, workspaceContext, originContext } = args;

  // Apply State Handling Rules
  if (originContext.isBlocked) {
    return {
      destination: "/builder/dashboard",
      label: "Return to Dashboard",
      status: "blocked",
      message: "Access denied. Returning to dashboard."
    };
  }

  const isDemo = workspaceContext.environmentMode === "demo";

  // Base URLs
  const listUrl = `/builder/${moduleKey}`;
  const detailUrl = entityId ? `/builder/${moduleKey}/detail/${entityId}` : listUrl;
  const safeOrigin = originContext.returnPath || listUrl;

  switch (outcome) {
    case "CREATE_SUCCESS":
      if (isDemo) {
        return {
          destination: safeOrigin,
          label: "Restricted in Demo Mode",
          status: "demo_restricted",
          message: "Creation is restricted in demo mode."
        };
      }
      return {
        destination: detailUrl,
        label: "View New Entry",
        status: "normal"
      };

    case "CREATE_CANCEL":
      return {
        destination: safeOrigin,
        label: originContext.returnLabel || "Cancel Creation",
        status: "normal"
      };

    case "EDIT_SUCCESS":
      if (isDemo) {
        return {
          destination: detailUrl,
          label: "Restricted in Demo Mode",
          status: "demo_restricted",
          message: "Editing is restricted in demo mode."
        };
      }
      return {
        destination: detailUrl,
        label: "View Updated Entry",
        status: "normal"
      };

    case "EDIT_CANCEL":
      return {
        destination: detailUrl,
        label: "Cancel Edit",
        status: "normal"
      };

    case "DELETE_SUCCESS":
      if (isDemo) {
        return {
          destination: detailUrl,
          label: "Restricted in Demo Mode",
          status: "demo_restricted",
          message: "Deletion is restricted in demo mode."
        };
      }
      return {
        destination: listUrl,
        label: "Return to Registry",
        status: "normal"
      };

    case "DETAIL_BACK":
      return {
        destination: safeOrigin,
        label: originContext.returnLabel || "Return",
        status: "normal"
      };

    default:
      return {
        destination: listUrl,
        label: "Return",
        status: "normal"
      };
  }
}
