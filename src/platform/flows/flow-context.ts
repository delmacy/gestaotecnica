import type { ActionResult } from "@/platform/actions";
import type { WorkspaceContext } from "@/platform/workspace";

export type FlowContext = {
  workspace: WorkspaceContext;
  event: {
    id?: string;
    eventType: string;
    entityType: string;
    entityId: string;
    payload?: Record<string, unknown>;
    correlationId: string;
  };
  actions: {
    run: (actionKey: string, input: unknown) => Promise<ActionResult>;
  };
  logger: {
    info: (message: string, meta?: unknown) => void;
    warn: (message: string, meta?: unknown) => void;
    error: (message: string, meta?: unknown) => void;
  };
  skip: (reason: string) => void;
};
