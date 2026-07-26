import { WorkspaceContext } from "@/platform/workspace";
import { OriginContext } from "./origin-context-contract";

type ResolveOriginContextArgs = {
  workspaceContext: WorkspaceContext;
  currentPath: string;
  originPath: string | null;
  moduleKey?: string;
};

export function resolveOriginContext(
  args: ResolveOriginContextArgs
): OriginContext {
  const { workspaceContext, currentPath, originPath, moduleKey } = args;

  // Validate scope - e.g. cross boundary from builder (workspace) to admin (platform)
  const isWorkspace = currentPath.startsWith("/builder");
  let isValidScope = true;

  if (originPath) {
    const originIsWorkspace = originPath.startsWith("/builder");
    const originIsAdmin = originPath.startsWith("/admin");
    const currentIsAdmin = currentPath.startsWith("/admin");

    // Prevent cross-scope return paths to avoid authorization bypass
    if (originIsWorkspace && currentIsAdmin) {
      isValidScope = false;
    } else if (originIsAdmin && isWorkspace) {
      isValidScope = false;
    }
  }

  // Define states
  const isDemo = workspaceContext.environmentMode === "demo";
  const isSynthetic = workspaceContext.environmentMode === "synthetic";

  // Assume true by default for contract. If a real auth/license check was passed, it would set this.
  const isBlocked = false;

  // Compute safe return path and contextual label
  let returnPath = originPath;
  let returnLabel = "Return";

  if (!isValidScope || isBlocked) {
    // If scope is invalid or user is blocked, force return to a safe fallback
    returnPath = isWorkspace ? "/builder/dashboard" : "/";
    returnLabel = "Return to Dashboard";
  } else if (originPath) {
    if (originPath.includes("/builder/operations")) {
      returnLabel = "Return to Operations";
    } else if (originPath.includes("/builder/intake")) {
      returnLabel = "Back to Intake";
    } else if (originPath.includes("/builder/analysis")) {
      returnLabel = "Resume Analysis";
    }
  } else {
    // Deep links with no origin. Default to root context if in builder.
    returnPath = isWorkspace ? "/builder" : "/";
    returnLabel = "Return Home";
  }

  return {
    originPath,
    returnPath,
    returnLabel,
    isDemo,
    isSynthetic,
    isBlocked,
    isValidScope,
  };
}
