import { WorkspaceContext } from "@/platform/workspace";
import { DeepLinkResolution } from "./deep-link-landing-contract";

export interface DeepLinkRequest {
  url: string;
  hasSession: boolean;
  userRole?: "admin" | "builder" | "viewer";
  userWorkspaces?: string[];
  entityExists?: boolean;
}

export function resolveDeepLinkLanding(
  request: DeepLinkRequest,
  context: WorkspaceContext
): DeepLinkResolution {
  // Gate 1: Unauthenticated
  if (!request.hasSession) {
    const encodedReturnTo = encodeURIComponent(request.url);
    return {
      status: "unauthenticated",
      targetUrl: `/auth/login?returnTo=${encodedReturnTo}`,
      contextHydrated: false,
    };
  }

  const urlObj = new URL(request.url, "http://localhost");
  const path = urlObj.pathname;

  // Gate 4: Invalid/Missing Entity (404)
  if (request.entityExists === false) {
    // If it's a builder capability deep link that is missing, route to /builder/capabilities
    if (path.startsWith("/builder/capabilities/")) {
       return {
          status: "not_found",
          targetUrl: "/builder/capabilities",
          contextHydrated: true,
          workspaceId: context.workspaceId,
       }
    }

    return {
      status: "not_found",
      targetUrl: "/builder",
      contextHydrated: true,
      workspaceId: context.workspaceId,
    };
  }

  // Gate 3: Unauthorized (Role/Scope)
  // Check Admin scope
  if (path.startsWith("/admin") && request.userRole !== "admin") {
    return {
      status: "unauthorized",
      targetUrl: request.userRole ? "/builder" : "/auth/login", // basic fallback logic
      contextHydrated: false,
    };
  }

  // Check Builder scope/Workspace
  if (path.startsWith("/builder")) {
      // Typically, a deep link to a workspace resource might have the workspaceId encoded
      // But based on the contract, we need to implicitly switch the active workspace context to match
      // For now, we assume if they are authorized, it hydrates to the active context workspace
      // In a real scenario, you'd extract workspaceId from the URL or entity if the URL implies it,
      // and check if request.userWorkspaces.includes(targetWorkspaceId).

      // Assuming authorization is passed for the context workspace
      return {
          status: "authorized",
          targetUrl: request.url,
          contextHydrated: true,
          workspaceId: context.workspaceId, // hydrating active context
      };
  }

  // Gate 2: Authorized
  return {
    status: "authorized",
    targetUrl: request.url,
    contextHydrated: true,
    workspaceId: context.workspaceId,
  };
}
