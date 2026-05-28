import type { WorkspaceContext } from "@/platform/workspace";

export type ActionCallableBy = "ui" | "automation" | "integration" | "system";

export type ActionEvent = {
  eventType: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, unknown>;
};

export type ActionResult<TOutput = unknown> = {
  success: boolean;
  data?: TOutput;
  events?: ActionEvent[];
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ActionHandler<TInput = unknown, TOutput = unknown> = (
  input: TInput,
  context: WorkspaceContext,
) => Promise<ActionResult<TOutput>>;

export type ActionSchemaProperty = {
  type: "string" | "number" | "integer" | "boolean" | "object" | "array" | "null";
  description?: string;
  enum?: string[];
  default?: unknown;
  format?: string;
  properties?: Record<string, ActionSchemaProperty>;
  items?: ActionSchemaProperty;
};

export type ActionJsonSchema = {
  type: "object";
  description?: string;
  required?: string[];
  properties: Record<string, ActionSchemaProperty>;
  additionalProperties?: boolean;
};

export type ActionDefinition<TInput = unknown, TOutput = unknown> = {
  key: string;
  moduleKey: string;
  description?: string;
  requiredScopes?: string[];
  requiredModules?: string[];
  callableBy?: ActionCallableBy[];
  inputSchema?: ActionJsonSchema;
  outputSchema?: ActionJsonSchema;
  emits?: string[];
  idempotent?: boolean;
  allowedStatuses?: string[];
  handler: ActionHandler<TInput, TOutput>;
};
