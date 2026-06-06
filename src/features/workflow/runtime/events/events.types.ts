export type ProcessEventType =
  | "process.started"
  | "process.completed"
  | "step.started"
  | "step.completed";

export interface LogEventInput {
  workspaceId: string;
  instanceId?: string;
  eventType: ProcessEventType;
  entityType: string;
  entityId?: string;
  actorType?: string;
  actorId?: string;
  source?: string;
  correlationId?: string;
  causationId?: string;
  payload?: Record<string, unknown>;
}

export interface EventRecord {
  id: string;
  workspaceId: string;
  instanceId: string | null;
  eventType: string;
  entityType: string;
  entityId: string | null;
  actorType: string | null;
  actorId: string | null;
  source: string | null;
  correlationId: string | null;
  causationId: string | null;
  payload: Record<string, unknown>;
  createdAt: Date;
}
