export type ActorType = "user" | "api_key" | "automation" | "system";

export type ExecutionSource = "ui" | "integration" | "automation" | "system";

export type WorkspaceContext = {
  workspaceId: string;
  workspaceKey: string;
  organizationId?: string;
  adaptationKey?: string;
  actor: {
    type: ActorType;
    id?: string;
    name?: string;
  };
  source: ExecutionSource;
  environmentMode: "real" | "synthetic" | "demo";
  enabledModules: string[];
  scopes: string[];
  correlationId: string;
};
