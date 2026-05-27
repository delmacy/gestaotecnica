export type IntegrationCommandRequest = {
  workspaceKey?: string;
  command: string;
  idempotencyKey?: string;
  payload?: unknown;
};

export type IntegrationCommandResponse = {
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  correlationId: string;
};
