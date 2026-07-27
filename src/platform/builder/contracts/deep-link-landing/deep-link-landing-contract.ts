import { WorkspaceContext } from "@/platform/workspace";

export type DeepLinkStatus = "authorized" | "unauthenticated" | "unauthorized" | "not_found";

export interface DeepLinkResolution {
  status: DeepLinkStatus;
  targetUrl: string;
  contextHydrated: boolean;
  workspaceId?: string;
}
